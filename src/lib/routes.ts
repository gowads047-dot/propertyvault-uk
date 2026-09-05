import { readdirSync } from "node:fs";
import { join } from "node:path";

/**
 * Route enumeration for the sitemap, read from the filesystem at build time.
 *
 * The sitemap used to be a hand-written list of 148 URLs while the build
 * produced 211 public pages. All 40 postcode district pages were missing,
 * along with anything else added after the list was last touched. A sitemap
 * that drifts from the routes is the same failure as a nav that drifts from
 * the pages, or a calculator count that drifts from the calculators.
 *
 * src/lib/routes.test.ts asserts the output matches what the build actually
 * produces, so this cannot silently fall behind again.
 */

/**
 * Path prefixes excluded from the sitemap.
 *
 * These mirror the disallow list in robots.ts — a page told not to be crawled
 * has no business being advertised in the sitemap. Kept here so the two files
 * agree by construction rather than by somebody remembering.
 */
export const CRAWL_EXCLUDED = [
  "/rentura/",
  "/academy/",
  "/tenant/",
  "/api/",
  // Makan's signed-in surfaces. Unlike Rentura and Academy these are not a
  // whole subtree — /makan, /makan/rooms, /makan/gcc and the rest are public
  // marketing — so the app pages are listed individually rather than by prefix.
  "/makan/admin/",
  "/makan/dashboard/",
  "/makan/settings/",
  "/makan/messages/",
  "/makan/auth/",
  // Everything under /makan/app is signed-in by definition, so it goes in as a
  // single prefix rather than one entry per page.
  "/makan/app/",
] as const;

/**
 * Landing pages that are public marketing even though the app beneath them is
 * private. robots.txt allows each of these explicitly, so they belong in the
 * sitemap even though their subtrees do not.
 *
 * /academy was missed when /rentura was fixed: it is a public page for the deal
 * sourcing programme, carries its own title, description and self-canonical,
 * asks to be indexed, and is linked from /about — yet Disallow: /academy/ blocked
 * the exact canonical URL, so it could never be indexed. Same bug, same shape,
 * one page later.
 *
 * /tenant is deliberately not here. It is a login form, not marketing.
 */
export const CRAWL_ALLOWED_EXCEPTIONS = ["/rentura", "/academy"] as const;

/**
 * Routes that next.config.ts redirects away.
 *
 * A redirect is checked before the filesystem, so the page never renders — but
 * staticRoutes() walks directories and cannot know that, and would list a URL
 * that 301s. Advertising a redirect in your own sitemap is the same
 * self-conflicting signal as a canonical pointing at one.
 *
 * /landlord-hub and /manage have since had their directories deleted, so
 * nothing would find them anyway. They stay listed because the cost is
 * nothing and the alternative is remembering to re-add an entry the day
 * somebody redirects a page that still has a file behind it.
 *
 * routes.test.ts parses the redirect sources out of next.config.ts and asserts
 * none of them reach the sitemap, so adding a redirect without updating this
 * cannot pass review.
 */
const REDIRECTED = ["/landlord-hub", "/manage"];

/** Routes that render but should never be advertised to a crawler. */
const NEVER_INDEX = ["/embed", "/hub", "/_not-found", "/_global-error", ...REDIRECTED];

const APP_DIR = join(process.cwd(), "src", "app");

/** Directory names that group routes without adding a path segment. */
const isRouteGroup = (name: string) => name.startsWith("(") && name.endsWith(")");
/** [slug] and [...catchall] — enumerated from their data, not the filesystem. */
const isDynamic = (name: string) => name.includes("[");
/** Private folders Next ignores for routing. */
const isPrivate = (name: string) => name.startsWith("_") || name.startsWith(".");

/**
 * Every static route with a page.tsx, as paths with a leading slash.
 * Dynamic segments are skipped — callers add those from their own data.
 */
export function staticRoutes(dir: string = APP_DIR, prefix = ""): string[] {
  const out: string[] = [];
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }

  if (entries.some(e => e.isFile() && /^page\.tsx?$/.test(e.name))) {
    out.push(prefix === "" ? "/" : prefix);
  }

  for (const e of entries) {
    if (!e.isDirectory()) continue;
    if (isDynamic(e.name) || isPrivate(e.name)) continue;
    const segment = isRouteGroup(e.name) ? prefix : `${prefix}/${e.name}`;
    out.push(...staticRoutes(join(dir, e.name), segment));
  }
  return out;
}

/** Should this route appear in the sitemap? */
export function isIndexable(route: string): boolean {
  if (CRAWL_ALLOWED_EXCEPTIONS.includes(route as (typeof CRAWL_ALLOWED_EXCEPTIONS)[number])) return true;
  if (NEVER_INDEX.some(p => route === p || route.startsWith(p + "/"))) return false;
  return !CRAWL_EXCLUDED.some(p => route.startsWith(p) || route + "/" === p);
}

/**
 * Priority and change frequency by section.
 *
 * Ordered most specific first; the first match wins. Anything unmatched gets
 * the default, which is deliberately modest — a new page should not claim to
 * be more important than the homepage by accident.
 */
const RULES: Array<{ test: (r: string) => boolean; priority: number; changeFrequency: "weekly" | "monthly" | "yearly" }> = [
  { test: r => r === "/", priority: 1.0, changeFrequency: "weekly" },
  { test: r => r === "/guaranteed-rent", priority: 0.9, changeFrequency: "weekly" },
  { test: r => r === "/ask" || r === "/vault", priority: 0.9, changeFrequency: "weekly" },
  { test: r => r.startsWith("/calculators"), priority: 0.9, changeFrequency: "monthly" },
  { test: r => r === "/blog", priority: 0.8, changeFrequency: "weekly" },
  { test: r => r.startsWith("/blog/"), priority: 0.7, changeFrequency: "monthly" },
  { test: r => r.startsWith("/guaranteed-rent/"), priority: 0.8, changeFrequency: "monthly" },
  { test: r => r.startsWith("/areas"), priority: 0.7, changeFrequency: "monthly" },
  { test: r => r.startsWith("/templates"), priority: 0.7, changeFrequency: "monthly" },
  { test: r => r.startsWith("/makan"), priority: 0.7, changeFrequency: "monthly" },
  { test: r => r === "/rentura", priority: 0.8, changeFrequency: "monthly" },
  { test: r => ["/privacy", "/terms", "/cookies", "/complaints", "/disclaimer", "/accessibility"].includes(r), priority: 0.3, changeFrequency: "yearly" },
];

export function rankOf(route: string): { priority: number; changeFrequency: "weekly" | "monthly" | "yearly" } {
  return RULES.find(r => r.test(route)) ?? { priority: 0.6, changeFrequency: "monthly" };
}
