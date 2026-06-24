"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

const QUICK_STEPS = [
  { n: 1, label: "Watch Orientation", href: "/academy/courses#orientation", done: false },
  { n: 2, label: "Complete First Deal Challenge", href: "/academy/courses#challenge", done: false },
  { n: 3, label: "Build Your Investor List", href: "/academy/courses#module-08", done: false },
  { n: 4, label: "Package Your First Deal", href: "/academy/playbooks", done: false },
  { n: 5, label: "Present to Investors", href: "/academy/scripts", done: false },
  { n: 6, label: "Secure Your First Fee", href: "/academy/courses#module-10", done: false },
];

const LEVELS = [
  { name: "Beginner Sourcer", min: 0, icon: "🌱" },
  { name: "Active Sourcer", min: 100, icon: "🔍" },
  { name: "Deal Packager", min: 300, icon: "📦" },
  { name: "Investor Connector", min: 600, icon: "🤝" },
  { name: "Deal Closer", min: 1000, icon: "🎯" },
  { name: "Master Sourcer", min: 2000, icon: "⭐" },
  { name: "Elite Sourcer", min: 5000, icon: "🏆" },
];

const ROAD_STAGES = [
  "Learn Fundamentals",
  "Analyse Deals",
  "Build Investor List",
  "Package Opportunities",
  "Present Deals",
  "Secure First Fee",
  "Build Monthly Pipeline",
  "Scale Operations",
  "Build Brand",
  "Create Sustainable Business",
];

type Enrollment = {
  id: string;
  course_id: string;
  enrolled_at: string;
  completed_at: string | null;
  course: { title: string; slug: string; lesson_count: number; duration_hrs: number } | null;
  completed_lessons: number;
};

