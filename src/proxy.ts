import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Academy is not open yet: send every /academy/* sub-route to the /academy
// coming-soon page. Runs on Vercel's edge network before any CDN cache or
// static file is served.
//
// Makan is deliberately NOT gated here — its sub-routes, including the GCC
// pages, stay reachable.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/academy/")) {
    return NextResponse.redirect(new URL("/academy", request.url), { status: 307 });
  }
}

export const config = {
  matcher: ["/academy/:path+"],
};
