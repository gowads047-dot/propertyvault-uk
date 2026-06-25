"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";

type Message = { role: "user" | "ai"; text: string; actions?: { type: string; label: string; value: string; color: string }[]; followUp?: string | null; awaitingConfirm?: boolean; saved?: boolean };
type APIHistory = { role: "user" | "assistant"; content: string }[];
type PortfolioCtx = Record<string, unknown>;

function shortAddr(a: string) { return a.split(",")[0]; }

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
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

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

  const send = useCallback(async (text: string) => {
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
  }, [chatLoading, user, ctx, apiHistory, props]);

  if (hide) return null;

  return (
    <>
      <style>{`
        @keyframes fcPulse { 0%,100%{opacity:0.3;transform:scale(0.8)} 50%{opacity:1;transform:scale(1)} }
        @keyframes fcSlideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

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
                <button onClick={() => { setMessages([]); setApiHistory([]); setReady(false); setCtx(null); }}
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
                      <p style={{ color: "white", fontSize: 13, lineHeight: 1.5 }}>{msg.text}</p>
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
                            <span key={i} style={{ fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 20, background: `${a.color}20`, color: a.color, border: `1px solid ${a.color}40` }}>
                              {a.label}{a.value ? ` · ${a.value}` : ""}
                            </span>
                          ))}
                        </div>
                      )}
                      {msg.saved && <p style={{ fontSize: 11, color: "#16a34a", fontWeight: 700, marginTop: 6 }}>✓ Saved to Property Passport</p>}
                      {msg.followUp && (
                        <button onClick={() => send(msg.followUp!)}
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

          {/* Quick prompts */}
          {messages.length <= 1 && ready && (
            <div style={{ background: "#0c0f1a", padding: "0 12px 10px", display: "flex", flexWrap: "wrap", gap: 5 }}>
              {["Log a maintenance issue", "What should I focus on today?", "Log rent received", "How am I doing this tax year?"].map(p => (
                <button key={p} onClick={() => send(p)}
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 20, padding: "5px 11px", fontSize: 11, color: "rgba(255,255,255,0.55)", cursor: "pointer", fontFamily: "inherit" }}>
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ background: "#111827", padding: "10px 12px", display: "flex", gap: 8, flexShrink: 0 }}>
            <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
              placeholder={ready ? "Tell me what happened…" : "Loading portfolio…"}
              disabled={chatLoading || !ready}
              style={{ flex: 1, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 9, padding: "9px 13px", color: "white", fontSize: 13, outline: "none", fontFamily: "inherit" }}
            />
            <button onClick={() => send(input)} disabled={chatLoading || !input.trim() || !ready}
              style={{ background: "#0f1728", color: "white", border: "none", borderRadius: 9, padding: "9px 15px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", opacity: (!input.trim() || chatLoading || !ready) ? 0.4 : 1 }}>
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
