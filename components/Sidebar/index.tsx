import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { twMerge } from "tailwind-merge";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";

import Menu from "@/components/Icons/Menu";
import Power from "@/components/Icons/Power";
import Music from "@/components/Icons/Music";
import ButtonSidebar from "@/components/ButtonSidebar";
import Mic from "@/components/Icons/Mic";
import PlayOutline from "@/components/Icons/PlayOutline";
import ThumbUp from "@/components/Icons/ThumbUp";
import Setting from "@/components/Icons/Setting";
import PoweredBy from "@/components/PoweredBy";
import Info from "@/components/Icons/Info";
import HeartBalloon from "@/components/Icons/HeartBalloon";

import { useAuthValues } from "@/contexts/contextAuth";
import { useSizeValues } from "@/contexts/contextSize";
import { useShareValues } from "@/contexts/contextShareData";

import {
  SYSTEM_TYPE,
  DEFAULT_LOGO_IMAGE,
  SIDEBARWIDTH_SM,
  APP_TYPE,
} from "@/libs/constants";

type Props = {
  visible: boolean;
  setVisible: Function;
};

const Sidebar = ({ visible, setVisible }: Props) => {
  const router = useRouter();
  const { isSignedIn, signOut } = useAuthValues();
  const { artist } = useShareValues();

  const { isMobile, sidebarWidth, isSidebarCollapsed, setIsSidebarCollapsed } =
    useSizeValues();

  const checkFullScreenPage = () => {
    return (
      router.pathname == "/music" ||
      router.pathname == "/audio" ||
      router.pathname == "/livestreams"
    );
  };

  const goToLink = (link: string) => {
    if (isSignedIn) {
      router.push(link);
    } else {
      toast.warn("Please sign in.");
    }
  };

  useEffect(() => {
    if (!isMobile) {
      setVisible(true);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ width: isMobile ? SIDEBARWIDTH_SM : sidebarWidth }}
          animate={{ width: isMobile ? SIDEBARWIDTH_SM : sidebarWidth }}
          exit={{ width: 0 }}
          transition={{ duration: 0.3 }}
          className={twMerge(
            "fixed left-0 top-0 bg-background h-fit md:h-screen rounded-br-3xl md:rounded-br-none pt-5 pb-0 md:py-5 overflow-x-hidden overflow-y-auto z-30",
            isMobile ? "shadow-lg shadow-black" : "shadow-none"
          )}
          style={{ width: `${isMobile ? SIDEBARWIDTH_SM : sidebarWidth}px` }}
        >
          <div
            className={twMerge(
              "w-full flex flex-row justify-center items-center px-0 pb-5 md:px-5 md:pb-0",
              checkFullScreenPage() ? "md:justify-end" : "md:justify-start"
            )}
          >
            <Menu
              width={35}
              height={35}
              className="cursor-pointer text-primary hover:text-secondary"
              onClick={() => {
                if (isMobile) {
                  setVisible(!visible);
                } else {
                  if (checkFullScreenPage()) {
                    setVisible(!visible);
                  } else {
                    setIsSidebarCollapsed(!isSidebarCollapsed);
                  }
                }
              }}
            />
          </div>
          <div
            className={twMerge(
              "hidden md:flex w-full justify-center items-center p-10",
              isSidebarCollapsed ? "invisible" : "visible"
            )}
          >
            <Image
              className="w-full object-cover"
              src={artist.logoImage ?? DEFAULT_LOGO_IMAGE}
              width={202}
              height={83}
              alt=""
              priority
              onClick={() => goToLink("/home")}
            />
          </div>

          <ButtonSidebar
            active={router.pathname == "/home"}
            collapsed={isSidebarCollapsed}
            icon={<Power width={28} height={28} />}
            label="Home"
            onClick={() => goToLink("/home")}
          />
          <ButtonSidebar
            active={router.pathname == "/about"}
            collapsed={isSidebarCollapsed}
            icon={<Info width={24} height={24} />}
            label="About"
            onClick={() => goToLink("/about")}
          />
          <ButtonSidebar
            active={
              router.pathname.includes("music") ||
              router.pathname.includes("audio") ||
              router.pathname.includes("album")
            }
            collapsed={isSidebarCollapsed}
            icon={<Music width={26} height={26} />}
            label={SYSTEM_TYPE == APP_TYPE.CHURCH ? "Audio" : "Music"}
            onClick={() =>
              goToLink(SYSTEM_TYPE == APP_TYPE.CHURCH ? "/audio" : "/music")
            }
          />
          <ButtonSidebar
            active={router.pathname.includes("livestream")}
            collapsed={isSidebarCollapsed}
            icon={<Mic width={24} height={24} />}
            label="Live Streams"
            onClick={() => goToLink("/livestreams")}
          />
          <ButtonSidebar
            active={router.pathname == "/gallery"}
            collapsed={isSidebarCollapsed}
            icon={<PlayOutline width={30} height={30} />}
            label="Gallery"
            onClick={() => goToLink("/gallery")}
          />
          <ButtonSidebar
            active={
              router.pathname == "/fanclub" ||
              router.pathname == "/community" ||
              router.pathname.includes("post")
            }
            collapsed={isSidebarCollapsed}
            icon={<ThumbUp width={24} height={24} />}
            label={SYSTEM_TYPE == APP_TYPE.CHURCH ? "Community" : "Fan Club"}
            onClick={() =>
              goToLink(
                SYSTEM_TYPE == APP_TYPE.CHURCH ? "/community" : "/fanclub"
              )
            }
          />
          {SYSTEM_TYPE != APP_TYPE.TYPICAL && (
            <ButtonSidebar
              active={router.pathname == "/prayer-requests"}
              collapsed={isSidebarCollapsed}
              icon={<HeartBalloon width={22} height={22} />}
              label="Prayer Requests"
              onClick={() => goToLink("/prayer-requests")}
            />
          )}
          <ButtonSidebar
            active={router.pathname == "/settings"}
            collapsed={isSidebarCollapsed}
            icon={<Setting width={22} height={22} />}
            label="Settings"
            onClick={() => goToLink("/settings")}
            lastOne
          />

          <div
            className={twMerge(
              "hidden md:flex w-full flex-row justify-center items-center space-x-3 my-5",
              isSidebarCollapsed ? "invisible" : "visible"
            )}
          >
            {isSignedIn ? (
              <p
                className="text-primary text-lg text-center hover:underline cursor-pointer"
                onClick={() => {
                  signOut();
                  router.push("/");
                }}
              >
                Logout
              </p>
            ) : (
              <>
                <Link href="/">
                  <p className="text-primary text-lg text-center hover:underline">
                    Login
                  </p>
                </Link>
                <div className="w-0.5 h-4 bg-primary"></div>
                <Link href="/signup">
                  <p className="text-primary text-lg text-center hover:underline">
                    Sign Up
                  </p>
                </Link>
              </>
            )}
          </div>

          <div
            className={twMerge(
              "hidden md:flex w-full flex-row justify-between gap-2 items-center px-5 mb-10",
              isSidebarCollapsed ? "invisible" : "visible"
            )}
          >
            <div className="w-1/2 flex justify-center items-center">
              <Image
                className="w-[81px] h-[28px] object-fill cursor-pointer"
                width={97}
                height={34}
                src="/images/apple-store.png"
                alt=""
                onClick={() => goToLink("/home")}
              />
            </div>
            <div className="w-1/2 justify-center items-center">
              <Image
                className="w-[86px] h-[28px] object-fill cursor-pointer"
                width={102}
                height={34}
                src="/images/google-store.png"
                alt=""
                onClick={() => goToLink("/home")}
              />
            </div>
          </div>

          <div
            className={twMerge(
              "hidden md:flex mb-5",
              isSidebarCollapsed ? "invisible" : "visible"
            )}
          >
            <PoweredBy />
          </div>

          <div className="w-full flex justify-center items-center">
            <Link href="/termsofservice">
              <p
                className={twMerge(
                  "hidden md:flex text-primary text-xs text-center hover:underline cursor-pointer"
                )}
              >
                Terms of service
              </p>
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
