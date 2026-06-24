"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";

const BG = "#eceae2";
const INK = "#111111";
const INK2 = "rgba(17,17,17,0.52)";
const BORDER = "rgba(17,17,17,0.09)";
const CTA = "#0f1728";

type Update = { id: string; author_type: string; author_name: string; message: string; status_change: string | null; attachments: { url: string; name: string; type: string }[]; created_at: string };
type Issue = { id: string; title: string; category: string; priority: string; status: string; description: string; created_at: string; tenant_name: string; tenant_email: string; property_id: string };

const STATUS_CFG: Record<string, { label: string; color: string; bg: string }> = {
  open: { label: "Open", color: "#dc2626", bg: "rgba(220,38,38,0.08)" },
  in_progress: { label: "In progress", color: "#ca8a04", bg: "rgba(234,179,8,0.08)" },
  scheduled: { label: "Scheduled", color: "#2563eb", bg: "rgba(59,130,246,0.08)" },
  resolved: { label: "Resolved ✓", color: "#16a34a", bg: "rgba(34,197,94,0.08)" },
};

export default function LandlordIssuePage() {
  const { id, issueId } = useParams<{ id: string; issueId: string }>();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [issue, setIssue] = useState<Issue | null>(null);
  const [updates, setUpdates] = useState<Update[]>([]);
  const [message, setMessage] = useState("");
  const [statusChange, setStatusChange] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push("/rentura/auth"); return; }
    fetch(`/api/tenant/issues/${issueId}?landlordId=${user.id}`)
      .then(r => r.json())
      .then(d => { if (d.issue) { setIssue(d.issue); setUpdates(d.updates || []); } setLoading(false); });
  }, [issueId, user, authLoading, router]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [updates]);

  async function sendReply() {
    if (!message.trim() || !user) return;
    setSending(true);
    const { data: sub } = await supabase.from("rentura_subscriptions").select("name").eq("user_id", user.id).maybeSingle();
    const res = await fetch(`/api/tenant/issues/${issueId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ landlordId: user.id, message, statusChange: statusChange || undefined, authorName: sub?.name || "Your landlord" }),
    });
    const { update } = await res.json();
    if (update) {
      setUpdates(prev => [...prev, update]);
      setMessage("");
      if (statusChange && issue) setIssue({ ...issue, status: statusChange });
      setStatusChange("");
    }
    setSending(false);
  }

  if (loading || authLoading) return <div style={{ minHeight: "100vh", background: BG, display: "flex", alignItems: "center", justifyContent: "center" }}><p style={{ color: INK2 }}>Loading…</p></div>;
  if (!issue) return <div style={{ minHeight: "100vh", background: BG, display: "flex", alignItems: "center", justifyContent: "center" }}><p>Issue not found</p></div>;

  const statusCfg = STATUS_CFG[issue.status] ?? STATUS_CFG.open;

  return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: "var(--font-family-body)", color: INK }}>
      <style>{`body > header, body > footer { display: none !important; }`}</style>

      <nav style={{ borderBottom: `1px solid ${BORDER}`, padding: "12px 24px", display: "flex", alignItems: "center", gap: 14, background: BG, position: "sticky", top: 0, zIndex: 20 }}>
        <Link href={`/rentura/properties/${id}?tab=maintenance`} style={{ fontSize: 13, color: INK2, textDecoration: "none" }}>← Back to property</Link>
        <span style={{ color: INK2 }}>›</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: INK, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{issue.title}</span>
      </nav>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 24px 100px" }}>

        {/* Issue header */}
        <div style={{ background: "white", border: `1px solid ${BORDER}`, borderRadius: 16, padding: "22px 24px", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 10 }}>
            <h1 style={{ fontSize: 20, fontWeight: 900, letterSpacing: "-0.01em", lineHeight: 1.25 }}>{issue.title}</h1>
            <span style={{ flexShrink: 0, fontSize: 12, fontWeight: 700, background: statusCfg.bg, color: statusCfg.color, padding: "5px 11px", borderRadius: 8 }}>{statusCfg.label}</span>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 10 }}>
            <span style={{ fontSize: 12, color: INK2 }}>👤 {issue.tenant_name || issue.tenant_email}</span>
            <span style={{ fontSize: 12, color: INK2 }}>· {issue.category}</span>
            <span style={{ fontSize: 12, color: issue.priority === "urgent" ? "#dc2626" : INK2 }}>· {issue.priority} priority</span>
            <span style={{ fontSize: 12, color: INK2 }}>· {new Date(issue.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
          </div>
        </div>

        {/* Thread */}
        <div style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: INK2, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>Thread</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {updates.map(u => (
              <div key={u.id} style={{ display: "flex", gap: 12, alignItems: "flex-start", flexDirection: u.author_type === "landlord" ? "row-reverse" : "row" }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: u.author_type === "tenant" ? "rgba(26,41,66,0.1)" : CTA, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 12, fontWeight: 800, color: u.author_type === "tenant" ? INK2 : "white" }}>
                  {u.author_type === "tenant" ? "T" : "L"}
                </div>
                <div style={{ maxWidth: "75%" }}>
                  {u.status_change && (
                    <div style={{ fontSize: 11, fontWeight: 700, color: STATUS_CFG[u.status_change]?.color ?? INK2, marginBottom: 6 }}>
                      Status → {u.status_change.replace(/_/g, " ")}
                    </div>
                  )}
                  <div style={{ background: u.author_type === "tenant" ? "white" : CTA, border: u.author_type === "tenant" ? `1px solid ${BORDER}` : "none", borderRadius: u.author_type === "landlord" ? "14px 2px 14px 14px" : "2px 14px 14px 14px", padding: "11px 14px" }}>
                    <p style={{ fontSize: 14, color: u.author_type === "tenant" ? INK : "white", lineHeight: 1.6 }}>{u.message}</p>
                    {u.attachments?.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                        {u.attachments.map((a, i) => (
                          <a key={i} href={a.url} target="_blank" rel="noopener noreferrer"
                            style={{ display: "flex", alignItems: "center", gap: 5, background: u.author_type === "landlord" ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.04)", borderRadius: 7, padding: "4px 9px", textDecoration: "none" }}>
                            <span style={{ fontSize: 12 }}>{a.type?.startsWith("image") ? "🖼️" : a.type?.startsWith("video") ? "🎥" : "📄"}</span>
                            <span style={{ fontSize: 11, color: u.author_type === "landlord" ? "rgba(255,255,255,0.8)" : INK2 }}>{a.name}</span>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                  <p style={{ fontSize: 11, color: INK2, marginTop: 4, textAlign: u.author_type === "landlord" ? "right" : "left" }}>
                    {u.author_name} · {new Date(u.created_at).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}
            {updates.length === 0 && <p style={{ fontSize: 14, color: INK2, textAlign: "center", padding: "24px 0" }}>No messages yet. Reply to the tenant below.</p>}
            <div ref={bottomRef} />
          </div>
        </div>

        {/* Reply + status update */}
        {issue.status !== "resolved" && (
          <div style={{ background: "white", border: `1px solid ${BORDER}`, borderRadius: 16, padding: "18px 20px", position: "sticky", bottom: 16 }}>
            <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Reply to tenant…" rows={3}
              style={{ width: "100%", background: "rgba(17,17,17,0.02)", border: `1px solid ${BORDER}`, borderRadius: 10, padding: "11px 14px", fontSize: 14, color: INK, resize: "none", outline: "none", boxSizing: "border-box", fontFamily: "inherit", lineHeight: 1.6 }} />
            <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
              <select value={statusChange} onChange={e => setStatusChange(e.target.value)}
                style={{ flex: 1, minWidth: 140, padding: "9px 12px", fontSize: 13, border: `1px solid ${BORDER}`, borderRadius: 9, fontFamily: "inherit", color: INK, background: BG }}>
                <option value="">No status change</option>
                <option value="in_progress">Mark: In progress</option>
                <option value="scheduled">Mark: Scheduled</option>
                <option value="resolved">Mark: Resolved</option>
              </select>
              <button onClick={sendReply} disabled={sending || !message.trim()}
                style={{ flex: 2, minWidth: 120, background: sending ? "rgba(15,23,40,0.4)" : CTA, color: "white", fontWeight: 700, fontSize: 14, border: "none", borderRadius: 9, cursor: "pointer", fontFamily: "inherit", padding: "9px 0" }}>
                {sending ? "Sending…" : "Send reply →"}
              </button>
            </div>
          </div>
        )}

        {issue.status === "resolved" && (
          <div style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 12, padding: "14px 18px", textAlign: "center" }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: "#16a34a" }}>✓ This issue has been resolved</p>
          </div>
        )}
      </div>
    </div>
  );
}
