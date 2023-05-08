import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { twMerge } from "tailwind-merge";

import Layout from "@/components/Layout";
import AudioControl from "@/components/AudioControl";

import { useAuthValues } from "@/contexts/contextAuth";
import { useShareValues } from "@/contexts/contextShareData";

import useTermsOfService from "@/hooks/useTermsOfService";

import { DEFAULT_TERMSOFSERVICE } from "@/interfaces/ITermsOfService";

export default function TermsOfService() {
  const router = useRouter();
  const { isSignedIn } = useAuthValues();
  const { audioPlayer } = useShareValues();
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
          "relative w-full lg:px-10 xl:px-20 h-screen min-h-[640px] flex flex-col justify-start items-center overflow-x-hidden overflow-y-auto",
          isSignedIn ? "pb-24 lg:pb-36" : "pb-5"
        )}
      >
        <h1 className="text-center text-primary text-xl md:text-3xl p-5 mb-5">
          Terms of Service
        </h1>
        <div
          className="w-full p-5 mb-5"
          dangerouslySetInnerHTML={{
            __html: content,
          }}
        ></div>
      </div>

      {isSignedIn && (
        <AudioControl
          audioPlayer={audioPlayer}
          onListView={() => router.push("/music")}
        />
      )}

      {isLoading && <div className="loading"></div>}
    </Layout>
  );
}
