import type { Metadata } from "next";
import Link from "next/link";
import ApiForm from "@/components/forms/ApiForm";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Disclaimer } from "@/components/legal/Disclaimer";
import { events } from "@/lib/analytics";

/**
 * How to find a property professional, and check them yourself.
 *
 * This page used to list eighteen named firms — Habito, JMW Solicitors, Allsop
 * LLP and others — under the heading "Vetted, regulated professionals", with
 * the line "We verify all professional listings with the relevant regulatory
 * body (FCA, SRA, RICS, ARLA, ACCA/ICAEW)".
 *
 * No such verification existed. The firms were a hardcoded array in this file.
 * There is no provider table, no verification record and no process anywhere
 * in the codebase. So the page asserted a relationship with eighteen real
 * companies that none of them had agreed to, and told a visitor choosing a
 * mortgage broker or a conveyancer that somebody had checked — which is the
 * sort of thing a person actually relies on.
 *
 * It also solicited paid listings by promising "thousands of active investors
 * and landlords", and the Apply button had no handler.
 *
 * What replaces it is the useful half: which regulator covers which
 * professional, what to check on their register, and what to ask. That is the
 * same thing the rest of this site does — show the source and let the reader
 * verify it — and it needs no relationship with anybody.
 */

const FIELD =
  "w-full px-4 py-3 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400";

const TITLE = "Find a Property Professional — And Check Them Yourself";
const DESCRIPTION =
  "Which regulator covers a mortgage broker, a conveyancer, a surveyor, a letting agent or a " +
  "property accountant — where their public register is, and what to check before you instruct " +
  "anybody.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: "find a property professional UK, check a mortgage broker FCA, check a solicitor SRA, RICS surveyor register, Propertymark member check",
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/find-agent/" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    url: "https://www.propertyvaultuk.co.uk/find-agent/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "Checking a UK property professional against their regulator" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

/**
 * Each professional, the body that regulates them, and the register a member
 * of the public can search.
 *
 * Links go to the organisation's own site rather than a deep link into a
 * search tool, because a register URL changes and a wrong one here would send
 * somebody somewhere they cannot check anything.
 */
const PROFESSIONALS = [
  {
    role: "Mortgage broker",
    does: "Finds and arranges the borrowing. A whole-of-market broker can reach lenders you cannot approach directly.",
    body: "Financial Conduct Authority",
    register: "the Financial Services Register",
    href: "https://register.fca.org.uk",
    check: "That the firm is authorised, and that mortgage broking is one of the permissions it actually holds. An adviser may be listed under their firm rather than by name.",
    ask: "Are you whole-of-market or panel? How are you paid — fee, commission, or both?",
  },
  {
    role: "Conveyancing solicitor",
    does: "Handles the legal transfer, the searches and the title. The one person whose job is to find what is wrong with the property on paper.",
    body: "Solicitors Regulation Authority, or the Council for Licensed Conveyancers",
    register: "Find a Solicitor, run by the Law Society",
    href: "https://solicitors.lawsociety.org.uk",
    check: "That the firm is currently regulated, and by whom. Licensed conveyancers are regulated by the CLC rather than the SRA — both are legitimate, and they are different registers.",
    ask: "Who will actually do the work, and how quickly do you return searches? Is the quote fixed?",
  },
  {
    role: "Chartered surveyor",
    does: "Inspects the building and tells you what it needs. The only person on this list who will have stood in it.",
    body: "Royal Institution of Chartered Surveyors",
    register: "Find a Surveyor",
    href: "https://www.rics.org",
    check: "RICS registration, and that they do the survey level you want. A mortgage valuation is not a survey and will not tell you what is wrong.",
    ask: "Level 2 or Level 3, and which do you recommend for a property of this age and condition?",
  },
  {
    role: "Letting agent",
    does: "Finds tenants and, if you want, manages the tenancy.",
    body: "Propertymark, and a government-approved redress scheme",
    register: "the Propertymark member search",
    href: "https://www.propertymark.co.uk",
    check: "Redress scheme membership, which is a legal requirement for letting agents in England, and client money protection if they will hold your rent.",
    ask: "What is the fee on a re-let, and what exactly does 'full management' cover?",
  },
  {
    role: "Property accountant",
    does: "Structures how you hold property and files the returns. Worth involving before you buy, not after.",
    body: "ICAEW, ACCA or CIOT",
    register: "each body's own member directory",
    href: "https://www.icaew.com",
    check: "Current membership of a recognised body. 'Accountant' is not a protected title in the UK, so anybody may use it.",
    ask: "How many landlord clients do you have, and do you handle both personal and company structures?",
  },
];

