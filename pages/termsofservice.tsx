import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { twMerge } from "tailwind-merge";

import Layout from "@/components/Layout";
import AudioControl from "@/components/AudioControl";
import DonationModal from "@/components/DonationModal";
import Loading from "@/components/Loading";

import { useAuthValues } from "@/contexts/contextAuth";
import { useShareValues } from "@/contexts/contextShareData";
import { useSizeValues } from "@/contexts/contextSize";

import useTermsOfService from "@/hooks/useTermsOfService";

import { APP_TYPE, ASSET_TYPE, SYSTEM_TYPE } from "@/libs/constants";

import { DEFAULT_TERMSOFSERVICE } from "@/interfaces/ITermsOfService";

export default function TermsOfService() {
  const router = useRouter();
  const { isSignedIn } = useAuthValues();
  const { audioPlayer } = useShareValues();
  const { isMobile } = useSizeValues();
  const { isLoading, fetchPageContent } = useTermsOfService();

  const [content, setContent] = useState<string>(
    DEFAULT_TERMSOFSERVICE.content
  );

  useEffect(() => {
    fetchPageContent().then((value) => {
      if (value) {
        setContent(value.content);
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout>
      <div
        className={twMerge(
          "relative w-full px-5 lg:px-10 xl:px-20 h-screen min-h-[640px] flex flex-col justify-start items-center overflow-x-hidden overflow-y-auto",
          isSignedIn
            ? isMobile
              ? "pb-[180px]"
              : "pb-28 lg:pb-36"
            : isMobile
            ? "pb-16"
            : "pb-5 lg:pb-5"
        )}
      >
        <h1 className="text-center text-primary text-xl md:text-3xl p-5 mb-5">
          Terms of Service
        </h1>
        <div
          className="none-tailwind"
          dangerouslySetInnerHTML={{
            __html: content,
          }}
        ></div>
      </div>

      {isSignedIn && (
        <>
          <DonationModal
            assetType={ASSET_TYPE.MUSIC}
            musicId={audioPlayer.getPlayingTrack().id}
          />
          <AudioControl
            audioPlayer={audioPlayer}
            onListView={() =>
              router.push(SYSTEM_TYPE == APP_TYPE.CHURCH ? "/audio" : "/music")
            }
          />
        </>
      )}

      {isLoading && (
        <div className="loading">
          <Loading width={64} height={64} />
        </div>
      )}
    </Layout>
  );
}
