"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

// ─── Conversation engine ──────────────────────────────────────────────────────

type Action = { type: string; label: string; value: string; color: string };
type Message = {
  role: "user" | "ai";
  text: string;
  actions?: Action[];
  ts?: string;
  awaitingConfirm?: boolean;
  followUp?: string | null;
};
type ConversationContext = { intent: string; gathered: Record<string, string>; pendingField: string } | null;
type APIHistory = { role: "user" | "assistant"; content: string }[];

// Required fields per intent, in collection order
const FIELD_ORDER: Record<string, string[]> = {
  new_property:      ["price", "mortgage", "tenant"],
  payment:           ["amount", "property"],
  maintenance_issue: ["property", "contractor"],
  maintenance_cost:  ["property", "cost"],
  arrears:           ["property", "amount_owed"],
  tenant_leaving:    ["property", "move_out_date"],
  new_tenant:        ["property", "rent", "move_in_date"],
};

const FIELD_QUESTIONS: Record<string, Record<string, string>> = {
  new_property: {
    price:    "What was the purchase price?",
    mortgage: "Are you using a mortgage? If so, which lender and what rate — or just say 'no mortgage' if it's a cash purchase.",
    tenant:   "Will you be letting it out? If so, what's the monthly rent — or say 'vacant' if it's empty for now.",
  },
  payment: {
    amount:   "How much was the payment?",
    property: "Which property or tenant is this for?",
  },
  maintenance_issue: {
    property:   "Which property is this for?",
    contractor: "Do you have a contractor in mind, or shall I add it to the jobs list as needing one?",
  },
  maintenance_cost: {
    property: "Which property is this for?",
    cost:     "What was the total cost?",
  },
  arrears: {
    property:    "Which property is this for?",
    amount_owed: "How much is owed — or how many months are they behind?",
  },
  tenant_leaving: {
    property:      "Which property is this for?",
    move_out_date: "When are they vacating — do you have a move-out date?",
  },
  new_tenant: {
    property:     "Which property are they moving into?",
    rent:         "What's the monthly rent agreed?",
    move_in_date: "When are they moving in?",
  },
};

function completeIntent(intent: string, g: Record<string, string>): { reply: string; actions: Action[] } {
  switch (intent) {
    case "new_property": {
      const isCash = /no mortgage|cash/i.test(g.mortgage || "");
      const mortgageStr = isCash ? "Cash purchase — no mortgage" : (g.mortgage || "Not specified");
      const isVacant = /vacant|empty|no tenant/i.test(g.tenant || "");
      const tenantStr = isVacant ? "Vacant — no tenant yet" : (g.tenant || "Not specified");
      return {
        reply: `All done. Here's what I've recorded:\n\n• Property: ${g.area || "New property"}\n• Purchase price: ${g.price}\n• Mortgage: ${mortgageStr}\n• Rental: ${tenantStr}\n\nProperty record created, timeline started, and ${isCash ? "no mortgage tracker needed." : "mortgage expiry tracker configured — I'll alert you 60 days before renewal."}`,
        actions: [
          { type: "create", label: "Property created", value: g.area || "New property", color: "#2563eb" },
          { type: "record", label: "Purchase price", value: g.price, color: "#7c3aed" },
          { type: "record", label: "Mortgage", value: isCash ? "Cash" : mortgageStr.split(" ").slice(0,2).join(" "), color: "#b8962e" },
          { type: "record", label: "Rental", value: isVacant ? "Vacant" : tenantStr, color: "#16a34a" },
        ],
      };
    }
    case "payment":
      return {
        reply: `Payment of ${g.amount} recorded for ${g.property}. Rent ledger updated, arrears cleared if any were outstanding. Receipt available under Financials.`,
        actions: [
          { type: "record", label: "Payment logged", value: g.amount, color: "#16a34a" },
          { type: "update", label: "Ledger updated", value: g.property, color: "#2563eb" },
          { type: "clear", label: "Arrears cleared", value: "£0 outstanding", color: "#16a34a" },
        ],
      };
    case "maintenance_issue": {
      const needsContractor = /list|need one|not sure|no|don't have/i.test(g.contractor || "");
      return {
        reply: `Maintenance issue logged at ${g.property}. ${needsContractor ? "Added to jobs list — contractor needed." : `Contractor noted: ${g.contractor}.`} Tenant will receive an auto-acknowledgement. I'll track this until it's resolved.`,
        actions: [
          { type: "create", label: "Issue created", value: g.property, color: "#dc2626" },
          { type: "action", label: needsContractor ? "Contractor needed" : "Contractor noted", value: needsContractor ? "On jobs list" : g.contractor, color: "#d97706" },
          { type: "notify", label: "Tenant notified", value: "Auto-sent", color: "#2563eb" },
        ],
      };
    }
    case "maintenance_cost":
      return {
        reply: `${g.cost} maintenance cost logged for ${g.property}. Categorised as repairs — tax allowable. Flagged for your self-assessment summary.`,
        actions: [
          { type: "record", label: "Expense logged", value: `${g.cost} — repairs`, color: "#16a34a" },
          { type: "tax", label: "Tax allowable", value: "Added to SA summary", color: "#b8962e" },
          { type: "history", label: "History updated", value: g.property, color: "#2563eb" },
        ],
      };
    case "arrears":
      return {
        reply: `Arrears flagged for ${g.property}. Amount owed: ${g.amount_owed}. Ledger updated and arrears record created. I'd recommend sending a formal arrears notice — want me to draft one?`,
        actions: [
          { type: "alert", label: "Arrears flagged", value: g.property, color: "#dc2626" },
          { type: "record", label: "Amount owed", value: g.amount_owed, color: "#d97706" },
          { type: "action", label: "Arrears notice", value: "Ready to draft", color: "#2563eb" },
        ],
      };
    case "tenant_leaving":
      return {
        reply: `Tenancy at ${g.property} marked as ending${g.move_out_date && g.move_out_date !== "not sure" ? ` on ${g.move_out_date}` : ""}. Deposit return checklist triggered, void period record opened, and property flagged as upcoming vacant.`,
        actions: [
          { type: "update", label: "Tenancy ending", value: g.property, color: "#2563eb" },
          { type: "checklist", label: "Deposit checklist", value: "Triggered", color: "#d97706" },
          { type: "record", label: "Void period", value: g.move_out_date || "Upcoming", color: "#16a34a" },
        ],
      };
    case "new_tenant":
      return {
        reply: `New tenancy set up at ${g.property}. Rent: ${g.rent}, moving in ${g.move_in_date}. Tenant record created, first rent payment scheduled, compliance tracker opened.`,
        actions: [
          { type: "create", label: "Tenancy created", value: g.property, color: "#2563eb" },
          { type: "schedule", label: "Rent scheduled", value: g.rent, color: "#16a34a" },
          { type: "compliance", label: "Compliance tracker", value: "Opened", color: "#b8962e" },
        ],
      };
    default:
      return { reply: "All noted and saved.", actions: [{ type: "record", label: "Saved", value: "Done", color: "#16a34a" }] };
  }
}

