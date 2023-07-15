/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { twMerge } from "tailwind-merge";

import Share from "@/components/Icons/Share";
import X from "@/components/Icons/X";
import Layout from "@/components/Layout";
import Post from "@/components/Post";
import Loading from "@/components/Loading";
import PostModal from "@/components/PostModal";
import ShareModal from "@/components/ShareModal";
import AudioControl from "@/components/AudioControl";
import DonationModal from "@/components/DonationModal";
import ButtonCircle from "@/components/ButtonCircle";
import ArrowLeft from "@/components/Icons/ArrowLeft";
import ArrowRight from "@/components/Icons/ArrowRight";
import F10sVideoPlayer from "@/components/F10sVideoPlayer";

import { useAuthValues } from "@/contexts/contextAuth";
import { useShareValues } from "@/contexts/contextShareData";
import { useSizeValues } from "@/contexts/contextSize";

import useFanclub from "@/hooks/useFanclub";
import useMusic from "@/hooks/useMusic";
import useLivestream from "@/hooks/useLivestream";
import useGallery from "@/hooks/useGallery";

import { bigNumberFormat, getUrlFormattedTitle } from "@/libs/utils";
import {
  APP_NAME,
  APP_TYPE,
  ASSET_TYPE,
  DEFAULT_AVATAR_IMAGE,
  FILE_TYPE,
  IMAGE_BLUR_DATA_URL,
  PLACEHOLDER_IMAGE,
  SITE_BASE_URL,
  SYSTEM_TYPE,
} from "@/libs/constants";

import { IStream } from "@/interfaces/IStream";
import { DEFAULT_POST, IPost } from "@/interfaces/IPost";
import { DEFAULT_SHAREDATA } from "@/interfaces/IShareData";
import { IAlbum } from "@/interfaces/IAlbum";
import { IImage } from "@/interfaces/IGallery";

const POSTS_PAGE_SIZE = 30;
const MUSICS_PAGE_SIZE = 8;
const LIVESTREAMS_PAGE_SIZE = 6;

