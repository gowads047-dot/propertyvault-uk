import { NextResponse } from "next/server";
import { RULES, rateGuard } from "@/lib/rate-limit";
import Anthropic from "@anthropic-ai/sdk";

const SCAN_SYSTEM = `You are a smart document scanner for a UK property management platform. A landlord or tenant has uploaded a document. Your job is to:
1. Identify what type of document it is
2. Extract ALL relevant information visible on it
3. Suggest the most useful things to do with the extracted data within the platform

## DOCUMENT TYPES YOU CAN RECOGNISE
Compliance: Gas Safety Certificate, EICR (Electrical Installation Condition Report), EPC (Energy Performance Certificate), PAT Test Certificate, Fire Risk Assessment, Legionella Risk Assessment, HMO Licence, Planning Permission, Building Regulations Certificate

Financial: Invoice, Receipt, Utility Bill, Bank Statement, Rental Statement, Deposit Protection Certificate, Mortgage Statement

Tenancy: Tenancy Agreement (AST), Deed of Guarantee, Notice to Quit, Section 21 Notice, Section 8 Notice, Court Order, Inventory Report

Mortgage: Mortgage in Principle (MIP), Mortgage Offer Letter, Mortgage Statement, Redemption Statement

Tenant Identity (Right to Rent): Passport, Driving Licence, Biometric Residence Permit (BRP), Visa, Share Code Confirmation, National Identity Card

Insurance: Buildings Insurance, Contents Insurance, Landlord Insurance Certificate, Rent Guarantee Insurance

Other: Letter, Council Tax Bill, Land Registry Document, Lease, Freehold Transfer, Ground Rent Demand, Service Charge Statement, Any other document

## WHAT TO EXTRACT (only include fields that are CLEARLY visible — never guess)
Extract a flat key-value object. Use human-readable keys, e.g.:
- "Inspector / contractor", "Issue date", "Expiry date", "Certificate reference"
- "Tenant name", "Landlord name", "Property address", "Monthly rent", "Tenancy start", "Tenancy end", "Deposit amount"
- "Lender", "Amount offered", "Valid until", "Interest rate", "LTV"
- "Total amount", "Date", "Supplier / vendor", "Invoice number", "Description"
- "Account holder", "Account number (last 4)", "Sort code (last 2)", "Statement period", "Opening balance", "Closing balance"
- "Document holder", "Document number", "Date of birth", "Nationality", "Expiry date"
- "Insurer", "Policy number", "Cover amount", "Renewal date", "Property covered"
- etc. — be thorough, use natural English keys

## SUGGESTED ACTIONS
Based on the document type, return 1–4 actions from this list. Always include "save_to_documents" as the last option.

Action IDs and when to use them:
- "save_compliance": Gas Safety, EICR, EPC, PAT, Fire Risk, Legionella, HMO Licence, Planning Permission, Insurance cert → saves to compliance tracker with expiry date
- "log_expense": Invoice, Receipt, Utility Bill, Service Charge, Ground Rent, Bank Statement (outgoing) → saves to Financials expenses
- "log_income": Rental Statement, Bank Statement (incoming rent), Deposit → saves to Financials income
- "update_tenant": Tenancy Agreement → update tenant start/end dates and rent amount
- "log_event": Any notable event (S21, S8, Court Order, Inventory, Notice) → adds to property timeline
- "log_rtr": Passport, Licence, BRP, Visa, National ID → logs Right to Rent check for this tenant
- "save_mortgage": MIP, Mortgage Offer, Mortgage Statement → saves to mortgage tracker
- "save_to_documents": ALWAYS include this — saves the file to the Documents section for future reference

Each action object:
{
  "id": "action_id",
  "label": "Short action label (3-5 words)",
  "description": "One sentence explaining exactly what this will save/do",
  "color": "#hex — use colours below",
  "primary": true/false (only ONE action should be primary),
  "data": { pre-filled data fields for this action — include everything extracted that's relevant }
}

Colour guide:
- save_compliance → "#0891b2" (teal)
- log_expense → "#dc2626" (red)
- log_income → "#15803d" (green)
- update_tenant → "#7c3aed" (purple)
- log_event → "#d97706" (amber)
- log_rtr → "#0891b2" (teal)
- save_mortgage → "#b8962e" (gold)
- save_to_documents → "#475569" (slate)

## DATA FIELDS PER ACTION (include in action.data)

save_compliance:
  certificate_type, issue_date (YYYY-MM-DD), expiry_date (YYYY-MM-DD), contractor, cert_reference, notes

log_expense:
  category (one of: maintenance, utilities, insurance, professional_fees, mortgage_interest, other),
  description (short text), amount (numeric), date (YYYY-MM-DD)

log_income:
  type (one of: rent, deposit, other), amount (numeric), date (YYYY-MM-DD), notes

update_tenant:
  monthly_rent (numeric), tenancy_start (YYYY-MM-DD), tenancy_end (YYYY-MM-DD or null for periodic), deposit_amount (numeric), tenancy_type

log_event:
  event_type (one of: legal_notice, inspection, tenancy_event, document_received, other),
  title (short), description (longer), event_date (YYYY-MM-DD), amount (if relevant)

log_rtr:
  document_type (one of: UK_Passport, EU_ID_Card, BRP, Visa, Driving_Licence, Share_Code, Other),
  document_ref (document number if visible), check_date (today), time_limited (true if visa/BRP with expiry),
  expiry_date (YYYY-MM-DD if time-limited)

save_mortgage:
  lender, monthly_payment (numeric), interest_rate (numeric), fixed_term_expiry (YYYY-MM-DD),
  mortgage_type (repayment/interest_only), notes

save_to_documents:
  category (one of: compliance, tenancy, financial, mortgage, identity, legal, insurance, other),
  file_name (use the original filename)

## IMPORTANT RULES
- If you cannot clearly read part of the document, set that field to null — never guess
- Dates: always convert to YYYY-MM-DD format regardless of how they appear on the document
- For Gas Safety: expiry = issue_date + 12 months
- For EICR: expiry = whatever is stated on the cert (often 5 years from inspection)
- For EPC: expiry = issue_date + 10 years
- For bank statements: summarise — do not list every transaction
- If multiple amounts appear on an invoice, use the TOTAL/AMOUNT DUE
- Property address: extract the full address if visible
- Be brief but complete in the reply — no waffle

## RESPONSE FORMAT (return ONLY valid JSON, no markdown)
{
  "reply": "string — conversational 1-3 sentence summary of what you found",
  "document_type": "string — e.g. Gas Safety Certificate",
  "document_category": "compliance | financial | tenancy | mortgage | identity | insurance | other",
  "extracted": { "Human-readable key": "value string", ... },
  "suggested_actions": [ { action objects as above } ],
  "property_match": "string or null — full address found in the document",
  "tenant_match": "string or null — tenant name found in the document",
  "confidence": "high | medium | low"
}`;