function parseMessage(input: string, ctx: ConversationContext): { reply: string; actions: Action[]; newContext: ConversationContext } {
  const i = input.toLowerCase().trim();

  // ── Continuing an active gathering flow ──────────────────────────────────
  if (ctx) {
    if (["cancel", "stop", "nevermind", "never mind", "forget it"].includes(i)) {
      return { reply: "No problem — cleared. What else can I help with?", actions: [], newContext: null };
    }
    const updated = { ...ctx.gathered, [ctx.pendingField]: input };
    const nextField = FIELD_ORDER[ctx.intent]?.find(f => !updated[f]);
    if (nextField) {
      return {
        reply: FIELD_QUESTIONS[ctx.intent][nextField],
        actions: [],
        newContext: { intent: ctx.intent, gathered: updated, pendingField: nextField },
      };
    }
    return { ...completeIntent(ctx.intent, updated), newContext: null };
  }

  // ── Fresh message — detect intent and extract what's already there ────────

  // ── New property ─────────────────────────────────────────────────────────
  if (i.includes("bought") || i.includes("purchased") || i.includes("new property") || i.includes("acquired")) {
    const area = input.match(/(?:in|at)\s+([A-Za-z][A-Za-z\s]+?)(?:\s+for\b|\s+£|[,.]|$)/i)?.[1]?.trim() || "";
    const price = input.match(/£[\d,]+k?/i)?.[0] || "";
    const hasMortgage = /mortgage|barclays|natwest|halifax|santander|nationwide|hsbc|lloyds|cash buy|no mortgage/i.test(input);
    const hasTenant = /tenant|letting|rent £|£\d+.{0,6}(?:\/mo|month|pcm|pw|week)|vacant/i.test(input);
    const g: Record<string, string> = {};
    if (area) g.area = area;
    if (price) g.price = price;
    if (hasMortgage) g.mortgage = input;
    if (hasTenant) g.tenant = input;
    const nextField = FIELD_ORDER.new_property.find(f => !g[f]);
    if (!nextField) return { ...completeIntent("new_property", g), newContext: null };
    return {
      reply: `${area ? `Got it — ${area}. ` : "New property noted. "}${FIELD_QUESTIONS.new_property[nextField]}`,
      actions: [{ type: "pending", label: "New property", value: area || "details needed", color: "#2563eb" }],
      newContext: { intent: "new_property", gathered: g, pendingField: nextField },
    };
  }

  // ── Payment ───────────────────────────────────────────────────────────────
  if (i.includes("paid") && (i.includes("£") || i.match(/\d{3,}/))) {
    const amount = input.match(/£[\d,]+/)?.[0] || "";
    const property = input.match(/(?:for|at|from)\s+([A-Za-z][^\.,]+)/i)?.[1]?.trim() || "";
    const g: Record<string, string> = {};
    if (amount) g.amount = amount;
    if (property) g.property = property;
    const nextField = FIELD_ORDER.payment.find(f => !g[f]);
    if (!nextField) return { ...completeIntent("payment", g), newContext: null };
    return { reply: FIELD_QUESTIONS.payment[nextField], actions: [], newContext: { intent: "payment", gathered: g, pendingField: nextField } };
  }

  // ── Maintenance cost ──────────────────────────────────────────────────────
  if ((i.includes("replaced") || i.includes("boiler") || i.includes("installed") || i.includes("repaired") || (i.includes("cost") && i.match(/£\d/))) && i.match(/£\d/)) {
    const cost = input.match(/£[\d,]+/)?.[0] || "";
    const property = input.match(/(?:at|in|flat|house)\s+([A-Za-z][^\.,]+)/i)?.[1]?.trim() || "";
    const g: Record<string, string> = {};
    if (cost) g.cost = cost;
    if (property) g.property = property;
    const nextField = FIELD_ORDER.maintenance_cost.find(f => !g[f]);
    if (!nextField) return { ...completeIntent("maintenance_cost", g), newContext: null };
    return { reply: FIELD_QUESTIONS.maintenance_cost[nextField], actions: [], newContext: { intent: "maintenance_cost", gathered: g, pendingField: nextField } };
  }

  // ── Maintenance issue ─────────────────────────────────────────────────────
  if ((i.includes("leak") || i.includes("damp") || i.includes("broken") || i.includes("reported") || i.includes("tap") || i.includes("radiator") || i.includes("crack") || i.includes("fault") || i.includes("not working")) && !i.match(/£\d/)) {
    const issue = i.includes("leak") ? "leak" : i.includes("damp") ? "damp" : i.includes("radiator") ? "radiator fault" : i.includes("boiler") ? "boiler fault" : "maintenance issue";
    const property = input.match(/(?:at|in|flat|house)\s+([A-Za-z][^\.,]+?)(?:\s+reported|\s+has|\s+is|[.,]|$)/i)?.[1]?.trim() || "";
    const g: Record<string, string> = { issue };
    if (property) g.property = property;
    const nextField = FIELD_ORDER.maintenance_issue.find(f => !g[f]);
    if (!nextField) return { ...completeIntent("maintenance_issue", g), newContext: null };
    return { reply: FIELD_QUESTIONS.maintenance_issue[nextField], actions: [], newContext: { intent: "maintenance_issue", gathered: g, pendingField: nextField } };
  }

  // ── Rent arrears (multi-turn) ─────────────────────────────────────────────
  if (i.includes("arrears") || i.includes("late rent") || i.includes("missed payment") || i.includes("not paid") || i.includes("overdue") || i.includes("hasn't paid") || i.includes("haven't paid")) {
    const property = input.match(/(?:at|in|on)\s+([A-Za-z][^\.,]+)/i)?.[1]?.trim() || "";
    const g: Record<string, string> = {};
    if (property) g.property = property;
    const nextField = FIELD_ORDER.arrears.find(f => !g[f]);
    if (!nextField) return { ...completeIntent("arrears", g), newContext: null };
    return { reply: FIELD_QUESTIONS.arrears[nextField], actions: [], newContext: { intent: "arrears", gathered: g, pendingField: nextField } };
  }

  // ── Tenant leaving (multi-turn) ───────────────────────────────────────────
  if (i.includes("moved out") || i.includes("vacated") || (i.includes("tenant") && (i.includes("leaving") || i.includes("left") || i.includes("ended") || i.includes("notice")))) {
    const property = input.match(/(?:at|in|on)\s+([A-Za-z][^\.,]+)/i)?.[1]?.trim() || "";
    const date = input.match(/\d{1,2}(?:st|nd|rd|th)?\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*(?:\s+\d{4})?/i)?.[0] || "";
    const g: Record<string, string> = {};
    if (property) g.property = property;
    if (date) g.move_out_date = date;
    const nextField = FIELD_ORDER.tenant_leaving.find(f => !g[f]);
    if (!nextField) return { ...completeIntent("tenant_leaving", g), newContext: null };
    return { reply: FIELD_QUESTIONS.tenant_leaving[nextField], actions: [], newContext: { intent: "tenant_leaving", gathered: g, pendingField: nextField } };
  }

  // ── New tenant (multi-turn) ───────────────────────────────────────────────
  if ((i.includes("tenant") && (i.includes("new") || i.includes("moving in") || i.includes("signed") || i.includes("agreed"))) || i.includes("let agreed") || i.includes("tenancy start")) {
    const property = input.match(/(?:at|in|on)\s+([A-Za-z][^\.,]+)/i)?.[1]?.trim() || "";
    const rent = input.match(/£[\d,]+(?:\s*(?:\/mo|pcm|month|pw))?/i)?.[0] || "";
    const g: Record<string, string> = {};
    if (property) g.property = property;
    if (rent) g.rent = rent;
    const nextField = FIELD_ORDER.new_tenant.find(f => !g[f]);
    if (!nextField) return { ...completeIntent("new_tenant", g), newContext: null };
    return { reply: FIELD_QUESTIONS.new_tenant[nextField], actions: [], newContext: { intent: "new_tenant", gathered: g, pendingField: nextField } };
  }

  // ── Single-turn intents (no gathering needed) ─────────────────────────────

  if (i.includes("mortgage") && (i.includes("expir") || i.includes("this year") || i.includes("upcoming") || i.includes("renew") || i.includes("remortgage") || i.includes("rate"))) {
    return { reply: `You have 2 mortgages expiring in the next 12 months:\n\n• 14 Maple Street — Barclays 2.89% fixed, expires 3 Aug 2026 (41 days). SVR reversion would cost £284/month extra.\n• 22 Park Road — NatWest 3.2% fixed, expires 14 Nov 2026 (5 months). £196/month difference.\n\nWant me to prepare a broker brief for both?`, actions: [{ type: "alert", label: "Maple Street", value: "41 days · urgent", color: "#dc2626" }, { type: "alert", label: "Park Road", value: "5 months", color: "#d97706" }, { type: "action", label: "Broker brief", value: "Ready to generate", color: "#2563eb" }], newContext: null };
  }

  if (i.includes("focus") || i.includes("today") || i.includes("priority") || i.includes("what should")) {
    return { reply: `3 things need your attention today:\n\n1. Gas Safety on Flat 4, Grove Lane — expires in 9 days. Book it now.\n2. Tenant at 22 Park Road has had an open maintenance issue for 6 days. Chase the contractor.\n3. Mortgage at 14 Maple Street expires in 41 days — rate reversion will cost £3,408/year extra.\n\nEverything else can wait.`, actions: [{ type: "urgent", label: "Gas Safety due", value: "9 days", color: "#dc2626" }, { type: "chase", label: "Maintenance stalled", value: "6 days open", color: "#d97706" }, { type: "alert", label: "Mortgage expiry", value: "41 days", color: "#d97706" }], newContext: null };
  }

  if (i.includes("profitable") || i.includes("best property") || i.includes("performing") || i.includes("yield") || i.includes("portfolio") || i.includes("return")) {
    return { reply: `Your best performer is 14 Maple Street. Net yield 8.4%, monthly cash flow £612, ROI since purchase 31.2%. It generates 43% of your total portfolio income on 28% of your total capital. Your weakest is 22 Park Road — yield 4.1%, high maintenance spend, rent below market rate.`, actions: [{ type: "top", label: "14 Maple Street", value: "8.4% yield · £612/mo CF", color: "#16a34a" }, { type: "low", label: "22 Park Road", value: "4.1% yield · review needed", color: "#dc2626" }], newContext: null };
  }

  if (i.includes("tax") || i.includes("owe") || i.includes("self assessment") || i.includes("hmrc") || i.includes("income tax") || i.includes("allowable") || i.includes("expenses")) {
    return { reply: `Based on rent received and expenses logged so far, your estimated self-assessment liability this year is £6,240. Allowable expenses tracked: £14,330. I've flagged 3 potential missing receipts that could reduce your bill by ~£680. Tip: the boiler replacement at Flat 3 may qualify for capital allowances — worth checking with your accountant.`, actions: [{ type: "tax", label: "Estimated liability", value: "£6,240", color: "#b8962e" }, { type: "saving", label: "Missing receipts", value: "~£680 saving possible", color: "#16a34a" }, { type: "tip", label: "Capital allowance flag", value: "Boiler — Flat 3", color: "#2563eb" }], newContext: null };
  }

  if (i.includes("section 21") || i.includes("s21") || i.includes("evict") || i.includes("possession")) {
    return { reply: `I've flagged this as a potential possession matter. To serve a valid Section 21, you'll need to confirm: gas safety certificate served, deposit protected and prescribed info served, EPC provided, How to Rent guide served, and no outstanding repairs. Which property is this for?`, actions: [{ type: "legal", label: "S21 checklist", value: "Pre-check required", color: "#dc2626" }, { type: "compliance", label: "Deposit status", value: "Verify protection", color: "#d97706" }, { type: "tip", label: "Legal tip", value: "Seek solicitor advice", color: "#2563eb" }], newContext: null };
  }

  if (i.includes("hmo") || i.includes("licence") || i.includes("license") || i.includes("selective")) {
    return { reply: `HMO licensing noted. I've added a licence tracker to your compliance dashboard. If this is a mandatory HMO (5+ occupants, 2+ households), you'll need an HMO licence from your local council. Tell me the postcode and I'll flag your local authority requirements.`, actions: [{ type: "compliance", label: "Licence tracker", value: "Added to dashboard", color: "#2563eb" }, { type: "alert", label: "Council check", value: "Postcode needed", color: "#d97706" }], newContext: null };
  }

  if (i.includes("void") || i.includes("empty") || i.includes("vacant") || i.includes("no tenant")) {
    return { reply: `Void period logged for tax purposes. Ongoing costs during void (mortgage, bills, council tax) are noted as allowable expenses. I'll track the void duration and alert you if it passes 4 weeks.`, actions: [{ type: "record", label: "Void logged", value: "Tax noted", color: "#16a34a" }, { type: "tax", label: "Running costs", value: "Allowable expenses", color: "#b8962e" }, { type: "alert", label: "4-week alert", value: "Set", color: "#d97706" }], newContext: null };
  }

  if (i.includes("deposit") && (i.includes("protect") || i.includes("dps") || i.includes("tds") || i.includes("mydeposits") || i.includes("register"))) {
    return { reply: `Deposit protection noted. You must protect the deposit within 30 days of receiving it and serve the Prescribed Information to the tenant. I've added this to the compliance tracker. Which scheme are you using — DPS, TDS, or myDeposits?`, actions: [{ type: "compliance", label: "Deposit protection", value: "30-day deadline set", color: "#b8962e" }, { type: "action", label: "Prescribed Info", value: "Must be served", color: "#dc2626" }], newContext: null };
  }

  if (i.includes("gas safety") || i.includes("gsc") || i.includes("eicr") || i.includes("epc") || i.includes("certificate") || i.includes("boiler service") || i.includes("fire safety")) {
    const cert = i.includes("gas") ? "Gas Safety Certificate" : i.includes("eicr") ? "EICR" : i.includes("epc") ? "EPC" : "Certificate";
    return { reply: `${cert} logged and filed. I've extracted the expiry date and set a reminder 60 days before renewal is due. Certificate stored against the property record — you're required to serve a copy to tenants at the start of each new tenancy.`, actions: [{ type: "compliance", label: cert + " filed", value: "Expiry tracked", color: "#16a34a" }, { type: "alert", label: "60-day reminder", value: "Set automatically", color: "#d97706" }, { type: "action", label: "Tenant copy", value: "Required on new AST", color: "#2563eb" }], newContext: null };
  }

  if ((i.includes("rent") && (i.includes("increase") || i.includes("review") || i.includes("raise") || i.includes("market rate"))) || i.includes("section 13")) {
    return { reply: `Rent review initiated. Current market rate data suggests your property is £75-£120 below market. To increase rent on a periodic tenancy, serve a Section 13 notice with at least 1 month's notice. I can prepare the notice — what's the new amount you'd like to propose?`, actions: [{ type: "action", label: "S13 notice", value: "Ready to prepare", color: "#2563eb" }, { type: "market", label: "Market rate", value: "+£75-£120 gap", color: "#16a34a" }, { type: "alert", label: "Notice period", value: "1 month minimum", color: "#d97706" }], newContext: null };
  }

  // ── Fallback ──────────────────────────────────────────────────────────────

  const recognized = ["rent","tenant","property","maintenance","certificate","compliance","income","expense","deposit","landlord","letting","portfolio","invoice","flat","house","mortgage","contractor","insurance"].some(kw => i.includes(kw));

  if (i.length < 5) return { reply: "Can you give me a bit more detail? The more context you give, the more I can do.", actions: [], newContext: null };

  if (!recognized) return { reply: `I didn't quite catch that. Try something like:\n\n• "Bought a house in Sparkhill"\n• "Tenant paid £1,250 today for Maple Street"\n• "Boiler replaced at Flat 3, cost £650"\n• "Tenant at Oak Avenue hasn't paid this month"\n• "What should I focus on today?"\n\nThe more detail you give me, the more I can do.`, actions: [{ type: "help", label: "Examples above", value: "Try one", color: "#2563eb" }], newContext: null };

  return { reply: `Got it — I've noted that. In the live platform, Rentura would parse your message, update the right records, set any reminders, and flag anything that needs your attention. No forms. No menus. Just this.`, actions: [{ type: "ai", label: "Intent recognised", value: "Processing", color: "#2563eb" }, { type: "action", label: "Records would update", value: "Automatically", color: "#16a34a" }], newContext: null };
}

