import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const reportClientError = vi.fn();
vi.mock("@/lib/error-beacon", () => ({ reportClientError: (...a: unknown[]) => reportClientError(...a) }));

const BASE = "https://stub.supabase.co";

beforeEach(() => {
  reportClientError.mockReset();
  vi.stubGlobal("window", { dispatchEvent: () => true });
  vi.stubGlobal("CustomEvent", class { constructor(public type: string, public init?: unknown) {} });
});
afterEach(() => vi.unstubAllGlobals());

function respond(status: number, body = "") {
  vi.stubGlobal("fetch", vi.fn(async () => new Response(body, { status })));
}

describe("reportingFetch", () => {
  it("reports a refused PostgREST write with the method, the path and the message, minus the query string", async () => {
    respond(400, '{"code":"42703","message":"column \\"file_name\\" of relation \\"rentura_documents\\" does not exist"}');
    const { reportingFetch } = await import("./supabase-fetch");
    const res = await reportingFetch(`${BASE}/rest/v1/rentura_documents?select=id&email=eq.jane%40example.com`, { method: "POST" });
    expect(res.status).toBe(400);
    expect(reportClientError).toHaveBeenCalledTimes(1);
    const [err, kind] = reportClientError.mock.calls[0] as [Error, string];
    expect(kind).toBe("supabase");
    expect(err.message).toContain("POST /rest/v1/rentura_documents → 400");
    expect(err.message).toContain("file_name");
    expect(err.message).not.toContain("jane");
  });

  it("reports an RLS refusal (42501) and a missing bucket the same way", async () => {
    respond(403, '{"code":"42501","message":"new row violates row-level security policy"}');
    const { reportingFetch } = await import("./supabase-fetch");
    await reportingFetch(new URL(`${BASE}/rest/v1/rentura_right_to_rent`), { method: "POST" });
    respond(404, '{"error":"Bucket not found"}');
    await reportingFetch(`${BASE}/storage/v1/object/tenant-attachments/x.jpg`, { method: "POST" });
    expect(reportClientError.mock.calls.map((c) => (c[0] as Error).message)).toEqual([
      "POST /rest/v1/rentura_right_to_rent → 403 " + '{"code":"42501","message":"new row violates row-level security policy"}',
      "POST /storage/v1/object/tenant-attachments/x.jpg → 404 " + '{"error":"Bucket not found"}',
    ]);
  });

  it("announces a refused write on the window with PostgREST's message, and says nothing for a read", async () => {
    const heard: unknown[] = [];
    const win = { addEventListener: vi.fn(), dispatchEvent: (e: CustomEvent) => { heard.push(e.detail); return true; } };
    vi.stubGlobal("window", win);
    vi.stubGlobal("CustomEvent", class { type: string; detail: unknown; constructor(t: string, o: { detail: unknown }) { this.type = t; this.detail = o.detail; } });
    respond(403, '{"code":"42501","message":"new row violates row-level security policy for table \\"rentura_right_to_rent\\""}');
    const { reportingFetch, postgrestMessage } = await import("./supabase-fetch");
    await reportingFetch(`${BASE}/rest/v1/rentura_right_to_rent?select=*`, { method: "POST" });
    respond(500, "boom");
    await reportingFetch(`${BASE}/rest/v1/rentura_right_to_rent?select=*`);
    expect(heard).toEqual([
      { method: "POST", path: "/rest/v1/rentura_right_to_rent", status: 403, message: 'new row violates row-level security policy for table "rentura_right_to_rent"' },
    ]);
    expect(postgrestMessage("not json", 502)).toBe("HTTP 502");
    expect(postgrestMessage('{"error":"Bucket not found"}', 404)).toBe("Bucket not found");
  });

  it("leaves the body readable for supabase-js", async () => {
    respond(400, '{"message":"x"}');
    const { reportingFetch } = await import("./supabase-fetch");
    const res = await reportingFetch(`${BASE}/rest/v1/t`, { method: "PATCH" });
    expect(await res.json()).toEqual({ message: "x" });
  });

  it("is silent on success, on .single() finding nothing (406), on auth, and on the server", async () => {
    const { reportingFetch } = await import("./supabase-fetch");
    respond(200, "[]");
    await reportingFetch(`${BASE}/rest/v1/t`);
    respond(406, '{"code":"PGRST116"}');
    await reportingFetch(`${BASE}/rest/v1/t?id=eq.1`);
    respond(401, '{"error":"invalid_grant"}');
    await reportingFetch(`${BASE}/auth/v1/token?grant_type=refresh_token`, { method: "POST" });
    vi.unstubAllGlobals();
    respond(500, "boom");
    await reportingFetch(`${BASE}/rest/v1/t`);
    expect(reportClientError).not.toHaveBeenCalled();
  });
});
