import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { GET, weeklyWith } from "./route";
import { memoryStore } from "@/lib/social/memory-store";
import { ATTRIBUTION_NOT_MEASURED } from "@/lib/social/weekly";
import type { Fetcher } from "@/lib/instagram";

/**
 * The Monday route: refresh, then summary. The refresh's own decisions are
 * tested in lib/social/refresh.test.ts; the page's content in
 * lib/social/weekly.test.ts. This file tests the order, the status codes,
 * and that a failed refresh still lets the summary out.
 */

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

const ok = (b: unknown) => ({ ok: true, status: 200, json: async () => b });

/**
 * Meta for one Monday: refreshes any token in `accepts` into "fresh-<token>",
 * answers insights and followers, and records every token it was shown.
 */
function graph(accepts: string[] = ["t"]): Fetcher & { seen: string[]; calls: number } {
  const seen: string[] = [];
  const f = (async (u: string) => {
    f.calls += 1;
    const tok = new URL(u).searchParams.get("access_token") ?? "";
    seen.push(tok);
    if (u.includes("refresh_access_token")) {
      return accepts.includes(tok)
        ? ok({ access_token: `fresh-${tok}`, token_type: "bearer", expires_in: 5_184_000 })
        : { ok: false, status: 400, json: async () => ({ error: { message: `Session has expired (${tok})`, code: 190 } }) };
    }
    if (u.includes("/insights")) return ok({ data: [{ name: "views", values: [{ value: 50 }] }] });
    return ok({ followers_count: 9 });
  }) as Fetcher & { seen: string[]; calls: number };
  f.seen = seen;
  f.calls = 0;
  return f;
}

const lastWeek = () => memoryStore({ posts: [
  { slot_date: "2026-09-10", status: "published", published_at: "2026-09-10T18:00:00Z", ig_media_id: "m", permalink: "https://www.instagram.com/reel/q/" },
  { slot_date: "2026-09-09", status: "held", last_error: "qc" },
] });

type Sent = { to: string; subject: string; text: string; html?: string };
const mailbox = () => {
  const mails: Sent[] = [];
  return { mails, send: (to: string) => async (m: { subject: string; text: string; html?: string }) => { mails.push({ to, ...m }); return { ok: true }; } };
};

