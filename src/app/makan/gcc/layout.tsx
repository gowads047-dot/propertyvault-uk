import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/makan/gcc/" },
  title: "GCC Buyers — Investing in UK Property | Makan by PropertyVault",
  description: "For GCC nationals buying UK property: non-resident SDLT calculator, the purchase step by step, halal finance, and guaranteed rent for overseas landlords.",
  keywords: "GCC property investment UK, Saudi Arabia UK property, UAE UK property, non-resident stamp duty UK, SDLT calculator non-resident, buy UK property from Gulf, halal mortgage UK, guaranteed rent overseas landlord",
  openGraph: {
    title: "Buying UK Property from the Gulf — GCC Investor Guide",
    description: "Free SDLT calculator for non-UK residents. Step-by-step guide for GCC nationals buying UK property. Available in Arabic and English.",
    type: "website",
    locale: "en_GB",
    siteName: "Makan — PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/makan/opengraph-image", width: 1200, height: 630, alt: "Makan — Find Your Place. Free property listings worldwide." }],
  },
};

export default function GCCLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
