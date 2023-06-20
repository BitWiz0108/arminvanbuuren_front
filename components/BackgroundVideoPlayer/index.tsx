import dynamic from "next/dynamic";
import React from "react";
import { twMerge } from "tailwind-merge";

const ReactPlayer = dynamic(() => import("react-player"), {
  ssr: false,
});

type Props = {
  url: string;
  blur?: boolean;
};

const BackgroundVideoPlayer = ({ url, blur = false }: Props) => {
  return (
    <ReactPlayer
      url={url}
      playing
      loop
      muted
      controls={false}
      width="100%"
      height="100%"
      className={twMerge(
        "absolute left-0 top-0 w-full h-full object-cover",
        blur ? "filter blur-[5px]" : ""
      )}
    />
  );
};

export default BackgroundVideoPlayer;
