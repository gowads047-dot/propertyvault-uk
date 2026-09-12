import {
  BAD_TOKEN_CODE,
  containerStatus,
  isTransientFailure,
  publishFinished,
  publishReel,
  recentMedia,
  type Fetcher,
  type PublishResult,
} from "../instagram";
import type { SocialPost, SocialStore } from "./db";
import { londonDate } from "./dates";
import { qualityCheck, type AssetFetcher, type QcResult } from "./qc";

/**
 * One evening's publishing, as a sequence of decisions.
 *
 * The first cron decided everything from the date and kept no state, so it
 * could neither retry nor explain itself. This one reads a queue, writes back
 * what happened to every row it touches, and logs each decision as an event.
 *
 * It is written to be run more than once in the same evening, in any order,
 * by runs that may overlap. On the Hobby plan a cron scheduled for 18:00
 * fires anywhere between 18:00 and 19:00, so nothing here assumes it is the
 * only run. The row is claimed with one conditional UPDATE before anything
 * else is done to it; a run that loses the claim stops.
 *
 * The rules, in the order they apply:
 *
 *   1. Paused means paused. Nothing is read, nothing is posted.
 *   2. A day that was missed is skipped, not shifted, and a person is told.
 *      A dated campaign that slid a day every time something failed would
 *      drift away from its own calendar. A row a crashed run left in
 *      'publishing' is checked with Meta first — its Reel may be live.
 *   3. A row left in 'publishing' today is either still in hand (under
 *      eight minutes old: stand back) or abandoned. An abandoned row's
 *      container is asked what became of it: PUBLISHED is recorded as such,
 *      FINISHED is published, anything else gets a new container.
 *   4. Today's row is claimed, then checked. A check failure holds the row
 *      for a person and sends a fallback from the evergreen pool instead, so
 *      a broken render costs a repeat rather than a blank day.
 *   5. A publish that fails for a passing reason — the network, a 5xx, one
 *      of Meta's rate-limit codes — is tried once more from this same run,
 *      with a fresh container after a wait. Anything else, or a second
 *      failure, holds the row and alerts. Nothing is left to be quietly
 *      skipped tomorrow.
 *   6. Every hold, every missed day, and an empty queue send an alert. If the
 *      alert cannot be sent, the run says so and the route returns 500 — a
 *      hold nobody hears about is the same as no hold.
 *
 * Every external thing is injected: the store, both fetchers, the clock, the
 * alert sender. The tests run the whole sequence against the in-memory store.
 */

const GRAPH = "https://graph.instagram.com/v21.0";

/** Container attempts, across runs, before a row is held for a person. */
export const MAX_ATTEMPTS = 3;
/**
 * A row left in 'publishing' this long was abandoned by a crashed run. The
 * longest honest publish is the poll loop, 20 × 5 s, plus the retry wait; a
 * run still going after eight minutes has hit maxDuration.
 */
export const STALE_PUBLISHING_MS = 8 * 60_000;
/** Before the in-function retry. Long enough for a rate-limit window to pass. */
export const RETRY_WAIT_MS = 45_000;
/**
 * No retry is started after this much of the run has gone: the retry needs
 * the wait plus up to ~100 s of polling, and the route has 300 s in all.
 */
export const RETRY_DEADLINE_MS = 120_000;
/** A pool asset published this recently is not offered as a stand-in. */
export const EVERGREEN_REPEAT_DAYS = 14;

export interface AlertSender {
  (msg: { subject: string; text: string }): Promise<{ ok: boolean; error?: string }>;
}

interface Alert {
  subject: string;
  text: string;
  /** Runs only once the alert has actually gone. */
  onSent?: () => Promise<void>;
}

export interface PublishDeps {
  db: SocialStore;
  /** Graph API calls. */
  fetcher: Fetcher;
  /** HEAD/GET against the asset URL. */
  assetFetcher: AssetFetcher;
  now: Date;
  token: string;
  /** Where the token came from. Only a stored token falls back to the environment's on a 190. */
  tokenSource?: "settings" | "env";
  /** The environment token, when the run started on the stored one. */
  fallbackToken?: string;
  igUserId: string;
  channel?: string;
  /** Null when email is not configured. A needed alert then fails loudly. */
  sendAlert: AlertSender | null;
  sleep?: (ms: number) => Promise<void>;
  maxPolls?: number;
  /** Wall-clock milliseconds, for the retry deadline. Date.now unless a test says otherwise. */
  clock?: () => number;
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
  /** Container attempts on the row after this run. */
  attempts?: number;
  /** Set when the day's own post was held and a pool row went out instead. */
  fallback?: { poolId: string; cloneId: string };
  /** Rows from earlier days marked skipped on this run. */
  skippedMissed: number;
  alert: { needed: boolean; sent: boolean; error?: string };
}

