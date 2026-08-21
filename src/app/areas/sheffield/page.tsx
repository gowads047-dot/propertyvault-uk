import Link from "next/link";
import type { Metadata } from "next";
import { Disclaimer } from "@/components/legal/Disclaimer";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { AreaSoldPricesWidget } from "@/components/ui/AreaSoldPricesWidget";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { DataProvenance } from "@/components/ui/DataProvenance";

export const metadata: Metadata = {
  title: "Property Investing in Sheffield — Buy-to-Let, Yields & Area Guide 2026 | PropertyVault UK",
  description: "Complete Sheffield property investment guide 2026. Best areas for buy-to-let, average rental yields, house prices, regeneration zones, and guaranteed rent options.",
  keywords: "property investment Sheffield, buy to let Sheffield, rental yield Sheffield, Sheffield property prices, best areas to invest Sheffield, guaranteed rent Sheffield",
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/areas/sheffield/" },
  openGraph: {
    title: "Property Investing in Sheffield — Buy-to-Let, Yields & Area Guide 2026 | PropertyVault UK",
    description: "Complete Sheffield property investment guide 2026. Best areas for buy-to-let, average rental yields, house prices, regeneration zones, and guaranteed rent options.",
    type: "article",
    url: "https://www.propertyvaultuk.co.uk/areas/sheffield/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "Sheffield Property Investment Guide" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Property Investing in Sheffield — Buy-to-Let, Yields & Area Guide 2026 | PropertyVault UK",
    description: "Complete Sheffield property investment guide 2026. Best areas for buy-to-let, average rental yields, house prices, regeneration zones, and guaranteed rent options.",
  },
};

const sheffieldFaqs = [
  { q: "Is Sheffield a good place to invest in property?", a: "Sheffield is one of the UK's most compelling buy-to-let markets in 2026. The city has the largest combined student population outside London (65,000+), significant NHS and manufacturing employment, and property prices well below the national average. Gross yields of 7–10% are achievable in investment-grade postcodes, with strong demand from students, young professionals, and families." },
  { q: "What is the average rental yield in Sheffield?", a: "Gross rental yields in Sheffield typically range from 6–10% depending on the area and property type. Inner postcodes like Burngreave (S4) and Hillsborough (S6) regularly produce 8–10% gross yields. Established areas like Crookes and Walkley offer 7–8% with stronger tenant quality and lower void risk." },
  { q: "What are the best areas in Sheffield for buy-to-let?", a: "For high yield: Burngreave (S4), Hillsborough (S6), Heeley (S2/S8). For gentrification upside: Walkley (S6). For student HMO: Crookes (S10). For stable family rental: Firth Park (S5). Each suits a different investor profile and budget." },
  { q: "What is the average house price in Sheffield?", a: "Average Sheffield property prices range from approximately £130,000 in areas like Burngreave and Firth Park to £210,000 in Crookes and Walkley. Investment-grade terraced houses can be purchased for £130,000–£175,000 with typical rents of £750–£950/month." },
  { q: "Can I get guaranteed rent in Sheffield?", a: "Yes. PropertyVault offers guaranteed rent for landlords across Sheffield postcodes. We lease your property for 3–5 years and pay you every month regardless of occupancy. Contact us for a free valuation and rent estimate." },
];

const areas = [
  { name: "Burngreave", postcode: "S4", yield: "8–10%", avgPrice: "£130,000–£165,000", profile: "Highest-yielding postcode in Sheffield. Strong tenant demand from working families and young professionals. Best for investors prioritising monthly cash flow.", type: "High Yield" },
  { name: "Hillsborough", postcode: "S6", yield: "7–9%", avgPrice: "£145,000–£175,000", profile: "Well-connected suburb with Supertram links to both universities. Popular with students and professionals year-round. Improving retail and leisure offer.", type: "High Yield" },
  { name: "Walkley", postcode: "S6", yield: "7–8%", avgPrice: "£160,000–£190,000", profile: "Fast-gentrifying area popular with academics and young professionals. Victorian terraced stock, independent café culture, strong demand and low voids.", type: "Balanced" },
  { name: "Heeley", postcode: "S2/S8", yield: "6–8%", avgPrice: "£140,000–£170,000", profile: "Sheffield's artisan quarter attracting younger tenants priced out of Walkley. Good transport, improving stock. Strong BRRR opportunity for refurb investors.", type: "Balanced" },
  { name: "Crookes", postcode: "S10", yield: "6–8%", avgPrice: "£185,000–£220,000", profile: "Premium student area walking distance from University of Sheffield. Consistent high-quality HMO demand, very low void rates. Higher entry but reliable returns.", type: "Student/HMO" },
  { name: "Firth Park", postcode: "S5", yield: "6–7%", avgPrice: "£135,000–£160,000", profile: "Affordable northern suburb with stable family tenant market and low turnover. Ideal for hands-off investors wanting long-term, low-management occupancy.", type: "Balanced" },
  { name: "Nether Edge", postcode: "S7", yield: "5–6%", avgPrice: "£220,000–£320,000", profile: "Premium suburban area with strong capital growth and professional tenant base. Lower yields offset by excellent tenant quality and property appreciation.", type: "Capital Growth" },
  { name: "Attercliffe", postcode: "S9", yield: "5–7%", avgPrice: "£140,000–£190,000", profile: "Major regeneration zone with Channel 4 and tech employers arriving. Long-term upside for early movers. Mixed tenant profile — professional and working families.", type: "Growth" },
];

