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

  it("has no pattern with the global flag, which would make test() stateful", () => {
    for (const re of BANNED_CLAIMS) expect(re.flags, re.source).not.toContain("g");
  });
});
