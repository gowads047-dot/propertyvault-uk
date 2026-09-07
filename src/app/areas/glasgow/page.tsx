import Link from "next/link";
import type { Metadata } from "next";
import { Disclaimer } from "@/components/legal/Disclaimer";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { AreaSoldPricesWidget } from "@/components/ui/AreaSoldPricesWidget";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { DataProvenance } from "@/components/ui/DataProvenance";
import { siteMetrics } from "@/lib/site";

export const metadata: Metadata = {
  title: "Glasgow Buy-to-Let Investment Guide | PropertyVault UK",
  description:
    "Complete Glasgow property investment guide. Best areas for buy-to-let, average rental yields, house prices, regeneration zones, and free tools for investors.",
  keywords:
    "property investment Glasgow, buy to let Glasgow, rental yield Glasgow, Glasgow property prices, best areas to invest Glasgow",
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/areas/glasgow/" },
  openGraph: {
    title: "Glasgow Buy-to-Let Investment Guide | PropertyVault UK",
    description: "Complete Glasgow property investment guide. Best areas for buy-to-let, average rental yields, house prices, regeneration zones, and free tools for investors.",
    type: "article",
    url: "https://www.propertyvaultuk.co.uk/areas/glasgow/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "Glasgow Property Investment Guide" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Glasgow Buy-to-Let Investment Guide | PropertyVault UK",
    description: "Complete Glasgow property investment guide. Best areas for buy-to-let, average rental yields, house prices, regeneration zones, and free tools for investors.",
  },
};

const cityFaqs = [
  {
    q: "Is Glasgow a good place to invest in property?",
    a: "Glasgow is an excellent investment city — more affordable than Edinburgh, with yields of 5-7%, 90,000 students across four universities, Scotland's largest NHS trust, and major regeneration along the Clyde. The Barclays campus at Tradeston, Clyde Waterfront development, and EAST END legacy projects are improving the long-term story significantly.",
  },
  {
    q: "What is the average rental yield in Glasgow?",
    a: "Gross rental yields in Glasgow typically range from 5-7%. Inner areas like Govan, Maryhill, and Parkhead achieve 6-8% due to affordable entry prices. Popular areas like Partick and Shawlands offer 5-6%. Premium West End locations like Hyndland yield 4-5% but offer strong capital appreciation.",
  },
  {
    q: "What are the best areas in Glasgow for buy-to-let?",
    a: "For yield: Govan, Maryhill, Parkhead. For growth: Dennistoun, Govan (Clyde regeneration). For students: Partick, Hillhead. For professionals: Shawlands, Thornwood, Dennistoun. For capital growth: Hyndland, Dowanhill.",
  },
  {
    q: "How does Glasgow compare to Edinburgh for investment?",
    a: "Glasgow offers significantly higher yields and lower entry prices than Edinburgh — average prices are around £200,000 vs £360,000 in Edinburgh. Edinburgh has historically delivered stronger capital growth, but Glasgow's gap is narrowing due to major regeneration and inward investment. For income investors, Glasgow is clearly the stronger market; for capital growth, Edinburgh remains ahead.",
  },
  {
    q: "What is driving rental demand in Glasgow?",
    a: "Glasgow's rental demand is driven by NHS Greater Glasgow and Clyde (largest UK health board), four universities (90,000 students), the Barclays campus (5,000 fintech jobs), and a growing tech and creative sector. The student-to-population ratio is one of the highest in the UK, providing structural underlying demand for the private rental sector.",
  },
];

