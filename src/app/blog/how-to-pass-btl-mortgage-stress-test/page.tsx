import { BlogArticleHero } from "@/components/blog/BlogArticleHero";
import Link from "next/link";
import type { Metadata } from "next";
import { Disclaimer } from "@/components/legal/Disclaimer";
import { FAQSchema } from "@/components/seo/FAQSchema";

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Pass the BTL Mortgage Stress Test",
  description: "Six strategies to pass the buy-to-let mortgage stress test when your deal is failing the ICR requirement.",
  step: [
    { "@type": "HowToStep", position: 1, name: "Increase your deposit", text: "A larger deposit means a smaller loan. Reducing LTV from 75% to 65% can shift a failing deal to a comfortable pass at 145% ICR." },
    { "@type": "HowToStep", position: 2, name: "Switch to a limited company (SPV)", text: "Limited company BTL mortgages use 125% ICR instead of 145%. The same property, rent, and loan can pass in a company when it fails personally." },
    { "@type": "HowToStep", position: 3, name: "Choose a lender with a lower stress rate", text: "Stress rates vary from 5.5% to 6.5% across lenders. A whole-of-market broker can find lenders using lower rates that your deal passes." },
    { "@type": "HowToStep", position: 4, name: "Increase the rent", text: "Higher rent directly improves your ICR. Check if the property is underrented — even £50/month more can shift a borderline deal." },
    { "@type": "HowToStep", position: 5, name: "Move to interest-only", text: "BTL stress tests use the interest-only payment. A repayment mortgage has a higher monthly payment, making it harder to pass the ICR test." },
    { "@type": "HowToStep", position: 6, name: "Use a specialist or portfolio lender", text: "Portfolio landlords with 4+ properties should use specialist BTL lenders (Paragon, Precise, Foundation) instead of high-street banks." },
  ],
  tool: [{ "@type": "HowToTool", name: "BTL Mortgage Stress Test Calculator", url: "https://propertyvaultuk.co.uk/calculators/btl-mortgage" }],
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "How to Pass the BTL Mortgage Stress Test",
  description: "BTL mortgage stress tests failing? Learn how lenders calculate ICR, what 145% means in practice, and 6 ways to fix a failing deal.",
  author: { "@type": "Person", name: "Nass" },
  publisher: { "@type": "Organization", name: "PropertyVault UK", url: "https://propertyvaultuk.co.uk" },
  datePublished: "2025-06-25",
  dateModified: "2025-06-25",
  url: "https://propertyvaultuk.co.uk/blog/how-to-pass-btl-mortgage-stress-test",
  image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1400&q=80",
};

export const metadata: Metadata = {
  title: "How to Pass the BTL Mortgage Stress Test — A Landlord's Guide 2025 | PropertyVault UK",
  description: "BTL mortgage stress tests failing? Learn how lenders calculate ICR, what 145% means in practice, why your deal is failing, and 6 ways to fix it — including limited company, higher deposit, and rent increases.",
  keywords: "BTL mortgage stress test, buy to let stress test 2025, ICR 145%, interest coverage ratio buy to let, BTL mortgage failing stress test, buy to let mortgage limited company",
  openGraph: {
    title: "How to Pass the BTL Mortgage Stress Test 2025 | PropertyVault UK",
    description: "Learn exactly how the BTL stress test works, why deals fail, and 6 strategies to pass — including limited company lending, higher deposits, and rent optimisation.",
    type: "article",
    url: "https://propertyvaultuk.co.uk/blog/how-to-pass-btl-mortgage-stress-test/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "BTL Mortgage Stress Test Guide" }],
  },
  alternates: { canonical: "https://propertyvaultuk.co.uk/blog/how-to-pass-btl-mortgage-stress-test/" },
};

