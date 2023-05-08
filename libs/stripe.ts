export const createClientSecret = async (amount: number, currency: string, stripeSecretKey: string) => {
  const response = await fetch("/api/createstripepayment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: amount,
      currency: currency,
      stripeSecretKey
    }),
  });

  if (response.ok) {
    const { clientSecret } = await response.json();
    return clientSecret;
  }

  return "";
};
