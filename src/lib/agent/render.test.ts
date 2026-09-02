import { describe, it, expect } from "vitest";
import {
  stepLabel, unlabelledTools, gbp, pct, isRenderKind, RENDER_KINDS, trimForRequest, soldDate,
  parseProse, parseSpans, type Span,
} from "./render";
import {
  analyseDeal, stampDuty, stressTest, section24, capitalGains, maximumOffer, lookupArea,
} from "./tools";

describe("naming what the agent is doing", () => {
  // A tool with no label reaches the user as its own function name, which is
  // the product talking to itself in front of a customer.
  it("labels every tool the model is offered", () => {
    expect(unlabelledTools()).toEqual([]);
  });

  it("describes the step in the user's words, not the tool's", () => {
    expect(stepLabel("lookup_area")).toBe("Checking sold prices");
    expect(stepLabel("analyse_deal")).not.toContain("_");
  });

  it("still says something readable for a tool it has never seen", () => {
    expect(stepLabel("some_future_tool")).toBe("some future tool");
  });
});

describe("every result can actually be drawn", () => {
  it("only asks for components the page knows how to render", async () => {
    const results = [
      analyseDeal({ purchasePrice: 180_000, monthlyRent: 950 }),
      stampDuty({ purchasePrice: 180_000 }),
      stressTest({ purchasePrice: 180_000, monthlyRent: 950 }),
      section24({ mortgageInterest: 6_000, rentalProfitBeforeInterest: 9_000, otherIncome: 45_000 }),
      capitalGains({ gain: 40_000, otherIncome: 45_000 }),
      maximumOffer({ askingPrice: 180_000, monthlyRent: 950, minMonthlyCashflow: 200 }),
      await lookupArea({ postcode: "NG7 1AA" }, async () => null),
    ];
    for (const r of results) {
      expect(isRenderKind(r.render), String(r.render)).toBe(true);
    }
  });

  it("rejects anything that is not a known component", () => {
    expect(isRenderKind("chart")).toBe(false);
    expect(isRenderKind(undefined)).toBe(false);
    expect(RENDER_KINDS).toContain("constraints");
  });
});

describe("money and percentages", () => {
  it("puts the minus outside the symbol", () => {
    expect(gbp(-160)).toBe("-£160");
    expect(gbp(1_250)).toBe("£1,250");
  });

  it("rounds to the nearest pound rather than showing pence", () => {
    expect(gbp(1_249.6)).toBe("£1,250");
  });

  it("formats a percentage to one place", () => {
    expect(pct(6.25)).toBe("6.3%");
  });
});

describe("showing a sold date", () => {
  it("writes it the way a UK reader does", () => {
    expect(soldDate("2026-02-13")).toBe("13 Feb 2026");
    expect(soldDate("2025-09-01")).toBe("1 Sep 2025");
  });

  // Absence shows as absence. A date the register did not give must never be
  // rendered as a plausible one.
  it("shows a dash when there is no date", () => {
    expect(soldDate(null)).toBe("—");
    expect(soldDate(undefined)).toBe("—");
    expect(soldDate("Fri, 13 Fe")).toBe("—");
    expect(soldDate("2026-13-01")).toBe("—");
  });
});

describe("rendering the model's reply", () => {
  const flat = (spans: { text: string }[]) => spans.map(s => s.text).join("");

  it("reads a heading, a paragraph and a list", () => {
    const b = parseProse("## The verdict\n\nIt is thin.\n\n- Yield is low\n- Rates bite at +2%");
    expect(b.map(x => x.kind)).toEqual(["heading", "paragraph", "list"]);
    expect(flat((b[0] as { spans: Span[] }).spans)).toBe("The verdict");
    expect((b[2] as { items: Span[][] }).items).toHaveLength(2);
  });

  it("marks bold runs without losing the text around them", () => {
    const spans = parseSpans("Cash flow is **£120 a month** today.");
    expect(spans.filter(s => s.bold).map(s => s.text)).toEqual(["£120 a month"]);
    expect(flat(spans)).toBe("Cash flow is £120 a month today.");
  });

  // Text the parser does not understand must survive as text. Silently eating
  // a character is how a figure loses a minus sign.
  it("keeps an unclosed marker as literal characters", () => {
    expect(flat(parseSpans("**not closed"))).toBe("**not closed");
    expect(flat(parseSpans("2 * 3 * 4"))).toBe("2 * 3 * 4");
  });

  it("never loses the words of a reply", () => {
    const reply = "## Heading\n\nA line with **bold**.\n\n- one\n- two **and bold**\n\nLast word.";
    const words = parseProse(reply)
      .flatMap(b => (b.kind === "list" ? b.items.flat() : b.spans))
      .map(s => s.text)
      .join(" ");
    for (const w of ["Heading", "bold", "one", "two", "Last"]) {
      expect(words, w).toContain(w);
    }
  });

  it("joins wrapped lines into one paragraph and separates blank-line breaks", () => {
    const b = parseProse("one\ntwo\n\nthree");
    expect(b).toHaveLength(2);
    expect(flat((b[0] as { spans: Span[] }).spans)).toBe("one two");
  });

  it("produces no block that could carry markup", () => {
    const b = parseProse("<script>alert(1)</script>\n\n[a](https://evil.example)");
    expect(b.every(x => x.kind === "paragraph")).toBe(true);
    // The angle brackets stay text; React escapes them on render.
    expect(flat((b[0] as { spans: Span[] }).spans)).toContain("<script>");
  });
});

describe("keeping a long conversation sendable", () => {
  const turn = (role: "user" | "assistant", i: number) => ({ role, text: String(i) });

  it("leaves a short conversation alone", () => {
    const m = [turn("user", 1), turn("assistant", 2)];
    expect(trimForRequest(m, 20)).toEqual(m);
  });

  // Dropping the oldest turns beats losing the question just typed.
  it("keeps the most recent turns when it is too long", () => {
    const m = Array.from({ length: 30 }, (_, i) => turn(i % 2 ? "assistant" : "user", i));
    const kept = trimForRequest(m, 6);
    expect(kept.length).toBeLessThanOrEqual(6);
    expect(kept.at(-1)).toEqual(m.at(-1));
  });

  it("always starts the trimmed conversation with a user turn", () => {
    const m = Array.from({ length: 30 }, (_, i) => turn(i % 2 ? "assistant" : "user", i));
    for (const max of [3, 4, 5, 6, 7]) {
      expect(trimForRequest(m, max)[0].role, `max ${max}`).toBe("user");
    }
  });
});
