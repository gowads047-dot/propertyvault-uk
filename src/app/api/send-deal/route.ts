import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import DealAnalysisEmail from "@/emails/DealAnalysisEmail";
import { REPLY_TO } from "@/lib/site";
import { RULES, rateGuard } from "@/lib/rate-limit";
import { safeHeaderText, validRecipient } from "@/lib/email-input";

/**
 * Emailing a deal analysis to the person who ran it.
 *
 * This route took the recipient address and a fragment of the subject line
 * straight from the request body and handed both to Resend, on a From of
 * info@propertyvaultuk.co.uk, with no rate limit and no authentication. So
 * anyone could put a message of their choosing into a stranger's inbox from a
 * domain that has spent time earning the right to be delivered.
 *
 * Three things stand in front of a send now: a rate limit, a recipient that
 * has to be one well-formed address, and an address line stripped of anything
 * that could turn one header into two.
 */
export async function POST(req: NextRequest) {
  const limited = await rateGuard(req, RULES.emailPerCaller, RULES.emailGlobal);
  if (limited) {
    return NextResponse.json({ error: limited.error }, { status: limited.status });
  }

  // new Resend() throws when RESEND_API_KEY is unset, which surfaced as an
  // opaque 500 with an empty body. Fail with something the caller can show.
  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY is not set — cannot send deal analysis.");
    return NextResponse.json(
      { error: "Email is temporarily unavailable. Please try again later." },
      { status: 503 }
    );
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const body = await req.json();
  const { email, deal } = body as {
    email: string;
    deal: {
      address?: string;
      purchasePrice: number;
      monthlyRent: number;
      grossYield: number;
      netYield: number;
      monthlyCF: number;
      cashOnCash: number;
      dealScore: number;
      totalCashIn: number;
      netIncome: number;
      strategy: string;
    };
  };

  const recipient = validRecipient(email);
  if (!recipient || !deal) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(n);

  const { error } = await resend.emails.send({
    from: "Nass at PropertyVault <info@propertyvaultuk.co.uk>",
    replyTo: REPLY_TO,
    to: recipient,
    subject: `Your deal analysis — ${safeHeaderText(deal.address) || fmt(deal.purchasePrice)} · Score ${Number(deal.dealScore) || 0}/100`,
    react: DealAnalysisEmail({ deal, fmt }),
  });

  if (error) {
    console.error("send-deal error:", error);
    return NextResponse.json({ error: "Email failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
