import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/makan/list/" },
  title: "List a Property Free — Makan by PropertyVault UK",
  description: "List a room or property on Makan for free. No listing fees, in English or Arabic.",
};

export default function ListLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
