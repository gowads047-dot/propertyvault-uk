import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import DealAnalysisEmail from "@/emails/DealAnalysisEmail";
import { REPLY_TO } from "@/lib/site";

export async function POST(req: NextRequest) {
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

  if (!email || !deal) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(n);

  const { error } = await resend.emails.send({
    from: "Nass at PropertyVault <nass@propertyvaultuk.co.uk>",
    replyTo: REPLY_TO,
    to: email.trim().toLowerCase(),
    subject: `Your deal analysis — ${deal.address ?? fmt(deal.purchasePrice)} · Score ${deal.dealScore}/100`,
    react: DealAnalysisEmail({ deal, fmt }),
  });

  if (error) {
    console.error("send-deal error:", error);
    return NextResponse.json({ error: "Email failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