async function callRenturaAPI(history: APIHistory, userInput: string) {
  const res = await fetch("/api/rentura/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ history, userInput }),
  });
  if (!res.ok) throw new Error("API error");
  return res.json();
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const DEMO_PROMPTS = [
  { label: "Log a payment", text: "Tenant paid £1,250 today for 14 Maple Street." },
  { label: "Add a property", text: "Bought 22 Oak Avenue Manchester for £195,000." },
  { label: "Log maintenance", text: "Boiler replaced at Flat 3. Dave charged £650." },
  { label: "Report an issue", text: "Tenant at Park Road reported a leaking tap." },
  { label: "Check mortgages", text: "Show mortgages expiring this year." },
  { label: "Today's priorities", text: "What should I focus on today?" },
  { label: "Tax position", text: "How much tax am I likely to owe this year?" },
  { label: "Rent arrears", text: "Tenant at Oak Avenue hasn't paid this month." },
];

const COMPARISONS = [
  { task: "Add a new property", old: "Navigate to Properties → Add New → Fill 12-field form → Add mortgage separately → Add tenant separately → Link records manually", rentura: '"Bought 14 High Street Manchester for £220k. Barclays mortgage, 4.8% fixed. Tenant John pays £1,250/mo." → Done.' },
  { task: "Log a maintenance cost", old: "Go to Maintenance → New Issue → Choose property from dropdown → Select category → Fill description → Set priority → Save → Go to Financials → Add expense → Link to property", rentura: '"Boiler replaced at Flat 3. Cost £650." → Job logged. Expense categorised. Tax summary updated. Property history filed.' },
  { task: "Record a rent payment", old: "Open rent ledger → Find tenant → Click Record Payment → Enter amount → Enter date → Select payment method → Save → Check arrears separately", rentura: '"Tenant paid £1,100 today." → Logged. Ledger updated. Arrears cleared. Receipt created.' },
  { task: "Log compliance certificate", old: "Settings → Compliance → Select property → Select certificate type → Enter expiry date → Upload PDF → Set reminder manually", rentura: "Forward the certificate email to Rentura → Everything extracted, stored, dated and reminder set automatically." },
];

