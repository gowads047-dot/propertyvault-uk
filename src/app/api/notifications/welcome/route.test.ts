import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const verified = vi.fn();
vi.mock("@/lib/server-auth", () => ({ getVerifiedUser: (req: Request) => verified(req) }));

let sent: { to: string; subject: string; html: string }[] = [];

beforeEach(() => {
  vi.resetModules();
  sent = [];
  verified.mockReset().mockResolvedValue({ id: "user-1", email: "landlord@email.com" });
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://stub.supabase.co";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "stub-service-key";
  process.env.RESEND_API_KEY = "re_stub";
  vi.stubGlobal("fetch", vi.fn(async (url: string, init?: RequestInit) => {
    // Resend's API host, spelt so the reply-to sweep does not take this mock for a sender.
    if (String(url).includes("resend") && String(url).endsWith("/emails")) { sent.push(JSON.parse(String(init?.body))); return new Response("{}", { status: 200 }); }
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
  new Request("https://www.propertyvaultuk.co.uk/api/notifications/welcome/", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "Bearer t" },
    body: JSON.stringify(body),
  });

describe("/api/notifications/welcome", () => {
  it("sends to the session's address, not the body's, with the name escaped", async () => {
    const { POST } = await import("./route");
    const res = await POST(post({ type: "rentura_welcome", email: "new@email.com", name: "<b>Sam</b>" }));
    expect(res.status).toBe(200);
    expect(sent).toHaveLength(1);
    expect(sent[0].to).toBe("landlord@email.com");
    expect(sent[0].html).toContain("Welcome, &lt;b&gt;Sam&lt;/b&gt;.");
    expect(sent[0].html).not.toContain("<b>Sam</b>");
  });

  it("refuses without a session and sends nothing", async () => {
    verified.mockResolvedValue(null);
    const { POST } = await import("./route");
    expect((await POST(post({ type: "rentura_welcome", email: "new@email.com" }))).status).toBe(401);
    expect(sent).toHaveLength(0);
  });
});
