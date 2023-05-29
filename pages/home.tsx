import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { twMerge } from "tailwind-merge";

import Layout from "@/components/Layout";
import AudioControl from "@/components/AudioControl";
import DonationModal from "@/components/DonationModal";
import SubscriptionModal from "@/components/SubscriptionModal";
import HomepageButton from "@/components/HomepageButton";
import RoundPlay from "@/components/Icons/RoundPlay";
import Loading from "@/components/Loading";

import { useAuthValues } from "@/contexts/contextAuth";
import { useShareValues } from "@/contexts/contextShareData";
import { useSizeValues } from "@/contexts/contextSize";

import useHomepage from "@/hooks/useHomepage";
import useLivestream from "@/hooks/useLivestream";

import {
  ASSET_TYPE,
  DEFAULT_LOGO_IMAGE,
  FILE_TYPE,
  PLACEHOLDER_IMAGE,
} from "@/libs/constants";

import { DEFAULT_HOMEPAGE, IHomepage } from "@/interfaces/IHomepage";

export default function Home() {
  const router = useRouter();
  const { isSignedIn, isMembership } = useAuthValues();
  const { artist, audioPlayer, setIsSubscriptionModalVisible } =
    useShareValues();
  const { isMobile } = useSizeValues();
  const { isLoading, fetchPageContent } = useHomepage();
  const { fetchLivestreams } = useLivestream();

  const [background, setBackground] = useState<IHomepage>(DEFAULT_HOMEPAGE);

  const [latestLivestreamTitle, setLatestLivestreamTitle] =
    useState<string>("");

  const fetchPageContentData = () => {
    fetchPageContent().then((data) => {
      if (data) {
        setBackground(data);
      }
    });
    fetchLivestreams(1, true, 6).then((data) => {
      setLatestLivestreamTitle(data.livestreams[0]?.title);
    });
  };

  useEffect(() => {
    if (isSignedIn) {
      fetchPageContentData();

      if (!isMembership) {
        setTimeout(() => {
          setIsSubscriptionModalVisible(true);
        }, 5000);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn]);

  const fullContent = (
    <>
      <div className="w-full h-screen overflow-x-hidden overflow-y-auto">
        <div
          className={twMerge(
            "relative w-full h-screen min-h-[640px] flex flex-col justify-center items-center",
            isMobile ? "pb-44" : "pb-24 lg:pb-32"
          )}
        >
          <div className="w-full md:w-1/2 h-full flex flex-col justify-center items-center z-10">
            <Image
              className="w-56 object-cover mb-5"
              src={artist.logoImage ?? DEFAULT_LOGO_IMAGE}
              width={311}
              height={220}
              alt=""
              priority
            />
            <h3 className="px-5 text-md text-center mb-10">
              {background.homePageDescription}
              {/* Welcome To {artist.artistName} Official Fan Club. Watch private
              live streams, listen to his latest music and engage with{" "}
              {artist.artistName}
              &nbsp;fans. */}
            </h3>
            <div className="flex flex-col md:flex-row space-x-0 md:space-x-5 space-y-5 md:space-y-0 mb-10">
              <HomepageButton
                label="LIVE STREAMS"
                onClick={() => router.push("/livestreams")}
              />
              <HomepageButton
                label="PLAY MUSIC"
                onClick={() => router.push("/musics")}
              />
            </div>
            <div
              className="flex flex-row justify-center items-center space-x-5 cursor-pointer"
              onClick={() => {
                router.push("/livestreams");
              }}
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
              <h3 className="text-sm text-center">{latestLivestreamTitle}</h3>
            </div>
          </div>

          <div className="absolute left-0 top-0 w-full h-full overflow-hidden z-0">
            {background.type == FILE_TYPE.IMAGE ? (
              <Image
                src={background.backgroundImage ?? PLACEHOLDER_IMAGE}
                width={1600}
                height={900}
                className="w-full h-full object-cover object-center"
                alt=""
              />
            ) : (
              <div className="absolute -left-4 -top-4 -right-4 -bottom-4">
                <video
                  loop
                  muted
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                  src={background.backgroundVideo}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <DonationModal
        assetType={ASSET_TYPE.MUSIC}
        musicId={audioPlayer.getPlayingTrack().id}
      />

      <SubscriptionModal />

      <AudioControl
        audioPlayer={audioPlayer}
        onListView={() => router.push("/musics")}
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
