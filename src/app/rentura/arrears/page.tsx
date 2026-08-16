"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { RenturaSidebar } from "@/components/rentura/RenturaSidebar";

// ── Palette ────────────────────────────────────────────────────────────────────
const C = {
  bg: "#0c0f1a", card: "rgba(255,255,255,0.03)", border: "rgba(255,255,255,0.07)",
  ink: "rgba(255,255,255,0.85)", ink2: "rgba(255,255,255,0.45)", ink3: "rgba(255,255,255,0.22)",
  gold: "#c9a84c", green: "#22c55e", red: "#ef4444", amber: "#f59e0b",
  blue: "#3b82f6", orange: "#f97316", purple: "#8b5cf6",
};

// ── Types ──────────────────────────────────────────────────────────────────────
interface ArrearsCase {
  id: string; user_id: string; tenant_id: string; property_id: string | null;
  stage: 1 | 2 | 3 | 4 | 5; status: "active" | "resolved" | "court";
  total_owed: number; monthly_rent: number;
  first_missed_date: string; last_payment_date: string | null;
  notes: string | null; created_at: string;
}
interface ArrearsEvent {
  id: string; arrears_id: string; event_type: string;
  stage: number | null; note: string | null; amount: number | null;
  date: string; created_at: string;
}
interface Tenant {
  id: string; first_name: string; last_name: string;
  email: string | null; phone: string | null;
  monthly_rent: number | null; property_id: string | null; status: string;
}
interface Property { id: string; address: string }

// ── Stage config ───────────────────────────────────────────────────────────────
const STAGES = [
  { n: 1, label: "Missed Payment",  short: "Missed",   days: "Day 1–7",    color: C.blue,   hint: "Attempt phone/email contact immediately" },
  { n: 2, label: "Written Warning", short: "Warning",  days: "Day 7–28",   color: C.amber,  hint: "Send formal letter by recorded post" },
  { n: 3, label: "Final Demand",    short: "Demand",   days: "Day 28–56",  color: C.orange, hint: "Last chance before legal action" },
  { n: 4, label: "Section 8 Notice",short: "S8 Notice",days: "2+ months",  color: C.red,    hint: "Serve Form 3 — 3+ months arrears required (Renters' Rights Act 2025)" },
  { n: 5, label: "Court Claim",     short: "Court",    days: "Post-notice", color: C.purple, hint: "File N5B possession claim at county court" },
] as const;

const EVENT_ICONS: Record<string, string> = {
  opened: "○", stage_change: "▶", payment: "£", contact: "☏",
  letter_sent: "✉", note: "✎", resolved: "✓",
};
const EVENT_COLORS: Record<string, string> = {
  opened: C.ink3, stage_change: C.blue, payment: C.green, contact: C.amber,
  letter_sent: C.purple, note: C.ink2, resolved: C.green,
};

// ── Helpers ────────────────────────────────────────────────────────────────────
function fmt(n: number) { return "£" + n.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
function fmtDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}
function weeksOverdue(firstMissed: string): number {
  return Math.floor((Date.now() - new Date(firstMissed).getTime()) / (7 * 86400000));
}
function today() { return new Date().toISOString().split("T")[0]; }

// ── Letter template engine ─────────────────────────────────────────────────────
interface LetterData {
  landlordName: string; landlordEmail: string; landlordPhone: string;
  tenantFirstName: string; tenantFullName: string;
  propertyAddress: string; monthlyRent: number; totalOwed: number;
  firstMissedDate: string; todayDate: string; weeksOd: number;
}

function letterCSS() {
  return `
    body { font-family: 'Times New Roman', Times, serif; font-size: 12pt; color: #000; margin: 40px 60px; line-height: 1.6 }
    h2 { font-size: 13pt; margin: 0 0 6px; }
    p { margin: 0 0 14px; }
    .ref { font-weight: bold; text-decoration: underline; }
    .sender { margin-bottom: 28px; }
    .recipient { margin-bottom: 28px; }
    .date { margin-bottom: 28px; }
    .footer { margin-top: 48px; }
    .box { border: 1px solid #000; padding: 12px 16px; margin: 16px 0; }
    .bold { font-weight: bold; }
    .warn { font-weight: bold; text-transform: uppercase; }
    hr { border: none; border-top: 1px solid #ccc; margin: 20px 0; }
    ul { margin: 0 0 14px; padding-left: 22px; }
    li { margin-bottom: 5px; }
    .stage-badge { display: inline-block; border: 1px solid #000; padding: 2px 8px; font-size: 10pt; }
    @media print { body { margin: 20px 40px; } }
  `;
}

function printLetter(html: string, title: string) {
  const w = window.open("", "_blank");
  if (!w) { alert("Please allow pop-ups to print letters."); return; }
  w.document.write(`<!DOCTYPE html><html><head><title>${title}</title><style>${letterCSS()}</style></head><body>${html}</body></html>`);
  w.document.close();
  setTimeout(() => { w.focus(); w.print(); }, 400);
}

function letter1(d: LetterData) {
  return `
<div class="sender">
  <p>${d.landlordName}<br>${d.landlordEmail}${d.landlordPhone ? `<br>${d.landlordPhone}` : ""}</p>
</div>
<div class="date"><p>${fmtDate(d.todayDate)}</p></div>
<div class="recipient">
  <p>${d.tenantFullName}<br>${d.propertyAddress}</p>
</div>
<p class="ref">Re: Rent Payment Reminder — ${d.propertyAddress}</p>
<p>Dear ${d.tenantFirstName},</p>
<p>I hope you are well. I am writing to let you know that your rent payment of <strong>${fmt(d.monthlyRent)}</strong>, which was due on ${fmtDate(d.firstMissedDate)}, does not appear to have been received into my account.</p>
<p>I appreciate that payments can sometimes be delayed and this may simply be an oversight. Could you please arrange payment as soon as possible, or contact me if you are experiencing any difficulties? I am happy to discuss the situation.</p>
<p>If you have already made this payment, please ignore this letter and accept my apologies for the inconvenience.</p>
<p>You can reach me by email at ${d.landlordEmail}${d.landlordPhone ? ` or by phone on ${d.landlordPhone}` : ""}.</p>
<p>Thank you for your prompt attention to this matter.</p>
<div class="footer">
  <p>Yours sincerely,</p>
  <br><br>
  <p><strong>${d.landlordName}</strong><br>Landlord</p>
</div>`;
}

