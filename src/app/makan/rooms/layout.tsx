import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/makan/rooms/" },
  title: "Rooms, Studios & Whole Properties to Rent — Makan by PropertyVault UK",
  description: "Rooms, studios and whole properties across the UK, including company lets for serviced accommodation and supported living. No agent fees, contact landlords directly.",
};

export default function RoomsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
