import {useSelector} from 'react-redux'

export const noAuth = (query: string, variables: any) =>{
  return fetch(
    `${process.env.REACT_APP_API_URL}/graphql`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    }
  ).then(res=>res.json());
}

export const Auth = (query: string, variables: any)=>{
  const profile = useSelector((state: any) => state.profile);
  return fetch(
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
        variables,
      }),
    }
  ).then(res=>res.json());
}