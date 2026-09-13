import type { Metadata } from "next";
import Link from "next/link";
import { Disclaimer } from "@/components/legal/Disclaimer";
import { fetchBankRate, fetchUkhpi, monthLabel } from "@/lib/market-data";

/**
 * Regional house prices and the Bank Rate, from the bodies that publish
 * them, with the month each figure refers to and a link to the source.
 *
 * The page this replaces had a table of round numbers under "Data &
 * Analysis" — no date, no source, a base rate of 4.50% when the Bank's own
 * series said 3.75% — and a footnote calling it illustrative. It was also
 * linked from every page's footer. Now every number on the page is fetched
 * from HM Land Registry's UK House Price Index or the Bank of England,
 * refreshed daily, and if either source cannot be reached the page says
 * the figure is unavailable rather than showing an old one.
 *
 * What is not here, and why: rents and yields. The ONS publishes a rental
 * price index but its timeseries API was retired, and the site will not
 * carry a rent figure it cannot refresh. Yields by postcode, with their
 * workings, are on the top-20 page linked below.
 */

const TITLE = "UK House Prices by Region and the Bank Rate — Live | PropertyVault";
const DESCRIPTION =
  "Average house price and annual change for every UK region from the Land Registry index, and the current Bank Rate from the Bank of England. Dated, sourced, refreshed daily.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/market-insights/" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "article",
    url: "https://www.propertyvaultuk.co.uk/market-insights/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "UK house prices by region" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const gbp = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 });
const pct = (n: number) => `${n > 0 ? "+" : ""}${n.toFixed(1)}%`;
const changeColour = (n: number) => (n > 0 ? "text-green-700" : n < 0 ? "text-red-700" : "text-navy-600");

export default async function MarketInsightsPage() {
  const [hpi, bank] = await Promise.all([fetchUkhpi(), fetchBankRate()]);

  return (
    <>
      <section className="gradient-navy py-16 md:py-20">
        <div className="container-max px-4">
          <p className="text-gold-400 font-semibold text-sm uppercase tracking-wider mb-3">Published data, with dates</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">UK house prices by region, and the Bank Rate</h1>
          <p className="text-navy-200 max-w-2xl">
            Every figure here comes from HM Land Registry or the Bank of England, says which month it refers to, and
            links to where it was published. Nothing is estimated and nothing is typed in by hand.
          </p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max max-w-4xl">
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-white rounded-xl border border-navy-100 p-6">
              <h2 className="font-bold text-navy-800 mb-1">Bank Rate</h2>
              {bank ? (
                <>
                  <p className="text-3xl font-bold text-navy-800 mb-1">{bank.rate.toFixed(2)}%</p>
                  <p className="text-xs text-navy-500">
                    Bank of England, series IUMABEDR, last observation {bank.asOf}.{" "}
                    <a
                      href="https://www.bankofengland.co.uk/monetary-policy/the-interest-rate-bank-rate"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gold-600 font-semibold"
                    >
                      Source
                    </a>
                  </p>
                </>
              ) : (
                <p className="text-sm text-navy-500">
                  Unavailable — the Bank of England&rsquo;s database did not respond. It is not replaced with an old
                  figure.
                </p>
              )}
              <p className="text-sm text-navy-500 mt-3">
                What mortgage lenders price from. It does not set your rate, but every fixed and tracker product moves
                with expectations of it.{" "}
                <Link href="/calculators/mortgage" className="text-gold-600 font-semibold">
                  Mortgage calculator
                </Link>
              </p>
            </div>

            <div className="bg-white rounded-xl border border-navy-100 p-6">
              <h2 className="font-bold text-navy-800 mb-1">UK average house price</h2>
              {hpi ? (
                <>
                  <p className="text-3xl font-bold text-navy-800 mb-1">
                    {gbp.format(hpi.uk.averagePrice)}{" "}
                    <span className={`text-base font-semibold ${changeColour(hpi.uk.annualChange)}`}>
                      {pct(hpi.uk.annualChange)} on a year earlier
                    </span>
                  </p>
                  <p className="text-xs text-navy-500">
                    HM Land Registry UK House Price Index, {monthLabel(hpi.month)}.{" "}
                    <a
                      href="https://landregistry.data.gov.uk/app/ukhpi"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gold-600 font-semibold"
                    >
                      Source
                    </a>
                  </p>
                </>
              ) : (
                <p className="text-sm text-navy-500">
                  Unavailable — HM Land Registry&rsquo;s index did not respond. It is not replaced with an old figure.
                </p>
              )}
              <p className="text-sm text-navy-500 mt-3">
                The index is published about six weeks after the month it covers and revised for a few months after
                that, so the latest month here is the latest complete one, not this month.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-navy-800 mb-2">Average price by region</h2>
          {hpi ? (
            <>
              <p className="text-sm text-navy-500 mb-4">
                HM Land Registry UK House Price Index, {monthLabel(hpi.month)}. Annual change is against the same
                month a year earlier; monthly is against the month before.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-navy-50">
                      <th className="text-left p-3 font-semibold text-navy-800">Region</th>
                      <th className="text-right p-3 font-semibold text-navy-800">Average price</th>
                      <th className="text-right p-3 font-semibold text-navy-800">Annual change</th>
                      <th className="text-right p-3 font-semibold text-navy-800">Monthly change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hpi.regions.map((r) => (
                      <tr key={r.slug} className="border-b border-navy-50">
                        <td className="p-3 font-medium text-navy-800">{r.name}</td>
                        <td className="p-3 text-right text-navy-600 tabular-nums">{gbp.format(r.averagePrice)}</td>
                        <td className={`p-3 text-right font-medium tabular-nums ${changeColour(r.annualChange)}`}>{pct(r.annualChange)}</td>
                        <td className={`p-3 text-right tabular-nums ${changeColour(r.monthlyChange)}`}>{pct(r.monthlyChange)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-navy-400 mt-3">
                Contains HM Land Registry data © Crown copyright and database right {hpi.month.slice(0, 4)}. This data
                is licensed under the Open Government Licence v3.0. Refreshed daily.
              </p>
            </>
          ) : (
            <p className="text-sm text-navy-500">
              The regional table is unavailable because HM Land Registry&rsquo;s index did not respond. Try again later;
              the page does not show stale figures in its place.
            </p>
          )}

          <div className="mt-10 rounded-xl border border-navy-100 bg-navy-50 p-6">
            <h2 className="text-lg font-bold text-navy-800 mb-2">Rents and yields are not on this page</h2>
            <p className="text-sm text-navy-600 leading-relaxed m-0">
              A regional rent index exists, but the interface this site would refresh it from was retired, and a rent
              figure that cannot be refreshed would end up as stale as the numbers this page used to show. For
              yields with the price and rent behind each one, see the{" "}
              <Link href="/resources/top-20-btl-postcodes" className="text-gold-600 font-semibold">
                top 20 buy-to-let postcodes
              </Link>
              , or run your own through the{" "}
              <Link href="/calculators/rental-yield" className="text-gold-600 font-semibold">
                rental yield calculator
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-navy-50">
        <div className="container-max max-w-4xl">
          <Disclaimer type="general" />
        </div>
      </section>
    </>
  );
}
