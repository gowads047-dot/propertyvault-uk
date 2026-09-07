import Link from "next/link";
import { ogImages } from "@/lib/site";
import type { Metadata } from "next";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { Disclaimer } from "@/components/legal/Disclaimer";
import { compare, money, DEFAULT_ASSUMPTIONS } from "@/lib/guaranteed-rent-model";

/** Shared with /guaranteed-rent so the two pages cannot disagree again. */
const A = DEFAULT_ASSUMPTIONS;
const GR = compare(A);

/**
 * The total is the sum of the rounded rows, not the rounding of the true sum.
 * Those differ by £1 here — the rows show £1,200 + £692 + £333 + £600 + £300 =
 * £3,125 while the exact figure rounds to £3,126 — and a column that does not
 * add up is exactly the kind of thing this page was rewritten for.
 */
const DEDUCTIONS_SHOWN =
  Math.round(GR.agentFees) + Math.round(GR.voidCost) + Math.round(GR.tenantFindPerYear) +
  Math.round(GR.maintenance) + Math.round(GR.compliance);

export const metadata: Metadata = {
  title: "Guaranteed Rent vs Letting Agent — Which Pays More?",
  description: "Guaranteed rent vs letting agent — a full cost comparison. We break down agent fees, void periods, maintenance and compliance costs vs guaranteed rent. See which makes you more money.",
  keywords: "guaranteed rent vs letting agent, guaranteed rent vs traditional let, is guaranteed rent worth it, letting agent fees vs guaranteed rent, guaranteed rent comparison UK",
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/guaranteed-rent/vs-letting-agent" },
  openGraph: {
    title: "Guaranteed Rent vs Letting Agent — Which Pays More?",
    description: "A full cost breakdown: agent fees, void periods, maintenance and compliance vs guaranteed rent. See which puts more money in your pocket.",
    url: "https://www.propertyvaultuk.co.uk/guaranteed-rent/vs-letting-agent",
    images: ogImages("Guaranteed rent versus a letting agent — the full cost breakdown"),
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.propertyvaultuk.co.uk" },
    { "@type": "ListItem", position: 2, name: "Guaranteed Rent", item: "https://www.propertyvaultuk.co.uk/guaranteed-rent" },
    { "@type": "ListItem", position: 3, name: "vs Letting Agent", item: "https://www.propertyvaultuk.co.uk/guaranteed-rent/vs-letting-agent" },
  ],
};

const faqs = [
  {
    q: "Is guaranteed rent actually less than letting agent rent?",
    a: "On paper, yes — guaranteed rent is typically 80–90% of market rent. But once you deduct letting agent fees (8–12%), void periods, maintenance call-outs, and compliance costs, most landlords net more with guaranteed rent. The key word is 'net'.",
  },
  {
    q: "Do letting agents charge fees on top of their management percentage?",
    a: "Yes. Most agents charge a tenant-find fee (50–100% of one month's rent), an inventory fee (£100–£200), a renewal fee (£100–£200 per renewal), and may add maintenance mark-ups on contractor invoices. The headline percentage rarely tells the full story.",
  },
  {
    q: "How do void periods affect my letting agent income?",
    a: "This page assumes three weeks empty a year, which on a £1,000/month property is about £692 of lost rent — before any re-marketing fee. Yours may be nothing or may be months; the void period calculator lets you use your own figure. With guaranteed rent, void periods don't exist: you're paid whether the property is occupied or not.",
  },
  {
    q: "Who handles maintenance with guaranteed rent?",
    a: "We do. All day-to-day maintenance is handled and paid for by us during the lease term. With a letting agent, you're still responsible for all repairs — and some agents add a mark-up on contractor costs.",
  },
  {
    q: "Can I switch from a letting agent to guaranteed rent?",
    a: "Yes. Once your current tenancy agreement expires (or with the tenant's agreement), you can transition to a guaranteed rent scheme. We can talk you through the process — most transitions happen within 2–4 weeks of agreement.",
  },
  {
    q: "What if my property needs work before guaranteed rent is possible?",
    a: "In many cases we'll take the property as-is, or advise on minor improvements. We don't require pristine properties — we need them to meet basic safety standards (EPC, gas safety, electrics). We can advise on what's needed during the free estimate call.",
  },
];

