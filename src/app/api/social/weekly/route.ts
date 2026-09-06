import { NextResponse } from "next/server";
import { authorizeCron } from "@/lib/cron-auth";
import { INSTAGRAM_USER_ID } from "@/lib/reel-calendar";
import { CONTACT_EMAIL } from "@/lib/site";
import { storeFromEnv, type SocialStore } from "@/lib/social/db";
import { pickToken } from "@/lib/social/token";
import { buildWeeklySummary, renderWeeklyEmail } from "@/lib/social/weekly";
import { graphFetcher, resendSender, type Mail } from "@/lib/social/live";
import type { Fetcher } from "@/lib/instagram";

/**
 * The Monday summary, emailed.
 *
 * 07:00 on Mondays: what went out last week, how each post did, how many
 * followers there are now, what is queued for the next fortnight and what is
 * stuck. Built by lib/social/weekly.ts; this route fetches, renders and sends.
 *
 * Without RESEND_API_KEY it returns 500 rather than a success that sent
 * nothing — the same rule as every other cron here.
 */
export const maxDuration = 120;

export async function GET(req: Request) {
  if (!authorizeCron(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const s = storeFromEnv();
  if ("error" in s) {
    return NextResponse.json({ sent: false, error: s.error }, { status: 500 });
  }
  const key = process.env.RESEND_API_KEY;
  return weeklyWith(s.store, {
    fetcher: graphFetcher,
    now: new Date(),
    send: key ? (to: string) => resendSender({ apiKey: key, to }) : null,
  });
}

export async function weeklyWith(
  store: SocialStore,
  adapters: {
    fetcher: Fetcher;
    now: Date;
    /** Null when email is not configured. */
    send: ((to: string) => (mail: Mail) => Promise<{ ok: boolean; error?: string }>) | null;
  },
) {
  const picked = pickToken(await store.getSetting("ig_access_token"), process.env.INSTAGRAM_ACCESS_TOKEN, adapters.now);
  // No token means no insights, not no summary: the queue is still worth
  // reporting. The summary says the API was unavailable for every figure.
  const token = "error" in picked ? "" : picked.token;

  const summary = await buildWeeklySummary({
    db: store,
    fetcher: adapters.fetcher,
    token,
    igUserId: process.env.INSTAGRAM_USER_ID ?? INSTAGRAM_USER_ID,
    now: adapters.now,
  });
  const mail = renderWeeklyEmail(summary);

  const alertTo = await store.getSetting("alert_email");
  const to = typeof alertTo === "string" && alertTo.includes("@") ? alertTo : CONTACT_EMAIL;

  const facts = {
    published: summary.posts.length,
    followers: summary.followersCount,
    holds: summary.health.holds.length,
    gapsNext14: summary.health.gapsNext14.length,
    tokenAvailable: token !== "",
  };

  if (!adapters.send) {
    return NextResponse.json(
      { sent: false, error: "RESEND_API_KEY not configured — the weekly summary was NOT sent", ...facts },
      { status: 500 },
    );
  }

  const r = await adapters.send(to)(mail);
  await store.logEvent({
    post_id: null, level: r.ok ? "info" : "warn", event: r.ok ? "weekly_sent" : "weekly_not_sent",
    detail: { to, subject: mail.subject, ...(r.error ? { error: r.error } : {}) },
  });

  return NextResponse.json({ sent: r.ok, to, subject: mail.subject, ...facts, ...(r.error ? { error: r.error } : {}) }, { status: r.ok ? 200 : 500 });
}