const faqs = [
  {
    q: "What is the BTL mortgage stress test?",
    a: "The BTL stress test is a calculation lenders use to decide how much they'll lend on a buy-to-let property. They don't simply look at today's interest rate — they test your rental income against a higher 'stress rate' (typically 5.5%–6.5%) to ensure you can still cover the mortgage if rates rise. Your monthly rent must cover 125%–145% of the mortgage payment at the stress rate. If it doesn't, the lender either reduces the loan or declines.",
  },
  {
    q: "What does 145% ICR mean in practice?",
    a: "ICR stands for Interest Coverage Ratio. A 145% ICR requirement means your monthly rent must be at least 1.45x the monthly interest payment calculated at the stress rate. For example: if a lender uses a 5.5% stress rate on a £150,000 loan, the monthly interest is £687.50. At 145%, you need monthly rent of at least £996.88. If your property rents for £850/month, you'd fail — even though the property is cash-flow positive today.",
  },
  {
    q: "Why do BTL stress tests use a higher rate than the actual mortgage rate?",
    a: "Lenders stress-test at rates above the actual mortgage rate to protect against future rate rises. A property might be cash-flow positive at today's 4.5% rate but negative if rates rose to 6%. The Prudential Regulation Authority (PRA) required lenders to stress-test at a minimum of 5.5% or the actual rate plus 2% (whichever is higher) after 2017 rules changes. This is why many deals that 'worked' before 2017 no longer qualify for the same loan size.",
  },
  {
    q: "Does using a limited company help pass the BTL stress test?",
    a: "Yes — significantly for many landlords. Limited company (SPV) BTL mortgages often use lower ICR requirements (125% vs 145%) and sometimes lower stress rates. This is because the tax treatment inside a company means more profit is available to service debt. A deal that fails at 145% ICR in personal name may pass at 125% ICR in a limited company. However, company mortgage rates are typically 0.5%–1% higher than personal, and there are additional setup and running costs.",
  },
  {
    q: "Can I use top-slicing to pass the BTL stress test?",
    a: "Some lenders offer 'top-slicing' — where they consider your personal income alongside the rental income to bridge any shortfall in the stress test. This is typically available only to borrowers with strong personal income (often £75,000+) and is offered by a limited number of specialist BTL lenders. It is not a standard product and lenders can withdraw it. Top-slicing is most useful for landlords buying in high-value, lower-yield areas like London where rental yields are compressed.",
  },
];

const FIXES = [
  {
    n: "01",
    title: "Increase your deposit",
    impact: "High",
    detail: "The stress test is calculated on the loan amount, not the purchase price. A larger deposit means a smaller loan, which means lower interest payments at the stress rate, which makes it easier to hit 125–145% ICR. If you&apos;re borderline at 75% LTV, try 65% or 60%. The maths often changes dramatically. A 10% deposit increase can shift a failing deal to a comfortable pass.",
    example: "£150k property, rent £850/mo. At 75% LTV (£112,500 loan) → fails at 145% ICR. At 65% LTV (£97,500 loan) → passes.",
  },
  {
    n: "02",
    title: "Switch to a limited company (SPV)",
    impact: "High",
    detail: "Limited company BTL mortgages typically use 125% ICR (vs 145% personal) and sometimes lower stress rates. The same property, same rent, same loan — but tested differently. A deal that fails in personal name may pass comfortably in a company. This also benefits landlords who pay higher-rate income tax, since Section 24 doesn&apos;t apply inside a company.",
    example: "£850/mo rent, 5.5% stress rate, £130k loan. Personal (145%): fails. Ltd company (125%): passes.",
    link: { text: "Compare personal vs limited company →", href: "/calculators/personal-vs-ltd" },
  },
  {
    n: "03",
    title: "Choose a lender with a lower stress rate",
    impact: "Medium",
    detail: "Stress rates vary by lender — typically between 5.5% and 6.5%. A 1% difference in stress rate can be the difference between passing and failing. Some specialist BTL lenders use the actual pay rate plus 1% rather than a fixed floor. A mortgage broker with whole-of-market access is essential here — the difference in achievable loan sizes across lenders can be £20,000+ on a single property.",
    example: "£130k loan, £850/mo rent. At 6.5% stress: fails at 145%. At 5.5% stress: passes at 145%.",
  },
  {
    n: "04",
    title: "Increase the rent",
    impact: "Medium",
    detail: "Higher rent directly improves your ICR. Before completing, check whether the property is underrented vs. comparable lets nearby. Even a £50/month increase can shift a borderline deal. Some lenders accept a surveyor&apos;s projected rental income rather than current passing rent — useful for properties with below-market rents or refurb potential. Be realistic: inflated rental projections can cause issues at redemption.",
    example: "Loan £130k, stress rate 5.5%. At £850/mo: ICR = 135% (fails). At £900/mo: ICR = 143% (passes).",
    link: { text: "Use the rent increase calculator →", href: "/calculators/rent-increase" },
  },
  {
    n: "05",
    title: "Move to interest-only",
    impact: "Medium",
    detail: "BTL stress tests are calculated on the interest-only payment, not the full capital repayment amount. If you&apos;re applying for a repayment BTL mortgage, the monthly payment the lender tests is higher than it needs to be. Switching to interest-only (which is standard for BTL) reduces the tested payment, improving your ICR. Most BTL lenders offer interest-only as default — confirm this is what you&apos;re applying for.",
    example: "£130k loan, 5.5% stress rate. IO payment: £595/mo. Repayment payment: ~£830/mo. Stress tested amount is very different.",
  },
  {
    n: "06",
    title: "Use a specialist or portfolio lender",
    impact: "Situational",
    detail: "If you own 4+ mortgaged BTL properties, high-street lenders may apply stricter PRA portfolio landlord rules — stress-testing your whole portfolio, not just the new property. Specialist portfolio lenders (Paragon, Precise, Foundation, Fleet) are designed for this and often have more flexible underwriting. They may also accept limited company structures with HMO licensing included, which standard lenders decline.",
    example: "Portfolio landlords with 4+ properties should always use a specialist BTL broker, not a high-street bank.",
  },
];

