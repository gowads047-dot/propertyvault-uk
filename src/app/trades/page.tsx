import type { Metadata } from "next";
import Link from "next/link";
import ApiForm from "@/components/forms/ApiForm";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Disclaimer } from "@/components/legal/Disclaimer";
import { events } from "@/lib/analytics";

/**
 * Finding a tradesperson, and checking them yourself.
 *
 * This page promised "vetted plumbers, electricians, builders and gas
 * engineers" in its title, its description, its Open Graph card and its hero,
 * and offered "quotes from verified local tradespeople". PropertyVault vets
 * nobody. It is the same claim /find-agent was making about eighteen named
 * firms, in a quieter voice.
 *
 * Three other things were wrong with it:
 *
 * It priced a service that does not exist — "Free to join", "Only pay when you
 * win work" — which is a commercial promise to tradespeople about a
 * marketplace with no code behind it.
 *
 * It offered them "access to a steady stream of landlord jobs". There is no
 * stream. There are four newsletter subscribers.
 *
 * And the waiting-list form had no handler at all: a bare <form> in a server
 * component with a submit button, so anyone who typed their email and clicked
 * got a page reload and nothing recorded. That is the one bug here that cost
 * something real, because sign-ups are the only evidence of whether this is
 * worth building.
 *
 * What survives is the half that needed no marketplace: gas and electrical
 * work have official registers, checking them is free, and knowing which
 * checks exist is most of the job.
 */

const FIELD =
  "w-full px-4 py-3 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400";

const TITLE = "Find a Tradesperson — And Check Them Yourself";
const DESCRIPTION =
  "How to find and check a plumber, electrician, builder or gas engineer for a rental property: " +
  "the official registers, what to ask for in writing, and where landlords look today.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords:
    "find a tradesperson for rental property, check a gas engineer, Gas Safe Register check, " +
    "NICEIC electrician check, landlord contractor checklist",
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/trades/" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    url: "https://www.propertyvaultuk.co.uk/trades/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "Checking a tradesperson against an official register" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

/**
 * Trades where an official register exists, and the one where none does.
 *
 * These describe what each register *is* and what it lists — deliberately not
 * what the law requires of you. Which work is notifiable, and to whom, differs
 * between England, Wales, Scotland and Northern Ireland, and this site does
 * not restate building regulations from memory. The registers themselves are
 * the authority and each one says so on its own pages.
 */
const CHECKS = [
  {
    work: "Anything involving gas",
    who: "Gas engineers, boiler and cooker fitters",
    register: "Gas Safe Register",
    href: "https://www.gassaferegister.co.uk/find-an-engineer/",
    what:
      "The official register of gas engineers in the UK. You can search by postcode, or check a " +
      "specific business or licence number.",
    onSite:
      "Ask for the Gas Safe ID card and look at the back. It lists the specific appliance types " +
      "that engineer is qualified for, and the expiry date. A card for cookers does not cover a boiler.",
  },
  {
    work: "Electrical work",
    who: "Electricians",
    register: "NICEIC, NAPIT and other competent person schemes",
    href: "https://www.electricalcompetentperson.co.uk",
    what:
      "A government-run search across the recognised electrical competent person schemes, so you " +
      "do not have to know which one an electrician belongs to before you look.",
    onSite:
      "Ask which scheme they are registered with and check that name on the search. Ask what " +
      "certificate you will be given when the work is finished, and get that in writing before " +
      "they start.",
  },
  {
    work: "Building, plumbing, roofing, decorating",
    who: "General trades",
    register: "No official register exists",
    href: null,
    what:
      "There is no statutory register for most trades, and no protected title. Trade association " +
      "membership and directory badges are voluntary — they can mean a real check or very little, " +
      "and the badge itself will not tell you which.",
    onSite:
      "Ask for public liability insurance and check the certificate is current. Ask for two " +
      "landlord references rather than homeowner ones — repeat work for a landlord is the harder " +
      "test. Get the quote itemised, in writing, with exclusions.",
  },
];

