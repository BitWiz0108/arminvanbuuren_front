import React, { useRef, useEffect } from "react";

const F10sVideoPlayer = (props: any) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef || !videoRef.current) return;

    if (videoRef.current.currentTime > 10) {
      videoRef.current.currentTime = 0;
    }
  }, [videoRef, videoRef.current?.currentTime]);

  return <video ref={videoRef} {...props} />;
};

export default F10sVideoPlayer;
