import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { REPLY_TO } from "./site";

/**
 * Outbound mail is sent from @propertyvaultuk.co.uk, which has no MX record —
 * that domain serves the website only. Sending from it is fine; receiving is
 * not. Without an explicit reply-to, every reply a recipient sends bounces.
 *
 * These assertions are deliberately crude (reading the route source) because
 * the alternative is mocking Resend, and what matters here is simply that the
 * field is present on every send.
 */

// Discovered rather than listed: a new route that sends email should be
// caught automatically, not silently omitted because nobody updated an array.
// Nine of the twelve routes were missing a reply-to when this was widened.
function emailRoutes(dir: string = join(process.cwd(), "src", "app", "api"), out: string[] = []): string[] {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const f = join(dir, e.name);
    if (e.isDirectory()) emailRoutes(f, out);
    else if (e.name.endsWith(".ts")) {
      const s = readFileSync(f, "utf8");
      if (/resend.emails.send|api.resend.com/.test(s)) out.push(f);
    }
  }
  return out;
}

const routes = emailRoutes();

describe("transactional email reply-to", () => {
  it("is a plausible address", () => {
    expect(REPLY_TO).toMatch(/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i);
  });

  it("is not on the website-only domain, which cannot receive mail", () => {
    // propertyvaultuk.co.uk has no MX record. Pointing replies there is the
    // exact bug this constant exists to prevent.
    expect(REPLY_TO.endsWith("@propertyvaultuk.co.uk")).toBe(false);
  });

  it("finds every route that sends email", () => {
    expect(routes.length).toBeGreaterThanOrEqual(12);
  });

  it.each(routes)("%s sets a reply-to on the send", route => {
    const src = readFileSync(route, "utf8");
    // SDK calls use replyTo; the direct REST call uses reply_to.
    expect(/replyTo:|reply_to:/.test(src)).toBe(true);
    expect(src).toContain("REPLY_TO");
  });
});
