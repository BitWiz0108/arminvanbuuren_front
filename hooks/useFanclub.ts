import { useState } from "react";

import { useAuthValues } from "@/contexts/contextAuth";

import { getAWSSignedURL } from "@/libs/aws";
import {
  API_BASE_URL,
  API_VERSION,
  DEFAULT_AVATAR_IMAGE,
} from "@/libs/constants";

import { DEFAULT_ARTIST, IArtist } from "@/interfaces/IArtist";
import { DEFAULT_POST, IPost } from "@/interfaces/IPost";
import { IReply } from "@/interfaces/IReply";

const useFanclub = () => {
  const { accessToken, user } = useAuthValues();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchArtist = async () => {
    setIsLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/fanclub/artist`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      const artist = data as IArtist;
      artist.avatarImage = await getAWSSignedURL(
        artist.avatarImage,
        DEFAULT_ARTIST.avatarImage
      );
      artist.bannerImage = await getAWSSignedURL(
        artist.bannerImage,
        DEFAULT_ARTIST.bannerImage
      );

      setIsLoading(false);
      return artist;
    } else {
      setIsLoading(false);
    }
    return null;
  };

  const createReply = async (postId: number | null, content: string) => {
    setIsLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/fanclub/reply`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ replierId: user.id, postId, content }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      const reply = data as IReply;
      reply.replier.avatarImage = await getAWSSignedURL(
        reply.replier.avatarImage,
        DEFAULT_AVATAR_IMAGE
      );

      setIsLoading(false);
      return reply;
    } else {
      setIsLoading(false);
    }
    return null;
  };

  const togglePostFavorite = async (
    postId: number | null,
    isFavorite: boolean
  ) => {
    setIsLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/fanclub/favorite`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ userId: user.id, postId, isFavorite }),
      }
    );

    if (response.ok) {
      setIsLoading(false);
      return true;
    } else {
      setIsLoading(false);
    }
    return false;
  };

  const fetchPosts = async (page: number, limit: number = 10) => {
    setIsLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/fanclub/posts`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ userId: user.id, page, limit }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      const posts = data.posts as Array<IPost>;
      const imagePromises = posts.map((post) => {
        return getAWSSignedURL(post.image, DEFAULT_POST.image);
      });
      const compressedImagePromises = posts.map((post) => {
        return getAWSSignedURL(post.compressedImage, DEFAULT_POST.image);
      });
      const images = await Promise.all([
        Promise.all(imagePromises),
        Promise.all(compressedImagePromises),
      ]);
      posts.forEach((post, index) => {
        post.image = images[0][index];
        post.compressedImage = images[1][index];
      });

      const pages = Number(data.pages);

      setIsLoading(false);
      return { posts, pages };
    } else {
      setIsLoading(false);
    }
    return { posts: [], pages: 0 };
  };

  const fetchPost = async (id: number | null) => {
    setIsLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/fanclub/post?id=${id}&userId=${user.id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      const post = data as IPost;
      post.image = await getAWSSignedURL(post.image, DEFAULT_POST.image);
      post.compressedImage = await getAWSSignedURL(
        post.compressedImage,
        DEFAULT_POST.image
      );
      const avatarImagePromises = post.replies.map((reply) => {
        return getAWSSignedURL(reply.replier.avatarImage, DEFAULT_AVATAR_IMAGE);
      });
      if (avatarImagePromises && avatarImagePromises.length > 0) {
        const avatarImages = await Promise.all(avatarImagePromises);
        post.replies.forEach(
          (reply, index) => (reply.replier.avatarImage = avatarImages[index])
        );
      }

      setIsLoading(false);
      return post;
    } else {
      setIsLoading(false);
    }
    return null;
  };

  const fetchReplies = async (
    postId: number | null,
    page: number,
    limit: number = 10
  ) => {
    setIsLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/fanclub/reply/list`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ postId, page, limit }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      const replies = data.replies as Array<IReply>;
      const avatarImagePromises = replies.map((reply) => {
        return getAWSSignedURL(reply.replier.avatarImage, DEFAULT_AVATAR_IMAGE);
      });
      if (avatarImagePromises && avatarImagePromises.length > 0) {
        const avatarImages = await Promise.all(avatarImagePromises);
        replies.forEach(
          (reply, index) => (reply.replier.avatarImage = avatarImages[index])
        );
      }

      const pages = Number(data.pages);

      setIsLoading(false);
      return { replies, pages };
    } else {
      setIsLoading(false);
    }
    return { replies: [], pages: 0 };
  };

  return {
    isLoading,
    fetchArtist,
    createReply,
    togglePostFavorite,
    fetchPost,
    fetchPosts,
    fetchReplies,
  };
};

export default useFanclub;
