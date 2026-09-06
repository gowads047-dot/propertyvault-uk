import { NextResponse } from "next/server";
import { authorizeCron } from "@/lib/cron-auth";
import { INSTAGRAM_USER_ID } from "@/lib/reel-calendar";
import { CONTACT_EMAIL } from "@/lib/site";
import { storeFromEnv, type SocialStore } from "@/lib/social/db";
import { publishQueued, type AlertSender, type PublishDeps } from "@/lib/social/publisher";
import { pickToken } from "@/lib/social/token";
import { alertSenderFromEnv, assetFetcher, graphFetcher } from "@/lib/social/live";

/**
 * The evening publish.
 *
 * Runs at 18:00 UTC and again at 18:40. The second run exists so a transient
 * failure — Meta slow to process the container, a blip at the CDN — gets one
 * more go the same evening; it finds the day already published and stops
 * when the first run succeeded. Everything that decides what to do is in
 * lib/social/publisher.ts and is tested there; this file is authorisation,
 * configuration and a call.
 *
 * The replaced route posted nothing for a week because its token was never
 * set and nothing outside Vercel's function log said so. This one returns
 * 500 whenever it could not do its job — no store, no token, a failed
 * publish, a hold, or a hold it could not send an alert about — so the
 * failure is a red cron in the dashboard rather than a quiet evening.
 */
export const maxDuration = 300;

export async function GET(req: Request) {
  if (!authorizeCron(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const s = storeFromEnv();
  if ("error" in s) {
    return NextResponse.json({ posted: false, error: `${s.error} Nothing was posted.` }, { status: 500 });
  }

  return publishWith(s.store, {
    fetcher: graphFetcher,
    assetFetcher,
    now: new Date(),
    sendAlert: alertSenderFromEnv,
  });
}

/** The route minus its environment, so it can be run against the fake store. */
export async function publishWith(
  store: SocialStore,
  adapters: {
    fetcher: PublishDeps["fetcher"];
    assetFetcher: PublishDeps["assetFetcher"];
    now: Date;
    sendAlert: (to: string) => AlertSender | null;
    sleep?: PublishDeps["sleep"];
  },
) {
  const picked = pickToken(await store.getSetting("ig_access_token"), process.env.INSTAGRAM_ACCESS_TOKEN, adapters.now);
  if ("error" in picked) {
    return NextResponse.json({ posted: false, error: `${picked.error} Nothing was posted.` }, { status: 500 });
  }

  const alertTo = await store.getSetting("alert_email");
  const to = typeof alertTo === "string" && alertTo.includes("@") ? alertTo : CONTACT_EMAIL;

  const summary = await publishQueued({
    db: store,
    fetcher: adapters.fetcher,
    assetFetcher: adapters.assetFetcher,
    now: adapters.now,
    token: picked.token,
    igUserId: process.env.INSTAGRAM_USER_ID ?? INSTAGRAM_USER_ID,
    sendAlert: adapters.sendAlert(to),
    sleep: adapters.sleep,
  });

  // A hold nobody was told about, a failed publish, or a held day are all
  // things a person has to act on. 500 is how they find out.
  const unalerted = summary.alert.needed && !summary.alert.sent;
  const bad = unalerted || summary.outcome === "failed" || summary.outcome === "held";

  return NextResponse.json(
    {
      posted: summary.outcome === "published",
      ...summary,
      tokenSource: picked.source,
      ...(picked.warning ? { tokenWarning: picked.warning } : {}),
    },
    { status: bad ? 500 : 200 },
  );
}
