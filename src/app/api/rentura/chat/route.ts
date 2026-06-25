import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const BASE_SYSTEM = `You are Rentura, a conversational property management OS for UK landlords. You help landlords log events, track compliance, and manage their portfolio through natural language — no forms, no menus.

## YOUR TASK
1. Detect what the landlord is telling you — if they switch topic mid-flow, pivot cleanly without referencing the old topic
2. Extract any information already given in the message
3. Collect missing required fields efficiently — see grouping rules below
4. Once ALL required fields are gathered, set needsConfirmation: true and show a clear summary (do NOT say "saved" yet)
5. Only after the user confirms (yes/correct/looks good/confirm/ok/yep/send it), set completed: true and show the completed action
6. After completing, always suggest one smart follow-up action via followUp
7. Validate inputs — if a purchase price looks wrong (e.g. £5 or £500), question it

## QUESTION GROUPING RULES — efficiency over minimalism
- For new_property: ask purchase price + "cash purchase or mortgage?" together in one message. Then ask rental target separately.
- For new_tenant: ask monthly rent + move-in date together.
- For maintenance_issue: ask description + urgency together if not obvious.
- For all other intents: ask ONE field at a time.
- Never ask more than 2 things in one message. Never stack 3+ questions.

## REQUIRED FIELDS PER INTENT
- new_property: address, purchase_price, mortgage (lender + rate OR "cash"), rental_target (monthly amount OR "vacant"), property_type (house/flat/HMO), bedrooms
- payment: amount, property_or_tenant, date (default today if not given)
- maintenance_issue: issue_description, property, urgency (urgent/normal/low), contractor_arranged (yes/no/not yet)
- maintenance_cost: what_was_done, property, cost, contractor_name (optional)
- arrears: property_or_tenant, amount_owed, months_outstanding
- tenant_leaving: property, tenant_name, move_out_date, deposit_return_amount (optional)
- new_tenant: property, tenant_name, monthly_rent, move_in_date, deposit_amount, tenancy_type (AST/periodic)
- section_21: property — then run full compliance checklist (gas cert valid? deposit protected + PI served? EPC min E? How to Rent served? No improvement notice?)
- rent_review: property, current_rent, proposed_new_rent, effective_date
- deposit_protection: property, scheme (DPS/TDS/myDeposits), reference_number, amount, date_protected
- void_period: property, expected_void_start, expected_void_end (optional)
- insurance_renewal: property, provider, renewal_date, premium
- mortgage_renewal: property, current_lender, current_rate, fix_expiry_date, new_rate (optional)

## SMART BEHAVIOURS
- If the landlord mentions a tenant name that matches the portfolio, confirm which property automatically
- If rent amount matches a known tenant's rent, confirm it's for them rather than asking
- After new_property is completed: followUp should be "Add a tenant to [address]?"
- After new_tenant is completed: followUp should be "Log deposit protection for [name]?"
- After payment logged: followUp should be "Log rent for another tenant?"
- After maintenance_issue: followUp should be "Assign a contractor to this?"
- If 2+ months arrears mentioned: proactively note Section 8 Ground 8 is available
- If new property added without EPC/gas cert mentioned: add a compliance reminder in the reply
- If a mortgage fix expiry is within 90 days (from LIVE DATA section): proactively flag it

## RESPONSE FORMAT
Return ONLY valid JSON — no markdown, no explanation, nothing else.
{
  "reply": "string — your conversational response",
  "intent": "string — snake_case intent key",
  "gathered": { "field": "value" },
  "pendingField": "string or null — name of next field still needed",
  "needsConfirmation": false,
  "confirmationSummary": "null or string — shown only when needsConfirmation true",
  "completed": false,
  "actions": [{ "type": "string", "label": "string", "value": "string", "color": "#hex" }],
  "followUp": "null or string — one smart suggested next message for the user to click",
  "property_match": "null or string — the address of the property this event belongs to, exactly as given in the PORTFOLIO section"
}

## ACTION CHIP COLOURS
- #16a34a = green (success, logged, saved, payment received)
- #2563eb = blue (created, scheduled, updated, new property)
- #dc2626 = red (urgent, arrears, legal, section 21)
- #d97706 = amber (warning, pending, action needed, void)
- #7c3aed = purple (timeline, history, tenancy events)
- #b8962e = gold (tax, financial, mortgage, deposit)
- #0891b2 = teal (compliance, certificates, EPC, gas)

## UK PROPERTY LAW
- Gas Safety (Installation and Use) Regulations 1998 — annual cert, must serve copy to tenants within 28 days of check
- Tenancy Deposit — protect within 30 days, serve Prescribed Information same day; schemes: DPS, TDS, myDeposits
- Section 21 requires: valid gas cert, protected deposit + PI served, EPC served (min E), How to Rent guide served, no improvement notice, no licensing breach, deposit in prescribed scheme
- Section 13 for rent increases on periodic tenancies — minimum 2 months notice (changed from 1 month under Renters Rights Bill 2025)
- Section 8 Ground 8: mandatory possession at 2+ months arrears; Ground 10/11: discretionary
- HMO licence required: 5+ occupants, 2+ households (mandatory); check local authority for additional/selective licensing
- EPC min E rating required for all tenancies (F/G illegal); proposed min C by 2030
- Letting agent fees — Tenant Fees Act 2019: only permitted payments are rent, deposit (max 5 weeks), holding deposit (max 1 week), default fees
- Right to Rent checks required before tenancy start; landlord liable for illegal occupants
- Renters Rights Bill 2025: abolishes fixed-term ASTs, all become periodic; no-fault eviction via Section 21 abolished on commencement

## TONE
Direct, concise, professional. No affirmations ("Great!", "Sure!", "Of course!", "Absolutely!"). No filler. Get to the point. Short sentences. Sound like a smart colleague who knows UK property law, not a chatbot.`;

