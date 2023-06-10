import { useRouter } from "next/router";
import { twMerge } from "tailwind-merge";

import Layout from "@/components/Layout";
import AudioControl from "@/components/AudioControl";
import GalleryView from "@/components/Gallery";
import DonationModal from "@/components/DonationModal";

import { useAuthValues } from "@/contexts/contextAuth";
import { useShareValues } from "@/contexts/contextShareData";
import { useSizeValues } from "@/contexts/contextSize";

import { APP_TYPE, ASSET_TYPE, SYSTEM_TYPE } from "@/libs/constants";

export default function Gallery() {
  const router = useRouter();
  const { isSignedIn } = useAuthValues();
  const { audioPlayer } = useShareValues();
  const { isMobile } = useSizeValues();

  const fullContent = (
    <>
      <div
        className={twMerge(
          "relative w-full h-screen min-h-[640px] flex flex-col justify-start items-center overflow-x-hidden overflow-y-auto",
          isMobile ? "pb-[180px]" : "pb-24 lg:pb-32"
        )}
      >
        <GalleryView />
      </div>

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
  );

  return <Layout>{isSignedIn ? fullContent : null}</Layout>;
}
