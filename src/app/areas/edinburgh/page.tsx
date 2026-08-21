import Link from "next/link";
import type { Metadata } from "next";
import { Disclaimer } from "@/components/legal/Disclaimer";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { AreaSoldPricesWidget } from "@/components/ui/AreaSoldPricesWidget";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { DataProvenance } from "@/components/ui/DataProvenance";

export const metadata: Metadata = {
  title: "Edinburgh Buy-to-Let Investment Guide | PropertyVault UK",
  description:
    "Complete Edinburgh property investment guide. Best areas for buy-to-let, average rental yields, house prices, regeneration zones, and free tools for investors.",
  keywords:
    "property investment Edinburgh, buy to let Edinburgh, rental yield Edinburgh, Edinburgh property prices, best areas to invest Edinburgh",
  openGraph: {
    title: "Edinburgh Buy-to-Let Investment Guide | PropertyVault UK",
    description: "Complete Edinburgh property investment guide. Best areas for buy-to-let, average rental yields, house prices, regeneration zones, and free tools for investors.",
    type: "article",
    url: "https://www.propertyvaultuk.co.uk/areas/edinburgh/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "Edinburgh Property Investment Guide" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Edinburgh Buy-to-Let Investment Guide | PropertyVault UK",
    description: "Complete Edinburgh property investment guide. Best areas for buy-to-let, average rental yields, house prices, regeneration zones, and free tools for investors.",
  },
};

const cityFaqs = [
  {
    q: "Is Edinburgh a good place to invest in property?",
    a: "Edinburgh is one of the UK's strongest long-term capital growth markets. Its combination of global appeal (UNESCO World Heritage, Fringe Festival), structural housing undersupply, world-class university, and financial sector employment makes it highly resilient. Yields are lower than northern cities (4-5%) but capital growth has consistently outperformed national averages.",
  },
  {
    q: "What is the average rental yield in Edinburgh?",
    a: "Gross rental yields in Edinburgh typically range from 4-5%. More affordable areas like Restalrig and Craigmillar achieve 5-7%. Popular areas like Leith and Gorgie-Dalry offer 5-6%. Premium areas like Stockbridge and Morningside yield 3-4% but deliver exceptional capital growth.",
  },
  {
    q: "What are the best areas in Edinburgh for buy-to-let?",
    a: "For yield: Restalrig, Craigmillar, Gorgie-Dalry. For growth: Leith, Granton (Waterfront), Gorgie-Dalry (tram corridor). For premium capital growth: Stockbridge, Portobello, Morningside. For students: Marchmont, Newington.",
  },
  {
    q: "What is the average house price in Edinburgh?",
    a: "The average house price in Edinburgh is approximately £360,000, making it Scotland's most expensive city and one of the more expensive UK regional cities. Affordable areas like Restalrig and Craigmillar offer properties from £180,000-£250,000. Stockbridge and Morningside start from £380,000-£450,000 and above.",
  },
  {
    q: "How does the Edinburgh Festival affect property investment?",
    a: "The Edinburgh Festival Fringe (August) is the world's largest arts festival, bringing over 3 million visitors to the city and creating exceptional short-term rental demand. Properties in the city centre and surrounding areas can achieve 5-7x normal nightly rates during August. Many Edinburgh landlords use a hybrid strategy of short-term lets in August and long-term tenancies for the remaining months.",
  },
];

