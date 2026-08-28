import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Capital Gains Tax Calculator UK 2026 — Property CGT",
  description: "Calculate capital gains tax on UK property sales. Covers basic and higher rate taxpayers, 60-day CGT reporting, private residence relief, and lettings relief.",
  keywords: "capital gains tax calculator UK property, CGT calculator 2026, property CGT calculator, CGT on house sale, 60 day CGT reporting",
  openGraph: {
    title: "Capital Gains Tax Calculator UK 2026 — Property CGT",
    description: "Calculate CGT on your UK property sale. Includes private residence relief and the 60-day reporting rules.",
    type: "website",
    url: "https://www.propertyvaultuk.co.uk/calculators/capital-gains-tax/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "Capital Gains Tax Calculator — PropertyVault UK" }],
  },
  twitter: { card: "summary_large_image", title: "Capital Gains Tax Calculator UK 2026 | PropertyVault", description: "Free property CGT calculator — see your tax bill before you sell." },
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/calculators/capital-gains-tax/" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
