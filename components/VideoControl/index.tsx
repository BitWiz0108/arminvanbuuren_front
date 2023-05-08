import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import moment from "moment";

import ButtonCircle from "@/components/ButtonCircle";
import ButtonVolume from "@/components/ButtonVolume";
import List from "@/components/Icons/List";
import PlayPrev from "@/components/Icons/PlayPrev";
import FullScreen from "@/components/Icons/FullScreen";
import FullScreenClose from "@/components/Icons/FullScreenClose";
import Pause from "@/components/Icons/Pause";
import Play from "@/components/Icons/Play";
import PlayNext from "@/components/Icons/PlayNext";
import Setting from "@/components/Icons/Setting";
import Donate from "@/components/Icons/Donate";
import Comment from "@/components/Icons/Comment";
import LiveStreamSettingsModal from "@/components/LiveStreamSettingsModal";

import {
  DATE_FORMAT,
  DEFAULT_COVER_IMAGE,
  IMAGE_MD_BLUR_DATA_URL,
} from "@/libs/constants";

import { useShareValues } from "@/contexts/contextShareData";
import { useSizeValues } from "@/contexts/contextSize";

import useOutsideClick from "@/hooks/useOutsideClick";

import { IStream } from "@/interfaces/IStream";

type Props = {
  track: IStream;
  videoPlayer: any;
  onListView: Function;
  onPrevMusic: Function;
  onPlayMusic: Function;
  onNextMusic: Function;
  onFullScreenView: Function;
  onFullScreenViewOff: Function;
  isFullScreenView: boolean;
};

