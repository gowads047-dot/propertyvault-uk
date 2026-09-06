import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { GET, statusWith } from "./route";
import { memoryStore } from "@/lib/social/memory-store";

const SECRET = "test-cron-secret";
const ENV_KEYS = ["CRON_SECRET", "INSTAGRAM_ACCESS_TOKEN", "NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"] as const;
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

describe("the status endpoint", () => {
  it("is not public", async () => {
    expect((await GET(new Request("https://x/api/social/status"))).status).toBe(401);
  });

  it("fails loudly without a database", async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    const res = await GET(new Request("https://x", { headers: { authorization: `Bearer ${SECRET}` } }));
    expect(res.status).toBe(500);
  });

  it("reports the queue and whether a token exists, without the token", async () => {
    process.env.INSTAGRAM_ACCESS_TOKEN = "secret-token";
    const store = memoryStore({
      posts: [{ slot_date: "2026-09-08", status: "queued" }, { slot_date: "2026-09-07", status: "held" }],
      settings: { paused: false, ig_access_token: { access_token: "stored-secret", expires_at: null } },
    });
    const res = await statusWith(store, new Date("2026-09-07T12:00:00Z"));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.today).toBe("2026-09-07");
    expect(body.queuedNext14).toHaveLength(1);
    expect(body.holds).toHaveLength(1);
    expect(body.paused).toBe(false);
    expect(body.tokenStored).toBe(true);
    expect(body.tokenInEnv).toBe(true);
    expect(JSON.stringify(body)).not.toContain("secret");
  });
});
