import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, sep } from "node:path";

/**
 * Identity on the server is verified, never read out of a cookie.
 *
 * Three routes decided who the caller was with `supabase.auth.getSession()`.
 * On the server that reads the session from the request cookie and returns it
 * without checking the token against the auth server — the library wraps the
 * result in something it names `insecureUserWarningProxy`. The cookie comes
 * from the client, so the identity in it is a claim, not a fact.
 *
 * The routes were: the admin gate, the admin user list (which opens the
 * service role key and returns every user's email), and the Stripe portal,
 * where the id decides whose billing portal opens.
 *
 * This walks the route tree rather than naming files, so the next route to
 * reach for getSession fails here.
 */

const API = join(process.cwd(), "src", "app", "api");

function routeFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...routeFiles(full));
    else if (entry === "route.ts") out.push(full);
  }
  return out;
}

const files = routeFiles(API);

describe("who the server thinks the caller is", () => {
  it("finds the API routes at all, so a broken walk cannot pass silently", () => {
    expect(files.length).toBeGreaterThan(10);
  });

  it("never establishes identity from getSession on the server", () => {
    const offenders = files
      .map(f => [f, readFileSync(f, "utf8")] as const)
      .filter(([, src]) => /auth\.getSession\(/.test(src))
      .map(([f]) => f.slice(f.indexOf("api")).split(sep).join("/"));

    expect(offenders, `routes trusting an unverified cookie: ${offenders.join(", ")}`).toEqual([]);
  });

  it("uses the verified helper where a route needs a user", () => {
    const usesHelper = files.filter(f => readFileSync(f, "utf8").includes("getVerifiedUser("));
    expect(usesHelper.length).toBeGreaterThanOrEqual(3);
  });

  // The admin list opens the service role key. The check that guards it has to
  // be the verified one, or the key is guarded by a claim.
  it("guards the service role key in admin/users with a verified identity", () => {
    const src = readFileSync(join(API, "admin", "users", "route.ts"), "utf8");
    expect(src).toContain("getVerifiedUser(");
    expect(src).toContain("isAdmin(");
    expect(src.indexOf("getVerifiedUser(")).toBeLessThan(src.indexOf("SUPABASE_SERVICE_ROLE_KEY"));
  });
});
