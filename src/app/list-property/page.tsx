import type { Metadata } from "next";
import Link from "next/link";
import ApiForm from "@/components/forms/ApiForm";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Disclaimer } from "@/components/legal/Disclaimer";
import { events } from "@/lib/analytics";

/**
 * Listing a property, honestly.
 *
 * This page used to be a twenty-four field listing form ending in a button
 * marked "Publish Listing". Nothing was published, and nothing could be: there
 * is no UK listings table. The form posted to /api/contact, the enquiry inbox.
 *
 * It was worse than that in two ways nobody would notice from the outside.
 *
 * Only seven of its twenty-four controls carried a `name`, and all seven were
 * contact details — contact_email, contact_phone, contact_whatsapp,
 * landlord_name, landlord_email, landlord_phone, landlord_whatsapp. FormData
 * collects named controls and nothing else, so not one property field was
 * ever submitted. Not the address, the rent, the bedrooms, the EPC, the
 * description, the features or the tenant preferences.
 *
 * And the four compliance upload boxes and the photo dropzone were <div>s.
 * There was no <input type="file"> anywhere on the page. They carried
 * cursor-pointer and a hover state, so they looked live, and clicking one did
 * nothing whatsoever.
 *
 * So a landlord spent ten minutes, attached certificates that never attached,
 * clicked Publish, and was told "we have your listing" — while what actually
 * arrived was four contact fields. The page also promised "thousands of active
 * tenants and investors" against four newsletter subscribers, and offered a
 * "verified badge" for uploading documents nobody verifies.
 *
 * ── Why the URL stays ──────────────────────────────────────────────────────
 *
 * "List your property" is real search intent and this route has whatever
 * ranking it has earned. Makan already publishes listings properly — ten
 * tables and a working /makan/list — but it is framed around the Gulf and
 * North Africa, so redirecting a Sheffield landlord there answers a different
 * question than the one they asked.
 *
 * What replaces the form is the part that works with no portal behind it:
 * where landlords actually advertise today, what each of those places is, and
 * a short form that records who wants PropertyVault to do it. That form is the
 * decision about whether to build one.
 *
 * Deliberately no compliance checklist here. What you must have before letting
 * differs across England, Wales, Scotland and Northern Ireland, /landlords
 * already carries that and marks which items are required rather than merely
 * sensible, and duplicating it would mean two copies drifting apart.
 */

const FIELD =
  "w-full px-4 py-3 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400";

const TITLE = "List Your Property — Where UK Landlords Advertise";
const DESCRIPTION =
  "Where to advertise a rental property in the UK, what each portal actually is, and what it " +
  "costs. PropertyVault does not run a listings portal yet — this is the honest map of the ones " +
  "that do.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords:
    "list your property UK, advertise rental property, how to list a property to let, " +
    "OpenRent Rightmove Zoopla landlord, advertise a room to rent",
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/list-property/" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    url: "https://www.propertyvaultuk.co.uk/list-property/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "Where UK landlords advertise a rental property" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

/**
 * Where a UK landlord can actually advertise today.
 *
 * Described by what each one is and how it charges, because that is the part
 * that decides between them and the part a landlord cannot see from the
 * homepage. No prices: they change, and a stale figure here would be the same
 * category of mistake this page is being rewritten for.
 */
