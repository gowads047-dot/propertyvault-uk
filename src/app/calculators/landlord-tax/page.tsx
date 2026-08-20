import type { Metadata } from "next";
import { LandlordTaxCalculator } from "@/components/calculators/LandlordTaxCalculator";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { EmailResults } from "@/components/calculators/EmailResults";
import { EmbedCode } from "@/components/calculators/EmbedCode";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Disclaimer } from "@/components/legal/Disclaimer";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Free Landlord Tax Calculator UK 2026 — Section 24 Income Tax on Rental Income | PropertyVault",
  description: "Calculate exactly how much income tax you pay on rental income. See the Section 24 impact vs old rules, net profit after tax, and whether a limited company saves you money.",
  keywords: "landlord tax calculator, rental income tax UK, Section 24 calculator, income tax on rent, landlord tax 2026",
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/calculators/landlord-tax/" },
  openGraph: {
    title: "Free Landlord Tax Calculator UK 2026 — Section 24 Income Tax on Rental Income | PropertyVault",
    description: "Calculate exactly how much income tax you pay on rental income. See the Section 24 impact vs old rules, net profit after tax, and whether a limited company saves you money.",
    type: "article",
    url: "https://www.propertyvaultuk.co.uk/calculators/landlord-tax/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "Landlord Tax Calculator UK" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Landlord Tax Calculator UK 2026 — Section 24 Income Tax on Rental Income | PropertyVault",
    description: "Calculate exactly how much income tax you pay on rental income. See the Section 24 impact vs old rules, net profit after tax, and whether a limited company saves you money.",
  },
};

const faqs = [
  { q: "How is rental income taxed in the UK?", a: "Rental income is added to your other income (salary, pension, self-employment) and taxed at your marginal rate — 20%, 40%, or 45%. The first £12,570 is covered by your Personal Allowance and taxed at 0%. You can deduct allowable expenses such as repairs, insurance, letting agent fees, and accountancy costs." },
  { q: "What is Section 24 and how does it affect landlords?", a: "Section 24 (Finance Act 2015) restricts mortgage interest relief for individual landlords. Since April 2020, you cannot deduct mortgage interest as an expense. Instead, you receive a 20% tax credit on the interest paid. This significantly increases tax bills for higher and additional rate (40%/45%) taxpayers — they are taxed on gross rental income as if they had no mortgage." },
  { q: "Can I deduct mortgage interest from rental income?", a: "No — not for individual landlords. Under Section 24, mortgage interest is no longer an allowable expense. You receive a 20% tax credit instead. This means basic rate (20%) taxpayers are unaffected, but higher rate (40%) and additional rate (45%) taxpayers pay significantly more tax than before 2017." },
  { q: "What expenses can I deduct from rental income?", a: "Allowable expenses include: letting agent fees, property repairs and maintenance, buildings and contents insurance, accountancy fees, ground rent and service charges (leasehold), advertising costs, and professional subscriptions. Capital improvements (extensions, new kitchens) are NOT deductible as revenue expenses — they reduce your Capital Gains Tax bill when you sell." },
  { q: "Does Section 24 affect basic rate (20%) taxpayers?", a: "No — for basic rate taxpayers, Section 24 makes no difference. The 20% tax credit exactly offsets the 20% tax on the interest. The impact is felt only by higher rate (40%) and additional rate (45%) taxpayers, who previously deducted interest at their full marginal rate but now only receive a 20% credit." },
];

export default function LandlordTaxPage() {
  return (
    <>
      <section className="gradient-navy py-12 md:py-16">
        <div className="container-max px-4">
          <Breadcrumbs items={[{ label: "Calculators", href: "/calculators" }, { label: "Landlord Tax" }]} />
          <p className="text-gold-400 font-semibold text-sm uppercase tracking-wider mb-2">Free Calculator</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Landlord Tax Calculator</h1>
          <p className="text-navy-200 max-w-2xl">See exactly how much income tax you pay on rental income — and how Section 24 affects your bill versus the old rules.</p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max">
          <LandlordTaxCalculator />

          <div className="mt-8">
            <EmailResults />
          </div>
          <EmbedCode slug="landlord-tax" title="Landlord Tax Calculator UK" />

          <div className="mt-10 pt-8 border-t border-navy-200 space-y-4 max-w-3xl text-sm text-navy-600">
            <h2 className="text-xl font-bold text-navy-800">How is Rental Income Taxed in the UK?</h2>
            <p>Rental income is added to your other income (employment, self-employment, pension) and taxed at your marginal rate — 20%, 40%, or 45%. The first £12,570 of total income is covered by your Personal Allowance and taxed at 0%.</p>
            <p>Allowable expenses (repairs, letting agent fees, insurance, accounting) reduce your taxable rental profit. Mortgage interest no longer reduces taxable profit under Section 24 — instead you receive a 20% tax credit on the interest paid.</p>
            <p>If you pay 40% or 45% income tax, Section 24 means you&apos;re taxed on more income than you actually receive in cash — you may owe tax even when your rental property barely breaks even after mortgage payments.</p>
          </div>

          <div className="pt-4 border-t border-navy-200 not-prose mt-6">
            <p className="font-bold text-navy-800 mb-3 text-sm">Related Tools</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <Link href="/calculators/section-24" className="block bg-white rounded-lg border border-navy-100 p-3 text-center hover:shadow-md transition-all"><p className="font-semibold text-navy-800 text-xs">Section 24</p><p className="text-xs text-navy-400 mt-0.5">Mortgage interest tax</p></Link>
              <Link href="/calculators/personal-vs-ltd" className="block bg-white rounded-lg border border-navy-100 p-3 text-center hover:shadow-md transition-all"><p className="font-semibold text-navy-800 text-xs">Personal vs Ltd</p><p className="text-xs text-navy-400 mt-0.5">Structure comparison</p></Link>
              <Link href="/calculators/rental-yield" className="block bg-white rounded-lg border border-navy-100 p-3 text-center hover:shadow-md transition-all"><p className="font-semibold text-navy-800 text-xs">Rental Yield</p><p className="text-xs text-navy-400 mt-0.5">Gross &amp; net yield</p></Link>
            </div>
          </div>

          <FAQSchema faqs={faqs} />
          <Disclaimer type="tax" />
        </div>
      </section>
    </>
  );
}
