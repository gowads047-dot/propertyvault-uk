import { describe, it, expect } from "vitest";
import { BANNED_CLAIMS, findBannedClaims } from "./claims";

describe("the banned-claim list", () => {
  it("catches each kind of claim the standing rule names", () => {
    expect(findBannedClaims("Guaranteed returns of 8%")).not.toEqual([]);
    expect(findBannedClaims("This guarantees a profit")).not.toEqual([]);
    expect(findBannedClaims("Read our testimonials")).not.toEqual([]);
    expect(findBannedClaims("Our clients have doubled their money")).not.toEqual([]);
    expect(findBannedClaims("The average yield in Leeds is 7%")).not.toEqual([]);
    expect(findBannedClaims("Prices will rise next year")).not.toEqual([]);
    expect(findBannedClaims("A risk-free investment")).not.toEqual([]);
    expect(findBannedClaims("The best area to invest")).not.toEqual([]);
  });

  // The product is called guaranteed rent. Describing it is not a promise.
  it("lets the product be named", () => {
    expect(findBannedClaims("Guaranteed rent trades some headline rent for not carrying voids.")).toEqual([]);
  });

  it("passes a worked example that states its assumption", () => {
    expect(findBannedClaims(
      "6.7% gross. 2.1% net. Running costs assumed at 28% of rent. Your own figure will differ.",
    )).toEqual([]);
  });

  it("reports which pattern matched, so a hold can be read", () => {
    const hits = findBannedClaims("risk-free");
    expect(hits).toHaveLength(1);
    expect(hits[0]).toContain("risk");
  });

  /**
   * The account and the website must not disagree about what is sayable.
   *
   * Every string below was live on propertyvaultuk.co.uk earlier and was
   * removed for being unsupported — a vetting claim with no verification
   * standard, an average nobody sourced, a landlord quote with no landlord,
   * a figure attributed to RICS. vetting-claims.test.ts forbids that language
   * on every page.
   *
   * All nine passed this filter when it was checked. There is no reading on
   * which the same sentence is unacceptable on /trades and fine in a caption
   * read by more people.
   */
  it("refuses the claims the website itself had to stop making", () => {
    const removedFromTheSite = [
      "Vetted tradespeople with verified reviews",
      "Our vetted panel of professionals",
      "PropertyVault verified social housing partners",
      "The average void period is 3-5 weeks per year",
      "Voids: industry average 2.7 weeks a year",
      "Not a single void month in two years",
      "Trusted by UK property investors",
      "Most landlords net more overall than self-managing",
      "RICS estimate avg £600 a year for a 2-bed",
    ];
    for (const claim of removedFromTheSite) {
      expect(findBannedClaims(claim), `a caption could still say: ${claim}`).not.toEqual([]);
    }
  });

  /**
   * The wider patterns must not swallow the copy this account actually
   * publishes. A held post costs somebody thirty seconds, which is the right
   * trade against a false claim going out — but only while the ordinary
   * caption still passes.
   */
  it("still allows the things these videos are for", () => {
    const fine = [
      "Guaranteed rent trades some headline rent for not carrying voids.",
      "Three weeks empty a year is £692 of lost rent on a £1,000 property. That is an assumption, not a survey.",
      "Gas Safe is the register. Check the card, front and back.",
      "Rentura is £9.99 a month with a 30-day trial. Card required up front.",
      "Section 24 changed what you can deduct. Here is the arithmetic.",
    ];
    for (const caption of fine) {
      expect(findBannedClaims(caption), `wrongly held: ${caption}`).toEqual([]);
    }
  });

  it("has no pattern with the global flag, which would make test() stateful", () => {
    for (const re of BANNED_CLAIMS) expect(re.flags, re.source).not.toContain("g");
  });
});
