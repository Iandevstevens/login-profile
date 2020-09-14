import jwt from "jsonwebtoken";
import { useDispatch } from "react-redux";
import { noAuth } from "../utils/Fetch";

export default () => {
  const dispatch = useDispatch();

  const login = async (values: any) => {
    const { email, password } = values;
    const query = `query Login($email: String!, $password: String!){
      user(email: $email, password: $password){
        id
        email
        display_name
        token
      }
    }`;
    const loginJson = await noAuth(query, { email, password });
    if (!loginJson.errors) {
      const to: any = jwt.decode(loginJson.data.user.token, { complete: true });
      console.log(to.payload.exp);

      // if(to && to.exp && to.exp < new Date().getTime()){

      // }

      dispatch({ type: "SET_PROFILE", payload: loginJson.data.user });
    }
    return loginJson;
  };

  return login;
};
