import { fetchAreaPrice, monthLabel } from "@/lib/market-data";

/**
 * The "Average house price" figure in a city guide's stat strip, from HM
 * Land Registry's UK House Price Index for that local authority, with the
 * month it refers to.
 *
 * It replaces a typed-in round number. Twenty pages carried one; checked
 * against the index for June 2026, Bradford's was 13% low, Hull's 16% high,
 * Nottingham's 9% high. None said which month it was for, so none could be
 * called wrong — which is the problem. A figure with a date can be.
 *
 * Renders inline (spans), because both stat-strip layouts put the number
 * inside a <p>. When the index cannot be reached it says so; it does not
 * fall back to the number it replaced.
 */
export async function LiveAveragePrice({ area }: { area: string }) {
  const p = await fetchAreaPrice(area);
  if (!p) {
    return (
      <>
        <span>—</span>
        <span className="block text-[10px] font-normal text-navy-400 mt-1 leading-tight">Land Registry index unavailable</span>
      </>
    );
  }
  const rounded = `£${Math.round(p.averagePrice / 1000)}k`;
  return (
    <>
      <span title={`£${p.averagePrice.toLocaleString("en-GB")}`}>{rounded}</span>
      <span className="block text-[10px] font-normal text-navy-400 mt-1 leading-tight">
        Land Registry, {monthLabel(p.month)}
      </span>
    </>
  );
}
