import Link from "next/link";
import type { Metadata } from "next";
import { Disclaimer } from "@/components/legal/Disclaimer";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { AreaSoldPricesWidget } from "@/components/ui/AreaSoldPricesWidget";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export const metadata: Metadata = {
  title: "Stoke-on-Trent Buy-to-Let Investment Guide | PropertyVault UK",
  description:
    "Complete Stoke-on-Trent property investment guide. Best areas for buy-to-let, average rental yields, house prices, regeneration zones, and free tools for investors.",
  keywords:
    "property investment Stoke-on-Trent, buy to let Stoke-on-Trent, rental yield Stoke-on-Trent, Stoke-on-Trent property prices, best areas to invest Stoke-on-Trent",
  openGraph: {
    title: "Stoke-on-Trent Buy-to-Let Investment Guide | PropertyVault UK",
    description: "Complete Stoke-on-Trent property investment guide. Best areas for buy-to-let, average rental yields, house prices, regeneration zones, and free tools for investors.",
    type: "article",
    url: "https://propertyvaultuk.co.uk/areas/stoke-on-trent/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "Stoke-on-Trent Property Investment Guide" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Stoke-on-Trent Buy-to-Let Investment Guide | PropertyVault UK",
    description: "Complete Stoke-on-Trent property investment guide. Best areas for buy-to-let, average rental yields, house prices, regeneration zones, and free tools for investors.",
  },
};

const cityFaqs = [
  {
    q: "Is Stoke-on-Trent a good place to invest in property?",
    a: "Stoke offers some of the highest rental yields in England — typically 7-10% — with entry prices starting below £100,000. The presence of bet365 (4,000+ employees), Michelin, the Smithfield regeneration, and the Ceramic Valley Enterprise Zone give it stronger economic foundations than its affordable price tag might suggest.",
  },
  {
    q: "What is the average rental yield in Stoke-on-Trent?",
    a: "Gross rental yields in Stoke-on-Trent typically range from 7-10%, among the highest of any UK city. Shelton (near the university) and Burslem can achieve 8-10% for well-managed HMOs. Even standard BTL terraced houses in most Six Towns locations achieve 7-9%.",
  },
  {
    q: "What are the best areas in Stoke for buy-to-let?",
    a: "For maximum yield: Shelton, Burslem, Tunstall. For regeneration growth: Hanley (Smithfield area). For standard BTL: Fenton, Longton, Stoke. For families: Blurton. For BRRR: Burslem has the best combination of low entry prices and refurb potential.",
  },
  {
    q: "What is the average house price in Stoke-on-Trent?",
    a: "The average house price in Stoke-on-Trent is approximately £145,000 — one of England's lowest. Investment properties in areas like Shelton, Burslem, or Tunstall start from £90,000-£110,000, making Stoke one of the few UK cities where property investment remains viable at under £100,000.",
  },
  {
    q: "What is the Ceramic Valley Enterprise Zone?",
    a: "The Ceramic Valley Enterprise Zone covers six sites in the Stoke-on-Trent area, offering business rates relief and infrastructure investment to attract companies in manufacturing, logistics, and technology. It is part of the broader effort to attract new employment to the city and supports the long-term rental demand narrative for investors.",
  },
];

