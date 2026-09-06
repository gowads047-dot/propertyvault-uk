"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

function TenantAuthInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") || "";

  // With no token there is nothing to validate, so start on the login form rather
  // than rendering a spinner and immediately setting state in an effect.
  const [mode, setMode] = useState<"loading" | "setup" | "login" | "invalid">(token ? "loading" : "login");
  const [invite, setInvite] = useState<{ email: string; tenant_name: string | null; property_address?: string } | null>(null);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) return;
    fetch(`/api/tenant/validate/?token=${token}`)
      .then(r => r.json())
      .then(d => {
        if (d.valid) {
          setInvite(d);
          setEmail(d.email);
          setMode(d.accepted ? "login" : "setup");
        } else {
          setMode("invalid");
        }
      });
  }, [token]);

  async function handleSetup(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setSubmitting(true);
    if (password.length < 6) { setError("Password must be at least 6 characters."); setSubmitting(false); return; }

    const { data, error: signUpErr } = await supabase.auth.signUp({ email, password });
    if (signUpErr && !signUpErr.message.includes("already registered")) { setError(signUpErr.message); setSubmitting(false); return; }

    // If already registered, sign in instead
    if (signUpErr?.message.includes("already registered")) {
      const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
      if (signInErr) { setError("Wrong password. Try logging in instead."); setSubmitting(false); return; }
    } else if (data.user) {
      await fetch("/api/tenant/validate/", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token, authId: data.user.id }) });
    }
    router.push(`/tenant/dashboard?token=${token}`);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setSubmitting(true);
    const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
    if (signInErr) { setError("Incorrect email or password."); setSubmitting(false); return; }
    router.push(token ? `/tenant/dashboard?token=${token}` : "/tenant/dashboard");
  }

  const S = { bg: "#f8f7f5", card: "white", ink: "#1a2942", ink2: "rgba(26,41,66,0.55)", border: "rgba(26,41,66,0.1)", accent: "#1a2942" };
  const input = { width: "100%", background: "rgba(26,41,66,0.03)", border: `1px solid ${S.border}`, borderRadius: 10, padding: "11px 14px", color: S.ink, fontSize: 14, outline: "none", boxSizing: "border-box" as const, fontFamily: "inherit" };
  const btn = (disabled: boolean) => ({ background: disabled ? "rgba(26,41,66,0.3)" : S.accent, color: "white", fontWeight: 800, fontSize: 15, padding: "13px", borderRadius: 11, border: "none", cursor: disabled ? "not-allowed" : "pointer", fontFamily: "inherit", width: "100%" as const });

  if (mode === "loading") return <div style={{ minHeight: "100vh", background: S.bg, display: "flex", alignItems: "center", justifyContent: "center" }}><p style={{ color: S.ink2 }}>Loading…</p></div>;
  if (mode === "invalid") return (
    <div style={{ minHeight: "100vh", background: S.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
        <h2 style={{ fontWeight: 800, color: S.ink, marginBottom: 8 }}>Invalid invite link</h2>
        <p style={{ color: S.ink2, fontSize: 14 }}>This link has expired or is invalid. Contact your landlord for a new one.</p>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: S.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "var(--font-family-body)" }}>
      <style>{`body > header, body > footer { display: none !important; }`}</style>
      <div style={{ width: "100%", maxWidth: 440 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <div style={{ width: 36, height: 36, background: S.accent, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "var(--gold-ink)", fontWeight: 900, fontSize: 16 }}>PV</span>
            </div>
            <span style={{ fontWeight: 900, fontSize: 17, color: S.ink }}>Tenant Portal</span>
          </div>
          <p style={{ fontSize: 12, color: S.ink2 }}>Powered by PropertyVault UK</p>
        </div>

        <div style={{ background: S.card, borderRadius: 20, padding: "32px 28px", boxShadow: "0 2px 20px rgba(26,41,66,0.06)", border: `1px solid ${S.border}` }}>
          {mode === "setup" ? (
            <>
              <h1 style={{ fontSize: 20, fontWeight: 800, color: S.ink, marginBottom: 4 }}>Welcome, {invite?.tenant_name?.split(" ")[0] || "there"} 👋</h1>
              <p style={{ fontSize: 13, color: S.ink2, marginBottom: 24, lineHeight: 1.6 }}>
                You&apos;ve been invited to the tenant portal{invite?.property_address ? ` for ${invite.property_address.split(",")[0]}` : ""}. Create a password to get started.
              </p>
              <form onSubmit={handleSetup} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: S.ink2, marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.06em" }}>Your email</label>
                  <input type="email" value={email} readOnly style={{ ...input, opacity: 0.6 }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: S.ink2, marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.06em" }}>Create a password</label>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="At least 6 characters" style={input} />
                </div>
                {error && <p style={{ fontSize: 13, color: "#b91c1c", background: "rgba(220,38,38,0.06)", padding: "9px 12px", borderRadius: 8 }}>{error}</p>}
                <button type="submit" disabled={submitting} style={btn(submitting)}>{submitting ? "Setting up…" : "Access my portal →"}</button>
              </form>
              <p style={{ fontSize: 12, color: S.ink2, textAlign: "center", marginTop: 18 }}>Already set up? <button onClick={() => setMode("login")} style={{ background: "none", border: "none", color: S.accent, fontWeight: 700, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>Log in instead</button></p>
            </>
          ) : (
            <>
              <h1 style={{ fontSize: 20, fontWeight: 800, color: S.ink, marginBottom: 4 }}>Tenant portal log in</h1>
              <p style={{ fontSize: 13, color: S.ink2, marginBottom: 24 }}>Access your issues, messages, and home advice.</p>
              <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: S.ink2, marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.06em" }}>Email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@email.com" style={input} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: S.ink2, marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.06em" }}>Password</label>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Your password" style={input} />
                </div>
                {error && <p style={{ fontSize: 13, color: "#b91c1c", background: "rgba(220,38,38,0.06)", padding: "9px 12px", borderRadius: 8 }}>{error}</p>}
                <button type="submit" disabled={submitting} style={btn(submitting)}>{submitting ? "Logging in…" : "Log in →"}</button>
              </form>
            </>
          )}
        </div>

        <p style={{ textAlign: "center", fontSize: 12, color: S.ink2, marginTop: 20 }}>
          Have an invite link? Check your email from PropertyVault UK.<br />
          Need help? <Link href="https://wa.me/447415721628" style={{ color: S.accent, fontWeight: 600 }}>WhatsApp us</Link>
        </p>
      </div>
    </div>
  );
}

export default function TenantPage() {
  return <Suspense fallback={null}><TenantAuthInner /></Suspense>;
}
