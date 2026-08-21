import Link from "next/link";
import type { Metadata } from "next";
import { Disclaimer } from "@/components/legal/Disclaimer";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { AreaSoldPricesWidget } from "@/components/ui/AreaSoldPricesWidget";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { DataProvenance } from "@/components/ui/DataProvenance";

export const metadata: Metadata = {
  title: "Property Investing in Derby — Buy-to-Let, Yields & Area Guide | PropertyVault UK",
  description: "Complete Derby property investment guide. Best areas for buy-to-let, average rental yields, house prices, regeneration projects, and guaranteed rent options.",
  keywords: "property investment Derby, buy to let Derby, rental yield Derby, Derby property prices, best areas to invest Derby, guaranteed rent Derby",
  openGraph: {
    title: "Property Investing in Derby — Buy-to-Let, Yields & Area Guide | PropertyVault UK",
    description: "Complete Derby property investment guide. Best areas for buy-to-let, average rental yields, house prices, regeneration projects, and guaranteed rent options.",
    type: "article",
    url: "https://www.propertyvaultuk.co.uk/areas/derby/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "Derby Property Investment Guide" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Property Investing in Derby — Buy-to-Let, Yields & Area Guide | PropertyVault UK",
    description: "Complete Derby property investment guide. Best areas for buy-to-let, average rental yields, house prices, regeneration projects, and guaranteed rent options.",
  },
};

const derbyFaqs = [
  { q: "Is Derby a good place to invest in property?", a: "Derby offers excellent value for property investors. It has one of the lowest average house prices of any English city, strong employment from Rolls-Royce and Toyota, a growing university, and solid rental demand. Gross yields of 6-8% are common, with some areas achieving higher." },
  { q: "What is the average rental yield in Derby?", a: "Gross rental yields in Derby typically range from 5-8% depending on the area and property type. Areas like Normanton, Pear Tree, and Chaddesden tend to offer higher yields (6-8%), while premium areas like Darley Abbey and Littleover offer 4-5% with better capital growth." },
  { q: "What are the best areas in Derby for buy-to-let?", a: "For yield: Normanton, Pear Tree, Chaddesden, and Sinfin. For capital growth: Darley Abbey, Littleover, Allestree, and Mickleover. For balanced investment: Chellaston, Spondon, and Oakwood." },
  { q: "What is the average house price in Derby?", a: "The average house price in Derby is approximately £190,000-£210,000, making it one of the most affordable cities in England. Properties in Normanton or Pear Tree can be found from £90,000-£140,000, while Darley Abbey or Allestree properties typically start from £250,000+." },
  { q: "Can I get guaranteed rent in Derby?", a: "Yes. PropertyVault offers guaranteed rent for landlords across all Derby postcodes. We lease your property for 3-5 years and pay you every month regardless of occupancy. Contact us for a free valuation." },
];

const areas = [
  { name: "Normanton", postcode: "DE23", yield: "7-9%", avgPrice: "£90,000-£140,000", profile: "One of Derby's most affordable areas. Strong rental demand, diverse community, close to city centre. Excellent for cash-flow investors and BRRR projects.", type: "High Yield" },
  { name: "Pear Tree", postcode: "DE23", yield: "6-8%", avgPrice: "£100,000-£150,000", profile: "Affordable terraced housing with good rental demand. Close to city centre and hospital. Popular with young professionals and families.", type: "High Yield" },
  { name: "Chaddesden", postcode: "DE21", yield: "5-7%", avgPrice: "£140,000-£200,000", profile: "Large residential area east of the city. Mix of property types, strong family rental market. Good local amenities and transport links.", type: "Balanced" },
  { name: "Sinfin", postcode: "DE24", yield: "6-8%", avgPrice: "£120,000-£170,000", profile: "Affordable area near Rolls-Royce. Strong demand from workers at nearby industrial parks. Good yields on 2-3 bed properties.", type: "High Yield" },
  { name: "Spondon", postcode: "DE21", yield: "5-6%", avgPrice: "£180,000-£250,000", profile: "Village feel within the city. Good schools, local shops, strong community. Attracts families and professionals. Reliable long-term tenants.", type: "Balanced" },
  { name: "Chellaston", postcode: "DE73", yield: "4-6%", avgPrice: "£200,000-£280,000", profile: "Popular residential suburb south of the city. Excellent schools, new-build developments. Strong family demand, good capital growth potential.", type: "Capital Growth" },
  { name: "Oakwood", postcode: "DE21", yield: "5-6%", avgPrice: "£170,000-£240,000", profile: "Modern residential area with good amenities. Popular with young families and professionals. Consistent rental demand with balanced yields.", type: "Balanced" },
  { name: "Littleover", postcode: "DE23", yield: "4-5%", avgPrice: "£220,000-£320,000", profile: "Desirable suburb with good schools and parks. Strong professional rental market. Lower yields but reliable tenants and steady capital growth.", type: "Capital Growth" },
  { name: "Darley Abbey", postcode: "DE22", yield: "4-5%", avgPrice: "£250,000-£380,000", profile: "Historic area near the river with character properties. UNESCO World Heritage site nearby. Premium tenants, strong capital growth, lower yields.", type: "Capital Growth" },
  { name: "Allestree", postcode: "DE22", yield: "4-5%", avgPrice: "£250,000-£380,000", profile: "Premium suburb north of the city. Near University of Derby. Excellent schools, Allestree Park. Professional tenants and strong growth.", type: "Capital Growth" },
];

