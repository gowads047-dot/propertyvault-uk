import { describe, it, expect } from "vitest";
import { events } from "./analytics";

const names = Object.values(events);

describe("event names", () => {
  it("are unique", () => {
    // Two keys sharing a name silently merge two different measurements into
    // one line in the GA report, and the mistake is invisible until someone
    // tries to explain a number that is twice what it should be.
    expect(new Set(names).size).toBe(names.length);
  });

  it("are snake_case, which is what GA reports on", () => {
    for (const name of names) {
      expect(name, name).toMatch(/^[a-z][a-z0-9]*(_[a-z0-9]+)*$/);
    }
  });

  it("fit the 40-character limit GA imposes on event names", () => {
    for (const name of names) {
      expect(name.length, name).toBeLessThanOrEqual(40);
    }
  });
});

describe("the funnel", () => {
  /**
   * Renaming a shipped event does not migrate the history behind it — GA
   * starts a new series and the old one stops, so a year-on-year comparison
   * quietly becomes a comparison of nothing against something.
   *
   * These five shipped before the rest and already have data behind them.
   */
  it("keeps the five signup names that are already collecting data", () => {
    expect(events.signupShown).toBe("signup_form_shown");
    expect(events.signupDismissed).toBe("signup_form_dismissed");
    expect(events.signupSubmitted).toBe("signup_submitted");
    expect(events.signupSucceeded).toBe("signup_succeeded");
    expect(events.signupFailed).toBe("signup_failed");
  });

  it("covers each stage a visitor passes through, not only the last one", () => {
    // The gap this closes: the site could measure signups and nothing that
    // led to one. Every stage before the form needs a name or the funnel has
    // no shape.
    expect(names).toContain("tool_used");
    expect(names).toContain("vault_started");
    expect(names).toContain("vault_completed");
    expect(names).toContain("service_viewed");
    expect(names).toContain("service_enquiry_sent");
  });

  it("pairs every start with an outcome", () => {
    // A start with no matching outcome measures interest and never tells you
    // whether the thing worked, which is the half that decides what to build.
    const pairs: [string, string[]][] = [
      ["vault_started", ["vault_completed"]],
      ["ask_submitted", ["ask_answered"]],
      ["service_enquiry_started", ["service_enquiry_sent"]],
      ["signup_submitted", ["signup_succeeded", "signup_failed"]],
    ];
    for (const [start, outcomes] of pairs) {
      expect(names, start).toContain(start);
      for (const outcome of outcomes) expect(names, outcome).toContain(outcome);
    }
  });
});
