import React, { useEffect, useCallback, useRef, useLayoutEffect } from "react";
import MyVideoNew from "../../components/old/MyVideoNew";
import socketIOClient from "socket.io-client";
import OtherVideo from "../../components/old/OtherVideo";
import useWebRtc from "../../hooks/useWebRtc";

// const ENDPOINT = "http://127.0.0.1:8000";
// const socket = socketIOClient(ENDPOINT);
// let rtcPeerConn: RTCPeerConnection;
// const configuration = {s
//   iceServers: [
//     {
//       urls: "stun:stun.l.google.com:19302",
//     },
//   ],
// };
// let signalRoom: string;
// let chatRoom: string;

const ChatRoom = (props: any) => {
  const userVideo = useRef<HTMLVideoElement>(null);
  const otherVideo = useRef<HTMLVideoElement>(null);
  const remoteStream = useWebRtc(props.location.search.split("=")[1]);

  // const sendLocalDesc = (res: any) => {
  //   rtcPeerConn
  //     .setLocalDescription(res)
  //     .then(() => {
  //       socket.emit("send SDP", {
  //         message: JSON.stringify({
  //           sdp: rtcPeerConn.localDescription,
  //         }),
  //         signalRoom,
  //       });
  //     })
  //     .catch(console.error);
  // };

  // const startSignaling = useCallback(() => {
  //   console.log(`start signaling to ${signalRoom}`);

  //   rtcPeerConn = new RTCPeerConnection(configuration);

  //   rtcPeerConn.onicecandidate = (evt: any) => {
  //     console.log("got ICE candidate");

  //     if (evt.candidate)
  //       socket.emit("signal", {
  //         type: "ice_candidate",
  //         message: JSON.stringify({
  //           candidate: evt.candidate,
  //         }),
  //         signalRoom,
  //       });
  //   };

  //   rtcPeerConn.onnegotiationneeded = () => {
  //     console.log("negotiated");
  //     rtcPeerConn
  //       .createOffer()
  //       .then(sendLocalDesc)
  //       .catch((err) => console.error(err));
  //   };

  //   rtcPeerConn.ontrack = (evt) => {
  //     console.log("Got remote track");
  //     const remoteStream = new MediaStream();
  //     remoteStream.addTrack(evt.track);
  //     if (null !== otherVideo.current)
  //       otherVideo.current.srcObject = remoteStream;
  //   };

  //   navigator.mediaDevices
  //     .getUserMedia({ video: true, audio: true })
  //     .then((stream) => {
  //       stream.getVideoTracks().forEach((track) => {
  //         console.log("sending track");
  //         rtcPeerConn.addTrack(track);
  //       });
  //     })
  //     .catch(console.error);
  // }, []);

  // useEffect(() => {
  //   const roomId = props.location.search.split("=")[1];
  //   signalRoom = `signalRoom${roomId}`;
  //   chatRoom = `chatRoom${roomId}`;
  //   socket.emit("join room", { signalRoom, chatRoom });

  //   socket.emit("signal", {
  //     type: "user_here",
  //     message: "Are you ready for a call?",
  //     signalRoom,
  //   });

  //   socket.emit("ready for call", { signalRoom });

  //   socket.on("set up peer connection", () => {
  //     if (!rtcPeerConn) startSignaling();
  //   });

  //   socket.on("receive SDP", (msg: any) => {
  //     if (!rtcPeerConn) startSignaling();
  //     console.log("receive SDP");

  //     let message = JSON.parse(msg.message);
  //     console.log(message);

  //     rtcPeerConn
  //       .setRemoteDescription(new RTCSessionDescription(message.sdp))
  //       .then(() => {
  //         if (rtcPeerConn?.remoteDescription?.type === "offer") {
  //           rtcPeerConn.createAnswer().then(sendLocalDesc).catch(console.error);
  //         }
  //       });
  //   });

  //   return () => {
  //     socket.disconnect();
  //   };
  // }, [props.location.search, startSignaling]);

  useLayoutEffect(() => {
    if (null !== otherVideo.current) {
      otherVideo.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  useLayoutEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (null !== userVideo.current) {
          userVideo.current.srcObject = stream;
        }
      })
      .catch(console.error);
  }, []);

  return (
    <div>
      <video playsInline autoPlay muted ref={userVideo}></video>
      <video playsInline autoPlay muted ref={otherVideo}></video>
      {/* <MyVideoNew addTrack={rtcPeerConn?.addTrack}></MyVideoNew> */}
      {/* <OtherVideo onTrack={rtcPeerConn?.ontrack}></OtherVideo> */}
    </div>
  );
};

export default ChatRoom;
