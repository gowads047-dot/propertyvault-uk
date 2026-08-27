import { describe, it, expect } from "vitest";
import {
  EMPTY_FILTERS,
  activeCount,
  fromParams,
  isDefault,
  publicLocation,
  resultsLabel,
  resultNoun,
  acceptsCompanies,
  clearCompanyFiltersIfUnused,
  sanitiseForIlike,
  textFilter,
  toParams,
  toQueryString,
  toResults,
  type Filters,
  type SearchQueryRow,
} from "./makan-search";

const p = (s: string) => new URLSearchParams(s);
const f = (over: Partial<Filters> = {}): Filters => ({ ...EMPTY_FILTERS, ...over });

describe("fromParams", () => {
  it("reads a full query string", () => {
    expect(fromParams(p(
      "q=selly&city=Birmingham&max=700&bills=1&ensuite=1&now=1" +
      "&kind=whole_property&let=company&use=supported_living&use=hmo&gr=1"
    ))).toEqual({
      q: "selly",
      city: "Birmingham",
      maxPcm: 700,
      billsIncluded: true,
      ensuite: true,
      availableNow: true,
      kind: "whole_property",
      letType: "company",
      permittedUses: ["supported_living", "hmo"],
      guaranteedRent: true,
    });
  });

  it("returns defaults for an empty query string", () => {
    expect(fromParams(p(""))).toEqual(EMPTY_FILTERS);
  });

  // A shared link with a mangled parameter should still show rooms rather
  // than an error page.
  it.each(["max=abc", "max=", "max=-50", "max=0"])("drops an unusable budget (%s)", qs => {
    expect(fromParams(p(qs)).maxPcm).toBeNull();
  });

  it("floors a fractional budget", () => {
    expect(fromParams(p("max=699.99")).maxPcm).toBe(699);
  });

  it("treats a blank city as no city", () => {
    expect(fromParams(p("city=")).city).toBeNull();
    expect(fromParams(p("city=%20%20")).city).toBeNull();
  });

  it("only treats an explicit 1 as a checked box", () => {
    expect(fromParams(p("bills=0")).billsIncluded).toBe(false);
    expect(fromParams(p("bills=true")).billsIncluded).toBe(false);
    expect(fromParams(p("bills=1")).billsIncluded).toBe(true);
  });

  it("caps very long free text", () => {
    expect(fromParams(p(`q=${"a".repeat(500)}`)).q).toHaveLength(80);
  });
});

describe("toParams", () => {
  it("omits everything at its default", () => {
    expect(toParams(EMPTY_FILTERS).toString()).toBe("");
    expect(isDefault(EMPTY_FILTERS)).toBe(true);
    expect(toQueryString(EMPTY_FILTERS)).toBe("");
  });

  it("round-trips", () => {
    const original = f({ q: "selly oak", city: "Birmingham", maxPcm: 700, billsIncluded: true });
    expect(fromParams(toParams(original))).toEqual(original);
  });

  it("prefixes with ? only when there is something to say", () => {
    expect(toQueryString(f({ city: "Derby" }))).toBe("?city=Derby");
  });

  it("trims whitespace out of the link", () => {
    expect(toParams(f({ q: "  selly  " })).get("q")).toBe("selly");
  });
});

describe("activeCount", () => {
  it("counts nothing on a bare search", () => {
    expect(activeCount(EMPTY_FILTERS)).toBe(0);
  });

  it("counts each active filter once", () => {
    expect(activeCount(f({ city: "Derby", maxPcm: 600, ensuite: true }))).toBe(3);
  });

  it("ignores whitespace-only text", () => {
    expect(activeCount(f({ q: "   " }))).toBe(0);
  });
});

describe("sanitiseForIlike", () => {
  // PostgREST reads , . : ( ) as syntax inside an or= group. Leaving them in
  // means a search for "B29, Selly Oak" is parsed as two filters.
  it("strips PostgREST syntax characters", () => {
    expect(sanitiseForIlike("B29, Selly Oak (rear)")).toBe("B29 Selly Oak rear");
    expect(sanitiseForIlike("a.b:c")).toBe("a b c");
  });

  it("strips wildcards so a typed % is not a match-all", () => {
    expect(sanitiseForIlike("%")).toBe("");
    expect(sanitiseForIlike("sel%ly")).toBe("sel ly");
    expect(sanitiseForIlike("*")).toBe("");
  });

  it("collapses whitespace", () => {
    expect(sanitiseForIlike("  selly    oak  ")).toBe("selly oak");
  });
});

