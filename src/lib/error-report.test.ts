import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { describeError, recordError, clip } from "./error-report";

beforeEach(() => {
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://stub.supabase.co";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "stub-service-key";
});
afterEach(() => {
  vi.unstubAllGlobals();
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
});

describe("describeError", () => {
  it("reads an Error, an error-like object, and anything else", () => {
    const e = new Error("boom") as Error & { digest?: string };
    e.digest = "abc123";
    expect(describeError(e)).toMatchObject({ message: "boom", digest: "abc123" });
    expect(describeError(e).stack).toContain("boom");
    expect(describeError({ message: "plain" })).toMatchObject({ message: "plain", stack: null, digest: null });
    expect(describeError("string thrown")).toMatchObject({ message: "string thrown" });
    expect(describeError(undefined).message).toBe("undefined");
  });

  it("clips the parts that can be enormous", () => {
    expect(clip("x".repeat(20), 10)).toHaveLength(11);
    expect(describeError(new Error("m".repeat(5000))).message).toHaveLength(1001);
  });
});

describe("recordError", () => {
  it("writes one row through PostgREST with the service key and reports success", async () => {
    const fetchMock = vi.fn(async () => new Response(null, { status: 201 }));
    vi.stubGlobal("fetch", fetchMock);
    expect(await recordError({ side: "server", message: "boom", path: "/x", method: "GET" })).toBe(true);
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://stub.supabase.co/rest/v1/app_errors");
    expect((init.headers as Record<string, string>).authorization).toBe("Bearer stub-service-key");
    expect(JSON.parse(init.body as string)).toMatchObject({ side: "server", message: "boom", path: "/x", method: "GET" });
  });

  it("never throws: a failed write is reported as false and logged", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => { throw new Error("ECONNRESET"); }));
    const err = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(await recordError({ side: "client", message: "x" })).toBe(false);
    expect(err).toHaveBeenCalled();
    err.mockRestore();
  });

  it("does nothing without the service key", async () => {
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    expect(await recordError({ side: "client", message: "x" })).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
