import Link from "next/link";
import type { Metadata } from "next";
import { Disclaimer } from "@/components/legal/Disclaimer";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { AreaSoldPricesWidget } from "@/components/ui/AreaSoldPricesWidget";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { DataProvenance } from "@/components/ui/DataProvenance";

export const metadata: Metadata = {
  title: "Coventry Buy-to-Let Investment Guide | PropertyVault UK",
  description: "Complete Coventry property investment guide. Best areas for buy-to-let, average rental yields, house prices, regeneration zones, and free tools for investors.",
  keywords: "property investment Coventry, buy to let Coventry, rental yield Coventry, Coventry property prices, best areas to invest Coventry",
  openGraph: {
    title: "Coventry Buy-to-Let Investment Guide | PropertyVault UK",
    description: "Complete Coventry property investment guide. Best areas for buy-to-let, average rental yields, house prices, regeneration zones, and free tools for investors.",
    type: "article",
    url: "https://www.propertyvaultuk.co.uk/areas/coventry/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "Coventry Property Investment Guide" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Coventry Buy-to-Let Investment Guide | PropertyVault UK",
    description: "Complete Coventry property investment guide. Best areas for buy-to-let, average rental yields, house prices, regeneration zones, and free tools for investors.",
  },
};

const cityFaqs = [
  { q: "Is Coventry a good place to invest in property?", a: "Coventry is one of the Midlands' strongest investment cities. It benefits from two major universities (50,000 students), a major regeneration programme worth £1bn+, JLR's global headquarters, and excellent transport links to Birmingham and London. Average yields of 5-7% combined with affordability well below the national average make it compelling for BTL investors." },
  { q: "What is the average rental yield in Coventry?", a: "Gross rental yields in Coventry typically range from 5-7%. Yield-focused postcodes like CV1 (Hillfields, City Centre) and CV4 (Canley) can achieve 6-8%, particularly for HMOs and student properties. Suburbs like Earlsdon (CV5) offer lower yields of 4-5% but stronger capital growth prospects." },
  { q: "What are the best areas in Coventry for buy-to-let?", a: "For yield: Hillfields, Radford, and Canley. For student/HMO returns: Canley (near Warwick) and City Centre (near Coventry University). For capital growth: Earlsdon and Binley. For regeneration upside: Whitley and Foleshill." },
  { q: "What is the average house price in Coventry?", a: "The average house price in Coventry is approximately £215,000, though this varies significantly by area. Affordable investment stock in Hillfields or Radford can be found from £130,000-£160,000, while Earlsdon properties typically start from £220,000+." },
  { q: "Can I get guaranteed rent in Coventry?", a: "Yes. PropertyVault offers guaranteed rent for landlords across Coventry postcodes. We lease your property for 3-5 years and pay you every month regardless of occupancy. Contact us for a free rent estimate." },
];

const areas = [
  { name: "City Centre", postcode: "CV1", yield: "5-7%", avgPrice: "£140,000-£200,000", profile: "Strong professional and student rental demand. Close to Coventry University and cultural venues. Good for BTL apartments and studios.", type: "Balanced" },
  { name: "Canley", postcode: "CV4", yield: "6-8%", avgPrice: "£140,000-£190,000", profile: "Near University of Warwick. Excellent for student HMOs and houses in multiple occupation. Consistent year-round demand.", type: "Student/HMO" },
  { name: "Earlsdon", postcode: "CV5", yield: "4-5%", avgPrice: "£220,000-£280,000", profile: "Coventry's most sought-after suburb. Victorian terraces, popular wine bars and restaurants. Attracts professional tenants with longer tenancies.", type: "Capital Growth" },
  { name: "Radford", postcode: "CV6", yield: "6-7%", avgPrice: "£140,000-£185,000", profile: "Affordable terraced housing close to the city centre. Strong established rental market with consistent demand from working families.", type: "High Yield" },
  { name: "Hillfields", postcode: "CV1", yield: "6-8%", avgPrice: "£130,000-£170,000", profile: "Very affordable inner suburb close to the city centre. Higher yield potential. Good for cash-flow-focused investors.", type: "High Yield" },
  { name: "Foleshill", postcode: "CV6", yield: "6-7%", avgPrice: "£140,000-£185,000", profile: "Diverse community with a strong rental market. Affordable Victorian and Edwardian stock. Good bus links into the city centre.", type: "High Yield" },
  { name: "Whitley", postcode: "CV3", yield: "5-6%", avgPrice: "£180,000-£240,000", profile: "Home to JLR Whitley headquarters. Growing professional rental demand. Improving area with regeneration investment and new employment nearby.", type: "Growth" },
  { name: "Binley", postcode: "CV3", yield: "4-5%", avgPrice: "£200,000-£260,000", profile: "Suburban south Coventry. Strong family rental demand. Good schools and amenities attract long-term tenants.", type: "Balanced" },
];