/**
 * Where people actually look. Official registers first, because they are the
 * only ones whose standard is published.
 *
 * The commercial directories are described by what they do, not by how good
 * their checks are. The previous version of this page asserted "Vetted
 * tradespeople with verified reviews" on somebody else's behalf, which is a
 * claim about their process that PropertyVault has not examined either.
 */
const DIRECTORIES = [
  {
    name: "Gas Safe Register",
    href: "https://www.gassaferegister.co.uk/find-an-engineer/",
    note: "Official. Search registered gas engineers by postcode.",
    official: true,
  },
  {
    name: "Electrical Competent Person",
    href: "https://www.electricalcompetentperson.co.uk",
    note: "Official. Searches every recognised electrical scheme at once.",
    official: true,
  },
  {
    name: "Checkatrade",
    href: "https://www.checkatrade.com/",
    note: "Commercial directory. Runs its own checks on member firms and publishes customer reviews.",
    official: false,
  },
  {
    name: "MyBuilder",
    href: "https://www.mybuilder.com/",
    note: "Commercial directory. Post a job and interested trades reply with quotes.",
    official: false,
  },
  {
    name: "Rated People",
    href: "https://www.ratedpeople.com/",
    note: "Commercial directory. Matches a posted job to local trades who then quote.",
    official: false,
  },
  {
    name: "TrustMark",
    href: "https://www.trustmark.org.uk/",
    note: "Government-endorsed quality scheme covering work in and around the home.",
    official: false,
  },
];

