import "@/styles/globals.scss";
import "react-multi-carousel/lib/styles.css";
import "react-toastify/dist/ReactToastify.min.css";
import "react-datepicker/dist/react-datepicker.css";
import "react-multi-carousel/lib/styles.css";

import type { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";

import NextNProgress from "nextjs-progressbar";

import { AuthProvider } from "@/contexts/contextAuth";
import { SizeProvider } from "@/contexts/contextSize";
import { ShareProvider } from "@/contexts/contextShareData";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <SizeProvider>
        <ShareProvider>
          <ToastContainer
            theme="colored"
            position="top-right"
            bodyClassName="toastBody"
          />
          <NextNProgress
            color="#0052e4"
            startPosition={0.3}
            stopDelayMs={200}
            height={3}
            options={{
              showSpinner: false,
            }}
          />
          <Component {...pageProps} />
        </ShareProvider>
      </SizeProvider>
    </AuthProvider>
  );
}
