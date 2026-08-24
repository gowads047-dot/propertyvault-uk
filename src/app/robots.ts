import type { MetadataRoute } from "next";
import { canonical } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          // The Rentura and Academy marketing pages. The Disallow rules below
          // block the logged-in apps beneath them, which swept up the public
          // landing pages with them — both carry their own canonical and ask to
          // be indexed, so the block was never intended. "$" anchors these to
          // the exact URLs, and crawlers apply the longest matching rule, so
          // the apps stay blocked.
          //
          // /tenant/ has no exception on purpose: it is a login form.
          "/rentura/$",
          "/academy/$",
        ],
        disallow: [
          // Everything under /rentura/ except the landing page allowed above:
          // dashboard, auth, admin, arrears, financials and the rest of the app.
          "/rentura/",
          "/academy/",
          "/tenant/",
          "/api/",
          // Makan's signed-in surfaces. The public Makan pages above them
          // (/makan, /makan/rooms, /makan/gcc, /makan/compliance and the rest)
          // stay crawlable — only these five are blocked.
          "/makan/admin/",
          "/makan/dashboard/",
          "/makan/settings/",
          "/makan/messages/",
          "/makan/auth/",
          "/makan/app/",
        ],
      },
    ],
    sitemap: canonical("/sitemap.xml"),
  };
}
