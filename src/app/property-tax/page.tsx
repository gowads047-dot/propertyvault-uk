import Link from "next/link";
import type { Metadata } from "next";
import { Disclaimer } from "@/components/legal/Disclaimer";

export const metadata: Metadata = {
  title: "Property Tax UK — Stamp Duty, CGT, Section 24, SPV Guide | PropertyVault",
  description: "Complete UK property tax guide. Stamp duty, capital gains tax, income tax on rent, Section 24, corporation tax, VAT, inheritance tax, and SPV structures explained.",
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/property-tax/" },
  openGraph: {
    title: "Property Tax UK — Stamp Duty, CGT, Section 24, SPV Guide | PropertyVault",
    description: "Complete UK property tax guide. Stamp duty, capital gains tax, income tax on rent, Section 24, corporation tax, VAT, inheritance tax, and SPV structures explained.",
    type: "article",
    url: "https://www.propertyvaultuk.co.uk/property-tax/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "Property Tax UK Guide" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Property Tax UK — Stamp Duty, CGT, Section 24, SPV Guide | PropertyVault",
    description: "Complete UK property tax guide. Stamp duty, capital gains tax, income tax on rent, Section 24, corporation tax, VAT, inheritance tax, and SPV structures explained.",
  },
};

export default function PropertyTaxPage() {
  return (
    <>
      <section className="gradient-navy py-16 md:py-24">
        <div className="container-max px-4">
          <div className="max-w-3xl">
            <p className="text-gold-400 font-semibold text-sm uppercase tracking-wider mb-3">Tax Guide</p>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">UK Property Tax Guide</h1>
            <p className="text-navy-200 text-lg">Understanding property tax is critical to your investment success. This guide covers every tax that applies to UK property investors, landlords, and developers.</p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max max-w-4xl space-y-12">
          {/* Stamp Duty */}
          <div>
            <h2 className="text-2xl font-bold text-navy-800 mb-4">Stamp Duty Land Tax (SDLT)</h2>
            <div className="space-y-3 text-navy-600 leading-relaxed">
              <p>SDLT is paid when you purchase property or land in England and Northern Ireland above £125,000 (standard purchases, from 1 April 2025 — the temporary £250,000 threshold ended on 31 March 2025). Rates are progressive — you only pay the higher rate on the portion above each threshold.</p>
              <p><strong>Additional Property Surcharge:</strong> If you already own a property and are buying an additional one (buy-to-let, second home), you pay an extra 5% on the entire purchase price on top of standard rates. This applies from the first pound.</p>
              <p><strong>Company purchases:</strong> Properties bought through a limited company are subject to the additional surcharge. For residential properties over £500,000 purchased by a company, a flat 15% SDLT rate applies (in place of the standard banded rates). Separately, companies holding residential property worth over £500,000 may also be subject to the Annual Tax on Enveloped Dwellings (ATED) — an annual charge based on the property's value band.</p>
              <Link href="/calculators/stamp-duty" className="inline-block text-gold-600 font-semibold text-sm mt-2">Calculate your stamp duty →</Link>
            </div>
          </div>

          {/* Income Tax */}
          <div>
            <h2 className="text-2xl font-bold text-navy-800 mb-4">Income Tax on Rental Income</h2>
            <div className="space-y-3 text-navy-600 leading-relaxed">
              <p>Rental income is added to your other income and taxed at your marginal rate: 20% basic rate, 40% higher rate, or 45% additional rate. You can deduct allowable expenses including letting agent fees, insurance, maintenance, ground rent, and service charges.</p>
              <p><strong>Property Income Allowance:</strong> If your gross rental income is under £1,000 per year, it is tax-free under the property income allowance. You cannot claim this if you also claim expenses.</p>
            </div>
          </div>

          {/* Section 24 */}
          <div>
            <h2 className="text-2xl font-bold text-navy-800 mb-4">Section 24 — Mortgage Interest Relief</h2>
            <div className="space-y-3 text-navy-600 leading-relaxed">
              <p>Since April 2020, individual landlords can no longer deduct mortgage interest from rental income. Instead, you receive a basic rate (20%) tax credit on your mortgage interest costs. This significantly impacts higher-rate taxpayers.</p>
              <p><strong>Example:</strong> A higher-rate taxpayer with £12,000 rental income and £8,000 mortgage interest previously paid tax on £4,000 profit. Now they pay 40% tax on £12,000 (£4,800) minus a 20% credit on £8,000 (£1,600) = £3,200 tax. This is £1,600 more than before Section 24.</p>
              <p><strong>The SPV Solution:</strong> Limited company (SPV) structures are not affected by Section 24. Companies can still deduct mortgage interest as a business expense and pay corporation tax (19–25%) on the net profit. This is why many landlords are now purchasing through SPVs.</p>
            </div>
          </div>

          {/* CGT */}
          <div>
            <h2 className="text-2xl font-bold text-navy-800 mb-4">Capital Gains Tax (CGT)</h2>
            <div className="space-y-3 text-navy-600 leading-relaxed">
              <p>When you sell a property that is not your main home, you pay CGT on the profit. From 30 October 2024, residential property CGT rates are 18% (basic rate taxpayers) and 24% (higher/additional rate taxpayers). The annual CGT exempt amount is £3,000 for the 2024-25 and 2025-26 tax years (reduced from £6,000 in 2023-24 and £12,300 in 2022-23).</p>
              <p><strong>Calculating CGT:</strong> Sale price minus purchase price, minus allowable costs (stamp duty, legal fees, improvement costs), minus your annual allowance. The remaining gain is added to your income to determine which rate applies.</p>
              <p><strong>Reporting:</strong> CGT on UK residential property must be reported and paid within 60 days of completion using the HMRC real-time CGT service.</p>
            </div>
          </div>

          {/* Corporation Tax */}
          <div>
            <h2 className="text-2xl font-bold text-navy-800 mb-4">Corporation Tax (SPV)</h2>
            <div className="space-y-3 text-navy-600 leading-relaxed">
              <p>Properties held in a limited company pay corporation tax (25% for profits over £250,000, 19% for profits under £50,000, marginal relief between) on rental profits after all allowable deductions including full mortgage interest.</p>
              <p>Profits can be retained in the company and reinvested without personal tax. When extracted as dividends, additional tax applies at 8.75% (basic), 33.75% (higher), or 39.35% (additional rate).</p>
            </div>
          </div>

          {/* IHT */}
          <div>
            <h2 className="text-2xl font-bold text-navy-800 mb-4">Inheritance Tax (IHT)</h2>
            <div className="space-y-3 text-navy-600 leading-relaxed">
              <p>Property forms part of your estate for IHT purposes. The nil-rate band is £325,000, with a residence nil-rate band of £175,000 (if leaving your main home to direct descendants). IHT is charged at 40% on the value above these thresholds.</p>
              <p><strong>Investment properties:</strong> BTL and investment properties do not qualify for the residence nil-rate band. Careful estate planning, potentially using trusts or company structures, can help mitigate IHT exposure.</p>
            </div>
          </div>

          <Disclaimer type="tax" />
        </div>
      </section>
    </>
  );
}
