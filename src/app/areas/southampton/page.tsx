import Link from "next/link";
import type { Metadata } from "next";
import { Disclaimer } from "@/components/legal/Disclaimer";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { AreaSoldPricesWidget } from "@/components/ui/AreaSoldPricesWidget";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export const metadata: Metadata = {
  title: "Southampton Buy-to-Let Investment Guide | PropertyVault UK",
  description:
    "Complete Southampton property investment guide. Best areas for buy-to-let, average rental yields, house prices, regeneration zones, and free tools for investors.",
  keywords:
    "property investment Southampton, buy to let Southampton, rental yield Southampton, Southampton property prices, best areas to invest Southampton",
  openGraph: {
    title: "Southampton Buy-to-Let Investment Guide | PropertyVault UK",
    description: "Complete Southampton property investment guide. Best areas for buy-to-let, average rental yields, house prices, regeneration zones, and free tools for investors.",
    type: "article",
    url: "https://www.propertyvaultuk.co.uk/areas/southampton/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "Southampton Property Investment Guide" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Southampton Buy-to-Let Investment Guide | PropertyVault UK",
    description: "Complete Southampton property investment guide. Best areas for buy-to-let, average rental yields, house prices, regeneration zones, and free tools for investors.",
  },
};

const cityFaqs = [
  {
    q: "Is Southampton a good place to invest in property?",
    a: "Southampton offers a strong combination of diverse employment (port, Carnival UK, BAE Systems, Ordnance Survey, MOD), two universities, and prices below comparable South Coast cities. Yields of 4-6% with student areas hitting 6-7% make it a solid income investment, while the South Hampshire growth corridor supports long-term capital growth.",
  },
  {
    q: "What is the average rental yield in Southampton?",
    a: "Gross rental yields in Southampton typically range from 4-6%. Student areas like Portswood achieve 6-7% for HMOs. Areas close to the city centre and docks like Northam offer 5-7%. Suburban family areas like Bitterne offer 4-5% with more stable long-term tenancies.",
  },
  {
    q: "What are the best areas in Southampton for buy-to-let?",
    a: "For student HMOs: Portswood (near UoS). For yield: Northam, Shirley. For professionals: St Denys, Freemantle. For families: Bitterne, Lordshill. For long-term growth: Woolston (riverside regeneration potential).",
  },
  {
    q: "What is the average house price in Southampton?",
    a: "The average house price in Southampton is approximately £265,000. Student HMO properties in Portswood start from around £200,000. Suburban family homes in Bitterne or Lordshill range from £240,000-£320,000. Southampton is significantly more affordable than nearby Winchester and Bournemouth.",
  },
  {
    q: "What employment drives rental demand in Southampton?",
    a: "Southampton's rental demand is driven by its diverse employment base: the Port of Southampton (UK's largest cruise port), Carnival UK (P&O, Cunard HQ), BAE Systems Surface Ships, Ordnance Survey HQ, the MOD, and two major universities (45,000 students). This broad base means Southampton's rental market is resilient across economic cycles.",
  },
];

