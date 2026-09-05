import { describe, it, expect } from "vitest";
import {
  REPORT, ALL_CHECKS, ANSWERER_LABEL, ANSWERER_MEANING,
  assess, coverage, type EvidenceLike,
} from "./vaultcheck";
import { FIELDS, specFor } from "./evidence-fields";

describe("the report is well formed", () => {
  it("has unique section and check ids", () => {
    const sections = REPORT.map(s => s.id);
    const checks = ALL_CHECKS.map(c => c.id);
    expect(new Set(sections).size).toBe(sections.length);
    expect(new Set(checks).size).toBe(checks.length);
  });

  it("asks a question, not a topic", () => {
    // "Tenure" tells a buyer nothing. "Freehold or leasehold, and how long is
    // left?" is the thing they actually need to know.
    for (const c of ALL_CHECKS) {
      expect(c.question.endsWith("?"), `${c.id}: ${c.question}`).toBe(true);
      expect(c.question.length, c.id).toBeGreaterThan(20);
    }
  });

  it("says why each one matters", () => {
    for (const c of ALL_CHECKS) {
      expect(c.why.length, c.id).toBeGreaterThan(25);
    }
  });

  it("labels and explains every answerer", () => {
    for (const c of ALL_CHECKS) {
      expect(ANSWERER_LABEL[c.answerer], c.id).toBeTruthy();
      expect(ANSWERER_MEANING[c.answerer], c.id).toBeTruthy();
    }
  });
});

describe("what the platform is allowed to claim", () => {
  /**
   * A check that says the record answers it has to name what answers it, and
   * that field has to be one the codebase actually produces. Otherwise the
   * pitch — "your record already answers eight of these" — is a claim about
   * data that does not exist.
   */
  it("names the evidence behind every check it says is already answered", () => {
    for (const c of ALL_CHECKS) {
      if (c.answerer !== "evidence") continue;
      expect(c.fields, `${c.id} claims to be evidence-backed but names no field`).toBeTruthy();
      expect(c.fields!.length, c.id).toBeGreaterThan(0);
    }
  });

  it("names only fields the platform really writes", () => {
    for (const c of ALL_CHECKS) {
      for (const field of c.fields ?? []) {
        expect(
          FIELDS[field] ?? specFor(field).label,
          `${c.id} names "${field}", which nothing produces`,
        ).toBeTruthy();
        expect(FIELDS[field], `${c.id} names "${field}", which has no field spec`).toBeTruthy();
      }
    }
  });

  it("puts no fields on a check a person has to answer", () => {
    // An analyst check with evidence attached would be counted as answered
    // and quietly stop being part of what the service adds.
    for (const c of ALL_CHECKS) {
      if (c.answerer === "evidence") continue;
      expect(c.fields, `${c.id} is "${c.answerer}" but carries fields`).toBeUndefined();
    }
  });

  it("keeps the regulated work with the regulated professional", () => {
    // The two things a desk report must never opine on. If either ever gets
    // reclassified as something PropertyVault answers, that is the platform
    // claiming to survey or to give a title opinion.
    const structure = ALL_CHECKS.find(c => c.id === "structure");
    const title = ALL_CHECKS.find(c => c.id === "title");
    expect(structure?.answerer).toBe("professional");
    expect(title?.answerer).toBe("professional");
  });

  it("never tells anyone to buy", () => {
    const advice = /\byou should (buy|offer|purchase|proceed)\b|\bworth buying\b|\ba good (buy|investment)\b/i;
    for (const c of ALL_CHECKS) {
      expect(advice.test(`${c.question} ${c.why}`), c.id).toBe(false);
    }
  });

  it("claims no regulated status", () => {
    const regulated = /\b(FCA|RICS|regulated by|redress scheme|client money protection)\b/i;
    for (const c of ALL_CHECKS) {
      expect(regulated.test(`${c.question} ${c.why}`), c.id).toBe(false);
    }
  });
});

describe("assessing a real record", () => {
  const evidence: EvidenceLike[] = [
    { field: "area_median_sold", state: "verified" },
    { field: "price_vs_area", state: "calculated" },
    { field: "gross_yield", state: "calculated" },
    { field: "net_yield", state: "calculated" },
    { field: "planning_conservation_area", state: "verified" },
  ];

  it("marks a check answered when the evidence is there", () => {
    const byId = Object.fromEntries(assess(evidence).map(r => [r.id, r]));
    expect(byId.comparables.answered).toBe(true);
    expect(byId.comparables.states).toEqual(["verified"]);
    expect(byId.yield.answered).toBe(true);
  });

  it("matches a planning constraint by its prefix", () => {
    // The field is planning_${whatever the register called it}, so the check
    // names the family and the match has to allow the suffix.
    const byId = Object.fromEntries(assess(evidence).map(r => [r.id, r]));
    expect(byId.planning.answered).toBe(true);
  });

  it("leaves a check unanswered when nothing covers it", () => {
    const byId = Object.fromEntries(assess(evidence).map(r => [r.id, r]));
    expect(byId["max-offer"].answered).toBe(false);
    expect(byId.cashflow.answered).toBe(false);
  });

  it("does not treat a recorded absence as an answer", () => {
    // "missing" means the platform looked and found nothing. That is worth
    // showing and it is not an answer to the question.
    const withMissing: EvidenceLike[] = [{ field: "maximum_offer", state: "missing" }];
    const byId = Object.fromEntries(assess(withMissing).map(r => [r.id, r]));
    expect(byId["max-offer"].answered).toBe(false);
  });

  it("never marks an analyst or professional check answered", () => {
    // Not even if a field with the same name somehow appeared.
    const everything: EvidenceLike[] = ALL_CHECKS.flatMap(c =>
      (c.fields ?? [c.id]).map(f => ({ field: f, state: "verified" as const })),
    );
    for (const r of assess(everything)) {
      if (r.answerer !== "evidence") {
        expect(r.answered, `${r.id} is "${r.answerer}" but came back answered`).toBe(false);
      }
    }
  });
});

describe("coverage", () => {
  it("counts named questions rather than producing a score", () => {
    const c = coverage([
      { field: "area_median_sold", state: "verified" },
      { field: "gross_yield", state: "calculated" },
    ]);
    expect(c.answered).toBe(2);
    expect(c.total).toBe(ALL_CHECKS.length);
    expect(c.answered).toBeLessThan(c.total);
  });

  it("splits by who answers, so the service's share is visible", () => {
    const c = coverage([]);
    expect(c.byAnswerer.evidence.total).toBeGreaterThan(0);
    expect(c.byAnswerer.analyst.total).toBeGreaterThan(0);
    expect(c.byAnswerer.professional.total).toBeGreaterThan(0);
    const sum = c.byAnswerer.evidence.total + c.byAnswerer.analyst.total + c.byAnswerer.professional.total;
    expect(sum).toBe(ALL_CHECKS.length);
  });

  it("answers nothing on an empty record", () => {
    expect(coverage([]).answered).toBe(0);
  });

  it("cannot answer more than the evidence checks, however much evidence there is", () => {
    // The ceiling is the honest part of the pitch: a free record can never
    // reach 16 of 16, because six of them need a person.
    const everything: EvidenceLike[] = Object.keys(FIELDS).map(f => ({ field: f, state: "verified" as const }));
    const c = coverage(everything);
    expect(c.answered).toBe(c.byAnswerer.evidence.total);
    expect(c.answered).toBeLessThan(c.total);
  });
});
