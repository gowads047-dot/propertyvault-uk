// Boundary-value tests for src/lib/tax.ts
// Run with: npm test

import { describe, it, expect } from "vitest";
import {
  personalAllowance,
  calcIncomeTax,
  calcCorpTax,
  calcDividendTax,
  calcSection24Credit,
  calcCGTResidential,
  calcSDLT,
  sdltBreakdown,
} from "./tax";

describe("personalAllowance", () => {
  it("returns full PA below taper", () => expect(personalAllowance(80_000)).toBe(12_570));
  it("returns full PA at taper start", () => expect(personalAllowance(100_000)).toBe(12_570));
  it("tapers at £110k (loses £5k)", () => expect(personalAllowance(110_000)).toBe(7_570));
  it("returns 0 at taper end £125,140", () => expect(personalAllowance(125_140)).toBe(0));
  it("returns 0 above taper", () => expect(personalAllowance(150_000)).toBe(0));
});

describe("calcIncomeTax", () => {
  it("no tax below PA", () => expect(calcIncomeTax(12_570)).toBe(0));
  it("20% on first pound above PA", () => expect(calcIncomeTax(12_571)).toBe(0)); // rounds to 0
  it("basic rate only at £30k", () => expect(calcIncomeTax(30_000)).toBe(3_486)); // (30000-12570)*20%
  it("higher rate kicks in above £50,270", () => {
    const tax = calcIncomeTax(60_000);
    // 37,700 × 20% + 9,730 × 40%
    expect(tax).toBe(11_432);
  });
  it("taper zone creates 60% effective marginal at £110k", () => {
    const t100 = calcIncomeTax(100_000);
    const t101 = calcIncomeTax(101_000);
    // each £1k in taper costs ~£600 (40% rate on £1k, plus 40% on £500 lost PA)
    expect(t101 - t100).toBeGreaterThan(550);
    expect(t101 - t100).toBeLessThanOrEqual(620);
  });
  it("additional rate above £125,140", () => {
    // PA = 0, so taxable = gross. Bands run on TAXABLE income:
    // 37,700 @ 20% + (125,140 - 37,700) @ 40% + (130,000 - 125,140) @ 45%
    const basic = 37_700 * 0.20;
    const higher = (125_140 - 37_700) * 0.40;
    const additional = (130_000 - 125_140) * 0.45;
    expect(calcIncomeTax(130_000)).toBe(Math.round(basic + higher + additional));
  });
  // Regression: the basic band must stay 37,700 wide once the PA has tapered away.
  // Deriving it as (50,270 - PA) widened it to 50,270 and understated tax by £2,514.
  it("matches published figures once the PA is fully tapered", () => {
    expect(calcIncomeTax(125_140)).toBe(42_516);
    expect(calcIncomeTax(130_000)).toBe(44_703);
    expect(calcIncomeTax(150_000)).toBe(53_703);
    expect(calcIncomeTax(200_000)).toBe(76_203);
  });
  it("returns 0 for zero income", () => expect(calcIncomeTax(0)).toBe(0));
  it("returns 0 for negative income", () => expect(calcIncomeTax(-1000)).toBe(0));
});

describe("calcCorpTax", () => {
  it("19% at small profits limit", () => expect(calcCorpTax(50_000)).toBe(9_500));
  it("19% below small profits limit", () => expect(calcCorpTax(30_000)).toBe(5_700));
  it("25% at large profits limit", () => expect(calcCorpTax(250_000)).toBe(62_500));
  it("25% above large profits limit", () => expect(calcCorpTax(300_000)).toBe(75_000));
  it("marginal relief between limits (effective < 25%)", () => {
    const tax = calcCorpTax(100_000);
    expect(tax).toBe(22_750); // 0.25×100k - (3/200)×150k
    expect(tax / 100_000).toBeLessThan(0.25);
    expect(tax / 100_000).toBeGreaterThan(0.19);
  });
  it("limits halve with 1 associated company", () => {
    // small limit = 25k, large limit = 125k
    expect(calcCorpTax(25_000, 1)).toBe(4_750);  // 19%
    expect(calcCorpTax(125_000, 1)).toBe(31_250); // 25%
    // marginal at £75k
    const tax = calcCorpTax(75_000, 1);
    expect(tax).toBe(Math.round(0.25 * 75_000 - (3 / 200) * (125_000 - 75_000)));
  });
  it("returns 0 for zero profit", () => expect(calcCorpTax(0)).toBe(0));
  it("returns 0 for negative profit", () => expect(calcCorpTax(-1000)).toBe(0));
});

