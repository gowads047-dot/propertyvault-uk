import type { Evidence } from "../property";
import { verified, missing } from "../property";

/**
 * Planning constraints on a property, from planning.data.gov.uk.
 *
 * Official, free, and needs no key. It answers questions a listing never does
 * and a model cannot know: is this in a flood zone, a conservation area, is it
 * listed, and — the one that matters most to a landlord — is there an Article 4
 * direction removing the permitted development right to convert to an HMO.
 *
 * ── The distinction this module exists to preserve ─────────────────────────
 *
 * Coverage is not complete. Not every authority has published every dataset.
 * So "no record found" is NOT "this property is not in a conservation area" —
 * it is "the national register has nothing here". Reporting the first as the
 * second would be inventing a clean bill of health, which is precisely the
 * failure the whole trust system exists to prevent.
 *
 * Every absent result therefore comes back as a checked-but-not-found note,
 * never as a reassurance.
 */

const BASE = "https://www.planning.data.gov.uk/entity.json";
const TIMEOUT_MS = 5_000;

export interface ConstraintHit {
  name: string | null;
  reference: string | null;
  /** Dataset-specific extras worth showing, e.g. flood risk level. */
  detail?: Record<string, string>;
}

export interface ConstraintResult {
  dataset: string;
  label: string;
  /** What was found. Empty means the register returned nothing here. */
  hits: ConstraintHit[];
  /** True when the lookup itself failed, which is not the same as finding none. */
  unavailable: boolean;
  /** Why this matters, in one line, for a buyer or landlord. */
  matters: string;
}

/**
 * The datasets worth checking before buying. Chosen because each one changes
 * what you can do with the property or what it costs to hold.
 */
const DATASETS: { dataset: string; label: string; matters: string; detailKeys?: string[] }[] = [
  {
    dataset: "flood-risk-zone",
    label: "Flood risk zone",
    matters: "Affects insurance, lending and resale.",
    detailKeys: ["flood-risk-level", "flood-risk-type"],
  },
  {
    dataset: "article-4-direction-area",
    label: "Article 4 direction",
    matters: "Removes permitted development rights — commonly used to require planning permission for an HMO conversion.",
  },
  {
    dataset: "conservation-area",
    label: "Conservation area",
    matters: "Restricts alterations, windows and external work.",
  },
  {
    dataset: "listed-building",
    label: "Listed building",
    matters: "Consent needed for most changes, and specialist work costs more.",
  },
  {
    dataset: "tree-preservation-zone",
    label: "Tree preservation",
    matters: "Trees cannot be felled or pruned without consent.",
  },
  {
    dataset: "green-belt",
    label: "Green belt",
    matters: "Extensions and new buildings are tightly restricted.",
  },
];

async function fetchJson(url: string): Promise<unknown | null> {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: ctl.signal, headers: { Accept: "application/json" } });
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export type PointFetcher = (dataset: string, lat: number, lon: number) => Promise<unknown | null>;

const defaultPointFetcher: PointFetcher = (dataset, lat, lon) =>
  fetchJson(`${BASE}?dataset=${encodeURIComponent(dataset)}&longitude=${lon}&latitude=${lat}&limit=5`);

/** Coordinates for a postcode, or null. */
export async function coordsFor(postcode: string): Promise<{ lat: number; lon: number } | null> {
  const clean = postcode.toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (!/^[A-Z]{1,2}\d{1,2}[A-Z]?\d[A-Z]{2}$/.test(clean)) return null;
  const j = await fetchJson(`https://api.postcodes.io/postcodes/${encodeURIComponent(clean)}`);
  const r = (j as { result?: { latitude?: number; longitude?: number } } | null)?.result;
  return r?.latitude != null && r?.longitude != null ? { lat: r.latitude, lon: r.longitude } : null;
}

export async function fetchConstraints(
  lat: number,
  lon: number,
  fetcher: PointFetcher = defaultPointFetcher,
): Promise<ConstraintResult[]> {
  return Promise.all(DATASETS.map(async d => {
    const j = await fetcher(d.dataset, lat, lon);
    if (j === null) {
      return { dataset: d.dataset, label: d.label, hits: [], unavailable: true, matters: d.matters };
    }

    const entities = (j as { entities?: Record<string, unknown>[] }).entities ?? [];
    const hits: ConstraintHit[] = entities.map(e => ({
      name: typeof e.name === "string" && e.name ? e.name : null,
      reference: typeof e.reference === "string" ? e.reference : null,
      detail: d.detailKeys
        ? Object.fromEntries(
            d.detailKeys
              .filter(k => typeof e[k] === "string" && e[k])
              .map(k => [k, e[k] as string]),
          )
        : undefined,
    }));

    return { dataset: d.dataset, label: d.label, hits, unavailable: false, matters: d.matters };
  }));
}

/**
 * Constraints as evidence.
 *
 * A hit is verified: the register says so. An empty result is deliberately NOT
 * verified — it becomes a missing row whose method records that the register
 * was checked and returned nothing, because national coverage is incomplete
 * and "we found no record" is a weaker statement than "there is none".
 */
export function constraintEvidence(results: ConstraintResult[]): Evidence[] {
  return results.map(r => {
    const field = r.dataset.replace(/-/g, "_");

    if (r.unavailable) {
      return missing(field, "planning.data.gov.uk did not respond — this was not checked");
    }
    if (r.hits.length === 0) {
      return missing(
        field,
        "No record in the national planning register. Coverage is incomplete, so this is not confirmation that none applies.",
      );
    }

    const first = r.hits[0];
    const extra = first.detail && Object.keys(first.detail).length
      ? ` (${Object.values(first.detail).join(", ")})`
      : "";
    return verified(field, null, "planning.data.gov.uk", {
      valueText: `${first.name ?? first.reference ?? "Yes"}${extra}`,
      method: `${r.hits.length} record${r.hits.length === 1 ? "" : "s"} at this location`,
    });
  });
}

/** The ones a person needs told about, worst first. Empty is a good outcome. */
export function notableConstraints(results: ConstraintResult[]): ConstraintResult[] {
  const order = DATASETS.map(d => d.dataset);
  return results
    .filter(r => r.hits.length > 0)
    .sort((a, b) => order.indexOf(a.dataset) - order.indexOf(b.dataset));
}
