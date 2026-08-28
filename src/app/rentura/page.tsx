import Link from "next/link";

const FEATURES = [
  { icon: "🏠", title: "Property Passport", desc: "Every property gets its own digital passport — EPC, compliance, documents, tenancy history, and maintenance all in one place." },
  { icon: "📊", title: "Portfolio Dashboard", desc: "See your full portfolio at a glance. Net rent, mortgage balances, yield, occupancy, and upcoming renewals — live." },
  { icon: "👤", title: "Tenant Management", desc: "Manage check-ins, check-outs, rent collection, references, and communication from one screen." },
  { icon: "🔧", title: "Maintenance Tracker", desc: "Log jobs, assign contractors, track costs, and get reminded before things become emergencies." },
  { icon: "📋", title: "Compliance Hub", desc: "Gas, electric, EPC, HMO licensing, and right-to-rent — never miss a renewal with automated alerts." },
  { icon: "💰", title: "Financial Centre", desc: "P&L per property, mortgage tracker, tax summaries, and cashflow projections — accountant-ready exports." },
  { icon: "📄", title: "Documents Vault", desc: "Store tenancy agreements, ASTs, inventories, inspection reports, and invoices — all searchable." },
  { icon: "🤖", title: "AI Property Assistant", desc: "Ask anything about your portfolio. Log maintenance, record payments, and get answers — in plain English." },
];

const INCLUDED = [
  "Unlimited properties", "Property Passport for every unit", "Tenant portal & comms",
  "Compliance calendar with alerts", "Mortgage & remortgage tracker", "Maintenance job tracker",
  "Financial reports & tax summaries", "Document storage vault", "AI assistant — 24/7",
  "Mobile-friendly dashboard", "CSV exports", "Cancel anytime",
];

const COMPARE = [
  { feature: "All properties in one view", spreadsheet: "Manual, error-prone", other: "Partial", rentura: "Live portfolio dashboard" },
  { feature: "Compliance alerts", spreadsheet: "None", other: "Basic", rentura: "60-day advance alerts" },
  { feature: "Property Passport", spreadsheet: "None", other: "Not standard", rentura: "Digital ID per property" },
  { feature: "Maintenance tracking", spreadsheet: "None", other: "Varies", rentura: "With photos & costs" },
  { feature: "Accountant-ready exports", spreadsheet: "Manual formatting", other: "Basic CSV", rentura: "P&L per property" },
  { feature: "AI property assistant", spreadsheet: "None", other: "Varies by provider", rentura: "Answers any question 24/7" },
  { feature: "Monthly cost", spreadsheet: "Free (+ your time)", other: "£20–£80/mo", rentura: "£9.99/mo, cancel anytime" },
];

