"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

const S = { bg: "#f8f7f5", card: "white", ink: "#1a2942", ink2: "rgba(26,41,66,0.55)", border: "rgba(26,41,66,0.1)", accent: "#1a2942", gold: "#c9a84c" };

const STYLING_TIPS = [
  { icon: "🪴", title: "Add a mirror to a small room", tip: "A large mirror on the longest wall doubles the perceived space and bounces natural light. Charity shops are great for affordable finds." },
  { icon: "💡", title: "Swap bulbs for warm-white LEDs", tip: "Cool white lighting feels clinical. 2700K warm-white bulbs cost under £3 each and instantly make a home feel cosier and more inviting." },
  { icon: "🪟", title: "Hang curtains high and wide", tip: "Hang curtain rails 10cm above the window frame and extend them 15cm either side. Makes windows look larger and ceilings higher — no renovation needed." },
  { icon: "🎨", title: "Neutral walls, colour in textiles", tip: "If you can't paint, bring colour through cushions, throws, and a rug. Layer 2–3 complementary tones. It's renter-friendly and changeable." },
  { icon: "📦", title: "Use vertical space for storage", tip: "Tall bookcases, wall shelves and pegboards keep floors clear. Clutter makes rooms look smaller — vertical storage makes them look taller." },
  { icon: "🌿", title: "Plants on every windowsill", tip: "A pothos or spider plant needs almost no care and adds life to any room. Group 3 pots of different heights for a proper plant moment." },
  { icon: "🛏️", title: "Layer your bed like a hotel", tip: "White duvet, two pillows per person, two decorative cushions, one throw folded at the foot. It takes 2 minutes and makes your whole room feel put together." },
  { icon: "🔲", title: "Create a gallery wall on a budget", tip: "Print 4–6 photos at 5x7\", frame them in matching black frames from IKEA (£2 each). Arrange them in a grid — instant designer look, under £20." },
];

type Issue = { id: string; title: string; category: string; priority: string; status: string; created_at: string; description?: string };

function StatusBadge({ status }: { status: string }) {
  const cfg: Record<string, { label: string; bg: string; color: string }> = {
    open: { label: "Open", bg: "rgba(239,68,68,0.1)", color: "#dc2626" },
    in_progress: { label: "In progress", bg: "rgba(234,179,8,0.1)", color: "#ca8a04" },
    scheduled: { label: "Scheduled", bg: "rgba(59,130,246,0.1)", color: "#2563eb" },
    resolved: { label: "Resolved", bg: "rgba(34,197,94,0.1)", color: "#16a34a" },
  };
  const c = cfg[status] ?? { label: status, bg: "rgba(26,41,66,0.08)", color: S.ink2 };
  return <span style={{ fontSize: 11, fontWeight: 700, background: c.bg, color: c.color, padding: "3px 9px", borderRadius: 6 }}>{c.label}</span>;
}

function TenantDashboardInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") || "";

  const [tenantName, setTenantName] = useState("");
  const [propertyAddress, setPropertyAddress] = useState("");
  const [issues, setIssues] = useState<Issue[]>([]);
  const [tab, setTab] = useState<"issues" | "styling">("issues");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) { router.push("/tenant"); return; }
    Promise.all([
      fetch(`/api/tenant/validate?token=${token}`).then(r => r.json()),
      fetch(`/api/tenant/issues?token=${token}`).then(r => r.json()),
    ]).then(([inv, iss]) => {
      if (!inv.valid) { router.push("/tenant"); return; }
      setTenantName(inv.tenant_name || inv.email);
      setPropertyAddress(inv.property_address || "");
      setIssues(iss.issues || []);
      setLoading(false);
    });
  }, [token, router]);

  if (loading) return <div style={{ minHeight: "100vh", background: S.bg, display: "flex", alignItems: "center", justifyContent: "center" }}><p style={{ color: S.ink2 }}>Loading…</p></div>;

  const firstName = tenantName.split(" ")[0];
  const openCount = issues.filter(i => i.status !== "resolved").length;

  return (
    <div style={{ minHeight: "100vh", background: S.bg, fontFamily: "var(--font-family-body)", color: S.ink }}>
      <style>{`body > header, body > footer { display: none !important; }`}</style>

      {/* NAV */}
      <nav style={{ background: S.accent, padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ color: S.gold, fontWeight: 900, fontSize: 15 }}>PV</span>
          <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>›</span>
          <span style={{ color: "white", fontWeight: 700, fontSize: 13 }}>Tenant Portal</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{propertyAddress.split(",")[0]}</span>
          <button onClick={() => router.push("/tenant")} style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>Sign out</button>
        </div>
      </nav>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "32px 24px 80px" }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: "clamp(24px,4vw,36px)", fontWeight: 900, letterSpacing: "-0.02em", marginBottom: 4 }}>Hi {firstName} 👋</h1>
          <p style={{ fontSize: 14, color: S.ink2 }}>{propertyAddress || "Your property"} · {openCount} open issue{openCount !== 1 ? "s" : ""}</p>
        </div>

        {/* Quick action */}
        <Link href={`/tenant/issues/new?token=${token}`} style={{ display: "flex", alignItems: "center", gap: 14, background: S.accent, borderRadius: 14, padding: "18px 22px", textDecoration: "none", marginBottom: 32 }}>
          <div style={{ width: 40, height: 40, background: "rgba(255,255,255,0.1)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>🔧</div>
          <div style={{ flex: 1 }}>
            <p style={{ color: "white", fontWeight: 800, fontSize: 15, marginBottom: 2 }}>Report a maintenance issue</p>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>Add photos or videos · Your landlord is notified instantly</p>
          </div>
          <span style={{ color: S.gold, fontSize: 18, fontWeight: 700 }}>→</span>
        </Link>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 0, borderBottom: `2px solid ${S.border}`, marginBottom: 28 }}>
          {([["issues", `Issues (${issues.length})`], ["styling", "Home Styling Tips"]] as const).map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)} style={{ background: "none", border: "none", padding: "10px 20px", fontSize: 14, fontWeight: tab === key ? 800 : 500, color: tab === key ? S.ink : S.ink2, cursor: "pointer", borderBottom: tab === key ? `2px solid ${S.accent}` : "2px solid transparent", marginBottom: -2, fontFamily: "inherit" }}>
              {label}
            </button>
          ))}
        </div>

        {tab === "issues" && (
          issues.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 24px", background: S.card, borderRadius: 16, border: `1px solid ${S.border}` }}>
              <div style={{ fontSize: 48, marginBottom: 14 }}>✅</div>
              <p style={{ fontWeight: 800, fontSize: 16, marginBottom: 6 }}>No issues reported yet</p>
              <p style={{ fontSize: 14, color: S.ink2, marginBottom: 20 }}>If something needs fixing, report it here and your landlord will be notified straight away.</p>
              <Link href={`/tenant/issues/new?token=${token}`} style={{ display: "inline-block", background: S.accent, color: "white", fontWeight: 700, fontSize: 14, padding: "11px 24px", borderRadius: 10, textDecoration: "none" }}>Report an issue →</Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {issues.map(issue => (
                <Link key={issue.id} href={`/tenant/issues/${issue.id}?token=${token}`} style={{ textDecoration: "none" }}>
                  <div style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: 14, padding: "18px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <StatusBadge status={issue.status} />
                        <span style={{ fontSize: 11, color: S.ink2 }}>{issue.category}</span>
                      </div>
                      <p style={{ fontWeight: 700, fontSize: 15, color: S.ink, marginBottom: 2 }}>{issue.title}</p>
                      <p style={{ fontSize: 12, color: S.ink2 }}>{new Date(issue.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</p>
                    </div>
                    <span style={{ color: S.ink2, fontSize: 18 }}>›</span>
                  </div>
                </Link>
              ))}
            </div>
          )
        )}

        {tab === "styling" && (
          <div>
            <p style={{ fontSize: 13, color: S.ink2, marginBottom: 24, lineHeight: 1.7 }}>
              Small changes, big difference. Here are practical tips for making your home feel more like yours — all renter-friendly, most under £20.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 14 }}>
              {STYLING_TIPS.map(tip => (
                <div key={tip.title} style={{ background: S.card, border: `1px solid ${S.border}`, borderRadius: 14, padding: "18px 18px" }}>
                  <div style={{ fontSize: 28, marginBottom: 10 }}>{tip.icon}</div>
                  <p style={{ fontWeight: 800, fontSize: 14, color: S.ink, marginBottom: 6 }}>{tip.title}</p>
                  <p style={{ fontSize: 13, color: S.ink2, lineHeight: 1.65 }}>{tip.tip}</p>
                </div>
              ))}
            </div>
            <div style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 14, padding: "18px 20px", marginTop: 20 }}>
              <p style={{ fontWeight: 800, fontSize: 14, color: S.ink, marginBottom: 4 }}>💡 Want personalised advice?</p>
              <p style={{ fontSize: 13, color: S.ink2, lineHeight: 1.65 }}>Message your landlord through an issue if you want to ask about painting walls, putting up shelves, or making other changes — they may be happy to help or contribute.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TenantDashboard() {
  return <Suspense fallback={null}><TenantDashboardInner /></Suspense>;
}
