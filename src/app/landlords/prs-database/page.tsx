import Link from "@/components/ui/Link";
import type { Metadata } from "next";
import { ogImages } from "@/lib/site";
import ApiForm from "@/components/forms/ApiForm";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { Disclaimer } from "@/components/legal/Disclaimer";
import { events } from "@/lib/analytics";
import { findService } from "@/lib/services";

/**
 * The landlord database, and what a West Midlands landlord needs ready.
 *
 * A dated regulatory event in the cities this business already operates in.
 * The Renters' Rights Act 2025 database opens for registration on 15 December
 * 2026, starting with the West Midlands, and asks for exactly the things
 * Rentura's compliance calendar already holds — the dates of the gas safety
 * record, the EICR, the EPC, and HMO licensing status.
 *
 * ── What this page is not ──────────────────────────────────────────────────
 *
 * It was proposed as a priced "PRS-Ready Pack": done-for-you certificate
 * gathering at £12 a property, then Rentura at £39 a month. Neither price is
 * configured anywhere, Rentura is £9.99, and the site does not put a price on
 * anything that cannot be bought today. So the service below is a request —
 * a person answers — and the price is whatever the owner sets when there is
 * one.
 *
 * The proposal also said landlords must "register gas/EICR/EPC evidence".
 * The NRLA's account of the registration fields lists the DATES of those
 * documents, and does not say whether the documents themselves are uploaded.
 * That distinction is the whole difference between "have your certificates
 * to hand" and "have your certificate dates to hand", so the page says what
 * is known and does not guess the rest.
 *
 * ── Legal claims ───────────────────────────────────────────────────────────
 *
 * NEEDS REVIEW BY A SOLICITOR. Every date, fee and penalty figure here is
 * drawn from the National Residential Landlords Association's guidance and
 * the trade press reporting MHCLG's announcement, checked on 12 September
 * 2026. None of it is from primary legislation or regulations read directly.
 * The "prs-database" term in legal-review.ts puts this page on the review
 * list so the claims are not treated as settled until somebody qualified
 * says so.
 *
 * England only. The database is an England scheme; Wales, Scotland and
 * Northern Ireland have their own registration regimes and this page says
 * nothing about them.
 */

const TITLE = "Landlord Database Opens 15 December — What to Have Ready";
const DESCRIPTION =
  "England's landlord database opens 15 December 2026, West Midlands first; deadline 14 March 2027. What it asks for, what it costs, the penalties, how to prepare.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords:
    "PRS database registration, landlord database 15 December 2026, register your rental " +
    "property West Midlands, Renters Rights Act landlord database, PRS database £65 fee, " +
    "landlord database Birmingham deadline",
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/landlords/prs-database/" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "article",
    url: "https://www.propertyvaultuk.co.uk/landlords/prs-database/",
    siteName: "PropertyVault UK",
    images: ogImages("The landlord database opens 15 December 2026"),
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

/** Sourced from the NRLA's guidance. The page says so where it is shown. */
const CHECKED_ON = "12 September 2026";

const KEY_FACTS = [
  { label: "Registration opens", value: "15 December 2026" },
  { label: "First region", value: "West Midlands" },
  { label: "West Midlands deadline", value: "14 March 2027" },
  { label: "Other regions", value: "Called forward month by month through 2027" },
  { label: "Fee", value: "£65 per property, renewed every year" },
  { label: "Applies to", value: "England only" },
];

/**
 * What the registration asks for, per the NRLA's list. Grouped the way a
 * landlord would gather it, with the Rentura field that already holds each
 * one — because that is the actual point: the tool exists and is £9.99.
 */
const NEEDED = [
  {
    group: "About you",
    items: [
      "Name, date of birth, residential address, phone and email",
      "For a company: legal entity type, registered address, and director or trustee details",
    ],
    rentura: null,
  },
  {
    group: "About each property",
    items: [
      "Address, ownership type, dwelling type and number of bedrooms",
      "Whether it is currently let",
    ],
    rentura: "Property Passport",
  },
  {
    group: "About the tenancy",
    items: [
      "Rent amount and frequency",
      "Number of occupants, and whether it is furnished",
      "HMO licensing status",
    ],
    rentura: "Tenancies, and the HMO licence entry in the compliance calendar",
  },
  {
    group: "Safety standards",
    items: [
      "Date of the most recent gas safety record",
      "Expiry of the current EICR",
      "EPC status, and any MEES exemption",
    ],
    rentura: "Compliance calendar — gas safety, EICR and EPC each have their own entry with dates",
  },
];

