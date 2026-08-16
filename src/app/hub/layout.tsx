import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Hub — PropertyVault",
  description: "Manage your PropertyVault account, Rentura properties, Makan listings, and Academy progress from one place.",
  robots: { index: false, follow: false },
};

export default function HubLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
