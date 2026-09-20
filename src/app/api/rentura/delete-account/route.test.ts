import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const insert = vi.fn();
const update = vi.fn();
vi.mock("@supabase/supabase-js", () => ({
  createClient: () => ({
    from: () => ({
      insert: (row: unknown) => { insert(row); return { select: () => ({ single: async () => ({ data: { id: "msg-1" }, error: null }) }) }; },
      update: (patch: unknown) => { update(patch); return { eq: async () => ({ error: null }) }; },
    }),
  }),
}));

const verified = vi.fn();
vi.mock("@/lib/server-auth", () => ({ getVerifiedUser: (req: Request) => verified(req) }));

const send = vi.fn();
vi.mock("resend", () => ({ Resend: class { emails = { send: (m: unknown) => send(m) }; } }));

beforeEach(() => {
  vi.resetModules();
  insert.mockReset();
  update.mockReset();
  send.mockReset().mockResolvedValue({ error: null });
  verified.mockReset().mockResolvedValue({ id: "user-1", email: "landlord@email.com" });
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://stub.supabase.co";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "stub-service-key";
  process.env.RESEND_API_KEY = "re_stub";
  // The limiter reads its counter over PostgREST; one use of the allowance.
  vi.stubGlobal("fetch", vi.fn(async () => new Response("1", { status: 200 })));
});
afterEach(() => {
  vi.unstubAllGlobals();
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  delete process.env.RESEND_API_KEY;
});

const post = () => new Request("https://www.propertyvaultuk.co.uk/api/rentura/delete-account/", { method: "POST", headers: { Authorization: "Bearer t" } });

describe("/api/rentura/delete-account", () => {
  it("records a verified member's request under its own source and emails the owner", async () => {
    const { POST } = await import("./route");
    const res = await POST(post());
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true, emailed: true });
    const row = insert.mock.calls[0][0] as { source: string; email: string; details: { user_id: string } };
    expect(row.source).toBe("account-deletion");
    expect(row.email).toBe("landlord@email.com");
    expect(row.details.user_id).toBe("user-1");
    const mail = send.mock.calls[0][0] as { to: string; text: string };
    expect(mail.to).toBe("info@propertyvaultuk.co.uk");
    expect(mail.text).toContain("user-1");
    expect(update).toHaveBeenCalledWith({ emailed: true });
  });

  it("refuses without a verified session, so nobody can file a request for someone else", async () => {
    verified.mockResolvedValue(null);
    const { POST } = await import("./route");
    const res = await POST(post());
    expect(res.status).toBe(401);
    expect(insert).not.toHaveBeenCalled();
    expect(send).not.toHaveBeenCalled();
  });

  it("still succeeds, and says so, when the notification email cannot be sent", async () => {
    delete process.env.RESEND_API_KEY;
    const { POST } = await import("./route");
    const res = await POST(post());
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true, emailed: false });
    expect(insert).toHaveBeenCalledTimes(1);
  });
});
