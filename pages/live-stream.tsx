import React from "react";
import { useRef, useState, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import moment from "moment";

import Layout from "@/components/Layout";
import Play from "@/components/Icons/Play";
import ButtonCircle from "@/components/ButtonCircle/index";
import VideoControl from "@/components/VideoControl";
import LiveStreamListCard from "@/components/LiveStreamListCard";
import LiveStreamPreview from "@/components/LiveStreamPreview";
import LiveStreamMetadataModal from "@/components/LiveStreamMetadataModal";
import Switch from "@/components/Switch";
import DonationModal from "@/components/DonationModal";
import ViewExclusiveModal from "@/components/ViewExclusiveModal";
import Loading from "@/components/Loading";
import {
  LIVESTREAM_CARD_NORMAL_WIDTH_DESKTOP,
  LIVESTREAM_CARD_NORMAL_WIDTH_MOBILE,
} from "@/components/LiveStreamListCard";
import LiveStreamCommentModal from "@/components/LiveStreamCommentModal";
import ShareModal from "@/components/ShareModal";

import { useAuthValues } from "@/contexts/contextAuth";
import { useSizeValues } from "@/contexts/contextSize";
import { useShareValues } from "@/contexts/contextShareData";

import useVideoPlayer from "@/hooks/useVideoplayer";
import useLivestream from "@/hooks/useLivestream";
import useFanclub from "@/hooks/useFanclub";

import { ASSET_TYPE, DATE_FORMAT, LIVESTREAM_QUALITY } from "@/libs/constants";

import { IStream, DEFAULT_STREAM } from "@/interfaces/IStream";
import { DEFAULT_ARTIST, IArtist } from "@/interfaces/IArtist";

export default function LiveStream() {
  const videoRef = useRef(null);
  const scrollRef = useRef(null);

  const livestreamScrollRef = useRef(null);
  const {
    isMobile,
    isSidebarVisible,
    contentWidth,
    setIsSidebarVisible,
    isTopbarVisible,
    setIsTopbarVisible,
  } = useSizeValues();
  const {
    setIsLivestreamCommentVisible,
    setIsViewExclusiveModalVisible
  } = useShareValues();
  const { isSignedIn, isMembership } = useAuthValues();
  const { isLoading, fetchLivestreams } = useLivestream();
  const { fetchArtist } = useFanclub();

  const [livestreams, setLivestreams] = useState<Array<IStream>>([]);
  const [activeWidth, setActiveWidth] = useState<number>(0);
  const [isExclusive, setIsExclusive] = useState<boolean>(false);
  const [playingIndex, setPlayingIndex] = useState<number>(0);
  const [isListView, setIsListView] = useState<boolean>(false);
  const [isFullScreenView, setIsFullScreenView] = useState<boolean>(false);
  const [playingTrack, setPlayingTrack] = useState<IStream>(DEFAULT_STREAM);
  const [totalPageCount, setTotalPageCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(0);
  const [hours, setHours] = useState<number>(0);
  const [artist, setArtist] = useState<IArtist>(DEFAULT_ARTIST);

  const videoPlayer = useVideoPlayer(videoRef);

  const onListView = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setIsListView(!isListView);
    setIsSidebarVisible(!isSidebarVisible);
    if (isListView) {
      videoPlayer.pause();
    } else {
      videoPlayer.play();
    }
  };

  const getLivestreams = (page: number) => {
    return new Promise<boolean>((resolve, _) => {
      fetchLivestreams(page, isExclusive)
        .then((data) => {
          // const newLivestream = livestreams.slice();
          // newLivestream.push(...data.livestreams);
          const newLivestream = data.livestreams;
          setLivestreams(newLivestream);

          setTotalPageCount(data.pages);
          setSize(data.size);
          setHours(data.hours);

          // For the first loading, to avoid null playing track
          if (playingIndex == 0 && newLivestream.length > 0) {
            setPlayingTrack(newLivestream[0]);
            videoPlayer.setTrack(newLivestream[0]);
          }

          if (data.livestreams.length > 0 && page < data.pages) {
            resolve(true);
          } else {
            resolve(false);
          }
        })
        .catch((_) => {
          setLivestreams([]);
          resolve(false);
        });
    });
  };

  const onPrevMusic = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setPlayingIndex((prev) => {
      if (prev > 0) return prev - 1;
      return prev;
    });
  };

  const onNextMusic = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setPlayingIndex((prev) => {
      if (prev < livestreams.length - 1) return prev + 1;
      return prev;
    });
  };

  const onFullScreenView = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (!videoPlayer.isPlaying) {
      videoPlayer.play();
    }
    setIsFullScreenView(true);
    setIsListView(true);
    setIsSidebarVisible(false);
    setIsTopbarVisible(false);
    setIsLivestreamCommentVisible(false);
  };

  const onFullScreenViewOff = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    setIsFullScreenView(false);
    setIsTopbarVisible(true);
  };

  const onPlayMusic = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (videoPlayer.isPlaying) {
      videoPlayer.pause();
    } else {
      videoPlayer.play();
    }
    setIsListView(!isListView);
    setIsSidebarVisible(!isSidebarVisible);
  };

  const onWheel = (e: React.WheelEvent<HTMLDivElement>, ref: any) => {
    if (e.deltaY == 0) return;
    e.preventDefault();
    // @ts-ignore
    ref.current.scrollTo({
      // @ts-ignore
      left: ref.current.scrollLeft + e.deltaY,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const playingTrack = livestreams[playingIndex];
    if (playingTrack) {
      setPlayingTrack(playingTrack);
      videoPlayer.setTrack(playingTrack);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playingIndex]);

  useEffect(() => {
    if (isSignedIn) {
      setPage(1);
      getLivestreams(1);

      if (isExclusive && !isMembership) {
        setIsViewExclusiveModalVisible(true);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn, isExclusive]);

  useEffect(() => {
    setActiveWidth(
      (isMobile
        ? LIVESTREAM_CARD_NORMAL_WIDTH_MOBILE
        : LIVESTREAM_CARD_NORMAL_WIDTH_DESKTOP) + 40
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile, contentWidth]);

  useEffect(() => {
    if (scrollRef && scrollRef.current && !isListView) {
      // @ts-ignore
      scrollRef.current.scrollLeft = activeIndex * activeWidth;
    }

    fetchArtist().then((data) => {
      if (data) {
        setArtist(data);
      }
    });

    // Check scroll reach the end
    // if (playingIndex == livestreams.length - 1) {
    //   getLivestreams(page + 1).then((value) => {
    //     if (value) {
    //       setPage((prev) => prev + 1);
    //     }
    //   });
    // }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playingIndex, scrollRef, activeWidth, isListView]);

  const listView = (
    <div className="relative w-full min-h-[924px] max-h-screen h-screen flex flex-col justify-start items-center overflow-x-hidden bg-[#272828] overflow-y-auto">
      <div className="relative w-full h-auto max-h-[50%] flex-grow flex flex-col justify-start items-center z-0">
        <div className="absolute top-0 left-0 py-5 px-7 w-full z-20">
          <h1
            className={twMerge(
              "text-primary text-2xl md:text-4xl font-sans tracking-wider",
              isSidebarVisible ? "pl-16 md:pl-0" : "pl-16"
            )}
          >
            {artist.firstName} Live Streams
          </h1>
          <h5
            className={twMerge(
              "font-medium text-gray-500 tracking-widest",
              isSidebarVisible ? "pl-16 md:pl-0" : "pl-16"
            )}
          >
            {size} CONCERTS, {hours.toFixed(2)} HOURS
          </h5>
        </div>

        <LiveStreamPreview track={playingTrack} />

        <div className="absolute top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center py-8 sm:py -8 lg:py-8 w-4/5 z-10 filter">
          <div className="w-full flex-col justify-end md:justify-center items-center text-primary pb-5">
            <p className="text-center text-primary text-2xl md:text-4xl tracking-widest mb-2">
              {artist.artistName}
            </p>
            {livestreams[playingIndex] && (
              <h1 className="text-center text-primary text-2xl md:text-4xl mb-2 tracking-widest">
                {livestreams[playingIndex].title}
              </h1>
            )}
            {livestreams[playingIndex] && (
              <p className="text-center text-primary text-md md:text-xl mb-2 tracking-widest">
                {livestreams[playingIndex].shortDescription}
              </p>
            )}
            {livestreams[playingIndex] && (
              <p className="text-center text-primary text-md md:text-xl mb-2 tracking-widest">
                {moment(livestreams[playingIndex].releaseDate).format(
                  DATE_FORMAT
                )}
              </p>
            )}

            <ButtonCircle
              dark={false}
              size="big"
              icon={<Play width={35} height={35} />}
              onClick={onPlayMusic}
            />
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col justify-start items-start space-y-10 py-5 z-0">
        <div className="w-full flex flex-col justify-start items-start px-5">
          <div
            ref={livestreamScrollRef}
            className="w-full flex flex-row overflow-x-auto overflow-y-hidden overscroll-contain z-10"
            onWheel={(e) => onWheel(e, livestreamScrollRef)}
            style={{ scrollBehavior: "unset" }}
          >
            <div className="w-fit py-2 flex flex-row justify-start items-start gap-10">
              {livestreams.map((livestream, index) => {
                return (
                  <LiveStreamListCard
                    playing={livestream.id == playingTrack.id}
                    soundStatus={
                      livestream.id == playingTrack.id
                        ? videoPlayer.isPlaying
                          ? "playing"
                          : "paused"
                        : "none"
                    }
                    livestream={livestream}
                    togglePlay={onPlayMusic}
                    play={() => {
                      setPlayingIndex(index);
                    }}
                    key={index}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const fullScreenView = (
    <div
      id="livestreamfullview"
      className="relative w-full min-h-[924px] max-h-screen h-screen flex flex-col justify-start items-center overflow-x-hidden overflow-y-auto z-10"
    >
      <video
        ref={videoRef}
        loop
        muted
        autoPlay
        playsInline
        src={videoPlayer.playingQuality == LIVESTREAM_QUALITY.LOW ? livestreams[playingIndex]?.fullVideoCompressed : livestreams[playingIndex]?.fullVideo}
        className="absolute top-08 h-full w-full object-cover"
      ></video>
    </div>
  );

  const pageContent = (
    <>
      <div className="relative w-full min-h-screen flex flex-col justify-start items-center">
        {!isMembership && (
          <div
            className={twMerge(
              "absolute top-2 z-10",
              isTopbarVisible ? "right-24 md:right-56" : "right-2"
            )}
          >
            <Switch
              checked={isExclusive}
              setChecked={setIsExclusive}
              label="Exclusive"
              labelPos="top"
            />
          </div>
        )}

        {isListView ? fullScreenView : listView}

        <VideoControl
          track={playingTrack}
          videoPlayer={videoPlayer}
          onListView={onListView}
          onNextMusic={onNextMusic}
          onPlayMusic={onPlayMusic}
          onPrevMusic={onPrevMusic}
          onFullScreenView={onFullScreenView}
          onFullScreenViewOff={onFullScreenViewOff}
          isFullScreenView={isFullScreenView}
        />
      </div>
    </>
  );

  const nullContent = (
    <div className="relative w-full h-screen bg-gradient-to-b from-activeSecondary to-activePrimary flex justify-center items-center">
      <p className="text-center text-secondary text-base font-medium">
        {isLoading ? <Loading width={40} height={40} /> : "No Live Streams"}
      </p>
    </div>
  );

  return (
    <Layout>
      {livestreams.length > 0 ? pageContent : nullContent}

      <LiveStreamMetadataModal />

      <LiveStreamCommentModal livestreamId={playingTrack.id} />

      <DonationModal
        assetType={ASSET_TYPE.LIVESTREAM}
        livestreamId={playingTrack.id}
      />

      <ViewExclusiveModal />

      <ShareModal />
    </Layout>
  );
}
