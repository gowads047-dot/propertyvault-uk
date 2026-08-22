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

const insert = vi.fn();
const send = vi.fn();

vi.mock("@supabase/supabase-js", () => ({
  createClient: () => ({ from: () => ({ insert }) }),
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
  send.mockReset().mockResolvedValue({ error: null });
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://stub.supabase.co";
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "stub-anon-key";
  process.env.RESEND_API_KEY = "re_stub_key";
});

afterEach(() => {
  delete process.env.RESEND_API_KEY;
});

describe("a missing RESEND_API_KEY must not cost us the subscriber", () => {
  it("still saves the subscriber and returns ok", async () => {
    delete process.env.RESEND_API_KEY;

    const res = await post(valid);

    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ ok: true });
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

describe("the happy path still works", () => {
  it("saves the subscriber and sends the pack to the normalised address", async () => {
    const res = await post(valid);

    expect(res.status).toBe(200);
    expect(insert).toHaveBeenCalledTimes(1);
    expect(send).toHaveBeenCalledTimes(1);
    expect(send.mock.calls[0][0]).toMatchObject({ to: "test.person@example.com" });
  });

  it("treats a duplicate email as success, since the pack is still worth sending", async () => {
    insert.mockResolvedValue({ error: { code: "23505" } });

    const res = await post(valid);

    expect(res.status).toBe(200);
    expect(send).toHaveBeenCalledTimes(1);
  });

  it("surfaces a genuine database failure", async () => {
    insert.mockResolvedValue({ error: { code: "42501", message: "denied" } });

    const res = await post(valid);

    expect(res.status).toBe(500);
    expect(send).not.toHaveBeenCalled();
  });
});
