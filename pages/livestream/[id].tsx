import React from "react";
import { useRouter } from "next/router";
import { useRef, useState, useEffect } from "react";

import Layout from "@/components/Layout";
import VideoControl from "@/components/VideoControl";
import LiveStreamMetadataModal from "@/components/LiveStreamMetadataModal";
import DonationModal from "@/components/DonationModal";
import ViewExclusiveModal from "@/components/ViewExclusiveModal";
import Loading from "@/components/Loading";
import LiveStreamCommentModal from "@/components/LiveStreamCommentModal";
import ShareModal from "@/components/ShareModal";

import { useAuthValues } from "@/contexts/contextAuth";
import { useSizeValues } from "@/contexts/contextSize";
import { useShareValues } from "@/contexts/contextShareData";

import useVideoPlayer from "@/hooks/useVideoplayer";
import useLivestream from "@/hooks/useLivestream";

import { ASSET_TYPE, LIVESTREAM_QUALITY, VIEW_MODE } from "@/libs/constants";

import { IStream } from "@/interfaces/IStream";

export default function LiveStreams() {
  const videoRef = useRef(null);
  const router = useRouter();
  const { id } = router.query;

  const { setIsSidebarVisible, setIsTopbarVisible } = useSizeValues();
  const { setIsLivestreamCommentVisible, setIsMetaVisible } = useShareValues();
  const { isSignedIn } = useAuthValues();
  const { isLoading, fetchLivestreams } = useLivestream();

  const [allLivestreams, setAllLivestreams] = useState<Array<IStream>>([]);
  const [livestreams, setLivestreams] = useState<Array<IStream>>([]);
  const [isFullScreenView, setIsFullScreenView] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<VIEW_MODE>(VIEW_MODE.VIDEO);

  const videoPlayer = useVideoPlayer(videoRef);

  const getAllLivestreams = (
    id: number,
    page: number,
    fresh: boolean = false
  ) => {
    return new Promise<boolean>((resolve, _) => {
      fetchLivestreams(page, false)
        .then((data) => {
          let newLivestreams: Array<IStream> = [];
          if (fresh) {
            newLivestreams.push(...data.livestreams);
          } else {
            newLivestreams = allLivestreams.slice();
            newLivestreams.push(...data.livestreams);
          }

          setAllLivestreams(newLivestreams);
          setLivestreams(newLivestreams);
          videoPlayer.setVideos(newLivestreams);

          const index = newLivestreams.findIndex((livestream) => {
            return livestream.id == id;
          });

          if (index >= 0) {
            videoPlayer.setPlayingIndex(index);

            resolve(true);
          } else {
            resolve(false);

            router.push("/livestreams");
          }
        })
        .catch((_) => {
          setAllLivestreams([]);
          resolve(false);
        });
    });
  };

  const onFullScreenViewOn = () => {
    setIsFullScreenView(true);
    setViewMode(VIEW_MODE.VIDEO);

    if (!videoPlayer.isPlaying) {
      setTimeout(() => {
        videoPlayer.play();
      }, 100);
    }
  };

  const onFullScreenViewOff = () => {
    setIsFullScreenView(false);
  };

  const onListView = () => {
    if (videoPlayer.isPlaying) {
      videoPlayer.pause();
    }

    switch (viewMode) {
      case VIEW_MODE.VIDEO:
        router.push("/livestreams");
        break;
      default:
        router.push("/livestreams");
    }
  };

  const onPlayLivestream = () => {
    if (videoPlayer.isPlaying) {
      videoPlayer.pause();
    } else {
      setTimeout(() => {
        videoPlayer.play();
      }, 100);
      setViewMode(VIEW_MODE.VIDEO);
    }
  };

  useEffect(() => {
    if (isSignedIn && id) {
      setIsSidebarVisible(false);
      setIsTopbarVisible(false);
      getAllLivestreams(Number(id.toString()), 1, true);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn, id]);

  useEffect(() => {
    setIsMetaVisible(false);
    setIsLivestreamCommentVisible(false);
    setIsSidebarVisible(false);
    setIsTopbarVisible(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode]);

  const fullScreenView = (
    <div
      id="livestreamfullview"
      className="relative w-full h-screen flex flex-col justify-start items-center overflow-x-hidden overflow-y-auto z-10"
    >
      <video
        ref={videoRef}
        src={
          videoPlayer.playingQuality == LIVESTREAM_QUALITY.LOW
            ? videoPlayer.getPlayingTrack()?.fullVideoCompressed
            : videoPlayer.getPlayingTrack()?.fullVideo
        }
        className="absolute w-full h-full object-cover"
      />
    </div>
  );

  const nullContent = (
    <div className="relative w-full h-screen flex justify-center items-center">
      <p className="text-center text-secondary text-base font-medium">
        {isLoading ? <Loading width={40} height={40} /> : ""}
      </p>
    </div>
  );

  const fullContent = (
    <>
      {livestreams.length > 0 ? fullScreenView : nullContent}

      <LiveStreamMetadataModal />

      <LiveStreamCommentModal livestreamId={videoPlayer.getPlayingTrack().id} />

      <DonationModal
        assetType={ASSET_TYPE.LIVESTREAM}
        livestreamId={videoPlayer.getPlayingTrack().id}
      />

      <ViewExclusiveModal />

      <ShareModal />

      <VideoControl
        videoPlayer={videoPlayer}
        viewMode={viewMode}
        onListView={onListView}
        onPlayLivestream={onPlayLivestream}
        onFullScreenViewOn={onFullScreenViewOn}
        onFullScreenViewOff={onFullScreenViewOff}
        isFullScreenView={isFullScreenView}
      />

      {isLoading && (
        <div className="loading">
          <Loading width={64} height={64} />
        </div>
      )}
    </>
  );

  return <Layout>{isSignedIn ? fullContent : null}</Layout>;
}
