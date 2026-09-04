import { describe, it, expect } from "vitest";
import { ADMIN_EMAIL, isAdmin } from "./admin";
import { CONTACT_EMAIL } from "./site";

/**
 * The admin gate had no fallback, ADMIN_EMAIL was never set, and so it denied
 * everyone — including the owner — silently. The only symptom was a feature
 * that did not work, which is the worst kind of failure to diagnose.
 *
 * It now falls back to the one address this business publishes. That address
 * is already on the contact page and in the From line of every email sent, so
 * the fallback reveals nothing new, and the gate still opens only for somebody
 * signed in as it.
 */
describe("who the admin is", () => {
  it("falls back to the one address the site publishes", () => {
    expect(ADMIN_EMAIL).toBe(CONTACT_EMAIL);
  });

  it("opens for that address, however it is typed", () => {
    expect(isAdmin(CONTACT_EMAIL)).toBe(true);
    expect(isAdmin(CONTACT_EMAIL.toUpperCase())).toBe(true);
    expect(isAdmin(`  ${CONTACT_EMAIL}  `)).toBe(true);
  });

  /**
   * The near misses are derived from the real address rather than written out,
   * so this file introduces no second address of its own — the site publishes
   * exactly one, and email-addresses.test.ts enforces that.
   */
  it("stays shut for everybody else", () => {
    const [local, domain] = CONTACT_EMAIL.split("@");
    for (const other of [
      `${local}@${domain.replace(/\.co\.uk$/, ".com")}`, // same name, wrong TLD
      `${local}@${domain.replace("vaultuk", "vault")}`,   // one letter out
      `x${CONTACT_EMAIL}`,                                // prefixed
      `${CONTACT_EMAIL}x`,                                // suffixed
      local,                                              // no domain at all
      "",
      "   ",
      null,
      undefined,
    ]) {
      expect(isAdmin(other), String(other)).toBe(false);
    }
  });

  // The old spelling put the owner's address in the browser bundle. Nothing
  // should reintroduce that.
  it("is not a NEXT_PUBLIC_ variable", () => {
    expect(process.env.NEXT_PUBLIC_ADMIN_EMAIL).toBeUndefined();
  });
});
