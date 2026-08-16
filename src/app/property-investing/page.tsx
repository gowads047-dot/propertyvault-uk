import Link from "next/link";
import type { Metadata } from "next";
import { Disclaimer } from "@/components/legal/Disclaimer";

export const metadata: Metadata = {
  title: "Property Investing UK — Complete Guide for Beginners to Advanced | PropertyVault UK",
  description: "Learn everything about UK property investing. Buy-to-let, BRRR, HMOs, serviced accommodation, property development, and 14 renting strategies. Free guides, calculators, and templates.",
  keywords: "property investing UK, buy to let guide, BRRR strategy UK, HMO investing, property investment for beginners, how to invest in property UK, rental yield, property portfolio",
  alternates: { canonical: "https://propertyvaultuk.co.uk/property-investing/" },
  openGraph: {
    title: "Property Investing UK — Complete Guide for Beginners to Advanced | PropertyVault UK",
    description: "Learn everything about UK property investing. Buy-to-let, BRRR, HMOs, serviced accommodation, property development, and 14 renting strategies. Free guides, calculators, and templates.",
    type: "article",
    url: "https://propertyvaultuk.co.uk/property-investing/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "Property Investing UK Guide" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Property Investing UK — Complete Guide for Beginners to Advanced | PropertyVault UK",
    description: "Learn everything about UK property investing. Buy-to-let, BRRR, HMOs, serviced accommodation, property development, and 14 renting strategies. Free guides, calculators, and templates.",
  },
};

const strategies = [
  { title: "Buy-to-Let", desc: "Purchase a property and rent it to tenants for monthly income. The most popular starting point for UK investors.", href: "/buy-to-let", yield: "4-8%", risk: "Low-Medium", icon: "🏠" },
  { title: "BRRR Strategy", desc: "Buy below market value, refurbish, rent out, refinance to recycle your capital. Scale fast.", href: "/brrr-academy", yield: "8-15%+", risk: "Medium", icon: "🔄" },
  { title: "HMOs", desc: "Rent individual rooms to multiple tenants. Higher yields but more regulation and management.", href: "/hmo-hub", yield: "10-18%+", risk: "Medium-High", icon: "🏢" },
  { title: "Serviced Accommodation", desc: "Short-term lets via Airbnb and Booking.com. Premium income but active management required.", href: "/serviced-accommodation", yield: "12-25%+", risk: "Medium-High", icon: "🛏️" },
  { title: "Property Development", desc: "Build, convert, or refurbish for profit. Highest returns but requires more capital and expertise.", href: "/property-development", yield: "15-30%+", risk: "High", icon: "🏗️" },
  { title: "Commercial Property", desc: "Offices, retail, industrial. Longer leases, different finance, institutional-quality tenants.", href: "/commercial-property", yield: "5-10%", risk: "Medium", icon: "🏬" },
];

const tools = [
  { title: "BRRR Calculator", href: "/calculators/brrr", desc: "Model any BRRR deal — capital recycling, ROI, cash flow" },
  { title: "Rental Yield Calculator", href: "/calculators/rental-yield", desc: "Gross & net yield, monthly cash flow analysis" },
  { title: "HMO Yield Calculator", href: "/calculators/hmo-yield", desc: "Room-by-room income and occupancy analysis" },
  { title: "Section 24 Calculator", href: "/calculators/section-24", desc: "How mortgage interest restriction affects your tax" },
  { title: "Personal vs Ltd Company", href: "/calculators/personal-vs-ltd", desc: "Compare tax: personal ownership vs SPV" },
  { title: "Flip/Refurb ROI", href: "/calculators/flip-roi", desc: "Buy-refurbish-sell profit projection" },
];

