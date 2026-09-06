"use client";

import { useState, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const CATEGORIES = [
  { value: "plumbing", label: "🚿 Plumbing", desc: "Leaks, drains, toilet, boiler" },
  { value: "electrical", label: "⚡ Electrical", desc: "Sockets, lights, fuse box" },
  { value: "heating", label: "🔥 Heating", desc: "Radiators, thermostat, hot water" },
  { value: "structural", label: "🏠 Structural", desc: "Walls, ceiling, floor, roof" },
  { value: "damp", label: "💧 Damp & mould", desc: "Condensation, leaks, mould" },
  { value: "pest", label: "🐛 Pests", desc: "Rodents, insects, birds" },
  { value: "appliance", label: "🔌 Appliances", desc: "White goods, fixtures" },
  { value: "general", label: "🔧 General", desc: "Everything else" },
];

const S = { bg: "#f8f7f5", card: "white", ink: "#1a2942", ink2: "rgba(26,41,66,0.55)", border: "rgba(26,41,66,0.1)", accent: "#1a2942" };
const input = { width: "100%", background: "rgba(26,41,66,0.03)", border: `1px solid rgba(26,41,66,0.1)`, borderRadius: 10, padding: "11px 14px", color: "#1a2942", fontSize: 14, outline: "none", boxSizing: "border-box" as const, fontFamily: "inherit" };
const label = { display: "block" as const, fontSize: 11, fontWeight: 700 as const, color: "rgba(26,41,66,0.5)", marginBottom: 6, textTransform: "uppercase" as const, letterSpacing: "0.07em" };

type Attachment = { url: string; name: string; type: string };

function NewIssueInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") || "";

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("general");
  const [priority, setPriority] = useState("normal");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList) {
    setUploading(true);
    const newAttachments: Attachment[] = [];
    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop();
      const path = `tenant-issues/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: upErr } = await supabase.storage.from("tenant-attachments").upload(path, file, { upsert: false });
      if (!upErr) {
        const { data } = supabase.storage.from("tenant-attachments").getPublicUrl(path);
        newAttachments.push({ url: data.publicUrl, name: file.name, type: file.type });
      }
    }
    setAttachments(prev => [...prev, ...newAttachments]);
    setUploading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!title.trim()) { setError("Please give the issue a title."); return; }
    setSubmitting(true);

    const res = await fetch("/api/tenant/issues/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, title, description, category, priority, attachments }),
    });
    const { issue, error: apiErr } = await res.json();
    if (apiErr || !issue) { setError(apiErr || "Failed to submit. Please try again."); setSubmitting(false); return; }
    router.push(`/tenant/issues/${issue.id}?token=${token}&new=1`);
  }

  return (
    <div style={{ minHeight: "100vh", background: S.bg, fontFamily: "var(--font-family-body)", color: S.ink }}>
      <style>{`body > header, body > footer { display: none !important; }`}</style>

      <nav style={{ background: S.accent, padding: "0 24px", display: "flex", alignItems: "center", height: 56, gap: 14 }}>
        <Link href={`/tenant/dashboard?token=${token}`} style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, textDecoration: "none", fontWeight: 500 }}>← Dashboard</Link>
        <span style={{ color: "rgba(255,255,255,0.62)" }}>›</span>
        <span style={{ color: "white", fontWeight: 700, fontSize: 13 }}>Report issue</span>
      </nav>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "36px 24px 80px" }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, letterSpacing: "-0.02em", marginBottom: 4 }}>Report a maintenance issue</h1>
        <p style={{ fontSize: 14, color: S.ink2, marginBottom: 32 }}>Your landlord will be notified by email immediately.</p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>

          {/* Category */}
          <div>
            <label style={label}>What type of issue is it?</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 8 }}>
              {CATEGORIES.map(c => (
                <button key={c.value} type="button" onClick={() => setCategory(c.value)}
                  style={{ background: category === c.value ? S.accent : S.card, border: `2px solid ${category === c.value ? S.accent : S.border}`, borderRadius: 10, padding: "10px 14px", textAlign: "left", cursor: "pointer", fontFamily: "inherit" }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: category === c.value ? "white" : S.ink, marginBottom: 2 }}>{c.label}</p>
                  <p style={{ fontSize: 11, color: category === c.value ? "rgba(255,255,255,0.6)" : S.ink2 }}>{c.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="new-issue-title" style={label}>Issue title</label>
            <input id="new-issue-title" type="text" value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g. Boiler not producing hot water" style={input} />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="new-describe-the-issue" style={label}>Describe the issue</label>
            <textarea id="new-describe-the-issue" value={description} onChange={e => setDescription(e.target.value)} placeholder="When did it start? How bad is it? What have you tried?" rows={4}
              style={{ ...input, resize: "vertical", lineHeight: 1.6 }} />
          </div>

          {/* Priority */}
          <div>
            <label style={label}>How urgent is it?</label>
            <div style={{ display: "flex", gap: 8 }}>
              {[["urgent", "🚨 Urgent", "Needs fixing today"], ["normal", "📋 Normal", "Within a week"], ["low", "🕐 Low", "When convenient"]].map(([v, l, d]) => (
                <button key={v} type="button" onClick={() => setPriority(v)}
                  style={{ flex: 1, background: priority === v ? (v === "urgent" ? "rgba(220,38,38,0.08)" : priority === v ? "rgba(26,41,66,0.06)" : "white") : S.card, border: `2px solid ${priority === v ? (v === "urgent" ? "#dc2626" : S.accent) : S.border}`, borderRadius: 10, padding: "10px 8px", cursor: "pointer", fontFamily: "inherit" }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: priority === v ? (v === "urgent" ? "#dc2626" : S.ink) : S.ink2, marginBottom: 2 }}>{l}</p>
                  <p style={{ fontSize: 11, color: S.ink2 }}>{d}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Attachments */}
          <div>
            <label style={label}>Photos or videos (optional)</label>
            <div
              onClick={() => fileRef.current?.click()}
              onDragOver={e => e.preventDefault()}
              onDrop={e => { e.preventDefault(); if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files); }}
              style={{ border: `2px dashed ${S.border}`, borderRadius: 12, padding: "28px", textAlign: "center", cursor: "pointer", background: "rgba(26,41,66,0.02)" }}>
              <p style={{ fontSize: 28, marginBottom: 8 }}>📎</p>
              <p style={{ fontSize: 14, fontWeight: 600, color: S.ink, marginBottom: 4 }}>{uploading ? "Uploading…" : "Click to attach or drag files here"}</p>
              <p style={{ fontSize: 12, color: S.ink2 }}>Photos, videos, or documents — up to 50MB each</p>
            </div>
            <input ref={fileRef} type="file" multiple accept="image/*,video/*,.pdf" style={{ display: "none" }} onChange={e => e.target.files && handleFiles(e.target.files)} />
            {attachments.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
                {attachments.map((a, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, background: S.card, border: `1px solid ${S.border}`, borderRadius: 8, padding: "5px 10px" }}>
                    <span style={{ fontSize: 12 }}>{a.type.startsWith("image") ? "🖼️" : a.type.startsWith("video") ? "🎥" : "📄"}</span>
                    <span style={{ fontSize: 12, color: S.ink, maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.name}</span>
                    <button type="button" onClick={() => setAttachments(prev => prev.filter((_, j) => j !== i))} style={{ background: "none", border: "none", color: S.ink2, cursor: "pointer", fontSize: 14, lineHeight: 1, padding: 0, fontFamily: "inherit" }}>×</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && <p style={{ fontSize: 13, color: "#b91c1c", background: "rgba(220,38,38,0.06)", padding: "10px 14px", borderRadius: 8 }}>{error}</p>}

          <button type="submit" disabled={submitting || uploading}
            style={{ background: submitting ? "rgba(26,41,66,0.4)" : S.accent, color: "white", fontWeight: 800, fontSize: 16, padding: "14px", borderRadius: 12, border: "none", cursor: submitting ? "not-allowed" : "pointer", fontFamily: "inherit" }}>
            {submitting ? "Submitting…" : "Submit issue →"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function NewIssuePage() {
  return <Suspense fallback={null}><NewIssueInner /></Suspense>;
}
