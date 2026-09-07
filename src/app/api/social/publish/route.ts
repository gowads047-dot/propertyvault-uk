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
 * Scheduled for 18:00 UTC. On the Hobby plan that means some time between
 * 18:00 and 19:00, and a second invocation is not ruled out, so there is no
 * separate retry slot: the one run makes its own single retry, after a
 * wait, when the failure was the passing kind. Everything that decides what
 * to do is in lib/social/publisher.ts and is tested there; this file is
 * authorisation, configuration and a call.
 *
 * The replaced route posted nothing for a week because its token was never
 * set and nothing outside Vercel's function log said so. This one returns
 * 500 whenever it could not do its job — no store, no token, an empty
 * queue, a hold, or a hold it could not send an alert about — so the
 * failure is a red cron in the dashboard rather than a quiet evening. The
 * no-token case also emails, because email does not need the token.
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
    clock?: PublishDeps["clock"];
  },
) {
  // ── Paused, before anything else ─────────────────────────────────────────
  //
  // publisher.ts states the contract as rule 1: "Paused means paused. Nothing
  // is read, nothing is posted." It enforces that inside publishQueued — but
  // the token check below runs before publishQueued is ever called, so a
  // paused pipeline still read two settings, emailed the operator and
  // returned 500.
  //
  // That matters most in exactly the state this launched in: no token
  // configured, so the run stops at the token every night and emails about
  // it. Pausing is the one lever for that noise, and it did not reach.
  //
  // Checked here rather than moved, because publishQueued is called from the
  // tests and the backfill too and must keep its own guard.
  if ((await store.getSetting("paused")) === true) {
    await store.logEvent({
      post_id: null, level: "info", event: "skipped_paused",
      detail: { reason: "checked before the token, so a paused run stays silent" },
    });
    return NextResponse.json(
      { posted: false, outcome: "paused", reason: "social_settings.paused is true" },
      { status: 200 },
    );
  }

  const alertTo = await store.getSetting("alert_email");
  const to = typeof alertTo === "string" && alertTo.includes("@") ? alertTo : CONTACT_EMAIL;
  const envToken = process.env.INSTAGRAM_ACCESS_TOKEN?.trim() || undefined;

  const picked = pickToken(await store.getSetting("ig_access_token"), envToken, adapters.now);
  if ("error" in picked) {
    const sender = adapters.sendAlert(to);
    const alert = sender
      ? await sender({
        subject: "Instagram: no access token — nothing can be posted",
        text: [
          picked.error,
          "",
          "Generate a long-lived token in the Meta dashboard and set INSTAGRAM_ACCESS_TOKEN in Vercel.",
          "The Monday run will exchange it and store the result.",
        ].join("\n"),
      })
      : { ok: false, error: "RESEND_API_KEY not configured" };
    await store.logEvent({
      post_id: null, level: "error", event: alert.ok ? "alert_sent" : "alert_not_sent",
      detail: { reason: "no token", ...(alert.error ? { error: alert.error } : {}) },
    });
    return NextResponse.json(
      { posted: false, error: `${picked.error} Nothing was posted.`, alert: { needed: true, sent: alert.ok, ...(alert.error ? { error: alert.error } : {}) } },
      { status: 500 },
    );
  }

  const summary = await publishQueued({
    db: store,
    fetcher: adapters.fetcher,
    assetFetcher: adapters.assetFetcher,
    now: adapters.now,
    token: picked.token,
    tokenSource: picked.source,
    // Only worth carrying when the run starts on the stored token: a 190
    // from that one falls back to this one for the evening.
    fallbackToken: picked.source === "settings" ? envToken : undefined,
    igUserId: process.env.INSTAGRAM_USER_ID ?? INSTAGRAM_USER_ID,
    sendAlert: adapters.sendAlert(to),
    sleep: adapters.sleep,
    clock: adapters.clock,
  });

  // Anything a person has to act on is a 500: a hold, an unalerted hold, an
  // empty day. "failed" is a row that has used every attempt and sits there.
  const unalerted = summary.alert.needed && !summary.alert.sent;
  const bad = unalerted || summary.outcome === "failed" || summary.outcome === "held" || summary.outcome === "nothing-queued";

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
