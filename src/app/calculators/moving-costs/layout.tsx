import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Moving Costs Calculator UK 2026 — Total Cost of Moving House | PropertyVault",
  description: "Calculate the full cost of moving house in the UK. Stamp duty, solicitor fees, survey, removal costs, mortgage arrangement fees, and more. Free 2026 tool.",
  keywords: "moving costs calculator UK, cost of moving house 2026, moving house calculator, home buying costs calculator, total moving costs UK",
  openGraph: {
    title: "Moving Costs Calculator UK 2026 | PropertyVault",
    description: "Calculate the total cost of moving house in the UK including stamp duty, legal fees, and removal costs.",
    type: "website",
    url: "https://www.propertyvaultuk.co.uk/calculators/moving-costs/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "Moving Costs Calculator — PropertyVault UK" }],
  },
  twitter: { card: "summary_large_image", title: "Moving Costs Calculator UK 2026 | PropertyVault", description: "Free tool — see every cost you'll face when moving house." },
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/calculators/moving-costs/" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
