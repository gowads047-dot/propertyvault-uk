import Link from "next/link";
import type { Metadata } from "next";
import { Disclaimer } from "@/components/legal/Disclaimer";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { AreaSoldPricesWidget } from "@/components/ui/AreaSoldPricesWidget";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { DataProvenance } from "@/components/ui/DataProvenance";
import { siteMetrics } from "@/lib/site";

export const metadata: Metadata = {
  title: "Newcastle Buy-to-Let Investment Guide | PropertyVault UK",
  description:
    "Complete Newcastle property investment guide. Best areas for buy-to-let, average rental yields, house prices, regeneration zones, and free tools for investors.",
  keywords:
    "property investment Newcastle, buy to let Newcastle, rental yield Newcastle, Newcastle property prices, best areas to invest Newcastle",
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/areas/newcastle/" },
  openGraph: {
    title: "Newcastle Buy-to-Let Investment Guide | PropertyVault UK",
    description: "Complete Newcastle property investment guide. Best areas for buy-to-let, average rental yields, house prices, regeneration zones, and free tools for investors.",
    type: "article",
    url: "https://www.propertyvaultuk.co.uk/areas/newcastle/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "Newcastle Property Investment Guide" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Newcastle Buy-to-Let Investment Guide | PropertyVault UK",
    description: "Complete Newcastle property investment guide. Best areas for buy-to-let, average rental yields, house prices, regeneration zones, and free tools for investors.",
  },
};

const cityFaqs = [
  {
    q: "Is Newcastle a good place to invest in property?",
    a: "Newcastle offers an excellent combination of affordability and yield. Average prices around £185,000, gross yields of 5-8%, two large universities (60,000 students), and a growing tech economy make it one of the best-value major UK investment cities. The North East Devolution Deal and Science Central development are improving the long-term growth story.",
  },
  {
    q: "What is the average rental yield in Newcastle?",
    a: "Gross rental yields in Newcastle typically range from 5-8%. Affordable areas like Benwell, Walker, and Byker achieve 6-8% due to low entry prices. Popular areas like Heaton and Fenham offer 6-7%, while premium Jesmond yields 5-6% but offers stronger capital growth.",
  },
  {
    q: "What are the best areas in Newcastle for buy-to-let?",
    a: "For yield: Benwell, Walker, Byker, Fenham. For students: Jesmond, Heaton. For capital growth: Jesmond, Gosforth. For value: Gateshead (often overlooked and undervalued). For BRRR: Benwell and Walker have affordable stock with refurbishment potential.",
  },
  {
    q: "What is the average house price in Newcastle?",
    a: "The average house price in Newcastle is approximately £185,000. The most affordable areas for investors are Walker and Benwell from around £100,000-£130,000. Heaton and Fenham properties range from £140,000-£200,000. Gosforth and Jesmond start from £250,000+.",
  },
  {
    q: "How does Gateshead compare to Newcastle for investment?",
    a: "Gateshead is directly across the Tyne from Newcastle and is often undervalued relative to the city. It benefits from the same Metro network, proximity to the city centre, and the Sage Gateshead and Baltic arts venues have transformed the waterfront. Entry prices are typically 10-20% lower than comparable Newcastle areas, making it attractive for yield-focused investors.",
  },
];

