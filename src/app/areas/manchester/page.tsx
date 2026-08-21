import Link from "next/link";
import type { Metadata } from "next";
import { Disclaimer } from "@/components/legal/Disclaimer";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { AreaSoldPricesWidget } from "@/components/ui/AreaSoldPricesWidget";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { DataProvenance } from "@/components/ui/DataProvenance";

export const metadata: Metadata = {
  title: "Manchester Buy-to-Let Investment Guide | PropertyVault UK",
  description: "Complete Manchester property investment guide. Best areas for buy-to-let, average rental yields, house prices, regeneration zones, and free tools for investors.",
  keywords: "property investment Manchester, buy to let Manchester, rental yield Manchester, Manchester property prices, best areas to invest Manchester",
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/areas/manchester/" },
  openGraph: {
    title: "Manchester Buy-to-Let Investment Guide | PropertyVault UK",
    description: "Complete Manchester property investment guide. Best areas for buy-to-let, average rental yields, house prices, regeneration zones, and free tools for investors.",
    type: "article",
    url: "https://www.propertyvaultuk.co.uk/areas/manchester/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "Manchester Property Investment Guide" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Manchester Buy-to-Let Investment Guide | PropertyVault UK",
    description: "Complete Manchester property investment guide. Best areas for buy-to-let, average rental yields, house prices, regeneration zones, and free tools for investors.",
  },
};

const cityFaqs = [
  { q: "Is Manchester a good place to invest in property?", a: "Manchester is one of the UK's top two property investment cities. It combines strong yields (5-7%), sustained capital growth, over 100,000 students, a diverse economy, and the largest regeneration pipeline outside London. Demand consistently outstrips supply across all tenant types." },
  { q: "What is the average rental yield in Manchester?", a: "Gross rental yields in Manchester typically range from 5-7%. Student areas like Fallowfield can achieve 7-9% for HMOs, while regeneration zones like Salford and Moss Side offer 6-8%. Premium areas like Didsbury and Chorlton yield 4-5% but offer stronger capital appreciation." },
  { q: "What are the best areas in Manchester for buy-to-let?", a: "For yield: Fallowfield (student HMOs), Moss Side, Longsight. For capital growth: Ancoats, Chorlton, Didsbury. For regeneration: Salford Quays, Salford city centre. For professionals: Ancoats, Salford Quays, city centre apartments." },
  { q: "What is the average house price in Manchester?", a: "The average house price in Manchester city is approximately £250,000. Entry-level investment properties in areas like Moss Side or Longsight start from £160,000-£180,000, while Didsbury and Chorlton properties typically begin at £300,000+. Ancoats new-build apartments range from £250,000-£400,000." },
  { q: "What is the rental demand like in Manchester?", a: "Rental demand in Manchester is exceptionally strong and chronic undersupply is a structural feature of the market. Population growth, high graduate retention rates, a large student population, and a buoyant employment market all sustain demand well above new supply. Void periods in central and inner Manchester are typically very short." },
];

const areas = [
  { name: "Salford Quays", postcode: "M50", yield: "5-7%", avgPrice: "£200,000-£320,000", profile: "BBC, ITV, MediaCityUK. Tech and media professional tenants. Strong demand for modern apartments. Capital growth and yield combined.", type: "Balanced" },
  { name: "Ancoats", postcode: "M4", yield: "5-6%", avgPrice: "£250,000-£380,000", profile: "Regenerated former industrial district. Manchester's trendiest neighbourhood. Young professional tenants. Strong capital growth and low void rates.", type: "Capital Growth" },
  { name: "Fallowfield", postcode: "M14", yield: "7-9%", avgPrice: "£180,000-£260,000", profile: "Major student area adjacent to UoM campus. Excellent for HMOs. Some of Manchester's highest gross yields. Consistent year-round occupancy.", type: "Student/HMO" },
  { name: "Moss Side", postcode: "M14/M16", yield: "6-8%", avgPrice: "£160,000-£220,000", profile: "Affordable, gentrifying inner suburb near Manchester City's Etihad Campus. Strong rental demand. Good BRRR opportunity in Victorian terraces.", type: "High Yield" },
  { name: "Longsight", postcode: "M12/M13", yield: "6-8%", avgPrice: "£160,000-£210,000", profile: "Affordable inner suburb with easy city centre access. Diverse community and strong rental demand. Good entry point for budget-conscious investors.", type: "High Yield" },
  { name: "Salford", postcode: "M6/M7", yield: "5-7%", avgPrice: "£170,000-£240,000", profile: "Significant regeneration underway. Close to MediaCityUK. Undervalued relative to Manchester proper with improving infrastructure and amenities.", type: "Growth" },
  { name: "Chorlton", postcode: "M21", yield: "4-5%", avgPrice: "£280,000-£380,000", profile: "Highly desirable suburb with independent shops, parks, and restaurants. Strong demand from families and professionals. Lower yield but strong capital growth.", type: "Capital Growth" },
  { name: "Didsbury", postcode: "M20", yield: "4-5%", avgPrice: "£300,000-£450,000", profile: "Manchester's most prestigious suburb. Victorian and Edwardian properties. Premium rents, professional tenants, long tenancies, and strong capital growth.", type: "Capital Growth" },
];

