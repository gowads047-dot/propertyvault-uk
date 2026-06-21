import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "UK Property News — Latest Market Updates | PropertyVault",
  description: "Latest UK property news. Market updates, policy changes, interest rate decisions, and developments affecting property investors and homeowners.",
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
              { title: "Bank of England Holds Base Rate at 4.50%", date: "", excerpt: "The Monetary Policy Committee voted to hold rates steady. Markets continue to price in gradual cuts through the second half of 2025." },
              { title: "Renters' Reform Bill: Latest Updates and Timeline", date: "", excerpt: "The government's plans to abolish Section 21 no-fault evictions are progressing through Parliament. Here's what landlords need to know." },
              { title: "EPC C Target for Rental Properties: What We Know", date: "", excerpt: "The proposed requirement for rental properties to achieve EPC C rating by 2028 for new tenancies. Estimated costs and exemptions." },
              { title: "UK House Prices Rise 2.1% Year-on-Year", date: "", excerpt: "ONS data shows modest annual growth driven by falling mortgage rates and continued supply constraints." },
              { title: "Stamp Duty Surcharge Increase to 5% — Impact Analysis", date: "", excerpt: "The additional property surcharge increased from 3% to 5% in October 2024. We analyse the impact on investor returns." },
            ].map((n) => (
              <article key={n.title} className="bg-white rounded-xl border border-navy-100 p-6 hover:shadow-md transition-all cursor-pointer">
                
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

