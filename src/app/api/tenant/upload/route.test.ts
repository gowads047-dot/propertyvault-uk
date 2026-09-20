import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const maybeSingle = vi.fn();
const createSignedUploadUrl = vi.fn();
vi.mock("@supabase/supabase-js", () => ({
  createClient: () => ({
    from: () => ({ select: () => ({ eq: () => ({ maybeSingle }) }) }),
    storage: {
      from: () => ({
        createSignedUploadUrl,
        getPublicUrl: (path: string) => ({ data: { publicUrl: `https://stub.supabase.co/storage/v1/object/public/tenant-attachments/${path}` } }),
      }),
    },
  }),
}));

beforeEach(() => {
  vi.resetModules();
  maybeSingle.mockReset().mockResolvedValue({ data: { property_id: "prop-1" } });
  createSignedUploadUrl.mockReset().mockResolvedValue({ data: { token: "signed-token", path: "x", signedUrl: "https://x" }, error: null });
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://stub.supabase.co";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "stub-service-key";
  // The limiter reads its counter over PostgREST; one use of the allowance.
  vi.stubGlobal("fetch", vi.fn(async () => new Response("1", { status: 200 })));
});
afterEach(() => {
  vi.unstubAllGlobals();
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
});

const post = (body: unknown) =>
  new Request("https://www.propertyvaultuk.co.uk/api/tenant/upload/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

describe("/api/tenant/upload", () => {
  it("mints a signed slot under the invite's property for an allowed type", async () => {
    const { POST } = await import("./route");
    const res = await POST(post({ token: "inv-1", type: "video/mp4", size: 20 * 1024 * 1024 }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.uploadToken).toBe("signed-token");
    expect(json.path).toMatch(/^prop-1\/\d+-[0-9a-f-]{36}\.mp4$/);
    expect(json.url).toContain(`/tenant-attachments/${json.path}`);
    expect(createSignedUploadUrl).toHaveBeenCalledWith(json.path);
  });

  it("refuses an unknown invite token before signing anything", async () => {
    maybeSingle.mockResolvedValue({ data: null });
    const { POST } = await import("./route");
    const res = await POST(post({ token: "nope", type: "image/png", size: 100 }));
    expect(res.status).toBe(403);
    expect(createSignedUploadUrl).not.toHaveBeenCalled();
  });

  it("refuses types outside the allow-list and files over the cap", async () => {
    const { POST } = await import("./route");
    expect((await POST(post({ token: "inv-1", type: "application/x-msdownload", size: 100 }))).status).toBe(415);
    expect((await POST(post({ token: "inv-1", type: "image/png", size: 51 * 1024 * 1024 }))).status).toBe(413);
    expect((await POST(post({ token: "inv-1" }))).status).toBe(400);
    expect(createSignedUploadUrl).not.toHaveBeenCalled();
  });

  it("reports a storage failure as 502 rather than a slot that will not work", async () => {
    createSignedUploadUrl.mockResolvedValue({ data: null, error: { message: "Bucket not found" } });
    const { POST } = await import("./route");
    const res = await POST(post({ token: "inv-1", type: "image/jpeg", size: 100 }));
    expect(res.status).toBe(502);
  });
});
