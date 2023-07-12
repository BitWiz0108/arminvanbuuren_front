import { useState, KeyboardEvent, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import moment from "moment";
import { twMerge } from "tailwind-merge";

import X from "@/components/Icons/X";
import Reply from "@/components/Icons/Reply";
import Loading from "@/components/Loading";
import Delete from "@/components/Icons/Delete";
import Edit from "@/components/Icons/Edit";

import { useAuthValues } from "@/contexts/contextAuth";
import { useShareValues } from "@/contexts/contextShareData";
import { useSizeValues } from "@/contexts/contextSize";

import useLivestream from "@/hooks/useLivestream";

import {
  DATETIME_FORMAT,
  DEFAULT_AVATAR_IMAGE,
  IMAGE_BLUR_DATA_URL,
} from "@/libs/constants";

import { IComment } from "@/interfaces/IComment";
import EditCommentModal from "../EditCommentModal";

type Props = {
  livestreamId: number | null;
};

const LiveStreamCommentModal = ({ livestreamId }: Props) => {
  const { isSignedIn, user } = useAuthValues();
  const { isLivestreamCommentVisible, setIsLivestreamCommentVisible } =
    useShareValues();
  const { isMobile } = useSizeValues();
  const { isLoading, fetchComments, writeComment, editComment, deleteComment } =
    useLivestream();

  const [comments, setComments] = useState<Array<IComment>>([]);
  const [comment, setComment] = useState<IComment>();
  const [replyContent, setReplyContent] = useState<string>("");
  const [pageCount, setPageCount] = useState<number>(1);
  const [page, setPage] = useState<number>(1);
  const [isEditCommentModalVisible, setIsEditCommentModalVisible] =
    useState<boolean>(false);

  const reply = () => {
    writeComment(livestreamId, replyContent).then((value) => {
      if (value) {
        setComments([value, ...comments]);
        setReplyContent("");
      }
    });
  };

  const fetchMoreComments = () => {
    fetchComments(livestreamId, page + 1).then((result) => {
      setComments([...comments, ...result.comments]);
      setPageCount(result.pages);

      if (page < result.pages) {
        setPage((prev) => prev + 1);
      }
    });
  };

  useEffect(() => {
    if (isSignedIn && isLivestreamCommentVisible) {
      fetchComments(livestreamId, 1).then((value) => {
        setComments(value.comments);
        setPageCount(value.pages);
        setPage(1);
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn, isLivestreamCommentVisible, livestreamId]);

  return (
    <AnimatePresence>
      {isLivestreamCommentVisible && (
        <motion.div
          className={twMerge(
            "fixed right-0 top-0 w-screen md:w-[340px] h-screen bg-background flex justify-end items-center border-l border-third z-40",
            isMobile ? "pb-[180px]" : "pb-24 lg:pb-32"
          )}
          initial={{ x: 340 }}
          animate={{ x: 0 }}
          exit={{ x: 340 }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative w-full h-full px-2 pt-10 pb-8 bg-background">
            <div className="absolute top-2 left-2 text-primary cursor-pointer">
              <X
                width={24}
                height={24}
                onClick={() => setIsLivestreamCommentVisible(false)}
              />
            </div>
            <div className="w-full h-full flex flex-col justify-start items-center">
              <div className="w-full h-auto flex-grow flex flex-col justify-start items-center overflow-x-hidden overflow-y-auto pr-1 space-y-1">
                {comments.map((reply, index) => {
                  return (
                    <div
                      key={index}
                      className="w-full flex justify-start items-start space-x-2 p-2 bg-third rounded-md"
                    >
                      <div className="w-24 min-w-[96px] flex flex-col justify-start items-center">
                        <Image
                          className="w-8 h-8 object-cover rounded-full overflow-hidden"
                          src={reply.author.avatarImage ?? DEFAULT_AVATAR_IMAGE}
                          width={333}
                          height={333}
                          alt=""
                          placeholder="blur"
                          blurDataURL={IMAGE_BLUR_DATA_URL}
                          priority
                        />
                        <p className="w-full text-primary text-sm text-center truncate">
                          {reply.author.username ?? "anonymous"}
                        </p>
                      </div>
                      <div className="flex flex-grow flex-col justify-start items-start space-y-2">
                        <div className="w-full flex justify-end items-center space-x-2">
                          {user.id == reply.author.id ? (
                            <>
                              <Edit
                                width={18}
                                height={18}
                                className="text-primary hover:text-blueSecondary cursor-pointer transition-all duration-300"
                                onClick={() => {
                                  setComment(reply);
                                  setIsEditCommentModalVisible(true);
                                }}
                              />
                              <Delete
                                width={18}
                                height={18}
                                className="text-primary hover:text-red-500 cursor-pointer transition-all duration-300"
                                onClick={() => {
                                  deleteComment(reply.id).then((value) => {
                                    if (value) {
                                      const tcomments = comments.slice();
                                      const index = tcomments.findIndex(
                                        (comment) => comment.id == reply.id
                                      );
                                      if (index >= 0) {
                                        tcomments.splice(index, 1);
                                        setComments(tcomments);
                                      }
                                    }
                                  });
                                }}
                              />
                            </>
                          ) : (
                            <></>
                          )}
                        </div>
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
                  {isLoading ? (
                    <Loading width={30} height={30} />
                  ) : (
                    pageCount > page && (
                      <button
                        className="px-3 py-1 inline-flex justify-center items-center text-center text-sm text-secondary bg-transparent hover:bg-blueSecondary hover:text-white hover:border-blueSecondary rounded-full border border-secondary cursor-pointer transition-all duration-300"
                        onClick={() => fetchMoreComments()}
                      >
                        + More
                      </button>
                    )
                  )}
                </div>
              </div>
              <div className="w-full flex flex-row justify-start items-center pt-2 space-x-2">
                <input
                  type="text"
                  placeholder="Please type what you want..."
                  className="w-auto inline-flex h-10 flex-grow rounded-md border-[0.0625rem] border-[#3e454d] p-3 text-left text-sm text-primary bg-transparent outline-none focus:outline-none"
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
                  className="w-10 h-10 inline-flex justify-center items-center space-x-2 bg-bluePrimary hover:bg-blueSecondary text-primary rounded-md transition-all duration-300"
                  onClick={() => {
                    if (!replyContent) {
                      toast.warn("Please type message correctly.");
                      return;
                    }
                    reply();
                  }}
                >
                  <Reply />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <EditCommentModal
        isVisible={isEditCommentModalVisible}
        setVisible={setIsEditCommentModalVisible}
        comment={comment}
        editComment={(id: number, content: string) => {
          editComment(id, livestreamId, content).then((value) => {
            if (value) {
              const tcomments = comments.slice();
              const index = tcomments.findIndex(
                (tcomment) => tcomment.id == comment?.id
              );
              if (index >= 0) {
                tcomments[index].content = content;
                setComments(tcomments);
              }
            }
          });
        }}
      />
    </AnimatePresence>
  );
};

export default LiveStreamCommentModal;
