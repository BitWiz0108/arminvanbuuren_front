import { useState, useRef } from "react";
import Image from "next/image";
import { twJoin } from "tailwind-merge";

import ButtonCircle from "@/components/ButtonCircle";
import Play from "@/components/Icons/Play";
import Pause from "@/components/Icons/Pause";
import {
  MUSIC_CARD_NORMAL_WIDTH_DESKTOP,
  MUSIC_CARD_NORMAL_WIDTH_MOBILE,
} from "@/components/MusicCard";
import VDots from "@/components/Icons/VDots";
import { composeLyrics } from "@/components/Common";

import { useSizeValues } from "@/contexts/contextSize";
import { useShareValues } from "@/contexts/contextShareData";

import { IMAGE_BLUR_DATA_URL, PLACEHOLDER_IMAGE } from "@/libs/constants";

import { IMusic } from "@/interfaces/IMusic";

type Props = {
  music: IMusic;
  playing: boolean;
  soundStatus?: "playing" | "paused" | "none";
  togglePlay: Function;
  play: Function;
};

const MusicListCard = ({
  music,
  playing,
  soundStatus = "none",
  togglePlay,
  play,
}: Props) => {
  const { isMobile } = useSizeValues();
  const { setIsLyricsVisible, setLyrics } = useShareValues();

  const [hovered, setHovered] = useState<boolean>(false);

  const onHover = () => {
    if (hovered) return;
    setHovered(true);
  };

  const onOut = () => {
    if (!hovered) return;
    setTimeout(() => {
      setHovered(false);
    }, 500);
  };

  const [lastPosX, setLastPosX] = useState<number>(0);

  const onTitleClick = () => {
    play();
  };

  return (
    <div
      className="relative flex flex-col justify-start items-start space-y-5"
      style={{
        width: `${
          isMobile
            ? MUSIC_CARD_NORMAL_WIDTH_MOBILE
            : MUSIC_CARD_NORMAL_WIDTH_DESKTOP
        }px`,
      }}
      onMouseEnter={() => onHover()}
      onMouseLeave={() => onOut()}
    >
      <div
        className={twJoin(
          "relative rounded-3xl overflow-hidden transition-all duration-300 cursor-pointer select-none border-4",
          hovered ? "border-bluePrimary" : "border-transparent"
        )}
      >
        <div
          className="w-full"
          onMouseDown={(e) => setLastPosX(e.screenX)}
          onMouseUp={(e) => {
            if (Math.abs(e.screenX - lastPosX) < 30) {
              play();
            }
          }}
          style={{
            height: `${
              isMobile
                ? MUSIC_CARD_NORMAL_WIDTH_MOBILE
                : MUSIC_CARD_NORMAL_WIDTH_DESKTOP
            }px`,
          }}
        >
          <Image
            className="w-full h-full object-cover select-none pointer-events-none"
            src={music.coverImage ?? PLACEHOLDER_IMAGE}
            width={1500}
            height={1500}
            alt=""
            placeholder="blur"
            blurDataURL={IMAGE_BLUR_DATA_URL}
            priority
          />
        </div>
        {hovered && soundStatus == "none" && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <ButtonCircle
              dark={false}
              size="large"
              icon={<Play width={34} height={34} />}
              onClick={() => play()}
            />
          </div>
        )}
        {hovered && playing && soundStatus != "none" && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            {soundStatus == "playing" ? (
              <Pause
                width={80}
                height={80}
                className="text-primary hover:text-bluePrimary"
                onClick={() => togglePlay()}
              />
            ) : (
              <ButtonCircle
                dark={false}
                size="large"
                icon={<Play width={34} height={34} />}
                onClick={() => togglePlay()}
              />
            )}
          </div>
        )}
      </div>
      <div className="w-full flex flex-row justify-start items-start space-x-2 px-5">
        <div className="flex flex-col justify-start items-start flex-grow truncate">
          <p
            className="w-full text-primary text-base md:text-lg text-left truncate cursor-pointer"
            onClick={onTitleClick}
          >
            {music.title}
          </p>
          <p className="text-secondary text-xs md:text-sm text-left truncate">
            {music.singer?.artistName}
          </p>
        </div>

        <div className="flex justify-center items-center">
          <VDots
            width={24}
            height={24}
            className="text-secondary hover:text-primary transition-all duration-300 cursor-pointer"
            onClick={() => {
              setLyrics(
                composeLyrics(
                  music.singer.artistName,
                  music.title,
                  music.duration,
                  music.description,
                  music.lyrics
                )
              );
              setIsLyricsVisible(true);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default MusicListCard;