export default function RenturaPage() {
  return (
    <div style={{ background: "#f5f3ef", minHeight: "100vh", fontFamily: "var(--font-family-body)", color: "#0f1b2d" }}>

      {/* NAV */}
      <nav style={{ background: "rgba(245,243,239,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(15,27,45,0.08)", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64, position: "sticky", top: 0, zIndex: 50 }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{ width: 32, height: 32, background: "#0f1b2d", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "var(--gold-ink)", fontWeight: 900, fontSize: 14 }}>R</span>
          </div>
          <span style={{ fontWeight: 900, fontSize: 16, color: "#0f1b2d", letterSpacing: "-0.02em" }}>Rentura</span>
        </Link>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Link href="/rentura/auth" style={{ fontSize: 13, fontWeight: 600, color: "rgba(15,27,45,0.66)", textDecoration: "none", padding: "8px 14px" }}>Log in</Link>
          <Link href="/rentura/join" style={{ background: "#0f1b2d", color: "white", fontWeight: 700, fontSize: 13, padding: "9px 22px", borderRadius: 10, textDecoration: "none" }}>Start free trial →</Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ maxWidth: 900, margin: "0 auto", padding: "88px 24px 72px", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.3)", borderRadius: 20, padding: "5px 16px", marginBottom: 28 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: "var(--gold-ink)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Now open — Early Access</span>
        </div>
        <h1 style={{ fontSize: "clamp(34px,6vw,62px)", fontWeight: 900, lineHeight: 1.07, letterSpacing: "-0.03em", fontFamily: "var(--font-family-heading)", marginBottom: 20, color: "#0f1b2d" }}>
          The operating system<br />for UK landlords.
        </h1>
        <p style={{ fontSize: "clamp(15px,2vw,18px)", color: "rgba(15,27,45,0.55)", maxWidth: 520, margin: "0 auto 36px", lineHeight: 1.7 }}>
          Rentura replaces your spreadsheets, folders, and sticky notes with one smart platform. Manage your full portfolio — properties, tenants, compliance, finances, and documents — from a single dashboard.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/rentura/join" style={{ background: "#0f1b2d", color: "white", fontWeight: 800, fontSize: 16, padding: "15px 38px", borderRadius: 12, textDecoration: "none" }}>
            Start free 30-day trial →
          </Link>
          <Link href="/rentura/auth" style={{ background: "white", color: "#0f1b2d", fontWeight: 700, fontSize: 15, padding: "15px 28px", borderRadius: 12, textDecoration: "none", border: "1px solid rgba(15,27,45,0.12)" }}>
            Already a member? Log in
          </Link>
        </div>
        <p style={{ fontSize: 12, color: "rgba(15,27,45,0.35)", marginTop: 14 }}>Free for 30 days · Then £9.99/mo · Cancel before trial ends and pay nothing</p>
      </section>

      {/* STATS */}
      <section style={{ background: "#0f1b2d", padding: "40px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", justifyContent: "center", gap: 0, flexWrap: "wrap" }}>
          {[["8", "Core modules"], ["∞", "Properties"], ["1", "Dashboard"], ["£9.99", "Per month"]].map(([v, l], i, arr) => (
            <div key={l} style={{ textAlign: "center", padding: "0 40px", borderRight: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none" }}>
              <div style={{ fontSize: 30, fontWeight: 900, color: "var(--gold-ink)", fontFamily: "var(--font-family-heading)" }}>{v}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.58)", marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SOCIAL PROOF — LANDLORD COUNTER + TRUST BADGES */}
      <section style={{ background: "#f5f3ef", padding: "52px 24px", borderBottom: "1px solid rgba(15,27,45,0.07)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16 }}>
            {[
              { icon: "🔒", label: "SSL Encrypted", sub: "All data in transit" },
              { icon: "🇬🇧", label: "UK Data Storage", sub: "Hosted in London (eu-west-2)" },
              { icon: "🏦", label: "Payments processed by Stripe", sub: "Stripe is PCI DSS Level 1 certified" },
              { icon: "🗑️", label: "Right to erasure", sub: "Delete your data anytime" },
            ].map((b) => (
              <div key={b.label} style={{ display: "flex", alignItems: "center", gap: 10, background: "white", border: "1px solid rgba(15,27,45,0.08)", borderRadius: 12, padding: "10px 16px" }}>
                <span style={{ fontSize: 20 }}>{b.icon}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#0f1b2d" }}>{b.label}</div>
                  <div style={{ fontSize: 11, color: "rgba(15,27,45,0.66)" }}>{b.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* COMPARISON TABLE */}
      <section style={{ background: "#f5f3ef", padding: "72px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "var(--gold-ink)", letterSpacing: "0.15em", textTransform: "uppercase", textAlign: "center", marginBottom: 12 }}>How we compare</p>
          <h2 style={{ fontSize: "clamp(24px,4vw,38px)", fontWeight: 900, letterSpacing: "-0.02em", textAlign: "center", marginBottom: 44, fontFamily: "var(--font-family-heading)" }}>Rentura vs the alternatives</h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ background: "#0f1b2d" }}>
                  <th style={{ padding: "14px 16px", textAlign: "left", color: "rgba(255,255,255,0.6)", fontWeight: 600, fontSize: 12 }}>Feature</th>
                  <th style={{ padding: "14px 16px", textAlign: "center", color: "rgba(255,255,255,0.6)", fontWeight: 600, fontSize: 12 }}>Spreadsheets</th>
                  <th style={{ padding: "14px 16px", textAlign: "center", color: "rgba(255,255,255,0.6)", fontWeight: 600, fontSize: 12 }}>Other apps</th>
                  <th style={{ padding: "14px 16px", textAlign: "center", color: "var(--gold-ink)", fontWeight: 800, fontSize: 12 }}>Rentura</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE.map((row, i) => (
                  <tr key={row.feature} style={{ background: i % 2 === 0 ? "white" : "#f5f3ef", borderBottom: "1px solid rgba(15,27,45,0.05)" }}>
                    <td style={{ padding: "14px 16px", fontWeight: 600, color: "#0f1b2d" }}>{row.feature}</td>
                    <td style={{ padding: "14px 16px", textAlign: "center", color: "rgba(15,27,45,0.66)", fontSize: 13 }}>{row.spreadsheet}</td>
                    <td style={{ padding: "14px 16px", textAlign: "center", color: "rgba(15,27,45,0.66)", fontSize: 13 }}>{row.other}</td>
                    <td style={{ padding: "14px 16px", textAlign: "center", color: "#0f6e30", fontWeight: 700, fontSize: 13 }}>{row.rentura}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ textAlign: "center", marginTop: 36 }}>
            <Link href="/rentura/join" style={{ display: "inline-block", background: "#0f1b2d", color: "white", fontWeight: 800, fontSize: 15, padding: "14px 36px", borderRadius: 12, textDecoration: "none" }}>
              Start free 30-day trial →
            </Link>
          </div>
        </div>
      </section>

      {/* PROPERTY PASSPORT HIGHLIGHT */}
      <section style={{ background: "white", padding: "72px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))", gap: 56, alignItems: "center" }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: "var(--gold-ink)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 14 }}>Flagship Feature</p>
              <h2 style={{ fontSize: "clamp(26px,4vw,40px)", fontWeight: 900, letterSpacing: "-0.02em", fontFamily: "var(--font-family-heading)", lineHeight: 1.15, marginBottom: 16 }}>
                The Property Passport
              </h2>
              <p style={{ fontSize: 15, color: "rgba(15,27,45,0.55)", lineHeight: 1.75, marginBottom: 24 }}>
                Every property in your portfolio gets its own digital ID card. EPC rating, compliance certificates, tenancy history, maintenance log, mortgage details, and key documents — all in one place, permanently.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {["EPC & compliance expiry tracking", "Tenancy history & AST storage", "Maintenance log with photos", "Mortgage & remortgage records", "Shareable with agents, accountants"].map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ width: 18, height: 18, borderRadius: "50%", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, flexShrink: 0 }}>✓</span>
                    <span style={{ fontSize: 14, color: "rgba(15,27,45,0.7)" }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: "#0f1b2d", borderRadius: 20, padding: 28, display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>Property Passport</span>
                <span style={{ background: "rgba(34,197,94,0.15)", color: "#15803d", fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 6 }}>COMPLIANT</span>
              </div>
              <h3 style={{ color: "white", fontWeight: 800, fontSize: 17 }}>14 Maple Street, Leeds LS1</h3>
              {[["Type", "HMO — 4 bed"], ["Monthly Rent", "£2,600"], ["EPC Rating", "C — expires Jun 2027"], ["Gas Safety", "✓ Valid to Dec 2025"], ["Tenants", "3 active"], ["Mortgage", "£187,000 @ 4.2% — NatWest"]].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: 8 }}>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.58)" }}>{k}</span>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section style={{ padding: "72px 24px", background: "#f5f3ef" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "var(--gold-ink)", letterSpacing: "0.15em", textTransform: "uppercase", textAlign: "center", marginBottom: 12 }}>Everything included</p>
          <h2 style={{ fontSize: "clamp(24px,4vw,38px)", fontWeight: 900, letterSpacing: "-0.02em", textAlign: "center", marginBottom: 8, fontFamily: "var(--font-family-heading)" }}>One platform. Every tool you need.</h2>
          <p style={{ fontSize: 14, color: "rgba(15,27,45,0.66)", textAlign: "center", marginBottom: 48 }}>No add-ons. No tiers. Everything in the list below is included from day one.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 16 }}>
            {FEATURES.map(f => (
              <div key={f.title} style={{ background: "white", borderRadius: 16, padding: "22px 22px", border: "1px solid rgba(15,27,45,0.07)" }}>
                <div style={{ fontSize: 26, marginBottom: 10 }}>{f.icon}</div>
                <h3 style={{ fontWeight: 800, fontSize: 15, marginBottom: 6, color: "#0f1b2d" }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: "rgba(15,27,45,0.66)", lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section style={{ background: "#0f1b2d", padding: "72px 24px" }}>
        <div style={{ maxWidth: 520, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "var(--gold-ink)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 14 }}>Simple pricing</p>
          <h2 style={{ fontSize: "clamp(26px,4vw,42px)", fontWeight: 900, color: "white", marginBottom: 10, fontFamily: "var(--font-family-heading)" }}>One price. Everything included.</h2>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.58)", marginBottom: 44 }}>No property limits. No feature tiers. No surprises.</p>

          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(201,168,76,0.25)", borderRadius: 20, padding: "40px 36px" }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.62)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>Monthly membership</p>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 6, justifyContent: "center", marginBottom: 6 }}>
              <span style={{ fontSize: 60, fontWeight: 900, color: "white", lineHeight: 1, letterSpacing: "-0.03em" }}>£9.99</span>
              <span style={{ fontSize: 15, color: "rgba(255,255,255,0.58)", marginBottom: 10 }}>/month</span>
            </div>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.62)", marginBottom: 32 }}>30 days free · Card required · Cancel before trial ends = no charge</p>

            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 32, textAlign: "left" }}>
              {INCLUDED.map(item => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ color: "#4ade80", fontSize: 14, flexShrink: 0 }}>✓</span>
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.65)" }}>{item}</span>
                </div>
              ))}
            </div>

            <Link href="/rentura/join" style={{ display: "block", background: "linear-gradient(135deg,#c9a84c,#e8c96d)", color: "#0f1b2d", fontWeight: 900, fontSize: 16, padding: "16px 0", borderRadius: 12, textDecoration: "none", textAlign: "center" }}>
              Start free 30-day trial →
            </Link>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", marginTop: 14 }}>Already a member? <Link href="/rentura/auth" style={{ color: "var(--gold-ink)", textDecoration: "none" }}>Log in here →</Link></p>
          </div>
        </div>
      </section>

      {/* CANCELLATION POLICY */}
      <section style={{ background: "#f5f3ef", padding: "56px 24px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 10, color: "#0f1b2d" }}>Cancel anytime. Your data stays safe.</h3>
          <p style={{ fontSize: 14, color: "rgba(15,27,45,0.55)", lineHeight: 1.8, maxWidth: 520, margin: "0 auto" }}>
            If you cancel, you keep full access until the end of your billing period — plus <strong>30 days free</strong> after that. We&apos;ll email you weekly during that window to remind you to download your data or resubscribe. After 30 days, your account is closed.
          </p>
        </div>
      </section>

      {/* THE STORY */}
      <section style={{ background: "white", padding: "80px 24px", borderTop: "1px solid rgba(15,27,45,0.07)" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>

          {/* Eyebrow */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.25)", borderRadius: 20, padding: "6px 16px", marginBottom: 32 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#c9a84c" }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: "var(--gold-ink)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Why we built Rentura</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 56, alignItems: "start" }}>

            {/* Story text */}
            <div>
              <h2 style={{ fontFamily: "var(--font-family-heading)", fontSize: "clamp(26px, 3.5vw, 38px)", fontWeight: 900, color: "#0f1b2d", lineHeight: 1.15, marginBottom: 28, letterSpacing: "-0.025em" }}>
                Most landlords are managing their portfolio across four places at once.
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 18, fontSize: 15, color: "rgba(15,27,45,0.65)", lineHeight: 1.8 }}>
                <p>
                  A spreadsheet for the numbers. A folder for the documents. A phone calendar for the renewals. And their own memory for everything else. This system works — until it doesn&apos;t.
                </p>
                <p>
                  A missed EPC renewal. A deposit not protected on time. A tenant move-out with no proper inventory. The cost of small oversights in property management is disproportionately high — both financially and legally.
                </p>
                <p>
                  Rentura was built to be the one place everything lives. Every property gets its own <strong style={{ color: "#0f1b2d" }}>Property Passport</strong> — compliance documents, tenancy history, maintenance records, EPC status, all searchable and shareable. The compliance calendar sends 60-day alerts before anything expires. The AI assistant answers questions about your own portfolio in plain English.
                </p>
                <p>
                  It&apos;s not a spreadsheet replacement. It&apos;s the operating system for landlords who are done running a business on sticky notes.
                </p>
              </div>
            </div>

            {/* 4 problem/solution cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { before: "Compliance renewals missed", after: "60-day alerts before anything expires" },
                { before: "Documents scattered across folders", after: "One searchable vault per property" },
                { before: "Portfolio numbers spread across spreadsheets", after: "Live P&L per property, one dashboard" },
                { before: "Maintenance logged in WhatsApp", after: "Jobs tracked with costs, photos & status" },
              ].map(item => (
                <div key={item.before} style={{ background: "#f5f3ef", borderRadius: 14, padding: "18px 20px", border: "1px solid rgba(15,27,45,0.06)" }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 13, color: "#b91c1c", marginTop: 2, flexShrink: 0 }}>✗</span>
                    <span style={{ fontSize: 13, color: "rgba(15,27,45,0.66)", textDecoration: "line-through" }}>{item.before}</span>
                  </div>
                  <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginTop: 6 }}>
                    <span style={{ fontSize: 13, color: "#15803d", marginTop: 2, flexShrink: 0 }}>✓</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#0f1b2d" }}>{item.after}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section style={{ background: "#0f1b2d", padding: "64px 24px", textAlign: "center" }}>
        <h2 style={{ fontSize: "clamp(24px,4vw,38px)", fontWeight: 900, color: "white", marginBottom: 12, fontFamily: "var(--font-family-heading)" }}>Ready to organise your portfolio?</h2>
        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.62)", marginBottom: 32 }}>Join UK landlords already using Rentura to manage smarter.</p>
        <Link href="/rentura/join" style={{ display: "inline-flex", background: "linear-gradient(135deg,#c9a84c,#e8c96d)", color: "#0f1b2d", fontWeight: 900, fontSize: 16, padding: "15px 42px", borderRadius: 12, textDecoration: "none" }}>
          Start free 30-day trial →
        </Link>
      </section>

    </div>
  );
}
