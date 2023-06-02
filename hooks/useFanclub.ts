import { useState } from "react";

import { useAuthValues } from "@/contexts/contextAuth";

import { API_BASE_URL, API_VERSION } from "@/libs/constants";

import { IArtist } from "@/interfaces/IArtist";
import { IPost } from "@/interfaces/IPost";
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

      setIsLoading(false);
      return post;
    } else {
      setIsLoading(false);
    }
    return null;
  };

  const fetchPostByTitle = async (title: string) => {
    setIsLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/fanclub/post/get-by-title`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          userId: user.id,
          title: title.replaceAll("-", " ").toLowerCase().trim(),
        }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      const posts = data as Array<IPost>;

      setIsLoading(false);
      return posts;
    } else {
      setIsLoading(false);
    }
    return [];
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
    fetchPostByTitle,
    fetchPosts,
    fetchReplies,
  };
};

export default useFanclub;
