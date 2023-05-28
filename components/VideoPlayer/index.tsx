/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";

import Loading from "@/components/Loading";

import { PLACEHOLDER_IMAGE } from "@/libs/constants";

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
    }, 5000);
  }, [props.src]);

  return (
    <>
      {isGlobalLoading && (
        <div className="loading">
          <Loading width={64} height={64} />
        </div>
      )}
      {isVideoLoading && (
        <img
          className="absolute left-0 top-0 w-full h-full object-cover opacity-60 z-10"
          src={PLACEHOLDER_IMAGE}
          alt=""
        />
      )}
      <video {...props} onLoadedData={handleVideoLoaded} />
    </>
  );
};

export default VideoPlayer;
