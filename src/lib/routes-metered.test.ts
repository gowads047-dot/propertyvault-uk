import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { readdirSync, statSync } from "node:fs";
import { join, sep } from "node:path";

/**
 * Every route that spends money must meter itself.
 *
 * The limiter was built and wired into /api/deal-ai-verdict, and five other
 * routes that call Anthropic on the same key were left open: two chats and
 * three document extractors, unauthenticated and unmetered. Nobody noticed
 * because nothing was checking — the omission was invisible.
 *
 * This walks the route tree rather than naming the routes, so a new one that
 * calls the API and forgets the guard fails here instead of appearing on a
 * bill.
 */

const API_DIR = join(process.cwd(), "src", "app", "api");

function routeFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...routeFiles(full));
    else if (entry === "route.ts") out.push(full);
  }
  return out;
}

/** Sends email on our behalf, from our domain. */
function sendsEmail(src: string): boolean {
  return /from "resend"|new Resend\(|resend\.emails\.send|api\.resend\.com/.test(src);
}

/** Calls a paid model API. */
function callsAnthropic(src: string): boolean {
  return /@anthropic-ai\/sdk|new Anthropic\(|anthropic\.messages\.create/.test(src);
}

/** Free services this app calls on other people's infrastructure. */
const THIRD_PARTY = [
  "api.postcodes.io",
  "data.police.uk",
  "landregistry.data.gov.uk",
  "planning.data.gov.uk",
  "onthemarket.com",
];

/** Proves who the caller is, which is stronger than bounding how often. */
function isAuthenticated(src: string): boolean {
  return /authorizeCron\(|webhooks\.constructEvent\(/.test(src);
}

/** Has something in front of the call that bounds how often it happens. */
function isMetered(src: string): boolean {
  return /rateGuard\(|consumeAll\(/.test(src);
}

describe("routes that spend money", () => {
  const files = routeFiles(API_DIR);

  it("finds the API routes at all, so a broken walk cannot pass silently", () => {
    expect(files.length).toBeGreaterThan(10);
  });

  it("meters every route that calls Anthropic", () => {
    const unmetered = files
      .filter(f => callsAnthropic(readFileSync(f, "utf8")))
      .filter(f => !isMetered(readFileSync(f, "utf8")))
      .map(f => f.slice(f.indexOf("api")).split(sep).join("/"));

    expect(unmetered, `unmetered AI routes:\n${unmetered.join("\n")}`).toEqual([]);
  });

  it("actually detects an AI route, so the filter is not matching nothing", () => {
    const withAI = files.filter(f => callsAnthropic(readFileSync(f, "utf8")));
    expect(withAI.length).toBeGreaterThanOrEqual(5);
  });

  /**
   * The exposure on an email route is not the send quota, it is the sending
   * domain: an open endpoint that puts mail into strangers' inboxes from
   * info@propertyvaultuk.co.uk gets that domain blocklisted, and a reputation
   * is far harder to get back than a bill.
   *
   * Two exemptions, both because they authenticate rather than meter, which is
   * the stronger check: a cron route carries the shared secret, and the Stripe
   * webhook verifies a signature over the body.
   */
  it("meters every route that sends email", () => {
    const unmetered = files
      .map(f => [f, readFileSync(f, "utf8")] as const)
      .filter(([, src]) => sendsEmail(src))
      .filter(([, src]) => !isMetered(src) && !isAuthenticated(src))
      .map(([f]) => f.slice(f.indexOf("api")).split(sep).join("/"));

    expect(unmetered, `unmetered email routes: ${unmetered.join(", ")}`).toEqual([]);
  });

  it("actually detects an email route, so the filter is not matching nothing", () => {
    expect(files.filter(f => sendsEmail(readFileSync(f, "utf8"))).length).toBeGreaterThanOrEqual(5);
  });

  /**
   * Proxying somebody else's free service.
   *
   * The cost of abusing an open proxy is not paid by whoever abuses it. It is
   * paid by every real user, when postcodes.io or HM Land Registry start
   * refusing our egress addresses and the lookups stop finding anything.
   */
  it("meters every route that proxies a third-party service", () => {
    const unmetered = files
      .map(f => [f, readFileSync(f, "utf8")] as const)
      .filter(([, src]) => THIRD_PARTY.some(host => src.includes(host)))
      .filter(([, src]) => !isMetered(src) && !isAuthenticated(src))
      .map(([f]) => f.slice(f.indexOf("api")).split(sep).join("/"));

    expect(unmetered, `unmetered proxy routes: ${unmetered.join(", ")}`).toEqual([]);
  });

  // The guard has to run before the body is read, or a large upload is paid
  // for in bandwidth and parsing before it is refused.
  it("puts the guard before the request body is parsed", () => {
    for (const f of files) {
      const src = readFileSync(f, "utf8");
      if (!callsAnthropic(src) || !src.includes("rateGuard(")) continue;
      const guard = src.indexOf("rateGuard(");
      const parse = src.search(/await req\.(json|formData)\(\)/);
      if (parse >= 0) {
        expect(guard, f).toBeLessThan(parse);
      }
    }
  });
});
