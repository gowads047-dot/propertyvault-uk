import { describe, it, expect } from "vitest";
import { safeNext } from "./safe-next";

const D = "/rentura/dashboard";

describe("safeNext", () => {
  it("keeps a path on this site, with its query and hash", () => {
    expect(safeNext("/rentura/subscribe", D)).toBe("/rentura/subscribe");
    expect(safeNext("/rentura/properties/abc?tab=maintenance#issues", D)).toBe("/rentura/properties/abc?tab=maintenance#issues");
    expect(safeNext("/", D)).toBe("/");
  });

  it("refuses anything that leaves the site", () => {
    for (const bad of [
      "https://evil.example/",
      "http://evil.example",
      "//evil.example/rentura",
      "/\\evil.example",
      "javascript:alert(1)",
      "/javascript:alert(1)",
      "/\nevil",
      "evil.example",
      "",
    ]) {
      expect(safeNext(bad, D), bad).toBe(D);
    }
    expect(safeNext(null, D)).toBe(D);
    expect(safeNext(undefined, D)).toBe(D);
  });

  it("allows a colon once it is clearly inside a path, not a scheme", () => {
    expect(safeNext("/rentura/search?q=10:30", D)).toBe("/rentura/search?q=10:30");
    expect(safeNext("/blog/what-is-a-9:1-split", D)).toBe("/blog/what-is-a-9:1-split");
  });
});
