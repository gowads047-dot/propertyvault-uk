import type { Fetcher } from "../instagram";
import type { SocialStore } from "./db";
import { readStored, refreshInstagramToken } from "./token";

/**
 * The weekly token exchange, as the Monday route runs it.
 *
 * Two tokens may exist: the one a previous refresh stored, and the one in
 * the environment. The stored one is tried first because it is the newer;
 * if Meta refuses it — expired, revoked, replaced in the dashboard — the
 * environment's is tried, because a person may have set a fresh one there
 * precisely to recover. Whichever exchange succeeds is what gets stored.
 *
 * Meta also refuses to refresh a token less than a day old, so a run on the
 * Monday after a token was made fails, harmlessly; the next one works.
 *
 * Nothing here logs or returns a token value, only where it came from.
 */

export interface RefreshOutcome {
  ok: boolean;
  /** Which token the successful exchange used. */
  source?: "settings" | "env";
  expiresAt?: string | null;
  expiresInDays?: number;
  /** Every exchange that was tried and refused, in order. */
  tried: { source: "settings" | "env"; error: string }[];
  error?: string;
}

export async function refreshToken(
  store: SocialStore,
  fetcher: Fetcher,
  envToken: string | undefined,
  now: Date,
): Promise<RefreshOutcome> {
  const stored = readStored(await store.getSetting("ig_access_token"));
  const env = envToken?.trim() || undefined;

  const candidates: { source: "settings" | "env"; token: string }[] = [];
  if (stored) candidates.push({ source: "settings", token: stored.access_token });
  if (env && env !== stored?.access_token) candidates.push({ source: "env", token: env });

  if (candidates.length === 0) {
    return {
      ok: false, tried: [],
      error: "No Instagram access token: social_settings.ig_access_token is empty and INSTAGRAM_ACCESS_TOKEN is not set — nothing can be refreshed.",
    };
  }

  const tried: RefreshOutcome["tried"] = [];
  for (const c of candidates) {
    const r = await refreshInstagramToken(c.token, fetcher, now);
    if (r.ok) {
      await store.setSetting("ig_access_token", r.stored);
      await store.logEvent({
        post_id: null, level: "info", event: "token_refreshed",
        detail: { source: c.source, expires_at: r.stored.expires_at, after_failures: tried },
      });
      return { ok: true, source: c.source, expiresAt: r.stored.expires_at, expiresInDays: Math.round(r.expiresIn / 86_400), tried };
    }
    tried.push({ source: c.source, error: r.error });
  }

  await store.logEvent({ post_id: null, level: "error", event: "token_refresh_failed", detail: { tried } });
  return {
    ok: false, tried,
    error: tried.map(t => `${t.source}: ${t.error}`).join("; "),
  };
}
