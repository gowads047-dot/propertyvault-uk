import Link from "next/link";
import type { Metadata } from "next";
import { Disclaimer } from "@/components/legal/Disclaimer";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { AreaSoldPricesWidget } from "@/components/ui/AreaSoldPricesWidget";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export const metadata: Metadata = {
  title: "Portsmouth Buy-to-Let Investment Guide | PropertyVault UK",
  description:
    "Complete Portsmouth property investment guide. Best areas for buy-to-let, average rental yields, house prices, regeneration zones, and free tools for investors.",
  keywords:
    "property investment Portsmouth, buy to let Portsmouth, rental yield Portsmouth, Portsmouth property prices, best areas to invest Portsmouth",
  openGraph: {
    title: "Portsmouth Buy-to-Let Investment Guide | PropertyVault UK",
    description: "Complete Portsmouth property investment guide. Best areas for buy-to-let, average rental yields, house prices, regeneration zones, and free tools for investors.",
    type: "article",
    url: "https://propertyvaultuk.co.uk/areas/portsmouth/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "Portsmouth Property Investment Guide" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Portsmouth Buy-to-Let Investment Guide | PropertyVault UK",
    description: "Complete Portsmouth property investment guide. Best areas for buy-to-let, average rental yields, house prices, regeneration zones, and free tools for investors.",
  },
};

const cityFaqs = [
  {
    q: "Is Portsmouth a good place to invest in property?",
    a: "Portsmouth offers consistent rental demand from an unusually stable employment base — Royal Navy personnel, BAE Systems, Carnival UK, and the university. Yields of 5-7% and prices around £250,000 make it a solid income investment. The Tipner development and Southsea seafront improvements support long-term capital growth.",
  },
  {
    q: "What is the average rental yield in Portsmouth?",
    a: "Gross rental yields in Portsmouth typically range from 5-7%. Affordable areas like Fratton and Landport achieve 6-7%. Popular areas like Southsea and Copnor offer 5-6%. Gosport across the harbour offers good yields at lower entry prices than comparable Portsmouth areas.",
  },
  {
    q: "What makes Portsmouth's rental market distinctive?",
    a: "Portsmouth's rental market is uniquely anchored by Royal Navy personnel. Service personnel on shore duty at HMNB Portsmouth need private rental accommodation and provide a reliable, high-quality tenant base. This military rental market is one of the most consistent in the UK, operating largely independently of the wider economic cycle.",
  },
  {
    q: "What is the average house price in Portsmouth?",
    a: "The average house price in Portsmouth is approximately £250,000. The most affordable areas for investors are Landport and Fratton from around £180,000-£200,000. Southsea properties typically start from £230,000+. Gosport across the harbour is often 10-15% cheaper than comparable Portsmouth areas.",
  },
  {
    q: "What is the Tipner development in Portsmouth?",
    a: "Tipner West is a major waterfront regeneration scheme on reclaimed land at the northern end of Portsea Island, with plans for 2,500 new homes, employment space, and waterfront amenities. It is one of Portsmouth's most significant development projects and is expected to improve connectivity and values in the northern parts of the city.",
  },
];