const areas = [
  {
    name: "Fenton",
    postcode: "ST4",
    yield: "7-9%",
    avgPrice: "£100,000-£145,000",
    profile:
      "Central Six Towns location. Affordable terraced housing. Strong rental demand. Good transport links. Classic Stoke BTL market.",
    type: "High Yield",
  },
  {
    name: "Longton",
    postcode: "ST3",
    yield: "7-9%",
    avgPrice: "£100,000-£145,000",
    profile:
      "South Stoke. Affordable. Strong rental demand from local workers. Established lettings market with consistent cash flow.",
    type: "High Yield",
  },
  {
    name: "Burslem",
    postcode: "ST6",
    yield: "7-9%",
    avgPrice: "£95,000-£140,000",
    profile:
      "Mother Town of The Potteries. Creative district with independent arts scene. Very affordable. High yields. Growing interest from investors.",
    type: "High Yield",
  },
  {
    name: "Hanley",
    postcode: "ST1",
    yield: "6-9%",
    avgPrice: "£110,000-£160,000",
    profile:
      "City centre. Smithfield regeneration underway. Mix of apartments and terraced housing. Growing professional demand as city centre improves.",
    type: "Growth",
  },
  {
    name: "Shelton",
    postcode: "ST4",
    yield: "7-10%",
    avgPrice: "£90,000-£140,000",
    profile:
      "Near Staffordshire University campus. Student and young professional demand. Some of city's highest yields. Affordable entry prices.",
    type: "Student/HMO",
  },
  {
    name: "Stoke",
    postcode: "ST4",
    yield: "7-9%",
    avgPrice: "£100,000-£145,000",
    profile:
      "Original railway town area. Professional tenant market. Good train station access to Birmingham and Manchester. Consistent demand.",
    type: "High Yield",
  },
  {
    name: "Tunstall",
    postcode: "ST6",
    yield: "7-9%",
    avgPrice: "£95,000-£140,000",
    profile:
      "Northernmost of the Six Towns. Very affordable. High yields. Ceramic Valley Enterprise Zone nearby. Consistent rental demand from local workers.",
    type: "High Yield",
  },
  {
    name: "Blurton",
    postcode: "ST3",
    yield: "6-8%",
    avgPrice: "£120,000-£165,000",
    profile:
      "Suburban south Stoke. Family rental demand. Quieter character than the city centre towns. Reliable long-term rental market.",
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

export default function StokeonTrentPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-white py-16 md:py-24">
        <div className="container-max px-4 max-w-3xl">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Areas", href: "/areas" },
              { label: "Stoke-on-Trent" },
            ]}
          />
          <p className="text-xs font-semibold text-gold-500 uppercase tracking-widest mb-3 mt-6">
            Staffordshire
          </p>
          <h1
            className="text-4xl md:text-5xl font-extrabold text-navy-900 mb-6"
            style={{ fontFamily: "var(--font-family-heading)" }}
          >
            Stoke-on-Trent Property Investment Guide
          </h1>
          <p className="text-lg text-navy-600 leading-relaxed">
            Stoke-on-Trent consistently offers some of the highest rental yields
            in England, with entry prices from as low as £90,000-£120,000 in
            some areas. The home of bet365, Michelin, and Steelite, and
            benefiting from the Smithfield regeneration project and Ceramic
            Valley Enterprise Zone, it is an exceptional market for
            cash-flow-focused property investors.
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
                £145k
              </p>
              <p className="text-sm text-navy-500 mt-1">Average price</p>
            </div>
            <div>
              <p
                className="text-3xl font-extrabold text-navy-900"
                style={{ fontFamily: "var(--font-family-heading)" }}
              >
                7-10%
              </p>
              <p className="text-sm text-navy-500 mt-1">Typical yield</p>
            </div>
            <div>
              <p
                className="text-3xl font-extrabold text-navy-900"
                style={{ fontFamily: "var(--font-family-heading)" }}
              >
                280,000
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
            Why invest in Stoke-on-Trent property?
          </h2>

          <div className="space-y-6 text-navy-600 leading-relaxed">
            <p>
              <strong className="text-navy-800">Regeneration:</strong> The
              Smithfield development in Hanley is the centrepiece of Stoke&apos;s
              regeneration — a mixed-use scheme bringing a new bus station,
              retail, office space, and residential development to the city
              centre. The Ceramic Valley Enterprise Zone covers six sites across
              the Potteries, providing business rates relief and infrastructure
              investment to attract manufacturing and logistics companies. Stoke
              was granted Levelling Up funds for further investment.
            </p>

            <p>
              <strong className="text-navy-800">Employment:</strong> Major
              employers include bet365 (technology company HQ, 4,000+
              employees), Michelin (tyre manufacturing, 3,000+ employees),
              Steelite International (hospitality ceramics), Synectics
              (surveillance technology), NHS (University Hospitals of North
              Midlands), and a growing logistics and distribution sector
              benefiting from excellent motorway access.
            </p>

            <p>
              <strong className="text-navy-800">Universities:</strong> Keele
              University (ranked highly for student satisfaction) and
              Staffordshire University together bring approximately 26,000
              students. Staffordshire University&apos;s Stoke campus near Shelton
              drives significant student rental demand. Keele&apos;s beautiful campus
              in nearby Newcastle-under-Lyme also sustains rental demand.
            </p>

            <p>
              <strong className="text-navy-800">Transport:</strong>{" "}
              Stoke-on-Trent station has direct trains to London Euston in 1
              hour 45 minutes, to Manchester in 45 minutes, and to Birmingham in
              40 minutes. The M6 motorway runs through the city, providing
              excellent road access to the national network.
            </p>

            <p>
              <strong className="text-navy-800">Affordability:</strong>{" "}
              Stoke-on-Trent is one of the most affordable cities in England.
              Investment properties start from around £90,000-£120,000 in areas
              like Burslem and Tunstall, while the yield potential of 7-10%
              means cash flows are strong even with mortgage finance.
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
            Best areas to invest in Stoke-on-Trent
          </h2>
          <p className="text-navy-500 text-center mb-10">
            Key sub-markets across The Potteries for buy-to-let investors
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
                    className={`text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap ${getTypeBadgeClass(area.type)}`}
                  >
                    {area.type}
                  </span>
                </div>
                <div className="flex gap-4">
                  <div>
                    <p className="text-xs text-navy-400">Yield</p>
                    <p className="font-bold text-navy-800">{area.yield}</p>
                  </div>
                  <div>
                    <p className="text-xs text-navy-400">Avg price</p>
                    <p className="font-bold text-navy-800">{area.avgPrice}</p>
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
              Analyse any Stoke-on-Trent deal for free
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
            Free calculators for Stoke-on-Trent investors
          </h2>
          <p className="text-navy-500 mb-8">
            Instantly model any deal before you commit.
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
                Gross and net yield in seconds
              </p>
            </Link>
            <Link
              href="/calculators/brrr"
              className="bg-white rounded-xl p-5 border border-navy-100 hover:border-gold-400 transition-colors group"
            >
              <p className="font-bold text-navy-900 group-hover:text-gold-600 transition-colors">
                BRRR Calculator
              </p>
              <p className="text-sm text-navy-500 mt-1">
                Model refurb and refinance returns
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
                Including the 5% surcharge
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
            Recent sold prices in Stoke-on-Trent
          </h2>
          <p className="text-navy-500 mb-8">
            Search any postcode to see what properties have actually sold for.
          </p>
          <AreaSoldPricesWidget defaultPostcode="ST1 1RQ" />
        </div>
      </section>

      {/* FAQs + Disclaimer */}
      <section className="bg-navy-50 section-padding">
        <div className="container-max px-4 max-w-3xl">
          <h2
            className="text-2xl font-extrabold text-navy-900 mb-8"
            style={{ fontFamily: "var(--font-family-heading)" }}
          >
            Stoke-on-Trent property investment — FAQs
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
            <Disclaimer />
          </div>
        </div>
      </section>
    </>
  );
}

