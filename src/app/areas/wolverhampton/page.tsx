import Link from "next/link";
import type { Metadata } from "next";
import { Disclaimer } from "@/components/legal/Disclaimer";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { AreaSoldPricesWidget } from "@/components/ui/AreaSoldPricesWidget";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { DataProvenance } from "@/components/ui/DataProvenance";

export const metadata: Metadata = {
  title: "Wolverhampton Buy-to-Let Investment Guide | PropertyVault UK",
  description:
    "Complete Wolverhampton property investment guide. Best areas for buy-to-let, average rental yields, house prices, regeneration zones, and free tools for investors.",
  keywords:
    "property investment Wolverhampton, buy to let Wolverhampton, rental yield Wolverhampton, Wolverhampton property prices, best areas to invest Wolverhampton",
  openGraph: {
    title: "Wolverhampton Buy-to-Let Investment Guide | PropertyVault UK",
    description: "Complete Wolverhampton property investment guide. Best areas for buy-to-let, average rental yields, house prices, regeneration zones, and free tools for investors.",
    type: "article",
    url: "https://www.propertyvaultuk.co.uk/areas/wolverhampton/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "Wolverhampton Property Investment Guide" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wolverhampton Buy-to-Let Investment Guide | PropertyVault UK",
    description: "Complete Wolverhampton property investment guide. Best areas for buy-to-let, average rental yields, house prices, regeneration zones, and free tools for investors.",
  },
};

const cityFaqs = [
  {
    q: "Is Wolverhampton a good place to invest in property?",
    a: "Wolverhampton is an often-overlooked West Midlands market with strong fundamentals. Prices average around £185,000 (20% below Birmingham), yields of 5-7%, a major JLR employment hub at i54, and excellent rail access to Birmingham and London. The Interchange regeneration and Springfield Brewery development are improving the city centre investment case.",
  },
  {
    q: "What is the average rental yield in Wolverhampton?",
    a: "Gross rental yields in Wolverhampton typically range from 5-7%. Affordable areas like Blakenhall, Heath Town, and Bilston achieve 6-8% due to low entry prices. Desirable suburbs like Penn and Wednesfield offer 5-6%. Premium areas like Tettenhall yield 4-5% with stronger capital growth.",
  },
  {
    q: "What are the best areas in Wolverhampton for buy-to-let?",
    a: "For yield: Blakenhall, Heath Town, Bilston, Whitmore Reans. For capital growth: Tettenhall, Finchfield. For balance: Penn, Wednesfield. For BRRR: Blakenhall and Whitmore Reans have good Victorian stock at affordable prices.",
  },
  {
    q: "How does Wolverhampton compare to Birmingham for investment?",
    a: "Wolverhampton offers higher yields and lower entry prices than Birmingham — typically 15-20% cheaper for comparable properties. It has poorer liquidity and slower capital growth than Birmingham but the income return is stronger. Its proximity to Birmingham (18 minutes by train) means professional tenants often choose Wolverhampton for affordability while working in Birmingham.",
  },
  {
    q: "What is the i54 Business Park?",
    a: "i54 is a world-class business park south of Wolverhampton that houses Jaguar Land Rover's advanced engine manufacturing facility and more recently its BEV (Battery Electric Vehicle) operations. It employs thousands of people directly and supports a large supply chain, creating strong professional rental demand across south Wolverhampton and the surrounding area.",
  },
];