export default function AcademyDashboard() {
  const { user } = useAuth();
  const [memberData, setMemberData] = useState<{ status: string; name?: string; stripe_customer_id?: string; access_until?: string | null; trial_end?: string | null } | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [justPaid, setJustPaid] = useState(false);
  const [pollCount, setPollCount] = useState(0);
  const [points] = useState(50);

  const loadData = useCallback(async (userId: string) => {
    const [{ data: member }, { data: enr }, { data: prog }] = await Promise.all([
      supabase.from("academy_members").select("*").eq("user_id", userId).maybeSingle(),
      supabase.from("academy_enrollments")
        .select("id, course_id, enrolled_at, completed_at, course:academy_courses(title, slug, lesson_count, duration_hrs)")
        .eq("user_id", userId)
        .order("enrolled_at", { ascending: false }),
      supabase.from("academy_progress")
        .select("course_id, completed")
        .eq("user_id", userId)
        .eq("completed", true),
    ]);
    setMemberData(member);
    const progressByCourse: Record<string, number> = {};
    (prog || []).forEach((p: any) => { progressByCourse[p.course_id] = (progressByCourse[p.course_id] || 0) + 1; });
    setEnrollments((enr || []).map((e: any) => ({ ...e, completed_lessons: progressByCourse[e.course_id] || 0 })));
    setCheckingAccess(false);
    return member;
  }, []);

  useEffect(() => {
    if (!user) { setCheckingAccess(false); return; }
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "1") setJustPaid(true);
    loadData(user.id);
  }, [user, loadData]);

  // Poll for webhook activation if user just paid but status not active yet
  useEffect(() => {
    if (!justPaid || !user) return;
    const isActive = memberData?.status === "active" || memberData?.status === "trialing";
    if (isActive || pollCount >= 8) return; // stop after ~16 seconds
    const t = setTimeout(async () => {
      await loadData(user.id);
      setPollCount(c => c + 1);
    }, 2000);
    return () => clearTimeout(t);
  }, [justPaid, memberData, pollCount, user, loadData]);

  const currentLevel = LEVELS.reduce((acc, l) => (points >= l.min ? l : acc), LEVELS[0]);
  const nextLevel = LEVELS[LEVELS.findIndex(l => l.name === currentLevel.name) + 1];
  const progress = nextLevel ? Math.round(((points - currentLevel.min) / (nextLevel.min - currentLevel.min)) * 100) : 100;

  if (checkingAccess) {
    return <div style={{ minHeight: "100vh", background: "#0a0f1e", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 14 }}>
      <div style={{ width: 40, height: 40, border: "3px solid rgba(212,175,55,0.2)", borderTopColor: "#d4af37", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>Loading your academy…</div>
    </div>;
  }

  if (!user) {
    return <div style={{ minHeight: "100vh", background: "#0a0f1e", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 20, padding: 24, textAlign: "center" }}>
      <div style={{ fontSize: 48 }}>🔒</div>
      <h2 style={{ color: "white", fontSize: 24, fontWeight: 800 }}>Sign in to access the Academy</h2>
      <Link href="/academy/auth" style={{ background: "#d4af37", color: "#0a0f1e", fontWeight: 700, padding: "12px 32px", borderRadius: 12, textDecoration: "none" }}>Sign In</Link>
      <Link href="/academy/subscribe" style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>No account? Join for £14.99/mo →</Link>
    </div>;
  }

  const isActive = memberData?.status === "active" || memberData?.status === "trialing";
  const inGracePeriod = memberData?.status === "cancelled" && memberData?.access_until
    ? new Date(memberData.access_until) > new Date()
    : false;
  const gracePeriodEnd = memberData?.access_until ? new Date(memberData.access_until) : null;
  const hasAccess = isActive || inGracePeriod;

  if (!hasAccess) {
    // Just paid — webhook hasn't fired yet, poll until active
    if (justPaid) {
      return <div style={{ minHeight: "100vh", background: "#0a0f1e", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16, padding: 24, textAlign: "center" }}>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={{ fontSize: 48 }}>🎉</div>
        <h2 style={{ color: "white", fontSize: 26, fontWeight: 800 }}>Payment confirmed!</h2>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, maxWidth: 360 }}>Setting up your access — this takes just a moment.</p>
        <div style={{ display: "flex", alignItems: "center", gap: 10, color: "rgba(255,255,255,0.35)", fontSize: 13 }}>
          <div style={{ width: 18, height: 18, border: "2px solid rgba(212,175,55,0.3)", borderTopColor: "#d4af37", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          Activating your membership…
        </div>
        {pollCount >= 8 && (
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", marginTop: 8 }}>
            Taking longer than expected.{" "}
            <button onClick={() => window.location.reload()} style={{ color: "#d4af37", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 13, textDecoration: "underline" }}>Refresh</button>
          </p>
        )}
      </div>;
    }
    const wasSubscriber = memberData?.status === "cancelled";
    return <div style={{ minHeight: "100vh", background: "#0a0f1e", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 20, padding: 24, textAlign: "center" }}>
      <div style={{ fontSize: 48 }}>{wasSubscriber ? "⏰" : "🎓"}</div>
      <h2 style={{ color: "white", fontSize: 28, fontWeight: 800, maxWidth: 500 }}>
        {wasSubscriber ? "Your access has ended" : "Join the Deal Sourcing Academy"}
      </h2>
      <p style={{ color: "rgba(255,255,255,0.5)", maxWidth: 440 }}>
        {wasSubscriber
          ? "Your free grace period has expired. Resubscribe to get instant access back to all your courses and progress."
          : "Get instant access to all courses, playbooks, scripts, tools, and downloads for just £14.99/month."}
      </p>
      <Link href="/academy/subscribe" style={{ background: "linear-gradient(135deg,#d4af37,#f0d060)", color: "#0a0f1e", fontWeight: 800, padding: "14px 36px", borderRadius: 12, textDecoration: "none", fontSize: 16 }}>
        {wasSubscriber ? "Resubscribe — £14.99/mo →" : "Subscribe — £14.99/mo →"}
      </Link>
    </div>;
  }

  async function openBillingPortal() {
    if (!memberData?.stripe_customer_id) return;
    const res = await fetch("/api/stripe/portal", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ customerId: memberData.stripe_customer_id }) });
    const { url } = await res.json();
    if (url) window.location.href = url;
  }

  return (
    <div style={{ background: "#0a0f1e", minHeight: "100vh", color: "white", fontFamily: "var(--font-family-body)" }}>

      {/* Trial active banner */}
      {memberData?.status === "trialing" && memberData?.trial_end && (
        <div style={{ background: "rgba(212,175,55,0.1)", borderBottom: "1px solid rgba(212,175,55,0.2)", padding: "10px 24px", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
          <span style={{ fontSize: 14, color: "#d4af37" }}>
            🎁 Free trial active — your first payment of <strong>£14.99</strong> will be taken on <strong>{new Date(memberData.trial_end).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</strong>.
          </span>
          <Link href="/academy/dashboard" style={{ color: "rgba(212,175,55,0.6)", fontSize: 12, textDecoration: "none" }}>Manage subscription →</Link>
        </div>
      )}

      {/* Grace period warning banner */}
      {inGracePeriod && gracePeriodEnd && (
        <div style={{ background: "rgba(239,68,68,0.12)", borderBottom: "1px solid rgba(239,68,68,0.25)", padding: "10px 24px", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
          <span style={{ fontSize: 14, color: "#fca5a5" }}>
            ⚠️ Your subscription was cancelled. Free access ends on <strong>{gracePeriodEnd.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</strong>.
          </span>
          <Link href="/academy/subscribe" style={{ background: "#ef4444", color: "white", fontWeight: 700, fontSize: 13, padding: "6px 16px", borderRadius: 8, textDecoration: "none", whiteSpace: "nowrap" }}>
            Resubscribe →
          </Link>
        </div>
      )}

      {/* TOP BAR */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <Link href="/academy/dashboard" style={{ color: "#d4af37", fontWeight: 800, fontSize: 18, textDecoration: "none" }}>DSA</Link>
          {[
            { label: "Courses", href: "/academy/courses" },
            { label: "Playbooks", href: "/academy/playbooks" },
            { label: "Scripts", href: "/academy/scripts" },
            { label: "Downloads", href: "/academy/downloads" },
            { label: "Legal Hub", href: "/academy/legal" },
            { label: "Calculator", href: "/academy/calculator" },
            { label: "CRM", href: "/academy/crm" },
            { label: "Emails", href: "/academy/emails" },
            { label: "Checklist", href: "/academy/checklist" },
            { label: "Deal Reviews", href: "/academy/deal-reviews" },
            { label: "Area Research", href: "/academy/area-research" },
            { label: "Q&A", href: "/academy/qa" },
            { label: "Media", href: "/academy/media" },
          ].map(l => (
            <Link key={l.href} href={l.href} style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontWeight: 600, textDecoration: "none", whiteSpace: "nowrap" }}>{l.label}</Link>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{memberData?.name || user.email}</span>
          <button onClick={openBillingPortal} style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", background: "none", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "4px 10px", cursor: "pointer" }}>Manage Subscription</button>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>

        {/* WELCOME + LEVEL */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 20, marginBottom: 28, alignItems: "start" }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4, fontFamily: "var(--font-family-heading)" }}>
              {justPaid ? "Welcome to the Academy" : "Welcome back"}, {memberData?.name?.split(" ")[0] || "Sourcer"} 👋
            </h1>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>
              {justPaid ? "Your membership is active. Start with a course below." : "Your deal sourcing journey continues here. Keep building."}
            </p>
          </div>
          <div style={{ background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 14, padding: "14px 20px", textAlign: "center", minWidth: 160 }}>
            <div style={{ fontSize: 24 }}>{currentLevel.icon}</div>
            <div style={{ fontWeight: 800, fontSize: 14, color: "#d4af37", marginTop: 4 }}>{currentLevel.name}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", margin: "4px 0" }}>{points} pts {nextLevel ? `→ ${nextLevel.min}` : ""}</div>
            <div style={{ height: 4, background: "rgba(255,255,255,0.1)", borderRadius: 4 }}>
              <div style={{ height: "100%", width: `${progress}%`, background: "#d4af37", borderRadius: 4, transition: "width 0.5s" }} />
            </div>
          </div>
        </div>

        {/* NEW MEMBER WELCOME */}
        {justPaid && enrollments.length === 0 && (
          <div style={{ background: "linear-gradient(135deg,rgba(212,175,55,0.12),rgba(212,175,55,0.04))", border: "1px solid rgba(212,175,55,0.3)", borderRadius: 16, padding: 24, marginBottom: 24, display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
            <div style={{ fontSize: 40 }}>🎓</div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontWeight: 800, fontSize: 17, color: "#d4af37", marginBottom: 4 }}>You&apos;re in. Start your first course.</h3>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 12 }}>Browse all courses, pick one that fits your strategy, and begin earning your first deal fee.</p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Link href="/academy/courses" style={{ background: "linear-gradient(135deg,#d4af37,#f0d060)", color: "#0a0f1e", fontWeight: 800, fontSize: 13, padding: "10px 22px", borderRadius: 10, textDecoration: "none" }}>Browse all courses →</Link>
                <Link href="/academy/playbooks" style={{ background: "rgba(255,255,255,0.06)", color: "white", fontWeight: 600, fontSize: 13, padding: "10px 22px", borderRadius: 10, textDecoration: "none" }}>Explore playbooks</Link>
                <Link href="/academy/downloads" style={{ background: "rgba(255,255,255,0.06)", color: "white", fontWeight: 600, fontSize: 13, padding: "10px 22px", borderRadius: 10, textDecoration: "none" }}>Downloads & templates</Link>
              </div>
            </div>
          </div>
        )}

        {/* QUICK START */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24, marginBottom: 24 }}>
          <h2 style={{ fontWeight: 800, fontSize: 16, marginBottom: 16 }}>⚡ Quick Start — Your Roadmap to First Fee</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 10 }}>
            {QUICK_STEPS.map(s => (
              <Link key={s.n} href={s.href} style={{ textDecoration: "none", background: s.done ? "rgba(212,175,55,0.08)" : "rgba(255,255,255,0.03)", border: `1px solid ${s.done ? "rgba(212,175,55,0.3)" : "rgba(255,255,255,0.07)"}`, borderRadius: 10, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 26, height: 26, borderRadius: "50%", background: s.done ? "#d4af37" : "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: s.done ? "#0a0f1e" : "rgba(255,255,255,0.4)", flexShrink: 0 }}>
                  {s.done ? "✓" : s.n}
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: s.done ? "#d4af37" : "white" }}>{s.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* MAIN GRID */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>

          {/* COURSES */}
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ fontWeight: 800, fontSize: 16 }}>🎓 Your Courses</h2>
              <Link href="/academy/courses" style={{ fontSize: 12, color: "#d4af37", textDecoration: "none", fontWeight: 600 }}>Browse all →</Link>
            </div>
            {enrollments.length === 0 ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginBottom: 12 }}>No courses enrolled yet.</p>
                <Link href="/academy/courses" style={{ background: "#d4af37", color: "#0a0f1e", fontWeight: 700, fontSize: 12, padding: "8px 18px", borderRadius: 8, textDecoration: "none" }}>Browse courses →</Link>
              </div>
            ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {enrollments.map(e => {
                const total = e.course?.lesson_count || 1;
                const pct = Math.round((e.completed_lessons / total) * 100);
                return (
                <Link key={e.id} href={`/academy/courses/${e.course?.slug}`} style={{ textDecoration: "none", display: "block", background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: "12px 14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "white" }}>{e.course?.title || "Course"}</span>
                    <span style={{ fontSize: 11, color: pct === 100 ? "#22c55e" : "rgba(255,255,255,0.4)" }}>{pct === 100 ? "✓ Complete" : `${pct}%`}</span>
                  </div>
                  <div style={{ height: 3, background: "rgba(255,255,255,0.08)", borderRadius: 3 }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: pct === 100 ? "#22c55e" : "#d4af37", borderRadius: 3 }} />
                  </div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 4 }}>{e.completed_lessons}/{e.course?.lesson_count || 0} lessons · {e.course?.duration_hrs}h</div>
                </Link>
                );
              })}
            </div>
            )}
          </div>

          {/* DOWNLOADS */}
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ fontWeight: 800, fontSize: 16 }}>📁 Latest Downloads</h2>
              <Link href="/academy/downloads" style={{ fontSize: 12, color: "#d4af37", textDecoration: "none", fontWeight: 600 }}>View all →</Link>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { name: "Investor CRM Template", type: "XLSX" },
                { name: "Deal Packaging Template", type: "PDF" },
                { name: "Buyer Qualification Form", type: "PDF" },
                { name: "Sales Script Vault", type: "PDF" },
                { name: "Cash Flow Calculator", type: "XLSX" },
              ].map(d => (
                <Link key={d.name} href="/academy/downloads" style={{ textDecoration: "none", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 10px", background: "rgba(255,255,255,0.02)", borderRadius: 8 }}>
                  <span style={{ fontSize: 13, color: "white" }}>{d.name}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: "#d4af37", background: "rgba(212,175,55,0.1)", padding: "2px 6px", borderRadius: 4 }}>{d.type}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* MEMBER ROADMAP */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24, marginBottom: 24 }}>
          <h2 style={{ fontWeight: 800, fontSize: 16, marginBottom: 20 }}>🗺️ Member Success Roadmap</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {ROAD_STAGES.map((stage, i) => (
              <div key={stage} style={{ background: i === 0 ? "rgba(212,175,55,0.15)" : "rgba(255,255,255,0.03)", border: `1px solid ${i === 0 ? "rgba(212,175,55,0.4)" : "rgba(255,255,255,0.07)"}`, borderRadius: 10, padding: "8px 14px", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: i === 0 ? "#d4af37" : "rgba(255,255,255,0.3)" }}>S{i + 1}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: i === 0 ? "#d4af37" : "rgba(255,255,255,0.5)" }}>{stage}</span>
              </div>
            ))}
          </div>
        </div>

        {/* NEW TOOLS GRID */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24, marginBottom: 24 }}>
          <h2 style={{ fontWeight: 800, fontSize: 16, marginBottom: 16 }}>🛠️ Members-Only Tools</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: 10 }}>
            {[
              { icon: "📊", label: "Deal Calculator", sub: "BRRR · JV · Packaging", href: "/academy/calculator" },
              { icon: "👥", label: "Investor CRM", sub: "Track contacts", href: "/academy/crm" },
              { icon: "✉️", label: "Email Swipe File", sub: "11 templates", href: "/academy/emails" },
              { icon: "✅", label: "Sourcing Checklist", sub: "37 steps", href: "/academy/checklist" },
              { icon: "🏘️", label: "Area Research", sub: "7 cities covered", href: "/academy/area-research" },
              { icon: "📋", label: "Deal Reviews", sub: "Weekly analysis", href: "/academy/deal-reviews" },
              { icon: "❓", label: "Q&A Board", sub: "Ask Nass anything", href: "/academy/qa" },
              { icon: "🎬", label: "Media Hub", sub: "Videos coming soon", href: "/academy/media" },
            ].map(t => (
              <Link key={t.href} href={t.href} style={{ textDecoration: "none", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "14px 14px", display: "flex", flexDirection: "column", gap: 4 }}
                className="hover:border-yellow-500/30 transition-colors">
                <span style={{ fontSize: 20 }}>{t.icon}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "white" }}>{t.label}</span>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{t.sub}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* ACTION TASKS */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24 }}>
          <h2 style={{ fontWeight: 800, fontSize: 16, marginBottom: 16 }}>✅ Today&apos;s Action Tasks</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              "Watch the orientation video in Module 1",
              "Set up your free Investor CRM using the template in Downloads",
              "List 5 estate agents in your target area you will call this week",
              "Read the Deal Sourcing Masterclass — Module 1 overview",
              "Join the community and introduce yourself",
            ].map((task, i) => (
              <label key={i} style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
                <input type="checkbox" style={{ width: 16, height: 16, accentColor: "#d4af37" }} />
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.75)" }}>{task}</span>
              </label>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
