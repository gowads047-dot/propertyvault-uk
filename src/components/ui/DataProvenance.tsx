/**
 * Where the reader can check a figure for themselves.
 *
 * The area guides already say their numbers are approximate, which is honest
 * but not actionable — "verify with current market data" does not tell anyone
 * where to look. These are the official UK sources, so a reader can get
 * today's number rather than trusting a range that was typed at some
 * unknown point in the past.
 *
 * Deliberately no "last reviewed" date. One would have to be invented: every
 * file in this repo was touched by the canonical-URL rewrite, so git's
 * modification date reflects that edit, not a review of the figures. Pointing
 * at live official data is more useful than a date nobody can stand behind.
 */

const SOURCES = [
  {
    label: "HM Land Registry — UK House Price Index",
    href: "https://landregistry.data.gov.uk/app/ukhpi",
    what: "Official sold prices and price change by local authority",
  },
  {
    label: "ONS — Private rent and house prices, UK",
    href: "https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/privaterentandhousepricesuk/latest",
    what: "Average rents and house prices, updated monthly",
  },
  {
    label: "GOV.UK — Search property information",
    href: "https://www.gov.uk/search-property-information-land-registry",
    what: "Title, boundaries and price paid for a specific property",
  },
];

export function DataProvenance({
  /** What the figures on this page describe, e.g. "Birmingham". */
  area,
}: {
  area?: string;
}) {
  return (
    <aside className="bg-navy-50 border border-navy-200 rounded-xl p-5 mt-8">
      <p className="text-xs font-bold text-navy-700 uppercase tracking-widest mb-2">
        Where these figures come from
      </p>
      <p className="text-xs text-navy-600 leading-relaxed mb-3">
        Yields, prices and rents shown{area ? ` for ${area}` : ""} are indicative ranges
        compiled from publicly available market data. They describe typical
        properties, not any specific one, and they are not a valuation. Property
        data moves, so check the current figure before you rely on it:
      </p>
      <ul className="space-y-2">
        {SOURCES.map(s => (
          <li key={s.href} className="text-xs leading-relaxed">
            <a
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold-600 underline font-semibold"
            >
              {s.label}
            </a>
            <span className="text-navy-500"> — {s.what}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