export default function DerbyPage() {
  return (
    <>
      <section className="bg-white py-16 md:py-24">
        <div className="container-max px-4">
          <Breadcrumbs items={[{ label: "Areas", href: "/areas" }, { label: "Derby" }]} />
          <div className="max-w-3xl">
            <Link href="/areas" className="text-sm font-semibold text-navy-400 hover:text-navy-600 mb-3 inline-block">&larr; All areas</Link>
            <p className="text-xs font-semibold text-navy-400 uppercase tracking-widest mb-2">East Midlands</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-navy-800 mb-4" style={{ fontFamily: "var(--font-family-heading)" }}>Property investing in Derby</h1>
            <p className="text-navy-500 text-lg">Derby is one of England&apos;s most affordable cities for property investment, anchored by major employers like Rolls-Royce and Toyota. With house prices starting under £100,000 in some areas and gross yields regularly exceeding 6%, it offers exceptional value for cash-flow investors.</p>
          </div>
        </div>
      </section>

      <div className="border-t border-navy-100" />

      <section className="bg-navy-50 py-10">
        <div className="container-max px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { n: "£200k", l: "Average house price" },
              { n: "5-8%", l: "Typical gross yield" },
              { n: "260k+", l: "Population" },
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

      <section className="bg-white section-padding">
        <div className="container-max px-4 max-w-3xl">
          <h2 className="text-2xl font-extrabold text-navy-800 mb-6" style={{ fontFamily: "var(--font-family-heading)" }}>Why invest in Derby?</h2>
          <div className="space-y-4 text-navy-600 leading-relaxed">
            <p><strong>Affordability:</strong> Derby has some of the lowest house prices of any English city with a population over 250,000. Entry-level investment properties in areas like Normanton start from as little as £90,000-£100,000 for a 2-bed terraced house, making it accessible to first-time investors with limited capital.</p>
            <p><strong>Employment:</strong> Derby&apos;s economy is anchored by world-class employers. Rolls-Royce has its global headquarters and largest facility here, employing thousands. Toyota&apos;s UK manufacturing plant is nearby in Burnaston. Bombardier (now Alstom) manufactures trains in the city. These employers create stable, well-paid employment that drives rental demand.</p>
            <p><strong>University:</strong> The University of Derby has over 20,000 students across multiple campuses. The main Kedleston Road campus and city centre campus generate demand for student accommodation in Allestree, Markeaton, and the city centre.</p>
            <p><strong>Transport:</strong> Derby sits on the A38/A50/A52 corridor with excellent road links. Derby station offers direct trains to London St Pancras (under 2 hours), Birmingham, Nottingham, and Sheffield. East Midlands Airport is 15 minutes away. The city is well-positioned for commuters working across the Midlands.</p>
            <p><strong>Regeneration:</strong> Derby&apos;s city centre is undergoing significant regeneration. The Becketwell development is creating a new residential and leisure quarter. The Market Hall refurbishment, new performance venue, and improvements to the Cathedral Quarter are revitalising the city centre and supporting property values.</p>
          </div>
        </div>
      </section>

      <section className="bg-navy-50 section-padding">
        <div className="container-max px-4">
          <h2 className="text-2xl font-extrabold text-navy-800 mb-2 text-center" style={{ fontFamily: "var(--font-family-heading)" }}>Derby area guide</h2>
          <p className="text-navy-500 text-sm text-center mb-10">Key investment areas with typical yields and price ranges</p>

          <div className="grid md:grid-cols-2 gap-4">
            {areas.map((a) => (
              <div key={a.name} className="bg-white rounded-2xl border border-navy-100 p-6 card-hover">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-navy-800">{a.name}</h3>
                    <p className="text-xs text-navy-400">{a.postcode}</p>
                  </div>
                  <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${a.type === "High Yield" ? "bg-green-50 text-green-700" : a.type === "Capital Growth" ? "bg-blue-50 text-blue-700" : "bg-navy-50 text-navy-600"}`}>{a.type}</span>
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

      <section className="bg-white section-padding">
        <div className="container-max px-4 max-w-3xl">
          <div className="bg-navy-800 rounded-2xl p-8 md:p-10 text-center">
            <p className="text-xs font-semibold text-gold-400 uppercase tracking-widest mb-2">For Derby landlords</p>
            <h2 className="text-2xl font-extrabold text-white mb-3" style={{ fontFamily: "var(--font-family-heading)" }}>Guaranteed rent across all Derby postcodes</h2>
            <p className="text-white/60 text-sm mb-6">We lease your property and pay you every month for 3-5 years. No voids, no management, no fees.</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/guaranteed-rent/derby" className="btn-gold">Book free valuation</Link>
              <a href="/contact" target="_blank" rel="noopener noreferrer" className="btn-outline !border-white/20 !text-white hover:!bg-white/5 flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm3.75 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm3.75 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" /></svg>
                Message us
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-navy-50 section-padding">
        <div className="container-max px-4 max-w-3xl">
          <h2 className="text-xl font-bold text-navy-800 mb-6 text-center">Analyse Derby deals</h2>
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
            <p className="text-navy-500 text-sm">Enter any Derby postcode to see recent sold prices from the Land Registry and crime data from Derbyshire Police.</p>
          </div>
          <AreaSoldPricesWidget defaultPostcode="DE1 2PH" />
        </div>
      </section>

      <section className="bg-white section-padding">
        <div className="container-max max-w-3xl px-4">
          <FAQSchema faqs={derbyFaqs} />
          <DataProvenance area="Derby" />
          <Disclaimer type="financial" />
        </div>
      </section>
    </>
  );
}
