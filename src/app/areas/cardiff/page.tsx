import Link from "next/link";
import type { Metadata } from "next";
import { Disclaimer } from "@/components/legal/Disclaimer";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { AreaSoldPricesWidget } from "@/components/ui/AreaSoldPricesWidget";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export const metadata: Metadata = {
  title: "Cardiff Buy-to-Let Investment Guide | PropertyVault UK",
  description:
    "Complete Cardiff property investment guide. Best areas for buy-to-let, average rental yields, house prices, regeneration zones, and free tools for investors.",
  keywords:
    "property investment Cardiff, buy to let Cardiff, rental yield Cardiff, Cardiff property prices, best areas to invest Cardiff",
  openGraph: {
    title: "Cardiff Buy-to-Let Investment Guide | PropertyVault UK",
    description: "Complete Cardiff property investment guide. Best areas for buy-to-let, average rental yields, house prices, regeneration zones, and free tools for investors.",
    type: "article",
    url: "https://propertyvaultuk.co.uk/areas/cardiff/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "Cardiff Property Investment Guide" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cardiff Buy-to-Let Investment Guide | PropertyVault UK",
    description: "Complete Cardiff property investment guide. Best areas for buy-to-let, average rental yields, house prices, regeneration zones, and free tools for investors.",
  },
};

const cityFaqs = [
  {
    q: "Is Cardiff a good place to invest in property?",
    a: "Cardiff is a strong investment city. As Wales's capital it benefits from government, BBC, HMRC and NHS employment, 80,000 students across three universities, Cardiff Bay regeneration, and prices below comparable English cities. Yields of 4-6% with student areas achieving 6-8% make it attractive across investment strategies.",
  },
  {
    q: "What is the average rental yield in Cardiff?",
    a: "Gross rental yields in Cardiff typically range from 4-6%. Student areas like Cathays achieve 6-8% for well-managed HMOs. Gentrifying areas like Grangetown and Splott offer 5-7%. Premium areas like Canton yield 5-6%. Heath and Pontcanna are lower yield but offer capital growth.",
  },
  {
    q: "What are the best areas in Cardiff for buy-to-let?",
    a: "For student HMOs: Cathays and Roath (near Cardiff University). For yield: Adamsdown, Splott, Llanrumney. For professionals and growth: Grangetown, Canton. For families and NHS workers: Heath. For capital growth: Pontcanna and Llandaff North.",
  },
  {
    q: "What is the average house price in Cardiff?",
    a: "The average house price in Cardiff is approximately £280,000. Student and inner-city areas like Cathays, Adamsdown, and Splott offer properties from £180,000-£200,000. Premium suburbs like Pontcanna and Cyncoed start from £400,000+. Central Cardiff Bay apartments range widely from £180,000 to £400,000+.",
  },
  {
    q: "How does Cardiff benefit from Welsh devolution for investors?",
    a: "Cardiff's status as capital of Wales means it concentrates the Welsh Government, Senedd, BBC Wales, and major public sector employers in a single city. This public sector employment base — which is very resilient through economic cycles — provides Cardiff landlords with a stable, reliable tenant base particularly in areas like Heath (University Hospital), Central Square (HMRC, BBC), and Cardiff Bay (Senedd, WDA).",
  },
];

