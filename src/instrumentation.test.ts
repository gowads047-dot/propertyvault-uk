import { describe, it, expect, vi } from "vitest";

const record = vi.fn<(r: unknown) => Promise<boolean>>(async () => true);
vi.mock("@/lib/error-report", async importOriginal => ({
  ...(await importOriginal<typeof import("@/lib/error-report")>()),
  recordError: record,
}));

describe("onRequestError", () => {
  it("records a server error with the request and route it happened on", async () => {
    const { onRequestError } = await import("./instrumentation");
    const err = vi.spyOn(console, "error").mockImplementation(() => {});
    const thrown = new Error("db down") as Error & { digest?: string };
    thrown.digest = "1234";
    await onRequestError(thrown, { path: "/api/contact/", method: "POST", headers: { "user-agent": "UA/1" } }, {
      routerKind: "App Router", routePath: "/api/contact", routeType: "route", renderSource: undefined, revalidateReason: undefined,
    });
    expect(record).toHaveBeenCalledTimes(1);
    expect(record.mock.calls[0][0]).toMatchObject({
      side: "server", message: "db down", digest: "1234", path: "/api/contact/", method: "POST",
      router: "App Router", route_type: "route", user_agent: "UA/1",
    });
    err.mockRestore();
  });
});
