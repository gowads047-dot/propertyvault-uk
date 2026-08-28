import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export const metadata: Metadata = {
  title: "UK Property Investment Area Guides — 20 Cities",
  description: "In-depth buy-to-let investment guides for 20 UK cities. Rental yields, area breakdowns, regeneration analysis, and free deal tools for property investors.",
  keywords: "property investment UK, buy to let city guides, rental yield by city, Birmingham property investment, Manchester buy to let, Leeds property, Liverpool investment, Bristol buy to let",
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/areas/" },
  openGraph: {
    title: "UK Property Investment Area Guides — 20 Cities",
    description: "In-depth buy-to-let investment guides for 20 UK cities. Rental yields, area breakdowns, regeneration analysis, and free deal tools for property investors.",
    type: "website",
    url: "https://www.propertyvaultuk.co.uk/areas/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "UK Property Investment Areas" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "UK Property Investment Area Guides — 20 Cities",
    description: "In-depth buy-to-let investment guides for 20 UK cities. Rental yields, area breakdowns, regeneration analysis, and free deal tools for property investors.",
  },
};

const MIDLANDS = [
  {
    city: "Birmingham",
    href: "/areas/birmingham",
    region: "West Midlands",
    yield: "6-8%",
    price: "avg £230k",
    desc: "The UK's second city — HS2 regeneration, 80,000+ students, and some of the strongest BTL yields outside London.",
    tags: ["HMO hotspot", "Student lettings", "HS2 uplift"],
    gr: true,
  },
  {
    city: "Coventry",
    href: "/areas/coventry",
    region: "West Midlands",
    yield: "5-7%",
    price: "avg £215k",
    desc: "UK City of Culture 2021, two major universities, and JLR's HQ. Excellent value with a £1bn+ city centre regeneration.",
    tags: ["City of Culture", "Dual university", "UKBIC"],
    gr: true,
  },
  {
    city: "Wolverhampton",
    href: "/areas/wolverhampton",
    region: "West Midlands",
    yield: "5-7%",
    price: "avg £185k",
    desc: "Often overlooked, but 20 minutes from Birmingham by train. JLR's i54 Business Park anchors professional demand.",
    tags: ["Affordable", "JLR i54", "Good transport"],
    gr: false,
  },
  {
    city: "Leicester",
    href: "/areas/leicester",
    region: "East Midlands",
    yield: "6-9%",
    price: "avg £175k",
    desc: "Two universities, a large NHS workforce, and property prices well below the national average — a consistently overlooked gem.",
    tags: ["Affordable entry", "NHS demand", "Student market"],
    gr: true,
  },
  {
    city: "Nottingham",
    href: "/areas/nottingham",
    region: "East Midlands",
    yield: "7-10%",
    price: "avg £195k",
    desc: "Consistently among the UK's highest-yielding rental cities — two universities, low entry prices, and strong tenant demand.",
    tags: ["Highest yields", "Affordable entry", "Dual university"],
    gr: true,
  },
  {
    city: "Derby",
    href: "/areas/derby",
    region: "East Midlands",
    yield: "5-7%",
    price: "avg £205k",
    desc: "Growing industrial base anchored by Rolls-Royce and Toyota. Stable professional tenant market with solid long-term demand.",
    tags: ["Low vacancy", "Professional tenants", "Rolls-Royce hub"],
    gr: true,
  },
];

