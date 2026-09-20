import { NextResponse } from "next/server";
import { RULES, rateGuard } from "@/lib/rate-limit";
import { siteOrigin } from "@/lib/site";
import { getVerifiedUser } from "@/lib/server-auth";
import Stripe from "stripe";

/**
 * Starts a Rentura subscription checkout for the signed-in member.
 *
 * The user id and email used to come from the request body, unverified.
 * The webhook then wrote whatever Stripe customer came back onto that
 * user's subscription row — so anyone could open a checkout naming another
 * member's id, and that member's "Manage billing" would open a stranger's
 * Stripe customer. The identity now comes from the session token.
 */
export async function POST(req: Request) {
  // Every call creates a live Stripe session, so this cannot be unbounded.
  const limited = await rateGuard(req, RULES.checkoutPerCaller, RULES.checkoutGlobal);
  if (limited) {
    return NextResponse.json({ error: limited.error }, { status: limited.status });
  }

  const user = await getVerifiedUser(req);
  if (!user) return NextResponse.json({ error: "Please sign in and try again." }, { status: 401 });
  const userId = user.id;
  const email = user.email;

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-05-27.dahlia" });
  try {

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
      metadata: { userId, platform: "rentura" },
      success_url: `${siteOrigin()}/rentura/dashboard?success=1`,
      cancel_url: `${siteOrigin()}/rentura?cancelled=1`,
      payment_method_collection: "always",
      subscription_data: {
        metadata: { userId, platform: "rentura" },
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
