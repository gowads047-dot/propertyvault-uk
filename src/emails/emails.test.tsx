import { describe, it, expect } from "vitest";
import { render } from "@react-email/render";
import StarterPackEmail from "./StarterPackEmail";
import DealAnalysisEmail from "./DealAnalysisEmail";

/**
 * Smoke tests for the transactional email templates.
 *
 * These exist because @react-email/render is an *optional peer* dependency of
 * resend, not a direct one. npm does not install optional peers automatically,
 * so our package.json entry is the only thing putting it on disk. Removing it
 * as "unused" - nothing in src/ imports it directly - leaves tsc, eslint and
 * next build all passing while email sending breaks at runtime, because resend
 * resolves it dynamically when you pass `react:` to emails.send().
 *
 * Rendering the templates here turns that silent runtime failure into a test
 * failure.
 */

const fmt = (n: number) => `£${n.toLocaleString("en-GB")}`;

describe("transactional email templates", () => {
  it("renders the starter pack email to HTML", async () => {
    const html = await render(StarterPackEmail({ name: "Sam", userType: "landlord" }));
    expect(html).toContain("<html");
    expect(html).toContain("Sam");
    expect(html.length).toBeGreaterThan(500);
  });

  it("renders the starter pack email without a user type", async () => {
    const html = await render(StarterPackEmail({ name: "Sam", userType: null }));
    expect(html).toContain("<html");
  });

  it("renders the deal analysis email to HTML", async () => {
    const deal = {
      address: "12 Example Road, Nottingham",
      purchasePrice: 180000,
      monthlyRent: 950,
      grossYield: 6.33,
      netYield: 4.1,
      monthlyCF: 220,
      cashOnCash: 5.2,
      dealScore: 68,
      totalCashIn: 52000,
      netIncome: 7400,
      strategy: "Buy to let",
    };
    const html = await render(DealAnalysisEmail({ deal, fmt }));
    expect(html).toContain("<html");
    expect(html.length).toBeGreaterThan(500);
  });

  it("produces no literal undefined or NaN in rendered output", async () => {
    const html = await render(StarterPackEmail({ name: "Sam", userType: "investor" }));
    expect(html).not.toContain("undefined");
    expect(html).not.toContain("NaN");
  });
});
