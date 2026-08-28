import { BlogArticleHero } from "@/components/blog/BlogArticleHero";
import Link from "next/link";
import type { Metadata } from "next";
import { Disclaimer } from "@/components/legal/Disclaimer";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { ShareResults } from "@/components/calculators/ShareResults";
import { RelatedArticles } from "@/components/blog/RelatedArticles";

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "How to Start Investing in UK Property in 2026: A Beginner's Guide",
  description:
    "What property investing actually looks like in the UK, how much money you need to get started, which strategy suits you, and how to run the numbers before you commit a penny.",
  author: { "@type": "Person", name: "Nass" },
  publisher: {
    "@type": "Organization",
    name: "PropertyVault UK",
    url: "https://www.propertyvaultuk.co.uk",
  },
  datePublished: "2026-06-26",
  dateModified: "2026-06-26",
  url: "https://www.propertyvaultuk.co.uk/blog/how-to-start-investing-in-uk-property",
  image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1400&q=80",
};

export const metadata: Metadata = {
  title: "How to Start Investing in UK Property in 2026: A Beginner's Guide",
  description:
    "What property investing actually looks like, how much money you need, which strategy fits your situation, and how to run the numbers before you spend anything. A honest guide for beginners.",
  keywords:
    "how to start investing in property uk, investing in property for beginners uk, uk property investing, how to invest money in property, invest in rental property uk, property investment strategies uk 2026",
  openGraph: {
    title: "How to Start Investing in UK Property (Honest Beginner's Guide 2026)",
    description:
      "Not the Instagram version. What property investing actually takes, what it costs, and how to know if a deal is worth doing.",
    type: "article",
    url: "https://www.propertyvaultuk.co.uk/blog/how-to-start-investing-in-uk-property/",
    siteName: "PropertyVault UK",
    images: [
      {
        url: "https://www.propertyvaultuk.co.uk/opengraph-image",
        width: 1200,
        height: 630,
        alt: "How to Start Investing in UK Property",
      },
    ],
  },
  alternates: {
    canonical: "https://www.propertyvaultuk.co.uk/blog/how-to-start-investing-in-uk-property/",
  },
};

const faqs = [
  {
    q: "How much money do I need to start investing in UK property?",
    a: "The absolute minimum for a buy-to-let in most UK cities outside London is around £25,000–£35,000. That covers a 25% deposit on a £100,000–£120,000 property plus purchase costs (stamp duty, legal fees, survey). In practice, most first-time investors start with £40,000–£60,000 to have a buffer after purchase. You don't need six figures — but you do need more than a 10% deposit, because BTL mortgages don't go below 75% LTV.",
  },
  {
    q: "What is the best property investment strategy for beginners in the UK?",
    a: "A standard single-let buy-to-let (BTL) is almost always the right starting point. It's simpler to finance, manage, and understand than HMOs or serviced accommodation. You learn how tenancies work, how voids affect cashflow, and how maintenance costs stack up — without the added complexity of licensing, multiple tenants, or short-term bookings. Most experienced investors started with BTL before moving into other strategies.",
  },
  {
    q: "Is now a good time to invest in UK property?",
    a: "The honest answer is that 'good time' is relative to your personal financial position, not market timing. People have said 'wait for prices to drop' every year for 30 years and prices are still significantly higher than 30 years ago. What matters more than timing the market is buying the right deal — one with strong rental demand, a yield above your mortgage cost, and sensible cashflow after all expenses. A good deal in any market beats a bad deal in a 'good' market.",
  },
  {
    q: "Do I need a limited company to invest in UK property?",
    a: "Not necessarily — but it depends on your tax position. If you're a higher or additional rate taxpayer (40% or 45%), Section 24 means you'll pay tax on rental income before deducting mortgage interest. A limited company (SPV) pays corporation tax at 19–25% and can fully deduct mortgage costs. If you're a basic rate taxpayer or investing in cash, personal name is often simpler and cheaper to set up. It's worth speaking to a property accountant before buying your first one.",
  },
  {
    q: "What rental yield should I aim for as a beginner?",
    a: "As a rough minimum, aim for 6%+ gross yield. Below 6% and the numbers become very tight once you account for mortgage, maintenance, insurance, and voids. In Midlands cities like Birmingham, Nottingham, Derby, and Leicester you can regularly find properties yielding 7–9%. London and the South East typically yield 3–5%, which rarely makes financial sense unless you're banking purely on capital growth. Use the free Rental Yield Calculator on PropertyVault to model any property before viewing.",
  },
  {
    q: "What is the BRRR strategy and is it suitable for beginners?",
    a: "BRRR stands for Buy, Refurbish, Refinance, Rent. You buy a property below market value, renovate it to add value, refinance at the new higher value to pull out your original capital, then rent it out. The appeal is recycling the same deposit multiple times. The challenge for beginners is that it requires reliable contractors, accurate refurb cost estimates, and a lender who'll refinance at uplift. Most beginners who try BRRR before doing a standard BTL first end up overpaying for refurb or misjudging the end value. Do one straightforward BTL first.",
  },
  {
    q: "How long does it take to buy an investment property in the UK?",
    a: "From making an offer to receiving keys typically takes 8–16 weeks. The main variable is the mortgage offer (2–6 weeks depending on lender and complexity) and the conveyancing process (6–10 weeks). Chains slow everything down — buying a vacant property or a chain-free repossession is usually faster. Factor in time to find the right deal too — most experienced investors view dozens of properties before finding one that genuinely stacks.",
  },
];

