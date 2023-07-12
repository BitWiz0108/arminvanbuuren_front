import { KeyboardEvent, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { twMerge } from "tailwind-merge";

import Input from "@/components/Input";
import Layout from "@/components/Layout";
import Profile from "@/components/Icons/Profile";
import Email from "@/components/Icons/Email";
import Lock from "@/components/Icons/Lock";
import ButtonOutline from "@/components/ButtonOutline";
import Loading from "@/components/Loading";

import { useAuthValues } from "@/contexts/contextAuth";
import { useShareValues } from "@/contexts/contextShareData";
import { useSizeValues } from "@/contexts/contextSize";

import useHomepage from "@/hooks/useHomepage";

import { checkContainsSpecialCharacters, validateEmail } from "@/libs/utils";

export default function Signup() {
  const router = useRouter();
  const { isLoading, signUp } = useAuthValues();
  const { artist } = useShareValues();
  const { isMobile } = useSizeValues();
  const { fetchPageContent } = useHomepage();

  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [repassword, setRePassword] = useState<string>("");
  const [vidoeUrl, setVideoUrl] = useState<string>("");

  const onSignup = () => {
    if (isLoading) return;

    if (!username || !email || !password || !repassword) {
      toast.error("Please enter values correctly!");
      return;
    }

    if (checkContainsSpecialCharacters(username)) {
      toast.error("Username can't contain a special character.");
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Please enter valid email.");
      return;
    }

    if (password != repassword) {
      toast.error("Please confirm password is correct.");
      return;
    }

    let firstName = "";
    let lastName = "";
    if (username.includes(" ")) {
      firstName = username.split(" ")[0].trim();
      lastName = username.split(" ")[1].trim();
    } else {
      firstName = username;
    }
    const userId = username.trim().replace(" ", "").toLowerCase().trim();

    signUp(email, userId, password, firstName, lastName).then((result) => {
      if (result) {
        router.push("/");
      }
    });
  };

  useEffect(() => {
    fetchPageContent().then((value) => {
      if (value) {
        setVideoUrl(value?.signInBackgroundVideo);
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout>
      <div
        className={twMerge(
          "relative w-full min-h-screen flex flex-col justify-end md:justify-center items-center",
          isMobile ? "pb-20" : "pb-2"
        )}
      >
        <div className="w-full h-full flex flex-col justify-end md:justify-center items-center z-10">
          <div className="w-full h-fit flex flex-col justify-end md:justify-center items-center text-primary pb-5">
            <h3 className="text-center text-primary text-2xl mb-2">
              {artist.artistName}
            </h3>
            <p className="text-center text-primary text-xl font-medium mb-5">
              Exclusive Music, Live Concerts & {artist.artistName} Fan Community
            </p>
            <div className="w-80 mb-5">
              <Input
                label=""
                placeholder="Enter Username"
                type="text"
                value={username}
                setValue={setUsername}
                icon={<Profile width={20} height={20} />}
                onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                  if (e.key == "Enter") {
                    onSignup();
                  }
                }}
              />
            </div>
            <div className="w-80 mb-5">
              <Input
                label=""
                placeholder="Enter Your Email"
                type="text"
                value={email}
                setValue={setEmail}
                icon={<Email width={20} height={20} />}
                onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                  if (e.key == "Enter") {
                    onSignup();
                  }
                }}
              />
            </div>
            <div className="w-80 mb-5">
              <Input
                label=""
                placeholder="Choose Password"
                type="password"
                value={password}
                setValue={setPassword}
                icon={<Lock width={20} height={20} />}
                onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                  if (e.key == "Enter") {
                    onSignup();
                  }
                }}
              />
            </div>
            <div className="w-80 mb-10">
              <Input
                label=""
                placeholder="Re-enter Password"
                type="password"
                value={repassword}
                setValue={setRePassword}
                icon={<Lock width={20} height={20} />}
                onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                  if (e.key == "Enter") {
                    onSignup();
                  }
                }}
              />
            </div>
            <div className="mb-5">
              <ButtonOutline label="SIGN UP" onClick={() => onSignup()} />
            </div>
            <div className="mb-5">
              <Link href="/" className="text-xl font-semibold hover:underline">
                LOG IN
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute left-0 top-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -left-4 -top-4 -right-4 -bottom-4">
            <video
              preload="auto"
              loop
              muted
              autoPlay
              playsInline
              disablePictureInPicture
              className="w-full h-full object-cover filter blur-[5px]"
              src={vidoeUrl}
            />
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="loading">
          <Loading width={64} height={64} />
        </div>
      )}
    </Layout>
  );
}
