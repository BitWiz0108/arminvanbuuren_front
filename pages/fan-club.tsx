import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";

import Layout from "@/components/Layout";
import Share from "@/components/Icons/Share";
import Post from "@/components/Post";
import Loading from "@/components/Loading";
import PostModal from "@/components/PostModal";
import ShareModal from "@/components/ShareModal";
import AudioControl from "@/components/AudioControl";

import { useAuthValues } from "@/contexts/contextAuth";
import { useShareValues } from "@/contexts/contextShareData";

import useFanclub from "@/hooks/useFanclub";
import useMusic from "@/hooks/useMusic";
import useLivestream from "@/hooks/useLivestream";

import { bigNumberFormat } from "@/libs/utils";
import {
  APP_NAME,
  DEFAULT_COVER_IMAGE,
  IMAGE_MD_BLUR_DATA_URL,
  IMAGE_SM_BLUR_DATA_URL,
  SITE_BASE_URL,
} from "@/libs/constants";

import { DEFAULT_ARTIST, IArtist } from "@/interfaces/IArtist";
import { IStream } from "@/interfaces/IStream";
import { IMusic } from "@/interfaces/IMusic";
import { DEFAULT_POST, IPost } from "@/interfaces/IPost";
import { DEFAULT_SHAREDATA } from "@/interfaces/IShareData";

const POSTS_PAGE_SIZE = 5;
const MUSICS_PAGE_SIZE = 5;
const LIVESTREAMS_PAGE_SIZE = 6;

