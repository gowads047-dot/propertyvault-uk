import { describe, it, expect } from "vitest";
import { formatPrice } from "./makan-config";

describe("formatPrice", () => {
  it("formats GBP with a symbol and thousands separators", () => {
    expect(formatPrice(8000, "gb")).toBe("£8,000");
    expect(formatPrice(1250000, "gb")).toBe("£1,250,000");
  });

  it("formats non-GBP with the currency code after the amount", () => {
    // Only gb, ma and eg are active; the GCC entries are commented out in
    // makan-config as "not active in this phase".
    expect(formatPrice(8000, "ma")).toBe("8,000 MAD");
    expect(formatPrice(8000, "eg")).toBe("8,000 EGP");
  });

  it("treats an inactive market code as unknown rather than guessing", () => {
    // UAE is commented out of the countries array, so it must not resolve.
    expect(formatPrice(8000, "ae")).toBe("8,000");
  });

  // This is the "8000 undefined/mo" bug: a missing price used to either throw
  // or render the literal string "undefined" next to the number.
  it("never renders the string 'undefined'", () => {
    for (const bad of [null, undefined, NaN, Number.POSITIVE_INFINITY]) {
      for (const country of ["gb", "ma", "eg", "zz"]) {
        const out = formatPrice(bad as number, country);
        expect(out).not.toContain("undefined");
        expect(out).not.toContain("NaN");
        expect(out).toBe("—");
      }
    }
  });

  it("does not throw on a missing price", () => {
    expect(() => formatPrice(undefined, "gb")).not.toThrow();
    expect(() => formatPrice(null, "ma")).not.toThrow();
  });

  it("shows a bare number for an unknown country rather than inventing a currency", () => {
    expect(formatPrice(8000, "zz")).toBe("8,000");
  });

  it("handles zero as a real price, not a missing one", () => {
    expect(formatPrice(0, "gb")).toBe("£0");
  });
});
