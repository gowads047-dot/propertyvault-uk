import { NextResponse } from "next/server";
import { RULES, rateGuard } from "@/lib/rate-limit";
import Anthropic from "@anthropic-ai/sdk";

const EXTRACT_SYSTEM = `You are a UK property compliance assistant. The landlord has uploaded a compliance certificate image or PDF. Your job is to read it carefully and extract all key fields.

## WHAT TO EXTRACT
Return a JSON object with these fields (null if not found on the document):
- certificate_type: one of ["Gas Safety Certificate", "EICR", "EPC", "PAT Test", "Fire Risk Assessment", "Legionella Risk Assessment", "HMO Licence", "Planning Permission", "Building Regulations Certificate", "Insurance Certificate", "Other"]
- issue_date: ISO date string (YYYY-MM-DD) — the date the certificate was issued / inspection was carried out
- expiry_date: ISO date string (YYYY-MM-DD) — the date the certificate expires or next check is due
  - Gas Safety: +12 months from issue
  - EICR: stated on certificate (typically 5 years)
  - EPC: +10 years from issue
  - HMO Licence: stated expiry on licence
  - If expiry is explicitly stated on the document, use that; otherwise calculate from the type
- contractor: name of the engineer, assessor, or issuing company
- cert_reference: certificate number, reference number, or unique ID shown on the document
- property_address: the property address shown on the document (full address if visible)
- notes: any important notes, caveats, or remedial actions required (e.g. "C2 observation noted", "EPC rating D", "3 immediate action items")

## IMPORTANT
- If you cannot read the document clearly, say so in the reply and set extracted fields to null
- For Gas Safety Certificates: the "Next inspection due" date is the expiry_date
- For EICRs: look for "Next inspection recommended" or "Date of next inspection" as expiry_date
- For EPCs: look for the "Valid until" date
- Dates may be in various formats — convert all to YYYY-MM-DD
- Be precise — do not guess. If a field is not clearly visible, set it to null

## RESPONSE FORMAT
Return ONLY valid JSON, no markdown:
{
  "reply": "string — brief conversational response summarising what you found",
  "extracted": {
    "certificate_type": "string or null",
    "issue_date": "YYYY-MM-DD or null",
    "expiry_date": "YYYY-MM-DD or null",
    "contractor": "string or null",
    "cert_reference": "string or null",
    "property_address": "string or null",
    "notes": "string or null"
  },
  "property_match": "string or null — the property address from the landlord portfolio that best matches the certificate address",
  "needsConfirmation": true,
  "intent": "log_compliance",
  "completed": false
}`;

type PropertySummary = { id: string; address: string; nickname: string | null };

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
    };

    const { base64Data, mediaType, filename, properties = [] } = body;

    if (!base64Data || !mediaType) {
      return NextResponse.json({ error: "Missing file data" }, { status: 400 });
    }

    // Build portfolio context for property matching
    const portfolioNote = properties.length > 0
      ? `\n\nLandlord portfolio addresses (for property_match):\n${properties.map(p => `- ${p.address}${p.nickname ? ` (aka "${p.nickname}")` : ""}`).join("\n")}`
      : "\n\nThis landlord has no properties on file yet.";

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

    // Build content array — image or PDF document block
    const isImage = mediaType.startsWith("image/");
    const isPDF = mediaType === "application/pdf";

    if (!isImage && !isPDF) {
      return NextResponse.json({
        reply: "I can only read image files (JPG, PNG, WEBP) and PDFs. Please upload one of those.",
        extracted: null,
        needsConfirmation: false,
        intent: "unknown",
        completed: false,
      });
    }

    type ImageBlock = { type: "image"; source: { type: "base64"; media_type: "image/jpeg" | "image/png" | "image/gif" | "image/webp"; data: string } };
    type DocumentBlock = { type: "document"; source: { type: "base64"; media_type: "application/pdf"; data: string } };
    type TextBlock = { type: "text"; text: string };
    type ContentBlock = ImageBlock | DocumentBlock | TextBlock;

    const contentBlocks: ContentBlock[] = [];

    if (isImage) {
      const validImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"] as const;
      type ValidImageType = typeof validImageTypes[number];
      if (!validImageTypes.includes(mediaType as ValidImageType)) {
        return NextResponse.json({ reply: "Unsupported image type. Please use JPG, PNG, or WEBP.", extracted: null, intent: "unknown", completed: false });
      }
      contentBlocks.push({
        type: "image",
        source: { type: "base64", media_type: mediaType as ValidImageType, data: base64Data },
      });
    } else {
      // PDF document block
      contentBlocks.push({
        type: "document",
        source: { type: "base64", media_type: "application/pdf", data: base64Data },
      });
    }

    contentBlocks.push({
      type: "text",
      text: `Please extract all compliance details from this certificate (filename: ${filename}).${portfolioNote}`,
    });

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system: EXTRACT_SYSTEM,
      messages: [{ role: "user", content: contentBlocks as Parameters<typeof client.messages.create>[0]["messages"][0]["content"] }],
    });

    const raw = response.content[0].type === "text" ? response.content[0].text.trim() : "";
    let parsed;
    try {
      const clean = raw.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
      parsed = JSON.parse(clean);
    } catch {
      parsed = {
        reply: "I could read the file but had trouble parsing it. Please tell me the key details manually — certificate type, date, and contractor name.",
        extracted: null,
        needsConfirmation: false,
        intent: "log_compliance",
        completed: false,
      };
    }

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("Certificate extraction error:", err);
    return NextResponse.json(
      { error: "Extraction failed", reply: "Something went wrong reading the certificate. Please try again or enter the details manually.", extracted: null, intent: "unknown", completed: false },
      { status: 500 }
    );
  }
}

// Allow larger bodies for file uploads (up to 10MB base64)
export const maxDuration = 30;
