import Link from "next/link";
import type { Metadata } from "next";
import { Disclaimer } from "@/components/legal/Disclaimer";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { AreaSoldPricesWidget } from "@/components/ui/AreaSoldPricesWidget";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export const metadata: Metadata = {
  title: "Bristol Buy-to-Let Investment Guide | PropertyVault UK",
  description:
    "Complete Bristol property investment guide. Best areas for buy-to-let, average rental yields, house prices, regeneration zones, and free tools for investors.",
  keywords:
    "property investment Bristol, buy to let Bristol, rental yield Bristol, Bristol property prices, best areas to invest Bristol",
  openGraph: {
    title: "Bristol Buy-to-Let Investment Guide | PropertyVault UK",
    description: "Complete Bristol property investment guide. Best areas for buy-to-let, average rental yields, house prices, regeneration zones, and free tools for investors.",
    type: "article",
    url: "https://propertyvaultuk.co.uk/areas/bristol/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "Bristol Property Investment Guide" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bristol Buy-to-Let Investment Guide | PropertyVault UK",
    description: "Complete Bristol property investment guide. Best areas for buy-to-let, average rental yields, house prices, regeneration zones, and free tools for investors.",
  },
};

const cityFaqs = [
  {
    q: "Is Bristol a good place to invest in property?",
    a: "Bristol is a strong long-term capital growth market. Its diverse economy (Airbus, GCHQ, Rolls-Royce, tech sector), top-10 university, chronic housing undersupply, and major Temple Quarter regeneration make it one of the UK's most resilient cities. Yields are lower than northern cities but capital growth has been exceptional.",
  },
  {
    q: "What is the average rental yield in Bristol?",
    a: "Gross rental yields in Bristol typically range from 4-6%. Inner-city areas like Easton achieve 5-7%, while premium areas like Clifton yield 3-4% but offer strong capital appreciation. The key Bristol consideration is capital growth — the city has outperformed most UK regions over the past decade.",
  },
  {
    q: "What are the best areas in Bristol for buy-to-let?",
    a: "For yield: Easton, St George, Fishponds. For professionals and capital growth: Stokes Croft, Bedminster. For premium investment: Clifton. For students: Clifton, Stokes Croft. For families: Horfield, Fishponds, Knowle.",
  },
  {
    q: "What is the average house price in Bristol?",
    a: "The average house price in Bristol is approximately £390,000, making it one of the UK's more expensive regional cities. Inner-east Bristol (Easton, St George) offers properties from £280,000-£320,000. Clifton commands £500,000-£800,000 and above.",
  },
  {
    q: "What is the Temple Quarter development in Bristol?",
    a: "Temple Quarter is a 130-hectare regeneration zone centred on Bristol Temple Meads station — one of Europe's largest urban regeneration projects. It will deliver thousands of new homes and significant commercial space, transforming the area immediately surrounding the station and making it a major driver of value growth for properties in south-central Bristol.",
  },
];

