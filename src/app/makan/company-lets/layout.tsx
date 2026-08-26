import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/makan/company-lets/" },
  title: "Company Lets Explained — Makan by PropertyVault UK",
  description: "What a company let is, what a landlord takes on, and what a serviced-accommodation or supported-living operator commits to. Plain English, both sides of the table.",
};

export default function CompanyLetsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