const areas = [
  {
    name: "Whitmore Reans",
    postcode: "WV6",
    yield: "6-7%",
    avgPrice: "£140,000-£190,000",
    profile:
      "Close to city centre and university. Established rental market. Mix of student, professional, and family tenants. Affordable terraced housing.",
    type: "High Yield",
  },
  {
    name: "Blakenhall",
    postcode: "WV2",
    yield: "6-8%",
    avgPrice: "£120,000-£170,000",
    profile:
      "Affordable south Wolverhampton. High yield potential. Victorian terraces with BRRR potential. Strong rental demand from working families.",
    type: "High Yield",
  },
  {
    name: "Penn",
    postcode: "WV4",
    yield: "5-6%",
    avgPrice: "£180,000-£240,000",
    profile:
      "Desirable south Wolverhampton suburb. Mix of semi-detached and detached homes. Professional and family tenants. Good schools nearby.",
    type: "Balanced",
  },
  {
    name: "Heath Town",
    postcode: "WV10",
    yield: "6-8%",
    avgPrice: "£110,000-£160,000",
    profile:
      "North Wolverhampton. Very affordable. Regeneration investment ongoing. High yield potential. Requires active management.",
    type: "High Yield",
  },
  {
    name: "Bilston",
    postcode: "WV14",
    yield: "6-7%",
    avgPrice: "£130,000-£180,000",
    profile:
      "Adjacent to Wolverhampton. Affordable terraced housing. Good transport links. Consistent rental demand from local workforce.",
    type: "High Yield",
  },
  {
    name: "Wednesfield",
    postcode: "WV11",
    yield: "5-6%",
    avgPrice: "£150,000-£200,000",
    profile:
      "North-east Wolverhampton. Suburban character. Family demand. Good local amenities. Metro access. Steady rental market.",
    type: "Balanced",
  },
  {
    name: "Tettenhall",
    postcode: "WV6",
    yield: "4-5%",
    avgPrice: "£240,000-£340,000",
    profile:
      "Premium western suburb. Victorian and Edwardian detached homes. Professional tenants. Strong capital growth. Lower yield but very reliable investment.",
    type: "Capital Growth",
  },
  {
    name: "Finchfield",
    postcode: "WV3",
    yield: "4-5%",
    avgPrice: "£210,000-£280,000",
    profile:
      "Sought-after western suburb. Quality housing stock. Good schools. Family demand. Consistent long-term lettings with reliable professional tenants.",
    type: "Capital Growth",
  },
];

function getTypeBadgeClass(type: string): string {
  switch (type) {
    case "High Yield":
      return "bg-green-50 text-green-700";
    case "Capital Growth":
      return "bg-blue-50 text-blue-700";
    case "Student/HMO":
      return "bg-purple-50 text-purple-700";
    case "Balanced":
      return "bg-navy-50 text-navy-600";
    case "Growth":
      return "bg-orange-50 text-orange-700";
    default:
      return "bg-navy-50 text-navy-600";
  }
}

