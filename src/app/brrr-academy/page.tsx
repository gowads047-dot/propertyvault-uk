import Link from "next/link";
import type { Metadata } from "next";
import { Disclaimer } from "@/components/legal/Disclaimer";

export const metadata: Metadata = {
  title: "BRRR Academy UK — Buy Refurbish Rent Refinance Strategy Guide | PropertyVault",
  description: "Master the BRRR strategy. Complete guide to buying below market value, refurbishing for profit, renting, and refinancing to recycle capital and scale your portfolio.",
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/brrr-academy/" },
  openGraph: {
    title: "BRRR Academy UK — Buy Refurbish Rent Refinance Strategy Guide | PropertyVault",
    description: "Master the BRRR strategy. Complete guide to buying below market value, refurbishing for profit, renting, and refinancing to recycle capital and scale your portfolio.",
    type: "article",
    url: "https://www.propertyvaultuk.co.uk/brrr-academy/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "BRRR Strategy UK Academy" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "BRRR Academy UK — Buy Refurbish Rent Refinance Strategy Guide | PropertyVault",
    description: "Master the BRRR strategy. Complete guide to buying below market value, refurbishing for profit, renting, and refinancing to recycle capital and scale your portfolio.",
  },
};

export default function BRRRAcademyPage() {
  return (
    <>
      <section className="gradient-navy py-16 md:py-24">
        <div className="container-max px-4">
          <div className="max-w-3xl">
            <p className="text-gold-400 font-semibold text-sm uppercase tracking-wider mb-3">BRRR Academy</p>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Master the BRRR Strategy</h1>
            <p className="text-navy-200 text-lg">Buy, Refurbish, Rent, Refinance — the proven method used by thousands of UK investors to scale property portfolios by recycling capital. Learn every step in detail.</p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max max-w-4xl">
          {/* BUY */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-navy-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-gold-400 font-bold text-2xl">B</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-navy-800">BUY — Below Market Value</h2>
                <p className="text-navy-500 text-sm">The foundation of every successful BRRR deal</p>
              </div>
            </div>
            <div className="space-y-4 text-navy-600 leading-relaxed">
              <p>The BRRR strategy only works when you purchase below market value (BMV). The discount at purchase is where your profit is made. You need to buy at a price that, after refurbishment, allows you to refinance and pull most or all of your capital back out.</p>
              <h3 className="text-lg font-bold text-navy-800 mt-6">Finding BMV Deals</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Estate agents</strong> — build relationships, be the first call for motivated sellers</li>
                <li><strong>Property auctions</strong> — many BMV properties sell at auction (Allsop, Savills, SDL, local auctioneers)</li>
                <li><strong>Direct-to-vendor</strong> — leaflet drops, letters, and social media targeting motivated sellers</li>
                <li><strong>Deal sourcers</strong> — pay a fee (typically £3,000-5,000) for a packaged BMV deal</li>
                <li><strong>Repossessions</strong> — banks and building societies selling repossessed stock</li>
                <li><strong>Probate properties</strong> — executors often want a quick sale</li>
              </ul>
              <h3 className="text-lg font-bold text-navy-800 mt-6">Area Analysis</h3>
              <p>Research your target area thoroughly. Check comparable sold prices on Rightmove and Land Registry, current rental values on OpenRent and SpareRoom, local employment and infrastructure plans, crime statistics, flood risk, and school ratings. All of these affect both value and rentability.</p>
            </div>
          </div>

          {/* REFURBISH */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-gold-400 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-navy-800 font-bold text-2xl">R</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-navy-800">REFURBISH — Add Value</h2>
                <p className="text-navy-500 text-sm">Transform the property to maximise its value</p>
              </div>
            </div>
            <div className="space-y-4 text-navy-600 leading-relaxed">
              <p>The refurbishment phase is where you add value. The goal is to spend strategically so that every pound invested returns more than a pound in increased property value. Focus on improvements that surveyors and valuers recognise.</p>
              <h3 className="text-lg font-bold text-navy-800 mt-6">High-Value Improvements</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Kitchen</strong> — new kitchen is the single biggest value driver (budget £3,000-8,000)</li>
                <li><strong>Bathroom</strong> — modern bathroom suite with tiling (budget £2,000-5,000)</li>
                <li><strong>Central heating</strong> — new boiler and radiators if needed (budget £2,500-4,000)</li>
                <li><strong>Rewire</strong> — often necessary in older properties (budget £2,500-4,500)</li>
                <li><strong>Decoration</strong> — neutral, modern colours throughout (budget £1,500-3,000)</li>
                <li><strong>Flooring</strong> — LVT or carpet throughout (budget £1,500-3,000)</li>
              </ul>
              <h3 className="text-lg font-bold text-navy-800 mt-6">Managing Your Refurbishment</h3>
              <p>Get at least three quotes for every trade. Use a detailed specification document so all contractors are pricing the same scope. Set up a payment schedule tied to milestones. Visit the property regularly and take photos to document progress. Budget a 10-15% contingency for unexpected costs.</p>
            </div>
          </div>

          {/* RENT */}
          <div className="mb-16">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-navy-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-gold-400 font-bold text-2xl">R</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-navy-800">RENT — Maximise Income</h2>
                <p className="text-navy-500 text-sm">Find great tenants and achieve top market rent</p>
              </div>
            </div>
            <div className="space-y-4 text-navy-600 leading-relaxed">
              <p>Once refurbished, the property needs to be let at the highest achievable market rent to a reliable tenant. The rental income must comfortably cover your refinanced mortgage payments with positive cash flow.</p>
              <h3 className="text-lg font-bold text-navy-800 mt-6">Tenant Finding</h3>
              <p>Advertise on Rightmove, Zoopla, and OpenRent. Take professional photos and write compelling listings. Screen tenants thoroughly with referencing checks (employment, previous landlord, credit). Consider Rent Guarantee Insurance for added protection.</p>
              <h3 className="text-lg font-bold text-navy-800 mt-6">Legal Compliance</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Deposit protection in a government-approved scheme within 30 days</li>
                <li>Gas Safety Certificate annually</li>
                <li>EICR (Electrical Installation Condition Report) every 5 years</li>
                <li>EPC rating of E or above (C required by 2030 — start planning upgrades now)</li>
                <li>How to Rent guide provided to tenants</li>
                <li>Right to Rent checks on all adult occupants</li>
              </ul>
            </div>
          </div>

          {/* REFINANCE */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-gold-400 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-navy-800 font-bold text-2xl">R</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-navy-800">REFINANCE — Recycle Capital</h2>
                <p className="text-navy-500 text-sm">Pull your money out and do it all again</p>
              </div>
            </div>
            <div className="space-y-4 text-navy-600 leading-relaxed">
              <p>The refinance stage is where the BRRR magic happens. A surveyor values your refurbished property at its new market value. You then take out a new mortgage (typically 75% LTV) against this higher value, using the funds to repay any bridging finance and return your original capital.</p>
              <h3 className="text-lg font-bold text-navy-800 mt-6">Example BRRR Deal</h3>
              <div className="bg-navy-50 rounded-xl p-6">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span>Purchase price</span><span className="font-bold">£120,000</span></div>
                  <div className="flex justify-between"><span>Refurbishment cost</span><span className="font-bold">£30,000</span></div>
                  <div className="flex justify-between"><span>SDLT (5% additional property surcharge)</span><span className="font-bold">£6,000</span></div>
                  <div className="flex justify-between"><span>Legal fees &amp; survey</span><span className="font-bold">£2,000</span></div>
                  <div className="flex justify-between border-t border-navy-200 pt-2 mt-2"><span className="font-bold">Total invested</span><span className="font-bold">£158,000</span></div>
                  <div className="flex justify-between mt-4"><span>After repair value (ARV)</span><span className="font-bold text-green-600">£200,000</span></div>
                  <div className="flex justify-between"><span>Refinance at 75% LTV</span><span className="font-bold">£150,000</span></div>
                  <div className="flex justify-between border-t border-navy-200 pt-2 mt-2"><span className="font-bold">Money left in deal</span><span className="font-bold text-gold-600">£8,000</span></div>
                  <div className="flex justify-between"><span>Capital recycled</span><span className="font-bold text-green-600">94.9%</span></div>
                  <div className="flex justify-between"><span>Equity created</span><span className="font-bold text-green-600">£50,000</span></div>
                </div>
              </div>
              <h3 className="text-lg font-bold text-navy-800 mt-6">Timing the Refinance</h3>
              <p>Most BTL lenders have a minimum 6-month ownership rule before refinancing (known as the &ldquo;6-month rule&rdquo;). Some specialist lenders offer &ldquo;day one refinance&rdquo; products. Plan your timeline to minimise the period on expensive bridging finance.</p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link href="/calculators/brrr" className="btn-primary text-lg !py-4 !px-8">Try the BRRR Calculator →</Link>
          </div>
        </div>
      </section>
      <section className="section-padding bg-navy-50">
        <div className="container-max max-w-4xl">
          <Disclaimer type="general" />
        </div>
      </section>
    </>
  );
}


