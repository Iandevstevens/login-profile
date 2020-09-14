import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { init } from "../classes/SpotifyPlayer";
import { useSelector } from "react-redux";
import { IState } from "./../interfaces/IState";

interface LocationState {
  spotifyCode: string;
}

interface IUser {
  socketId: string;
  displayName: string;
}

interface ICurrentSong {
  spotifyID: string;
  songName: string;
  album: string;
  artist: string;
}

interface IRoom {
  users: IUser[];
  currentDJ: string;
  currentSong?: ICurrentSong;
}
let spotifyPlayer: any;

const MusicPlayer = ({
  loading,
  songPlaying,
}: {
  loading: boolean;
  songPlaying: string;
}) => {
  const ownMusic = () => {
    //call to say don't change song
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{songPlaying}</h2>
      <button onClick={spotifyPlayer.lowerVolume}>Lower</button>
      <button onClick={spotifyPlayer.increaseVolume}>Higher</button>
      <button onClick={spotifyPlayer.mute}>Mute</button>
      <button onClick={ownMusic}>Go it your own</button>
    </div>
  );
};

const Users = ({
  users,
  currentDj,
  swapDj,
}: {
  users: IUser[];
  currentDj: string;
  swapDj: Function;
}) => {
  return (
    <div>
      {users.map((user: any) => {
        return (
          <div key={user.displayName} onClick={() => swapDj(user.displayName)}>
            {user.displayName}
            {user.displayName === currentDj && <span>DJ</span>}
          </div>
        );
      })}
    </div>
  );
};

const play = ({
  spotify_uri,
  playerInstance: {
    _options: { getOAuthToken, id },
  },
}: {
  spotify_uri: string;
  playerInstance: any;
}) => {
  getOAuthToken((spotifyToken: string) => {
    fetch(`https://api.spotify.com/v1/me/player/play?device_id=${id}`, {
      method: "PUT",
      body: JSON.stringify({ uris: [spotify_uri] }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${spotifyToken}`,
      },
    });
  });
};

const Music = ({ roomId }: { roomId: string }) => {
  const socketRef = useRef<SocketIOClient.Socket>();
  const profile = useSelector((state: IState) => state.profile);
  const {
    spotifyToken,
    spotifyRefreshToken,
    spotifyExeTime,
    display_name,
  } = profile;
  const [roomInfo, setRoomInfo] = useState<IRoom | any>({ users: [] });
  const [currentDj, setCurrentDj] = useState<string>(display_name || "");
  const [currentUsers, setCurrentUsers] = useState<IUser[]>([]);
  const [currentSong, setCurrentSong] = useState<ICurrentSong | null>(null);
  const [loading, setLoading] = useState(true);
  const [songPlaying, setSongPlaying] = useState("nothing playing");

  //Initalizing spotify Player
  useEffect(() => {
    const hasLoadedScript = document.getElementById("spotifyScript");
    if (!hasLoadedScript) {
      const script = document.createElement("script");
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.async = true;
      script.id = "spotifyScript";
      document.body.appendChild(script);
    }

    window.onSpotifyWebPlaybackSDKReady = () => {
      const SpotifyPlayerClass = init(setLoading, setSongPlaying);
      if (spotifyToken && spotifyRefreshToken && spotifyExeTime)
        spotifyPlayer = new SpotifyPlayerClass(
          spotifyToken,
          spotifyRefreshToken,
          spotifyExeTime
        );
    };
  }, [spotifyExeTime, spotifyRefreshToken, spotifyToken]);

  //Initalizing socket
  useEffect(() => {
    socketRef.current = io.connect("http://127.0.0.1:9000");
    socketRef.current.emit("Join room", {
      displayName: display_name,
      roomId,
    });
    socketRef.current.on("Room info", (room: IRoom) => {
      const { users, currentDJ, currentSong } = room;
      setCurrentUsers(users);
      setCurrentDj(currentDJ);
      if (currentSong) setCurrentSong(currentSong);
    });
    socketRef.current.on("Song changed", (songUri: string) => {
      play({ playerInstance: spotifyPlayer, spotify_uri: songUri });
    });
    socketRef.current.on("User joined", (users: IUser[]) => {
      setCurrentUsers(users);
    });
    socketRef.current.on("DJ change", (newDj: string) => {
      setCurrentDj(newDj);
    });
  }, [display_name, roomId]);

  //song changed
  useEffect(() => {
    const isDj = roomInfo?.currentDJ === display_name;
    if (spotifyPlayer && isDj)
      spotifyPlayer.getCurrentState().then((state: any) => {
        if (!state) {
          console.error(
            "User is not playing music through the Web Playback SDK"
          );
          return;
        }

        let { current_track } = state.track_window;
        if (socketRef.current) {
          const song: ICurrentSong = {
            album: current_track.album.name,
            artist: "temp",
            songName: current_track.name,
            spotifyID: current_track.uri,
          };
          socketRef.current.emit("Change song", { song, roomId });
        }
      });
  }, [display_name, roomId, roomInfo, songPlaying]);

  const swapDj = (newDj: string) => {
    if (display_name === roomInfo?.currentDJ && socketRef.current) {
      setCurrentDj(newDj);
      socketRef.current.emit("change Dj", newDj);
    }
  };

  if (spotifyToken && spotifyRefreshToken && spotifyExeTime && display_name)
    return (
      <div>
        {/* <MusicPlayer loading={loading} songPlaying={songPlaying}></MusicPlayer> */}
        <Users
          users={currentUsers}
          currentDj={roomInfo?.currentDJ || display_name}
          swapDj={swapDj}
        ></Users>
      </div>
    );
  return <></>;
};

export default Music;
