import { describe, it, expect } from "vitest";
import { AUTOPSIES, AUTOPSY_SUBJECTS, buildAutopsy, autopsyFaces, autopsySlideSlug } from "./autopsy";
import { scoreDeal } from "./deal-score";
import { monthlyInterestOnly, netYield, cashOnCash } from "./finance";
import { calcSDLT } from "./tax";

describe("the autopsy carousel", () => {
  it("builds one episode per subject", () => {
    expect(AUTOPSIES.length).toBe(AUTOPSY_SUBJECTS.length);
    expect(AUTOPSIES.length).toBeGreaterThan(0);
  });

  // Instagram carousels take 2-10 images.
  it("produces a slide count Instagram will accept", () => {
    for (const a of AUTOPSIES) {
      expect(a.slides.length, a.subject.id).toBeGreaterThanOrEqual(2);
      expect(a.slides.length, a.subject.id).toBeLessThanOrEqual(10);
    }
  });

  it("gives every slide the fields the renderer needs", () => {
    for (const a of AUTOPSIES) {
      for (const [i, s] of a.slides.entries()) {
        const where = `${a.subject.id} slide ${i + 1}`;
        expect(s.eyebrow, where).toBeTruthy();
        expect(s.headline.length, where).toBeGreaterThan(8);
        expect(s.value, where).toBeTruthy();
        expect(s.valueLabel, where).toBeTruthy();
        expect(s.rows.length, where).toBeGreaterThan(1);
        expect(s.rows.length, where).toBeLessThanOrEqual(6);
        expect(s.verifyPath, where).toBe("/calculators/deal-analyser/");
      }
    }
  });

  it("has unique slugs across every slide of every episode", () => {
    const slugs = [...autopsyFaces().keys()];
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const s of slugs) expect(s, s).toMatch(/^[a-z0-9-]+$/);
  });

  it("numbers slides from one", () => {
    expect(autopsySlideSlug("x", 0)).toBe("autopsy-x-1");
    expect(autopsySlideSlug("x", 5)).toBe("autopsy-x-6");
  });

  it("keeps captions inside Instagram's 2,200 character limit", () => {
    for (const a of AUTOPSIES) {
      expect(a.caption.length, a.subject.id).toBeLessThanOrEqual(2200);
    }
  });

  it("is deterministic", () => {
    const a = buildAutopsy(AUTOPSY_SUBJECTS[0]);
    const b = buildAutopsy(AUTOPSY_SUBJECTS[0]);
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });
});

describe("the numbers", () => {
  // The whole format collapses if the last slide disagrees with the site.
  it("ends on the same score the deal analyser would give", () => {
    for (const a of AUTOPSIES) {
      const last = a.slides[a.slides.length - 1];
      expect(last.value, a.subject.id).toBe(String(a.score.total));
      expect(last.valueLabel, a.subject.id).toContain(a.score.band);
    }
  });

  it("states the same cash flow in the caption and on the reveal slide", () => {
    for (const a of AUTOPSIES) {
      const reveal = a.slides[4];
      const figure = reveal.value.replace("/mo", "");
      expect(a.caption, a.subject.id).toContain(figure);
    }
  });

  it("computes the headline yield rather than asserting it", () => {
    const a = buildAutopsy({ id: "t", location: "somewhere", purchasePrice: 120_000, monthlyRent: 800, ltv: 0.75, rate: 5.5 });
    // 800 * 12 / 120,000 = 8.0%
    expect(a.slides[0].value).toBe("8.0%");
  });

  it("marks the reveal as bad news when the deal barely clears", () => {
    const a = buildAutopsy({ id: "t", location: "somewhere", purchasePrice: 180_000, monthlyRent: 950, ltv: 0.75, rate: 5.5 });
    expect(a.slides[4].tone).toBe("warn");
    expect(a.score.band).toBe("PASS");
  });

  it("does not mark a genuinely strong deal as a warning", () => {
    const a = buildAutopsy({ id: "t", location: "somewhere", purchasePrice: 150_000, monthlyRent: 1_600, ltv: 0.75, rate: 5.5 });
    expect(a.slides[4].tone).toBeUndefined();
    expect(a.score.band).toBe("STRONG");
  });

  // Recomputed independently from the subject, so this fails if the autopsy
  // ever starts deriving its own score instead of calling deal-score.ts.
  it("agrees with deal-score.ts rather than keeping its own copy", () => {
    for (const a of AUTOPSIES) {
      const { purchasePrice: p, monthlyRent: pcm, ltv, rate } = a.subject;
      const running = pcm * 0.28;
      const loan = p * ltv;
      const cf = (r: number) => pcm - running - monthlyInterestOnly(loan, r);
      const expected = scoreDeal({
        netYield: netYield(pcm * 12, (running + monthlyInterestOnly(loan, rate)) * 12, p),
        monthlyCashflow: cf(rate),
        cashOnCash: cashOnCash(cf(rate) * 12, p * (1 - ltv) + calcSDLT(p, true) + 2_100),
        cashflowAtPlus2: cf(rate + 2),
        purchasePrice: p,
      });
      expect(a.score.total, a.subject.id).toBe(expected.total);
      expect(a.score.band, a.subject.id).toBe(expected.band);
    }
  });
});

describe("what the captions may not claim", () => {
  it("makes no guarantee, testimonial, market average or prediction", () => {
    const banned = [
      /\bguarantee[ds]?\b/i,
      /\btestimonial/i,
      /\bclients? (?:have|has)\b/i,
      /\baverage (?:yield|return|rent)\b/i,
      /\bwill (?:rise|fall|grow|increase)\b/i,
    ];
    for (const a of AUTOPSIES) {
      for (const re of banned) {
        expect(re.test(a.caption), `${a.subject.id} :: ${re}`).toBe(false);
      }
    }
  });

  // These are worked examples, not listings, and the caption has to say which
  // figures are assumptions rather than presenting all of them as fact.
  it("names the cost assumption in every caption", () => {
    for (const a of AUTOPSIES) {
      expect(a.caption, a.subject.id).toContain("assumed");
    }
  });

  it("says out loud that location and demand are not scored", () => {
    for (const a of AUTOPSIES) {
      expect(a.caption.toLowerCase(), a.subject.id).toContain("location or demand");
    }
  });
});

describe("small words", () => {
  // "a 8.0% yield" reads as carelessness on the very first slide.
  it("says an before eight, eleven and eighteen", () => {
    const eight = buildAutopsy({ id: "t", location: "x", purchasePrice: 120_000, monthlyRent: 800, ltv: 0.75, rate: 5.5 });
    expect(eight.slides[0].headline).toContain("an 8.0% yield");
    expect(eight.caption).toContain("an 8.0% yield");

    const six = buildAutopsy({ id: "t", location: "x", purchasePrice: 180_000, monthlyRent: 950, ltv: 0.75, rate: 5.5 });
    expect(six.slides[0].headline).toContain("a 6.3% yield");
  });
});
