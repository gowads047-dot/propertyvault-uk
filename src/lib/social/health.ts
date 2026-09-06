import type { SocialStore } from "./db";
import { addDays, londonDate } from "./dates";

/**
 * The state of the queue, in one object.
 *
 * Read by the status endpoint and the Monday summary. Both exist to answer
 * the question the first cron could not: is anything going to go out this
 * week, and did last week's actually go? The "gaps" list is the important
 * one — a day with no row is a day nothing happens, and it should be visible
 * two weeks out rather than discovered the evening it arrives.
 */

export interface QueueHealth {
  today: string;
  paused: boolean;
  /** Days from today to today+13 with a queued row. */
  queuedNext14: { slot_date: string; format: string | null; id: string }[];
  /** Days in the same window with no live row at all. */
  gapsNext14: string[];
  holds: { id: string; slot_date: string | null; last_error: string | null }[];
  fails: { id: string; slot_date: string | null; attempts: number; last_error: string | null }[];
  lastPublished: { id: string; slot_date: string | null; permalink: string | null; published_at: string | null } | null;
  evergreenPool: number;
  monthlyCapGbp: number;
  spendMonthToDateGbp: number;
}

export async function queueHealth(deps: { db: SocialStore; now: Date; channel?: string }): Promise<QueueHealth> {
  const { db, now } = deps;
  const channel = deps.channel ?? "instagram";
  const today = londonDate(now);
  const horizon = addDays(today, 13);

  const [paused, live, holds, fails, published, pool, cap] = await Promise.all([
    db.getSetting("paused"),
    db.findPosts({ channel, status: ["queued", "publishing", "published", "failed"], slotFrom: today, slotTo: horizon, orderBy: "slot_date" }),
    db.findPosts({ channel, status: ["held"], orderBy: "slot_date" }),
    db.findPosts({ channel, status: ["failed"], orderBy: "slot_date" }),
    db.findPosts({ channel, status: ["published"], orderBy: "published_at" }),
    db.findPosts({ channel, evergreen: true }),
    db.getSetting("monthly_cap_gbp"),
  ]);

  const covered = new Set(live.map(p => p.slot_date));
  const gaps: string[] = [];
  for (let i = 0; i < 14; i++) {
    const d = addDays(today, i);
    if (!covered.has(d)) gaps.push(d);
  }

  const last = published.length ? published[published.length - 1] : null;

  // Month to date, London. The ledger is entered by hand, so the boundary
  // being a few hours off for a spend line at 00:30 on the first is not a
  // problem worth a timezone library.
  const monthStart = `${today.slice(0, 7)}-01T00:00:00Z`;

  return {
    today,
    paused: paused === true,
    queuedNext14: live.filter(p => p.status === "queued").map(p => ({ slot_date: p.slot_date!, format: p.format, id: p.id })),
    gapsNext14: gaps,
    holds: holds.map(p => ({ id: p.id, slot_date: p.slot_date, last_error: p.last_error })),
    fails: fails.map(p => ({ id: p.id, slot_date: p.slot_date, attempts: p.attempts, last_error: p.last_error })),
    lastPublished: last ? { id: last.id, slot_date: last.slot_date, permalink: last.permalink, published_at: last.published_at } : null,
    evergreenPool: pool.length,
    monthlyCapGbp: typeof cap === "number" ? cap : 0,
    spendMonthToDateGbp: await db.spendSince(monthStart),
  };
}
