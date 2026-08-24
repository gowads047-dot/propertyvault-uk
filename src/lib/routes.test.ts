import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join, sep } from "node:path";
import sitemap from "../app/sitemap";
import robots from "../app/robots";
import { staticRoutes, isIndexable, CRAWL_EXCLUDED, CRAWL_ALLOWED_EXCEPTIONS } from "./routes";
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
  it("lists nothing robots.txt disallows, except the allowed landing pages", () => {
    for (const p of paths) {
      // Derived, not hardcoded: this used to name /rentura literally, which
      // would have gone quietly stale when /academy joined it.
      if ((CRAWL_ALLOWED_EXCEPTIONS as readonly string[]).includes(p)) continue;
      for (const blocked of CRAWL_EXCLUDED) {
        expect(p.startsWith(blocked), `${p} is under ${blocked}`).toBe(false);
      }
    }
  });

  it("gives every allowed landing page an explicit robots.txt Allow", () => {
    const rule = (robots().rules as { allow?: string | string[] }[])[0];
    const allow = Array.isArray(rule.allow) ? rule.allow : [rule.allow ?? ""];
    // Without the "$"-anchored Allow, the Disallow on the subtree also blocks
    // the landing page, so it can never be indexed however the page is marked.
    for (const p of CRAWL_ALLOWED_EXCEPTIONS) {
      expect(allow, `${p} is in the sitemap but robots.txt does not allow it`).toContain(`${p}/$`);
    }
  });

  it("keeps every allowed landing page in the sitemap", () => {
    for (const p of CRAWL_ALLOWED_EXCEPTIONS) expect(paths).toContain(p);
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

  it("treats the gated apps as non-indexable but their landing pages as public", () => {
    expect(isIndexable("/rentura/dashboard")).toBe(false);
    expect(isIndexable("/academy/courses")).toBe(false);
    expect(isIndexable("/tenant/dashboard")).toBe(false);

    expect(isIndexable("/rentura")).toBe(true);
    expect(isIndexable("/academy")).toBe(true);
    expect(isIndexable("/calculators/brrr")).toBe(true);

    // /tenant is a login form, not marketing — it stays out.
    expect(isIndexable("/tenant")).toBe(false);
  });
});

/**
 * Makan's indexing rules.
 *
 * Two bugs lived here at once. The five signed-in pages were being advertised
 * in the sitemap, and src/app/makan/layout.tsx set a single canonical of
 * /makan/ that every page below it inherited — so /makan/rooms/,
 * /makan/wanted/, /makan/list/ and every /makan/listing/<id>/ told Google they
 * were duplicates of the Makan homepage and could never be indexed on their
 * own. The homepage now lives in a (home) route group so it can own its
 * canonical without passing it down.
 */
describe("makan indexing", () => {
  const APP_PAGES = ["/makan/admin", "/makan/dashboard", "/makan/settings", "/makan/messages", "/makan/auth"];
  const PUBLIC_PAGES = ["/makan", "/makan/rooms", "/makan/wanted", "/makan/list", "/makan/gcc", "/makan/compliance"];

  it.each(APP_PAGES)("keeps %s out of the sitemap", route => {
    expect(isIndexable(route)).toBe(false);
    expect(paths).not.toContain(route);
  });

  it.each(APP_PAGES)("disallows %s in robots.txt", route => {
    const disallow = robots().rules;
    const list = (Array.isArray(disallow) ? disallow : [disallow]).flatMap(r =>
      Array.isArray(r.disallow) ? r.disallow : r.disallow ? [r.disallow] : []);
    expect(list).toContain(route + "/");
  });

  it.each(PUBLIC_PAGES)("keeps %s in the sitemap", route => {
    expect(paths).toContain(route);
  });

  it("has no canonical on the shared makan layout", () => {
    const layout = readFileSync(join(appDir, "makan", "layout.tsx"), "utf8");
    expect(layout).not.toMatch(/alternates/);
  });

  it("gives every indexed makan page its own canonical", () => {
    for (const route of PUBLIC_PAGES) {
      const seg = route === "/makan" ? join("makan", "(home)") : route.slice(1).split("/").join(sep);
      const own = ["layout.tsx", "page.tsx"]
        .map(n => join(appDir, seg, n))
        .filter(p => existsSync(p))
        .map(p => readFileSync(p, "utf8"))
        .join("");
      expect(own, route).toMatch(new RegExp("canonical"));
    }
  });
});
