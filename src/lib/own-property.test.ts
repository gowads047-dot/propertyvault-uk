import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { LIFECYCLE, ALL_STAGES, lifecycleOf, isClosed, type AnyStage } from "./lifecycle";

/**
 * When a property may be carried into the portfolio.
 *
 * OwnItControl keeps this rule privately — the component is its only caller —
 * so it is restated here against the same lifecycle model. What matters is the
 * behaviour: the offer appears from completion onward and not before, because
 * showing it to somebody still screening invites them to add a house they do
 * not own to a portfolio of houses they do.
 */
function isOwnedYet(stage: AnyStage): boolean {
  const life = lifecycleOf(stage);
  if (!life) return false;
  return LIFECYCLE.indexOf(life) >= LIFECYCLE.indexOf("complete");
}

describe("when the portfolio offer appears", () => {
  it("stays hidden through discovery and the offer stages", () => {
    for (const stage of ["screening", "analysing", "viewing", "offer", "negotiating", "under_offer", "due_diligence"] as const) {
      expect(isOwnedYet(stage), stage).toBe(false);
    }
  });

  it("appears from completion onward", () => {
    for (const stage of ["purchased", "refurbishing", "rent_ready", "let", "managed", "optimising", "selling", "sold"] as const) {
      expect(isOwnedYet(stage), stage).toBe(true);
    }
  });

  it("never appears on a property that left the pipeline", () => {
    // Rejected and archived have no position on the line, and a rejected
    // property is precisely one that was not bought.
    for (const stage of ALL_STAGES.filter(isClosed)) {
      expect(isOwnedYet(stage), stage).toBe(false);
    }
  });

  it("covers every stage the model knows, either way", () => {
    for (const stage of ALL_STAGES) {
      expect(typeof isOwnedYet(stage), stage).toBe("boolean");
    }
  });
});

describe("the route that makes the link", () => {
  const source = readFileSync(
    join(process.cwd(), "src", "app", "api", "vault", "property", "[id]", "own", "route.ts"),
    "utf8",
  );

  it("requires an account rather than accepting a claim token", () => {
    /**
     * pv_property_link_needs_owner refuses a link on an anonymous row. Letting
     * a token through would mean Postgres rejecting it with a constraint
     * violation the caller cannot act on, instead of an answer that says what
     * to do.
     */
    expect(source).toContain("getVerifiedUser");
    expect(source).not.toContain("x-vault-token");
    expect(source).toContain("needs-account");
  });

  it("scopes every query to the caller", () => {
    // These run with the service role, which bypasses RLS, so the filter is
    // the authorisation. A query without it would read or write somebody
    // else's property.
    for (const call of source.matchAll(/pv_property\?([^`]*)`/g)) {
      expect(call[1], `an unscoped pv_property query: ${call[0]}`).toContain("${owner}");
    }
  });

  it("takes the owner filter from the shared module", () => {
    expect(source).toContain('from "@/lib/vault-owner"');
    expect(/function userFilter/.test(source), "defines its own userFilter").toBe(false);
  });

  it("is metered as a write", () => {
    // It creates a row. Metering it against the read budget would let someone
    // create rentura properties at 240 an hour.
    expect(source).toContain("vaultSavePerCaller");
  });

  it("returns the existing link rather than creating a second", () => {
    // Pressing the button twice is a person pressing a button twice.
    expect(source).toContain("created: false");
    expect(source).toContain("409");
  });

  it("does not leak upstream errors to the caller", () => {
    // Postgres messages carry connection strings and row contents.
    expect(source).toContain("console.error");
    expect(source).toContain("Could not add that to your portfolio.");
  });
});
