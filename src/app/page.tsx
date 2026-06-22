import Link from "next/link";
import type { Metadata } from "next";
import { FadeIn } from "@/components/ui/FadeIn";

export const metadata: Metadata = {
  title: "PropertyVault UK — 17 Free Property Calculators, 40+ Templates, Zero Sign-Up",
  description: "The UK's most comprehensive free property platform. 17 calculators, 40+ templates, expert guides, and tools for investors, landlords, and buyers.",
};

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="bg-white">
        <div className="container-max px-4 py-16 md:py-24 lg:py-32 text-center">
          <p className="text-sm font-semibold text-navy-500 mb-4 tracking-wide">100% Free · No Sign-Up Required</p>
          <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold text-navy-800 mb-5 leading-[1.1] max-w-2xl mx-auto" style={{ fontFamily: "var(--font-family-heading)" }}>
            Analyse deals, cut tax, and grow your portfolio
          </h1>
          <p className="text-lg text-navy-500 mb-10 max-w-lg mx-auto">
            17 free calculators, 40+ templates, and expert guides for UK property investors, landlords, and buyers.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
            <Link href="/calculators/deal-analyser" className="btn-gold text-center">Analyse a deal</Link>
            <Link href="/calculators" className="btn-primary text-center">All calculators</Link>
            <Link href="/guaranteed-rent" className="btn-secondary text-center">Guaranteed rent</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
            <div><p className="text-2xl md:text-3xl font-extrabold text-navy-800">17</p><p className="text-xs text-navy-400 mt-0.5">Free calculators</p></div>
            <div><p className="text-2xl md:text-3xl font-extrabold text-navy-800">40+</p><p className="text-xs text-navy-400 mt-0.5">Templates</p></div>
            <div><p className="text-2xl md:text-3xl font-extrabold text-navy-800">49</p><p className="text-xs text-navy-400 mt-0.5">Glossary terms</p></div>
            <div><p className="text-2xl md:text-3xl font-extrabold text-navy-800">3</p><p className="text-xs text-navy-400 mt-0.5">Area guides</p></div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="border-t border-navy-100" />

      {/* Guaranteed Rent — Featured */}
      <section className="bg-navy-50 py-16 md:py-20">
        <div className="container-max px-4">
          <FadeIn>
          <div className="bg-white rounded-3xl p-8 md:p-12 border border-navy-100 shadow-sm">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <p className="text-xs font-semibold text-gold-600 uppercase tracking-widest mb-3">For landlords</p>
                <h2 className="text-2xl md:text-3xl font-extrabold text-navy-800 mb-4" style={{ fontFamily: "var(--font-family-heading)" }}>Guaranteed rent in Birmingham, Nottingham &amp; Derby</h2>
                <p className="text-navy-500 mb-6">We lease your property and pay you every month for 3-5 years. No voids, no management, no fees.</p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/guaranteed-rent" className="btn-gold">Book free valuation</Link>
                  <a href="https://wa.me/4407415721628?text=Hi%2C%20I%27m%20a%20landlord%20interested%20in%20guaranteed%20rent." target="_blank" rel="noopener noreferrer" className="btn-outline flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    WhatsApp
                  </a>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { n: "3-5", l: "Year leases" },
                  { n: "Zero", l: "Void periods" },
                  { n: "100%", l: "Management included" },
                ].map((s) => (
                  <div key={s.l} className="bg-navy-50 rounded-2xl p-5 text-center">
                    <p className="text-xl font-extrabold text-navy-800">{s.n}</p>
                    <p className="text-xs text-navy-500 mt-1">{s.l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          </FadeIn>
        </div>
      </section>

      {/* Makan Promo */}
      <section className="bg-white section-padding">
        <div className="container-max px-4">
          <FadeIn>
          <Link href="/makan" className="group block rounded-3xl p-8 md:p-12 border-2 border-navy-100 hover:border-[#e8553d]/30 transition-all" style={{ background: "linear-gradient(135deg, #faf9f7 0%, #fef0ed 100%)" }}>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#e8553d" }}>
                    <svg className="w-5 h-5 text-white" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2L2 8.5V17a1 1 0 001 1h4.5v-5a1.5 1.5 0 011.5-1.5h2a1.5 1.5 0 011.5 1.5v5H17a1 1 0 001-1V8.5L10 2z"/></svg>
                  </div>
                  <span className="text-2xl font-bold tracking-tight text-navy-800">makan</span>
                  <span className="px-2 py-0.5 bg-[#e8553d] text-white text-xs font-bold rounded-full">New</span>
                </div>
                <h2 className="text-xl md:text-2xl font-extrabold text-navy-800 mb-3" style={{ fontFamily: "var(--font-family-heading)" }}>Find your place — free listings for everyone</h2>
                <p className="text-navy-500 text-sm mb-4">Browse rooms, flats, and houses across Birmingham, Nottingham, and Derby. List your property for free. No agents, no fees, no catch.</p>
                <span className="text-sm font-semibold group-hover:text-[#e8553d] transition-colors text-navy-800">Browse listings →</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white rounded-xl p-4 text-center shadow-sm"><p className="text-lg font-bold text-navy-800">Free</p><p className="text-xs text-navy-400">To list</p></div>
                <div className="bg-white rounded-xl p-4 text-center shadow-sm"><p className="text-lg font-bold text-navy-800">Free</p><p className="text-xs text-navy-400">To browse</p></div>
                <div className="bg-white rounded-xl p-4 text-center shadow-sm"><p className="text-lg font-bold text-navy-800">Zero</p><p className="text-xs text-navy-400">Agent fees</p></div>
              </div>
            </div>
          </Link>
          </FadeIn>
        </div>
      </section>

      {/* Tools — Clean grid, no emojis */}
      <section className="bg-white section-padding">
        <div className="container-max px-4">
          <FadeIn>
          <p className="text-xs font-semibold text-navy-400 uppercase tracking-widest mb-2 text-center">Free tools</p>
          <h2 className="text-2xl md:text-3xl font-extrabold text-navy-800 text-center mb-12" style={{ fontFamily: "var(--font-family-heading)" }}>Everything in one place</h2>
          </FadeIn>

          {/* Large feature cards */}
          <div className="grid md:grid-cols-2 gap-5 mb-5">
            <Link href="/calculators" className="group block bg-white rounded-2xl border border-navy-100 p-8 card-hover">
              <div className="w-12 h-12 rounded-2xl bg-navy-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7" viewBox="0 0 28 28" fill="none"><rect x="2" y="6" width="24" height="18" rx="3" fill="#c9a84c"/><path d="M6 20V14" stroke="white" strokeWidth="3" strokeLinecap="round"/><path d="M11 20V11" stroke="white" strokeWidth="3" strokeLinecap="round"/><path d="M16 20V8" stroke="white" strokeWidth="3" strokeLinecap="round"/><path d="M21 20V5" stroke="white" strokeWidth="3" strokeLinecap="round"/></svg>
              </div>
              <h3 className="text-lg font-bold text-navy-800 mb-2 group-hover:text-gold-600 transition-colors">17 Free Calculators</h3>
              <p className="text-sm text-navy-500 leading-relaxed mb-4">Deal analyser, mortgage, stamp duty, BRRR, rental yield, CGT, Section 24, HMO, bridging, flip ROI, and more.</p>
              <span className="text-sm font-semibold text-navy-800 group-hover:text-gold-600 transition-colors">Explore →</span>
            </Link>
            <Link href="/templates" className="group block bg-white rounded-2xl border border-navy-100 p-8 card-hover">
              <div className="w-12 h-12 rounded-2xl bg-navy-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7" viewBox="0 0 28 28" fill="none"><rect x="4" y="2" width="20" height="24" rx="3" fill="#E8D5B7"/><rect x="8" y="6" width="12" height="2" rx="1" fill="#0f1b36" opacity="0.3"/><rect x="8" y="10" width="8" height="2" rx="1" fill="#0f1b36" opacity="0.3"/><rect x="8" y="14" width="10" height="2" rx="1" fill="#0f1b36" opacity="0.3"/><path d="M16 18l3 3 5-6" stroke="#c9a84c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <h3 className="text-lg font-bold text-navy-800 mb-2 group-hover:text-gold-600 transition-colors">40+ Templates &amp; Checklists</h3>
              <p className="text-sm text-navy-500 leading-relaxed mb-4">Buyer, seller, landlord, and commercial property. Fillable forms, compliance trackers, and inventories.</p>
              <span className="text-sm font-semibold text-navy-800 group-hover:text-gold-600 transition-colors">Explore →</span>
            </Link>
          </div>

          {/* Smaller tool cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/search" className="group block bg-white rounded-2xl border border-navy-100 p-6 card-hover">
              <div className="w-10 h-10 rounded-xl bg-navy-50 flex items-center justify-center mb-3 group-hover:bg-gold-50 transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none"><circle cx="9" cy="9" r="6" stroke="#0f1b36" strokeWidth="2"/><path d="M13.5 13.5L17 17" stroke="#c9a84c" strokeWidth="2.5" strokeLinecap="round"/></svg>
              </div>
              <h3 className="font-semibold text-navy-800 text-sm group-hover:text-gold-600 transition-colors">Property Search</h3>
              <p className="text-xs text-navy-400 mt-1">Rightmove, Zoopla &amp; more</p>
            </Link>
            <Link href="/areas" className="group block bg-white rounded-2xl border border-navy-100 p-6 card-hover">
              <div className="w-10 h-10 rounded-xl bg-navy-50 flex items-center justify-center mb-3 group-hover:bg-gold-50 transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none"><path d="M10 2C6.5 2 4 5 4 8.5C4 13 10 18 10 18s6-5 6-9.5C16 5 13.5 2 10 2z" fill="#c9a84c"/><circle cx="10" cy="8" r="2.5" fill="white"/></svg>
              </div>
              <h3 className="font-semibold text-navy-800 text-sm group-hover:text-gold-600 transition-colors">Area Guides</h3>
              <p className="text-xs text-navy-400 mt-1">Birmingham, Nottingham, Derby</p>
            </Link>
            <Link href="/property-investing" className="group block bg-white rounded-2xl border border-navy-100 p-6 card-hover">
              <div className="w-10 h-10 rounded-xl bg-navy-50 flex items-center justify-center mb-3 group-hover:bg-gold-50 transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none"><rect x="2" y="4" width="16" height="12" rx="2" fill="#0f1b36"/><path d="M5 12l3-3 2 2 4-5" stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <h3 className="font-semibold text-navy-800 text-sm group-hover:text-gold-600 transition-colors">Expert Guides</h3>
              <p className="text-xs text-navy-400 mt-1">BTL, BRRR, HMO, tax, law</p>
            </Link>
            <Link href="/glossary" className="group block bg-white rounded-2xl border border-navy-100 p-6 card-hover">
              <div className="w-10 h-10 rounded-xl bg-navy-50 flex items-center justify-center mb-3 group-hover:bg-gold-50 transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none"><rect x="3" y="2" width="14" height="16" rx="2" fill="#E8D5B7"/><text x="10" y="13" textAnchor="middle" fill="#0f1b36" fontSize="8" fontWeight="bold">A-Z</text></svg>
              </div>
              <h3 className="font-semibold text-navy-800 text-sm group-hover:text-gold-600 transition-colors">Property Glossary</h3>
              <p className="text-xs text-navy-400 mt-1">49 terms explained</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Blog — Asymmetric layout */}
      <section className="bg-navy-50 section-padding">
        <div className="container-max px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-extrabold text-navy-800" style={{ fontFamily: "var(--font-family-heading)" }}>From the blog</h2>
            <Link href="/blog" className="text-sm font-semibold text-navy-500 hover:text-navy-800 transition-colors hidden sm:block">All articles →</Link>
          </div>

          <div className="grid md:grid-cols-5 gap-5">
            <Link href="/blog/uk-property-market-2026" className="group md:col-span-3 block bg-navy-800 rounded-2xl p-8 md:p-10 relative overflow-hidden">
              <span className="inline-block px-3 py-1 bg-gold-400/20 text-gold-400 text-xs font-bold rounded-full mb-6">New · June 2026</span>
              <h3 className="text-xl md:text-2xl font-extrabold text-white mb-3 group-hover:text-gold-400 transition-colors leading-tight" style={{ fontFamily: "var(--font-family-heading)" }}>UK Property Market 2026 — What Investors Need to Know</h3>
              <p className="text-white/60 text-sm">Mortgage rates, house prices, rental demand — an honest look at where we are and what it means for your next deal.</p>
            </Link>

            <div className="md:col-span-2 flex flex-col gap-5">
              <Link href="/blog/brrr-strategy-explained" className="group block bg-white rounded-2xl border border-navy-100 p-6 card-hover flex-1">
                <p className="text-xs font-semibold text-navy-400 mb-2">Investing</p>
                <h3 className="font-bold text-navy-800 group-hover:text-gold-600 transition-colors leading-snug">What Is the BRRR Strategy?</h3>
              </Link>
              <Link href="/blog/guaranteed-rent-explained" className="group block bg-white rounded-2xl border border-navy-100 p-6 card-hover flex-1">
                <p className="text-xs font-semibold text-navy-400 mb-2">Landlords</p>
                <h3 className="font-bold text-navy-800 group-hover:text-gold-600 transition-colors leading-snug">Guaranteed Rent — Is It Worth It?</h3>
              </Link>
            </div>
          </div>
          <div className="text-center mt-5 sm:hidden">
            <Link href="/blog" className="text-sm font-semibold text-navy-500">All articles →</Link>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="bg-white section-padding">
        <div className="container-max px-4">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 text-sm">
            {[
              { title: "For Landlords", links: [
                { href: "/guaranteed-rent", label: "Guaranteed Rent" },
                { href: "/landlord-hub", label: "Compliance Guide" },
                { href: "/renting-strategies", label: "Renting Strategies" },
                { href: "/templates", label: "Templates" },
              ]},
              { title: "For Investors", links: [
                { href: "/property-investing", label: "Investment Guides" },
                { href: "/calculators", label: "All 17 Calculators" },
                { href: "/glossary", label: "Property Glossary" },
                { href: "/blog", label: "Blog" },
              ]},
              { title: "For Buyers", links: [
                { href: "/first-time-buyer", label: "First-Time Buyers" },
                { href: "/mortgages", label: "Mortgages" },
                { href: "/calculators/stamp-duty", label: "Stamp Duty" },
                { href: "/search", label: "Property Search" },
              ]},
              { title: "Resources", links: [
                { href: "/areas", label: "Area Guides" },
                { href: "/tools", label: "Property Tools" },
                { href: "/sold-prices", label: "Sold Prices" },
                { href: "/contact", label: "Contact" },
              ]},
            ].map((group) => (
              <div key={group.title}>
                <h3 className="font-semibold text-navy-800 mb-3">{group.title}</h3>
                <ul className="space-y-2.5">
                  {group.links.map((link) => (
                    <li key={link.href}><Link href={link.href} className="text-navy-400 hover:text-navy-800 transition-colors">{link.label}</Link></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy-800">
        <div className="container-max px-4 py-16 md:py-20 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4" style={{ fontFamily: "var(--font-family-heading)" }}>Start making smarter property decisions</h2>
          <p className="text-white/50 mb-8 max-w-md mx-auto text-sm">Free forever. No sign-up. No paywalls.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/calculators" className="btn-gold text-center">Explore calculators</Link>
            <Link href="/guaranteed-rent" className="btn-outline !border-white/20 !text-white hover:!bg-white/5 text-center">Guaranteed rent</Link>
          </div>
        </div>
      </section>
    </>
  );
}
