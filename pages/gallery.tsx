import { useRouter } from "next/router";

import Layout from "@/components/Layout";
import AudioControl from "@/components/AudioControl";
import GalleryView from "@/components/Gallery";

import { useShareValues } from "@/contexts/contextShareData";

export default function Gallery() {
  const router = useRouter();
  const { audioPlayer } = useShareValues();

  return (
    <Layout>
      <div className="relative w-full h-screen min-h-[640px] pb-24 lg:pb-32 flex flex-col justify-start items-center overflow-x-hidden overflow-y-auto">
        <GalleryView />
      </div>

      <AudioControl
        audioPlayer={audioPlayer}
        onListView={() => router.push("/music")}
      />
    </Layout>
  );
}
