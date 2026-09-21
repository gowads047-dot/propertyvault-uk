import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const verified = vi.fn();
vi.mock("@/lib/server-auth", () => ({ getVerifiedUser: (req: Request) => verified(req) }));
const maybeSingle = vi.fn();
vi.mock("@supabase/supabase-js", () => ({
  createClient: () => ({ from: () => ({ select: () => ({ eq: () => ({ maybeSingle }) }) }) }),
}));

beforeEach(() => {
  vi.resetModules();
  verified.mockReset();
  maybeSingle.mockReset();
  process.env.ADMIN_EMAIL = "landlord@email.com";
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://stub.supabase.co";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "stub-service-key";
});
afterEach(() => {
  delete process.env.ADMIN_EMAIL;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
});

const req = new Request("https://www.propertyvaultuk.co.uk/api/rentura/chat/", { method: "POST" });

describe("requireRenturaMember", () => {
  it("refuses without a session, before reading anything", async () => {
    verified.mockResolvedValue(null);
    const { requireRenturaMember } = await import("./rentura-member");
    expect(await requireRenturaMember(req)).toMatchObject({ ok: false, status: 401 });
    expect(maybeSingle).not.toHaveBeenCalled();
  });

  it("lets the admin through without a subscription row", async () => {
    verified.mockResolvedValue({ id: "owner", email: "landlord@email.com" });
    const { requireRenturaMember } = await import("./rentura-member");
    expect(await requireRenturaMember(req)).toMatchObject({ ok: true });
    expect(maybeSingle).not.toHaveBeenCalled();
  });

  it("lets a trial or paying member through and answers 402 to the row join creates before Stripe", async () => {
    verified.mockResolvedValue({ id: "m1", email: "tenant@email.com" });
    const { requireRenturaMember } = await import("./rentura-member");
    maybeSingle.mockResolvedValue({ data: { status: "trialing", access_until: null }, error: null });
    expect(await requireRenturaMember(req)).toMatchObject({ ok: true });
    maybeSingle.mockResolvedValue({ data: { status: "pending", access_until: null }, error: null });
    expect(await requireRenturaMember(req)).toMatchObject({ ok: false, status: 402 });
    maybeSingle.mockResolvedValue({ data: null, error: null });
    expect(await requireRenturaMember(req)).toMatchObject({ ok: false, status: 402 });
  });

  it("does not lock a member out when the subscription read fails", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    verified.mockResolvedValue({ id: "m1", email: "tenant@email.com" });
    maybeSingle.mockResolvedValue({ data: null, error: { message: "connection refused" } });
    const { requireRenturaMember } = await import("./rentura-member");
    expect(await requireRenturaMember(req)).toMatchObject({ ok: true });
    spy.mockRestore();
  });
});
