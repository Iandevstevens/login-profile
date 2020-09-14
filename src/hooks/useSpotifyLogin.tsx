import { useDispatch } from "react-redux";

export default () => {
  const setProfile = useDispatch();

  const login = async (code: string) => {
    const query = `mutation spotifyLogin($spotify_code: String!){
      spotifyLogin(spotify_code: $spotify_code){
        email
        token
        display_name
        country
        spotifyToken
        spotifyRefreshToken
      }
    }`;
    const loginResults = await fetch(
      `${process.env.REACT_APP_API_URL}/graphql`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          query,
          variables: { spotify_code: code },
        }),
      }
    );
    const loginJson = await loginResults.json();
    console.log(loginJson.data.spotifyLogin);

    if (!loginJson.errors) {
      setProfile({
        type: "SET_PROFILE",
        payload: {
          ...loginJson.data.spotifyLogin,
          spotifyExeTime: new Date(new Date().getTime() + 3550000),
        },
      });
    }
    return loginJson;
  };

  return login;
};
