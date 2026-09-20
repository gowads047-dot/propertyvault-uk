import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Where Stripe keeps the period end.
 *
 * Since API version 2025-03-31 `current_period_end` is on each subscription
 * item, not the subscription. The webhook read it off the subscription and
 * cast the type to make that compile, so every period end it recorded was
 * null: Settings never showed "Renews on", the admin table showed "—", and
 * a member who cancelled after paying got 30 days from the cancellation
 * instead of 30 days from the end of the period they had paid for. The
 * top-level field is still read as a fallback, for an endpoint pinned to
 * an older API version.
 */
type SubscriptionLike = {
  current_period_end?: number | null;
  items?: { data?: { current_period_end?: number | null }[] };
};

export function periodEndSeconds(sub: SubscriptionLike): number | null {
  return sub.items?.data?.[0]?.current_period_end ?? sub.current_period_end ?? null;
}

export function periodEndIso(sub: SubscriptionLike): string | null {
  const s = periodEndSeconds(sub);
  return s ? new Date(s * 1000).toISOString() : null;
}

/**
 * The auth user with this email, paging through the directory.
 * listUsers() answers one page of 50 by default, so a lookup that read only
 * the first page would stop finding people once the site had 51 accounts.
 * Emails are compared case-insensitively, as Supabase stores them.
 */
export async function findUserIdByEmail(supabase: SupabaseClient, email: string): Promise<string | null> {
  const wanted = email.trim().toLowerCase();
  for (let page = 1; page <= 100; page++) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 1000 });
    if (error || !data?.users?.length) return null;
    const match = data.users.find((u) => u.email?.toLowerCase() === wanted);
    if (match) return match.id;
    if (data.users.length < 1000) return null;
  }
  return null;
}
