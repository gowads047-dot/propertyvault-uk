import { describe, it, expect, vi } from "vitest";
import {
  consume, consumeAll, bucketFor, callerKey, RULES,
  type RateLimitStore, type RateLimitRule,
} from "./rate-limit";

/** An in-memory store, so the limiter can be tested without a database. */
function memoryStore(): RateLimitStore & { counts: Map<string, number> } {
  const counts = new Map<string, number>();
  return {
    counts,
    async increment(bucket) {
      const n = (counts.get(bucket) ?? 0) + 1;
      counts.set(bucket, n);
      return n;
    },
  };
}

const brokenStore: RateLimitStore = {
  async increment() { throw new Error("store unreachable"); },
};

const rule: RateLimitRule = { name: "test", limit: 3, windowSeconds: 60 };
const NOW = new Date("2026-09-02T12:00:00Z");

describe("identifying the caller", () => {
  it("takes the left-most forwarded address", () => {
    const h = new Headers({ "x-forwarded-for": "1.2.3.4, 10.0.0.1, 10.0.0.2" });
    expect(callerKey(h)).toBe("1.2.3.4");
  });

  it("falls back to x-real-ip", () => {
    expect(callerKey(new Headers({ "x-real-ip": "5.6.7.8" }))).toBe("5.6.7.8");
  });

  // An absent header must not be a way round the limit.
  it("buckets unidentified callers together rather than exempting them", () => {
    expect(callerKey(new Headers())).toBe("unknown");
    expect(callerKey(new Headers({ "x-forwarded-for": "  " }))).toBe("unknown");
  });
});

describe("windows", () => {
  it("keeps the same bucket inside a window", () => {
    const a = bucketFor(rule, "1.2.3.4", new Date("2026-09-02T12:00:00Z"));
    const b = bucketFor(rule, "1.2.3.4", new Date("2026-09-02T12:00:59Z"));
    expect(a).toBe(b);
  });

  it("moves to a new bucket in the next window", () => {
    const a = bucketFor(rule, "1.2.3.4", new Date("2026-09-02T12:00:00Z"));
    const b = bucketFor(rule, "1.2.3.4", new Date("2026-09-02T12:01:30Z"));
    expect(a).not.toBe(b);
  });

  it("gives different callers different buckets", () => {
    expect(bucketFor(rule, "1.1.1.1", NOW)).not.toBe(bucketFor(rule, "2.2.2.2", NOW));
  });
});

describe("consuming", () => {
  it("allows up to the limit and denies past it", async () => {
    const store = memoryStore();
    for (let i = 1; i <= 3; i++) {
      const r = await consume(store, rule, "1.2.3.4", NOW);
      expect(r.allowed, `call ${i}`).toBe(true);
      expect(r.used).toBe(i);
    }
    const over = await consume(store, rule, "1.2.3.4", NOW);
    expect(over.allowed).toBe(false);
    expect(over.used).toBe(4);
  });

  it("does not let one caller spend another's allowance", async () => {
    const store = memoryStore();
    for (let i = 0; i < 5; i++) await consume(store, rule, "1.1.1.1", NOW);
    expect((await consume(store, rule, "2.2.2.2", NOW)).allowed).toBe(true);
  });

  it("resets in the next window", async () => {
    const store = memoryStore();
    for (let i = 0; i < 5; i++) await consume(store, rule, "1.2.3.4", NOW);
    const later = new Date(NOW.getTime() + 61_000);
    expect((await consume(store, rule, "1.2.3.4", later)).allowed).toBe(true);
  });

  // The uncomfortable direction, and the deliberate one: what is being
  // protected is uncapped spend on someone else's API.
  it("denies when the store is unreachable, and says it is degraded", async () => {
    const r = await consume(brokenStore, rule, "1.2.3.4", NOW);
    expect(r.allowed).toBe(false);
    expect(r.degraded).toBe(true);
  });
});

describe("several rules at once", () => {
  it("denies when any rule denies", async () => {
    const store = memoryStore();
    const perCaller: RateLimitRule = { name: "a", limit: 10, windowSeconds: 60 };
    const global: RateLimitRule = { name: "b", limit: 2, windowSeconds: 60 };

    await consumeAll(store, [{ rule: perCaller, caller: "x" }, { rule: global, caller: "all" }], NOW);
    await consumeAll(store, [{ rule: perCaller, caller: "x" }, { rule: global, caller: "all" }], NOW);
    const third = await consumeAll(store, [
      { rule: perCaller, caller: "x" }, { rule: global, caller: "all" },
    ], NOW);

    expect(third.allowed).toBe(false);
    expect(third.results[0].allowed).toBe(true);   // per-caller still fine
    expect(third.results[1].allowed).toBe(false);  // global is what stopped it
  });

  // Otherwise a caller could tell which limit they hit by watching the counters.
  it("consumes every rule even once one has denied", async () => {
    const store = memoryStore();
    const a: RateLimitRule = { name: "a", limit: 0, windowSeconds: 60 };
    const b: RateLimitRule = { name: "b", limit: 10, windowSeconds: 60 };
    await consumeAll(store, [{ rule: a, caller: "x" }, { rule: b, caller: "x" }], NOW);
    expect(store.counts.get(bucketFor(b, "x", NOW))).toBe(1);
  });

  it("a spread of IPs still hits the global limit", async () => {
    const store = memoryStore();
    const global: RateLimitRule = { name: "g", limit: 3, windowSeconds: 60 };
    for (let i = 0; i < 3; i++) {
      await consume(store, global, "all", NOW);
    }
    // A brand new IP, but the global bucket is spent.
    expect((await consume(store, global, "all", NOW)).allowed).toBe(false);
  });
});

describe("the configured rules", () => {
  it("limits a single caller to something generous but not scrapeable", () => {
    expect(RULES.aiVerdictPerCaller.limit).toBeLessThanOrEqual(20);
    expect(RULES.aiVerdictPerCaller.windowSeconds).toBe(3600);
  });

  it("bounds the daily bill regardless of how many addresses are used", () => {
    expect(RULES.aiVerdictGlobal.windowSeconds).toBe(86_400);
    expect(RULES.aiVerdictGlobal.limit).toBeGreaterThan(RULES.aiVerdictPerCaller.limit);
  });
});

describe("the postgres store", () => {
  it("throws on a non-2xx, so the limiter fails closed", async () => {
    const fetchMock = vi.fn(async () => ({ ok: false, status: 404, json: async () => null }));
    vi.stubGlobal("fetch", fetchMock);
    const { supabaseStore } = await import("./rate-limit");
    await expect(supabaseStore("https://x", "k").increment("b", 60)).rejects.toThrow();
    vi.unstubAllGlobals();
  });

  it("throws when the function returns something that is not a count", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => ({ ok: true, status: 200, json: async () => null })));
    const { supabaseStore } = await import("./rate-limit");
    await expect(supabaseStore("https://x", "k").increment("b", 60)).rejects.toThrow();
    vi.unstubAllGlobals();
  });
});
