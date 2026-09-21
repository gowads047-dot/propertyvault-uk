"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { hasRenturaAccess, renturaPathNeedsAccess, type SubscriptionRow } from "@/lib/rentura-access";

/**
 * The paywall, mounted once in the Rentura layout.
 *
 * On any app page (not the landing page, sign-in, join, subscribe,
 * settings or admin), a signed-in member without a live subscription is
 * sent to /rentura/subscribe/. Signed-out visitors are left to the pages'
 * own redirect to sign-in. The answer is remembered for a minute per
 * member so moving between modules does not ask the database each time;
 * a successful checkout lands on the dashboard with ?success=1, which
 * clears it.
 */
const TTL_MS = 60_000;
let cache: { userId: string; ok: boolean; at: number } | null = null;

function cachedVerdict(userId: string): boolean | null {
  if (typeof window !== "undefined" && new URLSearchParams(window.location.search).get("success") === "1") cache = null;
  if (cache && cache.userId === userId && Date.now() - cache.at < TTL_MS) return cache.ok;
  return null;
}

export function RenturaAccessGate({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const gated = renturaPathNeedsAccess(pathname ?? "");
  const [checked, setChecked] = useState<{ userId: string; ok: boolean } | null>(null);

  // true: show the page; false: send to subscribe; null: not known yet.
  const verdict: boolean | null = !gated
    ? true
    : loading
      ? null
      : !user
        ? true // the page redirects to sign-in itself
        : (cachedVerdict(user.id) ?? (checked?.userId === user.id ? checked.ok : null));

  useEffect(() => {
    if (!gated || loading || !user || verdict !== null) return;
    let cancelled = false;
    // Back from Stripe: the webhook that flips the row from "pending" to
    // "trialing" can land a few seconds after the person does. Ask again,
    // up to five times, before concluding they never subscribed.
    const justPaid = new URLSearchParams(window.location.search).get("success") === "1";
    const attempts = justPaid ? 5 : 1;
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    (async () => {
      let ok = false;
      for (let i = 0; i < attempts && !cancelled; i++) {
        if (i > 0) await sleep(2000);
        const { data, error } = await supabase
          .from("rentura_subscriptions")
          .select("status, access_until, trial_end")
          .eq("user_id", user.id)
          .maybeSingle();
        // A failed read must not lock a paying member out; it is reported
        // by the client's own fetch and shows on the errors page.
        ok = error ? true : hasRenturaAccess(data as SubscriptionRow | null);
        if (ok) break;
      }
      if (cancelled) return;
      cache = { userId: user.id, ok, at: Date.now() };
      setChecked({ userId: user.id, ok });
    })();
    return () => { cancelled = true; };
  }, [gated, loading, user, verdict]);

  useEffect(() => {
    if (verdict === false) router.replace("/rentura/subscribe/");
  }, [verdict, router]);

  // Nothing until the answer is in: a dashboard that flashes and then
  // vanishes tells the person the paywall is a curtain, not a door.
  if (verdict !== true) return null;
  return <>{children}</>;
}
