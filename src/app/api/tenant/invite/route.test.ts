import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const propertyLookup = vi.fn();
const upsert = vi.fn();
vi.mock("@supabase/supabase-js", () => ({
  createClient: () => ({
    from: (table: string) => ({
      select: () => ({ eq: () => ({ eq: () => ({ maybeSingle: () => propertyLookup(table) }) }) }),
      upsert: (row: unknown, opts: unknown) => { upsert(row, opts); return Promise.resolve({ error: null }); },
    }),
  }),
}));

const verified = vi.fn();
vi.mock("@/lib/server-auth", () => ({ getVerifiedUser: (req: Request) => verified(req) }));

let sent: { to: string; subject: string; html: string }[] = [];

beforeEach(() => {
  vi.resetModules();
  sent = [];
  upsert.mockReset();
  propertyLookup.mockReset().mockResolvedValue({ data: { id: "prop-1" } });
  verified.mockReset().mockResolvedValue({ id: "landlord-1", email: "landlord@email.com" });
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://stub.supabase.co";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "stub-service-key";
  process.env.RESEND_API_KEY = "re_stub";
  vi.stubGlobal("fetch", vi.fn(async (url: string, init?: RequestInit) => {
    if (String(url).includes("api.resend.com")) { sent.push(JSON.parse(String(init?.body))); return new Response("{}", { status: 200 }); }
    // The limiter reads its counter over PostgREST; one use of the allowance.
    return new Response("1", { status: 200 });
  }));
});
afterEach(() => {
  vi.unstubAllGlobals();
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  delete process.env.RESEND_API_KEY;
});

const post = (body: unknown) =>
  new Request("https://www.propertyvaultuk.co.uk/api/tenant/invite/", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "Bearer t" },
    body: JSON.stringify(body),
  });

describe("/api/tenant/invite", () => {
  it("invites under the session's landlord id, for the landlord's own property, with the name escaped", async () => {
    const { POST } = await import("./route");
    const res = await POST(post({
      tenantEmail: "tenant@email.com",
      tenantName: "<img src=x onerror=alert(1)> Sam",
      propertyId: "prop-1",
      propertyAddress: "12 High St, Derby",
      landlordUserId: "someone-else", // ignored
    }));
    expect(res.status).toBe(200);
    const row = upsert.mock.calls[0][0] as { landlord_user_id: string; property_id: string };
    expect(row.landlord_user_id).toBe("landlord-1");
    expect(row.property_id).toBe("prop-1");
    expect(sent).toHaveLength(1);
    expect(sent[0].to).toBe("tenant@email.com");
    expect(sent[0].html).not.toContain("<img");
    expect(sent[0].html).toContain("&lt;img");
  });

  it("refuses without a session, and refuses a property that is not the landlord's — no email either way", async () => {
    const { POST } = await import("./route");
    verified.mockResolvedValue(null);
    expect((await POST(post({ tenantEmail: "tenant@email.com", propertyId: "prop-1" }))).status).toBe(401);
    verified.mockResolvedValue({ id: "landlord-1", email: null });
    propertyLookup.mockResolvedValue({ data: null });
    expect((await POST(post({ tenantEmail: "tenant@email.com", propertyId: "not-mine" }))).status).toBe(403);
    expect(upsert).not.toHaveBeenCalled();
    expect(sent).toHaveLength(0);
  });
});
