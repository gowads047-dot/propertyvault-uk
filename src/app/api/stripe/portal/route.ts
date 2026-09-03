import { NextResponse } from "next/server";
import { getVerifiedUser } from "@/lib/server-auth";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-05-27.dahlia" });

  // Verified against the auth server. This id selects whose billing
  // portal is opened, so taking it on trust from a cookie would let a
  // caller open somebody else's.
  const user = await getVerifiedUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = user.id;

  // Service role client to look up customer ID
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Determine platform from request body
  const body = await req.json().catch(() => ({}));
  const platform: string = body.platform || "academy";

  let customerId: string | null = null;

  if (platform === "rentura") {
    const { data } = await supabase
      .from("rentura_subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", userId)
      .maybeSingle();
    customerId = data?.stripe_customer_id || null;
  } else {
    const { data } = await supabase
      .from("academy_members")
      .select("stripe_customer_id")
      .eq("user_id", userId)
      .maybeSingle();
    customerId = data?.stripe_customer_id || null;
  }

  if (!customerId) {
    return NextResponse.json({ error: "No billing account found" }, { status: 404 });
  }

  try {
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: platform === "rentura"
        ? `${process.env.NEXT_PUBLIC_SITE_URL}/rentura/settings`
        : `${process.env.NEXT_PUBLIC_SITE_URL}/academy/dashboard`,
    });
    return NextResponse.json({ url: portalSession.url });
  } catch (err) {
    console.error("Portal error:", err);
    return NextResponse.json({ error: "Failed to open billing portal" }, { status: 500 });
  }
}
