import { describe, it, expect } from "vitest";
import { buildWeeklySummary, renderWeeklyEmail, ATTRIBUTION_NOT_MEASURED } from "./weekly";
import { memoryStore } from "./memory-store";
import type { Fetcher } from "../instagram";

const NOW = new Date("2026-09-14T07:00:00Z");
const ok = (b: unknown) => ({ ok: true, status: 200, json: async () => b });

/** Meta's shape: a list of named metrics, one value each. */
const insights = (v: Record<string, number>) =>
  ok({ data: Object.entries(v).map(([name, value]) => ({ name, period: "lifetime", values: [{ value }] })) });

const graph: Fetcher = async u => {
  if (u.includes("/insights")) {
    if (u.includes("/m-old/")) return { ok: false, status: 400, json: async () => ({ error: { message: "not supported" } }) };
    return insights({ views: 1200, reach: 900, likes: 30, comments: 2, saved: 5, shares: 1 });
  }
  if (u.includes("fields=followers_count")) return ok({ followers_count: 412 });
  return ok({});
};

const week = () => memoryStore({ posts: [
  { slot_date: "2026-09-08", status: "published", published_at: "2026-09-08T18:00:00Z", ig_media_id: "m-1", permalink: "https://www.instagram.com/reel/a/", format: "autopsy" },
  { slot_date: "2026-09-10", status: "published", published_at: "2026-09-10T18:00:00Z", ig_media_id: "m-old", permalink: "https://www.instagram.com/reel/b/", format: "the-bill", source_refs: { evergreen_of: "pool" } },
  { slot_date: "2026-09-01", status: "published", published_at: "2026-09-01T18:00:00Z", ig_media_id: "m-0" },   // last week
  { slot_date: "2026-09-15", status: "queued" },
] });

describe("building the summary", () => {
  it("lists the last seven days' posts with their insights, oldest first", async () => {
    const s = await buildWeeklySummary({ db: week(), fetcher: graph, token: "t", igUserId: "1", now: NOW });
    expect(s.posts.map(p => p.slot_date)).toEqual(["2026-09-08", "2026-09-10"]);
    expect(s.posts[0].insights).toEqual({ views: 1200, reach: 900, likes: 30, comments: 2, saved: 5, shares: 1 });
    expect(s.posts[0].evergreenRepeat).toBe(false);
    expect(s.posts[1].evergreenRepeat).toBe(true);
  });

  // "unavailable", never zero: zero would be believed.
  it("marks every metric unavailable when the API declines, rather than printing zeros", async () => {
    const s = await buildWeeklySummary({ db: week(), fetcher: graph, token: "t", igUserId: "1", now: NOW });
    expect(s.posts[1].insights).toEqual({
      views: "unavailable", reach: "unavailable", likes: "unavailable",
      comments: "unavailable", saved: "unavailable", shares: "unavailable",
    });
  });

  it("reads total_value when Meta uses that shape", async () => {
    const f: Fetcher = async u => u.includes("/insights")
      ? ok({ data: [{ name: "views", total_value: { value: 7 } }, { name: "unknown_metric", values: [{ value: 1 }] }] })
      : ok({ followers_count: 1 });
    const s = await buildWeeklySummary({ db: week(), fetcher: f, token: "t", igUserId: "1", now: NOW });
    expect(s.posts[0].insights.views).toBe(7);
    expect(s.posts[0].insights.reach).toBe("unavailable");
  });

  it("asks for the metrics by name with the token", async () => {
    const seen: string[] = [];
    const f: Fetcher = async u => { seen.push(u); return graph(u); };
    await buildWeeklySummary({ db: week(), fetcher: f, token: "tok", igUserId: "77", now: NOW });
    const call = seen.find(u => u.includes("/m-1/insights"))!;
    expect(call).toContain("metric=views,reach,likes,comments,saved,shares");
    expect(call).toContain("access_token=tok");
    expect(seen.some(u => u.includes("/77?fields=followers_count"))).toBe(true);
  });

  it("reports followers, or unavailable", async () => {
    const s = await buildWeeklySummary({ db: week(), fetcher: graph, token: "t", igUserId: "1", now: NOW });
    expect(s.followersCount).toBe(412);
    const down: Fetcher = async () => { throw new Error("offline"); };
    const s2 = await buildWeeklySummary({ db: week(), fetcher: down, token: "t", igUserId: "1", now: NOW });
    expect(s2.followersCount).toBe("unavailable");
    expect(s2.posts[0].insights.views).toBe("unavailable");
  });

  it("states that attribution is not measured, in those words", async () => {
    const s = await buildWeeklySummary({ db: week(), fetcher: graph, token: "t", igUserId: "1", now: NOW });
    expect(s.attribution).toContain(ATTRIBUTION_NOT_MEASURED);
    expect(ATTRIBUTION_NOT_MEASURED).toBe("Attribution: Instagram-to-site visits are not yet measured.");
  });
});

describe("the email", () => {
  it("puts the facts on the page: permalinks, insights, followers, queue, spend, attribution", async () => {
    const db = week();
    db.settings.set("monthly_cap_gbp", 0);
    const s = await buildWeeklySummary({ db, fetcher: graph, token: "t", igUserId: "1", now: NOW });
    const { subject, text, html } = renderWeeklyEmail(s);

    expect(subject).toContain("2 published");
    expect(text).toContain("https://www.instagram.com/reel/a/");
    expect(text).toContain("views 1,200");
    expect(text).toContain("views unavailable");
    expect(text).toContain("(evergreen repeat)");
    expect(text).toContain("Followers now: 412");
    expect(text).toContain("Queued for the next 14 days: 1");
    expect(text).toContain("Days with nothing queued:");
    expect(text).toContain("£0.00 of £0.00 cap (no spend approved)");
    expect(text).toContain(ATTRIBUTION_NOT_MEASURED);
    expect(html).toContain("<pre");
    expect(html).toContain(ATTRIBUTION_NOT_MEASURED);
  });

  it("does not invent a figure when nothing was published", async () => {
    const s = await buildWeeklySummary({ db: memoryStore(), fetcher: graph, token: "t", igUserId: "1", now: NOW });
    const { text } = renderWeeklyEmail(s);
    expect(text).toContain("Published in the last 7 days: 0");
    expect(text).toContain("Last published: nothing yet");
  });
});
