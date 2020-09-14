import React, {
  useRef,
  useState,
  ChangeEvent,
  useEffect,
  useLayoutEffect,
  useCallback,
} from "react";

interface IMediaSelect {
  selectedMedia: MediaDeviceInfo | undefined;
  mediaOptions: MediaDeviceInfo[];
  handleChange: (event: ChangeEvent<HTMLSelectElement>) => void;
}

const MediaSelect = ({
  selectedMedia,
  mediaOptions,
  handleChange,
}: IMediaSelect) => {
  return (
    <select value={selectedMedia?.label} onChange={handleChange}>
      {mediaOptions.map((option: MediaDeviceInfo, index: number) => (
        <option key={option.deviceId} value={index}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

const MyVideo = () => {
  const userVideo = useRef<HTMLVideoElement>(null);

  const [videoOptions, setVideoOptions] = useState<MediaDeviceInfo[]>([]);
  const [audioOptions, setAudioOptions] = useState<MediaDeviceInfo[]>([]);

  const [selectedVideo, setSelectedVideo] = useState<MediaDeviceInfo>();
  const [selectedAudio, setSelectedAudio] = useState<MediaDeviceInfo>();

  const getMediaOptions = () => {
    navigator.mediaDevices
      .enumerateDevices()
      .then((res) => {
        const tempVideoOption = res.filter((x) => x.kind === "videoinput");
        const tempAudioOption = res.filter((x) => x.kind === "audioinput");

        setVideoOptions(tempVideoOption);
        setAudioOptions(tempAudioOption);

        setSelectedVideo(tempVideoOption.find((x) => x.deviceId === "default"));
        setSelectedAudio(tempAudioOption.find((x) => x.deviceId === "default"));
      })
      .catch(console.error);
  };

  const setVideoStream = useCallback(() => {
    const videoConstraints = {
      deviceId: {
        exact: selectedVideo?.deviceId,
      },
    };
    navigator.mediaDevices
      .getUserMedia({ video: videoConstraints, audio: true })
      .then((stream: MediaStream) => {
        if (null !== userVideo.current) {
          userVideo.current.srcObject = stream;

          //   stream.getVideoTracks().forEach((track) => {
          //     rtcPeerConn.addTrack(track);
          //   });
        }
      })
      .catch(console.error);
  }, [selectedVideo]);

  const changeVideo = (e: ChangeEvent<HTMLSelectElement>): void => {
    setSelectedVideo(videoOptions[parseInt(e.target.value)]);
    setVideoStream();
  };

  useEffect(() => {
    getMediaOptions();
  });

  useLayoutEffect(() => {
    // setVideoStream();
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream: MediaStream) => {
        if (null !== userVideo.current) {
          userVideo.current.srcObject = stream;

          //   stream.getVideoTracks().forEach((track) => {
          //     rtcPeerConn.addTrack(track);
          //   });
        }
      });
  }, [setVideoStream]);

  return (
    <div>
      {/* <MediaSelect
        selectedMedia={selectedVideo}
        mediaOptions={videoOptions}
        handleChange={changeVideo}
      ></MediaSelect>
      <MediaSelect
        selectedMedia={selectedAudio}
        mediaOptions={audioOptions}
        handleChange={(e) =>
          setSelectedAudio(audioOptions[parseInt(e.target.value)])
        }
      ></MediaSelect> */}
      <video playsInline autoPlay ref={userVideo} muted />
    </div>
  );
};

export default MyVideo;