export default function FanClub() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { isSignedIn } = useAuthValues();
  const {
    isLoading: isWorkingFanclub,
    fetchPosts,
    togglePostFavorite,
  } = useFanclub();
  const { isLoading: isWorkingGallery, fetchPageContent } = useGallery();
  const {
    isLoading: isWorkingMusics,
    fetchAllAlbums,
    fetchAlbumMusics,
  } = useMusic();
  const { isLoading: isWorkingLivestreams, fetchLivestreams } = useLivestream();
  const { isMobile, width, height, toggleFullscreen } = useSizeValues();
  const { artist, audioPlayer, setIsShareModalVisible, setShareData } =
    useShareValues();

  const [latestLivestreams, setLatestLiveStreams] = useState<Array<IStream>>(
    []
  );
  const [livestreamPage, setLivestreamPage] = useState<number>(1);
  const [livestreamPageCount, setLivestreamPageCount] = useState<number>(1);
  const [musicAlbums, setMusicAlbums] = useState<Array<IAlbum>>([]);
  const [musicPages, setMusicPages] = useState<Array<number>>([]);
  const [musicPageCounts, setMusicPageCounts] = useState<Array<number>>([]);
  const [images, setImages] = useState<Array<IImage>>([]);
  const [posts, setPosts] = useState<Array<IPost>>([]);
  const [postsPage, setPostsPage] = useState<number>(1);
  const [postsPageCount, setPostsPageCount] = useState<number>(1);
  const [isPostModalOpened, setIsPostModalOpened] = useState<boolean>(false);
  const [selectedPost, setSelectedPost] = useState<IPost>(DEFAULT_POST);
  const [indexAsset, setIndexAsset] = useState<number>(0);
  const [isPostFullScreenView, setIsPostFullScreenView] =
    useState<boolean>(false);
  const [isBannerVideoLoading, setIsBannerVideoLoading] =
    useState<boolean>(false);
  const [bannerHeight, setBannerHeight] = useState<number>(0);
  const [postHeight, setPostHeight] = useState<number>(0);
  const [postRef, setPostRef] = useState<HTMLDivElement | null>(null);

  const onShare = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setShareData({
      ...DEFAULT_SHAREDATA,
      url: `${SITE_BASE_URL}/${
        SYSTEM_TYPE == APP_TYPE.CHURCH ? "community" : "fan-club"
      }`,
      title: `${APP_NAME} ${
        SYSTEM_TYPE == APP_TYPE.CHURCH
          ? "Audio - Community"
          : "Music - Fan Club"
      }`,
      subject: `${APP_NAME} ${
        SYSTEM_TYPE == APP_TYPE.CHURCH
          ? "Audio - Community"
          : "Music - Fan Club"
      }`,
      quote: `${APP_NAME} ${
        SYSTEM_TYPE == APP_TYPE.CHURCH
          ? "Audio - Community"
          : "Music - Fan Club"
      }`,
      about: artist.description,
      body: artist.description,
      summary: artist.description,
    });
    setIsShareModalVisible(true);
  };

  const fetchMoreLivestreams = () => {
    fetchLivestreams(livestreamPage + 1, true, LIVESTREAMS_PAGE_SIZE).then(
      (result) => {
        setLatestLiveStreams([...latestLivestreams, ...result.livestreams]);
        setLivestreamPageCount(result.pages);

        if (livestreamPage < result.pages) {
          setLivestreamPage((prev) => prev + 1);
        }
      }
    );
  };

  const fetchMoreMusics = (albumIndex: number) => {
    fetchAlbumMusics(
      musicAlbums[albumIndex].id,
      musicPages[albumIndex] + 1,
      true,
      MUSICS_PAGE_SIZE
    ).then((result) => {
      const tmusicAlbums = musicAlbums.slice();
      tmusicAlbums[albumIndex].musics.push(...result);
      setMusicAlbums(tmusicAlbums);

      if (musicPages[albumIndex] < musicPageCounts[albumIndex]) {
        const tmusicPages = musicPages.slice();
        tmusicPages[albumIndex]++;
        setMusicPages(tmusicPages);
      }
    });
  };

  const fetchMorePosts = () => {
    fetchPosts(postsPage + 1, POSTS_PAGE_SIZE).then((result) => {
      setPosts([...posts, ...result.posts]);
      setPostsPageCount(result.pages);

      if (postsPage < result.pages) {
        setPostsPage((prev) => prev + 1);
      }
    });
  };

  const onPrevAsset = () => {
    setIndexAsset((index) => {
      let finalIndex = 0;
      if (index > 0) finalIndex = index - 1;
      else finalIndex = selectedPost.files.length - 1;

      if (selectedPost.files[finalIndex].type == FILE_TYPE.VIDEO) {
        setTimeout(() => {
          const videos = document.getElementsByClassName(
            "fullscreen-video-player"
          );
          for (let i = 0; i < videos.length; i++) {
            (videos[i] as HTMLVideoElement).play();
          }
        }, 1000);
      }

      return finalIndex;
    });
  };

  const onNextAsset = () => {
    setIndexAsset((index) => {
      let finalIndex = 0;
      if (index < selectedPost.files.length - 1) finalIndex = index + 1;
      else finalIndex = 0;

      if (selectedPost.files[finalIndex].type == FILE_TYPE.VIDEO) {
        setTimeout(() => {
          const videos = document.getElementsByClassName(
            "fullscreen-video-player"
          );
          for (let i = 0; i < videos.length; i++) {
            (videos[i] as HTMLVideoElement).play();
          }
        }, 1000);
      }

      return finalIndex;
    });
  };

  const onPrevPost = () => {
    const index = posts.findIndex((post) => {
      return post.id == selectedPost.id;
    });
    if (index >= 0 && index < posts.length) {
      if (index == 0) {
        setSelectedPost(posts[posts.length - 1]);
      } else {
        setSelectedPost(posts[index - 1]);
      }
    }
  };

  const onNextPost = () => {
    const index = posts.findIndex((post) => {
      return post.id == selectedPost.id;
    });
    if (index >= 0 && index < posts.length) {
      if (index == posts.length - 1) {
        setSelectedPost(posts[0]);
      } else {
        setSelectedPost(posts[index + 1]);
      }
    }
  };

  useEffect(() => {
    if (!scrollRef || !scrollRef.current) return;

    scrollRef.current.addEventListener(
      "scroll",
      () => {
        if (!scrollRef || !scrollRef.current) return;

        const position = scrollRef.current.scrollTop;

        const allVideos = document.getElementsByClassName("post-video");
        posts.map((_, index) => {
          if (
            position > bannerHeight + postHeight * (index - 1) &&
            position < bannerHeight + postHeight * (index + 1)
          ) {
            const videos = document.getElementsByClassName(
              `post-video-${index}`
            );

            for (let i = 0; i < allVideos.length; i++) {
              for (let j = 0; j < videos.length; j++) {
                if (
                  (videos[j] as HTMLVideoElement).src ==
                  (allVideos[i] as HTMLVideoElement).src
                ) {
                  (videos[j] as HTMLVideoElement).play();
                } else {
                  (allVideos[i] as HTMLVideoElement).pause();
                }
              }
            }
          }
        });
      },
      {
        passive: true,
      }
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollRef, bannerHeight, postHeight]);

  useEffect(() => {
    if (!window) return;
    if (!bannerRef || !bannerRef.current || !postRef) return;

    setBannerHeight(bannerRef.current.offsetHeight);
    setPostHeight(postRef.offsetHeight);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, bannerRef, postRef]);

  useEffect(() => {
    if (isSignedIn) {
      fetchLivestreams(1, true, LIVESTREAMS_PAGE_SIZE).then((value) => {
        setLatestLiveStreams(value.livestreams);
        setLivestreamPageCount(value.pages);
        setLivestreamPage(1);
      });
      fetchAllAlbums(1, true, MUSICS_PAGE_SIZE).then((result) => {
        const musicPages = result.map(() => {
          return 1;
        });
        const musicPageCounts = result.map((album) => {
          return album.size / MUSICS_PAGE_SIZE + 1;
        });
        setMusicAlbums(result);
        setMusicPages(musicPages);
        setMusicPageCounts(musicPageCounts);
      });
      fetchPosts(1, POSTS_PAGE_SIZE).then((value) => {
        setPosts(value.posts);
        setPostsPageCount(value.pages);
        setPostsPage(1);
      });
      fetchPageContent().then((value) => {
        if (value) setImages(value.images);
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn]);

  useEffect(() => {
    toggleFullscreen(isPostFullScreenView);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPostFullScreenView]);

  const leftSideView = (
    <div className="w-full lg:w-[260px] flex flex-col space-y-[10px] lg:space-y-[15px]">
      <div className="w-full flex flex-row justify-around items-start space-x-10 bg-background rounded-lg p-5 lg:p-10">
        <div className="flex flex-col space-y-5">
          <p className="text-primary text-base text-center font-semibold">
            {bigNumberFormat(artist.numberOfPosts)}
          </p>
          <p className="text-primary text-sm text-center font-semibold">
            Posts
          </p>
        </div>
        <div className="flex flex-col space-y-5">
          <p className="text-primary text-base text-center font-semibold">
            {artist.numberOfMusics}
          </p>
          <p className="text-primary text-sm text-center">
            {SYSTEM_TYPE == APP_TYPE.CHURCH ? "Audio" : "Songs"}
          </p>
        </div>
        <div className="flex flex-col space-y-5">
          <p className="text-primary text-base text-center font-semibold">
            {artist.numberOfLivestreams}
          </p>
          <p className="text-primary text-sm text-center">Livestreams</p>
        </div>
      </div>

      {latestLivestreams?.length > 0 && (
        <div className="w-full flex flex-col justify-start items-center space-y-3 bg-background rounded-lg p-3 lg:p-5">
          <p className="text-primary text-sm font-medium">Latest Livestream</p>
          <Link
            href={getUrlFormattedTitle(latestLivestreams[0], "livestream")}
            className="w-full"
          >
            <Image
              className="w-full h-28 object-cover rounded-md"
              src={latestLivestreams[0]?.coverImage ?? PLACEHOLDER_IMAGE}
              width={460}
              height={200}
              alt=""
              placeholder="blur"
              blurDataURL={IMAGE_BLUR_DATA_URL}
              priority
            />
          </Link>
          <Link
            href={getUrlFormattedTitle(latestLivestreams[0], "livestream")}
            className="w-full"
          >
            <p className="text-primary text-sm text-center font-medium">
              {latestLivestreams[0]?.title}
            </p>
          </Link>
        </div>
      )}

      <div className="w-full flex flex-col justify-start items-center space-y-3 bg-background rounded-lg p-3 lg:p-5">
        <p className="text-primary text-sm font-medium">Livestreams</p>
        <div className="w-full grid grid-cols-4 md:grid-cols-3 gap-2">
          {latestLivestreams?.map((value, index) => {
            return (
              <div
                key={index}
                className="col-span-1 flex justify-center items-center cursor-pointer"
              >
                <Link
                  href={getUrlFormattedTitle(value, "livestream")}
                  className="w-full"
                >
                  <Image
                    className="w-full h-10 object-cover rounded-md"
                    src={value.coverImage ?? PLACEHOLDER_IMAGE}
                    width={460}
                    height={200}
                    alt=""
                    placeholder="blur"
                    blurDataURL={IMAGE_BLUR_DATA_URL}
                    priority
                  />
                </Link>
              </div>
            );
          })}
          <div className="col-span-4 md:col-span-3 flex justify-center items-center">
            {isWorkingLivestreams ? (
              <Loading width={30} height={30} />
            ) : (
              livestreamPageCount > livestreamPage && (
                <button
                  className="px-3 py-1 inline-flex justify-center items-center text-center text-sm text-secondary bg-transparent hover:bg-blueSecondary hover:text-white hover:border-blueSecondary rounded-full border border-secondary cursor-pointer transition-all duration-300"
                  onClick={() => fetchMoreLivestreams()}
                >
                  + More
                </button>
              )
            )}
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col justify-start items-center space-y-3 bg-background rounded-lg p-3 lg:p-5">
        <p className="text-primary text-sm font-medium text-center">
          {SYSTEM_TYPE == APP_TYPE.CHURCH ? "Audio" : "Music"}
        </p>
        {musicAlbums.slice(0, 1).map((album, albumIndex) => {
          return (
            <div
              key={albumIndex}
              className="w-full flex flex-col justify-start items-center space-y-3"
            >
              <p className="text-secondary text-xs text-center">{album.name}</p>
              <div className="grid grid-cols-3 lg:grid-cols-2 gap-2">
                {album.musics
                  .slice(0, musicPages[albumIndex] * MUSICS_PAGE_SIZE)
                  .map((value, index) => {
                    return (
                      <div
                        key={index}
                        className="col-span-1 flex justify-center items-center"
                      >
                        <Link href={getUrlFormattedTitle(value, "music")}>
                          <Image
                            className="w-20 h-20 object-cover rounded-md"
                            width={200}
                            height={200}
                            src={value.coverImage ?? PLACEHOLDER_IMAGE}
                            alt=""
                            placeholder="blur"
                            blurDataURL={IMAGE_BLUR_DATA_URL}
                            priority
                          />
                        </Link>
                      </div>
                    );
                  })}
              </div>
              <div className="w-full flex justify-center items-center">
                {!isWorkingMusics &&
                  musicPageCounts[albumIndex] - 1 > musicPages[albumIndex] && (
                    <button
                      className="px-3 py-1 inline-flex justify-center items-center text-center text-sm text-secondary bg-transparent hover:bg-blueSecondary hover:text-white hover:border-blueSecondary rounded-full border border-secondary cursor-pointer transition-all duration-300"
                      onClick={() => fetchMoreMusics(albumIndex)}
                    >
                      + More
                    </button>
                  )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="w-full flex flex-col justify-start items-center space-y-3 bg-background rounded-lg p-3 lg:p-5">
        <p className="text-primary text-sm font-medium">Latest Posts</p>
        <div className="w-full grid grid-cols-4 md:grid-cols-3 gap-2">
          {posts.slice(0, 12)?.map((post, index) => {
            return (
              <div
                key={index}
                className="col-span-1 flex justify-center items-center cursor-pointer"
              >
                {post.files[0]?.type == FILE_TYPE.IMAGE ? (
                  <Image
                    className="w-full h-20 lg:h-10 object-cover rounded-md"
                    src={post.files[0]?.fileCompressed ?? PLACEHOLDER_IMAGE}
                    width={1600}
                    height={900}
                    alt=""
                    placeholder="blur"
                    blurDataURL={IMAGE_BLUR_DATA_URL}
                    priority
                    onClick={() => {
                      setSelectedPost(post);
                      setIndexAsset(0);
                      setIsPostFullScreenView(true);
                    }}
                  />
                ) : (
                  <F10sVideoPlayer
                    loop
                    muted
                    autoPlay
                    playsInline
                    className="w-full h-20 lg:h-10 object-cover rounded-md"
                    src={post.files[0]?.fileCompressed}
                    onClick={() => {
                      setSelectedPost(post);
                      setIndexAsset(0);
                      setIsPostFullScreenView(true);
                      audioPlayer.pause();

                      if (post.files[0]?.type == FILE_TYPE.VIDEO) {
                        setTimeout(() => {
                          const videos = document.getElementsByClassName(
                            "fullscreen-video-player"
                          );
                          for (let i = 0; i < videos.length; i++) {
                            (videos[i] as HTMLVideoElement).play();
                          }
                        }, 1000);
                      }
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="w-full flex flex-col justify-start items-center space-y-3 bg-background rounded-lg p-3 lg:p-5">
        <p className="text-primary text-sm font-medium">Latest Galleries</p>
        <div className="w-full grid grid-cols-4 md:grid-cols-3 gap-2">
          {images.slice(0, 8)?.map((image, index) => {
            return (
              <div
                key={index}
                className="col-span-1 flex justify-center items-center cursor-pointer"
              >
                {image.type == FILE_TYPE.IMAGE ? (
                  <Image
                    className="w-full h-20 lg:h-10 object-cover rounded-md"
                    src={image.imageCompressed ?? PLACEHOLDER_IMAGE}
                    width={1600}
                    height={900}
                    alt=""
                    placeholder="blur"
                    blurDataURL={IMAGE_BLUR_DATA_URL}
                    priority
                    onClick={() => {}}
                  />
                ) : (
                  <F10sVideoPlayer
                    loop
                    muted
                    autoPlay
                    playsInline
                    className="w-full h-20 lg:h-10 object-cover rounded-md"
                    src={image.videoCompressed}
                    onClick={() => {}}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const postsView = (
    <div className="w-full lg:w-80 flex-grow flex flex-col justify-start items-center space-y-5">
      {posts.map((post, index) => {
        return (
          <Post
            setRef={
              index == 0 ? (ref: HTMLDivElement) => setPostRef(ref) : null
            }
            key={index}
            index={index}
            post={post}
            favorite={() => {
              togglePostFavorite(post.id, !post.isFavorite).then((value) => {
                if (value) {
                  const tposts = posts.slice();
                  tposts[index].numberOfFavorites = tposts[index].isFavorite
                    ? tposts[index].numberOfFavorites - 1
                    : tposts[index].numberOfFavorites + 1;
                  tposts[index].isFavorite = !tposts[index].isFavorite;
                  setPosts(tposts);
                }
              });
            }}
            fullscreenView={(indexFile: number) => {
              setSelectedPost(post);
              setIndexAsset(indexFile);
              setIsPostFullScreenView(true);

              if (post.files[indexFile]?.type == FILE_TYPE.VIDEO) {
                setTimeout(() => {
                  const videos = document.getElementsByClassName(
                    "fullscreen-video-player"
                  );
                  for (let i = 0; i < videos.length; i++) {
                    (videos[i] as HTMLVideoElement).play();
                  }
                }, 1000);
              }
            }}
            comment={() => {
              setSelectedPost(post);
              setIsPostModalOpened(true);
              if (post.files[0]?.type == FILE_TYPE.VIDEO) {
                audioPlayer.pause();
              }
            }}
          />
        );
      })}
      {isWorkingFanclub ? (
        <Loading width={30} height={30} />
      ) : (
        postsPageCount > postsPage && (
          <div className="w-full flex justify-center items-center">
            <button
              className="px-3 py-1 inline-flex justify-center items-center text-center text-sm text-secondary bg-transparent hover:bg-blueSecondary hover:text-white hover:border-blueSecondary rounded-full border border-secondary cursor-pointer transition-all duration-300"
              onClick={() => fetchMorePosts()}
            >
              + More
            </button>
          </div>
        )
      )}
    </div>
  );

  const fullScreenView = (
    <div
      className={twMerge(
        "left-0 top-0 w-screen h-screen flex justify-center items-center bg-[#000000aa] z-top",
        isPostFullScreenView ? "fixed" : "hidden"
      )}
    >
      <div className="absolute top-5 left-5 cursor-pointer z-10">
        <ButtonCircle
          dark={false}
          icon={<X />}
          size="small"
          onClick={() => {
            setIsPostFullScreenView(false);
            audioPlayer.play();
            const videos = document.getElementsByClassName(
              "fullscreen-video-player"
            );
            for (let i = 0; i < videos.length; i++) {
              (videos[i] as HTMLVideoElement).pause();
            }
          }}
        />
      </div>
      {selectedPost.files.length > 1 && (
        <>
          <div className="absolute top-1/2 left-5 cursor-pointer z-10">
            <ButtonCircle
              dark={false}
              icon={<ArrowLeft />}
              size="small"
              onClick={() => onPrevAsset()}
            />
          </div>
          <div className="absolute top-1/2 right-5 cursor-pointer z-10">
            <ButtonCircle
              dark={false}
              icon={<ArrowRight />}
              size="small"
              onClick={() => onNextAsset()}
            />
          </div>
        </>
      )}
      <div className="relative w-full h-full z-0">
        <div className="relative w-full h-full flex justify-center items-center z-0">
          {selectedPost.files[indexAsset]?.type == FILE_TYPE.IMAGE ? (
            <Image
              className="relative w-full md:w-auto h-auto md:h-full object-center select-none pointer-events-none z-10"
              width={1600}
              height={1600}
              src={selectedPost.files[indexAsset]?.file ?? PLACEHOLDER_IMAGE}
              loading="eager"
              alt=""
              placeholder="blur"
              blurDataURL={IMAGE_BLUR_DATA_URL}
              priority
            />
          ) : (
            <div className="relative max-h-screen w-full h-full z-10">
              <video
                controls
                autoPlay
                playsInline
                disablePictureInPicture
                controlsList="nodownload nopictureinpicture noplaybackrate"
                className="absolute inset-0 object-center w-full h-full rounded-md fullscreen-video-player"
                src={selectedPost.files[indexAsset]?.file}
                onPlay={() => {
                  audioPlayer.pause();
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const fullContent = (
    <>
      <div
        ref={scrollRef}
        className="w-full h-screen overflow-x-hidden overflow-y-auto"
      >
        <div
          className={twMerge(
            "relative w-full min-h-screen flex flex-col justify-start items-center",
            isMobile ? "pb-[180px]" : "pb-28 lg:pb-36"
          )}
        >
          <div
            ref={bannerRef}
            className="relative w-full flex flex-col justify-start items-center bg-background mb-5 lg:mb-10"
          >
            <div
              className="relative w-full h-auto flex flex-col justify-start items-center overflow-hidden z-0"
              style={{
                maxHeight: `${height / 2}px`,
                minHeight: `320px`,
              }}
            >
              {artist.bannerType == FILE_TYPE.VIDEO ? (
                <video
                  loop
                  muted
                  autoPlay
                  playsInline
                  disablePictureInPicture
                  className="w-full h-full object-cover object-center"
                  style={{
                    maxHeight: `${height / 2}px`,
                    minHeight: `320px`,
                  }}
                  src={artist.bannerVideo}
                  onLoadStart={() => setIsBannerVideoLoading(true)}
                  onLoadedData={() => setIsBannerVideoLoading(false)}
                />
              ) : (
                <Image
                  className="relative w-full h-full object-cover object-center"
                  src={artist.bannerImage ?? IMAGE_BLUR_DATA_URL}
                  style={{
                    maxHeight: `${height / 2}px`,
                    minHeight: `320px`,
                  }}
                  width={1600}
                  height={450}
                  alt=""
                  placeholder="blur"
                  blurDataURL={IMAGE_BLUR_DATA_URL}
                  priority
                />
              )}
            </div>
            <div className="w-full flex flex-col lg:flex-row flex-grow justify-center items-center px-5 lg:px-10 z-10">
              <div className="relative w-full xl:w-5/6 h-full flex flex-col lg:flex-row justify-start items-center space-x-0 lg:space-x-5 space-y-3 lg:space-y-0 px-5  lg:pl-10 lg:pr-20 py-2">
                <div className="w-28 h-28 -mt-14 rounded-full border border-background bg-background overflow-hidden flex justify-center items-center">
                  <Image
                    className="w-full h-full object-cover"
                    src={artist.avatarImage ?? DEFAULT_AVATAR_IMAGE}
                    width={333}
                    height={333}
                    alt=""
                    placeholder="blur"
                    blurDataURL={IMAGE_BLUR_DATA_URL}
                    priority
                  />
                </div>
                <div className="flex flex-col flex-grow justify-start items-center lg:items-start">
                  <p className="text-primary text-center text-[26px] uppercase">
                    {artist?.artistName}
                  </p>
                  <p className="text-white font-thin text-center text-sm font-medium">
                    {artist.mobile}
                  </p>
                </div>
                <div className="flex flex-col justify-start items-center">
                  <p className="text-primary text-center text-base">
                    {artist?.email}&nbsp;
                  </p>
                  <p>
                    {artist?.website && (
                      <Link
                        href={artist.website}
                        className="text-secondary text-center text-sm"
                      >
                        {artist.website
                          .replaceAll("https://", "")
                          .replaceAll("/", "")}
                      </Link>
                    )}
                    &nbsp;
                  </p>
                </div>

                <div className="absolute right-5 bottom-5 w-10 h-10 rounded-md flex justify-center items-center text-white bg-bluePrimary hover:bg-blueSecondary transition-all duration-300 cursor-pointer z-10">
                  <Share width={20} height={20} onClick={onShare} />
                </div>
              </div>
            </div>
          </div>

          <div className="w-full xl:w-5/6 flex flex-col-reverse lg:flex-row lg:justify-start items-center lg:items-start space-x-0 lg:space-x-10 space-y-10 lg:space-y-0 px-5 lg:px-10">
            {leftSideView}

            {postsView}
          </div>

          <PostModal
            post={selectedPost}
            setPost={setSelectedPost}
            visible={isPostModalOpened}
            setVisible={(visible: boolean) => {
              setIsPostModalOpened(visible);
              if (!visible) {
                audioPlayer.play();
              }
            }}
            favorite={() => {
              togglePostFavorite(
                selectedPost.id,
                !selectedPost.isFavorite
              ).then((value) => {
                if (value) {
                  const tposts = posts.slice();
                  const index = tposts.findIndex((tpost) => {
                    return tpost.id == selectedPost.id;
                  });
                  if (index >= 0) {
                    tposts[index].numberOfFavorites = tposts[index].isFavorite
                      ? tposts[index].numberOfFavorites - 1
                      : tposts[index].numberOfFavorites + 1;
                    tposts[index].isFavorite = !tposts[index].isFavorite;
                    setPosts(tposts);
                    setSelectedPost({
                      ...selectedPost,
                      numberOfFavorites: tposts[index].numberOfFavorites,
                      isFavorite: tposts[index].isFavorite,
                    });
                  }
                }
              });
            }}
            onPrev={() => onPrevPost()}
            onNext={() => onNextPost()}
            fullscreenView={(indexFile: number) => {
              setIndexAsset(indexFile);
              setIsPostFullScreenView(true);

              if (selectedPost.files[indexFile]?.type == FILE_TYPE.VIDEO) {
                setTimeout(() => {
                  const videos = document.getElementsByClassName(
                    "fullscreen-video-player"
                  );
                  for (let i = 0; i < videos.length; i++) {
                    (videos[i] as HTMLVideoElement).play();
                  }
                }, 1000);
              }
            }}
          />
        </div>
      </div>

      {fullScreenView}

      <DonationModal
        assetType={ASSET_TYPE.MUSIC}
        musicId={audioPlayer.getPlayingTrack().id}
      />

      <ShareModal />

      <AudioControl
        audioPlayer={audioPlayer}
        onListView={() =>
          router.push(SYSTEM_TYPE == APP_TYPE.CHURCH ? "/audio" : "/music")
        }
      />

      {isBannerVideoLoading && (
        <div className="loading">
          <Loading width={64} height={64} />
        </div>
      )}
    </>
  );

  return <Layout>{isSignedIn ? fullContent : null}</Layout>;
}
