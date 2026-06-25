import { BlogArticleHero } from "@/components/blog/BlogArticleHero";
import Link from "next/link";
import type { Metadata } from "next";
import { Disclaimer } from "@/components/legal/Disclaimer";
import { FAQSchema } from "@/components/seo/FAQSchema";

export const metadata: Metadata = {
  title: "Stamp Duty UK — Complete Guide to Current SDLT Rates | PropertyVault UK",
  description: "Complete UK stamp duty guide. Current SDLT rates, first-time buyer relief, additional property surcharge, and how to calculate your stamp duty bill.",
  keywords: "stamp duty UK, SDLT rates, stamp duty calculator, first time buyer stamp duty, additional property surcharge, stamp duty 2025",
};

const faqs = [
  {
    q: "What are the current stamp duty rates in England?",
    a: "From 1 April 2025, the standard SDLT rates are: 0% on up to £125,000; 2% on £125,001–£250,000; 5% on £250,001–£925,000; 10% on £925,001–£1,500,000; and 12% above £1,500,000. These rates apply to each band rather than the whole purchase price, so a £300,000 property attracts SDLT of £5,000 (0% on first £125k, 2% on next £125k, 5% on final £50k).",
  },
  {
    q: "How much stamp duty do first-time buyers pay?",
    a: "First-time buyers in England pay no SDLT on the first £300,000 and 5% on the portion from £300,001 to £500,000. If the property costs more than £500,000, the relief does not apply and standard rates are charged from £0. The temporary higher thresholds (£425,000 nil-rate / £625,000 cap) ended on 31 March 2025.",
  },
  {
    q: "What is the additional property stamp duty surcharge?",
    a: "If you already own a property and are purchasing an additional one — such as a buy-to-let, second home, or investment property — you pay a 5% surcharge on the entire purchase price on top of the standard SDLT rates. This surcharge was increased from 3% to 5% on 31 October 2024. On a £250,000 investment property, the additional surcharge alone adds £12,500 to the stamp duty bill.",
  },
  {
    q: "When must stamp duty be paid after completing a property purchase?",
    a: "SDLT must be paid and a return filed with HMRC within 14 days of completion. Your solicitor or conveyancer normally handles this on your behalf using funds you transfer to them. Missing this deadline results in an automatic penalty of £100 (up to 3 months late), rising to £200 for over 3 months late, plus daily interest on the unpaid tax.",
  },
  {
    q: "Can you reclaim the stamp duty surcharge on a second property?",
    a: "Yes, if you paid the 5% additional property surcharge because your previous main home had not yet sold, you can reclaim it provided you sell the old main home within 3 years of paying the higher rate. You must contact HMRC within 12 months of the sale to claim the refund. This applies specifically to replacement main homes — buy-to-let surcharges are generally not reclaimable.",
  },
];