export default function TradesPage() {
  return (
    <>
      <section className="gradient-navy py-16 md:py-20">
        <div className="container-max px-4">
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-1.5 bg-gold-400/10 border border-gold-400/30 rounded-full text-gold-400 text-sm font-medium mb-6">
              Marketplace coming later
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Find a tradesperson, and check them yourself
            </h1>
            <p className="text-navy-200 text-lg">
              There is no PropertyVault trades marketplace yet. Until there is, the useful part
              costs nothing: gas and electrical work have official registers anyone can search, and
              knowing which checks exist is most of the job.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max max-w-3xl">
          <Breadcrumbs items={[{ label: "Find a trade" }]} />

          {/* Stated plainly. The previous version of this page said "vetted"
              four times, and a visitor who read it would have expected us to
              have checked somebody. */}
          <div role="note" className="mt-6 mb-10 rounded-xl border border-navy-200 bg-navy-50 p-5">
            <p className="text-sm text-navy-700 leading-relaxed m-0">
              <strong>We have not vetted anybody.</strong> PropertyVault runs no trades directory,
              checks no credentials and takes no commission on work. Nothing on this page is a
              recommendation of a particular firm — the registers below are run by other people, and
              two of them are official.
            </p>
          </div>

          <h2 className="text-xl font-bold text-navy-800 mb-2">What to check, by trade</h2>
          <p className="text-sm text-navy-600 mb-6 leading-relaxed">
            Two trades have a register you can search before anybody comes to the property. The rest
            do not, which changes what you ask for rather than whether you ask.
          </p>

          <div className="space-y-8">
            {CHECKS.map((c) => (
              <article key={c.work} className="border-t border-navy-100 pt-6">
                <h3 className="text-lg font-bold text-navy-800">{c.work}</h3>
                <p className="text-sm text-navy-500 mt-1 mb-4">{c.who}</p>

                <dl className="text-sm space-y-2">
                  <div className="flex flex-wrap gap-x-2">
                    <dt className="font-semibold text-navy-700 shrink-0">Register</dt>
                    <dd className="text-navy-600 m-0">
                      {c.href ? (
                        <a
                          href={c.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gold-600 font-semibold"
                        >
                          {c.register}
                        </a>
                      ) : (
                        <span className="text-navy-500 italic">{c.register}</span>
                      )}
                    </dd>
                  </div>
                  <div className="flex flex-wrap gap-x-2">
                    <dt className="font-semibold text-navy-700 shrink-0">What it is</dt>
                    <dd className="text-navy-600 m-0">{c.what}</dd>
                  </div>
                  <div className="flex flex-wrap gap-x-2">
                    <dt className="font-semibold text-navy-700 shrink-0">Before they start</dt>
                    <dd className="text-navy-600 m-0">{c.onSite}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>

          <div className="mt-12 rounded-xl border border-navy-100 bg-white p-6">
            <h2 className="text-lg font-bold text-navy-800 mb-2">Whatever the trade</h2>
            <ul className="list-disc pl-5 space-y-2 text-sm text-navy-600">
              <li>
                Check the register yourself rather than a logo on a van or a website. A badge is an
                image file.
              </li>
              <li>Get it in writing, itemised, with what is excluded and what happens if the job grows.</li>
              <li>
                Ask who is actually turning up. Quoting and doing are often two different people,
                and only one of them was on the register you checked.
              </li>
              <li>
                Keep the certificate. For a rental it is the evidence that the work was done and by
                whom, long after you have forgotten the name.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section-padding bg-navy-50">
        <div className="container-max max-w-3xl">
          <h2 className="text-xl font-bold text-navy-800 mb-2">Where landlords look today</h2>
          <p className="text-sm text-navy-600 mb-6 leading-relaxed">
            Official registers publish their standard, so you can see what membership means. The
            commercial directories each run some form of check and none of them publish it in the
            same way — worth reading before you rely on a badge.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {DIRECTORIES.map((d) => (
              <a
                key={d.name}
                href={d.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white rounded-xl border border-navy-100 p-5 hover:shadow-md transition-all"
              >
                <div className="flex items-baseline gap-2 mb-1">
                  <h3 className="font-bold text-navy-800">{d.name}</h3>
                  {d.official ? (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gold-600 bg-gold-400/10 rounded px-1.5 py-0.5">
                      Official
                    </span>
                  ) : null}
                </div>
                <p className="text-xs text-navy-500 m-0 leading-relaxed">{d.note}</p>
              </a>
            ))}
          </div>

          <p className="text-xs text-navy-400 mt-6">
            PropertyVault is not affiliated with any of these and receives nothing if you use them.
            Links open on external websites.
          </p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max max-w-2xl">
          <h2 className="text-xl font-bold text-navy-800 mb-2">If we built a trades marketplace</h2>
          <p className="text-sm text-navy-600 mb-2 leading-relaxed">
            The idea is a place to post a job, get quotes from local trades, and keep the
            certificates against the property afterwards so the paperwork survives the job. None of
            it is built, and there is no date.
          </p>
          <p className="text-sm text-navy-500 mb-6 leading-relaxed">
            Whether it gets built depends on how many people want it, so this list is the decision
            rather than a mailing list. Tell us which trade you are chasing most often and we will
            use that. Landlords and tradespeople both welcome.
          </p>

          <div className="rounded-xl border border-navy-200 bg-white p-6">
            <ApiForm
              source="waitlist:trades-marketplace"
              submitLabel="Join the list"
              successTitle="Noted, thank you."
              successBody="We will only be in touch about the trades marketplace. Nothing else — we will not add you to a newsletter."
              sentEvent={events.waitlistJoined}
              sentParams={{ service: "trades-marketplace" }}
              className="space-y-4"
            >
              <input type="hidden" name="subject" value="Trades marketplace — join the list" />
              <div>
                <label htmlFor="trade-name" className="block text-sm font-semibold text-navy-700 mb-1">
                  Your name
                </label>
                <input id="trade-name" name="name" type="text" required maxLength={100} autoComplete="name" className={FIELD} />
              </div>
              <div>
                <label htmlFor="trade-email" className="block text-sm font-semibold text-navy-700 mb-1">
                  Email
                </label>
                <input id="trade-email" name="email" type="email" required maxLength={200} autoComplete="email" className={FIELD} />
              </div>
              <div>
                <label htmlFor="trade-msg" className="block text-sm font-semibold text-navy-700 mb-1">
                  Which trade, and where?{" "}
                  <span className="font-normal text-navy-400">Optional</span>
                </label>
                <textarea id="trade-msg" name="message" rows={3} maxLength={5000} className={FIELD} />
              </div>
            </ApiForm>
          </div>

          <p className="text-sm text-navy-600 mt-8">
            Looking for a broker, conveyancer, surveyor or letting agent rather than a trade?{" "}
            <Link href="/find-agent" className="text-gold-600 font-semibold">
              Those have registers too
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
