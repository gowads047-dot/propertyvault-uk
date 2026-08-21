import { describe, it, expect } from "vitest";
import { readdirSync } from "node:fs";
import { join } from "node:path";
import { SITE_URL, SITE_HOST, canonical, siteMetrics, guaranteedRentCities } from "./site";

const appDir = join(process.cwd(), "src", "app");

/** Count route directories directly under src/app/<section>. */
function countRoutes(section: string): number {
  return readdirSync(join(appDir, section), { withFileTypes: true })
    .filter(e => e.isDirectory())
    .length;
}

describe("site URL", () => {
  it("uses the www host that actually serves a 200", () => {
    // The apex 308-redirects to www. A canonical pointing at a redirect is a
    // conflicting signal, so this must not silently lose the www.
    expect(SITE_URL).toBe("https://www.propertyvaultuk.co.uk");
    expect(SITE_HOST).toBe("www.propertyvaultuk.co.uk");
  });

  it("has no trailing slash, so canonical() cannot produce a double slash", () => {
    expect(SITE_URL.endsWith("/")).toBe(false);
  });

  it("builds absolute URLs from a path with or without a leading slash", () => {
    expect(canonical("/calculators/")).toBe("https://www.propertyvaultuk.co.uk/calculators/");
    expect(canonical("calculators/")).toBe("https://www.propertyvaultuk.co.uk/calculators/");
    expect(canonical()).toBe("https://www.propertyvaultuk.co.uk/");
  });
});

describe("siteMetrics matches what is actually in the repo", () => {
  // These guard against the failure mode where someone adds calculator #24 and
  // the marketing copy keeps saying 23.
  it("calculators", () => {
    expect(siteMetrics.calculators).toBe(countRoutes("calculators"));
  });

  it("templates", () => {
    expect(siteMetrics.templates).toBe(countRoutes("templates"));
  });

  it("area guides", () => {
    expect(siteMetrics.areaGuides).toBe(countRoutes("areas"));
  });

  it("blog posts", () => {
    expect(siteMetrics.blogPosts).toBe(countRoutes("blog"));
  });

  it("guaranteed-rent city pages all exist as routes", () => {
    // Not every directory under guaranteed-rent is a city (vs-letting-agent is
    // a comparison page), so assert the listed slugs resolve rather than
    // counting directories.
    const dirs = readdirSync(join(appDir, "guaranteed-rent"), { withFileTypes: true })
      .filter(e => e.isDirectory())
      .map(e => e.name);
    for (const city of guaranteedRentCities) {
      expect(dirs).toContain(city.slug);
    }
    expect(siteMetrics.guaranteedRentCities).toBe(guaranteedRentCities.length);
  });
});
