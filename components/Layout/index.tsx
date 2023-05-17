import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import getConfig from "next/config";
import { Elements } from "@stripe/react-stripe-js";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { loadStripe } from "@stripe/stripe-js";

import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import Menu from "@/components/Icons/Menu";

import { useSizeValues } from "@/contexts/contextSize";
import { useAuthValues } from "@/contexts/contextAuth";
import { useShareValues } from "@/contexts/contextShareData";

import useFanclub from "@/hooks/useFanclub";

import { DEFAULT_LOGO_IMAGE } from "@/libs/constants";

const { publicRuntimeConfig } = getConfig();

type LayoutProps = {
  title?: string;
  description?: string;
  date?: string;
  socialPreview?: string;
  children: React.ReactNode;
};

const Layout = ({ children, ...customMeta }: LayoutProps) => {
  const router = useRouter();
  const { asPath } = router;

  const { paypalClientId, stripePublicApiKey } = useShareValues();
  const stripePromise = loadStripe(stripePublicApiKey);

  const { name, url, title, description, socialPreview } =
    publicRuntimeConfig.site;

  const meta = {
    name,
    url,
    title,
    description,
    socialPreview,
    ...customMeta,
  };

  const { isSignedIn } = useAuthValues();
  const [firstLoading, setFirstLoading] = useState<boolean>(true);
  const [logoUrl, setLogoUrl] = useState<string>(DEFAULT_LOGO_IMAGE);

  const {
    width,
    sidebarWidth,
    contentWidth,
    isSidebarVisible,
    setIsSidebarVisible,
    isTopbarVisible,
    setIsTopbarVisible,
  } = useSizeValues();
  const { fetchArtist } = useFanclub();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFirstLoading(false);
    }, 5000);

    fetchArtist().then((value) => {
      if (value) {
        setLogoUrl(value.logoImage);
      }
    });

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
    setIsSidebarVisible(width >= 768);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width]);

  return (
    <Elements stripe={stripePromise}>
      <PayPalScriptProvider options={{ "client-id": paypalClientId }}>
        <Head>
          <link rel="icon" href={logoUrl ?? DEFAULT_LOGO_IMAGE} key="favicon" />
          <link rel="canonical" href={`${url}${asPath}`} key="canonical" />

          {/* Twitter */}
          <meta
            name="twitter:card"
            content="summary_large_image"
            key="twitter_card"
          />
          <meta name="twitter:title" content={meta.title} key="twitter_title" />
          <meta
            name="twitter:description"
            content={meta.description}
            key="twitter_description"
          />
          <meta
            name="twitter:image"
            content={`${url}${socialPreview}`}
            key="twitter_image"
          />

          {/* Open Graph */}
          <meta property="og:url" content={`${url}${asPath}`} key="og_url" />
          <meta
            property="og:site_name"
            content={meta.name}
            key="og_site_name"
          />
          <meta property="og:title" content={meta.title} key="og_title" />
          <meta
            property="og:description"
            content={meta.description}
            key="og_description"
          />
          <meta
            property="og:image"
            content={`${url}${socialPreview}`}
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
            content={meta.description}
            key="description"
          />
          {meta.date && (
            <meta property="article:published_time" content={meta.date} />
          )}
          <title key="title">{meta.title}</title>
        </Head>

        <main className="relative w-full flex flex-row justify-start items-start">
          <div className="flex absolute left-5 top-5 z-20">
            <Menu
              width={35}
              height={35}
              className="cursor-pointer text-primary hover:text-secondary transition-all duration-300"
              onClick={() => {
                setIsSidebarVisible(!isSidebarVisible);
              }}
            />
          </div>
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
