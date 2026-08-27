/**
 * Room search: filter model and URL encoding.
 *
 * Two things this replaces.
 *
 * The old /makan/rooms did `.select("*")` and filtered the whole table in
 * JavaScript. That works at nine rows and falls over at a few hundred, and it
 * is the reason the page could never feel fast no matter what was built on top
 * of it — the browser waits for every room in the country before it can show
 * you the three in Selly Oak.
 *
 * It also read the flat `listings` table, which cannot represent a room inside
 * a house. This reads `makan_space` through a published public listing, which
 * is the only path RLS exposes to an anonymous visitor.
 *
 * Filters live in the URL rather than in component state, so a search is
 * shareable, survives a refresh, and can be linked to from an area page. That
 * matters more here than it looks: the long-tail SEO plan depends on
 * /makan/rooms?city=Birmingham being a real, linkable page.
 */

import type { PermittedUse } from "./makan-listing";

/** What kind of place. Null means show everything. */
export type KindFilter = "room" | "studio" | "whole_property" | null;

/**
 * Which side of the market you are on. This is the filter the whole product
 * turns on: "company" is the search an estate agent refuses to run.
 */
export type LetTypeFilter = "tenant" | "company" | null;

export interface Filters {
  /** Free text — matched against the address, city and postcode. */
  q: string;
  city: string | null;
  maxPcm: number | null;
  billsIncluded: boolean;
  ensuite: boolean;
  /** Exclude rooms that are only available on a future date. */
  availableNow: boolean;
  kind: KindFilter;
  letType: LetTypeFilter;
  /** Only meaningful alongside letType "company". */
  permittedUses: PermittedUse[];
  guaranteedRent: boolean;
}

export const EMPTY_FILTERS: Filters = {
  q: "",
  city: null,
  maxPcm: null,
  billsIncluded: false,
  ensuite: false,
  availableNow: false,
  kind: null,
  letType: null,
  permittedUses: [],
  guaranteedRent: false,
};

const KINDS: readonly string[] = ["room", "studio", "whole_property"];
const LET_TYPES: readonly string[] = ["tenant", "company"];
const USES: readonly string[] = ["serviced_accommodation", "supported_living", "hmo", "social_housing"];

/**
 * Company terms only narrow a search that is already looking at company lets.
 * Left set on a tenant search they would quietly exclude nearly everything,
 * and the person searching would have no filter on screen explaining why.
 */
export function clearCompanyFiltersIfUnused(f: Filters): Filters {
  if (f.letType === "company") return f;
  return { ...f, permittedUses: [], guaranteedRent: false };
}

/** Cities the room search offers as a shortcut. Free text covers the rest. */
export const SEARCH_CITIES = [
  "Birmingham",
  "Coventry",
  "Derby",
  "Leeds",
  "Leicester",
  "London",
  "Manchester",
  "Nottingham",
  "Sheffield",
] as const;

const MAX_Q = 80;

/**
 * Read filters out of the query string.
 *
 * Anything unparseable is dropped rather than rejected — a shared link with a
 * mangled parameter should still show rooms, not an error. The one thing that
 * is clamped rather than dropped is a negative budget, which would otherwise
 * silently match nothing.
 */
export function fromParams(params: URLSearchParams): Filters {
  const rawMax = params.get("max");
  const max = rawMax === null ? null : Number(rawMax);

  const city = params.get("city");

  return {
    q: (params.get("q") ?? "").slice(0, MAX_Q).trim(),
    city: city && city.trim() ? city.trim() : null,
    maxPcm: max !== null && Number.isFinite(max) && max > 0 ? Math.floor(max) : null,
    billsIncluded: params.get("bills") === "1",
    ensuite: params.get("ensuite") === "1",
    availableNow: params.get("now") === "1",
    kind: KINDS.includes(params.get("kind") ?? "") ? (params.get("kind") as KindFilter) : null,
    letType: LET_TYPES.includes(params.get("let") ?? "") ? (params.get("let") as LetTypeFilter) : null,
    // Repeated ?use= rather than one comma-joined value: PostgREST treats a
    // comma as syntax, and a shared link should not depend on escaping it.
    permittedUses: [...new Set(params.getAll("use").filter(u => USES.includes(u)))] as PermittedUse[],
    guaranteedRent: params.get("gr") === "1",
  };
}

/**
 * Write filters back to a query string, omitting defaults so a bare search has
 * a clean URL and two identical searches produce the same link.
 */
export function toParams(f: Filters): URLSearchParams {
  const p = new URLSearchParams();
  if (f.q.trim()) p.set("q", f.q.trim());
  if (f.city) p.set("city", f.city);
  if (f.maxPcm !== null) p.set("max", String(f.maxPcm));
  if (f.billsIncluded) p.set("bills", "1");
  if (f.ensuite) p.set("ensuite", "1");
  if (f.availableNow) p.set("now", "1");
  if (f.kind) p.set("kind", f.kind);
  if (f.letType) p.set("let", f.letType);
  // Sorted so two searches picking the same uses in a different order produce
  // the same link, which is what makes these shareable and cacheable.
  for (const u of [...f.permittedUses].sort()) p.append("use", u);
  if (f.guaranteedRent) p.set("gr", "1");
  return p;
}

export function toQueryString(f: Filters): string {
  const s = toParams(f).toString();
  return s ? `?${s}` : "";
}

export function isDefault(f: Filters): boolean {
  return toParams(f).toString() === "";
}

