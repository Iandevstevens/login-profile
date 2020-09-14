const PLAYER_NAME = "Music Lounge"
let player: Spotify.SpotifyPlayer;
let token="";
let expireTime: Date;

const setToken=(thisToken: string)=>{
  token = thisToken;
}

const setExpire=(time: Date)=>{
  expireTime = time
}

const refresh = async (refreshToken: string)=>{
  const query = `mutation spotifyRefresh($refresh_token: String!){
    spotifyRefresh(refresh_token: $refresh_token)
  }`;
  const refreshResults = await fetch(
    `${process.env.REACT_APP_API_URL}/graphql`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query,
        variables: { refresh_token: refreshToken },
      }),
    }
  );
  const refreshJson = await refreshResults.json();
  return refreshJson.data.spotifyRefresh
}

export const initialize= (setLoading: Function, spotifyExe: Date, refreshToken: string) => {
  const hasLoadedScript = document.getElementById("spotifyScript");
  if (!hasLoadedScript) {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    script.id = "spotifyScript";
    document.body.appendChild(script);
  }

  window.onSpotifyWebPlaybackSDKReady = () => {
    if(!player){
      player = new Spotify.Player({
        name: PLAYER_NAME,
        getOAuthToken: async (cb) => {
          if(new Date().getTime()> new Date(spotifyExe).getTime()){
            const newToken = await refresh(refreshToken);
            token = newToken;
            expireTime = new Date(new Date().getTime() + 3550000);
            cb(newToken);
          }else{
            cb(token);
          }
        },
      });
  
      // Error handling
      player.addListener("initialization_error", ({ message }: any) => {
        console.error(message);
      });
      player.addListener("authentication_error", ({ message }: any) => {
        //refresh(spotifyRefreshToken);
        console.error(message);
      });
      player.addListener("account_error", ({ message }: any) => {
        console.error(message);
      });
      player.addListener("playback_error", ({ message }: any) => {
        console.error(message);
      });
  
      // Ready
      player.addListener("ready", ({ device_id }: any) => {
        console.log("Ready with Device ID", device_id);
        setLoading(false);
      });
  
      // Not Ready
      player.addListener("not_ready", ({ device_id }: any) => {
        console.log("Device ID has gone offline", device_id);
      });
  
      // Connect to the player!
      player.connect(); 
    }
  };
};

export const getSongPlaying = (checkSongChange: Function) => {
  player.addListener("player_state_changed", (state: any) => {
    if(state)
      checkSongChange(state.track_window.current_track.name);
  });
};

export const getPlayer = () => {
  return player;
};

export const disconnect=()=>{
  player.disconnect();
}

export const lowerVolume = ()=>{
  player.getVolume().then((volume: number) => {
    if (volume > 0.1) {
      player.setVolume(volume - 0.1).then(() => {});
    }
  });
}

export const increaseVolume = ()=>{
  player.getVolume().then((volume: number) => {
    if (volume < 0.9) {
      player.setVolume(volume + 0.1).then(() => {});
    }
  });
}

export const mute = ()=>{
  player.setVolume(0).then(() => {});
}

// const refresh = async ()=>{
//   const query = `mutation spotifyRefresh($refresh_token: String!){
//     spotifyRefresh(refresh_token: $refresh_token)
//   }`;
//   const refreshResults = await fetch(
//     `${process.env.REACT_APP_API_URL}/graphql`,
//     {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Accept: "application/json",
//       },
//       body: JSON.stringify({
//         query,
//         variables: { refresh_token: spotifyRefreshToken },
//       }),
//     }
//   );
//   const refreshJson = await refreshResults.json();
//   setProfile({
//     type: "REFRESH_SPOTIFY",
//     payload: { spotifyToken: refreshJson.data.spotifyRefresh },
//   });
// }
export default {initialize, getSongPlaying, disconnect, lowerVolume, increaseVolume, mute, setToken }