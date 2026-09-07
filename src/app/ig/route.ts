import { NextResponse } from "next/server";
import { canonical } from "@/lib/site";

/**
 * The bio link.
 *
 * Every caption ends "link in bio", and the bio points here rather than at
 * the home page so a visit from Instagram can be told apart from any other.
 * Two marks are left: UTM parameters on the landing URL, which the analytics
 * already record, and a cookie, so that code running later in the visit — a
 * sign-up, a subscription — can read where the person came from without the
 * parameters having survived the navigation.
 *
 * ── Why the cookie is not set ──────────────────────────────────────────────
 *
 * This route used to set pv_src unconditionally. Two problems with that, both
 * found after it went live.
 *
 * It is not strictly necessary — it is attribution — so under PECR reg 6 it
 * needs consent before it is set, and this redirect happens before the visitor
 * has seen the banner. /cookies did not declare it either, one commit after
 * that page was corrected to declare only what the site actually sets.
 *
 * And nothing reads it. The weekly summary says as much in plain words rather
 * than implying a funnel exists, so removing it costs nothing today.
 *
 * The UTM parameters still mark the visit, and analytics records them once the
 * visitor consents, so Instagram traffic is still distinguishable.
 *
 * To bring it back: the server cannot see consent, because the choice lives in
 * localStorage rather than a cookie. Set pv_src from the client once consent
 * is "all" and the UTM parameters say instagram, add it to /cookies, and give
 * it a reader in the same change.
 *
 * 307, not 308: a permanent redirect would be cached by the browser and the
 * cookie would never be set again on a return visit.
 */

export const SOURCE_COOKIE = "pv_src";
export const SOURCE_COOKIE_DAYS = 30;
export const LANDING = `${canonical("/")}?utm_source=instagram&utm_medium=bio&utm_campaign=reels`;

export function GET() {
  // 307 rather than 308 still matters: a permanent redirect is cached by the
  // browser, and this route is the only thing that can mark the visit.
  return NextResponse.redirect(LANDING, 307);
}
