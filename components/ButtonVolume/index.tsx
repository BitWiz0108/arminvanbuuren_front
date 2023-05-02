import { useState } from "react";
import { twJoin } from "tailwind-merge";

import VolumeMute from "@/components/Icons/VolumeMute";
import VolumeLow from "@/components/Icons/VolumeLow";
import VolumeMax from "@/components/Icons/VolumeMax";

type Props = {
  volume: number;
  setVolume: Function;
  size: "small" | "big" | "large";
  iconSize: number;
};

const ButtonVolume = ({ volume, setVolume, size, iconSize }: Props) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [clientY, setClientY] = useState<number>(0);
  const [originalY, setOriginalY] = useState<number>(0);

  const onMouseDown = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setIsDragging(true);
    setClientY(e.clientY);
    setOriginalY(e.clientY);
  };

  const onMouseUp = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setIsDragging(false);

    const delta = originalY - e.clientY;
    if (Math.abs(delta) < 5) {
      setVolume(volume > 0 ? 0 : 100);
    }
  };

  const onMouseMove = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (isDragging) {
      const delta = clientY - e.clientY;
      if (volume + delta < 0) setVolume(0);
      else if (volume + delta > 100) setVolume(100);
      else setVolume(volume + delta);
      setClientY(e.clientY);
    }
  };

  const onMouseOut = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setIsDragging(false);
  };

  return (
    <button
      className={twJoin(
        "relative rounded-full overflow-hidden shadow-lg inline-flex justify-center items-center outline-none border-none focus:outline-none focus:border-none active:outline-none active:border-none",
        size == "small"
          ? "w-[36px] h-[36px] md:w-[50px] md:h-[50px] min-w-[36px] md:min-w-[50px]"
          : size == "big"
          ? "w-[55px] h-[55px] md:w-[65px] md:h-[65px] min-w-[55px] md:min-w-[65px]"
          : "w-[75px] h-[75px] md:w-[85px] md:h-[85px] min-w-[75px] md:min-w-[85px]",
        "bg-[#363635]"
      )}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseOut}
    >
      <span
        className={twJoin(
          "relative w-full h-full inline-flex justify-center items-center z-10",
          volume == 0 ? "text-secondary" : "text-primary"
        )}
      >
        {volume == 0 ? (
          <VolumeMute width={iconSize} height={iconSize} />
        ) : volume < 40 ? (
          <VolumeLow width={iconSize} height={iconSize} />
        ) : (
          <VolumeMax width={iconSize} height={iconSize} />
        )}
      </span>

      <span
        className="absolute left-0 bottom-0 w-full h-full bg-gradient-to-tl to-[#1139d2] via-blueSecondary from-[#1233bb] bg-size-200 bg-pos-100"
        style={{ height: `${volume}%` }}
      ></span>
    </button>
  );
};

export default ButtonVolume;