const areas = [
  {
    name: "Easton",
    postcode: "BS5",
    yield: "5-7%",
    avgPrice: "£280,000-£380,000",
    profile:
      "Diverse, gentrifying inner east Bristol. Strong young professional rental demand. Good transit links. Some of Bristol's best yields relative to purchase price.",
    type: "High Yield",
  },
  {
    name: "Bedminster",
    postcode: "BS3",
    yield: "4-6%",
    avgPrice: "£320,000-£420,000",
    profile:
      "Trendy south Bristol. Independent shops, cafes, and North Street. Young professional tenants. Improving rapidly with Temple Quarter spillover effect.",
    type: "Balanced",
  },
  {
    name: "St George",
    postcode: "BS5",
    yield: "5-6%",
    avgPrice: "£280,000-£360,000",
    profile:
      "Affordable east Bristol. Improving steadily. Mix of family and professional tenants. Good transport to city centre and Bath Road corridor.",
    type: "Balanced",
  },
  {
    name: "Fishponds",
    postcode: "BS16",
    yield: "4-6%",
    avgPrice: "£280,000-£370,000",
    profile:
      "Suburban north-east Bristol. Affordable for the city. Consistent family rental demand. Fishponds Road has strong local amenities.",
    type: "Balanced",
  },
  {
    name: "Stokes Croft",
    postcode: "BS2/BS6",
    yield: "4-5%",
    avgPrice: "£350,000-£480,000",
    profile:
      "Bristol's famous creative quarter. High demand, low voids, professional tenants. Strong capital growth. Artsy character and excellent city centre access.",
    type: "Capital Growth",
  },
  {
    name: "Horfield",
    postcode: "BS7",
    yield: "4-5%",
    avgPrice: "£290,000-£380,000",
    profile:
      "North Bristol. Family-oriented with good schools. Consistent demand. Good transport to the city centre and the north Bristol employment corridor.",
    type: "Balanced",
  },
  {
    name: "Knowle",
    postcode: "BS4",
    yield: "4-6%",
    avgPrice: "£300,000-£400,000",
    profile:
      "South Bristol suburb. Improving steadily. Mix of families and young professionals. Reasonable yield with good capital growth potential.",
    type: "Balanced",
  },
  {
    name: "Clifton",
    postcode: "BS8",
    yield: "3-4%",
    avgPrice: "£500,000-£800,000",
    profile:
      "Bristol's most prestigious neighbourhood. Georgian terraces overlooking the gorge. Premium rents and professional tenants. Outstanding long-term capital growth.",
    type: "Capital Growth",
  },
];

