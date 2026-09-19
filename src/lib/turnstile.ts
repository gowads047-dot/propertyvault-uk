/**
 * Cloudflare Turnstile, server side.
 *
 * Forms carry a token the widget minted in the browser; this asks Cloudflare
 * whether it is real. Off entirely until TURNSTILE_SECRET_KEY is set — the
 * honeypot and the rate limiter keep doing what they did — and once it is
 * set, a submission with no token or a bad one is refused. The token can be
 * used once, so a replayed request fails here too.
 *
 * The public site key (NEXT_PUBLIC_TURNSTILE_SITE_KEY) is what renders the
 * widget; the two must come from the same Turnstile site. Cloudflare's test
 * keys — 1x00000000000000000000AA / 1x0000000000000000000000000000000AA —
 * always pass, which is how the whole path is exercised without an account.
 */
export const TURNSTILE_FIELD = "cf-turnstile-response";

export type TurnstileResult = { ok: true; skipped: boolean } | { ok: false; reason: string };

export function turnstileEnabled(): boolean {
  return Boolean(process.env.TURNSTILE_SECRET_KEY);
}

export async function verifyTurnstile(token: unknown, remoteIp?: string | null): Promise<TurnstileResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return { ok: true, skipped: true };
  if (typeof token !== "string" || !token || token.length > 2048) {
    return { ok: false, reason: "missing-token" };
  }
  try {
    const body = new URLSearchParams({ secret, response: token });
    if (remoteIp) body.set("remoteip", remoteIp);
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body,
      signal: AbortSignal.timeout(8000),
    });
    const data = (await res.json()) as { success?: boolean; "error-codes"?: string[] };
    if (data.success) return { ok: true, skipped: false };
    return { ok: false, reason: (data["error-codes"] ?? ["unknown"]).join(",") };
  } catch (err) {
    // Cloudflare unreachable. Failing open here would let a bot through
    // whenever it can make Cloudflare slow; failing closed costs a real
    // visitor one retry. Closed.
    console.error("Turnstile verify failed:", err);
    return { ok: false, reason: "verify-unavailable" };
  }
}

/** The caller's address as Vercel reports it, for Cloudflare's remoteip. */
export function callerIp(req: Request): string | null {
  const fwd = req.headers.get("x-forwarded-for");
  return fwd ? fwd.split(",")[0].trim() : null;
}