describe("textFilter", () => {
  it("searches address, city and postcode", () => {
    expect(textFilter("selly")).toBe(
      "address_line1.ilike.*selly*,city.ilike.*selly*,postcode.ilike.*selly*"
    );
  });

  // One character matches almost everything, which is worse than not filtering.
  it("declines to filter on too little input", () => {
    expect(textFilter("a")).toBeNull();
    expect(textFilter(" ")).toBeNull();
    expect(textFilter("%")).toBeNull();
  });
});

describe("resultsLabel", () => {
  it("distinguishes an empty catalogue from an empty result", () => {
    expect(resultsLabel(0, EMPTY_FILTERS)).toBe("No places listed yet");
    expect(resultsLabel(0, f({ city: "Derby" }))).toBe("No places in Derby match those filters");
  });

  it("counts in the singular", () => {
    expect(resultsLabel(1, EMPTY_FILTERS)).toBe("1 place");
    expect(resultsLabel(4, EMPTY_FILTERS)).toBe("4 places");
  });

  it("names the place when there is one", () => {
    expect(resultsLabel(3, f({ city: "Birmingham" }))).toBe("3 places in Birmingham");
  });

  it("falls back to the search text", () => {
    expect(resultsLabel(2, f({ q: "selly" }))).toBe("2 places matching “selly”");
  });

  // Search covers studios and whole properties now, and calling a four-bed
  // house a room is the small wrongness that says the site is not for you.
  it("uses the noun for what is actually being searched", () => {
    expect(resultsLabel(1, f({ kind: "room" }))).toBe("1 room");
    expect(resultsLabel(2, f({ kind: "studio" }))).toBe("2 studios");
    expect(resultsLabel(1, f({ kind: "whole_property" }))).toBe("1 property");
    expect(resultsLabel(3, f({ kind: "whole_property" }))).toBe("3 properties");
  });

  it("says so when the search is for company lets", () => {
    expect(resultsLabel(2, f({ kind: "whole_property", letType: "company" })))
      .toBe("2 properties open to companies");
  });
});

describe("toResults", () => {
  const row: SearchQueryRow = {
    id: "s1",
    kind: "room",
    label: "Room 1",
    makan_media: null,
    let_types: ["tenant"],
    permitted_uses: [],
    min_lease_months: null,
    guaranteed_rent_considered: false,
    ensuite: true,
    bills_included: true,
    rent_pcm: 650,
    status: "available_now",
    available_from: null,
    status_confirmed_at: "2026-08-24T10:00:00Z",
    makan_unit: {
      label: "Whole house",
      shared_bathrooms: 2,
      makan_building: { address_line1: "12 Chapel Street", city: "Birmingham", postcode: "B29 6AA" },
    },
  };

  it("flattens the join", () => {
    const [r] = toResults([row]);
    expect(r).toMatchObject({ spaceId: "s1", city: "Birmingham", rentPcm: 650, ensuite: true });
  });

  // A parent hidden by RLS comes back null; a half-populated card looks like
  // corrupt data rather than a permission boundary.
  it("drops rows whose building did not come back", () => {
    expect(toResults([{ ...row, makan_unit: null }])).toHaveLength(0);
    expect(toResults([{ ...row, makan_unit: { ...row.makan_unit!, makan_building: null } }])).toHaveLength(0);
  });
});

describe("publicLocation", () => {
  // A room share works because strangers do not know which house. The door
  // number stays private until somebody actually enquires.
  it("drops the house number and the inward postcode", () => {
    expect(publicLocation({ addressLine1: "12 Chapel Street", city: "Birmingham", postcode: "B29 6AA" }))
      .toBe("Chapel Street, B29");
  });

  it.each([
    ["12a Chapel Street", "Chapel Street, B29"],
    ["12-14 Chapel Street", "Chapel Street, B29"],
    ["Flat 2/3 Chapel Street", "Flat 2/3 Chapel Street, B29"],
  ])("handles %s", (addressLine1, expected) => {
    expect(publicLocation({ addressLine1, city: "Birmingham", postcode: "B29 6AA" })).toBe(expected);
  });

  it("falls back to the city when the street cannot be separated", () => {
    expect(publicLocation({ addressLine1: "42", city: "Derby", postcode: "DE1 2AB" }))
      .toBe("Derby, DE1");
  });
});

