"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

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
  const [checking, setChecking] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  async function startCheckout() {
    setCheckoutError("");
    setChecking(true);
    // Pass userId if logged in — Stripe collects email itself if not
    const body: Record<string, string> = {};
    if (user?.email) body.email = user.email;
    if (user?.id) body.userId = user.id;

    const res = await fetch("/api/stripe/checkout/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const { url, error } = await res.json();
    if (url) {
      window.location.href = url;
    } else {
      setCheckoutError(error || "Checkout failed — please try again.");
      setChecking(false);
    }
  }

  const buttonDisabled = checking;
  const buttonLabel = checking
    ? "Redirecting to Stripe…"
    : "Start free 30-day trial →";

  return (
    <div style={{ minHeight: "100vh", background: "#0a0f1e", fontFamily: "var(--font-family-body)", color: "rgba(255,255,255,0.88)" }}>
      <style>{`body > header, body > footer { display: none !important; }`}</style>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "60px 24px 80px" }}>

        {/* Back */}
        <Link href="/academy" style={{ fontSize: 13, color: "rgba(255,255,255,0.58)", textDecoration: "none", display: "block", marginBottom: 48 }}>← Academy</Link>

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

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24, alignItems: "start" }}>

          {/* Features */}
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.62)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 20 }}>What&apos;s included</p>
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
            <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.62)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>Monthly membership</p>

            <div style={{ display: "flex", alignItems: "flex-end", gap: 6, marginBottom: 6 }}>
              <span style={{ fontSize: 52, fontWeight: 900, color: "white", lineHeight: 1, letterSpacing: "-0.03em" }}>£14.99</span>
              <span style={{ fontSize: 14, color: "rgba(255,255,255,0.58)", marginBottom: 8 }}>/month</span>
            </div>
            <p style={{ fontSize: 12, color: "rgba(255,255,255,0.58)", marginBottom: 32 }}>30 days free · Card required · Cancel before trial ends = no charge</p>

            {checkoutError && (
              <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#f87171", marginBottom: 16 }}>
                {checkoutError}
              </div>
            )}

            <button
              onClick={startCheckout}
              disabled={buttonDisabled}
              style={{ width: "100%", background: buttonDisabled ? "rgba(212,175,55,0.5)" : "linear-gradient(135deg,#d4af37,#f0d060)", color: "#0f1b36", fontWeight: 900, fontSize: 16, padding: "16px 0", borderRadius: 12, border: "none", cursor: buttonDisabled ? "not-allowed" : "pointer", fontFamily: "inherit", marginBottom: 16, transition: "opacity 0.2s" }}
            >
              {buttonLabel}
            </button>

            {user ? (
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.62)", textAlign: "center", marginBottom: 16 }}>
                Signed in as <strong style={{ color: "rgba(255,255,255,0.5)" }}>{user.email}</strong>
              </p>
            ) : !loading && (
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.58)", textAlign: "center", marginBottom: 16 }}>
                Stripe will ask for your email and card details.
              </p>
            )}

            <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                ["🔒", "Secure checkout via Stripe"],
                ["⚡", "Instant access — 30 days free, then £14.99/mo"],
                ["↩️", "Cancel anytime from your dashboard"],
              ].map(([icon, text]) => (
                <div key={text} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 14 }}>{icon}</span>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.58)" }}>{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Social proof */}
        <div style={{ marginTop: 64, textAlign: "center" }}>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.25)", marginBottom: 20 }}>Trusted by UK property investors</p>
          <div style={{ display: "flex", justifyContent: "center", gap: 40, flexWrap: "wrap" }}>
            {[["100+", "Investors enrolled"], ["12+", "Courses"], ["4.5h+", "Content per course"]].map(([v, l]) => (
              <div key={l} style={{ textAlign: "center" }}>
                <p style={{ fontSize: 24, fontWeight: 900, color: "#d4af37", lineHeight: 1 }}>{v}</p>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.58)", marginTop: 4 }}>{l}</p>
              </div>
            ))}
          </div>
        </div>

        <p style={{ textAlign: "center", marginTop: 40, fontSize: 13, color: "rgba(255,255,255,0.25)" }}>
          Already have an account?{" "}
          <Link href="/academy/auth" style={{ color: "#d4af37", textDecoration: "none", fontWeight: 700 }}>Log in →</Link>
        </p>
      </div>
    </div>
  );
}
