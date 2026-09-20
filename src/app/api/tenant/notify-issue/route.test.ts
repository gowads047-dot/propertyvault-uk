import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const maybeSingle = vi.fn();
const inserted: { table: string; row: Record<string, unknown> }[] = [];
vi.mock("@supabase/supabase-js", () => ({
  createClient: () => ({
    from: (table: string) => ({
      select: () => ({ eq: () => ({ eq: () => ({ maybeSingle: () => maybeSingle(table) }) }) }),
      insert: (row: Record<string, unknown>) => {
        inserted.push({ table, row });
        return { select: () => ({ single: async () => ({ data: { token: "tok-1", ...row } }) }) };
      },
    }),
  }),
}));

const verified = vi.fn();
vi.mock("@/lib/server-auth", () => ({ getVerifiedUser: (req: Request) => verified(req) }));

let sent: { to: string; subject: string; html: string }[] = [];

beforeEach(() => {
  vi.resetModules();
  sent = [];
  inserted.length = 0;
  maybeSingle.mockReset().mockImplementation(async (table: string) =>
    table === "rentura_properties" ? { data: { id: "prop-1" } } : { data: { token: "tok-existing", accepted_at: null } });
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
  new Request("https://www.propertyvaultuk.co.uk/api/tenant/notify-issue/", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "Bearer t" },
    body: JSON.stringify(body),
  });

describe("/api/tenant/notify-issue", () => {
  it("logs the issue under the session's landlord and escapes the title in the email", async () => {
    const { POST } = await import("./route");
    const res = await POST(post({
      tenantEmail: "Tenant@Email.com",
      tenantName: "Sam Smith",
      propertyId: "prop-1",
      propertyAddress: "12 High St, Derby",
      landlordUserId: "someone-else", // ignored
      issueTitle: 'Boiler <a href="https://evil.example">click</a>',
      issueDescription: "No hot water & cold radiators",
    }));
    expect(res.status).toBe(200);
    const issue = inserted.find((i) => i.table === "tenant_issues")!.row;
    expect(issue.landlord_user_id).toBe("landlord-1");
    expect(sent).toHaveLength(1);
    expect(sent[0].to).toBe("tenant@email.com");
    expect(sent[0].html).not.toContain("<a href=\"https://evil.example\">");
    expect(sent[0].html).toContain("&lt;a href=");
    expect(sent[0].html).toContain("No hot water &amp; cold radiators");
    expect(sent[0].subject).not.toContain("&lt;");
  });

  it("refuses without a session, a property that is not the landlord's, or a recipient that is not one address", async () => {
    const { POST } = await import("./route");
    const ok = { tenantEmail: "tenant@email.com", propertyId: "prop-1", issueTitle: "Boiler" };
    verified.mockResolvedValue(null);
    expect((await POST(post(ok))).status).toBe(401);
    verified.mockResolvedValue({ id: "landlord-1", email: null });
    maybeSingle.mockResolvedValue({ data: null });
    expect((await POST(post(ok))).status).toBe(403);
    expect((await POST(post({ ...ok, tenantEmail: "a@b.com, c@d.com" }))).status).toBe(400);
    expect(inserted).toHaveLength(0);
    expect(sent).toHaveLength(0);
  });
});
