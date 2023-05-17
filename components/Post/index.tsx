import { useState } from "react";
import Image from "next/image";
import { twMerge } from "tailwind-merge";

import Heart from "@/components/Icons/Heart";
import HeartFill from "@/components/Icons/HeartFill";
import Comment from "@/components/Icons/Comment";
import Share from "@/components/Icons/Share";
import VideoPlayer from "@/components/VideoPlayer";

import { useShareValues } from "@/contexts/contextShareData";

import { bigNumberFormat } from "@/libs/utils";
import {
  FILE_TYPE,
  IMAGE_BLUR_DATA_URL,
  PLACEHOLDER_IMAGE,
  SITE_BASE_URL,
} from "@/libs/constants";

import { IPost } from "@/interfaces/IPost";
import { DEFAULT_SHAREDATA } from "@/interfaces/IShareData";

type Props = {
  post: IPost;
  favorite: Function;
  comment: Function;
  fullscreenView: Function;
};

const Post = ({ post, favorite, comment, fullscreenView }: Props) => {
  const { setIsShareModalVisible, setShareData } = useShareValues();

  const [isSeenMore, setIsSeenMore] = useState<boolean>(false);

  const onShare = () => {
    setShareData({
      ...DEFAULT_SHAREDATA,
      url: `${SITE_BASE_URL}/post/${post.id}`,
      title: post.title,
      subject: post.title,
      quote: post.title,
      about: post.content,
      body: post.content,
      summary: post.title,
    });
    setIsShareModalVisible(true);
  };

  return (
    <div className="w-full flex flex-col justify-start items-start space-y-2 p-3 rounded-lg bg-third">
      <p
        className={twMerge(
          "w-full text-left text-base lg:text-lg font-medium transition-all duration-300 hover:cursor-pointer",
          isSeenMore
            ? "text-blueSecondary"
            : "text-primary hover:text-blueSecondary"
        )}
        onClick={() => comment()}
      >
        {post.title}
      </p>
      <div className={twMerge("relative w-full", isSeenMore ? "pb-5" : "pb-0")}>
        <div
          className={twMerge(
            "relative w-full  text-sm",
            isSeenMore
              ? "text-primary h-fit"
              : "text-secondary max-h-[22px] overflow-hidden"
          )}
          dangerouslySetInnerHTML={{
            __html: post.content,
          }}
        ></div>
        {isSeenMore ? (
          <div
            className="absolute bottom-0 right-0 text-secondary text-sm pl-1 bg-third hover:text-primary transition-all duration-300 cursor-pointer select-none"
            onClick={() => setIsSeenMore(false)}
          >
            <b>Less</b>...
          </div>
        ) : (
          <div
            className="absolute top-0 right-0 text-secondary text-sm pl-1 bg-third hover:text-primary transition-all duration-300 cursor-pointer select-none"
            onClick={() => setIsSeenMore(true)}
          >
            ...<b>See more</b>
          </div>
        )}
      </div>
      <div className="relative w-full">
        <div
          className="w-full relative pb-[56.25%] hover:cursor-pointer rounded-md"
          onClick={() => fullscreenView()}
        >
          {post.type == FILE_TYPE.IMAGE ? (
            <Image
              className="absolute inset-0 object-cover object-center w-full h-full rounded-md"
              src={post.imageCompressed ?? PLACEHOLDER_IMAGE}
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
              className="absolute inset-0 object-cover object-center w-full h-full rounded-md"
              src={post.videoCompressed}
            />
          )}
        </div>
      </div>

      <div className="w-full flex flex-wrap justify-center items-center">
        <div
          className="min-w-[100px] w-1/3 p-2 flex justify-center items-center space-x-2 text-secondary hover:text-primary hover:bg-background rounded-md cursor-pointer transition-all duration-300"
          onClick={() => favorite()}
        >
          {post.isFavorite ? (
            <HeartFill width={18} height={18} />
          ) : (
            <Heart width={18} height={18} />
          )}
          <span className="text-sm md:text-base select-none">
            Like&nbsp;
            <span className="text-xs">
              ({bigNumberFormat(post.numberOfFavorites)})
            </span>
          </span>
        </div>
        <div
          className="min-w-[100px] w-1/3 p-2 flex justify-center items-center space-x-2 text-secondary hover:text-primary hover:bg-background rounded-md cursor-pointer transition-all duration-300"
          onClick={() => comment()}
        >
          <Comment width={18} height={18} />
          <span className="text-sm md:text-base select-none">Comment</span>
        </div>
        <div
          className="min-w-[100px] w-1/3 p-2 flex justify-center items-center space-x-2 text-secondary hover:text-primary hover:bg-background rounded-md cursor-pointer transition-all duration-300"
          onClick={() => onShare()}
        >
          <Share width={18} height={18} />
          <span className="text-sm md:text-base select-none">Share</span>
        </div>
      </div>
    </div>
  );
};

export default Post;
