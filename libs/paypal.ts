export const createOrderId = async (amount: number, currency: string, paypalClientId: string, paypalClientSecret: string) => {
  const response = await fetch("/api/createpaypalpayment", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ amount, currency, paypalClientId, paypalClientSecret }),
  });
  if (response.ok) {
    const data = await response.json();
    return data.orderID;
  }

  return "";
};
