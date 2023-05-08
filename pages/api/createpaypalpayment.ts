import type { NextApiRequest, NextApiResponse } from "next";

import paypal from "@paypal/checkout-server-sdk";
import {
  PRODUCTION_MODE,
} from "@/libs/constants";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method === "POST") {
    const { amount, currency, paypalClientId, paypalClientSecret } = req.body;
    try {
      // Create a PayPal client with your sandbox or live credentials
      const paypalClient = new paypal.core.PayPalHttpClient(
        PRODUCTION_MODE
          ? new paypal.core.LiveEnvironment(paypalClientId, paypalClientSecret)
          : new paypal.core.SandboxEnvironment(paypalClientId, paypalClientSecret)
      );

      // Create a new PayPal order with the given amount and currency
      const request = new paypal.orders.OrdersCreateRequest();
      request.prefer("return=representation");
      request.requestBody({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: currency,
              value: amount,
            },
          },
        ],
      });
      const response = await paypalClient.execute(request);
      const orderID = response.result.id;

      res.status(200).json({ orderID });
    } catch (error) {
      console.error(error);
      res.status(500).end();
    }
  } else {
    res.status(405).end();
  }
}
