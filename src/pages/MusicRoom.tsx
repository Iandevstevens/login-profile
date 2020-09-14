import React from "react";
import MusicPlayer from "../components/NewmusicPlayer";

const MusicRoom = (props: any) => {
  const roomId = props.match.params.id;
  return (
    <div>
      <MusicPlayer roomId={roomId}></MusicPlayer>
    </div>
  );
};

export default MusicRoom;
