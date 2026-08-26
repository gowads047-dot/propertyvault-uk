import { describe, it, expect } from "vitest";
import {
  EMPTY_DRAFT,
  PERMITTED_USES,
  PROPERTY_TYPES,
  acceptsCompanies,
  clearCompanyTermsIfUnused,
  companyLetExplainer,
  defaultSpaceLabel,
  draftSummary,
  isValidPostcode,
  normalisePostcode,
  outwardCode,
  toInsertPlan,
  validateDraft,
  type ListingDraft,
} from "./makan-listing";

const ORG = "aaaaaaaa-0000-0000-0000-000000000001";

/** A draft that would publish. Individual tests break one thing at a time. */
function draft(over: Partial<ListingDraft> = {}): ListingDraft {
  return {
    ...EMPTY_DRAFT,
    postcode: "B29 6AA",
    addressLine1: "12 Chapel Street",
    city: "Birmingham",
    rentPcm: "650",
    ...over,
  };
}

describe("postcodes", () => {
  it.each([
    ["b296aa", "B29 6AA"],
    ["B29 6AA", "B29 6AA"],
    ["  ec1a 1bb ", "EC1A 1BB"],
    ["M11AE", "M1 1AE"],
  ])("normalises %s to %s", (raw, expected) => {
    expect(normalisePostcode(raw)).toBe(expected);
  });

  it.each(["B29 6AA", "b296aa", "EC1A 1BB", "M1 1AE", "DE1 2AB"])("accepts %s", pc => {
    expect(isValidPostcode(pc)).toBe(true);
  });

  it.each(["", "B29", "not a postcode", "12345"])("rejects %s", pc => {
    expect(isValidPostcode(pc)).toBe(false);
  });

  it("extracts the outward code, which is all that is shown publicly", () => {
    expect(outwardCode("b296aa")).toBe("B29");
    expect(outwardCode("EC1A 1BB")).toBe("EC1A");
  });
});

describe("validateDraft", () => {
  it("accepts a minimal listing", () => {
    expect(validateDraft(draft())).toEqual({ ok: true });
  });

  // Everything optional stays optional. A half-filled listing that exists
  // beats a perfect one the landlord abandoned.
  it("does not require bedrooms, description or lease length", () => {
    expect(validateDraft(draft({ bedrooms: "", description: "", minLeaseMonths: "" }))).toEqual({ ok: true });
  });

  it.each([
    [{ postcode: "nope" }, "postcode"],
    [{ addressLine1: "  " }, "addressLine1"],
    [{ city: "" }, "city"],
    [{ rentPcm: "" }, "rentPcm"],
    [{ rentPcm: "0" }, "rentPcm"],
    [{ rentPcm: "abc" }, "rentPcm"],
    [{ bedrooms: "4.5" }, "bedrooms"],
    [{ bedrooms: "-1" }, "bedrooms"],
    [{ minLeaseMonths: "0" }, "minLeaseMonths"],
    [{ minLeaseMonths: "999" }, "minLeaseMonths"],
  ])("rejects %o on field %s", (over, field) => {
    expect(validateDraft(draft(over as Partial<ListingDraft>))).toMatchObject({ ok: false, field });
  });

  it("catches a rent typo rather than publishing it", () => {
    expect(validateDraft(draft({ rentPcm: "650000" }))).toMatchObject({ ok: false, field: "rentPcm" });
  });

  // A listing nobody is allowed to answer is not a listing.
  it("requires at least one let type", () => {
    expect(validateDraft(draft({ letTypes: [] }))).toMatchObject({ ok: false, field: "letTypes" });
  });
});

describe("who the landlord will let to", () => {
  it("defaults to tenants", () => {
    expect(EMPTY_DRAFT.letTypes).toEqual(["tenant"]);
    expect(acceptsCompanies(EMPTY_DRAFT)).toBe(false);
  });

  it("recognises a company let", () => {
    expect(acceptsCompanies(draft({ letTypes: ["company"] }))).toBe(true);
    expect(acceptsCompanies(draft({ letTypes: ["tenant", "company"] }))).toBe(true);
  });

  // Leaving these populated would put a property in front of operators the
  // landlord never agreed to.
  it("clears company terms when companies are not accepted", () => {
    const d = clearCompanyTermsIfUnused(
      draft({
        letTypes: ["tenant"],
        permittedUses: ["supported_living"],
        minLeaseMonths: "36",
        guaranteedRentConsidered: true,
      })
    );
    expect(d.permittedUses).toEqual([]);
    expect(d.minLeaseMonths).toBe("");
    expect(d.guaranteedRentConsidered).toBe(false);
  });

  it("leaves them alone when companies are accepted", () => {
    const original = draft({ letTypes: ["company"], permittedUses: ["hmo"], minLeaseMonths: "24" });
    expect(clearCompanyTermsIfUnused(original)).toEqual(original);
  });
});

