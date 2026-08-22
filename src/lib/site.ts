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

/**
 * The one address, for everything.
 *
 * The site used to publish ten: privacy@, legal@, press@, editorial@,
 * partnerships@, complaints@, escalations@ and accessibility@ on
 * propertyvault.uk, plus hello@ here — and it sent mail from nass@, noreply@
 * and alerts@ on top. Exactly one mailbox exists (the Hostinger plan allows a
 * single one), so every other address was a dead end: send-only at best, and a
 * bounce for anyone who pressed Reply on a starter pack or a rent reminder.
 *
 * Publishing an address nobody reads is worse than publishing none. One
 * address, one inbox, forwarded to Gmail.
 *
 * Everything routes here — the published contact points, the From on outbound
 * mail, and the Reply-To. Import it rather than writing the string out, so a
 * future change is one edit and cannot go stale in a corner of the site.
 */
export const CONTACT_EMAIL = "info@propertyvaultuk.co.uk";

/** Where replies to transactional email go. */
export const REPLY_TO = CONTACT_EMAIL;

/**
 * The From on outbound mail. Same mailbox, so a reply reaches a human.
 * Display name kept friendly; automated mail should still feel answerable.
 */
export const MAIL_FROM = `PropertyVault UK <${CONTACT_EMAIL}>`;

/**
 * The account allowed into the admin pages.
 *
 * This was the owner's personal Gmail, written out in four files, in a public
 * repository — which told anyone reading it exactly which account to go after,
 * and leaked a private address that has no business on the site.
 *
 * Read from the environment, with no fallback on purpose. An admin gate that
 * defaults to a value hardcoded in public source is worse than one that refuses
 * to open: if NEXT_PUBLIC_ADMIN_EMAIL is unset, isAdmin() denies everyone.
 * Set it in Vercel → Settings → Environment Variables → Production.
 */
export const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "";

/** Is this signed-in address the admin? Denies everyone when unconfigured. */
export function isAdmin(email: string | null | undefined): boolean {
  if (!ADMIN_EMAIL) return false;
  return (email ?? "").trim().toLowerCase() === ADMIN_EMAIL.trim().toLowerCase();
}
