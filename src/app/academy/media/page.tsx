import Link from "next/link";

const NAV = [["Courses","/academy/courses"],["Playbooks","/academy/playbooks"],["Scripts","/academy/scripts"],["Downloads","/academy/downloads"],["Calculator","/academy/calculator"],["CRM","/academy/crm"],["Emails","/academy/emails"],["Q&A","/academy/qa"]];

const COMING_SOON = [
  { icon: "🎙️", title: "Weekly Podcast", desc: "Deal sourcing strategies, investor interviews, and market analysis. New episode every Thursday." },
  { icon: "📹", title: "Video Walkthroughs", desc: "Screen-share deal analysis sessions, calculator tutorials, and live property tours." },
  { icon: "🎬", title: "Module Recordings", desc: "Video versions of every masterclass module — watch at your own pace." },
  { icon: "📞", title: "Monthly Live Q&A", desc: "Live video call with Nass every month. Submit questions in advance via the Q&A board." },
];

const RESOURCES = [
  { title: "How to Analyse a BRRR Deal in 10 Minutes", type: "Video Guide", duration: "10 min", href: "/academy/calculator" },
  { title: "Building Your First Investor List", type: "Walkthrough", duration: "8 min", href: "/academy/crm" },
  { title: "Packaging Your First Deal — Full Process", type: "Step-by-Step", duration: "15 min", href: "/academy/playbooks" },
  { title: "Legal Requirements for Deal Sourcers 2025", type: "Compliance Guide", duration: "12 min", href: "/academy/legal" },
  { title: "Cold Calling Estate Agents — Live Demo", type: "Script Demo", duration: "6 min", href: "/academy/scripts" },
  { title: "7-Day Challenge — Day 1 Orientation", type: "Course Video", duration: "20 min", href: "/academy/courses" },
];

export default function AcademyMediaPage() {
  return (
    <div style={{ background: "#0a0f1e", minHeight: "100vh", color: "white" }}>
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "14px 24px", display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
        <Link href="/academy/dashboard" style={{ color: "#d4af37", fontWeight: 800, fontSize: 16, textDecoration: "none" }}>DSA</Link>
        {NAV.map(([l, h]) => (
          <Link key={h} href={h} style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: 600, textDecoration: "none" }}>{l}</Link>
        ))}
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px" }}>
        <p style={{ fontSize: 11, color: "#d4af37", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Members Only</p>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>Media & Video Hub</h1>
        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, marginBottom: 32 }}>
          Walkthroughs, deal analysis sessions, and podcast episodes — all in one place.
        </p>

        {/* Linked guides */}
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>📚 Written Walkthroughs</h2>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", marginBottom: 20 }}>Step-by-step written guides — video versions coming soon.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 14 }}>
            {RESOURCES.map(r => (
              <Link key={r.title} href={r.href} style={{ textDecoration: "none", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "18px 20px", display: "block", transition: "border-color 0.2s" }}
                className="group hover:border-yellow-500/40">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: "rgba(212,175,55,0.1)", color: "#d4af37" }}>{r.type}</span>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{r.duration}</span>
                </div>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "white", lineHeight: 1.4, marginBottom: 10 }}>{r.title}</h3>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#d4af37" }}>Read guide →</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Coming soon */}
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 6 }}>🎬 Coming Soon</h2>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", marginBottom: 20 }}>Video and audio content is in production. Members will be notified first.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 14 }}>
            {COMING_SOON.map(item => (
              <div key={item.title} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 20, opacity: 0.7 }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{item.icon}</div>
                <h3 style={{ fontSize: 14, fontWeight: 800, marginBottom: 6 }}>{item.title}</h3>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>{item.desc}</p>
                <div style={{ marginTop: 12, display: "inline-block", fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)" }}>Coming Soon</div>
              </div>
            ))}
          </div>
        </div>

        {/* Notify */}
        <div style={{ marginTop: 40, background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: 16, padding: 24, textAlign: "center" }}>
          <p style={{ fontSize: 16, fontWeight: 800, marginBottom: 6 }}>Want to be first to know when video drops?</p>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 16 }}>Drop Nass a message and we&apos;ll notify you as soon as the first episode is live.</p>
          <a href="https://wa.me/447415721628?text=Hi%20Nass%2C%20I%27m%20an%20Academy%20member%20and%20I%27d%20like%20to%20be%20notified%20when%20the%20video%20content%20goes%20live!" target="_blank" rel="noopener noreferrer"
            style={{ display: "inline-block", background: "#25D366", color: "white", fontWeight: 700, fontSize: 13, padding: "10px 24px", borderRadius: 12, textDecoration: "none" }}>
            WhatsApp Nass →
          </a>
        </div>
      </div>
    </div>
  );
}
