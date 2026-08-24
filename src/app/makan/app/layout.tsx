import type { Metadata } from "next";

// Everything under /makan/app is a signed-in surface. Blocked in robots.ts and
// kept out of the sitemap by the same "/makan/app/" prefix in routes.ts, so a
// new page added here is private by default rather than by remembering.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function MakanAppLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
