/**
 * Live market figures from the two public sources that publish them.
 *
 * /market-insights used to carry a table of round numbers with no date and
 * no source, under a heading that said "Data & Analysis", and a base rate
 * of 4.50% next to a footnote calling it all illustrative. The Bank's own
 * series said 3.75%. A page that publishes a number is claiming it is
 * true; if it cannot say where the number came from and when, it should
 * not publish it.
 *
 * Two sources, both open data:
 *
 * - HM Land Registry's UK House Price Index, which has a JSON endpoint per
 *   region per month. Average price and annual change, by region, with the
 *   month it refers to. Published with roughly a two-month lag, so the
 *   fetch walks back from the current month until it finds a month with a
 *   value.
 * - The Bank of England's statistical database, which serves the Bank Rate
 *   series (IUMABEDR) as CSV. Last row wins.
 *
 * Both return null on any failure, and the page says the figure is
 * unavailable. It never falls back to a hard-coded number, because a
 * stale number presented as current is the thing this replaces.
 *
 * ONS inflation (CPI) is not here. The ONS timeseries API this site would
 * have used was retired in November 2024, and there is no point publishing
 * a figure that cannot be refreshed.
 *
 * The parsers are pure and exported so they can be tested against a saved
 * response without a network.
 */

export const UKHPI_REGIONS = [
  { slug: "north-east", name: "North East" },
  { slug: "north-west", name: "North West" },
  { slug: "yorkshire-and-the-humber", name: "Yorkshire and the Humber" },
  { slug: "east-midlands", name: "East Midlands" },
  { slug: "west-midlands", name: "West Midlands" },
  { slug: "east-of-england", name: "East of England" },
  { slug: "london", name: "London" },
  { slug: "south-east", name: "South East" },
  { slug: "south-west", name: "South West" },
  { slug: "wales", name: "Wales" },
  { slug: "scotland", name: "Scotland" },
  { slug: "northern-ireland", name: "Northern Ireland" },
] as const;

export type RegionPrice = {
  slug: string;
  name: string;
  averagePrice: number;
  /** Percentage change over twelve months, as published (e.g. 2.4). */
  annualChange: number;
  /** Percentage change on the previous month. */
  monthlyChange: number;
};

export type Ukhpi = {
  /** The month the figures refer to, YYYY-MM. */
  month: string;
  uk: RegionPrice;
  regions: RegionPrice[];
};

export type BankRate = {
  /** Percent, e.g. 3.75. */
  rate: number;
  /** The month-end date of the last observation, as published: "31 Aug 2026". */
  asOf: string;
};

/** Cached for a day. Both series change monthly at most. */
const DAILY = { next: { revalidate: 86400 } } as const;

export const UKHPI_URL = (slug: string, month: string) =>
  `https://landregistry.data.gov.uk/data/ukhpi/region/${slug}/month/${month}.json`;

/**
 * The Bank's database returns a 500 for a long date range (from 2020 did),
 * and 200 for a year. The window starts on the first of the month thirteen
 * months ago, so the URL — and with it the cache key — changes once a
 * month rather than daily, and always spans at least one observation.
 */
export function bankRateUrl(now = new Date()): string {
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 13, 1));
  const mon = d.toLocaleDateString("en-GB", { month: "short", timeZone: "UTC" });
  const from = `01/${mon}/${d.getUTCFullYear()}`;
  return (
    "https://www.bankofengland.co.uk/boeapps/database/_iadb-fromshowcolumns.asp" +
    `?csv.x=yes&Datefrom=${from}&Dateto=now&SeriesCodes=IUMABEDR&CSVF=TN&UsingCodes=Y&Filter=N&title=IUMABEDR&VPD=Y`
  );
}

/** Parse one UKHPI region/month response. Null when the month has no data yet. */
export function parseUkhpi(json: unknown, slug: string, name: string): RegionPrice | null {
  const topic = (json as { result?: { primaryTopic?: Record<string, unknown> } })?.result?.primaryTopic;
  if (!topic) return null;
  const price = topic.averagePrice;
  const annual = topic.percentageAnnualChange;
  const monthly = topic.percentageChange;
  if (typeof price !== "number" || typeof annual !== "number" || typeof monthly !== "number") return null;
  return { slug, name, averagePrice: price, annualChange: annual, monthlyChange: monthly };
}

/** Parse the Bank's CSV: a header row, then "DD Mon YYYY,rate" rows. Last row wins. */
export function parseBankRate(csv: string): BankRate | null {
  const rows = csv
    .trim()
    .split(/\r?\n/)
    .map((l) => l.split(","))
    .filter((c) => c.length >= 2 && /^\d{1,2} [A-Z][a-z]{2} \d{4}$/.test(c[0].trim()));
  const last = rows[rows.length - 1];
  if (!last) return null;
  const rate = Number(last[1]);
  if (!Number.isFinite(rate)) return null;
  return { rate, asOf: last[0].trim() };
}

/** YYYY-MM for `n` months before now (n = 0 is the current month). */
export function monthsAgo(n: number, now = new Date()): string {
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - n, 1));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

/** "2026-06" → "June 2026". */
export function monthLabel(month: string): string {
  const [y, m] = month.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });
}

async function fetchRegion(slug: string, name: string, month: string): Promise<RegionPrice | null> {
  // Two attempts. Thirteen requests in parallel to one host, and one of
  // them failed once in testing; without a retry that region would be
  // missing from the table until the next revalidation, a day later.
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const r = await fetch(UKHPI_URL(slug, month), DAILY);
      if (r.ok) return parseUkhpi(await r.json(), slug, name);
      if (r.status === 404) return null;
    } catch {
      // fall through to the retry
    }
  }
  return null;
}

/**
 * The latest month with a UK-wide figure, then every region for that month.
 * Walks back up to six months; the index is normally two behind.
 */
export async function fetchUkhpi(now = new Date()): Promise<Ukhpi | null> {
  for (let back = 0; back <= 6; back++) {
    const month = monthsAgo(back, now);
    const uk = await fetchRegion("united-kingdom", "United Kingdom", month);
    if (!uk) continue;
    const regions = (await Promise.all(UKHPI_REGIONS.map((r) => fetchRegion(r.slug, r.name, month)))).filter(
      (r): r is RegionPrice => r !== null,
    );
    return { month, uk, regions };
  }
  return null;
}

export async function fetchBankRate(): Promise<BankRate | null> {
  try {
    const r = await fetch(bankRateUrl(), DAILY);
    if (!r.ok) return null;
    return parseBankRate(await r.text());
  } catch {
    return null;
  }
}
