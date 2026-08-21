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

  // Subscription created or updated
  if (event.type === "customer.subscription.created" || event.type === "customer.subscription.updated") {
    if (userId) {
      const periodEnd = sub.current_period_end
        ? new Date(sub.current_period_end * 1000).toISOString()
        : null;
      const trialEnd = sub.trial_end
        ? new Date(sub.trial_end * 1000).toISOString()
        : null;
      const isReactivating = (sub.status === "active" || sub.status === "trialing") && !sub.cancel_at_period_end;

      if (platform === "rentura") {
        await supabase.from("rentura_subscriptions").upsert({
          user_id: userId,
          stripe_customer_id: sub.customer,
          stripe_subscription_id: sub.id,
          status: sub.status,
          current_period_end: periodEnd,
          trial_end: trialEnd,
          access_until: isReactivating ? null : undefined,
          updated_at: new Date().toISOString(),
        }, { onConflict: "user_id" });
      } else {
        await supabase.from("academy_members").upsert({
          user_id: userId,
          stripe_customer_id: sub.customer,
          stripe_subscription_id: sub.id,
          status: sub.status,
          current_period_end: periodEnd,
          trial_end: trialEnd,
          access_until: isReactivating ? null : undefined,
          updated_at: new Date().toISOString(),
        }, { onConflict: "user_id" });
      }
    }
  }

  // Subscription deleted — grace period logic:
  // Cancelled during trial → access until trial ends (no extension, they never paid)
  // Cancelled after paying → access_until = period_end + 30 days
  if (event.type === "customer.subscription.deleted") {
    if (userId) {
      const nowMs = Date.now();
      const trialEndMs = sub.trial_end ? sub.trial_end * 1000 : 0;
      const periodEndMs = sub.current_period_end ? sub.current_period_end * 1000 : nowMs;
      const cancelledDuringTrial = trialEndMs > nowMs;

      const accessUntil = cancelledDuringTrial
        ? new Date(trialEndMs).toISOString()
        : new Date(periodEndMs + 30 * 24 * 60 * 60 * 1000).toISOString();

      if (platform === "rentura") {
        await supabase.from("rentura_subscriptions")
          .update({ status: "cancelled", access_until: accessUntil, cancelled_at: new Date().toISOString(), updated_at: new Date().toISOString() })
          .eq("user_id", userId);
      } else {
        await supabase.from("academy_members")
          .update({ status: "cancelled", access_until: accessUntil, updated_at: new Date().toISOString() })
          .eq("user_id", userId);
      }
    }
  }

  // checkout.session.completed — wire up the subscription to the user
  if (event.type === "checkout.session.completed") {
    const checkoutSession = event.data.object as Stripe.Checkout.Session;
    let cUserId = checkoutSession.metadata?.userId;
    const cPlatform = checkoutSession.metadata?.platform || "academy";

    // If no userId in metadata, look up by email so non-logged-in payments still link correctly
    if (!cUserId && checkoutSession.subscription) {
      const email = checkoutSession.customer_details?.email || checkoutSession.customer_email;
      if (email) {
        const { data: authUsers } = await supabase.auth.admin.listUsers();
        const match = authUsers?.users?.find((u: { email?: string; id: string }) => u.email === email);
        if (match) cUserId = match.id;
      }
    }

    if (cUserId && checkoutSession.subscription) {
      const subscription = await stripe.subscriptions.retrieve(checkoutSession.subscription as string) as Stripe.Subscription & { current_period_end?: number };
      const periodEnd = subscription.current_period_end
        ? new Date((subscription.current_period_end as number) * 1000).toISOString()
        : null;
      const customerEmail = checkoutSession.customer_details?.email || checkoutSession.customer_email || "";
      const trialEndFromSub = (subscription as Stripe.Subscription & { trial_end?: number | null }).trial_end;
      const trialEndIso = trialEndFromSub ? new Date(trialEndFromSub * 1000).toISOString() : null;

      if (cPlatform === "rentura") {
        await supabase.from("rentura_subscriptions").upsert({
          user_id: cUserId,
          stripe_customer_id: checkoutSession.customer as string,
          stripe_subscription_id: subscription.id,
          status: subscription.status,
          current_period_end: periodEnd,
          trial_end: trialEndIso,
          access_until: null,
          updated_at: new Date().toISOString(),
        }, { onConflict: "user_id" });
      } else {
        await supabase.from("academy_members").upsert({
          user_id: cUserId,
          email: customerEmail,
          stripe_customer_id: checkoutSession.customer as string,
          stripe_subscription_id: subscription.id,
          status: subscription.status,
          current_period_end: periodEnd,
          trial_end: trialEndIso,
          access_until: null,
          updated_at: new Date().toISOString(),
        }, { onConflict: "user_id" });
      }
    }

    // Send subscription confirmation email
    const cs = event.data.object as Stripe.Checkout.Session;
    const emailAddr = cs.customer_details?.email || cs.customer_email;
    if (emailAddr) {
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.propertyvaultuk.co.uk";
      fetch(`${baseUrl}/api/notifications/welcome`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailAddr, type: "subscription_confirm", platform: cPlatform }),
      }).catch(() => {});
    }
  }

  // Trial ending in 3 days — send reminder email so user isn't surprised by first charge
  if (event.type === "customer.subscription.trial_will_end") {
    const trialSub = event.data.object as Stripe.Subscription;
    const trialUserId = trialSub.metadata?.userId;
    const trialPlatform = trialSub.metadata?.platform || "academy";
    const trialEndDate = trialSub.trial_end
      ? new Date(trialSub.trial_end * 1000).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
      : "soon";
    const price = trialPlatform === "rentura" ? "£9.99/month" : "£14.99/month";
    const dashboardUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/${trialPlatform}/dashboard`;

    if (trialUserId) {
      const { data: authUser } = await supabase.auth.admin.getUserById(trialUserId);
      const toEmail = authUser?.user?.email;
      if (toEmail && process.env.RESEND_API_KEY) {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { "Authorization": `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            from: "PropertyVault UK <noreply@propertyvaultuk.co.uk>",
            to: toEmail,
            subject: `Your free trial ends on ${trialEndDate} — ${price} will be charged`,
            html: `<div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#0f1b2d;"><div style="background:#0f1b2d;padding:24px 32px;border-radius:12px 12px 0 0;"><span style="color:#c9a84c;font-weight:900;font-size:20px;">${trialPlatform === "rentura" ? "Rentura" : "Property Academy"}</span></div><div style="background:#f5f3ef;padding:32px;border-radius:0 0 12px 12px;border:1px solid #e8e4dd;"><h2 style="font-size:20px;font-weight:800;margin:0 0 12px;">Your free trial ends in 3 days</h2><p style="font-size:14px;color:rgba(15,27,45,0.6);line-height:1.7;margin:0 0 20px;">Your 30-day free trial ends on <strong>${trialEndDate}</strong>. On that date, your card will be charged <strong>${price}</strong> and your membership will continue automatically.</p><p style="font-size:14px;color:rgba(15,27,45,0.6);line-height:1.7;margin:0 0 24px;">If you&apos;d like to cancel before being charged, you can do so from your dashboard at any time.</p><a href="${dashboardUrl}" style="background:#0f1b2d;color:white;padding:13px 24px;border-radius:10px;text-decoration:none;font-weight:700;font-size:14px;display:inline-block;">Go to my dashboard →</a><p style="font-size:11px;color:rgba(15,27,45,0.3);margin-top:28px;">After your trial, you&apos;ll be billed ${price} each month. Cancel anytime from your dashboard — if you cancel after billing starts, you get 30 days of continued access before your account closes.</p></div></div>`,
          }),
        });
      }
    }
  }

  return NextResponse.json({ received: true });
}