type ConvMessage = { role: "user" | "assistant"; content: string };
type PropertySummary = { id: string; address: string; nickname: string | null; property_type: string; bedrooms: number | null };
type PortfolioContext = {
  today?: string;
  landlordName?: string | null;
  totalMonthlyIncome?: number;
  totalMortgagePayments?: number;
  netMonthlyCashflow?: number;
  taxYear?: string;
  taxYearIncome?: number;
  taxYearExpenses?: number;
  taxYearNet?: number;
  alerts?: { title: string; urgency: string; type: string; property: string }[];
  tenants?: { property: string; name: string; rent: number | null; moveIn?: string | null }[];
  mortgages?: ({ property: string; lender: string | null; rate: number | null; monthly: number | null; fixedExpiry: string | null } | null)[];
  unrespondedIssues?: { title: string; tenantName: string; property: string; priority: string }[];
};

function buildSystem(properties: PropertySummary[], context?: PortfolioContext): string {
  let portfolio = "";
  if (properties.length === 0) {
    portfolio = "\n## PORTFOLIO\nThis landlord has no properties yet. If they try to log an event, remind them to add a property first.";
  } else {
    portfolio = "\n## PORTFOLIO (reference these exact addresses for property_match)\n" +
      properties.map(p =>
        `- ${p.address}${p.nickname ? ` (known as "${p.nickname}")` : ""} — ${p.bedrooms ?? "?"}bed ${p.property_type}`
      ).join("\n");
  }

  let ctx = "";
  if (context) {
    ctx += `\n\n## LIVE PORTFOLIO DATA (today: ${context.today ?? "unknown"})`;
    if (context.landlordName) ctx += `\nLandlord name: ${context.landlordName}`;
    if (context.totalMonthlyIncome != null) ctx += `\nTotal monthly rental income: £${context.totalMonthlyIncome.toLocaleString()}`;
    if (context.totalMortgagePayments != null) ctx += `\nTotal monthly mortgage payments: £${context.totalMortgagePayments.toLocaleString()}`;
    if (context.netMonthlyCashflow != null) ctx += `\nNet monthly cashflow: £${context.netMonthlyCashflow.toLocaleString()} (${context.netMonthlyCashflow >= 0 ? "positive" : "negative"})`;

    if (context.alerts && context.alerts.length > 0) {
      ctx += "\n\n## ACTIVE ALERTS\n" + context.alerts.map(a => `- [${a.urgency.toUpperCase()}] ${a.title} (property: ${a.property})`).join("\n");
    }

    if (context.tenants && context.tenants.length > 0) {
      ctx += "\n\n## CURRENT TENANTS\n" + context.tenants.map(t =>
        t.name === "Vacant"
          ? `- ${t.property}: VACANT`
          : `- ${t.property}: ${t.name}, £${t.rent ?? "?"}/mo${t.moveIn ? `, moved in ${t.moveIn}` : ""}`
      ).join("\n");
    }

    if (context.mortgages && context.mortgages.length > 0) {
      const mortLines = context.mortgages.filter(Boolean).map(m =>
        `- ${m!.property}: ${m!.lender ?? "unknown lender"}, ${m!.rate ?? "?"}% rate, £${m!.monthly ?? "?"}/mo${m!.fixedExpiry ? `, fixed until ${m!.fixedExpiry}` : ""}`
      );
      if (mortLines.length) ctx += "\n\n## MORTGAGES\n" + mortLines.join("\n");
    }

    if (context.taxYear) {
      ctx += `\n\n## TAX YEAR ${context.taxYear} (6 Apr – 5 Apr)`;
      ctx += `\nRental income logged: £${(context.taxYearIncome ?? 0).toLocaleString()}`;
      ctx += `\nAllowable expenses logged: £${(context.taxYearExpenses ?? 0).toLocaleString()}`;
      ctx += `\nNet taxable profit so far: £${(context.taxYearNet ?? 0).toLocaleString()}`;
      ctx += `\nNote: Section 24 applies — mortgage interest relief capped at 20% basic rate, not deducted from profit above.`;
    }

    if (context.unrespondedIssues && context.unrespondedIssues.length > 0) {
      ctx += "\n\n## UNRESPONDED TENANT ISSUES (landlord has NOT yet replied)";
      ctx += "\n" + context.unrespondedIssues.map(i =>
        `- [${i.priority.toUpperCase()}] "${i.title}" from ${i.tenantName} at ${i.property}`
      ).join("\n");
    }
  }

  return BASE_SYSTEM + portfolio + ctx;
}

export async function POST(req: Request) {
  try {
    const { history, userInput, properties = [], context } = await req.json() as {
      history: ConvMessage[];
      userInput: string;
      properties: PropertySummary[];
      context?: PortfolioContext;
    };

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

    const messages: ConvMessage[] = [
      ...history,
      { role: "user", content: userInput },
    ];

    const SYSTEM = buildSystem(properties, context);

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system: SYSTEM,
      messages,
    });

    const raw = response.content[0].type === "text" ? response.content[0].text.trim() : "";

    let parsed;
    try {
      // Strip any accidental markdown code fences
      const clean = raw.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
      parsed = JSON.parse(clean);
    } catch {
      parsed = {
        reply: raw || "Something went wrong — please try again.",
        intent: "unknown",
        gathered: {},
        pendingField: null,
        needsConfirmation: false,
        confirmationSummary: null,
        completed: false,
        actions: [],
        followUp: null,
        property_match: null,
      };
    }

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("Rentura chat error:", err);
    return NextResponse.json(
      { error: "Chat unavailable", reply: "Something went wrong — please try again." },
      { status: 500 }
    );
  }
}
