import React, { useEffect, useLayoutEffect, useRef } from "react";

const MyVideoNew = (props: any) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useLayoutEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (null !== videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        // stream.getVideoTracks().forEach((track) => {
        //   props.addTrack(track);
        // });
      })
      .catch(console.error);
  }, [props]);
  return (
    <div>
      <video playsInline autoPlay muted ref={videoRef}></video>
    </div>
  );
};

export default MyVideoNew;
