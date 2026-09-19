/**
 * Where a visitor came from, attached to every form they later submit.
 *
 * Read from the URL on arrival — utm_* and the ad click ids — with the
 * landing page and referrer, and kept in localStorage for 90 days. A visit
 * that carries new parameters replaces what was stored (the latest click is
 * the one that brought them back); a visit without any keeps the first.
 * attributionFields() flattens it for a request body: the contact route
 * files every unknown key under `details`, so each one lands in the
 * database and in the notification email as its own line.
 *
 * None of it identifies a person. It is not a cookie, and it is never sent
 * anywhere until the visitor themselves presses Send on a form.
 */

export const ATTRIBUTION_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "fbclid",
  "msclkid",
] as const;

export type Attribution = Partial<Record<(typeof ATTRIBUTION_PARAMS)[number], string>> & {
  landing_page?: string;
  referrer?: string;
  captured_at?: string;
};

const KEY = "pv_attribution";
const TTL_MS = 90 * 24 * 60 * 60 * 1000;
const MAX = 200;

function read(): Attribution | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const stored = JSON.parse(raw) as Attribution;
    if (!stored.captured_at || Date.now() - Date.parse(stored.captured_at) > TTL_MS) return null;
    return stored;
  } catch {
    return null;
  }
}

/** Pure, so it is testable: what the current URL and referrer say. */
export function attributionFrom(search: string, pathname: string, referrer: string, now = new Date()): Attribution | null {
  const params = new URLSearchParams(search);
  const found: Attribution = {};
  for (const p of ATTRIBUTION_PARAMS) {
    const v = params.get(p)?.trim();
    if (v) found[p] = v.slice(0, MAX);
  }
  const external = Boolean(referrer) && !/^https?:\/\/(www\.)?propertyvaultuk\.co\.uk(\/|$)/.test(referrer);
  if (Object.keys(found).length === 0 && !external) return null;
  return {
    ...found,
    landing_page: pathname.slice(0, MAX),
    ...(external ? { referrer: referrer.slice(0, MAX) } : {}),
    captured_at: now.toISOString(),
  };
}

/** Whether a capture carries campaign parameters, as opposed to only a referrer. */
export function hasCampaign(a: Attribution): boolean {
  return ATTRIBUTION_PARAMS.some(p => p in a);
}

/** Run once per page load, from a client component in the root layout. */
export function captureAttribution(): void {
  if (typeof window === "undefined") return;
  try {
    const fresh = attributionFrom(window.location.search, window.location.pathname, document.referrer);
    // New campaign parameters always win. A plain external referral only
    // fills in when nothing is stored — the first one is the one that
    // discovered the site.
    if (fresh && (hasCampaign(fresh) || !read())) localStorage.setItem(KEY, JSON.stringify(fresh));
  } catch {
    // Storage unavailable — private mode, blocked — attribution is a nicety.
  }
}

/** Flat string fields for a form body; empty when nothing is known. */
export function attributionFields(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const stored = read();
  if (!stored) return {};
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(stored)) {
    if (typeof v === "string" && k !== "captured_at") out[k] = v;
  }
  if (stored.captured_at) out.attributed_at = stored.captured_at;
  return out;
}

/** The subset of a request body that is attribution, for storing as one JSON value. */
export function pickAttribution(body: Record<string, unknown>): Record<string, string> | null {
  const out: Record<string, string> = {};
  for (const k of [...ATTRIBUTION_PARAMS, "landing_page", "referrer", "attributed_at"]) {
    const v = body[k];
    if (typeof v === "string" && v.trim()) out[k] = v.trim().slice(0, MAX);
  }
  return Object.keys(out).length ? out : null;
}
