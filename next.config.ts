import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  // The trailing-slash redirect is applied by src/proxy.ts, not here, so
  // that /api/ paths are rewritten rather than redirected. A 308 on an API
  // path is what stopped every cron on the site from reaching its handler.
  // Pages still redirect exactly as before. Rule: src/lib/trailing-slash.ts.
  skipTrailingSlashRedirect: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "d8j0ntlcm91z4.cloudfront.net" },
      { protocol: "https", hostname: "ubmxpuukspfponiesasc.supabase.co" },
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
  },
  /**
   * Every destination ends with a slash, because trailingSlash is true above.
   *
   * Without it each redirect costs an extra hop: /landlord-hub/ went to
   * /landlords, which Next then redirected to /landlords/ — three responses to
   * serve one page. The two older entries were worse at four, because their
   * sources have no trailing slash either. Verified against production, not
   * inferred.
   *
   * Search engines do follow redirect chains, but each hop is a chance to lose
   * a little of the ranking the old URL earned, and every one of these exists
   * precisely to carry that ranking across.
   *
   * redirects.test.ts asserts the rule, so a future entry cannot reintroduce it.
   */
  /**
   * Response headers a scanner expects and a browser acts on.
   *
   * Production sent HSTS and nothing else. These are the uncontroversial
   * set: no MIME sniffing, a referrer policy that keeps the path off
   * third-party requests, no camera/microphone/geolocation (nothing on the
   * site asks for them), and frame-ancestors so the site cannot be framed
   * by another origin — except /embed/, whose whole purpose is to be
   * iframed on other people's sites, so it gets no framing restriction.
   *
   * The Content-Security-Policy is the one Next can honour on a static site.
   * Every page here is prerendered, and a nonce policy needs a fresh nonce
   * per request — dynamic rendering of all 281 pages, the end of the CDN
   * cache and of the 150 ms TTFB. So script-src carries 'unsafe-inline'
   * for Next's own inline payload, and the protection comes from
   * everything else: scripts only from this origin and the two analytics
   * hosts; connections only to Supabase, Google Analytics and Vercel's
   * insights; images and fonts from named hosts; no plugins, no base-tag
   * hijack, forms only to this origin, and nothing framed but YouTube and
   * Cloudflare's challenge. A script injected from anywhere else does not
   * run, and data does not leave for anywhere else. The origin lists are
   * the inventory of what the pages actually use; lib/csp.test.ts holds
   * next.config.ts and the code to the same list.
   *
   * HSTS: two years, subdomains, preload — the value the HSTS preload list
   * requires. Vercel sent max-age alone.
   */
  async headers() {
    const csp = [
      "default-src 'self'",
      // Google's ad hosts are what gtag loads once ad consent is granted and
      // an Ads conversion fires (#182): the conversion tag, the doubleclick
      // beacons, and GA's audiences pixel on google.com / google.co.uk.
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.googleadservices.com https://googleads.g.doubleclick.net https://challenges.cloudflare.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://images.unsplash.com https://d8j0ntlcm91z4.cloudfront.net https://ubmxpuukspfponiesasc.supabase.co https://i.ytimg.com https://www.google-analytics.com https://www.googletagmanager.com https://www.googleadservices.com https://googleads.g.doubleclick.net https://www.google.com https://www.google.co.uk",
      "font-src 'self' data:",
      "connect-src 'self' https://ubmxpuukspfponiesasc.supabase.co wss://ubmxpuukspfponiesasc.supabase.co https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://www.googleadservices.com https://googleads.g.doubleclick.net https://www.google.com https://www.google.co.uk https://vitals.vercel-insights.com https://challenges.cloudflare.com",
      "frame-src https://www.youtube.com https://www.youtube-nocookie.com https://td.doubleclick.net https://bid.g.doubleclick.net https://challenges.cloudflare.com",
      "media-src 'self' https://ubmxpuukspfponiesasc.supabase.co",
      "worker-src 'self' blob:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests",
    ];
    const common = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
    ];
    // A preview deployment is the site at a *.vercel.app URL that anyone
    // with the link can open, and that Google would happily index as a
    // duplicate. Vercel sets VERCEL_ENV=preview on those builds and only
    // those; local builds and production never see this header.
    if (process.env.VERCEL_ENV === "preview") {
      common.push({ key: "X-Robots-Tag", value: "noindex, nofollow" });
    }
    return [
      { source: "/embed/:path*", headers: [...common, { key: "Content-Security-Policy", value: csp.join("; ") }] },
      {
        source: "/((?!embed/).*)",
        headers: [...common, { key: "Content-Security-Policy", value: [...csp, "frame-ancestors 'self'"].join("; ") }],
      },
    ];
  },
  async redirects() {
    return [
      // Coming-soon lockdown — Academy only. Makan sub-routes stay reachable.
      { source: "/academy/:path+", destination: "/academy/", permanent: false },
      // Wrong calculator slug used in older content
      { source: "/calculators/cashflow", destination: "/calculators/monthly-cashflow/", permanent: true },
      // Old glossary URL
      { source: "/property-glossary", destination: "/glossary/", permanent: true },

      // Hub consolidation. /landlord-hub and /manage both tried to be the
      // landlord entry point and neither was linked as one; /landlords now is,
      // and carries the compliance content forward. Permanent, so the ranking
      // these two hold transfers rather than being split three ways.
      //
      // /hub is deliberately NOT here. Despite the name it is the signed-in
      // dashboard that fans out to Rentura, Academy and Makan — redirecting it
      // would take a working account page away from every logged-in user.
      { source: "/landlord-hub", destination: "/landlords/", permanent: true },
      { source: "/manage", destination: "/landlords/", permanent: true },

      // Makan was called Hetta until 22 June 2026 (4ab22c5 renamed the
      // directory and every link, and added no redirect). Search Console
      // still lists /hetta/rooms as a 404 it keeps returning to. Same
      // sub-paths on both sides, so every old URL lands on its new self.
      { source: "/hetta", destination: "/makan/", permanent: true },
      { source: "/hetta/:path+", destination: "/makan/:path+/", permanent: true },

      // /rentura/timeline was renamed to /rentura/events in June and left
      // behind as a page whose only content was redirect("/rentura/events")
      // — a 307 to the bare path, then the 308 to the slash: two hops and a
      // render to reach one page. Nothing links to it any more.
      { source: "/rentura/timeline", destination: "/rentura/events/", permanent: true },

      // Country pages parked in makan-config.ts ("not active in this
      // phase"). Google crawled them while they were live and now gets a
      // 404 for each. Temporary, not permanent: they are expected back, and
      // a 307 tells Google to keep checking rather than forget the URL.
      // makan-config.test.ts keeps this list and the config in step.
      { source: "/makan/country/:code(ae|sa|kw|bh|qa|om|jo)", destination: "/makan/", permanent: false },
    ];
  },
};

export default nextConfig;