export default function SheffieldPage() {
  return (
    <>
      <section className="bg-white py-16 md:py-24">
        <div className="container-max px-4">
          <Breadcrumbs items={[{ label: "Areas", href: "/areas" }, { label: "Sheffield" }]} />
          <div className="max-w-3xl">
            <Link href="/areas" className="text-sm font-semibold text-navy-400 hover:text-navy-600 mb-3 inline-block">← All areas</Link>
            <p className="text-xs font-semibold text-navy-400 uppercase tracking-widest mb-2">South Yorkshire</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-navy-800 mb-4" style={{ fontFamily: "var(--font-family-heading)" }}>Property investing in Sheffield</h1>
            <p className="text-navy-500 text-lg">Sheffield is the UK&apos;s fourth-largest city and home to one of the country&apos;s largest combined student populations — yet it remains significantly undervalued relative to Manchester and Leeds. With yields of 7–10% achievable and major regeneration under way, 2026 is an important entry window.</p>
          </div>
        </div>
      </section>

      <div className="border-t border-navy-100" />

      <section className="bg-navy-50 py-10">
        <div className="container-max px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { n: "£170k", l: "Average house price" },
              { n: "7–10%", l: "Typical gross yield" },
              { n: "580k+", l: "Population" },
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
          <h2 className="text-2xl font-extrabold text-navy-800 mb-6" style={{ fontFamily: "var(--font-family-heading)" }}>Why invest in Sheffield?</h2>
          <div className="space-y-4 text-navy-600 leading-relaxed">
            <p><strong>Dual university city:</strong> The University of Sheffield and Sheffield Hallam University together attract over 65,000 students annually — creating one of the UK&apos;s largest and most reliable HMO rental markets, concentrated in the S6, S10, and S11 postcodes. Year-round demand from both undergraduate and postgraduate students keeps void rates consistently low.</p>
            <p><strong>Advanced Manufacturing Innovation District (AMID):</strong> A major cluster of advanced manufacturing, robotics, and materials science businesses anchored by the University of Sheffield AMRC is driving high-skilled employment growth in the east of the city. This is adding a new layer of professional tenant demand to an already strong market.</p>
            <p><strong>Attercliffe regeneration:</strong> The former steelworks corridor is being transformed with new tech campuses, leisure venues, creative workspaces, and housing. Channel 4 has relocated programming operations to Sheffield. Early-mover investors in S9 are well-positioned for medium-term capital growth as the district matures.</p>
            <p><strong>Sheffield Supertram:</strong> The tram network connects Hillsborough, Walkley, and the city centre to Crystal Peaks and Meadowhall — properties within walking distance of tram stops command rental premiums and lower void rates across all tenant types.</p>
            <p><strong>Affordability:</strong> Sheffield average house prices remain 30–40% below Manchester and 60% below London. A solid 3-bed terrace in Burngreave or Hillsborough can be purchased for £130,000–£160,000 and let for £800–£900/month, producing gross yields most investors can&apos;t find elsewhere in the country.</p>
          </div>
        </div>
      </section>

      <section className="bg-navy-50 section-padding">
        <div className="container-max px-4">
          <h2 className="text-2xl font-extrabold text-navy-800 mb-2 text-center" style={{ fontFamily: "var(--font-family-heading)" }}>Sheffield area guide</h2>
          <p className="text-navy-500 text-sm text-center mb-10">Key investment areas with typical yields and price ranges</p>
          <div className="grid md:grid-cols-2 gap-4">
            {areas.map((a) => (
              <div key={a.name} className="bg-white rounded-2xl border border-navy-100 p-6 card-hover">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-navy-800">{a.name}</h3>
                    <p className="text-xs text-navy-400">{a.postcode}</p>
                  </div>
                  <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${a.type === "High Yield" ? "bg-green-50 text-green-700" : a.type === "Capital Growth" ? "bg-blue-50 text-blue-700" : a.type === "Student/HMO" ? "bg-purple-50 text-purple-700" : a.type === "Growth" ? "bg-amber-50 text-amber-700" : "bg-navy-50 text-navy-600"}`}>{a.type}</span>
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
            <p className="text-xs font-semibold text-gold-400 uppercase tracking-widest mb-2">For Sheffield landlords</p>
            <h2 className="text-2xl font-extrabold text-white mb-3" style={{ fontFamily: "var(--font-family-heading)" }}>Guaranteed rent across Sheffield</h2>
            <p className="text-white/60 text-sm mb-6">We lease your property and pay you every month for 3–5 years. No voids, no management, no fees.</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/guaranteed-rent/sheffield" className="btn-gold">Book free valuation</Link>
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
          <h2 className="text-xl font-bold text-navy-800 mb-6 text-center">Analyse Sheffield deals</h2>
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

      <section className="section-padding bg-navy-50">
        <div className="container-max max-w-3xl px-4">
          <div className="text-center mb-8">
            <p className="text-gold-600 font-bold text-xs uppercase tracking-widest mb-2">Live data</p>
            <h2 className="text-2xl font-extrabold text-navy-900 mb-2">Look Up Sold Prices & Crime</h2>
            <p className="text-navy-500 text-sm">Enter any Sheffield postcode to see recent sold prices from the Land Registry and local crime data.</p>
          </div>
          <AreaSoldPricesWidget defaultPostcode="S6 3GY" />
        </div>
      </section>

      <section className="bg-white section-padding">
        <div className="container-max max-w-3xl px-4">
          <FAQSchema faqs={sheffieldFaqs} />
          <DataProvenance area="Sheffield" />
          <Disclaimer type="financial" />
        </div>
      </section>
    </>
  );
}
