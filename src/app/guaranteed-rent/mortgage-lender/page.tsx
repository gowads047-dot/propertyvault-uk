import Link from "next/link";
import type { Metadata } from "next";
import { ogImages } from "@/lib/site";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { Disclaimer } from "@/components/legal/Disclaimer";

/**
 * Will my mortgage lender allow guaranteed rent?
 *
 * The question that kills the deal, and nobody answers it.
 *
 * Searching it returns one page that is actually about it. Google fills the
 * rest of the results with "consent to let" guides, which are a different
 * subject — the sign of a query with more demand than supply. Not one of the
 * nine guaranteed-rent companies competing for "guaranteed rent Birmingham"
 * addresses it anywhere, which is unsurprising: every one of them has a
 * commercial reason to leave it vague until after you have signed.
 *
 * We do not, because the honest answer costs us a lease we could not have
 * completed anyway. A landlord who signs a five-year lease in breach of their
 * mortgage terms is a problem for them and for us.
 *
 * ── What this page does not do ─────────────────────────────────────────────
 *
 * It does not say what your lender will decide. It cannot: acceptance varies
 * by lender and by product, and the only authority on your mortgage is the
 * lender who wrote it. Everything here is framed as what to ask and why it is
 * asked, never as what the answer will be.
 *
 * It also does not restate lending law or repossession procedure. Those differ
 * between England and Wales, Scotland and Northern Ireland, and this site does
 * not write law from memory — the page says so and sends the reader to someone
 * who can advise.
 *
 * NEEDS REVIEW BY A BROKER OR SOLICITOR before this is treated as settled.
 * The general shape — that acceptance varies, that lenders care about rent
 * reaching a third party, that corporate lets are looked at harder than
 * council or housing-association ones — is drawn from a published broker guide
 * and is the reasoning this page gives. Nothing here is a statement about any
 * named lender's policy.
 */

const TITLE = "Will My Mortgage Lender Allow Guaranteed Rent? | PropertyVault UK";
const DESCRIPTION =
  "Some buy-to-let lenders permit guaranteed rent and company lets; others do not. What lenders object to, what to ask yours in writing, and why to ask first.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords:
    "will my mortgage lender allow guaranteed rent, buy to let mortgage company let, " +
    "guaranteed rent mortgage consent, rent to rent mortgage lender permission, " +
    "subletting buy to let mortgage",
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/guaranteed-rent/mortgage-lender/" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "article",
    url: "https://www.propertyvaultuk.co.uk/guaranteed-rent/mortgage-lender/",
    siteName: "PropertyVault UK",
    images: ogImages("Will my mortgage lender allow guaranteed rent?"),
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

/**
 * The questions to put to a lender, and why each one is asked.
 *
 * Phrased as questions rather than answers on purpose. A landlord who walks
 * into that call knowing what "company let" means gets a straight answer; one
 * who asks "can I do guaranteed rent" often gets a no from somebody who has
 * not understood the arrangement.
 */
const ASK = [
  {
    q: "Does my mortgage permit a company let?",
    why:
      "This is usually the deciding question, and it is the right words to use. A guaranteed rent " +
      "arrangement is a lease to a company, which then finds the occupant. Some buy-to-let products " +
      "allow that and some restrict letting to an individual tenant on a standard tenancy.",
  },
  {
    q: "Does it permit sub-letting?",
    why:
      "The company holding the lease places the occupier. Whether that counts as sub-letting under " +
      "your terms is a question about your contract, and the answer is in it rather than in anything " +
      "we can tell you.",
  },
  {
    q: "Is there a maximum term you will accept?",
    why:
      "Our leases run three to five years. A lender may have a view on granting a term of that " +
      "length, particularly against the remaining term of the mortgage.",
  },
  {
    q: "Do you need to see the lease before I sign it?",
    why:
      "Some lenders want to read the agreement. Asking first is considerably cheaper than asking " +
      "afterwards.",
  },
  {
    q: "Will you confirm that in writing?",
    why:
      "A yes on a phone call is not evidence. Ask for it by email or letter, and keep it with the " +
      "mortgage paperwork. This is the single most useful thing on this page.",
  },
];

const faqs = [
  {
    q: "Will my mortgage lender allow a guaranteed rent scheme?",
    a:
      "Some will and some will not — it varies by lender and by product, and no one but your lender " +
      "can answer it for your mortgage. What is consistent is the reason they care: under a " +
      "guaranteed rent arrangement the occupier pays a company rather than paying you, so the money " +
      "covering your mortgage reaches you at one remove. Ask your lender whether your product " +
      "permits a company let and sub-letting, and get the answer in writing before you sign anything.",
  },
  {
    q: "Why do lenders care who the rent is paid to?",
    a:
      "Because it complicates what happens if the mortgage falls into arrears. If the occupier is " +
      "paying a third party in good faith while the loan is not being paid, the lender's position on " +
      "recovering the debt and on possession is harder to work out than it would be with a tenant " +
      "paying the landlord directly.",
  },
  {
    q: "Does it matter that PropertyVault is a private company rather than a council?",
    a:
      "It can. Published broker guidance is that lenders tend to be more comfortable with councils " +
      "and housing associations than with private companies, because the standards and the conduct " +
      "of a public body are known quantities. We are a private company. If your lender asks who " +
      "holds the lease, that is the honest answer, and it is better given before you sign than " +
      "discovered afterwards.",
  },
  {
    q: "I have a residential mortgage, not buy-to-let. Is it the same question?",
    a:
      "No, and it is usually a harder one. Letting a property on a residential mortgage normally " +
      "requires consent to let from the lender, which is a separate permission with its own " +
      "conditions, and consent to let is not the same as consent to a company let on a multi-year " +
      "lease. Raise both with your lender rather than assuming the first covers the second.",
  },
  {
    q: "What happens if I sign without asking?",
    a:
      "That depends entirely on your mortgage terms, which is why we will not guess at it here. " +
      "What we can say is that it is a question you want answered by your lender or your solicitor " +
      "before there is a five-year lease in place, not after. We would rather lose the lease than " +
      "have you sign one you were not free to sign.",
  },
  {
    q: "Will you wait while I check?",
    a:
      "Yes. There is no exclusivity and nothing to pay before you sign, so there is nothing to lose " +
      "by asking your lender first. If the answer is no, that is a straight answer and you have not " +
      "spent anything finding it out.",
  },
];

