import type { Fetcher } from "../instagram";

/**
 * The Instagram access token, and keeping it alive.
 *
 * A long-lived token from "Instagram API with Instagram Login" lasts sixty
 * days. It can be exchanged for a fresh one at any point after it is a day
 * old, and cannot be exchanged once it has expired — so a token that nobody
 * refreshes turns into a cron that fails every evening from day sixty-one,
 * and the only fix is a person generating a new one in the Meta dashboard.
 *
 * The weekly refresh cron writes the exchanged token into social_settings.
 * The environment variable is the bootstrap: it gets the first refresh done,
 * and after that the stored one is preferred, because the stored one is the
 * newer of the two.
 */

const REFRESH = "https://graph.instagram.com/refresh_access_token";

/** What social_settings.ig_access_token holds once a refresh has run. */
export interface StoredToken {
  access_token: string;
  /** ISO instant the token stops working. */
  expires_at: string | null;
  refreshed_at: string | null;
}

export type PickedToken =
  | { token: string; source: "settings" | "env"; expiresAt: string | null; warning?: string }
  | { error: string };

/**
 * Which token to publish with.
 *
 * The stored one when it exists and has not expired; otherwise the
 * environment's; otherwise a loud error, because posting is impossible and the
 * caller must say so rather than skip the day quietly.
 */
export function pickToken(stored: unknown, envToken: string | undefined, now = new Date()): PickedToken {
  const env = envToken?.trim() || undefined;
  const s = readStored(stored);

  if (s) {
    const expired = s.expires_at !== null && Date.parse(s.expires_at) <= now.getTime();
    if (!expired) return { token: s.access_token, source: "settings", expiresAt: s.expires_at };
    if (env) {
      return {
        token: env, source: "env", expiresAt: null,
        warning: `the stored token expired at ${s.expires_at}; using INSTAGRAM_ACCESS_TOKEN instead`,
      };
    }
    return {
      token: s.access_token, source: "settings", expiresAt: s.expires_at,
      warning: `the stored token expired at ${s.expires_at} and INSTAGRAM_ACCESS_TOKEN is not set`,
    };
  }

  if (env) return { token: env, source: "env", expiresAt: null };
  return {
    error: "No Instagram access token: social_settings.ig_access_token is empty and INSTAGRAM_ACCESS_TOKEN is not set — nothing can be posted.",
  };
}

/** Accepts the stored object, or a bare string somebody pasted into the row. */
function readStored(v: unknown): StoredToken | null {
  if (typeof v === "string") return v.trim() ? { access_token: v.trim(), expires_at: null, refreshed_at: null } : null;
  if (!v || typeof v !== "object") return null;
  const o = v as Partial<StoredToken>;
  if (typeof o.access_token !== "string" || !o.access_token.trim()) return null;
  return {
    access_token: o.access_token.trim(),
    expires_at: typeof o.expires_at === "string" ? o.expires_at : null,
    refreshed_at: typeof o.refreshed_at === "string" ? o.refreshed_at : null,
  };
}

export type RefreshResult =
  | { ok: true; stored: StoredToken; expiresIn: number }
  | { ok: false; error: string };

/** Exchange a token for a fresh sixty-day one. */
export async function refreshInstagramToken(
  token: string,
  fetcher: Fetcher,
  now = new Date(),
): Promise<RefreshResult> {
  const url = `${REFRESH}?grant_type=ig_refresh_token&access_token=${encodeURIComponent(token)}`;
  const res = await fetcher(url);
  const body = (await res.json().catch(() => null)) as
    | { access_token?: string; token_type?: string; expires_in?: number; error?: { message?: string; code?: number } }
    | null;

  if (!res.ok) {
    const e = body?.error;
    return { ok: false, error: `refresh failed (HTTP ${res.status})${e?.message ? `: ${e.message}` : ""}${e?.code ? ` (code ${e.code})` : ""}` };
  }
  if (!body?.access_token || typeof body.expires_in !== "number") {
    return { ok: false, error: "refresh returned no access_token or expires_in" };
  }

  return {
    ok: true,
    expiresIn: body.expires_in,
    stored: {
      access_token: body.access_token,
      expires_at: new Date(now.getTime() + body.expires_in * 1000).toISOString(),
      refreshed_at: now.toISOString(),
    },
  };
}
