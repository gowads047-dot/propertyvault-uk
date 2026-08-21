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

  it("is on a domain that can actually receive mail", () => {
    // This assertion has changed once already, and the reason matters.
    //
    // Originally it required REPLY_TO *not* to be on propertyvaultuk.co.uk,
    // because that domain served the website only and had no MX record, so
    // replies bounced. Hostinger Mail has since been set up on it, so the
    // domain now receives and info@ is a real mailbox - verified by sending
    // to it and seeing Resend report "delivered".
    //
    // The rule being enforced is unchanged: replies must go somewhere a human
    // reads. Only the list of domains that satisfy it has grown.
    const receivingDomains = [
      "@propertyvaultuk.co.uk", // Hostinger Mail
      "@propertyvault.uk",      // Tutanota
      "@propertyvault.co.uk",   // Microsoft 365
      "@gmail.com",
    ];
    expect(receivingDomains.some(d => REPLY_TO.endsWith(d))).toBe(true);
  });

  it("is a branded address rather than a personal inbox", () => {
    expect(REPLY_TO.endsWith("@gmail.com")).toBe(false);
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
