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
  const platform = (sub.metadata?.platform as string | undefined) || "academy";

  // Subscription created or updated (including cancel_at_period_end = true)
  if (event.type === "customer.subscription.created" || event.type === "customer.subscription.updated") {
    if (userId) {
      const periodEnd = sub.current_period_end
        ? new Date(sub.current_period_end * 1000).toISOString()
        : null;

      if (platform === "rentura") {
        await supabase.from("rentura_subscriptions").upsert({
          user_id: userId,
          stripe_customer_id: sub.customer,
          stripe_subscription_id: sub.id,
          status: sub.status,
          current_period_end: periodEnd,
          // Clear grace period if they reactivated
          access_until: sub.status === "active" && !sub.cancel_at_period_end ? null : undefined,
          updated_at: new Date().toISOString(),
        }, { onConflict: "user_id" });
      } else {
        await supabase.from("academy_members").upsert({
          user_id: userId,
          stripe_customer_id: sub.customer,
          stripe_subscription_id: sub.id,
          status: sub.status,
          current_period_end: periodEnd,
          // Clear grace period if they reactivated
          access_until: sub.status === "active" && !sub.cancel_at_period_end ? null : undefined,
          updated_at: new Date().toISOString(),
        }, { onConflict: "user_id" });
      }
    }
  }

  // Subscription fully deleted — grant 30-day grace period from period end
  if (event.type === "customer.subscription.deleted") {
    if (userId) {
      // Stripe gives current_period_end on the deleted subscription object
      const periodEndMs = sub.current_period_end
        ? sub.current_period_end * 1000
        : Date.now();
      // Grace period = end of last paid period + 30 days
      const accessUntil = new Date(periodEndMs + 30 * 24 * 60 * 60 * 1000).toISOString();

      if (platform === "rentura") {
        await supabase.from("rentura_subscriptions")
          .update({
            status: "cancelled",
            access_until: accessUntil,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", userId);
      } else {
        await supabase.from("academy_members")
          .update({
            status: "cancelled",
            access_until: accessUntil,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", userId);
      }
    }
  }

  // checkout.session.completed — wire up the subscription to the user
  if (event.type === "checkout.session.completed") {
    const checkoutSession = event.data.object as Stripe.Checkout.Session;
    const cUserId = checkoutSession.metadata?.userId;
    const cPlatform = checkoutSession.metadata?.platform || "academy";
    if (cUserId && checkoutSession.subscription) {
      const subscription = await stripe.subscriptions.retrieve(checkoutSession.subscription as string) as Stripe.Subscription & { current_period_end?: number };
      const periodEnd = subscription.current_period_end
        ? new Date((subscription.current_period_end as number) * 1000).toISOString()
        : null;
      if (cPlatform === "rentura") {
        await supabase.from("rentura_subscriptions").upsert({
          user_id: cUserId,
          stripe_customer_id: checkoutSession.customer as string,
          stripe_subscription_id: subscription.id,
          status: subscription.status,
          current_period_end: periodEnd,
          access_until: null, // fresh subscription — clear any old grace period
          updated_at: new Date().toISOString(),
        }, { onConflict: "user_id" });
      } else {
        await supabase.from("academy_members").upsert({
          user_id: cUserId,
          stripe_customer_id: checkoutSession.customer as string,
          stripe_subscription_id: subscription.id,
          status: subscription.status,
          current_period_end: periodEnd,
          access_until: null, // fresh subscription — clear any old grace period
          updated_at: new Date().toISOString(),
        }, { onConflict: "user_id" });
      }
    }

    // Send subscription confirmation email
    const cs = event.data.object as Stripe.Checkout.Session;
    const emailAddr = cs.customer_details?.email || cs.customer_email;
    if (emailAddr) {
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://propertyvaultuk.co.uk";
      fetch(`${baseUrl}/api/notifications/welcome`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailAddr, type: "subscription_confirm", platform: cPlatform }),
      }).catch(() => {});
    }
  }

  return NextResponse.json({ received: true });
}
