import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

const client = new Anthropic();

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "AI verdicts are not configured on this server." },
      { status: 500 },
    );
  }

  try {
    const body = await request.json();
    const {
      purchasePrice,
      monthlyRent,
      grossYield,
      netYield,
      monthlyCF,
      cashOnCash,
      dealScore,
      stressRatePlus2,
      cityBenchmark,
      benchmarkGross,
      benchmarkNet,
      bedrooms,
      propertyType,
      postcode,
      address,
      crimeLevel,
      avgSoldPrice,
      rentalDemand,
      strategy,
      taxBand,
    } = body;

    const propertyDesc = [
      bedrooms && `${bedrooms} bed`,
      propertyType,
      postcode && `in ${postcode}`,
    ]
      .filter(Boolean)
      .join(" ");

    const prompt = `You are a UK property investment analyst. Give a concise, deal-specific verdict.

Property: ${propertyDesc || "UK residential property"}${address ? ` (${address})` : ""}
Asking price: £${Number(purchasePrice).toLocaleString()}
Monthly rent: £${monthlyRent}/mo
Strategy: ${strategy || "BTL"}
Investor tax band: ${taxBand || "higher rate"}

Financial metrics:
- Gross yield: ${Number(grossYield).toFixed(1)}%
- Net yield: ${Number(netYield).toFixed(1)}%
- Monthly cash flow: £${Number(monthlyCF).toFixed(0)}/mo
- Cash-on-cash return: ${Number(cashOnCash).toFixed(1)}%
- Deal score: ${dealScore}/100
- Stress test (rates +2%): £${Number(stressRatePlus2).toFixed(0)}/mo cash flow

Market context:
- Benchmark (${cityBenchmark || "UK average"}): ${benchmarkGross}% gross / ${benchmarkNet}% net${crimeLevel ? `\n- Crime level: ${crimeLevel}` : ""}${avgSoldPrice ? `\n- Area avg sold price: £${Number(avgSoldPrice).toLocaleString()}` : ""}${rentalDemand ? `\n- Rental demand: ${rentalDemand}` : ""}

Return ONLY valid JSON (no markdown, no preamble):
{
  "verdict": "Buy" | "Negotiate" | "Pass",
  "summary": "2–3 sentences on why this deal is or isn't worth pursuing",
  "greenFlags": ["specific positive 1", "specific positive 2"],
  "redFlags": ["specific concern 1", "specific concern 2"],
  "negotiationTip": "concrete price or terms suggestion, or null",
  "keyInsight": "one powerful sentence capturing the single most important thing about this deal"
}`;

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 600,
      messages: [{ role: "user", content: prompt }],
    });

    const text = (
      message.content[0] as { type: string; text: string }
    ).text.trim();
    const jsonMatch = text.match(/\{[\s\S]+\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "Could not parse AI response." },
        { status: 500 },
      );
    }

    const verdict = JSON.parse(jsonMatch[0]);
    return NextResponse.json(verdict);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: `AI verdict failed: ${message}` },
      { status: 500 },
    );
  }
}
