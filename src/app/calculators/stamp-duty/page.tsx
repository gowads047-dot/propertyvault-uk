import { StampDutyCalculator } from "@/components/calculators/StampDutyCalculator";
import type { Metadata } from "next";
import { Disclaimer } from "@/components/legal/Disclaimer";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { EmailResults } from "@/components/calculators/EmailResults";
import { PrintButton } from "@/components/calculators/PrintButton";

const stampDutyFaqs = [
  { q: "How much is stamp duty on a £300,000 house?", a: "For a standard purchase at £300,000 from April 2025: £0 on the first £125,000, 2% on £125,001-£250,000 (£2,500), and 5% on £250,001-£300,000 (£2,500) = £5,000 total. First-time buyers pay £0 (nil rate up to £300,000)." },
  { q: "Do first-time buyers pay stamp duty?", a: "First-time buyers pay no stamp duty on the first £300,000 of a property purchase (from 1 April 2025). They pay 5% on the portion from £300,001 to £500,000. If the property costs more than £500,000, the relief does not apply." },
  { q: "What is the additional property surcharge?", a: "If you already own a property and are buying an additional one (buy-to-let, second home), you pay a 5% surcharge on top of standard SDLT rates. This was increased from 3% to 5% on 31 October 2024." },
  { q: "Does stamp duty apply in Scotland and Wales?", a: "No. SDLT only applies in England and Northern Ireland. Scotland has Land and Buildings Transaction Tax (LBTT) and Wales has Land Transaction Tax (LTT) — both have different rates and thresholds." },
  { q: "When do I pay stamp duty?", a: "SDLT must be paid within 14 days of completion. Your solicitor or conveyancer usually handles the payment and filing on your behalf as part of the conveyancing process." },
];

export const metadata: Metadata = {
  title: "Free Stamp Duty Calculator UK 2025 — SDLT for Buy-to-Let & First-Time Buyers | PropertyVault",
  description: "Calculate your stamp duty land tax (SDLT) instantly. Covers standard purchases, additional properties (+5% surcharge), and first-time buyer relief. Updated for 2025.",
};

export default function StampDutyPage() {
  return (
    <>
      <section className="bg-white py-16 md:py-20">
        <div className="container-max px-4">
          <Breadcrumbs items={[{ label: "Calculators", href: "/calculators" }, { label: "Stamp Duty" }]} />
          <p className="text-xs font-semibold text-navy-400 uppercase tracking-widest mb-3">Free Calculator</p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-navy-800 mb-4" style={{ fontFamily: "var(--font-family-heading)" }}>Stamp Duty Calculator (SDLT)</h1>
          <p className="text-navy-500 max-w-2xl">Calculate your Stamp Duty Land Tax for England and Northern Ireland. Includes standard rates, additional property surcharge, and first-time buyer relief.</p>
          <div className="mt-3"><PrintButton /></div>
        </div>
      </section>
      <div className="border-t border-navy-100" />
      <section className="section-padding bg-navy-50">
        <div className="container-max">
          <StampDutyCalculator />
          <div className="mt-8"><EmailResults /></div>
          <FAQSchema faqs={stampDutyFaqs} />
          <Disclaimer type="calculator" />
        </div>
      </section>

      <section className="section-padding bg-navy-50/50">
        <div className="container-max max-w-4xl">
          <h2 className="text-2xl font-bold text-navy-800 mb-6">UK Stamp Duty Rates Explained</h2>
          <div className="space-y-4 text-navy-600">
            <p>Stamp Duty Land Tax (SDLT) is a tax you pay when you buy residential property in England or Northern Ireland above a certain price threshold. Scotland has Land and Buildings Transaction Tax (LBTT), and Wales has Land Transaction Tax (LTT).</p>
            <h3 className="text-xl font-bold text-navy-800 mt-8">Standard Residential Rates (from 1 April 2025)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead><tr className="bg-navy-100"><th className="text-left p-3 font-semibold">Property Price Band</th><th className="text-left p-3 font-semibold">SDLT Rate</th></tr></thead>
                <tbody>
                  <tr className="border-b border-navy-100"><td className="p-3">Up to £125,000</td><td className="p-3">0%</td></tr>
                  <tr className="border-b border-navy-100"><td className="p-3">£125,001 to £250,000</td><td className="p-3">2%</td></tr>
                  <tr className="border-b border-navy-100"><td className="p-3">£250,001 to £925,000</td><td className="p-3">5%</td></tr>
                  <tr className="border-b border-navy-100"><td className="p-3">£925,001 to £1,500,000</td><td className="p-3">10%</td></tr>
                  <tr><td className="p-3">Over £1,500,000</td><td className="p-3">12%</td></tr>
                </tbody>
              </table>
            </div>
            <h3 className="text-xl font-bold text-navy-800 mt-8">Additional Property Surcharge</h3>
            <p>If you are buying an additional property (second home, buy-to-let investment, or any property where you already own another), you pay a 5% surcharge on top of the standard rates on the entire purchase price.</p>
            <h3 className="text-xl font-bold text-navy-800 mt-8">First-Time Buyer Relief (from 1 April 2025)</h3>
            <p>First-time buyers pay no SDLT on the first £300,000 and 5% on the portion from £300,001 to £500,000. If the property costs more than £500,000, first-time buyer relief does not apply and you pay the standard rates. Note: the temporary higher thresholds (£425,000 / £625,000) ended on 31 March 2025.</p>
          </div>
        </div>
      </section>
    </>
  );
}
