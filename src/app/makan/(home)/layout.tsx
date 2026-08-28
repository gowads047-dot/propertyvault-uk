import type { Metadata } from "next";

// The Makan homepage lives in a (home) route group so it can own its canonical
// without handing it to every page below /makan. The canonical used to sit on
// src/app/makan/layout.tsx, which meant /makan/rooms/, /makan/wanted/,
// /makan/list/ and every listing declared themselves duplicates of /makan/.
export const metadata: Metadata = {
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/makan/" },
  title: "Makan — List Your Property to Tenants and Companies",
  description:
    "List a room, studio or whole property free. Reach tenants and the serviced-accommodation and supported-living companies an estate agent would turn down on your behalf.",
  openGraph: {
    title: "Makan — List once. Tenants and companies both see it.",
    description:
      "Free to list, no agent, no commission. Long lets and company lets across the UK.",
    type: "website",
    locale: "en_GB",
    siteName: "Makan — PropertyVault UK",
  },
};

export default function MakanHomeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
