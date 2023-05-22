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
import Album from "@/components/Icons/Album";
import LiveStreamSettingsModal from "@/components/LiveStreamSettingsModal";
import AudioSlider from "@/components/AudioSlider";

import { useShareValues } from "@/contexts/contextShareData";
import { useSizeValues } from "@/contexts/contextSize";

import useOutsideClick from "@/hooks/useOutsideClick";

import {
  DATE_FORMAT,
  IMAGE_BLUR_DATA_URL,
  PLACEHOLDER_IMAGE,
  VIEW_MODE,
} from "@/libs/constants";

import { IVideoPlayer } from "@/interfaces/IVideoPlayer";

type Props = {
  videoPlayer: IVideoPlayer;
  viewMode: VIEW_MODE;
  onListView: Function;
  onPlayLivestream: Function;
  onFullScreenViewOn: Function;
  onFullScreenViewOff: Function;
  isFullScreenView: boolean;
};

const VideoControl = ({
  videoPlayer,
  viewMode,
  onListView,
  onPlayLivestream,
  isFullScreenView,
  onFullScreenViewOn,
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
            className="fixed bottom-0 flex flex-col justify-start items-start bg-background border-l border-[#464646] ml-[1px] z-50"
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
                  src={
                    videoPlayer.getPlayingTrack().coverImage ??
                    PLACEHOLDER_IMAGE
                  }
                  width={1500}
                  height={1500}
                  alt=""
                  placeholder="blur"
                  blurDataURL={IMAGE_BLUR_DATA_URL}
                  priority
                />
              </div>
              <div className="relative flex flex-grow h-full flex-col justify-start items-center">
                <div className="relative w-full h-1 bg-[#363636] z-0">
                  {viewMode == VIEW_MODE.VIDEO && (
                    <div className="absolute left-0 top-0 w-full h-full z-0">
                      <AudioSlider
                        min={0}
                        max={videoPlayer.duration}
                        value={videoPlayer.trackProgress}
                        step={1}
                        onChange={(value: number) => videoPlayer.onScrub(value)}
                      />
                    </div>
                  )}
                </div>

                <div className="relative w-full h-full flex flex-row px-2 lg:px-10 justify-between items-center space-x-2 z-10">
                  <div className="flex flex-row justify-start items-center space-x-5 w-1/4">
                    <ButtonCircle
                      dark
                      size="small"
                      icon={
                        viewMode == VIEW_MODE.LIST ? (
                          <Album width={24} height={24} />
                        ) : (
                          <List width={24} height={24} />
                        )
                      }
                      onClick={() => {
                        onListView();
                      }}
                    />
                    <div className="hidden lg:flex flex-col w-2/3 justify-center items-start space-y-1 truncate">
                      <h2 className="w-full text-primary text-left text-lg md:text-xl font-semibold truncate">
                        {videoPlayer.getPlayingTrack().title}
                      </h2>
                      <p className="text-secondary text-left text-sm truncate">
                        {videoPlayer.getPlayingTrack().singer?.artistName}
                      </p>
                      <p className="text-[red] text-left text-sm truncate">
                        *LIVE{" "}
                        {moment(
                          videoPlayer.getPlayingTrack().releaseDate
                        ).format(DATE_FORMAT)}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-grow flex-row justify-center items-center space-x-5">
                    <ButtonCircle
                      dark
                      size="small"
                      icon={<PlayPrev />}
                      onClick={() => videoPlayer.playPreviousVideo()}
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
                      onClick={() => onPlayLivestream()}
                    />
                    <ButtonCircle
                      dark
                      size="small"
                      icon={<PlayNext />}
                      onClick={() => videoPlayer.playNextVideo()}
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
                      onClick={() => onFullScreenViewOn()}
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
                    onClick={() => onFullScreenViewOn()}
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
                {viewMode == VIEW_MODE.VIDEO && (
                  <div className="absolute left-0 top-0 w-full h-full">
                    <AudioSlider
                      min={0}
                      max={videoPlayer.duration}
                      value={videoPlayer.trackProgress}
                      step={1}
                      onChange={(value: number) => videoPlayer.onScrub(value)}
                    />
                  </div>
                )}
              </div>
              <div className="w-full h-[75px] flex justify-center items-center">
                <div className="w-[75px] h-[75px]">
                  <Image
                    className="w-full object-cover h-full"
                    src={
                      videoPlayer.getPlayingTrack().coverImage ??
                      PLACEHOLDER_IMAGE
                    }
                    width={1500}
                    height={1500}
                    alt=""
                    placeholder="blur"
                    blurDataURL={IMAGE_BLUR_DATA_URL}
                    priority
                  />
                </div>
                <div className="flex flex-grow justify-center items-center">
                  <div className="flex flex-grow flex-row justify-center items-center space-x-5">
                    <div className="flex flex-row justify-center items-center space-x-3">
                      <ButtonCircle
                        dark
                        size="small"
                        icon={<PlayPrev />}
                        onClick={() => videoPlayer.playPreviousVideo()}
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
                        onClick={onPlayLivestream}
                      />
                      <ButtonCircle
                        dark
                        size="small"
                        icon={<PlayNext />}
                        onClick={() => videoPlayer.playNextVideo()}
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
