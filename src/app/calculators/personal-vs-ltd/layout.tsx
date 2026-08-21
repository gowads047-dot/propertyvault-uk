import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Personal vs Limited Company Property Calculator UK 2026 | PropertyVault",
  description: "Compare buying property in your personal name vs a limited company (SPV). Calculate tax, mortgage costs, profit, and dividend income to find the most efficient structure.",
  keywords: "personal vs limited company property UK, SPV property calculator, should I use a limited company property, property company vs personal name tax",
  openGraph: {
    title: "Personal vs Limited Company Property Calculator UK | PropertyVault",
    description: "Compare personal ownership vs SPV limited company for your buy-to-let. See the real tax difference.",
    type: "website",
    url: "https://www.propertyvaultuk.co.uk/calculators/personal-vs-ltd/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "Personal vs Limited Company Calculator — PropertyVault UK" }],
  },
  twitter: { card: "summary_large_image", title: "Personal vs Limited Company Property Calculator UK | PropertyVault", description: "Free tool — find the most tax-efficient ownership structure." },
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/calculators/personal-vs-ltd/" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
