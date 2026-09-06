import { publishReel, type Fetcher } from "../instagram";
import type { SocialPost, SocialStore } from "./db";
import { londonDate } from "./dates";
import { qualityCheck, type AssetFetcher, type QcResult } from "./qc";

/**
 * One evening's publishing, as a sequence of decisions.
 *
 * The first cron decided everything from the date and kept no state, so it
 * could neither retry nor explain itself. This one reads a queue, writes back
 * what happened to every row it touches, and logs each decision as an event.
 * Run it twice on the same evening and the second run finds the day already
 * published and stops — which is what lets the 18:40 retry slot exist.
 *
 * The rules, in the order they apply:
 *
 *   1. Paused means paused. Nothing is read, nothing is posted.
 *   2. A day that was missed is skipped, not shifted. A dated campaign that
 *      slid a day every time something failed would drift away from its own
 *      calendar; the row is marked skipped with a warning and the person
 *      decides whether to re-queue it.
 *   3. Today's row is checked before it is sent. A check failure holds the row
 *      for a person and sends a fallback from the evergreen pool instead, so a
 *      broken render costs a repeat rather than a blank day.
 *   4. A failed publish is retried up to three times across runs, then held.
 *   5. Any hold sends an alert. If the alert cannot be sent, the run says so
 *      in its result and the route returns 500 — a hold nobody hears about is
 *      the same as no hold.
 *
 * Every external thing is injected: the store, both fetchers, the clock, the
 * alert sender. The tests run the whole sequence against the in-memory store.
 */

const GRAPH = "https://graph.instagram.com/v21.0";
export const MAX_ATTEMPTS = 3;
/** A row left in 'publishing' this long was abandoned by a crashed run. */
const STALE_PUBLISHING_MS = 20 * 60_000;

export interface AlertSender {
  (msg: { subject: string; text: string }): Promise<{ ok: boolean; error?: string }>;
}

export interface PublishDeps {
  db: SocialStore;
  /** Graph API calls. */
  fetcher: Fetcher;
  /** HEAD/GET against the asset URL. */
  assetFetcher: AssetFetcher;
  now: Date;
  token: string;
  igUserId: string;
  channel?: string;
  /** Null when email is not configured. A needed alert then fails loudly. */
  sendAlert: AlertSender | null;
  sleep?: (ms: number) => Promise<void>;
  maxPolls?: number;
}

export type Outcome =
  | "paused"
  | "nothing-queued"
  | "already-published"
  | "in-progress"
  | "published"
  | "failed"
  | "held";

export interface PublishSummary {
  date: string;
  outcome: Outcome;
  reason?: string;
  postId?: string;
  mediaId?: string;
  permalink?: string | null;
  /** Set when the day's own post was held and a pool row went out instead. */
  fallback?: { poolId: string; cloneId: string };
  /** Rows from earlier days marked skipped on this run. */
  skippedMissed: number;
  alert: { needed: boolean; sent: boolean; error?: string };
}