const areas = [
  {
    name: "Cathays",
    postcode: "CF24",
    yield: "6-8%",
    avgPrice: "£180,000-£260,000",
    profile:
      "Primary student area near Cardiff University and Cardiff Met. Best HMO returns in the city. Affordable Victorian terraces. High demand throughout the academic year.",
    type: "Student/HMO",
  },
  {
    name: "Roath",
    postcode: "CF24",
    yield: "5-7%",
    avgPrice: "£200,000-£290,000",
    profile:
      "Near universities and city centre. Mix of students and young professionals. Victorian and Edwardian terraces. Established lettings market with consistent demand.",
    type: "Balanced",
  },
  {
    name: "Grangetown",
    postcode: "CF11",
    yield: "5-7%",
    avgPrice: "£200,000-£280,000",
    profile:
      "Gentrifying south Cardiff. Close to Cardiff Bay and city centre. Young professionals and creatives. One of the fastest-improving areas in the city.",
    type: "Growth",
  },
  {
    name: "Canton",
    postcode: "CF5",
    yield: "5-6%",
    avgPrice: "£220,000-£310,000",
    profile:
      "Vibrant west Cardiff suburb with excellent independent cafes and shops. Popular with young professionals. Good bus links. Strong rental demand.",
    type: "Balanced",
  },
  {
    name: "Adamsdown",
    postcode: "CF24",
    yield: "6-7%",
    avgPrice: "£180,000-£250,000",
    profile:
      "Inner suburb east of city centre. Close to universities and Roath Park. Affordable Victorian stock. Good yields with consistent rental demand.",
    type: "High Yield",
  },
  {
    name: "Splott",
    postcode: "CF24",
    yield: "6-7%",
    avgPrice: "£180,000-£250,000",
    profile:
      "Improving inner east Cardiff. Affordable. Young professionals and artists moving in. Good transport links. Yield-focused investment with growth potential.",
    type: "High Yield",
  },
  {
    name: "Heath",
    postcode: "CF14",
    yield: "4-5%",
    avgPrice: "£250,000-£340,000",
    profile:
      "North Cardiff suburb. Near University Hospital. Professional and NHS worker tenant demand. Good schools. Reliable long-term lettings.",
    type: "Balanced",
  },
  {
    name: "Llanrumney",
    postcode: "CF3",
    yield: "6-7%",
    avgPrice: "£160,000-£220,000",
    profile:
      "East Cardiff. Affordable entry point. Higher yield potential. Consistent working community rental demand. Value opportunity relative to central Cardiff.",
    type: "High Yield",
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

export default function CardiffPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-white py-16 md:py-24">
        <div className="container-max px-4 max-w-3xl">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Areas", href: "/areas" },
              { label: "Cardiff" },
            ]}
          />
          <p className="text-xs font-semibold text-gold-500 uppercase tracking-widest mb-3 mt-6">
            Wales
          </p>
          <h1
            className="text-4xl md:text-5xl font-extrabold text-navy-900 mb-6"
            style={{ fontFamily: "var(--font-family-heading)" }}
          >
            Cardiff Property Investment Guide
          </h1>
          <p className="text-lg text-navy-600 leading-relaxed">
            Cardiff is the UK&apos;s fastest growing capital city and one of the
            strongest investment markets in Wales and the wider South West
            region. Home to the Welsh Government, BBC Wales, HMRC, and three
            major universities with 80,000 students, Cardiff offers a compelling
            blend of employment diversity, student demand, and a rapidly
            improving city centre.
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
                £280k
              </p>
              <p className="text-sm text-navy-500 mt-1">Average price</p>
            </div>
            <div className="text-center">
              <p
                className="text-3xl font-extrabold text-navy-900"
                style={{ fontFamily: "var(--font-family-heading)" }}
              >
                4–6%
              </p>
              <p className="text-sm text-navy-500 mt-1">Typical yield</p>
            </div>
            <div className="text-center">
              <p
                className="text-3xl font-extrabold text-navy-900"
                style={{ fontFamily: "var(--font-family-heading)" }}
              >
                370,000
              </p>
              <p className="text-sm text-navy-500 mt-1">Population</p>
            </div>
            <div className="text-center">
              <p
                className="text-3xl font-extrabold text-navy-900"
                style={{ fontFamily: "var(--font-family-heading)" }}
              >
                3
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
            Why invest in Cardiff?
          </h2>

          <div className="space-y-6 text-navy-700 leading-relaxed">
            <div>
              <p>
                <strong className="text-navy-900">Regeneration:</strong>{" "}
                Cardiff Bay has been transformed over three decades into a
                vibrant waterfront quarter with the Senedd (National Assembly),
                Wales Millennium Centre, and Mermaid Quay. Central Square, a
                major new office development adjacent to Cardiff Central
                station, is home to the BBC, HMRC, Hugh James, and other major
                employers. The Cardiff Capital Region City Deal is investing
                £1.28bn across ten local authorities.
              </p>
            </div>
            <div>
              <p>
                <strong className="text-navy-900">Employment:</strong> Major
                employers include NHS Wales (the largest employer in Wales), the
                Welsh Government, BBC Wales (BBC Wales Drama Studios), HMRC
                (major employer at Central Square), Legal &amp; General, Admiral
                Insurance (HQ), and a growing fintech and digital sector.
                Cardiff&apos;s public sector employment base provides very
                stable rental demand.
              </p>
            </div>
            <div>
              <p>
                <strong className="text-navy-900">Universities:</strong> Cardiff
                University (Russell Group), Cardiff Metropolitan University, and
                the University of South Wales together attract approximately
                80,000 students. The highest concentration of student demand is
                in Cathays and Roath, which consistently offer some of
                Cardiff&apos;s highest yields.
              </p>
            </div>
            <div>
              <p>
                <strong className="text-navy-900">Transport:</strong> Cardiff
                Central station has direct trains to London Paddington in under
                2 hours and to Bristol in 50 minutes. The M4 motorway connects
                Cardiff to Bristol and London. Cardiff Airport connects to
                European destinations, and the South Wales Metro is expanding
                rail links across the Cardiff city region.
              </p>
            </div>
            <div>
              <p>
                <strong className="text-navy-900">Affordability:</strong>{" "}
                Average prices of around £280,000 are below the England average
                and well below comparable English cities of the same size, while
                yields of 4-6% reflect Cardiff&apos;s strong rental demand.
                Student areas like Cathays offer yields of 6-8%.
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
            Cardiff areas for buy-to-let
          </h2>
          <p className="text-navy-500 text-center mb-10">
            Key investment neighbourhoods and their typical returns
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {areas.map((area) => (
              <div
                key={area.name}
                className="bg-white rounded-2xl p-6 shadow-sm border border-navy-100 flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-navy-900">
                      {area.name}
                    </h3>
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
                    <p className="text-sm font-bold text-navy-800">
                      {area.yield}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-navy-400">Avg price</p>
                    <p className="text-sm font-bold text-navy-800">
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

      {/* Tools CTA */}
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
              Analyse any Cardiff deal for free
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

      {/* Tools Section */}
      <section className="bg-navy-50 section-padding">
        <div className="container-max px-4 max-w-3xl">
          <h2
            className="text-2xl font-extrabold text-navy-900 mb-2"
            style={{ fontFamily: "var(--font-family-heading)" }}
          >
            Cardiff investment calculators
          </h2>
          <p className="text-navy-500 mb-8">
            Free tools to analyse Cardiff buy-to-let deals
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/calculators/rental-yield"
              className="bg-white rounded-xl p-5 border border-navy-100 hover:border-gold-400 transition-colors group"
            >
              <p className="font-bold text-navy-900 group-hover:text-gold-600 transition-colors">
                Rental Yield Calculator
              </p>
              <p className="text-sm text-navy-500 mt-1">
                Gross and net yield on any Cardiff property
              </p>
            </Link>
            <Link
              href="/calculators/stamp-duty"
              className="bg-white rounded-xl p-5 border border-navy-100 hover:border-gold-400 transition-colors group"
            >
              <p className="font-bold text-navy-900 group-hover:text-gold-600 transition-colors">
                Stamp Duty Calculator
              </p>
              <p className="text-sm text-navy-500 mt-1">
                LTT rates apply in Wales — calculate your liability
              </p>
            </Link>
            <Link
              href="/calculators/hmo-yield"
              className="bg-white rounded-xl p-5 border border-navy-100 hover:border-gold-400 transition-colors group"
            >
              <p className="font-bold text-navy-900 group-hover:text-gold-600 transition-colors">
                HMO Yield Calculator
              </p>
              <p className="text-sm text-navy-500 mt-1">
                Model room-by-room returns for Cathays HMOs
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
            Cardiff sold prices
          </h2>
          <p className="text-navy-500 mb-8">
            Recent sold prices across Cardiff postcodes
          </p>
          <AreaSoldPricesWidget defaultPostcode="CF24 4AH" />
        </div>
      </section>

      {/* FAQs + Disclaimer */}
      <section className="bg-navy-50 section-padding">
        <div className="container-max px-4 max-w-3xl">
          <h2
            className="text-2xl font-extrabold text-navy-900 mb-8"
            style={{ fontFamily: "var(--font-family-heading)" }}
          >
            Cardiff property investment — FAQs
          </h2>
          <div className="space-y-6">
            {cityFaqs.map((faq) => (
              <div key={faq.q} className="bg-white rounded-xl p-6 border border-navy-100">
                <h3 className="font-bold text-navy-900 mb-2">{faq.q}</h3>
                <p className="text-navy-600 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
          <FAQSchema faqs={cityFaqs} />
          <div className="mt-10">
            <Disclaimer />
          </div>
        </div>
      </section>
    </>
  );
}