type Partial_ = Omit<PublishSummary, "date" | "skippedMissed" | "alert">;

export async function publishQueued(deps: PublishDeps): Promise<PublishSummary> {
  const { db, now } = deps;
  const channel = deps.channel ?? "instagram";
  const today = londonDate(now);
  const alerts: Alert[] = [];
  const startedAt = (deps.clock ?? Date.now)();

  const finish = async (partial: Partial_, skippedMissed: number): Promise<PublishSummary> => ({
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
  const skippedMissed = await sweepMissed(deps, channel, today, alerts);

  // ── 3. Today ───────────────────────────────────────────────────────────
  const todays = await db.findPosts({ channel, slotDate: today });

  const done = todays.find(p => p.status === "published");
  if (done) {
    // Logged, where it used to return silently. Four Reels went out over
    // four nights, every one published by a process outside this codebase
    // that wrote its own event rows — and nothing in social_events could say
    // whether this cron had fired at all, because finding the day already
    // done left no trace. A run that did nothing is still a run, and "did
    // the cron fire tonight" is the first question this table exists to
    // answer.
    await db.logEvent({
      post_id: done.id, level: "info", event: "already_published",
      detail: { date: today, published_at: done.published_at, note: "found done on arrival; nothing to do" },
    });
    return finish({
      outcome: "already-published", postId: done.id,
      mediaId: done.ig_media_id ?? undefined, permalink: done.permalink, attempts: done.attempts,
    }, skippedMissed);
  }

  const running = todays.find(p => p.status === "publishing");
  if (running) {
    const age = now.getTime() - Date.parse(running.updated_at);
    if (age < STALE_PUBLISHING_MS) {
      return finish({ outcome: "in-progress", postId: running.id, reason: "another run is publishing this row" }, skippedMissed);
    }
    const recovered = await recoverStale(deps, running, alerts, startedAt);
    if (recovered) return finish(recovered, skippedMissed);
  }

  const fresh = await db.findPosts({ channel, slotDate: today });
  const candidate = fresh.find(p => p.status === "queued" || (p.status === "failed" && p.attempts < MAX_ATTEMPTS));

  if (!candidate) {
    if (fresh.length === 0) {
      await db.logEvent({ post_id: null, level: "warn", event: "nothing_queued", detail: { date: today } });
      await alertNothingQueued(deps, today, alerts);
      return finish({ outcome: "nothing-queued", reason: `no row in social_posts for ${today}` }, skippedMissed);
    }
    const held = fresh.find(p => p.status === "held");
    return finish({
      outcome: held ? "held" : "failed",
      postId: (held ?? fresh[0]).id,
      reason: held ? "today's row is held for a person" : "today's row has used all its attempts",
    }, skippedMissed);
  }

  // ── 4. Claim it, then check it ─────────────────────────────────────────
  const claimed = await db.claimPost(candidate.id, ["queued", "failed"], candidate.attempts);
  if (!claimed) {
    return finish({ outcome: "in-progress", postId: candidate.id, reason: "another run claimed this row first" }, skippedMissed);
  }

  const qc = await runQc(deps, claimed);
  if (!qc.ok) {
    await hold(deps, claimed, qc, alerts);

    // ── 5. Fall back to the pool ────────────────────────────────────────
    const pool = await pickEvergreen(deps, channel, claimed);
    if (!pool) {
      return finish({ outcome: "held", postId: claimed.id, reason: "quality check failed and no evergreen row is eligible" }, skippedMissed);
    }

    const clone = await db.insertPost({
      channel,
      slot_date: today,
      format: pool.format,
      asset_url: pool.asset_url,
      // The pool row's digest, kept: it is what lets a later duplicate check
      // see that this asset went out. is_clone is what keeps the uniqueness
      // indexes and the duplicate check itself from refusing the repeat.
      asset_sha256: pool.asset_sha256,
      is_clone: true,
      caption: pool.caption,
      evergreen: false,
      source_refs: { ...(pool.source_refs ?? {}), evergreen_of: pool.id, stood_in_for: claimed.id },
    });
    await db.updatePost(pool.id, { last_used_at: now.toISOString() });
    await db.logEvent({
      post_id: clone.id, level: "info", event: "evergreen_fallback",
      detail: { pool_id: pool.id, stood_in_for: claimed.id },
    });

    // Ours by construction, but claimed all the same so that send() only
    // ever sees a row in 'publishing'.
    const claimedClone = await db.claimPost(clone.id, ["queued"], 0);
    if (!claimedClone) {
      return finish({ outcome: "in-progress", postId: clone.id, reason: "another run claimed the fallback row" }, skippedMissed);
    }

    const cloneQc = await runQc(deps, claimedClone);
    if (!cloneQc.ok) {
      await hold(deps, claimedClone, cloneQc, alerts);
      return finish({
        outcome: "held", postId: clone.id, fallback: { poolId: pool.id, cloneId: clone.id },
        reason: "both today's post and the evergreen fallback failed their checks",
      }, skippedMissed);
    }

    await db.updatePost(claimedClone.id, { qc: cloneQc });
    const r = await send(deps, claimedClone, alerts, startedAt);
    return finish({ ...r, fallback: { poolId: pool.id, cloneId: clone.id } }, skippedMissed);
  }

  // ── 6. Send it ─────────────────────────────────────────────────────────
  await db.updatePost(claimed.id, { qc });
  return finish(await send(deps, claimed, alerts, startedAt), skippedMissed);
}

/**
 * Earlier days that never went out. Skipped, with one alert for the lot —
 * except a row a crashed run left in 'publishing', whose container may have
 * been published after all. That one is asked about before it is written
 * off; a container that merely FINISHED is still skipped, because posting
 * it now would be a day late and the calendar does not slide.
 */
async function sweepMissed(deps: PublishDeps, channel: string, today: string, alerts: Alert[]): Promise<number> {
  const { db } = deps;
  const missed = await db.findPosts({ channel, status: ["queued", "publishing", "failed"], slotBefore: today });
  const skipped: SocialPost[] = [];

  for (const m of missed) {
    let container: string | null = null;
    if (m.status === "publishing" && m.ig_container_id) {
      container = await containerStatus(m.ig_container_id, deps.token, deps.fetcher);
      if (container === "PUBLISHED") {
        await recordRecoveredPublish(deps, m);
        continue;
      }
    }
    await db.updatePost(m.id, {
      status: "skipped",
      last_error: `slot ${m.slot_date} passed without a publish (was ${m.status}${container ? `, container ${container}` : ""})`,
    });
    await db.logEvent({
      post_id: m.id, level: "warn", event: "missed_day",
      detail: { slot_date: m.slot_date, was: m.status, attempts: m.attempts, ...(container ? { container_status: container } : {}) },
    });
    skipped.push(m);
  }

  if (skipped.length) {
    alerts.push({
      subject: `Missed: ${skipped.length} day${skipped.length === 1 ? "" : "s"} passed without a publish`,
      text: [
        "These rows were dated before today and never went out. They are now 'skipped'; the calendar has not shifted.",
        "",
        ...skipped.map(m => `  ${m.slot_date}  ${m.format ?? ""}  was ${m.status}${m.last_error ? ` — ${m.last_error}` : ""}  row ${m.id}`),
        "",
        "Check the events for those dates (social_events), then re-queue anything worth posting on a NEW date as a new row.",
      ].join("\n"),
    });
  }
  return skipped.length;
}

/**
 * Today's row, left in 'publishing' by a run that died. What happens next
 * depends on what Meta says about the container it recorded:
 *
 *   PUBLISHED  the Reel is live; record it and stop
 *   FINISHED   the last step never ran; run it now
 *   otherwise  count a failed attempt and let a new container be made
 *
 * Returns a summary when the day is settled here, or null to carry on to
 * the ordinary path with the row now 'failed' (or 'held').
 */
async function recoverStale(deps: PublishDeps, running: SocialPost, alerts: Alert[], startedAt: number): Promise<Partial_ | null> {
  const { db } = deps;
  const status = running.ig_container_id ? await containerStatus(running.ig_container_id, deps.token, deps.fetcher) : null;

  if (status === "PUBLISHED") {
    const rec = await recordRecoveredPublish(deps, running);
    return {
      outcome: "already-published", postId: running.id, mediaId: rec.mediaId ?? undefined, permalink: rec.permalink,
      attempts: running.attempts, reason: "a previous run published the container but did not record it",
    };
  }

  if (status === "FINISHED") {
    const claimed = await db.claimPost(running.id, ["publishing"], running.attempts);
    if (!claimed) return { outcome: "in-progress", postId: running.id, reason: "another run took over this row" };
    await db.logEvent({ post_id: running.id, level: "warn", event: "recovered_finished", detail: { container_id: running.ig_container_id } });
    return send(deps, claimed, alerts, startedAt, running.ig_container_id!);
  }

  // A container that was recorded has already been counted as an attempt.
  // Without one, the run died before or during creation; count one so a
  // run that dies the same way every evening cannot loop forever.
  const attempts = running.ig_container_id ? running.attempts : running.attempts + 1;
  const exhausted = attempts >= MAX_ATTEMPTS;
  const error = `a previous run did not complete (container ${status ?? (running.ig_container_id ? "unknown" : "none")})`;
  await db.updatePost(running.id, { status: exhausted ? "held" : "failed", attempts, last_error: error });
  await db.logEvent({ post_id: running.id, level: "warn", event: "stale_publishing", detail: { attempts, container_status: status } });
  if (exhausted) alerts.push(heldAfterFailures(running, attempts, error, running.ig_container_id));
  return null;
}

/**
 * The container says PUBLISHED but the row does not. Find the Reel among
 * the account's newest posts: the one it made cannot be older than the last
 * time the row was touched, so the newest post with a timestamp on or after
 * that (less a margin for two clocks) is it. Without a match the row is
 * still marked published — the container is the authority — but with no
 * media id, and an event says so.
 */
async function recordRecoveredPublish(deps: PublishDeps, row: SocialPost): Promise<{ mediaId: string | null; permalink: string | null }> {
  const { db } = deps;
  const list = await recentMedia(deps.igUserId, deps.token, deps.fetcher, 5);
  const floor = Date.parse(row.updated_at) - 15 * 60_000;
  const newest = list[0];
  const ts = newest?.timestamp ? metaTime(newest.timestamp) : NaN;
  const match = newest && (Number.isNaN(ts) || ts >= floor) ? newest : null;

  await db.updatePost(row.id, {
    status: "published",
    ig_media_id: match?.id ?? null,
    permalink: match?.permalink ?? null,
    published_at: match && !Number.isNaN(ts) ? new Date(ts).toISOString() : deps.now.toISOString(),
    last_error: null,
  });
  await db.logEvent({
    post_id: row.id, level: match ? "warn" : "error", event: match ? "recovered_published" : "recovered_published_unmatched",
    detail: { container_id: row.ig_container_id, media_id: match?.id ?? null, slot_date: row.slot_date },
  });
  return { mediaId: match?.id ?? null, permalink: match?.permalink ?? null };
}

/** Meta writes offsets as +0000; Date.parse wants +00:00. */
function metaTime(s: string): number {
  return Date.parse(s.replace(/([+-]\d{2})(\d{2})$/, "$1:$2"));
}

/** Once a day, not once a run: the runs can overlap, and a day is the unit. */
async function alertNothingQueued(deps: PublishDeps, today: string, alerts: Alert[]) {
  const { db } = deps;
  const last = await db.lastEvent("nothing_queued_alerted");
  if (last?.detail?.date === today) return;
  alerts.push({
    subject: `Nothing queued for ${today}`,
    text: [
      `There is no row in social_posts for ${today}. Nothing will go out tonight, and nothing is invented.`,
      "",
      "Load the calendar:  npm run social:seed -- <YYYY-MM-DD>",
      "Check the queue:    /api/social/status",
    ].join("\n"),
    onSent: () => db.logEvent({ post_id: null, level: "info", event: "nothing_queued_alerted", detail: { date: today } }),
  });
}

async function runQc(deps: PublishDeps, post: SocialPost): Promise<QcResult> {
  return qualityCheck(post, deps.assetFetcher, {
    alreadyPublished: (ch, sha) => deps.db.publishedShaExists(ch, sha),
  });
}

/**
 * The least recently used pool row that is not the same video as the one it
 * would stand in for, and has not gone out — as itself or as a clone — in
 * the last fortnight. A stand-in that repeats the held post, or last week's
 * post, is not a fallback.
 */
async function pickEvergreen(deps: PublishDeps, channel: string, held: SocialPost): Promise<SocialPost | null> {
  const { db, now } = deps;
  const pool = await db.findPosts({ channel, evergreen: true, orderBy: "last_used_at" });
  const since = new Date(now.getTime() - EVERGREEN_REPEAT_DAYS * 86_400_000).toISOString();
  const rejected: Record<string, string> = {};

  for (const p of pool) {
    const sameAsset = p.asset_url === held.asset_url || (p.asset_sha256 !== null && p.asset_sha256 === held.asset_sha256);
    if (sameAsset) { rejected[p.id] = "same asset as the held post"; continue; }
    if (p.asset_sha256 && await db.publishedShaExists(channel, p.asset_sha256, since)) {
      rejected[p.id] = `published in the last ${EVERGREEN_REPEAT_DAYS} days`;
      continue;
    }
    return p;
  }

  await db.logEvent({
    post_id: held.id, level: "warn", event: "no_evergreen",
    detail: { date: held.slot_date, pool_size: pool.length, rejected },
  });
  return null;
}

async function hold(deps: PublishDeps, post: SocialPost, qc: QcResult, alerts: Alert[]) {
  const failed = qc.checks.filter(c => !c.ok);
  const summary = failed.map(c => `${c.name}: ${c.detail}`).join("; ");
  // Attempts are container attempts. A check failure made no container.
  await deps.db.updatePost(post.id, {
    status: "held",
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
      ...RECOVERY_LINES,
    ].join("\n"),
  });
}

/**
 * How a held row is put right. The held row is the record of what happened
 * and stays as it is; the post goes out again as a new row on a new date.
 * Setting the old row back to 'queued' would re-run it with its attempt
 * count and against a date a stand-in may already have used.
 */
const RECOVERY_LINES = [
  "To send it again, fix the cause (re-render the video, correct the caption) and queue it on a NEW date as a NEW row:",
  "  - delete this held row (its events survive the delete), then insert a copy with a fresh slot_date and status 'queued',",
  "  - or delete it and run:  npm run social:seed -- <YYYY-MM-DD>",
  "Do not set this row's status back to 'queued'.",
];

function heldAfterFailures(post: SocialPost, attempts: number, error: string, containerId: string | null | undefined): Alert {
  return {
    subject: `Held: ${post.slot_date} failed to publish (${attempts} attempt${attempts === 1 ? "" : "s"})`,
    text: [
      `The post for ${post.slot_date} could not be published and is now held.`,
      "",
      `Last error: ${error}`,
      `Container: ${containerId ?? "none"}`,
      `Row: ${post.id}`,
      "",
      ...RECOVERY_LINES,
    ].join("\n"),
  };
}

/**
 * Publish a claimed row, with the one retry this run allows itself.
 *
 * Each pass makes a container and counts an attempt — except the first pass
 * when a FINISHED container is handed in, which only runs the last step. A
 * failure is written to the row before anything else is decided, so a run
 * that dies during the wait leaves the truth behind. Then, in order:
 *
 *   - out of attempts: held;
 *   - a 190 on the stored token, with an environment token to hand: swap
 *     and go again at once (a different token is not a retry);
 *   - a transient failure, not yet retried, with time left: wait, then a
 *     fresh container;
 *   - anything else: held.
 *
 * A held row sends an alert. The 'failed' status is not a resting state
 * for today's row any more: the day ends published or held.
 */
async function send(
  deps: PublishDeps,
  post: SocialPost,
  alerts: Alert[],
  startedAt: number,
  finishedContainer?: string,
): Promise<Partial_> {
  const { db, now } = deps;
  const clock = deps.clock ?? Date.now;
  const sleep = deps.sleep ?? ((ms: number) => new Promise<void>(r => setTimeout(r, ms)));

  let token = deps.token;
  let source = deps.tokenSource ?? "env";
  let attempts = post.attempts;
  let swapped = false;
  let retried = false;
  let first = true;
  let result: PublishResult;

  for (;;) {
    if (first && finishedContainer) {
      result = await publishFinished(deps.igUserId, finishedContainer, token, deps.fetcher);
    } else {
      attempts += 1;
      const counted = attempts;
      result = await publishReel(
        { igUserId: deps.igUserId, accessToken: token, videoUrl: post.asset_url, caption: post.caption },
        deps.fetcher,
        {
          sleep: deps.sleep, maxPolls: deps.maxPolls,
          // Written before the first poll: a run that dies waiting leaves
          // the id behind for the next run to ask Meta about.
          onContainer: async id => { await db.updatePost(post.id, { ig_container_id: id, attempts: counted }); },
        },
      );
    }
    first = false;
    if (result.ok) break;

    await db.updatePost(post.id, {
      attempts,
      last_error: result.error ?? "publish failed",
      ig_container_id: result.containerId ?? null,
    });
    await db.logEvent({
      post_id: post.id, level: "error", event: "publish_failed",
      detail: { attempts, error: result.error, code: result.code, http_status: result.httpStatus, container_id: result.containerId, polls: result.polls, token_source: source },
    });

    if (attempts >= MAX_ATTEMPTS) break;

    if (result.code === BAD_TOKEN_CODE && !swapped && source === "settings" && deps.fallbackToken) {
      swapped = true;
      token = deps.fallbackToken;
      source = "env";
      // The value is never logged; the fact of the swap is.
      await db.logEvent({ post_id: post.id, level: "warn", event: "token_fallback_env", detail: { attempts, reason: result.error } });
      continue;
    }

    if (!retried && isTransientFailure(result) && clock() - startedAt < RETRY_DEADLINE_MS) {
      retried = true;
      await db.logEvent({ post_id: post.id, level: "info", event: "publish_retry_wait", detail: { attempts, wait_ms: RETRY_WAIT_MS, error: result.error } });
      await sleep(RETRY_WAIT_MS);
      continue;
    }
    break;
  }

  if (!result.ok) {
    const error = result.error ?? "publish failed";
    await db.updatePost(post.id, { status: "held", attempts, last_error: error });
    await db.logEvent({ post_id: post.id, level: "error", event: "held_after_failures", detail: { attempts, error: result.error, code: result.code } });
    alerts.push(heldAfterFailures(post, attempts, error, result.containerId ?? post.ig_container_id));
    return { outcome: "held", postId: post.id, reason: error, attempts };
  }

  const permalink = await lookupPermalink(deps, token, result.mediaId!);
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
    detail: { media_id: result.mediaId, permalink, polls: result.polls, attempts, token_source: source },
  });

  return { outcome: "published", postId: post.id, mediaId: result.mediaId, permalink, attempts };
}

