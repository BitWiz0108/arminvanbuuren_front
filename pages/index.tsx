import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

import Layout from "@/components/Layout";
import AudioControl from "@/components/AudioControl";
import DonationModal from "@/components/DonationModal";
import SubscriptionModal from "@/components/SubscriptionModal";
import HomepageButton from "@/components/HomepageButton";
import RoundPlay from "@/components/Icons/RoundPlay";
import X from "@/components/Icons/X";

import { useAuthValues } from "@/contexts/contextAuth";
import { useShareValues } from "@/contexts/contextShareData";

import useHomepage from "@/hooks/useHomepage";
import useFanclub from "@/hooks/useFanclub";

import { ASSET_TYPE, DEFAULT_LOGO_IMAGE } from "@/libs/constants";

import { DEFAULT_HOMEPAGE } from "@/interfaces/IHomepage";

export default function Home() {
  const router = useRouter();
  const { isSignedIn, isMembership } = useAuthValues();
  const { audioPlayer, setIsSubscriptionModalVisible } = useShareValues();
  const { isLoading, fetchPageContent } = useHomepage();
  const { fetchArtist } = useFanclub();

  const [backgroundVideo, setBackgroundVideo] = useState<string>(
    DEFAULT_HOMEPAGE.backgroundVideo
  );
  const [youtubeVideoUrl, setYoutubeVideoUrl] = useState<string>(
    DEFAULT_HOMEPAGE.youtubeVideoUrl
  );
  const [youtubeTitle, setYoutubeTitle] = useState<string>(
    DEFAULT_HOMEPAGE.youtubeTitle
  );
  const [artistName, setArtistName] = useState<string>("");
  const [showYouTubeFrame, setShowYouTubeFrame] = useState<boolean>(false);
  const [logoImage, setLogoImage] = useState<string>(DEFAULT_LOGO_IMAGE);

  const fetchPageContentData = () => {
    fetchPageContent().then((data) => {
      if (data) {
        setBackgroundVideo(data.backgroundVideo);
        setYoutubeVideoUrl(data.youtubeVideoUrl);
        setYoutubeTitle(data.youtubeTitle);
      }
    });
  };

  const onYouTubeLinkClicked = () => {
    setShowYouTubeFrame(true);
  };

  useEffect(() => {
    if (isSignedIn) {
      fetchPageContentData();
      fetchArtist().then((data) => {
        if (data) {
          setArtistName(data.artistName);
          setLogoImage(data.logoImage);
        }
      });

      if (!isMembership) {
        setTimeout(() => {
          setIsSubscriptionModalVisible(true);
        }, 5000);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn]);

  return (
    <Layout>
      <div className="relative w-full h-screen min-h-[640px] pb-24 lg:pb-36 flex flex-col justify-center items-center">
        <div className="w-full md:w-1/2 h-full flex flex-col justify-center items-center z-10">
          <Image
            className="w-56 object-cover mb-5"
            src={logoImage ?? DEFAULT_LOGO_IMAGE}
            width={311}
            height={220}
            alt=""
          />
          <h3 className="px-5 text-md text-center mb-10">
            Welcome To {artistName} Official Fan Club. Watch private live
            streams, listen to his latest music and engage with {artistName}
            &nbsp;fans.
          </h3>
          <div className="flex flex-col md:flex-row space-x-0 md:space-x-5 space-y-5 md:space-y-0 mb-10">
            <HomepageButton
              label="LIVE STREAMS"
              onClick={() => router.push("/live-stream")}
            />
            <HomepageButton
              label="PLAY MUSIC"
              onClick={() => router.push("/music")}
            />
          </div>
          <div
            className="flex flex-row justify-center items-center space-x-5 cursor-pointer"
            onClick={onYouTubeLinkClicked}
          >
            <div className="relative">
              <RoundPlay
                fill={"#0052e4"}
                width={50}
                height={50}
                className="hover:scale-110 transition-all duration-300"
              />
              <div className="absolute left-0 top-0 w-full h-full rounded-full border border-primary animate-ping"></div>
            </div>
            <h3 className="text-sm text-center">{youtubeTitle}</h3>
          </div>
        </div>

        <div className="absolute left-0 top-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -left-4 -top-4 -right-4 -bottom-4">
            <video
              loop
              muted
              autoPlay
              playsInline
              className="w-full h-full object-cover"
              src={backgroundVideo}
            ></video>
          </div>
        </div>

        {showYouTubeFrame && (
          <div className="absolute left-0 top-0 w-full h-full px-5 lg:px-10 pt-5 lg:pt-10 pb-24 lg:pb-36 flex justify-center items-center bg-[#000000aa] z-20">
            <div
              className="absolute top-0 left-0 w-full h-full"
              onClick={() => setShowYouTubeFrame(false)}
            >
              <div className="absolute top-5 left-5 cursor-pointer">
                <X />
              </div>
            </div>
            <div className="relative w-full h-0 pb-[56.25%]">
              <iframe
                className="absolute w-full h-full top-0 left-0"
                src={youtubeVideoUrl}
                allowFullScreen
                frameBorder="0"
              />
            </div>
          </div>
        )}
      </div>

      <DonationModal
        assetType={ASSET_TYPE.MUSIC}
        musicId={audioPlayer.getPlayingTrack().id}
      />

      <SubscriptionModal />

      <AudioControl
        audioPlayer={audioPlayer}
        onListView={() => router.push("/music")}
      />

      {isLoading && <div className="loading"></div>}
    </Layout>
  );
}
