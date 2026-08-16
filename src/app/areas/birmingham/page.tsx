import Link from "next/link";
import type { Metadata } from "next";
import { Disclaimer } from "@/components/legal/Disclaimer";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { AreaSoldPricesWidget } from "@/components/ui/AreaSoldPricesWidget";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export const metadata: Metadata = {
  title: "Birmingham Buy-to-Let Guide — Yields & Areas | PropertyVault UK",
  description: "Complete Birmingham property investment guide. Best areas for buy-to-let, average rental yields, house prices, regeneration zones, and guaranteed rent options.",
  keywords: "property investment Birmingham, buy to let Birmingham, rental yield Birmingham, Birmingham property prices, best areas to invest Birmingham, guaranteed rent Birmingham",
  openGraph: {
    title: "Birmingham Buy-to-Let Guide — Yields & Areas | PropertyVault UK",
    description: "Complete Birmingham property investment guide. Best areas for buy-to-let, average rental yields, house prices, regeneration zones, and guaranteed rent options.",
    type: "article",
    url: "https://propertyvaultuk.co.uk/areas/birmingham/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "Birmingham Property Investment Guide" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Birmingham Buy-to-Let Guide — Yields & Areas | PropertyVault UK",
    description: "Complete Birmingham property investment guide. Best areas for buy-to-let, average rental yields, house prices, regeneration zones, and guaranteed rent options.",
  },
};

const birminghamFaqs = [
  { q: "Is Birmingham a good place to invest in property?", a: "Birmingham is one of the UK's strongest property investment cities. It benefits from a large and growing population (over 1.1 million), major regeneration projects (HS2, Smithfield, Paradise), strong rental demand from a young workforce and three major universities, and prices significantly below London. Average yields range from 5-8% for single lets." },
  { q: "What is the average rental yield in Birmingham?", a: "Gross rental yields in Birmingham typically range from 5-8% depending on the area and property type. Areas like Erdington, Aston, and Small Heath tend to offer higher yields (6-8%), while premium areas like Edgbaston and Harborne offer lower yields (4-5%) but stronger capital growth." },
  { q: "What are the best areas in Birmingham for buy-to-let?", a: "For yield: Erdington, Aston, Small Heath, Sparkhill, Handsworth, and Perry Barr. For capital growth: Edgbaston, Moseley, Kings Heath, Harborne, and Jewellery Quarter. For HMOs: Selly Oak (student), Erdington, and Perry Barr." },
  { q: "What is the average house price in Birmingham?", a: "The average house price in Birmingham is approximately £230,000-£250,000, though this varies significantly by area. Properties in Erdington or Aston can be found from £130,000-£180,000, while Edgbaston or Harborne properties typically start from £300,000+." },
  { q: "Can I get guaranteed rent in Birmingham?", a: "Yes. PropertyVault offers guaranteed rent for landlords across all Birmingham postcodes. We lease your property for 3-5 years and pay you every month regardless of occupancy. Contact us for a free valuation." },
];

const areas = [
  { name: "Erdington", postcode: "B23/B24", yield: "6-8%", avgPrice: "£150,000-£200,000", profile: "Strong rental demand, affordable entry point, popular with families. Close to city centre via A38. Good for BTL and BRRR.", type: "High Yield" },
  { name: "Aston", postcode: "B6", yield: "6-8%", avgPrice: "£130,000-£180,000", profile: "Very affordable, close to Aston University and city centre. Strong HMO and BTL demand. Regeneration potential.", type: "High Yield" },
  { name: "Small Heath", postcode: "B10", yield: "6-7%", avgPrice: "£140,000-£190,000", profile: "Affordable terraced housing, strong community, good transport links. Popular with families and young professionals.", type: "High Yield" },
  { name: "Sparkhill / Sparkbrook", postcode: "B11/B12", yield: "5-7%", avgPrice: "£150,000-£200,000", profile: "Diverse community, strong rental demand, established letting market. Good yields on terraced properties.", type: "Balanced" },
  { name: "Handsworth", postcode: "B21", yield: "6-8%", avgPrice: "£130,000-£180,000", profile: "Affordable Victorian housing stock ideal for BRRR. Strong rental demand. Improvement area with regeneration funding.", type: "High Yield" },
  { name: "Perry Barr", postcode: "B42", yield: "5-7%", avgPrice: "£160,000-£220,000", profile: "Major regeneration from 2022 Commonwealth Games. New transport links, housing developments. Growing area with capital growth potential.", type: "Growth" },
  { name: "Kings Heath", postcode: "B14", yield: "4-6%", avgPrice: "£220,000-£300,000", profile: "Popular suburb with independent shops, restaurants, and parks. Strong tenant demand from young professionals. Good capital growth.", type: "Balanced" },
  { name: "Moseley", postcode: "B13", yield: "4-5%", avgPrice: "£280,000-£400,000", profile: "Premium suburb, village feel, award-winning high street. Strong capital growth, affluent tenant profile. Lower yields but safe investment.", type: "Capital Growth" },
  { name: "Edgbaston", postcode: "B15/B16", yield: "4-5%", avgPrice: "£250,000-£400,000", profile: "Prestigious area near University of Birmingham. Strong professional and student rental market. Premium properties with reliable tenants.", type: "Capital Growth" },
  { name: "Selly Oak", postcode: "B29", yield: "6-9%", avgPrice: "£180,000-£280,000", profile: "Major student area near University of Birmingham. Excellent for HMOs and student lets. Very high yields but seasonal demand.", type: "Student/HMO" },
];

