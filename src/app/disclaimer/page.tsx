import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer — PropertyVault UK",
  description: "PropertyVault UK disclaimer. Important information about the nature of our content, investment risks, and professional advice requirements.",
};

export default function DisclaimerPage() {
  return (
    <>
      <section className="gradient-navy py-12 md:py-16">
        <div className="container-max px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Disclaimer</h1>
          <p className="text-navy-200 text-sm">Last updated: June 2026</p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max max-w-4xl prose-sm text-navy-600 leading-relaxed space-y-8">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <h2 className="text-xl font-bold text-red-800 mb-3">Important: Please Read This Carefully</h2>
            <p className="text-red-700">Property investment carries significant financial risk. You could lose some or all of your invested capital. The value of property can go down as well as up. Past performance is not a reliable indicator of future results. The information on this website does not constitute professional advice.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-navy-800 mb-3">General Disclaimer</h2>
            <p>PropertyVault UK provides educational content about property investment, mortgages, property law, property tax, and related topics. All information, articles, guides, calculators, tools, courses, community content, and other materials on this website are provided for <strong>general educational and informational purposes only</strong>.</p>
            <p className="mt-2">This website and its content do not constitute and should not be construed as financial advice, investment advice, mortgage advice, legal advice, tax advice, surveying advice, planning advice, or any other form of professional advice.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-navy-800 mb-3">Not Regulated Financial Advice</h2>
            <p>PropertyVault UK is <strong>not authorised or regulated by the Financial Conduct Authority (FCA)</strong>. We do not provide regulated financial advice, investment advice, or mortgage advice. Nothing on this website should be interpreted as a personal recommendation to buy, sell, or hold any investment or financial product.</p>
            <p className="mt-2">Before making any financial decision, including property purchases, mortgage applications, or investment decisions, you should consult an independent financial advisor (IFA) or mortgage broker who is authorised and regulated by the FCA.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-navy-800 mb-3">Not Legal Advice</h2>
            <p>PropertyVault UK is <strong>not a law firm</strong> and does not provide legal advice. Our legal guides are educational summaries designed to help you understand general legal principles. They do not cover every scenario, may not reflect the most recent legislative changes, and cannot replace advice from a qualified solicitor.</p>
            <p className="mt-2">Property law is complex and depends on the specific circumstances of each case. Always instruct an SRA-regulated solicitor or CLC-licensed conveyancer for any property transaction or legal matter.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-navy-800 mb-3">Not Tax Advice</h2>
            <p>PropertyVault UK does <strong>not provide tax advice</strong>. Tax rules are complex, change frequently, and depend on your individual circumstances. Our tax guides provide general educational overviews and may not reflect the latest HMRC guidance or legislation.</p>
            <p className="mt-2">Always consult a qualified accountant or tax advisor (ACCA, ICAEW, or CIOT qualified) before making any decisions that have tax implications.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-navy-800 mb-3">Investment Risk Warning</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Property values can fall as well as rise. You may not get back the amount you invest.</li>
              <li>Rental income is not guaranteed. Properties may experience void periods, non-paying tenants, or falling rental values.</li>
              <li>Property is an illiquid asset. You may not be able to sell quickly or at the price you expect.</li>
              <li>Leverage (mortgage borrowing) amplifies both gains and losses. If property values fall, you could owe more than the property is worth (negative equity).</li>
              <li>Interest rates can rise, increasing your mortgage costs and reducing your cash flow.</li>
              <li>Legislative and regulatory changes can affect your returns, tax position, and legal obligations.</li>
              <li>Refurbishment and development projects carry the risk of cost overruns, delays, and unforeseen complications.</li>
              <li>Your property may be repossessed if you do not keep up mortgage repayments.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-navy-800 mb-3">Calculator Disclaimer</h2>
            <p>All calculators and tools on this website produce <strong>estimates based on simplified assumptions</strong>. They are provided for illustrative and educational purposes only. Results should not be used as the sole basis for any financial decision. Actual costs, returns, and outcomes will vary based on factors not captured in our calculators.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-navy-800 mb-3">Market Data</h2>
            <p>Market data, statistics, house prices, rental figures, interest rates, and any other numerical data presented on this website are sourced from public sources and may be indicative, approximate, out of date, or inaccurate. We make reasonable efforts to keep data current but cannot guarantee its accuracy or completeness. Always verify data from official sources (ONS, HM Land Registry, Bank of England) before making decisions.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-navy-800 mb-3">Case Studies and Testimonials</h2>
            <p>Case studies, worked examples, success stories, and testimonials featured on this website are for illustrative purposes only. They may be based on real experiences (with details changed for privacy) or may be hypothetical examples. Individual results vary significantly. The success of other investors does not guarantee that you will achieve similar results.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-navy-800 mb-3">Affiliate and Commercial Relationships</h2>
            <p>This website contains affiliate links and commercial partnerships. We may earn commissions from products and services recommended on this site. While we strive to recommend only products and services we believe provide genuine value, the existence of commercial relationships creates a potential conflict of interest. You should conduct your own research before purchasing any product or service.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-navy-800 mb-3">Third-Party Content</h2>
            <p>This website may include content from third-party contributors, guest authors, and community members. Views expressed by third parties are their own and do not necessarily reflect the views of PropertyVault UK. We do not verify the qualifications, accuracy, or completeness of third-party content.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-navy-800 mb-3">Jurisdiction</h2>
            <p>This website is designed for a UK audience. Information about property law, taxation, mortgages, and regulations relates to England and Wales unless otherwise stated. Scotland, Northern Ireland, and other jurisdictions may have different laws and regulations. If you are outside England and Wales, seek local professional advice.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-navy-800 mb-3">Seek Professional Advice</h2>
            <p className="font-semibold text-navy-800">Before making any property investment, financial, legal, or tax decision, you should seek independent professional advice from appropriately qualified and regulated professionals. PropertyVault UK accepts no liability for any loss or damage arising from decisions made based on the content of this website.</p>
          </div>
        </div>
      </section>
    </>
  );
}

