/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";

import { LOADING_GIF } from "@/libs/constants";

const VideoPlayer = (props: any) => {
  const [isGlobalLoading, setIsGlobalLoading] = useState(true);
  const [isVideoLoading, setIsVideoLoading] = useState(true);

  const handleVideoLoaded = () => {
    setIsGlobalLoading(false);
    setIsVideoLoading(false);
  };

  useEffect(() => {
    setIsGlobalLoading(true);
    setIsVideoLoading(true);
    setTimeout(() => {
      setIsGlobalLoading(false);
    }, 3000);
  }, [props.src]);

  return (
    <>
      {isGlobalLoading && <div className="loading"></div>}
      {isVideoLoading && (
        <div className="absolute left-0 top-0 w-full h-full flex justify-center items-center bg-black z-10">
          <img
            className="w-16 h-16 object-cover"
            src={LOADING_GIF}
            alt="Loading"
          />
        </div>
      )}
      <video {...props} onLoadedData={handleVideoLoaded} />
    </>
  );
};

export default VideoPlayer;