const NORTH = [
  {
    city: "Manchester",
    href: "/areas/manchester",
    region: "Greater Manchester",
    yield: "5-7%",
    price: "avg £250k",
    desc: "The UK's most dynamic city outside London. 100,000+ students, MediaCityUK, and billions in ongoing development.",
    tags: ["Northern Powerhouse", "100k students", "MediaCityUK"],
    gr: false,
  },
  {
    city: "Leeds",
    href: "/areas/leeds",
    region: "West Yorkshire",
    yield: "5-7%",
    price: "avg £235k",
    desc: "Largest financial centre outside London. UK's biggest city regen project (South Bank, 136 hectares) underway.",
    tags: ["Financial hub", "South Bank regen", "80k students"],
    gr: false,
  },
  {
    city: "Sheffield",
    href: "/areas/sheffield",
    region: "South Yorkshire",
    yield: "7-10%",
    price: "avg £170k",
    desc: "65,000+ students across two universities, major Attercliffe regeneration, and some of the highest BTL yields in the north.",
    tags: ["High yield", "Dual university", "Attercliffe growth"],
    gr: true,
  },
  {
    city: "Liverpool",
    href: "/areas/liverpool",
    region: "Merseyside",
    yield: "6-8%",
    price: "avg £185k",
    desc: "£5.5bn Liverpool Waters project, Baltic Triangle creative quarter, and some of England's most affordable investment stock.",
    tags: ["High yield", "Liverpool Waters", "Affordable entry"],
    gr: false,
  },
  {
    city: "Bradford",
    href: "/areas/bradford",
    region: "West Yorkshire",
    yield: "6-9%",
    price: "avg £160k",
    desc: "UK City of Culture 2025 with Channel 4, Morrisons HQ, and 20-minute train access to Leeds. One of England's best-value cities.",
    tags: ["City of Culture", "Very affordable", "Leeds commuter"],
    gr: false,
  },
  {
    city: "Newcastle",
    href: "/areas/newcastle",
    region: "Tyne and Wear",
    yield: "5-8%",
    price: "avg £185k",
    desc: "Two universities, Sage Group HQ, and a growing tech economy — among the most affordable major northern cities.",
    tags: ["Affordable", "2 universities", "Science Central"],
    gr: false,
  },
  {
    city: "Hull",
    href: "/areas/hull",
    region: "East Yorkshire",
    yield: "7-9%",
    price: "avg £155k",
    desc: "UK's offshore wind capital. Fruit Market regeneration. Entry prices from under £100k — exceptional cash-flow yields.",
    tags: ["Top yields", "Offshore wind", "Fruit Market regen"],
    gr: false,
  },
];

const SOUTH_AND_SCOTLAND = [
  {
    city: "Bristol",
    href: "/areas/bristol",
    region: "South West England",
    yield: "4-6%",
    price: "avg £390k",
    desc: "Airbus, GCHQ, Rolls-Royce, and a Russell Group university. Temple Quarter is Europe's largest urban regen project.",
    tags: ["Capital growth", "Tech economy", "Temple Quarter"],
    gr: false,
  },
  {
    city: "Cardiff",
    href: "/areas/cardiff",
    region: "Wales",
    yield: "4-6%",
    price: "avg £280k",
    desc: "Wales's capital — BBC Wales, HMRC, Admiral Insurance HQ, and 80,000 students. Prices well below comparable English cities.",
    tags: ["Capital city", "BBC & HMRC", "80k students"],
    gr: false,
  },
  {
    city: "Southampton",
    href: "/areas/southampton",
    region: "South East England",
    yield: "4-6%",
    price: "avg £265k",
    desc: "UK's largest cruise port, BAE Systems, Carnival UK HQ, and two universities. Significantly cheaper than Winchester.",
    tags: ["Port economy", "BAE Systems", "2 universities"],
    gr: false,
  },
  {
    city: "Portsmouth",
    href: "/areas/portsmouth",
    region: "South East England",
    yield: "5-7%",
    price: "avg £250k",
    desc: "The UK's only island city. Royal Navy, BAE Systems, and a strong university create a uniquely stable rental market.",
    tags: ["Royal Navy", "Island city", "BAE Systems"],
    gr: false,
  },
  {
    city: "Stoke-on-Trent",
    href: "/areas/stoke-on-trent",
    region: "Staffordshire",
    yield: "7-10%",
    price: "avg £145k",
    desc: "bet365, Michelin, and one of England's best cash-flow markets. Entry prices from under £100k in central areas.",
    tags: ["Top yields", "Very affordable", "bet365 HQ"],
    gr: false,
  },
  {
    city: "Glasgow",
    href: "/areas/glasgow",
    region: "Scotland",
    yield: "5-7%",
    price: "avg £200k",
    desc: "Scotland's largest city — 4 universities, 90,000 students, Barclays campus, and Clyde Waterfront regeneration.",
    tags: ["4 universities", "Clyde regen", "Affordable Scotland"],
    gr: false,
  },
  {
    city: "Edinburgh",
    href: "/areas/edinburgh",
    region: "Scotland",
    yield: "4-5%",
    price: "avg £360k",
    desc: "Scotland's capital and a global investment market. Chronic undersupply, world-class university, and the Festival Fringe.",
    tags: ["Capital growth", "UNESCO heritage", "Festival demand"],
    gr: false,
  },
];

