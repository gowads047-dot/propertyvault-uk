import Link from "next/link";
import type { Metadata } from "next";
import { Disclaimer } from "@/components/legal/Disclaimer";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { AreaSoldPricesWidget } from "@/components/ui/AreaSoldPricesWidget";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export const metadata: Metadata = {
  title: "Property Investing in Leicester — Buy-to-Let, Yields & Area Guide 2026 | PropertyVault UK",
  description: "Complete Leicester property investment guide 2026. Best areas for buy-to-let, average rental yields, house prices, regeneration zones, and guaranteed rent options.",
  keywords: "property investment Leicester, buy to let Leicester, rental yield Leicester, Leicester property prices, best areas to invest Leicester, guaranteed rent Leicester",
  alternates: { canonical: "https://propertyvaultuk.co.uk/areas/leicester/" },
  openGraph: {
    title: "Property Investing in Leicester — Buy-to-Let, Yields & Area Guide 2026 | PropertyVault UK",
    description: "Complete Leicester property investment guide 2026. Best areas for buy-to-let, average rental yields, house prices, regeneration zones, and guaranteed rent options.",
    type: "article",
    url: "https://propertyvaultuk.co.uk/areas/leicester/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "Leicester Property Investment Guide" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Property Investing in Leicester — Buy-to-Let, Yields & Area Guide 2026 | PropertyVault UK",
    description: "Complete Leicester property investment guide 2026. Best areas for buy-to-let, average rental yields, house prices, regeneration zones, and guaranteed rent options.",
  },
};

const leicesterFaqs = [
  { q: "Is Leicester a good place to invest in property?", a: "Leicester is one of the strongest buy-to-let markets in the East Midlands. The city has two major universities (University of Leicester and De Montfort University), a large NHS workforce, strong manufacturing and logistics employment, and property prices below the national average. Gross yields of 6–9% are achievable in well-chosen postcodes." },
  { q: "What is the average rental yield in Leicester?", a: "Gross rental yields in Leicester typically range from 5–9% depending on the area and property type. Inner postcodes like Belgrave (LE4) and the West End (LE3) regularly produce 7–9% gross yields. More established areas like Clarendon Park and Stoneygate offer 5–6% with stronger capital growth and premium tenants." },
  { q: "What are the best areas in Leicester for buy-to-let?", a: "For high yield: Belgrave (LE4), West End (LE3), Humberstone (LE5). For student HMO: Clarendon Park (LE2), Stoneygate (LE2). For family rental: Aylestone (LE2), Evington (LE5). For regeneration upside: Waterside (LE1/LE2). Each suits a different investor profile and budget." },
  { q: "What is the average house price in Leicester?", a: "Average Leicester property prices range from approximately £130,000 in inner areas like Belgrave to £220,000 in established suburbs such as Clarendon Park and Oadby. Investment-grade terraced houses in Belgrave and West End can be purchased for £130,000–£160,000 with typical rents of £700–£850/month." },
  { q: "Can I get guaranteed rent in Leicester?", a: "Yes. PropertyVault offers guaranteed rent for landlords across Leicester postcodes. We lease your property for 3–5 years and pay you every month regardless of occupancy. Contact us for a free valuation and rent estimate." },
];

const areas = [
  { name: "Belgrave", postcode: "LE4", yield: "7–9%", avgPrice: "£130,000–£165,000", profile: "Leicester's highest-yielding inner suburb. Diverse community, strong rental demand, and some of the lowest entry prices in the city. Good for BTL and BRRR investors seeking strong cash flow.", type: "High Yield" },
  { name: "West End", postcode: "LE3", yield: "7–8%", avgPrice: "£140,000–£175,000", profile: "Popular with De Montfort University students and young professionals. Affordable terrace stock, good public transport, and consistent tenant demand year-round.", type: "High Yield" },
  { name: "Humberstone", postcode: "LE5", yield: "6–8%", avgPrice: "£145,000–£185,000", profile: "East Leicester suburb with strong family and professional tenant demand. Affordable and well-connected. Popular with NHS staff from the Leicester Royal Infirmary.", type: "Balanced" },
  { name: "Clarendon Park", postcode: "LE2", yield: "5–7%", avgPrice: "£185,000–£260,000", profile: "Premium student and professional area near the University of Leicester. Victorian terraced houses command strong rents. Excellent long-term capital growth track record.", type: "Student/HMO" },
  { name: "Stoneygate", postcode: "LE2", yield: "4–6%", avgPrice: "£220,000–£350,000", profile: "Leicester's most desirable suburb. Affluent tenant base, outstanding schools, and minimal void risk. Lower yields offset by strong capital appreciation and premium rent levels.", type: "Capital Growth" },
  { name: "Aylestone", postcode: "LE2", yield: "5–7%", avgPrice: "£175,000–£240,000", profile: "Popular southern suburb with parks, canal walks, and good primary schools. Stable family tenant market with low turnover. Well-suited to hands-off landlords.", type: "Balanced" },
  { name: "Evington", postcode: "LE5", yield: "5–7%", avgPrice: "£170,000–£230,000", profile: "Established suburb popular with NHS and university professionals. Good transport links, improving housing stock, and strong long-term rental demand from professional tenants.", type: "Balanced" },
  { name: "Waterside (LE1/LE2)", postcode: "LE1/LE2", yield: "5–7%", avgPrice: "£160,000–£250,000", profile: "Major city centre regeneration zone transforming former industrial land into new homes and commercial space. Growing professional tenant interest and significant long-term upside for early movers.", type: "Growth" },
];

