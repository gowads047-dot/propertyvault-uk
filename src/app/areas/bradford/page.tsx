import Link from "next/link";
import type { Metadata } from "next";
import { Disclaimer } from "@/components/legal/Disclaimer";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { AreaSoldPricesWidget } from "@/components/ui/AreaSoldPricesWidget";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { DataProvenance } from "@/components/ui/DataProvenance";

export const metadata: Metadata = {
  title: "Bradford Buy-to-Let Investment Guide | PropertyVault UK",
  description:
    "Complete Bradford property investment guide. Best areas for buy-to-let, average rental yields, house prices, regeneration zones, and free tools for investors.",
  keywords:
    "property investment Bradford, buy to let Bradford, rental yield Bradford, Bradford property prices, best areas to invest Bradford",
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/areas/bradford/" },
  openGraph: {
    title: "Bradford Buy-to-Let Investment Guide | PropertyVault UK",
    description: "Complete Bradford property investment guide. Best areas for buy-to-let, average rental yields, house prices, regeneration zones, and free tools for investors.",
    type: "article",
    url: "https://www.propertyvaultuk.co.uk/areas/bradford/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "Bradford Property Investment Guide" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bradford Buy-to-Let Investment Guide | PropertyVault UK",
    description: "Complete Bradford property investment guide. Best areas for buy-to-let, average rental yields, house prices, regeneration zones, and free tools for investors.",
  },
};

const cityFaqs = [
  {
    q: "Is Bradford a good place to invest in property?",
    a: "Bradford offers some of the highest rental yields in England at entry prices starting from £100,000. Named UK City of Culture 2025, with a £15bn regeneration plan, Channel 4 presence, Morrisons HQ, and only 20 minutes from Leeds, its investment fundamentals are strengthening rapidly while remaining highly affordable.",
  },
  {
    q: "What is the average rental yield in Bradford?",
    a: "Gross rental yields in Bradford range from 6-9%, among the highest for any major UK city. Affordable inner areas like Manningham and the city centre can achieve 7-9%. Suburbs like Shipley and Bingley offer 5-7% with better capital growth profiles.",
  },
  {
    q: "What are the best areas in Bradford for buy-to-let?",
    a: "For yield: Manningham, Eccleshill, city centre. For growth: city centre (City of Culture regeneration). For value and rental: Heaton, Keighley. For professionals: Shipley and Bingley (Leeds commuter catchment).",
  },
  {
    q: "How does Bradford compare to Leeds for property investment?",
    a: "Bradford offers much higher yields and much lower entry prices than Leeds — typically 40-50% cheaper for comparable properties. Its proximity to Leeds (20 minutes by train) means many tenants work in Leeds but live in Bradford due to lower rents, sustaining strong demand. The trade-off is lower liquidity and slower capital growth, but the income potential is exceptional.",
  },
  {
    q: "What impact is Bradford City of Culture 2025 having on property?",
    a: "The UK City of Culture designation brings significant central government and lottery funding to Bradford, catalysing cultural venues, public realm improvements, and visitor economy investment. Early evidence from previous City of Culture holders (Hull 2017, Coventry 2021) suggests measurable uplift in values in and around the city centre over a 5-10 year period.",
  },
];