function CityCard({ c }: { c: typeof MIDLANDS[0] }) {
  return (
    <Link href={c.href} className="group block bg-white rounded-2xl border border-navy-100 p-7 card-hover">
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs font-semibold text-navy-400 uppercase tracking-widest">{c.region}</p>
        <span className="text-xs font-bold text-gold-600 bg-gold-50 px-2 py-0.5 rounded-full">{c.yield} yield</span>
      </div>
      <h2 className="text-xl font-extrabold text-navy-800 mb-0.5 group-hover:text-gold-600 transition-colors" style={{ fontFamily: "var(--font-family-heading)" }}>{c.city}</h2>
      <p className="text-xs text-navy-400 mb-3">{c.price}</p>
      <p className="text-sm text-navy-500 mb-4 leading-relaxed">{c.desc}</p>
      <div className="flex flex-wrap gap-1 mb-4">
        {c.tags.map(tag => (
          <span key={tag} className="text-xs font-medium text-navy-600 bg-navy-50 px-2 py-0.5 rounded-full">{tag}</span>
        ))}
        {c.gr && (
          <span className="text-xs font-bold text-gold-700 bg-gold-50 px-2 py-0.5 rounded-full border border-gold-200">Guaranteed rent ✓</span>
        )}
      </div>
      <span className="text-sm font-semibold text-navy-800 group-hover:text-gold-600 transition-colors">Read guide →</span>
    </Link>
  );
}

