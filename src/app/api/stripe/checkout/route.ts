import { NextResponse } from "next/server";
import { RULES, rateGuard } from "@/lib/rate-limit";
import { siteOrigin } from "@/lib/site";
import Stripe from "stripe";

export async function POST(req: Request) {
  // Every call creates a live Stripe session, so this cannot be unbounded.
  const limited = await rateGuard(req, RULES.checkoutPerCaller, RULES.checkoutGlobal);
  if (limited) {
    return NextResponse.json({ error: limited.error }, { status: limited.status });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-05-27.dahlia" });
  try {
    const { email, userId } = await req.json();

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: email || undefined,
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID!,
          quantity: 1,
        },
      ],
      metadata: { userId: userId || "" },
      success_url: `${siteOrigin()}/academy/dashboard?success=1`,
      cancel_url: `${siteOrigin()}/academy?cancelled=1`,
      payment_method_collection: "always",
      subscription_data: {
        metadata: { userId: userId || "" },
        trial_period_days: 30,
      },
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