export default function LeicesterPage() {
  return (
    <>
      <section className="bg-white py-16 md:py-24">
        <div className="container-max px-4">
          <Breadcrumbs items={[{ label: "Areas", href: "/areas" }, { label: "Leicester" }]} />
          <div className="max-w-3xl">
            <Link href="/areas" className="text-sm font-semibold text-navy-400 hover:text-navy-600 mb-3 inline-block">← All areas</Link>
            <p className="text-xs font-semibold text-navy-400 uppercase tracking-widest mb-2">East Midlands</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-navy-800 mb-4" style={{ fontFamily: "var(--font-family-heading)" }}>Property investing in Leicester</h1>
            <p className="text-navy-500 text-lg">Leicester is a consistently underrated buy-to-let market with strong fundamentals: two universities, a large NHS workforce, growing logistics and manufacturing employment, and property prices well below the national average. For yield-focused investors, it is one of the best-value cities in the East Midlands.</p>
          </div>
        </div>
      </section>

      <div className="border-t border-navy-100" />

      <section className="bg-navy-50 py-10">
        <div className="container-max px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { n: "£175k", l: "Average house price" },
              { n: "6–9%", l: "Typical gross yield" },
              { n: "370k+", l: "Population" },
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
          <h2 className="text-2xl font-extrabold text-navy-800 mb-6" style={{ fontFamily: "var(--font-family-heading)" }}>Why invest in Leicester?</h2>
          <div className="space-y-4 text-navy-600 leading-relaxed">
            <p><strong>Dual university city:</strong> The University of Leicester and De Montfort University together enrol over 40,000 students annually, creating strong and reliable HMO demand in the LE2 and LE3 postcodes. Clarendon Park and the West End are firmly established student letting corridors with minimal void risk.</p>
            <p><strong>NHS and healthcare:</strong> Leicester Royal Infirmary, Glenfield Hospital, and the Leicester General Hospital together employ thousands of healthcare workers, driving consistent professional tenant demand across the city — particularly in the LE3, LE5, and LE2 postcodes nearest the hospital sites.</p>
            <p><strong>Manufacturing and logistics:</strong> Major employers including Next (headquartered in the city), Caterpillar, and a strong East Midlands logistics cluster anchored by the M1/M69/A47 corridors provide stable long-term employment for working professional and skilled trades tenants. The East Midlands Freeport also covers supply chain businesses in the Leicester travel-to-work area.</p>
            <p><strong>Waterside regeneration:</strong> The £350m+ Waterside regeneration project is transforming a large swathe of industrial land bordering the Grand Union Canal into new homes, offices, and leisure space — a long-term driver of property values and professional tenant demand in the city core.</p>
            <p><strong>Affordability:</strong> Leicester average house prices remain significantly below London, Birmingham, and Manchester. A solid terrace in Belgrave or the West End can still be purchased for £130,000–£155,000 and let for £700–£800/month, producing gross yields that are increasingly hard to find in more established markets.</p>
          </div>
        </div>
      </section>

      <section className="bg-navy-50 section-padding">
        <div className="container-max px-4">
          <h2 className="text-2xl font-extrabold text-navy-800 mb-2 text-center" style={{ fontFamily: "var(--font-family-heading)" }}>Leicester area guide</h2>
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
            <p className="text-xs font-semibold text-gold-400 uppercase tracking-widest mb-2">For Leicester landlords</p>
            <h2 className="text-2xl font-extrabold text-white mb-3" style={{ fontFamily: "var(--font-family-heading)" }}>Guaranteed rent across Leicester</h2>
            <p className="text-white/60 text-sm mb-6">We lease your property and pay you every month for 3–5 years. No voids, no management, no fees.</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/guaranteed-rent/leicester" className="btn-gold">Book free valuation</Link>
              <a href="https://wa.me/447415721628?text=Hi%2C%20I%20have%20a%20property%20in%20Leicester%20and%20I%27m%20interested%20in%20guaranteed%20rent." target="_blank" rel="noopener noreferrer" className="btn-outline !border-white/20 !text-white hover:!bg-white/5 flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-navy-50 section-padding">
        <div className="container-max px-4 max-w-3xl">
          <h2 className="text-xl font-bold text-navy-800 mb-6 text-center">Analyse Leicester deals</h2>
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
            <p className="text-navy-500 text-sm">Enter any Leicester postcode to see recent sold prices from the Land Registry and local crime data.</p>
          </div>
          <AreaSoldPricesWidget defaultPostcode="LE4 6GE" />
        </div>
      </section>

      <section className="bg-white section-padding">
        <div className="container-max max-w-3xl px-4">
          <FAQSchema faqs={leicesterFaqs} />
          <Disclaimer type="financial" />
        </div>
      </section>
    </>
  );
}
