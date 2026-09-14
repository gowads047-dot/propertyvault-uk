import Link from "next/link";
import type { Metadata } from "next";
import { ogImages } from "@/lib/site";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { Disclaimer } from "@/components/legal/Disclaimer";

/**
 * The Non-resident Landlord Scheme, for the landlord who lives abroad.
 *
 * The site courts overseas owners — the GCC guide, the Makan pages, the
 * "overseas landlords" line on the guaranteed-rent page — and did not
 * mention the one HMRC scheme every one of them is inside from the day
 * they leave the country. The Monday blog brief flagged the gap.
 *
 * ── What this page relies on ───────────────────────────────────────────────
 *
 * Two GOV.UK pages, both linked: the landlord-facing "Tax on your UK income
 * if you live abroad — rental income", and HMRC's guidance to letting
 * agents and tenants, "Paying tax on rent to landlords abroad". Every rule
 * below — the six-month test, the £100-a-week tenant threshold, basic-rate
 * deduction on net rent, the NRL1 application, quarterly payment within 30
 * days, NRLY and NRL6 by 5 July — is stated on one or the other. The 20%
 * figure is the basic rate of income tax, which HMRC's own worked example
 * uses. Nothing here is drawn from memory or from a third party.
 *
 * ── Why it matters to this business ────────────────────────────────────────
 *
 * Under a guaranteed rent lease we are the tenant. HMRC's scheme puts the
 * duty to deduct on a tenant paying more than £100 a week to a landlord
 * abroad, unless HMRC has approved that landlord to receive rent gross.
 * So a landlord abroad who signs with us without NRL1 approval would have
 * basic-rate tax withheld from every payment. Better they know before
 * they ask us than after we have to explain it.
 *
 * ── What this page does not do ─────────────────────────────────────────────
 *
 * It does not say whether anyone is UK tax resident (the scheme's own test
 * is about where you live, not residence), what treaty relief applies, or
 * what an individual owes. It says what the scheme is, who is in it, and
 * what to do first — and sends the reader to HMRC and to an accountant for
 * the rest.
 */

const TITLE = "Non-Resident Landlord Scheme — Living Abroad, Letting in the UK";
const DESCRIPTION =
  "Live abroad six months or more and let in the UK? HMRC has your agent or tenant take basic-rate tax off the rent unless you are approved to be paid gross.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords:
    "non-resident landlord scheme, NRL1, landlord living abroad UK tax, overseas landlord " +
    "tax deducted from rent, receive rent without tax deducted, HMRC non resident landlord",
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/landlords/non-resident-landlord-scheme/" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "article",
    url: "https://www.propertyvaultuk.co.uk/landlords/non-resident-landlord-scheme/",
    siteName: "PropertyVault UK",
    images: ogImages("The Non-Resident Landlord Scheme, explained"),
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const CHECKED_ON = "14 September 2026";

const KEY_FACTS = [
  { label: "You are in the scheme if", value: "You live abroad for 6 months or more a year" },
  { label: "Who deducts", value: "Your letting agent — or your tenant, if there is no agent and rent is over £100 a week" },
  { label: "How much", value: "Basic-rate income tax on the rent, after expenses the deductor paid" },
  { label: "To receive rent in full", value: "Apply to HMRC — form NRL1 for an individual (NRL2 company, NRL3 trust)" },
  { label: "Still required", value: "A Self Assessment return declaring the rental income, unless HMRC says otherwise" },
];

