import Link from "next/link";

/**
 * The company-let explainer.
 *
 * This page exists because the objection Makan runs into is not "I don't want
 * a company let" — it is "I don't know what one is". An estate agent's answer
 * to that question is no, delivered before the landlord hears the question, so
 * the explaining has to happen here instead.
 *
 * Written for both sides deliberately. A landlord reading only the upside and
 * an operator reading only the obligations would both come away with a wrong
 * idea of the deal, and the first conversation would waste everybody's time.
 *
 * Rules for this page:
 *   - No legal advice. Consents and paperwork are described as things to check,
 *     with who to check them with, and that limit is stated in the body rather
 *     than in small print.
 *   - No numbers we cannot stand behind. There are no yields, no average rents
 *     and no operator counts here, because we do not have sourced ones.
 */

const FOR_LANDLORDS = [
  {
    t: "Rent whether or not it is occupied",
    b: "The company holds the lease, so void periods are their problem rather than yours. That is the main thing being traded for.",
  },
  {
    t: "One relationship instead of a series of tenancies",
    b: "No re-advertising, no referencing each new tenant, no check-in and check-out every twelve months.",
  },
  {
    t: "They handle the day-to-day",
    b: "Tenant issues and routine maintenance normally sit with the operator. Who covers what is set out in the lease — read that clause carefully, it varies.",
  },
  {
    t: "Usually below full market rent",
    b: "A guaranteed figure is generally under what you would achieve letting it yourself in a good year. You are paying for certainty. Whether that trade is worth it is your call, not ours.",
  },
];

const FOR_COMPANIES = [
  {
    t: "Say what the property is for, up front",
    b: "Serviced accommodation, supported living, an HMO or social housing are very different propositions to a landlord. Naming it in the first message saves you both a week.",
  },
  {
    t: "Expect to evidence the business",
    b: "Company number, how long you have operated, and references from landlords you already lease from. A landlord who asks for these is doing the right thing.",
  },
  {
    t: "Bring the lease",
    b: "Company lets are normally papered by the operator. Landlords will want their own solicitor to look at it, and that is reasonable.",
  },
  {
    t: "Be straight about the consents",
    b: "If the landlord's mortgage or freehold does not permit a company let, it is better for everyone to find that out in week one than after refurbishment.",
  },
];

const CONSENTS = [
  {
    t: "The lender",
    b: "Many buy-to-let mortgages assume an assured shorthold tenancy and require written consent for anything else. Some permit company lets outright, some charge a fee, some decline.",
    who: "Ask your lender's buy-to-let team for their position in writing.",
  },
  {
    t: "The insurer",
    b: "Landlord insurance is usually priced around a known occupancy type. Short stays and supported living are not the same risk as a single household, and an undeclared change can leave a policy ineffective at the moment you need it.",
    who: "Tell your insurer the intended use before the lease starts.",
  },
  {
    t: "The freeholder or managing agent",
    b: "On a leasehold flat the head lease often restricts subletting, short lets or business use. This is the one that most often stops a deal late.",
    who: "Check the head lease, and ask the managing agent in writing.",
  },
  {
    t: "The council, for some uses",
    b: "HMO licensing and, in some areas, planning or additional licensing can apply depending on the property and the use. Requirements differ by council.",
    who: "Check with the local authority for the property's own address.",
  },
];

