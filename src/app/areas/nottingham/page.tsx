import Link from "next/link";
import type { Metadata } from "next";
import { Disclaimer } from "@/components/legal/Disclaimer";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { AreaSoldPricesWidget } from "@/components/ui/AreaSoldPricesWidget";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { DataProvenance } from "@/components/ui/DataProvenance";

export const metadata: Metadata = {
  title: "Property Investing in Nottingham — Buy-to-Let, Yields & Area Guide | PropertyVault UK",
  description: "Complete Nottingham property investment guide. Best areas for buy-to-let, average rental yields, house prices, student market, and guaranteed rent options.",
  keywords: "property investment Nottingham, buy to let Nottingham, rental yield Nottingham, Nottingham property prices, best areas to invest Nottingham, guaranteed rent Nottingham",
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/areas/nottingham/" },
  openGraph: {
    title: "Property Investing in Nottingham — Buy-to-Let, Yields & Area Guide | PropertyVault UK",
    description: "Complete Nottingham property investment guide. Best areas for buy-to-let, average rental yields, house prices, student market, and guaranteed rent options.",
    type: "article",
    url: "https://www.propertyvaultuk.co.uk/areas/nottingham/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "Nottingham Property Investment Guide" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Property Investing in Nottingham — Buy-to-Let, Yields & Area Guide | PropertyVault UK",
    description: "Complete Nottingham property investment guide. Best areas for buy-to-let, average rental yields, house prices, student market, and guaranteed rent options.",
  },
};

const nottinghamFaqs = [
  { q: "Is Nottingham a good place to invest in property?", a: "Nottingham is one of the best-value cities in the East Midlands for property investment. It has two major universities bringing 60,000+ students, a growing professional services sector, strong rental demand, and average house prices well below the national average. Gross yields of 6-9% are achievable in many areas." },
  { q: "What is the average rental yield in Nottingham?", a: "Gross rental yields in Nottingham typically range from 5-9% depending on the area and property type. Student areas like Lenton and Radford can achieve 8-10% on HMOs, while professional lets in West Bridgford or The Park offer 4-5% with stronger capital growth." },
  { q: "What are the best areas in Nottingham for buy-to-let?", a: "For yield: Sneinton, Radford, Hyson Green, Bulwell, and St Ann's. For capital growth: West Bridgford, The Park, Beeston, and Mapperley. For HMOs/students: Lenton, Dunkirk, Radford, and Beeston." },
  { q: "What is the average house price in Nottingham?", a: "The average house price in Nottingham is approximately £200,000-£220,000, though this varies significantly by area. Properties in Bulwell or Sneinton can be found from £100,000-£150,000, while West Bridgford or Mapperley properties typically start from £250,000+." },
  { q: "Can I get guaranteed rent in Nottingham?", a: "Yes. PropertyVault offers guaranteed rent for landlords across all Nottingham postcodes. We lease your property for 3-5 years and pay you every month regardless of occupancy. Contact us for a free valuation." },
];

const areas = [
  { name: "Sneinton", postcode: "NG2/NG3", yield: "7-9%", avgPrice: "£100,000-£160,000", profile: "Very affordable, close to city centre, strong rental demand. Victorian terraces ideal for BRRR. Popular with young professionals.", type: "High Yield" },
  { name: "Radford", postcode: "NG7", yield: "7-10%", avgPrice: "£120,000-£180,000", profile: "Strong student and professional market near University of Nottingham. Excellent for HMOs. High demand area with consistent yields.", type: "Student/HMO" },
  { name: "Hyson Green", postcode: "NG7", yield: "6-8%", avgPrice: "£110,000-£170,000", profile: "Affordable terraced housing, diverse community, tram connection to city centre. Good for BTL with strong demand from young renters.", type: "High Yield" },
  { name: "Lenton", postcode: "NG7", yield: "8-10%", avgPrice: "£150,000-£250,000", profile: "Prime student letting area between both universities. Excellent HMO yields but seasonal. Properties hold value due to consistent demand.", type: "Student/HMO" },
  { name: "Bulwell", postcode: "NG6", yield: "6-8%", avgPrice: "£100,000-£150,000", profile: "One of the most affordable areas in Nottingham. Tram-connected, strong rental demand from families. Good entry-level investment area.", type: "High Yield" },
  { name: "St Ann's", postcode: "NG3", yield: "6-8%", avgPrice: "£100,000-£150,000", profile: "Very affordable, close to city centre, regeneration area. Strong rental demand, good for cash-flow-focused investors.", type: "High Yield" },
  { name: "Beeston", postcode: "NG9", yield: "5-7%", avgPrice: "£180,000-£260,000", profile: "Popular suburb near University of Nottingham. Mix of student and professional tenants. Good high street, tram link. Balanced yield and growth.", type: "Balanced" },
  { name: "Mapperley", postcode: "NG3", yield: "4-6%", avgPrice: "£200,000-£300,000", profile: "Desirable residential area with character properties. Strong professional rental market. Good capital growth with lower but reliable yields.", type: "Capital Growth" },
  { name: "West Bridgford", postcode: "NG2", yield: "4-5%", avgPrice: "£250,000-£400,000", profile: "Premium suburb south of the Trent. Excellent schools, restaurants, and lifestyle. Professional tenants, strong capital growth, lower yields.", type: "Capital Growth" },
  { name: "Sherwood", postcode: "NG5", yield: "5-7%", avgPrice: "£160,000-£230,000", profile: "Popular residential area with independent shops and community feel. Good mix of yield and growth. Attracts young professionals and families.", type: "Balanced" },
];

