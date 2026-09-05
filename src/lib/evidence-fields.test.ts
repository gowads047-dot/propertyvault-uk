import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { FIELDS, specFor, formatValue } from "./evidence-fields";

const SRC = join(process.cwd(), "src");

function filesUnder(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...filesUnder(full));
    else if (/\.tsx?$/.test(entry) && !/\.test\.tsx?$/.test(entry)) out.push(full);
  }
  return out;
}

/**
 * Every field name the codebase actually writes to pv_evidence.
 *
 * Walked rather than listed, because a list would agree with reality only
 * until the next field was added — and the failure mode of a missing entry is
 * a raw identifier like "cash_on_cash" printed on a customer's property page.
 *
 * Two shapes, because the first version of this walk only knew one and three
 * fields slipped through it onto a live page: monthly_rent, asking_price and
 * the planning family all rendered as their machine names. The helper calls
 * (`calculated("gross_yield", …)`) were caught; the object literals
 * (`{ field: "asking_price", … }`) were not.
 *
 * Field names built at runtime — `planning_${label}` — are deliberately not
 * collected. They cannot be enumerated, so specFor handles that family by
 * prefix instead, and the test below checks the rule rather than the list.
 */
const written = (() => {
  const patterns: RegExp[] = [
    /(?:verified|calculated|estimated|assumed|fromUser|missing)\(\s*"([a-z_]+)"/g,
    // Paired with state, because a pv_evidence row always carries one. A bare
    // `field:` also matches Rentura form definitions, which are not evidence.
    /field:\s*"([a-z_]+)"\s*,\s*state:/g,
  ];
  const found = new Set<string>();
  for (const file of filesUnder(SRC)) {
    const src = readFileSync(file, "utf8");
    for (const pattern of patterns) {
      for (const m of src.matchAll(pattern)) found.add(m[1]);
    }
  }
  return [...found].sort();
})();

describe("the walk works", () => {
  it("finds the evidence fields the code produces", () => {
    // A regex that matched nothing would make every assertion below vacuous.
    expect(written.length).toBeGreaterThan(8);
    // One of each shape, so a regex that silently stopped matching either
    // form fails here rather than passing an empty-handed walk.
    expect(written, "helper-call form").toContain("gross_yield");
    expect(written, "object-literal form").toContain("asking_price");
  });
});

describe("every field a person can see has a name they can read", () => {
  it("labels every field the codebase writes", () => {
    for (const field of written) {
      expect(FIELDS[field], `pv_evidence field "${field}" has no entry in FIELDS`).toBeTruthy();
    }
  });

  it("gives every label enough words to mean something", () => {
    // Deliberately not "the label must differ from the machine name". Some
    // machine names are already the right words — "Gross yield" is what a
    // person calls gross_yield, and a test that rejects it would push the
    // label towards something worse purely to satisfy the test.
    for (const [field, spec] of Object.entries(FIELDS)) {
      expect(spec.label.length, field).toBeGreaterThan(3);
      expect(spec.label, field).not.toMatch(/_/);
    }
  });

  it("explains the terms that need explaining", () => {
    // Yield, cash-on-cash and CGT all mean something specific. A label without
    // a hint assumes the reader already knows, which is the assumption this
    // product exists not to make.
    for (const [field, spec] of Object.entries(FIELDS)) {
      expect(spec.hint, `${field} has no hint`).toBeTruthy();
      expect(spec.hint!.length, field).toBeGreaterThan(20);
    }
  });

  it("names a planning constraint after the constraint", () => {
    // These field names are built from whatever the planning register called
    // the designation, so they can never appear in FIELDS. Before the prefix
    // rule they printed as "planning conservation area" on a live page.
    expect(specFor("planning_conservation_area").label).toBe("Planning: conservation area");
    expect(specFor("planning_flood_zone_2").label).toBe("Planning: flood zone 2");
    expect(specFor("planning_conservation_area").hint).toBeTruthy();
  });

  it("falls back readably for a field it has never met", () => {
    // The test above should prevent this, but a saved row from an older
    // version must not throw or print an empty label.
    expect(specFor("some_new_field").label).toBe("some new field");
  });
});

describe("formatting a value", () => {
  it("puts money in pounds and percentages in percent", () => {
    expect(formatValue("maximum_offer", { value_num: 184500 })).toBe("£184,500");
    expect(formatValue("gross_yield", { value_num: 6.84 })).toBe("6.8%");
    expect(formatValue("monthly_cashflow", { value_num: 212 })).toBe("£212/month");
    expect(formatValue("pv_score", { value_num: 71 })).toBe("71 / 100");
  });

  it("keeps a negative cash flow negative", () => {
    // A property that loses money each month is the single most important
    // thing this can tell someone. Rendering it as £212 would be a lie.
    expect(formatValue("monthly_cashflow", { value_num: -212 })).toBe("-£212/month");
  });

  it("shows a range as a range", () => {
    expect(formatValue("area_median_sold", { value_low: 180000, value_high: 195000 }))
      .toBe("£180,000–£195,000");
    expect(formatValue("gross_yield", { value_low: 5.5, value_high: 6.25 }))
      .toBe("5.5–6.3%");
  });

  it("prefers text where a field carries text", () => {
    expect(formatValue("planning_constraints", { value_text: "Conservation area" }))
      .toBe("Conservation area");
  });

  it("returns null rather than inventing a zero", () => {
    // The whole system exists to stop absent data being shown as a figure.
    // A formatter that returns "£0" for nothing undoes all of it.
    expect(formatValue("maximum_offer", {})).toBeNull();
    expect(formatValue("maximum_offer", { value_num: null })).toBeNull();
    expect(formatValue("gross_yield", { value_text: "" })).toBeNull();
  });

  it("still shows a genuine zero", () => {
    // Distinct from the case above: nought pounds of cash flow is a fact.
    expect(formatValue("monthly_cashflow", { value_num: 0 })).toBe("£0/month");
  });
});