function letter2(d: LetterData) {
  return `
<div class="sender">
  <p><strong>${d.landlordName}</strong><br>${d.landlordEmail}${d.landlordPhone ? `<br>${d.landlordPhone}` : ""}</p>
</div>
<div class="date"><p>${fmtDate(d.todayDate)}</p></div>
<div class="recipient">
  <p>${d.tenantFullName}<br>${d.propertyAddress}</p>
</div>
<p class="ref">FORMAL NOTICE OF RENT ARREARS — ${d.propertyAddress}</p>
<p>Dear ${d.tenantFirstName},</p>
<p>I write to formally notify you that rent payments due under your tenancy agreement at the above address are now in arrears.</p>
<div class="box">
  <p class="bold">Outstanding balance as at ${fmtDate(d.todayDate)}:</p>
  <p>Monthly rent: ${fmt(d.monthlyRent)}<br>
  Weeks overdue: ${d.weeksOd}<br>
  <strong>Total outstanding: ${fmt(d.totalOwed)}</strong></p>
</div>
<p>This is a formal notice requiring you to pay the outstanding amount of <strong>${fmt(d.totalOwed)}</strong> within <strong>seven (7) days</strong> of the date of this letter, being by <strong>${fmtDate(new Date(new Date(d.todayDate).getTime() + 7*86400000).toISOString().split("T")[0])}</strong>.</p>
<p>If you are experiencing financial difficulty, I strongly urge you to seek independent advice as a matter of urgency. Free advice is available from:</p>
<ul>
  <li>Shelter — shelter.org.uk / 0808 800 4444</li>
  <li>Citizens Advice — citizensadvice.org.uk / 0800 144 8848</li>
  <li>National Debtline — nationaldebtline.org / 0808 808 4000</li>
</ul>
<p>If you wish to discuss a payment plan, please contact me within the next seven days. I will consider reasonable proposals, however any agreement must be made in writing.</p>
<p>Please treat this matter as urgent. Failure to make payment or contact me within seven days may result in further action being taken.</p>
<div class="footer">
  <p>Yours faithfully,</p>
  <br><br>
  <p><strong>${d.landlordName}</strong><br>Landlord<br>${d.landlordEmail}</p>
</div>`;
}

function letter3(d: LetterData) {
  const deadline = new Date(new Date(d.todayDate).getTime() + 7*86400000).toISOString().split("T")[0];
  return `
<div class="sender">
  <p><strong>${d.landlordName}</strong><br>${d.landlordEmail}${d.landlordPhone ? `<br>${d.landlordPhone}` : ""}</p>
</div>
<div class="date"><p>${fmtDate(d.todayDate)}</p></div>
<div class="recipient">
  <p>${d.tenantFullName}<br>${d.propertyAddress}</p>
</div>
<p class="warn ref">FINAL DEMAND — RENT ARREARS — IMMEDIATE ACTION REQUIRED</p>
<p>Dear ${d.tenantFirstName},</p>
<p>Despite previous correspondence, I note that your rent arrears at the above property remain unpaid. This letter constitutes a <strong>FINAL DEMAND</strong> before I take formal legal action to recover possession of the property.</p>
<div class="box">
  <p class="bold">Statement of arrears as at ${fmtDate(d.todayDate)}:</p>
  <p>Monthly rent: ${fmt(d.monthlyRent)}<br>
  First missed payment: ${fmtDate(d.firstMissedDate)}<br>
  Weeks in arrears: ${d.weeksOd}<br>
  <strong class="warn">TOTAL OWING: ${fmt(d.totalOwed)}</strong></p>
</div>
<p>I require payment in full of <strong>${fmt(d.totalOwed)}</strong> by <strong>${fmtDate(deadline)}</strong>.</p>
<p>If payment in full is not received by this date, or if you do not contact me to agree a written payment arrangement by this date, I intend to serve a <strong>Section 8 Notice</strong> under the Housing Act 1988 (as amended), citing Grounds 8, 10, and 11 of Schedule 2.</p>
<p>Service of a Section 8 Notice is the first step in court proceedings for possession of the property. If a possession order is granted, you may also be liable for court costs and any legal fees incurred.</p>
<p class="bold">I strongly urge you to seek independent housing and debt advice immediately:</p>
<ul>
  <li>Shelter — shelter.org.uk / <strong>0808 800 4444</strong> (free, 24/7)</li>
  <li>Citizens Advice — citizensadvice.org.uk / <strong>0800 144 8848</strong></li>
  <li>National Debtline — <strong>0808 808 4000</strong></li>
</ul>
<p>If you believe this letter has been sent in error or you have evidence that payment has been made, please contact me immediately with proof of payment.</p>
<div class="footer">
  <p>Yours faithfully,</p>
  <br><br>
  <p><strong>${d.landlordName}</strong><br>Landlord<br>${d.landlordEmail}${d.landlordPhone ? `<br>${d.landlordPhone}` : ""}</p>
  <hr>
  <p style="font-size:10pt;color:#555">Sent by: <em>[circle one: Recorded Delivery / Hand delivery / Email — keep proof of service]</em></p>
</div>`;
}

