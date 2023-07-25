import { KeyboardEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { twMerge } from "tailwind-merge";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
// import ReCAPTCHA from "react-google-recaptcha";

import Google from "@/components/Icons/Google";
import Profile from "@/components/Icons/Profile";
import Lock from "@/components/Icons/Lock";
import Layout from "@/components/Layout";
import Input from "@/components/Input";
import ButtonOutline from "@/components/ButtonOutline";
import PoweredBy from "@/components/PoweredBy";
import Switch from "@/components/Switch";
import Loading from "@/components/Loading";

import { useAuthValues } from "@/contexts/contextAuth";
import { useShareValues } from "@/contexts/contextShareData";
import { useSizeValues } from "@/contexts/contextSize";

import useHomepage from "@/hooks/useHomepage";

import {
  DEFAULT_LOGO_IMAGE,
  OAUTH_PROVIDER,
  TAG_PASSWORD,
  TAG_USERNAME,
} from "@/libs/constants";
import { initializeFirebase } from "@/libs/utils";

initializeFirebase();

export default function Signin() {
  const provider = new GoogleAuthProvider();
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();
  const { isLoading, isSignedIn, signIn, oauthSignin } = useAuthValues();
  const { artist, audioPlayer } = useShareValues();
  const { isMobile } = useSizeValues();
  const { fetchPageContent } = useHomepage();

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rememberPassword, setRememberPassword] = useState<boolean>(false);
  const [vidoeUrl, setVideoUrl] = useState<string>("");
  const [siginInDescription, setSignInDescription] = useState<string>("");
  // const [captchaResponse, setCaptchaResponse] = useState<string | null>("");

  const onSignin = () => {
    if (isLoading) return;

    if (!username || !password) {
      toast.error("Please enter username and password correctly!");
      return;
    }

    // if (!captchaResponse) {
    //   toast.error("Please complete the captcha verification!");
    //   return;
    // }

    if (rememberPassword) {
      if (window) {
        window.localStorage.setItem(TAG_USERNAME, username);
        window.localStorage.setItem(
          TAG_PASSWORD,
          window.btoa(encodeURIComponent(password))
        );
      }
    } else {
      window.localStorage.setItem(TAG_USERNAME, "");
      window.localStorage.setItem(TAG_PASSWORD, "");
    }

    const userId = username.trim().replace(" ", "").toLowerCase().trim();
    signIn(userId, password).then((result) => {
      if (result) {
        router.push("/home");
      }
    });
  };

  const onGoogleSignin = () => {
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (credential) {
          const accessToken = credential.idToken!;
          const refreshToken = credential.idToken!;

          oauthSignin(
            OAUTH_PROVIDER.GOOGLE,
            accessToken,
            refreshToken,
            {}
          ).then((result) => {
            if (result) {
              router.push("/home");
            }
          });
        }
      })
      .catch((e) => {
        console.log(e);
        toast.error("We encountered an issue while processing your request.");
      });
  };

  useEffect(() => {
    if (isSignedIn) {
      router.push("/home");
    } else {
      if (window) {
        let username = window.localStorage.getItem(TAG_USERNAME);
        let password = window.localStorage.getItem(TAG_PASSWORD);
        if (password) {
          try {
            password = decodeURIComponent(window.atob(password));
          } catch (e) {
            console.log(e);
            password = "";
          }
        }
        setUsername(username ?? "");
        setPassword(password ?? "");
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn, router]);

  useEffect(() => {
    audioPlayer.pause();

    fetchPageContent().then((value) => {
      if (value) {
        setVideoUrl(value?.signInBackgroundVideo);
        setSignInDescription(
          value?.signInDescription
            ? value.signInDescription
            : `Exclusive Music, Live Concerts & ${artist.artistName} Fan Community`
        );
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let interval: any = null;
    if (videoRef && videoRef.current) {
      interval = setInterval(() => {
        videoRef.current?.play();
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [videoRef]);

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
              <Image
                className="w-56 object-cover mb-5"
                src={artist.logoImage ?? DEFAULT_LOGO_IMAGE}
                width={311}
                height={220}
                alt=""
                priority
              />
            </h3>
            <p className="text-center text-primary text-sm sm:text-lg md:text-xl font-medium mb-5 whitespace-nowrap">
              {siginInDescription}
            </p>
            <div className="w-80 mb-5">
              <Input
                label=""
                placeholder="Username"
                type="text"
                value={username}
                setValue={setUsername}
                icon={<Profile width={20} height={20} />}
                onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                  if (e.key == "Enter") {
                    onSignin();
                  }
                }}
              />
            </div>
            <div className="w-80 mb-10">
              <Input
                label=""
                placeholder="Password"
                type="password"
                value={password}
                setValue={setPassword}
                icon={<Lock width={20} height={20} />}
                onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                  if (e.key == "Enter") {
                    onSignin();
                  }
                }}
              />
            </div>

            <div className="relative w-full flex justify-center items-center mb-5">
              <Switch
                checked={rememberPassword}
                setChecked={setRememberPassword}
                label="Remember Password?&nbsp;&nbsp;&nbsp;&nbsp;"
                labelPos="left"
              />
            </div>

            {/* <div className="mb-5">
              <ReCAPTCHA
                sitekey="6LeYkRwnAAAAAGSTAhvS6Xu3AL-0cA4URGt5Pg33"
                onChange={(response) => setCaptchaResponse(response)}
              />
            </div> */}

            <div className="mb-5">
              <ButtonOutline label="LOGIN" onClick={() => onSignin()} />
            </div>

            <div className="mb-5">
              <ButtonOutline
                label="Sign in with Google"
                onClick={() => onGoogleSignin()}
                icon={<Google width={20} height={20} />}
              />
            </div>

            <div className="w-full flex flex-row justify-center items-center space-x-3 mb-5">
              <Link href="/signup">
                <p className="text-center text-primary text-lg hover:underline transition-all duration-300 cursor-pointer">
                  Sign Up
                </p>
              </Link>
              <div className="w-[1px] h-4 bg-primary"></div>
              <Link href="/forgotpassword">
                <p className="text-center text-primary text-lg hover:underline transition-all duration-300 cursor-pointer">
                  Forgot Your Password?
                </p>
              </Link>
            </div>

            <div className="flex md:hidden w-full">
              <PoweredBy />
            </div>
          </div>
        </div>

        <div className="absolute left-0 top-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -left-4 -top-4 -right-4 -bottom-4">
            <video
              ref={videoRef}
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
