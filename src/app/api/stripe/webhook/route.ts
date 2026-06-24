import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-05-27.dahlia" });
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sub = event.data.object as any;
  const userId = sub.metadata?.userId as string | undefined;

  if (event.type === "customer.subscription.created" || event.type === "customer.subscription.updated") {
    if (userId) {
      const periodEnd = sub.current_period_end
        ? new Date(sub.current_period_end * 1000).toISOString()
        : null;
      await supabase.from("academy_members").upsert({
        user_id: userId,
        stripe_customer_id: sub.customer,
        stripe_subscription_id: sub.id,
        status: sub.status,
        current_period_end: periodEnd,
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id" });
    }
  }

  if (event.type === "customer.subscription.deleted") {
    if (userId) {
      await supabase.from("academy_members")
        .update({ status: "cancelled", updated_at: new Date().toISOString() })
        .eq("user_id", userId);
    }
  }

  return NextResponse.json({ received: true });
}
