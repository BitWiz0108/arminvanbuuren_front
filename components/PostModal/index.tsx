import { useEffect, useState, KeyboardEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { toast } from "react-toastify";
import moment from "moment";
import Carousel from "react-multi-carousel";
import { twMerge } from "tailwind-merge";

import X from "@/components/Icons/X";
import Loading from "@/components/Loading";
import Reply from "@/components/Icons/Reply";
import Heart from "@/components/Icons/Heart";
import Home from "@/components/Icons/Home";
import ArrowLeft from "@/components/Icons/ArrowLeft";
import ArrowRight from "@/components/Icons/ArrowRight";
import VideoPlayer from "@/components/VideoPlayer";

import { useAuthValues } from "@/contexts/contextAuth";
import { useSizeValues } from "@/contexts/contextSize";

import useFanclub from "@/hooks/useFanclub";

import {
  DATETIME_FORMAT,
  DATE_FORMAT,
  DEFAULT_AVATAR_IMAGE,
  FILE_TYPE,
  IMAGE_BLUR_DATA_URL,
  PLACEHOLDER_IMAGE,
} from "@/libs/constants";
import { bigNumberFormat } from "@/libs/utils";

import { IPost } from "@/interfaces/IPost";

type Props = {
  post: IPost;
  setPost: Function;
  visible: boolean;
  setVisible: Function;
  favorite: Function;
  onPrev: Function;
  onNext: Function;
  fullscreenView: Function;
};

const PostModal = ({
  post,
  setPost,
  visible,
  setVisible,
  favorite,
  onPrev,
  onNext,
  fullscreenView,
}: Props) => {
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
  const { isSignedIn } = useAuthValues();
  const { isMobile } = useSizeValues();
  const { isLoading, fetchPost, createReply, fetchReplies } = useFanclub();

  const [replyContent, setReplyContent] = useState<string>("");
  const [repliesPage, setRepliesPage] = useState<number>(1);
  const [repliesPageCount, setRepliesPageCount] = useState<number>(1);
  const [lastPosX, setLastPosX] = useState<number>(0);

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
    if (post && post.id && isSignedIn && visible) {
      const postId = Number(post.id.toString());
      fetchPost(postId).then((value) => {
        if (value) {
          setPost({ ...post, ...value });
          setRepliesPageCount(1);
          setRepliesPage(1);
        }
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={twMerge(
            "fixed left-0 top-0 w-screen h-screen px-5 pt-5 bg-[#000000aa] flex justify-center items-center z-50",
            isMobile ? "pb-[180px]" : "pb-28 lg:pb-36"
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative w-full md:w-[640px] h-fit max-h-full px-5 md:px-10 pt-5 pb-5 bg-background rounded-lg overscroll-contain overflow-x-hidden overflow-y-auto">
            <div className="absolute top-2 right-2 text-primary cursor-pointer">
              <X width={24} height={24} onClick={() => setVisible(false)} />
            </div>

            <p className="w-full text-center font-sans text-[16px] text-primary font-medium select-none hover:text-blueSecondary transition-all duration-300 mb-3">
              {post.title}&nbsp;&nbsp;
              {post.releaseDate && (
                <span className="text-secondary text-xs lg:text-sm">
                  {moment(post.releaseDate).format(DATE_FORMAT)}
                </span>
              )}
            </p>

            <div className="w-full flex justify-center items-center mb-2">
              <div className="w-full flex flex-col justify-start items-start space-y-2 rounded-lg">
                <div className="relative w-full flex justify-center items-center">
                  <button
                    className={`absolute top-3 right-3 w-12 h-12 inline-flex flex-col justify-center items-center ${
                      post.isFavorite
                        ? "bg-bluePrimary hover:bg-blueSecondary"
                        : "bg-background hover:bg-blueSecondary"
                    }  text-primary rounded-md transition-all duration-300 z-10`}
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
                                fullscreenView(indexFile);
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

            <div className="w-full h-fit max-h-[200px] flex flex-col justify-start items-center overscroll-contain overflow-x-hidden overflow-y-auto pr-1 mb-2">
              {post.replies?.length > 0 && (
                <div className="w-full flex flex-col justify-start items-start space-y-2 mb-2">
                  {post.replies.map((reply, index) => {
                    return (
                      <div
                        key={index}
                        className="w-full flex justify-start items-start space-x-2 p-2 bg-background rounded-md"
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
                </div>
              )}
              <div className="w-full flex justify-center items-center">
                {isLoading ? (
                  <Loading width={30} height={30} />
                ) : (
                  repliesPageCount > repliesPage && (
                    <button
                      className="px-3 py-1 inline-flex justify-center items-center text-center text-sm text-secondary bg-transparent hover:bg-background rounded-full border border-secondary cursor-pointer transition-all duration-300"
                      onClick={() => fetchMoreReplies()}
                    >
                      + More
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="w-full flex flex-col md:flex-row justify-start items-start md:items-center space-x-0 md:space-x-2 space-y-2 md:space-y-0 mb-2">
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
            <div className="w-full flex justify-center items-center space-x-5 border-t border-dashed border-[#3e454d] px-5 pt-2">
              <div className="w-8 h-8 flex justify-center items-center text-primary hover:text-blueSecondary transition-all duration-300 cursor-pointer">
                {post.id && post.id > 1 && (
                  <ArrowLeft width={28} height={28} onClick={() => onPrev()} />
                )}
              </div>
              <div className="w-8 h-8 flex justify-center items-center text-primary hover:text-blueSecondary transition-all duration-300 cursor-pointer">
                <Home
                  width={24}
                  height={24}
                  onClick={() => setVisible(false)}
                />
              </div>
              <div className="w-8 h-8 flex justify-center items-center text-primary hover:text-blueSecondary transition-all duration-300 cursor-pointer">
                <ArrowRight width={28} height={28} onClick={() => onNext()} />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PostModal;