const faqs = [
  {
    q: "When does the landlord database open?",
    a:
      "Registration opens on 15 December 2026 and rolls out one region at a time, starting with " +
      "the West Midlands. Landlords with property there have until 14 March 2027 to register. " +
      "Other regions are called forward month by month through 2027. This is drawn from the " +
      "NRLA's guidance as at 12 September 2026 and should be checked against GOV.UK when your " +
      "region is called.",
  },
  {
    q: "What does it cost?",
    a:
      "£65 per property, paid on registration and again at each annual renewal. A landlord with " +
      "four properties pays £260 a year.",
  },
  {
    q: "Do I have to upload my gas safety certificate, EICR and EPC?",
    a:
      "The published list of registration fields asks for the date of the gas safety record, the " +
      "expiry of the EICR, and the EPC's status. Whether the documents themselves are uploaded or " +
      "the dates are declared is not something the guidance we have read makes clear, so we are " +
      "not going to tell you either way. What is certain is that you need those dates to hand, and " +
      "the certificates behind them, because a false declaration is the most heavily penalised " +
      "thing you can do on this system.",
  },
  {
    q: "What happens if I do not register?",
    a:
      "Per the NRLA's summary: a civil penalty of up to £7,000 for letting or marketing a property " +
      "without registering it, or for failing to keep the record up to date; up to £40,000 for " +
      "knowingly providing false information or for a continuing breach; rent repayment orders " +
      "available to tenants; and restrictions on obtaining possession. The larger figure is the " +
      "one people quote, and it is the penalty for lying or persisting, not the one for being " +
      "late. Both are worth avoiding and neither is a figure this page can vouch for without a " +
      "solicitor.",
  },
  {
    q: "Does this apply in Wales, Scotland or Northern Ireland?",
    a:
      "No. This is an England scheme under the Renters' Rights Act 2025. Wales, Scotland and " +
      "Northern Ireland each have their own landlord registration requirements, which are " +
      "different and are not covered here.",
  },
  {
    q: "Is this the same as the PRS Ombudsman?",
    a:
      "No, they are separate requirements under the same Act. The database is where you register " +
      "yourself and your properties; the Ombudsman is a redress scheme you must join. This page is " +
      "about the database only.",
  },
  {
    q: "What does PropertyVault actually do here?",
    a:
      "Two things, and neither is registering for you. Rentura is a landlord dashboard at £9.99 a " +
      "month whose compliance calendar already holds every safety date the database asks for, per " +
      "property, so the information is ready when you are called forward. And if you would rather " +
      "somebody looked at your properties and told you what is missing before December, you can " +
      "ask below and a person will reply — there is no fixed price for that yet, and we will not " +
      "invent one.",
  },
];

