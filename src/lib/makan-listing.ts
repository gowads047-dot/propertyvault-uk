/**
 * The listing flow.
 *
 * This is the thesis in one screen. A landlord who has been let down by an
 * agent will give Makan about three minutes before going back to the agent, so
 * every field has to earn its place and anything that can be asked later is
 * asked later.
 *
 * The one question that matters is `letTypes` — will you let to tenants, to
 * companies, or both. Ticking "companies" is what puts a property in front of
 * serviced-accommodation and supported-living operators, which is the offer an
 * estate agent declines on the landlord's behalf because a company let costs
 * them their management fee.
 */

export const PROPERTY_TYPES = [
  { value: "room", label: "A room in a shared house" },
  { value: "studio", label: "A studio" },
  { value: "whole_property", label: "A whole property" },
] as const;
export type PropertyType = (typeof PROPERTY_TYPES)[number]["value"];

export const UNIT_TYPES = ["house", "flat", "studio", "maisonette", "bungalow"] as const;
export type UnitType = (typeof UNIT_TYPES)[number];

export type LetType = "tenant" | "company";

export const PERMITTED_USES = [
  { value: "serviced_accommodation", label: "Serviced accommodation / short stays" },
  { value: "supported_living", label: "Supported living" },
  { value: "hmo", label: "HMO / room-by-room" },
  { value: "social_housing", label: "Social housing" },
] as const;
export type PermittedUse = (typeof PERMITTED_USES)[number]["value"];

export interface ListingDraft {
  postcode: string;
  addressLine1: string;
  city: string;
  propertyType: PropertyType;
  unitType: UnitType;
  bedrooms: string;
  rentPcm: string;
  billsIncluded: boolean;
  letTypes: LetType[];
  minLeaseMonths: string;
  guaranteedRentConsidered: boolean;
  permittedUses: PermittedUse[];
  description: string;
}

export const EMPTY_DRAFT: ListingDraft = {
  postcode: "",
  addressLine1: "",
  city: "",
  propertyType: "room",
  unitType: "house",
  bedrooms: "",
  rentPcm: "",
  billsIncluded: false,
  letTypes: ["tenant"],
  minLeaseMonths: "",
  guaranteedRentConsidered: false,
  permittedUses: [],
  description: "",
};

/**
 * UK postcodes, loosely. Deliberately permissive: rejecting a real postcode
 * because of a format edge case costs a listing, and the lookup below is the
 * real check anyway.
 */
const POSTCODE = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i;

export function normalisePostcode(raw: string): string {
  const s = raw.toUpperCase().replace(/\s+/g, "");
  if (s.length < 5) return s;
  return `${s.slice(0, -3)} ${s.slice(-3)}`;
}

export function isValidPostcode(raw: string): boolean {
  return POSTCODE.test(raw.trim());
}

/** The outward code — the bit shown publicly. */
export function outwardCode(raw: string): string {
  return normalisePostcode(raw).split(" ")[0] ?? "";
}

export type Invalid = { ok: false; field: keyof ListingDraft; message: string };
export type Valid = { ok: true };

/**
 * Only what genuinely cannot be added later. Bedrooms, description and lease
 * length are all optional on purpose — a landlord can publish and refine, and
 * a half-filled listing that exists beats a perfect one that was abandoned.
 */
export function validateDraft(d: ListingDraft): Valid | Invalid {
  if (!isValidPostcode(d.postcode)) {
    return { ok: false, field: "postcode", message: "That does not look like a UK postcode." };
  }
  if (!d.addressLine1.trim()) {
    return { ok: false, field: "addressLine1", message: "Add the street address. Only the street and outward code are shown publicly." };
  }
  if (!d.city.trim()) {
    return { ok: false, field: "city", message: "Add the town or city." };
  }
  const rent = Number(d.rentPcm);
  if (!d.rentPcm.trim() || !Number.isFinite(rent) || rent <= 0) {
    return { ok: false, field: "rentPcm", message: "Add the monthly rent you are looking for." };
  }
  if (rent > 50_000) {
    return { ok: false, field: "rentPcm", message: "That rent looks like a typo. Monthly, in pounds." };
  }
  if (d.letTypes.length === 0) {
    return { ok: false, field: "letTypes", message: "Choose who you would let to — nobody can answer a listing otherwise." };
  }
  if (d.bedrooms.trim()) {
    const beds = Number(d.bedrooms);
    if (!Number.isInteger(beds) || beds < 0 || beds > 30) {
      return { ok: false, field: "bedrooms", message: "Bedrooms should be a whole number." };
    }
  }
  if (d.minLeaseMonths.trim()) {
    const m = Number(d.minLeaseMonths);
    if (!Number.isInteger(m) || m < 1 || m > 120) {
      return { ok: false, field: "minLeaseMonths", message: "Lease length in months, between 1 and 120." };
    }
  }
  return { ok: true };
}

