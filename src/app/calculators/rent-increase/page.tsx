import type { Metadata } from "next";
import { RentIncreaseCalculator } from "@/components/calculators/RentIncreaseCalculator";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { EmailResults } from "@/components/calculators/EmailResults";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Disclaimer } from "@/components/legal/Disclaimer";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Free Rent Increase Calculator UK — Section 13 Notice & Impact | PropertyVault",
  description: "Calculate the impact of a rent increase on your annual income, check Section 13 notice requirements, and benchmark against CPI and market rates.",
  keywords: "rent increase calculator UK, Section 13 notice, how much can I increase rent, rent increase notice UK, landlord rent increase 2025",
};

const faqs = [
  { q: "How do I legally increase rent in the UK?", a: "For assured shorthold tenancies (ASTs), you must use a Section 13 notice (Form 4) to propose a rent increase. You must give at least one month's notice (or two months for periodic tenancies fixed at month-to-month), you can only increase rent once per year, and the tenant can challenge the increase at a First-tier Tribunal if they believe it is above market rate." },
  { q: "How much can I increase rent in the UK?", a: "There is no statutory cap on how much you can increase AST rent, but it must be in line with 'the open market rent' or the tenant can challenge it at tribunal. In practice, most successful landlords limit increases to CPI (Consumer Price Index) or 5% to avoid disputes. The Renters Reform Act 2024 has further strengthened tenant rights to challenge above-market increases." },
  { q: "What notice do I need to give for a rent increase?", a: "You must use the official Section 13 notice (Form 4) available from GOV.UK. For monthly periodic tenancies, you need at least one month's notice. The increase cannot take effect less than a year after the tenancy started or less than a year after the last increase." },
  { q: "Can a tenant refuse a rent increase?", a: "Yes — a tenant can refer a Section 13 notice to the First-tier Tribunal (Property Chamber) within the notice period. The tribunal will determine the market rent, which could be the same as, higher than, or lower than the proposed increase. Until the tribunal decides, the old rent continues to be payable." },
  { q: "Can I include a rent review clause in an AST?", a: "Yes — you can include a rent review clause in the tenancy agreement that allows rent to be increased by a specified amount or formula (e.g., CPI annually). However, even with a review clause, many landlords still serve a Section 13 notice as best practice to formally document the change." },
];

export default function RentIncreasePage() {
  return (
    <>
      <section className="gradient-navy py-12 md:py-16">
        <div className="container-max px-4">
          <Breadcrumbs items={[{ label: "Calculators", href: "/calculators" }, { label: "Rent Increase" }]} />
          <p className="text-gold-400 font-semibold text-sm uppercase tracking-wider mb-2">Free Calculator</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Rent Increase Calculator</h1>
          <p className="text-navy-200 max-w-2xl">Calculate the impact of a rent increase and check your Section 13 notice requirements before serving formal notice.</p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max">
          <RentIncreaseCalculator />

          <div className="mt-8">
            <EmailResults />
          </div>

          <div className="mt-10 pt-8 border-t border-navy-200 space-y-4 max-w-3xl text-sm text-navy-600">
            <h2 className="text-xl font-bold text-navy-800">How to Increase Rent Legally in the UK</h2>
            <p>For most assured shorthold tenancies, a rent increase must be proposed using a Section 13 notice (Form 4). This form is available free from GOV.UK. You must give adequate notice (at least one month for monthly tenancies), and you can only raise rent once per year.</p>
            <p>Keeping increases in line with CPI or local market evidence is the safest approach — it minimises the risk of a tribunal challenge. If a tenant refers your notice to the First-tier Tribunal, the tribunal will set a market rent that applies from the date of your original notice.</p>
            <p>From 2025, the Renters Reform Act has strengthened tenant rights to challenge above-market increases. This makes a well-evidenced, market-rate increase even more important for landlords looking to avoid disputes.</p>
          </div>

          <div className="pt-4 border-t border-navy-200 not-prose mt-6">
            <p className="font-bold text-navy-800 mb-3 text-sm">Related Tools & Templates</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <Link href="/templates/section-13-notice" className="block bg-white rounded-lg border border-navy-100 p-3 text-center hover:shadow-md transition-all"><p className="font-semibold text-navy-800 text-xs">Section 13 Template</p><p className="text-xs text-navy-400 mt-0.5">Free download</p></Link>
              <Link href="/calculators/landlord-costs" className="block bg-white rounded-lg border border-navy-100 p-3 text-center hover:shadow-md transition-all"><p className="font-semibold text-navy-800 text-xs">Landlord Costs</p><p className="text-xs text-navy-400 mt-0.5">Full P&amp;L</p></Link>
              <Link href="/calculators/rental-yield" className="block bg-white rounded-lg border border-navy-100 p-3 text-center hover:shadow-md transition-all"><p className="font-semibold text-navy-800 text-xs">Rental Yield</p><p className="text-xs text-navy-400 mt-0.5">Gross &amp; net</p></Link>
            </div>
          </div>

          <FAQSchema faqs={faqs} />
          <Disclaimer type="legal" />
        </div>
      </section>
    </>
  );
}
