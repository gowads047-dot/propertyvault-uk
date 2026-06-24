import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-05-27.dahlia" });
  try {
    const { email, userId } = await req.json();

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: email || undefined,
      line_items: [
        {
          price: process.env.RENTURA_STRIPE_PRICE_ID!,
          quantity: 1,
        },
      ],
      metadata: { userId: userId || "", platform: "rentura" },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/rentura/dashboard?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/rentura?cancelled=1`,
      payment_method_collection: "always",
      subscription_data: {
        metadata: { userId: userId || "", platform: "rentura" },
        trial_period_days: 30,
      },
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Rentura checkout error:", err);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
