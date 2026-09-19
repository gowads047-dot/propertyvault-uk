import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

/**
 * Regression tests for the starter-pack signup endpoint.
 *
 * The live route returned an opaque 500 with an empty body for every request,
 * including ones that should have been rejected as invalid. Cause: the handler
 * built its Resend client on its third line, and new Resend() throws when
 * RESEND_API_KEY is unset — which it was, in production. The throw landed
 * before both the input validation and the Supabase insert, so every signup
 * was lost with no row written and no error surfaced.
 *
 * The route already carried the comment "Still return ok — subscriber is saved
 * even if email fails". These tests hold the code to that contract.
 */

// The route reads the address first (select → eq → maybeSingle resolves to
// `existing`), then inserts a new row or updates an existing one.
const insert = vi.fn();
const update = vi.fn();
const existing = vi.fn();
const send = vi.fn();

vi.mock("@supabase/supabase-js", () => ({
  createClient: () => ({
    from: () => ({
      select: () => ({ eq: () => ({ maybeSingle: () => existing() }) }),
      insert: (row: unknown) => insert(row),
      update: (patch: unknown) => ({ eq: (col: string, val: unknown) => update(patch, col, val) }),
    }),
  }),
}));

vi.mock("resend", () => ({
  Resend: class {
    emails = { send };
    constructor(key?: string) {
      // Mirrors the real constructor, which is where the production crash was.
      if (!key && !process.env.RESEND_API_KEY) throw new Error("Missing API key.");
    }
  },
}));

vi.mock("@/emails/StarterPackEmail", () => ({ default: () => null }));

