import { twMerge } from "tailwind-merge";

import Check from "@/components/Icons/Check";

import { MUSIC_QUALITY } from "@/libs/constants";

import { IAudioPlayer } from "@/interfaces/IAudioPlayer";

type Props = {
  close: Function;
  audioPlayer: IAudioPlayer;
};

const MusicSettingsModal = ({ close, audioPlayer }: Props) => {
  const onAutoQuality = () => {
    audioPlayer.setPlayingQuality(MUSIC_QUALITY.AUTO);
    close();
  };

  const onHighQuality = () => {
    audioPlayer.setPlayingQuality(MUSIC_QUALITY.HIGH);
    close();
  };

  const onLowQuality = () => {
    audioPlayer.setPlayingQuality(MUSIC_QUALITY.LOW);
    close();
  };

  return (
    <div className="w-full flex flex-col justify-start items-center space-y-3 p-5 bg-third rounded-md overflow-hidden">
      <div
        className={twMerge(
          "w-full h-[40px] min-h-[40px] pl-5 text-white tracking-[1px] bg-background hover:bg-activeSecondary inline-flex justify-start items-center rounded-md space-x-3 cursor-pointer",
          audioPlayer.playingQuality == MUSIC_QUALITY.AUTO ? "pl-5" : "pl-12"
        )}
        onClick={() => onAutoQuality()}
      >
        {audioPlayer.playingQuality == MUSIC_QUALITY.AUTO && <Check />}
        <span>Auto Select</span>
      </div>

      <div
        className={twMerge(
          "w-full h-[40px] min-h-[40px] pl-5 text-white tracking-[1px] bg-background hover:bg-activeSecondary inline-flex justify-start items-center rounded-md space-x-3 cursor-pointer",
          audioPlayer.playingQuality == MUSIC_QUALITY.HIGH ? "pl-5" : "pl-12"
        )}
        onClick={() => onHighQuality()}
      >
        {audioPlayer.playingQuality == MUSIC_QUALITY.HIGH && <Check />}
        <span> High Quality </span>
      </div>
      <div
        className={twMerge(
          "w-full h-[40px] min-h-[40px] pl-5 text-white tracking-[1px] bg-background hover:bg-activeSecondary inline-flex justify-start items-center rounded-md space-x-3 cursor-pointer",
          audioPlayer.playingQuality == MUSIC_QUALITY.LOW ? "pl-5" : "pl-12"
        )}
        onClick={() => onLowQuality()}
      >
        {audioPlayer.playingQuality == MUSIC_QUALITY.LOW && <Check />}
        <span> Low Quality </span>
      </div>
    </div>
  );
};

export default MusicSettingsModal;
