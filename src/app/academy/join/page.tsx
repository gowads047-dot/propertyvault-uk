"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function AcademyJoinPage() {
  const router = useRouter();
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

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { full_name: name.trim() } },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    // Add to academy_members table
    if (data.user) {
      await supabase.from("academy_members").upsert({
        id: data.user.id,
        email: email.trim(),
        name: name.trim(),
        status: "active",
        joined_at: new Date().toISOString(),
      });
    }

    setLoading(false);
    setDone(true);
  }

  return (
    <div style={{ background: "#0a0f1e", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", fontFamily: "var(--font-family-body)" }}>
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
              <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: "white", marginBottom: 10 }}>You&apos;re in.</h2>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", lineHeight: 1.7, marginBottom: 24 }}>
                Check your email to confirm your account, then log in to access the Academy.
              </p>
              <Link href="/academy/dashboard" style={{ display: "inline-block", background: "linear-gradient(135deg,#d4af37,#f0d060)", color: "#0a0f1e", fontWeight: 800, fontSize: 15, padding: "13px 32px", borderRadius: 12, textDecoration: "none" }}>
                Go to Dashboard →
              </Link>
            </div>
          ) : (
            <>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: "white", marginBottom: 6, textAlign: "center" }}>
                Join the Academy
              </h1>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", textAlign: "center", marginBottom: 28 }}>
                Create your free account to get started.
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
                  {loading ? "Creating account…" : "Create Account →"}
                </button>
              </form>

              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", textAlign: "center", marginTop: 20, lineHeight: 1.7 }}>
                By signing up you agree to our{" "}
                <Link href="/terms" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "underline" }}>Terms</Link>
                {" "}and{" "}
                <Link href="/privacy" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "underline" }}>Privacy Policy</Link>.
                <br />Educational platform only — not financial advice.
              </p>
            </>
          )}
        </div>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "rgba(255,255,255,0.3)" }}>
          Already have an account?{" "}
          <Link href="/makan/auth" style={{ color: "#d4af37", fontWeight: 700, textDecoration: "none" }}>Log in →</Link>
        </p>

      </div>
    </div>
  );
}
