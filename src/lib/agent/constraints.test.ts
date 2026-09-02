import { describe, it, expect, vi } from "vitest";
import {
  fetchConstraints, constraintEvidence, notableConstraints, coordsFor,
  type PointFetcher,
} from "./constraints";

/** A fetcher that returns whatever each dataset is scripted to return. */
function scripted(byDataset: Record<string, unknown>): PointFetcher {
  return async dataset => (dataset in byDataset ? byDataset[dataset] : { entities: [] });
}

const none: PointFetcher = async () => ({ entities: [] });
const down: PointFetcher = async () => null;

describe("finding constraints", () => {
  it("checks every dataset that changes what you can do with a property", async () => {
    const r = await fetchConstraints(52.95, -1.16, none);
    const names = r.map(x => x.dataset);
    expect(names).toContain("flood-risk-zone");
    expect(names).toContain("article-4-direction-area");
    expect(names).toContain("conservation-area");
    expect(names).toContain("listed-building");
  });

  it("reads a flood zone with its level and type", async () => {
    const r = await fetchConstraints(52.97, -0.02, scripted({
      "flood-risk-zone": {
        entities: [{ reference: "419169/2", "flood-risk-level": "2", "flood-risk-type": "Tidal Events" }],
      },
    }));
    const flood = r.find(x => x.dataset === "flood-risk-zone")!;
    expect(flood.hits).toHaveLength(1);
    expect(flood.hits[0].detail).toEqual({ "flood-risk-level": "2", "flood-risk-type": "Tidal Events" });
  });

  // The one that matters most to a landlord: an Article 4 direction is what
  // stops an HMO conversion without planning permission.
  it("reads a named Article 4 direction", async () => {
    const r = await fetchConstraints(52.44, -1.937, scripted({
      "article-4-direction-area": { entities: [{ name: "SELLY OAK HMO" }, { name: "Second" }] },
    }));
    const a4 = r.find(x => x.dataset === "article-4-direction-area")!;
    expect(a4.hits[0].name).toBe("SELLY OAK HMO");
    expect(a4.matters).toContain("HMO");
  });

  it("distinguishes a failed lookup from an empty one", async () => {
    const broken = await fetchConstraints(52.95, -1.16, down);
    expect(broken.every(r => r.unavailable)).toBe(true);
    expect(broken.every(r => r.hits.length === 0)).toBe(true);

    const empty = await fetchConstraints(52.95, -1.16, none);
    expect(empty.every(r => r.unavailable)).toBe(false);
  });
});

describe("what an empty result is allowed to claim", () => {
  // The whole point of this module. National coverage is incomplete, so "no
  // record found" is a weaker statement than "there is none" — and rendering
  // the first as a green tick would be inventing a clean bill of health.
  it("never marks an absent constraint as verified", async () => {
    const ev = constraintEvidence(await fetchConstraints(52.95, -1.16, none));
    expect(ev.every(e => e.state === "missing")).toBe(true);
    expect(ev.every(e => e.state !== "verified")).toBe(true);
  });

  it("says the register was checked and coverage is incomplete", async () => {
    const ev = constraintEvidence(await fetchConstraints(52.95, -1.16, none));
    expect(ev[0].method).toContain("No record");
    expect(ev[0].method).toContain("Coverage is incomplete");
    expect(ev[0].method).not.toMatch(/\bnone applies\b(?!.)/);
  });

  it("distinguishes an unreachable register from an empty one", async () => {
    const ev = constraintEvidence(await fetchConstraints(52.95, -1.16, down));
    expect(ev[0].method).toContain("did not respond");
    expect(ev[0].method).toContain("not checked");
  });

  it("marks a real hit as verified, with the register as the source", async () => {
    const ev = constraintEvidence(await fetchConstraints(52.95, -1.16, scripted({
      "conservation-area": { entities: [{ name: "The Park" }] },
    })));
    const ca = ev.find(e => e.field === "conservation_area")!;
    expect(ca.state).toBe("verified");
    expect(ca.source).toBe("planning.data.gov.uk");
    expect(ca.valueText).toBe("The Park");
  });

  it("puts the flood level into the value rather than hiding it in a detail bag", async () => {
    const ev = constraintEvidence(await fetchConstraints(52.97, -0.02, scripted({
      "flood-risk-zone": { entities: [{ reference: "419169/2", "flood-risk-level": "2", "flood-risk-type": "Tidal Events" }] },
    })));
    const f = ev.find(e => e.field === "flood_risk_zone")!;
    expect(f.valueText).toContain("2");
    expect(f.valueText).toContain("Tidal Events");
  });
});

describe("what to tell the user", () => {
  it("lists only what was actually found", async () => {
    const r = await fetchConstraints(52.95, -1.16, scripted({
      "conservation-area": { entities: [{ name: "The Park" }] },
    }));
    const notable = notableConstraints(r);
    expect(notable).toHaveLength(1);
    expect(notable[0].dataset).toBe("conservation-area");
  });

  it("puts flood and Article 4 above the softer constraints", async () => {
    const r = await fetchConstraints(52.95, -1.16, scripted({
      "green-belt": { entities: [{ name: "GB" }] },
      "article-4-direction-area": { entities: [{ name: "HMO" }] },
      "flood-risk-zone": { entities: [{ reference: "z" }] },
    }));
    expect(notableConstraints(r).map(x => x.dataset))
      .toEqual(["flood-risk-zone", "article-4-direction-area", "green-belt"]);
  });

  it("returns nothing to report when nothing was found", async () => {
    expect(notableConstraints(await fetchConstraints(52.95, -1.16, none))).toHaveLength(0);
  });
});

describe("resolving a postcode", () => {
  it("rejects anything that is not a UK postcode without calling out", async () => {
    const f = vi.fn();
    vi.stubGlobal("fetch", f);
    for (const bad of ["", "NOTAPOSTCODE", "12345", "NG7"]) {
      expect(await coordsFor(bad), bad).toBeNull();
    }
    expect(f).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });

  it("returns coordinates for a real one", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => ({
      ok: true, json: async () => ({ result: { latitude: 52.95, longitude: -1.16 } }),
    })));
    expect(await coordsFor("ng7 1aa")).toEqual({ lat: 52.95, lon: -1.16 });
    vi.unstubAllGlobals();
  });

  it("returns null rather than throwing when the lookup fails", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => ({ ok: false, json: async () => null })));
    expect(await coordsFor("NG7 1AA")).toBeNull();
    vi.unstubAllGlobals();
  });
});