export function activeCount(f: Filters): number {
  return [
    f.q.trim() !== "",
    f.city !== null,
    f.maxPcm !== null,
    f.billsIncluded,
    f.ensuite,
    f.availableNow,
    f.kind !== null,
    f.letType !== null,
    f.permittedUses.length > 0,
    f.guaranteedRent,
  ].filter(Boolean).length;
}

/**
 * PostgREST treats , . : ( ) as syntax inside an `or=` group, so free text has
 * to be neutralised before it goes near one. Wildcards are stripped too: a
 * user typing % should search for a percent sign, not match everything.
 */
export function sanitiseForIlike(raw: string): string {
  return raw
    .replace(/[,.:()*%]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** The `or=` expression matching free text against the building's address. */
export function textFilter(q: string): string | null {
  const clean = sanitiseForIlike(q);
  if (clean.length < 2) return null;
  const like = `*${clean}*`;
  return [
    `address_line1.ilike.${like}`,
    `city.ilike.${like}`,
    `postcode.ilike.${like}`,
  ].join(",");
}

/**
 * The noun follows what is being searched for. Search used to be rooms-only,
 * so everything said "rooms"; it now covers studios and whole properties too,
 * and calling a four-bed house a room is the kind of small wrongness that
 * tells someone the site was not built for them.
 */
export function resultNoun(kind: KindFilter, count: number): string {
  const one = count === 1;
  switch (kind) {
    case "room": return one ? "room" : "rooms";
    case "studio": return one ? "studio" : "studios";
    case "whole_property": return one ? "property" : "properties";
    default: return one ? "place" : "places";
  }
}

/** Human summary above the results. Plain, and honest about zero. */
export function resultsLabel(count: number, f: Filters): string {
  const noun = resultNoun(f.kind, count);
  const plural = resultNoun(f.kind, 0);
  const where = f.city ? ` in ${f.city}` : f.q.trim() ? ` matching “${f.q.trim()}”` : "";
  const who = f.letType === "company" ? " open to companies" : "";
  if (count === 0) {
    return activeCount(f) === 0
      ? `No ${plural} listed yet`
      : `No ${plural}${where}${who} match those filters`;
  }
  return `${count} ${noun}${where}${who}`;
}

/** Shape the search query returns, before flattening. */
export interface SearchQueryRow {
  id: string;
  kind: string;
  label: string;
  ensuite: boolean;
  bills_included: boolean;
  rent_pcm: number | null;
  status: string;
  available_from: string | null;
  status_confirmed_at: string;
  makan_media: { url: string; sort_order: number }[] | null;
  let_types: string[] | null;
  permitted_uses: string[] | null;
  min_lease_months: number | null;
  guaranteed_rent_considered: boolean | null;
  makan_unit: {
    label: string;
    shared_bathrooms: number | null;
    makan_building: { address_line1: string; city: string; postcode: string } | null;
  } | null;
}

export interface SearchResult {
  spaceId: string;
  kind: string;
  label: string;
  unitLabel: string;
  ensuite: boolean;
  billsIncluded: boolean;
  rentPcm: number | null;
  city: string;
  postcode: string;
  addressLine1: string;
  availableFrom: string | null;
  statusConfirmedAt: string;
  /** The first photo, or null. Search shows one; the listing shows the rest. */
  coverUrl: string | null;
  letTypes: string[];
  permittedUses: string[];
  minLeaseMonths: number | null;
  guaranteedRentConsidered: boolean;
}

/** True when this listing is one an agent would have declined on sight. */
export function acceptsCompanies(r: Pick<SearchResult, "letTypes">): boolean {
  return r.letTypes.includes("company");
}

export function toResults(rows: SearchQueryRow[]): SearchResult[] {
  const out: SearchResult[] = [];
  for (const r of rows) {
    const b = r.makan_unit?.makan_building;
    if (!r.makan_unit || !b) continue;
    out.push({
      spaceId: r.id,
      kind: r.kind,
      label: r.label,
      unitLabel: r.makan_unit.label,
      ensuite: r.ensuite,
      billsIncluded: r.bills_included,
      rentPcm: r.rent_pcm,
      city: b.city,
      postcode: b.postcode,
      addressLine1: b.address_line1,
      availableFrom: r.available_from,
      statusConfirmedAt: r.status_confirmed_at,
      // Older rows predate the company-let columns and come back null. A
      // listing with no recorded audience is a tenant listing, which is what
      // the column default says too.
      // Ordered here rather than trusting the embed: PostgREST does not
      // guarantee the order of an embedded resource without an explicit sort.
      coverUrl: (r.makan_media ?? []).slice().sort((a, b) => a.sort_order - b.sort_order)[0]?.url ?? null,
      letTypes: r.let_types ?? ["tenant"],
      permittedUses: r.permitted_uses ?? [],
      minLeaseMonths: r.min_lease_months,
      guaranteedRentConsidered: r.guaranteed_rent_considered ?? false,
    });
  }
  return out;
}

/**
 * Street-level only. A room's exact door number is not public until somebody
 * has actually enquired, and publishing it invites doorstepping — the whole
 * point of a room share is that strangers do not know which house.
 */
export function publicLocation(r: Pick<SearchResult, "addressLine1" | "city" | "postcode">): string {
  const street = r.addressLine1.replace(/^\s*[\d/-]+[a-z]?\s+/i, "").trim();
  // That strip needs whitespace after the number, so a bare "42" comes through
  // untouched — and a door number is the one thing this function exists to keep
  // off a public listing. Anything still looking like a number falls back to
  // the city.
  const stillANumber = /^[\d/-]+[a-z]?$/i.test(street);
  const outward = r.postcode.trim().split(/\s+/)[0];
  return [street && !stillANumber ? street : r.city, outward].filter(Boolean).join(", ");
}