export default function PrsDatabasePage() {
  const service = findService("prs-readiness");

  return (
    <>
      <section className="gradient-navy py-16 md:py-20">
        <div className="container-max px-4">
          <div className="max-w-3xl">
            <p className="text-gold-400 font-semibold text-xs uppercase tracking-widest mb-3">
              England · West Midlands first
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              The landlord database opens on 15 December. Here is what you need ready.
            </h1>
            <p className="text-navy-200 text-lg">
              Every landlord in England will have to register themselves and each property, and
              the West Midlands goes first. The registration asks for things you either have to
              hand or spend an afternoon finding. This page is the list.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max max-w-3xl">
          {/* The claims on this page are dated and sourced up front, because
              they will change and a reader should know how old they are. */}
          <div role="note" className="rounded-xl border border-navy-200 bg-navy-50 p-5 mb-10">
            <p className="text-sm text-navy-700 leading-relaxed m-0">
              <strong>Where these facts come from.</strong> The dates, fee and penalties below are
              taken from the National Residential Landlords Association&rsquo;s guidance and the
              trade press reporting the government&rsquo;s announcement, checked on {CHECKED_ON}.
              They are not read from the regulations directly, and they will be updated as the
              scheme is. Before you act on any of them, check GOV.UK for your region and, for
              anything with a penalty attached, ask a solicitor.
            </p>
          </div>

          <h2 className="text-xl font-bold text-navy-800 mb-4">The facts, as published</h2>
          <dl className="grid sm:grid-cols-2 gap-x-8 gap-y-3 text-sm mb-10">
            {KEY_FACTS.map((f) => (
              <div key={f.label} className="flex flex-col border-b border-navy-100 pb-2">
                <dt className="font-semibold text-navy-700">{f.label}</dt>
                <dd className="text-navy-600 m-0">{f.value}</dd>
              </div>
            ))}
          </dl>

          <h2 className="text-xl font-bold text-navy-800 mb-2">What the registration asks for</h2>
          <p className="text-sm text-navy-600 leading-relaxed mb-6">
            Per the NRLA&rsquo;s list of registration fields. Grouped the way you would gather
            it. Where a Rentura screen already holds the answer, it says so — that is the reason
            this page exists rather than a sales pitch dressed as one.
          </p>

          <div className="space-y-6">
            {NEEDED.map((n) => (
              <article key={n.group} className="border-t border-navy-100 pt-5">
                <h3 className="text-base font-bold text-navy-800 mb-2">{n.group}</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-navy-600 mb-2">
                  {n.items.map((it) => <li key={it}>{it}</li>)}
                </ul>
                {n.rentura ? (
                  <p className="text-xs text-navy-500 m-0">
                    <span className="font-semibold text-gold-700">In Rentura:</span> {n.rentura}
                  </p>
                ) : (
                  <p className="text-xs text-navy-500 m-0">
                    Yours to know. No tool holds your date of birth for you.
                  </p>
                )}
              </article>
            ))}
          </div>

          <div className="mt-10 rounded-xl border border-navy-200 bg-white p-6">
            <h2 className="text-lg font-bold text-navy-800 mb-2">The one thing we will not tell you</h2>
            <p className="text-sm text-navy-600 leading-relaxed m-0">
              Whether you upload the certificates or declare their dates. The guidance we have
              read lists the dates as registration fields and says nothing about attaching
              documents. We are not going to fill that gap with a guess, because the most heavily
              penalised thing on this system is a false declaration. Have the dates ready, and
              keep the certificates behind them where you can find them.
            </p>
          </div>

          <h2 className="text-xl font-bold text-navy-800 mt-12 mb-2">What Rentura does with this</h2>
          <p className="text-sm text-navy-600 leading-relaxed mb-4">
            Rentura&rsquo;s compliance calendar holds gas safety, EICR, EPC, HMO licence and
            selective licence entries per property, each with its dates, and warns at 45 days and
            again at 14. The Property Passport holds the address, type, bedrooms and tenancy. That
            is most of the registration, already in one place, at{" "}
            <strong className="text-navy-800">{findService("rentura")?.price ?? "£9.99/month"}</strong>{" "}
            with a 30-day trial and a card required up front.
          </p>
          <p className="text-sm text-navy-600 leading-relaxed mb-6">
            It does not register for you, and it does not know your date of birth. It means that
            when your region is called, the part you would otherwise spend an afternoon on is a
            screen you open.
          </p>
          <Link href="/rentura" className="btn-gold">See Rentura →</Link>

          <FAQSchema faqs={faqs} />
        </div>
      </section>

      {/* A request, not a product. A person reads it and replies. The price
          is whatever the owner decides when there is one, which is why the
          catalogue entry carries none. */}
      <section className="section-padding bg-navy-50">
        <div className="container-max max-w-2xl">
          <h2 className="text-xl font-bold text-navy-800 mb-2">
            {service?.name ?? "Ask us what you are missing"}
          </h2>
          <p className="text-sm text-navy-600 mb-2 leading-relaxed">
            If you have properties in the West Midlands and would rather somebody looked at what
            you hold and told you what is missing before December, say so here. A person reads
            it and replies. There is no fixed price for this yet — we will tell you what it would
            cost, if anything, before doing any of it.
          </p>
          <p className="text-sm text-navy-500 mb-6 leading-relaxed">
            Tell us roughly how many properties and which city. Nothing else is needed to get a
            straight answer.
          </p>

          <div className="rounded-xl border border-navy-200 bg-white p-6">
            <ApiForm
              source="request:prs-readiness"
              submitLabel="Ask about readiness"
              successTitle="Noted, thank you."
              successBody="A person will reply about your properties. Nothing else — we will not add you to a newsletter."
              sentEvent={events.serviceEnquirySent}
              sentParams={{ service: "prs-readiness" }}
              className="space-y-4"
            >
              <input type="hidden" name="subject" value="PRS database readiness — request" />
              <div>
                <label htmlFor="prs-name" className="block text-sm font-semibold text-navy-700 mb-1">Your name</label>
                <input id="prs-name" name="name" type="text" required maxLength={100} autoComplete="name"
                  className="w-full px-4 py-3 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400" />
              </div>
              <div>
                <label htmlFor="prs-email" className="block text-sm font-semibold text-navy-700 mb-1">Email</label>
                <input id="prs-email" name="email" type="email" required maxLength={200} autoComplete="email"
                  className="w-full px-4 py-3 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400" />
              </div>
              <div>
                <label htmlFor="prs-msg" className="block text-sm font-semibold text-navy-700 mb-1">
                  How many properties, and where?
                </label>
                <textarea id="prs-msg" name="message" rows={3} maxLength={5000} required
                  className="w-full px-4 py-3 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400" />
              </div>
            </ApiForm>
          </div>

          <p className="text-sm text-navy-600 mt-8">
            The Ombudsman is a separate requirement under the same Act.{" "}
            <Link href="/blog/prs-ombudsman-landlord-registration" className="text-gold-600 font-semibold">
              That one is covered here
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max max-w-3xl">
          <Disclaimer type="general" />
        </div>
      </section>
    </>
  );
}
