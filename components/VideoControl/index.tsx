import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import moment from "moment";
import { isMobile as isMobileDevice } from "react-device-detect";

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
  LIVESTREAM_QUALITY,
  PLACEHOLDER_IMAGE,
  VIEW_MODE,
} from "@/libs/constants";

import { IVideoPlayer } from "@/interfaces/IVideoPlayer";

type Props = {
  videoPlayer: IVideoPlayer;
  viewMode: VIEW_MODE;
  onListView: Function;
  onPlayLivestream: Function;
  onPrevVideo?: Function | null;
  onNextVideo?: Function | null;
};

const VideoControl = ({
  videoPlayer,
  viewMode,
  onListView,
  onPlayLivestream,
  onPrevVideo = null,
  onNextVideo = null,
}: Props) => {
  const livestreamsettingsmodalRefMd = useRef(null);
  const {
    isMobile,
    contentWidth,
    sidebarWidth,
    toggleFullscreen,
    setIsHamburgerVisible,
  } = useSizeValues();
  const {
    setIsDonationModalVisible,
    isLivestreamCommentVisible,
    setIsLivestreamCommentVisible,
  } = useShareValues();

  const [isSettingsModalMdVisible, setIsSettingsModalMdVisible] =
    useState<boolean>(false);
  const [isFullscreenView, setIsFullscreenView] = useState<boolean>(false);
  const [isMinimumButtonVisible, setIsMinimumButtonVisible] =
    useState<boolean>(false);

  useOutsideClick(livestreamsettingsmodalRefMd, () => {
    setIsSettingsModalMdVisible(false);
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

    if (isMobileDevice) {
      window.addEventListener("touchmove", hasMouseCheck, false);
    } else {
      window.addEventListener("mousemove", hasMouseCheck, false);
    }

    return () => {
      if (isMobileDevice) {
        window.removeEventListener("touchmove", hasMouseCheck, false);
      } else {
        window.removeEventListener("mousemove", hasMouseCheck, false);
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobileDevice]);

  useEffect(() => {
    if (isMobileDevice) {
      videoPlayer.setPlayingQuality(LIVESTREAM_QUALITY.LOW);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobileDevice, videoPlayer]);

  useEffect(() => {
    setIsHamburgerVisible(!isFullscreenView);
    toggleFullscreen(isFullscreenView);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFullscreenView]);

  return (
    <AnimatePresence>
      {(!isFullscreenView || isMinimumButtonVisible) && (
        <motion.div
          className="fixed bottom-0 flex flex-row justify-start items-start w-full h-24 lg:h-32 bg-background border-l border-[#464646] ml-[1px] z-50"
          initial={{ y: 100 }}
          animate={{ y: 1 }}
          exit={{ y: 100 }}
          transition={{ duration: 0.3 }}
          style={{ left: `${sidebarWidth}px`, width: `${contentWidth}px` }}
        >
          <div className="hidden md:flex w-24 h-24 lg:w-32 lg:h-32 min-w-[96px]">
            <Image
              className="object-cover h-full"
              src={
                videoPlayer.getPlayingTrack().coverImage ?? PLACEHOLDER_IMAGE
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
                    *LIVE&nbsp;
                    {moment(videoPlayer.getPlayingTrack().releaseDate).format(
                      DATE_FORMAT
                    )}
                  </p>
                </div>
              </div>
              <div className="flex flex-grow flex-row justify-center items-center space-x-1 lg:space-x-5">
                <ButtonCircle
                  dark
                  size="small"
                  icon={<PlayPrev />}
                  onClick={() =>
                    onPrevVideo
                      ? onPrevVideo()
                      : videoPlayer.playPreviousVideo()
                  }
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
                  onClick={() =>
                    onNextVideo ? onNextVideo() : videoPlayer.playNextVideo()
                  }
                />
              </div>

              <div className="flex flex-row justify-end items-center space-x-2 xl:space-x-5 lg:w-2/5">
                <div className="hidden xs:flex">
                  <ButtonCircle
                    dark
                    size="small"
                    icon={<Setting width={24} height={24} />}
                    onClick={() => setIsSettingsModalMdVisible(true)}
                  />
                </div>
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
                    setIsLivestreamCommentVisible(!isLivestreamCommentVisible)
                  }
                />
                <ButtonCircle
                  dark={false}
                  size="small"
                  icon={
                    isFullscreenView ? (
                      <FullScreenClose width={20} height={20} />
                    ) : (
                      <FullScreen width={20} height={20} />
                    )
                  }
                  onClick={() => {
                    setIsFullscreenView(!isFullscreenView);
                    setIsMinimumButtonVisible(false);
                    setIsLivestreamCommentVisible(false);
                  }}
                />
                <ButtonVolume
                  size="small"
                  iconSize={20}
                  volume={videoPlayer.volume}
                  setVolume={videoPlayer.setVolume}
                />

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
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default VideoControl;
