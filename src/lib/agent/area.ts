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
  soldPrices?: { date: string; price: number; propertyType?: string }[];
  crimeLevel?: string;
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
      return date && price ? { date: date.slice(0, 10), price, propertyType: type } : null;
    })
    .filter((s): s is NonNullable<typeof s> => s !== null);

  // Nothing useful found at all — say so rather than returning an empty shell
  // that reads as "we checked and the area is fine".
  if (!region && soldPrices.length === 0) return null;

  return { region, soldPrices };
}
