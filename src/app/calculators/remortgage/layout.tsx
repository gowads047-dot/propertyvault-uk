import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Remortgage Calculator UK — Should I Remortgage? Savings & Costs | PropertyVault",
  description: "Calculate if remortgaging makes financial sense. Compare your current rate vs new deals, see monthly savings, break-even point, and net saving after all fees.",
  keywords: "remortgage calculator UK, should I remortgage, remortgage savings calculator, when to remortgage, remortgage cost calculator",
  openGraph: {
    title: "Remortgage Calculator UK | PropertyVault",
    description: "Calculate your monthly savings and break-even point before remortgaging. Compare current vs new mortgage deals.",
    type: "website",
    url: "https://www.propertyvaultuk.co.uk/calculators/remortgage/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "Remortgage Calculator — PropertyVault UK" }],
  },
  twitter: { card: "summary_large_image", title: "Remortgage Calculator UK | PropertyVault", description: "Free tool — see if remortgaging will actually save you money." },
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/calculators/remortgage/" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