const areas = [
  {
    name: "Portswood",
    postcode: "SO17",
    yield: "6-7%",
    avgPrice: "£200,000-£280,000",
    profile:
      "Primary student area near UoS. Excellent for HMOs. Portswood High Street has shops and cafes. Consistent year-round demand from students and young professionals.",
    type: "Student/HMO",
  },
  {
    name: "Shirley",
    postcode: "SO15",
    yield: "5-6%",
    avgPrice: "£220,000-£300,000",
    profile:
      "Popular west Southampton suburb. Good transport. Mix of families and professionals. Shirley High Street amenities. Consistent rental demand.",
    type: "Balanced",
  },
  {
    name: "Freemantle",
    postcode: "SO15",
    yield: "5-6%",
    avgPrice: "£230,000-£310,000",
    profile:
      "West of city centre. Victorian terraces. Professional tenant base. Close to Shirley and city centre. Reliable long-term rental market.",
    type: "Balanced",
  },
  {
    name: "Northam",
    postcode: "SO14",
    yield: "5-7%",
    avgPrice: "£200,000-£270,000",
    profile:
      "Close to city centre and docks. Improving area. Mix of professional and working tenants. Growing demand from city centre workforce.",
    type: "High Yield",
  },
  {
    name: "St Denys",
    postcode: "SO17",
    yield: "5-6%",
    avgPrice: "£230,000-£300,000",
    profile:
      "Between Portswood and city centre. Train station access. Popular with young professionals and postgraduates. Consistent strong demand.",
    type: "Balanced",
  },
  {
    name: "Bitterne",
    postcode: "SO18/SO19",
    yield: "4-6%",
    avgPrice: "£240,000-£320,000",
    profile:
      "Suburban east Southampton. Family demand. Good schools. Steady rental market. Bitterne Road amenities. Good long-term investment.",
    type: "Balanced",
  },
  {
    name: "Woolston",
    postcode: "SO19",
    yield: "5-6%",
    avgPrice: "£230,000-£300,000",
    profile:
      "East Southampton riverside. Improving steadily. Woolston waterfront has development potential. Professional and family rental demand.",
    type: "Balanced",
  },
  {
    name: "Lordshill",
    postcode: "SO16",
    yield: "5-6%",
    avgPrice: "£220,000-£290,000",
    profile:
      "North-west Southampton. Affordable. Good access to motorways. Mix of family and professional tenants. Consistent demand from port and MOD workers.",
    type: "Balanced",
  },
];

const typeBadge: Record<string, string> = {
  "High Yield": "bg-green-50 text-green-700",
  "Capital Growth": "bg-blue-50 text-blue-700",
  "Student/HMO": "bg-purple-50 text-purple-700",
  Balanced: "bg-navy-50 text-navy-600",
  Growth: "bg-orange-50 text-orange-700",
};

