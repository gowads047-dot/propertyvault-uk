import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { GET, refreshWith } from "./route";
import { memoryStore } from "@/lib/social/memory-store";
import type { Fetcher } from "@/lib/instagram";

const SECRET = "test-cron-secret";
const authed = () => new Request("https://x/api/social/refresh-token", { headers: { authorization: `Bearer ${SECRET}` } });
const NOW = new Date("2026-09-07T06:00:00Z");

const ENV_KEYS = ["CRON_SECRET", "INSTAGRAM_ACCESS_TOKEN", "NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"] as const;
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

const meta: Fetcher = async () => ({
  ok: true, status: 200, json: async () => ({ access_token: "IGQVJ-new-token", token_type: "bearer", expires_in: 5_184_000 }),
});

describe("the weekly refresh", () => {
  it("refuses without the cron secret", async () => {
    expect((await GET(new Request("https://x"))).status).toBe(401);
  });

  it("fails loudly without a database", async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    const res = await GET(authed());
    expect(res.status).toBe(500);
    expect((await res.json()).refreshed).toBe(false);
  });

  it("bootstraps from the environment token and stores the result with its expiry", async () => {
    process.env.INSTAGRAM_ACCESS_TOKEN = "boot";
    const store = memoryStore();
    const res = await refreshWith(store, meta, NOW);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toMatchObject({ refreshed: true, source: "env", expiresInDays: 60 });
    expect(store.settings.get("ig_access_token")).toEqual({
      access_token: "IGQVJ-new-token",
      expires_at: new Date(NOW.getTime() + 5_184_000_000).toISOString(),
      refreshed_at: NOW.toISOString(),
    });
    expect(store.events.map(e => e.event)).toEqual(["token_refreshed"]);
  });

  it("refreshes the stored token next time, not the environment one", async () => {
    process.env.INSTAGRAM_ACCESS_TOKEN = "boot";
    let sent = "";
    const f: Fetcher = async u => { sent = u; return meta(u); };
    const store = memoryStore({ settings: { ig_access_token: { access_token: "stored", expires_at: "2026-11-01T00:00:00Z" } } });
    const res = await refreshWith(store, f, NOW);
    expect((await res.json()).source).toBe("settings");
    expect(sent).toContain("access_token=stored");
  });

  it("never puts the token in the response", async () => {
    process.env.INSTAGRAM_ACCESS_TOKEN = "boot";
    const res = await refreshWith(memoryStore(), meta, NOW);
    expect(JSON.stringify(await res.json())).not.toContain("IGQVJ-new-token");
  });

  it("returns 500 with Meta's message when the refresh fails, and keeps the old token", async () => {
    const fail: Fetcher = async () => ({ ok: false, status: 400, json: async () => ({ error: { message: "Session has expired", code: 190 } }) });
    const store = memoryStore({ settings: { ig_access_token: { access_token: "stored", expires_at: "2026-11-01T00:00:00Z" } } });
    const res = await refreshWith(store, fail, NOW);
    expect(res.status).toBe(500);
    expect((await res.json()).error).toContain("Session has expired");
    expect((store.settings.get("ig_access_token") as { access_token: string }).access_token).toBe("stored");
    expect(store.events.map(e => e.event)).toEqual(["token_refresh_failed"]);
  });

  it("returns 500 when there is nothing to refresh", async () => {
    const res = await refreshWith(memoryStore(), meta, NOW);
    expect(res.status).toBe(500);
    expect((await res.json()).error).toContain("INSTAGRAM_ACCESS_TOKEN");
  });
});
