import { createClient } from "@supabase/supabase-js";
import { getVerifiedUser, type VerifiedUser } from "@/lib/server-auth";
import { isAdmin } from "@/lib/admin";
import { hasRenturaAccess, type SubscriptionRow } from "@/lib/rentura-access";

/**
 * Who may call a Rentura route that costs money. SERVER ONLY.
 *
 * The page-side paywall (RenturaAccessGate) keeps a non-subscriber off the
 * app screens, but the AI chat, the document scanner and the extractors
 * are routes, and a route is reachable without a screen: the floating
 * chat is mounted on every Rentura page, the subscribe page included, so
 * a signed-in member who never paid could still spend model calls. This
 * is the same rule as the gate — trialing, active, past_due, or cancelled
 * with time left; the admin always — applied where the money is spent.
 *
 * A failed read of the subscription row lets the member through, as the
 * gate does: it is reported, and the alternative is a paying member
 * locked out by a hiccup.
 */
export type MemberCheck =
  | { ok: true; user: VerifiedUser }
  | { ok: false; status: 401 | 402; error: string };

export async function requireRenturaMember(req: Request): Promise<MemberCheck> {
  const user = await getVerifiedUser(req);
  if (!user) return { ok: false, status: 401, error: "Please sign in and try again." };
  if (isAdmin(user.email ?? undefined)) return { ok: true, user };

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const { data, error } = await supabase
    .from("rentura_subscriptions")
    .select("status, access_until, trial_end")
    .eq("user_id", user.id)
    .maybeSingle();
  if (error) {
    console.error("rentura-member: could not read the subscription, allowing:", error.message);
    return { ok: true, user };
  }
  if (!hasRenturaAccess(data as SubscriptionRow | null)) {
    return { ok: false, status: 402, error: "A Rentura subscription is needed for this. Start your free trial at /rentura/subscribe/." };
  }
  return { ok: true, user };
}
