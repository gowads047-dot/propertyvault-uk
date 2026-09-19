import { createHmac, timingSafeEqual } from "node:crypto";
import { SITE_URL } from "@/lib/site";

/**
 * One-click unsubscribe links (RFC 8058).
 *
 * A link that unsubscribes must not be forgeable — otherwise anyone can
 * unsubscribe anyone — and must not need a sign-in, because the point is
 * that Gmail and Apple Mail call it on the reader's behalf. So it carries
 * the address and an HMAC of it. The key is UNSUBSCRIBE_SECRET, falling
 * back to CRON_SECRET, which the site already requires to be long and
 * private. No secret, no link: better an email without an unsubscribe link
 * than one whose link anybody could mint.
 */
function secret(): string | null {
  const s = process.env.UNSUBSCRIBE_SECRET || process.env.CRON_SECRET;
  return typeof s === "string" && s.length >= 16 ? s : null;
}

export function unsubscribeToken(email: string): string | null {
  const key = secret();
  if (!key) return null;
  return createHmac("sha256", key).update(email.trim().toLowerCase()).digest("base64url");
}

export function unsubscribeUrl(email: string): string | null {
  const token = unsubscribeToken(email);
  if (!token) return null;
  const q = new URLSearchParams({ e: email.trim().toLowerCase(), t: token });
  return `${SITE_URL}/api/unsubscribe/?${q}`;
}

export function verifyUnsubscribeToken(email: string, token: string): boolean {
  const expected = unsubscribeToken(email);
  if (!expected || typeof token !== "string") return false;
  const a = Buffer.from(expected);
  const b = Buffer.from(token);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** The headers that let a mail client offer "Unsubscribe" at the top. */
export function unsubscribeHeaders(email: string): Record<string, string> {
  const url = unsubscribeUrl(email);
  if (!url) return {};
  return {
    "List-Unsubscribe": `<${url}>`,
    "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
  };
}