export default function StampDutyArticle() {
  return (
    <>
      <BlogArticleHero
        title="Stamp Duty UK — Complete Guide to Current Rates"
        excerpt="Current SDLT rates from April 2025, first-time buyer relief, additional property surcharge (+5%)."
        category="Finance"
        date="June 2026"
        readTime="5 min"
        image="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1400&q=80"
      />
      <article className="section-padding bg-white"><div className="container-max max-w-3xl prose-sm text-navy-600 leading-relaxed space-y-6">
        <p className="text-lg">Stamp Duty Land Tax (SDLT) is a tax you pay when you buy residential property in England or Northern Ireland above certain price thresholds. Scotland has Land and Buildings Transaction Tax (LBTT), and Wales has Land Transaction Tax (LTT) — different rates apply in those countries. Use our <Link href="/calculators/stamp-duty" className="text-gold-600 font-semibold">stamp duty calculator</Link> to find out exactly what you will owe on your purchase.</p>

        <h2 className="text-xl font-bold text-navy-800 mt-8" style={{ fontFamily: "var(--font-family-heading)" }}>Standard SDLT Rates (from 1 April 2025)</h2>
        <p>The nil-rate threshold reverted to £125,000 on 1 April 2025 (it was temporarily £250,000).</p>
        <div className="not-prose bg-navy-50 rounded-xl p-5">
          <table className="w-full text-sm"><thead><tr className="border-b border-navy-200"><th className="text-left py-2">Property Price Band</th><th className="text-left py-2">SDLT Rate</th></tr></thead><tbody>
            <tr className="border-b border-navy-200"><td className="py-2">Up to £125,000</td><td className="py-2">0%</td></tr>
            <tr className="border-b border-navy-200"><td className="py-2">£125,001 to £250,000</td><td className="py-2">2%</td></tr>
            <tr className="border-b border-navy-200"><td className="py-2">£250,001 to £925,000</td><td className="py-2">5%</td></tr>
            <tr className="border-b border-navy-200"><td className="py-2">£925,001 to £1,500,000</td><td className="py-2">10%</td></tr>
            <tr><td className="py-2">Over £1,500,000</td><td className="py-2">12%</td></tr>
          </tbody></table>
        </div>

        <h2 className="text-xl font-bold text-navy-800 mt-8" style={{ fontFamily: "var(--font-family-heading)" }}>Additional Property Surcharge</h2>
        <p>If you already own a property and are buying an additional one (buy-to-let, second home, investment), you pay a <strong>5% surcharge</strong> on top of the standard rates on the entire purchase price. This surcharge was increased from 3% to 5% on 31 October 2024.</p>

        <h2 className="text-xl font-bold text-navy-800 mt-8" style={{ fontFamily: "var(--font-family-heading)" }}>First-Time Buyer Relief (from 1 April 2025)</h2>
        <p>First-time buyers pay no SDLT on the first <strong>£300,000</strong> and 5% on the portion from £300,001 to £500,000. If the property costs more than £500,000, the relief does not apply and standard rates are charged.</p>
        <p>The temporary higher thresholds (£425,000 nil-rate / £625,000 cap) ended on 31 March 2025.</p>

        <h2 className="text-xl font-bold text-navy-800 mt-8" style={{ fontFamily: "var(--font-family-heading)" }}>First-Time Buyer Relief (from 1 April 2025)</h2>
        <p>First-time buyers pay no SDLT on the first <strong>£300,000</strong> and 5% on the portion from £300,001 to £500,000. If the property costs more than £500,000, the relief does not apply and standard rates are charged on the full amount from £0.</p>
        <p>The temporary higher thresholds (£425,000 nil-rate / £625,000 cap) ended on 31 March 2025.</p>

        <h2 className="text-xl font-bold text-navy-800 mt-8" style={{ fontFamily: "var(--font-family-heading)" }}>SDLT Examples — How Much Will You Pay?</h2>
        <div className="not-prose bg-navy-50 rounded-xl p-5">
          <table className="w-full text-sm"><thead><tr className="border-b border-navy-200"><th className="text-left py-2">Property Price</th><th className="text-right py-2">Standard (Owner)</th><th className="text-right py-2">Additional Property</th><th className="text-right py-2">First-Time Buyer</th></tr></thead><tbody>
            <tr className="border-b border-navy-100"><td className="py-2">£150,000</td><td className="py-2 text-right">£500</td><td className="py-2 text-right">£8,000</td><td className="py-2 text-right">£0</td></tr>
            <tr className="border-b border-navy-100"><td className="py-2">£250,000</td><td className="py-2 text-right">£2,500</td><td className="py-2 text-right">£15,000</td><td className="py-2 text-right">£0</td></tr>
            <tr className="border-b border-navy-100"><td className="py-2">£350,000</td><td className="py-2 text-right">£7,500</td><td className="py-2 text-right">£25,000</td><td className="py-2 text-right">£2,500</td></tr>
            <tr className="border-b border-navy-100"><td className="py-2">£500,000</td><td className="py-2 text-right">£15,000</td><td className="py-2 text-right">£40,000</td><td className="py-2 text-right">£10,000</td></tr>
            <tr><td className="py-2">£750,000</td><td className="py-2 text-right">£27,500</td><td className="py-2 text-right">£65,000</td><td className="py-2 text-right">N/A</td></tr>
          </tbody></table>
        </div>

        <h2 className="text-xl font-bold text-navy-800 mt-8" style={{ fontFamily: "var(--font-family-heading)" }}>Exemptions and Reliefs You Should Know About</h2>
        <p><strong>Transfers between spouses or civil partners</strong> carry no SDLT if no money changes hands. This is useful for tax planning — transferring a share in a property to a lower-earning partner creates no SDLT liability.</p>
        <p><strong>Gifted properties</strong> where no cash consideration changes hands carry no SDLT — but if the recipient takes on a mortgage, SDLT applies to the value of that mortgage.</p>
        <p><strong>Multiple dwellings relief</strong> allows buyers purchasing two or more properties in a single transaction to average the purchase price, potentially reducing SDLT. This was partially restricted in 2024 but still applies in some scenarios — consult a tax adviser.</p>
        <p><strong>Property purchased through a company</strong> by a corporate entity attracts a flat 15% SDLT rate if the residential property costs over £500,000 — an important consideration for investors thinking of using corporate structures.</p>

        <h2 className="text-xl font-bold text-navy-800 mt-8" style={{ fontFamily: "var(--font-family-heading)" }}>When Do You Have to Pay Stamp Duty?</h2>
        <p>SDLT must be paid and the return filed within <strong>14 days of completion</strong>. Your solicitor or conveyancer normally handles this on your behalf using funds you provide. Missing this deadline incurs an automatic penalty of £100 (under 3 months late) rising to £200 (over 3 months) plus daily interest on the unpaid amount.</p>

        <h2 className="text-xl font-bold text-navy-800 mt-8" style={{ fontFamily: "var(--font-family-heading)" }}>SDLT in Scotland and Wales</h2>
        <p>Scotland replaced SDLT with <strong>Land and Buildings Transaction Tax (LBTT)</strong> in April 2015. Wales replaced SDLT with <strong>Land Transaction Tax (LTT)</strong> in April 2018. Both have different rate structures and thresholds from SDLT. If you are buying in Scotland or Wales, use the relevant LBTT or LTT calculator rather than this SDLT guide.</p>

        <h2 className="text-xl font-bold text-navy-800 mt-8" style={{ fontFamily: "var(--font-family-heading)" }}>Can You Reclaim Stamp Duty?</h2>
        <p>You can reclaim the 5% additional property surcharge if you sell your previous main home within <strong>3 years</strong> of paying the higher rate. This applies if you paid the surcharge on a new main home because your existing main home had not yet sold. Contact HMRC within 12 months of the sale to claim the refund.</p>

        <h2 className="text-xl font-bold text-navy-800 mt-8" style={{ fontFamily: "var(--font-family-heading)" }}>Calculate Your Stamp Duty</h2>
        <p>Use our free calculator to work out your exact SDLT bill for standard purchases, additional properties, and first-time buyer relief:</p>
        <div className="not-prose mt-4">
          <Link href="/calculators/stamp-duty" className="btn-primary text-sm !py-2.5 !px-5">Stamp Duty Calculator →</Link>
        </div>

        
          <div className="mt-10 pt-8 border-t border-navy-200 not-prose">
            <h3 className="font-bold text-navy-800 mb-4">Related Articles</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              <Link href="/blog/first-time-buyer-guide" className="group block bg-white rounded-xl border border-navy-100 p-4 hover:shadow-md transition-all">
                <span className="text-xs font-bold text-navy-500">Buying</span>
                <p className="font-bold text-navy-800 text-sm group-hover:text-gold-600 transition-colors mt-1">First-Time Buyer Guide</p>
              </Link>
              <Link href="/blog/personal-vs-limited-company" className="group block bg-white rounded-xl border border-navy-100 p-4 hover:shadow-md transition-all">
                <span className="text-xs font-bold text-navy-500">Tax</span>
                <p className="font-bold text-navy-800 text-sm group-hover:text-gold-600 transition-colors mt-1">Personal vs Ltd Company</p>
              </Link>
            </div>
          </div>

          <FAQSchema faqs={faqs} />
          <Disclaimer type="calculator" />
      </div></article>
    </>
  );
}