const VideoControl = ({
  track,
  videoPlayer,
  onListView,
  onPrevMusic,
  onPlayMusic,
  onNextMusic,
  onFullScreenView,
  isFullScreenView,
  onFullScreenViewOff,
}: Props) => {
  const livestreamsettingsmodalRefMd = useRef(null);
  const livestreamsettingsmodalRefSm = useRef(null);
  const { contentWidth, sidebarWidth } = useSizeValues();
  const {
    setIsDonationModalVisible,
    isLivestreamCommentVisible,
    setIsLivestreamCommentVisible,
  } = useShareValues();

  const [isSettingsModalMdVisible, setIsSettingsModalMdVisible] =
    useState<boolean>(false);
  const [isSettingsModalSmVisible, setIsSettingsModalSmVisible] =
    useState<boolean>(false);

  const [isMinimumButtonVisible, setIsMinimumButtonVisible] =
    useState<boolean>(false);

  useOutsideClick(livestreamsettingsmodalRefMd, () => {
    setIsSettingsModalMdVisible(false);
  });

  useOutsideClick(livestreamsettingsmodalRefSm, () => {
    setIsSettingsModalSmVisible(false);
  });

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const hasMouseCheck = () => {
      setIsMinimumButtonVisible(true);

      clearTimeout(timeout);

      timeout = setTimeout(() => {
        setIsMinimumButtonVisible(false);
      }, 2000);
    };

    window.addEventListener("mousemove", hasMouseCheck, false);

    return () => window.removeEventListener("mousemove", hasMouseCheck, false);
  }, []);

  return (
    <>
      <AnimatePresence>
        {!isFullScreenView && (
          <motion.div
            className="fixed bottom-0 flex flex-col justify-start items-start bg-background z-50"
            initial={{ y: 100 }}
            animate={{ y: 1 }}
            exit={{ y: 100 }}
            transition={{ duration: 0.3 }}
            style={{ left: `${sidebarWidth}px`, width: `${contentWidth}px` }}
          >
            <div className="hidden w-full h-32 xs:flex flex-row justify-start items-start">
              <div className="h-32 w-[128px] hidden md:flex">
                <Image
                  className="object-cover h-full"
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
                      width: `${videoPlayer.currentPercentage}%`,
                    }}
                  ></div>
                </div>

                <div className="w-full h-full flex flex-row px-2 lg:px-10 justify-between items-center space-x-2">
                  <div className="flex flex-row justify-start items-center space-x-5 w-1/4">
                    <ButtonCircle
                      dark
                      size="small"
                      icon={<List width={24} height={24} />}
                      onClick={() => {
                        onListView();
                      }}
                    />
                    <div className="hidden lg:flex flex-col w-2/3 justify-center items-start space-y-1 truncate">
                      <h2 className="w-full text-primary text-left text-lg md:text-xl font-semibold truncate">
                        {track.title}
                      </h2>
                      <p className="text-secondary text-left text-sm truncate">
                        {track.singer?.artistName}
                      </p>
                      <p className="text-[red] text-left text-sm truncate">
                        *LIVE {moment(track.releaseDate).format(DATE_FORMAT)}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-grow flex-row justify-center items-center space-x-5">
                    <ButtonCircle
                      dark
                      size="small"
                      icon={<PlayPrev />}
                      onClick={() => onPrevMusic()}
                    />
                    <ButtonCircle
                      dark={false}
                      size="big"
                      icon={
                        videoPlayer.isPlaying ? (
                          <Pause width={40} height={40} />
                        ) : (
                          <Play width={34} height={34} />
                        )
                      }
                      onClick={() => onPlayMusic()}
                    />
                    <ButtonCircle
                      dark
                      size="small"
                      icon={<PlayNext />}
                      onClick={() => onNextMusic()}
                    />
                  </div>

                  <div className="flex flex-row justify-end items-center space-x-2 xl:space-x-5 lg:w-2/5">
                    <ButtonCircle
                      dark
                      size="small"
                      icon={<Setting width={24} height={24} />}
                      onClick={() => setIsSettingsModalMdVisible(true)}
                    />
                    <ButtonCircle
                      dark={false}
                      size="small"
                      icon={<Donate width={20} height={20} />}
                      onClick={() => setIsDonationModalVisible(true)}
                    />

                    <ButtonCircle
                      dark={isLivestreamCommentVisible}
                      size="small"
                      icon={<Comment width={20} height={20} />}
                      onClick={() =>
                        setIsLivestreamCommentVisible(
                          !isLivestreamCommentVisible
                        )
                      }
                    />

                    <ButtonCircle
                      dark={false}
                      size="small"
                      icon={
                        <FullScreen
                          width={24}
                          height={24}
                          className="text-background"
                        />
                      }
                      onClick={() => onFullScreenView()}
                    />

                    <div className="hidden lg:flex">
                      <ButtonVolume
                        size="small"
                        iconSize={20}
                        volume={videoPlayer.volume}
                        setVolume={videoPlayer.setVolume}
                      />
                    </div>

                    <AnimatePresence>
                      {isSettingsModalMdVisible && (
                        <motion.div
                          key={"settingsModalMD"}
                          ref={livestreamsettingsmodalRefMd}
                          className="absolute bottom-24 right-0 lg:right-32 w-60"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <LiveStreamSettingsModal
                            close={() => setIsSettingsModalMdVisible(false)}
                            videoPlayer={videoPlayer}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex w-full xs:hidden flex-col justify-start items-start">
              <div className="w-full flex flex-row justify-between items-center px-2 py-3">
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
                    onClick={() => setIsSettingsModalSmVisible(true)}
                  />
                  <ButtonCircle
                    dark={false}
                    size="small"
                    icon={<Donate width={18} height={18} />}
                    onClick={() => setIsDonationModalVisible(true)}
                  />
                  <ButtonCircle
                    dark={false}
                    size="small"
                    icon={<Comment width={20} height={20} />}
                    onClick={() =>
                      setIsLivestreamCommentVisible(!isLivestreamCommentVisible)
                    }
                  />
                  <ButtonCircle
                    dark={false}
                    size="small"
                    icon={<FullScreen width={24} height={24} />}
                    onClick={() => onFullScreenView()}
                  />
                  <AnimatePresence>
                    {isSettingsModalSmVisible && (
                      <motion.div
                        key={"settingsModalSM"}
                        ref={livestreamsettingsmodalRefSm}
                        className="absolute bottom-16 right-0 w-60"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <LiveStreamSettingsModal
                          close={() => setIsSettingsModalSmVisible(false)}
                          videoPlayer={videoPlayer}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              <div className="relative w-full h-1 bg-[#363636]">
                <div
                  className="absolute left-0 top-0 h-full bg-blueSecondary"
                  style={{ width: `${videoPlayer.currentPercentage}%` }}
                ></div>
              </div>
              <div className="w-full h-[75px] flex justify-center items-center">
                <div className="w-[75px] h-[75px]">
                  <Image
                    className="w-full object-cover h-full"
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
                        onClick={onPrevMusic}
                      />
                      <ButtonCircle
                        dark={false}
                        size="big"
                        icon={
                          videoPlayer.isPlaying ? (
                            <Pause width={34} height={34} />
                          ) : (
                            <Play width={24} height={24} />
                          )
                        }
                        onClick={onPlayMusic}
                      />
                      <ButtonCircle
                        dark
                        size="small"
                        icon={<PlayNext />}
                        onClick={onNextMusic}
                      />
                    </div>

                    <ButtonVolume
                      size="small"
                      iconSize={20}
                      volume={videoPlayer.volume}
                      setVolume={videoPlayer.setVolume}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFullScreenView && isMinimumButtonVisible && (
          <motion.div
            className="fixed bottom-10 right-10 flex flex-col justify-start items-start z-50"
            initial={{ y: 100 }}
            animate={{ y: 1 }}
            exit={{ y: 100 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className="w-10 h-10 rounded-full bg-[#00000055] hover:bg-[#000000bb] text-secondary hover:text-primary flex justify-center items-center cursor-pointer transition-all duration-300"
              onClick={() => onFullScreenViewOff()}
            >
              <FullScreenClose width={18} height={18} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
export default VideoControl;
