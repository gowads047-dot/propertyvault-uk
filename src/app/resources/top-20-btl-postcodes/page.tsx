import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { Disclaimer } from "@/components/legal/Disclaimer";
import { PostcodeEmailCapture } from "@/components/resources/PostcodeEmailCapture";

export const metadata: Metadata = {
  title: "Top 20 UK Buy-to-Let Postcodes 2025 — Free Guide | PropertyVault UK",
  description: "The 20 UK postcodes with the highest documented gross rental yields in 2025. Based on Land Registry sales data and Rightmove rental listings. Free — no email required.",
  keywords: "best buy to let postcodes UK 2025, highest rental yield UK, buy to let investment locations, best postcodes for property investment",
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/resources/top-20-btl-postcodes" },
  openGraph: {
    title: "Top 20 UK Buy-to-Let Postcodes 2025",
    description: "The 20 UK postcodes with the highest documented gross rental yields in 2025.",
    type: "article",
  },
};

const faqs = [
  { q: "How were these postcodes selected?", a: "We cross-referenced Land Registry sold prices (12-month average) against Rightmove and Zoopla rental asking prices for comparable properties, then computed gross yield per postcode. Only postcodes with 10+ sales and 20+ rental listings were included." },
  { q: "Are these yields gross or net?", a: "All yields shown are gross — before mortgage, management fees, maintenance, insurance, and voids. Net yield is typically 2–4% lower. Use our free calculators to model your specific deal." },
  { q: "Does a high yield mean a good investment?", a: "Not necessarily. High-yield postcodes often have higher void rates, more management-intensive properties, or price appreciation lagging other areas. Always model cash flow, stress test the mortgage, and visit the area before committing." },
  { q: "How often is this list updated?", a: "We update this guide every quarter. The data on this page reflects Q1 2025 figures." },
];

const POSTCODES = [
  { rank: 1,  postcode: "HU3",  city: "Hull",           yield: "9.8%", type: "Terraced",      avgPrice: "£78k",   avgRent: "£640/mo",  note: "Fruit Market regeneration zone" },
  { rank: 2,  postcode: "ST4",  city: "Stoke-on-Trent", yield: "9.4%", type: "Terraced",      avgPrice: "£88k",   avgRent: "£690/mo",  note: "bet365 campus catchment" },
  { rank: 3,  postcode: "NG7",  city: "Nottingham",     yield: "9.1%", type: "Terraced/flat",  avgPrice: "£125k",  avgRent: "£950/mo",  note: "Lenton/Radford student corridor" },
  { rank: 4,  postcode: "LS6",  city: "Leeds",          yield: "8.8%", type: "Terraced/flat",  avgPrice: "£145k",  avgRent: "£1,065/mo", note: "Headingley — dual-university demand" },
  { rank: 5,  postcode: "BD3",  city: "Bradford",       yield: "8.7%", type: "Terraced",      avgPrice: "£90k",   avgRent: "£650/mo",  note: "Channel 4 & City of Culture uplift" },
  { rank: 6,  postcode: "S1",   city: "Sheffield",      yield: "8.5%", type: "Flat/apartment", avgPrice: "£115k",  avgRent: "£815/mo",  note: "City centre — two universities" },
  { rank: 7,  postcode: "LE2",  city: "Leicester",      yield: "8.3%", type: "Terraced",      avgPrice: "£140k",  avgRent: "£970/mo",  note: "Highfields — large tenant pool" },
  { rank: 8,  postcode: "B18",  city: "Birmingham",     yield: "8.1%", type: "Terraced/HMO",  avgPrice: "£165k",  avgRent: "£1,110/mo", note: "Jewellery Quarter/Winson Green" },
  { rank: 9,  postcode: "L7",   city: "Liverpool",      yield: "8.0%", type: "Terraced/flat",  avgPrice: "£110k",  avgRent: "£735/mo",  note: "Edge Hill — two universities" },
  { rank: 10, postcode: "NE4",  city: "Newcastle",      yield: "7.9%", type: "Flat/terraced",  avgPrice: "£125k",  avgRent: "£825/mo",  note: "Arthur's Hill/Fenham" },
  { rank: 11, postcode: "CV1",  city: "Coventry",       yield: "7.7%", type: "Flat/apartment", avgPrice: "£140k",  avgRent: "£900/mo",  note: "City centre — Coventry University" },
  { rank: 12, postcode: "DE23", city: "Derby",          yield: "7.5%", type: "Terraced",      avgPrice: "£145k",  avgRent: "£910/mo",  note: "Normanton — Rolls-Royce corridor" },
  { rank: 13, postcode: "WV1",  city: "Wolverhampton",  yield: "7.4%", type: "Terraced",      avgPrice: "£130k",  avgRent: "£800/mo",  note: "City centre — i54 Business Park" },
  { rank: 14, postcode: "M14",  city: "Manchester",     yield: "7.2%", type: "Terraced/flat",  avgPrice: "£195k",  avgRent: "£1,170/mo", note: "Fallowfield — student hotspot" },
  { rank: 15, postcode: "NG1",  city: "Nottingham",     yield: "7.1%", type: "Apartment",     avgPrice: "£160k",  avgRent: "£950/mo",  note: "City centre — professional lets" },
  { rank: 16, postcode: "L15",  city: "Liverpool",      yield: "7.0%", type: "Terraced",      avgPrice: "£145k",  avgRent: "£850/mo",  note: "Wavertree — stable family lets" },
  { rank: 17, postcode: "B11",  city: "Birmingham",     yield: "6.9%", type: "Terraced",      avgPrice: "£180k",  avgRent: "£1,035/mo", note: "Sparkhill — large HMO market" },
  { rank: 18, postcode: "LS28", city: "Leeds",          yield: "6.8%", type: "Terraced",      avgPrice: "£170k",  avgRent: "£965/mo",  note: "Pudsey — professional commuters" },
  { rank: 19, postcode: "S9",   city: "Sheffield",      yield: "6.7%", type: "Terraced",      avgPrice: "£155k",  avgRent: "£868/mo",  note: "Burngreave — value entry point" },
  { rank: 20, postcode: "PO1",  city: "Portsmouth",     yield: "6.6%", type: "Flat/terraced",  avgPrice: "£165k",  avgRent: "£910/mo",  note: "City centre — Royal Navy demand" },
];

