/**
 * Calendar days in Europe/London.
 *
 * The queue is keyed by day, and "today" has to mean the same thing to the
 * cron at 18:00 UTC, the seed script run from a laptop, and the person reading
 * the status page. UTC would put a late-evening London run onto the wrong day
 * for half the year; London is where the account is and where the audience is.
 */

const LONDON = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Europe/London", year: "numeric", month: "2-digit", day: "2-digit",
});

/** YYYY-MM-DD for an instant, in London. */
export function londonDate(at: Date): string {
  // en-CA formats as YYYY-MM-DD already; the parts API is used so a locale
  // change in the runtime cannot reorder the fields.
  const parts = Object.fromEntries(LONDON.formatToParts(at).map(p => [p.type, p.value]));
  return `${parts.year}-${parts.month}-${parts.day}`;
}

/** A YYYY-MM-DD plus or minus whole days. Pure date arithmetic, no zone. */
export function addDays(ymd: string, days: number): string {
  const t = Date.parse(`${ymd}T00:00:00Z`);
  if (Number.isNaN(t)) throw new Error(`not a YYYY-MM-DD date: "${ymd}"`);
  return new Date(t + days * 86_400_000).toISOString().slice(0, 10);
}

export function isYmd(s: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(`${s}T00:00:00Z`));
}
