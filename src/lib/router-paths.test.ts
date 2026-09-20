import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Every router.push / router.replace goes to the slash form of the URL.
 *
 * The site's canonical page URL ends in a slash, and src/proxy.ts sends a
 * bare path there with a 308. A <Link> gets the slash from the wrapper in
 * components/ui/Link.tsx; a router.push("/rentura/dashboard") does not, so
 * Next fetched the RSC payload for the bare path, got the redirect, logged
 * "Failed to fetch RSC payload … Falling back to browser navigation" and
 * did a full page load instead of a client transition. Forty-seven calls
 * did that — every sign-in redirect, every "back to list", every lesson
 * step. This holds each literal to the slash form.
 */
const root = process.cwd();
const files = readdirSync(join(root, "src"), { recursive: true, encoding: "utf8" })
  .filter((p) => p.endsWith(".tsx") && !p.includes(".test."))
  .map((p) => join(root, "src", p));

describe("router navigations", () => {
  it("use the trailing-slash form, so the client transition is not a redirect", () => {
    const bare: string[] = [];
    let seen = 0;
    for (const f of files) {
      const src = readFileSync(f, "utf8");
      for (const m of src.matchAll(/router\.(?:push|replace)\((["`])(\/[^"`]*)\1/g)) {
        seen++;
        const path = m[2].split("?")[0].split("#")[0];
        if (!path.endsWith("/")) bare.push(`${m[2]} in ${f.slice(root.length + 1).split("\\").join("/")}`);
      }
    }
    expect(bare).toEqual([]);
    expect(seen).toBeGreaterThan(40);
  });
});
