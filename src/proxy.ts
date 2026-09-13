import { NextResponse, type NextRequest } from "next/server";
import { trailingSlashAction } from "@/lib/trailing-slash";

/**
 * Trailing-slash handling, replacing Next's built-in redirect so that API
 * paths are rewritten rather than bounced. The rule and the reasons are in
 * src/lib/trailing-slash.ts.
 *
 * The matcher keeps this off static assets, image optimisation and
 * anything with a file extension; the function itself re-checks, because
 * the matcher is the fast path and the function is the correct one.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const action = trailingSlashAction(pathname);
  if (action === "pass") return NextResponse.next();

  // A plain URL, not nextUrl.clone(): NextURL normalises the pathname on
  // assignment and dropped the slash straight back off, which made the
  // redirect point at itself.
  const url = new URL(request.url);
  url.pathname = `${pathname}/`;
  url.search = search;

  // 308, as Next used: permanent, and method-preserving for the odd POST.
  if (action === "redirect") return NextResponse.redirect(url, 308);
  return NextResponse.rewrite(url);
}

export const config = {
  // Everything except Next internals and paths with a file extension.
  matcher: ["/((?!_next/|.*\\.[A-Za-z0-9]+$).*)"],
};
