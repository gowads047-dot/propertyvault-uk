import { describe, it, expect } from "vitest";
import { readdirSync } from "node:fs";
import { join } from "node:path";
import sitemap from "../app/sitemap";
import robots from "../app/robots";
import { staticRoutes, isIndexable, CRAWL_EXCLUDED } from "./routes";
import { blogPosts, slugOf } from "./blog-posts";
import { SITE_URL } from "./site";

const entries = sitemap();
const urls = entries.map(e => String(e.url));
const paths = urls.map(u => u.replace(SITE_URL, "").replace(/\/$/, "") || "/");

const appDir = join(process.cwd(), "src", "app");
const dirsIn = (p: string) =>
  readdirSync(join(appDir, p), { withFileTypes: true }).filter(e => e.isDirectory()).map(e => e.name);

describe("sitemap covers the site", () => {
  // The hand-maintained version listed 148 URLs against 211 public pages.
  it("has substantially more than the old hand-written list", () => {
    expect(entries.length).toBeGreaterThan(190);
  });

  it("includes every blog post", () => {
    for (const post of blogPosts) {
      expect(paths, slugOf(post)).toContain(`/blog/${slugOf(post)}`);
    }
  });

  it("includes every calculator", () => {
    for (const slug of dirsIn("calculators")) {
      expect(paths, slug).toContain(`/calculators/${slug}`);
    }
  });

  it("includes every area guide", () => {
    for (const slug of dirsIn("areas").filter(d => d !== "postcodes" && !d.startsWith("["))) {
      expect(paths, slug).toContain(`/areas/${slug}`);
    }
  });

  it("includes every template", () => {
    for (const slug of dirsIn("templates").filter(d => !d.startsWith("["))) {
      expect(paths, slug).toContain(`/templates/${slug}`);
    }
  });

  it("includes the postcode district pages the old list omitted", () => {
    const postcodes = paths.filter(p => p.startsWith("/areas/postcodes/"));
    expect(postcodes.length).toBeGreaterThan(35);
  });
});

describe("sitemap excludes what it should", () => {
  it("lists nothing robots.txt disallows, except the Rentura landing page", () => {
    for (const p of paths) {
      if (p === "/rentura") continue; // explicitly allowed in robots.txt
      for (const blocked of CRAWL_EXCLUDED) {
        expect(p.startsWith(blocked), `${p} is under ${blocked}`).toBe(false);
      }
    }
  });

  it("agrees with the disallow list in robots.ts", () => {
    const rule = (robots().rules as { disallow?: string | string[] }[])[0];
    const disallow = Array.isArray(rule.disallow) ? rule.disallow : [rule.disallow ?? ""];
    // Both files must describe the same closed areas, or one will advertise
    // pages the other forbids.
    expect([...CRAWL_EXCLUDED].sort()).toEqual([...disallow].sort());
  });

  it("omits the calculator embeds and the logged-in hub", () => {
    expect(paths.some(p => p.startsWith("/embed"))).toBe(false);
    expect(paths).not.toContain("/hub");
  });

  it("still includes the Rentura landing page", () => {
    expect(paths).toContain("/rentura");
  });
});

describe("sitemap entries are well formed", () => {
  it("uses the canonical www origin throughout", () => {
    for (const u of urls) expect(u.startsWith("https://www.propertyvaultuk.co.uk/")).toBe(true);
  });

  it("ends every URL with a slash, matching the canonical tags", () => {
    for (const u of urls) expect(u.endsWith("/")).toBe(true);
  });

  it("has no duplicates", () => {
    expect(new Set(urls).size).toBe(urls.length);
  });

  it("gives the homepage top priority and nothing else more", () => {
    const home = entries.find(e => String(e.url) === `${SITE_URL}/`);
    expect(home?.priority).toBe(1);
    for (const e of entries) expect(e.priority ?? 0).toBeLessThanOrEqual(1);
  });
});

describe("route enumeration", () => {
  it("finds the homepage and skips dynamic segments", () => {
    const routes = staticRoutes();
    expect(routes).toContain("/");
    expect(routes.some(r => r.includes("["))).toBe(false);
  });

  it("treats gated areas as non-indexable", () => {
    expect(isIndexable("/rentura/dashboard")).toBe(false);
    expect(isIndexable("/academy/courses")).toBe(false);
    expect(isIndexable("/tenant/dashboard")).toBe(false);
    expect(isIndexable("/rentura")).toBe(true);
    expect(isIndexable("/calculators/brrr")).toBe(true);
  });
});
