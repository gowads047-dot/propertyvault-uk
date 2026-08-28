import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rent vs Buy Calculator UK 2026 — Is It Cheaper to Rent or Buy?",
  description: "Compare the true long-term cost of renting versus buying a home in the UK. Factors in house price growth, investment returns on deposit, and total cost of ownership.",
  keywords: "rent vs buy calculator UK, should I rent or buy, renting vs buying UK calculator, is it cheaper to rent or buy 2026",
  openGraph: {
    title: "Rent vs Buy Calculator UK 2026 | PropertyVault",
    description: "Is it better to rent or buy in the UK right now? Compare 10-year costs and see which makes financial sense.",
    type: "website",
    url: "https://www.propertyvaultuk.co.uk/calculators/rent-vs-buy/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "Rent vs Buy Calculator — PropertyVault UK" }],
  },
  twitter: { card: "summary_large_image", title: "Rent vs Buy Calculator UK 2026 | PropertyVault", description: "Free tool — compare the real long-term cost of renting vs buying." },
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/calculators/rent-vs-buy/" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