export default function PropertyInvestingPage() {
  return (
    <>
      {/* Hero */}
      <section className="gradient-navy relative overflow-hidden py-16 md:py-24">
        <div className="absolute inset-0">
          <div className="absolute top-10 right-[15%] w-[300px] h-[300px] bg-gold-400/5 rounded-full blur-[80px]" />
        </div>
        <div className="container-max px-4 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-gold-400 text-sm font-semibold mb-6">
              <span className="w-2 h-2 bg-gold-400 rounded-full animate-pulse" />
              Complete Guide
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-[1.1]" style={{ fontFamily: "var(--font-family-heading)" }}>
              UK Property Investing
            </h1>
            <p className="text-lg text-navy-200 leading-relaxed">Your complete guide to building wealth through UK property. Whether you&apos;re buying your first investment property or scaling a portfolio — every strategy, risk, and tool explained.</p>
          </div>
        </div>
      </section>

      {/* Why Property */}
      <section className="section-padding bg-white">
        <div className="container-max max-w-4xl">
          <div className="text-center mb-10">
            <p className="text-gold-600 font-bold text-xs uppercase tracking-widest mb-2">Why Property?</p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-navy-800" style={{ fontFamily: "var(--font-family-heading)" }}>Why Invest in UK Property?</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              { title: "Tangible Asset", desc: "Unlike stocks, property is physical — you can see it, improve it, and control it. It provides intrinsic value through shelter.", icon: "🏠" },
              { title: "Leverage", desc: "Banks lend you 75%+ of the value. A £50,000 deposit can control a £200,000 asset — amplifying your returns.", icon: "📈" },
              { title: "Dual Returns", desc: "Monthly rental income AND long-term capital growth. UK property has averaged ~7% annual growth over 50 years.", icon: "💷" },
              { title: "Inflation Hedge", desc: "Rents and property values rise with inflation. Your mortgage debt erodes in real terms over time.", icon: "🛡️" },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl border border-navy-100/80 p-6 card-hover">
                <span className="text-2xl block mb-3">{item.icon}</span>
                <h3 className="font-bold text-navy-800 mb-1">{item.title}</h3>
                <p className="text-sm text-navy-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Strategies */}
      <section className="section-padding bg-navy-50/40">
        <div className="container-max">
          <div className="text-center mb-10">
            <p className="text-gold-600 font-bold text-xs uppercase tracking-widest mb-2">Strategies</p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-navy-800" style={{ fontFamily: "var(--font-family-heading)" }}>Choose Your Strategy</h2>
            <p className="text-navy-500 mt-2 max-w-xl mx-auto">Every successful investor started with one strategy. Compare yields, risk levels, and find the approach that fits you.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {strategies.map((s) => (
              <Link key={s.title} href={s.href} className="group block bg-white rounded-2xl border border-navy-100/80 p-6 card-hover">
                <span className="text-3xl block mb-3">{s.icon}</span>
                <h3 className="text-lg font-bold text-navy-800 mb-2 group-hover:text-gold-600 transition-colors">{s.title}</h3>
                <p className="text-sm text-navy-500 mb-4">{s.desc}</p>
                <div className="flex gap-3 text-xs">
                  <span className="px-2 py-1 bg-green-50 text-green-700 rounded-full font-semibold">Yield: {s.yield}</span>
                  <span className="px-2 py-1 bg-navy-50 text-navy-600 rounded-full font-semibold">Risk: {s.risk}</span>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link href="/renting-strategies" className="text-sm font-semibold text-gold-600 hover:text-gold-700">
              View all 14 renting strategies →
            </Link>
          </div>
        </div>
      </section>

      {/* Samuel Leeds Section — Stands Out */}
      <section className="section-padding bg-white" id="learn-from-samuel">
        <div className="container-max max-w-4xl">
          <div className="text-center mb-8">
            <p className="text-gold-600 font-bold text-xs uppercase tracking-widest mb-2">Recommended Learning</p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-navy-800" style={{ fontFamily: "var(--font-family-heading)" }}>Learn From Samuel Leeds</h2>
            <p className="text-navy-500 mt-2 max-w-xl mx-auto">We highly recommend Samuel Leeds — the UK&apos;s #1 property trainer. His free content is the best starting point for anyone serious about property.</p>
          </div>

          {/* Featured CTA */}
          <div className="bg-gradient-to-br from-navy-800 to-navy-900 rounded-2xl p-6 md:p-8 text-white mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-gold-400/5 rounded-full blur-[60px]" />
            <div className="relative z-10">
              <span className="inline-block px-3 py-1 bg-gold-400/20 text-gold-400 text-xs font-bold rounded-full mb-4">FREE CRASH COURSE</span>
              <h3 className="text-xl md:text-2xl font-extrabold text-white mb-3" style={{ fontFamily: "var(--font-family-heading)" }}>Property Investors Crash Course</h3>
              <p className="text-navy-200 mb-4 max-w-xl">Learn how to buy investment properties, understand deal sourcing, BRRR, rent-to-rent, and start building your portfolio. Thousands of UK investors started here.</p>
              <div className="flex flex-wrap gap-3">
                <a href="https://www.samuelleeds.com/" target="_blank" rel="noopener noreferrer" className="btn-primary !py-3 !px-6">
                  Sign Up Free →
                </a>
                <a href="https://www.youtube.com/@SamuelLeeds" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  YouTube Channel
                </a>
              </div>
            </div>
          </div>

          {/* Video Links */}
          <h3 className="font-bold text-navy-800 text-lg mb-4">Recommended Videos by Samuel Leeds</h3>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {[
              { title: "BRRR Strategy Explained", desc: "How to buy, refurbish, rent, and refinance to recycle your capital and scale a property portfolio.", url: "https://www.youtube.com/results?search_query=samuel+leeds+BRRR+strategy", icon: "🔄", tag: "BRRR" },
              { title: "HMO Investing Guide", desc: "How Houses in Multiple Occupation work, licensing requirements, and how to maximise room-by-room income.", url: "https://www.youtube.com/results?search_query=samuel+leeds+HMO+investing", icon: "🏢", tag: "HMO" },
              { title: "Rent-to-Rent Explained", desc: "How to control properties without buying them. Lease from a landlord, sublet at a higher rent, keep the margin.", url: "https://www.youtube.com/results?search_query=samuel+leeds+rent+to+rent", icon: "🔑", tag: "R2R" },
              { title: "How to Start with No Money", desc: "Strategies for getting into property investing with little or no capital. Creative finance and deal sourcing.", url: "https://www.youtube.com/results?search_query=samuel+leeds+no+money+property", icon: "💰", tag: "Beginners" },
              { title: "Deal Sourcing Masterclass", desc: "How to find below market value properties. Auctions, direct-to-vendor, agents, and sourcing services.", url: "https://www.youtube.com/results?search_query=samuel+leeds+deal+sourcing", icon: "🔍", tag: "Sourcing" },
              { title: "Property Portfolio Building", desc: "How to go from one property to a full portfolio. Scaling strategies, finance, and portfolio management.", url: "https://www.youtube.com/results?search_query=samuel+leeds+property+portfolio", icon: "📈", tag: "Scaling" },
            ].map((v) => (
              <a key={v.title} href={v.url} target="_blank" rel="noopener noreferrer"
                className="flex items-start gap-4 p-4 bg-white rounded-xl border border-navy-100/80 hover:shadow-lg hover:border-gold-400/30 transition-all group">
                <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-navy-50 text-navy-600 text-xs font-bold rounded">{v.tag}</span>
                  </div>
                  <h4 className="font-bold text-navy-800 text-sm group-hover:text-gold-600 transition-colors">{v.title}</h4>
                  <p className="text-xs text-navy-500 mt-0.5">{v.desc}</p>
                </div>
              </a>
            ))}
          </div>
          <p className="text-xs text-navy-400 text-center">PropertyVault is not affiliated with Samuel Leeds. We recommend his content because we believe it provides genuine value. Links open on YouTube.</p>
        </div>
      </section>

      {/* Your Tools */}
      <section className="section-padding bg-navy-50/40">
        <div className="container-max max-w-4xl">
          <div className="text-center mb-8">
            <p className="text-gold-600 font-bold text-xs uppercase tracking-widest mb-2">Your Toolkit</p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-navy-800" style={{ fontFamily: "var(--font-family-heading)" }}>Analyse Any Deal</h2>
            <p className="text-navy-500 mt-2">Use our free calculators to run the numbers before you invest.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map((t) => (
              <Link key={t.title} href={t.href} className="group block bg-white rounded-xl border border-navy-100/80 p-5 card-hover">
                <h3 className="font-bold text-navy-800 text-sm group-hover:text-gold-600 transition-colors">{t.title}</h3>
                <p className="text-xs text-navy-500 mt-1">{t.desc}</p>
              </Link>
            ))}
          </div>
          <div className="text-center mt-4">
            <Link href="/calculators" className="text-sm font-semibold text-gold-600 hover:text-gold-700">View all 15 calculators →</Link>
          </div>
        </div>
      </section>

      {/* Getting Started Steps */}
      <section className="section-padding bg-white">
        <div className="container-max max-w-3xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-extrabold text-navy-800" style={{ fontFamily: "var(--font-family-heading)" }}>How to Get Started</h2>
          </div>
          <div className="space-y-5">
            {[
              { step: "1", title: "Educate Yourself", desc: "Learn the fundamentals. Read our guides, watch Samuel Leeds' free content, and understand different strategies before committing capital." },
              { step: "2", title: "Set Your Goals", desc: "Define what you want — monthly cash flow targets, portfolio size, timeline, and whether you want hands-on or passive income." },
              { step: "3", title: "Build Your Team", desc: "Connect with a mortgage broker, solicitor, accountant, and letting agent. Use our Find a Professional directory." },
              { step: "4", title: "Secure Finance", desc: "Get a mortgage agreement in principle. Use our Affordability Calculator to understand your borrowing capacity." },
              { step: "5", title: "Find Your Deal", desc: "Source properties through agents, auctions, or deal sourcers. Use our BRRR and Yield calculators to analyse every deal." },
              { step: "6", title: "Complete & Let", desc: "Navigate the legal process, complete the purchase, prepare the property, find tenants, and start generating income." },
            ].map((s) => (
              <div key={s.step} className="flex gap-5 items-start">
                <div className="flex-shrink-0 w-12 h-12 gradient-navy rounded-2xl flex items-center justify-center shadow-md">
                  <span className="text-gold-400 font-extrabold text-lg">{s.step}</span>
                </div>
                <div>
                  <h3 className="font-bold text-navy-800 text-lg">{s.title}</h3>
                  <p className="text-sm text-navy-500 mt-0.5">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* More Resources */}
      <section className="section-padding bg-navy-50/40">
        <div className="container-max max-w-4xl">
          <h2 className="text-xl font-bold text-navy-800 mb-6 text-center">Explore More</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { href: "/templates", label: "40+ Templates", desc: "Checklists & forms" },
              { href: "/glossary", label: "Property Glossary", desc: "46 terms explained" },
              { href: "/tools", label: "Property Tools", desc: "28 free tools" },
              { href: "/guaranteed-rent", label: "Guaranteed Rent", desc: "Birmingham, Nottingham, Derby" },
            ].map((r) => (
              <Link key={r.href} href={r.href} className="block bg-white rounded-xl border border-navy-100/80 p-4 hover:shadow-md transition-all text-center">
                <p className="font-bold text-navy-800 text-sm">{r.label}</p>
                <p className="text-xs text-navy-500">{r.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="gradient-navy relative overflow-hidden">
        <div className="container-max px-4 py-16 text-center relative z-10">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4" style={{ fontFamily: "var(--font-family-heading)" }}>Ready to Start?</h2>
          <p className="text-navy-200 mb-6 max-w-xl mx-auto text-sm">Use our free calculators to analyse your first deal, or explore our guides to learn every strategy.</p>
          <p className="text-navy-300 text-xs max-w-2xl mx-auto mb-6">PropertyVault provides educational content only. We are not FCA-regulated and do not provide financial advice. Property investment carries risk — you could lose some or all of your capital. Always seek independent professional advice.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/calculators" className="btn-primary">Explore Calculators →</Link>
            <Link href="/brrr-academy" className="inline-flex items-center justify-center gap-2 px-6 py-3 glass rounded-xl text-white font-semibold hover:bg-white/10 transition-all">BRRR Academy →</Link>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max max-w-4xl">
          <Disclaimer type="general" />
        </div>
      </section>
    </>
  );
}
