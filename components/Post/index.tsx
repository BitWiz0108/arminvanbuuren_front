import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

import Heart from "@/components/Icons/Heart";
import HeartFill from "@/components/Icons/HeartFill";
import Comment from "@/components/Icons/Comment";
import Share from "@/components/Icons/Share";

import { useShareValues } from "@/contexts/contextShareData";

import { bigNumberFormat } from "@/libs/utils";
import {
  DEFAULT_BANNER_IMAGE,
  IMAGE_MD_BLUR_DATA_URL,
  SITE_BASE_URL,
} from "@/libs/constants";

import { IPost } from "@/interfaces/IPost";
import { DEFAULT_SHAREDATA } from "@/interfaces/IShareData";

type Props = {
  post: IPost;
  favorite: Function;
  comment: Function;
};

const Post = ({ post, favorite, comment }: Props) => {
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
      <Link href={`/post/${post.id}`} target="_blank">
        <p
          className={twMerge(
            "w-full text-left text-base lg:text-lg font-medium transition-all duration-300",
            isSeenMore
              ? "text-blueSecondary"
              : "text-primary hover:text-blueSecondary"
          )}
        >
          {post.title}
        </p>
      </Link>
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
        <Link className="w-full" href={`/post/${post.id}`}>
          <Image
            className="w-full aspect-w-16 aspect-h-9 object-cover rounded-md"
            src={post.compressedImage ?? DEFAULT_BANNER_IMAGE}
            width={1600}
            height={900}
            alt=""
            placeholder="blur"
            blurDataURL={IMAGE_MD_BLUR_DATA_URL}
          />
        </Link>
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
