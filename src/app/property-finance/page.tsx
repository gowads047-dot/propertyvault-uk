import Link from "next/link";
import type { Metadata } from "next";
import { Disclaimer } from "@/components/legal/Disclaimer";

export const metadata: Metadata = {
  title: "Property Finance UK — Funding Your Investment",
  description: "Complete guide to UK property finance. Mortgages, bridging, development finance, JVs, private lending, and creative funding strategies.",
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/property-finance/" },
  openGraph: {
    title: "Property Finance UK — Funding Your Investment",
    description: "Complete guide to UK property finance. Mortgages, bridging, development finance, JVs, private lending, and creative funding strategies.",
    type: "article",
    url: "https://www.propertyvaultuk.co.uk/property-finance/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "UK Property Finance Guide" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Property Finance UK — Funding Your Investment",
    description: "Complete guide to UK property finance. Mortgages, bridging, development finance, JVs, private lending, and creative funding strategies.",
  },
};

export default function PropertyFinancePage() {
  return (
    <>
      <section className="gradient-navy py-16 md:py-24">
        <div className="container-max px-4 max-w-3xl">
          <p className="text-gold-400 font-semibold text-sm uppercase tracking-wider mb-3">Finance Guide</p>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Property Finance</h1>
          <p className="text-navy-200 text-lg">Understanding your finance options is the key to scaling. Learn about mortgages, bridging, development finance, joint ventures, and creative funding strategies.</p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max max-w-4xl space-y-10">
          <div>
            <h2 className="text-2xl font-bold text-navy-800 mb-4">Finance Options for Property Investors</h2>
            <div className="space-y-4">
              {[
                { title: "Traditional Mortgages", desc: "Standard BTL and residential mortgages from high-street and specialist lenders. 75-85% LTV, assessed on rental income or personal income. The most common starting point.", href: "/mortgages" },
                { title: "Bridging Finance", desc: "Short-term loans (3-18 months) for speed. Ideal for auction purchases, refurbishment projects, and chain-break situations. Higher cost but faster completion.", href: "/mortgages" },
                { title: "Development Finance", desc: "Staged funding for ground-up builds and major conversions. Covers land purchase and construction costs, released in tranches against a QS schedule.", href: "/mortgages" },
                { title: "Joint Ventures", desc: "Partner with others — one provides capital, the other provides time/expertise. Structure via a JV agreement with clear roles, profit split, and exit terms." },
                { title: "Private Lending", desc: "Borrow from private individuals (friends, family, investors) who want better returns than savings accounts. Secured against property with a legal charge." },
                { title: "Pension-Backed Lending (SSAS/SIPP)", desc: "Certain pension structures can lend to connected parties for commercial property purchases. Complex but powerful for long-term investors." },
              ].map((f) => (
                <div key={f.title} className="bg-navy-50 rounded-xl p-5">
                  <h3 className="font-bold text-navy-800 mb-1">{f.title}</h3>
                  <p className="text-sm text-navy-600 mb-2">{f.desc}</p>
                  {f.href && <Link href={f.href} className="text-gold-600 text-sm font-semibold">Learn more →</Link>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="section-padding bg-navy-50">
        <div className="container-max max-w-4xl">
          <Disclaimer type="general" />
        </div>
      </section>
    </>
  );
}


