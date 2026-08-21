import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { countries } from "@/lib/hetta-config";

interface Props {
  params: Promise<{ code: string }>;
}

export async function generateStaticParams() {
  return countries.map(c => ({ code: c.code }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  const country = countries.find(c => c.code === code);
  if (!country) return {};
  return {
    alternates: { canonical: `https://www.propertyvaultuk.co.uk/makan/country/${code}/` },
    title: `Property in ${country.name} — Makan`,
    description: country.hero,
  };
}

export default async function CountryPage({ params }: Props) {
  const { code } = await params;
  const country = countries.find(c => c.code === code);
  if (!country) notFound();

  const otherCountries = countries.filter(c => c.code !== code).slice(0, 5);

  return (
    <>
      {/* Hero */}
      <section className="py-16 md:py-24" style={{ background: "var(--h-surface)" }}>
        <div className="h-container max-w-3xl">
          <Link href="/makan" className="inline-flex items-center gap-1 text-sm font-medium mb-8" style={{ color: "var(--h-muted)" }}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
            All countries
          </Link>
          <div className="flex items-center gap-4 mb-6">
            <span className="text-6xl">{country.flag}</span>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--h-accent)" }}>Property in</p>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight" style={{ color: "var(--h-text)" }}>{country.name}</h1>
            </div>
          </div>
          <p className="text-lg leading-relaxed" style={{ color: "var(--h-muted)" }}>{country.hero}</p>
        </div>
      </section>

      {/* Quick stats */}
      <section className="py-10" style={{ background: "var(--h-bg)", borderTop: "1px solid var(--h-border)" }}>
        <div className="h-container max-w-3xl">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Avg rent", value: country.avgRent },
              { label: "Climate", value: country.climate },
              { label: "Language", value: country.language },
              { label: "Foreign buyers", value: country.foreignBuy },
            ].map(stat => (
              <div key={stat.label} className="h-card !rounded-xl p-4">
                <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--h-subtle)" }}>{stat.label}</p>
                <p className="text-sm font-bold leading-snug" style={{ color: "var(--h-text)" }}>{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16" style={{ background: "var(--h-surface)", borderTop: "1px solid var(--h-border)" }}>
        <div className="h-container max-w-2xl">
          <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--h-text)" }}>The market story</h2>
          <p className="text-base leading-relaxed" style={{ color: "var(--h-muted)" }}>{country.story}</p>
          <div className="mt-8 p-5 rounded-2xl" style={{ background: "var(--h-accent-light)", border: "1px solid var(--h-border)" }}>
            <p className="text-sm font-semibold" style={{ color: "var(--h-accent)" }}>Why Makan investors choose {country.name}</p>
            <p className="text-sm mt-1" style={{ color: "var(--h-text)" }}>{country.highlight}</p>
          </div>
        </div>
      </section>

      {/* Top areas */}
      <section className="py-16" style={{ background: "var(--h-bg)", borderTop: "1px solid var(--h-border)" }}>
        <div className="h-container max-w-3xl">
          <h2 className="text-2xl font-bold mb-8" style={{ color: "var(--h-text)" }}>Top areas in {country.name}</h2>
          <div className="space-y-6">
            {country.topAreas.map(area => {
              const story = country.cityStories[area];
              return (
                <div key={area} className="rounded-2xl p-6" style={{ background: "var(--h-surface)", border: "1px solid var(--h-border)" }}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-lg" style={{ color: "var(--h-text)" }}>{area}</h3>
                    <Link
                      href={`/makan?country=${code}&city=${encodeURIComponent(area)}`}
                      className="text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors"
                      style={{ background: "var(--h-accent-light)", color: "var(--h-accent)" }}
                    >
                      Browse →
                    </Link>
                  </div>
                  {story ? (
                    <p className="text-sm leading-relaxed" style={{ color: "var(--h-muted)" }}>{story}</p>
                  ) : (
                    <p className="text-sm" style={{ color: "var(--h-muted)" }}>Properties available in {area}.</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* All cities */}
      <section className="py-16" style={{ background: "var(--h-surface)", borderTop: "1px solid var(--h-border)" }}>
        <div className="h-container max-w-3xl">
          <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--h-text)" }}>All cities in {country.name}</h2>
          <div className="flex flex-wrap gap-3">
            {country.cities.map(city => (
              <Link
                key={city}
                href={`/makan?country=${code}&city=${encodeURIComponent(city)}`}
                className="px-4 py-2 rounded-full text-sm font-semibold transition-colors"
                style={{ background: "var(--h-bg)", border: "1px solid var(--h-border)", color: "var(--h-text)" }}
              >
                {city}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16" style={{ background: "var(--h-slate)" }}>
        <div className="h-container max-w-2xl text-center">
          <span className="text-4xl mb-4 block">{country.flag}</span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4">Find your place in {country.name}</h2>
          <p className="mb-8" style={{ color: "rgba(255,255,255,0.6)" }}>Browse real listings from landlords — no agents, no commission, no catch.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href={`/makan?country=${code}`} className="h-btn h-btn-primary">Browse {country.name} listings</Link>
            <Link href="/makan/list" className="h-btn" style={{ background: "rgba(255,255,255,0.1)", color: "white", border: "1px solid rgba(255,255,255,0.2)" }}>List your property free</Link>
          </div>
        </div>
      </section>

      {/* Other countries */}
      <section className="py-12" style={{ background: "var(--h-bg)", borderTop: "1px solid var(--h-border)" }}>
        <div className="h-container max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wider mb-5" style={{ color: "var(--h-subtle)" }}>Explore other markets</p>
          <div className="flex flex-wrap gap-3">
            {otherCountries.map(c => (
              <Link
                key={c.code}
                href={`/makan/country/${c.code}`}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors"
                style={{ background: "var(--h-surface)", border: "1px solid var(--h-border)", color: "var(--h-text)" }}
              >
                <span>{c.flag}</span> {c.name}
              </Link>
            ))}
            <Link
              href="/makan"
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
              style={{ background: "var(--h-accent-light)", color: "var(--h-accent)", border: "1px solid var(--h-border)" }}
            >
              All countries →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