const rows = [
  { label: "Monthly income on £1,000 market rent", gr: "£820–£900", la: "£880–£920 (gross)" },
  { label: "Void periods", gr: "Paid whether or not it is let", la: `${A.voidWeeks} weeks assumed (${money(-GR.voidCost)}/yr)` },
  { label: "Management fee", gr: "None", la: `${Math.round(A.agentPct * 100)}% assumed (${money(-GR.agentFees)}/yr)` },
  { label: "Tenant-find fee", gr: "None", la: "50–100% of one month's rent" },
  { label: "Renewal fees", gr: "None", la: "£100–£200 per renewal" },
  { label: "Inventory / check-in fee", gr: "None", la: "£100–£250" },
  { label: "Maintenance & repairs", gr: "We pay all day-to-day costs", la: "Landlord pays all repairs" },
  { label: "Compliance (gas, EICR, EPC)", gr: "We coordinate everything", la: "Landlord arranges & pays" },
  { label: "Midnight emergency calls", gr: "Never", la: "Your responsibility" },
  { label: "Rent chasing / arrears", gr: "Not your problem", la: "You absorb arrears risk" },
  { label: "Contract length", gr: "3–5 years (stable)", la: "6–12 month tenancies (uncertainty)" },
  { label: "Income predictability", gr: "Same amount, same date", la: "Varies month to month" },
];

