import type { Fetcher } from "../instagram";
import type { SocialStore } from "./db";
import { queueHealth, type QueueHealth } from "./health";

/**
 * The Monday summary.
 *
 * One page, once a week, saying what went out, how it did, what is queued and
 * what is stuck. Every figure in it is either read from the queue or read
 * from the Graph API on the morning it is sent; anything the API declines to
 * give is printed as "unavailable" rather than as zero, because zero is a
 * number and would be believed.
 *
 * Attribution is stated plainly. The bio link (/ig) tags visits with UTM
 * parameters and sets a cookie, but nothing reads either back into a report
 * yet, so the summary says so instead of implying a funnel exists.
 */

const GRAPH = "https://graph.instagram.com/v21.0";
const METRICS = ["views", "reach", "likes", "comments", "saved", "shares"] as const;
export type Metric = typeof METRICS[number];

export interface WeeklyPost {
  id: string;
  slot_date: string | null;
  format: string | null;
  permalink: string | null;
  ig_media_id: string | null;
  published_at: string | null;
  /** Reposts from the pool are labelled as such. */
  evergreenRepeat: boolean;
  insights: Record<Metric, number | "unavailable">;
}

export interface WeeklySummary {
  since: string;
  until: string;
  posts: WeeklyPost[];
  followersCount: number | "unavailable";
  health: QueueHealth;
  attribution: string;
}

export const ATTRIBUTION_NOT_MEASURED =
  "Attribution: Instagram-to-site visits are not yet measured.";

export async function buildWeeklySummary(deps: {
  db: SocialStore;
  fetcher: Fetcher;
  token: string;
  igUserId: string;
  now: Date;
  channel?: string;
}): Promise<WeeklySummary> {
  const { db, fetcher, token, now } = deps;
  const channel = deps.channel ?? "instagram";
  const since = new Date(now.getTime() - 7 * 86_400_000).toISOString();

  const rows = await db.findPosts({ channel, status: ["published"], publishedSince: since, orderBy: "published_at" });

  const posts: WeeklyPost[] = [];
  for (const r of rows) {
    posts.push({
      id: r.id,
      slot_date: r.slot_date,
      format: r.format,
      permalink: r.permalink,
      ig_media_id: r.ig_media_id,
      published_at: r.published_at,
      evergreenRepeat: typeof r.source_refs?.evergreen_of === "string",
      insights: r.ig_media_id ? await insightsFor(r.ig_media_id, token, fetcher) : unavailable(),
    });
  }

  return {
    since,
    until: now.toISOString(),
    posts,
    followersCount: await followers(deps.igUserId, token, fetcher),
    health: await queueHealth({ db, now, channel }),
    attribution: `${ATTRIBUTION_NOT_MEASURED} The bio link /ig tags visits with UTM parameters and a pv_src cookie; no report reads them yet.`,
  };
}

function unavailable(): Record<Metric, "unavailable"> {
  return Object.fromEntries(METRICS.map(m => [m, "unavailable"])) as Record<Metric, "unavailable">;
}

/**
 * Per-post insights. Meta's response is a list of {name, values:[{value}]}
 * (or total_value for some metrics); anything missing stays "unavailable".
 * A non-200 — permissions, a metric renamed, a post too new — makes the
 * whole set unavailable rather than half-populated.
 */
async function insightsFor(mediaId: string, token: string, fetcher: Fetcher): Promise<Record<Metric, number | "unavailable">> {
  const out = unavailable() as Record<Metric, number | "unavailable">;
  try {
    const res = await fetcher(
      `${GRAPH}/${mediaId}/insights?metric=${METRICS.join(",")}&access_token=${encodeURIComponent(token)}`,
    );
    const body = (await res.json().catch(() => null)) as {
      data?: { name?: string; values?: { value?: unknown }[]; total_value?: { value?: unknown } }[];
    } | null;
    if (!res.ok || !Array.isArray(body?.data)) return out;
    for (const d of body.data) {
      if (!d.name || !(METRICS as readonly string[]).includes(d.name)) continue;
      const v = d.total_value?.value ?? d.values?.[0]?.value;
      if (typeof v === "number") out[d.name as Metric] = v;
    }
  } catch {
    // Network trouble is the same as the API declining, for the reader.
  }
  return out;
}

