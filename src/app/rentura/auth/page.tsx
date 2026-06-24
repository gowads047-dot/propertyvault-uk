"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

function RenturaAuthForm() {
  const { user, signIn, signUp, loading } = useAuth();
  const router = useRouter();
  const [next, setNext] = useState("/rentura/dashboard");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setNext(params.get("next") ?? "/rentura/dashboard");
  }, []);

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) router.replace(next);
  }, [user, loading, router, next]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    if (mode === "signin") {
      const { error: err } = await signIn(email, password);
      if (err) { setError(err); setSubmitting(false); return; }
      router.replace(next);
    } else {
      if (!name.trim()) { setError("Please enter your name."); setSubmitting(false); return; }
      if (password.length < 8) { setError("Password must be at least 8 characters."); setSubmitting(false); return; }
      const { error: err } = await signUp(email, password, name.trim(), "landlord");
      if (err) { setError(err); setSubmitting(false); return; }
      setSuccess("Account created — check your email to confirm, then sign in.");
      setMode("signin");
      setPassword("");
    }
    setSubmitting(false);
  }

  const BG = "#eceae2";
  const INK = "#111111";
  const INK2 = "rgba(17,17,17,0.5)";
  const BORDER = "rgba(17,17,17,0.11)";
  const CTA = "#0f1728";

  const inputStyle = {
    width: "100%",
    boxSizing: "border-box" as const,
    padding: "13px 16px",
    fontSize: 15,
    color: INK,
    border: `1px solid ${BORDER}`,
    borderRadius: 10,
    outline: "none",
    background: "white",
    fontFamily: "inherit",
  };

  const labelStyle = {
    display: "block",
    fontSize: 11,
    fontWeight: 700 as const,
    color: "rgba(17,17,17,0.42)",
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
    marginBottom: 7,
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: BG, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: INK2, fontSize: 14 }}>Loading…</p>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "var(--font-family-body)", background: BG, color: INK, minHeight: "100vh", display: "flex", flexDirection: "column" }}>

      {/* Nav */}
      <nav style={{ padding: "18px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/rentura" style={{ textDecoration: "none" }}>
          <span style={{ fontSize: 18, fontWeight: 900, letterSpacing: "-0.03em", color: INK, fontFamily: "var(--font-family-heading)" }}>Rentura</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: INK2, marginLeft: 8 }}>by PropertyVault</span>
        </Link>
        <Link href="/" style={{ fontSize: 13, color: INK2, textDecoration: "none", fontWeight: 500 }}>← PropertyVault</Link>
      </nav>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <div style={{ width: "100%", maxWidth: 420 }}>

          {/* Wordmark */}
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ width: 52, height: 52, background: CTA, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 22, fontWeight: 900, color: "white", fontFamily: "var(--font-family-heading)" }}>
              R
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 900, letterSpacing: "-0.03em", marginBottom: 6, fontFamily: "var(--font-family-heading)" }}>
              {mode === "signin" ? "Welcome back." : "Start your Property Passport."}
            </h1>
            <p style={{ fontSize: 14, color: INK2, lineHeight: 1.5 }}>
              {mode === "signin"
                ? "Sign in to your Rentura account."
                : "Every property. One living record. Trusted."}
            </p>
          </div>

          {/* Mode toggle */}
          <div style={{ display: "flex", background: "rgba(17,17,17,0.06)", borderRadius: 10, padding: 4, marginBottom: 28 }}>
            {(["signin", "signup"] as const).map(m => (
              <button key={m} onClick={() => { setMode(m); setError(null); setSuccess(null); }}
                style={{ flex: 1, padding: "9px 0", fontSize: 13, fontWeight: 700, borderRadius: 8, border: "none", cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s", background: mode === m ? "white" : "transparent", color: mode === m ? INK : INK2, boxShadow: mode === m ? "0 1px 4px rgba(0,0,0,0.1)" : "none" }}>
                {m === "signin" ? "Sign in" : "Create account"}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {mode === "signup" && (
              <div>
                <label style={labelStyle}>Your name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Nass" autoComplete="name" required style={inputStyle} />
              </div>
            )}
            <div>
              <label style={labelStyle}>Email address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" autoComplete="email" required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder={mode === "signup" ? "At least 8 characters" : "••••••••"} autoComplete={mode === "signin" ? "current-password" : "new-password"} required style={inputStyle} />
            </div>

            {error && (
              <div style={{ background: "rgba(220,38,38,0.07)", border: "1px solid rgba(220,38,38,0.2)", borderRadius: 9, padding: "11px 14px", color: "#dc2626", fontSize: 13, fontWeight: 600 }}>
                {error}
              </div>
            )}

            {success && (
              <div style={{ background: "rgba(22,163,74,0.07)", border: "1px solid rgba(22,163,74,0.2)", borderRadius: 9, padding: "11px 14px", color: "#16a34a", fontSize: 13, fontWeight: 600 }}>
                {success}
              </div>
            )}

            <button type="submit" disabled={submitting}
              style={{ background: CTA, color: "white", fontWeight: 800, fontSize: 16, padding: "15px 0", borderRadius: 11, border: "none", cursor: "pointer", fontFamily: "inherit", letterSpacing: "-0.02em", opacity: submitting ? 0.6 : 1, transition: "opacity 0.15s", marginTop: 4 }}>
              {submitting ? "…" : mode === "signin" ? "Sign in →" : "Create account →"}
            </button>
          </form>

          <p style={{ fontSize: 12, color: INK2, textAlign: "center", marginTop: 24, lineHeight: 1.6 }}>
            By continuing you agree to our{" "}
            <Link href="/terms" style={{ color: INK, textDecoration: "underline" }}>Terms</Link>
            {" "}and{" "}
            <Link href="/privacy" style={{ color: INK, textDecoration: "underline" }}>Privacy Policy</Link>.
          </p>
        </div>
      </div>

      {/* Footer strip */}
      <div style={{ borderTop: `1px solid ${BORDER}`, padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontSize: 12, color: INK2 }}>
          Rentura is a product of{" "}
          <Link href="/" style={{ color: INK, fontWeight: 700, textDecoration: "none" }}>PropertyVault.co.uk</Link>
        </p>
      </div>
    </div>
  );
}

export default function RenturaAuth() {
  return <RenturaAuthForm />;
}
