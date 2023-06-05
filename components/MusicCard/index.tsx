import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { twJoin } from "tailwind-merge";

import ButtonCircle from "@/components/ButtonCircle";
import Play from "@/components/Icons/Play";
import Pause from "@/components/Icons/Pause";

import { useSizeValues } from "@/contexts/contextSize";

import { IMAGE_BLUR_DATA_URL, PLACEHOLDER_IMAGE } from "@/libs/constants";

import { IMusic } from "@/interfaces/IMusic";

type Props = {
  music: IMusic;
  active: boolean;
  playing: boolean;
  soundStatus?: "playing" | "paused" | "none";
  togglePlay: Function;
  play: Function;
  onClick: Function;
};

export const MUSIC_CARD_NORMAL_WIDTH_DESKTOP = 260;
export const MUSIC_CARD_ACTIVE_WIDTH_DESKTOP = 320;
export const MUSIC_CARD_NORMAL_WIDTH_MOBILE = 180;
export const MUSIC_CARD_ACTIVE_WIDTH_MOBILE = 260;

const MusicCard = ({
  music,
  active,
  playing,
  soundStatus = "none",
  togglePlay,
  play,
  onClick,
}: Props) => {
  const { isMobile } = useSizeValues();

  const [lastPosX, setLastPosX] = useState<number>(0);
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

  return (
    <div className="relative">
      {active && (
        <div
          className="absolute -bottom-12 rounded-[50%] -left-[20px] h-8 card-shadow"
          style={{
            width: `${
              isMobile
                ? MUSIC_CARD_ACTIVE_WIDTH_MOBILE + 40
                : MUSIC_CARD_ACTIVE_WIDTH_DESKTOP + 40
            }px`,
          }}
        ></div>
      )}
      <div
        className={twJoin(
          "relative rounded-3xl overflow-hidden cursor-pointer select-none border-4 shadow-lg",
          hovered ? "border-bluePrimary" : "border-transparent"
        )}
        style={{
          width: `${
            isMobile
              ? active
                ? MUSIC_CARD_ACTIVE_WIDTH_MOBILE
                : MUSIC_CARD_NORMAL_WIDTH_MOBILE
              : active
              ? MUSIC_CARD_ACTIVE_WIDTH_DESKTOP
              : MUSIC_CARD_NORMAL_WIDTH_DESKTOP
          }px`,
        }}
        onMouseEnter={() => onHover()}
        onMouseLeave={() => onOut()}
      >
        <div
          className="w-full"
          onMouseDown={(e) => setLastPosX(e.screenX)}
          onMouseUp={(e) => {
            if (Math.abs(e.screenX - lastPosX) < 30) {
              onClick();
            }
          }}
          style={{
            height: `${
              isMobile
                ? active
                  ? MUSIC_CARD_ACTIVE_WIDTH_MOBILE
                  : MUSIC_CARD_NORMAL_WIDTH_MOBILE
                : active
                ? MUSIC_CARD_ACTIVE_WIDTH_DESKTOP
                : MUSIC_CARD_NORMAL_WIDTH_DESKTOP
            }px`,
          }}
        >
          <Image
            className="w-full h-full object-cover select-none pointer-events-none transition-all duration-300"
            src={music.coverImage ?? PLACEHOLDER_IMAGE}
            width={1500}
            height={1500}
            alt=""
            placeholder="blur"
            blurDataURL={IMAGE_BLUR_DATA_URL}
            priority
          />
        </div>
        <AnimatePresence>
          {active && !playing && hovered && (
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ButtonCircle
                dark={false}
                size="large"
                icon={<Play width={34} height={34} />}
                onClick={() => play()}
              />
            </motion.div>
          )}
        </AnimatePresence>
        {playing && soundStatus != "none" && hovered && (
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
    </div>
  );
};

export default MusicCard;