function letter4(d: LetterData) {
  const months = (d.totalOwed / d.monthlyRent).toFixed(1);
  const g8eligible = d.totalOwed >= d.monthlyRent * 3;
  const noticeExpiry = new Date(new Date(d.todayDate).getTime() + 28*86400000).toISOString().split("T")[0];
  return `
<p style="border:2px solid #c00;padding:10px;font-size:11pt;"><strong>IMPORTANT — READ BEFORE PRINTING</strong><br>
This document is a guide for completing the official <strong>Section 8 Notice (Form 3)</strong>, available free from <strong>gov.uk/government/publications/form-3-notice-seeking-possession</strong>.<br>
Do NOT use this document as the notice itself. Always use the current official form. Consider taking legal advice before serving.</p>

<h2 style="margin-top:20px;">Section 8 Notice — Pre-completion Guide</h2>
<p>Property: <strong>${d.propertyAddress}</strong><br>
Tenant: <strong>${d.tenantFullName}</strong><br>
Prepared: <strong>${fmtDate(d.todayDate)}</strong></p>

<hr>
<h2>1. Prerequisites checklist — must ALL be in place before serving</h2>
<ul>
  <li>☐ Valid Gas Safety Certificate (annual — served to tenant within 28 days)</li>
  <li>☐ Valid EPC (minimum rating E)</li>
  <li>☐ "How to Rent" guide served to current tenant</li>
  <li>☐ Deposit protected + Prescribed Information served within 30 days of receipt</li>
  <li>☐ No outstanding local authority improvement/prohibition notices</li>
</ul>
<p><strong>Warning:</strong> If any prerequisite is missing, the court may refuse to grant a possession order.</p>

<hr>
<h2>2. Grounds to cite on Form 3</h2>
<div class="box">
  <p><strong>Arrears summary:</strong> ${fmt(d.totalOwed)} owed / ${fmt(d.monthlyRent)} monthly rent = approximately <strong>${months} months in arrears</strong></p>
  ${g8eligible
    ? `<p><strong>Ground 8 (Mandatory)</strong> — Tick this ground. At the date of the notice AND at the date of the court hearing the tenant must owe at least 3 months' rent (Renters' Rights Act 2025). Court MUST grant possession if proven.</p>`
    : `<p><strong>Ground 8 is NOT yet available</strong> — Arrears are below 3 months. Continue escalation until 3 months is reached before serving, or use Ground 10/11 only (discretionary — court may or may not grant possession).</p>`
  }
  <p><strong>Ground 10 (Discretionary)</strong> — Tick this ground. Some rent is unpaid or in arrears at notice AND at hearing date.</p>
  <p><strong>Ground 11 (Discretionary)</strong> — Tick this ground if the tenant has persistently paid late, even if not in arrears at the time.</p>
</div>

<hr>
<h2>3. Key dates for Form 3</h2>
<ul>
  <li>Date of notice: <strong>${fmtDate(d.todayDate)}</strong></li>
  <li>Notice period: <strong>4 weeks minimum</strong> (Ground 8/10 under the Renters' Rights Act 2025)</li>
  <li>Earliest date proceedings can begin: <strong>${fmtDate(noticeExpiry)}</strong></li>
</ul>
<p>Note: Under the Renters' Rights Act 2025 (now in force), the minimum notice period for Grounds 8 and 10 is 4 weeks.</p>

<hr>
<h2>4. How to serve the notice</h2>
<ul>
  <li><strong>Recorded Delivery</strong> (Royal Mail Signed For or Special Delivery) — keep the tracking reference and delivery confirmation</li>
  <li><strong>Hand delivery</strong> — obtain a witness and take a dated photograph of the letterbox</li>
  <li><strong>Process server / bailiff</strong> — professional service, produces a statement of service</li>
</ul>
<p><strong>Do NOT serve by email or text unless the tenancy agreement expressly permits it.</strong></p>

<hr>
<h2>5. After the notice period expires</h2>
<p>If the tenant remains in arrears and does not vacate, you may begin court proceedings by filing a <strong>N5B claim form</strong> at your local county court money claims centre. The court fee is currently £325 (check gov.uk for current fee). Attach:</p>
<ul>
  <li>Completed N5B form</li>
  <li>Copy of the tenancy agreement</li>
  <li>Copy of the Section 8 notice and proof of service</li>
  <li>Schedule of arrears (amount owed, when each payment was missed)</li>
  <li>Evidence of prerequisites served (Gas Safety, EPC, How to Rent, PI)</li>
</ul>

<hr>
<h2>6. Your arrears schedule (attach to court papers)</h2>
<div class="box">
  <p>Property: ${d.propertyAddress}<br>
  Tenant: ${d.tenantFullName}<br>
  Monthly rent: ${fmt(d.monthlyRent)}<br>
  First missed payment: ${fmtDate(d.firstMissedDate)}<br>
  Total owed at date of notice: <strong>${fmt(d.totalOwed)}</strong><br>
  Weeks in arrears: ${d.weeksOd}</p>
</div>

<hr>
<p style="font-size:10pt;color:#555">This document is for guidance only and does not constitute legal advice. Always consult a solicitor or licensed housing legal professional before commencing possession proceedings. Download the current Form 3 from gov.uk.</p>`;
}

// ── Letter launcher ────────────────────────────────────────────────────────────
function buildLetterData(c: ArrearsCase, tenant: Tenant | undefined, property: Property | undefined, landlordName: string, landlordEmail: string, landlordPhone: string): LetterData {
  return {
    landlordName: landlordName || "Your Landlord",
    landlordEmail,
    landlordPhone,
    tenantFirstName: tenant?.first_name ?? "Tenant",
    tenantFullName: tenant ? `${tenant.first_name} ${tenant.last_name}`.trim() : "Tenant",
    propertyAddress: property?.address ?? "the property",
    monthlyRent: c.monthly_rent,
    totalOwed: c.total_owed,
    firstMissedDate: c.first_missed_date,
    todayDate: today(),
    weeksOd: weeksOverdue(c.first_missed_date),
  };
}

// ── UI helpers ─────────────────────────────────────────────────────────────────
const inp: React.CSSProperties = {
  width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 7, padding: "9px 11px", fontSize: 13, color: C.ink,
  outline: "none", boxSizing: "border-box", fontFamily: "inherit",
};
const inpSm: React.CSSProperties = { ...inp, padding: "7px 10px", fontSize: 12 };

function Lbl({ children }: { children: React.ReactNode }) {
  return <label style={{ fontSize: 11, fontWeight: 700, color: C.ink3, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 5 }}>{children}</label>;
}
function StagePill({ stage }: { stage: number }) {
  const s = STAGES[stage - 1];
  return <span style={{ fontSize: 10, fontWeight: 800, background: s.color + "20", color: s.color, padding: "2px 8px", borderRadius: 10, border: `1px solid ${s.color}40` }}>Stage {stage}: {s.short}</span>;
}

