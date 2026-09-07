import { describe, it, expect } from "vitest";
import { refreshToken } from "./refresh";
import { memoryStore } from "./memory-store";
import type { Fetcher } from "../instagram";

const NOW = new Date("2026-09-07T07:00:00Z");
const stored = (token: string) => ({ ig_access_token: { access_token: token, expires_at: "2026-11-01T00:00:00Z", refreshed_at: null } });

/** Meta, refusing every token except the ones named. */
function meta(accepts: string[]): Fetcher & { asked: string[] } {
  const asked: string[] = [];
  const f = (async (url: string) => {
    const tok = new URL(url).searchParams.get("access_token")!;
    asked.push(tok);
    if (accepts.includes(tok)) {
      return { ok: true, status: 200, json: async () => ({ access_token: `fresh-from-${tok}`, token_type: "bearer", expires_in: 5_184_000 }) };
    }
    // Meta does not echo the token in its message, and neither does the fake.
    return { ok: false, status: 400, json: async () => ({ error: { message: "Error validating access token", code: 190 } }) };
  }) as Fetcher & { asked: string[] };
  f.asked = asked;
  return f;
}

describe("the Monday refresh", () => {
  it("exchanges the stored token first and stores the result with its expiry", async () => {
    const db = memoryStore({ settings: stored("stored") });
    const f = meta(["stored", "env"]);
    const r = await refreshToken(db, f, "env", NOW);
    expect(r).toMatchObject({ ok: true, source: "settings", expiresInDays: 60, tried: [] });
    expect(f.asked).toEqual(["stored"]);
    expect(db.settings.get("ig_access_token")).toEqual({
      access_token: "fresh-from-stored",
      expires_at: new Date(NOW.getTime() + 5_184_000_000).toISOString(),
      refreshed_at: NOW.toISOString(),
    });
    expect(db.events.map(e => e.event)).toEqual(["token_refreshed"]);
  });

  it("bootstraps from the environment when nothing is stored", async () => {
    const db = memoryStore();
    const r = await refreshToken(db, meta(["env"]), "env", NOW);
    expect(r).toMatchObject({ ok: true, source: "env" });
    expect((db.settings.get("ig_access_token") as { access_token: string }).access_token).toBe("fresh-from-env");
  });

  // A person who sets a new INSTAGRAM_ACCESS_TOKEN to recover from a dead
  // stored token must not be blocked by the dead one.
  it("falls back to the environment token when Meta refuses the stored one, and records both", async () => {
    const db = memoryStore({ settings: stored("dead") });
    const f = meta(["env"]);
    const r = await refreshToken(db, f, "env", NOW);
    expect(r.ok).toBe(true);
    expect(r.source).toBe("env");
    expect(r.tried).toEqual([{ source: "settings", error: expect.stringContaining("code 190") }]);
    expect(f.asked).toEqual(["dead", "env"]);
    expect((db.settings.get("ig_access_token") as { access_token: string }).access_token).toBe("fresh-from-env");
    const ev = db.events.find(e => e.event === "token_refreshed")!;
    expect(ev.detail).toMatchObject({ source: "env" });
  });

  it("does not try the environment token twice when it is the stored one", async () => {
    const db = memoryStore({ settings: stored("same") });
    const f = meta([]);
    const r = await refreshToken(db, f, "same", NOW);
    expect(r.ok).toBe(false);
    expect(f.asked).toEqual(["same"]);
  });

  it("fails, keeps the old token, and logs every refusal when both are refused", async () => {
    const db = memoryStore({ settings: stored("dead") });
    const r = await refreshToken(db, meta([]), "also-dead", NOW);
    expect(r.ok).toBe(false);
    expect(r.tried.map(t => t.source)).toEqual(["settings", "env"]);
    expect(r.error).toContain("settings:");
    expect(r.error).toContain("env:");
    expect((db.settings.get("ig_access_token") as { access_token: string }).access_token).toBe("dead");
    expect(db.events.map(e => e.event)).toEqual(["token_refresh_failed"]);
  });

  it("fails with the reason when there is nothing to refresh", async () => {
    const f = meta(["x"]);
    const r = await refreshToken(memoryStore(), f, undefined, NOW);
    expect(r.ok).toBe(false);
    expect(r.error).toContain("INSTAGRAM_ACCESS_TOKEN");
    expect(f.asked).toEqual([]);
  });

  it("never writes a token value into the events or the result", async () => {
    const db = memoryStore({ settings: stored("secret-stored") });
    const r = await refreshToken(db, meta(["secret-env"]), "secret-env", NOW);
    const text = JSON.stringify(r) + JSON.stringify(db.events);
    expect(text).not.toContain("secret-env");
    expect(text).not.toContain("secret-stored");
    expect(text).not.toContain("fresh-from");
  });
});
