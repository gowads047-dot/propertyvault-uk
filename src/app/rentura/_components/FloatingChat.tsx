"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";

// ── Types ──────────────────────────────────────────────────────────────────────
type Prop = { id: string; address: string; nickname: string | null; property_type: string; bedrooms: number | null };
type Tenant = { id: string; first_name: string; last_name: string; property_id: string | null; monthly_rent: number | null; status: string | null; phone: string | null };
type Contact = { id: string; name: string; role: string; specialty: string | null; phone: string | null; whatsapp: string | null };
type ScanAction = { id: string; label: string; description: string; color: string; primary: boolean; data: Record<string, unknown> };
type ScanResult = {
  reply: string;
  document_type: string;
  document_category: string;
  extracted: Record<string, string>;
  suggested_actions: ScanAction[];
  property_match: string | null;
  tenant_match: string | null;
  confidence: string;
};
type PendingScan = {
  result: ScanResult;
  file: File;
  base64: string;
  mediaType: string;
  fileUrl: string | null;
  done: Record<string, "ok" | "err">;
  propId: string | null;
  tenantId: string | null;
};
type PendingFile = { file: File; base64: string; mediaType: string };
type SummaryCard = {
  title: string;
  stage: string;
  items: string[];
  color: string;
};
type PendingAction = {
  id: string;
  type: "landlord_decide" | "send_to_tenant" | "chase_contractor" | "log_action";
  label: string;
  message: string | null;
  phone: string | null;
  dismissed?: boolean;
};
type Message = {
  role: "user" | "ai";
  text: string;
  card?: SummaryCard | null;
  attachment?: { filename: string };
  actions?: { type: string; label: string; value: string; color: string }[];
  followUp?: string | null;
  awaitingConfirm?: boolean;
  saved?: boolean;
};
type APIHistory = { role: "user" | "assistant"; content: string }[];
type PortfolioCtx = Record<string, unknown>;

const CAT_COLOR: Record<string, string> = {
  compliance: "#0891b2", financial: "#16a34a", tenancy: "#7c3aed",
  mortgage: "#b8962e", identity: "#2563eb", insurance: "#d97706", other: "#64748b",
};

// Where each action saves — shown in the UI
const ACTION_DESTINATION: Record<string, string> = {
  save_compliance: "Compliance tracker",
  log_expense: "Financials → Expenses",
  log_income: "Financials → Income",
  update_tenant: "Tenant record",
  log_event: "Property timeline",
  log_rtr: "Right to Rent log",
  save_mortgage: "Mortgage tracker",
  save_to_documents: "Documents vault",
};

function shortAddr(a: string) { return a.split(",")[0]; }

