import type { Metadata } from "next";
import { AuthProvider } from "@/lib/auth-context";
import { LangProvider } from "@/lib/lang-context";
import { MakanHeader } from "@/components/makan/MakanHeader";
import { MakanFooter } from "@/components/makan/MakanFooter";

// No canonical here on purpose. This layout wraps every page under /makan, so a
// canonical set at this level told Google that /makan/rooms/, /makan/wanted/,
// /makan/list/ and every /makan/listing/<id>/ were duplicates of /makan/ — none
// of them could be indexed on their own. Each page declares its own canonical
// in its own layout instead. Title and description stay as the fallback for
// any page that does not override them.
export const metadata: Metadata = {
  title: "Makan — Property Lettings Without an Agent",
  description: "List rooms, studios and whole properties free. Long lets and company lets, reaching tenants and operators directly — no estate agent in between.",
  openGraph: {
    title: "Makan — List once. Tenants and companies both see it.",
    description: "Free to list, no agent, no commission. Rooms, studios and whole properties across the UK, in English and Arabic.",
    type: "website",
    locale: "en_GB",
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
//
// The "makan" class carries Makan's entire design system. globals.css defines
// --h-bg, --h-accent, --h-slate and the rest on ".makan", along with every
// .h-btn, .h-card, .h-input and .h-container rule scoped beneath it.
//
// Nothing in the app ever applied that class, so all of it was dead. Every
// var(--h-slate) resolved to nothing, .h-btn rendered as unstyled block text
// with no radius or background, and .h-container had no max-width. The worst
// of it was the hero copy, which sets its colour inline as
// rgba(255,255,255,0.6) against a section background that never went dark:
// white on cream, measured on the live site at 1.03:1 against the 4.5:1 AA
// floor. The sentence explaining what /makan/rooms is was invisible.
//
// Scoped here rather than on <body> so the palette cannot leak into the rest
// of PropertyVault, which is why it was written as .makan in the first place.
// Makan carries its own header and footer, not PropertyVault's.
//
// They sit here rather than in the root layout because both read useAuth and
// useLang, and those providers are below the root — rendered at root level the
// header would read the default context, whose loading is hard-coded true, and
// never resolve.
//
// The root chrome hides itself on /makan so the two do not stack.
export default function MakanLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="makan flex flex-col min-h-screen">
      <LangProvider>
        <AuthProvider>
          <MakanHeader />
          <div className="flex-1">{children}</div>
          <MakanFooter />
        </AuthProvider>
      </LangProvider>
    </div>
  );
}
