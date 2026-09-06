import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { GET, publishWith } from "./route";
import { GET as RETRY } from "./retry/route";
import { memoryStore } from "@/lib/social/memory-store";
import type { Fetcher } from "@/lib/instagram";
import type { AssetFetcher } from "@/lib/social/qc";

/**
 * The route around the publisher: authorisation, configuration, and which
 * outcomes are a 500. The publishing decisions themselves are tested in
 * lib/social/publisher.test.ts against the same in-memory store.
 *
 * The configuration tests are carried over from the route this replaced.
 */

const SECRET = "test-cron-secret";
const authed = () => new Request("https://x/api/social/publish", { headers: { authorization: `Bearer ${SECRET}` } });

const ENV_KEYS = [
  "CRON_SECRET", "INSTAGRAM_ACCESS_TOKEN", "INSTAGRAM_USER_ID",
  "NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY", "RESEND_API_KEY",
] as const;
let saved: Record<string, string | undefined> = {};

beforeEach(() => {
  saved = Object.fromEntries(ENV_KEYS.map(k => [k, process.env[k]]));
  process.env.CRON_SECRET = SECRET;
  delete process.env.INSTAGRAM_ACCESS_TOKEN;
});

afterEach(() => {
  for (const k of ENV_KEYS) {
    if (saved[k] === undefined) delete process.env[k];
    else process.env[k] = saved[k];
  }
});

const NOW = new Date("2026-09-07T18:00:00Z");
const TAGS = "#ukproperty #buytolet #uklandlord #propertyinvestmentuk #dealanalysis";
const today = () => ({
  slot_date: "2026-09-07", asset_sha256: "a".repeat(64), format: "autopsy",
  caption: `Running costs assumed at 28% of rent. ${TAGS}`,
});

const graphOk: Fetcher = async (u, init) => {
  const ok = (b: unknown) => ({ ok: true, status: 200, json: async () => b });
  if (u.includes("/media_publish")) return ok({ id: "m-1" });
  if (init?.method === "POST") return ok({ id: "c-1" });
  if (u.includes("fields=permalink")) return ok({ permalink: "https://www.instagram.com/reel/x/" });
  return ok({ status_code: "FINISHED" });
};
const graphFail: Fetcher = async () => ({ ok: false, status: 400, json: async () => ({ error: { message: "nope" } }) });
const assetsOk: AssetFetcher = async () => ({
  status: 200, headers: { get: (k: string) => (k === "content-type" ? "video/mp4" : "400000") },
});

const adapters = (over: Partial<Parameters<typeof publishWith>[1]> = {}) => ({
  fetcher: graphOk, assetFetcher: assetsOk, now: NOW, sleep: async () => {},
  sendAlert: () => async () => ({ ok: true }),
  ...over,
});

describe("authorisation", () => {
  it("refuses an unauthenticated request", async () => {
    expect((await GET(new Request("https://x/api/social/publish"))).status).toBe(401);
  });

  it("refuses the wrong secret", async () => {
    expect((await GET(new Request("https://x", { headers: { authorization: "Bearer nope" } }))).status).toBe(401);
  });

  it("guards the retry slot the same way", async () => {
    expect((await RETRY(new Request("https://x/api/social/publish/retry"))).status).toBe(401);
  });
});

describe("configuration", () => {
  // Three other crons on this site once reported success while sending nothing,
  // because a missing key was treated as a no-op. This one has to be loud.
  it("fails with 500 when the database is not configured", async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    const res = await GET(authed());
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.posted).toBe(false);
    expect(body.error).toContain("SUPABASE_SERVICE_ROLE_KEY");
    expect(body.error).toContain("Nothing was posted");
  });

  it("fails with 500 when there is no token anywhere", async () => {
    const res = await publishWith(memoryStore({ posts: [today()] }), adapters());
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.posted).toBe(false);
    expect(body.error).toContain("INSTAGRAM_ACCESS_TOKEN");
    expect(body.error).toContain("Nothing was posted");
  });

  // The account id is content, not a secret; the route runs without it in the environment.
  it("needs no environment variable but the token once the store is there", async () => {
    process.env.INSTAGRAM_ACCESS_TOKEN = "t";
    delete process.env.INSTAGRAM_USER_ID;
    const res = await publishWith(memoryStore(), adapters());
    expect(res.status).toBe(200);
    expect((await res.json()).outcome).toBe("nothing-queued");
  });

  it("prefers the stored token and says which it used", async () => {
    process.env.INSTAGRAM_ACCESS_TOKEN = "env";
    const store = memoryStore({
      posts: [today()],
      settings: { ig_access_token: { access_token: "stored", expires_at: "2026-11-01T00:00:00Z" } },
    });
    let used = "";
    const f: Fetcher = async (u, init) => {
      if (init?.method === "POST" && !u.includes("media_publish")) used = init.body ?? "";
      return graphOk(u, init);
    };
    const res = await publishWith(store, adapters({ fetcher: f }));
    expect((await res.json()).tokenSource).toBe("settings");
    expect(used).toContain("access_token=stored");
  });
});

describe("outcomes", () => {
  beforeEach(() => { process.env.INSTAGRAM_ACCESS_TOKEN = "t"; });

  it("returns 200 with the media id when the day is published", async () => {
    const res = await publishWith(memoryStore({ posts: [today()] }), adapters());
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.posted).toBe(true);
    expect(body.mediaId).toBe("m-1");
    expect(body.permalink).toContain("instagram.com");
  });

  it("returns 200 when the day was already done — the retry slot is a no-op", async () => {
    const store = memoryStore({ posts: [today()] });
    await publishWith(store, adapters());
    const res = await publishWith(store, adapters({ now: new Date("2026-09-07T18:40:00Z") }));
    expect(res.status).toBe(200);
    expect((await res.json()).outcome).toBe("already-published");
  });

  it("returns 500 when the publish failed, so the cron shows red", async () => {
    const res = await publishWith(memoryStore({ posts: [today()] }), adapters({ fetcher: graphFail }));
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.posted).toBe(false);
    expect(body.outcome).toBe("failed");
    expect(body.reason).toContain("nope");
  });

  it("returns 500 with the reason when a hold needed an alert and RESEND_API_KEY is missing", async () => {
    const broken: AssetFetcher = async () => ({ status: 404, headers: { get: () => null } });
    const res = await publishWith(
      memoryStore({ posts: [today()] }),
      adapters({ assetFetcher: broken, sendAlert: () => null }),
    );
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.outcome).toBe("held");
    expect(body.alert.sent).toBe(false);
    expect(body.alert.error).toContain("RESEND_API_KEY");
  });

  it("sends the alert to the configured address", async () => {
    const broken: AssetFetcher = async () => ({ status: 404, headers: { get: () => null } });
    let to = "";
    await publishWith(
      memoryStore({ posts: [today()], settings: { alert_email: "name@example.com" } }),
      adapters({ assetFetcher: broken, sendAlert: addr => { to = addr; return async () => ({ ok: true }); } }),
    );
    expect(to).toBe("name@example.com");
  });

  it("returns 200 when paused", async () => {
    const res = await publishWith(memoryStore({ posts: [today()], settings: { paused: true } }), adapters());
    expect(res.status).toBe(200);
    expect((await res.json()).outcome).toBe("paused");
  });
});
