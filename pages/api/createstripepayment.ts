import type { NextApiRequest, NextApiResponse } from "next";
import { Stripe } from "stripe";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method === "POST") {
    const { amount, currency, stripeSecretKey } = req.body;
    const stripe = new Stripe(stripeSecretKey, { apiVersion: "2022-11-15" });
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: currency,
    });
    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } else {
    res.status(405).end();
  }
}
