import { KeyboardEvent, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { twMerge } from "tailwind-merge";
import { getAuth, signInWithPopup, FacebookAuthProvider } from "firebase/auth";

import Input from "@/components/Input";
import Layout from "@/components/Layout";
import Profile from "@/components/Icons/Profile";
import Lock from "@/components/Icons/Lock";
import ButtonOutline from "@/components/ButtonOutline";
import Facebook from "@/components/Icons/Facebook";
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
  TAG_ACCESS_TOKEN,
  TAG_PASSWORD,
  TAG_REFRESH_TOKEN,
  TAG_USERNAME,
} from "@/libs/constants";
import { getErrorMessageForCode } from "@/libs/utils";

const provider = new FacebookAuthProvider();
const auth = getAuth();

export default function Signin() {
  const router = useRouter();
  const { isLoading, isSignedIn, signIn, oAuthSignIn } = useAuthValues();
  const { artist } = useShareValues();
  const { isMobile } = useSizeValues();
  const { fetchPageContent } = useHomepage();

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [rememberPassword, setRememberPassword] = useState<boolean>(false);
  const [vidoeUrl, setVideoUrl] = useState<string>("");
  const [siginInDescription, setSignInDescription] = useState<string>("");

  const onSignin = () => {
    if (isLoading) return;

    if (!username || !password) {
      toast.error("Please enter username and password correctly!");
      return;
    }

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

    const userId = username.replace(" ", "").toLowerCase().trim();
    signIn(userId, password).then((result) => {
      if (result) {
        router.push("/home");
      }
    });
  };

  const onFacebookLogin = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        const email = user.email ?? "";
        const username = user.displayName ?? email;
        const credential = FacebookAuthProvider.credentialFromResult(result);

        if (credential) {
          result.user.getIdToken().then((accessToken) => {
            const refreshToken = result.user.refreshToken;
            const email = result.user.email;
            const uid = result.user.uid;

            if (accessToken && email && uid) {
              window.localStorage.setItem(TAG_ACCESS_TOKEN, accessToken);
              window.localStorage.setItem(TAG_REFRESH_TOKEN, refreshToken);

              let firstName = "";
              let lastName = "";
              if (username.includes(" ")) {
                firstName = username.split(" ")[0].trim();
                lastName = username.split(" ")[1].trim();
              } else {
                firstName = username;
              }
              const userId = username.replace(" ", "").toLowerCase().trim();
              oAuthSignIn(
                OAUTH_PROVIDER.FACEBOOK,
                accessToken,
                refreshToken
              ).then((result) => {
                if (result) {
                  router.push("/home");
                }
              });
            }
          });
        }
      })
      .catch((e) => {
        console.log(e);
        toast.error(getErrorMessageForCode(e.code));
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
    fetchPageContent().then((value) => {
      if (value) {
        setVideoUrl(value?.backgroundVideo);
        setSignInDescription(value?.signInDescription);
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

            <div className="mb-5">
              <ButtonOutline label="LOGIN" onClick={() => onSignin()} />
            </div>

            <div className="mb-5">
              <ButtonOutline
                label="Sign in with Facebook"
                onClick={() => onFacebookLogin()}
                icon={<Facebook width={20} height={20} />}
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
          <div className="absolute -left-4 -top-4 -right-4 -bottom-4 filter blur-[5px]">
            <video
              loop
              muted
              autoPlay
              playsInline
              disablePictureInPicture
              className="w-full h-full object-cover"
              src={vidoeUrl}
            >
              <source src={vidoeUrl} type="video/mp4" />
            </video>
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
