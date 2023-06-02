import { API_BASE_URL, API_VERSION, PROVIDER } from "./constants";

export const createClientSecret = async (amount: number, currency: string) => {
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
        provider: PROVIDER.STRIPE,
      }),
    }
  );

  if (response.ok) {
    const data = await response.json();
    return data.sessionId;
  }

  return "";
};
