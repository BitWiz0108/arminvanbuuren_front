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
import { getUrlFormattedTitle } from "@/libs/utils";

export default function LiveStream() {
  const videoRef = useRef(null);
  const router = useRouter();
  const { title } = router.query;

  const { setIsSidebarVisible, setIsTopbarVisible } = useSizeValues();
  const { setIsLivestreamCommentVisible, setIsMetaVisible } = useShareValues();
  const { isSignedIn } = useAuthValues();
  const { isLoading, fetchLivestreamByTitle } = useLivestream();

  const [livestreams, setLivestreams] = useState<Array<IStream>>([]);
  const [viewMode, setViewMode] = useState<VIEW_MODE>(VIEW_MODE.VIDEO);

  const videoPlayer = useVideoPlayer(videoRef);

  const getLivestreams = (title: string) => {
    return new Promise<boolean>((resolve, _) => {
      fetchLivestreamByTitle(title)
        .then((data) => {
          setLivestreams(data);
          videoPlayer.setVideos(data);

          console.log(data, "data");

          if (data[1]) {
            resolve(true);
            videoPlayer.setPlayingIndex(1);
          } else {
            resolve(false);
            router.push("/livestreams");
          }
        })
        .catch((_) => {
          setLivestreams([]);
          resolve(false);
        });
    });
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
    if (isSignedIn && title) {
      setIsSidebarVisible(false);
      setIsTopbarVisible(false);
      getLivestreams(title.toString());
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn, title]);

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
      className="relative w-full h-screen max-h-screen bg-black z-10"
    >
      <video
        controls={false}
        playsInline
        disablePictureInPicture
        ref={videoRef}
        src={
          videoPlayer.playingQuality == LIVESTREAM_QUALITY.LOW
            ? videoPlayer.getPlayingTrack()?.fullVideoCompressed
              ? videoPlayer.getPlayingTrack()?.fullVideoCompressed
              : videoPlayer.getPlayingTrack()?.fullVideo
            : videoPlayer.getPlayingTrack()?.fullVideo
        }
        className="absolute left-0 top-0 object-center md:object-cover w-full h-full"
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
        onPrevVideo={() =>
          router.push(getUrlFormattedTitle(livestreams[0], "livestream"))
        }
        onNextVideo={() =>
          router.push(getUrlFormattedTitle(livestreams[2], "livestream"))
        }
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
