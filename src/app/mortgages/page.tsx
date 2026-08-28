import Link from "next/link";
import type { Metadata } from "next";
import { Disclaimer } from "@/components/legal/Disclaimer";

export const metadata: Metadata = {
  title: "UK Mortgages Explained — Every Mortgage Type Guide",
  description: "Complete guide to every UK mortgage type. Residential, buy-to-let, HMO, commercial, bridging, development finance, self-employed, and limited company mortgages explained.",
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/mortgages/" },
  openGraph: {
    title: "UK Mortgages Explained — Every Mortgage Type Guide",
    description: "Complete guide to every UK mortgage type. Residential, buy-to-let, HMO, commercial, bridging, development finance, self-employed, and limited company mortgages explained.",
    type: "article",
    url: "https://www.propertyvaultuk.co.uk/mortgages/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "UK Mortgages Guide" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "UK Mortgages Explained — Every Mortgage Type Guide",
    description: "Complete guide to every UK mortgage type. Residential, buy-to-let, HMO, commercial, bridging, development finance, self-employed, and limited company mortgages explained.",
  },
};

const mortgageTypes = [
  {
    title: "Residential Mortgages",
    desc: "Standard mortgages for properties you will live in as your main home.",
    deposit: "5-25%",
    rates: "4.0-6.0%",
    details: "Residential mortgages are assessed on your personal income and affordability. Most lenders will lend 4-4.5x your annual income. Available as fixed rate (2, 3, 5, or 10 years), variable rate, tracker, or discount products. First-time buyers may access 95% LTV products through various government-backed schemes."
  },
  {
    title: "First-Time Buyer Mortgages",
    desc: "Specialist products with lower deposits and government scheme support.",
    deposit: "5-10%",
    rates: "4.5-6.5%",
    details: "Designed for buyers who have never owned property. Many lenders offer specific FTB products with lower fees or cashback. Government schemes include Help to Buy equity loan (closed to new applicants), Shared Ownership, Lifetime ISA bonus, and the First Homes scheme offering 30-50% discounts on new builds."
  },
  {
    title: "Buy-to-Let Mortgages",
    desc: "For properties purchased as investments to rent to tenants.",
    deposit: "25%+",
    rates: "4.5-7.0%",
    details: "BTL mortgages are assessed primarily on rental income. Most lenders require rental income to cover 125-145% of the mortgage payment at a stress rate of 5.5%. Available on interest-only or repayment basis. Portfolio landlords (4+ mortgaged properties) face additional scrutiny under PRA rules introduced in 2017."
  },
  {
    title: "HMO Mortgages",
    desc: "Specialist products for Houses in Multiple Occupation.",
    deposit: "25-30%",
    rates: "5.0-7.5%",
    details: "Not all lenders offer HMO mortgages. Those that do may restrict the number of rooms (typically 6-8 max), require licensing evidence, and may apply different stress tests. Some lenders assess on aggregate room rents while others cap at a single-let equivalent. Rates are typically higher than standard BTL."
  },
  {
    title: "Limited Company Mortgages",
    desc: "BTL mortgages for properties held in a Special Purpose Vehicle (SPV).",
    deposit: "25%+",
    rates: "5.0-7.5%",
    details: "Increasingly popular since Section 24 removed mortgage interest relief for individual landlords. SPV structures allow full mortgage interest deduction against rental income and corporation tax (currently 19–25%) instead of personal income tax. Most lenders require a personal guarantee from directors."
  },
  {
    title: "Commercial Mortgages",
    desc: "Finance for offices, retail, industrial, and mixed-use properties.",
    deposit: "25-40%",
    rates: "5.5-9.0%",
    details: "Commercial mortgages have shorter terms (typically 15-25 years), higher deposits, and more complex underwriting. Lenders assess the commercial viability of the property and the tenant covenant strength. Terms may include personal guarantees, debt service coverage ratios, and annual reviews."
  },
  {
    title: "Bridging Finance",
    desc: "Short-term loans for purchases, refurbishments, and auction buys.",
    deposit: "20-30%",
    rates: "0.5-1.5%/month",
    details: "Bridging loans are short-term (typically 3-18 months) and designed for speed. Used for auction purchases (28-day completion), refurbishment projects, chain-break situations, and property development. Interest is charged monthly (not annually) and can be rolled up into the loan. A clear exit strategy (sale or refinance) is required."
  },
  {
    title: "Development Finance",
    desc: "Funding for ground-up builds, conversions, and major developments.",
    deposit: "25-40%",
    rates: "6.0-12.0%",
    details: "Development finance covers land purchase and build costs, released in stages as construction progresses. Lenders typically fund up to 65% of Gross Development Value (GDV) and 100% of build costs. Requires detailed planning permission, build schedules, cost breakdowns, and professional quantity surveyor monitoring."
  },
  {
    title: "Self-Employed Mortgages",
    desc: "Mortgages for sole traders, freelancers, and company directors.",
    deposit: "10-25%",
    rates: "4.5-7.0%",
    details: "Self-employed applicants typically need 2-3 years of accounts or SA302 tax returns. Lenders assess income differently — some use net profit, others use salary plus dividends for directors. Day rate contractor mortgages may be assessed on the annualised contract rate rather than accounts."
  },
  {
    title: "Adverse Credit Mortgages",
    desc: "Options for borrowers with CCJs, defaults, IVAs, or bankruptcies.",
    deposit: "15-40%",
    rates: "5.5-9.0%",
    details: "Specialist lenders consider applicants with credit issues that mainstream lenders would decline. Rates and deposit requirements depend on the severity and age of the adverse credit. Recent issues (within 1-2 years) require larger deposits and accept higher rates. After 6 years, most issues drop off your credit file."
  },
];

export default function MortgagesPage() {
  return (
    <>
      <section className="gradient-navy py-16 md:py-24">
        <div className="container-max px-4">
          <div className="max-w-3xl">
            <p className="text-gold-400 font-semibold text-sm uppercase tracking-wider mb-3">Complete Guide</p>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">UK Mortgages Explained</h1>
            <p className="text-navy-200 text-lg">Every mortgage type available in the UK explained in plain English. Deposit requirements, typical rates, eligibility criteria, and what to expect from the application process.</p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max max-w-4xl">
          <div className="space-y-10">
            {mortgageTypes.map((m) => (
              <div key={m.title} className="bg-white rounded-xl border border-navy-100 p-6 md:p-8">
                <h2 className="text-xl font-bold text-navy-800 mb-2">{m.title}</h2>
                <p className="text-navy-500 mb-4">{m.desc}</p>
                <div className="flex gap-4 mb-4">
                  <span className="px-3 py-1 bg-navy-50 text-navy-700 text-xs font-semibold rounded-full">Deposit: {m.deposit}</span>
                  <span className="px-3 py-1 bg-gold-50 text-gold-700 text-xs font-semibold rounded-full">Rates: {m.rates}</span>
                </div>
                <p className="text-sm text-navy-600 leading-relaxed">{m.details}</p>
              </div>
            ))}
          </div>

          <Disclaimer type="financial" />

          <div className="mt-8 text-center">
            <Link href="/calculators/mortgage" className="btn-primary text-lg !py-4 !px-8">Try the Mortgage Calculator →</Link>
          </div>
        </div>
      </section>
    </>
  );
}