function readAsBase64(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res((r.result as string).split(",")[1]);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

async function uploadToStorage(
  bucket: string, path: string, base64: string, mediaType: string
): Promise<string | null> {
  try {
    const bytes = atob(base64);
    const arr = new Uint8Array(bytes.length);
    for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
    const blob = new Blob([arr], { type: mediaType });
    const { data, error } = await supabase.storage
      .from(bucket).upload(path, blob, { contentType: mediaType, upsert: false });
    if (error || !data) return null;
    return supabase.storage.from(bucket).getPublicUrl(path).data?.publicUrl ?? null;
  } catch { return null; }
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function FloatingChat() {
  const { user } = useAuth();
  const pathname = usePathname();

  const hide = !user
    || pathname?.startsWith("/rentura/auth")
    || pathname === "/rentura" || pathname === "/rentura/";

  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [ctx, setCtx] = useState<PortfolioCtx | null>(null);
  const [props, setProps] = useState<Prop[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [apiHistory, setApiHistory] = useState<APIHistory>([]);
  const [input, setInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [pendingFile, setPendingFile] = useState<PendingFile | null>(null);
  const [pendingScan, setPendingScan] = useState<PendingScan | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [pendingActions, setPendingActions] = useState<PendingAction[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);   // any file / PDF
  const photoInputRef = useRef<HTMLInputElement>(null);  // gallery photo
  const cameraInputRef = useRef<HTMLInputElement>(null); // live camera

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, pendingScan]);

  // close attach menu on outside click
  useEffect(() => {
    if (!showAttachMenu) return;
    const h = () => setShowAttachMenu(false);
    setTimeout(() => window.addEventListener("click", h), 10);
    return () => window.removeEventListener("click", h);
  }, [showAttachMenu]);

  // ── Load portfolio ───────────────────────────────────────────────────────────
  const loadCtx = useCallback(async () => {
    if (ready || !user) return;

    const [propRes, tenantRes, mortRes, taxRes, issuesRes, contactsRes] = await Promise.all([
      supabase.from("rentura_properties").select("id,address,nickname,property_type,bedrooms").eq("user_id", user.id),
      supabase.from("rentura_tenants").select("id,first_name,last_name,property_id,monthly_rent,status,phone,tenancy_start,move_in_date").eq("user_id", user.id),
      supabase.from("rentura_mortgages").select("*").eq("user_id", user.id).eq("is_current", true),
      fetch(`/api/rentura/tax-summary/?userId=${user.id}`).then(r => r.json()).catch(() => null),
      supabase.from("tenant_issues").select("id,title,priority,tenant_name,tenant_phone,property_id").eq("landlord_user_id", user.id).neq("status", "resolved").is("landlord_first_response_at", null).limit(8),
      supabase.from("rentura_contacts").select("id,name,role,specialty,phone,whatsapp").eq("user_id", user.id).order("preferred", { ascending: false }),
    ]);

    const properties: Prop[] = (propRes.data ?? []) as Prop[];
    const tenantList: Tenant[] = (tenantRes.data ?? []) as Tenant[];
    const contactList: Contact[] = (contactsRes.data ?? []) as Contact[];
    setProps(properties);
    setTenants(tenantList);
    setContacts(contactList);

    const activeTenants = tenantList.filter(t => t.status === "active" || !t.status);
    const tenantByProp: Record<string, Tenant> = {};
    for (const t of tenantList) if (t.property_id) tenantByProp[t.property_id] = t;
    const mortByProp: Record<string, { lender: string | null; interest_rate: number | null; monthly_payment: number | null; fixed_term_expiry: string | null }> = {};
    for (const m of (mortRes.data ?? [])) mortByProp[m.property_id] = m;

    const totalIncome = activeTenants.reduce((s, t) => s + (t.monthly_rent ?? 0), 0);
    const totalMort = (mortRes.data ?? []).reduce((s: number, m: { monthly_payment: number | null }) => s + (m.monthly_payment ?? 0), 0);

    setCtx({
      today: new Date().toISOString().split("T")[0],
      totalMonthlyIncome: totalIncome,
      totalMortgagePayments: totalMort,
      netMonthlyCashflow: totalIncome - totalMort,
      taxYear: taxRes?.taxYear, taxYearIncome: taxRes?.income,
      taxYearExpenses: taxRes?.expenses, taxYearNet: taxRes?.net,
      tenants: properties.map(p => {
        const t = tenantByProp[p.id];
        return t
          ? { property: shortAddr(p.address), name: `${t.first_name} ${t.last_name}`.trim(), rent: t.monthly_rent, phone: t.phone ?? null }
          : { property: shortAddr(p.address), name: "Vacant", rent: null, phone: null };
      }),
      contacts: contactList.map(c => ({
        id: c.id, name: c.name, role: c.role, specialty: c.specialty,
        phone: c.phone, whatsapp: c.whatsapp,
      })),
      mortgages: properties.map(p => {
        const m = mortByProp[p.id];
        return m ? { property: shortAddr(p.address), lender: m.lender, rate: m.interest_rate, monthly: m.monthly_payment, fixedExpiry: m.fixed_term_expiry } : null;
      }).filter(Boolean),
      unrespondedIssues: (issuesRes.data ?? []).map((i: { title: string; tenant_name: string | null; tenant_phone: string | null; property_id: string; priority: string }) => {
        const prop = properties.find(p => p.id === i.property_id);
        return { title: i.title, tenantName: i.tenant_name ?? "Tenant", tenantPhone: i.tenant_phone ?? null, property: prop ? shortAddr(prop.address) : "Property", priority: i.priority };
      }),
    });

    setReady(true);
    const hour = new Date().getHours();
    const greet = hour < 12 ? "Morning" : hour < 17 ? "Afternoon" : "Evening";
    const issues = issuesRes.data?.length ?? 0;
    setMessages([{ role: "ai", text: issues > 0
      ? `${greet} — ${issues} unanswered issue${issues > 1 ? "s" : ""}. Tap 📎 to attach any document. What do you need?`
      : `${greet} — ${properties.length} propert${properties.length === 1 ? "y" : "ies"}, £${totalIncome.toLocaleString()}/mo. Tap 📎 to attach any document or ask me anything.`,
    }]);
  }, [ready, user]);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- loadCtx is an async fetch, run only when the panel opens
  useEffect(() => { if (open) loadCtx(); }, [open, loadCtx]);

  // ── Matchers ────────────────────────────────────────────────────────────────
  const matchProp = useCallback((text: string | null): Prop | null => {
    if (!text) return null;
    const t = text.toLowerCase();
    return props.find(p =>
      p.address.toLowerCase().includes(t) ||
      t.includes(p.address.split(",")[0].toLowerCase()) ||
      (p.nickname && t.includes(p.nickname.toLowerCase()))
    ) ?? null;
  }, [props]);

  const matchTenant = useCallback((text: string | null): Tenant | null => {
    if (!text) return null;
    const t = text.toLowerCase();
    return tenants.find(tn =>
      `${tn.first_name} ${tn.last_name}`.toLowerCase().includes(t) ||
      t.includes(tn.first_name.toLowerCase())
    ) ?? null;
  }, [tenants]);

  // ── File handling ────────────────────────────────────────────────────────────
  async function processFile(file: File) {
    if (file.size > 10 * 1024 * 1024) { alert("File must be under 10 MB."); return; }
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/heic", "application/pdf"];
    // Accept heic as jpeg for extraction
    const mediaType = file.type === "image/heic" ? "image/jpeg" : file.type;
    if (!allowed.includes(file.type)) { alert("Please upload a JPG, PNG, WEBP, or PDF."); return; }
    try {
      const base64 = await readAsBase64(file);
      setPendingFile({ file, base64, mediaType });
    } catch { alert("Could not read the file — please try again."); }
  }

  function makeInputHandler(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = "";
  }

  // ── Scan ─────────────────────────────────────────────────────────────────────
  const scanFile = useCallback(async (pf: PendingFile) => {
    if (!user || !ctx) return;
    setPendingFile(null);
    setShowAttachMenu(false);
    setChatLoading(true);

    setMessages(m => [...m, {
      role: "user",
      text: input.trim() || "",
      attachment: { filename: pf.file.name },
    }]);
    setInput("");

    try {
      const res = await fetch("/api/rentura/scan-document/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          base64Data: pf.base64,
          mediaType: pf.mediaType,
          filename: pf.file.name,
          properties: props,
          tenants: tenants.map(t => ({ id: t.id, first_name: t.first_name, last_name: t.last_name, property_id: t.property_id })),
        }),
      });
      const result: ScanResult = await res.json();

      const autoMatchedProp = matchProp(result.property_match);
      const autoMatchedTenant = matchTenant(result.tenant_match);

      setPendingScan({
        result,
        file: pf.file,
        base64: pf.base64,
        mediaType: pf.mediaType,
        fileUrl: null,
        done: {},
        propId: autoMatchedProp?.id ?? (props.length === 1 ? props[0].id : null),
        tenantId: autoMatchedTenant?.id ?? null,
      });

      setMessages(m => [...m, { role: "ai", text: result.reply ?? "I've scanned the document — see the options below." }]);
    } catch {
      setMessages(m => [...m, { role: "ai", text: "Couldn't scan the file — please try again." }]);
    }
    setChatLoading(false);
  }, [user, ctx, props, tenants, input, matchProp, matchTenant]);

  // ── Execute action ───────────────────────────────────────────────────────────
  const executeAction = useCallback(async (action: ScanAction) => {
    if (!user || !pendingScan) return;
    setActionLoading(action.id);

    const d = action.data;
    const propId = pendingScan.propId;
    const tenantId = pendingScan.tenantId;

    // Lazy file upload — reuse URL across multiple actions
    const getUrl = async (): Promise<string | null> => {
      if (pendingScan.fileUrl) return pendingScan.fileUrl;
      const path = `${user.id}/${Date.now()}-${pendingScan.file.name.replace(/[^a-z0-9._-]/gi, "_").toLowerCase()}`;
      const url = await uploadToStorage("rentura-docs", path, pendingScan.base64, pendingScan.mediaType);
      if (url) setPendingScan(s => s ? { ...s, fileUrl: url } : s);
      return url;
    };

    let errMsg: string | null = null;

    try {
      switch (action.id) {

        case "save_compliance": {
          const fileUrl = await getUrl();
          const { error } = await supabase.from("rentura_compliance").insert({
            user_id: user.id,
            property_id: propId,
            certificate_type: d.certificate_type ?? pendingScan.result.document_type,
            issue_date: d.issue_date ?? null,
            expiry_date: d.expiry_date ?? null,
            contractor: d.contractor ?? null,
            cert_reference: d.cert_reference ?? null,
            notes: d.notes ?? null,
            file_url: fileUrl,
            trust_level: "confirmed",
          });
          if (error) errMsg = error.message;
          break;
        }

        case "log_expense": {
          const { error } = await supabase.from("rentura_expenses").insert({
            user_id: user.id,
            property_id: propId,
            category: d.category ?? "other",
            description: String(d.description ?? pendingScan.result.document_type),
            amount: parseFloat(String(d.amount ?? 0)),
            date: d.date ?? new Date().toISOString().split("T")[0],
          });
          if (error) errMsg = error.message;
          break;
        }

        case "log_income": {
          const { error } = await supabase.from("rentura_income").insert({
            user_id: user.id,
            property_id: propId,
            type: d.type ?? "other",
            amount: parseFloat(String(d.amount ?? 0)),
            date: d.date ?? new Date().toISOString().split("T")[0],
            notes: d.notes ?? null,
          });
          if (error) errMsg = error.message;
          break;
        }

        case "update_tenant": {
          if (!tenantId) { errMsg = "Select a tenant below before saving."; break; }
          const patch: Record<string, unknown> = {};
          if (d.monthly_rent) patch.monthly_rent = parseFloat(String(d.monthly_rent));
          if (d.tenancy_start) patch.tenancy_start = d.tenancy_start;
          if (d.tenancy_end) patch.tenancy_end = d.tenancy_end;
          if (d.deposit_amount) patch.deposit_amount = parseFloat(String(d.deposit_amount));
          if (d.tenancy_type) patch.tenancy_type = d.tenancy_type;
          const { error } = await supabase.from("rentura_tenants").update(patch).eq("id", tenantId);
          if (error) errMsg = error.message;
          break;
        }

        case "log_event": {
          const { error } = await supabase.from("rentura_events").insert({
            user_id: user.id,
            property_id: propId,
            event_type: d.event_type ?? "document_received",
            title: d.title ?? pendingScan.result.document_type,
            description: d.description ?? pendingScan.result.reply,
            amount: d.amount ? parseFloat(String(d.amount)) : null,
            event_date: d.event_date ?? new Date().toISOString().split("T")[0],
            trust_level: "confirmed",
            metadata: { scanned: true, document_type: pendingScan.result.document_type },
          });
          if (error) errMsg = error.message;
          break;
        }

        case "log_rtr": {
          if (!tenantId) { errMsg = "Select a tenant below before saving."; break; }
          const { error } = await supabase.from("rentura_right_to_rent").insert({
            user_id: user.id,
            tenant_id: tenantId,
            document_type: d.document_type ?? "Other",
            document_ref: d.document_ref ?? null,
            check_date: d.check_date ?? new Date().toISOString().split("T")[0],
            time_limited: d.time_limited ?? false,
            expiry_date: d.expiry_date ?? null,
            notes: null,
          });
          if (error) errMsg = error.message;
          break;
        }

        case "save_mortgage": {
          const existingRes = propId
            ? await supabase.from("rentura_mortgages").select("id").eq("user_id", user.id).eq("property_id", propId).eq("is_current", true).single()
            : { data: null };
          const payload = {
            user_id: user.id, property_id: propId,
            lender: d.lender ?? null,
            monthly_payment: d.monthly_payment ? parseFloat(String(d.monthly_payment)) : null,
            interest_rate: d.interest_rate ? parseFloat(String(d.interest_rate)) : null,
            fixed_term_expiry: d.fixed_term_expiry ?? null,
            mortgage_type: d.mortgage_type ?? null,
            is_current: true,
            notes: d.notes ?? null,
          };
          const { error } = existingRes.data?.id
            ? await supabase.from("rentura_mortgages").update(payload).eq("id", existingRes.data.id)
            : await supabase.from("rentura_mortgages").insert(payload);
          if (error) errMsg = error.message;
          break;
        }

        case "save_to_documents": {
          // Always upload file for this action
          const ext = pendingScan.file.name.split(".").pop() ?? "bin";
          const path = `${user.id}/${Date.now()}-${pendingScan.file.name.replace(/[^a-z0-9._-]/gi, "_").toLowerCase()}`;
          const bytes = atob(pendingScan.base64);
          const arr = new Uint8Array(bytes.length);
          for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
          const blob = new Blob([arr], { type: pendingScan.mediaType });
          const { data: upData, error: upErr } = await supabase.storage
            .from("rentura-docs").upload(path, blob, { contentType: pendingScan.mediaType, upsert: false });
          if (upErr || !upData) { errMsg = upErr?.message ?? "Upload failed"; break; }
          const publicUrl = supabase.storage.from("rentura-docs").getPublicUrl(path).data?.publicUrl ?? path;
          const { error: dbErr } = await supabase.from("rentura_documents").insert({
            user_id: user.id,
            property_id: propId ?? null,
            file_name: pendingScan.file.name,
            file_url: publicUrl,
            category: d.category ?? "other",
          });
          if (dbErr) errMsg = dbErr.message;
          else { setPendingScan(s => s ? { ...s, fileUrl: publicUrl } : s); void ext; }
          break;
        }
      }
    } catch (e) { errMsg = String(e); }

    setPendingScan(s => s ? { ...s, done: { ...s.done, [action.id]: errMsg ? "err" : "ok" } } : s);
    setActionLoading(null);

    if (errMsg) {
      setMessages(m => [...m, { role: "ai", text: `Couldn't save to ${ACTION_DESTINATION[action.id] ?? action.id}: ${errMsg}` }]);
    }
  }, [user, pendingScan]);

  // ── Regular text send ────────────────────────────────────────────────────────
  const send = useCallback(async (text: string) => {
    if (pendingFile) { scanFile(pendingFile); return; }
    if (!text.trim() || chatLoading || !user || !ctx) return;
    setMessages(m => [...m, { role: "user", text: text.trim() }]);
    setInput(""); setChatLoading(true);
    try {
      const res = await fetch("/api/rentura/chat/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history: apiHistory, userInput: text.trim(), properties: props, context: ctx }),
      });
      const result = await res.json();
      setApiHistory(h => [...h, { role: "user", content: text.trim() }, { role: "assistant", content: result.reply ?? "" }]);

      // Open WhatsApp for messaging intents (contractor or tenant) — auto-opens on complete
      const isMessageIntent = ["message_contractor", "message_tenant"].includes(result.intent ?? "");
      if (result.completed && isMessageIntent && result.gathered?.phone && result.gathered?.message_content) {
        const phone = String(result.gathered.phone).replace(/\D/g, "");
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(String(result.gathered.message_content))}`, "_blank");
      }

      // Inject message_content into whatsapp chip value so the rendered button can pre-fill it
      if (result.actions) {
        for (const a of result.actions) {
          if (a.type === "whatsapp" && result.gathered?.message_content) {
            a.value = `${a.value}|||${String(result.gathered.message_content)}`;
          }
        }
      }

      // Also handle whatsapp chips — these are rendered as clickable buttons, handled in the render section
      // Log non-messaging completed intents to the property timeline
      const noLog = ["unknown", "message_tenant", "message_contractor", "compliance_advice", "contractor_update", "tenant_response"];
      let saved = false;
      if (result.completed && result.intent && !noLog.includes(result.intent)) {
        const mp = matchProp(result.property_match ?? result.gathered?.property ?? null);
        if (mp) {
          await supabase.from("rentura_events").insert({
            property_id: mp.id, user_id: user.id, event_type: result.intent,
            title: result.actions?.[0]?.label ?? result.intent.replace(/_/g, " "),
            description: result.reply,
            amount: result.gathered?.amount ? parseFloat(String(result.gathered.amount).replace(/[£,]/g, "")) : null,
            trust_level: "confirmed", metadata: result.gathered ?? {},
            event_date: (result.gathered?.date as string) ?? new Date().toISOString().split("T")[0],
          });
          saved = true;
        }
      }
      // Log contractor updates (quote received, scheduled, etc.) with amount if present
      if (result.completed && result.intent === "contractor_update") {
        const mp = matchProp(result.property_match ?? result.gathered?.property ?? null);
        if (mp) {
          await supabase.from("rentura_events").insert({
            property_id: mp.id, user_id: user.id, event_type: "maintenance",
            title: result.gathered?.title ?? `Contractor update — ${result.gathered?.contractor_name ?? "contractor"}`,
            description: result.reply,
            amount: result.gathered?.quote_amount ? parseFloat(String(result.gathered.quote_amount).replace(/[£,]/g, "")) : null,
            trust_level: "confirmed",
            metadata: { ...result.gathered ?? {}, source: "chat" },
            event_date: (result.gathered?.scheduled_date as string) ?? new Date().toISOString().split("T")[0],
          });
          saved = true;
        }
      }

      // Merge incoming pending_actions into state (deduplicate by label)
      if (result.pending_actions && Array.isArray(result.pending_actions) && result.pending_actions.length > 0) {
        setPendingActions(prev => {
          const existingLabels = new Set(prev.filter(p => !p.dismissed).map(p => p.label));
          const fresh: PendingAction[] = (result.pending_actions as Omit<PendingAction, "id">[])
            .filter((a) => !existingLabels.has(a.label))
            .map((a) => ({ ...a, id: `${Date.now()}-${Math.random()}` }));
          return [...prev, ...fresh];
        });
      }

      setMessages(m => [...m, {
        role: "ai",
        text: result.reply ?? "Something went wrong.",
        card: result.summary_card ?? null,
        actions: result.actions ?? [],
        awaitingConfirm: result.needsConfirmation === true,
        followUp: result.completed ? result.followUp : null,
        saved,
      }]);
    } catch {
      setMessages(m => [...m, { role: "ai", text: "Connection issue — please try again." }]);
    }
    setChatLoading(false);
  }, [chatLoading, user, ctx, apiHistory, props, pendingFile, scanFile, matchProp]);

  if (hide) return null;

  // ── Scan results panel ───────────────────────────────────────────────────────
  const ScanPanel = pendingScan ? (() => {
    const { result, done, propId, tenantId } = pendingScan;
    const catColor = CAT_COLOR[result.document_category] ?? "#64748b";
    const anyDone = Object.values(done).some(v => v === "ok");
    const allDone = result.suggested_actions.length > 0 && result.suggested_actions.every(a => done[a.id] === "ok");
    const needsPropSelect = !propId && result.suggested_actions.some(a => a.id !== "save_to_documents");
    const needsTenantSelect = !tenantId && result.suggested_actions.some(a => ["update_tenant", "log_rtr"].includes(a.id));

    return (
      <div style={{ background: "#0b1020", borderTop: "1px solid rgba(255,255,255,0.07)", flexShrink: 0, maxHeight: "55vh", overflowY: "auto" }}>
        <div style={{ padding: "12px 14px" }}>

          {/* Doc type + confidence */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <span style={{ fontSize: 11, fontWeight: 800, background: catColor + "22", color: catColor, padding: "2px 9px", borderRadius: 10, border: `1px solid ${catColor}40`, textTransform: "uppercase", letterSpacing: "0.07em" }}>
                {result.document_type}
              </span>
              {result.confidence === "low" && (
                <span style={{ fontSize: 10, color: "#d97706", fontWeight: 700 }}>⚠ low confidence</span>
              )}
            </div>
            <button onClick={() => setPendingScan(null)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.25)", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>✕</button>
          </div>

          {/* Extracted fields */}
          {Object.keys(result.extracted).length > 0 && (
            <div style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 9, padding: "8px 11px", marginBottom: 10 }}>
              {Object.entries(result.extracted).map(([k, v]) => (
                <div key={k} style={{ display: "flex", gap: 8, marginBottom: 4, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.28)", minWidth: 115, flexShrink: 0, lineHeight: 1.5 }}>{k}</span>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.82)", flex: 1, lineHeight: 1.5 }}>{v}</span>
                </div>
              ))}
            </div>
          )}

          {/* Property selector */}
          {needsPropSelect && props.length > 1 && (
            <div style={{ marginBottom: 8 }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 5 }}>Which property?</p>
              <select value={pendingScan.propId ?? ""} onChange={e => setPendingScan(s => s ? { ...s, propId: e.target.value || null } : s)}
                style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 7, padding: "7px 10px", color: "rgba(255,255,255,0.8)", fontSize: 12, fontFamily: "inherit" }}>
                <option value="">Select property…</option>
                {props.map(p => <option key={p.id} value={p.id}>{shortAddr(p.address)}</option>)}
              </select>
            </div>
          )}

          {/* Tenant selector */}
          {needsTenantSelect && tenants.length > 0 && (
            <div style={{ marginBottom: 8 }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 5 }}>Which tenant?</p>
              <select value={pendingScan.tenantId ?? ""} onChange={e => setPendingScan(s => s ? { ...s, tenantId: e.target.value || null } : s)}
                style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 7, padding: "7px 10px", color: "rgba(255,255,255,0.8)", fontSize: 12, fontFamily: "inherit" }}>
                <option value="">Select tenant…</option>
                {tenants.map(t => <option key={t.id} value={t.id}>{t.first_name} {t.last_name}</option>)}
              </select>
            </div>
          )}

          {/* Action buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {result.suggested_actions.map(action => {
              const status = done[action.id];
              const loading = actionLoading === action.id;
              const ok = status === "ok";
              const err = status === "err";
              const dest = ACTION_DESTINATION[action.id];
              return (
                <button key={action.id}
                  onClick={() => !ok && !loading && executeAction(action)}
                  disabled={loading || ok}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: action.primary ? "11px 14px" : "8px 12px", borderRadius: 9, width: "100%",
                    background: ok ? "rgba(22,163,74,0.1)" : err ? "rgba(239,68,68,0.08)" : action.primary ? action.color + "1a" : "rgba(255,255,255,0.025)",
                    border: `1px solid ${ok ? "rgba(22,163,74,0.3)" : err ? "rgba(239,68,68,0.25)" : action.primary ? action.color + "55" : "rgba(255,255,255,0.07)"}`,
                    cursor: ok ? "default" : "pointer", fontFamily: "inherit", textAlign: "left",
                    opacity: loading ? 0.6 : 1, transition: "all 0.15s",
                  }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: action.primary ? 13 : 12, fontWeight: action.primary ? 700 : 600, marginBottom: 2, color: ok ? "#16a34a" : err ? "#ef4444" : action.primary ? action.color : "rgba(255,255,255,0.7)" }}>
                      {ok ? `✓ Saved` : loading ? "Saving…" : action.label}
                    </p>
                    <p style={{ fontSize: 11, color: "rgba(255,255,255,0.28)", lineHeight: 1.3 }}>
                      {ok ? `Added to ${dest}` : err ? "Tap to retry" : `→ ${dest}${action.description ? ` · ${action.description}` : ""}`}
                    </p>
                  </div>
                  {!ok && !loading && (
                    <span style={{ fontSize: 15, color: action.primary ? action.color : "rgba(255,255,255,0.18)", marginLeft: 10, flexShrink: 0 }}>→</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Dismiss after partial save */}
          {anyDone && !allDone && (
            <button onClick={() => setPendingScan(null)} style={{ marginTop: 8, background: "none", border: "none", color: "rgba(255,255,255,0.2)", fontSize: 11, cursor: "pointer", width: "100%", textAlign: "center", fontFamily: "inherit" }}>
              Done with this document
            </button>
          )}
          {allDone && (
            <p style={{ marginTop: 8, textAlign: "center", fontSize: 11, color: "#16a34a", fontWeight: 700 }}>✓ All saved — tap ✕ to dismiss</p>
          )}
        </div>
      </div>
    );
  })() : null;

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @keyframes fcPulse { 0%,100%{opacity:0.3;transform:scale(0.8)} 50%{opacity:1;transform:scale(1)} }
        @keyframes fcSlideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .attach-opt:hover { background: rgba(255,255,255,0.08) !important; }
      `}</style>

      {/* Hidden file inputs — three separate intents */}
      <input ref={fileInputRef}   type="file" accept="image/jpeg,image/png,image/webp,application/pdf" onChange={makeInputHandler} style={{ display: "none" }} />
      <input ref={photoInputRef}  type="file" accept="image/*" onChange={makeInputHandler} style={{ display: "none" }} />
      <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={makeInputHandler} style={{ display: "none" }} />

      {/* FAB */}
      {!open && (
        <button onClick={() => setOpen(true)}
          style={{ position: "fixed", bottom: 28, right: 28, zIndex: 999, width: 52, height: 52, borderRadius: "50%", background: "#0f1728", color: "#c9a84c", border: "2px solid rgba(201,168,76,0.4)", fontSize: 19, fontWeight: 900, cursor: "pointer", boxShadow: "0 4px 20px rgba(0,0,0,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit" }}
          title="Rentura AI">R
        </button>
      )}

      {open && (
        <div
          style={{ position: "fixed", bottom: 24, right: 24, zIndex: 999, width: 395, maxHeight: "78vh", display: "flex", flexDirection: "column", borderRadius: 16, overflow: "hidden", boxShadow: "0 8px 48px rgba(0,0,0,0.45)", animation: "fcSlideUp 0.2s ease" }}
          onDragEnter={e => { e.preventDefault(); dragCounter.current += 1; if (dragCounter.current === 1) setIsDragging(true); }}
          onDragOver={e => { e.preventDefault(); }}
          onDragLeave={e => { e.preventDefault(); dragCounter.current -= 1; if (dragCounter.current <= 0) { dragCounter.current = 0; setIsDragging(false); } }}
          onDrop={e => {
            e.preventDefault(); dragCounter.current = 0; setIsDragging(false);
            const file = e.dataTransfer.files?.[0];
            if (file) processFile(file);
          }}
        >
          {/* Drag-and-drop overlay */}
          {isDragging && (
            <div style={{ position: "absolute", inset: 0, zIndex: 50, background: "rgba(8,145,178,0.18)", border: "2px dashed #0891b2", borderRadius: 16, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
              <span style={{ fontSize: 36, marginBottom: 8 }}>📄</span>
              <p style={{ color: "#0891b2", fontWeight: 800, fontSize: 15, letterSpacing: "-0.01em" }}>Drop to scan</p>
              <p style={{ color: "rgba(8,145,178,0.7)", fontSize: 12, marginTop: 4 }}>PDF, JPG, PNG, WEBP — up to 10 MB</p>
            </div>
          )}

          {/* Header */}
          <div style={{ background: "#0f1728", padding: "13px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#c9a84c", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 900, color: "#111" }}>R</div>
              <div>
                <p style={{ color: "white", fontWeight: 800, fontSize: 13, lineHeight: 1.2 }}>Rentura AI</p>
                <p style={{ color: "rgba(255,255,255,0.38)", fontSize: 11 }}>{ready ? `Portfolio loaded · ${contacts.length > 0 ? `${contacts.length} contacts · ` : ""}message, log, scan` : "Loading…"}</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {messages.length > 1 && (
                <button onClick={() => { setMessages([]); setApiHistory([]); setReady(false); setCtx(null); setPendingScan(null); setPendingFile(null); setPendingActions([]); }}
                  style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>Clear</button>
              )}
              <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", fontSize: 18, cursor: "pointer", lineHeight: 1, fontFamily: "inherit" }}>×</button>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", background: "#0c0f1a", padding: "16px 16px 8px" }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{ marginBottom: 14 }}>
                {msg.role === "user" ? (
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: "12px 12px 2px 12px", padding: "9px 13px", maxWidth: "82%" }}>
                      {msg.attachment && (
                        <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.07)", borderRadius: 6, padding: "4px 8px", marginBottom: msg.text ? 6 : 0 }}>
                          <span style={{ fontSize: 14 }}>{msg.attachment.filename.endsWith(".pdf") ? "📄" : "🖼"}</span>
                          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", maxWidth: 190, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{msg.attachment.filename}</span>
                        </div>
                      )}
                      {msg.text && <p style={{ color: "white", fontSize: 13, lineHeight: 1.5 }}>{msg.text}</p>}
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "flex", gap: 8, alignItems: "flex-start", maxWidth: "93%" }}>
                    <div style={{ width: 24, height: 24, background: "#1e293b", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.6)" }}>R</div>
                    <div style={{ flex: 1 }}>
                      <p style={{ color: "rgba(255,255,255,0.88)", fontSize: 13, lineHeight: 1.65, whiteSpace: "pre-line" }}>{msg.text}</p>

                      {/* Summary card */}
                      {msg.card && (
                        <div style={{ marginTop: 10, borderRadius: 10, overflow: "hidden", border: `1px solid ${msg.card.color}35`, borderLeft: `3px solid ${msg.card.color}` }}>
                          <div style={{ background: `${msg.card.color}18`, padding: "8px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <span style={{ fontSize: 11, fontWeight: 800, color: msg.card.color, letterSpacing: "0.02em" }}>
                              {msg.card.stage === "quote_received" && "💬 "}
                              {msg.card.stage === "scheduled" && "✅ "}
                              {msg.card.stage === "completed" && "🔧 "}
                              {msg.card.stage === "awaiting_landlord" && "⏳ "}
                              {msg.card.stage === "tenant_updated" && "📨 "}
                              {msg.card.stage === "invoice_pending" && "🧾 "}
                              {msg.card.title}
                            </span>
                          </div>
                          <div style={{ background: `${msg.card.color}08`, padding: "8px 12px" }}>
                            {msg.card.items.map((item, i) => {
                              const [k, ...rest] = item.split(":");
                              const v = rest.join(":").trim();
                              return (
                                <div key={i} style={{ display: "flex", gap: 6, marginBottom: i < msg.card!.items.length - 1 ? 4 : 0 }}>
                                  <span style={{ fontSize: 11, color: `${msg.card!.color}99`, minWidth: 80, flexShrink: 0, lineHeight: 1.5 }}>{k}</span>
                                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.8)", lineHeight: 1.5, fontWeight: 500 }}>{v || item}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {msg.actions && msg.actions.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 8 }}>
                          {msg.actions.map((a, i) => {
                            if (a.type === "whatsapp") {
                              const [rawPhone, msgContent] = String(a.value ?? "").split("|||");
                              const phone = rawPhone.replace(/\D/g, "");
                              const url = phone
                                ? `https://wa.me/${phone}${msgContent ? `?text=${encodeURIComponent(msgContent)}` : ""}`
                                : `https://wa.me/`;
                              return (
                                <button key={i}
                                  onClick={() => window.open(url, "_blank")}
                                  style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 700, padding: "7px 13px", borderRadius: 20, background: "#16a34a22", color: "#16a34a", border: "1px solid #16a34a60", cursor: "pointer", fontFamily: "inherit" }}>
                                  <span style={{ fontSize: 15 }}>📱</span> {a.label}
                                </button>
                              );
                            }
                            if (a.type === "log_when_done") {
                              return <button key={i} onClick={() => send(a.label)} style={{ fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 20, background: `${a.color}20`, color: a.color, border: `1px solid ${a.color}60`, cursor: "pointer", fontFamily: "inherit" }}>{a.label} →</button>;
                            }
                            return <span key={i} style={{ fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 20, background: `${a.color}20`, color: a.color, border: `1px solid ${a.color}40` }}>{a.label}{a.value ? ` · ${a.value}` : ""}</span>;
                          })}
                        </div>
                      )}
                      {msg.saved && <p style={{ fontSize: 11, color: "#16a34a", fontWeight: 700, marginTop: 6 }}>✓ Saved to Property Passport</p>}
                      {msg.followUp && (
                        <button onClick={() => send(msg.followUp!)} style={{ marginTop: 8, background: "none", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 20, padding: "4px 11px", color: "rgba(255,255,255,0.5)", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>
                          {msg.followUp} →
                        </button>
                      )}
                      {msg.awaitingConfirm && idx === messages.length - 1 && (
                        <div style={{ display: "flex", gap: 7, marginTop: 10 }}>
                          <button onClick={() => send("Confirmed")} style={{ background: "#16a34a", color: "white", border: "none", borderRadius: 7, padding: "7px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Confirm & Save</button>
                          <button onClick={() => send("Let me edit that")} style={{ background: "none", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 7, padding: "7px 14px", fontSize: 12, color: "rgba(255,255,255,0.5)", cursor: "pointer", fontFamily: "inherit" }}>Edit</button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {chatLoading && (
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <div style={{ width: 24, height: 24, background: "#1e293b", borderRadius: "50%", flexShrink: 0 }} />
                <div style={{ display: "flex", gap: 4 }}>{[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(255,255,255,0.3)", animation: `fcPulse 1.2s ${i*0.2}s infinite` }} />)}</div>
              </div>
            )}
            {!ready && !chatLoading && messages.length === 0 && (
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <div style={{ width: 24, height: 24, background: "#1e293b", borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.5)" }}>R</div>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}>Loading your portfolio…</p>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Scan results panel */}
          {ScanPanel}

          {/* Pending actions strip */}
          {pendingActions.filter(a => !a.dismissed).length > 0 && (
            <div style={{ background: "#090d1a", borderTop: "1px solid rgba(255,255,255,0.07)", flexShrink: 0 }}>
              <div style={{ padding: "7px 12px 2px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.28)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Needs action · {pendingActions.filter(a => !a.dismissed).length}
                </span>
                <button onClick={() => setPendingActions(p => p.map(a => ({ ...a, dismissed: true })))}
                  style={{ background: "none", border: "none", color: "rgba(255,255,255,0.18)", fontSize: 10, cursor: "pointer", fontFamily: "inherit" }}>
                  clear all
                </button>
              </div>
              <div style={{ padding: "0 10px 8px", display: "flex", flexDirection: "column", gap: 4, maxHeight: 160, overflowY: "auto" }}>
                {pendingActions.filter(a => !a.dismissed).map(a => {
                  const ICON: Record<string, string> = {
                    landlord_decide: "🟡",
                    send_to_tenant: "📨",
                    chase_contractor: "📞",
                    log_action: "📋",
                  };
                  const COL: Record<string, string> = {
                    landlord_decide: "#d97706",
                    send_to_tenant: "#7c3aed",
                    chase_contractor: "#0891b2",
                    log_action: "#16a34a",
                  };
                  const col = COL[a.type] ?? "#64748b";
                  return (
                    <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 8, background: `${col}0d`, border: `1px solid ${col}25`, borderRadius: 8, padding: "6px 10px" }}>
                      <span style={{ fontSize: 13, flexShrink: 0 }}>{ICON[a.type] ?? "•"}</span>
                      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.72)", flex: 1, lineHeight: 1.4 }}>{a.label}</span>
                      <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
                        {a.message && a.phone && (
                          <button
                            onClick={() => {
                              const phone = a.phone!.replace(/\D/g, "");
                              window.open(`https://wa.me/${phone}?text=${encodeURIComponent(a.message!)}`, "_blank");
                              setPendingActions(p => p.map(x => x.id === a.id ? { ...x, dismissed: true } : x));
                            }}
                            style={{ fontSize: 10, fontWeight: 700, padding: "3px 9px", background: "#16a34a1a", border: "1px solid #16a34a55", borderRadius: 10, color: "#16a34a", cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
                            📱 Send
                          </button>
                        )}
                        {a.message && !a.phone && (
                          <button
                            onClick={() => send(`Draft message: ${a.message}`)}
                            style={{ fontSize: 10, fontWeight: 700, padding: "3px 9px", background: `${col}1a`, border: `1px solid ${col}55`, borderRadius: 10, color: col, cursor: "pointer", fontFamily: "inherit" }}>
                            Draft →
                          </button>
                        )}
                        {!a.message && a.type === "landlord_decide" && (
                          <button
                            onClick={() => { setInput(a.label); inputRef.current?.focus(); }}
                            style={{ fontSize: 10, fontWeight: 700, padding: "3px 9px", background: `${col}1a`, border: `1px solid ${col}55`, borderRadius: 10, color: col, cursor: "pointer", fontFamily: "inherit" }}>
                            Reply →
                          </button>
                        )}
                        <button
                          onClick={() => setPendingActions(p => p.map(x => x.id === a.id ? { ...x, dismissed: true } : x))}
                          style={{ background: "none", border: "none", color: "rgba(255,255,255,0.2)", fontSize: 13, cursor: "pointer", padding: "0 2px", lineHeight: 1 }}>
                          ✕
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick prompts */}
          {messages.length <= 1 && ready && !pendingFile && !pendingScan && (
            <div style={{ background: "#0c0f1a", padding: "0 12px 10px", display: "flex", flexWrap: "wrap", gap: 5 }}>
              {["Log a maintenance issue", "What should I focus on today?", "Log rent received", "How am I doing this tax year?"].map(p => (
                <button key={p} onClick={() => send(p)} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 20, padding: "5px 11px", fontSize: 11, color: "rgba(255,255,255,0.55)", cursor: "pointer", fontFamily: "inherit" }}>{p}</button>
              ))}
            </div>
          )}

          {/* Pending file badge */}
          {pendingFile && (
            <div style={{ background: "#0c0f1a", padding: "6px 12px 0", display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7, background: "rgba(8,145,178,0.1)", border: "1px solid rgba(8,145,178,0.3)", borderRadius: 8, padding: "5px 10px", flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: 15, flexShrink: 0 }}>{pendingFile.file.type === "application/pdf" ? "📄" : "🖼"}</span>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{pendingFile.file.name}</span>
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", flexShrink: 0 }}>{(pendingFile.file.size / 1024).toFixed(0)} KB</span>
              </div>
              <button onClick={() => setPendingFile(null)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", fontSize: 16, cursor: "pointer", flexShrink: 0 }}>✕</button>
            </div>
          )}

          {/* Input bar */}
          <div style={{ background: "#111827", padding: "10px 12px", display: "flex", gap: 6, flexShrink: 0, alignItems: "center", position: "relative" }}>

            {/* Attach button + floating menu */}
            <div style={{ position: "relative", flexShrink: 0 }}>
              <button
                onClick={e => { e.stopPropagation(); setShowAttachMenu(v => !v); }}
                disabled={chatLoading}
                title="Attach a document, photo, or take a photo"
                style={{ background: showAttachMenu ? "rgba(8,145,178,0.25)" : pendingFile ? "rgba(8,145,178,0.15)" : "rgba(255,255,255,0.08)", border: `1px solid ${showAttachMenu || pendingFile ? "rgba(8,145,178,0.6)" : "rgba(255,255,255,0.15)"}`, color: pendingFile ? "#0891b2" : showAttachMenu ? "#38bdf8" : "rgba(255,255,255,0.75)", fontSize: 18, fontWeight: 700, cursor: chatLoading ? "not-allowed" : "pointer", padding: "6px 9px", borderRadius: 8, lineHeight: 1, opacity: chatLoading ? 0.4 : 1, transition: "all 0.15s" }}>
                +
              </button>

              {/* Attach popup */}
              {showAttachMenu && (
                <div onClick={e => e.stopPropagation()} style={{ position: "absolute", bottom: "calc(100% + 8px)", left: 0, background: "#0f1728", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 11, padding: 6, display: "flex", flexDirection: "column", gap: 2, zIndex: 20, boxShadow: "0 6px 24px rgba(0,0,0,0.4)", minWidth: 190 }}>
                  {/* eslint-disable-next-line react-hooks/refs -- each .current read is inside an onClick closure, so it happens on click rather than during render; the compiler cannot see that the array is only invoked later */}
                  {[
                    { icon: "📄", label: "Upload file", sub: "PDF, JPG, PNG", action: () => fileInputRef.current?.click() },
                    { icon: "🖼", label: "Choose photo", sub: "From your gallery", action: () => photoInputRef.current?.click() },
                    { icon: "📷", label: "Take a photo", sub: "Use your camera", action: () => cameraInputRef.current?.click() },
                  ].map(opt => (
                    <button key={opt.label} className="attach-opt"
                      onClick={() => { opt.action(); setShowAttachMenu(false); }}
                      style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 8, background: "transparent", border: "none", cursor: "pointer", fontFamily: "inherit", textAlign: "left", transition: "background 0.12s" }}>
                      <span style={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }}>{opt.icon}</span>
                      <div>
                        <p style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.82)", margin: 0 }}>{opt.label}</p>
                        <p style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", margin: 0 }}>{opt.sub}</p>
                      </div>
                    </button>
                  ))}
                  <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", margin: "4px 0 2px", padding: "4px 10px 0" }}>
                    <p style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", lineHeight: 1.4 }}>Gas cert, EICR, EPC, tenancy agreement, bank statement, invoice, MIP, passport — anything</p>
                  </div>
                </div>
              )}
            </div>

            <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); if (pendingFile) scanFile(pendingFile); else send(input); } }}
              placeholder={pendingFile ? "Add a note or press Send to scan…" : ready ? "Tell me what happened…" : "Loading portfolio…"}
              disabled={chatLoading || !ready}
              style={{ flex: 1, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 9, padding: "9px 13px", color: "white", fontSize: 13, outline: "none", fontFamily: "inherit" }}
            />
            <button onClick={() => { if (pendingFile) scanFile(pendingFile); else send(input); }}
              disabled={chatLoading || (!input.trim() && !pendingFile) || !ready}
              style={{ background: "#0f1728", color: "white", border: "none", borderRadius: 9, padding: "9px 15px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", opacity: ((!input.trim() && !pendingFile) || chatLoading || !ready) ? 0.4 : 1 }}>
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