/** Best effort. A post without a permalink is still a post. */
async function lookupPermalink(deps: PublishDeps, token: string, mediaId: string): Promise<string | null> {
  try {
    const res = await deps.fetcher(
      `${GRAPH}/${mediaId}?fields=permalink,media_type&access_token=${encodeURIComponent(token)}`,
    );
    const body = (await res.json().catch(() => null)) as { permalink?: string } | null;
    if (res.ok && typeof body?.permalink === "string") return body.permalink;
    await deps.db.logEvent({ post_id: null, level: "warn", event: "permalink_unavailable", detail: { media_id: mediaId, status: res.status } });
  } catch (e) {
    await deps.db.logEvent({ post_id: null, level: "warn", event: "permalink_unavailable", detail: { media_id: mediaId, error: String(e) } });
  }
  return null;
}

async function sendAlerts(deps: PublishDeps, alerts: Alert[]): Promise<PublishSummary["alert"]> {
  if (alerts.length === 0) return { needed: false, sent: false };

  if (!deps.sendAlert) {
    await deps.db.logEvent({
      post_id: null, level: "warn", event: "alert_not_sent",
      detail: { reason: "RESEND_API_KEY not configured", subjects: alerts.map(a => a.subject) },
    });
    return { needed: true, sent: false, error: "RESEND_API_KEY not configured — something needed a person and nobody was told" };
  }

  const subject = alerts.length === 1 ? alerts[0].subject : `${alerts.length} social posts need attention`;
  const text = alerts.map(a => `${a.subject}\n${"-".repeat(a.subject.length)}\n${a.text}`).join("\n\n");
  const r = await deps.sendAlert({ subject, text });
  if (!r.ok) {
    await deps.db.logEvent({ post_id: null, level: "warn", event: "alert_not_sent", detail: { reason: r.error, subjects: alerts.map(a => a.subject) } });
    return { needed: true, sent: false, error: r.error ?? "alert send failed" };
  }
  await deps.db.logEvent({ post_id: null, level: "info", event: "alert_sent", detail: { subject } });
  for (const a of alerts) if (a.onSent) await a.onSent();
  return { needed: true, sent: true };
}
