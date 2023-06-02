import { useEffect } from "react";
import { twMerge } from "tailwind-merge";

import Check from "@/components/Icons/Check";

import { LIVESTREAM_QUALITY } from "@/libs/constants";
import { IVideoPlayer } from "@/interfaces/IVideoPlayer";

type Props = {
  close: Function;
  videoPlayer: IVideoPlayer;
};

const LiveStreamSettingsModal = ({ close, videoPlayer }: Props) => {
  const onAutoQuality = () => {
    videoPlayer.setPlayingQuality(LIVESTREAM_QUALITY.AUTO);
    close();
  };

  const onHighQuality = () => {
    videoPlayer.setPlayingQuality(LIVESTREAM_QUALITY.HIGH);
    close();
  };

  const onLowQuality = () => {
    videoPlayer.setPlayingQuality(LIVESTREAM_QUALITY.LOW);
    close();
  };

  return (
    <div className="w-full flex flex-col justify-start items-center space-y-3 p-5 bg-third rounded-md overflow-hidden">
      <div
        className={twMerge(
          "w-full h-[40px] min-h-[40px] pl-5 text-white tracking-[1px] bg-background hover:bg-activeSecondary inline-flex justify-start items-center rounded-md space-x-3 cursor-pointer",
          videoPlayer.playingQuality == LIVESTREAM_QUALITY.AUTO
            ? "pl-5"
            : "pl-12"
        )}
        onClick={() => onAutoQuality()}
      >
        {videoPlayer.playingQuality == LIVESTREAM_QUALITY.AUTO && <Check />}
        <span>Auto Select</span>
      </div>

      <div
        className={twMerge(
          "w-full h-[40px] min-h-[40px] pl-5 text-white tracking-[1px] bg-background hover:bg-activeSecondary inline-flex justify-start items-center rounded-md space-x-3 cursor-pointer",
          videoPlayer.playingQuality == LIVESTREAM_QUALITY.HIGH
            ? "pl-5"
            : "pl-12"
        )}
        onClick={() => onHighQuality()}
      >
        {videoPlayer.playingQuality == LIVESTREAM_QUALITY.HIGH && <Check />}
        <span> High Quality </span>
      </div>
      <div
        className={twMerge(
          "w-full h-[40px] min-h-[40px] pl-5 text-white tracking-[1px] bg-background hover:bg-activeSecondary inline-flex justify-start items-center rounded-md space-x-3 cursor-pointer",
          videoPlayer.playingQuality == LIVESTREAM_QUALITY.LOW
            ? "pl-5"
            : "pl-12"
        )}
        onClick={() => onLowQuality()}
      >
        {videoPlayer.playingQuality == LIVESTREAM_QUALITY.LOW && <Check />}
        <span> Low Quality </span>
      </div>
    </div>
  );
};

export default LiveStreamSettingsModal;
