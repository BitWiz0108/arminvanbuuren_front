import { useState, useRef } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

import ButtonCircle from "@/components/ButtonCircle";
import List from "@/components/Icons/List";
import PlayPrev from "@/components/Icons/PlayPrev";
import Pause from "@/components/Icons/Pause";
import Play from "@/components/Icons/Play";
import PlayNext from "@/components/Icons/PlayNext";
import Setting from "@/components/Icons/Setting";
import Donate from "@/components/Icons/Donate";
import ButtonVolume from "@/components/ButtonVolume";
import MusicSettingsModal from "@/components/MusicSettingsModal";

import { useShareValues } from "@/contexts/contextShareData";
import { useSizeValues } from "@/contexts/contextSize";

import useOutsideClick from "@/hooks/useOutsideClick";

import { DEFAULT_COVER_IMAGE, IMAGE_MD_BLUR_DATA_URL } from "@/libs/constants";

import { IAudioPlayer } from "@/interfaces/IAudioPlayer";

type Props = {
  audioPlayer: IAudioPlayer;
  onListView: Function;
};

const AudioControl = ({ audioPlayer, onListView }: Props) => {
  const musicsettingsmodalRefMd = useRef(null);
  const musicsettingsmodalRefSm = useRef(null);
  const { contentWidth, sidebarWidth } = useSizeValues();
  const { setIsDonationModalVisible } = useShareValues();

  const [isMusicSettingsModalMdVisible, setIsMusicSettingsModalMdVisible] =
    useState<boolean>(false);
  const [isMusicSettingsModalSmVisible, setisMusicSettingsModalSmVisible] =
    useState<boolean>(false);

  useOutsideClick(musicsettingsmodalRefMd, () => {
    setIsMusicSettingsModalMdVisible(false);
  });

  useOutsideClick(musicsettingsmodalRefSm, () => {
    setisMusicSettingsModalSmVisible(false);
  });

  const track = audioPlayer.getPlayingTrack();

  return (
    <div
      className={`fixed bottom-0 flex flex-col justify-start items-start bg-background z-50`}
      style={{ left: `${sidebarWidth}px`, width: `${contentWidth}px` }}
    >
      <div className="w-full h-24 lg:h-32 hidden xs:flex flex-row justify-start items-start">
        <div className="w-24 h-24 lg:w-32 lg:h-32 min-w-[96px]">
          <Image
            className="w-full h-full object-cover"
            src={track.coverImage ?? DEFAULT_COVER_IMAGE}
            width={1500}
            height={1500}
            alt=""
            placeholder="blur"
            blurDataURL={IMAGE_MD_BLUR_DATA_URL}
          />
        </div>
        <div className="flex flex-grow h-full flex-col justify-start items-center">
          <div className="relative w-full h-1 bg-[#363636]">
            <div
              className="absolute left-0 top-0 h-full bg-blueSecondary"
              style={{
                width: `${audioPlayer.currentPercentage}%`,
              }}
            ></div>
          </div>

          <div className="w-full h-full flex flex-row px-2 lg:px-10 justify-center lg:justify-between items-center space-x-1 lg:space-x-2">
            <div className="flex flex-row justify-start items-center space-x-0 lg:space-x-5 w-auto lg:w-1/3">
              <ButtonCircle
                dark
                size="small"
                icon={<List width={24} height={24} />}
                onClick={() => onListView()}
              />
              <div className="hidden lg:flex flex-col w-2/3 justify-center items-start space-y-1 truncate">
                <h2 className="w-full text-primary text-left text-lg md:text-xl font-semibold truncate">
                  {track.title}
                </h2>
                <p className="w-full text-secondary text-left text-small md:text-base truncate">
                  {track.singer?.artistName}
                </p>
              </div>
            </div>

            <div className="flex flex-grow flex-row justify-center items-center space-x-1 lg:space-x-5">
              <ButtonCircle
                dark
                size="small"
                icon={<PlayPrev />}
                onClick={() => audioPlayer.playPreviousMusic()}
              />
              <ButtonCircle
                dark={false}
                size="big"
                icon={
                  audioPlayer.isPlaying ? (
                    <Pause width={40} height={40} />
                  ) : (
                    <Play width={34} height={34} />
                  )
                }
                onClick={() => {
                  if (audioPlayer.isPlaying) {
                    audioPlayer.pause();
                  } else {
                    audioPlayer.play();
                  }
                }}
              />
              <ButtonCircle
                dark
                size="small"
                icon={<PlayNext />}
                onClick={() => audioPlayer.playNextMusic()}
              />
            </div>

            <div className="relative flex flex-row justify-end items-center space-x-1 lg:space-x-5 w-auto lg:w-1/3">
              <ButtonCircle
                dark
                size="small"
                icon={<Setting width={24} height={24} />}
                onClick={() => setIsMusicSettingsModalMdVisible(true)}
              />
              <ButtonCircle
                dark={false}
                size="small"
                icon={<Donate width={20} height={20} />}
                onClick={() => setIsDonationModalVisible(true)}
              />
              <ButtonVolume
                size="small"
                iconSize={20}
                volume={audioPlayer.volume}
                setVolume={audioPlayer.setVolume}
              />
              <AnimatePresence>
                {isMusicSettingsModalMdVisible && (
                  <motion.div
                    key={"musicSettingsModalMd"}
                    ref={musicsettingsmodalRefMd}
                    className="absolute bottom-16 right-0 w-60"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <MusicSettingsModal
                      close={() => setIsMusicSettingsModalMdVisible(false)}
                      audioPlayer={audioPlayer}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-full xs:hidden flex-col justify-start items-start">
        <div className="w-full flex flex-row justify-between items-center px-5 py-3">
          <ButtonCircle
            dark
            size="small"
            icon={<List width={20} height={20} />}
            onClick={onListView}
          />
          <div className="flex flex-row justify-center items-center space-x-3">
            <ButtonCircle
              dark
              size="small"
              icon={<Setting width={20} height={20} />}
              onClick={() => setisMusicSettingsModalSmVisible(true)}
            />
            <ButtonCircle
              dark={false}
              size="small"
              icon={<Donate width={20} height={20} />}
              onClick={() => setIsDonationModalVisible(true)}
            />
            <ButtonVolume
              size="small"
              iconSize={20}
              volume={audioPlayer.volume}
              setVolume={audioPlayer.setVolume}
            />

            <AnimatePresence>
              {isMusicSettingsModalSmVisible && (
                <motion.div
                  ref={musicsettingsmodalRefSm}
                  className="absolute bottom-full right-0 w-60"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <MusicSettingsModal
                    close={() => setisMusicSettingsModalSmVisible(false)}
                    audioPlayer={audioPlayer}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <div className="relative w-full h-1 bg-[#363636]">
          <div
            className="absolute left-0 top-0 h-full bg-blueSecondary"
            style={{ width: `${audioPlayer.currentPercentage}%` }}
          ></div>
        </div>
        <div className="w-full h-[75px] flex justify-center items-center">
          <div className="w-[75px] h-[75px]">
            <Image
              className="w-full object-cover"
              src={track.coverImage ?? DEFAULT_COVER_IMAGE}
              width={1500}
              height={1500}
              alt=""
              placeholder="blur"
              blurDataURL={IMAGE_MD_BLUR_DATA_URL}
            />
          </div>
          <div className="flex flex-grow justify-center items-center">
            <div className="flex flex-grow flex-row justify-center items-center space-x-5">
              <div className="flex flex-row justify-center items-center space-x-3">
                <ButtonCircle
                  dark
                  size="small"
                  icon={<PlayPrev />}
                  onClick={() => audioPlayer.playPreviousMusic()}
                />
                <ButtonCircle
                  dark={false}
                  size="big"
                  icon={
                    audioPlayer.isPlaying ? (
                      <Pause width={34} height={34} />
                    ) : (
                      <Play width={24} height={24} />
                    )
                  }
                  onClick={() => {
                    if (audioPlayer.isPlaying) {
                      audioPlayer.pause();
                    } else {
                      audioPlayer.play();
                    }
                  }}
                />
                <ButtonCircle
                  dark
                  size="small"
                  icon={<PlayNext />}
                  onClick={() => audioPlayer.playNextMusic()}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioControl;