const PROACTIVE_ALERTS = [
  { icon: "⚠️", type: "Mortgage", urgency: "Urgent", msg: "14 Maple Street — Barclays fixed rate expires in 41 days. SVR reversion costs £284/month extra. Want me to prepare a broker brief?", detail: "Action needed now. SVR rate would be 7.49%. Monthly repayment increases from £642 to £926. I can generate a full broker brief with your property details, current rate, LTV and refinance options in one click." },
  { icon: "📋", type: "Compliance", urgency: "Action needed", msg: "Gas Safety at Flat 4, Grove Lane expires in 9 days. Last engineer was Dave Morris — shall I contact him to rebook?", detail: "Legal requirement: Gas Safety must be renewed annually. Failure to hold a valid certificate is a criminal offence under the Gas Safety (Installation and Use) Regulations 1998. Dave Morris last quoted £85. I have his number on file." },
  { icon: "💷", type: "Rent Review", urgency: "Opportunity", msg: "You haven't reviewed rent on 22 Park Road for 18 months. Market rate has increased to £950. Current rent: £795. Potential extra income: £1,860/year.", detail: "Comparable properties on the same street are achieving £940-£965/month. A Section 13 notice would require 1 month's notice on a monthly tenancy. I can prepare the notice now." },
  { icon: "🔧", type: "Maintenance Trend", urgency: "Advisory", msg: "22 Park Road has had 4 plumbing issues in 12 months. Total spend: £2,340. This may indicate a systemic issue.", detail: "Breakdown: Jan — leaking tap (£85), Mar — radiator valve (£120), Jul — boiler pressure (£340), Oct — bathroom leak (£1,795). Pattern suggests pipework age issue. A plumbing survey (est. £200-£400) could prevent a far larger repair bill." },
  { icon: "🧾", type: "Tax", urgency: "Review", msg: "3 contractor invoices have been received but not allocated to a property. This may affect your self-assessment.", detail: "Unallocated: Dave Morris £320 (15 Mar), ACS Plumbing £185 (22 Apr), Spark Electricals £240 (8 May). Total: £745 in allowable expenses currently missing from your SA estimate. Forward them or upload to link automatically." },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function TypewriterText({ text, speed = 16 }: { text: string; speed?: number }) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    setDisplayed("");
    let idx = 0;
    const t = setInterval(() => {
      if (idx <= text.length) { setDisplayed(text.slice(0, idx)); idx++; }
      else clearInterval(t);
    }, speed);
    return () => clearInterval(t);
  }, [text, speed]);
  return <>{displayed}</>;
}

function useFadeIn(delay = 0) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.06 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, style: { opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(22px)", transition: `opacity 0.65s ${delay}ms ease, transform 0.65s ${delay}ms ease` } as React.CSSProperties };
}

function WatermarkBg() {
  const items = [
    { l: "7%",  t: "8%",  r: -3, txt: "yield = (annual_rent ÷ property_value) × 100" },
    { l: "54%", t: "5%",  r:  5, txt: "LTV = outstanding_loan ÷ current_value" },
    { l: "1%",  t: "28%", r: -2, txt: "ROI = (profit ÷ total_investment) × 100" },
    { l: "61%", t: "24%", r:  4, txt: "NOI = gross_income − operating_expenses" },
    { l: "3%",  t: "50%", r: -1, txt: "cash_flow = rent − mortgage − maintenance" },
    { l: "40%", t: "46%", r:  3, txt: "GY = annual_rent ÷ purchase_price" },
    { l: "67%", t: "65%", r: -4, txt: "service_charge = annual_est ÷ 12" },
    { l: "6%",  t: "73%", r:  2, txt: "rental_growth = (new_rent − old_rent) ÷ old_rent" },
    { l: "36%", t: "85%", r: -3, txt: "BRRR = refinance_value − total_costs" },
    { l: "71%", t: "41%", r:  6, txt: "arrears = rent_due − payments_received" },
    { l: "18%", t: "60%", r: -5, txt: "stamp_duty = (purchase_price − threshold) × rate" },
    { l: "53%", t: "80%", r:  2, txt: "portfolio_yield = total_annual_rent ÷ total_value" },
    { l: "78%", t: "17%", r: -6, txt: "void_cost = mortgage + bills × void_weeks" },
    { l: "25%", t: "18%", r:  3, txt: "net_yield = (rent − expenses) ÷ value" },
  ];
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
      {items.map((it, idx) => (
        <span key={idx} style={{ position: "absolute", left: it.l, top: it.t, transform: `rotate(${it.r}deg)`, fontSize: 10.5, color: "rgba(0,0,0,0.042)", fontFamily: "Georgia, serif", whiteSpace: "nowrap", letterSpacing: "0.02em" }}>
          {it.txt}
        </span>
      ))}
    </div>
  );
}