const areas = [
  {
    name: "Partick",
    postcode: "G11",
    yield: "5-7%",
    avgPrice: "£160,000-£230,000",
    profile:
      "West End border. Popular with students and professionals. Near subway. Mix of tenement flats and converted properties. Strong demand and low void rates.",
    type: "Balanced",
  },
  {
    name: "Dennistoun",
    postcode: "G31",
    yield: "6-7%",
    avgPrice: "£140,000-£210,000",
    profile:
      "East inner Glasgow. Rapidly gentrifying. Artists and young professionals. Excellent café culture on Alexandra Parade. Growing demand and improving values.",
    type: "Growth",
  },
  {
    name: "Govan",
    postcode: "G51",
    yield: "6-8%",
    avgPrice: "£120,000-£180,000",
    profile:
      "West bank of the Clyde. Regenerating rapidly. Near Barclays campus and Queen Elizabeth Hospital. Affordable with significant upside from Clyde waterfront development.",
    type: "Growth",
  },
  {
    name: "Maryhill",
    postcode: "G20",
    yield: "6-8%",
    avgPrice: "£120,000-£180,000",
    profile:
      "North Glasgow. Canal corridor. Affordable tenement stock. Consistent rental demand. Community-focused with improving amenities.",
    type: "High Yield",
  },
  {
    name: "Parkhead",
    postcode: "G31",
    yield: "6-8%",
    avgPrice: "£110,000-£170,000",
    profile:
      "East end. Near Celtic Park. Very affordable. High yields. Mix of working community and improving demographics. Low entry for cash flow investors.",
    type: "High Yield",
  },
  {
    name: "Shawlands",
    postcode: "G41/G43",
    yield: "5-6%",
    avgPrice: "£180,000-£260,000",
    profile:
      "South Glasgow suburb. Excellent amenities on Kilmarnock Road. Young professionals and families. Popular and improving with good capital growth.",
    type: "Balanced",
  },
  {
    name: "Hyndland",
    postcode: "G12",
    yield: "4-5%",
    avgPrice: "£280,000-£420,000",
    profile:
      "Premium West End. Edwardian red sandstone tenements. Close to Botanic Gardens. Professional tenants, long tenancies. Strong capital growth.",
    type: "Capital Growth",
  },
  {
    name: "Thornwood",
    postcode: "G11/G14",
    yield: "5-6%",
    avgPrice: "£200,000-£280,000",
    profile:
      "West Glasgow near Partick. Family and professional demand. Good subway access. Mix of traditional tenements and modern properties. Reliable investment.",
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

export default function GlasgowPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-white py-16 md:py-24">
        <div className="container-max px-4 max-w-3xl">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Area Guides", href: "/areas" },
              { label: "Glasgow" },
            ]}
          />
          <p className="text-xs font-semibold text-gold-500 uppercase tracking-widest mt-6 mb-2">
            Scotland
          </p>
          <h1
            className="text-4xl md:text-5xl font-extrabold text-navy-900 mb-6"
            style={{ fontFamily: "var(--font-family-heading)" }}
          >
            Glasgow Property Investment Guide
          </h1>
          <p className="text-lg text-navy-600 leading-relaxed">
            Glasgow is Scotland&apos;s largest city and one of the UK&apos;s most dynamic
            property investment markets. Affordable relative to Edinburgh, with four
            universities, a regenerating city centre, and a strong private rental sector,
            Glasgow offers yields that consistently outperform the Scottish average and
            match many English regional cities.
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
                £200k
              </p>
              <p className="text-sm text-navy-500 mt-1">Average price</p>
            </div>
            <div>
              <p
                className="text-3xl font-extrabold text-navy-900"
                style={{ fontFamily: "var(--font-family-heading)" }}
              >
                5–7%
              </p>
              <p className="text-sm text-navy-500 mt-1">Typical yield</p>
            </div>
            <div>
              <p
                className="text-3xl font-extrabold text-navy-900"
                style={{ fontFamily: "var(--font-family-heading)" }}
              >
                640,000
              </p>
              <p className="text-sm text-navy-500 mt-1">Population</p>
            </div>
            <div>
              <p
                className="text-3xl font-extrabold text-navy-900"
                style={{ fontFamily: "var(--font-family-heading)" }}
              >
                4
              </p>
              <p className="text-sm text-navy-500 mt-1">Universities</p>
            </div>
          </div>
          <p className="text-xs text-navy-400 text-center mt-4">
            Figures are approximate and for illustrative purposes. Always verify with
            current market data.
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
            Why invest in Glasgow?
          </h2>
          <div className="space-y-6 text-navy-700 leading-relaxed">
            <p>
              <strong>Regeneration:</strong> The Clyde Waterfront and Renfrew Riverside
              project is one of Scotland&apos;s largest regeneration programmes, transforming
              former industrial land along the River Clyde. The Barclays Bank campus at
              Tradeston (5,000 employees) has catalysed the south bank of the Clyde. The
              EAST END regeneration programme and Commonwealth Games legacy (Emirates
              Arena, Sir Chris Hoy Velodrome) continue to improve east Glasgow.
            </p>
            <p>
              <strong>Employment:</strong> Glasgow has Scotland&apos;s most diverse economy.
              Major employers include NHS Greater Glasgow and Clyde (the UK&apos;s largest NHS
              health board), City of Glasgow Council, Scottish Power, Arnold Clark,
              Aggreko, Weir Group, BBC Scotland, and a growing financial services and
              technology sector. FinTech Scotland and the Barclays campus have placed
              Glasgow on the map for technology employment.
            </p>
            <p>
              <strong>Universities:</strong> The University of Glasgow (Russell Group,
              world top 100), University of Strathclyde, Glasgow Caledonian University,
              and Glasgow School of Art together attract approximately 90,000 students —
              one of the highest student-to-population ratios in the UK. This sustains
              huge rental demand across the West End and inner city.
            </p>
            <p>
              <strong>Transport:</strong> Glasgow Queen Street and Glasgow Central
              stations connect to Edinburgh in 50 minutes, London Euston in under 4.5
              hours, and all Scottish cities. The SPT Subway and extensive bus network
              provide city-wide connectivity. Glasgow Airport connects to global
              destinations.
            </p>
            <p>
              <strong>Affordability:</strong> Average house prices around £200,000 make
              Glasgow significantly more affordable than Edinburgh (£360,000+) and
              comparable to many English regional cities. West End properties near the
              university start from £160,000, while inner east areas like Govan and
              Parkhead offer entry prices from £110,000–£140,000.
            </p>
          </div>
        </div>
      </section>

      {/* Area Breakdown */}
      <section className="bg-navy-50 section-padding">
        <div className="container-max px-4">
          <h2
            className="text-3xl font-extrabold text-navy-900 mb-2 text-center"
            style={{ fontFamily: "var(--font-family-heading)" }}
          >
            Glasgow area breakdown
          </h2>
          <p className="text-navy-500 text-center mb-10">
            Key neighbourhoods for buy-to-let investment
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {areas.map((area) => (
              <div
                key={area.name}
                className="bg-white rounded-2xl p-6 shadow-sm border border-navy-100 flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-navy-900 text-lg">{area.name}</h3>
                    <p className="text-xs text-navy-400">{area.postcode}</p>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap ${getTypeBadgeClass(area.type)}`}
                  >
                    {area.type}
                  </span>
                </div>
                <div className="flex gap-4">
                  <div>
                    <p className="text-xs text-navy-400">Yield</p>
                    <p className="font-bold text-navy-900">{area.yield}</p>
                  </div>
                  <div>
                    <p className="text-xs text-navy-400">Avg price</p>
                    <p className="font-bold text-navy-900">{area.avgPrice}</p>
                  </div>
                </div>
                <p className="text-sm text-navy-600 leading-relaxed">{area.profile}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-navy-400 text-center mt-6">
            Yields and prices are approximate and based on typical market conditions.
            Always conduct your own research and due diligence.
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
              Analyse any Glasgow deal for free
            </h2>
            <p className="text-white/60 text-sm mb-6">
              Run the numbers on rental yield, BRRR deals, HMO returns, stamp duty and
              more — all free, no sign-up required.
            </p>
            <Link href="/calculators" className="btn-gold">
              Browse all {siteMetrics.calculators} calculators
            </Link>
          </div>
        </div>
      </section>

      {/* Tools */}
      <section className="bg-navy-50 section-padding">
        <div className="container-max px-4 max-w-3xl">
          <h2
            className="text-2xl font-extrabold text-navy-900 mb-2"
            style={{ fontFamily: "var(--font-family-heading)" }}
          >
            Calculators for Glasgow investors
          </h2>
          <p className="text-navy-500 mb-8">
            Free tools to appraise your next Glasgow deal.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/calculators/rental-yield"
              className="bg-white rounded-xl p-5 border border-navy-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <p className="font-bold text-navy-900 mb-1">Rental Yield</p>
              <p className="text-sm text-navy-500">
                Calculate gross and net yield on any Glasgow property.
              </p>
            </Link>
            <Link
              href="/calculators/stamp-duty"
              className="bg-white rounded-xl p-5 border border-navy-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <p className="font-bold text-navy-900 mb-1">Stamp Duty (LBTT)</p>
              <p className="text-sm text-navy-500">
                Estimate Land and Buildings Transaction Tax for Scottish purchases.
              </p>
            </Link>
            <Link
              href="/calculators/brrr"
              className="bg-white rounded-xl p-5 border border-navy-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <p className="font-bold text-navy-900 mb-1">BRRR Calculator</p>
              <p className="text-sm text-navy-500">
                Model buy, refurbish, refinance, rent returns in Glasgow.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Area Sold Prices Widget */}
      <section className="bg-white section-padding">
        <div className="container-max px-4 max-w-3xl">
          <h2
            className="text-2xl font-extrabold text-navy-900 mb-2"
            style={{ fontFamily: "var(--font-family-heading)" }}
          >
            Glasgow sold prices
          </h2>
          <p className="text-navy-500 mb-8">
            Search recent sold prices across Glasgow postcodes.
          </p>
          <AreaSoldPricesWidget defaultPostcode="G1 1DH" />
        </div>
      </section>

      {/* FAQ Schema + Disclaimer */}
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
                <h3 className="font-bold text-navy-900 mb-2">{faq.q}</h3>
                <p className="text-navy-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
          <FAQSchema faqs={cityFaqs} />
          <div className="mt-12">
            <DataProvenance area="Glasgow" />
            <Disclaimer />
          </div>
        </div>
      </section>
    </>
  );
}