export default function SouthamptonPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-white py-16 md:py-24">
        <div className="container-max px-4 max-w-3xl">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Area guides", href: "/areas" },
              { label: "Southampton" },
            ]}
          />
          <p className="text-xs font-semibold text-gold-500 uppercase tracking-widest mb-3 mt-6">
            South East England
          </p>
          <h1
            className="text-4xl md:text-5xl font-extrabold text-navy-900 mb-6"
            style={{ fontFamily: "var(--font-family-heading)" }}
          >
            Southampton property investment guide
          </h1>
          <p className="text-navy-600 text-lg leading-relaxed">
            Southampton is a major South of England city with the UK's largest
            cruise port, two universities, significant MOD and defence
            employment, and a strong professional tenant market. Prices remain
            well below nearby Winchester and Bournemouth while benefiting from
            the same South Hampshire economic corridor.
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
                £265k
              </p>
              <p className="text-sm text-navy-500 mt-1">Average price</p>
            </div>
            <div>
              <p
                className="text-3xl font-extrabold text-navy-900"
                style={{ fontFamily: "var(--font-family-heading)" }}
              >
                4–6%
              </p>
              <p className="text-sm text-navy-500 mt-1">Typical yield</p>
            </div>
            <div>
              <p
                className="text-3xl font-extrabold text-navy-900"
                style={{ fontFamily: "var(--font-family-heading)" }}
              >
                270,000
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

      {/* Why invest */}
      <section className="bg-white section-padding">
        <div className="container-max px-4 max-w-3xl">
          <h2
            className="text-3xl font-extrabold text-navy-900 mb-8"
            style={{ fontFamily: "var(--font-family-heading)" }}
          >
            Why invest in Southampton property?
          </h2>

          <div className="space-y-6 text-navy-600 leading-relaxed">
            <div>
              <p>
                <strong className="text-navy-900">Employment:</strong>{" "}
                Southampton has an exceptionally diverse employment base. The
                Port of Southampton is the UK's largest cruise port and a major
                container terminal, employing thousands directly through ABP.
                Carnival UK (P&O Cruises and Cunard) has its global HQ in
                Southampton. BAE Systems Surface Ships, Ordnance Survey (HQ),
                the MOD, and a growing tech and digital sector all employ
                significant numbers of professionals.
              </p>
            </div>
            <div>
              <p>
                <strong className="text-navy-900">Regeneration:</strong> The
                Watermark West Quay extension and wider Bargate Quarter
                regeneration are transforming the city centre retail and leisure
                offer. The Cultural Quarter along the northern ring road is
                developing new arts, music, and residential spaces. The South
                Hampshire growth corridor is driving new infrastructure
                investment.
              </p>
            </div>
            <div>
              <p>
                <strong className="text-navy-900">Universities:</strong> The
                University of Southampton (Russell Group, world-leading in
                engineering, oceanography, and electronics) and Solent
                University together attract approximately 45,000 students.
                Portswood is the primary student neighbourhood, with strong
                year-round demand for houses and HMOs.
              </p>
            </div>
            <div>
              <p>
                <strong className="text-navy-900">Transport:</strong> Southampton
                Central station has direct services to London Waterloo in under
                1 hour 15 minutes. The M3 and M27 motorways connect Southampton
                to London, the New Forest, and Portsmouth. Southampton Airport
                connects to European destinations.
              </p>
            </div>
            <div>
              <p>
                <strong className="text-navy-900">Affordability:</strong>{" "}
                Average prices around £265,000 are significantly below
                Winchester (£450,000+) and Bournemouth (£320,000+), while
                Southampton benefits from the same South Hampshire economy. This
                relative affordability drives rental demand from workers who
                prefer to live in Southampton while working across the region.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Area breakdown */}
      <section className="bg-navy-50 section-padding">
        <div className="container-max px-4">
          <h2
            className="text-3xl font-extrabold text-navy-900 mb-8 text-center"
            style={{ fontFamily: "var(--font-family-heading)" }}
          >
            Best areas for buy-to-let in Southampton
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {areas.map((area) => (
              <div
                key={area.name}
                className="bg-white rounded-2xl p-6 shadow-sm border border-navy-100 flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-navy-900 text-lg">
                      {area.name}
                    </h3>
                    <p className="text-xs text-navy-400">{area.postcode}</p>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap ${
                      typeBadge[area.type] ?? "bg-navy-50 text-navy-600"
                    }`}
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
              Analyse any Southampton deal for free
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
            Free calculators for Southampton investors
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/calculators/rental-yield"
              className="bg-white rounded-xl p-5 border border-navy-100 hover:border-gold-400 transition-colors text-center group"
            >
              <p className="font-bold text-navy-900 group-hover:text-gold-600 transition-colors">
                Rental yield calculator
              </p>
              <p className="text-xs text-navy-500 mt-1">
                Gross and net yield in seconds
              </p>
            </Link>
            <Link
              href="/calculators/stamp-duty"
              className="bg-white rounded-xl p-5 border border-navy-100 hover:border-gold-400 transition-colors text-center group"
            >
              <p className="font-bold text-navy-900 group-hover:text-gold-600 transition-colors">
                Stamp duty calculator
              </p>
              <p className="text-xs text-navy-500 mt-1">
                SDLT including surcharge
              </p>
            </Link>
            <Link
              href="/calculators/hmo-yield"
              className="bg-white rounded-xl p-5 border border-navy-100 hover:border-gold-400 transition-colors text-center group"
            >
              <p className="font-bold text-navy-900 group-hover:text-gold-600 transition-colors">
                HMO ROI calculator
              </p>
              <p className="text-xs text-navy-500 mt-1">
                Model room-by-room returns
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Sold prices widget */}
      <section className="bg-white section-padding">
        <div className="container-max px-4 max-w-3xl">
          <h2
            className="text-2xl font-extrabold text-navy-900 mb-6"
            style={{ fontFamily: "var(--font-family-heading)" }}
          >
            Southampton sold prices
          </h2>
          <AreaSoldPricesWidget defaultPostcode="SO14 2PG" />
        </div>
      </section>

      {/* FAQSchema + Disclaimer */}
      <section className="bg-navy-50 section-padding">
        <div className="container-max px-4 max-w-3xl">
          <h2
            className="text-2xl font-extrabold text-navy-900 mb-8"
            style={{ fontFamily: "var(--font-family-heading)" }}
          >
            Southampton property investment FAQs
          </h2>
          <div className="space-y-6">
            {cityFaqs.map((faq) => (
              <div key={faq.q}>
                <h3 className="font-bold text-navy-900 mb-2">{faq.q}</h3>
                <p className="text-navy-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <Disclaimer />
          </div>
        </div>
      </section>

      <FAQSchema faqs={cityFaqs} />
    </>
  );
}