function SectionBadge({ n, label }: { n: string; label: string }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 10, border: "1px solid rgba(17,17,17,0.16)", borderRadius: 100, padding: "5px 16px", fontSize: 10, fontWeight: 700, color: "rgba(17,17,17,0.42)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 26 }}>
      <span style={{ color: "rgba(17,17,17,0.24)" }}>§{n}</span>
      <span style={{ width: 1, height: 9, background: "rgba(17,17,17,0.12)", display: "inline-block" }} />
      {label}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RenturaPage() {
  const INITIAL_MSG: Message = { role: "ai", text: "Hi. Tell me what happened — or ask me anything about your portfolio. I'll handle the rest.", ts: "now" };

  const [messages, setMessages] = useState<Message[]>([INITIAL_MSG]);
  const [apiHistory, setApiHistory] = useState<APIHistory>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatContext, setChatContext] = useState<ConversationContext>(null);
  const [openCompare, setOpenCompare] = useState<number | null>(null);
  const [openAlert, setOpenAlert] = useState<number | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Early access form
  const [eaOpen, setEaOpen] = useState(false);
  const [eaName, setEaName] = useState("");
  const [eaEmail, setEaEmail] = useState("");
  const [eaPortfolio, setEaPortfolio] = useState("");
  const [eaLoading, setEaLoading] = useState(false);
  const [eaDone, setEaDone] = useState(false);
  const [eaError, setEaError] = useState("");

  const send = useCallback(async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: "user", text: text.trim(), ts: "just now" };
    setMessages(m => [...m, userMsg]);
    setInput("");
    setLoading(true);

    // Clear awaitingConfirm on any prior message
    setMessages(m => m.map((msg, i) => i < m.length - 1 ? { ...msg, awaitingConfirm: false } : msg));

    try {
      const result = await callRenturaAPI(apiHistory, text.trim());

      const newHistory: APIHistory = [
        ...apiHistory,
        { role: "user", content: text.trim() },
        { role: "assistant", content: result.reply },
      ];
      setApiHistory(newHistory);

      const aiMsg: Message = {
        role: "ai",
        text: result.reply,
        actions: result.actions || [],
        ts: "just now",
        awaitingConfirm: result.needsConfirmation === true,
        followUp: result.completed ? result.followUp : null,
      };
      setMessages(m => [...m, aiMsg]);
      setChatContext(null);
    } catch {
      // Fallback to keyword engine if API unavailable
      const { reply, actions, newContext } = parseMessage(text, chatContext);
      setApiHistory(h => [...h, { role: "user", content: text.trim() }, { role: "assistant", content: reply }]);
      setMessages(m => [...m, { role: "ai", text: reply, actions, ts: "just now" }]);
      setChatContext(newContext);
    }
    setLoading(false);
  }, [loading, chatContext, apiHistory]);

  const resetChat = useCallback(() => {
    setMessages([INITIAL_MSG]);
    setApiHistory([]);
    setInput("");
    setChatContext(null);
    inputRef.current?.focus();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  async function handleEarlyAccess(e: React.FormEvent) {
    e.preventDefault();
    setEaError("");
    if (!eaName.trim() || !eaEmail.trim()) { setEaError("Name and email are required."); return; }
    setEaLoading(true);
    try {
      await supabase.from("rentura_waitlist").insert({ name: eaName.trim(), email: eaEmail.trim(), portfolio: eaPortfolio.trim() || null, created_at: new Date().toISOString() });
      setEaDone(true);
    } catch {
      setEaError("Something went wrong — please try again.");
    } finally {
      setEaLoading(false);
    }
  }

  // Fade-in hooks for each section
  const f1 = useFadeIn(0);   const f2 = useFadeIn(80);  const f3 = useFadeIn(160);
  const f4 = useFadeIn(0);   const f5 = useFadeIn(0);   const f6 = useFadeIn(0);
  const f7 = useFadeIn(0);   const f8 = useFadeIn(0);   const f9 = useFadeIn(0);

  const BG = "#eceae2";
  const INK = "#111111";
  const INK2 = "rgba(17,17,17,0.52)";
  const INK3 = "rgba(17,17,17,0.30)";
  const BORDER = "rgba(17,17,17,0.09)";
  const BORDER_MED = "rgba(17,17,17,0.14)";
  const CARD_BG = "rgba(255,255,255,0.52)";
  const CTA = "#0f1728";
  const CHAT_BG = "#0c0f1a";
  const W = "100%";

  return (
    <div style={{ fontFamily: "var(--font-family-body)", background: BG, color: INK, minHeight: "100vh", position: "relative" }}>
      <WatermarkBg />

      {/* ── NAV ──────────────────────────────────────────────────────────────── */}
      <nav style={{ position: "relative", zIndex: 10, borderBottom: `1px solid ${BORDER}`, padding: "13px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", background: BG }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
          <Link href="/" style={{ color: INK3, textDecoration: "none", fontWeight: 500 }}>PropertyVault UK</Link>
          <span style={{ color: INK3 }}>›</span>
          <span style={{ color: INK, fontWeight: 800, letterSpacing: "-0.02em" }}>Rentura</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, fontWeight: 700, color: INK3, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#16a34a", display: "inline-block" }} />
          Early Access · Beta
        </div>
      </nav>

      {/* ── §01 HERO ─────────────────────────────────────────────────────────── */}
      <section style={{ position: "relative", zIndex: 1, padding: "88px 32px 80px", maxWidth: 1020, margin: "0 auto" }}>
        <div ref={f1.ref} style={f1.style}>
          <SectionBadge n="01" label="The Idea" />
          <h1 style={{ fontSize: "clamp(52px, 8vw, 102px)", fontWeight: 900, lineHeight: 0.92, letterSpacing: "-0.04em", marginBottom: 30, fontFamily: "var(--font-family-heading)", color: INK, maxWidth: 800 }}>
            Tell Rentura<br />what happened.
          </h1>
        </div>
        <div ref={f2.ref} style={f2.style}>
          <p style={{ fontSize: "clamp(18px, 2.2vw, 24px)", color: INK2, maxWidth: 560, lineHeight: 1.55, marginBottom: 40, fontWeight: 400 }}>
            No forms. No menus. No dashboards.<br />Just say what happened — Rentura handles the rest.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0 48px", marginBottom: 48, borderTop: `1px solid ${BORDER}`, paddingTop: 24 }}>
            {[["Type", "Conversational Property OS"], ["Built for", "UK Landlords"], ["Input", "Natural language · voice · email · WhatsApp"], ["Price", "£9.99 / month · Early Access"]].map(([k, v]) => (
              <div key={k} style={{ marginBottom: 12 }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: INK3, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 3 }}>{k}</p>
                <p style={{ fontSize: 14, color: INK2, fontWeight: 500 }}>{v}</p>
              </div>
            ))}
          </div>
        </div>
        <div ref={f3.ref} style={f3.style}>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a href="#ask" style={{ display: "inline-block", background: CTA, color: "white", fontWeight: 700, fontSize: 14, padding: "13px 32px", borderRadius: 10, textDecoration: "none", letterSpacing: "-0.01em" }}>Try the demo →</a>
            <a href="#compare" style={{ display: "inline-block", background: "transparent", border: `1px solid ${BORDER_MED}`, color: INK2, fontWeight: 600, fontSize: 14, padding: "13px 32px", borderRadius: 10, textDecoration: "none" }}>See how it compares</a>
          </div>
        </div>
      </section>

      {/* ── §02 DEMO ─────────────────────────────────────────────────────────── */}
      <section id="ask" style={{ position: "relative", zIndex: 1, padding: "0 32px 100px", maxWidth: 1020, margin: "0 auto" }}>
        <div ref={f4.ref} style={{ ...f4.style, borderTop: `1px solid ${BORDER}`, paddingTop: 72 }}>
          <SectionBadge n="02" label="The Demo" />
          <h2 style={{ fontSize: "clamp(30px, 5vw, 56px)", fontWeight: 900, letterSpacing: "-0.035em", marginBottom: 12, fontFamily: "var(--font-family-heading)", color: INK, lineHeight: 1 }}>Ask Rentura™</h2>
          <p style={{ fontSize: 15, color: INK2, marginBottom: 28, maxWidth: 480 }}>Type what happened — or pick a prompt. This is a live demo; a real portfolio would power every response.</p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 20 }}>
            {DEMO_PROMPTS.map(p => (
              <button key={p.label} onClick={() => send(p.text)} style={{ background: "rgba(255,255,255,0.6)", border: `1px solid ${BORDER_MED}`, borderRadius: 100, padding: "6px 15px", fontSize: 12, color: INK2, cursor: "pointer", fontWeight: 600, fontFamily: "inherit" }}>{p.label}</button>
            ))}
          </div>

          <div style={{ background: CHAT_BG, borderRadius: 18, overflow: "hidden", border: "1px solid rgba(255,255,255,0.06)", boxShadow: "0 24px 64px rgba(0,0,0,0.18)" }}>
            {/* Chrome */}
            <div style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "11px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ display: "flex", gap: 6 }}>
                  {["rgba(239,68,68,0.45)", "rgba(245,158,11,0.45)", "rgba(34,197,94,0.45)"].map((c, i) => <div key={i} style={{ width: 9, height: 9, borderRadius: "50%", background: c }} />)}
                </div>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.22)", fontFamily: "monospace", marginLeft: 8 }}>Rentura · Conversational OS · Live Demo</span>
              </div>
              {messages.length > 1 && (
                <button onClick={resetChat} style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", background: "none", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "3px 10px", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>Reset</button>
              )}
            </div>

            {/* Messages */}
            <div style={{ height: 420, overflowY: "auto", padding: "20px 20px 8px", display: "flex", flexDirection: "column", gap: 16 }}>
              {messages.map((msg, idx) => (
                <div key={idx} style={{ display: "flex", flexDirection: "column", alignItems: msg.role === "user" ? "flex-end" : "flex-start", gap: 8 }}>
                  <div style={{ maxWidth: "82%", background: msg.role === "user" ? "rgba(15,23,40,0.8)" : "rgba(255,255,255,0.05)", border: `1px solid ${msg.role === "user" ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.07)"}`, borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px", padding: "12px 16px" }}>
                    {msg.role === "ai" && <p style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.28)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.12em" }}>Rentura</p>}
                    <p style={{ fontSize: 13, color: msg.role === "user" ? "rgba(255,255,255,0.88)" : "rgba(255,255,255,0.72)", lineHeight: 1.7, whiteSpace: "pre-line" }}>
                      {idx === messages.length - 1 && msg.role === "ai" ? <TypewriterText text={msg.text} /> : msg.text}
                    </p>
                  </div>
                  {msg.actions && msg.actions.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, maxWidth: "82%" }}>
                      {msg.actions.map((a, ai) => (
                        <div key={ai} style={{ background: a.color + "14", border: `1px solid ${a.color}30`, borderRadius: 8, padding: "4px 11px", display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ width: 5, height: 5, borderRadius: "50%", background: a.color, flexShrink: 0 }} />
                          <span style={{ fontSize: 11, fontWeight: 700, color: a.color }}>{a.label}</span>
                          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.28)" }}>·</span>
                          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.44)" }}>{a.value}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Confirmation buttons */}
                  {msg.awaitingConfirm && idx === messages.length - 1 && (
                    <div style={{ display: "flex", gap: 8, maxWidth: "82%" }}>
                      <button onClick={() => send("Yes, confirmed — save that.")} style={{ flex: 1, background: "#16a34a", border: "none", borderRadius: 10, padding: "9px 16px", color: "white", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
                        Confirm & Save ✓
                      </button>
                      <button onClick={() => send("Actually, let me change something.")} style={{ flex: 1, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, padding: "9px 16px", color: "rgba(255,255,255,0.55)", fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
                        Edit
                      </button>
                    </div>
                  )}

                  {/* Follow-up suggestion */}
                  {msg.followUp && (
                    <div style={{ maxWidth: "82%" }}>
                      <p style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>Suggested next step</p>
                      <button onClick={() => send(msg.followUp!)} style={{ background: "rgba(255,255,255,0.04)", border: "1px dashed rgba(255,255,255,0.12)", borderRadius: 10, padding: "8px 14px", color: "rgba(255,255,255,0.5)", fontSize: 12, cursor: "pointer", fontFamily: "inherit", textAlign: "left", lineHeight: 1.5 }}>
                        {msg.followUp} →
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div>
                  <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px 16px 16px 4px", padding: "12px 16px", display: "inline-block" }}>
                    <p style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.28)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.12em" }}>Rentura</p>
                    <div style={{ display: "flex", gap: 5 }}>
                      {[0, 1, 2].map(d => <div key={d} style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(255,255,255,0.35)", animation: `bounce 0.8s ${d * 0.15}s infinite` }} />)}
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "14px 16px" }}>
              {chatContext && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, padding: "6px 12px", background: "rgba(37,99,235,0.1)", border: "1px solid rgba(37,99,235,0.2)", borderRadius: 8 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#3b82f6", flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>Gathering info for <strong style={{ color: "rgba(255,255,255,0.7)" }}>{chatContext.intent.replace(/_/g, " ")}</strong> — type <span style={{ color: "rgba(255,255,255,0.4)" }}>"cancel"</span> to stop</span>
                </div>
              )}
              <div style={{ display: "flex", gap: 10 }}>
                <input ref={inputRef} type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send(input)} placeholder="Tell me what happened, or ask anything…" style={{ flex: 1, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 10, padding: "11px 16px", color: "white", fontSize: 14, outline: "none", fontFamily: "inherit" }} />
                <button onClick={() => send(input)} disabled={loading || !input.trim()} style={{ background: input.trim() ? CTA : "rgba(255,255,255,0.06)", border: "none", borderRadius: 10, padding: "11px 20px", color: input.trim() ? "white" : "rgba(255,255,255,0.18)", fontWeight: 700, fontSize: 13, cursor: input.trim() ? "pointer" : "default", transition: "all 0.2s", flexShrink: 0, fontFamily: "inherit" }}>Send</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── §03 DIFFERENCE ───────────────────────────────────────────────────── */}
      <section style={{ position: "relative", zIndex: 1, borderTop: `1px solid ${BORDER}`, padding: "72px 32px 100px", maxWidth: 1020, margin: "0 auto" }}>
        <div ref={f5.ref} style={f5.style}>
          <SectionBadge n="03" label="The Difference" />
          <div className="rentura-grid-2">
            <div>
              <h2 style={{ fontSize: "clamp(28px, 3.8vw, 48px)", fontWeight: 900, letterSpacing: "-0.035em", lineHeight: 1.02, marginBottom: 16, fontFamily: "var(--font-family-heading)", color: INK }}>One sentence.<br />Everything done.</h2>
              <p style={{ fontSize: 15, color: INK2, lineHeight: 1.75, marginBottom: 24 }}>Every other platform asks you to navigate menus and fill forms. Rentura asks you what happened — and silently handles the rest.</p>
              <div style={{ borderLeft: `2px solid ${BORDER_MED}`, paddingLeft: 18 }}>
                {["7 steps replaced by 1 sentence", "Records updated automatically", "Tax, compliance and alerts — included", "No training required"].map(txt => (
                  <p key={txt} style={{ fontSize: 14, color: INK2, marginBottom: 10, lineHeight: 1.55 }}>— {txt}</p>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ background: "rgba(220,38,38,0.04)", border: "1px solid rgba(220,38,38,0.12)", borderRadius: 16, padding: "20px 22px" }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(220,38,38,0.6)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>Traditional software</p>
                {["Navigate to a menu", "Find the right form", "Fill multiple fields", "Link to the right property", "Save and confirm", "Repeat for each record"].map((s, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "center" }}>
                    <span style={{ fontSize: 10, color: "rgba(220,38,38,0.5)", background: "rgba(220,38,38,0.08)", borderRadius: "50%", width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontWeight: 700 }}>{i + 1}</span>
                    <span style={{ fontSize: 13, color: "rgba(17,17,17,0.45)" }}>{s}</span>
                  </div>
                ))}
                <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid rgba(220,38,38,0.1)" }}>
                  <p style={{ fontSize: 12, color: "rgba(220,38,38,0.7)", fontWeight: 600 }}>7 steps. 4 minutes. Landlord gives up.</p>
                </div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.65)", border: `1px solid ${BORDER_MED}`, borderRadius: 16, padding: "20px 22px" }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: INK3, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>Rentura</p>
                <p style={{ fontSize: 15, color: INK, fontFamily: "Georgia, serif", fontStyle: "italic", lineHeight: 1.6, marginBottom: 14 }}>&ldquo;Tenant paid £1,100 today.&rdquo;</p>
                {["Payment logged", "Rent ledger updated", "Arrears cleared", "Receipt created", "Tax record updated"].map(item => (
                  <div key={item} style={{ display: "flex", gap: 8, marginBottom: 7, alignItems: "center" }}>
                    <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#16a34a", flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: INK2 }}>{item}</span>
                    <span style={{ fontSize: 10, color: INK3, marginLeft: "auto", fontWeight: 600 }}>Auto</span>
                  </div>
                ))}
                <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${BORDER}` }}>
                  <p style={{ fontSize: 12, color: "#16a34a", fontWeight: 700 }}>1 sentence. 8 seconds. Everything done.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── §04 WORKFLOWS ────────────────────────────────────────────────────── */}
      <section id="compare" style={{ position: "relative", zIndex: 1, borderTop: `1px solid ${BORDER}`, padding: "72px 32px 100px", maxWidth: 1020, margin: "0 auto" }}>
        <div ref={f6.ref} style={f6.style}>
          <SectionBadge n="04" label="Every Workflow" />
          <h2 style={{ fontSize: "clamp(28px, 3.8vw, 48px)", fontWeight: 900, letterSpacing: "-0.035em", marginBottom: 12, fontFamily: "var(--font-family-heading)", color: INK, lineHeight: 1.02 }}>Every task. Simplified.</h2>
          <p style={{ fontSize: 15, color: INK2, marginBottom: 36, maxWidth: 480 }}>Tap any workflow to see the comparison.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {COMPARISONS.map((c, i) => (
              <div key={i} style={{ background: openCompare === i ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.38)", border: `1px solid ${openCompare === i ? BORDER_MED : BORDER}`, borderRadius: 14, overflow: "hidden", transition: "all 0.2s" }}>
                <button onClick={() => setOpenCompare(openCompare === i ? null : i)} style={{ width: W, background: "none", border: "none", padding: "16px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", color: INK, textAlign: "left", gap: 16, fontFamily: "inherit" }}>
                  <span style={{ fontSize: 15, fontWeight: 700 }}>{c.task}</span>
                  <span style={{ fontSize: 18, color: INK3, fontWeight: 300 }}>{openCompare === i ? "−" : "+"}</span>
                </button>
                {openCompare === i && (
                  <div style={{ padding: "0 22px 22px" }} className="rentura-compare-grid">
                    <div style={{ background: "rgba(220,38,38,0.04)", border: "1px solid rgba(220,38,38,0.1)", borderRadius: 12, padding: "14px 16px" }}>
                      <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(220,38,38,0.55)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Traditional</p>
                      <p style={{ fontSize: 13, color: INK2, lineHeight: 1.7 }}>{c.old}</p>
                    </div>
                    <div style={{ background: "rgba(255,255,255,0.65)", border: `1px solid ${BORDER_MED}`, borderRadius: 12, padding: "14px 16px" }}>
                      <p style={{ fontSize: 10, fontWeight: 700, color: INK3, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Rentura</p>
                      <p style={{ fontSize: 13, color: INK, lineHeight: 1.7, fontFamily: "Georgia, serif", fontStyle: "italic" }}>{c.rentura}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── §05 INPUT CHANNELS ───────────────────────────────────────────────── */}
      <section style={{ position: "relative", zIndex: 1, borderTop: `1px solid ${BORDER}`, padding: "72px 32px 100px", maxWidth: 1020, margin: "0 auto" }}>
        <div ref={f7.ref} style={f7.style}>
          <SectionBadge n="05" label="How You Speak To It" />
          <h2 style={{ fontSize: "clamp(28px, 3.8vw, 48px)", fontWeight: 900, letterSpacing: "-0.035em", marginBottom: 12, fontFamily: "var(--font-family-heading)", color: INK, lineHeight: 1.02 }}>Any way you want.</h2>
          <p style={{ fontSize: 15, color: INK2, marginBottom: 40, maxWidth: 480 }}>Type. Talk. Forward an email. Upload a document. WhatsApp. Rentura reads it all.</p>
          <div className="rentura-feature-grid">
            {[
              { icon: "💬", title: "Type it", eg: '"Boiler replaced at Flat 3. Cost £650."', result: "Job logged · Expense filed · Tax noted" },
              { icon: "🎤", title: "Say it", eg: '"Tenant at B11TU reported a leaking radiator. Dave visiting Friday, estimated £200."', result: "Issue created · Contractor task added · Cost estimated" },
              { icon: "📧", title: "Forward an email", eg: "Forward your gas certificate renewal email to Rentura", result: "Document read · Record updated · Reminder set" },
              { icon: "📄", title: "Upload a document", eg: "Upload a mortgage statement, invoice, or tenancy agreement", result: "AI extracts all data · No manual entry required" },
              { icon: "📱", title: "WhatsApp", eg: "Forward a contractor quote, tenant message, or invoice", result: "Filed to property · Workflow triggered" },
              { icon: "📸", title: "Photo or video", eg: "Tenant photos of damage, receipts, certificates", result: "AI reads image · Data extracted · Record updated" },
            ].map(ch => (
              <div key={ch.title} style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 16, padding: "22px 20px" }}>
                <div style={{ fontSize: 24, marginBottom: 12 }}>{ch.icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 10, color: INK }}>{ch.title}</h3>
                <div style={{ background: "rgba(17,17,17,0.04)", borderRadius: 10, padding: "10px 14px", marginBottom: 12 }}>
                  <p style={{ fontSize: 12, color: INK3, lineHeight: 1.6, fontFamily: "Georgia, serif", fontStyle: "italic" }}>&ldquo;{ch.eg}&rdquo;</p>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                  {ch.result.split(" · ").map(r => <span key={r} style={{ fontSize: 10, fontWeight: 700, padding: "2px 9px", borderRadius: 6, background: "rgba(17,17,17,0.06)", color: INK2 }}>{r}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── §06 CO-PILOT ─────────────────────────────────────────────────────── */}
      <section style={{ position: "relative", zIndex: 1, borderTop: `1px solid ${BORDER}`, padding: "72px 32px 100px", maxWidth: 1020, margin: "0 auto" }}>
        <div ref={f8.ref} style={f8.style}>
          <SectionBadge n="06" label="The Co-Pilot" />
          <div className="rentura-grid-2">
            <div>
              <h2 style={{ fontSize: "clamp(28px, 3.8vw, 46px)", fontWeight: 900, letterSpacing: "-0.035em", lineHeight: 1.02, marginBottom: 16, fontFamily: "var(--font-family-heading)", color: INK }}>It tells you first.</h2>
              <p style={{ fontSize: 15, color: INK2, lineHeight: 1.75, marginBottom: 16 }}>You don&apos;t need to ask. Rentura watches your portfolio constantly and surfaces issues before they become problems.</p>
              <p style={{ fontSize: 13, color: INK3, lineHeight: 1.7 }}>Tap any alert below to see exactly what Rentura would do.</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {PROACTIVE_ALERTS.map((alert, i) => (
                <div key={i} style={{ background: CARD_BG, border: `1px solid ${openAlert === i ? BORDER_MED : BORDER}`, borderRadius: 14, overflow: "hidden", transition: "all 0.2s" }}>
                  <button onClick={() => setOpenAlert(openAlert === i ? null : i)} style={{ width: W, background: "none", border: "none", padding: "14px 18px", display: "flex", gap: 12, alignItems: "flex-start", cursor: "pointer", textAlign: "left", fontFamily: "inherit" }}>
                    <span style={{ fontSize: 17, flexShrink: 0, marginTop: 1 }}>{alert.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: INK, background: "rgba(17,17,17,0.07)", padding: "2px 9px", borderRadius: 20 }}>{alert.type}</span>
                        <span style={{ fontSize: 10, color: INK3, fontWeight: 600 }}>{alert.urgency}</span>
                      </div>
                      <p style={{ fontSize: 13, color: INK2, lineHeight: 1.6 }}>{alert.msg}</p>
                    </div>
                    <span style={{ fontSize: 14, color: INK3, fontWeight: 300, flexShrink: 0, marginTop: 2 }}>{openAlert === i ? "−" : "+"}</span>
                  </button>
                  {openAlert === i && (
                    <div style={{ padding: "0 18px 18px", paddingLeft: 48 }}>
                      <div style={{ background: "rgba(17,17,17,0.04)", borderRadius: 12, padding: "12px 16px", borderLeft: `3px solid rgba(17,17,17,0.15)` }}>
                        <p style={{ fontSize: 11, fontWeight: 700, color: INK3, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>What Rentura would do</p>
                        <p style={{ fontSize: 13, color: INK2, lineHeight: 1.7 }}>{alert.detail}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── §07 PROPERTY MEMORY ──────────────────────────────────────────────── */}
      <section style={{ position: "relative", zIndex: 1, borderTop: `1px solid ${BORDER}`, padding: "72px 32px 100px", maxWidth: 1020, margin: "0 auto" }}>
        <div ref={f9.ref} style={f9.style}>
          <SectionBadge n="07" label="Property Memory" />
          <div className="rentura-grid-2">
            <div>
              <h2 style={{ fontSize: "clamp(28px, 3.8vw, 46px)", fontWeight: 900, letterSpacing: "-0.035em", lineHeight: 1.02, marginBottom: 16, fontFamily: "var(--font-family-heading)", color: INK }}>Every property<br />remembers everything.</h2>
              <p style={{ fontSize: 15, color: INK2, lineHeight: 1.75, marginBottom: 20 }}>Every conversation, every contractor visit, every payment, every inspection — permanently attached to the property record.</p>
              <p style={{ fontSize: 13, color: INK3, lineHeight: 1.7 }}>Sell the property? History exports with it. Switch letting agents? Your data stays with you. Cancel? Full data export — no lock-in.</p>
            </div>
            <div style={{ background: CARD_BG, border: `1px solid ${BORDER_MED}`, borderRadius: 18, overflow: "hidden" }}>
              <div style={{ padding: "16px 20px", borderBottom: `1px solid ${BORDER}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 800, color: INK }}>22 Oak Avenue, Manchester</p>
                  <p style={{ fontSize: 11, color: INK3 }}>Property Timeline</p>
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: "rgba(22,163,74,0.1)", color: "#16a34a" }}>Live</span>
              </div>
              <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { date: "Jun 2026", event: "Rent reviewed — increased £900 → £975", color: "#16a34a" },
                  { date: "May 2026", event: "EICR certificate uploaded and filed", color: "#b8962e" },
                  { date: "Mar 2026", event: "Tenant reported damp — resolved in 6 days", color: "#2563eb" },
                  { date: "Jan 2026", event: "Mortgage reviewed — retained Barclays 4.2%", color: "#7c3aed" },
                  { date: "Nov 2025", event: "New tenant moved in — AST signed digitally", color: "#0891b2" },
                  { date: "Jul 2025", event: "Property purchased — £195,000", color: "#b8962e" },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 4 }}>
                      <div style={{ width: 7, height: 7, borderRadius: "50%", background: item.color, flexShrink: 0 }} />
                      {i < 5 && <div style={{ width: 1, height: 22, background: BORDER_MED, marginTop: 3 }} />}
                    </div>
                    <div>
                      <p style={{ fontSize: 10, color: INK3, marginBottom: 2, fontWeight: 600 }}>{item.date}</p>
                      <p style={{ fontSize: 13, color: INK2 }}>{item.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── §08 EARLY ACCESS ─────────────────────────────────────────────────── */}
      <section id="early-access" style={{ position: "relative", zIndex: 1, borderTop: `1px solid ${BORDER}`, padding: "72px 32px 100px", maxWidth: 640, margin: "0 auto" }}>
        <SectionBadge n="08" label="Early Access" />
        <h2 style={{ fontSize: "clamp(28px, 4vw, 50px)", fontWeight: 900, letterSpacing: "-0.035em", marginBottom: 12, fontFamily: "var(--font-family-heading)", color: INK, lineHeight: 1.02 }}>£9.99 / month.<br />Cancel anytime.</h2>
        <p style={{ fontSize: 15, color: INK2, marginBottom: 36, maxWidth: 440 }}>Early access members lock in this price permanently. No contract. No setup fee.</p>
        <div style={{ background: CARD_BG, border: `1px solid ${BORDER_MED}`, borderRadius: 20, padding: "32px 30px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
            {[["Ask Rentura™", "Natural language — the only interface you need"], ["Voice notes", "Talk to Rentura on the move"], ["Email forwarding", "Forward certificates, invoices, statements"], ["Document AI", "Upload anything — AI extracts everything"], ["Property Memory", "Complete history for every property, forever"], ["AI Co-Pilot", "Proactive alerts before you notice a problem"], ["Maintenance workflow", "AI triage, contractor dispatch, full tracking"], ["Tax Intelligence", "Live liability estimate, receipt capture, expense tagging"], ["Mortgage Intelligence", "Expiry alerts, rate comparisons, broker brief generation"], ["Compliance Engine", "Never miss a certificate, licence, or deadline"], ["Tenant Portal", "Premium self-service portal for your tenants"], ["WhatsApp integration", "Forward anything, get updates anywhere"]].map(([feature, desc]) => (
              <div key={feature} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <span style={{ color: "#16a34a", fontWeight: 800, flexShrink: 0, fontSize: 13, marginTop: 1 }}>✓</span>
                <div><span style={{ fontSize: 14, color: INK, fontWeight: 600 }}>{feature}</span><span style={{ fontSize: 13, color: INK3, marginLeft: 6 }}>— {desc}</span></div>
              </div>
            ))}
          </div>

          {eaDone ? (
            <div style={{ background: "rgba(22,163,74,0.07)", border: "1px solid rgba(22,163,74,0.18)", borderRadius: 14, padding: "24px", textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>✓</div>
              <p style={{ fontSize: 16, fontWeight: 800, color: INK, marginBottom: 6 }}>You&apos;re on the list.</p>
              <p style={{ fontSize: 13, color: INK2, lineHeight: 1.65 }}>We&apos;ll be in touch within 24 hours with your early access details.</p>
            </div>
          ) : eaOpen ? (
            <form onSubmit={handleEarlyAccess} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input type="text" placeholder="Your full name" value={eaName} onChange={e => setEaName(e.target.value)} required style={{ background: "rgba(17,17,17,0.04)", border: `1px solid ${BORDER_MED}`, borderRadius: 10, padding: "11px 14px", fontSize: 14, color: INK, outline: "none", fontFamily: "inherit", width: "100%", boxSizing: "border-box" as const }} />
              <input type="email" placeholder="Email address" value={eaEmail} onChange={e => setEaEmail(e.target.value)} required style={{ background: "rgba(17,17,17,0.04)", border: `1px solid ${BORDER_MED}`, borderRadius: 10, padding: "11px 14px", fontSize: 14, color: INK, outline: "none", fontFamily: "inherit", width: "100%", boxSizing: "border-box" as const }} />
              <input type="text" placeholder="Portfolio size e.g. 3 properties, Birmingham" value={eaPortfolio} onChange={e => setEaPortfolio(e.target.value)} style={{ background: "rgba(17,17,17,0.04)", border: `1px solid ${BORDER_MED}`, borderRadius: 10, padding: "11px 14px", fontSize: 14, color: INK, outline: "none", fontFamily: "inherit", width: "100%", boxSizing: "border-box" as const }} />
              {eaError && <p style={{ fontSize: 12, color: "#dc2626", padding: "8px 12px", background: "rgba(220,38,38,0.06)", borderRadius: 8 }}>{eaError}</p>}
              <button type="submit" disabled={eaLoading} style={{ background: eaLoading ? "rgba(15,23,40,0.5)" : CTA, color: "white", fontWeight: 700, fontSize: 15, padding: "14px", borderRadius: 12, border: "none", cursor: eaLoading ? "not-allowed" : "pointer", fontFamily: "inherit" }}>{eaLoading ? "Submitting…" : "Request Early Access →"}</button>
              <button type="button" onClick={() => setEaOpen(false)} style={{ background: "none", border: "none", fontSize: 12, color: INK3, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
            </form>
          ) : (
            <button onClick={() => setEaOpen(true)} style={{ display: "block", width: W, textAlign: "center", background: CTA, color: "white", fontWeight: 700, fontSize: 15, padding: "16px", borderRadius: 12, border: "none", cursor: "pointer", marginBottom: 14, letterSpacing: "-0.01em", fontFamily: "inherit" }}>Request Early Access →</button>
          )}
          {!eaOpen && !eaDone && (
            <p style={{ fontSize: 11, color: INK3, textAlign: "center", lineHeight: 1.7, marginTop: 12 }}>Early access price locked in permanently · 14-day money-back guarantee<br />Consumer Contracts Regulations 2013 · Cancel anytime</p>
          )}
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
      <footer style={{ position: "relative", zIndex: 1, borderTop: `1px solid ${BORDER}`, padding: "32px", display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontSize: 15, fontWeight: 900, letterSpacing: "-0.03em", color: INK, marginBottom: 3 }}>Rentura</p>
          <p style={{ fontSize: 11, color: INK3 }}>by PropertyVault UK · Conversational OS for Landlords</p>
        </div>
        <p style={{ fontSize: 11, color: INK3, maxWidth: 460, lineHeight: 1.65, textAlign: "right" }}>
          Nothing on this page constitutes financial, legal, tax, or mortgage advice. AI-generated insights are indicative only. © {new Date().getFullYear()} PropertyVault UK.
        </p>
        <div style={{ width: W, display: "flex", gap: 24, paddingTop: 8 }}>
          {[["Home", "/"], ["Privacy", "/privacy"], ["Terms", "/terms"], ["Academy", "/academy"]].map(([l, h]) => (
            <Link key={l} href={h} style={{ fontSize: 12, color: INK3, textDecoration: "none" }}>{l}</Link>
          ))}
        </div>
      </footer>

      <style>{`
        /* Hide global header/footer on this page */
        body > header { display: none !important; }
        body > footer { display: none !important; }

        /* Responsive grids */
        .rentura-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: start; }
        .rentura-compare-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .rentura-feature-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(270px, 1fr)); gap: 16px; }

        @media (max-width: 768px) {
          .rentura-grid-2 { grid-template-columns: 1fr !important; gap: 32px !important; }
          .rentura-compare-grid { grid-template-columns: 1fr !important; gap: 10px !important; }
          section { padding-left: 20px !important; padding-right: 20px !important; }
          nav { padding-left: 20px !important; padding-right: 20px !important; }
          footer { padding: 24px 20px !important; }
        }

        /* Dark mode — force cream regardless of system preference */
        @media (prefers-color-scheme: dark) {
          div[style*="background: #eceae2"],
          div[style*="background:#eceae2"] { background: #eceae2 !important; color: #111111 !important; }
        }

        /* Bounce animation */
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.35; }
          40% { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
