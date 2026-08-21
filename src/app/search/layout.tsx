import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/search/" },
  title: "UK Property Search — Compare Rightmove, Zoopla & More | PropertyVault",
  description: "Search UK properties for sale or rent across all major portals. Compare Rightmove, Zoopla, OnTheMarket, and Spareroom in one place.",
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
