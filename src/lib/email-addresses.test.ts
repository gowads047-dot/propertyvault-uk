import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { CONTACT_EMAIL, REPLY_TO, MAIL_FROM } from "./site";

/**
 * One address, enforced.
 *
 * The site had accumulated ten published contact addresses — privacy@, legal@,
 * press@, editorial@, partnerships@, complaints@, escalations@ and
 * accessibility@ on propertyvault.uk, plus hello@ — and sent mail from three
 * more (nass@, noreply@, alerts@). The email plan allows a single mailbox, so
 * every one of those was a dead end. Anyone who replied to a starter pack or a
 * rent reminder was bouncing.
 *
 * They did not arrive all at once; they drifted in one page at a time. This
 * test is the thing that stops that happening again, and it works on prose in
 * JSX as well as on code, which importing a constant cannot do.
 */

const SRC = join(process.cwd(), "src");

/**
 * Addresses that are deliberately not ours: form placeholders, example values
 * in copy, and fixtures in tests. Kept as an explicit list so a new exception
 * has to be a decision rather than an accident.
 */
const ALLOWED_NON_OURS = new Set([
  "your@email.com",
  "you@email.com",
  "new@email.com",
  "tenant@email.com",
  "landlord@email.com",
  "james@email.com",
  "name@example.com",
  "a@b.com",
  "x@y.com",
  "jane@example.com",
  "Jane@Example.com",
  "test.person@example.com",
  "Test.Person@Example.com",
  "bot@spam.com",
  // Demo rows in the Academy CRM and Rentura contacts screens.
  "james@example.com",
  "sarah@example.com",
  "david@example.com",
  "contractor@example.com",
]);

const EMAIL = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

function sourceFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) out.push(...sourceFiles(path));
    else if (/\.(ts|tsx)$/.test(entry)) out.push(path);
  }
  return out;
}

const files = sourceFiles(SRC);

/** Every address in src/, with the file it came from. */
const found = files.flatMap(path => {
  const rel = path.slice(process.cwd().length + 1).replace(/\\/g, "/");
  return (readFileSync(path, "utf8").match(EMAIL) ?? []).map(address => ({ address, rel }));
});

describe("the site publishes exactly one email address", () => {
  it("uses no address on our domains other than the contact address", () => {
    const ours = found.filter(f => /@(propertyvault\.uk|propertyvaultuk\.co\.uk)$/i.test(f.address));
    const strays = ours.filter(f => f.address.toLowerCase() !== CONTACT_EMAIL);

    expect(
      strays.map(s => `${s.address} in ${s.rel}`),
      "every address on our domains must be the one mailbox that exists"
    ).toEqual([]);
  });

  it("introduces no unrecognised third-party address", () => {
    const foreign = found.filter(
      f =>
        !/@(propertyvault\.uk|propertyvaultuk\.co\.uk)$/i.test(f.address) &&
        !ALLOWED_NON_OURS.has(f.address) &&
        // Schema, spec and vendor URLs are not addresses we publish.
        !/(schema\.org|w3\.org|sentry|googleapis|vercel|supabase|resend|stripe)/i.test(f.address)
    );

    expect(
      foreign.map(s => `${s.address} in ${s.rel}`),
      "add a deliberate placeholder to ALLOWED_NON_OURS, or use CONTACT_EMAIL"
    ).toEqual([]);
  });

  it("actually appears somewhere, so the guard cannot pass vacuously", () => {
    const uses = found.filter(f => f.address.toLowerCase() === CONTACT_EMAIL);
    expect(uses.length).toBeGreaterThan(10);
  });
});

describe("the derived constants stay in step", () => {
  it("routes replies to the contact address", () => {
    expect(REPLY_TO).toBe(CONTACT_EMAIL);
  });

  it("sends from the contact address, so a reply reaches a human", () => {
    expect(MAIL_FROM).toContain(`<${CONTACT_EMAIL}>`);
  });

  it("is on the domain the site is served from, which is the one with a mailbox", () => {
    expect(CONTACT_EMAIL.endsWith("@propertyvaultuk.co.uk")).toBe(true);
  });
});
