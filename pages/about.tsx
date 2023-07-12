import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-toastify";
import { twMerge } from "tailwind-merge";

import Layout from "@/components/Layout";
import Input from "@/components/Input";
import Profile from "@/components/Icons/Profile";
import Email from "@/components/Icons/Email";
import Info from "@/components/Icons/Info";
import ButtonOutline from "@/components/ButtonOutline";
import Textarea from "@/components/Textarea";
import AudioControl from "@/components/AudioControl";
import GalleryView from "@/components/Gallery";
import Twitter from "@/components/Icons/Twitter";
import Instagram from "@/components/Icons/Instagram";
import Youtube from "@/components/Icons/Youtube";
import SoundCloud from "@/components/Icons/SoundCloud";
import Facebook from "@/components/Icons/Facebook";
import DonationModal from "@/components/DonationModal";
import Loading from "@/components/Loading";

import { useAuthValues } from "@/contexts/contextAuth";
import { useShareValues } from "@/contexts/contextShareData";
import { useSizeValues } from "@/contexts/contextSize";

import useAbout from "@/hooks/useAbout";

import { validateEmail } from "@/libs/utils";
import {
  APP_NAME,
  APP_TYPE,
  ASSET_TYPE,
  IMAGE_BLUR_DATA_URL,
  PLACEHOLDER_IMAGE,
  SYSTEM_TYPE,
} from "@/libs/constants";

export default function About() {
  const router = useRouter();
  const { isSignedIn } = useAuthValues();
  const { isLoading, fetchAboutContent, sendEmail } = useAbout();
  const { artist, audioPlayer } = useShareValues();
  const { isMobile } = useSizeValues();

  const [coverImage1, setCoverImage1] = useState<string>(PLACEHOLDER_IMAGE);
  const [coverImage2, setCoverImage2] = useState<string>(PLACEHOLDER_IMAGE);
  const [connectContent, setConnectContent] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const fetchAboutContentData = () => {
    fetchAboutContent().then((data) => {
      if (data) {
        setCoverImage1(
          data.coverImage1 == "" ? PLACEHOLDER_IMAGE : data.coverImage1
        );
        setCoverImage2(
          data.coverImage2 == "" ? PLACEHOLDER_IMAGE : data.coverImage2
        );
        setConnectContent(data.content);
      }
    });
  };

  const sendEmailArtist = () => {
    if (!name || !email || !subject || !message) {
      toast.warn("Please enter values correctly.");
      return;
    }
    if (!validateEmail(email)) {
      toast.warn("Please enter valid email.");
      return;
    }

    sendEmail(name, email, subject, message);
  };

  useEffect(() => {
    if (isSignedIn) {
      fetchAboutContentData();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn]);

  const fullContent = (
    <>
      <div className="w-full h-screen overflow-x-hidden overflow-y-auto">
        <div
          className={twMerge(
            "relative w-full overflow-y-auto",
            isMobile ? "pb-[180px]" : "pb-24 lg:pb-32"
          )}
        >
          <div className="relative w-full flex flex-col xl:flex-row justify-center items-center">
            <div className="w-full xl:w-1/2 h-screen min-h-[750px] justify-center items-center flex flex-col bg-background">
              <div className="w-3/4 flex flex-col justify-center items-center">
                <h1 className="text-5xl uppercase font-thin font-[100] text-center">
                  {artist?.artistName ? artist.artistName : APP_NAME}
                </h1>
                <div className="relative w-full h-[500px] text-center my-5 pr-2 overflow-x-hidden overflow-y-auto">
                  <div
                    className="none-tailwind text-sm"
                    dangerouslySetInnerHTML={{
                      __html: artist?.description ?? "",
                    }}
                  ></div>
                </div>
                <div className="w-full flex justify-center items-center flex-wrap gap-5">
                  {artist.facebook && (
                    <Link href={artist.facebook} target="_blank">
                      <Facebook width={30} height={30} />
                    </Link>
                  )}
                  {artist.twitter && (
                    <Link href={artist.twitter} target="_blank">
                      <Twitter width={30} height={30} />
                    </Link>
                  )}
                  {artist.instagram && (
                    <Link href={artist.instagram} target="_blank">
                      <Instagram width={30} height={30} />
                    </Link>
                  )}
                  {artist.youtube && (
                    <Link href={artist.youtube} target="_blank">
                      <Youtube width={30} height={30} />
                    </Link>
                  )}
                  {artist.soundcloud && (
                    <Link href={artist.soundcloud} target="_blank">
                      <SoundCloud width={30} height={30} />
                    </Link>
                  )}
                </div>
              </div>
            </div>
            <div className="w-full xl:w-1/2 h-screen min-h-[750px]">
              <Image
                className="w-full h-full object-cover"
                src={coverImage1 ?? PLACEHOLDER_IMAGE}
                width={1000}
                height={1000}
                alt=""
                placeholder="blur"
                blurDataURL={IMAGE_BLUR_DATA_URL}
                priority
              />
            </div>
          </div>

          <div className="relative w-full flex flex-col xl:flex-row justify-center items-center">
            <div className="w-full xl:w-1/2 h-screen min-h-[750px]">
              <Image
                className="w-full h-full object-cover"
                src={coverImage2 ?? PLACEHOLDER_IMAGE}
                width={1000}
                height={1000}
                alt=""
                placeholder="blur"
                blurDataURL={IMAGE_BLUR_DATA_URL}
                priority
              />
            </div>
            <div className="w-full xl:w-1/2 h-screen min-h-[750px] justify-center items-center flex flex-col bg-background">
              <div className="w-3/4 flex flex-col justify-center items-center">
                <h1 className="text-5xl uppercase font-thin font-[200] text-center tracking-[-6px]">
                  CONNECT
                </h1>
                <h3 className="text-lg text-center mt-5">
                  {connectContent ? (
                    connectContent
                  ) : (
                    <>
                      Interested In Booking or Connecting With&nbsp;
                      <span className="capitalize">
                        {artist?.artistName ?? ""}
                      </span>
                      ? Fill out the form below and he will respond to you as
                      soon as possible. Thank you.
                    </>
                  )}
                </h3>
                <div className="space-y-8 mt-5">
                  <Input
                    label=""
                    placeholder="Name"
                    type="text"
                    value={name}
                    setValue={setName}
                    icon={<Profile width={20} height={20} />}
                  />
                  <Input
                    label=""
                    placeholder="Email"
                    type="text"
                    value={email}
                    setValue={setEmail}
                    icon={<Email width={20} height={20} />}
                  />
                  <Input
                    label=""
                    placeholder="Subject"
                    type="text"
                    value={subject}
                    setValue={setSubject}
                    icon={<Info width={20} height={20} />}
                  />
                  <Textarea
                    label=""
                    placeholder="Message"
                    type="text"
                    value={message}
                    setValue={setMessage}
                  />
                  <ButtonOutline label="SEND" onClick={sendEmailArtist} />
                </div>
              </div>
            </div>
          </div>

          <GalleryView />
        </div>
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

      {isLoading && (
        <div className="loading">
          <Loading width={64} height={64} />
        </div>
      )}
    </>
  );

  return <Layout>{isSignedIn ? fullContent : null}</Layout>;
}
