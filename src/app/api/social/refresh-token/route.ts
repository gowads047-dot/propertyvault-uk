import { NextResponse } from "next/server";
import { authorizeCron } from "@/lib/cron-auth";
import { storeFromEnv, type SocialStore } from "@/lib/social/db";
import { pickToken, refreshInstagramToken } from "@/lib/social/token";
import { graphFetcher } from "@/lib/social/live";
import type { Fetcher } from "@/lib/instagram";

/**
 * Keeping the Instagram token alive.
 *
 * Mondays at 06:00. Exchanges whichever token the publisher would use for a
 * fresh sixty-day one and stores it in social_settings.ig_access_token, with
 * its expiry. From then on the stored token is the one used; the environment
 * variable is only the bootstrap.
 *
 * A refresh that fails is a 500 with Meta's message, because an expired
 * token cannot be refreshed at all and the only remedy is a person making a
 * new one in the Meta dashboard — the earlier that is known, the better.
 *
 * The response never contains the token.
 */
export const maxDuration = 60;

export async function GET(req: Request) {
  if (!authorizeCron(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const s = storeFromEnv();
  if ("error" in s) {
    return NextResponse.json({ refreshed: false, error: s.error }, { status: 500 });
  }
  return refreshWith(s.store, graphFetcher, new Date());
}

export async function refreshWith(store: SocialStore, fetcher: Fetcher, now: Date) {
  const picked = pickToken(await store.getSetting("ig_access_token"), process.env.INSTAGRAM_ACCESS_TOKEN, now);
  if ("error" in picked) {
    return NextResponse.json({ refreshed: false, error: picked.error }, { status: 500 });
  }

  const r = await refreshInstagramToken(picked.token, fetcher, now);
  if (!r.ok) {
    await store.logEvent({ post_id: null, level: "error", event: "token_refresh_failed", detail: { error: r.error, source: picked.source } });
    return NextResponse.json({ refreshed: false, source: picked.source, error: r.error }, { status: 500 });
  }

  await store.setSetting("ig_access_token", r.stored);
  await store.logEvent({
    post_id: null, level: "info", event: "token_refreshed",
    detail: { source: picked.source, expires_at: r.stored.expires_at },
  });

  return NextResponse.json({
    refreshed: true,
    source: picked.source,
    expiresAt: r.stored.expires_at,
    expiresInDays: Math.round(r.expiresIn / 86_400),
  });
}
