"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function AcademyJoinPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!name.trim()) { setError("Please enter your full name."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);

    const origin = typeof window !== "undefined" ? window.location.origin : "https://propertyvaultuk.co.uk";

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { full_name: name.trim() },
        // If email confirmation is required, clicking the link lands them on the checkout page already logged in
        emailRedirectTo: `${origin}/academy/subscribe`,
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    // Pre-create the member row (status will be updated by Stripe webhook after payment)
    if (data.user) {
      await supabase.from("academy_members").upsert({
        user_id: data.user.id,
        email: email.trim(),
        name: name.trim(),
        status: "pending",
        joined_at: new Date().toISOString(),
      }, { onConflict: "user_id" });
    }

    // If session is available immediately (email confirmation is disabled in Supabase),
    // redirect straight to Stripe checkout — payment happens before they can access anything
    if (data.session && data.user) {
      const checkoutRes = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), userId: data.user.id }),
      });
      const { url } = await checkoutRes.json();
      if (url) {
        window.location.href = url;
        return;
      }
    }

    // Email confirmation required — user must confirm then the redirect takes them to /academy/subscribe
    setLoading(false);
    setDone(true);
  }

  return (
    <div style={{ background: "#0a0f1e", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", fontFamily: "var(--font-family-body)" }}>
      <style>{`body > header, body > footer { display: none !important; }`}</style>
      <div style={{ width: "100%", maxWidth: 440 }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <Link href="/academy" style={{ textDecoration: "none" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#d4af37,#f0d060)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🎓</div>
              <span style={{ fontSize: 18, fontWeight: 900, color: "white", letterSpacing: "-0.02em" }}>Deal Sourcing Academy</span>
            </div>
          </Link>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)" }}>by PropertyVault UK</p>
        </div>

        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "36px 32px" }}>

          {done ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>✉️</div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: "white", marginBottom: 14 }}>Check your inbox.</h2>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", lineHeight: 1.8, marginBottom: 24 }}>
                We&apos;ve sent a confirmation link to <strong style={{ color: "rgba(255,255,255,0.8)" }}>{email}</strong>.<br />
                Click the link — it&apos;ll take you directly to the payment page.
              </p>
              <div style={{ background: "rgba(212,175,55,0.07)", border: "1px solid rgba(212,175,55,0.18)", borderRadius: 12, padding: "14px 18px", marginBottom: 24, textAlign: "left" }}>
                {[
                  ["1", "Open the confirmation email from PropertyVault UK"],
                  ["2", "Click the link — you'll land on the payment page"],
                  ["3", "Add your card — 30 days free, then £14.99/mo"],
                ].map(([n, step]) => (
                  <div key={n} style={{ display: "flex", gap: 12, marginBottom: 10, alignItems: "flex-start" }}>
                    <span style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(212,175,55,0.2)", color: "#d4af37", fontSize: 11, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{n}</span>
                    <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>{step}</span>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", marginBottom: 18 }}>
                Can&apos;t find it? Check your spam folder or wait 2 minutes.
              </p>
              <Link href="/academy/auth" style={{ display: "inline-block", background: "linear-gradient(135deg,#d4af37,#f0d060)", color: "#0a0f1e", fontWeight: 800, fontSize: 14, padding: "12px 28px", borderRadius: 12, textDecoration: "none" }}>
                Already confirmed? Log in →
              </Link>
            </div>
          ) : (
            <>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: "white", marginBottom: 6, textAlign: "center" }}>
                Start your free 30-day trial
              </h1>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", textAlign: "center", marginBottom: 4 }}>
                Free for 30 days · Then £14.99/month · Cancel anytime
              </p>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", textAlign: "center", marginBottom: 24 }}>
                We&apos;ll collect your card details — no charge for 30 days
              </p>

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.6)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Full name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    placeholder="e.g. James Thompson"
                    style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "12px 16px", color: "white", fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.6)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Email address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    placeholder="you@email.com"
                    style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "12px 16px", color: "white", fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.6)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    placeholder="At least 6 characters"
                    style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "12px 16px", color: "white", fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }}
                  />
                </div>

                {error && (
                  <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#f87171" }}>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  style={{ background: loading ? "rgba(212,175,55,0.5)" : "linear-gradient(135deg,#d4af37,#f0d060)", color: "#0a0f1e", fontWeight: 800, fontSize: 16, padding: "14px", borderRadius: 12, border: "none", cursor: loading ? "not-allowed" : "pointer", marginTop: 4, fontFamily: "inherit" }}
                >
                  {loading ? "Setting up account…" : "Start free trial — add card →"}
                </button>
              </form>

              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", textAlign: "center", marginTop: 20, lineHeight: 1.7 }}>
                By signing up you agree to our{" "}
                <Link href="/terms" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "underline" }}>Terms</Link>
                {" "}and{" "}
                <Link href="/privacy" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "underline" }}>Privacy Policy</Link>.
                <br />Educational platform only — not financial advice.
                <br />All payments are non-refundable. Cancel anytime.
              </p>
            </>
          )}
        </div>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "rgba(255,255,255,0.3)" }}>
          Already have an account?{" "}
          <Link href="/academy/auth" style={{ color: "#d4af37", fontWeight: 700, textDecoration: "none" }}>Log in →</Link>
        </p>

      </div>
    </div>
  );
}