export default function NottinghamPage() {
  return (
    <>
      <section className="bg-white py-16 md:py-24">
        <div className="container-max px-4">
          <Breadcrumbs items={[{ label: "Areas", href: "/areas" }, { label: "Nottingham" }]} />
          <div className="max-w-3xl">
            <Link href="/areas" className="text-sm font-semibold text-navy-400 hover:text-navy-600 mb-3 inline-block">&larr; All areas</Link>
            <p className="text-xs font-semibold text-navy-400 uppercase tracking-widest mb-2">East Midlands</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-navy-800 mb-4" style={{ fontFamily: "var(--font-family-heading)" }}>Property investing in Nottingham</h1>
            <p className="text-navy-500 text-lg">Nottingham offers some of the highest rental yields in the UK, driven by two major universities, a growing professional economy, and house prices well below the national average. It&apos;s a top choice for cash-flow-focused investors.</p>
          </div>
        </div>
      </section>

      <div className="border-t border-navy-100" />

      <section className="bg-navy-50 py-10">
        <div className="container-max px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { n: "£210k", l: "Average house price" },
              { n: "5-9%", l: "Typical gross yield" },
              { n: "330k+", l: "Population" },
              { n: "2", l: "Major universities" },
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
          <h2 className="text-2xl font-extrabold text-navy-800 mb-6" style={{ fontFamily: "var(--font-family-heading)" }}>Why invest in Nottingham?</h2>
          <div className="space-y-4 text-navy-600 leading-relaxed">
            <p><strong>Affordability:</strong> Nottingham has some of the lowest property prices of any major English city. Average prices are approximately 30-40% below the national average, meaning investors can enter the market from as little as £100,000 for a tenanted property. This drives some of the highest yields in the country.</p>
            <p><strong>Universities:</strong> The University of Nottingham and Nottingham Trent University bring over 60,000 students to the city. This creates massive demand for HMOs and shared housing, particularly in Lenton, Radford, Beeston, and Dunkirk. Student lets consistently achieve yields of 8-10%.</p>
            <p><strong>Employment:</strong> Nottingham has a diverse economy with strengths in life sciences, fintech, creative industries, and public sector. Major employers include Boots (headquarters), Experian, Capital One, and Nottingham University Hospitals. The BioCity innovation hub attracts growing tech firms.</p>
            <p><strong>Transport:</strong> Good connectivity via the NET tram network (two lines serving key investment areas), East Midlands Parkway for London trains (under 2 hours), and the A52/M1 for road access. The tram significantly boosts rental demand in areas it serves.</p>
            <p><strong>Regeneration:</strong> The Broadmarsh area redevelopment, Southside regeneration zone, and Island Quarter (the largest single-site development in the East Midlands) are transforming the city centre. The Creative Quarter around Hockley and Lace Market has revitalised the northern city centre.</p>
          </div>
        </div>
      </section>

      <section className="bg-navy-50 section-padding">
        <div className="container-max px-4">
          <h2 className="text-2xl font-extrabold text-navy-800 mb-2 text-center" style={{ fontFamily: "var(--font-family-heading)" }}>Nottingham area guide</h2>
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

      <section className="bg-white section-padding">
        <div className="container-max px-4 max-w-3xl">
          <div className="bg-navy-800 rounded-2xl p-8 md:p-10 text-center">
            <p className="text-xs font-semibold text-gold-400 uppercase tracking-widest mb-2">For Nottingham landlords</p>
            <h2 className="text-2xl font-extrabold text-white mb-3" style={{ fontFamily: "var(--font-family-heading)" }}>Guaranteed rent across all Nottingham postcodes</h2>
            <p className="text-white/60 text-sm mb-6">We lease your property and pay you every month for 3-5 years. No voids, no management, no fees.</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/guaranteed-rent/nottingham" className="btn-gold">Book free valuation</Link>
              <a href="https://wa.me/447415721628?text=Hi%2C%20I%20have%20a%20property%20in%20Nottingham%20and%20I%27m%20interested%20in%20guaranteed%20rent." target="_blank" rel="noopener noreferrer" className="btn-outline !border-white/20 !text-white hover:!bg-white/5 flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-navy-50 section-padding">
        <div className="container-max px-4 max-w-3xl">
          <h2 className="text-xl font-bold text-navy-800 mb-6 text-center">Analyse Nottingham deals</h2>
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
            <p className="text-navy-500 text-sm">Enter any Nottingham postcode to see recent sold prices from the Land Registry and crime data from Nottinghamshire Police.</p>
          </div>
          <AreaSoldPricesWidget defaultPostcode="NG7 2PH" />
        </div>
      </section>

      <section className="bg-white section-padding">
        <div className="container-max max-w-3xl px-4">
          <FAQSchema faqs={nottinghamFaqs} />
          <DataProvenance area="Nottingham" />
          <Disclaimer type="financial" />
        </div>
      </section>
    </>
  );
}
