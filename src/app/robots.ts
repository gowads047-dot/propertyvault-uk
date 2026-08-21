import type { MetadataRoute } from "next";
import { canonical } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          // The Rentura marketing page. /rentura/ below blocks the logged-in
          // app beneath it, which swept up the public landing page with it —
          // the page's own layout asks to be indexed, so the block was never
          // intended. "$" anchors this to the exact URL, and crawlers apply
          // the most specific matching rule, so the app stays blocked.
          "/rentura/$",
        ],
        disallow: [
          // Everything under /rentura/ except the landing page allowed above:
          // dashboard, auth, admin, arrears, financials and the rest of the app.
          "/rentura/",
          "/academy/",
          "/tenant/",
          "/api/",
        ],
      },
    ],
    sitemap: canonical("/sitemap.xml"),
  };
}
