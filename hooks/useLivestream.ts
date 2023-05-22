import { useState } from "react";

import { useAuthValues } from "@/contexts/contextAuth";

import { getAWSSignedURL } from "@/libs/aws";
import { API_BASE_URL, API_VERSION, PAGE_LIMIT } from "@/libs/constants";

import { IStream } from "@/interfaces/IStream";
import { IComment } from "@/interfaces/IComment";
import { ICategory } from "@/interfaces/ICategory";

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
      const previewVideoPromises = livestreams.map((livestream) => {
        if (!livestream.previewVideo.includes("video/2023")) {
          return livestream.previewVideo;
        } else {
          return getAWSSignedURL(livestream.previewVideo);
        }
      });
      const previewVideoCompressedPromises = livestreams.map((livestream) => {
        if (!livestream.previewVideoCompressed.includes("video/2023")) {
          return livestream.previewVideoCompressed;
        } else {
          return getAWSSignedURL(livestream.previewVideoCompressed);
        }
      });
      const fullVideoPromises = livestreams.map((livestream) => {
        if (!livestream.fullVideo.includes("video/2023")) {
          return livestream.fullVideo;
        } else {
          return getAWSSignedURL(livestream.fullVideo);
        }
      });
      const fullVideoCompressedPromises = livestreams.map((livestream) => {
        if (!livestream.fullVideoCompressed.includes("video/2023")) {
          return livestream.fullVideoCompressed;
        } else {
          return getAWSSignedURL(livestream.fullVideoCompressed);
        }
      });
      const assets = await Promise.all([
        Promise.all(previewVideoPromises),
        Promise.all(previewVideoCompressedPromises),
        Promise.all(fullVideoPromises),
        Promise.all(fullVideoCompressedPromises),
      ]);
      livestreams.forEach((livestream, index) => {
        livestream.previewVideo = assets[0][index];
        livestream.previewVideoCompressed = assets[1][index];
        livestream.fullVideo = assets[2][index];
        livestream.fullVideoCompressed = assets[3][index];
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

  const fetchAllCategories = async (
    page: number,
    isExclusive: boolean = false,
    limit: number = PAGE_LIMIT
  ) => {
    setIsLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/live-stream/category/list`,
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
      const categories = data as Array<ICategory>;
      const promises = categories.map((category) => {
        const livestreams = category.livestreams;
        const livestreamPreviewVideoPromises = livestreams.map((livestream) => {
          if (!livestream.previewVideo.includes("video/2023")) {
            return livestream.previewVideo;
          } else {
            return getAWSSignedURL(livestream.previewVideo);
          }
        });
        const livestreamPreviewVideoCompressedPromises = livestreams.map(
          (livestream) => {
            if (!livestream.previewVideoCompressed.includes("video/2023")) {
              return livestream.previewVideoCompressed;
            } else {
              return getAWSSignedURL(livestream.previewVideoCompressed);
            }
          }
        );
        const livestreamFullVideoPromises = livestreams.map((livestream) => {
          if (!livestream.fullVideo.includes("video/2023")) {
            return livestream.fullVideo;
          } else {
            return getAWSSignedURL(livestream.fullVideo);
          }
        });
        const livestreamFullVideoCompressedVideoPromises = livestreams.map(
          (livestream) => {
            if (!livestream.fullVideoCompressed.includes("video/2023")) {
              return livestream.fullVideoCompressed;
            } else {
              return getAWSSignedURL(livestream.fullVideoCompressed);
            }
          }
        );

        return Promise.all([
          Promise.all(livestreamPreviewVideoPromises),
          Promise.all(livestreamPreviewVideoCompressedPromises),
          Promise.all(livestreamFullVideoPromises),
          Promise.all(livestreamFullVideoCompressedVideoPromises),
        ]);
      });
      const assets = await Promise.all(promises);
      categories.forEach((category, indexCategory) => {
        category.livestreams.forEach((livestream, indexLivestream) => {
          livestream.previewVideo = assets[indexCategory][0][indexLivestream];
          livestream.previewVideoCompressed =
            assets[indexCategory][1][indexLivestream];
          livestream.fullVideo = assets[indexCategory][2][indexLivestream];
          livestream.fullVideoCompressed =
            assets[indexCategory][3][indexLivestream];
        });
      });

      setIsLoading(false);
      return categories;
    } else {
      setIsLoading(false);
    }
    return [];
  };

  const fetchCategoryLivestreams = async (
    albumId: number | null,
    page: number,
    isExclusive: boolean = false,
    limit: number = PAGE_LIMIT
  ) => {
    setIsLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/live-stream/category/live-stream/list`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          albumId,
          userId: user.id,
          page,
          limit,
          isExclusive: isMembership ? null : false,
        }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      const livestreams = data as Array<IStream>;
      const previewVideoPromises = livestreams.map((livestream) => {
        if (!livestream.previewVideo.includes("video/2023")) {
          return livestream.previewVideo;
        } else {
          return getAWSSignedURL(livestream.previewVideo);
        }
      });
      const previewVideoCompressedPromises = livestreams.map((livestream) => {
        if (!livestream.previewVideoCompressed.includes("video/2023")) {
          return livestream.previewVideoCompressed;
        } else {
          return getAWSSignedURL(livestream.previewVideoCompressed);
        }
      });
      const fullVideoPromises = livestreams.map((livestream) => {
        if (!livestream.fullVideo.includes("video/2023")) {
          return livestream.fullVideo;
        } else {
          return getAWSSignedURL(livestream.fullVideo);
        }
      });
      const fullVideoCompressedPromises = livestreams.map((livestream) => {
        if (!livestream.fullVideoCompressed.includes("video/2023")) {
          return livestream.fullVideoCompressed;
        } else {
          return getAWSSignedURL(livestream.fullVideoCompressed);
        }
      });

      const assets = await Promise.all([
        Promise.all(previewVideoPromises),
        Promise.all(previewVideoCompressedPromises),
        Promise.all(fullVideoPromises),
        Promise.all(fullVideoCompressedPromises),
      ]);
      livestreams.forEach((livestream, index) => {
        livestream.previewVideo = assets[0][index];
        livestream.previewVideoCompressed = assets[1][index];
        livestream.fullVideo = assets[2][index];
        livestream.fullVideoCompressed = assets[3][index];
      });

      setIsLoading(false);
      return livestreams;
    } else {
      setIsLoading(false);
    }
    return [];
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

      setIsLoading(false);
      return comment;
    } else {
      setIsLoading(false);
    }
    return null;
  };

  return {
    isLoading,
    fetchLivestreams,
    fetchAllCategories,
    fetchCategoryLivestreams,
    fetchComments,
    writeComment,
  };
};

export default useLivestream;
