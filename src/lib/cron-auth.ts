import { createHash, timingSafeEqual } from "node:crypto";

/**
 * Authorising a scheduled job.
 *
 * Every cron route checked its caller like this:
 *
 *   if (req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`)
 *
 * Which is correct only while the secret exists. When CRON_SECRET is unset the
 * template produces the literal string "Bearer undefined", and anyone sending
 * exactly that header is authorised. Five routes shared the pattern, and they
 * send email and publish to Instagram — so a missing environment variable did
 * not disable the jobs, it opened them.
 *
 * This fails closed instead: no secret, or one too short to be one, and every
 * request is refused. It is the same decision the rate limiter makes, for the
 * same reason — a misconfiguration should cost availability, never control.
 */

/** Short enough to be guessable is the same as absent. */
const MIN_SECRET_LENGTH = 16;

export function authorizeCron(request: Request, secret = process.env.CRON_SECRET): boolean {
  if (typeof secret !== "string" || secret.length < MIN_SECRET_LENGTH) {
    // Failing closed turns a misconfiguration into every job returning 401,
    // which looks exactly like a wrong token. Say which it is, without saying
    // what the secret is.
    console.error(
      typeof secret !== "string" || secret.length === 0
        ? "cron auth: CRON_SECRET is not set — every scheduled job will be refused"
        : `cron auth: CRON_SECRET is shorter than ${MIN_SECRET_LENGTH} characters — every scheduled job will be refused`,
    );
    return false;
  }

  const header = request.headers.get("authorization");
  if (typeof header !== "string") return false;

  // Digests so the comparison is over fixed-length buffers: timingSafeEqual
  // throws on a length mismatch, and branching on length before comparing
  // leaks it.
  return sameDigest(header, `Bearer ${secret}`);
}

function sameDigest(a: string, b: string): boolean {
  const da = createHash("sha256").update(a).digest();
  const db = createHash("sha256").update(b).digest();
  return timingSafeEqual(da, db);
}