const areas = [
  {
    name: "Leith",
    postcode: "EH6",
    yield: "5-6%",
    avgPrice: "£250,000-£380,000",
    profile:
      "Transformed port area. World-class restaurants on The Shore. Young professionals and creatives. Tram access to city centre. Strong demand and improving values.",
    type: "Growth",
  },
  {
    name: "Gorgie-Dalry",
    postcode: "EH11/EH14",
    yield: "5-6%",
    avgPrice: "£220,000-£320,000",
    profile:
      "Affordable west Edinburgh. Improving rapidly. Local amenities on Gorgie Road. Young professionals. Good tram access. Capital growth potential.",
    type: "Growth",
  },
  {
    name: "Pilrig",
    postcode: "EH6",
    yield: "5-6%",
    avgPrice: "£230,000-£330,000",
    profile:
      "North Edinburgh. Between city centre and Leith. Improving steadily. Mix of students and young professionals. Tram access from Newhaven nearby.",
    type: "Balanced",
  },
  {
    name: "Restalrig",
    postcode: "EH7",
    yield: "5-7%",
    avgPrice: "£200,000-£290,000",
    profile:
      "Affordable east Edinburgh. Close to city centre. Improving area. Higher yield relative to Edinburgh average. Good for value-focused investors.",
    type: "High Yield",
  },
  {
    name: "Craigmillar",
    postcode: "EH16",
    yield: "5-7%",
    avgPrice: "£180,000-£260,000",
    profile:
      "South Edinburgh regeneration zone. Major investment in new housing and amenities. Affordable. Improving rapidly. Edinburgh's best development upside.",
    type: "Growth",
  },
  {
    name: "Portobello",
    postcode: "EH15",
    yield: "4-5%",
    avgPrice: "£280,000-£420,000",
    profile:
      "Coastal suburb with beach. Very popular. Strong demand from families and professionals. Capital growth story. Limited supply of quality stock.",
    type: "Capital Growth",
  },
  {
    name: "Stockbridge",
    postcode: "EH4",
    yield: "4-5%",
    avgPrice: "£380,000-£600,000",
    profile:
      "Charming north Edinburgh village. Botanic Gardens nearby. Premium professional tenants. Very strong capital growth. Low vacancy and long tenancies.",
    type: "Capital Growth",
  },
  {
    name: "Morningside",
    postcode: "EH10",
    yield: "3-4%",
    avgPrice: "£450,000-£700,000",
    profile:
      "Edinburgh's most prestigious suburb. Excellent schools. Very affluent tenant base. Long tenancies and reliable income. Exceptional long-term capital growth.",
    type: "Capital Growth",
  },
];

const typeBadge: Record<string, string> = {
  "High Yield": "bg-green-50 text-green-700",
  "Capital Growth": "bg-blue-50 text-blue-700",
  "Student/HMO": "bg-purple-50 text-purple-700",
  Balanced: "bg-navy-50 text-navy-600",
  Growth: "bg-orange-50 text-orange-700",
};

