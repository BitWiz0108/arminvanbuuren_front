import { useRouter } from "next/router";

import Layout from "@/components/Layout";
import AudioControl from "@/components/AudioControl";
import GalleryView from "@/components/Gallery";
import DonationModal from "@/components/DonationModal";

import { useAuthValues } from "@/contexts/contextAuth";
import { useShareValues } from "@/contexts/contextShareData";

import { ASSET_TYPE } from "@/libs/constants";

export default function Gallery() {
  const router = useRouter();
  const { isSignedIn } = useAuthValues();
  const { audioPlayer } = useShareValues();

  const fullContent = (
    <>
      <div className="relative w-full h-screen min-h-[640px] pb-24 lg:pb-32 flex flex-col justify-start items-center overflow-x-hidden overflow-y-auto">
        <GalleryView />
      </div>

      <DonationModal
        assetType={ASSET_TYPE.MUSIC}
        musicId={audioPlayer.getPlayingTrack().id}
      />

      <AudioControl
        audioPlayer={audioPlayer}
        onListView={() => router.push("/musics")}
      />
    </>
  );

  return <Layout>{isSignedIn ? fullContent : null}</Layout>;
}
