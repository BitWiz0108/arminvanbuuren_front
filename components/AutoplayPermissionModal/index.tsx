import { twMerge } from "tailwind-merge";

import { useSizeValues } from "@/contexts/contextSize";

import { IAudioPlayer } from "@/interfaces/IAudioPlayer";
import { IVideoPlayer } from "@/interfaces/IVideoPlayer";

type Props = {
  isVisible: boolean;
  setVisible: Function;
  player: IAudioPlayer | IVideoPlayer;
};

const AutoplayPermissionModal = ({ isVisible, setVisible, player }: Props) => {
  const { isMobile } = useSizeValues();

  return isVisible ? (
    <div
      className={twMerge(
        "fixed left-0 top-0 w-screen h-screen p-5 bg-transparent flex justify-center items-center z-50",
        isMobile ? "pb-[180px]" : "pb-28 lg:pb-36"
      )}
      onClick={() => {
        setVisible(false);
        player.play();
      }}
    ></div>
  ) : null;
};
export default AutoplayPermissionModal;
