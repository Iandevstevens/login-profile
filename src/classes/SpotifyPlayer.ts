const PLAYER_NAME = "Music Lounge"

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

export const init = (setLoading: Function, setSong: Function)=>{
   return class Spotifyplayer extends Spotify.Player {
    songPlaying="";
    loading=true;
    token: string;
    expireTime: Date
    constructor(token: string, refreshToken: string, expireTime: Date){
      super({
        name: PLAYER_NAME,
        getOAuthToken: async (cb) => {
          if(new Date().getTime()> new Date(expireTime).getTime()){
            const newToken = await refresh(refreshToken);
            this.token = newToken;
            this.expireTime = new Date(new Date().getTime() + 3550000);
            cb(newToken);
          }else{
            cb(token);
          }
        },
      })
      this.token = token;
      this.expireTime = expireTime;
      this.addListener("initialization_error", ({ message }: any) => {
        console.error(message);
      });
      this.addListener("authentication_error", ({ message }: any) => {
        console.error(message);
      });
      this.addListener("account_error", ({ message }: any) => {
        console.error(message);
      });
      this.addListener("playback_error", ({ message }: any) => {
        console.error(message);
      });
  
      // Ready
      this.addListener("ready", ({ device_id }: any) => {
        console.log("Ready with Device ID", device_id);
        setLoading(false)
      });
  
      // Not Ready
      this.addListener("not_ready", ({ device_id }: any) => {
        console.log("Device ID has gone offline", device_id);
      });

      this.addListener("player_state_changed", (state: any) => {
        if(state){
          if(this.songPlaying !== state.track_window.current_track.name)
            {
              setSong(state.track_window.current_track);
              this.songPlaying = state.track_window.current_track.name;
            }
        }
      });
  
      // Connect to the player!
      this.connect(); 
    }
  
    lowerVolume = ()=>{
      this.getVolume().then((volume: number) => {
        if (volume > 0.1) {
          this.setVolume(volume - 0.1).then(() => {});
        }
      });
    }
    
    increaseVolume = ()=>{
      this.getVolume().then((volume: number) => {
        if (volume < 0.9) {
          this.setVolume(volume + 0.1).then(() => {});
        }
      });
    }

    mute = ()=>{
      this.setVolume(0);
    }
  }
}
