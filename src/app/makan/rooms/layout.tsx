import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/makan/rooms/" },
  title: "Rooms to Rent — Makan by PropertyVault UK",
  description: "Rooms in house shares and managed properties across the UK. No agent fees, contact landlords directly. Listings in English and Arabic.",
};

export default function RoomsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
