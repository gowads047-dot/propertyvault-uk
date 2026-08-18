import type { Metadata } from "next";
import { AuthProvider } from "@/lib/auth-context";

export const metadata: Metadata = {
  title: "Academy — Deal Sourcing Programme | PropertyVault UK",
  description:
    "Learn UK property deal sourcing end to end: strategy, lead generation, running the numbers, packaging deals, compliance and scaling.",
  alternates: { canonical: "https://propertyvaultuk.co.uk/academy/" },
};

// Academy pages call useAuth(), so they need the provider above them. Without it
// useAuth() falls back to the default context, whose `loading` is hard-coded true
// and never changes — every page below would sit on its loading state forever.
export default function AcademyLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