type PropertySummary = { id: string; address: string; nickname: string | null };
type TenantSummary = { id: string; first_name: string; last_name: string; property_id: string | null };

export async function POST(req: Request) {
  const limited = await rateGuard(req, RULES.visionPerCaller, RULES.visionGlobal);
  if (limited) {
    return NextResponse.json({ error: limited.error }, { status: limited.status });
  }

  try {
    const body = await req.json() as {
      base64Data: string;
      mediaType: string;
      filename: string;
      properties: PropertySummary[];
      tenants?: TenantSummary[];
    };

    const { base64Data, mediaType, filename, properties = [], tenants = [] } = body;

    if (!base64Data || !mediaType) {
      return NextResponse.json({ error: "Missing file data" }, { status: 400 });
    }

    const isImage = mediaType.startsWith("image/");
    const isPDF = mediaType === "application/pdf";

    if (!isImage && !isPDF) {
      return NextResponse.json({
        reply: "I can read image files (JPG, PNG, WEBP) and PDFs. Please try one of those formats.",
        document_type: "Unknown",
        document_category: "other",
        extracted: {},
        suggested_actions: [{ id: "save_to_documents", label: "Save to Documents", description: "Store this file in your document vault.", color: "#475569", primary: true, data: { category: "other", file_name: filename } }],
        property_match: null,
        tenant_match: null,
        confidence: "low",
      });
    }

    // Build portfolio context so Claude can match property/tenant names
    const portfolioCtx = [
      properties.length > 0
        ? `Portfolio properties:\n${properties.map(p => `- ${p.address}${p.nickname ? ` (aka "${p.nickname}")` : ""}`).join("\n")}`
        : "No properties on file.",
      tenants.length > 0
        ? `Known tenants:\n${tenants.map(t => `- ${t.first_name} ${t.last_name}`).join("\n")}`
        : null,
    ].filter(Boolean).join("\n\n");

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

    type ImageMediaType = "image/jpeg" | "image/png" | "image/gif" | "image/webp";
    const validImageTypes: ImageMediaType[] = ["image/jpeg", "image/png", "image/gif", "image/webp"];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const contentBlocks: any[] = [];

    if (isImage) {
      if (!validImageTypes.includes(mediaType as ImageMediaType)) {
        return NextResponse.json({ reply: "Unsupported image type. Please use JPG, PNG, or WEBP.", document_type: "Unknown", document_category: "other", extracted: {}, suggested_actions: [], property_match: null, tenant_match: null, confidence: "low" });
      }
      contentBlocks.push({ type: "image", source: { type: "base64", media_type: mediaType, data: base64Data } });
    } else {
      contentBlocks.push({ type: "document", source: { type: "base64", media_type: "application/pdf", data: base64Data } });
    }

    contentBlocks.push({
      type: "text",
      text: `Please scan this document (filename: "${filename}") and extract all relevant information.\n\n${portfolioCtx}`,
    });

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1500,
      system: SCAN_SYSTEM,
      messages: [{ role: "user", content: contentBlocks }],
    });

    const raw = response.content[0].type === "text" ? response.content[0].text.trim() : "";

    let parsed;
    try {
      const clean = raw.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
      parsed = JSON.parse(clean);
    } catch {
      parsed = {
        reply: "I could read the file but couldn't parse all the details. Here's what I found — please review and choose what to do with it.",
        document_type: "Unknown",
        document_category: "other",
        extracted: {},
        suggested_actions: [{ id: "save_to_documents", label: "Save to Documents", description: "Store this file in your document vault.", color: "#475569", primary: true, data: { category: "other", file_name: filename } }],
        property_match: null,
        tenant_match: null,
        confidence: "low",
      };
    }

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("Document scan error:", err);
    return NextResponse.json(
      { error: "Scan failed", reply: "Something went wrong scanning the document. Please try again.", document_type: "Unknown", document_category: "other", extracted: {}, suggested_actions: [], property_match: null, tenant_match: null, confidence: "low" },
      { status: 500 }
    );
  }
}

export const maxDuration = 30;
