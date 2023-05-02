import "@/styles/globals.scss";
import "react-multi-carousel/lib/styles.css";
import "react-toastify/dist/ReactToastify.min.css";
import "react-datepicker/dist/react-datepicker.css";
import "react-multi-carousel/lib/styles.css";

import type { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import NextNProgress from "nextjs-progressbar";

import { AuthProvider } from "@/contexts/contextAuth";
import { SizeProvider } from "@/contexts/contextSize";
import { ShareProvider } from "@/contexts/contextShareData";

import { PAYPAL_CLIENT_ID, STRIPE_PUBLICK_API_KEY } from "@/libs/constants";

const stripePromise = loadStripe(STRIPE_PUBLICK_API_KEY);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <SizeProvider>
        <ShareProvider>
          <Elements stripe={stripePromise}>
            <PayPalScriptProvider options={{ "client-id": PAYPAL_CLIENT_ID }}>
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
            </PayPalScriptProvider>
          </Elements>
        </ShareProvider>
      </SizeProvider>
    </AuthProvider>
  );
}
