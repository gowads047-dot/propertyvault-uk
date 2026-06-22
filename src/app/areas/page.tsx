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
              { city: "Birmingham", href: "/areas/birmingham", region: "West Midlands" },
              { city: "Nottingham", href: "/areas/nottingham", region: "East Midlands" },
              { city: "Derby", href: "/areas/derby", region: "East Midlands" },
            ].map((c) => (
              <Link key={c.city} href={c.href} className="group block bg-white rounded-2xl border border-navy-100 p-8 card-hover">
                <p className="text-xs font-semibold text-navy-400 uppercase tracking-widest mb-2">{c.region}</p>
                <h2 className="text-2xl font-extrabold text-navy-800 mb-3 group-hover:text-gold-600 transition-colors" style={{ fontFamily: "var(--font-family-heading)" }}>{c.city}</h2>
                <p className="text-sm text-navy-500 mb-4">Property investment guide, rental yields, area analysis, and guaranteed rent options.</p>
                <span className="text-sm font-semibold text-navy-800 group-hover:text-gold-600 transition-colors">Read guide →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
