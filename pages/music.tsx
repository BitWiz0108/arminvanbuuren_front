import { useRef, useState, useEffect } from "react";
import { twMerge } from "tailwind-merge";

import Layout from "@/components/Layout";
import Switch from "@/components/Switch";
import ButtonCircle from "@/components/ButtonCircle";
import List from "@/components/Icons/List";
import Heart from "@/components/Icons/Heart";
import Share from "@/components/Icons/Share";
import MusicCard, {
  MUSIC_CARD_ACTIVE_WIDTH_DESKTOP,
  MUSIC_CARD_ACTIVE_WIDTH_MOBILE,
  MUSIC_CARD_NORMAL_WIDTH_DESKTOP,
  MUSIC_CARD_NORMAL_WIDTH_MOBILE,
} from "@/components/MusicCard";
import MusicListCard from "@/components/MusicListCard";
import VDots from "@/components/Icons/VDots";
import AudioVisualizer from "@/components/AudioVisualizer";
import AudioControl from "@/components/AudioControl";
import HeartFill from "@/components/Icons/HeartFill";
import LyricView from "@/components/LyricView";
import DonationModal from "@/components/DonationModal";
import ViewExclusiveModal from "@/components/ViewExclusiveModal";
import Loading from "@/components/Loading";
import { composeLyrics } from "@/components/Common";
import ShareModal from "@/components/ShareModal";

import { useAuthValues } from "@/contexts/contextAuth";
import { useSizeValues } from "@/contexts/contextSize";
import { useShareValues } from "@/contexts/contextShareData";

import useMusic from "@/hooks/useMusic";

import { ASSET_TYPE, PAGE_LIMIT, SITE_BASE_URL } from "@/libs/constants";

import { IMusic } from "@/interfaces/IMusic";
import { DEFAULT_ALBUM, IAlbum } from "@/interfaces/IAlbum";
import { DEFAULT_SHAREDATA } from "@/interfaces/IShareData";

