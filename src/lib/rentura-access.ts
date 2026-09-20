/**
 * Who may use the Rentura app.
 *
 * Sign-up sends a new member to Stripe for a 30-day trial, but nothing
 * checked that they went through with it: close the Stripe tab and the
 * dashboard, the AI chat and all fourteen modules were yours for free.
 * This is the one rule, kept pure so it can be tested against every
 * state Stripe writes.
 *
 * - trialing / active: yes.
 * - past_due: yes — Stripe is retrying the card; cutting someone off on
 *   the first failed attempt loses more members than it saves.
 * - cancelled: until access_until, the paid-for period plus the 30 days
 *   the webhook adds.
 * - pending (the row join creates before Stripe), incomplete, unpaid,
 *   no row at all: no.
 */
export type SubscriptionRow = {
  status: string | null;
  access_until: string | null;
  trial_end?: string | null;
};

export function hasRenturaAccess(sub: SubscriptionRow | null | undefined, now: Date = new Date()): boolean {
  if (!sub || !sub.status) return false;
  switch (sub.status) {
    case "trialing":
    case "active":
    case "past_due":
      return true;
    case "cancelled":
    case "canceled":
      return !!sub.access_until && new Date(sub.access_until).getTime() > now.getTime();
    default:
      return false;
  }
}

/** Paths under /rentura/ that do not need a subscription. */
const OPEN = ["/rentura/auth", "/rentura/join", "/rentura/subscribe", "/rentura/settings", "/rentura/admin"];

export function renturaPathNeedsAccess(pathname: string): boolean {
  const p = pathname.replace(/\/+$/, "") || "/";
  if (p === "/rentura" || !p.startsWith("/rentura/")) return false;
  return !OPEN.some((o) => p === o || p.startsWith(o + "/"));
}
