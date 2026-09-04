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

  /**
   * Creating objects on somebody else's account.
   *
   * /api/stripe/checkout and /api/rentura/subscribe are deliberately open, so
   * a visitor can pay before they have an account. But every call created a
   * live Stripe checkout session, unbounded — anyone could generate them at
   * will, bury the real ones in the dashboard, and push the account toward
   * Stripe's own API limits, at which point a genuine customer's checkout
   * starts failing.
   *
   * The webhook is exempt: it verifies a signature and creates nothing on its
   * own initiative.
   */
  it("meters every route that creates a Stripe object", () => {
    const unmetered = files
      .map(f => [f, readFileSync(f, "utf8")] as const)
      .filter(([, src]) => /stripe\.(checkout\.sessions|billingPortal\.sessions|customers)\.create\(/.test(src))
      .filter(([, src]) => !isMetered(src) && !isAuthenticated(src) && !src.includes("getVerifiedUser("))
      .map(([f]) => f.slice(f.indexOf("api")).split(sep).join("/"));

    expect(unmetered, `unmetered Stripe routes: ${unmetered.join(", ")}`).toEqual([]);
  });

  it("actually detects a Stripe route, so the filter is not matching nothing", () => {
    const withStripe = files.filter(f => /stripe\.[a-zA-Z.]+\.create\(/.test(readFileSync(f, "utf8")));
    expect(withStripe.length).toBeGreaterThanOrEqual(2);
  });

  /**
   * Per handler, not per file.
   *
   * Every assertion above reads a whole route file, so a file with a guarded
   * GET and an unguarded PATCH looks guarded. That is exactly what
   * /api/tenant/validate was: the read was metered and the write — binding an
   * auth id to an invite — was not.
   *
   * Each exported handler is checked on its own body. That has its own failure
   * mode, which is worth naming: a route guarding through a helper defined
   * elsewhere in the file reads as unguarded here. /api/vault/property did,
   * and rather than teach the test about helpers, that route now calls
   * rateGuard directly like everything else — two ways to guard is how one of
   * them gets forgotten.
   */
  it("guards every exported handler, not just every file", () => {
    const gaps: string[] = [];

    for (const f of files) {
      const src = readFileSync(f, "utf8");
      const name = f.slice(f.indexOf("api")).split(sep).join("/").replace("/route.ts", "");
      const marks = [...src.matchAll(/export async function (GET|POST|PATCH|PUT|DELETE)\b/g)];

      marks.forEach((m, i) => {
        const body = src.slice(m.index, marks[i + 1]?.index ?? src.length);
        if (!isMetered(body) && !isAuthenticated(body) && !body.includes("getVerifiedUser(")) {
          gaps.push(`${m[1]} /${name}`);
        }
      });
    }

    expect(gaps, `unguarded handlers: ${gaps.join(", ")}`).toEqual([]);
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
