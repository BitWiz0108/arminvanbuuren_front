import { useEffect, useState } from "react";
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

import { useAuthValues } from "@/contexts/contextAuth";
import { useShareValues } from "@/contexts/contextShareData";
import { useSizeValues } from "@/contexts/contextSize";

import useFanclub from "@/hooks/useFanclub";
import useMusic from "@/hooks/useMusic";
import useLivestream from "@/hooks/useLivestream";

import { bigNumberFormat } from "@/libs/utils";
import {
  APP_NAME,
  ASSET_TYPE,
  DEFAULT_AVATAR_IMAGE,
  FILE_TYPE,
  IMAGE_BLUR_DATA_URL,
  PLACEHOLDER_IMAGE,
  SITE_BASE_URL,
} from "@/libs/constants";

import { IStream } from "@/interfaces/IStream";
import { IMusic } from "@/interfaces/IMusic";
import { DEFAULT_POST, IPost } from "@/interfaces/IPost";
import { DEFAULT_SHAREDATA } from "@/interfaces/IShareData";

const POSTS_PAGE_SIZE = 30;
const MUSICS_PAGE_SIZE = 8;
const LIVESTREAMS_PAGE_SIZE = 6;

export default function FanClub() {
  const router = useRouter();
  const { isSignedIn } = useAuthValues();
  const {
    isLoading: isWorkingFanclub,
    fetchPosts,
    togglePostFavorite,
  } = useFanclub();
  const { isLoading: isWorkingMusics, fetchMusics } = useMusic();
  const { isLoading: isWorkingLivestreams, fetchLivestreams } = useLivestream();
  const { height } = useSizeValues();
  const { artist, audioPlayer, setIsShareModalVisible, setShareData } =
    useShareValues();

  const [latestLivestreams, setLatestLiveStreams] = useState<Array<IStream>>(
    []
  );
  const [livestreamPage, setLivestreamPage] = useState<number>(1);
  const [livestreamPageCount, setLivestreamPageCount] = useState<number>(1);
  const [latestMusics, setLatestMusics] = useState<Array<IMusic>>([]);
  const [musicPage, setMusicPage] = useState<number>(1);
  const [musicPageCount, setMusicPageCount] = useState<number>(1);
  const [posts, setPosts] = useState<Array<IPost>>([]);
  const [postsPage, setPostsPage] = useState<number>(1);
  const [postsPageCount, setPostsPageCount] = useState<number>(1);
  const [isPostModalOpened, setIsPostModalOpened] = useState<boolean>(false);
  const [selectedPost, setSelectedPost] = useState<IPost>(DEFAULT_POST);
  const [isPostFullScreenView, setIsPostFullScreenView] =
    useState<boolean>(false);

  const onShare = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setShareData({
      ...DEFAULT_SHAREDATA,
      url: `${SITE_BASE_URL}/fan-club`,
      title: `${APP_NAME} Music - Fan Club`,
      subject: `${APP_NAME} Music - Fan Club`,
      quote: `${APP_NAME} Music - Fan Club`,
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

  const fetchMoreMusics = () => {
    fetchMusics(musicPage + 1, true, MUSICS_PAGE_SIZE).then((result) => {
      setLatestMusics([...latestMusics, ...result.musics]);
      setMusicPageCount(result.pages);

      if (musicPage < result.pages) {
        setMusicPage((prev) => prev + 1);
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
    if (isSignedIn) {
      fetchLivestreams(1, true, LIVESTREAMS_PAGE_SIZE).then((value) => {
        setLatestLiveStreams(value.livestreams);
        setLivestreamPageCount(value.pages);
        setLivestreamPage(1);
      });
      fetchMusics(1, true, MUSICS_PAGE_SIZE).then((result) => {
        setLatestMusics(result.musics);
        setMusicPageCount(result.pages);
        setMusicPage(1);
      });
      fetchPosts(1, POSTS_PAGE_SIZE).then((value) => {
        setPosts(value.posts);
        setPostsPageCount(value.pages);
        setPostsPage(1);
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn]);

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
          <p className="text-primary text-sm text-center">Songs</p>
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
          <Link href="/live-stream">
            <Image
              className="w-full h-28 object-cover rounded-md"
              src={latestLivestreams[0].coverImage ?? PLACEHOLDER_IMAGE}
              width={460}
              height={200}
              alt=""
              placeholder="blur"
              blurDataURL={IMAGE_BLUR_DATA_URL}
              priority
            />
          </Link>
          <Link href="/live-stream">
            <p className="text-primary text-sm font-medium">
              {latestLivestreams[0].title}
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
                <Link href="/live-stream" className="w-full">
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
        <p className="text-primary text-sm font-medium text-center">Music</p>
        <div className="w-full flex flex-col justify-start items-center space-y-3">
          <div className="grid grid-cols-3 lg:grid-cols-2 gap-2">
            {latestMusics.map((value, index) => {
              return (
                <div
                  key={index}
                  className="col-span-1 flex justify-center items-center"
                >
                  <Link href="/music">
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
            {isWorkingMusics ? (
              <Loading width={30} height={30} />
            ) : (
              musicPageCount > musicPage && (
                <button
                  className="px-3 py-1 inline-flex justify-center items-center text-center text-sm text-secondary bg-transparent hover:bg-blueSecondary hover:text-white hover:border-blueSecondary rounded-full border border-secondary cursor-pointer transition-all duration-300"
                  onClick={() => fetchMoreMusics()}
                >
                  + More
                </button>
              )
            )}
          </div>
        </div>
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
                {post.type == FILE_TYPE.IMAGE ? (
                  <Image
                    className="w-full h-20 lg:h-10 object-cover rounded-md"
                    src={post.imageCompressed ?? PLACEHOLDER_IMAGE}
                    width={1600}
                    height={900}
                    alt=""
                    placeholder="blur"
                    blurDataURL={IMAGE_BLUR_DATA_URL}
                    priority
                    onClick={() => {
                      setSelectedPost(post);
                      setIsPostFullScreenView(true);
                    }}
                  />
                ) : (
                  <video
                    loop
                    muted
                    autoPlay
                    playsInline
                    className="w-full h-20 lg:h-10 object-cover rounded-md"
                    src={post.videoCompressed}
                    onClick={() => {
                      setSelectedPost(post);
                      setIsPostFullScreenView(true);
                      audioPlayer.pause();
                    }}
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
    <div className="w-full flex flex-col justify-start items-center space-y-5">
      {posts.map((post, index) => {
        return (
          <Post
            key={index}
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
            fullscreenView={() => {
              setSelectedPost(post);
              setIsPostFullScreenView(true);
            }}
            comment={() => {
              setSelectedPost(post);
              setIsPostModalOpened(true);
              if (post.type == FILE_TYPE.VIDEO) {
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

  const fullContent = (
    <>
      <div className="w-full h-screen overflow-x-hidden overflow-y-auto">
        <div className="relative w-full min-h-screen flex flex-col justify-start items-center pb-36">
          <div className="relative w-full flex flex-col justify-start items-center bg-background mb-5 lg:mb-10">
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
                  className="w-full h-full object-cover object-center"
                  style={{
                    maxHeight: `${height / 2}px`,
                    minHeight: `320px`,
                  }}
                  src={artist.bannerVideo}
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
                    {artist?.email}
                  </p>
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
                </div>

                <div className="absolute right-5 bottom-5 w-10 h-10 rounded-md flex justify-center items-center text-white bg-bluePrimary hover:bg-blueSecondary transition-all duration-300 cursor-pointer z-10">
                  <Share width={20} height={20} onClick={onShare} />
                </div>
              </div>
            </div>
          </div>

          <div className="w-full xl:w-5/6 flex flex-col lg:flex-row space-x-0 lg:space-x-10 space-y-10 lg:space-y-0 px-5 lg:px-10">
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
          />
        </div>
      </div>

      <DonationModal
        assetType={ASSET_TYPE.MUSIC}
        musicId={audioPlayer.getPlayingTrack().id}
      />

      <ShareModal />

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
                // @ts-ignore
                videos[i].pause();
              }
            }}
          />
        </div>
        <div className="absolute top-1/2 left-5 cursor-pointer z-10">
          <ButtonCircle
            dark={false}
            icon={<ArrowLeft />}
            size="small"
            onClick={() => onPrevPost()}
          />
        </div>
        <div className="absolute top-1/2 right-5 cursor-pointer z-10">
          <ButtonCircle
            dark={false}
            icon={<ArrowRight />}
            size="small"
            onClick={() => onNextPost()}
          />
        </div>
        <div className="relative w-full h-full z-0">
          <div className="relative w-full h-full flex justify-center items-center z-0">
            {selectedPost.type == FILE_TYPE.IMAGE ? (
              <Image
                className="relative w-full md:w-auto h-auto md:h-full object-cover md:object-none select-none pointer-events-none z-10"
                width={1600}
                height={1600}
                src={selectedPost.image ?? PLACEHOLDER_IMAGE}
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
                  autoPlay={true}
                  disablePictureInPicture
                  controlsList="nodownload nopictureinpicture noplaybackrate"
                  className="absolute inset-0 object-center w-full h-full rounded-md fullscreen-video-player"
                  src={selectedPost.video}
                  onPlay={(event) => {
                    audioPlayer.pause();
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <AudioControl
        audioPlayer={audioPlayer}
        onListView={() => router.push("/music")}
      />
    </>
  );

  return <Layout>{isSignedIn ? fullContent : null}</Layout>;
}
