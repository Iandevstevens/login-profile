import React from "react";
import useMusicRoom from "../hooks/useMusicRoom";

interface IUser {
  socketId: string;
  displayName: string;
}

const MusicPlayer = ({
  loading,
  songPlaying,
  spotifyPlayer,
}: {
  loading: boolean;
  songPlaying: string;
  spotifyPlayer: any;
}) => {
  const ownMusic = () => {
    //call to say don't change song
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{songPlaying}</h2>
      <button onClick={spotifyPlayer.lowerVolume}>Lower</button>
      <button onClick={spotifyPlayer.increaseVolume}>Higher</button>
      <button onClick={spotifyPlayer.mute}>Mute</button>
      <button onClick={ownMusic}>Go it your own</button>
    </div>
  );
};

const Users = ({
  users,
  currentDj,
  swapDj,
}: {
  users: IUser[];
  currentDj: string;
  swapDj: Function;
}) => {
  return (
    <div>
      {users.map((user: any) => {
        return (
          <div key={user.displayName} onClick={() => swapDj(user.displayName)}>
            {user.displayName}
            {user.displayName === currentDj && <span>DJ</span>}
          </div>
        );
      })}
    </div>
  );
};

const Music = ({ roomId }: { roomId: string }) => {
  const {
    loading,
    currentDj,
    currentUsers,
    currentSong,
    spotifyPlayer,
    swapDj,
  } = useMusicRoom(roomId);

  console.log(currentSong?.songName);

  return (
    <div>
      <MusicPlayer
        loading={loading}
        songPlaying={currentSong?.songName || "Waiting for DJ input"}
        spotifyPlayer={spotifyPlayer}
      ></MusicPlayer>
      <Users users={currentUsers} currentDj={currentDj} swapDj={swapDj}></Users>
    </div>
  );
};

export default Music;
