import { describe, it, expect } from "vitest";
import { pickToken, refreshInstagramToken } from "./token";
import type { Fetcher } from "../instagram";

const NOW = new Date("2026-09-07T06:00:00Z");
const future = "2026-11-01T00:00:00Z";
const past = "2026-09-01T00:00:00Z";

describe("choosing a token", () => {
  it("prefers the stored token when it is live", () => {
    const r = pickToken({ access_token: "stored", expires_at: future, refreshed_at: null }, "env", NOW);
    expect(r).toMatchObject({ token: "stored", source: "settings", expiresAt: future });
  });

  it("falls back to the environment when nothing is stored", () => {
    expect(pickToken(null, "env", NOW)).toMatchObject({ token: "env", source: "env" });
    expect(pickToken({}, "env", NOW)).toMatchObject({ token: "env", source: "env" });
    expect(pickToken({ access_token: "" }, "env", NOW)).toMatchObject({ token: "env", source: "env" });
  });

  it("accepts a bare string somebody pasted into the settings row", () => {
    expect(pickToken("pasted", undefined, NOW)).toMatchObject({ token: "pasted", source: "settings" });
  });

  // The whole reason the first cron posted nothing for a week.
  it("is loud when both are absent", () => {
    const r = pickToken(null, undefined, NOW);
    expect("error" in r).toBe(true);
    if ("error" in r) {
      expect(r.error).toContain("INSTAGRAM_ACCESS_TOKEN");
      expect(r.error).toContain("nothing can be posted");
    }
  });

  it("treats a blank environment value as absent", () => {
    expect("error" in pickToken(null, "   ", NOW)).toBe(true);
  });

  it("uses the environment token when the stored one has expired, and says so", () => {
    const r = pickToken({ access_token: "stale", expires_at: past, refreshed_at: null }, "env", NOW);
    expect(r).toMatchObject({ token: "env", source: "env" });
    expect("warning" in r && r.warning).toContain("expired");
  });

  it("still returns an expired stored token when there is nothing else, with a warning", () => {
    const r = pickToken({ access_token: "stale", expires_at: past, refreshed_at: null }, undefined, NOW);
    expect(r).toMatchObject({ token: "stale", source: "settings" });
    expect("warning" in r && r.warning).toContain("not set");
  });
});

describe("refreshing", () => {
  const ok = (body: unknown) => ({ ok: true, status: 200, json: async () => body });

  it("asks Meta with the ig_refresh_token grant and stores the answer with an expiry", async () => {
    let seen = "";
    const f: Fetcher = async url => { seen = url; return ok({ access_token: "new", token_type: "bearer", expires_in: 5_184_000 }); };
    const r = await refreshInstagramToken("old", f, NOW);
    expect(seen).toContain("graph.instagram.com/refresh_access_token");
    expect(seen).toContain("grant_type=ig_refresh_token");
    expect(seen).toContain("access_token=old");
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.stored.access_token).toBe("new");
      expect(r.stored.refreshed_at).toBe(NOW.toISOString());
      // Sixty days, to the second.
      expect(r.stored.expires_at).toBe(new Date(NOW.getTime() + 5_184_000_000).toISOString());
    }
  });

  it("surfaces Meta's error message and code", async () => {
    const f: Fetcher = async () => ({
      ok: false, status: 400,
      json: async () => ({ error: { message: "Error validating access token", code: 190 } }),
    });
    const r = await refreshInstagramToken("old", f, NOW);
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.error).toContain("Error validating access token");
      expect(r.error).toContain("code 190");
    }
  });

  it("treats a 200 without a token as a failure rather than storing nothing", async () => {
    const f: Fetcher = async () => ok({ token_type: "bearer" });
    const r = await refreshInstagramToken("old", f, NOW);
    expect(r.ok).toBe(false);
  });

  it("copes with a body that is not JSON", async () => {
    const f: Fetcher = async () => ({ ok: false, status: 502, json: async () => { throw new Error("html"); } });
    const r = await refreshInstagramToken("old", f, NOW);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toContain("502");
  });
});
