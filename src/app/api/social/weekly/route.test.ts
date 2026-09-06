import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { GET, weeklyWith } from "./route";
import { memoryStore } from "@/lib/social/memory-store";
import { ATTRIBUTION_NOT_MEASURED } from "@/lib/social/weekly";
import type { Fetcher } from "@/lib/instagram";

const SECRET = "test-cron-secret";
const authed = () => new Request("https://x/api/social/weekly", { headers: { authorization: `Bearer ${SECRET}` } });
const NOW = new Date("2026-09-14T07:00:00Z");

const ENV_KEYS = ["CRON_SECRET", "INSTAGRAM_ACCESS_TOKEN", "NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY", "RESEND_API_KEY"] as const;
let saved: Record<string, string | undefined> = {};
beforeEach(() => {
  saved = Object.fromEntries(ENV_KEYS.map(k => [k, process.env[k]]));
  process.env.CRON_SECRET = SECRET;
  process.env.INSTAGRAM_ACCESS_TOKEN = "t";
});
afterEach(() => {
  for (const k of ENV_KEYS) {
    if (saved[k] === undefined) delete process.env[k];
    else process.env[k] = saved[k];
  }
});

const graph: Fetcher = async u => ({
  ok: true, status: 200,
  json: async () => u.includes("/insights")
    ? { data: [{ name: "views", values: [{ value: 50 }] }] }
    : { followers_count: 9 },
});

const lastWeek = () => memoryStore({ posts: [
  { slot_date: "2026-09-10", status: "published", published_at: "2026-09-10T18:00:00Z", ig_media_id: "m", permalink: "https://www.instagram.com/reel/q/" },
  { slot_date: "2026-09-09", status: "held", last_error: "qc" },
] });

describe("the Monday summary", () => {
  it("refuses without the cron secret", async () => {
    expect((await GET(new Request("https://x"))).status).toBe(401);
  });

  it("fails loudly without a database", async () => {
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    expect((await GET(authed())).status).toBe(500);
  });

  it("returns 500, with the facts, when email is not configured", async () => {
    const res = await weeklyWith(lastWeek(), { fetcher: graph, now: NOW, send: null });
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.sent).toBe(false);
    expect(body.error).toContain("RESEND_API_KEY");
    expect(body.published).toBe(1);
    expect(body.holds).toBe(1);
  });

  it("sends the page to the alert address and logs it", async () => {
    const mails: { to: string; subject: string; text: string; html?: string }[] = [];
    const store = lastWeek();
    store.settings.set("alert_email", "name@example.com");
    const res = await weeklyWith(store, {
      fetcher: graph, now: NOW,
      send: to => async m => { mails.push({ to, ...m }); return { ok: true }; },
    });
    expect(res.status).toBe(200);
    expect(mails).toHaveLength(1);
    expect(mails[0].to).toBe("name@example.com");
    expect(mails[0].text).toContain("https://www.instagram.com/reel/q/");
    expect(mails[0].text).toContain("views 50");
    expect(mails[0].text).toContain("Followers now: 9");
    expect(mails[0].text).toContain("Held for a person: 1");
    expect(mails[0].text).toContain(ATTRIBUTION_NOT_MEASURED);
    expect(mails[0].html).toContain("<pre");
    expect(store.events.map(e => e.event)).toEqual(["weekly_sent"]);
  });

  it("still sends the queue report when there is no token, with insights unavailable", async () => {
    delete process.env.INSTAGRAM_ACCESS_TOKEN;
    const mails: { text: string }[] = [];
    const res = await weeklyWith(lastWeek(), {
      fetcher: async () => { throw new Error("should not be reached with an empty token, but harmless"); },
      now: NOW,
      send: () => async m => { mails.push(m); return { ok: true }; },
    });
    expect(res.status).toBe(200);
    expect((await res.json()).tokenAvailable).toBe(false);
    expect(mails[0].text).toContain("views unavailable");
  });

  it("returns 500 when Resend refuses", async () => {
    const res = await weeklyWith(lastWeek(), {
      fetcher: graph, now: NOW,
      send: () => async () => ({ ok: false, error: "Resend 422" }),
    });
    expect(res.status).toBe(500);
    expect((await res.json()).error).toBe("Resend 422");
  });
});
