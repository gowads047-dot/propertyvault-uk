"use client";

import { useState } from "react";
import Link from "next/link";

const NAV = [["Courses","/academy/courses"],["Playbooks","/academy/playbooks"],["Scripts","/academy/scripts"],["Downloads","/academy/downloads"],["Calculator","/academy/calculator"],["CRM","/academy/crm"],["Emails","/academy/emails"],["Q&A","/academy/qa"]];

const CATEGORIES = ["All","Getting Started","Legal & Compliance","Finding Deals","Investors","Fees & Contracts","Tools"];

interface QA {
  id: number;
  q: string;
  a: string;
  category: string;
  likes: number;
  date: string;
  answered: boolean;
}

const INITIAL_QA: QA[] = [
  { id: 1, q: "How do I register with a property redress scheme and how much does it cost?", a: "You need to register with either The Property Ombudsman (TPO) or the Property Redress Scheme (PRS). For a sole trader / small business the annual fee is typically £180–£220. Registration is done online and takes around 30 minutes. You legally cannot charge sourcing fees without being registered. See the Legal Hub for full details.", category: "Legal & Compliance", likes: 12, date: "2026-06-18", answered: true },
  { id: 2, q: "What should I include in my sourcing agreement?", a: "Your sourcing agreement should cover: (1) Description of the service, (2) Your fee amount and when it's payable, (3) Confirmation it's payable on exchange, not before, (4) What happens if the deal falls through, (5) Your redress scheme membership number, (6) GDPR clause, (7) Jurisdiction (England & Wales). Always have a solicitor review your template before use.", category: "Legal & Compliance", likes: 9, date: "2026-06-17", answered: true },
  { id: 3, q: "How do I find my first investor if I have no network?", a: "Start at local property networking events — PIN (Property Investors Network) runs monthly events across the UK. Progressive Property also run events. LinkedIn is powerful — post about what you do and what you're looking for. Facebook groups (UK Property Investors, etc.) are also good. Your first investor often comes from someone you already know. Tell everyone what you do.", category: "Investors", likes: 18, date: "2026-06-16", answered: true },
  { id: 4, q: "What's a realistic sourcing fee to charge as a beginner?", a: "Most sourcers charge between £3,000–£6,000 per deal. As a beginner, starting at £3,000–£4,000 is reasonable — it's easier to justify and still leaves good profit for your investor. Never charge a percentage of the deal (this triggers FCA regulation). Always charge a flat fee. As your track record builds, you can increase this.", category: "Fees & Contracts", likes: 15, date: "2026-06-15", answered: true },
  { id: 5, q: "How do I analyse a deal quickly when I'm out viewing?", a: "Use the 1% rule as a quick check — monthly rent should be at least 1% of purchase price for a decent yield. Then run the full numbers in the Deal Calculator when you're back. Key things to check on the viewing: condition of roof, windows, boiler, electrics. Get a builder to walk around with you for a refurb estimate on any deal you're serious about.", category: "Finding Deals", likes: 11, date: "2026-06-14", answered: true },
  { id: 6, q: "Can I source deals before I have investors lined up?", a: "It's risky but possible. The better approach is to build your investor list first, understand exactly what they want, then go and find it. If you source a deal first and can't find a buyer you could lose the deal or damage your relationship with the vendor/agent. Build your buyer list before your deal pipeline.", category: "Getting Started", likes: 7, date: "2026-06-13", answered: true },
  { id: 7, q: "How do I use the Deal Calculator for a packaging deal?", a: "Switch to the 'Deal Packaging' tab. Enter the purchase price, refurb cost, GDV and your packaging fee. The calculator shows your fee as a % of the deal and the equity the investor receives. A good deal for a packaging fee is one where the investor gains significantly more equity than they pay in your fee — aim for at least 4:1 ratio.", category: "Tools", likes: 6, date: "2026-06-12", answered: true },
];

