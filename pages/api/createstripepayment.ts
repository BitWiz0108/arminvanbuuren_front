import type { NextApiRequest, NextApiResponse } from "next";

import { STRIPE_SECRET_KEY } from "@/libs/constants";

// Create stripe instance
const stripe = require("stripe")(STRIPE_SECRET_KEY);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (req.method === "POST") {
    const { amount, currency } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: currency,
    });
    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } else {
    res.status(405).end();
  }
}
