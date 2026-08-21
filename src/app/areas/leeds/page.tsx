import Link from "next/link";
import type { Metadata } from "next";
import { Disclaimer } from "@/components/legal/Disclaimer";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { AreaSoldPricesWidget } from "@/components/ui/AreaSoldPricesWidget";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { DataProvenance } from "@/components/ui/DataProvenance";

export const metadata: Metadata = {
  title: "Leeds Buy-to-Let Investment Guide | PropertyVault UK",
  description: "Complete Leeds property investment guide. Best areas for buy-to-let, average rental yields, house prices, regeneration zones, and free tools for investors.",
  keywords: "property investment Leeds, buy to let Leeds, rental yield Leeds, Leeds property prices, best areas to invest Leeds",
  openGraph: {
    title: "Leeds Buy-to-Let Investment Guide | PropertyVault UK",
    description: "Complete Leeds property investment guide. Best areas for buy-to-let, average rental yields, house prices, regeneration zones, and free tools for investors.",
    type: "article",
    url: "https://www.propertyvaultuk.co.uk/areas/leeds/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "Leeds Property Investment Guide" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Leeds Buy-to-Let Investment Guide | PropertyVault UK",
    description: "Complete Leeds property investment guide. Best areas for buy-to-let, average rental yields, house prices, regeneration zones, and free tools for investors.",
  },
};

const cityFaqs = [
  { q: "Is Leeds a good place to invest in property?", a: "Leeds is one of the UK's strongest investment markets. It has the largest financial centre outside London, 80,000 students, the UK's biggest development project (South Bank), and average prices well below the national average. Yields of 5-7% and strong capital growth make it a top-tier regional investment city." },
  { q: "What is the average rental yield in Leeds?", a: "Gross rental yields in Leeds typically range from 5-7%. Student HMOs in Headingley and Hyde Park achieve 7-9%. Affordable areas like Beeston, Armley, and Gipton offer 6-8%. Desirable suburbs like Chapel Allerton and Meanwood offer 5-6% with stronger capital growth." },
  { q: "What are the best areas in Leeds for buy-to-let?", a: "For student HMOs: Headingley and Hyde Park. For yield: Beeston, Armley, Gipton. For regeneration: Hunslet (South Bank). For professionals: Chapel Allerton, Meanwood. For capital growth: Chapel Allerton and the improving Hunslet/South Bank corridor." },
  { q: "What is the average house price in Leeds?", a: "The average house price in Leeds is approximately £235,000. Student HMO properties in Headingley start from around £200,000. Affordable terraced houses in Beeston or Armley can be found from £160,000. Premium areas like Chapel Allerton or Roundhay start from £280,000+." },
  { q: "What is the South Bank regeneration project in Leeds?", a: "The Leeds South Bank is the UK's largest city centre regeneration project outside London — a 136-hectare zone being transformed over two decades into a new mixed-use district with 8,000+ homes, major office space, and the new southern entrance to Leeds station. It is expected to significantly increase values in Hunslet and the surrounding areas." },
];

const areas = [
  { name: "Headingley", postcode: "LS6", yield: "7-9%", avgPrice: "£200,000-£280,000", profile: "Primary student area near University of Leeds. Excellent for HMOs. Consistent demand, low voids. Strong gross yields. Popular Otley Run pub trail area.", type: "Student/HMO" },
  { name: "Hyde Park", postcode: "LS6", yield: "7-9%", avgPrice: "£180,000-£250,000", profile: "Even closer to campus than Headingley. Higher density of student HMOs. Very affordable entry. High yields but requires active management.", type: "Student/HMO" },
  { name: "Chapel Allerton", postcode: "LS7", yield: "5-6%", avgPrice: "£230,000-£310,000", profile: "Vibrant north Leeds suburb. Independent shops and restaurants. Popular with young professionals. Growing demand and capital growth potential.", type: "Balanced" },
  { name: "Beeston", postcode: "LS11", yield: "6-8%", avgPrice: "£160,000-£210,000", profile: "Affordable south Leeds. Good transport connections. Improving area with regeneration nearby. Strong yields and value-add opportunity.", type: "High Yield" },
  { name: "Hunslet", postcode: "LS10", yield: "5-7%", avgPrice: "£170,000-£230,000", profile: "South Bank regeneration zone. Transforming rapidly. Entry prices still affordable with significant upside as South Bank development progresses.", type: "Growth" },
  { name: "Meanwood", postcode: "LS6/LS7", yield: "5-6%", avgPrice: "£220,000-£290,000", profile: "Popular north Leeds suburb between city centre and Headingley. Strong professional demand. Good schools and green space nearby.", type: "Balanced" },
  { name: "Armley", postcode: "LS12", yield: "6-7%", avgPrice: "£160,000-£210,000", profile: "Affordable west Leeds. Good bus connections to city centre. Mix of terraced housing. Yield-focused investment with steady tenant demand.", type: "High Yield" },
  { name: "Gipton", postcode: "LS8/LS9", yield: "6-8%", avgPrice: "£130,000-£180,000", profile: "Very affordable east Leeds. Highest yields in the city. Regeneration investment in local services. Good for cash-flow-focused investors.", type: "High Yield" },
];

