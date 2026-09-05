import { describe, it, expect } from "vitest";
import { COMPLIANCE_ITEMS, JURISDICTION_NOTE, itemsByObligation, OBLIGATION_LABEL } from "./compliance-items";

describe("the checklist", () => {
  it("has unique ids", () => {
    const ids = COMPLIANCE_ITEMS.map(i => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("names the instrument behind every duty", () => {
    // A compliance claim a reader cannot check is a compliance claim they have
    // to take on trust, which is exactly what this site is meant not to ask for.
    for (const i of COMPLIANCE_ITEMS) {
      expect(i.source.trim().length, i.id).toBeGreaterThan(10);
    }
  });

  it("labels every obligation type", () => {
    for (const i of COMPLIANCE_ITEMS) {
      expect(OBLIGATION_LABEL[i.obligation], i.id).toBeTruthy();
    }
  });

  it("splits cleanly by obligation, with no item lost", () => {
    const total = (["legal", "conditional", "recommended"] as const)
      .reduce((n, o) => n + itemsByObligation(o).length, 0);
    expect(total).toBe(COMPLIANCE_ITEMS.length);
  });
});

describe("what the site is allowed to say about the law", () => {
  /**
   * The bug this exists to prevent: /landlord-hub listed nine items in one
   * flat list, so a legionella assessment (a proportionate general duty) and
   * an EICR (a hard five-yearly requirement) looked identical, and an HMO
   * licence appeared to apply to every property.
   */
  it("states the trigger for every conditional item", () => {
    for (const i of COMPLIANCE_ITEMS) {
      if (i.obligation === "conditional") {
        expect(i.appliesWhen, `${i.id} is conditional but says nothing about when it applies`)
          .toBeTruthy();
        expect(i.appliesWhen!.trim().length, i.id).toBeGreaterThan(8);
      }
    }
  });

  it("does not put a condition on an item it calls universal", () => {
    for (const i of COMPLIANCE_ITEMS) {
      if (i.obligation !== "conditional") {
        expect(i.appliesWhen, `${i.id} is "${i.obligation}" but carries a condition`).toBeUndefined();
      }
    }
  });

  it("never calls a conditional or recommended item mandatory", () => {
    const mandatory = /\b(all landlords must|every landlord must|legally required for all|mandatory for every)\b/i;
    for (const i of COMPLIANCE_ITEMS) {
      if (i.obligation === "legal") continue;
      expect(mandatory.test(i.detail), `${i.id}: ${i.detail}`).toBe(false);
    }
  });

  it("says out loud that this is England only", () => {
    // Silence is the failure mode. A Scottish landlord reading an unlabelled
    // England list will reasonably assume it applies to them.
    expect(JURISDICTION_NOTE).toMatch(/England/);
    for (const j of ["Wales", "Scotland", "Northern Ireland"]) {
      expect(JURISDICTION_NOTE, j).toContain(j);
    }
  });

  it("does not use Section 21 or AST as though they still apply to new tenancies", () => {
    // The Renters' Rights Act removed both for new tenancies. Copy written
    // before it, repeated after it, is the single most common stale claim on
    // this site — 24 pages still mention Section 21.
    const stale = /\b(section 21|assured shorthold tenanc)/i;
    for (const i of COMPLIANCE_ITEMS) {
      expect(stale.test(`${i.item} ${i.detail}`), i.id).toBe(false);
    }
  });
});