export default function AreasPage() {
  return (
    <>
      <section className="bg-white py-16 md:py-24">
        <div className="container-max px-4 text-center">
          <Breadcrumbs items={[{ label: "Areas" }]} />
          <p className="text-xs font-semibold text-navy-400 uppercase tracking-widest mb-3 mt-4">Area guides</p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-navy-800 mb-4" style={{ fontFamily: "var(--font-family-heading)" }}>
            UK property investment area guides
          </h1>
          <p className="text-navy-500 max-w-xl mx-auto">
            In-depth buy-to-let guides for 20 UK cities — yields, area breakdowns, regeneration analysis, and free tools for every market.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mt-6">
            <span className="text-xs font-semibold text-navy-600 bg-navy-50 px-3 py-1.5 rounded-full border border-navy-100">20 cities covered</span>
            <span className="text-xs font-semibold text-gold-700 bg-gold-50 px-3 py-1.5 rounded-full border border-gold-200">6 guaranteed rent cities</span>
            <span className="text-xs font-semibold text-navy-600 bg-navy-50 px-3 py-1.5 rounded-full border border-navy-100">Live sold price data</span>
          </div>
        </div>
      </section>

      {/* Yield Heatmap */}
      <section className="bg-white section-padding border-t border-navy-100">
        <div className="container-max px-4">
          <div className="mb-8 text-center">
            <p className="text-xs font-semibold text-navy-400 uppercase tracking-widest mb-2">Ranked by yield</p>
            <h2 className="text-2xl font-extrabold text-navy-800" style={{ fontFamily: "var(--font-family-heading)" }}>
              UK city yield heatmap
            </h2>
            <p className="text-navy-500 text-sm mt-2 max-w-lg mx-auto">Gross yield ranges for all 20 cities, sorted highest to lowest. High yield ≠ best deal — always run your numbers.</p>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 justify-center mb-8">
            {[
              { label: "High yield (7%+)", color: "#15803d", bg: "#f0fdf4" },
              { label: "Solid (5–7%)", color: "var(--gold-ink)", bg: "#faf8f0" },
              { label: "Capital growth (<5%)", color: "#475569", bg: "#f8fafc" },
            ].map(b => (
              <span key={b.label} className="flex items-center gap-2 text-xs font-semibold" style={{ color: b.color }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: b.color, display: "inline-block" }} />
                {b.label}
              </span>
            ))}
          </div>

          <div className="max-w-2xl mx-auto space-y-2">
            {[
              { city: "Nottingham",    href: "/areas/nottingham",    yield: "7–10%", mid: 8.5, band: "high" },
              { city: "Sheffield",     href: "/areas/sheffield",     yield: "7–10%", mid: 8.5, band: "high" },
              { city: "Stoke-on-Trent",href: "/areas/stoke-on-trent",yield: "7–10%", mid: 8.5, band: "high" },
              { city: "Hull",          href: "/areas/hull",          yield: "7–9%",  mid: 8.0, band: "high" },
              { city: "Leicester",     href: "/areas/leicester",     yield: "6–9%",  mid: 7.5, band: "high" },
              { city: "Bradford",      href: "/areas/bradford",      yield: "6–9%",  mid: 7.5, band: "high" },
              { city: "Birmingham",    href: "/areas/birmingham",    yield: "6–8%",  mid: 7.0, band: "high" },
              { city: "Liverpool",     href: "/areas/liverpool",     yield: "6–8%",  mid: 7.0, band: "high" },
              { city: "Newcastle",     href: "/areas/newcastle",     yield: "5–8%",  mid: 6.5, band: "solid" },
              { city: "Coventry",      href: "/areas/coventry",      yield: "5–7%",  mid: 6.0, band: "solid" },
              { city: "Derby",         href: "/areas/derby",         yield: "5–7%",  mid: 6.0, band: "solid" },
              { city: "Leeds",         href: "/areas/leeds",         yield: "5–7%",  mid: 6.0, band: "solid" },
              { city: "Manchester",    href: "/areas/manchester",    yield: "5–7%",  mid: 6.0, band: "solid" },
              { city: "Portsmouth",    href: "/areas/portsmouth",    yield: "5–7%",  mid: 6.0, band: "solid" },
              { city: "Glasgow",       href: "/areas/glasgow",       yield: "5–7%",  mid: 6.0, band: "solid" },
              { city: "Wolverhampton", href: "/areas/wolverhampton", yield: "5–7%",  mid: 6.0, band: "solid" },
              { city: "Bristol",       href: "/areas/bristol",       yield: "4–6%",  mid: 5.0, band: "growth" },
              { city: "Cardiff",       href: "/areas/cardiff",       yield: "4–6%",  mid: 5.0, band: "growth" },
              { city: "Southampton",   href: "/areas/southampton",   yield: "4–6%",  mid: 5.0, band: "growth" },
              { city: "Edinburgh",     href: "/areas/edinburgh",     yield: "4–5%",  mid: 4.5, band: "growth" },
            ].map((c, i) => {
              // Built in a ternary, which is why the colour sweep could not see it:
              // #c9a84c measured 2.15 on the #faf8f0 badge behind it.
              const color = c.band === "high" ? "#15803d" : c.band === "solid" ? "#7d631d" : "#475569";
              const bg    = c.band === "high" ? "#f0fdf4" : c.band === "solid" ? "#faf8f0" : "#f8fafc";
              const barW  = `${Math.round((c.mid / 8.5) * 100)}%`;
              return (
                <Link key={c.city} href={c.href} className="group flex items-center gap-3 rounded-xl px-4 py-2.5 border border-transparent hover:border-navy-100 hover:bg-navy-50 transition-colors">
                  <span className="text-xs font-bold text-navy-400 w-5 text-right tabular-nums">{i + 1}</span>
                  <span className="w-28 text-sm font-semibold text-navy-700 group-hover:text-gold-600 transition-colors shrink-0">{c.city}</span>
                  <div className="flex-1 h-5 rounded-full overflow-hidden" style={{ background: "#f1f5f9" }}>
                    <div style={{ width: barW, height: "100%", borderRadius: 999, background: color, transition: "width 0.3s ease" }} />
                  </div>
                  <span className="text-xs font-bold w-12 text-right tabular-nums shrink-0" style={{ color }}>
                    {c.yield}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full shrink-0" style={{ color, background: bg }}>
                    {c.band === "high" ? "High" : c.band === "solid" ? "Solid" : "Growth"}
                  </span>
                </Link>
              );
            })}
          </div>

          <p className="text-center text-xs text-navy-400 mt-6">
            Yields are gross — before mortgage, management, and costs. <Link href="/calculators/rental-yield" className="text-gold-600 hover:text-gold-700 font-semibold">Calculate your net yield →</Link>
          </p>
        </div>
      </section>

      <div className="border-t border-navy-100" />

      {/* Midlands */}
      <section className="bg-navy-50 section-padding">
        <div className="container-max px-4">
          <div className="mb-8 flex flex-wrap items-end gap-4">
            <div>
              <h2 className="text-2xl font-extrabold text-navy-800" style={{ fontFamily: "var(--font-family-heading)" }}>Midlands</h2>
              <p className="text-navy-500 text-sm mt-1">Our core operating region — guaranteed rent available in Birmingham, Coventry, Leicester, Nottingham, Derby, and Sheffield.</p>
            </div>
            <Link href="/areas/postcodes" className="text-xs font-semibold text-gold-600 hover:text-gold-700 whitespace-nowrap">Postcode guides →</Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {MIDLANDS.map(c => <CityCard key={c.city} c={c} />)}
          </div>
        </div>
      </section>

      {/* North of England */}
      <section className="bg-white section-padding">
        <div className="container-max px-4">
          <div className="mb-8">
            <h2 className="text-2xl font-extrabold text-navy-800" style={{ fontFamily: "var(--font-family-heading)" }}>North of England</h2>
            <p className="text-navy-500 text-sm mt-1">Seven major northern cities — from Manchester and Leeds to Hull, one of England's best cash-flow markets.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {NORTH.map(c => <CityCard key={c.city} c={c} />)}
          </div>
        </div>
      </section>

      {/* South & Scotland */}
      <section className="bg-navy-50 section-padding">
        <div className="container-max px-4">
          <div className="mb-8">
            <h2 className="text-2xl font-extrabold text-navy-800" style={{ fontFamily: "var(--font-family-heading)" }}>South of England & Scotland</h2>
            <p className="text-navy-500 text-sm mt-1">Bristol, Cardiff, Southampton, Portsmouth, Stoke-on-Trent, Glasgow, and Edinburgh — from capital-growth markets to highest-yield plays.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SOUTH_AND_SCOTLAND.map(c => <CityCard key={c.city} c={c} />)}
          </div>
        </div>
      </section>

      {/* GR CTA */}
      <section className="bg-white section-padding border-t border-navy-100">
        <div className="container-max px-4 max-w-3xl text-center">
          <p className="text-xs font-semibold text-gold-500 uppercase tracking-widest mb-3">Midlands landlords</p>
          <h2 className="text-2xl font-extrabold text-navy-800 mb-3" style={{ fontFamily: "var(--font-family-heading)" }}>
            Own a property in Birmingham, Coventry, Leicester, Nottingham, Derby, or Sheffield?
          </h2>
          <p className="text-navy-500 mb-6">
            We&apos;ll lease it from you and pay a fixed monthly income for 3–5 years. No voids, no management, no fees.
          </p>
          <Link href="/guaranteed-rent" className="btn-gold">
            Check your property qualifies →
          </Link>
        </div>
      </section>
    </>
  );
}
