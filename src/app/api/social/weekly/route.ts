import { NextResponse } from "next/server";
import { authorizeCron } from "@/lib/cron-auth";
import { INSTAGRAM_USER_ID } from "@/lib/reel-calendar";
import { CONTACT_EMAIL } from "@/lib/site";
import { storeFromEnv, type SocialStore } from "@/lib/social/db";
import { refreshToken } from "@/lib/social/refresh";
import { pickToken } from "@/lib/social/token";
import { buildWeeklySummary, renderWeeklyEmail } from "@/lib/social/weekly";
import { graphFetcher, resendSender, type Mail } from "@/lib/social/live";
import type { Fetcher } from "@/lib/instagram";

/**
 * Monday morning: refresh the token, then send the summary.
 *
 * One cron, two jobs, in that order. The refresh comes first so the summary
 * is built with the token that will be used all week, and so a refresh that
 * fails is in the summary a person reads that morning rather than only in a
 * dashboard. The two were separate crons; on the Hobby plan each is placed
 * anywhere in its hour, so "06:00 refresh, 07:00 summary" was not an order
 * that could be relied on, and folding them is what makes it one.
 *
 * A failed refresh is a 500 with its own alert email, but the summary still
 * goes out — the queue is worth reporting whatever the token's state. Without
 * RESEND_API_KEY it returns 500 rather than a success that sent nothing.
 *
 * The response never contains a token.
 */
export const maxDuration = 120;

export async function GET(req: Request) {
  if (!authorizeCron(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const s = storeFromEnv();
  if ("error" in s) {
    return NextResponse.json({ sent: false, refreshed: false, error: s.error }, { status: 500 });
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
  const envToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const alertTo = await store.getSetting("alert_email");
  const to = typeof alertTo === "string" && alertTo.includes("@") ? alertTo : CONTACT_EMAIL;

  // ── 1. The token ───────────────────────────────────────────────────────
  const refresh = await refreshToken(store, adapters.fetcher, envToken, adapters.now);
  let refreshAlert: { ok: boolean; error?: string } | null = null;
  if (!refresh.ok && adapters.send) {
    refreshAlert = await adapters.send(to)({
      subject: "Instagram token refresh failed",
      text: [
        "The Monday exchange of the Instagram access token did not succeed.",
        "",
        ...refresh.tried.map(t => `  ${t.source}: ${t.error}`),
        ...(refresh.tried.length ? [] : [`  ${refresh.error}`]),
        "",
        "If the token is under 24 hours old this is expected and next Monday will work.",
        "Otherwise generate a new long-lived token in the Meta dashboard, set INSTAGRAM_ACCESS_TOKEN in Vercel,",
        "and if the stored token is the broken one, reset it:",
        "  update social_settings set value = 'null' where key = 'ig_access_token';",
      ].join("\n"),
    });
  }

  // ── 2. The summary ─────────────────────────────────────────────────────
  // Re-read after the refresh: the stored token may have just changed.
  const picked = pickToken(await store.getSetting("ig_access_token"), envToken, adapters.now);
  // No token means no insights, not no summary: the queue is still worth
  // reporting. The summary says the API was not asked.
  const token = "error" in picked ? "" : picked.token;

  const summary = await buildWeeklySummary({
    db: store,
    fetcher: adapters.fetcher,
    token,
    igUserId: process.env.INSTAGRAM_USER_ID ?? INSTAGRAM_USER_ID,
    now: adapters.now,
    tokenLine: { refreshed: refresh.ok, source: refresh.source, expiresAt: refresh.expiresAt, error: refresh.error },
  });
  const mail = renderWeeklyEmail(summary);

  const facts = {
    refreshed: refresh.ok,
    ...(refresh.source ? { refreshSource: refresh.source } : {}),
    ...(refresh.expiresAt ? { expiresAt: refresh.expiresAt } : {}),
    ...(refresh.expiresInDays !== undefined ? { expiresInDays: refresh.expiresInDays } : {}),
    ...(refresh.error ? { refreshError: refresh.error } : {}),
    ...(refreshAlert ? { refreshAlertSent: refreshAlert.ok } : {}),
    published: summary.posts.length,
    followers: summary.followersCount,
    holds: summary.health.holds.length,
    gapsNext14: summary.health.gapsNext14.length,
    daysCovered: summary.health.daysCovered,
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

  const ok = r.ok && refresh.ok;
  return NextResponse.json(
    { sent: r.ok, to, subject: mail.subject, ...facts, ...(r.error ? { error: r.error } : {}) },
    { status: ok ? 200 : 500 },
  );
}
