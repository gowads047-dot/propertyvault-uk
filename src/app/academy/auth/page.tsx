"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function AcademyAuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [mode, setMode] = useState<"login" | "reset">("login");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }
    // Check if they have an active subscription — if not, send to checkout
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: member } = await supabase.from("academy_members").select("status, stripe_subscription_id").eq("user_id", user.id).maybeSingle();
      if (!member?.stripe_subscription_id || member?.status !== "active") {
        router.push("/academy/subscribe");
        return;
      }
    }
    router.push("/academy/dashboard");
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/academy/auth` });
    setResetSent(true);
    setLoading(false);
  }

  return (
    <div style={{ background: "#0a0f1e", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", fontFamily: "var(--font-family-body)" }}>
      <style>{`body > header, body > footer { display: none !important; }`}</style>
      <div style={{ width: "100%", maxWidth: 420 }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Link href="/academy" style={{ textDecoration: "none" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg,#d4af37,#f0d060)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>🎓</div>
              <span style={{ fontSize: 17, fontWeight: 900, color: "white", letterSpacing: "-0.02em" }}>PropertyVault Academy</span>
            </div>
          </Link>
        </div>

        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "36px 32px" }}>

          {resetSent ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 40, marginBottom: 14 }}>✉️</div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: "white", marginBottom: 10 }}>Check your inbox</h2>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>We&apos;ve sent a password reset link to <strong style={{ color: "rgba(255,255,255,0.75)" }}>{email}</strong>.</p>
              <button onClick={() => { setMode("login"); setResetSent(false); }} style={{ marginTop: 24, fontSize: 13, color: "#d4af37", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", textDecoration: "underline" }}>Back to login</button>
            </div>
          ) : mode === "reset" ? (
            <>
              <h1 style={{ fontSize: 20, fontWeight: 800, color: "white", marginBottom: 6, textAlign: "center" }}>Reset password</h1>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", textAlign: "center", marginBottom: 24 }}>Enter your email and we&apos;ll send a reset link.</p>
              <form onSubmit={handleReset} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@email.com"
                  style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "12px 16px", color: "white", fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
                <button type="submit" disabled={loading}
                  style={{ background: "linear-gradient(135deg,#d4af37,#f0d060)", color: "#0a0f1e", fontWeight: 800, fontSize: 15, padding: "13px", borderRadius: 12, border: "none", cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit", opacity: loading ? 0.6 : 1 }}>
                  {loading ? "Sending…" : "Send reset link"}
                </button>
                <button type="button" onClick={() => setMode("login")} style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
                  ← Back to login
                </button>
              </form>
            </>
          ) : (
            <>
              <h1 style={{ fontSize: 20, fontWeight: 800, color: "white", marginBottom: 6, textAlign: "center" }}>Sign in to Academy</h1>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", textAlign: "center", marginBottom: 24 }}>Access your courses and dashboard.</p>
              <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.5)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@email.com"
                    style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "12px 16px", color: "white", fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.5)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>Password</label>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Your password"
                    style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "12px 16px", color: "white", fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
                </div>
                {error && <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#f87171" }}>{error}</div>}
                <button type="submit" disabled={loading}
                  style={{ background: loading ? "rgba(212,175,55,0.5)" : "linear-gradient(135deg,#d4af37,#f0d060)", color: "#0a0f1e", fontWeight: 800, fontSize: 16, padding: "14px", borderRadius: 12, border: "none", cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit" }}>
                  {loading ? "Signing in…" : "Sign in →"}
                </button>
                <button type="button" onClick={() => setMode("reset")} style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", textAlign: "center" }}>
                  Forgot password?
                </button>
              </form>
            </>
          )}
        </div>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "rgba(255,255,255,0.3)" }}>
          No account?{" "}
          <Link href="/academy/subscribe" style={{ color: "#d4af37", fontWeight: 700, textDecoration: "none" }}>Join for £14.99/mo →</Link>
        </p>
      </div>
    </div>
  );
}
