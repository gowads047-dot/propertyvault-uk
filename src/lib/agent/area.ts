/**
 * Real area data for the agent's lookup_area tool.
 *
 * Two official, free sources, both already used elsewhere in this app:
 * postcodes.io for the region, and HM Land Registry Price Paid for sold
 * transactions. Nothing here is estimated — if a source returns nothing, the
 * field comes back absent and the tool reports it as missing rather than
 * filling the gap.
 */

const TIMEOUT_MS = 4_000;

export interface AreaData {
  region?: string;
  /** Date is null when the source gave one this cannot parse — never a guess. */
  soldPrices?: { date: string | null; price: number; propertyType?: string }[];
  crimeLevel?: string;
}

const MONTHS = [
  "jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec",
];

/**
 * A sold date as ISO, from whatever shape the register returned.
 *
 * HM Land Registry's linked-data API returns "Fri, 13 Feb 2026", not an ISO
 * date. Slicing the first ten characters off that gives "Fri, 13 Fe", which is
 * what shipped — a mangled date next to a real price, which is exactly the
 * kind of thing that makes a reader doubt the numbers beside it.
 *
 * Parsed explicitly rather than through `new Date`, whose behaviour on
 * non-standard strings is implementation-defined, and which would silently
 * shift the day across a timezone. Anything unrecognised returns null so the
 * caller can show nothing rather than something wrong.
 */
export function normaliseSoldDate(raw: string): string | null {
  const iso = /^(\d{4})-(\d{2})-(\d{2})/.exec(raw);
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`;

  const rfc = /(\d{1,2})\s+([A-Za-z]{3})[a-z]*\s+(\d{4})/.exec(raw);
  if (!rfc) return null;
  const month = MONTHS.indexOf(rfc[2].toLowerCase());
  if (month < 0) return null;

  const day = Number(rfc[1]);
  if (day < 1 || day > 31) return null;
  return `${rfc[3]}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

async function fetchJson(url: string, ms = TIMEOUT_MS): Promise<unknown | null> {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), ms);
  try {
    const res = await fetch(url, { signal: ctl.signal, headers: { Accept: "application/json" } });
    return res.ok ? await res.json() : null;
  } catch {
    // A slow or absent source must degrade to "not checked", never to a guess.
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function normalise(pc: string): string | null {
  const c = pc.toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (!/^[A-Z]{1,2}\d{1,2}[A-Z]?\d[A-Z]{2}$/.test(c)) return null;
  return `${c.slice(0, -3)} ${c.slice(-3)}`;
}

export async function fetchArea(postcode: string): Promise<AreaData | null> {
  const pc = normalise(postcode);
  if (!pc) return null;

  const [pcData, lrData] = await Promise.all([
    fetchJson(`https://api.postcodes.io/postcodes/${encodeURIComponent(pc.replace(/\s/g, ""))}`),
    fetchJson(
      "https://landregistry.data.gov.uk/data/ppi/transaction-record.json" +
      `?propertyAddress.postcode=${encodeURIComponent(pc)}&_pageSize=20&_sort=-transactionDate`,
    ),
  ]);

  const region = (pcData as { result?: { region?: string } } | null)?.result?.region;

  type LRItem = {
    transactionDate?: string | { _value?: string };
    pricePaid?: number | { _value?: number };
    propertyType?: { prefLabel?: { _value?: string }[] } | string;
  };
  const items = (lrData as { result?: { items?: LRItem[] } } | null)?.result?.items ?? [];

  const soldPrices = items
    .map(i => {
      const date = typeof i.transactionDate === "string" ? i.transactionDate : i.transactionDate?._value;
      const price = typeof i.pricePaid === "number" ? i.pricePaid : i.pricePaid?._value;
      const type = typeof i.propertyType === "string"
        ? i.propertyType
        : i.propertyType?.prefLabel?.[0]?._value;
      // A sale with an unreadable date is still a real sale, and dropping it
      // would quietly bias the median. The date goes null; the price stays.
      return price ? { date: date ? normaliseSoldDate(date) : null, price, propertyType: type } : null;
    })
    .filter((s): s is NonNullable<typeof s> => s !== null);

  // Nothing useful found at all — say so rather than returning an empty shell
  // that reads as "we checked and the area is fine".
  if (!region && soldPrices.length === 0) return null;

  return { region, soldPrices };
}
