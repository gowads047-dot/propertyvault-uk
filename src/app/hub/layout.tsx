import type { Metadata } from "next";
import { AuthProvider } from "@/lib/auth-context";

export const metadata: Metadata = {
  title: "Your Hub — PropertyVault",
  description: "Manage your PropertyVault account, Rentura properties, Makan listings, and Academy progress from one place.",
  robots: { index: false, follow: false },
};

// Pages below call useAuth(), so the provider must sit above them. Without it
// useAuth() falls back to the default context, whose loading is hard-coded true
// and never changes, leaving every page stuck on its loading state.
export default function HubLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
