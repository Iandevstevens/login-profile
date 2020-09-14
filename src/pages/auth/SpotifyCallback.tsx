import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import useSpotifyLogin from "../../hooks/useSpotifyLogin";
import { useSelector } from "react-redux";

const SpotifyCallback = (props: any) => {
  const history = useHistory();
  const profile = useSelector((state: any) => state.profile);
  const login = useSpotifyLogin();

  useEffect(() => {
    const asyncLogin = async () => {
      const code = props.location.search.split("=")[1];
      const loginResults = await login(code);
      if (loginResults.error) {
      } else {
      }
    };
    asyncLogin();
  }, [history, login, props.location.search]);

  useEffect(() => {
    if (profile.email) {
      setTimeout(() => {
        history.push("/app/home");
      }, 50);
    }
  }, [history, profile]);

  return <div>...Loading</div>;
};

export default SpotifyCallback;
