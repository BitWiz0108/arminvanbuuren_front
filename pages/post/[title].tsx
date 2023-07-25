import { KeyboardEvent, useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import moment from "moment";
import Carousel from "react-multi-carousel";
import { twMerge } from "tailwind-merge";

import Layout from "@/components/Layout";
import Reply from "@/components/Icons/Reply";
import Heart from "@/components/Icons/Heart";
import Loading from "@/components/Loading";
import ArrowLeft from "@/components/Icons/ArrowLeft";
import ArrowRight from "@/components/Icons/ArrowRight";
import Home from "@/components/Icons/Home";
import AudioControl from "@/components/AudioControl";
import DonationModal from "@/components/DonationModal";
import VideoPlayer from "@/components/VideoPlayer";

import { useAuthValues } from "@/contexts/contextAuth";
import { useShareValues } from "@/contexts/contextShareData";
import { useSizeValues } from "@/contexts/contextSize";

import useFanclub from "@/hooks/useFanclub";

import {
  APP_TYPE,
  ASSET_TYPE,
  DATETIME_FORMAT,
  DATE_FORMAT,
  DEFAULT_AVATAR_IMAGE,
  FILE_TYPE,
  IMAGE_BLUR_DATA_URL,
  PLACEHOLDER_IMAGE,
  SYSTEM_TYPE,
} from "@/libs/constants";
import { bigNumberFormat, getUrlFormattedTitle } from "@/libs/utils";

import { DEFAULT_POST, IPost } from "@/interfaces/IPost";

export default function Post() {
  const SINGLE_RESPONSIVENESS = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 1,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1368 },
      items: 1,
    },
    tablet: {
      breakpoint: { max: 1368, min: 925 },
      items: 1,
    },
    mobile: {
      breakpoint: { max: 925, min: 0 },
      items: 1,
    },
  };

  const router = useRouter();
  const { title } = router.query;

  const { isSignedIn } = useAuthValues();
  const { audioPlayer } = useShareValues();
  const { isMobile } = useSizeValues();
  const {
    isLoading: isFanclubWorking,
    fetchPostByTitle,
    createReply,
    togglePostFavorite,
    fetchReplies,
  } = useFanclub();

  const [post, setPost] = useState<IPost>({
    ...DEFAULT_POST,
    files: [
      {
        type: FILE_TYPE.IMAGE,
        file: PLACEHOLDER_IMAGE,
        fileCompressed: PLACEHOLDER_IMAGE,
      },
    ],
  });
  const [posts, setPosts] = useState<Array<IPost>>([]);
  const [replyContent, setReplyContent] = useState<string>("");
  const [repliesPage, setRepliesPage] = useState<number>(1);
  const [repliesPageCount, setRepliesPageCount] = useState<number>(1);
  const [lastPosX, setLastPosX] = useState<number>(0);

  const favorite = () => {
    togglePostFavorite(post.id, !post.isFavorite).then((value) => {
      if (value) {
        setPost({
          ...post,
          numberOfFavorites: post.isFavorite
            ? post.numberOfFavorites - 1
            : post.numberOfFavorites + 1,
          isFavorite: !post.isFavorite,
        });
      }
    });
  };

  const reply = () => {
    createReply(post.id, replyContent).then((value) => {
      if (value) {
        setPost({ ...post, replies: [...post.replies, value] });
        setReplyContent("");
      }
    });
  };

  const fetchMoreReplies = () => {
    fetchReplies(post.id, repliesPage + 1).then((result) => {
      setPost({ ...post, replies: [...post.replies, ...result.replies] });
      setRepliesPageCount(result.pages);

      if (repliesPage < result.pages) {
        setRepliesPage((prev) => prev + 1);
      }
    });
  };

  useEffect(() => {
    if (title && isSignedIn) {
      fetchPostByTitle(title.toString()).then((value) => {
        if (value.length > 0 && value[1]) {
          setPosts(value);
          setPost({ ...post, ...value[1] });
          setRepliesPageCount(1);
          setRepliesPage(1);
        } else {
          router.push(
            SYSTEM_TYPE == APP_TYPE.CHURCH ? "/community" : "/fanclub"
          );
        }
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, isSignedIn]);

  const fullContent = (
    <>
      <div
        className={twMerge(
          "w-full h-screen flex justify-center items-start overflow-x-hidden overflow-y-auto",
          isMobile ? "pb-[180px]" : "pb-28 lg:pb-36"
        )}
      >
        <div className="relative w-full lg:w-2/3 min-h-screen flex justify-center items-start bg-background pt-16">
          <div className="w-full flex flex-col justify-start items-start p-3">
            <p className="w-full text-center text-2xl lg:text-4xl text-primary font-medium select-none hover:text-blueSecondary transition-all duration-300 mb-5">
              {post.title}&nbsp;&nbsp;
              {post.releaseDate && (
                <span className="text-secondary text-xl lg:text-2xl">
                  {moment(post.releaseDate).format(DATE_FORMAT)}
                </span>
              )}
            </p>

            <div
              className="none-tailwind"
              dangerouslySetInnerHTML={{
                __html: post.content,
              }}
            ></div>

            <div className="w-full flex justify-center items-center mb-5">
              <div className="w-full flex flex-col justify-start items-start space-y-2 rounded-lg">
                <div className="relative w-full flex justify-center items-center">
                  <button
                    className={`absolute top-3 right-3 w-12 h-12 inline-flex flex-col justify-center items-center ${
                      post.isFavorite
                        ? "bg-bluePrimary hover:bg-blueSecondary"
                        : "bg-background hover:bg-blueSecondary"
                    }  text-primary rounded-md transition-all duration-300`}
                    onClick={() => favorite()}
                  >
                    <Heart width={20} height={20} />
                    <span className="text-center text-xs text-primary">
                      {bigNumberFormat(post.numberOfFavorites)}
                    </span>
                  </button>
                  <div className="relative w-full">
                    <Carousel
                      ssr
                      partialVisible
                      autoPlay={false}
                      responsive={SINGLE_RESPONSIVENESS}
                      className="w-full"
                      infinite
                      swipeable
                      draggable
                      arrows={post.files.length > 1}
                    >
                      {post.files.map((file, indexFile) => {
                        return (
                          <div
                            key={indexFile}
                            className="w-full relative pb-[56.25%] hover:cursor-pointer rounded-md overflow-hidden"
                            onMouseDown={(e) => setLastPosX(e.screenX)}
                            onMouseUp={(e) => {
                              if (Math.abs(e.screenX - lastPosX) < 30) {
                                // fullscreenView(indexFile);
                              }
                            }}
                          >
                            {file.type == FILE_TYPE.IMAGE ? (
                              <Image
                                className="absolute inset-0 object-cover object-center w-full h-full rounded-md pointer-events-none"
                                src={file.fileCompressed ?? PLACEHOLDER_IMAGE}
                                width={1600}
                                height={900}
                                alt=""
                                placeholder="blur"
                                blurDataURL={IMAGE_BLUR_DATA_URL}
                                priority
                              />
                            ) : (
                              <VideoPlayer
                                loop
                                muted
                                autoPlay
                                playsInline
                                disablePictureInPicture
                                className={`absolute inset-0 object-cover object-center w-full h-full rounded-md pointer-events-none`}
                                src={file.fileCompressed}
                              />
                            )}
                          </div>
                        );
                      })}
                    </Carousel>
                  </div>
                </div>
              </div>
            </div>

            {post.replies?.length > 0 && (
              <div className="w-full flex flex-col justify-start items-start space-y-2 mb-5">
                {post.replies.map((reply, index) => {
                  return (
                    <div
                      key={index}
                      className="w-full flex justify-start items-center space-x-2 p-2 bg-background rounded-md"
                    >
                      <div className="w-24 min-w-[96px] flex flex-col justify-start items-center">
                        <Image
                          className="w-8 h-8 object-cover rounded-full overflow-hidden"
                          src={
                            reply.replier?.avatarImage ?? DEFAULT_AVATAR_IMAGE
                          }
                          width={333}
                          height={333}
                          alt=""
                          placeholder="blur"
                          blurDataURL={IMAGE_BLUR_DATA_URL}
                          priority
                        />
                        <p className="w-full text-primary text-sm text-center truncate">
                          {reply.replier?.username ?? "anonymous"}
                        </p>
                      </div>
                      <div className="flex flex-grow flex-col justify-start items-start space-y-2">
                        <p className="w-full text-left text-sm text-primary">
                          {reply.content}
                        </p>
                        <p className="w-full flex justify-end items-center text-xs text-secondary">
                          {moment(reply.createdAt).format(DATETIME_FORMAT)}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div className="w-full flex justify-center items-center">
                  {isFanclubWorking ? (
                    <Loading width={30} height={30} />
                  ) : (
                    repliesPageCount > repliesPage && (
                      <button
                        className="px-3 py-1 inline-flex justify-center items-center text-center text-sm text-secondary bg-transparent hover:bg-blueSecondary hover:text-white hover:border-blueSecondary rounded-full border border-secondary cursor-pointer transition-all duration-300"
                        onClick={() => fetchMoreReplies()}
                      >
                        + More
                      </button>
                    )
                  )}
                </div>
              </div>
            )}

            <div className="w-full flex flex-col md:flex-row justify-start items-start md:items-center space-x-0 md:space-x-2 space-y-2 md:space-y-0 mb-5">
              <input
                type="text"
                placeholder="Please type what you want..."
                className="w-full md:w-auto inline-flex h-10 flex-grow rounded-md border-[0.0625rem] border-[#3e454d] p-3 text-left text-sm text-primary bg-transparent outline-none focus:outline-none"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                  if (e.key == "Enter") {
                    if (!replyContent) {
                      toast.warn("Please type message correctly.");
                      return;
                    }
                    reply();
                  }
                }}
              />
              <button
                className="w-full md:w-40 h-10 inline-flex justify-center items-center space-x-2 bg-bluePrimary hover:bg-blueSecondary text-primary rounded-md transition-all duration-300"
                onClick={() => {
                  if (!replyContent) {
                    toast.warn("Please type message correctly.");
                    return;
                  }
                  reply();
                }}
              >
                <Reply />
                <span>Comment</span>
              </button>
            </div>

            <div className="w-full flex justify-center items-center space-x-5 border-t border-dashed border-[#3e454d] p-5">
              <div className="w-8 h-8 flex justify-center items-center text-primary hover:text-blueSecondary transition-all duration-300 cursor-pointer">
                {posts[0] && (
                  <ArrowLeft
                    width={28}
                    height={28}
                    onClick={() =>
                      router.push(getUrlFormattedTitle(posts[0], "post"))
                    }
                  />
                )}
              </div>
              <div className="w-8 h-8 flex justify-center items-center text-primary hover:text-blueSecondary transition-all duration-300 cursor-pointer">
                <Home
                  width={24}
                  height={24}
                  onClick={() =>
                    router.push(
                      SYSTEM_TYPE == APP_TYPE.CHURCH ? "/community" : "/fanclub"
                    )
                  }
                />
              </div>
              <div className="w-8 h-8 flex justify-center items-center text-primary hover:text-blueSecondary transition-all duration-300 cursor-pointer">
                {posts[2] && (
                  <ArrowRight
                    width={28}
                    height={28}
                    onClick={() =>
                      router.push(getUrlFormattedTitle(posts[2], "post"))
                    }
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <DonationModal
        assetType={ASSET_TYPE.MUSIC}
        musicId={audioPlayer.getPlayingTrack().id}
      />

      <AudioControl
        audioPlayer={audioPlayer}
        onListView={() =>
          router.push(SYSTEM_TYPE == APP_TYPE.CHURCH ? "/audio" : "/music")
        }
      />
    </>
  );

  return <Layout>{isSignedIn ? fullContent : null}</Layout>;
}
