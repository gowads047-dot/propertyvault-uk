import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PropertyVault UK — 15 Free Property Calculators, 40+ Templates, Zero Sign-Up",
  description: "The UK's most comprehensive free property platform. 15 calculators, 40+ templates, expert guides, and tools for investors, landlords, and buyers.",
};

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="bg-white">
        <div className="container-max px-4 py-16 md:py-24 lg:py-32 text-center">
          <p className="text-sm font-semibold text-navy-500 mb-4 tracking-wide">100% Free · No Sign-Up Required</p>
          <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold text-navy-800 mb-5 leading-[1.1] max-w-2xl mx-auto" style={{ fontFamily: "var(--font-family-heading)" }}>
            Property calculators, templates, and guides — all free
          </h1>
          <p className="text-lg text-navy-500 mb-10 max-w-lg mx-auto">
            15 calculators. 40+ templates. Expert UK property guides. Built for investors, landlords, and buyers.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/calculators" className="btn-primary text-center">Explore calculators</Link>
            <Link href="/guaranteed-rent" className="btn-secondary text-center">Book free valuation</Link>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="border-t border-navy-100" />

      {/* Guaranteed Rent — Featured */}
      <section className="bg-navy-50 py-16 md:py-20">
        <div className="container-max px-4">
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
        </div>
      </section>

      {/* Tools — Clean grid, no emojis */}
      <section className="bg-white section-padding">
        <div className="container-max px-4">
          <p className="text-xs font-semibold text-navy-400 uppercase tracking-widest mb-2 text-center">Free tools</p>
          <h2 className="text-2xl md:text-3xl font-extrabold text-navy-800 text-center mb-12" style={{ fontFamily: "var(--font-family-heading)" }}>Everything in one place</h2>

          <div className="grid md:grid-cols-2 gap-5 mb-5">
            {[
              { title: "15 Free Calculators", desc: "Mortgage, stamp duty, BRRR, rental yield, Section 24, HMO, bridging, flip ROI, affordability, and more.", href: "/calculators" },
              { title: "40+ Templates & Checklists", desc: "Buyer, seller, landlord, and commercial property. Fillable forms, compliance trackers, and inventories.", href: "/templates" },
            ].map((c) => (
              <Link key={c.title} href={c.href} className="group block bg-white rounded-2xl border border-navy-100 p-8 card-hover">
                <h3 className="text-lg font-bold text-navy-800 mb-2 group-hover:text-gold-600 transition-colors">{c.title}</h3>
                <p className="text-sm text-navy-500 leading-relaxed mb-4">{c.desc}</p>
                <span className="text-sm font-semibold text-navy-800 group-hover:text-gold-600 transition-colors">Explore →</span>
              </Link>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Property Search", desc: "Rightmove, Zoopla & more", href: "/search" },
              { title: "Area Research", desc: "Crime, schools, flood risk", href: "/area-guide" },
              { title: "Expert Guides", desc: "BTL, BRRR, HMO, tax, law", href: "/property-investing" },
              { title: "Property Glossary", desc: "46 terms explained", href: "/glossary" },
            ].map((s) => (
              <Link key={s.title} href={s.href} className="group block bg-white rounded-2xl border border-navy-100 p-6 card-hover">
                <h3 className="font-semibold text-navy-800 text-sm group-hover:text-gold-600 transition-colors">{s.title}</h3>
                <p className="text-xs text-navy-400 mt-1">{s.desc}</p>
              </Link>
            ))}
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
            <Link href="/blog/biggest-financial-lie-britain" className="group md:col-span-3 block bg-navy-800 rounded-2xl p-8 md:p-10 relative overflow-hidden">
              <span className="inline-block px-3 py-1 bg-white/10 text-white/80 text-xs font-semibold rounded-full mb-6">Featured</span>
              <h3 className="text-xl md:text-2xl font-extrabold text-white mb-3 group-hover:text-gold-400 transition-colors leading-tight" style={{ fontFamily: "var(--font-family-heading)" }}>The Biggest Financial Lie in Britain Is Unravelling</h3>
              <p className="text-white/60 text-sm">For 40 years, Britain believed property prices would always rise. That assumption is now failing.</p>
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
                { href: "/calculators", label: "All 15 Calculators" },
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
                { href: "/tools", label: "Property Tools" },
                { href: "/area-guide", label: "Area Research" },
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
