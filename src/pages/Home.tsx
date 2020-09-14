import React, { useState } from "react";
import { v1 as uuid } from "uuid";
import { Link, useHistory } from "react-router-dom";
import { PURGE } from "redux-persist";
import { useDispatch } from "react-redux";

interface profile {
  country?: string;
  display_name: string;
  email: string;
  id: string;
}

const Home = () => {
  const dispatch = useDispatch();
  const [link, setLink]: [null | string, Function] = useState(null);
  const history = useHistory();

  const logOut = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    dispatch({
      type: PURGE,
      key: "root",
      result: () => {
        history.push("/");
      },
    });
  };

  const getLink = () => {
    setLink(`/app/room/${uuid()}`);
  };

  return (
    <div>
      <div>Call Friends TO DO</div>
      <button onClick={getLink}>Get Link</button>
      <br />
      {!!link && (
        <Link to={link}>{`${process.env.REACT_APP_CLIENT_URL + link}`}</Link>
      )}
      <Link to={`/app/music-room/${uuid()}`}>music room</Link>
      <button onClick={logOut} style={{ float: "right" }}>
        Logout
      </button>
    </div>
  );
};

export default Home;