export default function ManchesterPage() {
  return (
    <>
      <section className="bg-white py-16 md:py-24">
        <div className="container-max px-4">
          <Breadcrumbs items={[{ label: "Areas", href: "/areas" }, { label: "Manchester" }]} />
          <div className="max-w-3xl">
            <Link href="/areas" className="text-sm font-semibold text-navy-400 hover:text-navy-600 mb-3 inline-block">← All areas</Link>
            <p className="text-xs font-semibold text-navy-400 uppercase tracking-widest mb-2">Greater Manchester</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-navy-800 mb-4" style={{ fontFamily: "var(--font-family-heading)" }}>Property investing in Manchester</h1>
            <p className="text-navy-500 text-lg">Manchester is the UK&apos;s most dynamic city outside London and one of the world&apos;s great property investment markets. With 100,000+ students, the Northern Powerhouse agenda, MediaCityUK at Salford Quays, and billions in ongoing development, Greater Manchester offers a rare combination of yield, capital growth, and liquidity.</p>
          </div>
        </div>
      </section>

      <div className="border-t border-navy-100" />

      {/* Key Stats */}
      <section className="bg-navy-50 py-10">
        <div className="container-max px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { n: "£250k", l: "Average house price" },
              { n: "5-7%", l: "Typical gross yield" },
              { n: "590,000", l: "Population" },
              { n: "3", l: "Universities" },
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

      {/* Why Manchester */}
      <section className="bg-white section-padding">
        <div className="container-max px-4 max-w-3xl">
          <h2 className="text-2xl font-extrabold text-navy-800 mb-6" style={{ fontFamily: "var(--font-family-heading)" }}>Why invest in Manchester?</h2>
          <div className="space-y-4 text-navy-600 leading-relaxed">
            <p><strong>Regeneration:</strong> Manchester has attracted more private investment than any UK city outside London over the past decade. MediaCityUK in Salford (home to BBC, ITV, Dock10 studios) has transformed Salford Quays into a creative and technology hub. NOMA (north of the city centre) is a 20-acre mixed-use development. The ID Manchester campus on the former ICI site will create 10,000 jobs in life sciences and technology.</p>
            <p><strong>Employment:</strong> Manchester has a diverse, resilient economy spanning financial services (KPMG, PwC, HSBC, Lloyds), technology (Auto Trader, Booking.com, N Brown), media (BBC, ITV, Channel 4), and logistics (Amazon, DHL). It has the highest rate of graduate retention of any UK city outside London.</p>
            <p><strong>Universities:</strong> The University of Manchester (Russell Group, ranked top 30 globally), Manchester Metropolitan University, and the University of Salford together enrol over 100,000 students. This sustains massive demand for both student HMOs and post-graduate professional rentals across Fallowfield, Hulme, Salford, and the city centre.</p>
            <p><strong>Transport:</strong> Piccadilly station offers regular direct services to London Euston in just over 2 hours. Manchester Airport (the UK&apos;s third busiest) connects to hundreds of destinations. Metrolink tram network covers Greater Manchester with ongoing expansion to new neighbourhoods.</p>
            <p><strong>Affordability:</strong> While Manchester prices have risen substantially, average prices of around £250,000 remain well below London and the South East, with significantly higher yields. Affordable investment stock can still be found from £160,000-£200,000 in areas like Moss Side and Longsight.</p>
          </div>
        </div>
      </section>

      {/* Area Breakdown */}
      <section className="bg-navy-50 section-padding">
        <div className="container-max px-4">
          <h2 className="text-2xl font-extrabold text-navy-800 mb-2 text-center" style={{ fontFamily: "var(--font-family-heading)" }}>Manchester area guide</h2>
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
            <h2 className="text-2xl font-extrabold text-white mb-3" style={{ fontFamily: "var(--font-family-heading)" }}>Analyse any Manchester deal for free</h2>
            <p className="text-white/60 text-sm mb-6">Run the numbers on rental yield, BRRR deals, HMO returns, stamp duty and more — all free, no sign-up required.</p>
            <Link href="/calculators" className="btn-gold">Browse all 23 calculators</Link>
          </div>
        </div>
      </section>

      {/* Useful Tools */}
      <section className="bg-navy-50 section-padding">
        <div className="container-max px-4 max-w-3xl">
          <h2 className="text-xl font-bold text-navy-800 mb-6 text-center">Analyse Manchester deals</h2>
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
            <h2 className="text-2xl font-extrabold text-navy-900 mb-2">Look Up Sold Prices & Crime</h2>
            <p className="text-navy-500 text-sm">Enter any Manchester postcode to see recent sold prices from the Land Registry and local crime data.</p>
          </div>
          <AreaSoldPricesWidget defaultPostcode="M4 1AS" />
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-white section-padding">
        <div className="container-max max-w-3xl px-4">
          <FAQSchema faqs={cityFaqs} />
          <DataProvenance area="Manchester" />
          <Disclaimer type="financial" />
        </div>
      </section>
    </>
  );
}

