import { useState } from "react";
import Image from "next/image";
import { twJoin } from "tailwind-merge";

import ButtonCircle from "@/components/ButtonCircle";
import Play from "@/components/Icons/Play";
import Pause from "@/components/Icons/Pause";

import VDots from "@/components/Icons/VDots";
import Share from "@/components/Icons/Share";
import { composeMetadata } from "@/components/Common";

import { useSizeValues } from "@/contexts/contextSize";
import { useShareValues } from "@/contexts/contextShareData";

import {
  IMAGE_BLUR_DATA_URL,
  PLACEHOLDER_IMAGE,
  SITE_BASE_URL,
} from "@/libs/constants";
import { getUrlFormattedTitle } from "@/libs/utils";

import { IStream } from "@/interfaces/IStream";
import { DEFAULT_SHAREDATA } from "@/interfaces/IShareData";

export const LIVESTREAM_CARD_NORMAL_WIDTH_DESKTOP = 350;
export const LIVESTREAM_CARD_ACTIVE_WIDTH_DESKTOP = 350;
export const LIVESTREAM_CARD_NORMAL_WIDTH_MOBILE = 220;
export const LIVESTREAM_CARD_ACTIVE_WIDTH_MOBILE = 220;

type Props = {
  livestream: IStream;
  playing: boolean;
  soundStatus?: "playing" | "paused" | "none";
  togglePlay: Function;
  play: Function;
};

const LiveStreamListCard = ({
  livestream,
  playing,
  soundStatus = "none",
  togglePlay,
  play,
}: Props) => {
  const { isTablet, height } = useSizeValues();
  const {
    setIsMetaVisible,
    setMetaData,
    setIsShareModalVisible,
    setShareData,
  } = useShareValues();

  const [lastPosX, setLastPosX] = useState<number>(0);

  const onShare = () => {
    setShareData({
      ...DEFAULT_SHAREDATA,
      url: `${SITE_BASE_URL}${getUrlFormattedTitle(livestream, "livestream")}`,
      title: livestream.title,
      subject: livestream.title,
      quote: livestream.title,
      about: livestream.description,
      body: livestream.description,
      summary: livestream.title,
    });
    setIsShareModalVisible(true);
  };

  return (
    <div
      className="flex flex-col justify-start items-start"
      style={{
        width: `${
          isTablet
            ? LIVESTREAM_CARD_NORMAL_WIDTH_MOBILE
            : LIVESTREAM_CARD_NORMAL_WIDTH_DESKTOP
        }px`,
      }}
    >
      <div
        className={twJoin(
          "relative w-full rounded-3xl overflow-hidden transition-all duration-300 cursor-pointer select-none border-4",
          height > 768 ? "mb-5" : "mb-2",
          playing ? "border-bluePrimary" : "border-transparent"
        )}
      >
        <div
          className="w-full h-[120px] md:h-[190px]"
          onMouseDown={(e) => setLastPosX(e.screenX)}
          onMouseUp={(e) => {
            if (Math.abs(e.screenX - lastPosX) < 30) {
              play();
            }
          }}
        >
          <Image
            className="w-full h-full object-cover select-none pointer-events-none max-h-[192px]"
            src={livestream.coverImage ?? PLACEHOLDER_IMAGE}
            width={342}
            height={342}
            alt=""
            placeholder="blur"
            blurDataURL={IMAGE_BLUR_DATA_URL}
            priority
          />
        </div>
        {playing && soundStatus != "none" && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <ButtonCircle
              dark={false}
              size="large"
              icon={
                soundStatus == "playing" ? (
                  <Pause width={40} height={40} />
                ) : (
                  <Play width={40} height={40} />
                )
              }
              onClick={() => togglePlay()}
            />
          </div>
        )}
      </div>
      <div className="w-full flex flex-row justify-start items-start space-x-2 px-5">
        <div className="flex flex-col justify-start items-start flex-grow truncate">
          <p className="w-full text-primary text-base md:text-lg text-left truncate">
            {livestream.title}
          </p>
          <p className="w-full text-secondary text-xs md:text-sm text-left truncate">
            {livestream.singer.artistName}
          </p>
        </div>

        <div className="flex justify-center items-center space-x-3">
          <Share
            width={20}
            height={20}
            className="text-secondary hover:text-primary transition-all duration-300 cursor-pointer"
            onClick={() => onShare()}
          />

          <VDots
            width={24}
            height={24}
            className="text-secondary hover:text-primary transition-all duration-300 cursor-pointer"
            onClick={() => {
              setMetaData(
                composeMetadata(
                  livestream.singer.artistName,
                  livestream.title,
                  livestream.duration,
                  livestream.description,
                  livestream.lyrics
                )
              );
              setIsMetaVisible(true);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default LiveStreamListCard;
