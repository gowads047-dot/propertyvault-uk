import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "d8j0ntlcm91z4.cloudfront.net" },
      { protocol: "https", hostname: "ubmxpuukspfponiesasc.supabase.co" },
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
  },
  async redirects() {
    return [
      // Coming-soon lockdown — Academy only. Makan sub-routes stay reachable.
      { source: "/academy/:path+", destination: "/academy", permanent: false },
      // Wrong calculator slug used in older content
      { source: "/calculators/cashflow", destination: "/calculators/monthly-cashflow", permanent: true },
      // Old glossary URL
      { source: "/property-glossary", destination: "/glossary", permanent: true },

      // Hub consolidation. /landlord-hub and /manage both tried to be the
      // landlord entry point and neither was linked as one; /landlords now is,
      // and carries the compliance content forward. Permanent, so the ranking
      // these two hold transfers rather than being split three ways.
      //
      // /hub is deliberately NOT here. Despite the name it is the signed-in
      // dashboard that fans out to Rentura, Academy and Makan — redirecting it
      // would take a working account page away from every logged-in user.
      { source: "/landlord-hub", destination: "/landlords", permanent: true },
      { source: "/manage", destination: "/landlords", permanent: true },
    ];
  },
};

export default nextConfig;
