"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";

// ── Types ──────────────────────────────────────────────────────────────────────
type ExtractedCert = {
  certificate_type: string | null;
  issue_date: string | null;
  expiry_date: string | null;
  contractor: string | null;
  cert_reference: string | null;
  property_address: string | null;
  notes: string | null;
};
type PendingFile = { file: File; base64: string; mediaType: string };
type PendingConfirm = {
  extracted: ExtractedCert;
  propertyMatch: string | null;
  file: File | null;
  base64: string | null;
  mediaType: string | null;
  editing: boolean;
};
type Message = {
  role: "user" | "ai";
  text: string;
  attachment?: { filename: string };
  actions?: { type: string; label: string; value: string; color: string }[];
  followUp?: string | null;
  awaitingConfirm?: boolean;
  saved?: boolean;
  certConfirm?: boolean;
};
type APIHistory = { role: "user" | "assistant"; content: string }[];
type PortfolioCtx = Record<string, unknown>;

function shortAddr(a: string) { return a.split(",")[0]; }

// ── Helpers ────────────────────────────────────────────────────────────────────
function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Strip the data URL prefix (data:image/jpeg;base64,...)
      resolve(result.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function certFieldLabel(key: string): string {
  const map: Record<string, string> = {
    certificate_type: "Certificate type", issue_date: "Issue date",
    expiry_date: "Expiry / next due", contractor: "Contractor / assessor",
    cert_reference: "Reference number", property_address: "Property address",
    notes: "Notes",
  };
  return map[key] ?? key;
}

const CERT_TYPES = [
  "Gas Safety Certificate", "EICR", "EPC", "PAT Test",
  "Fire Risk Assessment", "Legionella Risk Assessment",
  "HMO Licence", "Building Regulations Certificate", "Other",
];

// ── Main component ─────────────────────────────────────────────────────────────
export default function FloatingChat() {
  const { user } = useAuth();
  const pathname = usePathname();

  const hide = !user
    || pathname?.startsWith("/rentura/auth")
    || pathname === "/rentura"
    || pathname === "/rentura/"
    || pathname === "/rentura/dashboard"
    || pathname === "/rentura/dashboard/";

  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [ctx, setCtx] = useState<PortfolioCtx | null>(null);
  const [props, setProps] = useState<{ id: string; address: string; nickname: string | null; property_type: string; bedrooms: number | null }[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [apiHistory, setApiHistory] = useState<APIHistory>([]);
  const [input, setInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [pendingFile, setPendingFile] = useState<PendingFile | null>(null);
  const [pendingConfirm, setPendingConfirm] = useState<PendingConfirm | null>(null);
  const [certSaving, setCertSaving] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, pendingConfirm]);

  const loadCtx = useCallback(async () => {
    if (ready || !user) return;
    const [propRes, tenantRes, mortRes, taxRes, issuesRes] = await Promise.all([
      supabase.from("rentura_properties").select("id,address,nickname,property_type,bedrooms").eq("user_id", user.id),
      supabase.from("rentura_tenants").select("*").eq("user_id", user.id).eq("is_current", true),
      supabase.from("rentura_mortgages").select("*").eq("user_id", user.id).eq("is_current", true),
      fetch(`/api/rentura/tax-summary/?userId=${user.id}`).then(r => r.json()).catch(() => null),
      supabase.from("tenant_issues").select("id,title,priority,tenant_name,property_id").eq("landlord_user_id", user.id).neq("status", "resolved").is("landlord_first_response_at", null).limit(8),
    ]);

    const properties = propRes.data ?? [];
    setProps(properties);

    const tenantMap: Record<string, { name?: string | null; first_name?: string | null; last_name?: string | null; monthly_rent?: number | null; move_in_date?: string | null; tenancy_start?: string | null }> = {};
    for (const t of tenantRes.data ?? []) tenantMap[t.property_id] = t;
    const mortMap: Record<string, { lender?: string | null; interest_rate?: number | null; monthly_payment?: number | null; fixed_term_expiry?: string | null }> = {};
    for (const m of mortRes.data ?? []) mortMap[m.property_id] = m;

    const totalIncome = (tenantRes.data ?? []).reduce((s, t) => s + (t.monthly_rent ?? 0), 0);
    const totalMort = (mortRes.data ?? []).reduce((s, m) => s + (m.monthly_payment ?? 0), 0);

    const newCtx: PortfolioCtx = {
      today: new Date().toISOString().split("T")[0],
      totalMonthlyIncome: totalIncome,
      totalMortgagePayments: totalMort,
      netMonthlyCashflow: totalIncome - totalMort,
      taxYear: taxRes?.taxYear,
      taxYearIncome: taxRes?.income,
      taxYearExpenses: taxRes?.expenses,
      taxYearNet: taxRes?.net,
      tenants: properties.map(p => {
        const t = tenantMap[p.id];
        return t
          ? { property: shortAddr(p.address), name: t.name ?? `${t.first_name ?? ""} ${t.last_name ?? ""}`.trim(), rent: t.monthly_rent, moveIn: t.move_in_date ?? t.tenancy_start }
          : { property: shortAddr(p.address), name: "Vacant", rent: null };
      }),
      mortgages: properties.map(p => {
        const m = mortMap[p.id];
        return m ? { property: shortAddr(p.address), lender: m.lender, rate: m.interest_rate, monthly: m.monthly_payment, fixedExpiry: m.fixed_term_expiry } : null;
      }).filter(Boolean),
      unrespondedIssues: (issuesRes.data ?? []).map(i => {
        const prop = properties.find(p => p.id === i.property_id);
        return { title: i.title, tenantName: i.tenant_name ?? "Tenant", property: prop ? shortAddr(prop.address) : "Property", priority: i.priority };
      }),
    };

    setCtx(newCtx);
    setReady(true);

    const hour = new Date().getHours();
    const greet = hour < 12 ? "Morning" : hour < 17 ? "Afternoon" : "Evening";
    const issues = issuesRes.data?.length ?? 0;
    const openMsg = issues > 0
      ? `${greet} — I've loaded your portfolio. You have ${issues} unanswered tenant issue${issues > 1 ? "s" : ""}. What do you need?`
      : `${greet} — portfolio loaded. ${properties.length} propert${properties.length === 1 ? "y" : "ies"}, £${totalIncome.toLocaleString()}/mo income. What do you need?`;
    setMessages([{ role: "ai", text: openMsg }]);
  }, [ready, user]);

  useEffect(() => { if (open) loadCtx(); }, [open, loadCtx]);

  function matchProp(text: string | null) {
    if (!text) return null;
    const t = text.toLowerCase();
    return props.find(p => p.address.toLowerCase().includes(t) || t.includes(p.address.split(",")[0].toLowerCase()) || (p.nickname && t.includes(p.nickname.toLowerCase()))) ?? null;
  }

  // ── File picker ──────────────────────────────────────────────────────────────
  async function onFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!fileInputRef.current) fileInputRef.current = e.target;
    if (!file) return;

    const MAX_MB = 8;
    if (file.size > MAX_MB * 1024 * 1024) {
      alert(`File too large. Please use a file under ${MAX_MB}MB.`);
      e.target.value = "";
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      alert("Only JPG, PNG, WEBP images and PDF files are supported.");
      e.target.value = "";
      return;
    }

    try {
      const base64 = await readFileAsBase64(file);
      setPendingFile({ file, base64, mediaType: file.type });
    } catch {
      alert("Could not read the file. Please try again.");
    }
    e.target.value = "";
  }

  // ── Send with file (certificate extraction) ──────────────────────────────────
  const sendWithFile = useCallback(async (pf: PendingFile) => {
    if (!user || !ctx) return;
    setPendingFile(null);
    setChatLoading(true);

    // User bubble
    setMessages(m => [...m, {
      role: "user",
      text: input.trim() || "Here's the certificate — can you read it?",
      attachment: { filename: pf.file.name },
    }]);
    setInput("");

    try {
      const res = await fetch("/api/rentura/extract-certificate/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          base64Data: pf.base64,
          mediaType: pf.mediaType,
          filename: pf.file.name,
          properties: props,
        }),
      });
      const result = await res.json();

      if (result.extracted) {
        setPendingConfirm({
          extracted: result.extracted as ExtractedCert,
          propertyMatch: result.property_match ?? null,
          file: pf.file,
          base64: pf.base64,
          mediaType: pf.mediaType,
          editing: false,
        });
      }

      setMessages(m => [...m, {
        role: "ai",
        text: result.reply ?? "I read the certificate. Please check the details below.",
        certConfirm: !!result.extracted,
      }]);
    } catch {
      setMessages(m => [...m, { role: "ai", text: "Couldn't read the file. Please try again or enter the details manually." }]);
    }
    setChatLoading(false);
  }, [user, ctx, props, input]);

  // ── Save extracted certificate ───────────────────────────────────────────────
  const saveCertificate = useCallback(async (data: ExtractedCert, propertyMatch: string | null, file: File | null, base64: string | null, mediaType: string | null) => {
    if (!user) return;
    setCertSaving(true);

    // Match property from portfolio
    const prop = matchProp(propertyMatch) ?? (props.length === 1 ? props[0] : null);
    if (!prop) {
      setMessages(m => [...m, { role: "ai", text: "I couldn't match this to a property in your portfolio. Which property is this certificate for?" }]);
      setCertSaving(false);
      return;
    }

    // Upload file to Supabase Storage
    let fileUrl: string | null = null;
    if (file && base64 && mediaType) {
      const ext = file.name.split(".").pop() ?? "pdf";
      const storagePath = `${user.id}/${Date.now()}-${file.name.replace(/[^a-z0-9._-]/gi, "_")}`.toLowerCase();
      // Convert base64 back to Blob for upload
      const byteChars = atob(base64);
      const byteArr = new Uint8Array(byteChars.length);
      for (let i = 0; i < byteChars.length; i++) byteArr[i] = byteChars.charCodeAt(i);
      const blob = new Blob([byteArr], { type: mediaType });
      const { data: uploadData } = await supabase.storage.from("rentura-certificates").upload(storagePath, blob, { contentType: mediaType, upsert: false });
      if (uploadData) {
        const { data: urlData } = supabase.storage.from("rentura-certificates").getPublicUrl(storagePath);
        fileUrl = urlData?.publicUrl ?? null;
        // If bucket is private, fall back to signed URL path
        if (!fileUrl) fileUrl = storagePath;
      }
      void ext; // suppress unused var
    }

    // Save to compliance table
    const { error } = await supabase.from("rentura_compliance").insert({
      user_id: user.id,
      property_id: prop.id,
      certificate_type: data.certificate_type ?? "Other",
      issue_date: data.issue_date ?? null,
      expiry_date: data.expiry_date ?? null,
      contractor: data.contractor ?? null,
      cert_reference: data.cert_reference ?? null,
      notes: [data.notes, fileUrl ? `File: ${fileUrl}` : null].filter(Boolean).join(" | ") || null,
      file_url: fileUrl,
      trust_level: "confirmed",
    });

    setCertSaving(false);
    setPendingConfirm(null);

    if (error) {
      setMessages(m => [...m, { role: "ai", text: `Couldn't save: ${error.message}. Please check your database has the new columns (run supabase/rentura-compliance-file-url.sql).` }]);
    } else {
      setMessages(m => [...m, {
        role: "ai",
        text: `${data.certificate_type ?? "Certificate"} logged for ${shortAddr(prop.address)}${data.expiry_date ? `. Expires ${data.expiry_date}` : ""}. Visible in Compliance.`,
        saved: true,
        followUp: "Upload another certificate?",
      }]);
    }
  }, [user, props, matchProp]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Regular text send ────────────────────────────────────────────────────────
  const send = useCallback(async (text: string) => {
    // If there's a pending file, route to extraction instead
    if (pendingFile) {
      await sendWithFile(pendingFile);
      return;
    }

    if (!text.trim() || chatLoading || !user || !ctx) return;
    setMessages(m => [...m, { role: "user", text: text.trim() }]);
    setInput("");
    setChatLoading(true);
    try {
      const res = await fetch("/api/rentura/chat/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history: apiHistory, userInput: text.trim(), properties: props, context: ctx }),
      });
      const result = await res.json();
      setApiHistory(h => [...h, { role: "user", content: text.trim() }, { role: "assistant", content: result.reply ?? "" }]);

      let saved = false;
      if (result.completed && result.intent && result.intent !== "unknown" && result.intent !== "message_tenant") {
        const mp = matchProp(result.property_match ?? result.gathered?.property ?? null);
        if (mp) {
          await supabase.from("rentura_events").insert({
            property_id: mp.id, user_id: user.id, event_type: result.intent,
            title: result.actions?.[0]?.label ?? result.intent.replace(/_/g, " "),
            description: result.reply, amount: result.gathered?.amount ? parseFloat(String(result.gathered.amount).replace(/[£,]/g, "")) : null,
            trust_level: "confirmed", metadata: result.gathered ?? {},
            event_date: result.gathered?.date as string ?? new Date().toISOString().split("T")[0],
          });
          saved = true;
        }
      }
      if (result.intent === "message_tenant" && result.completed && result.gathered?.phone && result.gathered?.message_content) {
        window.open(`https://wa.me/${String(result.gathered.phone).replace(/\D/g, "")}?text=${encodeURIComponent(String(result.gathered.message_content))}`, "_blank");
      }

      setMessages(m => [...m, {
        role: "ai", text: result.reply ?? "Something went wrong.",
        actions: result.actions ?? [],
        awaitingConfirm: result.needsConfirmation === true,
        followUp: result.completed ? result.followUp : null,
        saved,
      }]);
    } catch {
      setMessages(m => [...m, { role: "ai", text: "Connection issue — please try again." }]);
    }
    setChatLoading(false);
  }, [chatLoading, user, ctx, apiHistory, props, pendingFile, sendWithFile]); // eslint-disable-line react-hooks/exhaustive-deps

  if (hide) return null;

  // ── Cert confirmation panel ──────────────────────────────────────────────────
  const CertConfirmPanel = pendingConfirm ? (() => {
    const d = pendingConfirm.extracted;
    const fields: (keyof ExtractedCert)[] = ["certificate_type", "issue_date", "expiry_date", "contractor", "cert_reference", "property_address", "notes"];

    if (pendingConfirm.editing) {
      return (
        <div style={{ background: "rgba(8,145,178,0.08)", border: "1px solid rgba(8,145,178,0.25)", borderRadius: 12, padding: "13px 14px", margin: "0 12px 10px" }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#0891b2", marginBottom: 10 }}>Edit details before saving</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            <div>
              <p style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginBottom: 3 }}>Certificate type</p>
              <select value={d.certificate_type ?? ""} onChange={e => setPendingConfirm(p => p ? { ...p, extracted: { ...p.extracted, certificate_type: e.target.value } } : p)}
                style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "6px 8px", color: "white", fontSize: 12, fontFamily: "inherit" }}>
                <option value="">Select…</option>
                {CERT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            {(["issue_date", "expiry_date"] as const).map(f => (
              <div key={f}>
                <p style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginBottom: 3 }}>{certFieldLabel(f)}</p>
                <input type="date" value={(d[f] as string | null) ?? ""} onChange={e => setPendingConfirm(p => p ? { ...p, extracted: { ...p.extracted, [f]: e.target.value || null } } : p)}
                  style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "6px 8px", color: "white", fontSize: 12, fontFamily: "inherit", boxSizing: "border-box" }} />
              </div>
            ))}
            {(["contractor", "cert_reference", "property_address"] as const).map(f => (
              <div key={f}>
                <p style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginBottom: 3 }}>{certFieldLabel(f)}</p>
                <input value={(d[f] as string | null) ?? ""} onChange={e => setPendingConfirm(p => p ? { ...p, extracted: { ...p.extracted, [f]: e.target.value || null } } : p)}
                  placeholder={`Enter ${certFieldLabel(f).toLowerCase()}…`}
                  style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "6px 8px", color: "white", fontSize: 12, fontFamily: "inherit", boxSizing: "border-box" }} />
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 7, marginTop: 10 }}>
            <button onClick={() => saveCertificate(d, pendingConfirm.propertyMatch, pendingConfirm.file, pendingConfirm.base64, pendingConfirm.mediaType)}
              disabled={certSaving}
              style={{ flex: 1, background: "#0891b2", color: "white", fontWeight: 700, fontSize: 12, padding: "8px", borderRadius: 7, border: "none", cursor: "pointer", opacity: certSaving ? 0.6 : 1 }}>
              {certSaving ? "Saving…" : "Save to Compliance"}
            </button>
            <button onClick={() => setPendingConfirm(p => p ? { ...p, editing: false } : p)}
              style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)", fontSize: 12, padding: "8px 12px", borderRadius: 7, border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer" }}>
              Back
            </button>
          </div>
        </div>
      );
    }

    return (
      <div style={{ background: "rgba(8,145,178,0.08)", border: "1px solid rgba(8,145,178,0.25)", borderRadius: 12, padding: "13px 14px", margin: "0 12px 10px" }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: "#0891b2", marginBottom: 8 }}>Extracted from certificate</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 10 }}>
          {fields.filter(f => d[f]).map(f => (
            <div key={f} style={{ display: "flex", gap: 8 }}>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", minWidth: 100, flexShrink: 0 }}>{certFieldLabel(f)}</span>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.85)", flex: 1 }}>{String(d[f])}</span>
            </div>
          ))}
          {pendingConfirm.propertyMatch && (
            <div style={{ display: "flex", gap: 8, marginTop: 2 }}>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", minWidth: 100, flexShrink: 0 }}>Property match</span>
              <span style={{ fontSize: 11, color: "#0891b2", fontWeight: 600 }}>{shortAddr(pendingConfirm.propertyMatch)}</span>
            </div>
          )}
        </div>
        <div style={{ display: "flex", gap: 7 }}>
          <button onClick={() => saveCertificate(d, pendingConfirm.propertyMatch, pendingConfirm.file, pendingConfirm.base64, pendingConfirm.mediaType)}
            disabled={certSaving}
            style={{ flex: 1, background: "#0891b2", color: "white", fontWeight: 700, fontSize: 12, padding: "8px", borderRadius: 7, border: "none", cursor: "pointer", opacity: certSaving ? 0.6 : 1 }}>
            {certSaving ? "Saving…" : "Save to Compliance"}
          </button>
          <button onClick={() => setPendingConfirm(p => p ? { ...p, editing: true } : p)}
            style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)", fontSize: 12, padding: "8px 12px", borderRadius: 7, border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer" }}>
            Edit
          </button>
          <button onClick={() => setPendingConfirm(null)}
            style={{ background: "none", color: "rgba(255,255,255,0.3)", fontSize: 12, padding: "8px 10px", border: "none", cursor: "pointer" }}>
            ✕
          </button>
        </div>
      </div>
    );
  })() : null;

  return (
    <>
      <style>{`
        @keyframes fcPulse { 0%,100%{opacity:0.3;transform:scale(0.8)} 50%{opacity:1;transform:scale(1)} }
        @keyframes fcSlideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,application/pdf"
        onChange={onFileSelected}
        style={{ display: "none" }}
      />

      {/* Floating button */}
      {!open && (
        <button onClick={() => setOpen(true)}
          style={{ position: "fixed", bottom: 28, right: 28, zIndex: 999, width: 52, height: 52, borderRadius: "50%", background: "#0f1728", color: "#c9a84c", border: "2px solid rgba(201,168,76,0.4)", fontSize: 19, fontWeight: 900, cursor: "pointer", boxShadow: "0 4px 20px rgba(0,0,0,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit" }}
          title="Ask Rentura">
          R
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 999, width: 380, maxHeight: "70vh", display: "flex", flexDirection: "column", borderRadius: 16, overflow: "hidden", boxShadow: "0 8px 40px rgba(0,0,0,0.35)", animation: "fcSlideUp 0.2s ease" }}>

          {/* Header */}
          <div style={{ background: "#0f1728", padding: "13px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#c9a84c", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 900, color: "#111" }}>R</div>
              <div>
                <p style={{ color: "white", fontWeight: 800, fontSize: 13, lineHeight: 1.2 }}>Rentura AI</p>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>{ready ? "Portfolio loaded" : "Loading…"}</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {messages.length > 1 && (
                <button onClick={() => { setMessages([]); setApiHistory([]); setReady(false); setCtx(null); setPendingConfirm(null); setPendingFile(null); }}
                  style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>Clear</button>
              )}
              <button onClick={() => setOpen(false)}
                style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", fontSize: 18, cursor: "pointer", lineHeight: 1, fontFamily: "inherit" }}>×</button>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", background: "#0c0f1a", padding: "16px 16px 8px" }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{ marginBottom: 14 }}>
                {msg.role === "user" ? (
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: "12px 12px 2px 12px", padding: "9px 13px", maxWidth: "80%" }}>
                      {msg.attachment && (
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: msg.text ? 6 : 0, background: "rgba(255,255,255,0.08)", borderRadius: 6, padding: "4px 8px" }}>
                          <span style={{ fontSize: 14 }}>{msg.attachment.filename.endsWith(".pdf") ? "📄" : "🖼"}</span>
                          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{msg.attachment.filename}</span>
                        </div>
                      )}
                      {msg.text && <p style={{ color: "white", fontSize: 13, lineHeight: 1.5 }}>{msg.text}</p>}
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "flex", gap: 8, alignItems: "flex-start", maxWidth: "90%" }}>
                    <div style={{ width: 24, height: 24, background: "#1e293b", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.6)" }}>R</div>
                    <div style={{ flex: 1 }}>
                      <p style={{ color: "rgba(255,255,255,0.88)", fontSize: 13, lineHeight: 1.65, whiteSpace: "pre-line" }}>{msg.text}</p>
                      {msg.actions && msg.actions.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 8 }}>
                          {msg.actions.map((a, i) => (
                            a.type === "log_when_done"
                              ? <button key={i} onClick={() => send(a.label)} style={{ fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 20, background: `${a.color}20`, color: a.color, border: `1px solid ${a.color}60`, cursor: "pointer", fontFamily: "inherit" }}>
                                  {a.label} →
                                </button>
                              : <span key={i} style={{ fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 20, background: `${a.color}20`, color: a.color, border: `1px solid ${a.color}40` }}>
                                  {a.label}{a.value ? ` · ${a.value}` : ""}
                                </span>
                          ))}
                        </div>
                      )}
                      {msg.saved && <p style={{ fontSize: 11, color: "#16a34a", fontWeight: 700, marginTop: 6 }}>✓ Saved to Compliance</p>}
                      {msg.followUp && (
                        <button onClick={() => msg.followUp === "Upload another certificate?" ? fileInputRef.current?.click() : send(msg.followUp!)}
                          style={{ marginTop: 8, background: "none", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 20, padding: "4px 11px", color: "rgba(255,255,255,0.5)", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>
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
                <div style={{ display: "flex", gap: 4 }}>
                  {[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(255,255,255,0.3)", animation: `fcPulse 1.2s ${i*0.2}s infinite` }} />)}
                </div>
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

          {/* Certificate confirmation panel — shown above input */}
          {CertConfirmPanel}

          {/* Quick prompts */}
          {messages.length <= 1 && ready && !pendingFile && (
            <div style={{ background: "#0c0f1a", padding: "0 12px 10px", display: "flex", flexWrap: "wrap", gap: 5 }}>
              {["Log a maintenance issue", "What should I focus on today?", "Log rent received", "How am I doing this tax year?"].map(p => (
                <button key={p} onClick={() => send(p)}
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 20, padding: "5px 11px", fontSize: 11, color: "rgba(255,255,255,0.55)", cursor: "pointer", fontFamily: "inherit" }}>
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* File attachment preview */}
          {pendingFile && (
            <div style={{ background: "#0c0f1a", padding: "6px 12px 0", display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7, background: "rgba(8,145,178,0.12)", border: "1px solid rgba(8,145,178,0.3)", borderRadius: 8, padding: "5px 10px", flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: 15, flexShrink: 0 }}>{pendingFile.file.type === "application/pdf" ? "📄" : "🖼"}</span>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{pendingFile.file.name}</span>
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", flexShrink: 0 }}>{(pendingFile.file.size / 1024).toFixed(0)}KB</span>
              </div>
              <button onClick={() => setPendingFile(null)}
                style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", fontSize: 16, cursor: "pointer", padding: "2px 4px", flexShrink: 0 }}>✕</button>
            </div>
          )}

          {/* Input */}
          <div style={{ background: "#111827", padding: "10px 12px", display: "flex", gap: 6, flexShrink: 0, alignItems: "center" }}>
            {/* Paperclip button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={chatLoading || !ready}
              title="Attach certificate (JPG, PNG, PDF)"
              style={{ background: "none", border: "none", color: pendingFile ? "#0891b2" : "rgba(255,255,255,0.3)", fontSize: 17, cursor: "pointer", padding: "4px 5px", flexShrink: 0, lineHeight: 1, opacity: (!ready || chatLoading) ? 0.3 : 1 }}>
              📎
            </button>

            <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (pendingFile) sendWithFile(pendingFile);
                  else send(input);
                }
              }}
              placeholder={pendingFile ? "Add a note or just press Send…" : ready ? "Tell me what happened…" : "Loading portfolio…"}
              disabled={chatLoading || !ready}
              style={{ flex: 1, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 9, padding: "9px 13px", color: "white", fontSize: 13, outline: "none", fontFamily: "inherit" }}
            />
            <button
              onClick={() => { if (pendingFile) sendWithFile(pendingFile); else send(input); }}
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