describe("calcDividendTax", () => {
  it("no tax within allowance", () => expect(calcDividendTax(500, 30_000)).toBe(0));
  it("basic rate on dividends in basic band", () => {
    // otherIncome=30k → taxable other = 17,430 → 20,270 basic band remaining
    // dividends=5,000 → all in basic → (5000-500)×8.75%
    expect(calcDividendTax(5_000, 30_000)).toBe(Math.round(4_500 * 0.0875));
  });
  it("higher rate when other income fills basic band", () => {
    // otherIncome=50,000 → taxable=37,430 → 270 basic remaining
    // dividends=10,000: 270 in basic (all covered by allowance), 9,730 in higher (500-270=230 allowance left)
    const tax = calcDividendTax(10_000, 50_000);
    const taxableHigher = 9_730 - 230;
    expect(tax).toBe(Math.round(taxableHigher * 0.3375));
  });
  it("returns 0 for zero dividends", () => expect(calcDividendTax(0, 40_000)).toBe(0));
  // Regression: additional-rate dividends start above £125,140 of taxable income,
  // not £112,570 — the higher band is 87,440 wide, not 74,870.
  it("additional rate starts above £125,140 taxable", () => {
    const basic = (37_700 - 500) * 0.0875;
    const higher = (125_140 - 37_700) * 0.3375;
    const additional = (130_000 - 125_140) * 0.3935;
    expect(calcDividendTax(130_000, 0)).toBe(Math.round(basic + higher + additional));
  });
});

describe("calcSection24Credit", () => {
  it("credit = 20% of interest when profit and income are larger", () => {
    // interest=6000, profit=10000, income=45000, PA=12570
    // min(6000,10000,32430) = 6000 → credit = 1200
    expect(calcSection24Credit(6_000, 10_000, 45_000, 12_570)).toBe(1_200);
  });
  it("capped by property profit when profit is smallest", () => {
    // interest=10000, profit=3000, income=45000, PA=12570
    // min(10000,3000,32430) = 3000 → credit = 600
    expect(calcSection24Credit(10_000, 3_000, 45_000, 12_570)).toBe(600);
  });
  it("capped by income-PA when income barely exceeds PA", () => {
    // interest=10000, profit=8000, income=13000, PA=12570
    // min(10000,8000,430) = 430 → credit = 86
    expect(calcSection24Credit(10_000, 8_000, 13_000, 12_570)).toBe(86);
  });
  it("returns 0 for zero finance costs", () => {
    expect(calcSection24Credit(0, 10_000, 45_000, 12_570)).toBe(0);
  });
});

describe("calcCGTResidential", () => {
  it("no CGT within annual exempt amount", () => expect(calcCGTResidential(3_000, 30_000)).toBe(0));
  it("basic rate on gain in basic band", () => {
    // gain=10000, AEA=3000, taxable=7000; otherIncome=30000, taxableOther=17430, remaining basic=20270
    // all 7000 in basic → 7000×18%
    expect(calcCGTResidential(10_000, 30_000)).toBe(1_260);
  });
  it("higher rate when basic band exhausted", () => {
    // gain=20000, AEA=3000, taxable=17000; otherIncome=45000, taxableOther=32430, remaining basic=5270
    // 5270 @ 18%, 11730 @ 24%
    expect(calcCGTResidential(20_000, 45_000)).toBe(
      Math.round(5_270 * 0.18 + 11_730 * 0.24),
    );
  });
  it("returns 0 for gain at AEA threshold", () => expect(calcCGTResidential(3_000, 0)).toBe(0));
});

