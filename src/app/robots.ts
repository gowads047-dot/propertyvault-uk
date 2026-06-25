import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/rentura/", "/academy/", "/makan/", "/tenant/", "/api/"],
      },
    ],
    sitemap: "https://propertyvaultuk.co.uk/sitemap.xml",
  };
}
