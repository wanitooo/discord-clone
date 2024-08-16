import { useEffect, useRef } from "react";

const VideoPlayer = ({
  mediaStream,
  className,
}: {
  mediaStream: MediaStream | undefined;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.srcObject = mediaStream;
  }, [mediaStream]);

  return (
    <video ref={videoRef} autoPlay playsInline className={className}>
      VideoPlayer
    </video>
  );
};

export default VideoPlayer;
