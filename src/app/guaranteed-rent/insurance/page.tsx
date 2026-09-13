import Link from "next/link";
import type { Metadata } from "next";
import { ogImages } from "@/lib/site";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { Disclaimer } from "@/components/legal/Disclaimer";

/**
 * Will my insurer allow guaranteed rent?
 *
 * The sibling of /guaranteed-rent/mortgage-lender, for the other party who
 * can void the arrangement after it is signed. Searching the question gets a
 * page of results about rent guarantee insurance — a product that pays out
 * when a tenant defaults, which is not what was asked — and nothing from any
 * guaranteed-rent company. Same gap, same reason: the honest answer is "tell
 * your insurer first", and that costs leases.
 *
 * ── What this page relies on ───────────────────────────────────────────────
 *
 * Two specialist brokers, both linked from the page, say the same thing in
 * the same words: standard landlord policies assume a direct tenancy with
 * the occupier, sub-letting "will usually void the insurance policy", and
 * failing to tell the insurer "could invalidate the cover". Falcon puts the
 * proportion of standard policies written that way at "approximately 90%";
 * the page attributes that figure to them rather than asserting it. The
 * NRLA's guidance that insurers ask about occupant type is the third source.
 *
 * ── What this page does not do ─────────────────────────────────────────────
 *
 * It does not say what any insurer will decide, what any policy says, or
 * what a claim would pay. It names no insurer's terms. It does not restate
 * insurance law — the duty of fair presentation under the Insurance Act 2015
 * is real and is exactly the kind of thing this site does not paraphrase
 * from memory. It says "tell them, in writing, before you sign", which is
 * the action that is right under every reading.
 *
 * NEEDS REVIEW BY A BROKER before this is treated as settled. The shape —
 * that a guaranteed rent lease is a company let with sub-letting, that
 * standard policies are not written for that, that disclosure is the
 * landlord's job and that specialist cover exists — is what the brokers
 * say. Nothing here is a statement about any named insurer's policy.
 */

const TITLE = "Will My Insurer Allow Guaranteed Rent? | PropertyVault UK";
const DESCRIPTION =
  "A guaranteed rent lease is a company let with sub-letting, and most landlord policies are not written for that. What to tell your insurer, in which words, before you sign.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords:
    "will my insurer allow guaranteed rent, landlord insurance company let, landlord insurance " +
    "rent to rent, sublet landlord insurance, guaranteed rent insurance invalidate, buildings " +
    "insurance guaranteed rent scheme",
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/guaranteed-rent/insurance/" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "article",
    url: "https://www.propertyvaultuk.co.uk/guaranteed-rent/insurance/",
    siteName: "PropertyVault UK",
    images: ogImages("Will my insurer allow guaranteed rent?"),
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

/**
 * The questions to put to an insurer, and why each one is asked. Same
 * reasoning as the lender page: the landlord who asks "can I do guaranteed
 * rent?" gets a no from somebody who has not understood the arrangement.
 */
const ASK = [
  {
    q: "Does my policy cover the property when it is let to a company that places the occupiers?",
    why:
      "This is the arrangement, in the words an underwriter uses. We take a lease of the property " +
      "and place the occupier ourselves. To an insurer that is a company let with sub-letting, and " +
      "whether the policy covers it is a question about the policy, not about us.",
  },
  {
    q: "Does it cover sub-letting?",
    why:
      "Two specialist brokers we have read say that on a standard landlord policy it usually does " +
      "not, and that sub-letting without telling the insurer will usually void the cover. Yours may " +
      "differ. The only way to know is to ask, and the only answer that counts is a written one.",
  },
  {
    q: "What do you need to know about the occupiers?",
    why:
      "Insurers ask about occupant type — working, retired, on benefits, students — and price and " +
      "accept on it. Under a lease the occupier is chosen by us, so tell the insurer that, and ask " +
      "what they need from us. We will answer whatever they ask.",
  },
  {
    q: "Does the buildings cover stay with me, and does the term of the lease matter?",
    why:
      "Under our lease you remain responsible for the building and for buildings insurance, so the " +
      "policy stays in your name. Say the lease runs three to five years; some insurers want to " +
      "know the term as well as the arrangement.",
  },
  {
    q: "Will you confirm the cover in writing, or endorse the policy?",
    why:
      "If the answer is yes, ask for the policy to be endorsed or for a letter saying the " +
      "arrangement is covered, and keep it with the schedule. A yes on the phone is not something " +
      "you can show a loss adjuster.",
  },
];

