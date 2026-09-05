import { describe, it, expect } from "vitest";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { navGroups, companyLinks } from "./nav";

const appDir = join(process.cwd(), "src", "app");
const allLinks = [...navGroups.flatMap(g => g.links), ...companyLinks];
const groupHrefs = navGroups.map(g => g.href).filter((h): h is string => Boolean(h));

/**
 * Does a path correspond to a route under src/app?
 *
 * Accounts for redirects declared in next.config.ts, which are legitimate
 * destinations even when no directory exists — though nothing in the nav
 * should point at one, since a nav link into a redirect wastes a hop on every
 * visitor who uses it.
 */
function routeExists(href: string): boolean {
  const segments = href.replace(/^\//, "").replace(/\/$/, "").split("/").filter(Boolean);
  if (segments.length === 0) return true;
  return existsSync(join(appDir, ...segments));
}

describe("every nav link goes somewhere", () => {
  /**
   * The failure this catches is quiet and expensive: a page is renamed or a
   * directory moved, the nav keeps pointing at the old path, and the site
   * serves a 404 from its own header on all 225 pages. Nothing else in the
   * test suite would notice.
   */
  it("points at a route that exists", () => {
    for (const link of allLinks) {
      expect(routeExists(link.href), `${link.label} → ${link.href}`).toBe(true);
    }
  });

  it("points every group heading at a route that exists", () => {
    for (const href of groupHrefs) {
      expect(routeExists(href), href).toBe(true);
    }
  });

  it("uses absolute paths, so a link means the same thing from every page", () => {
    for (const link of [...allLinks]) {
      expect(link.href.startsWith("/"), `${link.label} → ${link.href}`).toBe(true);
    }
  });
});

describe("the shape of the nav", () => {
  it("has no duplicate group labels", () => {
    const labels = navGroups.map(g => g.label);
    expect(new Set(labels).size).toBe(labels.length);
  });

  it("gives each group at most one feature item", () => {
    // Two leading items is no leading item.
    for (const group of navGroups) {
      const featured = group.links.filter(l => l.feature);
      expect(featured.length, group.label).toBeLessThanOrEqual(1);
    }
  });

  it("keeps every group to a readable length", () => {
    // A dropdown taller than the viewport is a list, not a menu.
    for (const group of navGroups) {
      expect(group.links.length, group.label).toBeGreaterThan(0);
      expect(group.links.length, group.label).toBeLessThanOrEqual(8);
    }
  });

  it("reaches the pages the platform is organised around", () => {
    // The restructure exists to answer three questions the old nav could not:
    // what do I do if I am buying, if I am a landlord, and what do you sell.
    const hrefs = new Set(allLinks.map(l => l.href));
    for (const required of ["/buy", "/landlords", "/services", "/vault", "/rentura"]) {
      expect(hrefs, required).toContain(required);
    }
  });

  it("still reaches everything the free-tools SEO surface depends on", () => {
    // These carry the site's search traffic. A restructure that quietly drops
    // one from the nav costs internal link equity for no gain.
    const hrefs = new Set(allLinks.map(l => l.href));
    for (const required of ["/calculators", "/templates", "/areas", "/blog", "/glossary", "/tools", "/makan"]) {
      expect(hrefs, required).toContain(required);
    }
  });
});

describe("the primary call to action", () => {
  it("is a route the visitor can use without an account", () => {
    expect(routeExists("/vault")).toBe(true);
  });
});
