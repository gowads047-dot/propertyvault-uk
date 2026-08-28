import Link from "next/link";
import type { Metadata } from "next";
import { HelpCTA } from "@/components/blog/HelpCTA";

export const metadata: Metadata = {
  title: "Rent-to-Rent Explained — The Complete UK Guide 2026",
  description:
    "Everything you need to know about Rent-to-Rent in the UK: how it works, the 3 models, legal requirements, how much you can earn, and how to get your first deal.",
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/blog/rent-to-rent-explained/" },
  openGraph: {
    title: "Rent-to-Rent Explained — The Complete UK Guide 2026",
    description: "Everything you need to know about Rent-to-Rent in the UK: how it works, the 3 models, legal requirements, how much you can earn, and how to get your first deal.",
    type: "article",
    url: "https://www.propertyvaultuk.co.uk/blog/rent-to-rent-explained/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "Rent-to-rent property agreement and strategy guide UK" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rent-to-Rent Explained — The Complete UK Guide 2026",
    description: "Everything you need to know about Rent-to-Rent in the UK: how it works, the 3 models, legal requirements, how much you can earn, and how to get your first deal.",
  },
};

export default function RentToRentBlog() {
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
            <span className="bg-[#c9a84c]/20 text-[#c9a84c] text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">Investing</span>
            <span className="bg-white/10 text-white/70 text-xs px-3 py-1 rounded-full">10 min read</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            Rent-to-Rent Explained —<br />The Complete UK Guide 2026
          </h1>
          <p className="text-white/60 text-lg">
            By <span className="text-[#c9a84c]">Nass</span> · 5 July 2026
          </p>
        </div>
      </section>

      {/* Body */}
      <article className="max-w-3xl mx-auto px-6 pb-24 space-y-12">

        {/* Intro */}
        <p className="text-white/80 text-lg leading-relaxed">
          You don&apos;t need a six-figure deposit to build a property income. Rent-to-Rent (R2R) is a strategy that lets you control properties, collect rent, and profit — without ever getting a mortgage. In 2026, with house prices still stretched and mortgage rates still elevated, it&apos;s one of the most accessible entry points into UK property. But it&apos;s also one of the most misunderstood. This article gives you the full picture.
        </p>

        {/* Full Guide CTA */}
        <div className="bg-[#c9a84c]/10 border border-[#c9a84c]/30 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-[#c9a84c] mb-1">Want the complete step-by-step guide?</p>
            <p className="text-white/60 text-sm">Phone scripts, 12-step launch guide, legal checklist, and financial models — all on one page.</p>
          </div>
          <Link href="/rent-to-rent"
            className="shrink-0 bg-[#c9a84c] hover:bg-[#b8973b] text-[#0a1628] font-bold px-5 py-2.5 rounded-xl transition-colors text-sm whitespace-nowrap">
            Full R2R Guide →
          </Link>
        </div>

        {/* Section 1 */}
        <section>
          <h2 className="text-2xl font-bold mb-3">1. What Is Rent-to-Rent?</h2>
          <p className="text-white/75 leading-relaxed mb-4">
            Rent-to-Rent is simple in concept: you <strong className="text-white">lease a property from a landlord</strong> at a fixed monthly amount, then <strong className="text-white">sublet it to tenants at a higher rate</strong>. The difference between what you pay out and what comes in is your profit.
          </p>
          <p className="text-white/75 leading-relaxed mb-4">
            You never buy the property. You never need a mortgage. Your capital goes towards setup costs — furnishing, deposits, insurance — rather than a 25% deposit on a £250,000 flat.
          </p>
          <div className="bg-[#0f1b36] rounded-2xl p-6 border border-white/10">
            <p className="text-white/50 text-xs uppercase tracking-wider mb-4">The Basic Model</p>
            <div className="space-y-3 text-sm">
              {[
                { step: "1", label: "You find a motivated landlord", detail: "Someone struggling with voids, maintenance, or management headaches" },
                { step: "2", label: "You offer them guaranteed rent", detail: "Typically 10–20% below market rent — but with no voids and no management fees" },
                { step: "3", label: "You sign a Head Lease", detail: "A legal agreement making you the leaseholder, with the right to sublet" },
                { step: "4", label: "You furnish and let the property", detail: "Room by room (HMO), per night (SA), or as a single let to corporate tenants" },
                { step: "5", label: "You pocket the margin", detail: "The difference between what the property generates and what you pay the landlord" },
              ].map((s) => (
                <div key={s.step} className="flex gap-3 items-start">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-[#c9a84c]/20 text-[#c9a84c] font-bold flex items-center justify-center text-xs">{s.step}</span>
                  <div>
                    <span className="font-semibold text-white">{s.label} </span>
                    <span className="text-white/55">— {s.detail}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 2 */}
        <section>
          <h2 className="text-2xl font-bold mb-3">2. Is Rent-to-Rent Legal?</h2>
          <p className="text-white/75 leading-relaxed mb-4">
            Yes — completely legal. But only when done transparently and with the correct legal framework in place. There are two ways to do R2R: the right way and the wrong way. The wrong way is unfortunately how many beginners start.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-5">
              <p className="text-green-400 font-bold mb-3">✅ Legal R2R</p>
              <ul className="space-y-2 text-white/70 text-sm">
                <li>• Landlord knows and agrees to the subletting</li>
                <li>• Mortgage lender gives written consent</li>
                <li>• Head Lease Agreement in place (not a standard AST)</li>
                <li>• You issue compliant ASTs to your subtenants</li>
                <li>• Deposits protected, Right to Rent checks done</li>
                <li>• Specialist R2R insurance in force</li>
                <li>• HMO licence obtained if required</li>
              </ul>
            </div>
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-5">
              <p className="text-red-400 font-bold mb-3">❌ Illegal / Risky R2R</p>
              <ul className="space-y-2 text-white/70 text-sm">
                <li>• Subletting without landlord&apos;s knowledge (fraud)</li>
                <li>• No mortgage lender consent obtained</li>
                <li>• Using a standard AST as the agreement with landlord</li>
                <li>• No HMO licence when one is required</li>
                <li>• Standard landlord insurance only (won&apos;t pay out)</li>
                <li>• No deposit protection for subtenants</li>
                <li>• No Right to Rent checks carried out</li>
              </ul>
            </div>
          </div>
          <p className="text-white/75 leading-relaxed mt-4">
            The legal requirements are not complicated — but they are non-negotiable. The most commonly skipped step is getting the mortgage lender&apos;s written consent. Without it, the landlord is in breach of their mortgage terms and the lender can demand full repayment of the loan. This ends your deal immediately and exposes you to serious liability.
          </p>
        </section>

        {/* Section 3 */}
        <section>
          <h2 className="text-2xl font-bold mb-3">3. The 3 R2R Models</h2>
          <p className="text-white/75 leading-relaxed mb-6">
            Not all R2R is the same. There are three main models, and the right one depends on your area, your capital, and how much time you want to put in.
          </p>

          <div className="space-y-6">
            {/* HMO */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">🏘️</span>
                <div>
                  <h3 className="font-bold text-white text-lg">HMO Rent-to-Rent</h3>
                  <p className="text-[#c9a84c] text-sm">Highest margins — most setup work</p>
                </div>
              </div>
              <p className="text-white/70 leading-relaxed mb-4">
                You lease a house, furnish each bedroom individually, and let to separate working professionals on individual ASTs. Each room generates its own income stream. A 5-bed house let as an HMO typically generates 40–60% more revenue than if let as a single household.
              </p>
              <div className="bg-[#0a1628] rounded-xl p-4 text-sm">
                <p className="text-white/40 mb-2 uppercase text-xs tracking-wider">Example numbers</p>
                <div className="grid grid-cols-2 gap-1 text-white/70">
                  <span>You pay landlord</span><span className="text-white">£900/month</span>
                  <span>5 rooms × £550/room</span><span className="text-green-400">+£2,750/month</span>
                  <span>Bills + running costs</span><span className="text-red-400">−£450/month</span>
                  <span className="font-bold text-white">Monthly profit</span><span className="font-bold text-[#c9a84c]">~£1,400/month</span>
                </div>
              </div>
              <p className="text-white/50 text-xs mt-3">Requires HMO licence for 3+ unrelated tenants. Check your council&apos;s specific rules.</p>
            </div>

            {/* SA */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">🏨</span>
                <div>
                  <h3 className="font-bold text-white text-lg">Serviced Accommodation R2R</h3>
                  <p className="text-[#c9a84c] text-sm">High nightly rates — location-dependent</p>
                </div>
              </div>
              <p className="text-white/70 leading-relaxed mb-4">
                You lease a property, furnish it to a high standard, and list it on Airbnb, Booking.com, and direct booking platforms. You charge per night rather than per month. In the right location — city centres, tourist towns, near hospitals or business parks — the revenue far exceeds a standard monthly rent.
              </p>
              <div className="bg-[#0a1628] rounded-xl p-4 text-sm">
                <p className="text-white/40 mb-2 uppercase text-xs tracking-wider">Example numbers (city centre flat)</p>
                <div className="grid grid-cols-2 gap-1 text-white/70">
                  <span>You pay landlord</span><span className="text-white">£1,100/month</span>
                  <span>£95/night × 70% occupancy</span><span className="text-green-400">+£1,995/month</span>
                  <span>Platform fees + cleaning</span><span className="text-red-400">−£400/month</span>
                  <span className="font-bold text-white">Monthly profit</span><span className="font-bold text-[#c9a84c]">~£495/month</span>
                </div>
              </div>
              <p className="text-white/50 text-xs mt-3">Some councils have introduced Article 4 directions restricting short-term letting. Check before committing.</p>
            </div>

            {/* Single Let */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">🏠</span>
                <div>
                  <h3 className="font-bold text-white text-lg">Single-Let R2R</h3>
                  <p className="text-[#c9a84c] text-sm">Easiest entry point — slimmer margins</p>
                </div>
              </div>
              <p className="text-white/70 leading-relaxed mb-4">
                You lease a property and sublet it to a single household — a family, a couple, or a young professional. The margin is slim (£150–£300/month typically), but this is the simplest model with the least compliance burden. It&apos;s the best starting point for absolute beginners who want to learn the model before scaling into HMO.
              </p>
              <div className="bg-[#0a1628] rounded-xl p-4 text-sm">
                <p className="text-white/40 mb-2 uppercase text-xs tracking-wider">Example numbers (corporate let)</p>
                <div className="grid grid-cols-2 gap-1 text-white/70">
                  <span>You pay landlord</span><span className="text-white">£950/month</span>
                  <span>Corporate tenant pays</span><span className="text-green-400">+£1,200/month</span>
                  <span>Running costs</span><span className="text-red-400">−£75/month</span>
                  <span className="font-bold text-white">Monthly profit</span><span className="font-bold text-[#c9a84c]">~£175/month</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4 */}
        <section>
          <h2 className="text-2xl font-bold mb-3">4. Who Does R2R Work For?</h2>
          <p className="text-white/75 leading-relaxed mb-4">
            R2R is not a passive strategy. It&apos;s a business. You are a property operator, not a buy-and-hold investor. The profile of someone who succeeds at R2R:
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { label: "Limited capital", detail: "Can't afford a BTL deposit but has £3–8k to invest in setup" },
              { label: "Hands-on approach", detail: "Willing to manage tenants, maintenance, and relationships actively" },
              { label: "Business mindset", detail: "Treats each property as a P&L — not a passive income source" },
              { label: "Local knowledge", detail: "Knows their target area, room rates, demand pockets" },
              { label: "Long-term view", detail: "Building systems and scale over 2–3 years, not overnight" },
              { label: "Compliance-conscious", detail: "Takes the legal side seriously — licences, contracts, insurance" },
            ].map((c) => (
              <div key={c.label} className="flex gap-3 bg-white/5 border border-white/10 rounded-xl p-4">
                <span className="text-[#c9a84c] mt-0.5 shrink-0">✓</span>
                <div>
                  <p className="font-semibold text-white text-sm">{c.label}</p>
                  <p className="text-white/55 text-xs mt-0.5">{c.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 5 */}
        <section>
          <h2 className="text-2xl font-bold mb-3">5. How Much Can You Actually Earn?</h2>
          <p className="text-white/75 leading-relaxed mb-4">
            The honest answer: less than the gurus claim in the short term, more than most people expect in the medium term.
          </p>
          <p className="text-white/75 leading-relaxed mb-4">
            On a well-run 5-bed HMO R2R, you&apos;re targeting <strong className="text-white">£600–£1,200/month profit per property</strong> after all costs. A 2-bed SA in a strong location might make <strong className="text-white">£400–£700/month</strong>. Single-let R2R rarely makes more than <strong className="text-white">£150–£300/month</strong> but demands very little of your time.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-white/40 text-xs uppercase tracking-wider">
                  <th className="text-left py-2 pr-4">Model</th>
                  <th className="text-left py-2 pr-4">Startup cost</th>
                  <th className="text-left py-2 pr-4">Monthly profit</th>
                  <th className="text-left py-2">Time input</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-white/70">
                <tr><td className="py-3 pr-4 font-medium text-white">HMO R2R (5 bed)</td><td className="py-3 pr-4">£6,000–£12,000</td><td className="py-3 pr-4 text-[#c9a84c] font-semibold">£600–£1,200</td><td className="py-3">High</td></tr>
                <tr><td className="py-3 pr-4 font-medium text-white">SA R2R (2 bed)</td><td className="py-3 pr-4">£4,000–£8,000</td><td className="py-3 pr-4 text-[#c9a84c] font-semibold">£400–£700</td><td className="py-3">Medium–High</td></tr>
                <tr><td className="py-3 pr-4 font-medium text-white">Single-Let R2R</td><td className="py-3 pr-4">£1,500–£3,000</td><td className="py-3 pr-4 text-[#c9a84c] font-semibold">£150–£300</td><td className="py-3">Low</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-white/55 text-sm mt-3">With 5 well-run HMO R2R properties, monthly profit of £3,000–£6,000 is realistic within 18–24 months of starting. That&apos;s the salary-replacement figure most operators aim for.</p>
        </section>

        {/* Section 6 */}
        <section>
          <h2 className="text-2xl font-bold mb-3">6. The Head Lease — The Most Important Document</h2>
          <p className="text-white/75 leading-relaxed mb-4">
            Most R2R operators get the agreement wrong, and it costs them everything. There are two types of document and they are <em>not</em> interchangeable:
          </p>
          <div className="space-y-4">
            <div className="border-l-4 border-red-500 pl-4">
              <p className="font-bold text-white">Assured Shorthold Tenancy (AST) — do NOT use for R2R</p>
              <p className="text-white/65 text-sm mt-1">An AST makes you a tenant of the property. You have no legal right to sublet. If you sublet using only an AST as your agreement with the landlord, you are in breach of contract and potentially committing fraud. Yet this is what many uninformed operators use.</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <p className="font-bold text-white">Head Lease Agreement — the correct document</p>
              <p className="text-white/65 text-sm mt-1">A Head Lease makes you a leaseholder with the express right to sublet. You become your subtenants&apos; landlord in law. You then issue separate ASTs to each subtenant. This is the legally correct structure and the only one that properly protects everyone involved. Always have it drafted or reviewed by a property solicitor.</p>
            </div>
          </div>
        </section>

        {/* Section 7 */}
        <section>
          <h2 className="text-2xl font-bold mb-3">7. The Mortgage Lender Consent Problem</h2>
          <p className="text-white/75 leading-relaxed mb-4">
            This is the step the YouTube gurus gloss over because it&apos;s less exciting than talking about profit margins. It is also the step that determines whether your deal is safe or a ticking time bomb.
          </p>
          <p className="text-white/75 leading-relaxed mb-4">
            Most mortgage agreements — both residential and buy-to-let — contain a clause prohibiting subletting without the lender&apos;s consent. If a landlord signs a head lease with you without getting that consent, they are in breach of their mortgage. The lender can:
          </p>
          <ul className="space-y-2 text-white/70 text-sm mb-4">
            <li className="flex gap-2"><span className="text-red-400 shrink-0">→</span> Demand immediate repayment of the outstanding mortgage balance</li>
            <li className="flex gap-2"><span className="text-red-400 shrink-0">→</span> Void the insurance policy on the property</li>
            <li className="flex gap-2"><span className="text-red-400 shrink-0">→</span> Begin repossession proceedings</li>
          </ul>
          <div className="bg-[#0f1b36] border border-white/10 rounded-xl p-5">
            <p className="font-semibold text-[#c9a84c] mb-2">What you need to do:</p>
            <p className="text-white/70 text-sm leading-relaxed">The landlord writes to their mortgage lender explaining that they wish to sublet the property to a management company on a Head Lease basis. Most buy-to-let lenders will grant this (sometimes with a small admin fee). Residential lenders are more likely to refuse — in which case the landlord would need to switch to a BTL mortgage first. You get written confirmation of consent. You keep that letter with your head lease. You never take possession of the property without it.</p>
          </div>
        </section>

        {/* Section 8 */}
        <section>
          <h2 className="text-2xl font-bold mb-3">8. How to Find R2R Properties</h2>
          <p className="text-white/75 leading-relaxed mb-4">
            The properties are out there. You just need to approach this systematically and with patience. R2R is a numbers game — you might speak to 30 landlords before signing your first deal.
          </p>
          <div className="space-y-3">
            {[
              { source: "Estate agents — lettings departments", tactic: "Call every letting agent in your target area. Ask for the lettings manager. Tell them you offer guaranteed rent to landlords. Build relationships — agents who trust you will send referrals regularly." },
              { source: "Rightmove & Zoopla — private landlords", tactic: "Look for listings where a landlord is advertising directly (no agent listed). Call them. They're clearly motivated enough to do it themselves — which means they're more open to alternatives." },
              { source: "Facebook groups", tactic: "Post in local community and property groups: 'We offer guaranteed rent to landlords in [area] — no voids, no management fees, no hassle.' You'll get more responses than you expect." },
              { source: "SpareRoom — landlord side", tactic: "Many landlords list rooms on SpareRoom. Message them to introduce your model. They're already thinking about room lets — your offer is an easier version of what they're doing." },
              { source: "Property networking events", tactic: "Attend local pin meetings (PinMeetup.co.uk) and property investor events. Landlords who are tired of management headaches are a perfect fit. Deals done face-to-face close faster." },
              { source: "TO LET boards", tactic: "Walk or drive through your target streets. Note addresses of TO LET boards — especially ones that have been up for weeks. These landlords have void properties right now." },
            ].map((s, i) => (
              <div key={i} className="border-l-2 border-[#c9a84c]/40 pl-4">
                <p className="font-semibold text-white text-sm">{s.source}</p>
                <p className="text-white/60 text-sm mt-0.5">{s.tactic}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 9 */}
        <section>
          <h2 className="text-2xl font-bold mb-3">9. What to Say to Landlords and Agents</h2>
          <p className="text-white/75 leading-relaxed mb-4">
            The pitch is simple. Landlords have two problems: voids (empty property = no income) and management (dealing with tenants is a job). Your model solves both. Lead with the solution, not the mechanism.
          </p>
          <div className="bg-[#0f1b36] border border-[#c9a84c]/20 rounded-2xl p-6 space-y-4">
            <div>
              <p className="text-[#c9a84c] text-xs font-bold uppercase tracking-wider mb-2">Opening line to a landlord</p>
              <p className="text-white/85 italic text-sm leading-relaxed">&ldquo;We pay you a guaranteed rent every month — whether your property is occupied or not. You never deal with a tenant, a maintenance call, or a void period again. I&apos;d love 20 minutes to show you how it works. There&apos;s no commitment whatsoever — just a conversation.&rdquo;</p>
            </div>
            <div>
              <p className="text-[#c9a84c] text-xs font-bold uppercase tracking-wider mb-2">Opening line to an agent</p>
              <p className="text-white/85 italic text-sm leading-relaxed">&ldquo;We work with landlords who want a guaranteed rent and zero management. We take properties on long-term leases, pay the landlord every month regardless of occupancy, and handle everything from our side. We&apos;re looking for properties in [area] — do you have landlords who might be a good fit?&rdquo;</p>
            </div>
          </div>
          <div className="mt-4">
            <Link href="/rent-to-rent#scripts"
              className="inline-flex items-center gap-2 text-[#c9a84c] font-semibold hover:underline text-sm">
              See the full word-for-word phone scripts →
            </Link>
          </div>
        </section>

        {/* Section 10 */}
        <section>
          <h2 className="text-2xl font-bold mb-3">10. The Risks — Honest Assessment</h2>
          <p className="text-white/75 leading-relaxed mb-4">
            R2R is genuinely a good strategy. It&apos;s also not without risk. Be clear-eyed about these before you start:
          </p>
          <div className="space-y-4">
            {[
              { risk: "You pay rent whether the property is occupied or not", mitigation: "This is the whole point of your proposition to the landlord — but it also means you absorb the void risk. Never commit to a rent figure that doesn&apos;t work at 70% occupancy." },
              { risk: "The landlord can sell the property", mitigation: "Your head lease should contain a clause protecting you if the landlord sells — either the buyer takes on the lease, or you receive adequate notice and compensation. Get this in writing." },
              { risk: "Setup costs run over budget", mitigation: "Get proper quotes before signing. Budget 20% contingency. First-time operators consistently underestimate furnishing and compliance costs." },
              { risk: "Problem subtenants become your problem", mitigation: "You are the landlord. Eviction, damage, noise complaints — all land with you. Vet tenants properly. Run credit checks, request references, and trust your instincts at viewings." },
              { risk: "Council licensing changes mid-lease", mitigation: "Monitor your council&apos;s licensing consultations. Article 4 directions for SA are being rolled out in more cities. Build this risk into your planning." },
            ].map((r, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-5">
                <p className="font-semibold text-white text-sm mb-1">⚠️ {r.risk}</p>
                <p className="text-white/60 text-sm">{r.mitigation}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 11 */}
        <section>
          <h2 className="text-2xl font-bold mb-3">11. Starting Costs — What You Actually Need</h2>
          <p className="text-white/75 leading-relaxed mb-4">
            One of the biggest myths about R2R is that it&apos;s &ldquo;completely free to start.&rdquo; It isn&apos;t. You don&apos;t need a mortgage deposit, but you do need working capital. Here&apos;s a realistic breakdown for your first HMO R2R:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-white/40 text-xs uppercase tracking-wider">
                  <th className="text-left py-2 pr-4">Item</th>
                  <th className="text-left py-2">Typical cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-white/70">
                {[
                  ["Security deposit (1–2 months rent)", "£900–£1,800"],
                  ["Rent-free setup period (2–4 weeks)", "£0 (negotiate this)"],
                  ["Furnishing — 4-bed HMO (bed, wardrobe, desk per room)", "£4,000–£8,000"],
                  ["Broadband setup", "£50–£100 + monthly"],
                  ["R2R insurance (annual, paid upfront)", "£300–£600"],
                  ["Solicitor — head lease review", "£300–£600"],
                  ["HMO licence application", "£200–£1,000 (varies by council)"],
                  ["Gas Safety Certificate + EICR", "£200–£350"],
                  ["Professional photography", "£100–£150"],
                  ["Cash buffer (3 months contingency)", "£2,000–£3,000"],
                ].map(([item, cost]) => (
                  <tr key={item}>
                    <td className="py-2 pr-4">{item}</td>
                    <td className="py-2 text-white font-medium">{cost}</td>
                  </tr>
                ))}
                <tr className="border-t-2 border-[#c9a84c]/30">
                  <td className="py-3 pr-4 font-bold text-white">Total (realistic range)</td>
                  <td className="py-3 font-bold text-[#c9a84c] text-base">£8,000–£15,000</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-white/55 text-sm mt-3">Single-let R2R can be started for significantly less (£2,000–£4,000) and is a sensible first step if capital is tight.</p>
        </section>

        {/* Section 12 — Getting started */}
        <section>
          <h2 className="text-2xl font-bold mb-3">12. How to Get Started</h2>
          <p className="text-white/75 leading-relaxed mb-4">
            The barrier to entry is lower than almost any other property strategy. Here&apos;s the order of operations:
          </p>
          <div className="space-y-3">
            {[
              "Choose your model and target area — research room demand and occupancy data",
              "Set up a limited company and open a business bank account",
              "Get specialist R2R insurance quotes (you need this before you pitch to landlords)",
              "Build a one-page credibility pack (company overview + insurance certificate)",
              "Start calling letting agents and private landlords using the phone scripts",
              "At every viewing: verify mortgage lender consent is possible before getting excited",
              "Run all potential deals through the Deal Analyser — only proceed if it stacks at 70% occupancy",
              "Sign the Head Lease (solicitor-reviewed) only after written mortgage lender consent is in hand",
              "Set up the property, take professional photos, list and fill rooms",
              "Manage, systemise, and sign your second deal",
            ].map((step, i) => (
              <div key={i} className="flex gap-3 items-start">
                <span className="shrink-0 w-6 h-6 rounded-full bg-[#c9a84c]/20 text-[#c9a84c] font-bold flex items-center justify-center text-xs">{i + 1}</span>
                <p className="text-white/75 text-sm pt-0.5">{step}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <div className="bg-gradient-to-r from-[#c9a84c]/20 to-transparent border border-[#c9a84c]/30 rounded-2xl p-8 text-center">
          <h3 className="text-xl font-bold mb-2">Ready to Go Deeper?</h3>
          <p className="text-white/60 mb-6 max-w-md mx-auto text-sm">
            Our full R2R guide has the complete 12-step launch plan, word-for-word phone scripts for agents and landlords, legal documents checklist, and a financial model for all three R2R models.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/rent-to-rent"
              className="bg-[#c9a84c] hover:bg-[#b8973b] text-[#0a1628] font-bold px-8 py-3 rounded-xl transition-colors">
              Full R2R Guide + Scripts →
            </Link>
            <Link href="/calculators/deal-analyser"
              className="bg-white/10 hover:bg-white/15 text-white font-semibold px-8 py-3 rounded-xl transition-colors">
              Model a Deal →
            </Link>
          </div>
        </div>

        {/* Related */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-white/70">Related Articles</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { title: "HMO Investing in the UK — Everything You Need to Know", href: "/blog/hmo-investing-uk", cat: "Investing" },
              { title: "BRRR Strategy Explained", href: "/blog/brrr-strategy-explained", cat: "Investing" },
              { title: "How to Start Investing in UK Property", href: "/blog/how-to-start-investing-in-uk-property", cat: "Investing" },
              { title: "Guaranteed Rent Explained", href: "/blog/guaranteed-rent-explained", cat: "Landlords" },
            ].map((a) => (
              <Link key={a.title} href={a.href}
                className="group bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 transition-colors">
                <p className="text-[#c9a84c] text-xs font-semibold mb-1">{a.cat}</p>
                <p className="text-white font-medium text-sm group-hover:text-[#c9a84c] transition-colors">{a.title}</p>
              </Link>
            ))}
          </div>
        </div>

        <HelpCTA />
      </article>
    </main>
  );
}
