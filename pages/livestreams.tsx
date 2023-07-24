/* eslint-disable @next/next/no-img-element */
import React from "react";
import { useRouter } from "next/router";
import { useRef, useState, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import moment from "moment";
import { isMobile as isMobileDevice } from "react-device-detect";

import Layout from "@/components/Layout";
import Play from "@/components/Icons/Play";
import HeartFill from "@/components/Icons/HeartFill";
import Heart from "@/components/Icons/Heart";
import Share from "@/components/Icons/Share";
import ButtonCircle from "@/components/ButtonCircle/index";
import AudioControl from "@/components/AudioControl";
import VideoControl from "@/components/VideoControl";
import LiveStreamListCard from "@/components/LiveStreamListCard";
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

import {
  APP_TYPE,
  ASSET_TYPE,
  DATE_FORMAT,
  LOADING_GIF,
  PAGE_LIMIT,
  SITE_BASE_URL,
  SYSTEM_TYPE,
  VIEW_MODE,
} from "@/libs/constants";
import { getUrlFormattedTitle } from "@/libs/utils";

import { IStream } from "@/interfaces/IStream";
import { DEFAULT_CATEGORY, ICategory } from "@/interfaces/ICategory";
import { DEFAULT_SHAREDATA } from "@/interfaces/IShareData";

export default function LiveStreams() {
  const videoRef = useRef(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const livestreamScrollRef = useRef(null);
  const router = useRouter();

  const {
    height,
    isMobile,
    isSidebarVisible,
    contentWidth,
    setIsSidebarVisible,
    isTopbarVisible,
    setIsTopbarVisible,
    toggleFullscreen,
  } = useSizeValues();
  const {
    artist,
    setIsViewExclusiveModalVisible,
    setIsLivestreamCommentVisible,
    setIsMetaVisible,
    setIsShareModalVisible,
    setShareData,
    audioPlayer,
  } = useShareValues();
  const { isSignedIn, isMembership, isAdmin } = useAuthValues();
  const {
    isLoading,
    fetchLivestreams,
    fetchAllCategories,
    fetchCategoryLivestreams,
    toggleLivestreamFavorite,
  } = useLivestream();

  const [categoryId, setCategoryId] = useState<number | null>(
    DEFAULT_CATEGORY.id
  );
  const [allLivestreams, setAllLivestreams] = useState<Array<IStream>>([]);
  const [categories, setCategories] = useState<Array<ICategory>>([]);
  const [livestreams, setLivestreams] = useState<Array<IStream>>([]);
  const [activeWidth, setActiveWidth] = useState<number>(0);
  const [isExclusive, setIsExclusive] = useState<boolean>(false);
  const [totalPageCount, setTotalPageCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(0);
  const [hours, setHours] = useState<number>(0);
  const [viewMode, setViewMode] = useState<VIEW_MODE>(VIEW_MODE.CATEGORY);
  const [isPreviewVideoLoading, setIsPreviewVideoLoading] = useState(true);

  const videoPlayer = useVideoPlayer(videoRef.current!);

  const getAllLivestreams = (page: number, fresh: boolean = false) => {
    return new Promise<boolean>((resolve, _) => {
      fetchLivestreams(page, isExclusive)
        .then((data) => {
          let newLivestreams: Array<IStream> = [];
          if (fresh) {
            newLivestreams.push(...data.livestreams);
          } else {
            newLivestreams = allLivestreams.slice();
            newLivestreams.push(...data.livestreams);
          }

          setAllLivestreams(newLivestreams);
          setLivestreams(newLivestreams);
          videoPlayer.setVideos(newLivestreams);

          setTotalPageCount(data.pages);
          setSize(data.size);
          setHours(data.hours);

          // For the first loading, to avoid null playing track
          if (videoPlayer.playingIndex == 0 && newLivestreams.length > 0) {
            videoPlayer.setPlayingIndex(0);
          }

          if (data.livestreams.length > 0 && page < data.pages) {
            resolve(true);
          } else {
            resolve(false);
          }
        })
        .catch((_) => {
          setAllLivestreams([]);
          resolve(false);
        });
    });
  };

  const getCategoryLivestreams = (page: number) => {
    return new Promise<boolean>((resolve, _) => {
      fetchCategoryLivestreams(categoryId, page, isExclusive)
        .then((data) => {
          const categoryIndex = categories.findIndex(
            (item) => item.id == categoryId
          );
          if (categoryIndex >= 0) {
            const tcategories = categories.slice();
            tcategories[categoryIndex].livestreams.push(...data);
            setCategories(tcategories);
            setLivestreams(tcategories[categoryIndex].livestreams);
            videoPlayer.setVideos(tcategories[categoryIndex].livestreams);

            // For the first loading, to avoid null playing track
            if (videoPlayer.playingIndex == 0) {
              videoPlayer.setPlayingIndex(0);
            }

            if (data.length > 0) {
              resolve(true);
            } else {
              resolve(false);
            }
          }
        })
        .catch((_) => {
          setCategories([]);
          resolve(false);
        });
    });
  };

  const getCategoryById = () => {
    const categoryIndex = categories.findIndex((item) => item.id == categoryId);
    if (categoryIndex >= 0) {
      return categories[categoryIndex];
    }
    return DEFAULT_CATEGORY;
  };

  const onListView = () => {
    if (videoPlayer.isPlaying) {
      videoPlayer.pause();
    }

    switch (viewMode) {
      case VIEW_MODE.CATEGORY:
        setViewMode(VIEW_MODE.LIST);
        break;
      case VIEW_MODE.LIST:
        setViewMode(VIEW_MODE.CATEGORY);
        break;
      case VIEW_MODE.VIDEO:
        setViewMode(VIEW_MODE.LIST);
        break;
    }
  };

  const onPlayLivestream = () => {
    if (videoPlayer.isPlaying) {
      videoPlayer.pause();
    } else {
      setTimeout(() => {
        videoPlayer.play();
      }, 100);
      setViewMode(VIEW_MODE.VIDEO);
    }
  };

  const onHeart = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    toggleLivestreamFavorite(
      livestreams[videoPlayer.playingIndex].id,
      !livestreams[videoPlayer.playingIndex].isFavorite
    ).then((value) => {
      if (value) {
        const tlivestreams = livestreams.slice();
        tlivestreams[videoPlayer.playingIndex].isFavorite =
          !tlivestreams[videoPlayer.playingIndex].isFavorite;
        setLivestreams(tlivestreams);
      }
    });
  };

  const onShare = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setShareData({
      ...DEFAULT_SHAREDATA,
      url: `${SITE_BASE_URL}${getUrlFormattedTitle(
        videoPlayer.getPlayingTrack(),
        "livestream"
      )}`,
      title: videoPlayer.getPlayingTrack().title,
      subject: videoPlayer.getPlayingTrack().title,
      quote: videoPlayer.getPlayingTrack().title,
      about: videoPlayer.getPlayingTrack().description,
      body: videoPlayer.getPlayingTrack().description,
      summary: videoPlayer.getPlayingTrack().title,
    });
    setIsShareModalVisible(true);
  };

  // const onWheel = (
  //   e: React.WheelEvent<HTMLDivElement>,
  //   ref: any,
  //   element: boolean = false
  // ) => {
  //   if (!ref || !ref.current) return;
  //   if (e.deltaY == 0) return;

  //   if (element) {
  //     ref.scrollTo({
  //       left: ref.current.scrollLeft + e.deltaY,
  //       behavior: "smooth",
  //     });
  //   } else {
  //     ref.current.scrollTo({
  //       left: ref.current.scrollLeft + e.deltaY,
  //       behavior: "smooth",
  //     });
  //   }
  // };

  useEffect(() => {
    if (isSignedIn) {
      setPage(1);

      getAllLivestreams(1, true);

      fetchAllCategories(1, isExclusive).then((categories) => {
        setCategories(categories);
      });

      if (isExclusive && !isMembership) {
        setIsViewExclusiveModalVisible(true);

        setTimeout(() => {
          setIsExclusive(false);
        }, 500);
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
    if (scrollRef && scrollRef.current && viewMode == VIEW_MODE.LIST) {
      scrollRef.current.scrollLeft = videoPlayer.playingIndex * activeWidth;
    }

    // Check scroll reach the end
    // if (playingIndex == livestreams.length - 1) {
    //   getLivestreams(page + 1).then((value) => {
    //     if (value) {
    //       setPage((prev) => prev + 1);
    //     }
    //   });
    // }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoPlayer.playingIndex, scrollRef, activeWidth, viewMode]);

  useEffect(() => {
    setIsMetaVisible(false);
    setIsLivestreamCommentVisible(false);

    switch (viewMode) {
      case VIEW_MODE.CATEGORY:
        setIsSidebarVisible(true);
        setIsTopbarVisible(true);
        audioPlayer.play();
        toggleFullscreen(false);
        break;
      case VIEW_MODE.LIST:
        setIsSidebarVisible(true);
        setIsTopbarVisible(true);
        audioPlayer.play();
        toggleFullscreen(false);
        break;
      case VIEW_MODE.VIDEO:
        setIsSidebarVisible(false);
        setIsTopbarVisible(false);
        audioPlayer.pause();
        if (isMobileDevice) {
          toggleFullscreen(true);
        }
        break;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode, isMobileDevice]);

  useEffect(() => {
    if (isPreviewVideoLoading) {
      setTimeout(() => setIsPreviewVideoLoading(false), 3000);
    }
  }, [isPreviewVideoLoading]);

  const listView = (
    <div className="relative w-full min-h-[768px] md:min-h-[924px] max-h-screen h-screen flex flex-col justify-start items-center overflow-x-hidden bg-background overflow-y-auto">
      <div
        className={twMerge(
          "relative w-full h-auto flex-grow flex flex-col justify-start items-center z-0",
          height > 768 ? "max-h-[50%]" : "max-h-[40%]"
        )}
      >
        <div className="absolute top-0 left-0 py-5 px-7 w-full z-20">
          <h1
            className={twMerge(
              "text-primary text-sm md:text-2xl font-sans tracking-wider",
              isSidebarVisible ? "pl-16 md:pl-0" : "pl-16"
            )}
          >
            {categoryId == null ? artist.artistName : getCategoryById().name}
          </h1>
          <h5
            className={twMerge(
              "font-medium text-gray-500 tracking-widest text-xs",
              isSidebarVisible ? "pl-16 md:pl-0" : "pl-16"
            )}
          >
            {categoryId == null ? size : getCategoryById().size} VIDEOS,&nbsp;
            {(categoryId == null ? hours : getCategoryById().hours).toFixed(2)}
            &nbsp;&nbsp;HOURS
          </h5>
        </div>

        <video
          loop
          muted
          autoPlay
          playsInline
          disablePictureInPicture
          className="relative w-full h-full object-cover z-0 filter blur-[3px]"
          src={videoPlayer.getPlayingTrack().previewVideo}
          onLoadStart={() => setIsPreviewVideoLoading(true)}
          onLoadedData={() => setIsPreviewVideoLoading(false)}
        />

        {isPreviewVideoLoading && (
          <div className="sub-loading">
            <img
              className="w-16 h-16 object-cover"
              src={LOADING_GIF}
              alt="Loading"
            />
          </div>
        )}

        <div className="absolute top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center py-8 sm:py -8 lg:py-8 w-4/5 z-10 filter">
          <div className="w-full flex-col justify-end md:justify-center items-center text-primary pb-5">
            <p className="text-center text-primary text-xl md:text-2xl tracking-widest mb-2">
              {artist.artistName}
            </p>
            {videoPlayer.getPlayingTrack() && (
              <h1 className="text-center text-primary text-base md:text-2xl mb-2 tracking-widest">
                {videoPlayer.getPlayingTrack().title}
              </h1>
            )}
            {videoPlayer.getPlayingTrack() && (
              <p className="text-center text-primary text-sm md:text-lg mb-1 tracking-widest">
                {videoPlayer.getPlayingTrack().shortDescription}
              </p>
            )}
            {videoPlayer.getPlayingTrack() && (
              <p className="text-center text-primary text-sm md:text-base mb-1 tracking-widest">
                {moment(videoPlayer.getPlayingTrack().releaseDate).format(
                  DATE_FORMAT
                )}
              </p>
            )}

            {videoPlayer.getPlayingTrack() && (
              <div className="flex justify-center items-center space-x-4 mb-5">
                <div
                  className="cursor-pointer text-primary hover:text-activePrimary transition-all duration-300"
                  onClick={onHeart}
                >
                  {livestreams[videoPlayer.playingIndex]?.isFavorite ? (
                    <HeartFill width={22} height={22} />
                  ) : (
                    <Heart width={22} height={22} />
                  )}
                </div>
                <Share
                  width={20}
                  height={20}
                  className="text-primary hover:text-activePrimary transition-all duration-300 cursor-pointer"
                  onClick={onShare}
                />
              </div>
            )}

            <ButtonCircle
              dark={false}
              size="big"
              icon={<Play width={35} height={35} />}
              onClick={onPlayLivestream}
            />
          </div>
        </div>
      </div>
      <div
        className={twMerge(
          "w-full flex flex-col justify-start items-start space-y-10 z-0",
          height > 768 ? "py-5" : "py-1"
        )}
      >
        <div className="w-full flex flex-col justify-start items-start px-5">
          <div
            ref={livestreamScrollRef}
            className="w-full flex flex-row overflow-x-auto overflow-y-hidden overscroll-contain z-10 pb-1"
            // onWheel={(e) => onWheel(e, livestreamScrollRef)}
            // style={{ scrollBehavior: "unset" }}
            data-simplebar
            data-simplebar-auto-hide="false"
          >
            <div className="w-fit py-2 flex flex-row justify-start items-start gap-10">
              {livestreams.map((livestream, index) => {
                return (
                  <LiveStreamListCard
                    playing={livestream.id == videoPlayer.getPlayingTrack().id}
                    soundStatus={
                      livestream.id == videoPlayer.getPlayingTrack().id
                        ? videoPlayer.isPlaying
                          ? "playing"
                          : "paused"
                        : "none"
                    }
                    livestream={livestream}
                    togglePlay={onPlayLivestream}
                    play={() => {
                      videoPlayer.setPlayingIndex(index);
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

  const categoryView = (
    <div className="relative w-full min-h-screen flex flex-col justify-start items-start space-y-10 pt-5 pb-44 bg-background">
      {categories.map((category, index) => {
        return (
          <div
            key={index}
            className="w-full flex flex-col justify-start items-start px-5"
          >
            <h1
              className={twMerge(
                "text-primary text-base md:text-xl text-center",
                index == 0
                  ? isMobile
                    ? "pl-16"
                    : isSidebarVisible
                    ? "md:pl-0"
                    : "md:pl-16"
                  : "pl-0"
              )}
            >
              <span className="font-semibold">{category.name}</span>
            </h1>
            <p
              className={twMerge(
                "text-secondary text-xs md:text-sm text-center",
                index == 0
                  ? isMobile
                    ? "pl-16"
                    : isSidebarVisible
                    ? "md:pl-0"
                    : "md:pl-16"
                  : "pl-0"
              )}
            >
              {category.description}
            </p>
            <p
              className={twMerge(
                "text-secondary text-sm md:text-base text-center",
                index == 0
                  ? isMobile
                    ? "pl-16"
                    : isSidebarVisible
                    ? "md:pl-0"
                    : "md:pl-16"
                  : "pl-0"
              )}
            >
              <span className="font-semibold">
                {category.size} Video{category.size > 1 ? "s" : ""}
              </span>
              &nbsp;&nbsp;
              <span className="">{category.hours.toFixed(2)} Hours</span>
            </p>
            <div
              className="w-full flex flex-row overflow-x-auto overflow-y-hidden z-10 pb-1"
              data-simplebar
              data-simplebar-auto-hide="false"
            >
              <div className="w-fit py-2 flex flex-row justify-start items-start gap-10">
                {category.livestreams.map((livestream, index) => {
                  return (
                    <LiveStreamListCard
                      playing={
                        livestream.id == videoPlayer.getPlayingTrack().id &&
                        categoryId == category.id
                      }
                      soundStatus={
                        livestream.id == videoPlayer.getPlayingTrack().id &&
                        categoryId == category.id
                          ? videoPlayer.isPlaying
                            ? "playing"
                            : "paused"
                          : "none"
                      }
                      livestream={livestream}
                      togglePlay={() => {
                        if (videoPlayer.isPlaying) {
                          videoPlayer.pause();
                        } else {
                          setTimeout(() => {
                            videoPlayer.play();
                          }, 100);
                        }

                        setCategoryId(category.id);
                        setLivestreams(category.livestreams);
                        videoPlayer.setVideos(category.livestreams);
                        setPage(
                          Math.floor(category.livestreams.length / PAGE_LIMIT) +
                            1
                        );
                        videoPlayer.setPlayingIndex(index);
                        setViewMode(VIEW_MODE.VIDEO);
                      }}
                      play={() => {
                        setCategoryId(category.id);
                        setLivestreams(category.livestreams);
                        videoPlayer.setVideos(category.livestreams);
                        setPage(
                          Math.floor(category.livestreams.length / PAGE_LIMIT) +
                            1
                        );
                        videoPlayer.setPlayingIndex(index);
                        setViewMode(VIEW_MODE.LIST);
                      }}
                      key={index}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
      <div className="relative w-full flex flex-col justify-start items-start px-5">
        <h1
          className={twMerge(
            "text-primary text-base md:text-xl text-center",
            categories.length == 0
              ? isMobile
                ? "pl-16"
                : isSidebarVisible
                ? "md:pl-0"
                : "md:pl-16"
              : "pl-0"
          )}
        >
          <span className="font-semibold">All Livestreams</span>
        </h1>
        <p
          className={twMerge(
            "text-secondary text-xs md:text-sm text-center",
            categories.length == 0
              ? isMobile
                ? "pl-16"
                : isSidebarVisible
                ? "md:pl-0"
                : "md:pl-16"
              : "pl-0"
          )}
        >
          <span className="font-semibold">
            {artist.numberOfLivestreams} Video
            {artist.numberOfLivestreams > 1 ? "s" : ""}
          </span>
          &nbsp;&nbsp;
          <span>{hours.toFixed(2)} Hours</span>
        </p>
        <div
          ref={livestreamScrollRef}
          className="relative w-full flex flex-row overflow-x-auto overflow-y-hidden overscroll-contain z-10 pb-1"
          // onWheel={(e) => onWheel(e, livestreamScrollRef)}
          // style={{ scrollBehavior: "unset" }}
          data-simplebar
          data-simplebar-auto-hide="false"
        >
          <div className="relative w-fit py-2 flex flex-row justify-start items-start gap-10">
            {allLivestreams.map((livestream, index) => {
              return (
                <LiveStreamListCard
                  playing={
                    livestream.id == videoPlayer.getPlayingTrack().id &&
                    categoryId == null
                  }
                  soundStatus={
                    livestream.id == videoPlayer.getPlayingTrack().id &&
                    categoryId == null
                      ? videoPlayer.isPlaying
                        ? "playing"
                        : "paused"
                      : "none"
                  }
                  livestream={livestream}
                  togglePlay={() => {
                    if (videoPlayer.isPlaying) {
                      videoPlayer.pause();
                    } else {
                      setTimeout(() => {
                        videoPlayer.play();
                      }, 100);
                    }

                    setCategoryId(null);
                    setLivestreams(allLivestreams);
                    videoPlayer.setVideos(allLivestreams);
                    setPage(Math.floor(allLivestreams.length / PAGE_LIMIT) + 1);
                    videoPlayer.setPlayingIndex(index);
                    setViewMode(VIEW_MODE.VIDEO);
                  }}
                  play={() => {
                    setCategoryId(null);
                    setLivestreams(allLivestreams);
                    videoPlayer.setVideos(allLivestreams);
                    setPage(Math.floor(allLivestreams.length / PAGE_LIMIT) + 1);
                    videoPlayer.setPlayingIndex(index);
                    setViewMode(VIEW_MODE.LIST);
                  }}
                  key={index}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  const fullScreenView = (
    <div
      id="livestreamfullview"
      className={twMerge("relative w-full h-screen max-h-screen bg-black z-20")}
    >
      <video
        autoPlay={viewMode == VIEW_MODE.VIDEO}
        controls={false}
        playsInline
        disablePictureInPicture
        ref={videoRef}
        src={videoPlayer.getPlayingTrack()?.fullVideo}
        className={twMerge("absolute left-0 top-0 w-full h-full object-center")}
      />
    </div>
  );

  const pageContent = (
    <div className="w-full h-screen overflow-x-hidden overflow-y-auto">
      <div className="relative w-full min-h-screen flex flex-col justify-start items-center">
        {!isMembership && !isAdmin() && (
          <div
            className={twMerge(
              "absolute z-10",
              isMobile
                ? isTopbarVisible
                  ? "top-16 right-2"
                  : "top-2 right-2"
                : isTopbarVisible
                ? "top-2 right-24 md:right-56"
                : "top-2 right-2"
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

        {viewMode == VIEW_MODE.CATEGORY
          ? categoryView
          : viewMode == VIEW_MODE.LIST
          ? listView
          : fullScreenView}
      </div>
    </div>
  );

  const nullContent = (
    <div className="relative w-full h-screen flex justify-center items-center"></div>
  );

  const fullContent = (
    <>
      {livestreams.length > 0 ? pageContent : nullContent}

      <LiveStreamMetadataModal />

      <LiveStreamCommentModal livestreamId={videoPlayer.getPlayingTrack().id} />

      <DonationModal
        assetType={ASSET_TYPE.LIVESTREAM}
        livestreamId={videoPlayer.getPlayingTrack().id}
      />

      <ViewExclusiveModal />

      <ShareModal />

      {viewMode == VIEW_MODE.VIDEO ? (
        <VideoControl
          videoPlayer={videoPlayer}
          viewMode={viewMode}
          onListView={onListView}
          onPlayLivestream={onPlayLivestream}
        />
      ) : (
        <AudioControl
          audioPlayer={audioPlayer}
          onListView={() => {
            if (viewMode == VIEW_MODE.LIST) {
              setViewMode(VIEW_MODE.CATEGORY);
            } else {
              router.push(SYSTEM_TYPE == APP_TYPE.CHURCH ? "/audio" : "/music");
            }
          }}
        />
      )}

      {isLoading && (
        <div className="loading">
          <Loading width={64} height={64} />
        </div>
      )}
    </>
  );

  return <Layout>{isSignedIn ? fullContent : null}</Layout>;
}