export default function WolverhamptonPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-white py-16 md:py-24">
        <div className="container-max px-4 max-w-3xl">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Areas", href: "/areas" },
              { label: "Wolverhampton" },
            ]}
          />
          <p className="text-xs font-semibold text-gold-500 uppercase tracking-widest mb-3 mt-6">
            West Midlands
          </p>
          <h1
            className="text-4xl md:text-5xl font-extrabold text-navy-900 mb-6 leading-tight"
            style={{ fontFamily: "var(--font-family-heading)" }}
          >
            Wolverhampton Property Investment Guide
          </h1>
          <p className="text-lg text-navy-600 leading-relaxed">
            Wolverhampton is a major West Midlands city undergoing significant
            regeneration and benefiting from its position within one of the
            UK&apos;s strongest economic regions. Affordable property, strong
            rental demand, proximity to Birmingham, and major employment anchors
            including JLR and ENGIE make it an attractive but often overlooked
            investment market.
          </p>
        </div>
      </section>

      <hr className="border-navy-100" />

      {/* Key Stats */}
      <section className="bg-navy-50 py-10">
        <div className="container-max px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <p
                className="text-3xl font-extrabold text-navy-900"
                style={{ fontFamily: "var(--font-family-heading)" }}
              >
                £185k
              </p>
              <p className="text-sm text-navy-500 mt-1">Average price</p>
            </div>
            <div className="text-center">
              <p
                className="text-3xl font-extrabold text-navy-900"
                style={{ fontFamily: "var(--font-family-heading)" }}
              >
                5–7%
              </p>
              <p className="text-sm text-navy-500 mt-1">Typical yield</p>
            </div>
            <div className="text-center">
              <p
                className="text-3xl font-extrabold text-navy-900"
                style={{ fontFamily: "var(--font-family-heading)" }}
              >
                265,000
              </p>
              <p className="text-sm text-navy-500 mt-1">Population</p>
            </div>
            <div className="text-center">
              <p
                className="text-3xl font-extrabold text-navy-900"
                style={{ fontFamily: "var(--font-family-heading)" }}
              >
                1
              </p>
              <p className="text-sm text-navy-500 mt-1">University</p>
            </div>
          </div>
          <p className="text-xs text-navy-400 text-center mt-4">
            Figures are approximate and for illustrative purposes. Always verify
            with current market data.
          </p>
        </div>
      </section>

      {/* Why Invest */}
      <section className="bg-white section-padding">
        <div className="container-max px-4 max-w-3xl">
          <h2
            className="text-3xl font-extrabold text-navy-900 mb-8"
            style={{ fontFamily: "var(--font-family-heading)" }}
          >
            Why invest in Wolverhampton?
          </h2>

          <div className="space-y-6 text-navy-700 leading-relaxed">
            <p>
              <strong className="text-navy-900">Regeneration:</strong>{" "}
              Wolverhampton City Centre Masterplan is delivering a transformed
              city centre including the £150m Interchange project (new rail, bus,
              and tram interchange), the Springfield Brewery development (500+
              homes), and canalside regeneration. The i54 Business Park is a
              world-class commercial park accommodating Jaguar Land Rover&apos;s
              advanced engine manufacturing and JLR battery electric vehicle
              operations.
            </p>

            <p>
              <strong className="text-navy-900">Employment:</strong> Major
              employers include the City of Wolverhampton Council, Royal
              Wolverhampton NHS Trust, Jaguar Land Rover (i54 site), ENGIE
              (energy solutions HQ), Marston&apos;s (national pub group HQ), and
              a growing professional services sector. The i54 Business Park
              expansion is creating thousands of advanced manufacturing and
              technology jobs.
            </p>

            <p>
              <strong className="text-navy-900">Universities:</strong> The
              University of Wolverhampton with approximately 18,000 students
              creates consistent demand for student accommodation in postcodes
              adjacent to the City Campus and Springfield Campus. The
              university&apos;s nursing, engineering, and business schools
              attract a diverse student body.
            </p>

            <p>
              <strong className="text-navy-900">Transport:</strong> Wolverhampton
              has superb connectivity — direct trains to Birmingham New Street in
              18 minutes and to London Euston in under 1 hour 30 minutes. The
              West Midlands Metro tram runs through the city centre, with planned
              extensions. The M6, M54, and M5 motorways provide excellent road
              access.
            </p>

            <p>
              <strong className="text-navy-900">Affordability:</strong> Average
              prices around £185,000 are approximately 20% below Birmingham and
              well below the national average. Strong Victorian and Edwardian
              terraced housing stock provides excellent BRRR opportunities,
              particularly in areas like Blakenhall and Whitmore Reans.
            </p>
          </div>
        </div>
      </section>

      {/* Area Breakdown */}
      <section className="bg-navy-50 section-padding">
        <div className="container-max px-4">
          <h2
            className="text-3xl font-extrabold text-navy-900 mb-8 text-center"
            style={{ fontFamily: "var(--font-family-heading)" }}
          >
            Wolverhampton area breakdown
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {areas.map((area) => (
              <div
                key={area.name}
                className="bg-white rounded-2xl p-6 shadow-sm border border-navy-100 flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-navy-900 text-lg leading-snug">
                      {area.name}
                    </h3>
                    <p className="text-xs text-navy-400 mt-0.5">
                      {area.postcode}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${getTypeBadgeClass(area.type)}`}
                  >
                    {area.type}
                  </span>
                </div>
                <div className="flex gap-4">
                  <div>
                    <p className="text-xs text-navy-400 uppercase tracking-wide font-medium">
                      Yield
                    </p>
                    <p className="text-base font-bold text-navy-900">
                      {area.yield}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-navy-400 uppercase tracking-wide font-medium">
                      Avg price
                    </p>
                    <p className="text-base font-bold text-navy-900">
                      {area.avgPrice}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-navy-600 leading-relaxed">
                  {area.profile}
                </p>
              </div>
            ))}
          </div>
          <p className="text-xs text-navy-400 text-center mt-6">
            Yields and prices are approximate and based on typical market
            conditions. Always conduct your own research and due diligence.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white section-padding">
        <div className="container-max px-4 max-w-3xl">
          <div className="bg-navy-800 rounded-2xl p-8 md:p-10 text-center">
            <p className="text-xs font-semibold text-gold-400 uppercase tracking-widest mb-2">
              Free tools
            </p>
            <h2
              className="text-2xl font-extrabold text-white mb-3"
              style={{ fontFamily: "var(--font-family-heading)" }}
            >
              Analyse any Wolverhampton deal for free
            </h2>
            <p className="text-white/60 text-sm mb-6">
              Run the numbers on rental yield, BRRR deals, HMO returns, stamp
              duty and more — all free, no sign-up required.
            </p>
            <Link href="/calculators" className="btn-gold">
              Browse all 23 calculators
            </Link>
          </div>
        </div>
      </section>

      {/* Tools */}
      <section className="bg-navy-50 section-padding">
        <div className="container-max px-4 max-w-3xl">
          <h2
            className="text-2xl font-extrabold text-navy-900 mb-6"
            style={{ fontFamily: "var(--font-family-heading)" }}
          >
            Calculators for Wolverhampton investors
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/calculators/rental-yield"
              className="bg-white rounded-xl p-5 border border-navy-100 hover:border-gold-400 transition-colors group"
            >
              <p className="font-semibold text-navy-900 group-hover:text-gold-600 transition-colors">
                Rental Yield Calculator
              </p>
              <p className="text-xs text-navy-500 mt-1">
                Gross and net yield analysis
              </p>
            </Link>
            <Link
              href="/calculators/brrr"
              className="bg-white rounded-xl p-5 border border-navy-100 hover:border-gold-400 transition-colors group"
            >
              <p className="font-semibold text-navy-900 group-hover:text-gold-600 transition-colors">
                BRRR Calculator
              </p>
              <p className="text-xs text-navy-500 mt-1">
                Model your refinance returns
              </p>
            </Link>
            <Link
              href="/calculators/stamp-duty"
              className="bg-white rounded-xl p-5 border border-navy-100 hover:border-gold-400 transition-colors group"
            >
              <p className="font-semibold text-navy-900 group-hover:text-gold-600 transition-colors">
                Stamp Duty Calculator
              </p>
              <p className="text-xs text-navy-500 mt-1">
                Including additional property surcharge
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Sold Prices Widget */}
      <section className="bg-white section-padding">
        <div className="container-max px-4 max-w-3xl">
          <h2
            className="text-2xl font-extrabold text-navy-900 mb-6"
            style={{ fontFamily: "var(--font-family-heading)" }}
          >
            Recent sold prices in Wolverhampton
          </h2>
          <AreaSoldPricesWidget defaultPostcode="WV1 1DJ" />
        </div>
      </section>

      {/* FAQs + Disclaimer */}
      <section className="bg-navy-50 section-padding">
        <div className="container-max px-4 max-w-3xl">
          <h2
            className="text-2xl font-extrabold text-navy-900 mb-8"
            style={{ fontFamily: "var(--font-family-heading)" }}
          >
            Frequently asked questions
          </h2>
          <div className="space-y-6">
            {cityFaqs.map((faq) => (
              <div key={faq.q}>
                <h3 className="font-semibold text-navy-900 mb-2">{faq.q}</h3>
                <p className="text-navy-600 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
          <FAQSchema faqs={cityFaqs} />
          <div className="mt-10">
            <DataProvenance area="Wolverhampton" />
            <Disclaimer />
          </div>
        </div>
      </section>
    </>
  );
}