export function acceptsCompanies(d: Pick<ListingDraft, "letTypes">): boolean {
  return d.letTypes.includes("company");
}

/**
 * Company-let terms are meaningless on a tenant-only listing, and leaving them
 * populated would put a property in front of operators the landlord never
 * agreed to. Cleared rather than hidden.
 */
export function clearCompanyTermsIfUnused(d: ListingDraft): ListingDraft {
  if (acceptsCompanies(d)) return d;
  return { ...d, permittedUses: [], minLeaseMonths: "", guaranteedRentConsidered: false };
}

/**
 * What a landlord is told after ticking "companies". No numbers, because we do
 * not have any yet — saying "reach 40 operators" before there are any would be
 * the same lie as a fabricated response time.
 */
export function companyLetExplainer(): string[] {
  return [
    "A company takes the whole property on a lease, usually 2–5 years, and pays you whether or not it is occupied.",
    "They handle the tenants, the day-to-day and most repairs. You deal with one business, not a series of tenancies.",
    "It is a commercial lease rather than an AST, so the paperwork differs — the company will normally bring it.",
    "Worth confirming with your lender, insurer and freeholder that a company let is permitted. Many buy-to-let mortgages need consent.",
  ];
}

/** Payloads for the four inserts a listing turns into. */
export interface InsertPlan {
  building: {
    org_id: string;
    address_line1: string;
    city: string;
    postcode: string;
    lat: number | null;
    lng: number | null;
  };
  unit: { label: string; unit_type: UnitType; bedrooms: number | null };
  space: {
    kind: PropertyType;
    label: string;
    rent_pcm: number;
    bills_included: boolean;
    status: "available_now";
    let_types: LetType[];
    min_lease_months: number | null;
    guaranteed_rent_considered: boolean;
    permitted_uses: PermittedUse[];
  };
  listing: { channel: "public"; description: string | null };
}

/**
 * A listing is one physical thing, so the building/unit/space rows are derived
 * rather than asked for. A landlord should never meet the word "unit".
 */
export function toInsertPlan(
  draft: ListingDraft,
  orgId: string,
  coords: { lat: number; lng: number } | null
): InsertPlan {
  const d = clearCompanyTermsIfUnused(draft);
  const beds = d.bedrooms.trim() ? Number(d.bedrooms) : null;

  return {
    building: {
      org_id: orgId,
      address_line1: d.addressLine1.trim(),
      city: d.city.trim(),
      postcode: normalisePostcode(d.postcode),
      lat: coords?.lat ?? null,
      lng: coords?.lng ?? null,
    },
    unit: {
      label: d.propertyType === "room" ? "Whole house" : "Whole property",
      unit_type: d.unitType,
      bedrooms: beds,
    },
    space: {
      kind: d.propertyType,
      label: defaultSpaceLabel(d),
      rent_pcm: Number(d.rentPcm),
      bills_included: d.billsIncluded,
      status: "available_now",
      let_types: d.letTypes,
      min_lease_months: d.minLeaseMonths.trim() ? Number(d.minLeaseMonths) : null,
      guaranteed_rent_considered: d.guaranteedRentConsidered,
      permitted_uses: d.permittedUses,
    },
    listing: { channel: "public", description: d.description.trim() || null },
  };
}

export function defaultSpaceLabel(d: Pick<ListingDraft, "propertyType" | "bedrooms" | "unitType">): string {
  if (d.propertyType === "room") return "Room";
  if (d.propertyType === "studio") return "Studio";
  const beds = d.bedrooms.trim() ? `${d.bedrooms} bed ` : "";
  return `${beds}${d.unitType}`.replace(/^\w/, c => c.toUpperCase());
}

/** One-line summary shown back to the landlord before they publish. */
export function draftSummary(d: ListingDraft): string {
  const what = defaultSpaceLabel(d);
  const where = outwardCode(d.postcode) || d.city.trim();
  const rent = d.rentPcm.trim() ? `£${Number(d.rentPcm).toLocaleString("en-GB")}/mo` : "";
  const who =
    d.letTypes.length === 2 ? "tenants or companies"
    : d.letTypes[0] === "company" ? "companies only"
    : "tenants";
  return [what, where, rent].filter(Boolean).join(" · ") + ` — open to ${who}`;
}
