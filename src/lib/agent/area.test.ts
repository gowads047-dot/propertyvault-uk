import { describe, it, expect } from "vitest";
import { normaliseSoldDate } from "./area";

/**
 * The bug this file exists for: HM Land Registry's linked-data API returns
 * "Fri, 13 Feb 2026", and taking the first ten characters of that produced
 * "Fri, 13 Fe" — a mangled date sitting next to a real sold price.
 */
describe("reading a sold date from the register", () => {
  it("reads the shape HM Land Registry actually returns", () => {
    expect(normaliseSoldDate("Fri, 13 Feb 2026")).toBe("2026-02-13");
    expect(normaliseSoldDate("Wed, 19 Mar 2025")).toBe("2025-03-19");
    expect(normaliseSoldDate("Fri, 3 Nov 2023")).toBe("2023-11-03");
  });

  it("leaves an ISO date alone", () => {
    expect(normaliseSoldDate("2024-07-01")).toBe("2024-07-01");
    expect(normaliseSoldDate("2024-07-01T00:00:00Z")).toBe("2024-07-01");
  });

  it("handles every month name", () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    months.forEach((m, i) => {
      expect(normaliseSoldDate(`Mon, 05 ${m} 2024`), m)
        .toBe(`2024-${String(i + 1).padStart(2, "0")}-05`);
    });
  });

  it("accepts the full month name too", () => {
    expect(normaliseSoldDate("Friday, 13 February 2026")).toBe("2026-02-13");
  });

  // Returning something wrong is worse than returning nothing: the caller
  // shows an em dash, and nobody is misled about when a property sold.
  it("returns null rather than a guess when it cannot read the date", () => {
    for (const bad of ["", "soon", "13/02/2026 maybe", "Fri, 13 Foo 2026", "Fri, 99 Feb 2026"]) {
      expect(normaliseSoldDate(bad), bad).toBeNull();
    }
  });

  it("never truncates a day or month the way the old slice did", () => {
    const out = normaliseSoldDate("Fri, 13 Feb 2026")!;
    expect(out).not.toContain("Fe");
    expect(out).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