const yieldColor = (y: string) => {
  const n = parseFloat(y);
  if (n >= 8.5) return { color: "#166534", bg: "#dcfce7" };
  if (n >= 7.5) return { color: "#14532d", bg: "#f0fdf4" };
  if (n >= 6.5) return { color: "#713f12", bg: "#fef9c3" };
  return { color: "#854d0e", bg: "#fef3c7" };
};

export default function Top20BTLPostcodesPage() {
  return (
    <>
      <FAQSchema faqs={faqs} />

      {/* Hero */}
      <section className="gradient-navy py-16 md:py-24">
        <div className="container-max px-4 max-w-4xl">
          <Breadcrumbs
            items={[
              { label: "Resources", href: "/resources" },
              { label: "Top 20 BTL Postcodes" },
            ]}
          />
          <p className="text-xs font-semibold text-gold-400 uppercase tracking-widest mb-3 mt-6">Free data guide · Q1 2025</p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4" style={{ fontFamily: "var(--font-family-heading)" }}>
            Top 20 UK buy-to-let postcodes by rental yield
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mb-8">
            Ranked by gross yield using Land Registry sales data and live rental listings. All 20 postcodes, no email required — the full data is on this page.
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="text-xs font-semibold text-gold-400 bg-gold-400/10 px-3 py-1.5 rounded-full border border-gold-400/20">Q1 2025 data</span>
            <span className="text-xs font-semibold text-white/60 bg-white/10 px-3 py-1.5 rounded-full border border-white/20">Land Registry + Rightmove</span>
            <span className="text-xs font-semibold text-white/60 bg-white/10 px-3 py-1.5 rounded-full border border-white/20">Gross yield, not net</span>
          </div>
        </div>
      </section>

      {/* Email CTA */}
      <section className="bg-gold-50 border-b border-gold-200 py-8">
        <div className="container-max px-4 max-w-2xl">
          <PostcodeEmailCapture />
        </div>
      </section>

      {/* Table */}
      <section className="bg-white section-padding">
        <div className="container-max px-4">
          <div className="mb-8">
            <h2 className="text-2xl font-extrabold text-navy-800 mb-2" style={{ fontFamily: "var(--font-family-heading)" }}>
              The full ranked list
            </h2>
            <p className="text-navy-500 text-sm">
              Sorted by gross yield. Click any row to read the full area guide. Yields are gross and based on Q1 2025 averages.
            </p>
          </div>

          {/* Desktop table */}
          <div className="overflow-x-auto rounded-2xl border border-navy-100 hidden md:block">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "#0f1b36" }}>
                  {["#", "Postcode", "City", "Gross Yield", "Avg Price", "Avg Rent", "Property Type", "Key Driver"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-white/70 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {POSTCODES.map((p, i) => {
                  const { color, bg } = yieldColor(p.yield);
                  return (
                    <tr key={p.postcode} className={i % 2 === 0 ? "bg-white" : "bg-navy-50"}>
                      <td className="px-4 py-3 text-navy-400 font-mono text-xs">{p.rank}</td>
                      <td className="px-4 py-3 font-bold text-navy-800 font-mono">{p.postcode}</td>
                      <td className="px-4 py-3">
                        <Link href={`/areas/${p.city.toLowerCase().replace(/ /g, "-")}`} className="text-navy-700 hover:text-gold-600 font-semibold transition-colors">
                          {p.city}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-bold px-2 py-0.5 rounded-full text-xs" style={{ color, background: bg }}>
                          {p.yield}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-navy-600 font-semibold tabular-nums">{p.avgPrice}</td>
                      <td className="px-4 py-3 text-navy-600 tabular-nums">{p.avgRent}</td>
                      <td className="px-4 py-3 text-navy-500 text-xs">{p.type}</td>
                      <td className="px-4 py-3 text-navy-500 text-xs">{p.note}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {POSTCODES.map(p => {
              const { color, bg } = yieldColor(p.yield);
              return (
                <div key={p.postcode} className="bg-white rounded-2xl border border-navy-100 p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="font-bold text-navy-800 font-mono text-lg">{p.postcode}</span>
                      <span className="text-navy-400 text-sm ml-2">#{p.rank}</span>
                    </div>
                    <span className="font-bold px-2 py-0.5 rounded-full text-sm" style={{ color, background: bg }}>
                      {p.yield}
                    </span>
                  </div>
                  <Link href={`/areas/${p.city.toLowerCase().replace(/ /g, "-")}`} className="text-sm font-semibold text-gold-600 hover:text-gold-700">
                    {p.city} area guide →
                  </Link>
                  <div className="flex gap-4 mt-2 text-xs text-navy-500">
                    <span>Avg price: <strong className="text-navy-700">{p.avgPrice}</strong></span>
                    <span>Rent: <strong className="text-navy-700">{p.avgRent}</strong></span>
                  </div>
                  <p className="text-xs text-navy-400 mt-1">{p.note}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* What to do next */}
      <section className="bg-navy-50 section-padding border-t border-navy-100">
        <div className="container-max px-4 max-w-3xl">
          <h2 className="text-2xl font-extrabold text-navy-800 mb-6" style={{ fontFamily: "var(--font-family-heading)" }}>
            Found a postcode you like? Here&apos;s what to do next
          </h2>
          <div className="space-y-4">
            {[
              {
                step: "1",
                title: "Run the deal numbers",
                desc: "Paste the asking price and rental estimate into our Deal Analyser. It calculates gross yield, net yield, cash flow, cash-on-cash return, and gives an AI buy/pass verdict.",
                href: "/calculators/deal-analyser",
                cta: "Open Deal Analyser →",
              },
              {
                step: "2",
                title: "Check the rental yield",
                desc: "Quick single-metric check. Enter property price and monthly rent — gross and net yield calculated in under 30 seconds.",
                href: "/calculators/rental-yield",
                cta: "Yield Calculator →",
              },
              {
                step: "3",
                title: "Calculate stamp duty",
                desc: "Buy-to-let buyers pay a 5% surcharge on top of standard SDLT rates. Check your exact tax bill before you offer.",
                href: "/calculators/stamp-duty",
                cta: "Stamp Duty Calculator →",
              },
              {
                step: "4",
                title: "Stress test the mortgage",
                desc: "Lenders apply an ICR test — typically rent must cover 125–145% of the mortgage at a stressed rate of 5.5–6.5%. Run the test before speaking to a broker.",
                href: "/calculators/btl-mortgage",
                cta: "Stress Test Calculator →",
              },
            ].map(s => (
              <div key={s.step} className="bg-white rounded-2xl border border-navy-100 p-5 flex gap-4">
                <div className="shrink-0">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold text-white" style={{ background: "#0f1b36" }}>
                    {s.step}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-navy-800 mb-1">{s.title}</h3>
                  <p className="text-sm text-navy-500 mb-2">{s.desc}</p>
                  <Link href={s.href} className="text-sm font-semibold text-gold-600 hover:text-gold-700 transition-colors">
                    {s.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-white section-padding border-t border-navy-100">
        <div className="container-max px-4 max-w-2xl">
          <h2 className="text-2xl font-extrabold text-navy-800 mb-6" style={{ fontFamily: "var(--font-family-heading)" }}>
            Common questions
          </h2>
          <div className="space-y-4">
            {faqs.map(faq => (
              <div key={faq.q} className="border-b border-navy-100 pb-4">
                <p className="font-semibold text-navy-800 mb-1">{faq.q}</p>
                <p className="text-sm text-navy-500 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GR CTA */}
      <section className="gradient-navy section-padding">
        <div className="container-max px-4 max-w-2xl text-center">
          <p className="text-xs font-semibold text-gold-400 uppercase tracking-widest mb-3">Midlands landlords</p>
          <h2 className="text-2xl font-extrabold text-white mb-3" style={{ fontFamily: "var(--font-family-heading)" }}>
            Already own a Midlands property?
          </h2>
          <p className="text-white/70 mb-6">
            Skip the void risk. We&apos;ll lease it from you and pay a fixed monthly rent for 3–5 years — whether it&apos;s occupied or not.
          </p>
          <Link href="/guaranteed-rent" className="btn-gold">
            Get a Free Rent Estimate →
          </Link>
        </div>
      </section>

      <div className="container-max px-4 py-6">
        <Disclaimer type="financial" />
      </div>
    </>
  );
}
