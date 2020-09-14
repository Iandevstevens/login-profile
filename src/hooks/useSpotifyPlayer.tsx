import { useEffect, useState } from "react";
import { IState } from "../interfaces/IState";
import { useSelector } from "react-redux";
import { init } from "../classes/SpotifyPlayer";

export default () => {
  const { spotifyToken, spotifyRefreshToken, spotifyExeTime } = useSelector(
    (state: IState) => state.profile
  );
  const [loading, setLoading] = useState(true);
  const [songPlaying, setSongPlaying] = useState("nothing playing");
  const [spotifyPlayer, setSpotifyPlayer] = useState<any>(null);

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
      if (spotifyToken && spotifyRefreshToken && spotifyExeTime) {
        setSpotifyPlayer(
          new SpotifyPlayerClass(
            spotifyToken,
            spotifyRefreshToken,
            spotifyExeTime
          )
        );
      }
    };
  }, [spotifyExeTime, spotifyRefreshToken, spotifyToken]);

  return { spotifyPlayer, loading, songPlaying };
};
