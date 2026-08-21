import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Makan — Our Story",
  description: "Makan means place in Arabic. We connect people to places — directly. No agents, no commission, no barriers. Free property listings across UK, Middle East, and North Africa.",
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/makan/about/" },
};

export default function AboutMakanPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-20 md:py-28" style={{ background: "var(--h-surface)" }}>
        <div className="h-container max-w-3xl text-center">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center" style={{ background: "var(--h-accent)" }}>
            <svg className="w-9 h-9 text-white" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2L2 8.5V17a1 1 0 001 1h4.5v-5a1.5 1.5 0 011.5-1.5h2a1.5 1.5 0 011.5 1.5v5H17a1 1 0 001-1V8.5L10 2z"/></svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight" style={{ color: "var(--h-text)", lineHeight: 1.05 }}>
            Every home has a story.<br />Yours starts here.
          </h1>
        </div>
      </section>

      {/* Story */}
      <section className="py-16" style={{ background: "var(--h-bg)", borderTop: "1px solid var(--h-border)" }}>
        <div className="h-container max-w-2xl">
          <div className="space-y-6 text-base leading-relaxed" style={{ color: "var(--h-muted)" }}>
            <p>Before Makan, finding a place meant paying someone just to look. Agents took their cut before you&apos;d even turned a key. Platforms charged landlords to list, then charged tenants to enquire. And if you were living abroad — an Egyptian building a future in London, a Moroccan raising a family in Dubai, a Jordanian studying in Birmingham — finding or managing property back home meant blind trust, bad photos, and broken promises.</p>

            <p>We built Makan because we grew up in that gap. Between two countries. Between two languages. Between wanting a home and being able to find one without someone taking a percentage of your hope.</p>

            <div className="py-8 my-4 text-center" style={{ borderTop: "1px solid var(--h-border)", borderBottom: "1px solid var(--h-border)" }}>
              <p className="text-3xl md:text-4xl font-extrabold tracking-tight" style={{ color: "var(--h-text)" }}>
                مكان
              </p>
              <p className="text-lg mt-2 italic" style={{ color: "var(--h-accent)" }}>&ldquo;Makan&rdquo; — place, in Arabic.</p>
              <p className="text-sm mt-2" style={{ color: "var(--h-muted)" }}>Not just a building. Not just four walls. A place where your mother visits and says &ldquo;this is nice.&rdquo; A place where your kids know which floorboard creaks. A place that&apos;s yours.</p>
            </div>

            <p>We connect people to places — directly. No agents standing between you and your next home. No algorithms deciding who deserves to see what. Just real listings, real photos, real people. Landlord to tenant. Buyer to seller. Human to human.</p>
          </div>
        </div>
      </section>

      {/* Free promise */}
      <section className="py-16" style={{ background: "var(--h-surface)", borderTop: "1px solid var(--h-border)" }}>
        <div className="h-container max-w-2xl">
          <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--h-text)" }}>Our promise</h2>
          <div className="space-y-6 text-base leading-relaxed" style={{ color: "var(--h-muted)" }}>
            <p><strong style={{ color: "var(--h-text)" }}>Today, Makan is completely free.</strong> Free to list. Free to browse. Free to message. We believe access to housing shouldn&apos;t have a paywall.</p>

            <p>As we grow, we may introduce optional premium features for landlords who want more visibility — featured placements, promoted listings, professional photography. But the core of Makan will always remain open. Listing your property, browsing the platform, and messaging landlords will always be free.</p>

            <p>Because the moment we charge people to find a home, we become the problem we set out to solve.</p>
          </div>
        </div>
      </section>

      {/* Scale */}
      <section className="py-16" style={{ background: "var(--h-bg)", borderTop: "1px solid var(--h-border)" }}>
        <div className="h-container max-w-3xl">
          <h2 className="text-2xl font-bold mb-8 text-center" style={{ color: "var(--h-text)" }}>From Birmingham to Bahrain</h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
            {[
              { flag: "🇬🇧", name: "UK" },
              { flag: "🇲🇦", name: "Morocco" },
              { flag: "🇪🇬", name: "Egypt" },
              { flag: "🇦🇪", name: "UAE" },
              { flag: "🇸🇦", name: "Saudi" },
              { flag: "🇰🇼", name: "Kuwait" },
              { flag: "🇧🇭", name: "Bahrain" },
              { flag: "🇶🇦", name: "Qatar" },
              { flag: "🇴🇲", name: "Oman" },
              { flag: "🇯🇴", name: "Jordan" },
            ].map(c => (
              <div key={c.name} className="text-center py-4 rounded-xl" style={{ background: "var(--h-surface)", border: "1px solid var(--h-border)" }}>
                <span className="text-2xl">{c.flag}</span>
                <p className="text-xs font-semibold mt-1" style={{ color: "var(--h-text)" }}>{c.name}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-sm" style={{ color: "var(--h-muted)" }}>Available in English, Arabic, and French — because your language shouldn&apos;t be a barrier to finding where you belong.</p>
        </div>
      </section>

      {/* What makes us different */}
      <section className="py-16" style={{ background: "var(--h-surface)", borderTop: "1px solid var(--h-border)" }}>
        <div className="h-container max-w-3xl">
          <h2 className="text-2xl font-bold mb-8 text-center" style={{ color: "var(--h-text)" }}>What makes Makan different</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              { title: "Zero commission", desc: "Airbnb takes 3-15%. Agents take a month's rent. Makan takes nothing. Your money stays yours.", icon: "💰" },
              { title: "No agents required", desc: "Bayut and Rightmove force you through agents. On Makan, you list directly and talk directly.", icon: "🤝" },
              { title: "Built for the diaspora", desc: "Living in London but investing in Cairo? In Dubai but renting in Casablanca? Makan bridges the gap.", icon: "🌍" },
              { title: "Three languages, natively", desc: "English, Arabic, and French — not as a Google Translate afterthought, but built in from day one.", icon: "🗣️" },
              { title: "WhatsApp-first", desc: "This is how the Middle East and North Africa actually communicates. One tap, you're talking to the landlord.", icon: "📱" },
              { title: "Quality enforced", desc: "Every listing needs real photos, a proper description, and goes through review. No blurry screenshots.", icon: "✅" },
            ].map(item => (
              <div key={item.title} className="rounded-2xl p-6" style={{ background: "var(--h-bg)", border: "1px solid var(--h-border)" }}>
                <span className="text-2xl">{item.icon}</span>
                <h3 className="font-bold mt-3 mb-1" style={{ color: "var(--h-text)" }}>{item.title}</h3>
                <p className="text-sm" style={{ color: "var(--h-muted)" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Movement */}
      <section className="py-20" style={{ background: "var(--h-slate)" }}>
        <div className="h-container max-w-2xl text-center">
          <p className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-6">
            This isn&apos;t a property portal.<br />It&apos;s a movement.
          </p>
          <p className="text-white/50 mb-8 max-w-md mx-auto">Every listing on Makan is a door. And every door should be open.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/makan" className="h-btn h-btn-primary text-center">Browse listings</Link>
            <Link href="/makan/list" className="h-btn h-btn-secondary !border-white/20 !text-white text-center">List for free</Link>
          </div>
          <p className="text-white/30 text-sm mt-8">Welcome to Makan. Find your place.</p>
        </div>
      </section>
    </>
  );
}
