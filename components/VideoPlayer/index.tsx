import Image from "next/image";
import { useState } from "react";

import { PLACEHOLDER_IMAGE } from "@/libs/constants";

const VideoPlayer = (props: any) => {
  const [loading, setLoading] = useState(true);

  const handleVideoLoaded = () => {
    setLoading(false);
  };

  return (
    <>
      {loading && (
        <Image
          className="absolute left-0 top-0 w-full h-full object-cover z-10"
          width={800}
          height={800}
          src={PLACEHOLDER_IMAGE}
          alt=""
        />
      )}
      <video {...props} onLoadedData={handleVideoLoaded} />
    </>
  );
};

export default VideoPlayer;
