/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";

import { LOADING_GIF } from "@/libs/constants";

const VideoPlayer = (props: any) => {
  const [loading, setLoading] = useState(true);

  const handleVideoLoaded = () => {
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
  }, [props.src]);

  return (
    <>
      {loading && (
        <img
          className="absolute left-0 top-0 w-full h-full object-cover opacity-20 z-10"
          src={LOADING_GIF}
          alt=""
        />
      )}
      <video {...props} onLoadedData={handleVideoLoaded} />
    </>
  );
};

export default VideoPlayer;
