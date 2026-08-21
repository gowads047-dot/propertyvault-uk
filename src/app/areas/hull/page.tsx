import Link from "next/link";
import type { Metadata } from "next";
import { Disclaimer } from "@/components/legal/Disclaimer";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { AreaSoldPricesWidget } from "@/components/ui/AreaSoldPricesWidget";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { DataProvenance } from "@/components/ui/DataProvenance";

export const metadata: Metadata = {
  title: "Hull Buy-to-Let Investment Guide | PropertyVault UK",
  description: "Complete Hull property investment guide. Best areas for buy-to-let, average rental yields, house prices, regeneration zones, and free tools for investors.",
  keywords: "property investment Hull, buy to let Hull, rental yield Hull, Hull property prices, best areas to invest Hull",
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/areas/hull/" },
  openGraph: {
    title: "Hull Buy-to-Let Investment Guide | PropertyVault UK",
    description: "Complete Hull property investment guide. Best areas for buy-to-let, average rental yields, house prices, regeneration zones, and free tools for investors.",
    type: "article",
    url: "https://www.propertyvaultuk.co.uk/areas/hull/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "Hull Property Investment Guide" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hull Buy-to-Let Investment Guide | PropertyVault UK",
    description: "Complete Hull property investment guide. Best areas for buy-to-let, average rental yields, house prices, regeneration zones, and free tools for investors.",
  },
};

const cityFaqs = [
  { q: "Is Hull a good place to invest in property?", a: "Hull consistently offers some of England's highest rental yields (7-9%) with entry prices starting below £100,000. The combination of Siemens/offshore wind employment, Reckitt HQ, the Fruit Market regeneration, City of Culture 2017 legacy, and low entry prices makes it one of the UK's best cash-flow investment cities." },
  { q: "What is the average rental yield in Hull?", a: "Gross rental yields in Hull typically range from 7-9%, with affordable areas like Bransholme and Orchard Park achieving yields above 9% in some cases. Popular areas like Newland Avenue and Princes Avenue achieve 7-8%. The Avenues offer 6-7% with stronger capital growth." },
  { q: "What are the best areas in Hull for buy-to-let?", a: "For maximum yield: Bransholme, Orchard Park, Spring Bank. For yield and amenity: Newland Avenue, Princes Avenue, Beverley Road. For capital growth: The Avenues, Fruit Market. For regeneration upside: Fruit Market, Hull Waterfront area." },
  { q: "What is the average house price in Hull?", a: "The average house price in Hull is approximately £155,000. Bransholme and Orchard Park offer properties from under £100,000 — some of England's lowest prices in any urban area. The Avenues command £170,000-£250,000. Newland Avenue and Beverley Road range from £120,000-£175,000." },
  { q: "What is the offshore wind connection to Hull property?", a: "Hull is the service and manufacturing hub for the Hornsea offshore wind farms — Hornsea One and Two are the world's largest offshore wind installations. Siemens Gamesa manufactures turbine blades at its Alexandra Dock facility. This offshore wind industry employs thousands of engineers and technicians, many of whom rent in Hull, providing a highly stable, well-paid professional tenant market." },
];

const areas = [
  { name: "Newland Avenue", postcode: "HU5", yield: "7-9%", avgPrice: "£120,000-£175,000", profile: "Bohemian strip with independent shops and cafes. Students and young professionals. Near university. Some of Hull's most characterful areas.", type: "Balanced" },
  { name: "Princes Avenue", postcode: "HU5", yield: "7-8%", avgPrice: "£130,000-£180,000", profile: "Tree-lined Victorian avenue. Popular young professional area. Independent bars and restaurants. Growing demand and improving values.", type: "Balanced" },
  { name: "The Avenues", postcode: "HU5", yield: "6-7%", avgPrice: "£170,000-£250,000", profile: "Hull's most desirable area. Beautiful Victorian tree-lined avenues. Conservation area. Professional tenants, long tenancies. Strong capital growth.", type: "Capital Growth" },
  { name: "Spring Bank", postcode: "HU3/HU5", yield: "7-9%", avgPrice: "£110,000-£165,000", profile: "Diverse central Hull. Affordable. Strong rental demand. Mix of professional and working tenants. Good access to city centre and university.", type: "High Yield" },
  { name: "Beverley Road", postcode: "HU5/HU6", yield: "7-8%", avgPrice: "£120,000-£175,000", profile: "North Hull corridor. Near university. Mix of student, professional, and family tenants. Affordable terraced housing. Consistent demand.", type: "High Yield" },
  { name: "Fruit Market", postcode: "HU1", yield: "5-7%", avgPrice: "£150,000-£260,000", profile: "Award-winning regeneration district. Creative hub, restaurants, independent businesses. Growing demand. Capital growth story with improving values.", type: "Growth" },
  { name: "Orchard Park", postcode: "HU6", yield: "7-9%", avgPrice: "£95,000-£145,000", profile: "North Hull. Very affordable. High yields from low entry prices. Working community rental market. Consistent demand from local employers.", type: "High Yield" },
  { name: "Bransholme", postcode: "HU7", yield: "7-9%", avgPrice: "£90,000-£135,000", profile: "East Hull. Among England's most affordable postcodes. Very high yield potential. Requires active management. Maximum cash flow for budget investors.", type: "High Yield" },
];

