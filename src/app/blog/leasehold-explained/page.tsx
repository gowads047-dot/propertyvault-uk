import Link from "next/link";
import type { Metadata } from "next";
import { HelpCTA } from "@/components/blog/HelpCTA";

export const metadata: Metadata = {
  title: "Leasehold Property Explained — The Complete UK Buyer's Guide",
  description:
    "Everything UK buyers need to know about leasehold: lease lengths, extension costs, ground rent risks, marriage value, and how to avoid the most expensive mistakes.",
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/blog/leasehold-explained/" },
  openGraph: {
    title: "Leasehold Property Explained — The Complete UK Buyer's Guide",
    description: "Everything UK buyers need to know about leasehold: lease lengths, extension costs, ground rent risks, marriage value, and how to avoid the most expensive mistakes.",
    type: "article",
    url: "https://www.propertyvaultuk.co.uk/blog/leasehold-explained/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "Leasehold flat building exterior in the UK" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Leasehold Property Explained — The Complete UK Buyer's Guide",
    description: "Everything UK buyers need to know about leasehold: lease lengths, extension costs, ground rent risks, marriage value, and how to avoid the most expensive mistakes.",
  },
};

export default function LeaseholdExplained() {
  return (
    <main className="min-h-screen bg-[#0a1628] text-white">
      {/* Hero */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 60% 40%, #c9a84c 0%, transparent 60%)" }} />
        <div className="relative max-w-3xl mx-auto">
          <Link href="/blog" className="inline-flex items-center gap-2 text-[#c9a84c] text-sm mb-6 hover:underline">
            ← All Articles
          </Link>
          <div className="flex gap-2 mb-4">
            <span className="bg-[#c9a84c]/20 text-[#c9a84c] text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">Buying</span>
            <span className="bg-white/10 text-white/70 text-xs px-3 py-1 rounded-full">7 min read</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            Leasehold Property Explained — The Complete UK Buyer&apos;s Guide
          </h1>
          <p className="text-white/60 text-lg">
            By <span className="text-[#c9a84c]">Nass</span> · 5 July 2026
          </p>
        </div>
      </section>

      {/* Body */}
      <article className="max-w-3xl mx-auto px-6 pb-24 space-y-10">

        {/* Intro */}
        <p className="text-white/80 text-lg leading-relaxed">
          More than <strong className="text-white">4.98 million homes</strong> in England are leasehold — the majority being flats. Yet thousands of buyers sign on the dotted line without fully understanding what they&apos;re buying. This guide cuts through the jargon so you know exactly what questions to ask before you exchange.
        </p>

        {/* CTA Banner */}
        <div className="bg-[#c9a84c]/10 border border-[#c9a84c]/30 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-[#c9a84c] mb-1">Run the numbers before you buy</p>
            <p className="text-white/60 text-sm">Our Leasehold Calculator estimates extension premiums, lease depreciation and ground rent risk in seconds.</p>
          </div>
          <Link href="/calculators/leasehold"
            className="shrink-0 bg-[#c9a84c] hover:bg-[#b8973b] text-[#0a1628] font-bold px-5 py-2.5 rounded-xl transition-colors text-sm whitespace-nowrap">
            Open Calculator →
          </Link>
        </div>

        {/* Section 1 */}
        <section>
          <h2 className="text-2xl font-bold mb-3">1. Freehold vs Leasehold: What&apos;s the Difference?</h2>
          <p className="text-white/75 leading-relaxed mb-4">
            When you buy <strong className="text-white">freehold</strong>, you own the building and the land beneath it outright — forever. When you buy <strong className="text-white">leasehold</strong>, you own the right to occupy the property for a fixed number of years defined in the lease. The freeholder (landlord) retains ownership of the structure and land.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-white/50">
                  <th className="py-2 pr-6">Feature</th>
                  <th className="py-2 pr-6">Freehold</th>
                  <th className="py-2">Leasehold</th>
                </tr>
              </thead>
              <tbody className="text-white/75 divide-y divide-white/5">
                {[
                  ["Ownership duration", "Indefinite", "Fixed term (e.g. 125 yrs)"],
                  ["Ground rent", "None", "Potentially payable"],
                  ["Service charge", "None (usually)", "Annual payment to freeholder"],
                  ["Alterations", "Generally free", "Requires freeholder permission"],
                  ["Mortgageable below 70 yrs", "N/A", "Extremely difficult"],
                ].map(([f, fr, le]) => (
                  <tr key={f}>
                    <td className="py-2 pr-6 font-medium text-white">{f}</td>
                    <td className="py-2 pr-6">{fr}</td>
                    <td className="py-2">{le}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 2 */}
        <section>
          <h2 className="text-2xl font-bold mb-3">2. Why Lease Length Is Everything</h2>
          <p className="text-white/75 leading-relaxed mb-4">
            As a lease gets shorter, the property loses value — and fast. Lenders become increasingly cautious below 85 years, many refuse mortgages under 70 years, and some insurers start charging more. The table below shows how a <strong className="text-white">£300,000 property</strong> depreciates based purely on remaining lease:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { years: "125+ yrs", risk: "Safe", color: "text-green-400", pct: "~100%" },
              { years: "85 yrs", risk: "Watch", color: "text-yellow-400", pct: "~97%" },
              { years: "75 yrs", risk: "Caution", color: "text-orange-400", pct: "~90%" },
              { years: "60 yrs", risk: "Danger", color: "text-red-400", pct: "~75%" },
            ].map((r) => (
              <div key={r.years} className="bg-white/5 rounded-xl p-4 text-center">
                <p className="text-lg font-bold text-white">{r.years}</p>
                <p className={`text-sm font-semibold ${r.color}`}>{r.risk}</p>
                <p className="text-white/50 text-xs mt-1">~{r.pct} of value</p>
              </div>
            ))}
          </div>
          <p className="text-white/60 text-sm mt-3">
            Source: Savills / Gerald Eve relativity tables (2024 edition). Values are indicative and vary by location.
          </p>
        </section>

        {/* Section 3 */}
        <section>
          <h2 className="text-2xl font-bold mb-3">3. The 80-Year Cliff — Marriage Value</h2>
          <p className="text-white/75 leading-relaxed mb-4">
            The single most important number in leasehold is <strong className="text-white">80 years</strong>. Once a lease drops below this threshold, something called <strong className="text-white">marriage value</strong> kicks in.
          </p>
          <div className="bg-[#0f1b36] border border-white/10 rounded-2xl p-6">
            <p className="text-[#c9a84c] font-semibold mb-2">What is Marriage Value?</p>
            <p className="text-white/75 leading-relaxed">
              Marriage value is the increase in the property&apos;s value that results from extending the lease. Under the <em>Leasehold Reform, Housing and Urban Development Act 1993</em>, the freeholder is entitled to 50% of this increase when the lease has fewer than 80 years remaining. This can add <strong className="text-white">tens of thousands of pounds</strong> to the extension premium.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                <p className="text-green-400 font-semibold mb-1">≥ 80 years</p>
                <p className="text-white/60">No marriage value — extension premium is lower</p>
              </div>
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-red-400 font-semibold mb-1">&lt; 80 years</p>
                <p className="text-white/60">Marriage value applies — freeholder gets 50% of the gain</p>
              </div>
            </div>
          </div>
          <p className="text-white/75 leading-relaxed mt-4">
            <strong className="text-white">Practical advice:</strong> If a property has 83–84 years left on the lease, you should extend before it crosses the 80-year mark — waiting costs you significantly more. A statutory lease extension adds 90 years on top of what remains, so a property at 83 years would end up with 173 years.
          </p>
        </section>

        {/* Section 4 */}
        <section>
          <h2 className="text-2xl font-bold mb-3">4. How Extension Premiums Are Calculated</h2>
          <p className="text-white/75 leading-relaxed mb-4">
            Under the 1993 Act, the statutory formula for a lease extension premium has three components:
          </p>
          <div className="space-y-3">
            {[
              { n: "1", label: "Ground Rent Capitalisation", desc: "The present value of all future ground rent payments, discounted at a standard capitalisation rate (typically 5–6%)." },
              { n: "2", label: "Reversion Value", desc: "The freeholder&apos;s right to take back the property when the current lease expires, discounted to today&apos;s money." },
              { n: "3", label: "Marriage Value (if < 80 yrs)", desc: "50% of the extra value created by the extension — only applies when the lease is below 80 years." },
            ].map((s) => (
              <div key={s.n} className="flex gap-4 items-start bg-white/5 rounded-xl p-4">
                <span className="shrink-0 w-8 h-8 rounded-full bg-[#c9a84c]/20 text-[#c9a84c] font-bold flex items-center justify-center text-sm">{s.n}</span>
                <div>
                  <p className="font-semibold text-white mb-1">{s.label}</p>
                  <p className="text-white/60 text-sm">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-white/75 leading-relaxed mt-4">
            Beyond the premium, expect to pay <strong className="text-white">freeholder&apos;s legal and surveyor costs</strong> (usually £1,500–£3,000), your own solicitor&apos;s fees, and Land Registry fees. Budget for £3,000–£7,000 in total costs on top of the premium itself.
          </p>
        </section>

        {/* Section 5 */}
        <section>
          <h2 className="text-2xl font-bold mb-3">5. Ground Rent — The Ticking Time Bomb</h2>
          <p className="text-white/75 leading-relaxed mb-4">
            Ground rent became one of the biggest scandals in UK residential property over the last decade. Many new-build leases were sold with <em>doubling ground rent clauses</em> — where ground rent doubles every 10 or 15 years. A ground rent starting at £250/year can reach <strong className="text-white">£8,000/year</strong> within 50 years.
          </p>
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5">
            <p className="text-red-400 font-semibold mb-2">⚠️ Why It Matters More Than You Think</p>
            <ul className="space-y-2 text-white/75 text-sm">
              <li>• High or escalating ground rent makes a property <strong className="text-white">unmortgageable</strong> — most lenders won&apos;t lend if annual ground rent exceeds 0.1% of property value</li>
              <li>• Onerous ground rent leases are difficult to sell — buyers can&apos;t get a mortgage and cash buyers demand a discount</li>
              <li>• The <strong className="text-white">Leasehold Reform (Ground Rent) Act 2022</strong> banned ground rents above a peppercorn for new residential leases — but this doesn&apos;t apply to existing leases</li>
            </ul>
          </div>
          <p className="text-white/75 leading-relaxed mt-4">
            Always check the ground rent review clause in the lease before you buy. If it doubles, RPI-linked, or has any escalating mechanism, treat it as a red flag and price in the cost of a lease extension.
          </p>
        </section>

        {/* Section 6 */}
        <section>
          <h2 className="text-2xl font-bold mb-3">6. Service Charges & Estate Charges</h2>
          <p className="text-white/75 leading-relaxed mb-4">
            In addition to ground rent, leaseholders typically pay an annual <strong className="text-white">service charge</strong> to cover maintenance of shared areas: roof, lifts, communal gardens, insurance of the building, concierge, etc.
          </p>
          <p className="text-white/75 leading-relaxed">
            Service charges vary enormously — from £500/year for a modest flat to £5,000+/year in a managed block with a concierge. Always ask for the <strong className="text-white">last 3 years of service charge accounts</strong> and any planned major works. Major works like roof replacement or lift modernisation can generate <strong className="text-white">Section 20 notices</strong> demanding thousands from leaseholders at short notice.
          </p>
        </section>

        {/* Section 7 */}
        <section>
          <h2 className="text-2xl font-bold mb-3">7. Your Rights as a Leaseholder</h2>
          <div className="space-y-3">
            {[
              { right: "Statutory Lease Extension", detail: "After owning the property for 2 years, you have the legal right to extend the lease by 90 years at a nil ground rent. The freeholder cannot refuse." },
              { right: "Collective Enfranchisement", detail: "If at least 50% of flat owners in a building agree, you can collectively purchase the freehold. This gives you control over service charges and the building." },
              { right: "Right to Manage (RTM)", detail: "Leaseholders can take over management of the building without purchasing the freehold — giving control over service charges and contractors." },
              { right: "First Refusal", detail: "If the freeholder decides to sell the freehold, leaseholders have the right of first refusal to buy it at the same price." },
            ].map((r) => (
              <div key={r.right} className="border-l-2 border-[#c9a84c] pl-4">
                <p className="font-semibold text-white">{r.right}</p>
                <p className="text-white/65 text-sm mt-0.5">{r.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 8 */}
        <section>
          <h2 className="text-2xl font-bold mb-3">8. The Leasehold Reform Act 2024 — What&apos;s Changing</h2>
          <p className="text-white/75 leading-relaxed mb-4">
            The <strong className="text-white">Leasehold and Freehold Reform Act 2024</strong> passed in May 2024 (just before the general election) and introduces significant changes:
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { icon: "✅", title: "2-year wait abolished", desc: "Leaseholders can now extend their lease or buy the freehold from day one of ownership." },
              { icon: "✅", title: "Marriage value removed", desc: "Marriage value will no longer be payable when extending a lease — saving potentially thousands. (Implementation date pending secondary legislation.)" },
              { icon: "✅", title: "Extension lengthened", desc: "Houses will be able to extend by 990 years (up from 50 years) at nil ground rent." },
              { icon: "✅", title: "Transparency on service charges", desc: "Freeholders must provide clearer breakdowns of service charges and justify major works." },
            ].map((c) => (
              <div key={c.title} className="bg-white/5 rounded-xl p-4">
                <p className="text-xl mb-2">{c.icon}</p>
                <p className="font-semibold text-white text-sm mb-1">{c.title}</p>
                <p className="text-white/60 text-xs leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-white/60 text-sm mt-4">
            Note: Much of the Act&apos;s most impactful reform (removal of marriage value) requires secondary legislation before it takes effect. Always verify the current position with a solicitor at the time of purchase.
          </p>
        </section>

        {/* Section 9 */}
        <section>
          <h2 className="text-2xl font-bold mb-3">9. Buying Leasehold — Due Diligence Checklist</h2>
          <p className="text-white/75 mb-4">Before exchanging on any leasehold property, verify all of the following:</p>
          <div className="space-y-2">
            {[
              "Years remaining on the lease (aim for 90+ to avoid immediate extension costs)",
              "Ground rent amount and review clause (reject doubling or onerous RPI clauses)",
              "Annual service charge — request 3 years of accounts",
              "Any pending Section 20 major works notices",
              "Whether building is cladded and has an EWS1 certificate if over 18m",
              "Freeholder identity — is it a professional company or absentee freeholder?",
              "Any restrictions on subletting, pets, or alterations in the lease",
              "Building insurance premium and whether your flat is covered",
              "Whether a share of freehold or Right to Manage company exists",
              "Cost estimate for a lease extension (use our calculator below)",
            ].map((item, i) => (
              <div key={i} className="flex gap-3 items-start">
                <span className="shrink-0 mt-1 w-5 h-5 rounded border border-[#c9a84c]/40 flex items-center justify-center text-[#c9a84c] text-xs font-bold">✓</span>
                <p className="text-white/75 text-sm">{item}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 10 */}
        <section>
          <h2 className="text-2xl font-bold mb-3">10. Is Leasehold Worth Buying?</h2>
          <p className="text-white/75 leading-relaxed mb-4">
            Leasehold is not inherently bad — the vast majority of UK flats are leasehold, and millions of people live perfectly happily in them. The risks are real but manageable if you go in with open eyes:
          </p>
          <div className="grid sm:grid-cols-3 gap-3">
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
              <p className="text-green-400 font-semibold mb-2">Low Risk</p>
              <ul className="text-white/65 text-xs space-y-1">
                <li>• 90+ years remaining</li>
                <li>• Peppercorn or low fixed ground rent</li>
                <li>• Responsive, reputable freeholder</li>
                <li>• Share of freehold available</li>
              </ul>
            </div>
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
              <p className="text-yellow-400 font-semibold mb-2">Proceed With Care</p>
              <ul className="text-white/65 text-xs space-y-1">
                <li>• 80–89 years (price in extension)</li>
                <li>• RPI-linked ground rent</li>
                <li>• Service charge rising sharply</li>
                <li>• Offshore or hard-to-reach freeholder</li>
              </ul>
            </div>
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
              <p className="text-red-400 font-semibold mb-2">Avoid or Renegotiate</p>
              <ul className="text-white/65 text-xs space-y-1">
                <li>• Below 70 years</li>
                <li>• Doubling ground rent clause</li>
                <li>• Major cladding/EWS1 issues</li>
                <li>• Pending large Section 20 works</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <div className="bg-gradient-to-r from-[#c9a84c]/20 to-transparent border border-[#c9a84c]/30 rounded-2xl p-8 text-center">
          <h3 className="text-xl font-bold mb-2">Ready to Run the Numbers?</h3>
          <p className="text-white/60 mb-6 max-w-md mx-auto text-sm">
            Use our free Leasehold Calculator to estimate the extension premium, see how the lease discount affects your property value, and assess ground rent risk — all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/calculators/leasehold"
              className="bg-[#c9a84c] hover:bg-[#b8973b] text-[#0a1628] font-bold px-8 py-3 rounded-xl transition-colors">
              Leasehold Calculator →
            </Link>
            <Link href="/calculators/deal-analyser"
              className="bg-white/10 hover:bg-white/15 text-white font-semibold px-8 py-3 rounded-xl transition-colors">
              Deal Analyser
            </Link>
          </div>
        </div>

        {/* Related articles */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-white/70">Related Articles</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { title: "Understanding Stamp Duty in 2025", href: "/blog", cat: "Buying" },
              { title: "How to Analyse a Buy-to-Let Deal", href: "/blog", cat: "Investing" },
            ].map((a) => (
              <Link key={a.title} href={a.href}
                className="group bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 transition-colors">
                <p className="text-[#c9a84c] text-xs font-semibold mb-1">{a.cat}</p>
                <p className="text-white font-medium group-hover:text-[#c9a84c] transition-colors">{a.title}</p>
              </Link>
            ))}
          </div>
        </div>
        <HelpCTA />
      </article>
    </main>
  );
}
