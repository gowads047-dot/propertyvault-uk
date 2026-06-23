import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Property Investment Areas — West Midlands & East Midlands | PropertyVault UK",
  description: "Property investment guides for Birmingham, Nottingham, Derby, and the wider West and East Midlands. Rental yields, area analysis, and guaranteed rent available.",
  keywords: "property investment Birmingham, property investment Nottingham, property investment Derby, West Midlands property, East Midlands property, buy to let Birmingham",
};

export default function AreasPage() {
  return (
    <>
      <section className="bg-white py-16 md:py-24">
        <div className="container-max px-4 text-center">
          <p className="text-xs font-semibold text-navy-400 uppercase tracking-widest mb-3">Area guides</p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-navy-800 mb-4" style={{ fontFamily: "var(--font-family-heading)" }}>Property investing by area</h1>
          <p className="text-navy-500 max-w-lg mx-auto">In-depth guides for property investors and landlords across the West Midlands and East Midlands.</p>
        </div>
      </section>

      <div className="border-t border-navy-100" />

      <section className="bg-navy-50 section-padding">
        <div className="container-max px-4">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                city: "Birmingham",
                href: "/areas/birmingham",
                region: "West Midlands",
                yield: "6–8%",
                price: "avg £230k",
                desc: "The UK's second city — HS2 regeneration, 80,000+ students, and some of the strongest BTL yields outside London.",
                tags: ["HMO hotspot", "Student lettings", "HS2 uplift"],
              },
              {
                city: "Nottingham",
                href: "/areas/nottingham",
                region: "East Midlands",
                yield: "7–10%",
                price: "avg £195k",
                desc: "Consistently among the UK's highest-yielding rental cities — two universities, low entry prices, and strong tenant demand.",
                tags: ["Highest yields", "Affordable entry", "Dual university"],
              },
              {
                city: "Derby",
                href: "/areas/derby",
                region: "East Midlands",
                yield: "5–7%",
                price: "avg £205k",
                desc: "Growing industrial base anchored by Rolls-Royce and Toyota. Stable, professional tenant market with solid long-term demand.",
                tags: ["Low vacancy", "Professional tenants", "Rolls-Royce hub"],
              },
            ].map((c) => (
              <Link key={c.city} href={c.href} className="group block bg-white rounded-2xl border border-navy-100 p-8 card-hover">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-semibold text-navy-400 uppercase tracking-widest">{c.region}</p>
                  <span className="text-xs font-bold text-gold-600 bg-gold-50 px-2 py-0.5 rounded-full">{c.yield} yield</span>
                </div>
                <h2 className="text-2xl font-extrabold text-navy-800 mb-1 group-hover:text-gold-600 transition-colors" style={{ fontFamily: "var(--font-family-heading)" }}>{c.city}</h2>
                <p className="text-xs text-navy-400 mb-3">{c.price}</p>
                <p className="text-sm text-navy-500 mb-4">{c.desc}</p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {c.tags.map(tag => (
                    <span key={tag} className="text-xs font-medium text-navy-600 bg-navy-50 px-2 py-0.5 rounded-full">{tag}</span>
                  ))}
                </div>
                <span className="text-sm font-semibold text-navy-800 group-hover:text-gold-600 transition-colors">Read guide →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
