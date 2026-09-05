import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { placeFrom } from "./AreaFunnel";

/**
 * The place name is user-visible text derived from a URL, which is exactly
 * where a slug like "stoke-on-trent" or "ng7" quietly comes out wrong.
 */

describe("the place named in the copy", () => {
  it("title-cases a city slug", () => {
    expect(placeFrom("/areas/birmingham")).toBe("Birmingham");
    expect(placeFrom("/areas/birmingham/")).toBe("Birmingham");
  });

  it("keeps the hyphens in a multi-part city", () => {
    // "Stoke-On-Trent" would be wrong, and so would "Stoke on trent".
    expect(placeFrom("/areas/stoke-on-trent")).toBe("Stoke-on-Trent");
  });

  it("uppercases a postcode district rather than title-casing it", () => {
    // "Ng7" reads as a typo. A district code is an initialism.
    expect(placeFrom("/areas/postcodes/ng7")).toBe("NG7");
  });

  it("names nothing on the index and the postcode hub", () => {
    // There is no single place to name, and inventing one would be worse than
    // the generic line.
    expect(placeFrom("/areas")).toBeNull();
    expect(placeFrom("/areas/")).toBeNull();
    expect(placeFrom("/areas/postcodes")).toBeNull();
    expect(placeFrom("/areas/postcodes/")).toBeNull();
  });

  it("produces a sane name for every area guide that actually exists", () => {
    // Enumerated from the filesystem rather than a hardcoded list, so a
    // twenty-second city with an awkward slug — a digit, an apostrophe,
    // anything the title-caser has never met — fails here rather than
    // rendering as visible nonsense on a live page.
    const areasDir = join(process.cwd(), "src", "app", "areas");
    const slugs = readdirSync(areasDir, { withFileTypes: true })
      .filter(e => e.isDirectory() && !e.name.startsWith("[") && e.name !== "postcodes")
      .map(e => e.name);

    expect(slugs.length).toBeGreaterThan(15);

    for (const slug of slugs) {
      const name = placeFrom(`/areas/${slug}`);
      expect(name, slug).toBeTruthy();
      // Starts with a capital, and carries no leftover slug punctuation.
      expect(name!.charAt(0), slug).toBe(name!.charAt(0).toUpperCase());
      expect(name, slug).not.toMatch(/[_/]/);
      expect(name, slug).not.toMatch(/(^-|-$|--)/);
    }
  });

});

describe("the layout stays static", () => {
  it("reads the path on the client, not from the request", () => {
    // headers() or cookies() in this tree would opt twenty-one statically
    // generated guides into dynamic rendering — they carry search traffic,
    // and an analytics label is not worth that.
    const source = readFileSync(
      join(process.cwd(), "src", "components", "property", "AreaFunnel.tsx"),
      "utf8",
    );
    expect(source).toContain("usePathname");
    expect(source).not.toMatch(/\bheaders\(|\bcookies\(/);
  });
});