export default function FanClub() {
  const router = useRouter();
  const { isSignedIn } = useAuthValues();
  const {
    isLoading: isWorkingFanclub,
    fetchArtist,
    fetchPosts,
    togglePostFavorite,
  } = useFanclub();
  const { isLoading: isWorkingMusics, fetchMusics } = useMusic();
  const { isLoading: isWorkingLivestreams, fetchLivestreams } = useLivestream();
  const { audioPlayer, setIsShareModalVisible, setShareData } =
    useShareValues();

  const [artist, setArtist] = useState<IArtist>(DEFAULT_ARTIST);
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

  useEffect(() => {
    if (isSignedIn) {
      fetchArtist().then((data) => {
        if (data) {
          setArtist(data);
        }
      });
      fetchLivestreams(1, true, LIVESTREAMS_PAGE_SIZE).then((value) => {
        setLatestLiveStreams(value.livestreams);
        setLivestreamPageCount(value.pages);
        setLivestreamPage(1);
      });
      fetchMusics(1, true, LIVESTREAMS_PAGE_SIZE).then((result) => {
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
    <div className="w-full lg:w-[260px] flex flex-col space-y-5 lg:space-y-10">
      <div className="w-full flex flex-row justify-around items-start space-x-10 bg-third rounded-lg p-5 lg:p-10">
        <div className="flex flex-col space-y-5">
          <p className="text-primary text-base text-center font-semibold">
            {bigNumberFormat(artist.numberOfFans)}
          </p>
          <p className="text-primary text-sm text-center font-semibold">Fans</p>
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
        <div className="w-full flex flex-col justify-start items-center space-y-3 bg-third rounded-lg p-5 lg:p-10">
          <p className="text-primary text-base font-medium">
            Latest Livestream
          </p>
          <Link href="/live-stream" target="_blank">
            <Image
              className="w-full h-28 object-cover rounded-md"
              src={latestLivestreams[0].coverImage ?? DEFAULT_COVER_IMAGE}
              width={460}
              height={200}
              alt=""
              placeholder="blur"
              blurDataURL={IMAGE_MD_BLUR_DATA_URL}
            />
          </Link>
          <Link href="/live-stream" target="_blank">
            <p className="text-primary text-base font-medium">
              {latestLivestreams[0].title}
            </p>
          </Link>
          <div
            className="none-tailwind"
            dangerouslySetInnerHTML={{
              __html: latestLivestreams[0].description,
            }}
          ></div>
        </div>
      )}

      <div className="w-full flex flex-col justify-start items-center space-y-3 bg-third rounded-lg p-5 lg:p-10">
        <p className="text-primary text-base font-medium">
          Exclusive Livestreams
        </p>
        <div className="w-full grid grid-cols-4 md:grid-cols-3 gap-2">
          {latestLivestreams?.map((value, index) => {
            return (
              <div
                key={index}
                className="col-span-1 flex justify-center items-center cursor-pointer"
              >
                <Link href="/live-stream" className="w-full" target="_blank">
                  <Image
                    className="w-full h-10 object-cover rounded-md"
                    src={value.coverImage ?? DEFAULT_COVER_IMAGE}
                    width={460}
                    height={200}
                    alt=""
                    placeholder="blur"
                    blurDataURL={IMAGE_MD_BLUR_DATA_URL}
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
                  className="px-3 py-1 inline-flex justify-center items-center text-center text-sm text-secondary bg-transparent hover:bg-background rounded-full border border-secondary cursor-pointer transition-all duration-300"
                  onClick={() => fetchMoreLivestreams()}
                >
                  + More
                </button>
              )
            )}
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col justify-start items-center space-y-3 bg-third rounded-lg p-5 lg:p-10">
        <p className="text-primary text-base font-medium">
          {artist.artistName} | Exclusive Musics
        </p>
        <div className="w-full flex flex-col justify-start items-start space-y-3">
          {latestMusics.map((value, index) => {
            return (
              <div
                key={index}
                className="w-full flex flex-row justify-start items-center space-x-3"
              >
                <Image
                  className="w-20 h-20 object-cover rounded-md"
                  width={200}
                  height={200}
                  src={value.coverImage ?? DEFAULT_COVER_IMAGE}
                  alt=""
                  placeholder="blur"
                  blurDataURL={IMAGE_MD_BLUR_DATA_URL}
                />
                <div className="flex flex-col justify-start items-start space-y-2">
                  <Link href="/music" target="_blank">
                    <p className="text-primary text-base font-medium">
                      {value.title}
                    </p>
                  </Link>
                  <p className="text-secondary text-sm">{value.singer.name}</p>
                </div>
              </div>
            );
          })}
          <div className="w-full flex justify-center items-center">
            {isWorkingMusics ? (
              <Loading width={30} height={30} />
            ) : (
              musicPageCount > musicPage && (
                <button
                  className="px-3 py-1 inline-flex justify-center items-center text-center text-sm text-secondary bg-transparent hover:bg-background rounded-full border border-secondary cursor-pointer transition-all duration-300"
                  onClick={() => fetchMoreMusics()}
                >
                  + More
                </button>
              )
            )}
          </div>
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
            comment={() => {
              setSelectedPost(post);
              setIsPostModalOpened(true);
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
              className="px-3 py-1 inline-flex justify-center items-center text-center text-sm text-secondary bg-transparent hover:bg-third rounded-full border border-secondary cursor-pointer transition-all duration-300"
              onClick={() => fetchMorePosts()}
            >
              + More
            </button>
          </div>
        )
      )}
    </div>
  );

  return (
    <Layout>
      <div className="relative w-full xl:w-5/6 min-h-screen flex flex-col justify-start items-center px-5 pt-16 pb-36 lg:pt-16 lg:px-10">
        <div className="relative w-full h-[360px] p-3 flex flex-col justify-start items-center rounded-lg bg-third mb-5 lg:mb-10">
          <div className="w-full h-[260px] rounded-lg overflow-hidden">
            <Image
              className="w-full h-full object-cover"
              src={artist.bannerImage ?? DEFAULT_ARTIST.bannerImage}
              width={1600}
              height={450}
              alt=""
              placeholder="blur"
              blurDataURL={IMAGE_MD_BLUR_DATA_URL}
            />
          </div>
          <div className="w-full flex flex-col lg:flex-row flex-grow justify-start items-center pl-10 pr-20">
            <div className="w-full h-full flex flex-col lg:flex-row justify-start items-center space-x-0 lg:space-x-5 space-y-3 lg:space-y-0">
              <div className="w-24 h-24 -mt-10 rounded-full overflow-hidden flex justify-center items-center">
                <Image
                  className="w-full h-full object-cover"
                  src={artist.avatarImage ?? DEFAULT_ARTIST.avatarImage}
                  width={200}
                  height={200}
                  alt=""
                  placeholder="blur"
                  blurDataURL={IMAGE_SM_BLUR_DATA_URL}
                />
              </div>
              <div className="flex flex-col flex-grow justify-start items-center lg:items-start">
                <p className="text-blueSecondary text-center text-2xl xl:text-3xl font-medium">
                  {artist?.artistName}
                </p>
                <p className="text-white text-center text-sm font-medium">
                  {artist.phoneNumber ?? DEFAULT_ARTIST.phoneNumber}
                </p>
              </div>
              <div className="flex flex-col justify-start items-center">
                <p className="text-primary text-center text-base">
                  {artist?.email}
                </p>
                {artist?.website && (
                  <Link
                    href={artist.website}
                    target="_blank"
                    className="text-secondary text-center text-sm"
                  >
                    {artist.website
                      .replaceAll("https://", "")
                      .replaceAll("/", "")}
                  </Link>
                )}
              </div>
            </div>
          </div>

          <div className="absolute top-5 right-5 lg:top-[83%] w-10 h-10 rounded-md flex justify-center items-center text-white bg-background hover:bg-blueSecondary transition-all duration-300 cursor-pointer">
            <Share width={20} height={20} onClick={onShare} />
          </div>
        </div>

        <div className="w-full flex flex-col lg:flex-row space-x-0 lg:space-x-10 space-y-10 lg:space-y-0">
          {leftSideView}

          {postsView}
        </div>

        <PostModal
          post={selectedPost}
          setPost={setSelectedPost}
          visible={isPostModalOpened}
          setVisible={setIsPostModalOpened}
          favorite={() => {
            togglePostFavorite(selectedPost.id, !selectedPost.isFavorite).then(
              (value) => {
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
              }
            );
          }}
        />
      </div>

      <AudioControl
        audioPlayer={audioPlayer}
        onListView={() => router.push("/music")}
      />

      <ShareModal />
    </Layout>
  );
}