const ASK = [
  {
    q: "Am I in it?",
    why:
      "The test is where you live, not tax residence: six months or more of the year outside the UK " +
      "puts you in the scheme even if you remain UK tax resident. Company landlords with their main " +
      "office abroad and trustees living abroad are in it too, on their own forms.",
  },
  {
    q: "Who is deducting, and from what?",
    why:
      "A letting agent deducts from the rent they collect. With no agent, a tenant paying more than " +
      "£100 a week deducts instead. Either way it is basic-rate tax on the net rent — the rent less " +
      "any allowable expenses that person paid on your behalf in the quarter — paid to HMRC within " +
      "30 days of the end of each tax quarter, with a certificate to you by 5 July.",
  },
  {
    q: "Can I get the rent without the deduction?",
    why:
      "Yes, with HMRC's approval. An individual applies on form NRL1 — online — and HMRC will not " +
      "approve it if your UK tax affairs are not up to date. Approval means the agent or tenant pays " +
      "you gross; it does not mean the income is untaxed. You still declare it on a Self Assessment " +
      "return and pay whatever is due.",
  },
  {
    q: "What if I lease the property to a company on guaranteed rent?",
    why:
      "The company is your tenant. If it pays you more than £100 a week and you live abroad, HMRC's " +
      "scheme puts the duty to deduct on it. That includes us. Apply for approval before you sign, " +
      "and give us the approval reference — then the rent arrives in full, every month, as agreed.",
  },
];

const faqs = [
  {
    q: "What is the Non-resident Landlord Scheme?",
    a:
      "An HMRC scheme for landlords who live outside the UK for six months or more a year. Unless " +
      "HMRC has approved the landlord to receive rent gross, the letting agent — or a tenant paying " +
      "more than £100 a week where there is no agent — deducts basic-rate income tax from the rent " +
      "and pays it to HMRC each quarter. The landlord still declares the income on a Self Assessment " +
      "return.",
  },
  {
    q: "Does the scheme apply if I am still UK tax resident?",
    a:
      "Yes. The scheme's test is whether you live abroad for six months or more a year, not whether " +
      "you are UK tax resident. You can be resident for tax and still be a non-resident landlord for " +
      "the scheme.",
  },
  {
    q: "How do I receive rent without tax deducted?",
    a:
      "Apply to HMRC for approval — form NRL1 for an individual, NRL2 for a company, NRL3 for a " +
      "trust. HMRC will not approve an application if your taxes are not up to date. Once approved, " +
      "your agent or tenant pays you in full; you remain responsible for declaring the income and " +
      "paying tax through Self Assessment.",
  },
  {
    q: "I live abroad and want guaranteed rent. Will tax be taken off?",
    a:
      "Under a guaranteed rent lease the company is your tenant, and HMRC's scheme puts the duty to " +
      "deduct on a tenant paying a landlord abroad more than £100 a week — unless you hold HMRC's " +
      "approval to be paid gross. Apply for approval first and tell us the reference, and the rent " +
      "arrives in full.",
  },
  {
    q: "Is this the same as the non-resident stamp duty surcharge?",
    a:
      "No. The 2% SDLT surcharge is a one-off charge when a non-UK resident buys residential " +
      "property in England or Northern Ireland. The Non-resident Landlord Scheme is about income " +
      "tax on rent, every quarter, for as long as you let while living abroad. Different tax, " +
      "different test, different form.",
  },
];

