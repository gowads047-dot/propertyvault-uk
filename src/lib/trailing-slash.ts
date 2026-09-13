/**
 * What to do with a request whose path has no trailing slash.
 *
 * The site canonicalises every page URL to the slash form, and Next's
 * trailingSlash: true used to do that with a 308 for every path — API
 * routes included. A redirect is fine for a browser fetching a page. It is
 * fatal for a machine calling an API: Vercel's cron runner requested
 * /api/social/publish, got a 308, and no cron on the site ever reached its
 * handler; Stripe does not follow redirects on webhook delivery; a POST
 * body and an Authorization header do not reliably survive one either.
 *
 * So the built-in redirect is off (skipTrailingSlashRedirect in
 * next.config.ts) and src/proxy.ts applies this instead:
 *
 *   - a page path without a slash is still redirected, as before, so the
 *     canonical URL stays the only URL a page answers on;
 *   - an /api/ path without a slash is rewritten to the slash form — same
 *     request, same method, same headers, same body, no round trip — so a
 *     caller that was given the bare path is served rather than bounced;
 *   - anything that looks like a file, and the root, is left alone.
 *
 * Pure, so the rule is tested without a server.
 */

export type TrailingSlashAction = "pass" | "redirect" | "rewrite";

/** Paths with an extension are files (sitemap.xml, feed.xml, the IndexNow key). */
const looksLikeFile = /\.[A-Za-z0-9]+$/;

export function trailingSlashAction(pathname: string): TrailingSlashAction {
  if (pathname === "/" || pathname.endsWith("/")) return "pass";
  if (pathname.startsWith("/_next/")) return "pass";
  if (looksLikeFile.test(pathname)) return "pass";
  if (pathname.startsWith("/api/")) return "rewrite";
  return "redirect";
}
