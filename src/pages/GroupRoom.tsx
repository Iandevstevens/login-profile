import React, { useEffect, useRef, useState, useCallback } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import MusicPlayer from "../components/MusicPlayer";
import useProfile from "../hooks/useProfile";
import { useHistory } from "react-router-dom";

const Video = (props: any) => {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    props.peer.on("stream", (stream: any) => {
      if (ref.current) ref.current.srcObject = stream;
    });
  }, [props.peer]);

  return (
    <video playsInline autoPlay ref={ref} muted height={400} width={400} />
  );
};

const videoConstraints = {
  height: 400,
  width: 400,
};

interface IPeerRef {
  peerID: string;
  peer: Peer.Instance;
}

const Room = (props: any) => {
  const [peers, setPeers] = useState<Peer.Instance[]>([]);
  const history = useHistory();

  const socketRef = useRef<SocketIOClient.Socket>();
  const userVideo = useRef<HTMLVideoElement>(null);
  const peersRef = useRef<IPeerRef[]>([]);
  const roomID = props.match.params.id;

  const addPeer = useCallback(
    (incomingSignal: any, callerID: any, stream: any) => {
      const peer = new Peer({
        initiator: false,
        trickle: false,
        stream,
      });

      peer.on("signal", (signal) => {
        if (socketRef.current)
          socketRef.current.emit("returning signal", { signal, callerID });
      });
      peer.signal(incomingSignal);

      return peer;
    },
    []
  );

  const usersStream = useCallback(
    (stream: MediaStream) => {
      if (userVideo.current) userVideo.current.srcObject = stream;
      if (socketRef.current) {
        socketRef.current.emit("join room", {
          roomID,
        });
        socketRef.current.on("all users", (users: any[]) => {
          const peers: Peer.Instance[] = [];
          users.forEach((userID: string) => {
            if (socketRef.current) {
              const peer = createPeer(userID, socketRef.current.id, stream);
              peersRef.current.push({
                peerID: userID,
                peer,
              });
              peers.push(peer);
            }
          });
          setPeers(peers);
        });

        socketRef.current.on("user joined", (payload: any) => {
          const item = peersRef.current.find(
            (p) => p.peerID === payload.callerID
          );
          if (!item) {
            const peer = addPeer(payload.signal, payload.callerID, stream);
            peersRef.current.push({
              peerID: payload.callerID,
              peer,
            });
            setPeers((users) => [...users, peer]);
          }
        });

        socketRef.current.on("receiving returned signal", (payload: any) => {
          const item = peersRef.current.find((p) => p.peerID === payload.id);
          if (item) item.peer.signal(payload.signal);
        });
      }
    },
    [addPeer, roomID]
  );

  useEffect(() => {
    let cleanUpStream: MediaStream;
    socketRef.current = io.connect("http://127.0.0.1:8000");
    navigator.mediaDevices
      .getUserMedia({ video: videoConstraints, audio: true })
      .then((stream) => {
        cleanUpStream = stream;
        usersStream(stream);
      });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
      cleanUpStream.getTracks().forEach((track: any) => {
        if (track.readyState === "live") {
          track.stop();
        }
      });
    };
  }, [usersStream]);

  useEffect(() => {
    peers.forEach((peer: any) => {
      peer.on("close", () => {
        const tempPeers = peers.filter(
          (tempPeer: any) => tempPeer._id !== peer._id
        );
        const tempPeersRef = peersRef.current.filter(
          (tempPeerRef: any) => tempPeerRef.peer._id !== peer._id
        );
        setPeers(tempPeers);
        peersRef.current = tempPeersRef;
      });
    });
  }, [peers]);

  const createPeer = (userToSignal: any, callerID: any, stream: any) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      if (socketRef.current) {
        socketRef.current.emit("sending signal", {
          userToSignal,
          callerID,
          signal,
        });
      }
    });

    return peer;
  };

  const disconnect = () => {
    if (socketRef.current) socketRef.current.disconnect();
    peers.forEach((peer) => {
      peer.destroy();
    });
    history.push("/app/home");
  };

  return (
    <div>
      {/* <MusicPlayer></MusicPlayer> */}
      <video muted ref={userVideo} autoPlay playsInline />
      {peers.map((peer, index) => {
        return <Video key={index} peer={peer} muted />;
      })}
      <button onClick={disconnect}>disconnect</button>
    </div>
  );
};

export default Room;