export default function NonResidentLandlordSchemePage() {
  return (
    <>
      <section className="gradient-navy py-16 md:py-20">
        <div className="container-max px-4">
          <div className="max-w-3xl">
            <p className="text-gold-400 font-semibold text-xs uppercase tracking-widest mb-3">
              Landlords living abroad
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              The Non-Resident Landlord Scheme
            </h1>
            <p className="text-navy-200 text-lg">
              If you live outside the UK for six months or more a year and let a UK property, HMRC
              has your agent — or your tenant — take basic-rate tax off the rent before it reaches
              you, unless you have asked HMRC not to. It is not a penalty and it is not optional. It
              is the one form to file before anything else.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max max-w-3xl">
          <div role="note" className="rounded-xl border border-navy-200 bg-navy-50 p-5 mb-10">
            <p className="text-sm text-navy-700 leading-relaxed m-0">
              <strong>The short version.</strong> Apply to HMRC on form NRL1 to receive your rent in
              full. Until you are approved, whoever pays you — a letting agent, a tenant paying over
              £100 a week, or a company leasing your property — has to deduct basic-rate tax. You
              still file a Self Assessment return either way.
            </p>
          </div>

          <h2 className="text-xl font-bold text-navy-800 mb-4">The scheme in five lines</h2>
          <dl className="grid sm:grid-cols-2 gap-3 mb-4">
            {KEY_FACTS.map((f) => (
              <div key={f.label} className="rounded-xl border border-navy-100 p-4">
                <dt className="text-xs font-semibold uppercase tracking-wide text-navy-400 mb-1">{f.label}</dt>
                <dd className="text-sm font-semibold text-navy-800 m-0">{f.value}</dd>
              </div>
            ))}
          </dl>
          <p className="text-xs text-navy-400 mb-10">
            From GOV.UK:{" "}
            <a
              href="https://www.gov.uk/tax-uk-income-live-abroad/rent"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold-600 font-semibold"
            >
              Tax on your UK income if you live abroad — rental income
            </a>{" "}
            and HMRC&rsquo;s{" "}
            <a
              href="https://www.gov.uk/guidance/paying-tax-on-rent-to-landlords-abroad"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold-600 font-semibold"
            >
              guidance to letting agents and tenants
            </a>
            . Checked {CHECKED_ON}. Basic-rate income tax is 20%; HMRC&rsquo;s own worked example
            uses it.
          </p>

          <h2 className="text-xl font-bold text-navy-800 mb-2">What to work out, in order</h2>
          <div className="space-y-6">
            {ASK.map((item, i) => (
              <article key={item.q} className="border-t border-navy-100 pt-5">
                <h3 className="text-base font-bold text-navy-800 mb-2">
                  <span className="text-gold-600 mr-2">{i + 1}.</span>
                  {item.q}
                </h3>
                <p className="text-sm text-navy-600 leading-relaxed m-0">{item.why}</p>
              </article>
            ))}
          </div>

          <div className="mt-10 rounded-xl border border-navy-100 bg-navy-50 p-6">
            <h2 className="text-lg font-bold text-navy-800 mb-2">What the deductor has to do</h2>
            <p className="text-sm text-navy-600 leading-relaxed mb-3">
              For the agent or tenant it is a set of HMRC obligations of its own: register for the
              scheme (form NRL4 for an agent), work out basic-rate tax on the quarter&rsquo;s net rent,
              pay it within 30 days of each quarter ending 30 June, 30 September, 31 December and 31
              March, file the annual return NRLY and give the landlord certificate NRL6 by 5 July.
            </p>
            <p className="text-sm text-navy-600 leading-relaxed m-0">
              That is why a landlord abroad without approval is a landlord some agents and companies
              would rather not take on. The approval removes the work for everyone, including you.
            </p>
          </div>

          <div className="mt-6 rounded-xl border border-navy-200 bg-white p-6">
            <h2 className="text-lg font-bold text-navy-800 mb-2">Where we stop</h2>
            <p className="text-sm text-navy-600 leading-relaxed mb-3">
              This page says what the scheme is and what to file. It does not say whether you are UK
              tax resident, what a double-taxation treaty does to your position, or what you owe — those
              depend on your circumstances and on the country you live in.
            </p>
            <p className="text-sm text-navy-600 leading-relaxed m-0">
              HMRC is the authority on the scheme. A property accountant who works with overseas
              landlords can tell you what your return should say.{" "}
              <Link href="/find-agent" className="text-gold-600 font-semibold">
                How to check that an accountant is who they say they are
              </Link>
              .
            </p>
          </div>

          <FAQSchema faqs={faqs} />
        </div>
      </section>

      <section className="section-padding bg-navy-50">
        <div className="container-max max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-navy-800 mb-3">Living abroad and thinking about guaranteed rent?</h2>
          <p className="text-sm text-navy-600 leading-relaxed mb-6">
            Apply for HMRC&rsquo;s approval first, then talk to us — with the approval reference, the
            rent we agree is the rent you receive. Without it, HMRC&rsquo;s scheme has us deduct, and
            we would rather tell you that now than in the first month.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/guaranteed-rent#enquiry" className="btn-gold">
              Get a rent estimate
            </Link>
            <Link
              href="/guaranteed-rent/mortgage-lender"
              className="text-sm font-semibold text-navy-700 self-center px-4"
            >
              The lender question first →
            </Link>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max max-w-3xl">
          <Disclaimer type="tax" />
        </div>
      </section>
    </>
  );
}
