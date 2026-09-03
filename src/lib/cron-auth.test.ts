import { describe, it, expect, vi, afterEach } from "vitest";
import { authorizeCron } from "./cron-auth";

afterEach(() => vi.restoreAllMocks());

const SECRET = "a-real-cron-secret-value";
const req = (authorization?: string) =>
  new Request("https://example.test/api/cron", authorization ? { headers: { authorization } } : {});

describe("authorising a scheduled job", () => {
  it("accepts the matching bearer token", () => {
    expect(authorizeCron(req(`Bearer ${SECRET}`), SECRET)).toBe(true);
  });

  it("refuses a wrong token", () => {
    expect(authorizeCron(req("Bearer nope"), SECRET)).toBe(false);
    expect(authorizeCron(req(`Bearer ${SECRET}x`), SECRET)).toBe(false);
    expect(authorizeCron(req(SECRET), SECRET)).toBe(false);
  });

  it("refuses a request with no authorization header", () => {
    expect(authorizeCron(req(), SECRET)).toBe(false);
  });
});

describe("when the secret is missing", () => {
  /**
   * The bug this file exists for. The old check compared against
   * `Bearer ${process.env.CRON_SECRET}`, which with no secret set is the
   * literal string "Bearer undefined" — so that header authorised anyone, on
   * routes that send email and publish to Instagram.
   */
  it("refuses the header that an unset secret used to accept", () => {
    expect(authorizeCron(req("Bearer undefined"), undefined)).toBe(false);
    expect(authorizeCron(req("Bearer undefined"), "")).toBe(false);
    expect(authorizeCron(req("Bearer null"), undefined)).toBe(false);
  });

  // A misconfiguration should cost availability, never control.
  it("refuses everything rather than running unauthenticated", () => {
    for (const header of [undefined, "", "Bearer ", "Bearer anything", `Bearer ${SECRET}`]) {
      expect(authorizeCron(req(header), undefined), String(header)).toBe(false);
    }
  });

  it("treats a secret too short to be one as no secret at all", () => {
    expect(authorizeCron(req("Bearer short"), "short")).toBe(false);
    expect(authorizeCron(req("Bearer 123456789012345"), "123456789012345")).toBe(false);
    // One character longer, and it is accepted.
    expect(authorizeCron(req("Bearer 1234567890123456"), "1234567890123456")).toBe(true);
  });

  /**
   * Failing closed makes every job return 401, which looks identical to a
   * wrong token. The log is what tells whoever is looking which one it is.
   */
  it("says the secret is missing rather than failing silently", () => {
    const err = vi.spyOn(console, "error").mockImplementation(() => {});
    authorizeCron(req("Bearer x"), undefined);
    expect(err.mock.calls[0][0]).toContain("not set");
  });

  it("distinguishes a too-short secret from a missing one", () => {
    const err = vi.spyOn(console, "error").mockImplementation(() => {});
    authorizeCron(req("Bearer short"), "short");
    expect(err.mock.calls[0][0]).toContain("shorter than");
  });

  it("never puts the secret in the log", () => {
    const err = vi.spyOn(console, "error").mockImplementation(() => {});
    authorizeCron(req("Bearer hunter2short"), "hunter2short");
    expect(JSON.stringify(err.mock.calls)).not.toContain("hunter2");
  });

  it("refuses a non-string secret however it arrived", () => {
    for (const bad of [null, 0, {}, []] as unknown[]) {
      expect(authorizeCron(req("Bearer x"), bad as string | undefined), String(bad)).toBe(false);
    }
  });
});
