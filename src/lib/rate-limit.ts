/**
 * Rate limiting for endpoints that cost money to serve.
 *
 * The AI verdict route calls Anthropic on our key and was, until this file
 * existed, callable by anyone with no limit at all. There is no middleware in
 * this app and no Redis, so the counter lives in Postgres — the same Supabase
 * instance everything else uses.
 *
 * ── Why it fails closed ────────────────────────────────────────────────────
 *
 * If the limiter cannot reach its store it denies the request. That is the
 * uncomfortable direction: a database blip takes the feature down rather than
 * letting requests through.
 *
 * It is still the right way round here. The thing being protected is an
 * uncapped spend on somebody else's API, and an attacker who can provoke store
 * errors would otherwise have found the bypass. The verdict is commentary on
 * numbers the user can already see on the page, so losing it briefly costs
 * them very little, and the failure is loud rather than silent.
 */

export interface RateLimitStore {
  /**
   * Atomically add one to `bucket` and return the new count. Buckets expire on
   * their own; callers never delete.
   */
  increment(bucket: string, windowSeconds: number): Promise<number>;
}

export interface RateLimitResult {
  allowed: boolean;
  /** Requests used in this window, including the current one. */
  used: number;
  limit: number;
  /** Set when the decision came from a store failure rather than a real count. */
  degraded?: boolean;
}

export interface RateLimitRule {
  /** Identifies what is being limited, e.g. "ai-verdict". */
  name: string;
  limit: number;
  windowSeconds: number;
}

/**
 * A caller's identity, for bucketing.
 *
 * Vercel sets x-forwarded-for; the left-most entry is the client. Everything
 * after it is a proxy and is attacker-controllable in the general case, so only
 * the first hop is used.
 */
export function callerKey(headers: Headers): string {
  const fwd = headers.get("x-forwarded-for");
  const first = fwd?.split(",")[0]?.trim();
  if (first) return first;
  return headers.get("x-real-ip")?.trim() || "unknown";
}

/** Bucket name for a rule, caller and window. Stable within the window. */
export function bucketFor(rule: RateLimitRule, caller: string, now: Date): string {
  const window = Math.floor(now.getTime() / (rule.windowSeconds * 1000));
  return `${rule.name}:${caller}:${window}`;
}

/**
 * Consume one unit against a rule.
 *
 * A caller of "unknown" is not exempt — an absent forwarding header must not be
 * a way round the limit, so every unidentified caller shares one bucket and
 * they collectively get the same allowance as a single IP.
 */
export async function consume(
  store: RateLimitStore,
  rule: RateLimitRule,
  caller: string,
  now: Date = new Date(),
): Promise<RateLimitResult> {
  const bucket = bucketFor(rule, caller, now);
  try {
    const used = await store.increment(bucket, rule.windowSeconds);
    return { allowed: used <= rule.limit, used, limit: rule.limit };
  } catch {
    return { allowed: false, used: rule.limit, limit: rule.limit, degraded: true };
  }
}

/**
 * Check several rules at once — typically a per-caller limit alongside a global
 * one, since a per-IP limit alone does nothing against a spread of addresses.
 *
 * Every rule is consumed even after one denies, so a caller cannot probe which
 * limit they hit by watching whether the global counter moved.
 */
export async function consumeAll(
  store: RateLimitStore,
  checks: { rule: RateLimitRule; caller: string }[],
  now: Date = new Date(),
): Promise<{ allowed: boolean; results: RateLimitResult[] }> {
  const results = await Promise.all(
    checks.map(c => consume(store, c.rule, c.caller, now)),
  );
  return { allowed: results.every(r => r.allowed), results };
}