const post = async (body: unknown) => {
  const { POST } = await import("./route");
  return POST(new Request("https://www.propertyvaultuk.co.uk/api/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }));
};

const valid = { name: "Test Person", email: "Test.Person@Example.com", user_type: "landlord" };

beforeEach(() => {
  vi.resetModules();
  insert.mockReset().mockResolvedValue({ error: null });
  update.mockReset().mockResolvedValue({ error: null });
  existing.mockReset().mockResolvedValue({ data: null, error: null });
  send.mockReset().mockResolvedValue({ error: null });
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://stub.supabase.co";
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "stub-anon-key";
  // The rate limiter reads its counter through PostgREST with the service key,
  // and fails closed when it cannot. Without this the route refuses every
  // request with a 503 and none of the tests below reach the code they test.
  process.env.SUPABASE_SERVICE_ROLE_KEY = "stub-service-key";
  process.env.RESEND_API_KEY = "re_stub_key";
  // One use of the hourly allowance, so the limiter permits the request.
  vi.stubGlobal("fetch", vi.fn(async () => new Response("1", { status: 200 })));
});

afterEach(() => {
  vi.unstubAllGlobals();
  delete process.env.RESEND_API_KEY;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  delete process.env.CRON_SECRET;
  delete process.env.UNSUBSCRIBE_SECRET;
});

describe("a missing RESEND_API_KEY must not cost us the subscriber", () => {
  it("still saves the subscriber and returns ok", async () => {
    delete process.env.RESEND_API_KEY;

    const res = await post(valid);

    expect(res.status).toBe(200);
    // Saved, but honest that nothing was sent — the UI must not say
    // "check your inbox" when no email left the building.
    await expect(res.json()).resolves.toEqual({ ok: true, emailed: false });
    expect(insert).toHaveBeenCalledTimes(1);
    expect(insert.mock.calls[0][0]).toMatchObject({
      name: "Test Person",
      email: "test.person@example.com",
      user_type: "landlord",
      source: "popup",
    });
  });

  it("still validates input rather than crashing first", async () => {
    delete process.env.RESEND_API_KEY;

    const missing = await post({ email: "a@b.com" });
    expect(missing.status).toBe(400);

    const malformed = await post({ name: "T", email: "not-an-email" });
    expect(malformed.status).toBe(400);

    expect(insert).not.toHaveBeenCalled();
  });
});

describe("a Resend outage must not cost us the subscriber either", () => {
  it("returns ok when the send call reports an error", async () => {
    send.mockResolvedValue({ error: { message: "rate limited" } });

    const res = await post(valid);

    expect(res.status).toBe(200);
    expect(insert).toHaveBeenCalledTimes(1);
  });

  it("returns ok when the send call throws outright", async () => {
    send.mockRejectedValue(new Error("network down"));

    const res = await post(valid);

    expect(res.status).toBe(200);
    expect(insert).toHaveBeenCalledTimes(1);
  });
});

describe("the response says whether the pack actually sent", () => {
  it("reports emailed:true when the send succeeds", async () => {
    const res = await post(valid);
    await expect(res.json()).resolves.toEqual({ ok: true, emailed: true });
  });

  it("reports emailed:false when Resend returns an error", async () => {
    send.mockResolvedValue({ error: { message: "rate limited" } });
    const res = await post(valid);
    await expect(res.json()).resolves.toEqual({ ok: true, emailed: false });
  });

  it("reports emailed:false when the send throws", async () => {
    send.mockRejectedValue(new Error("network down"));
    const res = await post(valid);
    await expect(res.json()).resolves.toEqual({ ok: true, emailed: false });
  });
});

describe("the happy path still works", () => {
  it("saves the subscriber and sends the pack to the normalised address", async () => {
    const res = await post(valid);

    expect(res.status).toBe(200);
    expect(insert).toHaveBeenCalledTimes(1);
    expect(send).toHaveBeenCalledTimes(1);
    expect(send.mock.calls[0][0]).toMatchObject({ to: "test.person@example.com" });
  });

  it("sends the pack again to an address that is already on the list, without rewriting the row", async () => {
    existing.mockResolvedValue({ data: { id: "row-1", unsubscribed_at: null }, error: null });

    const res = await post({ ...valid, utm_source: "x" });

    expect(res.status).toBe(200);
    expect(insert).not.toHaveBeenCalled();
    // Only the attribution moves; name and consent stay as the subscriber left them.
    expect(update.mock.calls[0][0]).toEqual({ attribution: { utm_source: "x" } });
    expect(send).toHaveBeenCalledTimes(1);
  });

  it("does not put an unsubscribed address back on the list, or email it, and gives nothing away", async () => {
    existing.mockResolvedValue({ data: { id: "row-1", unsubscribed_at: "2026-09-01T00:00:00Z" }, error: null });

    const res = await post(valid);

    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ ok: true, emailed: true });
    expect(insert).not.toHaveBeenCalled();
    expect(update).not.toHaveBeenCalled();
    expect(send).not.toHaveBeenCalled();
  });

  it("stores the attribution the form carried", async () => {
    await post({ ...valid, utm_source: "instagram", utm_campaign: "reel-12", landing_page: "/guaranteed-rent/" });

    expect(insert.mock.calls[0][0]).toMatchObject({
      attribution: { utm_source: "instagram", utm_campaign: "reel-12", landing_page: "/guaranteed-rent/" },
    });
  });

  it("falls back to the columns the table has when the migration has not been run", async () => {
    existing.mockResolvedValue({ data: null, error: { code: "42703", message: "column unsubscribed_at does not exist" } });

    const res = await post({ ...valid, utm_source: "x" });

    expect(res.status).toBe(200);
    expect(insert).toHaveBeenCalledTimes(1);
    expect(insert.mock.calls[0][0]).not.toHaveProperty("attribution");
  });

  it("treats a duplicate from a simultaneous submission as success", async () => {
    insert.mockResolvedValue({ error: { code: "23505", message: "duplicate" } });

    const res = await post(valid);

    expect(res.status).toBe(200);
    expect(send).toHaveBeenCalledTimes(1);
  });

  it("puts one-click unsubscribe headers and a footer link on the email", async () => {
    process.env.CRON_SECRET = "a-secret-long-enough-to-sign-with";

    await post(valid);

    const msg = send.mock.calls[0][0];
    expect(msg.headers["List-Unsubscribe-Post"]).toBe("List-Unsubscribe=One-Click");
    expect(msg.headers["List-Unsubscribe"]).toMatch(/^<https:\/\/www\.propertyvaultuk\.co\.uk\/api\/unsubscribe\/\?e=test\.person%40example\.com&t=[A-Za-z0-9_-]+>$/);
  });

  it("sends no unsubscribe link it cannot sign", async () => {
    delete process.env.CRON_SECRET;
    delete process.env.UNSUBSCRIBE_SECRET;

    await post(valid);

    expect(send.mock.calls[0][0].headers).toEqual({});
  });

  it("surfaces a genuine database failure", async () => {
    insert.mockResolvedValue({ error: { code: "42501", message: "denied" } });

    const res = await post(valid);

    expect(res.status).toBe(500);
    expect(send).not.toHaveBeenCalled();
  });
});