export async function publishQueued(deps: PublishDeps): Promise<PublishSummary> {
  const { db, now } = deps;
  const channel = deps.channel ?? "instagram";
  const today = londonDate(now);
  const alerts: { subject: string; text: string }[] = [];

  const finish = async (partial: Omit<PublishSummary, "date" | "skippedMissed" | "alert">, skippedMissed: number) => ({
    date: today,
    skippedMissed,
    ...partial,
    alert: await sendAlerts(deps, alerts),
  });

  // ── 1. Paused ──────────────────────────────────────────────────────────
  if ((await db.getSetting("paused")) === true) {
    await db.logEvent({ post_id: null, level: "info", event: "skipped_paused", detail: { date: today } });
    return finish({ outcome: "paused", reason: "social_settings.paused is true" }, 0);
  }

  // ── 2. Missed days ─────────────────────────────────────────────────────
  const missed = await db.findPosts({ channel, status: ["queued", "publishing", "failed"], slotBefore: today });
  for (const m of missed) {
    await db.updatePost(m.id, {
      status: "skipped",
      last_error: `slot ${m.slot_date} passed without a publish (was ${m.status})`,
    });
    await db.logEvent({
      post_id: m.id, level: "warn", event: "missed_day",
      detail: { slot_date: m.slot_date, was: m.status, attempts: m.attempts },
    });
  }

  // ── 3. Today ───────────────────────────────────────────────────────────
  const todays = await db.findPosts({ channel, slotDate: today });

  const done = todays.find(p => p.status === "published");
  if (done) {
    return finish({
      outcome: "already-published", postId: done.id,
      mediaId: done.ig_media_id ?? undefined, permalink: done.permalink,
    }, missed.length);
  }

  const running = todays.find(p => p.status === "publishing");
  if (running) {
    const age = now.getTime() - Date.parse(running.updated_at);
    if (age < STALE_PUBLISHING_MS) {
      return finish({ outcome: "in-progress", postId: running.id, reason: "another run is publishing this row" }, missed.length);
    }
    // Abandoned mid-publish. Count it as a failed attempt so it cannot loop.
    const attempts = running.attempts + 1;
    await db.updatePost(running.id, {
      status: attempts >= MAX_ATTEMPTS ? "held" : "failed",
      attempts,
      last_error: "a previous run did not complete",
    });
    await db.logEvent({ post_id: running.id, level: "warn", event: "stale_publishing", detail: { attempts } });
  }

  const fresh = await db.findPosts({ channel, slotDate: today });
  let candidate = fresh.find(p => p.status === "queued" || (p.status === "failed" && p.attempts < MAX_ATTEMPTS));

  if (!candidate) {
    if (fresh.length === 0) {
      await db.logEvent({ post_id: null, level: "info", event: "nothing_queued", detail: { date: today } });
      return finish({ outcome: "nothing-queued", reason: `no row in social_posts for ${today}` }, missed.length);
    }
    const held = fresh.find(p => p.status === "held");
    return finish({
      outcome: held ? "held" : "failed",
      postId: (held ?? fresh[0]).id,
      reason: held ? "today's row is held for a person" : "today's row has used all its attempts",
    }, missed.length);
  }

  // ── 4. Check it ────────────────────────────────────────────────────────
  const qc = await runQc(deps, candidate);
  if (!qc.ok) {
    await hold(deps, candidate, qc, alerts);

    // ── 5. Fall back to the pool ────────────────────────────────────────
    const [pool] = await db.findPosts({ channel, evergreen: true, orderBy: "last_used_at", limit: 1 });
    if (!pool) {
      await db.logEvent({ post_id: candidate.id, level: "warn", event: "no_evergreen", detail: { date: today } });
      return finish({ outcome: "held", postId: candidate.id, reason: "quality check failed and the evergreen pool is empty" }, missed.length);
    }

    const clone = await db.insertPost({
      channel,
      slot_date: today,
      format: pool.format,
      asset_url: pool.asset_url,
      // No digest of its own: the uniqueness indexes would otherwise refuse
      // it, and a repeat is the point. The pool row's digest is kept beside
      // the reference so the repeat is still traceable.
      asset_sha256: null,
      caption: pool.caption,
      evergreen: false,
      source_refs: { ...(pool.source_refs ?? {}), evergreen_of: pool.id, asset_sha256: pool.asset_sha256, stood_in_for: candidate.id },
    });
    await db.updatePost(pool.id, { last_used_at: now.toISOString() });
    await db.logEvent({
      post_id: clone.id, level: "info", event: "evergreen_fallback",
      detail: { pool_id: pool.id, stood_in_for: candidate.id },
    });

    const cloneQc = await runQc(deps, clone);
    if (!cloneQc.ok) {
      await hold(deps, clone, cloneQc, alerts);
      return finish({
        outcome: "held", postId: clone.id, fallback: { poolId: pool.id, cloneId: clone.id },
        reason: "both today's post and the evergreen fallback failed their checks",
      }, missed.length);
    }

    const r = await send(deps, clone, cloneQc, alerts);
    return finish({ ...r, fallback: { poolId: pool.id, cloneId: clone.id } }, missed.length);
  }

  // ── 6. Send it ─────────────────────────────────────────────────────────
  candidate = { ...candidate };
  return finish(await send(deps, candidate, qc, alerts), missed.length);
}

async function runQc(deps: PublishDeps, post: SocialPost): Promise<QcResult> {
  return qualityCheck(post, deps.assetFetcher, {
    alreadyPublished: (ch, sha) => deps.db.publishedShaExists(ch, sha),
  });
}

async function hold(deps: PublishDeps, post: SocialPost, qc: QcResult, alerts: { subject: string; text: string }[]) {
  const failed = qc.checks.filter(c => !c.ok);
  const summary = failed.map(c => `${c.name}: ${c.detail}`).join("; ");
  await deps.db.updatePost(post.id, {
    status: "held",
    attempts: post.attempts + 1,
    last_error: `quality check failed — ${summary}`,
    qc,
  });
  await deps.db.logEvent({ post_id: post.id, level: "error", event: "qc_failed", detail: { failed } });
  alerts.push({
    subject: `Held: ${post.slot_date ?? "pool"} ${post.format ?? ""} failed its checks`.trim(),
    text: [
      `The post for ${post.slot_date} was held before publishing.`,
      "",
      ...failed.map(c => `  ${c.name}: ${c.detail}`),
      "",
      `Asset: ${post.asset_url}`,
      `Row: ${post.id}`,
      "",
      "Fix the row and set its status back to 'queued', or leave it held.",
    ].join("\n"),
  });
}

