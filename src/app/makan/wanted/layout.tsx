import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/makan/wanted/" },
  title: "Property Wanted — Post What You Are Looking For | Makan",
  description: "Cannot find it? Post what you need and let landlords come to you. Free to post on Makan by PropertyVault UK.",
};

export default function WantedLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
