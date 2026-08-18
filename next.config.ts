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
    ];
  },
};

export default nextConfig;
