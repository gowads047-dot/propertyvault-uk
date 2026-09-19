import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { verifyTurnstile, callerIp } from "./turnstile";

afterEach(() => {
  vi.unstubAllGlobals();
  delete process.env.TURNSTILE_SECRET_KEY;
});

describe("verifyTurnstile", () => {
  it("is a no-op until a secret is configured", async () => {
    expect(await verifyTurnstile(undefined)).toEqual({ ok: true, skipped: true });
    expect(await verifyTurnstile("anything")).toEqual({ ok: true, skipped: true });
  });

  describe("with a secret", () => {
    beforeEach(() => {
      process.env.TURNSTILE_SECRET_KEY = "1x0000000000000000000000000000000AA";
    });

    it("refuses a missing token without calling Cloudflare", async () => {
      const fetchMock = vi.fn();
      vi.stubGlobal("fetch", fetchMock);
      expect(await verifyTurnstile(undefined)).toEqual({ ok: false, reason: "missing-token" });
      expect(await verifyTurnstile("")).toEqual({ ok: false, reason: "missing-token" });
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it("asks Cloudflare, sending the secret, token and caller address", async () => {
      const fetchMock = vi.fn(async () => new Response(JSON.stringify({ success: true }), { status: 200 }));
      vi.stubGlobal("fetch", fetchMock);
      expect(await verifyTurnstile("tok-123", "203.0.113.9")).toEqual({ ok: true, skipped: false });
      const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
      expect(url).toBe("https://challenges.cloudflare.com/turnstile/v0/siteverify");
      const sent = new URLSearchParams(init.body as URLSearchParams);
      expect(sent.get("secret")).toBe("1x0000000000000000000000000000000AA");
      expect(sent.get("response")).toBe("tok-123");
      expect(sent.get("remoteip")).toBe("203.0.113.9");
    });

    it("relays Cloudflare's refusal", async () => {
      vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({ success: false, "error-codes": ["timeout-or-duplicate"] }))));
      expect(await verifyTurnstile("stale")).toEqual({ ok: false, reason: "timeout-or-duplicate" });
    });

    it("fails closed when Cloudflare cannot be reached", async () => {
      vi.stubGlobal("fetch", vi.fn(async () => { throw new Error("ECONNRESET"); }));
      expect(await verifyTurnstile("tok")).toEqual({ ok: false, reason: "verify-unavailable" });
    });
  });
});

describe("callerIp", () => {
  it("takes the first forwarded address", () => {
    expect(callerIp(new Request("https://x/", { headers: { "x-forwarded-for": "203.0.113.9, 10.0.0.1" } }))).toBe("203.0.113.9");
    expect(callerIp(new Request("https://x/"))).toBeNull();
  });
});