export default function BtlStressTestPage() {
  return (
    <>
      <BlogArticleHero
        title="How to Pass the BTL Mortgage Stress Test"
        excerpt="Your deal is cash-flow positive but the lender says no. Here is exactly why stress tests work the way they do — and 6 strategies to get your deal approved."
        date="25 June 2025"
        readTime="8 min"
        category="Finance"
        image="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1400&q=80"
      />

      <article className="section-padding bg-white">
        <div className="container-max max-w-3xl prose-article">

          <p className="lead">You&apos;ve found the deal. The numbers stack. The rent covers the mortgage at today&apos;s rate with cash flow to spare. Then the lender declines — or offers you £30,000 less than you need. Welcome to the BTL mortgage stress test. It trips up experienced landlords every day, and most don&apos;t understand why until it&apos;s too late.</p>

          <h2>How the stress test actually works</h2>
          <p>Lenders don&apos;t care what interest rate you&apos;re actually paying. They test your rental income against a <strong>hypothetical higher rate</strong> — typically 5.5% to 6.5% — to make sure the property doesn&apos;t become a problem loan if rates rise.</p>
          <p>The formula is:</p>
          <div className="bg-navy-50 rounded-xl p-5 my-5 font-mono text-sm">
            <p className="font-bold text-navy-800 mb-2">ICR = Monthly Rent ÷ (Loan × Stress Rate ÷ 12) × 100</p>
            <p className="text-navy-600">Must be ≥ 125% (limited company) or ≥ 145% (personal)</p>
          </div>
          <p><strong>Real example:</strong> You want a £130,000 mortgage on a property renting for £850/month. The lender uses a 5.5% stress rate.</p>
          <ul>
            <li>Monthly interest at 5.5%: £130,000 × 5.5% ÷ 12 = <strong>£595.83</strong></li>
            <li>ICR: £850 ÷ £595.83 × 100 = <strong>142.6%</strong></li>
            <li>Result: <strong>Fails at 145%</strong> (personal name). <strong>Passes at 125%</strong> (limited company).</li>
          </ul>
          <p>That&apos;s the same property, same rent, same loan — but the ownership structure changes the result completely.</p>

          <div className="my-6 p-5 border border-gold-200 bg-gold-50 rounded-2xl">
            <p className="font-bold text-navy-800 mb-2">Run your own stress test</p>
            <p className="text-sm text-navy-600 mb-3">Use the free BTL stress test calculator to see your ICR, whether you pass, and how much shortfall you have.</p>
            <Link href="/calculators/btl-mortgage" className="inline-block bg-navy-800 text-white font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-navy-700 transition-colors">Open BTL Stress Test Calculator →</Link>
          </div>

          <h2>Why your deal is probably failing</h2>
          <p>Most stress test failures come down to one of four causes:</p>
          <ol>
            <li><strong>Rent too low relative to loan size.</strong> Compressed yields in certain areas (particularly London and South East) mean the maths simply doesn&apos;t work at 75% LTV without a large deposit or top-slicing.</li>
            <li><strong>Applying in personal name when limited company would pass.</strong> The ICR requirement is 145% personal vs 125% company — a 20-percentage-point difference that changes many deals.</li>
            <li><strong>Using a high stress-rate lender.</strong> Different lenders use different stress rates. A broker who only has access to a handful of products may put you with the wrong lender.</li>
            <li><strong>Portfolio landlord rules triggering a whole-portfolio assessment.</strong> If you own 4+ mortgaged BTL properties, some lenders apply stricter PRA rules — assessing your entire portfolio, not just the new deal.</li>
          </ol>

          <h2>6 ways to fix a failing stress test</h2>

          <div className="space-y-5 my-6">
            {FIXES.map((fix) => (
              <div key={fix.n} className="border border-navy-100 rounded-2xl p-5">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-navy-800 text-gold-400 flex items-center justify-center font-extrabold text-sm">{fix.n}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="font-extrabold text-navy-800 text-base" style={{ fontFamily: "var(--font-family-heading)", margin: 0 }}>{fix.title}</h3>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${fix.impact === "High" ? "bg-green-100 text-green-700" : fix.impact === "Medium" ? "bg-yellow-100 text-yellow-700" : "bg-navy-100 text-navy-600"}`}>{fix.impact} impact</span>
                    </div>
                    <p className="text-sm text-navy-600 leading-relaxed mb-2" dangerouslySetInnerHTML={{ __html: fix.detail }} />
                    <div className="bg-navy-50 rounded-lg px-4 py-2.5 mb-2">
                      <p className="text-xs text-navy-500 font-mono">{fix.example}</p>
                    </div>
                    {fix.link && (
                      <Link href={fix.link.href} className="text-sm font-semibold text-gold-600 hover:text-gold-700 transition-colors">{fix.link.text}</Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <h2>What if none of these work?</h2>
          <p>Some deals genuinely don&apos;t work as a financed purchase — the yield is too low for the loan size at any reasonable deposit level. In these cases you have three realistic options:</p>
          <ol>
            <li><strong>Buy cash.</strong> No stress test applies to unfinanced purchases. Your return is lower (no leverage) but the deal works.</li>
            <li><strong>Find a higher-yield property.</strong> The stress test is not broken — it is telling you the deal is marginal. A 7%+ gross yield property in the Midlands will pass where a 5% London flat won&apos;t.</li>
            <li><strong>Use guaranteed rent to remove void risk.</strong> If your deal is borderline on cash flow, guaranteed rent locks in a predictable income, removing the uncertainty that often makes borderline deals unworkable in practice.</li>
          </ol>

          <div className="my-8 p-6 bg-navy-800 rounded-2xl text-white text-center">
            <p className="text-gold-400 font-bold text-xs uppercase tracking-widest mb-2">Free tool</p>
            <h3 className="text-xl font-extrabold mb-3" style={{ fontFamily: "var(--font-family-heading)" }}>Test your deal right now</h3>
            <p className="text-navy-200 text-sm mb-5">Enter your rent, loan amount, and LTV. The calculator shows your ICR, whether you pass at 125% and 145%, and the rent shortfall if you fail.</p>
            <Link href="/calculators/btl-mortgage" className="inline-block bg-gold-400 text-navy-900 font-bold px-6 py-3 rounded-xl hover:bg-gold-300 transition-colors">Open BTL Stress Test Calculator →</Link>
          </div>

          <h2>Further reading</h2>
          <ul>
            <li><Link href="/calculators/btl-mortgage">BTL Mortgage Stress Test Calculator — free, instant results</Link></li>
            <li><Link href="/calculators/personal-vs-ltd">Personal vs Limited Company BTL Calculator</Link></li>
            <li><Link href="/calculators/rental-yield">Rental Yield Calculator — check your gross and net yield</Link></li>
            <li><Link href="/calculators/monthly-cashflow">BTL Monthly Cash Flow Calculator — full breakdown including voids and costs</Link></li>
            <li><Link href="/blog/section-24-explained">Section 24 explained — why limited companies are attractive for higher-rate taxpayers</Link></li>
          </ul>

          <Disclaimer type="financial" />
        </div>
      </article>

      <FAQSchema faqs={faqs} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
    </>
  );
}
