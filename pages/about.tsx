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

import { useShareValues } from "@/contexts/contextShareData";

import useAbout from "@/hooks/useAbout";
import useAuth from "@/hooks/useAuth";
import useFanclub from "@/hooks/useFanclub";

import { validateEmail } from "@/libs/utils";
import { DEFAULT_COVER_IMAGE, IMAGE_MD_BLUR_DATA_URL } from "@/libs/constants";

import { DEFAULT_ARTIST, IArtist } from "@/interfaces/IArtist";

export default function About() {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const { isLoading, fetchAboutContent, sendEmail } = useAbout();
  const { fetchArtist } = useFanclub();
  const { audioPlayer } = useShareValues();

  const [coverImage1, setCoverImage1] = useState<string>(DEFAULT_COVER_IMAGE);
  const [coverImage2, setCoverImage2] = useState<string>(DEFAULT_COVER_IMAGE);
  const [artist, setArtist] = useState<IArtist>(DEFAULT_ARTIST);
  const [name, setName] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const fetchAboutContentData = () => {
    fetchAboutContent().then((data) => {
      if (data) {
        setCoverImage1(data.coverImage1);
        setCoverImage2(data.coverImage2);
      }
    });
  };

  const fetchAboutMeContent = () => {
    fetchArtist().then((data) => {
      if (data) {
        setArtist(data);
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
      fetchAboutMeContent();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn]);

  return (
    <Layout>
      <div className="relative w-full pb-24 lg:pb-32 overflow-y-auto">
        <div className="relative w-full flex flex-col xl:flex-row justify-center items-center">
          <div className="w-full xl:w-1/2 h-screen min-h-[750px] justify-center items-center flex flex-col bg-gradient-to-br from-blue-900 to-cyan-500">
            <div className="w-3/4 flex flex-col justify-center items-center">
              <h1 className="text-5xl uppercase font-thin font-[100] text-center tracking-[-6px]">
                ABOUT THE ARTIST
              </h1>
              <div
                className={twMerge(
                  "relative w-full h-[500px] text-center my-5 overflow-x-hidden overflow-y-auto"
                )}
                dangerouslySetInnerHTML={{
                  __html: artist?.description ?? "",
                }}
              ></div>
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
              src={coverImage1 ?? DEFAULT_COVER_IMAGE}
              width={1000}
              height={1000}
              alt=""
              placeholder="blur"
              blurDataURL={IMAGE_MD_BLUR_DATA_URL}
            />
          </div>
        </div>

        <div className="relative w-full flex flex-col xl:flex-row justify-center items-center">
          <div className="w-full xl:w-1/2 h-screen min-h-[750px]">
            <Image
              className="w-full h-full object-cover"
              src={coverImage2 ?? DEFAULT_COVER_IMAGE}
              width={1000}
              height={1000}
              alt=""
              placeholder="blur"
              blurDataURL={IMAGE_MD_BLUR_DATA_URL}
            />
          </div>
          <div className="w-full xl:w-1/2 h-screen min-h-[750px] justify-center items-center flex flex-col bg-gradient-to-br from-cyan-500 to-blue-900 ">
            <div className="w-3/4 flex flex-col justify-center items-center">
              <h1 className="text-5xl uppercase font-thin font-[200] text-center tracking-[-6px]">
                CONNECT
              </h1>
              <h3 className="text-lg text-center mt-5">
                Interested In Booking or Connecting With&nbsp;
                <span className="capitalize">{artist?.artistName ?? ""}</span>?
                Fill out the form below and he will respond to you as soon as
                possible. Thank you.
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

      <AudioControl
        audioPlayer={audioPlayer}
        onListView={() => router.push("/music")}
      />

      {isLoading && <div className="loading"></div>}
    </Layout>
  );
}
