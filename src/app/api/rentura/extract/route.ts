import { NextResponse } from "next/server";
import { RULES, guardAI } from "@/lib/rate-limit";
import Anthropic from "@anthropic-ai/sdk";

const EXTRACT_PROMPT = `You are a document data extraction engine for a UK property management platform.

Extract all relevant information from this document and return it as structured JSON.

First determine the document type, then extract the appropriate fields.

## DOCUMENT TYPES

**gas_safety** — Gas Safety Certificate (CP12)
Extract: issue_date, expiry_date (1 year after issue), engineer_name, engineer_gas_safe_number, cert_number, address_on_cert

**eicr** — Electrical Installation Condition Report
Extract: issue_date, expiry_date (5 years after issue), inspector_name, cert_number, outcome (satisfactory/unsatisfactory), address_on_cert

**epc** — Energy Performance Certificate
Extract: issue_date, expiry_date (10 years after issue), rating (A-G letter), score (number), cert_number, address_on_cert

**pat_test** — PAT Test Certificate
Extract: issue_date, expiry_date, tester_name, items_tested

**fire_alarm** — Fire Alarm / Smoke Detector Inspection
Extract: issue_date, next_inspection_date, engineer_name, outcome

**insurance** — Buildings or Landlord Insurance Certificate
Extract: insurer, policy_number, cover_start, cover_end, cover_type, property_address

**mortgage_statement** — Mortgage Statement
Extract: lender, account_number, interest_rate, monthly_payment, remaining_balance, statement_date, fixed_term_expiry (if shown), product_name

**tenancy_agreement** — Assured Shorthold Tenancy Agreement
Extract: tenant_name, tenant_email, monthly_rent, move_in_date, tenancy_end_date, deposit_amount, property_address

**invoice** — Invoice or Receipt for works
Extract: supplier_name, invoice_date, amount_ex_vat, amount_inc_vat, description_of_works, invoice_number

**unknown** — Cannot determine document type

## RESPONSE FORMAT
Return ONLY valid JSON:
{
  "document_type": "gas_safety | eicr | epc | pat_test | fire_alarm | insurance | mortgage_statement | tenancy_agreement | invoice | unknown",
  "confidence": 0.0-1.0,
  "extracted": {
    // all extracted fields as key: value pairs
    // use null for fields not found in the document
    // dates must be in YYYY-MM-DD format
    // amounts must be numbers (no £ symbol)
  },
  "summary": "one sentence describing what this document is",
  "warnings": ["any concerns about the document, e.g. expired, low quality scan, fields unclear"]
}`;

export async function POST(req: Request) {
  const limited = await guardAI(req, RULES.visionPerCaller, RULES.visionGlobal);
  if (limited) {
    return NextResponse.json({ error: limited.error }, { status: limited.status });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    const mediaType = file.type as "application/pdf" | "image/jpeg" | "image/png" | "image/gif" | "image/webp";

    const validTypes = ["application/pdf", "image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: "Unsupported file type. Upload a PDF or image." }, { status: 400 });
    }

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

    const isPDF = file.type === "application/pdf";

    const contentBlock = isPDF
      ? { type: "document" as const, source: { type: "base64" as const, media_type: "application/pdf" as const, data: base64 } }
      : { type: "image" as const, source: { type: "base64" as const, media_type: mediaType as "image/jpeg" | "image/png" | "image/gif" | "image/webp", data: base64 } };

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      messages: [{
        role: "user",
        content: [
          contentBlock,
          { type: "text", text: EXTRACT_PROMPT },
        ],
      }],
    });

    const raw = response.content[0].type === "text" ? response.content[0].text.trim() : "";
    const clean = raw.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");

    let parsed;
    try {
      parsed = JSON.parse(clean);
    } catch {
      return NextResponse.json({ error: "Extraction failed — could not parse document" }, { status: 422 });
    }

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("Document extraction error:", err);
    return NextResponse.json({ error: "Extraction failed" }, { status: 500 });
  }
}
