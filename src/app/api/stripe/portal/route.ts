import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-05-27.dahlia" });
  try {
    const { customerId } = await req.json();
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/academy/dashboard`,
    });
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Portal error:", err);
    return NextResponse.json({ error: "Failed to open billing portal" }, { status: 500 });
  }
}