export default function MortgageLenderPage() {
  return (
    <>
      <section className="gradient-navy py-16 md:py-20">
        <div className="container-max px-4">
          <div className="max-w-3xl">
            <p className="text-gold-400 font-semibold text-xs uppercase tracking-widest mb-3">
              Before you sign anything
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Will my mortgage lender allow guaranteed rent?
            </h1>
            <p className="text-navy-200 text-lg">
              Some will, some will not, and only yours can tell you. It is the question most likely
              to stop a guaranteed rent arrangement after everything else has been agreed — so it is
              worth asking first, and we would rather you asked before you spoke to us than after.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max max-w-3xl">
          {/* The answer, before the explanation. Somebody who reads one
              paragraph should leave with the right action. */}
          <div role="note" className="rounded-xl border border-navy-200 bg-navy-50 p-5 mb-10">
            <p className="text-sm text-navy-700 leading-relaxed m-0">
              <strong>The short version.</strong> Ask your lender two things: does my product permit
              a <em>company let</em>, and does it permit <em>sub-letting</em>. Use those words. Get
              the answer in writing. We cannot answer it for you, and any company that tells you not
              to bother asking is not one to hand your property to for five years.
            </p>
          </div>

          <h2 className="text-xl font-bold text-navy-800 mb-3">What lenders actually object to</h2>
          <p className="text-sm text-navy-600 leading-relaxed mb-4">
            It is rarely the guarantee itself. The thing that gives a lender pause is where the money
            goes: under this kind of arrangement the person living in the property pays a company,
            and the company pays you. The rent covering your mortgage arrives at one remove.
          </p>
          <p className="text-sm text-navy-600 leading-relaxed mb-4">
            That matters to them if the mortgage ever falls behind. An occupier paying a third party
            in good faith, while the loan is not being paid, makes the lender&rsquo;s position on
            recovering the debt harder to work out than a tenant paying the landlord directly. Every
            question below comes back to that one concern.
          </p>
          <p className="text-sm text-navy-600 leading-relaxed mb-8">
            Published broker guidance also suggests lenders are more comfortable when the lease is
            held by a council or a housing association than by a private company, on the reasoning
            that a public body&rsquo;s standards and conduct are a known quantity.{" "}
            <strong className="text-navy-800">
              We are a private company, not a council or a housing association.
            </strong>{" "}
            If your lender asks who would hold the lease, that is the answer, and it is much better
            given up front than discovered later.
          </p>

          <h2 className="text-xl font-bold text-navy-800 mb-2">What to ask, in these words</h2>
          <p className="text-sm text-navy-600 leading-relaxed mb-6">
            Phrasing matters more than it should. A landlord who asks &ldquo;can I do guaranteed
            rent?&rdquo; often gets a no from somebody who has not understood the arrangement. These
            are the terms a lender recognises.
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
            <h2 className="text-lg font-bold text-navy-800 mb-2">
              If yours is a residential mortgage
            </h2>
            <p className="text-sm text-navy-600 leading-relaxed m-0">
              It is a different and usually harder question. Letting a property on a residential
              mortgage normally needs <em>consent to let</em> from the lender — a separate permission
              with its own conditions — and consent to let is not the same as consent to a company
              let on a multi-year lease. Raise both, rather than assuming the first covers the
              second.
            </p>
          </div>

          {/* The site does not restate law from memory, and this is a place
              where the differences are real rather than pedantic. */}
          <div className="mt-6 rounded-xl border border-navy-200 bg-white p-6">
            <h2 className="text-lg font-bold text-navy-800 mb-2">Where we stop</h2>
            <p className="text-sm text-navy-600 leading-relaxed mb-3">
              This page explains what lenders tend to ask about and why. It does not tell you what
              your mortgage permits, what happens if you sign without asking, or how possession works
              if things go wrong — those depend on your specific contract, and the procedure differs
              between England and Wales, Scotland, and Northern Ireland.
            </p>
            <p className="text-sm text-navy-600 leading-relaxed m-0">
              Your lender is the authority on your mortgage. A broker can tell you which lenders
              accept these arrangements before you apply for one, and a solicitor can tell you what
              you are agreeing to.{" "}
              <Link href="/find-agent" className="text-gold-600 font-semibold">
                How to check that either of them is who they say they are
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
            There is no exclusivity, nothing to pay before you sign, and no reason to hurry the order
            of these two conversations. If your lender says no, you will have found out for the price
            of an email — and we would rather that than a lease you were not free to grant.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/guaranteed-rent#enquiry" className="btn-gold">
              Get a rent estimate
            </Link>
            <Link
              href="/guaranteed-rent/vs-letting-agent"
              className="text-sm font-semibold text-navy-700 self-center px-4"
            >
              How it compares to a letting agent →
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