/** The rules this app enforces. */
export const RULES = {
  /** One person, one hour. Generous for real use, useless for scraping. */
  aiVerdictPerCaller: { name: "ai-verdict", limit: 12, windowSeconds: 3600 },
  /**
   * Everyone, one day. A per-IP limit alone is defeated by a botnet; this is
   * the line that actually bounds the bill.
   */
  aiVerdictGlobal: { name: "ai-verdict-global", limit: 2_000, windowSeconds: 86_400 },

  /**
   * The conversational routes. Higher per-caller than the verdict because a
   * conversation is many turns by design, and someone mid-flow through a
   * property setup should not hit a wall.
   */
  chatPerCaller: { name: "ai-chat", limit: 60, windowSeconds: 3600 },
  chatGlobal: { name: "ai-chat-global", limit: 5_000, windowSeconds: 86_400 },

  /**
   * Document and image extraction. Tighter, because a vision call on a
   * multi-page scan is the most expensive request this app can make, and
   * nobody legitimately uploads thirty documents an hour.
   */
  visionPerCaller: { name: "ai-vision", limit: 20, windowSeconds: 3600 },
  visionGlobal: { name: "ai-vision-global", limit: 1_000, windowSeconds: 86_400 },

  /**
   * Sending email.
   *
   * The thing being protected here is not the Resend bill, it is the sending
   * domain. An open endpoint that puts mail into strangers' inboxes from
   * info@propertyvaultuk.co.uk gets that domain onto blocklists, and a
   * reputation is far harder to get back than a quota.
   *
   * Low per caller, because nobody legitimately emails themselves a deal ten
   * times in an hour.
   */
  emailPerCaller: { name: "email", limit: 10, windowSeconds: 3600 },
  emailGlobal: { name: "email-global", limit: 500, windowSeconds: 86_400 },

  /**
   * Proxying somebody else's free public service.
   *
   * /api/postcode-lookup fans out to postcodes.io, data.police.uk and HM Land
   * Registry on every call. Unmetered, it is an open proxy in front of three
   * services that owe us nothing — and the cost of abusing it is not paid by
   * whoever abuses it. It is paid by every real user, when those services
   * start refusing our egress addresses and the Deal Analyser stops finding
   * anything.
   *
   * Generous per caller, because someone comparing a shortlist genuinely does
   * a lot of lookups in an hour.
   */
  lookupPerCaller: { name: "lookup", limit: 120, windowSeconds: 3600 },
  lookupGlobal: { name: "lookup-global", limit: 20_000, windowSeconds: 86_400 },
} as const satisfies Record<string, RateLimitRule>;

/**
 * The guard every AI route puts in front of a paid call.
 *
 * Written once because it was written zero times: /api/deal-ai-verdict was
 * closed when the limiter was built, and five other routes that call Anthropic
 * on the same key — two chats and three document extractors — were left open,
 * unauthenticated and unmetered. A helper makes adding the guard a three-line
 * change, which is the difference between it being done everywhere and being
 * done once.
 *
 * Returns null when the request may proceed, or the response to send back.
 */
export async function rateGuard(
  request: Request,
  perCaller: RateLimitRule,
  global: RateLimitRule,
): Promise<{ status: number; error: string } | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // No store means no limiter, and an unmetered call to a paid API is the
  // thing this exists to prevent. Fail closed, as consume() already does.
  if (!url || !key) {
    return { status: 503, error: "This is temporarily unavailable." };
  }

  const { allowed, results } = await consumeAll(supabaseStore(url, key), [
    { rule: perCaller, caller: callerKey(request.headers) },
    { rule: global, caller: "all" },
  ]);
  if (allowed) return null;

  const degraded = results.some(r => r.degraded);
  return degraded
    ? { status: 503, error: "This is temporarily unavailable." }
    : { status: 429, error: "Too many requests. Try again shortly." };
}

/**
 * The Postgres-backed store. Requires the function in
 * supabase/rate-limit.sql, which does the increment atomically — doing it as a
 * read then a write would let concurrent requests share a count and sail past
 * the limit together.
 */
export function supabaseStore(url: string, serviceKey: string): RateLimitStore {
  return {
    async increment(bucket, windowSeconds) {
      const res = await fetch(`${url}/rest/v1/rpc/consume_rate_limit`, {
        method: "POST",
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ p_bucket: bucket, p_window_seconds: windowSeconds }),
      });
      if (!res.ok) throw new Error(`rate limit store ${res.status}`);
      const count = await res.json();
      if (typeof count !== "number") throw new Error("rate limit store returned no count");
      return count;
    },
  };
}