describe("the Monday run", () => {
  it("refuses without the cron secret", async () => {
    expect((await GET(new Request("https://x"))).status).toBe(401);
  });

  it("fails loudly without a database", async () => {
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    expect((await GET(authed())).status).toBe(500);
  });

  it("refreshes the token first, stores it, and builds the page with the new one", async () => {
    const { mails, send } = mailbox();
    const store = lastWeek();
    const f = graph(["t"]);
    const res = await weeklyWith(store, { fetcher: f, now: NOW, send });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toMatchObject({ sent: true, refreshed: true, refreshSource: "env", expiresInDays: 60, tokenAvailable: true, published: 1 });
    expect((store.settings.get("ig_access_token") as { access_token: string }).access_token).toBe("fresh-t");
    // The refresh is the first call; everything after it uses the token it produced.
    expect(f.seen[0]).toBe("t");
    expect(f.seen.slice(1).every(tok => tok === "fresh-t")).toBe(true);
    expect(mails).toHaveLength(1);
    expect(mails[0].text).toContain("Instagram token: refreshed from INSTAGRAM_ACCESS_TOKEN");
    expect(store.events.map(e => e.event)).toEqual(["token_refreshed", "weekly_sent"]);
  });

  it("returns 500, with the facts, when email is not configured", async () => {
    const res = await weeklyWith(lastWeek(), { fetcher: graph(), now: NOW, send: null });
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.sent).toBe(false);
    expect(body.error).toContain("RESEND_API_KEY");
    expect(body.published).toBe(1);
    expect(body.holds).toBe(1);
    expect(body.refreshed).toBe(true);
  });

  it("sends the page to the alert address and logs it", async () => {
    const { mails, send } = mailbox();
    const store = lastWeek();
    store.settings.set("alert_email", "name@example.com");
    const res = await weeklyWith(store, { fetcher: graph(), now: NOW, send });
    expect(res.status).toBe(200);
    expect(mails).toHaveLength(1);
    expect(mails[0].to).toBe("name@example.com");
    expect(mails[0].text).toContain("https://www.instagram.com/reel/q/");
    expect(mails[0].text).toContain("views 50");
    expect(mails[0].text).toContain("Followers now: 9");
    expect(mails[0].text).toContain("Held for a person: 1");
    expect(mails[0].text).toContain("Days covered:");
    expect(mails[0].text).toContain(ATTRIBUTION_NOT_MEASURED);
    expect(mails[0].html).toContain("<pre");
  });

  // Refresh failure = 500 + its own alert, and the summary still goes.
  it("returns 500, alerts, and still sends the summary when the refresh fails", async () => {
    const { mails, send } = mailbox();
    const store = lastWeek();
    store.settings.set("ig_access_token", { access_token: "dead", expires_at: "2026-11-01T00:00:00Z" });
    const f = graph([]);
    const res = await weeklyWith(store, { fetcher: f, now: NOW, send });
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body).toMatchObject({ sent: true, refreshed: false, refreshAlertSent: true });
    expect(body.refreshError).toContain("settings:");
    expect(body.refreshError).toContain("env:");
    expect(mails.map(m => m.subject)).toEqual([
      "Instagram token refresh failed",
      expect.stringContaining("TOKEN REFRESH FAILED"),
    ]);
    expect(mails[0].text).toContain("update social_settings set value = 'null' where key = 'ig_access_token'");
    expect(mails[0].text).toContain("under 24 hours old");
    expect(mails[1].text).toContain("Instagram token: REFRESH FAILED");
    // The dead stored token is still the one in use for the page — it had not expired by the clock.
    expect(body.tokenAvailable).toBe(true);
    expect((store.settings.get("ig_access_token") as { access_token: string }).access_token).toBe("dead");
    expect(store.events.map(e => e.event)).toEqual(["token_refresh_failed", "weekly_sent"]);
  });

  it("falls back to the environment token for the refresh when the stored one is refused", async () => {
    const { send } = mailbox();
    const store = lastWeek();
    store.settings.set("ig_access_token", { access_token: "dead", expires_at: "2026-11-01T00:00:00Z" });
    const f = graph(["t"]);
    const res = await weeklyWith(store, { fetcher: f, now: NOW, send });
    expect(res.status).toBe(200);
    expect((await res.json()).refreshSource).toBe("env");
    expect(f.seen.slice(0, 2)).toEqual(["dead", "t"]);
    expect((store.settings.get("ig_access_token") as { access_token: string }).access_token).toBe("fresh-t");
  });

  it("asks the API nothing without a token, still sends the queue report, and fails the run", async () => {
    delete process.env.INSTAGRAM_ACCESS_TOKEN;
    const { mails, send } = mailbox();
    const f = graph();
    const res = await weeklyWith(lastWeek(), { fetcher: f, now: NOW, send });
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.sent).toBe(true);
    expect(body.refreshed).toBe(false);
    expect(body.tokenAvailable).toBe(false);
    expect(f.calls).toBe(0);
    // The refresh alert goes first; the summary is still sent after it.
    expect(mails.map(m => m.subject)).toEqual(["Instagram token refresh failed", expect.stringContaining("TOKEN REFRESH FAILED")]);
    expect(mails[1].text).toContain("views unavailable");
    expect(mails[1].text).toContain("the Graph API was not asked");
  });

  it("never puts a token in the response", async () => {
    const { send } = mailbox();
    const res = await weeklyWith(lastWeek(), { fetcher: graph(), now: NOW, send });
    const text = JSON.stringify(await res.json());
    expect(text).not.toContain("fresh-t");
    expect(text).not.toMatch(/"t"/);
  });

  it("returns 500 when Resend refuses", async () => {
    const res = await weeklyWith(lastWeek(), {
      fetcher: graph(), now: NOW,
      send: () => async () => ({ ok: false, error: "Resend 422" }),
    });
    expect(res.status).toBe(500);
    expect((await res.json()).error).toBe("Resend 422");
  });
});