export default function Music() {
  const scrollRef = useRef(null);
  const musicsScrollRef = useRef(null);

  const { isSignedIn, isMembership } = useAuthValues();
  const { isMobile, height, contentWidth, isSidebarVisible, isTopbarVisible } =
    useSizeValues();
  const {
    artist,
    audioPlayer,
    setIsLyricsVisible,
    setLyrics,
    setIsViewExclusiveModalVisible,
    setIsShareModalVisible,
    setShareData,
  } = useShareValues();
  const {
    isLoading,
    fetchMusics,
    fetchAllAlbums,
    fetchAlbumMusics,
    toggleMusicFavorite,
  } = useMusic();

  const [allMusics, setAllMusics] = useState<Array<IMusic>>([]);
  const [albums, setAlbums] = useState<Array<IAlbum>>([]);
  const [isExclusive, setIsExclusive] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isScrolling, setIsScrolling] = useState<boolean>(false);
  const [originalX, setOriginalX] = useState<number>(0);
  const [clientX, setClientX] = useState<number>(0);
  const [gapWidth, setGapWidth] = useState<number>(0);
  const [activeWidth, setActiveWidth] = useState<number>(0);
  const [isListView, setIsListView] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);

  const checkActiveIndex = (scrollPos: number, right: boolean) => {
    const value = scrollPos / activeWidth;
    setTimeout(() => {
      setActiveIndex(right ? Math.floor(value) : Math.ceil(value));
    }, 100);
  };

  const releaseMouse = (clientX: number) => {
    if (!scrollRef) return;

    const deltaOrigin = originalX - clientX;
    if (Math.abs(deltaOrigin) > 10) {
      const delta = clientX - clientX;
      // @ts-ignore
      scrollRef.current.scrollLeft += delta;
      setClientX(clientX);
      // @ts-ignore
      checkActiveIndex(scrollRef.current.scrollLeft, delta > 0);
    }
  };

  const onWheel = (
    e: React.WheelEvent<HTMLDivElement>,
    ref: any,
    element: boolean = false
  ) => {
    if (e.deltaY == 0) return;
    e.preventDefault();

    if (element) {
      // @ts-ignore
      ref.scrollTo({
        // @ts-ignore
        left: ref.current?.scrollLeft + e.deltaY,
        behavior: "smooth",
      });
    } else {
      // @ts-ignore
      ref.current.scrollTo({
        // @ts-ignore
        left: ref.current.scrollLeft + e.deltaY,
        behavior: "smooth",
      });
    }
  };

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setIsScrolling(true);
    setClientX(e.clientX);
    setOriginalX(e.clientX);
  };

  const onMouseUp = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setIsScrolling(false);

    releaseMouse(e.clientX);
  };

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (isScrolling) {
      const delta = clientX - e.clientX;
      // @ts-ignore
      scrollRef.current.scrollLeft += delta;
      setClientX(e.clientX);
    }
  };

  const onMouseOut = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setIsScrolling(false);

    releaseMouse(e.clientX);
  };

  const onListView = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setIsListView(!isListView);
  };

  const onMenuView = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setLyrics(
      composeLyrics(
        audioPlayer.musics[activeIndex].singer.artistName,
        audioPlayer.musics[activeIndex].title,
        audioPlayer.musics[activeIndex].duration,
        audioPlayer.musics[activeIndex].description,
        audioPlayer.musics[activeIndex].lyrics
      )
    );
    setIsLyricsVisible(true);
  };

  const onHeart = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    toggleMusicFavorite(
      audioPlayer.musics[activeIndex]?.id,
      !audioPlayer.musics[activeIndex]?.isFavorite
    ).then((value) => {
      if (value) {
        const tmusics = audioPlayer.musics.slice();
        tmusics[activeIndex].isFavorite =
          !audioPlayer.musics[activeIndex]?.isFavorite;
        audioPlayer.setMusics(tmusics);
      }
    });
  };

  const onShare = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setShareData({
      ...DEFAULT_SHAREDATA,
      url: `${SITE_BASE_URL}/music`,
      title: audioPlayer.getPlayingTrack().title,
      subject: audioPlayer.getPlayingTrack().title,
      quote: audioPlayer.getPlayingTrack().title,
      about: audioPlayer.getPlayingTrack().description,
      body: audioPlayer.getPlayingTrack().description,
      summary: audioPlayer.getPlayingTrack().title,
    });
    setIsShareModalVisible(true);
  };

  const getAllMusics = (page: number, fresh: boolean = false) => {
    return new Promise<boolean>((resolve, _) => {
      fetchMusics(page, isExclusive)
        .then((result) => {
          let newMusics: Array<IMusic> = [];
          if (fresh) {
            newMusics.push(...result.musics);
          } else {
            newMusics = allMusics.slice();
            newMusics.push(...result.musics);
          }

          setAllMusics(newMusics);
          audioPlayer.setMusics(newMusics);

          // For the first loading, to avoid null playing track
          if (audioPlayer.playingIndex == 0 && newMusics.length > 0) {
            audioPlayer.setPlayingIndex(0);
          }

          if (result.musics.length > 0) {
            resolve(true);
          } else {
            resolve(false);
          }
        })
        .catch((_) => {
          setAllMusics([]);
          resolve(false);
        });
    });
  };

  const getAlbumMusics = (page: number) => {
    return new Promise<boolean>((resolve, _) => {
      fetchAlbumMusics(audioPlayer.albumId, page, isExclusive)
        .then((data) => {
          const albumIndex = albums.findIndex(
            (item) => item.id == audioPlayer.albumId
          );
          if (albumIndex >= 0) {
            const talbums = albums.slice();
            talbums[albumIndex].musics.push(...data);
            setAlbums(talbums);
            audioPlayer.setMusics(talbums[albumIndex].musics);

            // For the first loading, to avoid null playing track
            if (audioPlayer.playingIndex == 0) {
              audioPlayer.setPlayingIndex(0);
            }

            if (data.length > 0) {
              resolve(true);
            } else {
              resolve(false);
            }
          }
        })
        .catch((_) => {
          setAlbums([]);
          resolve(false);
        });
    });
  };

  const getAlbumById = () => {
    const albumIndex = albums.findIndex(
      (item) => item.id == audioPlayer.albumId
    );
    if (albumIndex >= 0) {
      return albums[albumIndex];
    }
    return DEFAULT_ALBUM;
  };

  useEffect(() => {
    setGapWidth(
      (contentWidth -
        40 -
        (isMobile
          ? MUSIC_CARD_ACTIVE_WIDTH_MOBILE
          : MUSIC_CARD_ACTIVE_WIDTH_DESKTOP)) /
        2 -
        60
    );
    setActiveWidth(
      (isMobile
        ? MUSIC_CARD_NORMAL_WIDTH_MOBILE
        : MUSIC_CARD_NORMAL_WIDTH_DESKTOP) + 40
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile, contentWidth]);

  useEffect(() => {
    if (scrollRef && scrollRef.current && !isListView) {
      // @ts-ignore
      scrollRef.current.scrollLeft = activeIndex * activeWidth;
    }

    // Check scroll reach the end
    // if (activeIndex == audioPlayer.musics.length - 1) {
    //   if (audioPlayer.albumId == null) {
    //     getAllMusics(page + 1).then((value) => {
    //       if (value) {
    //         setPage((prev) => prev + 1);
    //       }
    //     });
    //   } else {
    //     getAlbumMusics(page + 1).then((value) => {
    //       if (value) {
    //         setPage((prev) => prev + 1);
    //       }
    //     });
    //   }
    // }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, scrollRef, activeWidth, isListView]);

  useEffect(() => {
    setActiveIndex(audioPlayer.playingIndex);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile, audioPlayer.playingIndex, audioPlayer.albumId]);

  useEffect(() => {
    if (isSignedIn) {
      setPage(1);

      getAllMusics(1, true);

      fetchAllAlbums(1, isExclusive).then((albums) => {
        setAlbums(albums);
      });

      if (isExclusive && !isMembership) {
        setIsViewExclusiveModalVisible(true);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn, isExclusive]);

  const sliderView = (
    <div className="relative w-full h-screen flex justify-center items-start md:items-center pt-20 overflow-y-auto">
      <div className="w-full min-h-[768px] flex flex-col justify-start overflow-hidden">
        <div className="relative w-full flex flex-row justify-center items-center px-5 space-x-14 md:space-x-20 z-10">
          <ButtonCircle
            dark
            icon={<List width={24} height={24} />}
            size="small"
            onClick={onListView}
          />
          <h1 className="text-primary text-xl md:text-2xl text-center">
            <span className="font-semibold">
              {audioPlayer.albumId == null
                ? artist.artistName
                : getAlbumById().name}
            </span>
            &nbsp;Music
          </h1>
          <div className="flex flex-col justify-center items-center space-y-3">
            <div
              className="cursor-pointer text-primary hover:text-activePrimary transition-all duration-300"
              onClick={onHeart}
            >
              {audioPlayer.musics[activeIndex]?.isFavorite ? (
                <HeartFill width={22} height={22} />
              ) : (
                <Heart width={22} height={22} />
              )}
            </div>
            <div
              className="cursor-pointer text-primary hover:text-activePrimary transition-all duration-300"
              onClick={onShare}
            >
              <Share width={22} height={22} />
            </div>
          </div>
        </div>

        <div
          className={twMerge(
            "relative flex flex-row overflow-x-auto overflow-y-hidden px-5 mb-10 mx-5 z-10",
            height < 768 ? "-mt-8" : "mt-24"
          )}
          ref={scrollRef}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseOut}
          style={{
            scrollBehavior: isScrolling ? "unset" : "smooth",
          }}
        >
          <div className="w-fit h-[380px] flex flex-row justify-start items-center gap-10">
            <div
              style={{
                width: `${gapWidth}px`,
              }}
            ></div>
            {audioPlayer.musics.map((music, index) => {
              return (
                <MusicCard
                  active={activeIndex == index}
                  playing={audioPlayer.playingIndex == index}
                  soundStatus={
                    audioPlayer.playingIndex == index
                      ? audioPlayer.isPlaying
                        ? "playing"
                        : "paused"
                      : "none"
                  }
                  music={music}
                  togglePlay={() => {
                    if (audioPlayer.isPlaying) {
                      audioPlayer.pause();
                    } else {
                      audioPlayer.play();
                    }
                  }}
                  play={() => audioPlayer.setPlayingIndex(index)}
                  onClick={() => setActiveIndex(index)}
                  key={index}
                />
              );
            })}
            <div
              style={{
                width: `${gapWidth}px`,
              }}
            ></div>
          </div>
        </div>

        <div className="relative w-full flex flex-row justify-center items-center px-5 pb-48 space-x-2 z-10">
          <div className="w-auto flex-grow md:flex-grow-0 md:w-80 lg:w-96 flex flex-col justify-start items-start">
            <h2 className="text-primary text-left text-xl md:text-2xl font-semibold mb-1">
              {audioPlayer.musics[activeIndex]?.title}
            </h2>
            <p className="text-secondary text-left text-md md:text-lg mb-2">
              {audioPlayer.musics[activeIndex]?.singer?.artistName}
            </p>
          </div>
          <div className="flex justify-center items-center">
            <VDots
              width={32}
              height={32}
              className="text-secondary hover:text-primary transition-all duration-300 cursor-pointer"
              onClick={onMenuView}
            />
          </div>
        </div>

        {audioPlayer.isPlaying && (
          <div
            className={`absolute left-0 top-0 h-full flex flex-col justify-center items-center z-0 overflow-hidden`}
            style={{ width: `${contentWidth}px` }}
          >
            <AudioVisualizer
              url={audioPlayer.getPlayingTrack().musicFileCompressed}
            />
          </div>
        )}
      </div>
    </div>
  );

  const listView = (
    <div className="relative w-full min-h-screen flex flex-col justify-start items-start space-y-10 pt-5 pb-44 bg-background">
      {albums.map((album, index) => {
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
              <span className="font-semibold">{album.name}</span>
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
              {album.description}
            </p>
            <p
              className={twMerge(
                "text-secondary text-sm md:text-base font-semibold text-center",
                index == 0
                  ? isMobile
                    ? "pl-16"
                    : isSidebarVisible
                    ? "md:pl-0"
                    : "md:pl-16"
                  : "pl-0"
              )}
            >
              {album.size} SONG{album.size > 1 ? "S" : ""}
            </p>
            <div className="w-full flex flex-row overflow-x-auto overflow-y-hidden z-10">
              <div className="w-fit py-2 flex flex-row justify-start items-start gap-10">
                {album.musics.map((music, index) => {
                  return (
                    <MusicListCard
                      playing={
                        music.id == audioPlayer.getPlayingTrack().id &&
                        audioPlayer.albumId == album.id
                      }
                      soundStatus={
                        music.id == audioPlayer.getPlayingTrack().id &&
                        audioPlayer.albumId == album.id
                          ? audioPlayer.isPlaying
                            ? "playing"
                            : "paused"
                          : "none"
                      }
                      music={music}
                      togglePlay={() => {
                        if (audioPlayer.isPlaying) {
                          audioPlayer.pause();
                        } else {
                          audioPlayer.play();
                        }
                      }}
                      play={() => {
                        audioPlayer.setAlbumId(album.id);
                        audioPlayer.setMusics(album.musics);
                        setPage(
                          Math.floor(album.musics.length / PAGE_LIMIT) + 1
                        );
                        audioPlayer.setPlayingIndex(index);
                        setIsListView(false);
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
            albums.length == 0
              ? isMobile
                ? "pl-16"
                : isSidebarVisible
                ? "md:pl-0"
                : "md:pl-16"
              : "pl-0"
          )}
        >
          <span className="font-semibold">All Music</span>
        </h1>
        <p
          className={twMerge(
            "text-secondary text-xs md:text-sm font-semibold text-center",
            albums.length == 0
              ? isMobile
                ? "pl-16"
                : isSidebarVisible
                ? "md:pl-0"
                : "md:pl-16"
              : "pl-0"
          )}
        >
          {artist.numberOfMusics} SONG{artist.numberOfMusics > 1 ? "S" : ""}
        </p>
        <div
          ref={musicsScrollRef}
          className="relative w-full flex flex-row overflow-x-auto overflow-y-hidden overscroll-contain z-10"
          onWheel={(e) => onWheel(e, musicsScrollRef)}
          style={{ scrollBehavior: "unset" }}
        >
          <div className="relative w-fit py-2 flex flex-row justify-start items-start gap-10">
            {allMusics.map((music, index) => {
              return (
                <MusicListCard
                  playing={
                    music.id == audioPlayer.getPlayingTrack().id &&
                    audioPlayer.albumId == null
                  }
                  soundStatus={
                    music.id == audioPlayer.getPlayingTrack().id &&
                    audioPlayer.albumId == null
                      ? audioPlayer.isPlaying
                        ? "playing"
                        : "paused"
                      : "none"
                  }
                  music={music}
                  togglePlay={() => {
                    if (audioPlayer.isPlaying) {
                      audioPlayer.pause();
                    } else {
                      audioPlayer.play();
                    }
                  }}
                  play={() => {
                    audioPlayer.setAlbumId(null);
                    audioPlayer.setMusics(allMusics);
                    setPage(Math.floor(allMusics.length / PAGE_LIMIT) + 1);
                    audioPlayer.setPlayingIndex(index);
                    setIsListView(false);
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

  const pageContent = (
    <div className="w-full h-screen overflow-x-hidden overflow-y-auto">
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

        {isListView ? listView : sliderView}
      </div>
    </div>
  );

  const nullContent = (
    <div className="relative w-full h-screen flex justify-center items-center">
      <p className="text-center text-secondary text-base font-medium">
        {isLoading ? <Loading width={40} height={40} /> : ""}
      </p>
    </div>
  );

  const fullContent = (
    <div className="bg-gradient-to-b from-activeSecondary to-activePrimary w-full h-full">
      {audioPlayer.musics.length > 0 ? pageContent : nullContent}

      <LyricView />

      <DonationModal
        assetType={ASSET_TYPE.MUSIC}
        musicId={audioPlayer.getPlayingTrack().id}
      />

      <ViewExclusiveModal />

      <ShareModal />

      <AudioControl audioPlayer={audioPlayer} onListView={onListView} />
    </div>
  );

  return <Layout>{isSignedIn ? fullContent : null}</Layout>;
}
