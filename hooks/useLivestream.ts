import { useState } from "react";

import { useAuthValues } from "@/contexts/contextAuth";

import { getAWSSignedURL } from "@/libs/aws";
import {
  API_BASE_URL,
  API_VERSION,
  DEFAULT_AVATAR_IMAGE,
  PAGE_LIMIT,
} from "@/libs/constants";

import { DEFAULT_STREAM, IStream } from "@/interfaces/IStream";
import { IComment } from "@/interfaces/IComment";

const useLivestream = () => {
  const { accessToken, user, isMembership } = useAuthValues();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchLivestreams = async (
    page: number,
    isExclusive: boolean = false,
    limit: number = PAGE_LIMIT
  ) => {
    setIsLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/live-stream/list`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          userId: user.id,
          page,
          limit,
          isExclusive: isMembership ? null : false,
        }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      const livestreams = data.livestreams as Array<IStream>;
      const coverImagePromises = livestreams.map((livestream) => {
        return getAWSSignedURL(
          livestream.coverImage,
          DEFAULT_STREAM.coverImage
        );
      });
      const previewVideoPromises = livestreams.map((livestream) => {
        return getAWSSignedURL(livestream.previewVideo);
      });
      const previewVideoCompressedPromises = livestreams.map((livestream) => {
        return getAWSSignedURL(livestream.previewVideoCompressed);
      });
      const fullVideoPromises = livestreams.map((livestream) => {
        return getAWSSignedURL(livestream.fullVideo);
      });
      const fullVideoCompressedPromises = livestreams.map((livestream) => {
        return getAWSSignedURL(livestream.fullVideoCompressed);
      });
      const assets = await Promise.all([
        Promise.all(coverImagePromises),
        Promise.all(previewVideoPromises),
        Promise.all(previewVideoCompressedPromises),
        Promise.all(fullVideoPromises),
        Promise.all(fullVideoCompressedPromises),
      ]);
      livestreams.forEach((livestream, index) => {
        livestream.coverImage = assets[0][index];
        livestream.previewVideo = assets[1][index];
        livestream.previewVideoCompressed = assets[2][index];
        livestream.fullVideo = assets[3][index];
        livestream.fullVideoCompressed = assets[4][index];
      });

      const pages = Number(data.pages);
      const size = Number(data.size);
      const hours = Number(data.hours);

      setIsLoading(false);
      return { livestreams, pages, size, hours };
    } else {
      setIsLoading(false);
    }
    return { livestreams: [], pages: 0, size: 0, hours: 0 };
  };

  const fetchComments = async (
    livestreamId: number | null,
    page: number,
    limit: number = 30
  ) => {
    setIsLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/live-stream/comments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          id: livestreamId,
          page,
          limit,
        }),
      }
    );
    if (response.ok) {
      const data = await response.json();
      const comments = data.comments as Array<IComment>;
      const avatarImagePromises = comments.map((comment) => {
        return getAWSSignedURL(
          comment.author.avatarImage,
          DEFAULT_AVATAR_IMAGE
        );
      });
      const avatarImages = await Promise.all(avatarImagePromises);
      comments.forEach((comment, index) => {
        comment.author.avatarImage = avatarImages[index];
      });
      const pages = Number(data.pages);

      setIsLoading(false);
      return { comments, pages };
    } else {
      setIsLoading(false);
    }
    return { comments: [], pages: 0 };
  };

  const writeComment = async (livestreamId: number | null, content: string) => {
    setIsLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/live-stream/comment`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ livestreamId, userId: user.id, content }),
      }
    );
    if (response.ok) {
      const data = await response.json();
      const comment = data as IComment;
      comment.author.avatarImage = await getAWSSignedURL(
        comment.author.avatarImage,
        DEFAULT_AVATAR_IMAGE
      );

      setIsLoading(false);
      return comment;
    } else {
      setIsLoading(false);
    }
    return null;
  };

  return { isLoading, fetchLivestreams, fetchComments, writeComment };
};

export default useLivestream;
