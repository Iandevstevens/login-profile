import { useEffect, useRef, useState } from "react";
import { init } from "../classes/SpotifyPlayer";
import { useSelector } from "react-redux";
import { IState } from "../interfaces/IState";
import io from "socket.io-client";

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

export default (roomId: string) => {
  const socketRef = useRef<SocketIOClient.Socket>();
  const profile = useSelector((state: IState) => state.profile);
  const {
    spotifyToken,
    spotifyRefreshToken,
    spotifyExeTime,
    display_name,
  } = profile;
  const [loading, setLoading] = useState(true);
  const [currentDj, setCurrentDj] = useState<string>(display_name || "");
  const [currentUsers, setCurrentUsers] = useState<IUser[]>([]);
  const [currentSong, setCurrentSong] = useState<ICurrentSong | null>(null);
  const [spotifyPlayer, setSpotifyPlayer] = useState<any>(null);

  const changingSong = (trackSong: any) => {
    const song: ICurrentSong = {
      album: trackSong.album.name,
      artist: "temp",
      songName: trackSong.name,
      spotifyID: trackSong.uri,
    };
    setCurrentSong(song);
    const isDj = currentDj === display_name;
    if (isDj && socketRef.current)
      socketRef.current.emit("Change song", { song, roomId });
  };

  window.onSpotifyWebPlaybackSDKReady = () => {
    if (!spotifyPlayer) {
      const SpotifyPlayerClass = init(setLoading, changingSong);
      if (spotifyToken && spotifyRefreshToken && spotifyExeTime) {
        setSpotifyPlayer(
          new SpotifyPlayerClass(
            spotifyToken,
            spotifyRefreshToken,
            spotifyExeTime
          )
        );
      }
    }
  };

  const swapDj = (newDj: string) => {
    if (display_name === currentDj && socketRef.current) {
      setCurrentDj(newDj);
      socketRef.current.emit("change Dj", newDj);
    }
  };

  useEffect(() => {
    const hasLoadedScript = document.getElementById("spotifyScript");
    if (!hasLoadedScript) {
      const script = document.createElement("script");
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.async = true;
      script.id = "spotifyScript";
      document.body.appendChild(script);
    }
  }, []);

  useEffect(() => {
    if (spotifyPlayer) {
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
    }
  }, [display_name, roomId, spotifyPlayer]);

  return {
    loading,
    currentDj,
    currentUsers,
    currentSong,
    spotifyPlayer,
    swapDj,
  };
};
