import Link from "next/link";
import type { Metadata } from "next";
import { Disclaimer } from "@/components/legal/Disclaimer";

export const metadata: Metadata = {
  title: "Stamp Duty UK — Complete Guide to Current SDLT Rates | PropertyVault UK",
  description: "Complete UK stamp duty guide. Current SDLT rates, first-time buyer relief, additional property surcharge, and how to calculate your stamp duty bill.",
  keywords: "stamp duty UK, SDLT rates, stamp duty calculator, first time buyer stamp duty, additional property surcharge, stamp duty 2025",
};

export default function StampDutyArticle() {
  return (
    <>
      <section className="gradient-navy py-12 md:py-16"><div className="container-max px-4"><div className="max-w-3xl">
        <Link href="/blog" className="text-gold-400 text-sm font-medium hover:text-gold-300 mb-3 inline-block">← Back to Blog</Link>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3" style={{ fontFamily: "var(--font-family-heading)" }}>Stamp Duty UK — Complete Guide to Current Rates</h1>
        <p className="text-navy-200">Everything you need to know about Stamp Duty Land Tax in England and Northern Ireland.</p>
      </div></div></section>

      <article className="section-padding bg-white"><div className="container-max max-w-3xl prose-sm text-navy-600 leading-relaxed space-y-6">
        <p className="text-lg">Stamp Duty Land Tax (SDLT) is a tax you pay when you buy residential property in England or Northern Ireland above certain price thresholds. Scotland has Land and Buildings Transaction Tax (LBTT), and Wales has Land Transaction Tax (LTT) — different rates apply in those countries.</p>

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

          <Disclaimer type="calculator" />
      </div></article>
    </>
  );
}

