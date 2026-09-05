import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

/**
 * Every vault handler authorises the same way.
 *
 * These queries run with the service role, which bypasses row-level security,
 * so the owner filter carries the whole weight of authorisation. Three
 * handlers each building their own version is the shape behind nearly every
 * access bug already found in this codebase — and the collection endpoint had
 * exactly that bug: written token-only, it could not list a signed-in owner's
 * properties at all once claiming set claim_token to null.
 */

const vaultDir = join(process.cwd(), "src", "app", "api", "vault", "property");

function routeFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...routeFiles(path));
    else if (entry.name === "route.ts") out.push(path);
  }
  return out;
}

const routes = routeFiles(vaultDir);
const read = (p: string) => readFileSync(p, "utf8");
const rel = (p: string) => p.slice(process.cwd().length + 1).replace(/\\/g, "/");

describe("the vault routes", () => {
  it("finds them, so nothing below passes vacuously", () => {
    expect(routes.length).toBeGreaterThanOrEqual(2);
  });

  it("never filters on claim_token by hand", () => {
    /**
     * A handler writing its own `claim_token=eq.` filter is a handler that
     * cannot see a claimed property, because that column is null once the
     * property belongs to an account. The one legitimate exception is the
     * save path, which matches on the token to decide insert-or-update
     * before any account is involved.
     */
    for (const path of routes) {
      const lines = read(path).split("\n");
      lines.forEach((line, i) => {
        if (!line.includes("claim_token=eq.")) return;
        // Scoped to the neighbouring lines, not the whole file. A file-wide
        // check for dedupe_key excuses every claim_token filter that happens
        // to share a file with the save path — which is exactly how the first
        // version of this test passed against a deliberately reintroduced bug.
        const nearby = [lines[i - 1], line, lines[i + 1]].join("\n");
        expect(
          nearby.includes("dedupe_key=eq."),
          `${rel(path)}:${i + 1} filters on claim_token outside the save path: ${line.trim()}`,
        ).toBe(true);
      });
    }
  });

  it("takes the owner filter from one place", () => {
    // A local copy is how two handlers end up with subtly different rules.
    for (const path of routes) {
      const src = read(path);
      if (!src.includes("ownerFilterFor")) continue;
      expect(
        src.includes('from "@/lib/vault-owner"'),
        `${rel(path)} uses ownerFilterFor without importing the shared one`,
      ).toBe(true);
      expect(
        /(async )?function ownerFilterFor/.test(src),
        `${rel(path)} defines its own ownerFilterFor`,
      ).toBe(false);
    }
  });

  it("refuses the request when no credential resolves", () => {
    // ownerFilterFor returns null rather than throwing, so a handler that
    // ignores the null builds a query with "null" in it and reads rows that
    // belong to nobody in particular.
    for (const path of routes) {
      const src = read(path);
      if (!src.includes("ownerFilterFor")) continue;
      expect(
        /if \(!\w+\) \{\s*\n\s*return NextResponse\.json/.test(src),
        `${rel(path)} calls ownerFilterFor without handling a null result`,
      ).toBe(true);
    }
  });
});

describe("the shared filter", () => {
  const src = read(join(process.cwd(), "src", "lib", "vault-owner.ts"));

  it("prefers a verified account over a claim token", () => {
    // A stale token in localStorage must never outrank a real identity.
    const userIdx = src.indexOf("getVerifiedUser");
    const tokenIdx = src.indexOf("x-vault-token");
    expect(userIdx).toBeGreaterThan(-1);
    expect(tokenIdx).toBeGreaterThan(userIdx);
  });

  it("validates the token before putting it in a query string", () => {
    expect(src).toContain("isValidClaimToken");
  });

  it("encodes both identifiers", () => {
    const encodes = [...src.matchAll(/encodeURIComponent/g)];
    expect(encodes.length).toBeGreaterThanOrEqual(2);
  });
});
