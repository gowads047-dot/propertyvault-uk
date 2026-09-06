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
    expect(usesHelper.length).toBeGreaterThanOrEqual(6);
  });

  /**
   * An identifier is not a credential. These routes read the caller's own id
   * out of the query string and then queried on it with the service role key,
   * so anyone holding somebody else's user id could ask for their records.
   */
  it("never takes the caller's own identity from a query string", () => {
    const offenders = files
      .map(f => [f, readFileSync(f, "utf8")] as const)
      .filter(([, src]) => /searchParams\.get\("(userId|landlordId|user_id|ownerId)"\)/.test(src))
      .map(([f]) => f.slice(f.indexOf("api")).split(sep).join("/"));

    expect(offenders, `identity from a query string: ${offenders.join(", ")}`).toEqual([]);
  });

  /**
   * The service role key bypasses row level security entirely, so a route that
   * opens it has to establish who is asking before it does.
   *
   * This named one file — admin/users — which is the failure shape behind most
   * of the access bugs found in this codebase: a correct rule applied in one
   * place and not the others. It walks the tree now, so a second admin route
   * cannot be added without the same gate. That is not hypothetical; adding
   * admin/enquiries is what exposed it.
   */
  const adminRoutes = files.filter(f => f.includes(`${sep}admin${sep}`));
  const usesServiceRole = (src: string) => src.includes("SUPABASE_SERVICE_ROLE_KEY");

  it("finds the admin routes, so the checks below are not vacuous", () => {
    expect(adminRoutes.length).toBeGreaterThanOrEqual(2);
  });

  it("guards the service role key in every admin route with a verified identity", () => {
    for (const file of adminRoutes) {
      const src = readFileSync(file, "utf8");
      if (!usesServiceRole(src)) continue;
      const name = file.slice(file.indexOf("api")).split(sep).join("/");

      expect(src, `${name} opens the service role without getVerifiedUser`).toContain("getVerifiedUser(");
      expect(src, `${name} opens the service role without isAdmin`).toContain("isAdmin(");
      expect(
        src.indexOf("getVerifiedUser("),
        `${name} reads the service role key before checking who is asking`,
      ).toBeLessThan(src.indexOf("SUPABASE_SERVICE_ROLE_KEY"));
    }
  });

  it("never decides admin from a session read out of the cookie", () => {
    // getSession returns what the cookie claims, unverified. Gating the
    // service role on it means gating it on the caller's own assertion.
    for (const file of adminRoutes) {
      const src = readFileSync(file, "utf8");
      const name = file.slice(file.indexOf("api")).split(sep).join("/");
      expect(/auth\.getSession\(/.test(src), `${name} uses getSession to decide access`).toBe(false);
    }
  });
});