describe("companyLetExplainer", () => {
  it("covers the lease, who does the work, the paperwork and consent", () => {
    const text = companyLetExplainer().join(" ").toLowerCase();
    expect(text).toContain("lease");
    expect(text).toContain("repairs");
    expect(text).toContain("ast");
    expect(text).toMatch(/lender|mortgage/);
  });

  // We have no operators yet. Claiming reach would be the same lie as a
  // fabricated response time.
  it("promises no audience it cannot prove", () => {
    const text = companyLetExplainer().join(" ");
    expect(text).not.toMatch(/\d+\s*(operators|companies|landlords)/i);
    expect(text).not.toMatch(/thousands|hundreds of/i);
  });
});

describe("defaultSpaceLabel", () => {
  it.each([
    [{ propertyType: "room" as const }, "Room"],
    [{ propertyType: "studio" as const }, "Studio"],
    [{ propertyType: "whole_property" as const, bedrooms: "4", unitType: "house" as const }, "4 bed house"],
    [{ propertyType: "whole_property" as const, bedrooms: "", unitType: "flat" as const }, "Flat"],
  ])("labels %o as %s", (over, expected) => {
    expect(defaultSpaceLabel(draft(over as Partial<ListingDraft>))).toBe(expected);
  });
});

describe("toInsertPlan", () => {
  it("derives building, unit, space and listing from one form", () => {
    const plan = toInsertPlan(
      draft({ propertyType: "whole_property", unitType: "house", bedrooms: "4", rentPcm: "1800" }),
      ORG,
      { lat: 52.44, lng: -1.93 }
    );
    expect(plan.building).toMatchObject({ org_id: ORG, postcode: "B29 6AA", city: "Birmingham", lat: 52.44 });
    expect(plan.unit).toMatchObject({ unit_type: "house", bedrooms: 4 });
    expect(plan.space).toMatchObject({ kind: "whole_property", rent_pcm: 1800, status: "available_now" });
    expect(plan.listing).toMatchObject({ channel: "public" });
  });

  it("copes when the postcode lookup returned nothing", () => {
    const plan = toInsertPlan(draft(), ORG, null);
    expect(plan.building.lat).toBeNull();
    expect(plan.building.lng).toBeNull();
  });

  it("normalises the postcode on the way in", () => {
    expect(toInsertPlan(draft({ postcode: "b296aa" }), ORG, null).building.postcode).toBe("B29 6AA");
  });

  it("carries company terms through when companies are accepted", () => {
    const plan = toInsertPlan(
      draft({ letTypes: ["company"], permittedUses: ["supported_living"], minLeaseMonths: "36", guaranteedRentConsidered: true }),
      ORG, null
    );
    expect(plan.space.let_types).toEqual(["company"]);
    expect(plan.space.permitted_uses).toEqual(["supported_living"]);
    expect(plan.space.min_lease_months).toBe(36);
    expect(plan.space.guaranteed_rent_considered).toBe(true);
  });

  it("strips company terms when they are not", () => {
    const plan = toInsertPlan(
      draft({ letTypes: ["tenant"], permittedUses: ["supported_living"], minLeaseMonths: "36" }),
      ORG, null
    );
    expect(plan.space.permitted_uses).toEqual([]);
    expect(plan.space.min_lease_months).toBeNull();
  });

  it("treats a blank bedroom count as unknown, not zero", () => {
    expect(toInsertPlan(draft({ bedrooms: "" }), ORG, null).unit.bedrooms).toBeNull();
  });

  it("never asks the landlord to meet the word unit", () => {
    for (const t of PROPERTY_TYPES) {
      const plan = toInsertPlan(draft({ propertyType: t.value }), ORG, null);
      expect(plan.unit.label, t.value).not.toMatch(/unit/i);
    }
  });
});

describe("draftSummary", () => {
  it("reads back what is about to be published", () => {
    expect(draftSummary(draft({ propertyType: "whole_property", bedrooms: "4", unitType: "house", rentPcm: "1800" })))
      .toBe("4 bed house · B29 · £1,800/mo — open to tenants");
  });

  it("names both audiences when both are ticked", () => {
    expect(draftSummary(draft({ letTypes: ["tenant", "company"] }))).toContain("open to tenants or companies");
  });

  it("is explicit about companies only", () => {
    expect(draftSummary(draft({ letTypes: ["company"] }))).toContain("companies only");
  });
});

describe("vocabulary", () => {
  it("offers the four company uses the schema allows", () => {
    expect(PERMITTED_USES.map(u => u.value)).toEqual([
      "serviced_accommodation", "supported_living", "hmo", "social_housing",
    ]);
  });
});
