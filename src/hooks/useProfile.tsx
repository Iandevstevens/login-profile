import { useDispatch, useSelector } from "react-redux";

export default () => {
  const setProfile = useDispatch();
  const profile = useSelector((state: any) => state.profile);

  const changeProfile = async (values: any) => {
    const query = `mutation changeProfile($email: String!, $id: ID!, $displayName: String!){
      changeProfile(id: $id, email: $email, display_name: $displayName){
        email,
        display_name
      }
    }`;
    const loginResults = await fetch(
      `${process.env.REACT_APP_API_URL}/graphql`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${profile.token}`,
        },
        body: JSON.stringify({
          query,
          variables: values,
        }),
      }
    );
    const loginJson = await loginResults.json();

    if (!loginJson.errors) {
      setProfile({
        type: "CHANGE_PROFILE",
        payload: {
          email: loginJson.data.changeProfile.email,
          display_name: loginJson.data.changeProfile.display_name,
        },
      });
    }
    return loginJson;
  };

  return { profile, changeProfile };
};