export default function AcademyQAPage() {
  const [qaList, setQaList] = useState<QA[]>(INITIAL_QA);
  const [active, setActive] = useState("All");
  const [question, setQuestion] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [liked, setLiked] = useState<Set<number>>(new Set());
  const [expanded, setExpanded] = useState<number | null>(null);

  const filtered = active === "All" ? qaList : qaList.filter(q => q.category === active);

  function submitQ(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim()) return;
    setQaList(prev => [{
      id: Date.now(), q: question, a: "", category: "Getting Started", likes: 0,
      date: new Date().toISOString().slice(0, 10), answered: false,
    }, ...prev]);
    // Also send to email
    window.location.href = `mailto:gowads047@gmail.com?subject=Academy Q%26A: New Question&body=${encodeURIComponent(`From: ${name || "Anonymous"}\n\nQuestion: ${question}`)}`;
    setQuestion(""); setName(""); setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  }

  function like(id: number) {
    if (liked.has(id)) return;
    setLiked(prev => new Set([...prev, id]));
    setQaList(prev => prev.map(q => q.id === id ? { ...q, likes: q.likes + 1 } : q));
  }

  return (
    <div style={{ background: "#0a0f1e", minHeight: "100vh", color: "white" }}>
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "14px 24px", display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
        <Link href="/academy/dashboard" style={{ color: "#d4af37", fontWeight: 800, fontSize: 16, textDecoration: "none" }}>DSA</Link>
        {NAV.map(([l, h]) => (
          <Link key={h} href={h} style={{ color: l === "Q&A" ? "#d4af37" : "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: 600, textDecoration: "none" }}>{l}</Link>
        ))}
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "32px 24px" }}>
        <p style={{ fontSize: 11, color: "#d4af37", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Members Only</p>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>Q&A Board</h1>
        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, marginBottom: 28 }}>
          Ask anything about deal sourcing. Nass answers every question personally.
        </p>

        {/* Ask a question */}
        <div style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 16, padding: 24, marginBottom: 32 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 16 }}>Ask a Question</h2>
          {submitted ? (
            <div style={{ background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.3)", borderRadius: 10, padding: "14px 18px", color: "#4ade80", fontSize: 14, fontWeight: 600 }}>
              ✓ Question submitted! Nass will answer within 48 hours.
            </div>
          ) : (
            <form onSubmit={submitQ}>
              <input
                type="text" placeholder="Your first name (optional)" value={name} onChange={e => setName(e.target.value)}
                style={{ width: "100%", marginBottom: 10, padding: "10px 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "white", fontSize: 13, boxSizing: "border-box", outline: "none" }}
              />
              <textarea
                placeholder="Type your question here… Be as specific as possible for the best answer."
                value={question} onChange={e => setQuestion(e.target.value)} required rows={3}
                style={{ width: "100%", marginBottom: 12, padding: "10px 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "white", fontSize: 13, boxSizing: "border-box", outline: "none", resize: "vertical" }}
              />
              <button type="submit" style={{ background: "#d4af37", color: "#0a0f1e", border: "none", borderRadius: 10, padding: "10px 24px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                Submit Question →
              </button>
            </form>
          )}
        </div>

        {/* Category filter */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActive(cat)} style={{ padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "none", background: active === cat ? "#d4af37" : "rgba(255,255,255,0.07)", color: active === cat ? "#0a0f1e" : "rgba(255,255,255,0.6)" }}>
              {cat}
            </button>
          ))}
        </div>

        {/* Q&A list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.map(item => (
            <div key={item.id} style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${expanded === item.id ? "rgba(212,175,55,0.25)" : "rgba(255,255,255,0.07)"}`, borderRadius: 14, overflow: "hidden" }}>
              <button onClick={() => setExpanded(expanded === item.id ? null : item.id)} style={{ width: "100%", background: "none", border: "none", padding: "16px 20px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", cursor: "pointer", color: "white", textAlign: "left", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.45)" }}>{item.category}</span>
                    {item.answered && <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: "rgba(74,222,128,0.1)", color: "#4ade80" }}>✓ Answered</span>}
                    {!item.answered && <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: "rgba(251,191,36,0.1)", color: "#fbbf24" }}>⏳ Pending</span>}
                  </div>
                  <p style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.4 }}>{item.q}</p>
                </div>
                <span style={{ fontSize: 16, color: "rgba(255,255,255,0.3)", flexShrink: 0, marginTop: 4 }}>{expanded === item.id ? "−" : "+"}</span>
              </button>

              {expanded === item.id && (
                <div style={{ padding: "0 20px 20px" }}>
                  {item.answered && item.a ? (
                    <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: "14px 16px", marginBottom: 14 }}>
                      <p style={{ fontSize: 11, color: "#d4af37", fontWeight: 700, marginBottom: 8 }}>Nass says:</p>
                      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.7 }}>{item.a}</p>
                    </div>
                  ) : (
                    <div style={{ background: "rgba(251,191,36,0.05)", borderRadius: 10, padding: "12px 16px", marginBottom: 14, fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
                      This question is in the queue. Expect an answer within 48 hours.
                    </div>
                  )}
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <button onClick={() => like(item.id)} disabled={liked.has(item.id)} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: liked.has(item.id) ? "#d4af37" : "rgba(255,255,255,0.4)", background: "none", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "5px 12px", cursor: liked.has(item.id) ? "default" : "pointer" }}>
                      👍 {item.likes} helpful
                    </button>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>{item.date}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
