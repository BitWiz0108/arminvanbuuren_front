import Image from "next/image";
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
        <Image
          className="absolute left-0 top-0 w-full h-full object-cover z-10"
          width={800}
          height={800}
          src={LOADING_GIF}
          alt=""
        />
      )}
      <video {...props} onLoadedData={handleVideoLoaded} />
    </>
  );
};

export default VideoPlayer;
