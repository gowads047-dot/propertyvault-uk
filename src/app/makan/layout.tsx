import type { Metadata } from "next";
import { AuthProvider } from "@/lib/auth-context";
import { LangProvider } from "@/lib/lang-context";

// No canonical here on purpose. This layout wraps every page under /makan, so a
// canonical set at this level told Google that /makan/rooms/, /makan/wanted/,
// /makan/list/ and every /makan/listing/<id>/ were duplicates of /makan/ — none
// of them could be indexed on their own. Each page declares its own canonical
// in its own layout instead. Title and description stay as the fallback for
// any page that does not override them.
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
//
// LangProvider is here for exactly the same reason, and was missing. Without
// it useLang() fell back to a default whose t() returns the key it was given,
// so /makan/list rendered the literal strings "list.signinRequired" and
// "nav.signup" to users, and dir never became "rtl" for Arabic.
export default function MakanLayout({ children }: { children: React.ReactNode }) {
  return (
    <LangProvider>
      <AuthProvider>{children}</AuthProvider>
    </LangProvider>
  );
}
