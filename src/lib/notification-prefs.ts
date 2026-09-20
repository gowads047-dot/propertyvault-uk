import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Rentura notification preferences: what Settings offers, and the one
 * question the crons ask before emailing.
 *
 * Settings saved the toggles to rentura_subscriptions.notification_preferences
 * and nothing ever read them back: the compliance and rent-reminder crons
 * emailed every landlord regardless. Turning a reminder off did nothing.
 */
export const NOTIFICATION_KEYS = [
  { key: "compliance_expiry", title: "Compliance expiry alerts", desc: "Remind me 45, 14 and 3 days before a certificate expires", defaultOn: true },
  { key: "mortgage_alerts",   title: "Mortgage rate alerts",     desc: "Notify me when a fixed rate is within 90 days of expiry", defaultOn: true },
  { key: "rent_reminders",    title: "Rent payment reminders",   desc: "Alert me if rent hasn't been logged by the 5th of the month", defaultOn: true },
  { key: "maintenance",       title: "Maintenance updates",       desc: "Notify me when a maintenance job changes status", defaultOn: false },
  { key: "weekly_digest",     title: "Portfolio digest",          desc: "Weekly summary of your portfolio performance every Monday", defaultOn: false },
] as const;

export type NotifKey = (typeof NOTIFICATION_KEYS)[number]["key"];
export type NotifPrefs = Record<NotifKey, boolean>;

export const DEFAULT_PREFS: NotifPrefs = Object.fromEntries(
  NOTIFICATION_KEYS.map((n) => [n.key, n.defaultOn]),
) as NotifPrefs;

/** Whether one stored preference object says yes to `key`; absent means the default. */
export function wants(prefs: Partial<Record<string, unknown>> | null | undefined, key: NotifKey): boolean {
  const v = prefs?.[key];
  return typeof v === "boolean" ? v : DEFAULT_PREFS[key];
}

/**
 * Of these users, the ones who want `key`. One query for the lot. A user
 * with no subscription row, or one whose preferences were never saved, gets
 * the default for that key.
 */
export async function usersWhoWant(supabase: SupabaseClient, userIds: string[], key: NotifKey): Promise<Set<string>> {
  const ids = [...new Set(userIds)];
  if (ids.length === 0) return new Set();
  const { data, error } = await supabase
    .from("rentura_subscriptions")
    .select("user_id, notification_preferences")
    .in("user_id", ids);
  if (error) {
    // Better to send to someone who opted out than to drop every reminder
    // because a read failed — but say so, loudly.
    console.error("notification-prefs: could not read preferences, sending with defaults:", error.message);
  }
  const stored = new Map<string, Record<string, unknown> | null>();
  for (const row of (data ?? []) as { user_id: string; notification_preferences: Record<string, unknown> | null }[]) {
    stored.set(row.user_id, row.notification_preferences);
  }
  return new Set(ids.filter((id) => wants(stored.get(id), key)));
}
