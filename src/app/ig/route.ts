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
 * Nothing reads the cookie yet. The weekly summary says so in plain words
 * rather than implying a funnel exists.
 *
 * 307, not 308: a permanent redirect would be cached by the browser and the
 * cookie would never be set again on a return visit.
 */

export const SOURCE_COOKIE = "pv_src";
export const SOURCE_COOKIE_DAYS = 30;
export const LANDING = `${canonical("/")}?utm_source=instagram&utm_medium=bio&utm_campaign=reels`;

export function GET() {
  const res = NextResponse.redirect(LANDING, 307);
  res.cookies.set({
    name: SOURCE_COOKIE,
    value: "instagram",
    path: "/",
    maxAge: SOURCE_COOKIE_DAYS * 86_400,
    sameSite: "lax",
    secure: true,
    // Read by server code at sign-up, not by the browser.
    httpOnly: true,
  });
  return res;
}
