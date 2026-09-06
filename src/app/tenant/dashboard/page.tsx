"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Message = {
  role: "user" | "ai";
  text: string;
  issueCreated?: { id: string; title: string; priority: string };
  followUp?: string | null;
};
type ApiHistory = { role: "user" | "assistant"; content: string }[];
type TenantInfo = { name: string; email: string; propertyAddress: string; landlordName: string; phone: string | null };
type Issue = { id: string; title: string; status: string; priority: string; category: string; created_at: string; landlord_first_response_at?: string | null };

const STATUS_COLOR: Record<string, string> = {
  open: "#dc2626",
  in_progress: "#ca8a04",
  scheduled: "#2563eb",
  resolved: "#15803d",
};

function TenantPortalInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") || "";

  const [info, setInfo] = useState<TenantInfo | null>(null);
  // With no token there is nothing to fetch, so both are settled from the start
  // rather than corrected by an effect on the first render.
  const [loading, setLoading] = useState(!!token);
  const [error, setError] = useState(token ? "" : "No access link found. Please use the link from your invitation email.");
  const [messages, setMessages] = useState<Message[]>([]);
  const [apiHistory, setApiHistory] = useState<ApiHistory>([]);
  const [input, setInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [panelOpen, setPanelOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!token) return;

    fetch(`/api/tenant/validate/?token=${token}`)
      .then(r => r.json())
      .then(async (data) => {
        if (!data.valid) {
          setError("This link is invalid or has expired. Please contact your landlord for a new one.");
          setLoading(false);
          return;
        }

        const tenantInfo: TenantInfo = {
          name: data.tenant_name || data.email?.split("@")[0] || "there",
          email: data.email,
          propertyAddress: data.property_address || "your property",
          landlordName: data.landlord_name || "your landlord",
          phone: data.phone || null,
        };
        setInfo(tenantInfo);

        const issuesRes = await fetch(`/api/tenant/issues/?token=${token}`);
        const issuesData = await issuesRes.json();
        const tenantIssues: Issue[] = issuesData.issues || [];
        setIssues(tenantIssues);

        const firstName = tenantInfo.name?.split(" ")[0] || "there";
        const shortAddr = tenantInfo.propertyAddress?.split(",")[0];
        const openIssues = tenantIssues.filter(i => i.status !== "resolved");

        let greeting = `Hi ${firstName} 👋\n\nWelcome to your home portal at ${shortAddr}.`;
        if (openIssues.length > 0) {
          greeting += `\n\nYou have ${openIssues.length} open issue${openIssues.length > 1 ? "s" : ""}. I can give you an update on any of them, or help you report something new.`;
        } else {
          greeting += `\n\nI'm here to help you communicate with ${tenantInfo.landlordName} and report any maintenance issues. What can I help you with today?`;
        }

        setMessages([{ role: "ai", text: greeting }]);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load your portal. Please try again.");
        setLoading(false);
      });
  }, [token]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chatLoading]);

  async function send(text: string) {
    if (!text.trim() || chatLoading || !info) return;
    const userText = text.trim();
    setMessages(m => [...m, { role: "user", text: userText }]);
    setInput("");
    setChatLoading(true);

    try {
      const res = await fetch("/api/tenant/chat/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, history: apiHistory, userInput: userText }),
      });
      const result = await res.json();

      setApiHistory(prev => [
        ...prev,
        { role: "user", content: userText },
        { role: "assistant", content: result.reply || "" },
      ]);

      const aiMsg: Message = {
        role: "ai",
        text: result.reply || "Sorry, something went wrong. Please try again.",
        followUp: result.followUp || null,
      };

      if (result.action === "create_issue" && result.issueId && result.issueData) {
        aiMsg.issueCreated = {
          id: result.issueId,
          title: result.issueData.title,
          priority: result.issueData.priority || "normal",
        };
        setIssues(prev => [{
          id: result.issueId,
          title: result.issueData.title,
          status: "open",
          priority: result.issueData.priority || "normal",
          category: result.issueData.category || "general",
          created_at: new Date().toISOString(),
          landlord_first_response_at: null,
        }, ...prev]);
      }

      setMessages(m => [...m, aiMsg]);
    } catch {
      setMessages(m => [...m, { role: "ai", text: "Connection issue — please try again." }]);
    }
    setChatLoading(false);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push(`/tenant?token=${token}`);
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#0c0f1a", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <style>{`body > header, body > footer { display: none !important; }`}</style>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#c9a84c", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 900, color: "#111", margin: "0 auto 16px" }}>R</div>
          <p style={{ color: "rgba(255,255,255,0.58)", fontSize: 13, fontFamily: "sans-serif" }}>Loading your portal…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: "100vh", background: "#0c0f1a", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "sans-serif" }}>
        <style>{`body > header, body > footer { display: none !important; }`}</style>
        <div style={{ textAlign: "center", maxWidth: 380 }}>
          <p style={{ fontSize: 40, marginBottom: 16 }}>🔒</p>
          <p style={{ color: "white", fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Access issue</p>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, lineHeight: 1.7 }}>{error}</p>
        </div>
      </div>
    );
  }

  const firstName = info?.name?.split(" ")[0] || "there";
  const shortAddr = info?.propertyAddress?.split(",")[0];
  const openCount = issues.filter(i => i.status !== "resolved").length;

  const quickPrompts = [
    "I need to report a maintenance issue",
    openCount > 0 ? "What's the status of my open issues?" : "What kind of issues can I report?",
    "I have a question about my tenancy",
  ];

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "#0c0f1a", fontFamily: "var(--font-family-body, system-ui, sans-serif)", color: "white" }}>
      <style>{`
        body > header, body > footer { display: none !important; }
        * { box-sizing: border-box; }
        @keyframes pulse { 0%,100%{opacity:0.3;transform:scale(0.8)} 50%{opacity:1;transform:scale(1)} }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
      `}</style>

      {/* NAV */}
      <div style={{ background: "#111827", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 20px", height: 52, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ color: "var(--gold-ink)", fontWeight: 900, fontSize: 13 }}>PropertyVault</span>
          <span style={{ color: "rgba(255,255,255,0.12)", fontSize: 16 }}>·</span>
          <span style={{ color: "rgba(255,255,255,0.58)", fontSize: 12, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{shortAddr}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {openCount > 0 && (
            <button onClick={() => setPanelOpen(v => !v)}
              style={{ background: panelOpen ? "rgba(201,168,76,0.12)" : "rgba(255,255,255,0.05)", border: `1px solid ${panelOpen ? "rgba(201,168,76,0.3)" : "rgba(255,255,255,0.1)"}`, borderRadius: 20, padding: "4px 12px", color: panelOpen ? "#c9a84c" : "rgba(255,255,255,0.55)", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
              {openCount} open issue{openCount > 1 ? "s" : ""}
            </button>
          )}
          <span style={{ color: "rgba(255,255,255,0.62)", fontSize: 12 }}>{firstName}</span>
          <button onClick={handleSignOut}
            style={{ background: "none", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8, padding: "4px 10px", color: "rgba(255,255,255,0.62)", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>
            Sign out
          </button>
        </div>
      </div>

      {/* ISSUES PANEL */}
      {panelOpen && issues.length > 0 && (
        <div style={{ background: "#111827", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "14px 20px", flexShrink: 0, maxHeight: 240, overflowY: "auto" }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Your issues</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {issues.map(issue => (
              <button key={issue.id}
                onClick={() => { send(`Give me an update on my "${issue.title}" issue`); setPanelOpen(false); }}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 13px", borderRadius: 9, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", textAlign: "left", cursor: "pointer", fontFamily: "inherit", width: "100%" }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: STATUS_COLOR[issue.status] ?? "#ca8a04", flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: 13, color: "rgba(255,255,255,0.78)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{issue.title}</span>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.28)", flexShrink: 0 }}>{issue.category}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: STATUS_COLOR[issue.status] ?? "#ca8a04", flexShrink: 0 }}>{issue.status.replace("_", " ")}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* MESSAGES */}
      <div style={{ flex: 1, overflowY: "auto", padding: "24px 20px 16px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          {messages.map((msg, idx) => (
            <div key={idx} style={{ marginBottom: 20 }}>
              {msg.role === "user" ? (
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <div style={{ background: "#1e3a5f", borderRadius: "16px 16px 3px 16px", padding: "11px 16px", maxWidth: "78%" }}>
                    <p style={{ color: "white", fontSize: 14, lineHeight: 1.6, margin: 0 }}>{msg.text}</p>
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start", maxWidth: "88%" }}>
                  <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#c9a84c", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 14, fontWeight: 900, color: "#111", marginTop: 1 }}>R</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: "rgba(255,255,255,0.88)", fontSize: 14, lineHeight: 1.75, margin: 0, whiteSpace: "pre-wrap" }}>{msg.text}</p>

                    {msg.issueCreated && (
                      <div style={{ marginTop: 12, background: "rgba(34,197,94,0.07)", border: "1px solid rgba(34,197,94,0.18)", borderRadius: 12, padding: "13px 16px" }}>
                        <p style={{ color: "#4ade80", fontSize: 13, fontWeight: 800, marginBottom: 4 }}>✓ Issue logged — {msg.issueCreated.title}</p>
                        <p style={{ color: "rgba(74,222,128,0.55)", fontSize: 12, lineHeight: 1.55, margin: 0 }}>
                          {msg.issueCreated.priority === "urgent" ? "🚨 Marked urgent. " : ""}
                          Your landlord has been notified by email. You&apos;ll hear back when there&apos;s an update.
                        </p>
                      </div>
                    )}

                    {msg.followUp && idx === messages.length - 1 && !chatLoading && (
                      <button onClick={() => send(msg.followUp!)}
                        style={{ marginTop: 10, background: "none", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 20, padding: "5px 13px", color: "rgba(255,255,255,0.62)", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
                        {msg.followUp} →
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {chatLoading && (
            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 20 }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#c9a84c", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 900, color: "#111", flexShrink: 0 }}>R</div>
              <div style={{ display: "flex", gap: 5, padding: "8px 0" }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "rgba(255,255,255,0.28)", animation: `pulse 1.2s ${i * 0.2}s infinite` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* QUICK PROMPTS */}
      {messages.length === 1 && !chatLoading && (
        <div style={{ padding: "0 20px 12px", display: "flex", flexWrap: "wrap", gap: 7, flexShrink: 0, justifyContent: "center" }}>
          {quickPrompts.map(p => (
            <button key={p} onClick={() => send(p)}
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 20, padding: "8px 16px", fontSize: 12, color: "rgba(255,255,255,0.58)", cursor: "pointer", fontFamily: "inherit" }}>
              {p}
            </button>
          ))}
        </div>
      )}

      {/* INPUT */}
      <div style={{ background: "#111827", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "12px 16px", display: "flex", gap: 10, flexShrink: 0 }}>
        <input aria-label="Type a message"
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
          placeholder="Type a message…"
          disabled={chatLoading}
          autoComplete="off"
          style={{ flex: 1, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "12px 16px", color: "white", fontSize: 14, outline: "none", fontFamily: "inherit" }}
        />
        <button onClick={() => send(input)} disabled={chatLoading || !input.trim()}
          style={{ background: "#c9a84c", color: "#111", border: "none", borderRadius: 12, padding: "12px 22px", fontSize: 14, fontWeight: 800, cursor: chatLoading || !input.trim() ? "not-allowed" : "pointer", fontFamily: "inherit", opacity: chatLoading || !input.trim() ? 0.4 : 1 }}>
          Send
        </button>
      </div>
    </div>
  );
}

export default function TenantDashboard() {
  return <Suspense fallback={null}><TenantPortalInner /></Suspense>;
}