const areas = [
  {
    name: "Jesmond",
    postcode: "NE2",
    yield: "5-6%",
    avgPrice: "£230,000-£350,000",
    profile:
      "Newcastle's premier suburb. Mix of students and professionals. Tree-lined Victorian streets. Strong capital growth and reliable long-term rental demand.",
    type: "Capital Growth",
  },
  {
    name: "Heaton",
    postcode: "NE6/NE7",
    yield: "6-7%",
    avgPrice: "£180,000-£240,000",
    profile:
      "Popular with students and young professionals. Affordable terraced housing. Easy Metro access to city centre. Consistent rental demand throughout the year.",
    type: "Balanced",
  },
  {
    name: "Fenham",
    postcode: "NE4",
    yield: "6-7%",
    avgPrice: "£140,000-£200,000",
    profile:
      "Affordable west Newcastle. Mix of student, professional, and family tenants. Good bus links. Strong demand from both Newcastle and Northumbria students.",
    type: "High Yield",
  },
  {
    name: "Byker",
    postcode: "NE6",
    yield: "6-8%",
    avgPrice: "£120,000-£180,000",
    profile:
      "East Newcastle close to city centre. Affordable entry price. Regeneration investment ongoing. Good Metro access. Higher yield potential.",
    type: "High Yield",
  },
  {
    name: "Benwell",
    postcode: "NE4/NE15",
    yield: "6-8%",
    avgPrice: "£110,000-£170,000",
    profile:
      "Very affordable west Newcastle. High yield potential from low entry prices. Regeneration funding in the area. Requires active management.",
    type: "High Yield",
  },
  {
    name: "Walker",
    postcode: "NE6",
    yield: "6-8%",
    avgPrice: "£100,000-£160,000",
    profile:
      "East End riverside location. Some of Newcastle's lowest entry prices. High yields. Regeneration opportunities on former industrial land along the Tyne.",
    type: "High Yield",
  },
  {
    name: "Gosforth",
    postcode: "NE3",
    yield: "4-5%",
    avgPrice: "£250,000-£380,000",
    profile:
      "Premium north Newcastle suburb. Professional and family tenants. Excellent schools. Strong demand and long tenancies. Capital growth-focused investment.",
    type: "Capital Growth",
  },
  {
    name: "Gateshead",
    postcode: "NE8/NE9",
    yield: "6-8%",
    avgPrice: "£130,000-£190,000",
    profile:
      "Across the Tyne from Newcastle. Affordable with strong regeneration (Sage Gateshead, Baltic). Metro access. Often overlooked — good value relative to Newcastle.",
    type: "High Yield",
  },
];

const typeBadge: Record<string, string> = {
  "High Yield": "bg-green-50 text-green-700",
  "Capital Growth": "bg-blue-50 text-blue-700",
  "Student/HMO": "bg-purple-50 text-purple-700",
  Balanced: "bg-navy-50 text-navy-600",
  Growth: "bg-orange-50 text-orange-700",
};

