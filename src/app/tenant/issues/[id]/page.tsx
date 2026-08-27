"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const S = { bg: "#f8f7f5", card: "white", ink: "#1a2942", ink2: "rgba(26,41,66,0.55)", border: "rgba(26,41,66,0.1)", accent: "#1a2942" };

type Update = { id: string; author_type: string; author_name: string; message: string; status_change: string | null; attachments: { url: string; name: string; type: string }[]; created_at: string };
type Issue = { id: string; title: string; category: string; priority: string; status: string; description: string; created_at: string; tenant_name: string };

const STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  open: { label: "Open", color: "#b91c1c", bg: "rgba(220,38,38,0.08)" },
  in_progress: { label: "In progress", color: "#ca8a04", bg: "rgba(234,179,8,0.08)" },
  scheduled: { label: "Scheduled", color: "#2563eb", bg: "rgba(59,130,246,0.08)" },
  resolved: { label: "Resolved ✓", color: "#15803d", bg: "rgba(34,197,94,0.08)" },
};

function IssueThreadInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const token = searchParams.get("token") || "";
  const isNew = searchParams.get("new") === "1";

  const [issue, setIssue] = useState<Issue | null>(null);
  const [updates, setUpdates] = useState<Update[]>([]);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [attachments, setAttachments] = useState<{ url: string; name: string; type: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!token) { router.push("/tenant"); return; }
    fetch(`/api/tenant/issues/${id}?token=${token}`)
      .then(r => r.json())
      .then(d => { if (d.issue) { setIssue(d.issue); setUpdates(d.updates || []); } setLoading(false); });
  }, [id, token, router]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [updates]);

  async function handleFiles(files: FileList) {
    setUploading(true);
    const newAttachments: { url: string; name: string; type: string }[] = [];
    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop();
      const path = `tenant-issues/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("tenant-attachments").upload(path, file);
      if (!error) {
        const { data } = supabase.storage.from("tenant-attachments").getPublicUrl(path);
        newAttachments.push({ url: data.publicUrl, name: file.name, type: file.type });
      }
    }
    setAttachments(prev => [...prev, ...newAttachments]);
    setUploading(false);
  }

  async function sendMessage() {
    if (!message.trim() && attachments.length === 0) return;
    setSending(true);
    const res = await fetch(`/api/tenant/issues/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, message: message.trim() || "(attachment)", attachments }),
    });
    const { update } = await res.json();
    if (update) { setUpdates(prev => [...prev, update]); setMessage(""); setAttachments([]); }
    setSending(false);
  }

  if (loading) return <div style={{ minHeight: "100vh", background: S.bg, display: "flex", alignItems: "center", justifyContent: "center" }}><p style={{ color: S.ink2 }}>Loading…</p></div>;
  if (!issue) return <div style={{ minHeight: "100vh", background: S.bg, display: "flex", alignItems: "center", justifyContent: "center" }}><p style={{ color: S.ink2 }}>Issue not found.</p></div>;

  const statusCfg = STATUS_LABELS[issue.status] ?? STATUS_LABELS.open;

  return (
    <div style={{ minHeight: "100vh", background: S.bg, fontFamily: "var(--font-family-body)", color: S.ink }}>
      <style>{`body > header, body > footer { display: none !important; }`}</style>

      <nav style={{ background: S.accent, padding: "0 24px", display: "flex", alignItems: "center", height: 56, gap: 14 }}>
        <Link href={`/tenant/dashboard?token=${token}`} style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, textDecoration: "none" }}>← Dashboard</Link>
        <span style={{ color: "rgba(255,255,255,0.62)" }}>›</span>
        <span style={{ color: "white", fontWeight: 700, fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{issue.title}</span>
      </nav>

      <div style={{ maxWidth: 700, margin: "0 auto", padding: "32px 24px 100px" }}>

        {isNew && (
          <div style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 12, padding: "14px 18px", marginBottom: 24, display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 20 }}>✅</span>
            <div>
              <p style={{ fontWeight: 700, fontSize: 14, color: "#15803d" }}>Issue submitted successfully</p>
              <p style={{ fontSize: 12, color: "rgba(26,41,66,0.5)" }}>Your landlord has been notified by email. You&apos;ll hear back soon.</p>
            </div>
          </div>
        )}

        {/* Issue header */}
        <div style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: 16, padding: "22px 24px", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 10 }}>
            <h1 style={{ fontSize: 20, fontWeight: 900, letterSpacing: "-0.01em", lineHeight: 1.25 }}>{issue.title}</h1>
            <span style={{ flexShrink: 0, fontSize: 12, fontWeight: 700, background: statusCfg.bg, color: statusCfg.color, padding: "5px 11px", borderRadius: 8, whiteSpace: "nowrap" }}>{statusCfg.label}</span>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <span style={{ fontSize: 12, color: S.ink2 }}>Category: {issue.category}</span>
            <span style={{ fontSize: 12, color: S.ink2 }}>·</span>
            <span style={{ fontSize: 12, color: issue.priority === "urgent" ? "#dc2626" : S.ink2 }}>Priority: {issue.priority}</span>
            <span style={{ fontSize: 12, color: S.ink2 }}>·</span>
            <span style={{ fontSize: 12, color: S.ink2 }}>Reported {new Date(issue.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span>
          </div>
        </div>

        {/* Progress tracker */}
        <div style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: 14, padding: "16px 20px", marginBottom: 24 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: S.ink2, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>Progress</p>
          <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
            {(["open", "in_progress", "scheduled", "resolved"] as const).map((s, i, arr) => {
              const steps = ["open", "in_progress", "scheduled", "resolved"];
              const currentIdx = steps.indexOf(issue.status);
              const done = i <= currentIdx;
              const labels = ["Reported", "In progress", "Scheduled", "Resolved"];
              return (
                <div key={s} style={{ display: "flex", alignItems: "center", flex: i < arr.length - 1 ? 1 : undefined }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    <div style={{ width: 24, height: 24, borderRadius: "50%", background: done ? S.accent : "rgba(26,41,66,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: 11, color: done ? "white" : S.ink2, fontWeight: 800 }}>{done ? "✓" : i + 1}</span>
                    </div>
                    <span style={{ fontSize: 10, color: done ? S.ink : S.ink2, fontWeight: done ? 700 : 400, whiteSpace: "nowrap" }}>{labels[i]}</span>
                  </div>
                  {i < arr.length - 1 && <div style={{ flex: 1, height: 2, background: done && i < currentIdx ? S.accent : "rgba(26,41,66,0.1)", margin: "0 4px", marginBottom: 18 }} />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Thread */}
        <div style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: S.ink2, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>Messages & updates</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {updates.map(u => (
              <div key={u.id} style={{ display: "flex", gap: 12, alignItems: "flex-start", flexDirection: u.author_type === "tenant" ? "row-reverse" : "row" }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: u.author_type === "landlord" ? S.accent : "rgba(201,168,76,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 12, fontWeight: 800, color: u.author_type === "landlord" ? "white" : "#c9a84c" }}>
                  {u.author_type === "landlord" ? "L" : "T"}
                </div>
                <div style={{ maxWidth: "75%" }}>
                  {u.status_change && (
                    <div style={{ fontSize: 11, fontWeight: 700, color: STATUS_LABELS[u.status_change]?.color ?? S.ink2, background: STATUS_LABELS[u.status_change]?.bg ?? "transparent", padding: "3px 8px", borderRadius: 6, marginBottom: 6, display: "inline-block" }}>
                      Status changed to: {u.status_change.replace(/_/g, " ")}
                    </div>
                  )}
                  <div style={{ background: u.author_type === "landlord" ? S.card : S.accent, border: u.author_type === "landlord" ? `1px solid ${S.border}` : "none", borderRadius: u.author_type === "tenant" ? "14px 2px 14px 14px" : "2px 14px 14px 14px", padding: "11px 14px" }}>
                    <p style={{ fontSize: 14, color: u.author_type === "landlord" ? S.ink : "white", lineHeight: 1.6 }}>{u.message}</p>
                    {u.attachments?.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                        {u.attachments.map((a, i) => (
                          <a key={i} href={a.url} target="_blank" rel="noopener noreferrer"
                            style={{ display: "flex", alignItems: "center", gap: 5, background: u.author_type === "tenant" ? "rgba(255,255,255,0.15)" : "rgba(26,41,66,0.06)", borderRadius: 7, padding: "4px 9px", textDecoration: "none" }}>
                            <span style={{ fontSize: 12 }}>{a.type?.startsWith("image") ? "🖼️" : a.type?.startsWith("video") ? "🎥" : "📄"}</span>
                            <span style={{ fontSize: 11, color: u.author_type === "tenant" ? "rgba(255,255,255,0.85)" : S.ink2, maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.name}</span>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                  <p style={{ fontSize: 11, color: S.ink2, marginTop: 4, textAlign: u.author_type === "tenant" ? "right" : "left" }}>
                    {u.author_name} · {new Date(u.created_at).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}
            {updates.length === 0 && <p style={{ fontSize: 14, color: S.ink2, textAlign: "center", padding: "20px 0" }}>No messages yet. Add more detail or wait for your landlord to respond.</p>}
            <div ref={bottomRef} />
          </div>
        </div>

        {/* Compose */}
        {issue.status !== "resolved" && (
          <div style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: 16, padding: "18px 20px", position: "sticky", bottom: 16 }}>
            <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Add an update or more details…" rows={3}
              style={{ width: "100%", background: "rgba(26,41,66,0.03)", border: `1px solid ${S.border}`, borderRadius: 10, padding: "11px 14px", fontSize: 14, color: S.ink, resize: "none", outline: "none", boxSizing: "border-box", fontFamily: "inherit", lineHeight: 1.6 }} />
            {attachments.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8, marginBottom: 8 }}>
                {attachments.map((a, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(26,41,66,0.05)", borderRadius: 7, padding: "4px 9px" }}>
                    <span style={{ fontSize: 12 }}>{a.type?.startsWith("image") ? "🖼️" : "🎥"}</span>
                    <span style={{ fontSize: 11, color: S.ink2 }}>{a.name}</span>
                    <button type="button" onClick={() => setAttachments(p => p.filter((_, j) => j !== i))} style={{ background: "none", border: "none", color: S.ink2, cursor: "pointer", fontFamily: "inherit", fontSize: 14, lineHeight: 1 }}>×</button>
                  </div>
                ))}
              </div>
            )}
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
                style={{ background: "rgba(26,41,66,0.05)", border: `1px solid ${S.border}`, borderRadius: 9, padding: "9px 14px", fontSize: 13, color: S.ink2, cursor: "pointer", fontFamily: "inherit" }}>
                {uploading ? "…" : "📎 Attach"}
              </button>
              <button onClick={sendMessage} disabled={sending || (!message.trim() && attachments.length === 0)}
                style={{ flex: 1, background: (sending || (!message.trim() && attachments.length === 0)) ? "rgba(26,41,66,0.3)" : S.accent, color: "white", fontWeight: 700, fontSize: 14, border: "none", borderRadius: 9, cursor: "pointer", fontFamily: "inherit" }}>
                {sending ? "Sending…" : "Send →"}
              </button>
            </div>
            <input ref={fileRef} type="file" multiple accept="image/*,video/*" style={{ display: "none" }} onChange={e => e.target.files && handleFiles(e.target.files)} />
          </div>
        )}

        {issue.status === "resolved" && (
          <div style={{ background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 12, padding: "14px 18px", textAlign: "center" }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: "#15803d" }}>✓ This issue has been resolved</p>
            <Link href={`/tenant/issues/new?token=${token}`} style={{ display: "inline-block", marginTop: 10, fontSize: 13, color: S.ink2, textDecoration: "none" }}>Report a new issue →</Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function IssueThreadPage() {
  return <Suspense fallback={null}><IssueThreadInner /></Suspense>;
}