async function send(
  deps: PublishDeps,
  post: SocialPost,
  qc: QcResult,
  alerts: { subject: string; text: string }[],
): Promise<Omit<PublishSummary, "date" | "skippedMissed" | "alert">> {
  const { db, now } = deps;
  await db.updatePost(post.id, { status: "publishing", qc });

  const result = await publishReel(
    { igUserId: deps.igUserId, accessToken: deps.token, videoUrl: post.asset_url, caption: post.caption },
    deps.fetcher,
    { sleep: deps.sleep, maxPolls: deps.maxPolls },
  );

  const attempts = post.attempts + 1;

  if (!result.ok) {
    const exhausted = attempts >= MAX_ATTEMPTS;
    await db.updatePost(post.id, {
      status: exhausted ? "held" : "failed",
      attempts,
      last_error: result.error ?? "publish failed",
      ig_container_id: result.containerId ?? post.ig_container_id,
    });
    await db.logEvent({
      post_id: post.id, level: "error", event: "publish_failed",
      detail: { attempts, error: result.error, container_id: result.containerId, polls: result.polls },
    });
    if (exhausted) {
      alerts.push({
        subject: `Held: ${post.slot_date} failed to publish ${attempts} times`,
        text: [
          `The post for ${post.slot_date} failed on every attempt and is now held.`,
          "",
          `Last error: ${result.error}`,
          `Container: ${result.containerId ?? "none"}`,
          `Row: ${post.id}`,
        ].join("\n"),
      });
    }
    return {
      outcome: exhausted ? "held" : "failed",
      postId: post.id,
      reason: result.error,
    };
  }

  const permalink = await lookupPermalink(deps, result.mediaId!);
  await db.updatePost(post.id, {
    status: "published",
    attempts,
    ig_media_id: result.mediaId ?? null,
    ig_container_id: result.containerId ?? null,
    permalink,
    published_at: now.toISOString(),
    last_error: null,
  });
  await db.logEvent({
    post_id: post.id, level: "info", event: "published",
    detail: { media_id: result.mediaId, permalink, polls: result.polls, attempts },
  });

  return { outcome: "published", postId: post.id, mediaId: result.mediaId, permalink };
}

/** Best effort. A post without a permalink is still a post. */
async function lookupPermalink(deps: PublishDeps, mediaId: string): Promise<string | null> {
  try {
    const res = await deps.fetcher(
      `${GRAPH}/${mediaId}?fields=permalink,media_type&access_token=${encodeURIComponent(deps.token)}`,
    );
    const body = (await res.json().catch(() => null)) as { permalink?: string } | null;
    if (res.ok && typeof body?.permalink === "string") return body.permalink;
    await deps.db.logEvent({ post_id: null, level: "warn", event: "permalink_unavailable", detail: { media_id: mediaId, status: res.status } });
  } catch (e) {
    await deps.db.logEvent({ post_id: null, level: "warn", event: "permalink_unavailable", detail: { media_id: mediaId, error: String(e) } });
  }
  return null;
}

async function sendAlerts(
  deps: PublishDeps,
  alerts: { subject: string; text: string }[],
): Promise<PublishSummary["alert"]> {
  if (alerts.length === 0) return { needed: false, sent: false };

  if (!deps.sendAlert) {
    await deps.db.logEvent({
      post_id: null, level: "warn", event: "alert_not_sent",
      detail: { reason: "RESEND_API_KEY not configured", subjects: alerts.map(a => a.subject) },
    });
    return { needed: true, sent: false, error: "RESEND_API_KEY not configured — a hold happened and nobody was told" };
  }

  const subject = alerts.length === 1 ? alerts[0].subject : `${alerts.length} social posts need attention`;
  const text = alerts.map(a => `${a.subject}\n${"-".repeat(a.subject.length)}\n${a.text}`).join("\n\n");
  const r = await deps.sendAlert({ subject, text });
  if (!r.ok) {
    await deps.db.logEvent({ post_id: null, level: "warn", event: "alert_not_sent", detail: { reason: r.error, subjects: alerts.map(a => a.subject) } });
    return { needed: true, sent: false, error: r.error ?? "alert send failed" };
  }
  await deps.db.logEvent({ post_id: null, level: "info", event: "alert_sent", detail: { subject } });
  return { needed: true, sent: true };
}
