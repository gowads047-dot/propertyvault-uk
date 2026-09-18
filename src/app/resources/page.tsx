import type { Metadata } from "next";
import Link from "@/components/ui/Link";

export const metadata: Metadata = {
  title: "Free Property Resources — Calculators, Checklists & Guides",
  description: "Free property investment resources you can use now: BRRR and cash flow calculators, due diligence and compliance checklists, and the first-time buyer guide.",
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/resources/" },
  openGraph: {
    title: "Free Property Resources — Calculators, Checklists & Guides",
    description: "Free property investment resources you can use now: BRRR and cash flow calculators, due diligence and compliance checklists, and the first-time buyer guide.",
    type: "website",
    url: "https://www.propertyvaultuk.co.uk/resources/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image/", width: 1200, height: 630, alt: "PropertyVault UK Resources" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Property Resources — Calculators, Checklists & Guides",
    description: "Free property investment resources you can use now: BRRR and cash flow calculators, due diligence and compliance checklists, and the first-time buyer guide.",
  },
};

/**
 * Every entry is a page on this site. The previous list promised ten
 * downloads — spreadsheets and PDFs — behind a "Download Free" button with
 * no handler and an email gate with no form. None of the files existed.
 * Seven of the ten have a working equivalent here; those link to it. The
 * other three (development appraisal, mortgage comparison tracker,
 * portfolio tracker) do not, and are not listed until they do.
 */
const resources = [
  { title: "BRRR Deal Analyser", desc: "Model any BRRR deal — purchase, refurb, rent, refinance — with ROI and the cash left in.", category: "Calculator", href: "/calculators/brrr" },
  { title: "Property Due Diligence Checklist", desc: "Legal, structural, financial and compliance checks before you buy. Tick it off on screen or print it.", category: "Checklist", href: "/templates/due-diligence" },
  { title: "Landlord Compliance Checklist", desc: "Every legal requirement for an English landlord in one place — gas, electrical, EPC, deposit, and the rest.", category: "Checklist", href: "/templates/landlord-compliance" },
  { title: "Rental Property Cash Flow", desc: "Monthly and annual cash flow for a single let: income, costs, mortgage, and what is left.", category: "Calculator", href: "/calculators/monthly-cashflow" },
  { title: "HMO Management Log", desc: "The running record an HMO licence expects you to keep — inspections, certificates, tenants and incidents.", category: "Template", href: "/templates/hmo-management-log" },
  { title: "Property Viewing Checklist", desc: "What to check at a viewing: condition, location, and the problems that cost money later.", category: "Checklist", href: "/templates/viewing-checklist" },
  { title: "First-Time Buyer Guide", desc: "The whole process, from saving a deposit to getting the keys, in order.", category: "Guide", href: "/first-time-buyer" },
];

export default function ResourcesPage() {
  return (
    <>
      <section className="gradient-navy py-16 md:py-20">
        <div className="container-max px-4">
          <p className="text-gold-400 font-semibold text-sm uppercase tracking-wider mb-3">Free tools</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Property Resource Library</h1>
          <p className="text-navy-200">Calculators, checklists, templates and guides — all on this site, all free, none behind a form.</p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max max-w-4xl">
          {/* The one resource on this page that is a page, not a download —
              and the only route on the site that linked to it was itself. */}
          <Link href="/resources/top-20-btl-postcodes" className="block bg-navy-50 rounded-xl border border-navy-100 p-6 mb-8 hover:shadow-md transition-all">
            <span className="px-2 py-0.5 bg-gold-50 text-gold-700 text-xs font-semibold rounded">Read online</span>
            <h2 className="font-bold text-navy-800 mt-2 mb-1">Top 20 UK buy-to-let postcodes by rental yield</h2>
            <p className="text-sm text-navy-500">Ranked by gross yield, with the price and rent behind every figure and where each number came from.</p>
          </Link>
          <div className="space-y-4">
            {resources.map((r) => (
              <div key={r.title} className="bg-white rounded-xl border border-navy-100 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-all">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-navy-50 text-navy-600 text-xs font-semibold rounded">{r.category}</span>
                    <span className="px-2 py-0.5 bg-gold-50 text-gold-700 text-xs font-semibold rounded">Free · no sign-up</span>
                  </div>
                  <h2 className="font-bold text-navy-800 mb-1">{r.title}</h2>
                  <p className="text-sm text-navy-500">{r.desc}</p>
                </div>
                <Link href={r.href} className="btn-primary !py-2 !px-5 text-sm flex-shrink-0">Open</Link>
              </div>
            ))}
          </div>
          <p className="text-xs text-navy-400 mt-6 text-center">Nothing here needs an email address. The checklists and templates print cleanly if you want a paper copy.</p>
        </div>
      </section>
    </>
  );
}
