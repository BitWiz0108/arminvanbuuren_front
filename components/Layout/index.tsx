import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { Elements } from "@stripe/react-stripe-js";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { loadStripe } from "@stripe/stripe-js";

import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import Menu from "@/components/Icons/Menu";

import { useAuthValues } from "@/contexts/contextAuth";
import { useSizeValues } from "@/contexts/contextSize";
import { useShareValues } from "@/contexts/contextShareData";

import { SYSTEM_TYPE, DEFAULT_LOGO_IMAGE, APP_TYPE } from "@/libs/constants";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const router = useRouter();
  const { asPath } = router;

  const { isSignedIn } = useAuthValues();
  const { artist, paypalClientId, stripePublicApiKey } = useShareValues();
  const {
    width,
    sidebarWidth,
    contentWidth,
    isHamburgerVisible,
    isSidebarVisible,
    setIsSidebarVisible,
    isTopbarVisible,
    setIsTopbarVisible,
  } = useSizeValues();

  const stripePromise = loadStripe(stripePublicApiKey);

  const [firstLoading, setFirstLoading] = useState<boolean>(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFirstLoading(false);
    }, 3000);

    return () => clearTimeout(timeout);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (firstLoading) {
      return;
    }

    if (
      router.pathname != "/" &&
      router.pathname != "/termsofservice" &&
      router.pathname != "/signup" &&
      router.pathname != "/forgotpassword" &&
      !router.pathname.includes("/resetpassword") &&
      !router.pathname.includes("/verifyemail")
    ) {
      if (!isSignedIn) {
        router.push("/");
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstLoading]);

  useEffect(() => {
    if (router.pathname.includes("livestream")) {
      setIsSidebarVisible(false);
    } else {
      setIsSidebarVisible(width >= 768);
    }

    if (
      SYSTEM_TYPE == APP_TYPE.TYPICAL &&
      (router.pathname.includes("prayer-requests") ||
        router.pathname == "/audio" ||
        router.pathname == "/community")
    ) {
      router.push("/home");
    }

    if (
      SYSTEM_TYPE == APP_TYPE.CHRISTIAN &&
      (router.pathname == "/audio" || router.pathname == "/community")
    ) {
      router.push("/home");
    }

    if (
      SYSTEM_TYPE == APP_TYPE.CHURCH &&
      (router.pathname == "/music" || router.pathname == "/fanclub")
    ) {
      router.push("/home");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, router.pathname]);

  return (
    <Elements stripe={stripePromise}>
      <PayPalScriptProvider options={{ "client-id": paypalClientId }}>
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, viewport-fit=cover"
          />

          <link
            rel="icon"
            href={artist.logoImage ?? DEFAULT_LOGO_IMAGE}
            key="favicon"
          />
          <link
            rel="canonical"
            href={`${artist.siteUrl}${asPath}`}
            key="canonical"
          />

          {/* Twitter */}
          <meta
            name="twitter:card"
            content="summary_large_image"
            key="twitter_card"
          />
          <meta
            name="twitter:title"
            content={artist.siteTitle}
            key="twitter_title"
          />
          <meta
            name="twitter:description"
            content={artist.siteDescription}
            key="twitter_description"
          />
          <meta
            name="twitter:image"
            content={artist.siteSocialPreviewImage}
            key="twitter_image"
          />

          {/* Open Graph */}
          <meta
            property="og:url"
            content={`${artist.siteUrl}${asPath}`}
            key="og_url"
          />
          <meta
            property="og:site_name"
            content={artist.siteName}
            key="og_site_name"
          />
          <meta property="og:title" content={artist.siteTitle} key="og_title" />
          <meta
            property="og:description"
            content={artist.siteDescription}
            key="og_description"
          />
          <meta
            property="og:image"
            content={artist.siteSocialPreviewImage}
            key="og_image"
          />
          <meta
            property="og:image:width"
            content={`1200`}
            key="og_image_width"
          />
          <meta
            property="og:image:height"
            content={`630`}
            key="og_image_height"
          />
          <meta
            name="description"
            content={artist.siteDescription}
            key="description"
          />
          <title key="title">{artist.siteTitle}</title>
        </Head>

        <main className="relative w-full flex flex-row justify-start items-start">
          {isHamburgerVisible && (
            <div className="flex absolute left-5 top-5 z-30">
              <Menu
                width={35}
                height={35}
                className="cursor-pointer text-primary hover:text-secondary transition-all duration-300"
                onClick={() => {
                  setIsSidebarVisible(!isSidebarVisible);
                }}
              />
            </div>
          )}

          <Topbar visible={isTopbarVisible} setVisible={setIsTopbarVisible} />

          <Sidebar
            visible={isSidebarVisible}
            setVisible={setIsSidebarVisible}
          />

          <div
            className="h-1 mr-[1px] transition-all duration-300"
            style={{ width: `${sidebarWidth}px` }}
          ></div>

          <div
            className="flex flex-col h-full justify-start items-center overflow-hidden border-l border-[#464646]"
            style={{
              width: `${contentWidth}px`,
            }}
          >
            {children}
          </div>
        </main>
      </PayPalScriptProvider>
    </Elements>
  );
};

export default Layout;
