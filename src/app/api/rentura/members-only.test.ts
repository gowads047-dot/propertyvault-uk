import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

/**
 * The four Rentura model routes — chat, document scan, two extractors —
 * answer only a signed-in member. They were open to anyone who found the
 * URL: rate-limited, but each call is a paid request and the product they
 * belong to is a subscription.
 */
const verified = vi.fn();
vi.mock("@/lib/server-auth", () => ({ getVerifiedUser: (req: Request) => verified(req) }));
const create = vi.fn();
vi.mock("@anthropic-ai/sdk", () => ({ default: class { messages = { create: (p: unknown) => create(p) }; } }));

beforeEach(() => {
  vi.resetModules();
  create.mockReset();
  verified.mockReset().mockResolvedValue(null);
  process.env.ANTHROPIC_API_KEY = "sk-ant-stub";
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://stub.supabase.co";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "stub-service-key";
  // The limiter reads its counter over PostgREST; one use of the allowance.
  vi.stubGlobal("fetch", vi.fn(async () => new Response("1", { status: 200 })));
});
afterEach(() => {
  vi.unstubAllGlobals();
  delete process.env.ANTHROPIC_API_KEY;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
});

const json = (path: string, body: unknown) =>
  new Request(`https://www.propertyvaultuk.co.uk/api/rentura/${path}/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

describe("Rentura model routes are members-only", () => {
  it.each(["chat", "scan-document", "extract-certificate"])("%s answers 401 without a session and never reaches the model", async (path) => {
    const { POST } = await import(`./${path}/route`);
    const res = await POST(json(path, { message: "hi", history: [], imageBase64: "AAAA", mediaType: "image/png" }));
    expect(res.status).toBe(401);
    expect(create).not.toHaveBeenCalled();
  });

  it("extract (multipart) answers 401 without a session", async () => {
    const { POST } = await import("./extract/route");
    const form = new FormData();
    form.set("file", new File(["x"], "doc.pdf", { type: "application/pdf" }));
    const res = await POST(new Request("https://www.propertyvaultuk.co.uk/api/rentura/extract/", { method: "POST", body: form }));
    expect(res.status).toBe(401);
    expect(create).not.toHaveBeenCalled();
  });
});
