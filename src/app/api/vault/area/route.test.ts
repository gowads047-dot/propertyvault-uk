import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

const ENV = ["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"] as const;
let saved: Record<string, string | undefined> = {};

const post = async (body: unknown) => {
  const { POST } = await import("./route");
  return POST(new Request("https://x/api/vault/area/", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": "1.2.3.4" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  }));
};

beforeEach(() => {
  vi.resetModules();
  saved = Object.fromEntries(ENV.map(k => [k, process.env[k]]));
  // No store configured: the lookup is a free proxy, so it must still work
  // without a limiter rather than failing closed the way the paid routes do.
  for (const k of ENV) delete process.env[k];
  vi.stubGlobal("fetch", vi.fn(async () => ({ ok: false, status: 404, json: async () => null })));
});

afterEach(() => {
  for (const k of ENV) {
    if (saved[k] === undefined) delete process.env[k]; else process.env[k] = saved[k];
  }
  vi.unstubAllGlobals();
});

describe("input", () => {
  it("rejects a body that is not JSON", async () => {
    expect((await post("not json")).status).toBe(400);
  });

  it("rejects a missing or non-string postcode", async () => {
    for (const bad of [{}, { postcode: 42 }, { postcode: null }]) {
      expect((await post(bad)).status, JSON.stringify(bad)).toBe(400);
    }
  });

  it("rejects something far too long to be a postcode", async () => {
    expect((await post({ postcode: "A".repeat(200) })).status).toBe(400);
  });
});

describe("when a postcode returns nothing", () => {
  // The important behaviour: an unknown postcode is a successful lookup that
  // found nothing, not an error — and it must say "missing" rather than
  // quietly omitting the field, which would read as "checked, and fine".
  it("returns 200 with the field marked missing", async () => {
    const res = await post({ postcode: "ZZ1 1ZZ" });
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.data.found).toBe(false);
    expect(body.evidence[0].state).toBe("missing");
    expect(body.evidence[0].valueNum).toBeUndefined();
  });

  it("never invents a median", async () => {
    const body = await (await post({ postcode: "ZZ1 1ZZ" })).json();
    expect(body.data.medianSoldPrice ?? null).toBeNull();
  });
});
