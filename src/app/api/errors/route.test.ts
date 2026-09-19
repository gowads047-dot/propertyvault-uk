import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const record = vi.fn();
vi.mock("@/lib/error-report", async importOriginal => ({
  ...(await importOriginal<typeof import("@/lib/error-report")>()),
  recordError: (r: unknown) => record(r),
}));

const post = async (body: unknown, raw = false) => {
  const { POST } = await import("./route");
  return POST(new Request("https://www.propertyvaultuk.co.uk/api/errors/", {
    method: "POST",
    headers: { "content-type": "application/json", "user-agent": "TestBrowser/1" },
    body: raw ? (body as string) : JSON.stringify(body),
  }));
};

beforeEach(() => {
  vi.resetModules();
  record.mockReset().mockResolvedValue(true);
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://stub.supabase.co";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "stub-service-key";
  vi.stubGlobal("fetch", vi.fn(async () => new Response("1", { status: 200 })));
});
afterEach(() => {
  vi.unstubAllGlobals();
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
});

describe("/api/errors", () => {
  it("records a browser error with the page, kind and user agent, and answers 204", async () => {
    const res = await post({ message: "TypeError: x is not a function", stack: "at a.js:1", path: "/calculators/", kind: "window.onerror" });
    expect(res.status).toBe(204);
    expect(record.mock.calls[0][0]).toMatchObject({
      side: "client", message: "TypeError: x is not a function", stack: "at a.js:1", path: "/calculators/", route_type: "window.onerror", user_agent: "TestBrowser/1",
    });
  });

  it("requires a message and a readable body", async () => {
    expect((await post({ stack: "only" })).status).toBe(400);
    expect((await post("{not json", true)).status).toBe(400);
    expect(record).not.toHaveBeenCalled();
  });

  it("answers 503 when the table is not there to write to", async () => {
    record.mockResolvedValue(false);
    expect((await post({ message: "x" })).status).toBe(503);
  });

  it("is rate limited", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("31", { status: 200 })));
    expect((await post({ message: "x" })).status).toBe(429);
    expect(record).not.toHaveBeenCalled();
  });
});
