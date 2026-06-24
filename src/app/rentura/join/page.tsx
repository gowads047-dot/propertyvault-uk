"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function RenturaJoinPage() {
  const [step, setStep] = useState<"details" | "done">("details");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!name.trim()) { setError("Please enter your full name."); return; }
    if (!phone.trim()) { setError("Please enter your phone number."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { full_name: name.trim(), phone: phone.trim() } },
    });

    if (signUpError) { setError(signUpError.message); setLoading(false); return; }

    // Pre-create subscription row
    if (data.user) {
      await supabase.from("rentura_subscriptions").upsert({
        user_id: data.user.id,
        email: email.trim(),
        name: name.trim(),
        phone: phone.trim(),
        status: "pending",
        created_at: new Date().toISOString(),
      }, { onConflict: "user_id" });
    }

    // If session is available immediately — go straight to Stripe
    if (data.session && data.user) {
      const res = await fetch("/api/rentura/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), userId: data.user.id }),
      });
      const { url } = await res.json();
      if (url) { window.location.href = url; return; }
    }

    setLoading(false);
    setStep("done");
  }

  const inputStyle = {
    width: "100%", background: "rgba(15,27,45,0.04)", border: "1px solid rgba(15,27,45,0.12)",
    borderRadius: 12, padding: "12px 16px", color: "#0f1b2d", fontSize: 14,
    outline: "none", boxSizing: "border-box" as const, fontFamily: "inherit",
  };
  const labelStyle = {
    display: "block" as const, fontSize: 11, fontWeight: 700 as const,
    color: "rgba(15,27,45,0.5)", marginBottom: 6, textTransform: "uppercase" as const, letterSpacing: "0.07em",
  };

  return (
    <div style={{ background: "#f5f3ef", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "var(--font-family-body)" }}>
      <div style={{ width: "100%", maxWidth: 460 }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <Link href="/rentura" style={{ display: "inline-flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <div style={{ width: 36, height: 36, background: "#0f1b2d", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#c9a84c", fontWeight: 900, fontSize: 17 }}>R</span>
            </div>
            <span style={{ fontWeight: 900, fontSize: 18, color: "#0f1b2d", letterSpacing: "-0.02em" }}>Rentura</span>
          </Link>
          <p style={{ fontSize: 12, color: "rgba(15,27,45,0.35)", marginTop: 6 }}>Property Passport Platform</p>
        </div>

        <div style={{ background: "white", borderRadius: 20, padding: "36px 32px", boxShadow: "0 2px 24px rgba(15,27,45,0.06)", border: "1px solid rgba(15,27,45,0.07)" }}>

          {step === "done" ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>✉️</div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f1b2d", marginBottom: 12 }}>Check your inbox</h2>
              <p style={{ fontSize: 14, color: "rgba(15,27,45,0.55)", lineHeight: 1.7, marginBottom: 24 }}>
                We sent a confirmation link to <strong>{email}</strong>.<br />
                Click it — you&apos;ll land straight on the payment page.
              </p>
              <div style={{ background: "rgba(201,168,76,0.07)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 12, padding: "14px 18px", marginBottom: 24, textAlign: "left" }}>
                {[
                  ["1", "Open the email from PropertyVault UK"],
                  ["2", "Click the confirmation link"],
                  ["3", "Add your card — no charge for 30 days, then £9.99/mo"],
                ].map(([n, s]) => (
                  <div key={n} style={{ display: "flex", gap: 12, marginBottom: 10, alignItems: "flex-start" }}>
                    <span style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(201,168,76,0.15)", color: "#c9a84c", fontSize: 11, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{n}</span>
                    <span style={{ fontSize: 13, color: "rgba(15,27,45,0.6)", lineHeight: 1.6 }}>{s}</span>
                  </div>
                ))}
              </div>
              <Link href="/rentura/auth" style={{ display: "inline-block", background: "#0f1b2d", color: "white", fontWeight: 800, fontSize: 14, padding: "12px 28px", borderRadius: 12, textDecoration: "none" }}>
                Already confirmed? Log in →
              </Link>
            </div>
          ) : (
            <>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: "#0f1b2d", marginBottom: 4, textAlign: "center" }}>Start your free 30-day trial</h1>
              <p style={{ fontSize: 13, color: "rgba(15,27,45,0.45)", textAlign: "center", marginBottom: 4 }}>Free for 30 days · Then £9.99/month · Cancel anytime</p>
              <p style={{ fontSize: 12, color: "rgba(15,27,45,0.35)", textAlign: "center", marginBottom: 28 }}>We&apos;ll collect your card details now — no charge for 30 days</p>

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={labelStyle}>Full name</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="e.g. Sarah Thompson" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Email address</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@email.com" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Phone number</label>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} required placeholder="+44 7xxx xxxxxx" style={inputStyle} />
                  <p style={{ fontSize: 11, color: "rgba(15,27,45,0.35)", marginTop: 5 }}>Used for account recovery and important property alerts only.</p>
                </div>
                <div>
                  <label style={labelStyle}>Password</label>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="At least 6 characters" style={inputStyle} />
                </div>

                {error && (
                  <div style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#dc2626" }}>
                    {error}
                  </div>
                )}

                <button type="submit" disabled={loading} style={{ background: loading ? "rgba(15,27,45,0.4)" : "#0f1b2d", color: "white", fontWeight: 800, fontSize: 16, padding: "14px", borderRadius: 12, border: "none", cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit", marginTop: 4 }}>
                  {loading ? "Setting up account…" : "Start free trial — add card →"}
                </button>
              </form>

              <p style={{ fontSize: 12, color: "rgba(15,27,45,0.3)", textAlign: "center", marginTop: 20, lineHeight: 1.7 }}>
                By signing up you agree to our{" "}
                <Link href="/terms" style={{ color: "rgba(15,27,45,0.5)", textDecoration: "underline" }}>Terms</Link>{" "}and{" "}
                <Link href="/privacy" style={{ color: "rgba(15,27,45,0.5)", textDecoration: "underline" }}>Privacy Policy</Link>.
                <br />Your card won&apos;t be charged for 30 days. Cancel anytime before then at no cost.
              </p>
            </>
          )}
        </div>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "rgba(15,27,45,0.4)" }}>
          Already have an account?{" "}
          <Link href="/rentura/auth" style={{ color: "#c9a84c", fontWeight: 700, textDecoration: "none" }}>Log in →</Link>
        </p>
      </div>
    </div>
  );
}
