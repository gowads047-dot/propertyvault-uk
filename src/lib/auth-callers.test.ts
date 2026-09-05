import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, sep } from "node:path";

/**
 * A route that requires proof of identity needs callers that offer it.
 *
 * The routes were changed to verify the caller instead of believing a query
 * string, and seven call sites were updated to send the access token. One was
 * missed: the landlord's reply on a tenant maintenance issue still posted
 * `landlordId` in the body — a field the route had stopped reading — and no
 * token. So the reply came back 403, and landlords could not answer their
 * tenants.
 *
 * The route-tree tests could not have caught it. They check that a route
 * refuses an unauthenticated caller, which it did, correctly. Nothing checked
 * that a legitimate caller still succeeds.
 *
 * This walks the client tree instead: anything calling a route that requires a
 * verified user has to go through authFetch. The exception is the tenant
 * portal, which authenticates with an invite token in the request rather than
 * a session, and is a different caller with a different credential.
 */

const SRC = join(process.cwd(), "src");
const API = join(SRC, "app", "api");

function filesUnder(dir: string, match: (name: string) => boolean): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...filesUnder(full, match));
    else if (match(entry)) out.push(full);
  }
  return out;
}

/**
 * The URL path a route.ts file serves, with dynamic segments dropped.
 *
 * Leading slash included. The original walk compared with includes(), where a
 * missing slash made no difference; comparing paths for equality, it does.
 */
function routePath(file: string): string {
  const path = file
    .slice(file.indexOf(join("app", "api")) + 4)
    .split(sep)
    .join("/")
    .replace(/[/]route[.]ts$/, "")
    .replace(/[/]\[[^\]]+\]/g, ""); // /api/tenant/issues/[id] -> /api/tenant/issues
  return path.startsWith("/") ? path : `/${path}`;
}

function routesWhere(wants: (source: string) => boolean): string[] {
  return filesUnder(API, n => n === "route.ts")
    .filter(f => wants(readFileSync(f, "utf8")))
    .map(routePath);
}

/** Route paths whose handlers call getVerifiedUser. */
function protectedRoutes(): string[] {
  return routesWhere(src => src.includes("getVerifiedUser("));
}

/**
 * Route paths whose handlers do not.
 *
 * Needed because dropping a dynamic segment can make a protected child collide
 * with an unprotected parent. /api/vault/property/[id] verifies the user and
 * flattens to /api/vault/property — which is also a real route, deliberately
 * authorised by a claim token rather than a bearer. Without this, every caller
 * of the collection was reported for failing to send a token it must not send.
 */
function unprotectedRoutes(): Set<string> {
  return new Set(routesWhere(src => !src.includes("getVerifiedUser(")));
}

/** The literal URL a fetch call names, or null when it is built at runtime. */
function fetchUrl(line: string): string | null {
  const m = line.match(/[b]?fetch[(]\s*[`"']([^`"']+)[`"']/);
  if (!m) return null;
  return m[1].split("?")[0].replace(/[/]$/, "");
}

/** Client files, excluding the API routes themselves. */
function clientFiles(): string[] {
  return filesUnder(SRC, n => /\.tsx?$/.test(n) && !n.endsWith(".test.ts") && !n.endsWith(".test.tsx"))
    .filter(f => !f.includes(join("app", "api")))
    .filter(f => !f.endsWith(join("lib", "auth-fetch.ts")));
}

describe("callers of routes that require a verified identity", () => {
  const routes = protectedRoutes();
  const openRoutes = unprotectedRoutes();

  it("finds the protected routes, so a broken walk cannot pass silently", () => {
    expect(routes.length).toBeGreaterThanOrEqual(5);
  });

  it("sends the token from every caller that needs to", () => {
    const offenders: string[] = [];

    for (const file of clientFiles()) {
      const src = readFileSync(file, "utf8");
      const lines = src.split(/\r?\n/);

      lines.forEach((line, i) => {
        if (!/\bfetch\(/.test(line) || /authFetch\(/.test(line)) return;
        if (!routes.some(r => line.includes(r))) return;

        // A call to the exact path of a route that does not verify the user is
        // not a call to the protected one that happens to share its prefix.
        const url = fetchUrl(line);
        if (url !== null && openRoutes.has(url)) return;

        // The tenant portal presents an invite token, which is a credential
        // rather than a claim. It is usually in the body, a few lines below
        // the call, so the whole call has to be looked at and not just the
        // line the URL is on — the first version of this test read one line
        // and reported two callers that were perfectly fine.
        const call = lines.slice(i, i + 6).join(" ");
        if (/\btoken\b/.test(call)) return;

        offenders.push(`${file.slice(file.indexOf("src")).split(sep).join("/")}: ${line.trim().slice(0, 70)}`);
      });
    }

    expect(offenders, `plain fetch to a protected route: ${offenders.join(" | ")}`).toEqual([]);
  });

  /**
   * landlordId specifically, because the routes stopped reading it. Sending it
   * is harmless in itself, but it means the call site was never revisited —
   * which is exactly how the 403 shipped.
   *
   * Deliberately not userId: /api/stripe/checkout and /api/rentura/subscribe
   * pass one into Stripe metadata, where it is a label on a payment rather
   * than a claim about who is asking, and the webhook only acts on
   * signature-verified events.
   */
  it("no longer posts a landlordId the routes ignore", () => {
    const offenders = clientFiles()
      .filter(f => /\blandlordId\s*:/.test(readFileSync(f, "utf8")))
      .map(f => f.slice(f.indexOf("src")).split(sep).join("/"));

    expect(offenders, `still sending landlordId: ${offenders.join(", ")}`).toEqual([]);
  });
});