describe("calcSDLT", () => {
  it("no SDLT at £40k threshold", () => expect(calcSDLT(40_000)).toBe(0));
  // The £40k floor gates the SURCHARGES, not SDLT itself. Higher rates apply at
  // £40,000 or more (FA 2003 Sch 4ZA para 3) — so £39,999 is nil but £40,000 is not.
  describe("£40k surcharge floor", () => {
    it("additional dwelling below £40k pays nothing", () => {
      expect(calcSDLT(25_000, true)).toBe(0);
      expect(calcSDLT(39_999, true)).toBe(0);
    });
    it("additional dwelling AT £40k pays the 5% surcharge", () => {
      expect(calcSDLT(40_000, true)).toBe(2_000);
    });
    it("additional dwelling just above £40k pays it too", () => {
      expect(calcSDLT(50_000, true)).toBe(2_500);
    });
    it("standard purchase below £40k is nil either way", () => {
      expect(calcSDLT(39_999)).toBe(0);
      expect(calcSDLT(25_000)).toBe(0);
    });
    it("non-resident surcharge is also gated by the floor", () => {
      expect(calcSDLT(39_999, false, false, true)).toBe(0);
      expect(calcSDLT(40_000, false, false, true)).toBe(800); // 2% of 40k
    });
  });
  it("standard rate on £200k", () => {
    // 125k@0% + 75k@2% = £1,500
    expect(calcSDLT(200_000)).toBe(1_500);
  });
  it("standard rate on £500k", () => {
    // 125k@0% + 125k@2% + 250k@5% = 0 + 2500 + 12500 = 15000
    expect(calcSDLT(500_000)).toBe(15_000);
  });
  it("additional property on £300k", () => {
    // 125k@5% + 125k@7% + 50k@10% = 6250+8750+5000 = 20000
    expect(calcSDLT(300_000, true)).toBe(20_000);
  });
  it("FTB relief — £250k (no tax)", () => expect(calcSDLT(250_000, false, true)).toBe(0));
  it("FTB relief — £400k (5% on £100k above £300k)", () => {
    expect(calcSDLT(400_000, false, true)).toBe(5_000);
  });
  it("FTB relief lost above £500k — standard rates apply", () => {
    // price = £525k, standard: 125k@0+125k@2%+250k@5%+25k@5% ... wait
    // standard: 125k@0%, 125k@2%, 250k@5%, then 25k@5% = 125k@5%
    // actually: 125k@0=0, 125k@2%=2500, 250k@5%=12500, 25k@5%=1250 = 16250
    // Hmm, let me recalc: at £525k, additional=false, ftb=true, but price>500k so standard applies
    // bands: 0@0%, 125k@2%, 250k@5%, 925k@10%
    // 125k*0 + 125k*2% + (525k-250k)*5% = 0 + 2500 + 275k*5% = 0+2500+13750 = 16250
    expect(calcSDLT(525_000, false, true)).toBe(16_250);
  });
  it("non-resident surcharge adds 2%", () => {
    const base = calcSDLT(200_000);
    const nr = calcSDLT(200_000, false, false, true);
    expect(nr - base).toBe(4_000); // 2% of 200k
  });
  it("combined additional + non-resident", () => {
    const add = calcSDLT(200_000, true);
    const addNr = calcSDLT(200_000, true, false, true);
    expect(addNr - add).toBe(4_000); // +2% of 200k
  });
});

describe("sdltBreakdown", () => {
  it("bands sum to the calcSDLT total", () => {
    for (const [price, add, ftb, nr] of [
      [200_000, false, false, false],
      [500_000, false, false, false],
      [300_000, true, false, false],
      [400_000, false, true, false],
      [200_000, false, false, true],
      [750_000, true, false, true],
      [2_000_000, false, false, false],
    ] as [number, boolean, boolean, boolean][]) {
      const { bands, total } = sdltBreakdown(price, add, ftb, nr);
      const summed = Math.round(bands.reduce((s, b) => s + b.tax, 0));
      expect(summed).toBe(total);
      expect(total).toBe(calcSDLT(price, add, ftb, nr));
    }
  });
  it("bands are contiguous and stop at the price", () => {
    const { bands } = sdltBreakdown(400_000);
    expect(bands[0].from).toBe(0);
    for (let i = 1; i < bands.length; i++) expect(bands[i].from).toBe(bands[i - 1].to);
    expect(bands[bands.length - 1].to).toBe(400_000);
  });
  it("returns nothing for a zero price", () => {
    expect(sdltBreakdown(0)).toEqual({ bands: [], total: 0 });
  });
});
