import { useState } from "react";

import { useAuthValues } from "@/contexts/contextAuth";

import {
  API_BASE_URL,
  API_VERSION,
  ASSET_TYPE,
  PROVIDER,
  TRANSACTION_TYPE,
} from "@/libs/constants";

import { IPlan } from "@/interfaces/IPlan";
import { ICurrency } from "@/interfaces/ICurrency";

const useTransaction = () => {
  const { accessToken, user } = useAuthValues();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const transact = async (
    amount: number,
    orderId: string,
    provider: PROVIDER,
    type: TRANSACTION_TYPE,
    planId: number | null,
    assetType: ASSET_TYPE,
    musicId: number | null,
    livestreamId: number | null,
    currencyId: number | null
  ) => {
    setIsLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/finance/transact`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          userId: user.id,
          amount,
          orderId,
          provider,
          type,
          planId,
          assetType,
          musicId,
          livestreamId,
          currencyId,
        }),
      }
    );
    if (response.ok) {
      setIsLoading(false);
      return true;
    } else {
      setIsLoading(false);
    }
    return false;
  };

  const fetchPlans = async () => {
    setIsLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/finance/plans`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      const plans = data as Array<IPlan>;

      setIsLoading(false);
      return plans;
    } else {
      setIsLoading(false);
    }
    return [];
  };

  const fetchCurrencies = async () => {
    setIsLoading(true);

    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/finance/currencies`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      const currencies = data as Array<ICurrency>;

      setIsLoading(false);
      return currencies;
    } else {
      setIsLoading(false);
    }
    return [];
  };

  const fetchPaymentData = async () => {
    const response = await fetch(
      `${API_BASE_URL}/${API_VERSION}/finance/payment-gateways`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      return {
        paypalClientId: data.paypalClientId,
        stripePublicApiKey: data.stripePublicApiKey,
      };
    } else {
      return null;
    }
  };

  return { isLoading, transact, fetchPlans, fetchCurrencies, fetchPaymentData };
};

export default useTransaction;
