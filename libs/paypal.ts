export const createOrderId = async (amount: number, currency: string) => {
  const response = await fetch("/api/createpaypalpayment", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ amount, currency }),
  });
  if (response.ok) {
    const data = await response.json();
    return data.orderID;
  }

  return "";
};