async function followers(igUserId: string, token: string, fetcher: Fetcher): Promise<number | "unavailable"> {
  try {
    const res = await fetcher(`${GRAPH}/${igUserId}?fields=followers_count&access_token=${encodeURIComponent(token)}`);
    const body = (await res.json().catch(() => null)) as { followers_count?: unknown } | null;
    return res.ok && typeof body?.followers_count === "number" ? body.followers_count : "unavailable";
  } catch {
    return "unavailable";
  }
}

/** The email, as text and HTML. Text first: it is what gets read on a phone. */
export function renderWeeklyEmail(s: WeeklySummary): { subject: string; text: string; html: string } {
  const h = s.health;
  const fmt = (v: number | "unavailable") => (v === "unavailable" ? "unavailable" : v.toLocaleString("en-GB"));
  const gbp = (n: number) => `£${n.toFixed(2)}`;

  const lines: string[] = [];
  lines.push(`Social summary — week to ${s.until.slice(0, 10)}`);
  lines.push("");
  lines.push(`Published in the last 7 days: ${s.posts.length}`);
  for (const p of s.posts) {
    lines.push(`  ${p.slot_date ?? "—"}  ${p.format ?? ""}${p.evergreenRepeat ? " (evergreen repeat)" : ""}`);
    lines.push(`    ${p.permalink ?? "no permalink recorded"}`);
    lines.push(`    views ${fmt(p.insights.views)} · reach ${fmt(p.insights.reach)} · likes ${fmt(p.insights.likes)} · comments ${fmt(p.insights.comments)} · saved ${fmt(p.insights.saved)} · shares ${fmt(p.insights.shares)}`);
  }
  lines.push("");
  lines.push(`Followers now: ${fmt(s.followersCount)}`);
  lines.push("");
  lines.push("Queue");
  lines.push(`  Paused: ${h.paused ? "YES" : "no"}`);
  lines.push(`  Queued for the next 14 days: ${h.queuedNext14.length}`);
  lines.push(`  Days with nothing queued: ${h.gapsNext14.length ? h.gapsNext14.join(", ") : "none"}`);
  lines.push(`  Held for a person: ${h.holds.length}`);
  for (const x of h.holds) lines.push(`    ${x.slot_date ?? "pool"}  ${x.last_error ?? ""}`);
  lines.push(`  Failed, will retry: ${h.fails.length}`);
  for (const x of h.fails) lines.push(`    ${x.slot_date ?? "pool"}  attempt ${x.attempts}  ${x.last_error ?? ""}`);
  lines.push(`  Evergreen pool: ${h.evergreenPool}`);
  lines.push(`  Last published: ${h.lastPublished ? `${h.lastPublished.slot_date} ${h.lastPublished.permalink ?? ""}` : "nothing yet"}`);
  lines.push("");
  lines.push(`Spend month to date: ${gbp(h.spendMonthToDateGbp)} of ${gbp(h.monthlyCapGbp)} cap${h.monthlyCapGbp === 0 ? " (no spend approved)" : ""}`);
  lines.push("");
  lines.push(s.attribution);

  const text = lines.join("\n");
  const subject = `Social: ${s.posts.length} published, ${h.holds.length} held, ${h.gapsNext14.length} gap${h.gapsNext14.length === 1 ? "" : "s"} in the next 14 days`;
  const html = `<pre style="font-family:ui-monospace,Menlo,monospace;font-size:13px;line-height:1.5;white-space:pre-wrap;color:#0f1b36;">${escapeHtml(text)}</pre>`;
  return { subject, text, html };
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