const PLACES = [
  {
    name: "Rightmove and Zoopla",
    what:
      "The two portals most tenants search. Neither accepts listings directly from a private " +
      "landlord — you reach them through an agent or through an online service that is itself a " +
      "registered agent.",
    suits: "Almost any property, if you are willing to go through somebody to get there.",
    href: "https://www.rightmove.co.uk",
    hrefLabel: "rightmove.co.uk",
  },
  {
    name: "OpenRent",
    what:
      "An online letting agent that lists onto Rightmove and Zoopla for a fee, and handles " +
      "enquiries, referencing and the tenancy paperwork as paid extras.",
    suits: "A landlord who wants portal reach without a high-street agent's percentage.",
    href: "https://www.openrent.co.uk",
    hrefLabel: "openrent.co.uk",
  },
  {
    name: "SpareRoom",
    what: "The main UK site for rooms in shared houses, advertised room by room rather than by property.",
    suits: "HMOs and any let where you are filling one room at a time.",
    href: "https://www.spareroom.co.uk",
    hrefLabel: "spareroom.co.uk",
  },
  {
    name: "Gumtree and Facebook Marketplace",
    what:
      "Free general classifieds with local reach. No referencing, no verification of who is " +
      "replying, and a correspondingly higher share of time-wasters and scams.",
    suits: "A cheap second line of advertising, not usually a first one.",
    href: "https://www.gumtree.com/flats-and-houses-for-rent",
    hrefLabel: "gumtree.com",
  },
  {
    name: "A local high-street agent",
    what:
      "Lists on the portals, does the viewings and usually the management. Charges a percentage " +
      "of rent, or a fixed fee for tenant-find only.",
    suits: "A property you cannot get to, or a first let where the viewings are the hard part.",
    href: "/find-agent",
    hrefLabel: "How to check an agent",
    internal: true,
  },
  {
    name: "Your local council",
    what:
      "Many councils run a landlord scheme or a lettings service placing tenants in private " +
      "housing, sometimes with rent guarantees or deposit help attached. Terms vary by council.",
    suits: "A landlord willing to trade some rent for a longer, lower-void tenancy.",
    href: "https://www.gov.uk/find-local-council",
    hrefLabel: "Find your council",
  },
];