export default function CoventryPage() {
  return (
    <>
      <section className="bg-white py-16 md:py-24">
        <div className="container-max px-4">
          <Breadcrumbs items={[{ label: "Areas", href: "/areas" }, { label: "Coventry" }]} />
          <div className="max-w-3xl">
            <Link href="/areas" className="text-sm font-semibold text-navy-400 hover:text-navy-600 mb-3 inline-block">← All areas</Link>
            <p className="text-xs font-semibold text-navy-400 uppercase tracking-widest mb-2">West Midlands</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-navy-800 mb-4" style={{ fontFamily: "var(--font-family-heading)" }}>Property investing in Coventry</h1>
            <p className="text-navy-500 text-lg">Coventry is a dynamic West Midlands city with two major universities, a proud automotive heritage, and one of the UK&apos;s most ambitious city centre regeneration programmes. It was named UK City of Culture 2021 and is home to the UK Battery Industrialisation Centre, anchoring the future of EV manufacturing.</p>
          </div>
        </div>
      </section>

      <div className="border-t border-navy-100" />

      {/* Key Stats */}
      <section className="bg-navy-50 py-10">
        <div className="container-max px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { n: "£215k", l: "Average house price" },
              { n: "5-7%", l: "Typical gross yield" },
              { n: "367,000", l: "Population" },
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

      {/* Why Coventry */}
      <section className="bg-white section-padding">
        <div className="container-max px-4 max-w-3xl">
          <h2 className="text-2xl font-extrabold text-navy-800 mb-6" style={{ fontFamily: "var(--font-family-heading)" }}>Why invest in Coventry?</h2>
          <div className="space-y-4 text-navy-600 leading-relaxed">
            <p><strong>Regeneration:</strong> Coventry&apos;s £1bn+ city centre regeneration is transforming the urban core. The UK Battery Industrialisation Centre (UKBIC) at Whitley positions the city at the heart of the UK&apos;s electric vehicle transition. The city centre masterplan includes new retail, residential, and cultural quarters, with the Cathedral Lanes area and Friargate business district anchoring commercial activity.</p>
            <p><strong>Employment:</strong> Major employers include Jaguar Land Rover, Siemens, BT, Coventry City Council, and University Hospitals Coventry and Warwickshire NHS Trust. JLR&apos;s Whitley headquarters employs tens of thousands directly and supports a vast supply chain. The UKBIC and the broader Coventry and Warwickshire Investment Zone are creating new advanced manufacturing jobs.</p>
            <p><strong>Universities:</strong> University of Warwick (one of the UK&apos;s top 10) and Coventry University together bring approximately 50,000 students to the city. The Warwick campus at Canley and Coventry University&apos;s city centre campus create strong, consistent demand for student lettings and HMOs.</p>
            <p><strong>Transport:</strong> Coventry is superbly connected — it sits at the intersection of the M6, M69, and A45, with direct trains to London Euston in under an hour and Birmingham New Street in 20 minutes. The Very Light Rail project will add further city centre connectivity.</p>
            <p><strong>Affordability:</strong> Average house prices of around £215,000 remain well below the national average and significantly below Birmingham, while yields of 5-7% make it compelling for investors who want a balance of income and capital growth.</p>
          </div>
        </div>
      </section>

      {/* Area Breakdown */}
      <section className="bg-navy-50 section-padding">
        <div className="container-max px-4">
          <h2 className="text-2xl font-extrabold text-navy-800 mb-2 text-center" style={{ fontFamily: "var(--font-family-heading)" }}>Coventry area guide</h2>
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

      {/* Guaranteed Rent CTA */}
      <section className="bg-white section-padding">
        <div className="container-max px-4 max-w-3xl">
          <div className="bg-navy-800 rounded-2xl p-8 md:p-10 text-center">
            <p className="text-xs font-semibold text-gold-400 uppercase tracking-widest mb-2">For Coventry landlords</p>
            <h2 className="text-2xl font-extrabold text-white mb-3" style={{ fontFamily: "var(--font-family-heading)" }}>Guaranteed rent across all Coventry postcodes</h2>
            <p className="text-white/60 text-sm mb-6">We lease your property and pay you every month for 3-5 years. No voids, no management, no fees.</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/guaranteed-rent/coventry" className="btn-gold">Book free valuation</Link>
              <a href="/contact" target="_blank" rel="noopener noreferrer" className="btn-outline !border-white/20 !text-white hover:!bg-white/5 flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm3.75 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm3.75 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" /></svg>
                Message us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Useful Tools */}
      <section className="bg-navy-50 section-padding">
        <div className="container-max px-4 max-w-3xl">
          <h2 className="text-xl font-bold text-navy-800 mb-6 text-center">Analyse Coventry deals</h2>
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
            <p className="text-navy-500 text-sm">Enter any Coventry postcode to see recent sold prices from the Land Registry and crime data from West Midlands Police.</p>
          </div>
          <AreaSoldPricesWidget defaultPostcode="CV1 1JB" />
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-white section-padding">
        <div className="container-max max-w-3xl px-4">
          <FAQSchema faqs={cityFaqs} />
          <DataProvenance area="Coventry" />
          <Disclaimer type="financial" />
        </div>
      </section>
    </>
  );
}
