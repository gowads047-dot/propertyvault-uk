import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { unsubscribeToken, unsubscribeUrl, verifyUnsubscribeToken, unsubscribeHeaders } from "./unsubscribe";

beforeEach(() => {
  process.env.CRON_SECRET = "a-secret-long-enough-to-sign-with";
  delete process.env.UNSUBSCRIBE_SECRET;
});
afterEach(() => {
  delete process.env.CRON_SECRET;
  delete process.env.UNSUBSCRIBE_SECRET;
});

describe("unsubscribe links", () => {
  it("signs the address and verifies its own signature, case-insensitively", () => {
    const t = unsubscribeToken("Jane@Example.com")!;
    expect(t).toMatch(/^[A-Za-z0-9_-]{40,}$/);
    expect(verifyUnsubscribeToken("jane@example.com", t)).toBe(true);
    expect(verifyUnsubscribeToken("jane@example.com", t.slice(0, -1) + "x")).toBe(false);
    expect(verifyUnsubscribeToken("tenant@email.com", t)).toBe(false);
  });

  it("builds the link and the RFC 8058 headers", () => {
    expect(unsubscribeUrl("jane@example.com")).toMatch(/^https:\/\/www\.propertyvaultuk\.co\.uk\/api\/unsubscribe\/\?e=jane%40example\.com&t=/);
    const h = unsubscribeHeaders("jane@example.com");
    expect(h["List-Unsubscribe-Post"]).toBe("List-Unsubscribe=One-Click");
    expect(h["List-Unsubscribe"]).toMatch(/^<https:.*>$/);
  });

  it("prefers a dedicated secret and refuses to sign with none", () => {
    const withCron = unsubscribeToken("jane@example.com");
    process.env.UNSUBSCRIBE_SECRET = "a-different-secret-of-length-16+";
    expect(unsubscribeToken("jane@example.com")).not.toBe(withCron);
    delete process.env.UNSUBSCRIBE_SECRET;
    process.env.CRON_SECRET = "short";
    expect(unsubscribeToken("jane@example.com")).toBeNull();
    expect(unsubscribeHeaders("jane@example.com")).toEqual({});
    expect(verifyUnsubscribeToken("jane@example.com", withCron!)).toBe(false);
  });
});
