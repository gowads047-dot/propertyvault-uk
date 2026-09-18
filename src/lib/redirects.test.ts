import { describe, it, expect } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";
import config from "../../next.config";

const appDir = join(process.cwd(), "src", "app");

type Redirect = { source: string; destination: string; permanent: boolean };

async function allRedirects(): Promise<Redirect[]> {
  const fn = config.redirects;
  expect(typeof fn, "next.config.ts must declare redirects()").toBe("function");
  return (await fn!()) as Redirect[];
}

describe("redirects cost one hop, not three", () => {
  /**
   * The bug this catches, measured against production rather than reasoned
   * about: with trailingSlash true, a destination written without a slash gets
   * redirected again to add one. /landlord-hub/ served three responses to
   * reach one page, and the two older entries served four because their
   * sources have no trailing slash either.
   *
   * Search engines follow chains, but every hop is a chance to lose a little
   * of the ranking the old URL earned — and carrying that ranking across is
   * the entire reason these entries exist.
   */
  it("ends every destination with a slash, matching trailingSlash", async () => {
    expect(config.trailingSlash, "this rule only applies while trailingSlash is on").toBe(true);
    for (const r of await allRedirects()) {
      // This includes a destination ending in a parameter: "/makan/:path+"
      // sends /hetta/rooms/ to /makan/rooms and on to /makan/rooms/, two
      // hops; "/makan/:path+/" is one.
      expect(r.destination.endsWith("/"), `${r.source} → ${r.destination}`).toBe(true);
    }
  });

  it("sends nothing to a destination that is itself redirected", async () => {
    // A redirect into another redirect is the same chain by a different route.
    const redirects = await allRedirects();
    const sources = new Set(redirects.map(r => r.source.replace(/\/$/, "")));
    for (const r of redirects) {
      const dest = r.destination.replace(/\/$/, "");
      expect(sources, `${r.source} → ${r.destination}, which is redirected again`).not.toContain(dest);
    }
  });
});

describe("redirects point somewhere real", () => {
  it("sends every destination to a route that exists", async () => {
    for (const r of await allRedirects()) {
      // A parameter (":path+") carries the old sub-path across; the static
      // prefix before it is what must exist.
      const segments = r.destination.replace(/^\//, "").replace(/\/$/, "").split("/").filter(Boolean)
        .filter((seg, i, all) => !all.slice(0, i + 1).some(x => x.startsWith(":")));
      expect(
        existsSync(join(appDir, ...segments)),
        `${r.source} → ${r.destination}, which has no route`,
      ).toBe(true);
    }
  });

  it("never redirects a path onto itself", async () => {
    for (const r of await allRedirects()) {
      expect(
        r.source.replace(/\/$/, ""),
        `${r.source} redirects to itself`,
      ).not.toBe(r.destination.replace(/\/$/, ""));
    }
  });

  it("leaves the signed-in hub alone", async () => {
    // /hub reads like a marketing hub and is not one: it is the dashboard that
    // fans out to Rentura, Academy and Makan. Redirecting it would take a
    // working account page away from every logged-in user.
    for (const r of await allRedirects()) {
      expect(r.source.replace(/\/$/, ""), "/hub must not be redirected").not.toBe("/hub");
    }
  });
});

describe("parked Makan countries", () => {
  /**
   * The country pages generate from `countries` in makan-config.ts; the ones
   * commented out there ("not active in this phase") are redirected in
   * next.config.ts until they return. The two lists must not overlap — a
   * live country must not be redirected away — and every code Google was
   * given while it was live must be in one list or the other.
   */
  const everCodes = ["gb", "ma", "eg", "ae", "sa", "kw", "bh", "qa", "om", "jo"];

  async function parkedCodes(): Promise<string[]> {
    const r = (await allRedirects()).find(x => x.source.startsWith("/makan/country/"));
    expect(r, "next.config.ts must redirect the parked country pages").toBeDefined();
    return r!.source.match(/\(([^)]+)\)/)![1].split("|");
  }

  it("redirects exactly the codes that are not in makan-config", async () => {
    const { countries } = await import("./makan-config");
    const live = countries.map(c => c.code);
    const parked = await parkedCodes();
    for (const code of parked) expect(live, `${code} is live and redirected`).not.toContain(code);
    for (const code of everCodes) {
      expect([...live, ...parked], `${code} is neither live nor redirected`).toContain(code);
    }
  });
});
