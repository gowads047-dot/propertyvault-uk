import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "UK Property News — Latest Market Updates | PropertyVault",
  description: "Latest UK property news. Market updates, policy changes, interest rate decisions, and developments affecting property investors and homeowners.",
  alternates: { canonical: "https://propertyvaultuk.co.uk/property-news/" },
  openGraph: {
    title: "UK Property News — Latest Market Updates | PropertyVault",
    description: "Latest UK property news. Market updates, policy changes, interest rate decisions, and developments affecting property investors and homeowners.",
    type: "website",
    url: "https://propertyvaultuk.co.uk/property-news/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "UK Property News" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "UK Property News — Latest Market Updates | PropertyVault",
    description: "Latest UK property news. Market updates, policy changes, interest rate decisions, and developments affecting property investors and homeowners.",
  },
};

export default function PropertyNewsPage() {
  return (
    <>
      <section className="gradient-navy py-16 md:py-20">
        <div className="container-max px-4">
          <p className="text-gold-400 font-semibold text-sm uppercase tracking-wider mb-3">Latest News</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">UK Property News</h1>
          <p className="text-navy-200">Stay informed with the latest developments affecting UK property investors, landlords, and homebuyers.</p>
        </div>
      </section>
      <section className="section-padding bg-white">
        <div className="container-max max-w-4xl">
          <div className="space-y-6">
            {[
              { title: "Bank of England Base Rate: Where Are We in 2026?", date: "July 2026", excerpt: "After a series of cautious cuts from the 2024 peak, the base rate sits at 4.00% as of mid-2026. Markets are pricing in one or two further cuts before year-end, providing some relief on tracker and variable mortgages." },
              { title: "Renters' Rights Act 2025 — Now in Force", date: "June 2025", excerpt: "The Renters' Rights Act received Royal Assent in March 2025 and came fully into force in June 2025. Section 21 no-fault evictions are abolished. All tenancies are now periodic. Landlords must use Section 8 grounds to recover possession." },
              { title: "EPC C Deadline 2030 — What Landlords Must Do Now", date: "2026", excerpt: "Rental properties must achieve an EPC C rating by 2030 or risk not being legally lettable. The government confirmed no extensions. Average upgrade cost: £6,500–£15,000 depending on current rating." },
              { title: "UK House Prices: Annual Growth of 3.4% in Mid-2026", date: "July 2026", excerpt: "ONS data shows continued modest growth driven by easing mortgage rates, persistent supply shortage, and strong rental demand in the Midlands. Birmingham and Nottingham outperforming national averages." },
              { title: "CGT on Residential Property: New Rates Since October 2024", date: "October 2024", excerpt: "Capital gains tax rates on residential property changed in the October 2024 Budget. The higher rate fell from 28% to 24%; the basic rate stays at 18%. The change applies to disposals from 30 October 2024." },
              { title: "First-Time Buyer SDLT Relief: £300,000 Threshold from April 2025", date: "April 2025", excerpt: "The temporary SDLT nil-rate threshold of £425,000 for first-time buyers ended on 31 March 2025. From 1 April 2025, the threshold reverted to £300,000 (with a cap of £500,000 for the relief to apply at all). First-time buyers should check their stamp duty using the calculator." },
              { title: "Stamp Duty Surcharge at 5% — One Year On", date: "October 2025", excerpt: "The additional property surcharge rose from 3% to 5% in October 2024 for second homes and buy-to-let purchases. Deal volumes dropped sharply in Q4 2024 but have since stabilised as investors adjust underwriting models." },
              { title: "PRS Ombudsman Registration Now Mandatory", date: "2025", excerpt: "All private landlords in England are required to join the new Private Rented Sector (PRS) Ombudsman under the Renters' Rights Act 2025. Failure to register is a criminal offence and can result in a fine of up to £5,000." },
            ].map((n) => (
              <article key={n.title} className="bg-white rounded-xl border border-navy-100 p-6 hover:shadow-md transition-all cursor-pointer">
                {n.date && <p className="text-xs font-semibold text-gold-600 uppercase tracking-wide mb-1">{n.date}</p>}
                <h2 className="text-lg font-bold text-navy-800 mb-2 mt-1">{n.title}</h2>
                <p className="text-sm text-navy-500">{n.excerpt}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