// ── Main page ──────────────────────────────────────────────────────────────────
export default function ArrearsPage() {
  const { user, profile } = useAuth();
  const router = useRouter();

  const [cases, setCases] = useState<ArrearsCase[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [events, setEvents] = useState<ArrearsEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ArrearsCase | null>(null);
  const [statusFilter, setStatusFilter] = useState<"active" | "resolved" | "all">("active");
  const [tab, setTab] = useState<"timeline" | "letters" | "payments">("timeline");
  const [showOpenForm, setShowOpenForm] = useState(false);
  const [showLogForm, setShowLogForm] = useState(false);
  const [showPayForm, setShowPayForm] = useState(false);
  const [saving, setSaving] = useState(false);

  // Open case form
  const [newCase, setNewCase] = useState({ tenant_id: "", first_missed_date: today(), total_owed: "", notes: "" });
  // Log event form
  const [logForm, setLogForm] = useState({ event_type: "contact", note: "", date: today() });
  // Payment form
  const [payForm, setPayForm] = useState({ amount: "", date: today(), note: "" });

  useEffect(() => {
    if (!user) { router.push("/rentura/auth?next=/rentura/arrears"); return; }
    async function load() {
      const [cR, tR, pR] = await Promise.all([
        supabase.from("rentura_arrears").select("*").eq("user_id", user!.id).order("created_at", { ascending: false }),
        supabase.from("rentura_tenants").select("id,first_name,last_name,email,phone,monthly_rent,property_id,status").eq("user_id", user!.id),
        supabase.from("rentura_properties").select("id,address").eq("user_id", user!.id),
      ]);
      setCases((cR.data ?? []) as ArrearsCase[]);
      setTenants((tR.data ?? []) as Tenant[]);
      setProperties(pR.data ?? []);
      setLoading(false);
    }
    load();
  }, [user, router]);

  // Load events when a case is selected
  useEffect(() => {
    if (!selected) return;
    supabase.from("rentura_arrears_events").select("*").eq("arrears_id", selected.id).order("date", { ascending: false }).then(({ data }) => {
      setEvents((data ?? []) as ArrearsEvent[]);
    });
  }, [selected]);

  const tenantMap = Object.fromEntries(tenants.map(t => [t.id, t]));
  const propMap = Object.fromEntries(properties.map(p => [p.id, p]));

  // ── Open new case ────────────────────────────────────────────────────────────
  async function openCase() {
    if (!user || !newCase.tenant_id || !newCase.first_missed_date) return;
    setSaving(true);
    const tenant = tenantMap[newCase.tenant_id];
    const owed = parseFloat(newCase.total_owed) || (tenant?.monthly_rent ?? 0);
    const { data: c } = await supabase.from("rentura_arrears").insert({
      user_id: user.id, tenant_id: newCase.tenant_id,
      property_id: tenant?.property_id ?? null,
      stage: 1, status: "active",
      total_owed: owed, monthly_rent: tenant?.monthly_rent ?? 0,
      first_missed_date: newCase.first_missed_date,
      notes: newCase.notes || null,
    }).select().single();
    if (c) {
      setCases(prev => [c as ArrearsCase, ...prev]);
      // Auto-log the opened event
      await supabase.from("rentura_arrears_events").insert({ arrears_id: c.id, user_id: user.id, event_type: "opened", stage: 1, note: `Case opened. ${fmt(owed)} owed.`, date: today() });
      setSelected(c as ArrearsCase);
      setShowOpenForm(false);
      setNewCase({ tenant_id: "", first_missed_date: today(), total_owed: "", notes: "" });
      // Load events
      const { data: ev } = await supabase.from("rentura_arrears_events").select("*").eq("arrears_id", c.id).order("date", { ascending: false });
      setEvents((ev ?? []) as ArrearsEvent[]);
    }
    setSaving(false);
  }

  // ── Advance stage ────────────────────────────────────────────────────────────
  const advanceStage = useCallback(async () => {
    if (!selected || !user || selected.stage >= 5) return;
    const nextStage = (selected.stage + 1) as 1|2|3|4|5;
    const { data: updated } = await supabase.from("rentura_arrears").update({ stage: nextStage, updated_at: new Date().toISOString() }).eq("id", selected.id).select().single();
    if (updated) {
      setCases(prev => prev.map(c => c.id === updated.id ? updated as ArrearsCase : c));
      setSelected(updated as ArrearsCase);
      const { data: ev } = await supabase.from("rentura_arrears_events").insert({ arrears_id: selected.id, user_id: user.id, event_type: "stage_change", stage: nextStage, note: `Advanced to Stage ${nextStage}: ${STAGES[nextStage-1].label}`, date: today() }).select().single();
      if (ev) setEvents(prev => [ev as ArrearsEvent, ...prev]);
    }
  }, [selected, user]);

  // ── Mark resolved ────────────────────────────────────────────────────────────
  const markResolved = useCallback(async () => {
    if (!selected || !user) return;
    if (!confirm("Mark this arrears case as resolved?")) return;
    const { data: updated } = await supabase.from("rentura_arrears").update({ status: "resolved", total_owed: 0, updated_at: new Date().toISOString() }).eq("id", selected.id).select().single();
    if (updated) {
      setCases(prev => prev.map(c => c.id === updated.id ? updated as ArrearsCase : c));
      setSelected(updated as ArrearsCase);
      await supabase.from("rentura_arrears_events").insert({ arrears_id: selected.id, user_id: user.id, event_type: "resolved", stage: selected.stage, note: "Arrears resolved — case closed.", date: today() });
      const { data: ev } = await supabase.from("rentura_arrears_events").select("*").eq("arrears_id", selected.id).order("date", { ascending: false });
      setEvents((ev ?? []) as ArrearsEvent[]);
    }
  }, [selected, user]);

  // ── Log event ────────────────────────────────────────────────────────────────
  async function logEvent() {
    if (!selected || !user) return;
    setSaving(true);
    const { data: ev } = await supabase.from("rentura_arrears_events").insert({ arrears_id: selected.id, user_id: user.id, event_type: logForm.event_type, stage: selected.stage, note: logForm.note, date: logForm.date }).select().single();
    if (ev) setEvents(prev => [ev as ArrearsEvent, ...prev]);
    setLogForm({ event_type: "contact", note: "", date: today() });
    setShowLogForm(false);
    setSaving(false);
  }

  // ── Log letter sent ───────────────────────────────────────────────────────────
  const logLetterSent = useCallback(async (stageNum: number) => {
    if (!selected || !user) return;
    const { data: ev } = await supabase.from("rentura_arrears_events").insert({ arrears_id: selected.id, user_id: user.id, event_type: "letter_sent", stage: stageNum, note: `Stage ${stageNum} letter printed and sent.`, date: today() }).select().single();
    if (ev) setEvents(prev => [ev as ArrearsEvent, ...prev]);
  }, [selected, user]);

  // ── Log payment ───────────────────────────────────────────────────────────────
  async function logPayment() {
    if (!selected || !user || !payForm.amount) return;
    setSaving(true);
    const paid = parseFloat(payForm.amount);
    const newOwed = Math.max(0, selected.total_owed - paid);
    const { data: updated } = await supabase.from("rentura_arrears").update({ total_owed: newOwed, last_payment_date: payForm.date, updated_at: new Date().toISOString() }).eq("id", selected.id).select().single();
    if (updated) {
      setCases(prev => prev.map(c => c.id === updated.id ? updated as ArrearsCase : c));
      setSelected(updated as ArrearsCase);
      const { data: ev } = await supabase.from("rentura_arrears_events").insert({ arrears_id: selected.id, user_id: user.id, event_type: "payment", stage: selected.stage, amount: paid, note: payForm.note || `Payment received ${fmt(paid)}. Balance: ${fmt(newOwed)}`, date: payForm.date }).select().single();
      if (ev) setEvents(prev => [ev as ArrearsEvent, ...prev]);
    }
    setPayForm({ amount: "", date: today(), note: "" });
    setShowPayForm(false);
    setSaving(false);
  }

  const filtered = cases.filter(c => statusFilter === "all" || c.status === statusFilter);
  const activeTenants = tenants.filter(t => t.status === "active");

  if (loading) return (
    <div style={{ background: C.bg, minHeight: "100vh", display: "flex" }}>
      <style>{`body > header, body > footer { display: none !important; }`}</style>
      <RenturaSidebar />
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: C.ink3, fontSize: 14 }}>Loading arrears…</p>
      </div>
    </div>
  );

  return (
    <div style={{ background: C.bg, minHeight: "100vh", display: "flex", fontFamily: "var(--font-family-body)", color: C.ink }}>
      <style>{`body > header, body > footer { display: none !important; }`}</style>
      <RenturaSidebar />

      <main style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* ── Case list ──────────────────────────────────────────────────────── */}
        <div style={{ width: 340, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "24px 20px 14px", borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div>
                <h1 style={{ fontSize: 17, fontWeight: 800, letterSpacing: "-0.02em" }}>Rent Arrears</h1>
                <p style={{ fontSize: 11, color: C.ink3, marginTop: 2 }}>
                  {cases.filter(c => c.status === "active").length} active cases
                </p>
              </div>
              <button onClick={() => { setShowOpenForm(true); setSelected(null); }}
                style={{ background: C.red, color: "white", fontWeight: 800, fontSize: 12, padding: "7px 13px", borderRadius: 7, border: "none", cursor: "pointer" }}>
                + Open case
              </button>
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              {(["active", "resolved", "all"] as const).map(f => (
                <button key={f} onClick={() => setStatusFilter(f)}
                  style={{ background: statusFilter === f ? C.gold : "transparent", color: statusFilter === f ? "#0f1b36" : C.ink3, border: `1px solid ${statusFilter === f ? C.gold : C.border}`, borderRadius: 6, padding: "4px 10px", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", textTransform: "capitalize" }}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "10px 12px" }}>
            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 16px" }}>
                <p style={{ fontSize: 22, marginBottom: 8 }}>✓</p>
                <p style={{ fontSize: 13, color: C.ink3 }}>
                  {statusFilter === "active" ? "No active arrears cases" : "No cases found"}
                </p>
              </div>
            ) : filtered.map(c => {
              const tenant = tenantMap[c.tenant_id];
              const prop = c.property_id ? propMap[c.property_id] : null;
              const stageConf = STAGES[c.stage - 1];
              const wk = weeksOverdue(c.first_missed_date);
              const isSelected = selected?.id === c.id;
              return (
                <div key={c.id} onClick={() => { setSelected(c); setShowOpenForm(false); setTab("timeline"); setShowLogForm(false); setShowPayForm(false); }}
                  style={{ padding: "12px 14px", borderRadius: 10, marginBottom: 6, cursor: "pointer", border: `1px solid ${isSelected ? "rgba(239,68,68,0.4)" : C.border}`, background: isSelected ? "rgba(239,68,68,0.05)" : C.card }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>{tenant ? `${tenant.first_name} ${tenant.last_name}` : "Unknown tenant"}</p>
                      {prop && <p style={{ fontSize: 11, color: C.ink3, marginTop: 1 }}>{prop.address.split(",")[0]}</p>}
                    </div>
                    <StagePill stage={c.stage} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: c.status === "resolved" ? C.green : C.red }}>{fmt(c.total_owed)}</span>
                    <div style={{ display: "flex", gap: 8 }}>
                      {c.status === "resolved" && <span style={{ fontSize: 10, color: C.green, fontWeight: 700 }}>Resolved</span>}
                      {c.status === "active" && <span style={{ fontSize: 10, color: C.ink3 }}>{wk}w overdue</span>}
                      {c.status === "court" && <span style={{ fontSize: 10, color: C.purple, fontWeight: 700 }}>In court</span>}
                    </div>
                  </div>
                  {/* Mini stage bar */}
                  <div style={{ display: "flex", gap: 2, marginTop: 8 }}>
                    {STAGES.map(s => (
                      <div key={s.n} style={{ flex: 1, height: 3, borderRadius: 2, background: c.stage >= s.n ? stageConf.color : "rgba(255,255,255,0.08)" }} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Right panel ────────────────────────────────────────────────────── */}
        <div style={{ flex: 1, overflowY: "auto" }}>

          {/* Empty state */}
          {!selected && !showOpenForm && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", flexDirection: "column", gap: 14 }}>
              <p style={{ fontSize: 28 }}>!</p>
              <p style={{ fontSize: 14, color: C.ink3 }}>Select a case or open a new one</p>
              <button onClick={() => setShowOpenForm(true)}
                style={{ background: C.red, color: "white", fontWeight: 700, fontSize: 13, padding: "9px 20px", borderRadius: 8, border: "none", cursor: "pointer" }}>
                Open arrears case
              </button>
            </div>
          )}

          {/* ── Open case form ──────────────────────────────────────────────── */}
          {showOpenForm && (
            <div style={{ padding: "32px 36px", maxWidth: 560 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 22 }}>Open arrears case</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <Lbl>Tenant *</Lbl>
                  <select value={newCase.tenant_id} onChange={e => {
                    const t = tenantMap[e.target.value];
                    setNewCase(f => ({ ...f, tenant_id: e.target.value, total_owed: String(t?.monthly_rent ?? "") }));
                  }} style={inp}>
                    <option value="">Select tenant…</option>
                    {activeTenants.map(t => (
                      <option key={t.id} value={t.id}>{t.first_name} {t.last_name}{t.property_id && propMap[t.property_id] ? ` — ${propMap[t.property_id].address.split(",")[0]}` : ""}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Lbl>First missed payment date *</Lbl>
                  <input type="date" value={newCase.first_missed_date} onChange={e => setNewCase(f => ({ ...f, first_missed_date: e.target.value }))} style={inp} />
                </div>
                <div>
                  <Lbl>Total amount owed (£)</Lbl>
                  <input type="number" value={newCase.total_owed} onChange={e => setNewCase(f => ({ ...f, total_owed: e.target.value }))} placeholder="Auto-fills from monthly rent" style={inp} />
                </div>
                <div>
                  <Lbl>Notes (optional)</Lbl>
                  <textarea value={newCase.notes} onChange={e => setNewCase(f => ({ ...f, notes: e.target.value }))} rows={2} placeholder="e.g. Tenant called to say they lost their job" style={{ ...inp, resize: "vertical" }} />
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                <button onClick={openCase} disabled={saving || !newCase.tenant_id || !newCase.first_missed_date}
                  style={{ background: C.red, color: "white", fontWeight: 700, fontSize: 13, padding: "10px 20px", borderRadius: 8, border: "none", cursor: "pointer", opacity: saving ? 0.6 : 1 }}>
                  {saving ? "Opening…" : "Open case"}
                </button>
                <button onClick={() => setShowOpenForm(false)}
                  style={{ background: "transparent", color: C.ink2, fontSize: 13, padding: "10px 18px", borderRadius: 8, border: `1px solid ${C.border}`, cursor: "pointer" }}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* ── Case detail ─────────────────────────────────────────────────── */}
          {selected && !showOpenForm && (() => {
            const tenant = tenantMap[selected.tenant_id];
            const prop = selected.property_id ? propMap[selected.property_id] : undefined;
            const stageConf = STAGES[selected.stage - 1];
            const wk = weeksOverdue(selected.first_missed_date);
            const ld = buildLetterData(selected, tenant, prop, profile?.name ?? "Landlord", user?.email ?? "", profile?.phone ?? "");
            const canAdvance = selected.status === "active" && selected.stage < 5;
            const g8Met = selected.total_owed >= selected.monthly_rent * 3;

            return (
              <div style={{ padding: "28px 32px" }}>
                {/* Case header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                      <h2 style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.02em" }}>
                        {tenant ? `${tenant.first_name} ${tenant.last_name}` : "Unknown Tenant"}
                      </h2>
                      <StagePill stage={selected.stage} />
                      {selected.status === "resolved" && <span style={{ fontSize: 11, background: "rgba(34,197,94,0.15)", color: C.green, padding: "2px 8px", borderRadius: 8, fontWeight: 700 }}>Resolved</span>}
                    </div>
                    <p style={{ fontSize: 13, color: C.ink2 }}>
                      {prop?.address ?? "Unknown property"} · First missed: {fmtDate(selected.first_missed_date)} · {wk} weeks overdue
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: 22, fontWeight: 900, color: selected.status === "resolved" ? C.green : C.red }}>{fmt(selected.total_owed)}</p>
                    <p style={{ fontSize: 11, color: C.ink3 }}>outstanding</p>
                  </div>
                </div>

                {/* Stage progress bar */}
                <div style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${C.border}`, borderRadius: 12, padding: "14px 18px", marginBottom: 22 }}>
                  <div style={{ display: "flex", gap: 0 }}>
                    {STAGES.map((s, i) => {
                      const active = selected.stage === s.n;
                      const done = selected.stage > s.n;
                      return (
                        <div key={s.n} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
                          {i > 0 && <div style={{ position: "absolute", left: 0, top: 15, width: "50%", height: 2, background: done || active ? stageConf.color : "rgba(255,255,255,0.08)" }} />}
                          {i < 4 && <div style={{ position: "absolute", right: 0, top: 15, width: "50%", height: 2, background: done ? stageConf.color : "rgba(255,255,255,0.08)" }} />}
                          <div style={{ width: 30, height: 30, borderRadius: "50%", background: done ? stageConf.color : active ? stageConf.color + "30" : "rgba(255,255,255,0.05)", border: `2px solid ${active || done ? stageConf.color : "rgba(255,255,255,0.1)"}`, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1 }}>
                            <span style={{ fontSize: 11, fontWeight: 800, color: done ? "white" : active ? stageConf.color : C.ink3 }}>{done ? "✓" : s.n}</span>
                          </div>
                          <p style={{ fontSize: 10, color: active ? stageConf.color : C.ink3, fontWeight: active ? 700 : 400, marginTop: 5, textAlign: "center", lineHeight: 1.3 }}>{s.short}</p>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ marginTop: 12, padding: "8px 10px", background: stageConf.color + "10", borderRadius: 8, border: `1px solid ${stageConf.color}30` }}>
                    <p style={{ fontSize: 12, color: stageConf.color, fontWeight: 700 }}>{stageConf.label} — {stageConf.hint}</p>
                    {selected.stage === 4 && !g8Met && (
                      <p style={{ fontSize: 11, color: C.amber, marginTop: 4 }}>
                        ⚠ Ground 8 not yet available — {fmt(selected.monthly_rent * 3 - selected.total_owed)} more needed to reach 3 months arrears
                      </p>
                    )}
                  </div>
                </div>

                {/* Action row */}
                <div style={{ display: "flex", gap: 8, marginBottom: 22, flexWrap: "wrap" }}>
                  {canAdvance && (
                    <button onClick={advanceStage}
                      style={{ background: stageConf.color, color: "white", fontWeight: 700, fontSize: 12, padding: "8px 16px", borderRadius: 7, border: "none", cursor: "pointer" }}>
                      Advance to Stage {selected.stage + 1}: {(STAGES as unknown as typeof STAGES[number][])[selected.stage]?.label} →
                    </button>
                  )}
                  <button onClick={() => { setShowLogForm(true); setShowPayForm(false); }}
                    style={{ background: "rgba(255,255,255,0.05)", color: C.ink2, fontWeight: 600, fontSize: 12, padding: "8px 14px", borderRadius: 7, border: `1px solid ${C.border}`, cursor: "pointer" }}>
                    + Log contact / note
                  </button>
                  <button onClick={() => { setShowPayForm(true); setShowLogForm(false); }}
                    style={{ background: "rgba(34,197,94,0.1)", color: C.green, fontWeight: 700, fontSize: 12, padding: "8px 14px", borderRadius: 7, border: "1px solid rgba(34,197,94,0.2)", cursor: "pointer" }}>
                    £ Log payment
                  </button>
                  {selected.status === "active" && (
                    <button onClick={markResolved}
                      style={{ background: "transparent", color: C.green, fontWeight: 600, fontSize: 12, padding: "8px 14px", borderRadius: 7, border: "1px solid rgba(34,197,94,0.25)", cursor: "pointer" }}>
                      ✓ Mark resolved
                    </button>
                  )}
                </div>

                {/* Inline log form */}
                {showLogForm && (
                  <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "16px 18px", marginBottom: 16 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: C.ink, marginBottom: 12 }}>Log action</p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                      <div>
                        <Lbl>Action type</Lbl>
                        <select value={logForm.event_type} onChange={e => setLogForm(f => ({ ...f, event_type: e.target.value }))} style={inpSm}>
                          <option value="contact">Phone / email contact</option>
                          <option value="letter_sent">Letter sent</option>
                          <option value="note">Note</option>
                        </select>
                      </div>
                      <div>
                        <Lbl>Date</Lbl>
                        <input type="date" value={logForm.date} onChange={e => setLogForm(f => ({ ...f, date: e.target.value }))} style={inpSm} />
                      </div>
                    </div>
                    <div style={{ marginBottom: 10 }}>
                      <Lbl>Note / details</Lbl>
                      <textarea value={logForm.note} onChange={e => setLogForm(f => ({ ...f, note: e.target.value }))} rows={2} placeholder="e.g. Called tenant, no answer. Left voicemail." style={{ ...inpSm, resize: "vertical", width: "100%", boxSizing: "border-box" }} />
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={logEvent} disabled={saving} style={{ background: C.blue, color: "white", fontWeight: 700, fontSize: 12, padding: "7px 16px", borderRadius: 7, border: "none", cursor: "pointer" }}>{saving ? "Saving…" : "Log"}</button>
                      <button onClick={() => setShowLogForm(false)} style={{ background: "transparent", color: C.ink3, fontSize: 12, padding: "7px 12px", border: `1px solid ${C.border}`, borderRadius: 7, cursor: "pointer" }}>Cancel</button>
                    </div>
                  </div>
                )}

                {/* Inline payment form */}
                {showPayForm && (
                  <div style={{ background: "rgba(34,197,94,0.04)", border: "1px solid rgba(34,197,94,0.15)", borderRadius: 10, padding: "16px 18px", marginBottom: 16 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: C.green, marginBottom: 12 }}>Log payment received</p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 10 }}>
                      <div>
                        <Lbl>Amount (£) *</Lbl>
                        <input type="number" value={payForm.amount} onChange={e => setPayForm(f => ({ ...f, amount: e.target.value }))} placeholder="0.00" style={inpSm} />
                      </div>
                      <div>
                        <Lbl>Date received</Lbl>
                        <input type="date" value={payForm.date} onChange={e => setPayForm(f => ({ ...f, date: e.target.value }))} style={inpSm} />
                      </div>
                      <div>
                        <Lbl>Note (optional)</Lbl>
                        <input value={payForm.note} onChange={e => setPayForm(f => ({ ...f, note: e.target.value }))} placeholder="Bank transfer" style={inpSm} />
                      </div>
                    </div>
                    <p style={{ fontSize: 11, color: C.ink3, marginBottom: 10 }}>
                      Outstanding after this payment: <strong style={{ color: C.green }}>{fmt(Math.max(0, selected.total_owed - (parseFloat(payForm.amount) || 0)))}</strong>
                    </p>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={logPayment} disabled={saving || !payForm.amount} style={{ background: C.green, color: "white", fontWeight: 700, fontSize: 12, padding: "7px 16px", borderRadius: 7, border: "none", cursor: "pointer" }}>{saving ? "Saving…" : "Log payment"}</button>
                      <button onClick={() => setShowPayForm(false)} style={{ background: "transparent", color: C.ink3, fontSize: 12, padding: "7px 12px", border: `1px solid ${C.border}`, borderRadius: 7, cursor: "pointer" }}>Cancel</button>
                    </div>
                  </div>
                )}

                {/* Tabs */}
                <div style={{ display: "flex", borderBottom: `1px solid ${C.border}`, marginBottom: 20 }}>
                  {(["timeline", "letters", "payments"] as const).map(t => (
                    <button key={t} onClick={() => setTab(t)}
                      style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", padding: "9px 18px", fontSize: 13, fontWeight: tab === t ? 700 : 500, color: tab === t ? C.gold : C.ink3, borderBottom: tab === t ? `2px solid ${C.gold}` : "2px solid transparent", textTransform: "capitalize" }}>
                      {t}
                    </button>
                  ))}
                </div>

                {/* ── Timeline tab ──────────────────────────────────────────── */}
                {tab === "timeline" && (
                  <div>
                    {events.length === 0 ? (
                      <p style={{ fontSize: 13, color: C.ink3 }}>No events logged yet.</p>
                    ) : events.map((ev, i) => (
                      <div key={ev.id} style={{ display: "flex", gap: 14, marginBottom: i < events.length - 1 ? 16 : 0 }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                          <div style={{ width: 28, height: 28, borderRadius: "50%", background: (EVENT_COLORS[ev.event_type] || C.ink3) + "15", border: `1px solid ${EVENT_COLORS[ev.event_type] || C.ink3}40`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <span style={{ fontSize: 12, color: EVENT_COLORS[ev.event_type] || C.ink3 }}>{EVENT_ICONS[ev.event_type] || "•"}</span>
                          </div>
                          {i < events.length - 1 && <div style={{ flex: 1, width: 1, background: "rgba(255,255,255,0.06)", margin: "4px 0" }} />}
                        </div>
                        <div style={{ flex: 1, paddingBottom: 4 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <div>
                              <span style={{ fontSize: 12, fontWeight: 700, color: EVENT_COLORS[ev.event_type] || C.ink2, textTransform: "capitalize" }}>
                                {ev.event_type.replace("_", " ")}
                              </span>
                              {ev.stage && <span style={{ fontSize: 10, color: C.ink3, marginLeft: 8 }}>Stage {ev.stage}</span>}
                              {ev.amount && <span style={{ fontSize: 12, fontWeight: 700, color: C.green, marginLeft: 8 }}>{fmt(ev.amount)}</span>}
                            </div>
                            <span style={{ fontSize: 11, color: C.ink3, flexShrink: 0 }}>{fmtDate(ev.date)}</span>
                          </div>
                          {ev.note && <p style={{ fontSize: 12, color: C.ink2, marginTop: 3, lineHeight: 1.5 }}>{ev.note}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* ── Letters tab ───────────────────────────────────────────── */}
                {tab === "letters" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <p style={{ fontSize: 12, color: C.ink3, marginBottom: 4 }}>
                      Letters are pre-filled with tenant and property details. Click "Print / Save PDF" to open a print-ready version in a new tab.
                    </p>
                    {[
                      { stage: 1, title: "Stage 1 — Friendly Payment Reminder", desc: "Informal, warm tone. Assumes an oversight. No legal threats.", color: C.blue, fn: () => letter1(ld) },
                      { stage: 2, title: "Stage 2 — Formal Arrears Notice", desc: "Formal written warning. States total owed, 7-day deadline, signposts housing advice.", color: C.amber, fn: () => letter2(ld) },
                      { stage: 3, title: "Stage 3 — Final Demand", desc: "Clear and firm. States Section 8 will be served if not resolved within 7 days.", color: C.orange, fn: () => letter3(ld) },
                      { stage: 4, title: "Stage 4 — Section 8 Notice Guide", desc: `Pre-fills your details for completing Form 3. Includes prerequisite checklist and grounds reference. ${g8Met ? "Ground 8 available (3+ months owed)." : "⚠ Ground 8 not yet available — below 3 months."}`, color: C.red, fn: () => letter4(ld) },
                    ].map(l => (
                      <div key={l.stage} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "16px 18px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 5 }}>
                              <span style={{ width: 22, height: 22, borderRadius: "50%", background: l.color + "20", border: `1px solid ${l.color}40`, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: l.color, flexShrink: 0 }}>{l.stage}</span>
                              <p style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>{l.title}</p>
                            </div>
                            <p style={{ fontSize: 12, color: C.ink2, lineHeight: 1.5 }}>{l.desc}</p>
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
                            <button onClick={() => { printLetter(l.fn(), l.title); }}
                              style={{ background: l.color, color: "white", fontWeight: 700, fontSize: 11, padding: "7px 14px", borderRadius: 7, border: "none", cursor: "pointer", whiteSpace: "nowrap" }}>
                              Print / Save PDF
                            </button>
                            <button onClick={() => logLetterSent(l.stage)}
                              style={{ background: "transparent", color: C.ink3, fontWeight: 600, fontSize: 11, padding: "6px 14px", borderRadius: 7, border: `1px solid ${C.border}`, cursor: "pointer", whiteSpace: "nowrap" }}>
                              Mark as sent
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div style={{ padding: "12px 16px", background: "rgba(255,255,255,0.02)", border: `1px solid ${C.border}`, borderRadius: 10, marginTop: 4 }}>
                      <p style={{ fontSize: 11, color: C.ink3, lineHeight: 1.6, fontStyle: "italic" }}>
                        These templates are for guidance. Stage 4 is a guide for completing the official Form 3 — always download the current form from gov.uk. Consider seeking legal advice before serving a Section 8 notice.
                      </p>
                    </div>
                  </div>
                )}

                {/* ── Payments tab ──────────────────────────────────────────── */}
                {tab === "payments" && (
                  <div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
                      {[
                        { label: "Monthly rent", value: fmt(selected.monthly_rent) },
                        { label: "Total owed now", value: fmt(selected.total_owed), color: C.red },
                        { label: "Last payment", value: fmtDate(selected.last_payment_date) },
                      ].map(s => (
                        <div key={s.label} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "13px 15px" }}>
                          <p style={{ fontSize: 10, fontWeight: 700, color: C.ink3, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>{s.label}</p>
                          <p style={{ fontSize: 16, fontWeight: 800, color: s.color ?? C.ink }}>{s.value}</p>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <p style={{ fontSize: 12, fontWeight: 700, color: C.ink3, textTransform: "uppercase", letterSpacing: "0.07em" }}>Payment history</p>
                    </div>
                    {events.filter(e => e.event_type === "payment").length === 0 ? (
                      <p style={{ fontSize: 13, color: C.ink3 }}>No payments logged yet.</p>
                    ) : events.filter(e => e.event_type === "payment").map(ev => (
                      <div key={ev.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 14px", background: C.card, border: "1px solid rgba(34,197,94,0.15)", borderRadius: 9, marginBottom: 6 }}>
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>{ev.note || "Payment received"}</p>
                          <p style={{ fontSize: 11, color: C.ink3 }}>{fmtDate(ev.date)}</p>
                        </div>
                        <p style={{ fontSize: 15, fontWeight: 800, color: C.green }}>{fmt(ev.amount ?? 0)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      </main>
    </div>
  );
}