export default function BirminghamPage() {
  return (
    <>
      <section className="bg-white py-16 md:py-24">
        <div className="container-max px-4">
          <Breadcrumbs items={[{ label: "Areas", href: "/areas" }, { label: "Birmingham" }]} />
          <div className="max-w-3xl">
            <Link href="/areas" className="text-sm font-semibold text-navy-400 hover:text-navy-600 mb-3 inline-block">← All areas</Link>
            <p className="text-xs font-semibold text-navy-400 uppercase tracking-widest mb-2">West Midlands</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-navy-800 mb-4" style={{ fontFamily: "var(--font-family-heading)" }}>Property investing in Birmingham</h1>
            <p className="text-navy-500 text-lg">Birmingham is the UK&apos;s second-largest city and one of the strongest property investment markets outside London. With a population of over 1.1 million, three major universities, and billions in regeneration spending, it offers a compelling mix of yield and growth.</p>
          </div>
        </div>
      </section>

      <div className="border-t border-navy-100" />

      {/* Key Stats */}
      <section className="bg-navy-50 py-10">
        <div className="container-max px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { n: "£230k", l: "Average house price" },
              { n: "5-8%", l: "Typical gross yield" },
              { n: "1.1M+", l: "Population" },
              { n: "3", l: "Major universities" },
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

      {/* Why Birmingham */}
      <section className="bg-white section-padding">
        <div className="container-max px-4 max-w-3xl">
          <h2 className="text-2xl font-extrabold text-navy-800 mb-6" style={{ fontFamily: "var(--font-family-heading)" }}>Why invest in Birmingham?</h2>
          <div className="space-y-4 text-navy-600 leading-relaxed">
            <p><strong>Regeneration:</strong> Birmingham is undergoing one of the largest urban regeneration programmes in Europe. The HS2 high-speed rail link (arriving at Curzon Street) will cut journey times to London to 49 minutes. The £1.9 billion Smithfield development is transforming the former wholesale markets into a new mixed-use quarter. Paradise Birmingham has brought new Grade A office space to the city centre.</p>
            <p><strong>Employment:</strong> Birmingham has a diverse economy with strengths in financial services, automotive, healthcare, and technology. Major employers include HSBC (UK headquarters relocated to Birmingham), Deutsche Bank, Monzo, and the BBC. The city creates thousands of new jobs each year, driving rental demand.</p>
            <p><strong>Universities:</strong> Three major universities — University of Birmingham, Aston University, and Birmingham City University — bring over 80,000 students to the city. This creates strong demand for HMOs and student accommodation, particularly in Selly Oak, Edgbaston, and Aston.</p>
            <p><strong>Transport:</strong> Excellent connectivity with New Street station (national rail hub), Birmingham Airport, extensive bus network, and the expanding West Midlands Metro tram system. The Sprint bus rapid transit network is also expanding.</p>
            <p><strong>Affordability:</strong> Average house prices remain approximately 40-50% below London, making Birmingham accessible to investors with smaller budgets. A strong 3-bed terraced house in areas like Erdington or Aston can still be purchased for £150,000-£180,000.</p>
          </div>
        </div>
      </section>

      {/* Area Breakdown */}
      <section className="bg-navy-50 section-padding">
        <div className="container-max px-4">
          <h2 className="text-2xl font-extrabold text-navy-800 mb-2 text-center" style={{ fontFamily: "var(--font-family-heading)" }}>Birmingham area guide</h2>
          <p className="text-navy-500 text-sm text-center mb-10">Key investment areas with typical yields and price ranges</p>

          <div className="grid md:grid-cols-2 gap-4">
            {areas.map((a) => (
              <div key={a.name} className="bg-white rounded-2xl border border-navy-100 p-6 card-hover">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-navy-800">{a.name}</h3>
                    <p className="text-xs text-navy-400">{a.postcode}</p>
                  </div>
                  <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${a.type === "High Yield" ? "bg-green-50 text-green-700" : a.type === "Capital Growth" ? "bg-blue-50 text-blue-700" : a.type === "Student/HMO" ? "bg-purple-50 text-purple-700" : "bg-navy-50 text-navy-600"}`}>{a.type}</span>
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

      {/* Guaranteed Rent CTA */}
      <section className="bg-white section-padding">
        <div className="container-max px-4 max-w-3xl">
          <div className="bg-navy-800 rounded-2xl p-8 md:p-10 text-center">
            <p className="text-xs font-semibold text-gold-400 uppercase tracking-widest mb-2">For Birmingham landlords</p>
            <h2 className="text-2xl font-extrabold text-white mb-3" style={{ fontFamily: "var(--font-family-heading)" }}>Guaranteed rent across all Birmingham postcodes</h2>
            <p className="text-white/60 text-sm mb-6">We lease your property and pay you every month for 3-5 years. No voids, no management, no fees.</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/guaranteed-rent/birmingham" className="btn-gold">Book free valuation</Link>
              <a href="https://wa.me/447415721628?text=Hi%2C%20I%20have%20a%20property%20in%20Birmingham%20and%20I%27m%20interested%20in%20guaranteed%20rent." target="_blank" rel="noopener noreferrer" className="btn-outline !border-white/20 !text-white hover:!bg-white/5 flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Useful Tools */}
      <section className="bg-navy-50 section-padding">
        <div className="container-max px-4 max-w-3xl">
          <h2 className="text-xl font-bold text-navy-800 mb-6 text-center">Analyse Birmingham deals</h2>
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
            <p className="text-navy-500 text-sm">Enter any Birmingham postcode to see recent sold prices from the Land Registry and crime data from West Midlands Police.</p>
          </div>
          <AreaSoldPricesWidget defaultPostcode="B12 8QX" />
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-white section-padding">
        <div className="container-max max-w-3xl px-4">
          <FAQSchema faqs={birminghamFaqs} />
          <Disclaimer type="financial" />
        </div>
      </section>
    </>
  );
}
