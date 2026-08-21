import { describe, it, expect } from "vitest";
import robots from "./robots";

/**
 * The Rentura landing page was unreachable to search engines for two months.
 *
 * robots.txt blanket-blocked /rentura/ to keep the logged-in app out of the
 * index — dashboard, auth, admin, arrears, financials and the rest — and the
 * public marketing page sits at the root of that same tree, so it was swept up
 * too. Meanwhile the page's own layout asked to be indexed, so the two signals
 * directly contradicted each other.
 *
 * The fix relies on crawlers applying the most specific matching rule, with
 * "$" anchoring a pattern to the end of the path. That is subtle enough to be
 * broken by a well-meaning tidy-up, so the behaviour is asserted here rather
 * than left to a comment.
 */

type Rule = { allow?: string | string[]; disallow?: string | string[] };

function patterns(v: string | string[] | undefined): string[] {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}

/** Does a robots.txt pattern match this path? Supports the "$" end anchor. */
function matches(pattern: string, path: string): boolean {
  if (pattern.endsWith("$")) return path === pattern.slice(0, -1);
  return path.startsWith(pattern);
}

/**
 * Google's rule: the longest matching pattern wins; on a tie, allow wins.
 * https://developers.google.com/search/docs/crawling-indexing/robots/robots_txt
 */
function isAllowed(rule: Rule, path: string): boolean {
  const best = (list: string[]) =>
    list.filter(p => matches(p, path)).reduce((n, p) => Math.max(n, p.length), -1);
  const allow = best(patterns(rule.allow));
  const disallow = best(patterns(rule.disallow));
  return allow >= disallow;
}

const rule = (robots().rules as Rule[])[0];

describe("robots.txt", () => {
  it("lets crawlers reach the Rentura marketing page", () => {
    expect(isAllowed(rule, "/rentura/")).toBe(true);
  });

  it("still blocks the Rentura app behind it", () => {
    for (const p of [
      "/rentura/dashboard",
      "/rentura/auth",
      "/rentura/admin",
      "/rentura/arrears",
      "/rentura/financials",
      "/rentura/properties/123",
    ]) {
      expect(isAllowed(rule, p), p).toBe(false);
    }
  });

  it("keeps the other private areas blocked", () => {
    for (const p of ["/academy/dashboard", "/tenant/dashboard", "/api/subscribe"]) {
      expect(isAllowed(rule, p), p).toBe(false);
    }
  });

  it("leaves the public site crawlable", () => {
    for (const p of ["/", "/calculators/", "/guaranteed-rent/", "/blog/", "/makan/"]) {
      expect(isAllowed(rule, p), p).toBe(true);
    }
  });

  it("anchors the Rentura allow rule so it cannot leak to sub-paths", () => {
    // Without the "$" this pattern would re-open the whole app.
    expect(patterns(rule.allow)).toContain("/rentura/$");
  });
});
