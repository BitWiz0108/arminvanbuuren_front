import { useState } from "react";

import { useAuthValues } from "@/contexts/contextAuth";

import { API_BASE_URL, API_VERSION } from "@/libs/constants";

import { IPrayerRequest } from "@/interfaces/IPrayerRequest";
import { IPrayerReply } from "@/interfaces/IPrayerReply";
import { toast } from "react-toastify";

const usePrayerRequest = () => {
  const { accessToken, user } = useAuthValues();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const createReply = async (
    prayerRequestId: number | null,
    isAnonymous: boolean,
    content: string
  ) => {
    setIsLoading(true);
    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/prayer-request/reply`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          replierId: user.id,
          isAnonymous,
          prayerRequestId,
          content,
        }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      const reply = data as IPrayerReply;

      setIsLoading(false);
      return reply;
    } else {
      setIsLoading(false);
    }
    return null;
  };

  const togglePray = async (
    prayerRequestId: number | null,
    isPraying: boolean
  ) => {
    setIsLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/prayer-request/pray`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ userId: user.id, prayerRequestId, isPraying }),
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

  const fetchPrayerRequests = async (page: number, limit: number = 10) => {
    setIsLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/prayer-request?page=${page}&limit=${limit}&userId=${user.id}`,
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
      const prayerRequests = data.prayerRequests as Array<IPrayerRequest>;

      const pages = Number(data.pages);

      setIsLoading(false);
      return { prayerRequests, pages };
    } else {
      setIsLoading(false);
    }
    return { prayerRequests: [], pages: 0 };
  };

  const fetchPrayerRequest = async (id: number | null) => {
    setIsLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/prayer-request/post?id=${id}`,
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
      const post = data as IPrayerRequest;

      setIsLoading(false);
      return post;
    } else {
      setIsLoading(false);
    }
    return null;
  };

  const fetchReplies = async (
    prayerRequestId: number | null,
    page: number,
    limit: number = 10
  ) => {
    setIsLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/prayer-request/replies`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ prayerRequestId, page, limit }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      const replies = data.replies as Array<IPrayerReply>;
      const pages = Number(data.pages);

      setIsLoading(false);
      return { replies, pages };
    } else {
      setIsLoading(false);
    }
    return { replies: [], pages: 0 };
  };

  const createPrayerRequest = async (
    isAnonymous: boolean,
    title: string,
    content: string
  ) => {
    setIsLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/prayer-request`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          authorId: user.id,
          isAnonymous,
          title,
          content,
        }),
      }
    );

    if (response.ok) {
      setIsLoading(false);
      const data = await response.json();
      const post = data as IPrayerRequest;
      return post;
    } else {
      if (response.status == 500) {
        toast.error("We encountered an issue while processing your request.");
      } else {
        const data = await response.json();
        toast.error(
          data.message
            ? data.message
            : "We encountered an issue while processing your request."
        );
      }
    }

    setIsLoading(false);
    return null;
  };

  const updatePrayerRequest = async (
    id: number | null,
    isAnonymous: boolean,
    title: string,
    content: string
  ) => {
    setIsLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/prayer-request`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          id,
          authorId: user.id,
          isAnonymous,
          title,
          content,
        }),
      }
    );

    if (response.ok) {
      setIsLoading(false);
      const data = await response.json();
      const post = data as IPrayerRequest;

      return post;
    } else {
      if (response.status == 500) {
        toast.error("We encountered an issue while processing your request.");
      } else {
        const data = await response.json();
        toast.error(
          data.message
            ? data.message
            : "We encountered an issue while processing your request."
        );
      }
    }
    setIsLoading(false);
    return null;
  };

  const deletePrayerRequest = async (id: number | null) => {
    setIsLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/prayer-request?id=${id}&authorId=${user.id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.ok) {
      setIsLoading(false);
      return true;
    }

    setIsLoading(false);
    return false;
  };

  return {
    isLoading,
    createReply,
    togglePray,
    fetchPrayerRequests,
    fetchPrayerRequest,
    fetchReplies,
    createPrayerRequest,
    updatePrayerRequest,
    deletePrayerRequest,
  };
};

export default usePrayerRequest;