export default function ListPropertyPage() {
  return (
    <>
      <section className="gradient-navy py-16 md:py-20">
        <div className="container-max px-4">
          <div className="max-w-3xl">
            <p className="text-gold-400 font-semibold text-xs uppercase tracking-widest mb-3">
              For landlords
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              List your property
            </h1>
            <p className="text-navy-200 text-lg">
              PropertyVault does not run a listings portal, so there is nothing here to advertise
              on. What there is: where UK landlords actually list, what each of those places is,
              and how they charge.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max max-w-3xl">
          <Breadcrumbs items={[{ label: "List your property" }]} />

          {/* Anyone who used the old form believes they submitted a listing.
              They did not, and this is the first thing they should read. */}
          <div role="note" className="mt-6 mb-10 rounded-xl border border-navy-200 bg-navy-50 p-5">
            <p className="text-sm text-navy-700 leading-relaxed m-0">
              <strong>There used to be a listing form on this page.</strong> It did not publish
              anything — there is no PropertyVault listings portal, and there never was one behind
              that button. If you filled it in and wondered why nothing appeared, that is why, and
              we are sorry for the wasted time. Nothing you uploaded was stored.
            </p>
          </div>

          <h2 className="text-xl font-bold text-navy-800 mb-2">Where UK landlords advertise</h2>
          <p className="text-sm text-navy-600 mb-6 leading-relaxed">
            The choice is mostly between portal reach and what you pay for it. Rightmove and Zoopla
            are where tenants look, and neither takes a listing straight from a landlord — so
            everything below is either a route onto them or a deliberate alternative.
          </p>

          <div className="space-y-6">
            {PLACES.map((p) => (
              <article key={p.name} className="border-t border-navy-100 pt-5">
                <h3 className="text-lg font-bold text-navy-800 mb-2">{p.name}</h3>
                <p className="text-sm text-navy-600 leading-relaxed mb-2">{p.what}</p>
                <p className="text-sm text-navy-500 leading-relaxed mb-2">
                  <span className="font-semibold text-navy-700">Suits</span> {p.suits}
                </p>
                {p.internal ? (
                  <Link href={p.href} className="text-sm text-gold-600 font-semibold">
                    {p.hrefLabel} →
                  </Link>
                ) : (
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gold-600 font-semibold"
                  >
                    {p.hrefLabel} →
                  </a>
                )}
              </article>
            ))}
          </div>

          <p className="text-xs text-navy-400 mt-8">
            PropertyVault is not affiliated with any of these and receives nothing if you use them.
            Links open on external websites.
          </p>

          <div className="mt-10 rounded-xl border border-navy-100 bg-navy-50 p-6">
            <h2 className="text-lg font-bold text-navy-800 mb-2">Before you advertise</h2>
            <p className="text-sm text-navy-600 leading-relaxed mb-3">
              What a property needs before it can be let depends on where it is — England, Wales,
              Scotland and Northern Ireland each have their own rules, and some requirements depend
              on the property rather than applying to everything.
            </p>
            <Link href="/landlords" className="text-sm text-gold-600 font-semibold">
              The landlord checklist, with what is required and what is not →
            </Link>
          </div>
        </div>
      </section>

      <section className="section-padding bg-navy-50">
        <div className="container-max max-w-2xl">
          <h2 className="text-xl font-bold text-navy-800 mb-2">
            Would you list with PropertyVault?
          </h2>
          <p className="text-sm text-navy-600 mb-2 leading-relaxed">
            A portal is only worth building if tenants come to it, and that is a much harder problem
            than the software. So this is a genuine question rather than a waiting list with a
            launch date attached — there is no date, and there may never be one.
          </p>
          <p className="text-sm text-navy-500 mb-6 leading-relaxed">
            If you would use it, say so and say what you let. That is the evidence this decision
            gets made on.
          </p>

          <div className="rounded-xl border border-navy-200 bg-white p-6">
            <ApiForm
              source="waitlist:uk-listings"
              submitLabel="Register interest"
              successTitle="Noted, thank you."
              successBody="We will only be in touch about listings. Nothing else — we will not add you to a newsletter."
              sentEvent={events.waitlistJoined}
              sentParams={{ service: "uk-listings" }}
              className="space-y-4"
            >
              <input type="hidden" name="subject" value="UK listings — register interest" />
              <div>
                <label htmlFor="listing-name" className="block text-sm font-semibold text-navy-700 mb-1">
                  Your name
                </label>
                <input id="listing-name" name="name" type="text" required maxLength={100} autoComplete="name" className={FIELD} />
              </div>
              <div>
                <label htmlFor="listing-email" className="block text-sm font-semibold text-navy-700 mb-1">
                  Email
                </label>
                <input id="listing-email" name="email" type="email" required maxLength={200} autoComplete="email" className={FIELD} />
              </div>
              <div>
                <label htmlFor="listing-kind" className="block text-sm font-semibold text-navy-700 mb-1">
                  What would you list?
                </label>
                <select id="listing-kind" name="listing_kind" className={`${FIELD} bg-white`} defaultValue="">
                  <option value="" disabled>Choose one</option>
                  <option>A long-term let</option>
                  <option>Rooms in an HMO</option>
                  <option>A short-term or serviced let</option>
                  <option>An investment property for sale</option>
                  <option>More than one of these</option>
                </select>
              </div>
              <div>
                <label htmlFor="listing-msg" className="block text-sm font-semibold text-navy-700 mb-1">
                  Where, and how many?{" "}
                  <span className="font-normal text-navy-400">Optional</span>
                </label>
                <textarea id="listing-msg" name="message" rows={3} maxLength={5000} className={FIELD} />
              </div>
            </ApiForm>
          </div>

          <div className="mt-8 space-y-2">
            <p className="text-sm text-navy-600">
              Letting outside the UK?{" "}
              <Link href="/makan" className="text-gold-600 font-semibold">
                Makan lists property across the Gulf and North Africa
              </Link>
              , and that one is running.
            </p>
            <p className="text-sm text-navy-600">
              Already letting and want the paperwork in one place?{" "}
              <Link href="/rentura" className="text-gold-600 font-semibold">
                That is what Rentura does
              </Link>
              .
            </p>
          </div>
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