describe("company lets", () => {
  it("round-trips the company filters through a URL", () => {
    const original = f({
      letType: "company",
      kind: "whole_property",
      permittedUses: ["hmo", "supported_living"],
      guaranteedRent: true,
    });
    const back = fromParams(p(toParams(original).toString()));
    expect(back.letType).toBe("company");
    expect(back.guaranteedRent).toBe(true);
    expect([...back.permittedUses].sort()).toEqual(["hmo", "supported_living"]);
  });

  // Two people ticking the same boxes in a different order should be able to
  // send each other the same link.
  it("orders the uses so the same search makes the same link", () => {
    const a = toParams(f({ permittedUses: ["hmo", "serviced_accommodation"] })).toString();
    const b = toParams(f({ permittedUses: ["serviced_accommodation", "hmo"] })).toString();
    expect(a).toBe(b);
  });

  it("drops values it does not recognise rather than erroring", () => {
    const got = fromParams(p("kind=castle&let=squatter&use=nonsense&use=hmo"));
    expect(got.kind).toBeNull();
    expect(got.letType).toBeNull();
    expect(got.permittedUses).toEqual(["hmo"]);
  });

  it("does not repeat a use that appears twice", () => {
    expect(fromParams(p("use=hmo&use=hmo")).permittedUses).toEqual(["hmo"]);
  });

  it("keeps an unset company search out of the URL", () => {
    expect(toParams(EMPTY_FILTERS).toString()).toBe("");
  });

  // Left set on a tenant search these silently exclude almost everything,
  // with no filter on screen to explain why.
  it("clears company terms when the search is not for company lets", () => {
    const cleared = clearCompanyFiltersIfUnused(
      f({ letType: "tenant", permittedUses: ["hmo"], guaranteedRent: true })
    );
    expect(cleared.permittedUses).toEqual([]);
    expect(cleared.guaranteedRent).toBe(false);
  });

  it("leaves them alone on a company search", () => {
    const kept = f({ letType: "company", permittedUses: ["hmo"], guaranteedRent: true });
    expect(clearCompanyFiltersIfUnused(kept)).toEqual(kept);
  });

  it("counts each company filter as active", () => {
    expect(activeCount(f({ letType: "company" }))).toBe(1);
    expect(activeCount(f({ letType: "company", permittedUses: ["hmo"], guaranteedRent: true }))).toBe(3);
  });

  it("reads a listing that predates the company columns as tenant-only", () => {
    const [r] = toResults([{
      id: "s1", kind: "room", label: "Room 1", ensuite: false, bills_included: true,
      rent_pcm: 650, status: "available_now", available_from: null,
      status_confirmed_at: "2026-08-01T00:00:00Z",
      makan_media: null,
      let_types: null, permitted_uses: null, min_lease_months: null,
      guaranteed_rent_considered: null,
      makan_unit: {
        label: "Whole house", shared_bathrooms: 1,
        makan_building: { address_line1: "12 Chapel St", city: "Birmingham", postcode: "B29 6AA" },
      },
    }]);
    expect(r.letTypes).toEqual(["tenant"]);
    expect(acceptsCompanies(r)).toBe(false);
    expect(r.guaranteedRentConsidered).toBe(false);
  });

  it("recognises a listing open to companies", () => {
    expect(acceptsCompanies({ letTypes: ["tenant", "company"] })).toBe(true);
  });

  it("names every kind it can search", () => {
    for (const k of ["room", "studio", "whole_property", null] as const) {
      expect(resultNoun(k, 1), String(k)).toBeTruthy();
      expect(resultNoun(k, 2), String(k)).toBeTruthy();
    }
  });
});

describe("cover photo", () => {
  const base = {
    id: "s1", kind: "room", label: "Room 1", ensuite: false, bills_included: true,
    rent_pcm: 650, status: "available_now", available_from: null,
    status_confirmed_at: "2026-08-01T00:00:00Z",
    let_types: ["tenant"], permitted_uses: [], min_lease_months: null,
    guaranteed_rent_considered: false,
    makan_unit: {
      label: "Whole house", shared_bathrooms: 1,
      makan_building: { address_line1: "12 Chapel St", city: "Birmingham", postcode: "B29 6AA" },
    },
  };

  // PostgREST does not guarantee the order of an embedded resource, so the
  // cover has to be chosen rather than taken off the top.
  it("takes the lowest sort_order, not the first row returned", () => {
    const [r] = toResults([{ ...base, makan_media: [
      { url: "second.jpg", sort_order: 3 },
      { url: "cover.jpg", sort_order: 0 },
    ] }] as never);
    expect(r.coverUrl).toBe("cover.jpg");
  });

  it("has no cover when the listing has no photos", () => {
    expect(toResults([{ ...base, makan_media: [] }] as never)[0].coverUrl).toBeNull();
    expect(toResults([{ ...base, makan_media: null }] as never)[0].coverUrl).toBeNull();
  });
});