const areas = [
  {
    name: "Manningham",
    postcode: "BD8",
    yield: "7-9%",
    avgPrice: "£100,000-£160,000",
    profile:
      "Inner suburb close to city centre. Very affordable Victorian terraces. High yield potential. Strong rental demand. Active BRRR market.",
    type: "High Yield",
  },
  {
    name: "City Centre",
    postcode: "BD1",
    yield: "6-9%",
    avgPrice: "£100,000-£160,000",
    profile:
      "City of Culture-led regeneration. New music venue, urban park. Growing professional and student rental demand. Upside from ongoing investment.",
    type: "Growth",
  },
  {
    name: "Heaton",
    postcode: "BD9",
    yield: "6-8%",
    avgPrice: "£130,000-£180,000",
    profile:
      "North Bradford suburb near university. Improving area. Mix of professional and student tenants. Popular Victorian housing stock.",
    type: "Balanced",
  },
  {
    name: "Shipley",
    postcode: "BD17/BD18",
    yield: "5-7%",
    avgPrice: "£160,000-£220,000",
    profile:
      "Desirable town with Ninesprings and canal. Regular trains to Leeds and Bradford. Popular with professionals priced out of Leeds. Strong demand.",
    type: "Balanced",
  },
  {
    name: "Eccleshill",
    postcode: "BD2",
    yield: "6-8%",
    avgPrice: "£140,000-£190,000",
    profile:
      "North Bradford. Good transport connections. Affordable housing stock. Consistent rental demand from families and workers.",
    type: "High Yield",
  },
  {
    name: "Keighley",
    postcode: "BD20/BD21",
    yield: "6-8%",
    avgPrice: "£130,000-£185,000",
    profile:
      "Gateway to the Yorkshire Dales. Regular trains to Bradford and Leeds. Strong local rental market. Affordable terraced and semi-detached stock.",
    type: "High Yield",
  },
  {
    name: "Bingley",
    postcode: "BD16",
    yield: "5-6%",
    avgPrice: "£175,000-£240,000",
    profile:
      "Attractive Airedale town. Strong local demand. Good schools. Popular with families. Train access to Leeds and Bradford. Reliable long-term investment.",
    type: "Balanced",
  },
  {
    name: "Idle",
    postcode: "BD10",
    yield: "5-7%",
    avgPrice: "£160,000-£220,000",
    profile:
      "Suburban north Bradford. Family demand. Good access to both Bradford and Leeds. Quiet suburb with consistent rental demand.",
    type: "Balanced",
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

export default function BradfordPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-white py-16 md:py-24">
        <div className="container-max px-4 max-w-3xl">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Areas", href: "/areas" },
              { label: "Bradford" },
            ]}
          />
          <p className="text-xs font-semibold text-gold-500 uppercase tracking-widest mb-3 mt-6">
            West Yorkshire
          </p>
          <h1
            className="text-4xl md:text-5xl font-extrabold text-navy-900 mb-6"
            style={{ fontFamily: "var(--font-family-heading)" }}
          >
            Bradford Property Investment Guide
          </h1>
          <p className="text-lg text-navy-600 leading-relaxed">
            Bradford is one of the UK&apos;s most affordable major cities and
            offers some of the highest rental yields of any city in England.
            Named UK City of Culture 2025, with Channel 4 having relocated
            significant operations here and a £15bn city centre regeneration
            plan underway, Bradford&apos;s investment story is transforming
            rapidly.
          </p>
        </div>
      </section>

      <hr className="border-navy-100" />

      {/* Key Stats */}
      <section className="bg-navy-50 py-10">
        <div className="container-max px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto text-center">
            <div>
              <p
                className="text-3xl font-extrabold text-navy-900"
                style={{ fontFamily: "var(--font-family-heading)" }}
              >
                £160k
              </p>
              <p className="text-sm text-navy-500 mt-1">Average price</p>
            </div>
            <div>
              <p
                className="text-3xl font-extrabold text-navy-900"
                style={{ fontFamily: "var(--font-family-heading)" }}
              >
                6–9%
              </p>
              <p className="text-sm text-navy-500 mt-1">Typical yield</p>
            </div>
            <div>
              <p
                className="text-3xl font-extrabold text-navy-900"
                style={{ fontFamily: "var(--font-family-heading)" }}
              >
                540,000
              </p>
              <p className="text-sm text-navy-500 mt-1">Population</p>
            </div>
            <div>
              <p
                className="text-3xl font-extrabold text-navy-900"
                style={{ fontFamily: "var(--font-family-heading)" }}
              >
                2
              </p>
              <p className="text-sm text-navy-500 mt-1">Universities</p>
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
            Why invest in Bradford?
          </h2>

          <div className="space-y-6 text-navy-700 leading-relaxed">
            <p>
              <strong className="text-navy-900">Regeneration:</strong> Bradford
              was named UK City of Culture 2025 — a designation that brings
              significant funding, cultural investment, and national attention.
              The Bradford Live music venue (former Odeon, reopened), a new
              urban park, and the City Village residential development are
              transforming the city centre. Channel 4&apos;s Leeds office and
              Bradford&apos;s growing media profile are catalysts for inward
              investment.
            </p>
            <p>
              <strong className="text-navy-900">Employment:</strong> Major
              employers include Morrisons (global HQ in Bradford, 15,000+
              employees), Carlsberg Marston&apos;s (European HQ), Bradford
              Metropolitan District Council, NHS Bradford, and a growing
              professional services sector. The Bradford Opportunity Area and
              new Enterprise Zone are attracting manufacturers and tech
              companies.
            </p>
            <p>
              <strong className="text-navy-900">Universities:</strong> The
              University of Bradford (known for engineering, pharmacy, and
              health sciences) and Bradford College together enrol approximately
              30,000 students. Bradford&apos;s proximity to Leeds also means
              many young professionals choose to live in Bradford while working
              in Leeds due to much lower housing costs.
            </p>
            <p>
              <strong className="text-navy-900">Transport:</strong> Bradford
              Interchange and Bradford Forster Square stations provide regular
              trains to Leeds in 20 minutes and to Manchester via the Calder
              Valley line. The M606, M62, and M621 motorways connect Bradford to
              the national network.
            </p>
            <p>
              <strong className="text-navy-900">Affordability:</strong> Average
              house prices of around £160,000 make Bradford one of the most
              affordable cities in England. Investment-grade properties in
              central areas can be purchased from £100,000–£140,000 — some of
              the lowest entry prices for any UK city with a significant student
              and professional population.
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
            Best areas to invest in Bradford
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {areas.map((area) => (
              <div
                key={area.name}
                className="bg-white rounded-2xl p-6 shadow-sm border border-navy-100 flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-navy-900 text-lg leading-tight">
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
                    <p className="text-xs text-navy-400 uppercase tracking-wide">
                      Yield
                    </p>
                    <p className="font-bold text-navy-900">{area.yield}</p>
                  </div>
                  <div>
                    <p className="text-xs text-navy-400 uppercase tracking-wide">
                      Avg price
                    </p>
                    <p className="font-bold text-navy-900">{area.avgPrice}</p>
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
              Analyse any Bradford deal for free
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
            className="text-2xl font-extrabold text-navy-900 mb-6 text-center"
            style={{ fontFamily: "var(--font-family-heading)" }}
          >
            Investment calculators for Bradford
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/calculators/rental-yield"
              className="bg-white rounded-xl p-5 border border-navy-100 hover:border-gold-400 hover:shadow-md transition-all text-center group"
            >
              <p className="font-bold text-navy-900 group-hover:text-gold-600 transition-colors">
                Rental Yield Calculator
              </p>
              <p className="text-xs text-navy-500 mt-1">
                Gross and net yield analysis
              </p>
            </Link>
            <Link
              href="/calculators/brrr"
              className="bg-white rounded-xl p-5 border border-navy-100 hover:border-gold-400 hover:shadow-md transition-all text-center group"
            >
              <p className="font-bold text-navy-900 group-hover:text-gold-600 transition-colors">
                BRRR Calculator
              </p>
              <p className="text-xs text-navy-500 mt-1">
                Refurb, refinance and recycle
              </p>
            </Link>
            <Link
              href="/calculators/stamp-duty"
              className="bg-white rounded-xl p-5 border border-navy-100 hover:border-gold-400 hover:shadow-md transition-all text-center group"
            >
              <p className="font-bold text-navy-900 group-hover:text-gold-600 transition-colors">
                Stamp Duty Calculator
              </p>
              <p className="text-xs text-navy-500 mt-1">
                SDLT for investors and Ltd co
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
            Bradford sold prices
          </h2>
          <AreaSoldPricesWidget defaultPostcode="BD1 1RL" />
        </div>
      </section>

      {/* FAQs + Disclaimer */}
      <section className="bg-navy-50 section-padding">
        <div className="container-max px-4 max-w-3xl">
          <h2
            className="text-2xl font-extrabold text-navy-900 mb-8"
            style={{ fontFamily: "var(--font-family-heading)" }}
          >
            Bradford property investment — FAQs
          </h2>
          <div className="space-y-6">
            {cityFaqs.map((faq) => (
              <div key={faq.q}>
                <h3 className="font-bold text-navy-900 mb-2">{faq.q}</h3>
                <p className="text-navy-600 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
          <FAQSchema faqs={cityFaqs} />
          <div className="mt-10">
            <DataProvenance area="Bradford" />
            <Disclaimer />
          </div>
        </div>
      </section>
    </>
  );
}

