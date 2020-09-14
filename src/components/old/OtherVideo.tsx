import React, { useRef, useLayoutEffect, useState } from "react";

const OtherVideo = (props: any) => {
  const video = useRef<HTMLVideoElement>(null);
  useLayoutEffect(() => {
    const remoteStream = new MediaStream();
    props.ontrack = (evt: any) => {
      remoteStream.addTrack(evt.track);
      if (null !== video.current) video.current.srcObject = remoteStream;
    };
  }, [props.ontrack]);
  return (
    <div>
      <video playsInline autoPlay ref={video} muted />
    </div>
  );
};

export default OtherVideo;
