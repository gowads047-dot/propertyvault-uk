import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { DISTRICTS } from "./[district]/page";
import { DataProvenance } from "@/components/ui/DataProvenance";

export const metadata: Metadata = {
  title: "Midlands Postcode Investment Guides — Sold Prices & Yields",
  description: "Sold prices, rental yields, and buy-to-let investment guides for 40+ Midlands postcode districts. Birmingham, Coventry, Nottingham, Derby, Leicester, and Sheffield.",
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/areas/postcodes/" },
  keywords: "Midlands postcode investment, Birmingham postcodes buy to let, Nottingham postcode yields, Derby LE DE postcode investment, Sheffield S postcode guide",
};

const CITIES = ["Birmingham", "Coventry", "Nottingham", "Derby", "Leicester", "Sheffield"] as const;

export default function PostcodesIndexPage() {
  return (
    <>
      <section className="bg-white py-16 md:py-24">
        <div className="container-max px-4 text-center">
          <Breadcrumbs items={[{ label: "Areas", href: "/areas" }, { label: "Postcode guides" }]} />
          <p className="text-xs font-semibold text-navy-400 uppercase tracking-widest mb-3 mt-4">Postcode guides</p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-navy-800 mb-4" style={{ fontFamily: "var(--font-family-heading)" }}>
            Midlands postcode investment guides
          </h1>
          <p className="text-navy-500 max-w-xl mx-auto">
            Sold prices, typical yields, and area profiles for every major postcode district across the Midlands — powered by live Land Registry data.
          </p>
        </div>
      </section>

      <div className="border-t border-navy-100" />

      {CITIES.map(city => {
        const districts = DISTRICTS.filter(d => d.city === city);
        return (
          <section key={city} className="bg-white section-padding border-b border-navy-50">
            <div className="container-max px-4">
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-xl font-extrabold text-navy-800" style={{ fontFamily: "var(--font-family-heading)" }}>{city}</h2>
                <Link href={`/areas/${districts[0]?.citySlug}`} className="text-xs font-semibold text-gold-600 hover:text-gold-700">Full city guide →</Link>
              </div>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {districts.map(d => (
                  <Link
                    key={d.code}
                    href={`/areas/postcodes/${d.code.toLowerCase()}`}
                    className="group bg-navy-50 rounded-xl border border-navy-100 p-4 hover:border-gold-400 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-extrabold text-navy-900 group-hover:text-gold-600 transition-colors">{d.code}</span>
                      <span className="text-xs font-bold text-gold-600">{d.yield}</span>
                    </div>
                    <p className="text-xs text-navy-500 leading-snug">{d.label.split("—")[1]?.trim()}</p>
                    <p className="text-xs text-navy-400 mt-1">{d.avgPrice}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      <section className="bg-navy-800 section-padding">
        <div className="container-max px-4 max-w-3xl text-center">
          <p className="text-xs font-semibold text-gold-400 uppercase tracking-widest mb-2">Guaranteed rent</p>
          <h2 className="text-2xl font-extrabold text-white mb-3" style={{ fontFamily: "var(--font-family-heading)" }}>
            Own a property in the Midlands?
          </h2>
          <p className="text-white/60 text-sm mb-6">
            We cover all Midlands postcodes — B, CV, NG, DE, LE, and S. We lease your property and pay you every month for 3–5 years.
          </p>
          <Link href="/guaranteed-rent" className="btn-gold">Check your property qualifies →</Link>
        </div>
      </section>
      <DataProvenance />
    </>
  );
}