const areas = [
  {
    name: "Copnor",
    postcode: "PO3",
    yield: "5-7%",
    avgPrice: "£200,000-£270,000",
    profile:
      "Central Portsea Island. Popular suburb. Good transport links. Mix of family and professional tenants. Solid BTL market with consistent demand.",
    type: "Balanced",
  },
  {
    name: "Fratton",
    postcode: "PO1/PO4",
    yield: "6-7%",
    avgPrice: "£190,000-£260,000",
    profile:
      "Near Fratton Park (Pompey FC). Affordable terraced housing. Strong working and naval community rental demand. Value investment with good yields.",
    type: "High Yield",
  },
  {
    name: "Landport",
    postcode: "PO1",
    yield: "6-7%",
    avgPrice: "£180,000-£250,000",
    profile:
      "City centre adjacent. Near University of Portsmouth. Mix of student and young professional tenants. Affordable entry with strong demand.",
    type: "High Yield",
  },
  {
    name: "Southsea",
    postcode: "PO4/PO5",
    yield: "5-6%",
    avgPrice: "£230,000-£320,000",
    profile:
      "Seaside Portsmouth. Popular with young professionals and retirees. Good cafes, bars, and seafront. Strong rental demand and capital growth.",
    type: "Balanced",
  },
  {
    name: "Milton",
    postcode: "PO4",
    yield: "5-6%",
    avgPrice: "£220,000-£300,000",
    profile:
      "East Portsmouth. Popular family suburb. Good schools. Mix of semi-detached and terraced homes. Consistent long-term rental demand.",
    type: "Balanced",
  },
  {
    name: "North End",
    postcode: "PO2",
    yield: "5-7%",
    avgPrice: "£200,000-£270,000",
    profile:
      "North Portsmouth. Good bus connections. Mix of professional and working tenants. Affordable terraced stock. Consistent rental market.",
    type: "Balanced",
  },
  {
    name: "Hilsea",
    postcode: "PO3",
    yield: "5-6%",
    avgPrice: "£210,000-£280,000",
    profile:
      "Near motorway junction. Commuter demand for Southampton and Hampshire corridor. Industrial employment nearby. Reliable rental income.",
    type: "Balanced",
  },
  {
    name: "Gosport",
    postcode: "PO12/PO13",
    yield: "5-7%",
    avgPrice: "£200,000-£270,000",
    profile:
      "Across Portsmouth Harbour. MOD and Solent employment. Significantly more affordable than comparable Portsmouth areas. Ferry access to city.",
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

export default function PortsmouthPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-white py-16 md:py-24">
        <div className="container-max px-4 max-w-3xl">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Investment Areas", href: "/areas" },
              { label: "Portsmouth" },
            ]}
          />
          <p className="text-xs font-semibold text-gold-500 uppercase tracking-widest mb-3 mt-6">
            South East England
          </p>
          <h1
            className="text-4xl md:text-5xl font-extrabold text-navy-900 mb-6"
            style={{ fontFamily: "var(--font-family-heading)" }}
          >
            Portsmouth Property Investment Guide
          </h1>
          <p className="text-lg text-navy-600 leading-relaxed">
            Portsmouth is the UK&apos;s only island city — a compact, dense urban
            environment on Portsea Island with one of the UK&apos;s longest property
            investment track records. Anchored by the Royal Navy, BAE Systems,
            Carnival UK, and the University of Portsmouth, it offers consistent
            rental demand from military, defence, and student tenants.
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
                £250k
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
                215,000
              </p>
              <p className="text-sm text-navy-500 mt-1">Population</p>
            </div>
            <div>
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
            Why invest in Portsmouth?
          </h2>

          <div className="space-y-6 text-navy-700 leading-relaxed">
            <div>
              <p>
                <strong className="text-navy-900">Employment:</strong>{" "}
                Portsmouth has one of the most distinctive employment bases in
                the UK. The Royal Navy (HMNB Portsmouth) is the city&apos;s largest
                employer — thousands of naval personnel are based in Portsmouth,
                creating a permanent rental market. BAE Systems Surface Ships
                (major warship manufacturer) employs thousands in shipbuilding
                and engineering. Carnival UK (P&amp;O Cruises, Cunard) has its
                global HQ in Southampton, close to Portsmouth. The city also has
                growing tech and digital employment.
              </p>
            </div>

            <div>
              <p>
                <strong className="text-navy-900">Regeneration:</strong> The
                Tipner West development will create 2,500 new homes and
                significant employment on reclaimed waterfront land north of the
                city. The City Centre North development and Southsea Seafront
                regeneration (completed seafront improvements) are enhancing the
                residential appeal of the city centre and seaside areas. The
                Hard Interchange improvement has improved transport
                connectivity.
              </p>
            </div>

            <div>
              <p>
                <strong className="text-navy-900">Universities:</strong> The
                University of Portsmouth (~25,000 students, including offshore)
                creates significant student rental demand, particularly around
                Landport and the city centre. International student numbers
                continue to grow, supporting year-round rental demand.
              </p>
            </div>

            <div>
              <p>
                <strong className="text-navy-900">Transport:</strong> Portsmouth
                Harbour and Portsmouth &amp; Southsea stations have direct trains
                to London Waterloo in under 1 hour 30 minutes. The M27
                motorway connects Portsmouth to Southampton and beyond. Car
                ferry services to the Isle of Wight, France, and Spain operate
                from the Historic Dockyard and Gunwharf Quays.
              </p>
            </div>

            <div>
              <p>
                <strong className="text-navy-900">Affordability:</strong>{" "}
                Average prices around £250,000 are significantly below nearby
                Winchester and Chichester, and comparable to Southampton, while
                Portsmouth&apos;s island geography and military employment base
                provide a distinctive and stable rental market.
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
            Best areas to invest in Portsmouth
          </h2>
          <p className="text-navy-500 text-center mb-10">
            Key postcodes and neighbourhoods for buy-to-let investors.
          </p>

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
              Analyse any Portsmouth deal for free
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

      {/* Calculators */}
      <section className="bg-navy-50 section-padding">
        <div className="container-max px-4 max-w-3xl">
          <h2
            className="text-2xl font-extrabold text-navy-900 mb-6"
            style={{ fontFamily: "var(--font-family-heading)" }}
          >
            Portsmouth investment calculators
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/calculators/rental-yield"
              className="bg-white rounded-xl p-5 border border-navy-100 shadow-sm hover:shadow-md transition group"
            >
              <p className="font-bold text-navy-900 group-hover:text-gold-600 transition">
                Rental Yield Calculator
              </p>
              <p className="text-sm text-navy-500 mt-1">
                Gross and net yield on any Portsmouth property.
              </p>
            </Link>
            <Link
              href="/calculators/stamp-duty"
              className="bg-white rounded-xl p-5 border border-navy-100 shadow-sm hover:shadow-md transition group"
            >
              <p className="font-bold text-navy-900 group-hover:text-gold-600 transition">
                Stamp Duty Calculator
              </p>
              <p className="text-sm text-navy-500 mt-1">
                SDLT costs including additional dwelling surcharge.
              </p>
            </Link>
            <Link
              href="/calculators/brrr"
              className="bg-white rounded-xl p-5 border border-navy-100 shadow-sm hover:shadow-md transition group"
            >
              <p className="font-bold text-navy-900 group-hover:text-gold-600 transition">
                BRRR Calculator
              </p>
              <p className="text-sm text-navy-500 mt-1">
                Model buy, refurbish, refinance, rent returns.
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
            Portsmouth sold prices
          </h2>
          <p className="text-navy-500 text-sm mb-6">
            Search recent sold prices across Portsmouth postcodes.
          </p>
          <AreaSoldPricesWidget defaultPostcode="PO1 2GN" />
        </div>
      </section>

      {/* FAQs + Disclaimer */}
      <section className="bg-navy-50 section-padding">
        <div className="container-max px-4 max-w-3xl">
          <h2
            className="text-2xl font-extrabold text-navy-900 mb-8"
            style={{ fontFamily: "var(--font-family-heading)" }}
          >
            Portsmouth property investment — FAQs
          </h2>

          <div className="space-y-6">
            {cityFaqs.map((faq) => (
              <div key={faq.q}>
                <h3 className="font-bold text-navy-900 mb-2">{faq.q}</h3>
                <p className="text-navy-600 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <Disclaimer />
          </div>
        </div>
      </section>

      <FAQSchema faqs={cityFaqs} />
    </>
  );
}