export default function FindAgentPage() {
  return (
    <>
      <section className="gradient-navy py-16 md:py-20">
        <div className="container-max px-4">
          <div className="max-w-3xl">
            <p className="text-gold-400 font-semibold text-xs uppercase tracking-widest mb-3">
              Getting the right people in
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Find a property professional, and check them yourself
            </h1>
            <p className="text-navy-200 text-lg">
              Every professional you will need is on a public register, and every one of those
              registers is free to search. Here is which body covers which role, and what is worth
              checking before you instruct anybody.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max max-w-3xl">
          <Breadcrumbs items={[{ label: "Find a professional" }]} />

          {/* Said plainly rather than buried. A visitor arriving from the old
              version of this page was told these were vetted; they were not. */}
          <div
            role="note"
            className="mt-6 mb-10 rounded-xl border border-navy-200 bg-navy-50 p-5"
          >
            <p className="text-sm text-navy-700 leading-relaxed m-0">
              <strong>We do not run a vetted directory.</strong> PropertyVault has no
              accreditation scheme, checks nobody&rsquo;s credentials, and takes no fee for a
              recommendation. Anyone telling you a firm is &ldquo;approved&rdquo; should be able to
              say by whom and against what standard — including us. The registers below are run by
              the regulators themselves, and they are the ones worth trusting.
            </p>
          </div>

          <div className="space-y-8">
            {PROFESSIONALS.map((p) => (
              <article key={p.role} className="border-t border-navy-100 pt-6">
                <h2 className="text-xl font-bold text-navy-800">{p.role}</h2>
                <p className="text-sm text-navy-600 mt-1 mb-4 leading-relaxed">{p.does}</p>

                <dl className="text-sm space-y-2">
                  <div className="flex flex-wrap gap-x-2">
                    <dt className="font-semibold text-navy-700 shrink-0">Regulated by</dt>
                    <dd className="text-navy-600 m-0">{p.body}</dd>
                  </div>
                  <div className="flex flex-wrap gap-x-2">
                    <dt className="font-semibold text-navy-700 shrink-0">Check them on</dt>
                    <dd className="text-navy-600 m-0">
                      <a
                        href={p.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gold-600 font-semibold"
                      >
                        {p.register}
                      </a>
                    </dd>
                  </div>
                  <div className="flex flex-wrap gap-x-2">
                    <dt className="font-semibold text-navy-700 shrink-0">What to look for</dt>
                    <dd className="text-navy-600 m-0">{p.check}</dd>
                  </div>
                  <div className="flex flex-wrap gap-x-2">
                    <dt className="font-semibold text-navy-700 shrink-0">Worth asking</dt>
                    <dd className="text-navy-600 m-0 italic">&ldquo;{p.ask}&rdquo;</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>

          <div className="mt-12 rounded-xl border border-navy-100 bg-white p-6">
            <h2 className="text-lg font-bold text-navy-800 mb-2">Before you instruct anybody</h2>
            <ul className="list-disc pl-5 space-y-2 text-sm text-navy-600">
              <li>Check the register yourself rather than a badge on a website. A logo is an image.</li>
              <li>Get the quote in writing, including what is excluded.</li>
              <li>Ask who will do the work. The person selling it is often not the person doing it.</li>
              <li>
                Ask how they are paid. A fee you pay is easier to reason about than a commission
                you do not see.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section-padding bg-navy-50">
        <div className="container-max max-w-2xl">
          <h2 className="text-xl font-bold text-navy-800 mb-2">Are you a property professional?</h2>
          <p className="text-sm text-navy-600 mb-2 leading-relaxed">
            There is nothing to be listed on yet. A vetted panel needs a verification standard and
            somebody to apply it, and until both exist a listing would mean no more than the last
            version of this page did.
          </p>
          <p className="text-sm text-navy-500 mb-6 leading-relaxed">
            If you would want to be part of one, leave your details and we will get in touch when
            there is something real to join. No fee, and no obligation when there is.
          </p>

          <div className="rounded-xl border border-navy-200 bg-white p-6">
            <ApiForm
              source="waitlist:professionals-panel"
              submitLabel="Register interest"
              successTitle="Noted, thank you."
              successBody="We will be in touch if a vetted panel goes ahead. Nothing else — we will not add you to a newsletter."
              sentEvent={events.waitlistJoined}
              sentParams={{ service: "professionals-panel" }}
              className="space-y-4"
            >
              <input type="hidden" name="subject" value="Professional panel — register interest" />
              <div>
                <label htmlFor="pro-name" className="block text-sm font-semibold text-navy-700 mb-1">
                  Your name
                </label>
                <input id="pro-name" name="name" type="text" required maxLength={100} autoComplete="name" className={FIELD} />
              </div>
              <div>
                <label htmlFor="pro-email" className="block text-sm font-semibold text-navy-700 mb-1">
                  Email
                </label>
                <input id="pro-email" name="email" type="email" required maxLength={200} autoComplete="email" className={FIELD} />
              </div>
              <div>
                <label htmlFor="pro-msg" className="block text-sm font-semibold text-navy-700 mb-1">
                  What do you do, and where?{" "}
                  <span className="font-normal text-navy-400">Optional</span>
                </label>
                <textarea id="pro-msg" name="message" rows={3} maxLength={5000} className={FIELD} />
              </div>
            </ApiForm>
          </div>

          <p className="text-sm text-navy-600 mt-8">
            Looking for a tradesperson rather than a professional?{" "}
            <Link href="/trades" className="text-gold-600 font-semibold">
              That is being built separately
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
