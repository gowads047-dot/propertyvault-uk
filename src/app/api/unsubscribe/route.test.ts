import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { unsubscribeToken } from "@/lib/unsubscribe";

const update = vi.fn();
const ilike = vi.fn();
vi.mock("@supabase/supabase-js", () => ({
  createClient: () => ({ from: () => ({ update: (patch: unknown) => { update(patch); return { ilike }; } }) }),
}));

beforeEach(() => {
  vi.resetModules();
  update.mockReset();
  ilike.mockReset().mockResolvedValue({ error: null });
  process.env.CRON_SECRET = "a-secret-long-enough-to-sign-with";
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://stub.supabase.co";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "stub-service-key";
  // The limiter reads its counter over PostgREST; one use of the allowance.
  vi.stubGlobal("fetch", vi.fn(async () => new Response("1", { status: 200 })));
});
afterEach(() => {
  vi.unstubAllGlobals();
  delete process.env.CRON_SECRET;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
});

const url = (email: string, token: string) =>
  `https://www.propertyvaultuk.co.uk/api/unsubscribe/?${new URLSearchParams({ e: email, t: token })}`;

describe("/api/unsubscribe", () => {
  it("POST with a valid token marks the address unsubscribed (the mail client's one click)", async () => {
    const { POST } = await import("./route");
    const res = await POST(new Request(url("jane@example.com", unsubscribeToken("jane@example.com")!), { method: "POST" }));
    expect(res.status).toBe(200);
    expect(update.mock.calls[0][0]).toHaveProperty("unsubscribed_at");
    expect(ilike).toHaveBeenCalledWith("email", "jane@example.com");
  });

  it("GET with a valid token does the same and shows a page", async () => {
    const { GET } = await import("./route");
    const res = await GET(new Request(url("Jane@Example.com", unsubscribeToken("jane@example.com")!)));
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("text/html");
    expect(await res.text()).toContain("unsubscribed");
    expect(ilike).toHaveBeenCalledWith("email", "jane@example.com");
  });

  it("refuses a forged or missing token without touching the database", async () => {
    const { POST, GET } = await import("./route");
    expect((await POST(new Request(url("jane@example.com", "forged"), { method: "POST" }))).status).toBe(400);
    expect((await GET(new Request("https://www.propertyvaultuk.co.uk/api/unsubscribe/"))).status).toBe(400);
    expect(update).not.toHaveBeenCalled();
  });
});