export default function EdinburghPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-white py-16 md:py-24">
        <div className="container-max px-4 max-w-3xl">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Area Guides", href: "/areas" },
              { label: "Edinburgh" },
            ]}
          />
          <p className="text-xs font-semibold text-gold-500 uppercase tracking-widest mb-3 mt-6">
            Scotland
          </p>
          <h1
            className="text-4xl md:text-5xl font-extrabold text-navy-900 mb-6"
            style={{ fontFamily: "var(--font-family-heading)" }}
          >
            Edinburgh Property Investment Guide
          </h1>
          <p className="text-lg text-navy-600 leading-relaxed">
            Edinburgh is the UK's second most visited city and Scotland's
            capital — a global centre for finance, technology, and tourism with
            a chronic housing shortage and some of the strongest long-term
            capital growth of any UK city. While yields are lower than northern
            cities, Edinburgh's resilience, global appeal, and structural
            undersupply make it a compelling capital growth investment.
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
                £360k
              </p>
              <p className="text-sm text-navy-500 mt-1">Average price</p>
            </div>
            <div>
              <p
                className="text-3xl font-extrabold text-navy-900"
                style={{ fontFamily: "var(--font-family-heading)" }}
              >
                4–5%
              </p>
              <p className="text-sm text-navy-500 mt-1">Typical yield</p>
            </div>
            <div>
              <p
                className="text-3xl font-extrabold text-navy-900"
                style={{ fontFamily: "var(--font-family-heading)" }}
              >
                530,000
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
            Why invest in Edinburgh property?
          </h2>

          <div className="space-y-6 text-navy-700 leading-relaxed">
            <div>
              <p>
                <strong className="text-navy-900">Regeneration:</strong>{" "}
                Edinburgh Waterfront (Granton) is a major 5,000-home development
                transforming former gas works land on the Firth of Forth. The
                Haymarket Quarter is creating a major new office and retail
                district west of the city centre. The completed St James Quarter
                (2021) has transformed the east end of Princes Street. Western
                Edinburgh is seeing significant residential development along the
                tram corridor.
              </p>
            </div>

            <div>
              <p>
                <strong className="text-navy-900">Employment:</strong> Edinburgh
                is Scotland's financial capital, home to major institutions
                including Baillie Gifford, Standard Life Aberdeen, Royal Bank of
                Scotland, and Lloyds Banking Scotland. The technology sector has
                grown rapidly with Skyscanner, FanDuel, Administrate, and dozens
                of VC-backed companies based here. The Scottish Parliament and
                Scottish Government employ thousands in public sector roles.
              </p>
            </div>

            <div>
              <p>
                <strong className="text-navy-900">Universities:</strong> The
                University of Edinburgh (consistently top 20 globally),
                Heriot-Watt University, Edinburgh Napier University, and Queen
                Margaret University together attract approximately 75,000
                students. August each year brings the Festival Fringe — the
                world's largest arts festival — driving exceptional short-term
                rental demand.
              </p>
            </div>

            <div>
              <p>
                <strong className="text-navy-900">Transport:</strong> Edinburgh
                Waverley has direct trains to London King's Cross in 4.5 hours
                and to Glasgow Queen Street in 50 minutes. Edinburgh Airport is
                Scotland's busiest, connecting to hundreds of global
                destinations. The Edinburgh Tram network covers the airport,
                city centre, and Newhaven.
              </p>
            </div>

            <div>
              <p>
                <strong className="text-navy-900">Affordability:</strong>{" "}
                Edinburgh is geographically constrained — built between a
                volcanic hill (Arthur's Seat), the Firth of Forth, green belt,
                and the New Town UNESCO World Heritage Site. This structural
                undersupply means demand consistently outpaces new housing
                delivery, supporting long-term price and rental growth.
              </p>
            </div>
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
            Best areas to invest in Edinburgh
          </h2>
          <p className="text-navy-500 text-center mb-10">
            Breakdown by postcode, yield, and investment profile
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {areas.map((area) => (
              <div
                key={area.name}
                className="bg-white rounded-2xl p-6 shadow-sm border border-navy-100 flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-extrabold text-navy-900 text-lg leading-tight">
                      {area.name}
                    </h3>
                    <p className="text-xs text-navy-400 mt-0.5">
                      {area.postcode}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${typeBadge[area.type] ?? "bg-navy-50 text-navy-600"}`}
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
              Analyse any Edinburgh deal for free
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
            className="text-2xl font-extrabold text-navy-900 mb-2"
            style={{ fontFamily: "var(--font-family-heading)" }}
          >
            Free calculators for Edinburgh investors
          </h2>
          <p className="text-navy-500 mb-8">
            Use our free tools to stress-test any Edinburgh investment before
            you commit.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/calculators/rental-yield"
              className="bg-white border border-navy-100 rounded-xl p-5 hover:shadow-md transition-shadow group"
            >
              <p className="font-bold text-navy-900 group-hover:text-gold-600 transition-colors">
                Rental Yield Calculator
              </p>
              <p className="text-sm text-navy-500 mt-1">
                Gross and net yield on any Edinburgh property
              </p>
            </Link>
            <Link
              href="/calculators/stamp-duty"
              className="bg-white border border-navy-100 rounded-xl p-5 hover:shadow-md transition-shadow group"
            >
              <p className="font-bold text-navy-900 group-hover:text-gold-600 transition-colors">
                Stamp Duty Calculator
              </p>
              <p className="text-sm text-navy-500 mt-1">
                LBTT costs for Scottish buy-to-let purchases
              </p>
            </Link>
            <Link
              href="/calculators/brrr"
              className="bg-white border border-navy-100 rounded-xl p-5 hover:shadow-md transition-shadow group"
            >
              <p className="font-bold text-navy-900 group-hover:text-gold-600 transition-colors">
                BRRR Calculator
              </p>
              <p className="text-sm text-navy-500 mt-1">
                Model your refinance and recycled capital
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Sold Prices Widget */}
      <section className="bg-white section-padding">
        <div className="container-max px-4 max-w-3xl">
          <h2
            className="text-2xl font-extrabold text-navy-900 mb-2"
            style={{ fontFamily: "var(--font-family-heading)" }}
          >
            Edinburgh sold prices
          </h2>
          <p className="text-navy-500 mb-8">
            Search recent sold prices across Edinburgh postcodes.
          </p>
          <AreaSoldPricesWidget defaultPostcode="EH6 6HF" />
        </div>
      </section>

      {/* FAQ Schema + Disclaimer */}
      <section className="bg-navy-50 section-padding">
        <div className="container-max px-4 max-w-3xl">
          <h2
            className="text-2xl font-extrabold text-navy-900 mb-8"
            style={{ fontFamily: "var(--font-family-heading)" }}
          >
            Edinburgh property investment FAQs
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
            <DataProvenance area="Edinburgh" />
            <Disclaimer />
          </div>
        </div>
      </section>
    </>
  );
}

