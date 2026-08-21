import Link from "next/link";
import type { Metadata } from "next";
import { Disclaimer } from "@/components/legal/Disclaimer";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { AreaSoldPricesWidget } from "@/components/ui/AreaSoldPricesWidget";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { DataProvenance } from "@/components/ui/DataProvenance";

export const metadata: Metadata = {
  title: "Liverpool Buy-to-Let Investment Guide | PropertyVault UK",
  description: "Complete Liverpool property investment guide. Best areas for buy-to-let, average rental yields, house prices, regeneration zones, and free tools for investors.",
  keywords: "property investment Liverpool, buy to let Liverpool, rental yield Liverpool, Liverpool property prices, best areas to invest Liverpool",
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/areas/liverpool/" },
  openGraph: {
    title: "Liverpool Buy-to-Let Investment Guide | PropertyVault UK",
    description: "Complete Liverpool property investment guide. Best areas for buy-to-let, average rental yields, house prices, regeneration zones, and free tools for investors.",
    type: "article",
    url: "https://www.propertyvaultuk.co.uk/areas/liverpool/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "Liverpool Property Investment Guide" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Liverpool Buy-to-Let Investment Guide | PropertyVault UK",
    description: "Complete Liverpool property investment guide. Best areas for buy-to-let, average rental yields, house prices, regeneration zones, and free tools for investors.",
  },
};

const cityFaqs = [
  { q: "Is Liverpool a good place to invest in property?", a: "Liverpool consistently ranks among the highest-yielding major UK cities. The £5.5bn Liverpool Waters project, Knowledge Quarter biotech expansion, large student population (60,000+), and house prices from £100,000 make it one of the most attractive cash-flow markets in the UK." },
  { q: "What is the average rental yield in Liverpool?", a: "Gross rental yields in Liverpool range from 6-8% on average, with some areas achieving 7-9%. Toxteth, Kensington, and Anfield offer the highest yields (7-9%) due to very low purchase prices. Premium areas like Aigburth and Sefton Park offer 5-6% with better capital growth." },
  { q: "What are the best areas in Liverpool for buy-to-let?", a: "For yield: Toxteth, Kensington, Anfield, Bootle. For students: Kensington, Wavertree. For growth: Baltic Triangle, Toxteth. For professionals and capital growth: Sefton Park, Aigburth." },
  { q: "What is the average house price in Liverpool?", a: "The average house price in Liverpool is approximately £185,000. Investment properties in Anfield or Bootle start from around £100,000-£130,000, making them some of the most affordable in any major UK city. Sefton Park and Aigburth properties typically start from £200,000+." },
  { q: "What is Liverpool Waters?", a: "Liverpool Waters is a landmark £5.5bn regeneration project transforming 60 hectares of historic waterfront dockland north of the city centre into a new residential, commercial, and cultural district. It is one of Europe's largest regeneration schemes and is expected to significantly transform property values in north Liverpool over the coming decades." },
];

const areas = [
  { name: "Toxteth", postcode: "L8", yield: "7-9%", avgPrice: "£120,000-£180,000", profile: "Close to city centre, Knowledge Quarter, and universities. Affordable Victorian terraces. Strong rental demand, gentrifying rapidly. Excellent BRRR opportunity.", type: "High Yield" },
  { name: "Kensington", postcode: "L7", yield: "7-9%", avgPrice: "£110,000-£170,000", profile: "Adjacent to Knowledge Quarter. Very affordable. High yield potential. Strong student and young professional rental demand near two universities.", type: "High Yield" },
  { name: "Wavertree", postcode: "L15", yield: "6-7%", avgPrice: "£150,000-£210,000", profile: "Near UoL campus. Popular with students and young professionals. Good Victorian housing stock. Established lettings market with consistent demand.", type: "Balanced" },
  { name: "Anfield", postcode: "L4", yield: "7-9%", avgPrice: "£100,000-£160,000", profile: "Very affordable north Liverpool. High yields. Mix of rental demand from workers and local community. Very low entry price for cash flow investors.", type: "High Yield" },
  { name: "Bootle", postcode: "L20", yield: "7-8%", avgPrice: "£110,000-£160,000", profile: "North Merseyside with Merseyrail access. Very affordable terraced housing. High yields and low entry cost. Strong working community tenant base.", type: "High Yield" },
  { name: "Sefton Park", postcode: "L17", yield: "5-6%", avgPrice: "£220,000-£300,000", profile: "Premium south Liverpool near beautiful Sefton Park. Victorian terraces, strong professional tenants, longer tenancies and reliable income.", type: "Balanced" },
  { name: "Aigburth", postcode: "L17/L19", yield: "5-6%", avgPrice: "£200,000-£280,000", profile: "Desirable south Liverpool suburb. Strong family and professional rental demand. Good schools, Mersey access. Reliable long-term investment.", type: "Capital Growth" },
  { name: "Baltic Triangle", postcode: "L1", yield: "5-7%", avgPrice: "£200,000-£320,000", profile: "Liverpool's creative and digital quarter. Strong young professional demand. New apartments and conversions. Growth area adjacent to Liverpool Waters.", type: "Growth" },
];

