import { useDispatch } from "react-redux";

export default () => {
  const setProfile = useDispatch();

  const register = async (values: any) => {
    const { email, password, displayName } = values;
    const query = `mutation RegisterUser($email: String!, $password: String!, $displayName: String!){
      createUser(email: $email, password: $password, display_name: $displayName){
        id
        email
        display_name
        token
      }
    }`;

    const registerResults = await fetch(
      `${process.env.REACT_APP_API_URL}/graphql`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          query,
          variables: { email, password, displayName },
        }),
      }
    );

    const registerJson = await registerResults.json();

    if (!registerJson.errors) {
      setProfile({
        type: "SET_PROFILE",
        payload: registerJson.data.createUser,
      });
    }
    return registerJson;
  };

  return register;
};
