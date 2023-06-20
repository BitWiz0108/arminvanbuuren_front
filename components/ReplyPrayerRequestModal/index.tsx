import { useEffect, useState, KeyboardEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { toast } from "react-toastify";
import moment from "moment";

import X from "@/components/Icons/X";
import Loading from "@/components/Loading";
import Reply from "@/components/Icons/Reply";
import Switch from "@/components/Switch";

import { useAuthValues } from "@/contexts/contextAuth";

import {
  DATETIME_FORMAT,
  DEFAULT_AVATAR_IMAGE,
  IMAGE_BLUR_DATA_URL,
} from "@/libs/constants";

import { IPrayerRequest } from "@/interfaces/IPrayerRequest";
import usePrayerRequest from "@/hooks/usePrayerRequest";

type Props = {
  prayerRequest: IPrayerRequest;
  setPrayerRequest: Function;
  visible: boolean;
  setVisible: Function;
};

const ReplyPrayerRequestModal = ({
  prayerRequest,
  setPrayerRequest,
  visible,
  setVisible,
}: Props) => {
  const { isSignedIn } = useAuthValues();
  const { isLoading, fetchPrayerRequest, createReply, fetchReplies } =
    usePrayerRequest();

  const [replyContent, setReplyContent] = useState<string>("");
  const [repliesPage, setRepliesPage] = useState<number>(1);
  const [repliesPageCount, setRepliesPageCount] = useState<number>(1);
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);

  const reply = () => {
    createReply(prayerRequest.id, isAnonymous, replyContent).then((value) => {
      if (value) {
        setPrayerRequest({
          ...prayerRequest,
          replies: [...prayerRequest.replies, value],
        });
        setReplyContent("");
      }
    });
  };

  const fetchMoreReplies = () => {
    fetchReplies(prayerRequest.id, repliesPage + 1).then((result) => {
      setPrayerRequest({
        ...prayerRequest,
        replies: [...prayerRequest.replies, ...result.replies],
      });
      setRepliesPageCount(result.pages);

      if (repliesPage < result.pages) {
        setRepliesPage((prev) => prev + 1);
      }
    });
  };

  useEffect(() => {
    if (prayerRequest && prayerRequest.id && isSignedIn && visible) {
      const postId = Number(prayerRequest.id.toString());
      fetchPrayerRequest(postId).then((value) => {
        if (value) {
          setPrayerRequest(value);
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
          className="fixed left-0 top-0 w-screen h-screen p-5 bg-[#000000aa] flex justify-center items-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative w-full md:w-[640px] h-fit max-h-full px-5 md:px-10 pt-16 pb-5 md:pb-10 bg-background rounded-lg overscroll-contain overflow-x-hidden overflow-y-auto">
            <div className="absolute top-5 right-5 text-primary cursor-pointer">
              <X width={24} height={24} onClick={() => setVisible(false)} />
            </div>

            <p className="w-full text-center text-xl md:text-xl lg:text-3xl text-primary font-medium select-none hover:text-blueSecondary transition-all duration-300 mb-5">
              Reply to&nbsp;
              {prayerRequest.isAnonymous
                ? "Anonymous"
                : prayerRequest.author.firstName +
                  " " +
                  prayerRequest.author.lastName}
            </p>

            <div className="relative w-full flex justify-center items-center mt-5 mb-5">
              <Switch
                checked={isAnonymous}
                setChecked={setIsAnonymous}
                label="Reply As Anonymous"
                labelPos="left"
              />
            </div>

            <div className="w-full h-fit max-h-[340px] flex flex-col justify-start items-center overscroll-contain overflow-x-hidden overflow-y-auto pr-1 mb-2">
              {prayerRequest.replies?.length > 0 && (
                <div className="w-full flex flex-col justify-start items-start space-y-2 mb-2">
                  {prayerRequest.replies.map((reply, index) => {
                    return (
                      <div
                        key={index}
                        className="w-full flex justify-center items-center space-x-2 p-2 bg-third rounded-md"
                      >
                        <div className="w-24 min-w-[96px] flex flex-col justify-center items-center space-y-1">
                          {!reply.isAnonymous ? (
                            <>
                              <Image
                                className="w-8 h-8 object-cover rounded-full overflow-hidden"
                                src={
                                  reply.replier?.avatarImage ??
                                  DEFAULT_AVATAR_IMAGE
                                }
                                width={40}
                                height={40}
                                alt=""
                                placeholder="blur"
                                blurDataURL={IMAGE_BLUR_DATA_URL}
                              />
                              <p className="w-full text-primary text-sm text-center truncate">
                                {reply.isAnonymous
                                  ? "anonymous"
                                  : reply.replier.username}
                              </p>
                            </>
                          ) : (
                            "Anonymous"
                          )}
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
                      className="px-3 py-1 inline-flex justify-center items-center text-center text-sm text-secondary bg-transparent hover:bg-third rounded-full border border-secondary cursor-pointer transition-all duration-300"
                      onClick={() => fetchMoreReplies()}
                    >
                      + More
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="w-full flex flex-col md:flex-row justify-start items-start md:items-center space-x-0 md:space-x-2 space-y-2 md:space-y-0">
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
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReplyPrayerRequestModal;
