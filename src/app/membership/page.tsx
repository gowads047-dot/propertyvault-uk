import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Membership — Coming Soon | PropertyVault UK",
  description: "PropertyVault membership is coming soon. Join the waiting list to be the first to access exclusive courses, tools, and community features.",
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/membership/" },
  openGraph: {
    title: "Membership — Coming Soon | PropertyVault UK",
    description: "PropertyVault membership is coming soon. Join the waiting list to be the first to access exclusive courses, tools, and community features.",
    type: "website",
    url: "https://www.propertyvaultuk.co.uk/membership/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "PropertyVault UK Membership" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Membership — Coming Soon | PropertyVault UK",
    description: "PropertyVault membership is coming soon. Join the waiting list to be the first to access exclusive courses, tools, and community features.",
  },
};

export default function MembershipPage() {
  return (
    <>
      <section className="gradient-navy py-20 md:py-28">
        <div className="container-max px-4 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-gold-400 text-sm font-semibold mb-8">
            <span className="w-2 h-2 bg-gold-400 rounded-full animate-pulse" />
            Coming Soon
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4" style={{ fontFamily: "var(--font-family-heading)" }}>
            PropertyVault Membership
          </h1>
          <p className="text-lg text-navy-200 max-w-2xl mx-auto mb-10">
            We&apos;re building something special for serious property investors and landlords. Exclusive tools, courses, and a private community — all in one place.
          </p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max max-w-3xl">
          <h2 className="text-2xl font-bold text-navy-800 mb-6 text-center" style={{ fontFamily: "var(--font-family-heading)" }}>What&apos;s Coming</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              { title: "Exclusive Courses", desc: "Step-by-step property investment courses covering BRRR, HMOs, serviced accommodation, development, and portfolio building.", icon: "🎓" },
              { title: "Advanced Calculators", desc: "Portfolio-level analysis tools, deal comparison, and scenario modelling that go beyond our free calculators.", icon: "📊" },
              { title: "Private Community", desc: "Connect with serious UK property investors. Share deals, ask questions, and learn from experienced landlords.", icon: "👥" },
              { title: "Live Masterclasses", desc: "Monthly live sessions with property professionals — mortgage brokers, solicitors, tax specialists, and experienced investors.", icon: "🎙️" },
              { title: "Deal Analysis Tools", desc: "Submit any deal and get a detailed analysis report — yield, cash flow, stress test, and comparison against benchmarks.", icon: "🔍" },
              { title: "Market Reports", desc: "Monthly regional market reports with rental data, price trends, and investment hotspot analysis.", icon: "📈" },
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

      {/* Waiting List */}
      <section className="section-padding bg-navy-50/40">
        <div className="container-max max-w-lg text-center">
          <h2 className="text-2xl font-bold text-navy-800 mb-3" style={{ fontFamily: "var(--font-family-heading)" }}>Join the Waiting List</h2>
          <p className="text-sm text-navy-500 mb-6">Be the first to know when membership launches. No spam, just one email when we&apos;re ready.</p>
          <form className="space-y-3">
            <input aria-label="Your email address" type="email" placeholder="Your email address" required
              className="w-full px-4 py-3.5 border border-navy-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-400 text-center" />
            <button type="submit" className="btn-primary w-full !py-3.5">Join Waiting List</button>
          </form>
        </div>
      </section>

      {/* Free Tools Reminder */}
      <section className="section-padding bg-white">
        <div className="container-max max-w-3xl text-center">
          <h2 className="text-xl font-bold text-navy-800 mb-3">In the Meantime — Everything Below Is Free</h2>
          <p className="text-sm text-navy-500 mb-6">No membership needed. Use all of these right now, completely free.</p>
          <div className="grid sm:grid-cols-3 gap-3">
            <Link href="/calculators" className="block bg-white rounded-xl border border-navy-100 p-4 hover:shadow-md transition-all">
              <p className="font-bold text-navy-800 text-sm">15 Calculators</p>
              <p className="text-xs text-navy-500">Mortgage, yield, BRRR, Section 24 & more</p>
            </Link>
            <Link href="/templates" className="block bg-white rounded-xl border border-navy-100 p-4 hover:shadow-md transition-all">
              <p className="font-bold text-navy-800 text-sm">40+ Templates</p>
              <p className="text-xs text-navy-500">Checklists, trackers & forms</p>
            </Link>
            <Link href="/property-investing" className="block bg-white rounded-xl border border-navy-100 p-4 hover:shadow-md transition-all">
              <p className="font-bold text-navy-800 text-sm">Expert Guides</p>
              <p className="text-xs text-navy-500">BTL, BRRR, HMO, tax, law & more</p>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
