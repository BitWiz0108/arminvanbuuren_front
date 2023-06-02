import { API_BASE_URL, API_VERSION, PROVIDER } from "./constants";

export const createOrderId = async (amount: number, currency: string) => {
  const response = await fetch(
    `${API_BASE_URL}/${API_VERSION}/finance/create-payment`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount,
        currency,
        provider: PROVIDER.PAYPAL,
      }),
    }
  );

  if (response.ok) {
    const data = await response.json();
    return data.sessionId;
  }

  return "";
};