function getBadgeClass(type: string) {
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

export default function BristolPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-white py-16 md:py-24">
        <div className="container-max px-4 max-w-3xl">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Areas", href: "/areas" },
              { label: "Bristol" },
            ]}
          />
          <p className="text-xs font-semibold text-gold-500 uppercase tracking-widest mb-3 mt-6">
            South West England
          </p>
          <h1
            className="text-4xl md:text-5xl font-extrabold text-navy-900 mb-6"
            style={{ fontFamily: "var(--font-family-heading)" }}
          >
            Bristol Property Investment Guide
          </h1>
          <p className="text-lg text-navy-600 leading-relaxed">
            Bristol is the South West's economic capital and one of the UK's
            most desirable cities to live and work in. Home to Airbus,
            Rolls-Royce, GCHQ, and a world-class university, it commands premium
            prices — but consistent demand, a chronic undersupply of housing,
            and major regeneration make it a strong long-term capital growth
            market.
          </p>
        </div>
      </section>

      <hr className="border-navy-100" />

      {/* Key Stats */}
      <section className="bg-navy-50 py-10">
        <div className="container-max px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto text-center">
            <div>
              <p className="text-2xl font-extrabold text-navy-900">£390k</p>
              <p className="text-sm text-navy-500 mt-1">Average price</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-navy-900">4-6%</p>
              <p className="text-sm text-navy-500 mt-1">Typical yield</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-navy-900">470,000</p>
              <p className="text-sm text-navy-500 mt-1">Population</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-navy-900">2</p>
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
            Why invest in Bristol property?
          </h2>
          <div className="space-y-6 text-navy-600 leading-relaxed">
            <p>
              <strong className="text-navy-900">Regeneration:</strong> Temple
              Quarter is one of Europe's largest urban regeneration projects — a
              130-hectare zone around Bristol Temple Meads station being
              transformed into a mixed-use quarter with thousands of new homes
              and offices. Western Harbour will redevelop the historic docklands
              west of the city centre. These projects are catalysts for
              significant value growth in adjacent areas.
            </p>
            <p>
              <strong className="text-navy-900">Employment:</strong> Bristol has
              one of the UK's most diverse and resilient economies. Major
              employers include Airbus (Filton, 10,000+ jobs), Rolls-Royce, BAE
              Systems, GCHQ (£100m+ investment), the Ministry of Defence, and a
              fast-growing technology and creative sector. The Bristol and Bath
              Science Park anchors life sciences and deep tech employment.
            </p>
            <p>
              <strong className="text-navy-900">Universities:</strong> The
              University of Bristol (consistently top 10 in the UK) and the
              University of the West of England together attract approximately
              70,000 students. Demand for student accommodation in Clifton,
              Stokes Croft, and Easton is consistent and well-established.
            </p>
            <p>
              <strong className="text-navy-900">Transport:</strong> Bristol
              Temple Meads has direct trains to London Paddington in under 1
              hour 45 minutes and to Cardiff in 50 minutes. The M32 and M4/M5
              interchange provides strong road connectivity. Bristol Airport
              connects to European and transatlantic destinations.
            </p>
            <p>
              <strong className="text-navy-900">Affordability:</strong> Bristol
              is one of the more expensive regional UK cities, with average
              prices around £390,000. However, inner-city areas like Easton and
              St George still offer investment-grade properties from
              £280,000-£320,000, and yields of 5-7% are achievable in the right
              locations.
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
            Best areas to invest in Bristol
          </h2>
          <p className="text-navy-500 text-center mb-10 text-sm">
            Area-by-area breakdown of yields, prices, and tenant demand.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {areas.map((area) => (
              <div
                key={area.name}
                className="bg-white rounded-2xl p-6 shadow-sm border border-navy-100 flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-extrabold text-navy-900 text-lg">
                      {area.name}
                    </h3>
                    <p className="text-xs text-navy-400">{area.postcode}</p>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${getBadgeClass(area.type)}`}
                  >
                    {area.type}
                  </span>
                </div>
                <div className="flex gap-4">
                  <div>
                    <p className="text-xs text-navy-400">Avg price</p>
                    <p className="text-sm font-bold text-navy-800">
                      {area.avgPrice}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-navy-400">Yield</p>
                    <p className="text-sm font-bold text-navy-800">
                      {area.yield}
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
              Analyse any Bristol deal for free
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
            Calculators for Bristol investors
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/calculators/rental-yield"
              className="bg-white rounded-xl p-5 border border-navy-100 shadow-sm hover:shadow-md transition-shadow group"
            >
              <p className="font-bold text-navy-900 group-hover:text-gold-600 transition-colors">
                Rental Yield Calculator
              </p>
              <p className="text-xs text-navy-500 mt-1">
                Gross and net yield in seconds
              </p>
            </Link>
            <Link
              href="/calculators/stamp-duty"
              className="bg-white rounded-xl p-5 border border-navy-100 shadow-sm hover:shadow-md transition-shadow group"
            >
              <p className="font-bold text-navy-900 group-hover:text-gold-600 transition-colors">
                Stamp Duty Calculator
              </p>
              <p className="text-xs text-navy-500 mt-1">
                SDLT for investors and second homes
              </p>
            </Link>
            <Link
              href="/calculators/brrr"
              className="bg-white rounded-xl p-5 border border-navy-100 shadow-sm hover:shadow-md transition-shadow group"
            >
              <p className="font-bold text-navy-900 group-hover:text-gold-600 transition-colors">
                BRRR Calculator
              </p>
              <p className="text-xs text-navy-500 mt-1">
                Model your refinance and recycle
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
            Bristol sold prices
          </h2>
          <p className="text-sm text-navy-500 mb-6">
            Search recent sold prices across Bristol postcodes.
          </p>
          <AreaSoldPricesWidget defaultPostcode="BS1 4TQ" />
        </div>
      </section>

      {/* FAQ + Disclaimer */}
      <section className="bg-navy-50 section-padding">
        <div className="container-max px-4 max-w-3xl">
          <h2
            className="text-2xl font-extrabold text-navy-900 mb-8"
            style={{ fontFamily: "var(--font-family-heading)" }}
          >
            Bristol property investment — FAQs
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
          <div className="mt-12">
            <Disclaimer />
          </div>
        </div>
      </section>
    </>
  );
}