export default function NewcastlePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-white py-16 md:py-24">
        <div className="container-max px-4 max-w-3xl">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Areas", href: "/areas" },
              { label: "Newcastle" },
            ]}
          />
          <p className="text-xs font-semibold text-gold-500 uppercase tracking-widest mb-3 mt-6">
            Tyne and Wear
          </p>
          <h1
            className="text-4xl md:text-5xl font-extrabold text-navy-900 mb-6"
            style={{ fontFamily: "var(--font-family-heading)" }}
          >
            Newcastle Property Investment Guide
          </h1>
          <p className="text-lg text-navy-600 leading-relaxed">
            Newcastle upon Tyne is the capital of the North East and one of the
            UK's most affordable major cities for property investors. With two
            large universities, a growing tech and digital economy, a thriving
            cultural scene, and average prices significantly below the national
            average, it offers strong yields and improving capital growth
            prospects.
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
                £185k
              </p>
              <p className="text-sm text-navy-500 mt-1">Average price</p>
            </div>
            <div>
              <p
                className="text-3xl font-extrabold text-navy-900"
                style={{ fontFamily: "var(--font-family-heading)" }}
              >
                5–8%
              </p>
              <p className="text-sm text-navy-500 mt-1">Typical yield</p>
            </div>
            <div>
              <p
                className="text-3xl font-extrabold text-navy-900"
                style={{ fontFamily: "var(--font-family-heading)" }}
              >
                300,000
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
            Why invest in Newcastle?
          </h2>

          <div className="space-y-6 text-navy-700 leading-relaxed">
            <div>
              <p>
                <strong className="text-navy-900">Regeneration:</strong>{" "}
                Newcastle's East Pilgrim Street development is a £300m+
                mixed-use scheme transforming a key city centre site. Science
                Central is creating a new innovation quarter on the former
                Newcastle Brewery site. The Quayside — already a transformed
                waterfront — continues to attract investment. The North of Tyne
                Devolution Deal is funding significant economic and
                infrastructure investment across the region.
              </p>
            </div>
            <div>
              <p>
                <strong className="text-navy-900">Employment:</strong> Major
                employers include the NHS (Newcastle Hospitals, Northumbria
                Healthcare), Sage Group (global accounting software, HQ in
                Gateshead), HMRC, Procter &amp; Gamble, Newcastle City Council,
                and a growing cluster of fintech and digital companies including
                Atom Bank. The life sciences sector is expanding around
                Newcastle Helix.
              </p>
            </div>
            <div>
              <p>
                <strong className="text-navy-900">Universities:</strong>{" "}
                Newcastle University (Russell Group) and Northumbria University
                together enrol approximately 60,000 students. Student demand
                centres on Jesmond, Heaton, and Fenham, providing consistent
                HMO returns throughout the academic year.
              </p>
            </div>
            <div>
              <p>
                <strong className="text-navy-900">Transport:</strong> Newcastle
                Central station has direct trains to London King's Cross in just
                under 3 hours and excellent connections northward to Edinburgh.
                The Tyne and Wear Metro provides rapid connections across the
                conurbation from Gateshead to South Shields to the coast.
              </p>
            </div>
            <div>
              <p>
                <strong className="text-navy-900">Affordability:</strong>{" "}
                Average house prices of around £185,000 make Newcastle one of
                the most affordable large UK cities. Yield-focused investment
                properties in areas like Benwell or Walker can be purchased from
                £110,000–£160,000, enabling strong cash-on-cash returns.
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
            Newcastle investment areas
          </h2>
          <p className="text-navy-500 text-center mb-10">
            Key postcodes and their investment characteristics
          </p>
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
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${
                      typeBadge[area.type] ?? "bg-navy-50 text-navy-600"
                    }`}
                  >
                    {area.type}
                  </span>
                </div>
                <div className="flex gap-4">
                  <div>
                    <p className="text-xs text-navy-400">Yield</p>
                    <p className="font-semibold text-navy-900 text-sm">
                      {area.yield}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-navy-400">Avg price</p>
                    <p className="font-semibold text-navy-900 text-sm">
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
              Analyse any Newcastle deal for free
            </h2>
            <p className="text-white/60 text-sm mb-6">
              Run the numbers on rental yield, BRRR deals, HMO returns, stamp
              duty and more — all free, no sign-up required.
            </p>
            <Link href="/calculators" className="btn-gold">
              Browse all {siteMetrics.calculators} calculators
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
            Calculate your Newcastle returns
          </h2>
          <p className="text-navy-500 mb-8">
            Free tools to model your investment before you commit.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/calculators/rental-yield"
              className="bg-white rounded-xl p-5 border border-navy-100 hover:border-gold-400 transition-colors group"
            >
              <p className="font-semibold text-navy-900 group-hover:text-gold-600 transition-colors">
                Rental Yield Calculator
              </p>
              <p className="text-sm text-navy-500 mt-1">
                Gross and net yield from any Newcastle property
              </p>
            </Link>
            <Link
              href="/calculators/brrr"
              className="bg-white rounded-xl p-5 border border-navy-100 hover:border-gold-400 transition-colors group"
            >
              <p className="font-semibold text-navy-900 group-hover:text-gold-600 transition-colors">
                BRRR Calculator
              </p>
              <p className="text-sm text-navy-500 mt-1">
                Model refurb and refinance deals in Benwell or Walker
              </p>
            </Link>
            <Link
              href="/calculators/stamp-duty"
              className="bg-white rounded-xl p-5 border border-navy-100 hover:border-gold-400 transition-colors group"
            >
              <p className="font-semibold text-navy-900 group-hover:text-gold-600 transition-colors">
                Stamp Duty Calculator
              </p>
              <p className="text-sm text-navy-500 mt-1">
                SDLT costs for any Newcastle purchase price
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
            Newcastle sold prices
          </h2>
          <p className="text-navy-500 mb-6">
            Search recent sold prices across Newcastle postcodes.
          </p>
          <AreaSoldPricesWidget defaultPostcode="NE1 4GH" />
        </div>
      </section>

      {/* FAQ + Disclaimer */}
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
          <div className="mt-12">
            <DataProvenance area="Newcastle" />
            <Disclaimer />
          </div>
        </div>
      </section>
    </>
  );
}

