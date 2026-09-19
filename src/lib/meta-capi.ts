import { createHash } from "node:crypto";

/**
 * Meta Conversions API — a Lead event sent from the server when an enquiry
 * lands.
 *
 * Off until META_PIXEL_ID and META_CAPI_ACCESS_TOKEN are set. On, it sends
 * one event per enquiry, and only for a visitor who accepted all cookies:
 * the contact route passes the consent the form carried, and without it
 * this returns before touching anything. Email and phone are SHA-256
 * hashed here, as Meta requires; fbclid, when the form carried one, becomes
 * the fbc parameter so the enquiry matches the ad click. The row id is the
 * event id, so a browser pixel added later can send the same event and be
 * deduplicated against this one.
 *
 * Never throws and never delays the response by more than a few seconds:
 * the enquiry is already saved and emailed by the time this runs.
 */
export type LeadEvent = {
  eventId: string;
  email?: string | null;
  phone?: string | null;
  consent: string | null | undefined;
  sourceUrl: string;
  ip?: string | null;
  userAgent?: string | null;
  fbclid?: string | null;
  attributedAt?: string | null;
};

const API_VERSION = "v21.0";

export function metaEnabled(): boolean {
  return Boolean(process.env.META_PIXEL_ID && process.env.META_CAPI_ACCESS_TOKEN);
}

export function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

/** Meta's normalisation before hashing: lower-case, trimmed; digits only with country code for phones. */
export function normaliseEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function normalisePhone(phone: string): string | null {
  let digits = phone.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) digits = digits.slice(1);
  else if (digits.startsWith("00")) digits = digits.slice(2);
  else if (digits.startsWith("0")) digits = "44" + digits.slice(1); // UK national format
  return digits.length >= 10 ? digits : null;
}

/** The fbc parameter Meta expects, built from the click id the form carried. */
export function fbcFrom(fbclid: string | null | undefined, at: string | null | undefined): string | null {
  if (!fbclid) return null;
  const ts = at ? Date.parse(at) : NaN;
  return `fb.1.${Number.isFinite(ts) ? ts : Date.now()}.${fbclid}`;
}

export function buildLeadPayload(e: LeadEvent): Record<string, unknown> {
  const userData: Record<string, unknown> = {};
  if (e.email) userData.em = [sha256(normaliseEmail(e.email))];
  const ph = e.phone ? normalisePhone(e.phone) : null;
  if (ph) userData.ph = [sha256(ph)];
  if (e.ip) userData.client_ip_address = e.ip;
  if (e.userAgent) userData.client_user_agent = e.userAgent;
  const fbc = fbcFrom(e.fbclid, e.attributedAt);
  if (fbc) userData.fbc = fbc;
  return {
    data: [
      {
        event_name: "Lead",
        event_time: Math.floor(Date.now() / 1000),
        event_id: e.eventId,
        action_source: "website",
        event_source_url: e.sourceUrl,
        user_data: userData,
      },
    ],
  };
}

export async function sendLeadToMeta(e: LeadEvent): Promise<"sent" | "skipped" | "failed"> {
  const pixel = process.env.META_PIXEL_ID;
  const token = process.env.META_CAPI_ACCESS_TOKEN;
  if (!pixel || !token) return "skipped";
  if (e.consent !== "all") return "skipped";
  try {
    const res = await fetch(`https://graph.facebook.com/${API_VERSION}/${pixel}/events?access_token=${encodeURIComponent(token)}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(buildLeadPayload(e)),
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) {
      console.error("Meta CAPI refused the event:", res.status, (await res.text()).slice(0, 300));
      return "failed";
    }
    return "sent";
  } catch (err) {
    console.error("Meta CAPI unreachable:", err);
    return "failed";
  }
}