export default function HullPage() {
  return (
    <>
      <section className="bg-white py-16 md:py-24">
        <div className="container-max px-4">
          <Breadcrumbs items={[{ label: "Areas", href: "/areas" }, { label: "Hull" }]} />
          <div className="max-w-3xl">
            <Link href="/areas" className="text-sm font-semibold text-navy-400 hover:text-navy-600 mb-3 inline-block">← All areas</Link>
            <p className="text-xs font-semibold text-navy-400 uppercase tracking-widest mb-2">East Yorkshire</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-navy-800 mb-4" style={{ fontFamily: "var(--font-family-heading)" }}>Property investing in Hull</h1>
            <p className="text-navy-500 text-lg">Kingston upon Hull offers some of the highest rental yields in England — consistently 7-9% and above — combined with entry prices from as low as £90,000. Named UK City of Culture 2017 and at the heart of the UK&apos;s offshore wind energy revolution, Hull&apos;s investment story is one of the most compelling value propositions in the UK property market.</p>
          </div>
        </div>
      </section>

      <div className="border-t border-navy-100" />

      {/* Key Stats */}
      <section className="bg-navy-50 py-10">
        <div className="container-max px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { n: "£155k", l: "Average house price" },
              { n: "7-9%", l: "Typical gross yield" },
              { n: "260,000", l: "Population" },
              { n: "1", l: "University" },
            ].map((s) => (
              <div key={s.l}>
                <p className="text-2xl font-extrabold text-navy-800">{s.n}</p>
                <p className="text-xs text-navy-400 mt-1">{s.l}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-navy-400 text-center mt-4">Figures are approximate and for illustrative purposes. Always verify with current market data.</p>
        </div>
      </section>

      {/* Why Hull */}
      <section className="bg-white section-padding">
        <div className="container-max px-4 max-w-3xl">
          <h2 className="text-2xl font-extrabold text-navy-800 mb-6" style={{ fontFamily: "var(--font-family-heading)" }}>Why invest in Hull?</h2>
          <div className="space-y-4 text-navy-600 leading-relaxed">
            <p><strong>Regeneration:</strong> The Fruit Market district is one of the UK&apos;s most acclaimed urban regeneration successes — a former wholesale market transformed into a vibrant creative, residential, and food destination that has attracted national press coverage and become a destination in its own right. The Hull Waterfront development continues to transform the riverfront. The Green Port Hull initiative is positioning the city as Europe&apos;s leading renewable energy hub.</p>
            <p><strong>Employment:</strong> Major employers include Siemens Gamesa (wind turbine blade manufacturing, largest in UK), Reckitt (global consumer health and hygiene company, HQ in Hull), GlaxoSmithKline (large pharmaceutical manufacturing site), KCOM (regional telecoms), and an NHS Hull employing thousands. The offshore wind sector (Hornsea One and Two, the world&apos;s largest offshore wind farms, are serviced from Hull) is driving long-term employment growth.</p>
            <p><strong>Universities:</strong> The University of Hull with approximately 17,000 students creates consistent rental demand in areas like Newland Avenue, Princes Avenue, and Beverley Road. The medical school in partnership with the University of York brings additional professional students.</p>
            <p><strong>Transport:</strong> Hull Paragon Interchange has direct trains to London King&apos;s Cross in under 2 hours 30 minutes and to Leeds in 1 hour. The A63/M62 motorway connects Hull to the national network. The Humber Bridge provides the only fixed link to Lincolnshire.</p>
            <p><strong>Affordability:</strong> Hull is one of the most affordable cities in England. Properties in areas like Orchard Park or Bransholme can be purchased from under £100,000, while higher-demand areas like the Avenues or Newland Avenue range from £150,000-£250,000. The combination of low entry prices and high yields makes Hull one of the strongest cash-on-cash return markets in the UK.</p>
          </div>
        </div>
      </section>

      {/* Area Breakdown */}
      <section className="bg-navy-50 section-padding">
        <div className="container-max px-4">
          <h2 className="text-2xl font-extrabold text-navy-800 mb-2 text-center" style={{ fontFamily: "var(--font-family-heading)" }}>Hull area guide</h2>
          <p className="text-navy-500 text-sm text-center mb-10">Key investment areas with typical yields and price ranges</p>

          <div className="grid md:grid-cols-2 gap-4">
            {areas.map((a) => (
              <div key={a.name} className="bg-white rounded-2xl border border-navy-100 p-6 card-hover">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-navy-800">{a.name}</h3>
                    <p className="text-xs text-navy-400">{a.postcode}</p>
                  </div>
                  <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${a.type === "High Yield" ? "bg-green-50 text-green-700" : a.type === "Capital Growth" ? "bg-blue-50 text-blue-700" : a.type === "Student/HMO" ? "bg-purple-50 text-purple-700" : a.type === "Growth" ? "bg-orange-50 text-orange-700" : "bg-navy-50 text-navy-600"}`}>{a.type}</span>
                </div>
                <div className="flex gap-4 text-sm mb-3">
                  <span className="text-navy-600"><strong className="text-navy-800">Yield:</strong> {a.yield}</span>
                  <span className="text-navy-600"><strong className="text-navy-800">Avg:</strong> {a.avgPrice}</span>
                </div>
                <p className="text-sm text-navy-500">{a.profile}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-navy-400 text-center mt-6">Yields and prices are approximate and based on typical market conditions. Always conduct your own research and due diligence.</p>
        </div>
      </section>

      {/* Tools CTA */}
      <section className="bg-white section-padding">
        <div className="container-max px-4 max-w-3xl">
          <div className="bg-navy-800 rounded-2xl p-8 md:p-10 text-center">
            <p className="text-xs font-semibold text-gold-400 uppercase tracking-widest mb-2">Free tools</p>
            <h2 className="text-2xl font-extrabold text-white mb-3" style={{ fontFamily: "var(--font-family-heading)" }}>Analyse any Hull deal for free</h2>
            <p className="text-white/60 text-sm mb-6">Run the numbers on rental yield, BRRR deals, HMO returns, stamp duty and more — all free, no sign-up required.</p>
            <Link href="/calculators" className="btn-gold">Browse all 23 calculators</Link>
          </div>
        </div>
      </section>

      {/* Useful Tools */}
      <section className="bg-navy-50 section-padding">
        <div className="container-max px-4 max-w-3xl">
          <h2 className="text-xl font-bold text-navy-800 mb-6 text-center">Analyse Hull deals</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            <Link href="/calculators/rental-yield" className="block bg-white rounded-2xl border border-navy-100 p-5 card-hover text-center">
              <p className="font-semibold text-navy-800 text-sm">Rental Yield</p>
              <p className="text-xs text-navy-400 mt-1">Calculate BTL yields</p>
            </Link>
            <Link href="/calculators/brrr" className="block bg-white rounded-2xl border border-navy-100 p-5 card-hover text-center">
              <p className="font-semibold text-navy-800 text-sm">BRRR Calculator</p>
              <p className="text-xs text-navy-400 mt-1">Model refurb deals</p>
            </Link>
            <Link href="/calculators/hmo-yield" className="block bg-white rounded-2xl border border-navy-100 p-5 card-hover text-center">
              <p className="font-semibold text-navy-800 text-sm">HMO Yield</p>
              <p className="text-xs text-navy-400 mt-1">Room-by-room analysis</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Sold Prices & Crime Widget */}
      <section className="section-padding bg-navy-50">
        <div className="container-max max-w-3xl px-4">
          <div className="text-center mb-8">
            <p className="text-gold-600 font-bold text-xs uppercase tracking-widest mb-2">Live data</p>
            <h2 className="text-2xl font-extrabold text-navy-900 mb-2">Look Up Sold Prices &amp; Crime</h2>
            <p className="text-navy-500 text-sm">Enter any Hull postcode to see recent sold prices from the Land Registry and local crime data.</p>
          </div>
          <AreaSoldPricesWidget defaultPostcode="HU1 1RL" />
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-white section-padding">
        <div className="container-max max-w-3xl px-4">
          <FAQSchema faqs={cityFaqs} />
          <DataProvenance area="Hull" />
          <Disclaimer type="financial" />
        </div>
      </section>
    </>
  );
}