export default function LeedsPage() {
  return (
    <>
      <section className="bg-white py-16 md:py-24">
        <div className="container-max px-4">
          <Breadcrumbs items={[{ label: "Areas", href: "/areas" }, { label: "Leeds" }]} />
          <div className="max-w-3xl">
            <Link href="/areas" className="text-sm font-semibold text-navy-400 hover:text-navy-600 mb-3 inline-block">← All areas</Link>
            <p className="text-xs font-semibold text-navy-400 uppercase tracking-widest mb-2">West Yorkshire</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-navy-800 mb-4" style={{ fontFamily: "var(--font-family-heading)" }}>Property investing in Leeds</h1>
            <p className="text-navy-500 text-lg">Leeds is one of the UK&apos;s fastest growing cities and the most important financial and commercial centre in the north outside Manchester. With 80,000 students, the UK&apos;s largest development project south of Watford (South Bank), and the highest rate of office take-up in any UK regional city, Leeds offers exceptional investment fundamentals.</p>
          </div>
        </div>
      </section>

      <div className="border-t border-navy-100" />

      {/* Key Stats */}
      <section className="bg-navy-50 py-10">
        <div className="container-max px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { n: "£235k", l: "Average house price" },
              { n: "5-7%", l: "Typical gross yield" },
              { n: "810,000", l: "Population" },
              { n: "2", l: "Universities" },
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

      {/* Why Leeds */}
      <section className="bg-white section-padding">
        <div className="container-max px-4 max-w-3xl">
          <h2 className="text-2xl font-extrabold text-navy-800 mb-6" style={{ fontFamily: "var(--font-family-heading)" }}>Why invest in Leeds?</h2>
          <div className="space-y-4 text-navy-600 leading-relaxed">
            <p><strong>Regeneration:</strong> The Leeds South Bank is the UK&apos;s largest city centre regeneration project outside London — 136 hectares being transformed over 20 years into a new mixed-use urban quarter with 8,000+ new homes, office space, and the new Leeds station southern entrance. Temple Quarter, directly adjacent, will create thousands of new jobs in creative, digital, and professional services.</p>
            <p><strong>Employment:</strong> Leeds has the UK&apos;s largest financial centre outside London, with major employers including HMRC (largest single office in the UK at Thorpe Park), First Direct, Asda (HQ), Jet2 (HQ), Sky, Marks &amp; Spencer Financial Services, and PricewaterhouseCoopers. The Leeds city region generates over £67bn GVA annually.</p>
            <p><strong>Universities:</strong> The University of Leeds (Russell Group) and Leeds Beckett University together enrol approximately 80,000 students. Student demand is concentrated in Headingley, Hyde Park, and Woodhouse, sustaining some of the highest HMO yields in Yorkshire.</p>
            <p><strong>Transport:</strong> Leeds is 2 hours 10 minutes from London King&apos;s Cross by direct train, and the HS2 proposals will significantly reduce journey times. The city is at the centre of the M1, M62, and A1(M) motorway network, giving strong road access across the north.</p>
            <p><strong>Affordability:</strong> Average prices of around £235,000 combined with strong rental growth make Leeds one of the best risk-adjusted investment markets in the UK. Student properties in Headingley can still be acquired from £180,000-£220,000.</p>
          </div>
        </div>
      </section>

      {/* Area Breakdown */}
      <section className="bg-navy-50 section-padding">
        <div className="container-max px-4">
          <h2 className="text-2xl font-extrabold text-navy-800 mb-2 text-center" style={{ fontFamily: "var(--font-family-heading)" }}>Leeds area guide</h2>
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
            <h2 className="text-2xl font-extrabold text-white mb-3" style={{ fontFamily: "var(--font-family-heading)" }}>Analyse any Leeds deal for free</h2>
            <p className="text-white/60 text-sm mb-6">Run the numbers on rental yield, BRRR deals, HMO returns, stamp duty and more — all free, no sign-up required.</p>
            <Link href="/calculators" className="btn-gold">Browse all 23 calculators</Link>
          </div>
        </div>
      </section>

      {/* Useful Tools */}
      <section className="bg-navy-50 section-padding">
        <div className="container-max px-4 max-w-3xl">
          <h2 className="text-xl font-bold text-navy-800 mb-6 text-center">Analyse Leeds deals</h2>
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
            <p className="text-navy-500 text-sm">Enter any Leeds postcode to see recent sold prices from the Land Registry and crime data from West Yorkshire Police.</p>
          </div>
          <AreaSoldPricesWidget defaultPostcode="LS1 3AB" />
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-white section-padding">
        <div className="container-max max-w-3xl px-4">
          <FAQSchema faqs={cityFaqs} />
          <DataProvenance area="Leeds" />
          <Disclaimer type="financial" />
        </div>
      </section>
    </>
  );
}

