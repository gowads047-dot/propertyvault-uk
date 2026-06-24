"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

const FEATURES = [
  "Full access to all property investment courses",
  "Deal analysis frameworks & sourcing scripts",
  "HMO, SA, BTL, and R2R strategy modules",
  "Downloadable checklists, contracts & templates",
  "New content added monthly",
  "Certificate of completion for every course",
  "Private community access",
  "Cancel anytime — no lock-in",
];

export default function AcademySubscribePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [checking, setChecking] = useState(false);

  async function startCheckout() {
    if (!user) { router.push("/academy/join"); return; }
    setChecking(true);
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user.email, userId: user.id }),
    });
    const { url, error } = await res.json();
    if (url) window.location.href = url;
    else { alert(error || "Checkout failed. Please try again."); setChecking(false); }
  }

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0a0f1e", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "rgba(255,255,255,0.3)" }}>Loading…</p>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#0a0f1e", fontFamily: "var(--font-family-body)", color: "rgba(255,255,255,0.88)" }}>
      <style>{`body > header, body > footer { display: none !important; }`}</style>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "60px 24px 80px" }}>

        {/* Back */}
        <Link href="/academy" style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", textDecoration: "none", display: "block", marginBottom: 48 }}>← Academy</Link>

        {/* Headline */}
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#d4af37", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 14 }}>PropertyVault Academy</p>
          <h1 style={{ fontSize: "clamp(32px,6vw,54px)", fontWeight: 900, letterSpacing: "-0.03em", fontFamily: "var(--font-family-heading)", lineHeight: 1.1, marginBottom: 16 }}>
            Everything you need to build<br />a property portfolio.
          </h1>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.5)", maxWidth: 480, margin: "0 auto" }}>
            One subscription. Unlimited courses. Practical frameworks from active investors.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }}>

          {/* Features */}
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 20 }}>What&apos;s included</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {FEATURES.map(f => (
                <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <span style={{ color: "#22c55e", fontSize: 15, flexShrink: 0, marginTop: 1 }}>✓</span>
                  <p style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", lineHeight: 1.4 }}>{f}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing card */}
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(212,175,55,0.25)", borderRadius: 20, padding: "36px 32px", position: "sticky", top: 24 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>Monthly membership</p>

            <div style={{ display: "flex", alignItems: "flex-end", gap: 6, marginBottom: 6 }}>
              <span style={{ fontSize: 52, fontWeight: 900, color: "white", lineHeight: 1, letterSpacing: "-0.03em" }}>£14.99</span>
              <span style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>/month</span>
            </div>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginBottom: 32 }}>Cancel anytime. Billed monthly via Stripe.</p>

            <button
              onClick={startCheckout}
              disabled={checking}
              style={{ width: "100%", background: "linear-gradient(135deg,#d4af37,#f0d060)", color: "#0f1b36", fontWeight: 900, fontSize: 16, padding: "16px 0", borderRadius: 12, border: "none", cursor: checking ? "not-allowed" : "pointer", fontFamily: "inherit", opacity: checking ? 0.7 : 1, marginBottom: 16 }}
            >
              {checking ? "Redirecting…" : user ? "Start membership →" : "Join & subscribe →"}
            </button>

            {!user && (
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", textAlign: "center", marginBottom: 16 }}>
                No account yet? You&apos;ll create one during checkout.
              </p>
            )}

            <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                ["🔒", "Secure checkout via Stripe"],
                ["📧", "Instant access on payment"],
                ["↩️", "Cancel anytime from your dashboard"],
              ].map(([icon, text]) => (
                <div key={text} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 14 }}>{icon}</span>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{text}</p>
                </div>
              ))}
            </div>

            {user && (
              <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", textAlign: "center" }}>
                  Signed in as {user.email}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Social proof */}
        <div style={{ marginTop: 64, textAlign: "center" }}>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.25)", marginBottom: 20 }}>Trusted by UK property investors</p>
          <div style={{ display: "flex", justifyContent: "center", gap: 40, flexWrap: "wrap" }}>
            {[["100+", "Investors enrolled"], ["12+", "Courses"], ["4.5h+", "Content per course"]].map(([v, l]) => (
              <div key={l} style={{ textAlign: "center" }}>
                <p style={{ fontSize: 24, fontWeight: 900, color: "#d4af37", lineHeight: 1 }}>{v}</p>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 4 }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
