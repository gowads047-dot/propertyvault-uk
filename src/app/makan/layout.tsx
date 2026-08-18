import type { Metadata } from "next";
import { AuthProvider } from "@/lib/auth-context";

export const metadata: Metadata = {
  title: "Makan — Bilingual UK & International Property Platform | PropertyVault",
  description: "The first bilingual property platform for the Arab diaspora. Find homes, rooms and investment properties across the UK, Morocco and Egypt — in Arabic and English.",
  openGraph: {
    title: "Makan — Bilingual UK Property Platform for the Arab Diaspora",
    description: "Find homes, rooms and investment properties across the UK, Morocco and Egypt in Arabic and English. Built for the Arab diaspora community.",
    type: "website",
    locale: "ar_AR",
    siteName: "Makan — PropertyVault UK",
  },
};

// Pages below call useAuth(), so the provider must sit above them. Without it
// useAuth() falls back to the default context, whose loading is hard-coded true
// and never changes, leaving every page stuck on its loading state.
export default function MakanLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