export default function LiverpoolPage() {
  return (
    <>
      <section className="bg-white py-16 md:py-24">
        <div className="container-max px-4">
          <Breadcrumbs items={[{ label: "Areas", href: "/areas" }, { label: "Liverpool" }]} />
          <div className="max-w-3xl">
            <Link href="/areas" className="text-sm font-semibold text-navy-400 hover:text-navy-600 mb-3 inline-block">← All areas</Link>
            <p className="text-xs font-semibold text-navy-400 uppercase tracking-widest mb-2">Merseyside</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-navy-800 mb-4" style={{ fontFamily: "var(--font-family-heading)" }}>Property investing in Liverpool</h1>
            <p className="text-navy-500 text-lg">Liverpool is one of the UK&apos;s most exciting regeneration stories and consistently ranks among the highest-yielding major cities for buy-to-let investors. With the £5.5bn Liverpool Waters development transforming the iconic waterfront, a large student population, and house prices among the lowest of any major UK city, it offers outstanding income potential.</p>
          </div>
        </div>
      </section>

      <div className="border-t border-navy-100" />

      {/* Key Stats */}
      <section className="bg-navy-50 py-10">
        <div className="container-max px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { n: "£185k", l: "Average house price" },
              { n: "6-8%", l: "Typical gross yield" },
              { n: "500,000", l: "Population" },
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

      {/* Why Liverpool */}
      <section className="bg-white section-padding">
        <div className="container-max px-4 max-w-3xl">
          <h2 className="text-2xl font-extrabold text-navy-800 mb-6" style={{ fontFamily: "var(--font-family-heading)" }}>Why invest in Liverpool?</h2>
          <div className="space-y-4 text-navy-600 leading-relaxed">
            <p><strong>Regeneration:</strong> Liverpool Waters is one of Europe&apos;s largest regeneration projects — a £5.5bn scheme transforming 60 hectares of historic dockland into a new mixed-use waterfront district. The Baltic Triangle creative quarter has already attracted hundreds of independent businesses and digital companies. Paddington Village is creating a new biotech and innovation campus adjacent to the Knowledge Quarter.</p>
            <p><strong>Employment:</strong> Major employers include the NHS (Mersey Care, Royal Liverpool), Liverpool City Council, Jaguar Land Rover at Halewood, Amazon, Unilever, and a fast-growing life sciences and digital sector. The Knowledge Quarter anchors biotech, universities, and cultural institutions in a single district.</p>
            <p><strong>Universities:</strong> University of Liverpool (Russell Group), Liverpool John Moores University, and Liverpool Hope University together attract approximately 60,000 students. This sustains demand for HMOs in Toxteth, Wavertree, and Kensington — some of the most affordable investment postcodes in any UK university city.</p>
            <p><strong>Transport:</strong> Liverpool Lime Street has direct trains to London Euston in 2 hours. The Merseyrail network provides rapid connections across Merseyside. John Lennon Airport connects to European destinations. The Northern Powerhouse Rail project will further improve regional connectivity.</p>
            <p><strong>Affordability:</strong> Average house prices of around £185,000 make Liverpool one of the most affordable major UK cities. Investment properties near the Knowledge Quarter or in Toxteth can be purchased from £110,000-£160,000 — enabling genuinely high cash-on-cash returns.</p>
          </div>
        </div>
      </section>

      {/* Area Breakdown */}
      <section className="bg-navy-50 section-padding">
        <div className="container-max px-4">
          <h2 className="text-2xl font-extrabold text-navy-800 mb-2 text-center" style={{ fontFamily: "var(--font-family-heading)" }}>Liverpool area guide</h2>
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
            <h2 className="text-2xl font-extrabold text-white mb-3" style={{ fontFamily: "var(--font-family-heading)" }}>Analyse any Liverpool deal for free</h2>
            <p className="text-white/60 text-sm mb-6">Run the numbers on rental yield, BRRR deals, HMO returns, stamp duty and more — all free, no sign-up required.</p>
            <Link href="/calculators" className="btn-gold">Browse all 23 calculators</Link>
          </div>
        </div>
      </section>

      {/* Useful Tools */}
      <section className="bg-navy-50 section-padding">
        <div className="container-max px-4 max-w-3xl">
          <h2 className="text-xl font-bold text-navy-800 mb-6 text-center">Analyse Liverpool deals</h2>
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
            <p className="text-navy-500 text-sm">Enter any Liverpool postcode to see recent sold prices from the Land Registry and crime data from Merseyside Police.</p>
          </div>
          <AreaSoldPricesWidget defaultPostcode="L1 1JJ" />
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-white section-padding">
        <div className="container-max max-w-3xl px-4">
          <FAQSchema faqs={cityFaqs} />
          <DataProvenance area="Liverpool" />
          <Disclaimer type="financial" />
        </div>
      </section>
    </>
  );
}