const faqs = [
  {
    q: "Will my landlord insurance cover a guaranteed rent scheme?",
    a:
      "Ask before assuming it does. A guaranteed rent lease is a company let in which the company " +
      "places the occupier — to an insurer, that is sub-letting. Specialist brokers say most " +
      "standard landlord policies are written on the assumption of a direct tenancy with the " +
      "occupier and that sub-letting will usually void the cover unless the insurer has agreed " +
      "to it. Tell your insurer, in those words, before you sign, and get the answer in writing.",
  },
  {
    q: "What happens if I do not tell my insurer?",
    a:
      "The risk is that a claim is refused. The brokers we have read say failing to tell the " +
      "insurer about sub-letting could invalidate the cover, which would leave the landlord " +
      "carrying repair costs and liability after a fire, a flood or an injury. Whether that " +
      "happens in a given case depends on the policy and the facts; the way to make it not " +
      "matter is to disclose first.",
  },
  {
    q: "Is rent guarantee insurance the same thing?",
    a:
      "No. Rent guarantee insurance is a policy a landlord buys that pays out if their own tenant " +
      "stops paying. A guaranteed rent scheme is a lease to a company that pays the rent itself " +
      "and finds the occupier. Searching for one returns pages about the other, which is part of " +
      "why this question is hard to get answered.",
  },
  {
    q: "Who insures what under a guaranteed rent lease?",
    a:
      "Under our lease the owner keeps responsibility for the building and for buildings " +
      "insurance. Ask us what cover we hold for our own liability and for the contents we place, " +
      "and ask your insurer whether they want to see it. What matters to them is that the " +
      "building is insured by a policy that knows how the property is being used.",
  },
  {
    q: "What if my insurer says no?",
    a:
      "Some insurers decline company lets and sub-letting outright; others accept with an " +
      "endorsement and a change to the premium; and there are brokers who place cover written " +
      "specifically for sub-let and company-let properties. A no from your current insurer is a " +
      "reason to ask a broker, not a reason to sign anyway. Whatever the premium, put it into the " +
      "comparison before you decide.",
  },
  {
    q: "Will you wait while I check?",
    a:
      "Yes. There is no exclusivity and nothing to pay before you sign, so there is nothing lost " +
      "by asking your insurer and your lender first. If either says no, you have found out for " +
      "the price of an email.",
  },
];

