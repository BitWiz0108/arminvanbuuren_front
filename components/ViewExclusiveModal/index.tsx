import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { toast } from "react-toastify";
import { twMerge } from "tailwind-merge";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import {
  usePayPalScriptReducer,
  PayPalButtons,
  FUNDING,
} from "@paypal/react-paypal-js";
import {
  CreateOrderData,
  CreateOrderActions,
  OnApproveData,
  OnApproveActions,
  OrderResponseBody,
} from "@paypal/paypal-js";

import X from "@/components/Icons/X";
import Loading from "@/components/Loading";

import { useAuthValues } from "@/contexts/contextAuth";
import { useShareValues } from "@/contexts/contextShareData";
import { useSizeValues } from "@/contexts/contextSize";

import useTransaction from "@/hooks/useTransaction";

import {
  APP_TYPE,
  ASSET_TYPE,
  PROVIDER,
  SYSTEM_TYPE,
  TRANSACTION_TYPE,
} from "@/libs/constants";
import { createClientSecret } from "@/libs/stripe";
import { createOrderId } from "@/libs/paypal";
import { checkNumber } from "@/libs/utils";

import { DEFAULT_CURRENCY, ICurrency } from "@/interfaces/ICurrency";

const ViewExclusiveModal = () => {
  const { isSignedIn } = useAuthValues();
  const {
    artist,
    isViewExclusiveModalVisible,
    setIsViewExclusiveModalVisible,
  } = useShareValues();
  const { isMobile } = useSizeValues();

  const [provider, setProvider] = useState<PROVIDER>(PROVIDER.STRIPE);
  const [currencies, setCurrencies] = useState<Array<ICurrency>>([]);
  const [amount, setAmount] = useState<number>(5);
  const [amountString, setAmountString] = useState<string>("5");
  const [currency, setCurrency] = useState<ICurrency>(DEFAULT_CURRENCY);
  const [isWorking, setIsWorking] = useState<boolean>(false);

  const stripe = useStripe();
  const elements = useElements();
  const [{ isResolved }] = usePayPalScriptReducer();

  const { transact, fetchCurrencies } = useTransaction();

  const onCurrencyChanged = (value: string) => {
    const selectedCurrencyId = Number(value);
    const index = currencies.findIndex((item) => {
      return item.id == selectedCurrencyId;
    });
    if (index >= 0) {
      setCurrency(currencies[index]);
      setAmountString(
        (prev) => `${currencies[index].symbol}${prev.substring(1)}`
      );
    }
  };

  const onAmountStringChanged = (value: string) => {
    let price = value;
    if (value.includes(currency.symbol)) {
      price = value.substring(1);
    }
    if (!price) {
      setAmountString(currency.symbol);
      setAmount(0);
      return;
    }
    if (!checkNumber(price)) {
      setAmount(0);
      return;
    }
    setAmountString(value);
    setAmount(Number(price));
  };

  const handleStripe = async () => {
    if (isWorking) return false;

    if (!stripe || !elements || amount <= 0) {
      toast.warn("Please enter amount correctly.");
      return false;
    }

    setIsWorking(true);

    const clientSecret = await createClientSecret(amount, currency.code);

    if (clientSecret) {
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });

      if (result) {
        if (result.paymentIntent?.status == "succeeded") {
          toast.success("Successfully subscribed!");

          // Log transaction
          transact(
            amount,
            result.paymentIntent.id,
            PROVIDER.STRIPE,
            TRANSACTION_TYPE.SUBSCRIPTION,
            1,
            ASSET_TYPE.NONE,
            null,
            null,
            currency.id
          ).then((value) => {
            if (value) {
              if (window) {
                window.location.reload();
              }
            }
          });

          setIsWorking(false);

          setIsViewExclusiveModalVisible(false);

          return true;
        } else {
          if (result.error) {
            toast.error(result.error.message);
          } else {
            toast.error(
              "Failed to create Stripe order. Please try again later."
            );
          }
        }
      }
    } else {
      toast.error("Failed to create Stripe order. Please try again later.");
    }

    setIsWorking(false);
    return false;
  };

  const createPaypalOrder = async (
    data: CreateOrderData,
    actions: CreateOrderActions
  ) => {
    if (amount <= 0) {
      throw new Error("Please enter amount correctly.");
    }

    const orderId = await createOrderId(amount, currency.code);
    if (orderId) return orderId;

    throw new Error("Failed to create PayPal order. Please try again later.");
  };

  const onPaypalApprove = async (
    data: OnApproveData,
    actions: OnApproveActions
  ) => {
    if (actions && actions.order) {
      return actions.order.capture().then((details: OrderResponseBody) => {
        toast.success("Successfully subscribed!");

        // Log transaction
        transact(
          amount,
          details.id,
          PROVIDER.PAYPAL,
          TRANSACTION_TYPE.SUBSCRIPTION,
          1,
          ASSET_TYPE.NONE,
          null,
          null,
          currency.id
        ).then((value) => {
          if (value) {
            if (window) {
              window.location.reload();
            }
          }
        });

        setIsViewExclusiveModalVisible(false);
      });
    }

    throw new Error("Failed to create PayPal order. Please try again later.");
  };

  const onPaypalError = (e: any) => {
    if (e && e.message) {
      toast.error(e.message);
    } else {
      toast.error("Failed to create PayPal order. Please try again later.");
    }
  };

  useEffect(() => {
    if (isSignedIn) {
      fetchCurrencies().then((currencies) => {
        setCurrencies(currencies);

        setCurrency(currencies[0]);
        setAmountString(`${currencies[0].symbol}5`);
        setAmount(5);
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn]);

  return (
    <AnimatePresence>
      {isViewExclusiveModalVisible && (
        <motion.div
          className={twMerge(
            "fixed left-0 top-0 w-screen h-screen px-5 pt-5 bg-[#000000aa] flex justify-center items-center z-50",
            isMobile ? "pb-[180px]" : "pb-28 lg:pb-36"
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative w-full md:w-[540px] max-h-full px-5 md:px-10 pt-10 pb-5 md:pb-10 bg-background rounded-lg overflow-x-hidden overflow-y-auto pr-5">
            <div className="mb-4">
              {artist.subscriptionDescription ? (
                <div
                  className="none-tailwind text-center"
                  dangerouslySetInnerHTML={{
                    __html: artist.subscriptionDescription,
                  }}
                ></div>
              ) : (
                <>
                  <h1 className="text-2xl text-center text-primary font-semibold">
                    Join The {artist.artistName}&nbsp;
                    {SYSTEM_TYPE == APP_TYPE.CHURCH ? "Community" : "Fan Club"}
                  </h1>
                  <p className="text-sm text-center text-secondary">
                    In order to access exclusive content like this please pay $5
                    Per month.
                    <br />
                    You can cancel at anytime, thank you for your support.
                  </p>
                </>
              )}
            </div>

            <div className="absolute top-5 right-5 text-primary cursor-pointer">
              <X
                width={24}
                height={24}
                onClick={() => setIsViewExclusiveModalVisible(false)}
              />
            </div>

            <div className="w-full h-fit flex flex-col justify-start items-center">
              <div className="w-full flex flex-row justify-center items-center space-x-2 mb-2">
                <div className="w-full flex flex-col justify-start items-start space-y-1">
                  <label className="text-xs text-left text-primary">
                    Currency
                  </label>
                  <div className="w-full h-[44px] min-h-[44px] text-white tracking-[4px] hover:bg-activeSecondary inline-flex justify-center items-center rounded-md transition-all duration-300 space-x-3 select-none cursor-pointer">
                    <select
                      className="w-full h-[44px] bg-third rounded-md box-border outline-none appearance-none justify-center items-center text-center"
                      placeholder="Select Currency"
                      value={currency.id ? currency.id : ""}
                      onChange={(e) => onCurrencyChanged(e.target.value)}
                      disabled={true}
                    >
                      {currencies.map((item, index) => {
                        return (
                          <option key={index} value={item.id ? item.id : ""}>
                            {item.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
                <div className="w-full flex flex-col justify-start items-start space-y-1">
                  <label className="text-xs text-left text-primary">
                    Amount
                  </label>
                  <div className="w-full h-[44px] min-h-[44px] text-white tracking-[4px] hover:bg-activeSecondary inline-flex justify-center items-center rounded-md transition-all duration-300 space-x-3 select-none cursor-pointer">
                    <input
                      type="text"
                      className="w-full h-[44px] bg-third rounded-md box-border outline-none appearance-none justify-center items-center text-left px-3"
                      placeholder={currency.symbol}
                      value={amountString}
                      onChange={(e) => onAmountStringChanged(e.target.value)}
                      disabled={true}
                    />
                  </div>
                </div>
              </div>

              <div className="w-full p-2 border border-dashed border-third rounded-lg flex flex-col justify-start items-center space-y-2">
                <div className="w-full flex justify-start items-center space-x-2 border-b border-gray-700">
                  <button
                    className={`w-full inline-flex justify-center items-center space-x-2 rounded-tl-md rounded-tr-md px-5 h-11 ${
                      provider == PROVIDER.STRIPE
                        ? "bg-third text-primary"
                        : "bg-transparent text-secondary hover:bg-third"
                    } transition-all duration-300`}
                    onClick={() => setProvider(PROVIDER.STRIPE)}
                    disabled={isWorking}
                  >
                    <Image
                      className="w-6 h-6 object-cover"
                      src="/images/stripe.svg"
                      width={24}
                      height={24}
                      alt=""
                    />
                    <span>STRIPE</span>
                  </button>
                  <button
                    className={`w-full inline-flex justify-center items-center rounded-tl-md rounded-tr-md px-5 h-11 ${
                      provider == PROVIDER.PAYPAL
                        ? "bg-third text-primary"
                        : "bg-transparent text-secondary hover:bg-third"
                    } transition-all duration-300`}
                    onClick={() => {
                      if (amount <= 0) {
                        toast.warn("Please enter amount correctly.");
                        return;
                      }
                      setProvider(PROVIDER.PAYPAL);
                    }}
                    disabled={isWorking}
                  >
                    <Image
                      className="w-28 h-6 object-cover"
                      src="/images/paypal.svg"
                      width={112}
                      height={24}
                      alt=""
                    />
                  </button>
                </div>

                {provider == PROVIDER.STRIPE && (
                  <>
                    <div className="w-full flex flex-col justify-start items-start space-y-1">
                      <label className="text-xs text-left text-primary">
                        Card
                      </label>
                      <CardElement className="w-full p-3.5 bg-primary rounded-md" />
                    </div>
                    <button
                      className="w-full px-5 py-2 inline-flex justify-center items-center space-x-2 text-lg text-primary bg-bluePrimary hover:bg-blueSecondary transition-all duration-300 rounded-md"
                      disabled={isWorking}
                      onClick={() => handleStripe()}
                    >
                      {isWorking ? (
                        <Loading width={28} height={28} />
                      ) : (
                        <>
                          <Image
                            className="w-6 h-6 object-cover"
                            src="/images/stripe.svg"
                            width={24}
                            height={24}
                            alt=""
                          />
                          <span>STRIPE</span>
                        </>
                      )}
                    </button>
                  </>
                )}

                {provider == PROVIDER.PAYPAL && isResolved && (
                  <PayPalButtons
                    fundingSource={FUNDING.PAYPAL}
                    createOrder={createPaypalOrder}
                    onApprove={onPaypalApprove}
                    onError={onPaypalError}
                    style={{
                      color: "blue",
                      shape: "rect",
                      height: 44,
                    }}
                    className="w-full"
                  />
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ViewExclusiveModal;
