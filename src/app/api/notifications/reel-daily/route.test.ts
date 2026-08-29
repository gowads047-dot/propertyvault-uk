import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { GET } from "./route";
import { CALENDAR } from "@/lib/reel-calendar";

const SECRET = "test-cron-secret";
const authed = () =>
  new Request("https://x/api/notifications/reel-daily", {
    headers: { authorization: `Bearer ${SECRET}` },
  });

/** Campaign start N days ago, so "today" lands on day N+1. */
function startFor(day: number): string {
  const ms = Date.now() - (day - 1) * 86_400_000;
  return new Date(ms).toISOString().slice(0, 10);
}

const ENV_KEYS = [
  "CRON_SECRET", "INSTAGRAM_ACCESS_TOKEN", "INSTAGRAM_USER_ID", "REEL_CAMPAIGN_START",
] as const;
let saved: Record<string, string | undefined> = {};

beforeEach(() => {
  saved = Object.fromEntries(ENV_KEYS.map(k => [k, process.env[k]]));
  process.env.CRON_SECRET = SECRET;
});

afterEach(() => {
  for (const k of ENV_KEYS) {
    if (saved[k] === undefined) delete process.env[k];
    else process.env[k] = saved[k];
  }
});

describe("authorisation", () => {
  it("refuses an unauthenticated request", async () => {
    const res = await GET(new Request("https://x/api/notifications/reel-daily"));
    expect(res.status).toBe(401);
  });

  it("refuses the wrong secret", async () => {
    const res = await GET(new Request("https://x", { headers: { authorization: "Bearer nope" } }));
    expect(res.status).toBe(401);
  });
});

describe("configuration", () => {
  // Three other crons on this site once reported success while sending nothing,
  // because a missing key was treated as a no-op. This one has to be loud.
  it("fails with 500 when the access token is absent", async () => {
    delete process.env.INSTAGRAM_ACCESS_TOKEN;

    const res = await GET(authed());
    expect(res.status).toBe(500);

    const body = await res.json();
    expect(body.posted).toBe(false);
    expect(body.error).toContain("INSTAGRAM_ACCESS_TOKEN");
    expect(body.error).toContain("nothing was posted");
  });

  // The account id and the schedule are content, not secrets, so the route has
  // to run without either being set in the environment.
  it("needs no environment variable but the token", async () => {
    process.env.INSTAGRAM_ACCESS_TOKEN = "t";
    delete process.env.INSTAGRAM_USER_ID;
    process.env.REEL_CAMPAIGN_START = startFor(CALENDAR.length + 5);

    const res = await GET(authed());
    expect(res.status).toBe(200);
    expect((await res.json()).reason).toBe("campaign complete");
  });

  it("rejects a start date it cannot parse rather than posting the wrong day", async () => {
    process.env.INSTAGRAM_ACCESS_TOKEN = "t";
    process.env.REEL_CAMPAIGN_START = "next tuesday";

    const res = await GET(authed());
    expect(res.status).toBe(500);
    expect((await res.json()).error).toContain("YYYY-MM-DD");
  });
});

describe("where the campaign has got to", () => {
  beforeEach(() => {
    process.env.INSTAGRAM_ACCESS_TOKEN = "t";
    process.env.INSTAGRAM_USER_ID = "1";
  });

  // Running past the end is a real outcome, not a failure — a cron that starts
  // reporting 500 forever after day 30 is a cron nobody looks at any more.
  it("reports completion with 200 once the calendar runs out", async () => {
    process.env.REEL_CAMPAIGN_START = startFor(CALENDAR.length + 5);
    const res = await GET(authed());
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.posted).toBe(false);
    expect(body.reason).toBe("campaign complete");
    expect(body.day).toBeGreaterThan(CALENDAR.length);
  });

  it("does nothing before the start date", async () => {
    const tomorrow = new Date(Date.now() + 3 * 86_400_000).toISOString().slice(0, 10);
    process.env.REEL_CAMPAIGN_START = tomorrow;

    const res = await GET(authed());
    expect(res.status).toBe(200);
    expect((await res.json()).reason).toBe("campaign has not started");
  });
});
