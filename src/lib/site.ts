/**
 * Single source of truth for site-wide constants and public metrics.
 *
 * Anything the site states about itself in more than one place belongs here.
 * Two pages disagreeing about how many calculators exist is a credibility
 * problem, and it is the kind that reappears the moment someone adds #24.
 */

/**
 * The canonical origin, including `www`.
 *
 * This must match whichever host actually serves a 200. The apex domain
 * 308-redirects to `www`, so canonical tags, OpenGraph URLs and sitemap
 * entries all have to use the `www` form — a canonical pointing at a redirect
 * is a self-conflicting signal to search engines.
 */
export const SITE_URL = "https://www.propertyvaultuk.co.uk";

/** Bare host, for display in copy and legal pages. */
export const SITE_HOST = "www.propertyvaultuk.co.uk";

/** Absolute URL for a path. Accepts "/foo" or "foo". */
export function canonical(path = "/"): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${p}`;
}

/**
 * Cities with a dedicated guaranteed-rent landing page.
 *
 * `slug` must match a directory under src/app/guaranteed-rent. Several pages
 * list these cities in prose; import from here rather than retyping them, so
 * adding a seventh city does not leave five pages still saying "six".
 */
export const guaranteedRentCities = [
  { slug: "birmingham", name: "Birmingham" },
  { slug: "coventry",   name: "Coventry" },
  { slug: "derby",      name: "Derby" },
  { slug: "leicester",  name: "Leicester" },
  { slug: "nottingham", name: "Nottingham" },
  { slug: "sheffield",  name: "Sheffield" },
] as const;

/**
 * Public metrics quoted in marketing copy.
 *
 * Counts here are asserted against the filesystem by src/lib/site.test.ts, so
 * adding a calculator without updating this number fails the test run rather
 * than silently shipping an inconsistency.
 *
 * Only add a figure here if it can be derived from the repo or evidenced.
 * Audience/traction numbers (landlords, properties managed, ratings) are
 * deliberately absent — see docs/CLAIMS.md.
 */
export const siteMetrics = {
  /** Directories under src/app/calculators (includes the Deal Analyser). */
  calculators: 23,
  /** Directories under src/app/templates. */
  templates: 19,
  /** Directories under src/app/areas. */
  areaGuides: 21,
  /** Directories under src/app/blog. */
  blogPosts: 29,
  /** Cities with a dedicated guaranteed-rent landing page. */
  guaranteedRentCities: guaranteedRentCities.length,
} as const;