export default function VsLettingAgentPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Hero */}
      <section className="gradient-navy relative overflow-hidden py-20 md:py-28">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-[10%] w-[500px] h-[500px] bg-gold-400/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-[5%] w-[300px] h-[300px] bg-navy-400/10 rounded-full blur-[80px]" />
        </div>
        <div className="container-max px-4 relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-gold-400 text-sm font-semibold mb-6">
            <span className="w-2 h-2 bg-gold-400 rounded-full animate-pulse" />
            Full cost comparison — no spin
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-5 leading-[1.1]" style={{ fontFamily: "var(--font-family-heading)" }}>
            Guaranteed Rent vs Letting Agent —{" "}
            <span className="text-gradient-gold">Which Pays More?</span>
          </h1>
          <p className="text-xl text-navy-200 mb-8 max-w-2xl mx-auto">
            The agent&apos;s headline percentage looks good. But once you add up voids, fees, maintenance, and compliance, the real picture is very different. We do the maths — honestly.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/guaranteed-rent" className="btn-gold text-base !py-4 !px-8">
              Get a Free Rent Estimate →
            </Link>
            <a
              href="https://wa.me/447415721628?text=Hi%2C%20I%27d%20like%20to%20compare%20guaranteed%20rent%20vs%20my%20letting%20agent."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-all text-base"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp a Question
            </a>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <nav className="bg-navy-50 border-b border-navy-100 py-3">
        <div className="container-max px-4 text-sm text-navy-400">
          <Link href="/" className="hover:text-navy-700">Home</Link>
          <span className="mx-2">›</span>
          <Link href="/guaranteed-rent" className="hover:text-navy-700">Guaranteed Rent</Link>
          <span className="mx-2">›</span>
          <span className="text-navy-700 font-medium">vs Letting Agent</span>
        </div>
      </nav>

      {/* The real cost of a letting agent */}
      <section className="section-padding bg-white">
        <div className="container-max px-4 max-w-3xl mx-auto">
          <p className="text-gold-600 font-bold text-xs uppercase tracking-widest mb-2">The numbers they don&apos;t advertise</p>
          <h2 className="text-3xl font-extrabold text-navy-800 mb-4" style={{ fontFamily: "var(--font-family-heading)" }}>
            The Real Cost of a Letting Agent
          </h2>
          <p className="text-navy-500 mb-8 text-lg leading-relaxed">
            A letting agent&apos;s 10% management fee sounds reasonable. But it&apos;s only part of the story. Here&apos;s the full picture on a typical £1,000/month property.
          </p>

          <div className="space-y-4">
            {[
              { label: `Management fee (${Math.round(A.agentPct * 100)}%)`, cost: `${money(-GR.agentFees)}/yr`, detail: "Every month, taken off the top", color: "bg-red-50 border-red-200 text-red-700" },
              { label: `Void periods (${A.voidWeeks} weeks a year)`, cost: `${money(-GR.voidCost)}/yr`, detail: "No rent while re-letting — and you still have mortgage payments", color: "bg-red-50 border-red-200 text-red-700" },
              { label: `Tenant-find (${money(A.tenantFindFee)}, spread over ${A.tenancyYears} years)`, cost: `${money(-GR.tenantFindPerYear)}/yr`, detail: "Charged again each time a new tenant moves in. Some agents charge a month's rent instead", color: "bg-red-50 border-red-200 text-red-700" },
              { label: "Maintenance & repairs", cost: `${money(-GR.maintenance)}/yr`, detail: "Boiler servicing, appliances, wear and tear — all at your cost", color: "bg-red-50 border-red-200 text-red-700" },
              { label: "Compliance (gas cert, EICR, EPC)", cost: `${money(-GR.compliance)}/yr`, detail: "Your responsibility to arrange and pay. What is required depends on where the property is", color: "bg-red-50 border-red-200 text-red-700" },
            ].map((r) => (
              <div key={r.label} className={`flex items-start justify-between gap-4 rounded-xl border p-4 ${r.color}`}>
                <div>
                  <p className="font-semibold text-sm">{r.label}</p>
                  <p className="text-xs opacity-80 mt-0.5">{r.detail}</p>
                </div>
                <span className="font-bold text-sm whitespace-nowrap">{r.cost}</span>
              </div>
            ))}
            <div className="flex items-center justify-between rounded-xl border border-red-400 bg-red-100 p-4">
              <div>
                <p className="font-bold text-red-800">Total annual deductions</p>
                <p className="text-xs text-red-700 mt-0.5">Before your mortgage payment</p>
              </div>
              <span className="font-extrabold text-red-800 text-lg">{money(-DEDUCTIONS_SHOWN)}/yr</span>
            </div>
          </div>

          <div className="mt-8 rounded-2xl bg-navy-800 text-white p-6">
            <p className="text-gold-400 font-bold text-sm uppercase tracking-wider mb-2">The bottom line</p>
            <p className="text-xl font-bold mb-1">{money(GR.annualMarketRent)} gross rent → {money(GR.lettingAgentNet)} in your pocket</p>
            <p className="text-navy-200 text-sm">After fees, voids, maintenance and compliance on a £1,000/month property managed through a traditional agent.</p>
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="section-padding bg-navy-50">
        <div className="container-max px-4">
          <div className="text-center mb-10">
            <p className="text-gold-600 font-bold text-xs uppercase tracking-widest mb-2">Side-by-side</p>
            <h2 className="text-3xl font-extrabold text-navy-800" style={{ fontFamily: "var(--font-family-heading)" }}>
              Feature-by-Feature Comparison
            </h2>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-navy-100 bg-white shadow-sm">
            <table className="w-full text-sm" style={{ minWidth: 600 }}>
              <thead>
                <tr className="border-b border-navy-100">
                  <th className="text-left p-4 text-navy-500 font-semibold w-1/2">Feature</th>
                  <th className="p-4 text-center font-bold text-navy-800 w-1/4 bg-gold-50">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-gold-400" />
                      Guaranteed Rent
                    </span>
                  </th>
                  <th className="p-4 text-center font-semibold text-navy-500 w-1/4">Letting Agent</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={row.label} className={i % 2 === 0 ? "bg-white" : "bg-navy-50/50"}>
                    <td className="p-4 text-navy-700 font-medium">{row.label}</td>
                    <td className="p-4 text-center font-semibold text-green-700 bg-gold-50/40">
                      <span className="inline-flex items-center gap-1 justify-center">
                        <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        {row.gr}
                      </span>
                    </td>
                    <td className="p-4 text-center text-navy-500">{row.la}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Real example */}
      <section className="section-padding bg-white">
        <div className="container-max px-4 max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-gold-600 font-bold text-xs uppercase tracking-widest mb-2">Real example</p>
            <h2 className="text-3xl font-extrabold text-navy-800" style={{ fontFamily: "var(--font-family-heading)" }}>
              The Same Property. Two Different Outcomes.
            </h2>
            <p className="text-navy-500 mt-3">3-bed house, Birmingham. Market rent: £1,050/month. 1-year comparison.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Letting agent column */}
            <div className="rounded-2xl border-2 border-navy-100 p-6">
              <p className="font-bold text-navy-800 text-lg mb-5">Via Letting Agent</p>
              <div className="space-y-3 text-sm">
                {[
                  { item: "Gross rent (11 months, 1 void)", value: "£11,550", neg: false },
                  { item: "Management fee (10%)", value: "−£1,155", neg: true },
                  { item: "Tenant-find fee", value: "−£1,050", neg: true },
                  { item: "Inventory + admin fees", value: "−£300", neg: true },
                  { item: "Gas safety + EICR + EPC", value: "−£350", neg: true },
                  { item: "Maintenance & repairs (avg)", value: "−£650", neg: true },
                ].map((r) => (
                  <div key={r.item} className="flex justify-between items-center">
                    <span className="text-navy-600">{r.item}</span>
                    <span className={`font-semibold ${r.neg ? "text-red-600" : "text-navy-800"}`}>{r.value}</span>
                  </div>
                ))}
                <div className="border-t border-navy-100 pt-3 flex justify-between items-center">
                  <span className="font-bold text-navy-800">Net annual income</span>
                  <span className="font-extrabold text-xl text-navy-800">£8,045</span>
                </div>
              </div>
            </div>

            {/* Guaranteed rent column */}
            <div className="rounded-2xl border-2 border-gold-300 bg-gold-50/30 p-6">
              <div className="flex items-center gap-2 mb-5">
                <p className="font-bold text-navy-800 text-lg">Guaranteed Rent</p>
                <span className="px-2 py-0.5 bg-gold-400 text-navy-900 text-xs font-bold rounded-full">PropertyVault</span>
              </div>
              <div className="space-y-3 text-sm">
                {[
                  { item: "Guaranteed rent (85% of market, 12 months)", value: "£10,710", neg: false },
                  { item: "Management fee", value: "£0", neg: false },
                  { item: "Void periods", value: "£0", neg: false },
                  { item: "Tenant-find / renewal fees", value: "£0", neg: false },
                  { item: "Compliance coordination", value: "£0", neg: false },
                  { item: "Day-to-day maintenance", value: "£0", neg: false },
                ].map((r) => (
                  <div key={r.item} className="flex justify-between items-center">
                    <span className="text-navy-600">{r.item}</span>
                    <span className={`font-semibold ${r.value === "£0" ? "text-green-600" : "text-navy-800"}`}>{r.value}</span>
                  </div>
                ))}
                <div className="border-t border-gold-200 pt-3 flex justify-between items-center">
                  <span className="font-bold text-navy-800">Net annual income</span>
                  <span className="font-extrabold text-xl text-green-700">£10,710</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-green-50 border border-green-200 p-6 text-center">
            <p className="text-green-800 font-bold text-xl">
              Guaranteed rent: <span className="text-2xl">+£2,665 more per year</span>
            </p>
            <p className="text-green-700 text-sm mt-1">On the same property — with zero management effort.</p>
          </div>
        </div>
      </section>

      {/* When GR might not be right */}
      <section className="section-padding bg-navy-50">
        <div className="container-max px-4 max-w-3xl mx-auto">
          <h2 className="text-2xl font-extrabold text-navy-800 mb-2" style={{ fontFamily: "var(--font-family-heading)" }}>
            When Guaranteed Rent Makes Sense — and When It Might Not
          </h2>
          <p className="text-navy-500 mb-8">We&apos;re not going to pretend it&apos;s the right choice for every landlord.</p>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <p className="font-bold text-green-700 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                Guaranteed rent is likely the better choice if…
              </p>
              <ul className="space-y-2 text-sm text-navy-600">
                {[
                  "You value income predictability over maximum gross rent",
                  "You work full-time and don't want to manage tenants",
                  "You've experienced voids or rent arrears in the past",
                  "You own a portfolio and management is taking over your life",
                  "You're based outside the UK or away from your properties",
                  "You're approaching retirement and want passive income",
                ].map((t) => (
                  <li key={t} className="flex gap-2">
                    <span className="text-green-500 flex-shrink-0 mt-0.5">✓</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-bold text-navy-600 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                A letting agent may suit you better if…
              </p>
              <ul className="space-y-2 text-sm text-navy-600">
                {[
                  "Your property commands above-market premium rent",
                  "You actively enjoy managing properties and tenants",
                  "You have a trusted local contractor network keeping costs low",
                  "Your property is outside our current coverage area",
                  "You're planning to sell within the next 12 months",
                ].map((t) => (
                  <li key={t} className="flex gap-2">
                    <span className="text-navy-400 flex-shrink-0 mt-0.5">→</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Mid-page CTA */}
      <section className="gradient-navy section-padding">
        <div className="container-max px-4 max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-white mb-4" style={{ fontFamily: "var(--font-family-heading)" }}>
            Find Out What We&apos;d Pay for Your Property
          </h2>
          <p className="text-navy-200 mb-8">
            No obligation. No hard sell. Just a guaranteed rent figure for your specific property — typically within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/guaranteed-rent" className="btn-gold text-base !py-4 !px-8">
              Get a Free Rent Estimate →
            </Link>
            <a
              href="https://calendly.com/gowads047/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-4 border border-white/20 text-white font-semibold rounded-xl hover:border-white/40 transition-all text-base"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
              Book a Free 15-Min Call
            </a>
          </div>
          <p className="text-navy-400 text-xs mt-5">Covering Birmingham, Nottingham, Derby, Leicester, Coventry &amp; Sheffield</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-white">
        <div className="container-max px-4 max-w-3xl mx-auto">
          <h2 className="text-2xl font-extrabold text-navy-800 mb-8" style={{ fontFamily: "var(--font-family-heading)" }}>
            Common Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.q} className="border-b border-navy-100 pb-6">
                <p className="font-bold text-navy-800 mb-2">{faq.q}</p>
                <p className="text-navy-500 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
          <FAQSchema faqs={faqs} />
        </div>
      </section>

      {/* Related links */}
      <section className="bg-navy-50 section-padding">
        <div className="container-max px-4 max-w-3xl mx-auto">
          <h3 className="font-bold text-navy-800 mb-4">Related guides</h3>
          <div className="grid sm:grid-cols-3 gap-3">
            <Link href="/guaranteed-rent" className="block bg-white rounded-xl border border-navy-100 p-4 hover:shadow-md transition-all">
              <p className="text-xs font-bold text-navy-500 mb-1">Landlords</p>
              <p className="font-bold text-navy-800 text-sm hover:text-gold-600 transition-colors">Guaranteed Rent — Full Guide</p>
            </Link>
            <Link href="/blog/guaranteed-rent-explained" className="block bg-white rounded-xl border border-navy-100 p-4 hover:shadow-md transition-all">
              <p className="text-xs font-bold text-navy-500 mb-1">Blog</p>
              <p className="font-bold text-navy-800 text-sm hover:text-gold-600 transition-colors">Is Guaranteed Rent Worth It?</p>
            </Link>
            <Link href="/calculators/landlord-costs" className="block bg-white rounded-xl border border-navy-100 p-4 hover:shadow-md transition-all">
              <p className="text-xs font-bold text-navy-500 mb-1">Calculator</p>
              <p className="font-bold text-navy-800 text-sm hover:text-gold-600 transition-colors">Landlord Cost Calculator</p>
            </Link>
          </div>
        </div>
      </section>

      <Disclaimer type="financial" />
    </>
  );
}
