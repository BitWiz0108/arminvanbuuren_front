import { KeyboardEvent, useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { twMerge } from "tailwind-merge";
import moment from "moment";

import Layout from "@/components/Layout";
import Reply from "@/components/Icons/Reply";
import Loading from "@/components/Loading";
import ArrowLeft from "@/components/Icons/ArrowLeft";
import ArrowRight from "@/components/Icons/ArrowRight";
import Home from "@/components/Icons/Home";
import AudioControl from "@/components/AudioControl";
import DonationModal from "@/components/DonationModal";

import { useAuthValues } from "@/contexts/contextAuth";
import { useSizeValues } from "@/contexts/contextSize";
import { useShareValues } from "@/contexts/contextShareData";

import usePrayerRequest from "@/hooks/usePrayerRequest";

import {
  APP_TYPE,
  ASSET_TYPE,
  DATETIME_FORMAT,
  DEFAULT_AVATAR_IMAGE,
  IMAGE_BLUR_DATA_URL,
  SYSTEM_TYPE,
} from "@/libs/constants";

import {
  DEFAULT_PRAYERREQUEST,
  IPrayerRequest,
} from "@/interfaces/IPrayerRequest";

export default function PrayerRequest() {
  const router = useRouter();
  const { id } = router.query;

  const { isSignedIn } = useAuthValues();
  const { isMobile } = useSizeValues();
  const { audioPlayer } = useShareValues();

  const { isLoading, createReply, fetchPrayerRequest, fetchReplies } =
    usePrayerRequest();

  const [prayerRequest, setPrayerRequest] = useState<IPrayerRequest>({
    ...DEFAULT_PRAYERREQUEST,
  });
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
    if (id && isSignedIn) {
      const prayerRequestId = Number(id.toString());
      fetchReplies(prayerRequestId, repliesPage + 1);
      fetchPrayerRequest(prayerRequestId).then((value) => {
        if (value) {
          setPrayerRequest(value);
          setRepliesPageCount(1);
          setRepliesPage(1);
        } else {
          // router.push("/fan-club");
        }
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isSignedIn]);

  const fullContent = (
    <>
      <div className="w-full h-screen overflow-x-hidden overflow-y-auto">
        <div
          className={twMerge(
            "relative px-5 pt-16 bg-background w-full min-h-screen flex justify-center items-center",
            isMobile ? "pb-[180px]" : "pb-28 lg:pb-36"
          )}
        >
          <div className="w-full flex flex-col justify-start items-start p-3">
            <p className="w-full text-center text-2xl lg:text-4xl text-primary font-medium select-none hover:text-blueSecondary transition-all duration-300 mb-5">
              {prayerRequest.title}
            </p>

            <div
              className="w-full p-5 mb-5"
              dangerouslySetInnerHTML={{
                __html: prayerRequest.content,
              }}
            ></div>

            {prayerRequest.replies?.length > 0 && (
              <div className="w-full flex flex-col justify-start items-start space-y-2 mb-5">
                {prayerRequest.replies.map((reply, index) => {
                  return (
                    <div
                      key={index}
                      className="w-full flex justify-start items-center space-x-2 p-2 bg-third rounded-md"
                    >
                      <div className="w-24 min-w-[96px] flex flex-col justify-start items-center">
                        <Image
                          className="w-8 h-8 object-cover rounded-full overflow-hidden"
                          src={
                            reply.replier?.avatarImage ?? DEFAULT_AVATAR_IMAGE
                          }
                          width={40}
                          height={40}
                          alt=""
                          placeholder="blur"
                          blurDataURL={IMAGE_BLUR_DATA_URL}
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
                {prayerRequest.id && prayerRequest.id > 1 && (
                  <ArrowLeft
                    width={28}
                    height={28}
                    onClick={() =>
                      router.push(
                        `/prayer-request-detail/${prayerRequest.id! - 1}`
                      )
                    }
                  />
                )}
              </div>
              <div className="w-8 h-8 flex justify-center items-center text-primary hover:text-blueSecondary transition-all duration-300 cursor-pointer">
                <Home
                  width={24}
                  height={24}
                  onClick={() => router.push("/fan-club")}
                />
              </div>
              <div className="w-8 h-8 flex justify-center items-center text-primary hover:text-blueSecondary transition-all duration-300 cursor-pointer">
                <ArrowRight
                  width={28}
                  height={28}
                  onClick={() =>
                    router.push(
                      `/prayer-request-detail/${prayerRequest.id! + 1}`
                    )
                  }
                />
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