export default function InsurancePage() {
  return (
    <>
      <section className="gradient-navy py-16 md:py-20">
        <div className="container-max px-4">
          <div className="max-w-3xl">
            <p className="text-gold-400 font-semibold text-xs uppercase tracking-widest mb-3">
              Before you sign anything
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Will my insurer allow guaranteed rent?
            </h1>
            <p className="text-navy-200 text-lg">
              Not by default, and not without being told. A guaranteed rent lease changes how the
              property is occupied, and a landlord policy that does not know that may not pay when
              it matters. It is the second question to settle before you sign — the first is your
              lender — and we would rather you asked both before you spoke to us.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max max-w-3xl">
          <div role="note" className="rounded-xl border border-navy-200 bg-navy-50 p-5 mb-10">
            <p className="text-sm text-navy-700 leading-relaxed m-0">
              <strong>The short version.</strong> Tell your insurer that the property will be let
              to a company on a three-to-five-year lease, and that the company will{" "}
              <em>sub-let</em> it to the people who live there. Use those words. Ask whether the
              policy covers that, and get the answer in writing. If it does not, ask a broker
              before you ask us.
            </p>
          </div>

          <h2 className="text-xl font-bold text-navy-800 mb-3">What insurers actually object to</h2>
          <p className="text-sm text-navy-600 leading-relaxed mb-4">
            Not the guarantee, and not us. A landlord policy is priced on who occupies the property
            and on what terms. The two specialist brokers whose guidance this page draws on both
            say that standard landlord policies assume a direct tenancy between the landlord and
            the occupier —{" "}
            <a
              href="https://www.falconinsurance.co.uk/sublet-insurance/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold-600 font-semibold"
            >
              Falcon Insurance
            </a>{" "}
            puts it at &ldquo;approximately 90%&rdquo; of them — and that sub-letting on such a
            policy &ldquo;will usually void&rdquo; it.{" "}
            <a
              href="https://gpsib.com/property-subletting-what-landlords-need-to-know-regarding-insurance-implications/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold-600 font-semibold"
            >
              GPS Insurance Brokers
            </a>{" "}
            say the same, and that failing to tell the insurer &ldquo;could invalidate the
            cover&rdquo;.
          </p>
          <p className="text-sm text-navy-600 leading-relaxed mb-4">
            A guaranteed rent lease is exactly that arrangement. We take a lease of your property
            and place the occupier ourselves, so the people living there have their agreement with
            us, not with you. To an insurer that is a company let with sub-letting, whatever it is
            called on the front of the contract.
          </p>
          <p className="text-sm text-navy-600 leading-relaxed mb-8">
            The consequence of not saying so is not a fine. It is a claim that is refused after the
            fire or the escape of water, when the loss adjuster reads the tenancy and finds a
            company where the policy expected a person.{" "}
            <strong className="text-navy-800">
              Disclosure is yours to make, before you sign, and it is the whole of what this page
              asks you to do.
            </strong>
          </p>

          <h2 className="text-xl font-bold text-navy-800 mb-2">What to ask, in these words</h2>
          <p className="text-sm text-navy-600 leading-relaxed mb-6">
            The{" "}
            <a
              href="https://www.nrla.org.uk/news/six-tenant-types-to-consider-when-buying-insurance"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold-600 font-semibold"
            >
              NRLA
            </a>{" "}
            notes that insurers ask about occupant type and want to be told when it changes. A
            company let is a change of that kind. These are the questions that get a straight
            answer.
          </p>

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
            <h2 className="text-lg font-bold text-navy-800 mb-2">If the answer is no</h2>
            <p className="text-sm text-navy-600 leading-relaxed m-0">
              It is a common answer and not the end of the question. Some insurers decline company
              lets outright; others accept with an endorsement and a different premium; and there
              are brokers who place policies written for sub-let and company-let properties.
              Whatever the new premium is, it belongs in{" "}
              <Link href="/guaranteed-rent/vs-letting-agent" className="text-gold-600 font-semibold">
                the comparison
              </Link>{" "}
              before you decide — a guarantee that costs more in cover than it saves in voids is
              not one to take.
            </p>
          </div>

          {/* The site does not restate law from memory. Insurance law has a
              duty of disclosure with its own name and its own remedies, and
              this is where a reader gets pointed at someone who can state it. */}
          <div className="mt-6 rounded-xl border border-navy-200 bg-white p-6">
            <h2 className="text-lg font-bold text-navy-800 mb-2">Where we stop</h2>
            <p className="text-sm text-navy-600 leading-relaxed mb-3">
              This page explains what insurers tend to object to and what to ask. It does not tell
              you what your policy covers, what you are obliged to disclose, or what an insurer can
              do if something was not disclosed — those are questions of your policy wording and of
              insurance law, and this site does not paraphrase either from memory.
            </p>
            <p className="text-sm text-navy-600 leading-relaxed m-0">
              Your insurer is the authority on your policy. A broker can tell you which insurers
              write this kind of cover before you need it.{" "}
              <Link href="/find-agent" className="text-gold-600 font-semibold">
                How to check that a broker is who they say they are
              </Link>
              .
            </p>
          </div>

          <FAQSchema faqs={faqs} />
        </div>
      </section>

      <section className="section-padding bg-navy-50">
        <div className="container-max max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-navy-800 mb-3">Ask us after you have asked them</h2>
          <p className="text-sm text-navy-600 leading-relaxed mb-6">
            There is no exclusivity, nothing to pay before you sign, and no reason to hurry. Your
            lender first, your insurer second, then us. If either says no, you will have found out
            for the price of an email — and we would rather that than a lease your cover did not
            know about.
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
          <Disclaimer type="financial" />
        </div>
      </section>
    </>
  );
}
