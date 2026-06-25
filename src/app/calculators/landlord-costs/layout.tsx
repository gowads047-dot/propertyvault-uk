import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Landlord Costs Calculator UK — Annual Running Costs for Buy-to-Let | PropertyVault",
  description: "Calculate the true annual cost of owning a rental property in the UK. Insurance, maintenance, compliance, management fees, and void periods — all in one place.",
  keywords: "landlord costs calculator UK, buy to let running costs, annual landlord expenses, rental property cost calculator, BTL cost breakdown",
  openGraph: {
    title: "Landlord Costs Calculator UK | PropertyVault",
    description: "Calculate the true annual cost of your rental property — insurance, maintenance, management, and more.",
    type: "website",
    url: "https://propertyvaultuk.co.uk/calculators/landlord-costs/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://propertyvaultuk.co.uk/og-image.png", width: 1200, height: 630, alt: "Landlord Costs Calculator — PropertyVault UK" }],
  },
  twitter: { card: "summary_large_image", title: "Landlord Costs Calculator UK | PropertyVault", description: "Free tool — see the real annual cost of your rental property." },
  alternates: { canonical: "https://propertyvaultuk.co.uk/calculators/landlord-costs/" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
