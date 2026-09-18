import type { Metadata } from "next";
import Link from "@/components/ui/Link";

export const metadata: Metadata = {
  title: "UK Property News — Latest Market Updates | PropertyVault",
  description: "The rule changes affecting UK landlords and buyers — Renters' Rights Act, landlord database, EPC C, CGT and stamp duty — dated, with the page that explains each.",
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/property-news/" },
  openGraph: {
    title: "UK Property News — Latest Market Updates | PropertyVault",
    description: "The rule changes affecting UK landlords and buyers — Renters' Rights Act, landlord database, EPC C, CGT and stamp duty — dated, with the page that explains each.",
    type: "website",
    url: "https://www.propertyvaultuk.co.uk/property-news/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "UK Property News" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "UK Property News — Latest Market Updates | PropertyVault",
    description: "The rule changes affecting UK landlords and buyers — Renters' Rights Act, landlord database, EPC C, CGT and stamp duty — dated, with the page that explains each.",
  },
};

/**
 * Eight items, every one restating what the page it links to already says.
 *
 * The previous version was written as news copy: a base rate "as of
 * mid-2026", house-price growth "ONS data shows", markets "pricing in" cuts
 * — none of it sourced, and one item flatly wrong: it said PRS Ombudsman
 * membership was already mandatory with a £5,000 fine, while the site's own
 * Ombudsman post says the scheme has no administrator and 2028 is a planning
 * assumption. It also had the Renters' Rights Act in force from June 2025;
 * the Act page says Royal Assent 27 October 2025 and the tenancy reforms
 * from 1 May 2026.
 *
 * So this page now carries no claim that is not on a page it links to, and
 * nothing that would need a market source to stand up. When one of those
 * pages changes, this one is wrong until it is changed to match — which is
 * the same rule the rest of the site works to.
 */
const items = [
  {
    date: "1 May 2026",
    title: "Renters' Rights Act — the tenancy reforms are in force",
    excerpt: "Royal Assent on 27 October 2025; the main reforms took effect on 1 May 2026. Section 21 no-fault evictions are abolished, existing fixed terms became periodic, and possession runs through Section 8 grounds.",
    href: "/renters-rights-act",
    cta: "What it means for landlords",
  },
  {
    date: "15 December 2026",
    title: "The landlord database opens for registration",
    excerpt: "England's private rented sector database opens on 15 December 2026, West Midlands first, with a registration deadline of 14 March 2027. What it asks for, what it costs, and the penalties.",
    href: "/landlords/prs-database",
    cta: "What to have ready",
  },
  {
    date: "Expected 2028",
    title: "PRS Ombudsman — not yet open, not yet mandatory",
    excerpt: "Mandatory Ombudsman membership is currently expected in 2028. As of mid-2026 no scheme administrator has been appointed, so treat 2028 as a planning assumption rather than a fixed date.",
    href: "/blog/prs-ombudsman-landlord-registration",
    cta: "Timeline and how to prepare",
  },
  {
    date: "By 2030",
    title: "EPC C becomes the minimum for rented homes",
    excerpt: "Privately rented properties in England must reach EPC band C by 2030. The deadline is fixed and there are no extensions, so the cheapest time to plan the work is now.",
    href: "/blog/epc-c-deadline-landlords",
    cta: "What landlords must do",
  },
  {
    date: "30 October 2024",
    title: "Capital gains tax on residential property: 18% and 24%",
    excerpt: "From 30 October 2024, residential property CGT is 18% for basic-rate taxpayers and 24% for higher and additional rate — down from 28% at the top.",
    href: "/calculators/capital-gains-tax",
    cta: "Work out your bill",
  },
  {
    date: "1 April 2025",
    title: "First-time buyer stamp duty relief: nil rate to £300,000",
    excerpt: "The temporary £425,000 threshold ended on 31 March 2025. First-time buyers now pay nothing on the first £300,000 and 5% up to £500,000; above that the relief does not apply.",
    href: "/calculators/stamp-duty",
    cta: "Check your stamp duty",
  },
  {
    date: "31 October 2024",
    title: "Additional-property surcharge is 5%",
    excerpt: "The stamp duty surcharge on second homes and buy-to-let purchases rose from 3% to 5% on 31 October 2024, charged on the whole price on top of the standard bands.",
    href: "/calculators/stamp-duty",
    cta: "See it on a real purchase",
  },
];

export default function PropertyNewsPage() {
  return (
    <>
      <section className="gradient-navy py-16 md:py-20">
        <div className="container-max px-4">
          <p className="text-gold-400 font-semibold text-sm uppercase tracking-wider mb-3">What changed</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">UK Property News</h1>
          <p className="text-navy-200">The rule changes that affect landlords and buyers, dated, each with the page that explains it in full.</p>
        </div>
      </section>
      <section className="section-padding bg-white">
        <div className="container-max max-w-4xl">
          <div className="space-y-6">
            {items.map((n) => (
              <article key={n.title} className="bg-white rounded-xl border border-navy-100 p-6 hover:shadow-md transition-all">
                <p className="text-xs font-semibold text-gold-600 uppercase tracking-wide mb-1">{n.date}</p>
                <h2 className="text-lg font-bold text-navy-800 mb-2 mt-1">
                  <Link href={n.href} className="hover:text-gold-600 transition-colors">{n.title}</Link>
                </h2>
                <p className="text-sm text-navy-500 mb-3">{n.excerpt}</p>
                <Link href={n.href} className="text-sm font-semibold" style={{ color: "var(--gold-ink)" }}>{n.cta} &rarr;</Link>
              </article>
            ))}
          </div>
          <p className="text-xs text-navy-400 mt-8">
            Dates and figures are those stated on the linked pages. This page carries no market commentary: rates, prices and forecasts change faster than a page like this is updated, and a stale number presented as news is worse than none.
          </p>
        </div>
      </section>
    </>
  );
}
