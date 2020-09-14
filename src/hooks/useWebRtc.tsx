import { useState, useEffect, useCallback } from "react";
import socketIOClient from "socket.io-client";

const ENDPOINT = "http://127.0.0.1:8000";
const socket = socketIOClient(ENDPOINT);
let rtcPeerConn: RTCPeerConnection;
const configuration = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302",
    },
  ],
};
let signalRoom: string;
let chatRoom: string;

export default (roomId: any) => {
  const [remoteStream, setRemoteStream] = useState<MediaStream>(
    new MediaStream()
  );

  const sendLocalDesc = (res: any) => {
    rtcPeerConn
      .setLocalDescription(res)
      .then(() => {
        socket.emit("send SDP", {
          message: JSON.stringify({
            sdp: rtcPeerConn.localDescription,
          }),
          signalRoom,
        });
      })
      .catch(console.error);
  };

  const startSignaling = useCallback(() => {
    console.log(`start signaling to ${signalRoom}`);

    rtcPeerConn = new RTCPeerConnection(configuration);

    rtcPeerConn.onicecandidate = (evt: any) => {
      console.log("got ICE candidate");

      if (evt.candidate)
        socket.emit("signal", {
          type: "ice_candidate",
          message: JSON.stringify({
            candidate: evt.candidate,
          }),
          signalRoom,
        });
    };

    rtcPeerConn.onnegotiationneeded = () => {
      console.log("negotiated");
      rtcPeerConn
        .createOffer()
        .then(sendLocalDesc)
        .catch((err) => console.error(err));
    };

    rtcPeerConn.ontrack = (evt) => {
      console.log("Got remote track");
      const tempRemoteStream = new MediaStream();
      tempRemoteStream.addTrack(evt.track);
      setRemoteStream(tempRemoteStream);
      // if (null !== otherVideo.current)
      //   otherVideo.current.srcObject = remoteStream;
    };

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        stream.getVideoTracks().forEach((track) => {
          console.log("sending track");
          rtcPeerConn.addTrack(track);
        });
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    signalRoom = `signalRoom${roomId}`;
    chatRoom = `chatRoom${roomId}`;
    socket.emit("join room", { signalRoom, chatRoom });

    socket.emit("signal", {
      type: "user_here",
      message: "Are you ready for a call?",
      signalRoom,
    });

    socket.emit("ready for call", { signalRoom });

    socket.on("set up peer connection", () => {
      if (!rtcPeerConn) startSignaling();
    });

    socket.on("receive SDP", (msg: any) => {
      if (!rtcPeerConn) startSignaling();
      console.log("receive SDP");

      let message = JSON.parse(msg.message);
      console.log(message);

      rtcPeerConn
        .setRemoteDescription(new RTCSessionDescription(message.sdp))
        .then(() => {
          if (rtcPeerConn?.remoteDescription?.type === "offer") {
            rtcPeerConn.createAnswer().then(sendLocalDesc).catch(console.error);
          }
        });
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId, startSignaling]);

  return remoteStream;
};