export default function HowToStartInvestingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <BlogArticleHero
        title="How to Start Investing in UK Property: A Beginner's Guide (2026)"
        excerpt="Not the highlight reel version. What property investing actually costs, which strategy makes sense for where you're starting from, and how to know whether a deal is worth doing before you spend a penny."
        category="Property Investing"
        date="26 June 2026"
        readTime="14 min read"
        image="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1400&q=80"
      />

      <article className="section-padding bg-white">
        <div className="container-max max-w-3xl px-4">

          {/* INTRO */}
          <p className="text-xl text-navy-700 leading-relaxed mb-6 font-medium">
            Most people who want to invest in UK property spend months watching YouTube, reading forums, and going around in circles — never actually doing anything. I was one of them.
          </p>
          <p className="text-navy-600 leading-relaxed mb-5">
            The problem isn&apos;t a lack of information. There&apos;s too much of it, most of it aimed at selling you something — a course, a mentorship programme, a &ldquo;deal-sourcing service.&rdquo; What&apos;s missing is a straight answer to the basics: what does it actually cost to get started, which strategy makes sense for your situation, and how do you know if a property is worth buying?
          </p>
          <p className="text-navy-600 leading-relaxed mb-10">
            That&apos;s what this guide is. No hype, no &ldquo;property millionaire in 18 months&rdquo; framing. Just what you actually need to know.
          </p>

          {/* SECTION 1 */}
          <h2 className="text-2xl font-bold text-navy-800 mb-4 mt-12">
            What property investing actually means in the UK
          </h2>
          <p className="text-navy-600 leading-relaxed mb-5">
            At its simplest: you buy a property, someone pays you rent to live in it, and that rent (hopefully) covers your mortgage and costs with something left over. The property may also increase in value over time, which is a bonus — but chasing capital growth rather than cashflow is how a lot of beginners get into trouble.
          </p>
          <p className="text-navy-600 leading-relaxed mb-5">
            The goal, when you&apos;re starting out, is straightforward: find a property where the rent comfortably covers the mortgage, running costs, and a buffer for voids and repairs. If it does that, you&apos;ve got a working investment. If it doesn&apos;t, you&apos;ve got an expensive problem.
          </p>
          <p className="text-navy-600 leading-relaxed mb-10">
            It is not passive income. Managing tenants, maintenance, compliance, and refinancing takes time and attention. Some landlords use letting agents to reduce that — but agents charge 8–15% of rent, which eats into your numbers. Be honest about this before you start.
          </p>

          {/* SECTION 2 */}
          <h2 className="text-2xl font-bold text-navy-800 mb-4 mt-12">
            How much money do you actually need?
          </h2>
          <p className="text-navy-600 leading-relaxed mb-5">
            This is the question everyone asks and nobody answers directly, so here it is:
          </p>

          <div className="bg-navy-50 rounded-2xl p-6 mb-6 border border-navy-100">
            <p className="font-bold text-navy-800 mb-4">Example: £120,000 property in Nottingham</p>
            <div className="space-y-2 text-sm">
              {[
                ["25% deposit (BTL minimum)", "£30,000"],
                ["Stamp duty (5% surcharge for investment property)", "£6,000"],
                ["Solicitor / conveyancing", "£1,200–£1,800"],
                ["Survey (HomeBuyer Report)", "£400–£600"],
                ["Mortgage arrangement fee", "£995–£1,995"],
                ["Total to get through the door", "~£39,000–£40,000"],
              ].map(([item, cost]) => (
                <div key={item} className="flex justify-between items-center py-2 border-b border-navy-100 last:border-0">
                  <span className="text-navy-600">{item}</span>
                  <span className="font-bold text-navy-800">{cost}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-navy-500 mt-4">
              Plus keep a separate buffer — £3,000–£5,000 minimum — for void periods, unexpected repairs, and any works needed before tenanting.
            </p>
          </div>

          <p className="text-navy-600 leading-relaxed mb-5">
            So realistically, you need £40,000–£45,000 for a first investment property in a Midlands city. In London or the South East, the numbers are multiples of that — which is why most first-time investors don&apos;t buy in their backyard.
          </p>
          <p className="text-navy-600 leading-relaxed mb-5">
            Check your stamp duty figure on the{" "}
            <Link href="/calculators/stamp-duty" className="text-gold-600 font-semibold hover:underline">
              free Stamp Duty Calculator
            </Link>{" "}
            — the 5% investment property surcharge catches a lot of people off guard, and it&apos;s on top of the standard rates.
          </p>

          {/* SECTION 3 */}
          <h2 className="text-2xl font-bold text-navy-800 mb-4 mt-12">
            The four main strategies — and who each one suits
          </h2>
          <p className="text-navy-600 leading-relaxed mb-8">
            There are more than four ways to invest in property, but these are the ones that make sense to know about before you start. Most people should do one thing first and do it well.
          </p>

          <div className="space-y-6 mb-10">
            {/* BTL */}
            <div className="border border-navy-100 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-navy-800 text-white text-xs font-bold px-3 py-1 rounded-full">01</span>
                <h3 className="text-lg font-bold text-navy-800">Standard Buy-to-Let (BTL)</h3>
                <span className="ml-auto text-xs font-semibold text-green-700 bg-green-50 px-3 py-1 rounded-full border border-green-200">Best for beginners</span>
              </div>
              <p className="text-navy-600 text-sm leading-relaxed mb-3">
                Buy a property, find a tenant, collect rent. Simple to understand, straightforward to finance (lenders are very familiar with it), and the easiest to manage — especially if you use a letting agent.
              </p>
              <p className="text-navy-600 text-sm leading-relaxed">
                <strong className="text-navy-800">Who it suits:</strong> Anyone starting out. Even if you eventually want to do HMOs or BRRR, do a standard BTL first. You&apos;ll learn how tenancies actually work, what maintenance really costs, and how voids feel — without the extra complexity of multiple tenants or heavy refurbs.
              </p>
            </div>

            {/* BRRR */}
            <div className="border border-navy-100 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-navy-800 text-white text-xs font-bold px-3 py-1 rounded-full">02</span>
                <h3 className="text-lg font-bold text-navy-800">BRRR (Buy, Refurbish, Refinance, Rent)</h3>
              </div>
              <p className="text-navy-600 text-sm leading-relaxed mb-3">
                You buy a below-market property (usually because it needs work), refurbish it to add value, then refinance at the new higher value — pulling most or all of your original deposit back out. Then you rent it. The idea is that your money goes further because you reuse the same capital.
              </p>
              <p className="text-navy-600 text-sm leading-relaxed">
                <strong className="text-navy-800">Who it suits:</strong> Investors who already understand the basics of BTL and have reliable contractor relationships. The risk for beginners is underestimating refurb costs or overestimating the end value — both are easy mistakes that wipe out the benefit. Use the{" "}
                <Link href="/calculators/brrr" className="text-gold-600 font-semibold hover:underline">
                  BRRR Calculator
                </Link>{" "}
                to stress-test the numbers before you commit.
              </p>
            </div>

            {/* HMO */}
            <div className="border border-navy-100 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-navy-800 text-white text-xs font-bold px-3 py-1 rounded-full">03</span>
                <h3 className="text-lg font-bold text-navy-800">HMO (House in Multiple Occupation)</h3>
              </div>
              <p className="text-navy-600 text-sm leading-relaxed mb-3">
                Renting individual rooms rather than the whole property. A 4-bed house renting at £400/room generates £1,600/month — the equivalent single-let might rent for £950. The yield on paper is significantly higher.
              </p>
              <p className="text-navy-600 text-sm leading-relaxed">
                <strong className="text-navy-800">Who it suits:</strong> Experienced landlords who understand licensing requirements, are prepared for more intensive management (4 tenancies, not 1), and have a property in the right location (typically near a university or city centre with high young professional demand). HMOs require a mandatory licence for 5+ occupants. Don&apos;t start here.
              </p>
            </div>

            {/* Rent-to-Rent */}
            <div className="border border-navy-100 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-navy-800 text-white text-xs font-bold px-3 py-1 rounded-full">04</span>
                <h3 className="text-lg font-bold text-navy-800">Rent-to-Rent (R2R)</h3>
              </div>
              <p className="text-navy-600 text-sm leading-relaxed mb-3">
                You rent a property from a landlord at a fixed rate, then sublet it at a higher rate (usually as rooms or serviced accommodation). You don&apos;t own the property — so there&apos;s no mortgage, no deposit tied up, and no capital growth.
              </p>
              <p className="text-navy-600 text-sm leading-relaxed">
                <strong className="text-navy-800">Who it suits:</strong> People with limited capital who understand the compliance obligations clearly. R2R requires the landlord&apos;s mortgage lender consent, the correct AST clauses, and council licensing compliance. Done wrong, it&apos;s illegal. Done right, it can generate income without a large capital outlay.
              </p>
            </div>
          </div>

          {/* SECTION 4 */}
          <h2 className="text-2xl font-bold text-navy-800 mb-4 mt-12">
            Where to buy: picking your area
          </h2>
          <p className="text-navy-600 leading-relaxed mb-5">
            The single biggest mistake beginners make is trying to invest locally when &ldquo;locally&rdquo; means London or the South East, where yields are 3–4% and the numbers don&apos;t work on a standard BTL mortgage. Property investing doesn&apos;t have to be near where you live.
          </p>
          <p className="text-navy-600 leading-relaxed mb-5">
            The Midlands is where the yield vs price equation makes the most sense for first-time investors right now. Birmingham, Nottingham, Derby, Leicester, Coventry — you can still find properties at £100,000–£150,000 with rents of £750–£950/month, giving gross yields of 7–9%.
          </p>

          <div className="bg-gold-50 border border-gold-200 rounded-2xl p-6 mb-6">
            <p className="font-bold text-navy-800 mb-2">The three things that make an area worth investing in:</p>
            <ol className="space-y-2 text-sm text-navy-600 list-decimal pl-4">
              <li><strong className="text-navy-800">Rental demand</strong> — Is there a consistent pool of tenants? Look for areas near universities, hospitals, or large employers. Void periods kill cashflow.</li>
              <li><strong className="text-navy-800">Yield above your mortgage cost</strong> — If your mortgage rate is 5% and the gross yield is 5%, there&apos;s no margin after costs. Aim for at least 6–7% gross.</li>
              <li><strong className="text-navy-800">Price-to-rent ratios that stack up</strong> — Run every property through the{" "}
                <Link href="/calculators/rental-yield" className="text-gold-600 font-semibold hover:underline">
                  Rental Yield Calculator
                </Link>{" "}
                before viewing. If the gross yield is below 6%, move on.</li>
            </ol>
          </div>

          <p className="text-navy-600 leading-relaxed mb-10">
            Don&apos;t overthink area selection to the point of paralysis. Pick one city, learn it properly, and analyse at least 20 deals on Rightmove and Zoopla before you make an offer. You&apos;ll develop a feel for what a good deal looks like faster than any amount of theory will teach you.
          </p>

          {/* SECTION 5 */}
          <h2 className="text-2xl font-bold text-navy-800 mb-4 mt-12">
            Running the numbers: what to check before you buy
          </h2>
          <p className="text-navy-600 leading-relaxed mb-5">
            A lot of property deals look good on the surface and fall apart when you model the actual cashflow. Here&apos;s what to check on every property before you waste a viewing:
          </p>

          <div className="space-y-4 mb-8">
            <div className="flex gap-4 p-5 bg-navy-50 rounded-xl border border-navy-100">
              <div className="w-8 h-8 rounded-lg bg-navy-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">1</span>
              </div>
              <div>
                <p className="font-bold text-navy-800 text-sm mb-1">Gross rental yield</p>
                <p className="text-navy-600 text-sm leading-relaxed">
                  Annual rent ÷ purchase price × 100. Quick filter — below 6%, the numbers are usually too tight. Use the{" "}
                  <Link href="/calculators/rental-yield" className="text-gold-600 font-semibold hover:underline">
                    Rental Yield Calculator
                  </Link>.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-5 bg-navy-50 rounded-xl border border-navy-100">
              <div className="w-8 h-8 rounded-lg bg-navy-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">2</span>
              </div>
              <div>
                <p className="font-bold text-navy-800 text-sm mb-1">Monthly cashflow</p>
                <p className="text-navy-600 text-sm leading-relaxed">
                  Rent minus mortgage, agent fees (if applicable), insurance, and a maintenance allowance (typically 10% of rent). What&apos;s left is your cashflow. Model it in the{" "}
                  <Link href="/calculators/monthly-cashflow" className="text-gold-600 font-semibold hover:underline">
                    Cashflow Calculator
                  </Link>{" "}
                  — a lot of deals look positive but go negative once you include all costs.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-5 bg-navy-50 rounded-xl border border-navy-100">
              <div className="w-8 h-8 rounded-lg bg-navy-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">3</span>
              </div>
              <div>
                <p className="font-bold text-navy-800 text-sm mb-1">BTL mortgage stress test</p>
                <p className="text-navy-600 text-sm leading-relaxed">
                  Lenders don&apos;t just look at today&apos;s rate — they stress-test your rental income against a higher rate (usually 5.5–6.5%) at 125–145% ICR. Check whether you&apos;ll actually get the loan before you make an offer. Use the{" "}
                  <Link href="/calculators/btl-mortgage" className="text-gold-600 font-semibold hover:underline">
                    BTL Stress Test Calculator
                  </Link>.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-5 bg-navy-50 rounded-xl border border-navy-100">
              <div className="w-8 h-8 rounded-lg bg-navy-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">4</span>
              </div>
              <div>
                <p className="font-bold text-navy-800 text-sm mb-1">Tax impact</p>
                <p className="text-navy-600 text-sm leading-relaxed">
                  Section 24 means higher rate taxpayers can&apos;t fully deduct mortgage interest from rental income. This alone turns some &ldquo;profitable&rdquo; BTLs into loss-makers on a tax basis. Run your numbers through the{" "}
                  <Link href="/calculators/landlord-tax" className="text-gold-600 font-semibold hover:underline">
                    Landlord Tax Calculator
                  </Link>{" "}
                  to see your true position.
                </p>
              </div>
            </div>
          </div>

          <p className="text-navy-600 leading-relaxed mb-10">
            If a deal passes all four checks — yield above 6%, positive cashflow after all costs, passes the stress test, and the tax position makes sense — it&apos;s worth viewing. If it fails any of them, move on. There will be another one.
          </p>

          {/* SECTION 6 */}
          <h2 className="text-2xl font-bold text-navy-800 mb-4 mt-12">
            What a realistic timeline looks like
          </h2>
          <p className="text-navy-600 leading-relaxed mb-5">
            People underestimate how long everything takes, and then get frustrated when it doesn&apos;t happen fast. Here&apos;s what a realistic timeline looks like for a first BTL:
          </p>

          <div className="relative pl-8 border-l-2 border-navy-200 space-y-8 mb-10">
            {[
              { phase: "Weeks 1–4", label: "Research and area selection", desc: "Decide on a city. Spend time on Rightmove and Zoopla. Run at least 20 properties through the yield calculator without making any offers. You&apos;re learning what good looks like." },
              { phase: "Weeks 4–10", label: "Mortgage in principle", desc: "Speak to a whole-of-market BTL broker (not your bank). Get a mortgage in principle so you know exactly how much you can borrow and what you&apos;ll pay. This costs nothing and means you can move fast when you find something." },
              { phase: "Weeks 6–16", label: "Finding the right property", desc: "View properties that pass your number checks. Most experienced investors view 10–20 before making an offer. Don&apos;t rush this. The wrong deal at the wrong price is expensive to undo." },
              { phase: "Week 8–20", label: "Offer accepted → exchange", desc: "Instruct a solicitor the day your offer is accepted. The legal process takes 6–12 weeks. Chase regularly — conveyancing moves as fast as the slowest person in the chain." },
              { phase: "Week 16–24", label: "Completion and tenanting", desc: "Keys in hand. If the property needs any work, do it now before tenanting. Find a tenant (allow 2–4 weeks). Your first rent arrives." },
            ].map(({ phase, label, desc }) => (
              <div key={phase} className="relative">
                <div className="absolute -left-10 w-4 h-4 rounded-full bg-gold-400 border-2 border-white mt-1" />
                <p className="text-xs font-bold text-gold-600 uppercase tracking-wider mb-1">{phase}</p>
                <p className="font-bold text-navy-800 mb-2">{label}</p>
                <p className="text-navy-600 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: desc }} />
              </div>
            ))}
          </div>

          {/* SECTION 7 */}
          <h2 className="text-2xl font-bold text-navy-800 mb-4 mt-12">
            The things nobody tells you until after you&apos;ve bought
          </h2>
          <div className="space-y-4 mb-10">
            {[
              { title: "Void periods are normal — budget for them", body: "Even good properties in good areas have voids between tenancies. Budget for 1 month&apos;s void per year as a minimum. If your cashflow only works when the property is always tenanted, your numbers aren&apos;t tight enough." },
              { title: "Maintenance costs more than you think", body: "The rule of thumb is 10% of annual rent set aside for maintenance. Boilers break, roofs leak, kitchens need replacing. If you&apos;re buying an older property, a structural survey is worth every penny." },
              { title: "Your letting agent is not on your side", body: "Agents earn a percentage of rent. Their incentive is to fill the property quickly, not necessarily with the best tenant. Read every clause in your management agreement and make sure you&apos;re happy with the referencing process they use." },
              { title: "The first deal is the hardest", body: "Once you&apos;ve been through the process once — mortgage, solicitors, tenanting, the lot — the second deal is significantly easier and faster. Don&apos;t let the complexity of the first one put you off. Everyone felt this at the start." },
            ].map(({ title, body }) => (
              <div key={title} className="p-5 border-l-4 border-gold-400 bg-gold-50 rounded-r-xl">
                <p className="font-bold text-navy-800 mb-2">{title}</p>
                <p className="text-navy-600 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: body }} />
              </div>
            ))}
          </div>

          {/* CTA BOX */}
          <div className="bg-navy-900 rounded-2xl p-8 mb-10 text-center">
            <p className="text-gold-400 font-semibold text-sm uppercase tracking-wider mb-3">Free Property Tools</p>
            <h3 className="text-white font-bold text-xl mb-3">Run the numbers before you commit</h3>
            <p className="text-navy-200 text-sm mb-6 max-w-md mx-auto">
              All the calculators you need to analyse a deal properly — rental yield, cashflow, stamp duty, BTL stress test — completely free.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/calculators/rental-yield" className="bg-gold-400 text-navy-900 font-bold text-sm px-5 py-3 rounded-xl hover:bg-gold-500 transition-colors">
                Rental Yield Calculator
              </Link>
              <Link href="/calculators/monthly-cashflow" className="bg-white/10 text-white font-semibold text-sm px-5 py-3 rounded-xl hover:bg-white/20 transition-colors border border-white/20">
                Cashflow Calculator
              </Link>
              <Link href="/calculators/stamp-duty" className="bg-white/10 text-white font-semibold text-sm px-5 py-3 rounded-xl hover:bg-white/20 transition-colors border border-white/20">
                Stamp Duty Calculator
              </Link>
            </div>
          </div>

          {/* DISCLAIMER */}
          <Disclaimer />

          {/* SHARE */}
          <div className="mt-10">
            <ShareResults
              title="How to Start Investing in UK Property"
              summary="A straight-talking beginner&apos;s guide to UK property investing — strategies, costs, calculators and a realistic timeline."
              url="https://www.propertyvaultuk.co.uk/blog/how-to-start-investing-in-uk-property/"
            />
          </div>
        </div>
      </article>

      {/* FAQ */}
      <section className="section-padding bg-navy-50">
        <div className="container-max max-w-3xl px-4">
          <FAQSchema faqs={faqs} />
        </div>
      </section>
      <RelatedArticles
        slug="how-to-start-investing-in-uk-property"
      />
    </>
  );
}
