import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GCC Buyers — Investing in UK Property | Makan by PropertyVault",
  description: "Complete guide for GCC nationals buying UK property. Non-resident SDLT calculator, step-by-step purchase guide, halal finance options, and guaranteed rent for overseas landlords. Arabic and English.",
  keywords: "GCC property investment UK, Saudi Arabia UK property, UAE UK property, non-resident stamp duty UK, SDLT calculator non-resident, buy UK property from Gulf, halal mortgage UK, guaranteed rent overseas landlord",
  openGraph: {
    title: "Buying UK Property from the Gulf — GCC Investor Guide",
    description: "Free SDLT calculator for non-UK residents. Step-by-step guide for GCC nationals buying UK property. Available in Arabic and English.",
    type: "website",
    locale: "en_GB",
    siteName: "Makan — PropertyVault UK",
  },
};

export default function GCCLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