export default function CompanyLetsPage() {
  return (
    <main style={{ background: "var(--h-bg)" }}>

      <section className="py-16 md:py-20 px-6" style={{ background: "#0f1b36" }}>
        <div className="max-w-3xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#e8c877" }}>
            For landlords and operators
          </p>
          <h1 className="text-4xl md:text-5xl font-black mb-5 text-white leading-tight">
            Company lets, explained
          </h1>
          <p className="text-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.8)" }}>
            A company takes the whole property on a lease and pays you whether or not it is
            occupied. It is a normal arrangement, it is not right for every property, and it is
            the one an estate agent tends to decline on your behalf without asking.
          </p>
        </div>
      </section>

      <section className="py-14 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-black mb-4" style={{ color: "var(--h-text)" }}>
            What it actually is
          </h2>
          <div className="text-lg leading-relaxed space-y-4" style={{ color: "var(--h-muted)" }}>
            <p>
              Instead of letting to a person on an assured shorthold tenancy, you let to a limited
              company on a commercial lease, typically two to five years. The company becomes your
              tenant. It then places its own occupiers in the property &mdash; guests on short
              stays, adults receiving support, or sharers, depending on what the business does.
            </p>
            <p>
              Because your tenant is a business rather than a household, the tenancy rules that
              govern an AST largely do not apply. That cuts both ways: fewer of the protections a
              landlord is used to leaning on, and fewer of the constraints.
            </p>
          </div>
        </div>
      </section>

      <section className="py-14 px-6" style={{ background: "var(--h-warm)" }}>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-xl font-black mb-5" style={{ color: "var(--h-text)" }}>
              If you own the property
            </h2>
            <div className="space-y-5">
              {FOR_LANDLORDS.map(x => (
                <div key={x.t}>
                  <p className="font-bold mb-1" style={{ color: "var(--h-text)" }}>{x.t}</p>
                  <p className="leading-relaxed" style={{ color: "var(--h-muted)" }}>{x.b}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-xl font-black mb-5" style={{ color: "var(--h-text)" }}>
              If you are the company
            </h2>
            <div className="space-y-5">
              {FOR_COMPANIES.map(x => (
                <div key={x.t}>
                  <p className="font-bold mb-1" style={{ color: "var(--h-text)" }}>{x.t}</p>
                  <p className="leading-relaxed" style={{ color: "var(--h-muted)" }}>{x.b}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-black mb-3" style={{ color: "var(--h-text)" }}>
            Four things to check before you sign
          </h2>
          <p className="text-lg leading-relaxed mb-8" style={{ color: "var(--h-muted)" }}>
            None of these are unusual, and none of them are reasons not to do a company let. They
            are the things that stop one late, which is the expensive way to find out.
          </p>
          <div className="space-y-6">
            {CONSENTS.map((c, i) => (
              <div key={c.t} className="flex gap-4">
                <p className="text-2xl font-black shrink-0 tabular-nums"
                   style={{ color: "var(--h-accent)", width: "2rem" }}>{i + 1}</p>
                <div>
                  <p className="font-bold mb-1" style={{ color: "var(--h-text)" }}>{c.t}</p>
                  <p className="leading-relaxed mb-1.5" style={{ color: "var(--h-muted)" }}>{c.b}</p>
                  <p className="text-sm font-semibold" style={{ color: "var(--h-accent-hover)" }}>{c.who}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Stated in the body rather than buried in a footer. A page that
              reads like advice while disclaiming it in 10px is worse than one
              that never explained anything. */}
          <div className="mt-10 p-5 rounded-2xl"
               style={{ background: "var(--h-warm)", border: "1px solid var(--h-border)" }}>
            <p className="leading-relaxed" style={{ color: "var(--h-muted)" }}>
              <strong style={{ color: "var(--h-text)" }}>
                This is general information, not legal or financial advice.
              </strong>{" "}
              Leases, mortgage terms and licensing rules differ by lender, insurer, freeholder and
              council, and they change. Take your own advice on the specific property before you
              commit to anything.
            </p>
          </div>
        </div>
      </section>

      <section className="py-14 px-6" style={{ background: "#0f1b36" }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-black mb-4 text-white">
            Makan just makes the introduction possible
          </h2>
          <p className="text-lg leading-relaxed mb-8 max-w-2xl mx-auto" style={{ color: "rgba(255,255,255,0.8)" }}>
            A landlord ticks whether they would consider a company let. An operator can search for
            landlords who have. Everything after that &mdash; terms, references, the lease &mdash;
            is between the two of you. We are not a party to the agreement and we do not take a cut
            of it.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
            <Link href="/makan/list"
                  className="flex-1 rounded-2xl px-6 py-4 font-bold transition-transform hover:-translate-y-0.5"
                  style={{ background: "#c9a84c", color: "#0a1628" }}>
              List a property
            </Link>
            <Link href="/makan/rooms?let=company"
                  className="flex-1 rounded-2xl px-6 py-4 font-bold text-white transition-transform hover:-translate-y-0.5"
                  style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.25)" }}>
              Find company lets
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
