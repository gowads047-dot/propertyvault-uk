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
      const segments = r.destination.replace(/^\//, "").replace(/\/$/, "").split("/").filter(Boolean);
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
