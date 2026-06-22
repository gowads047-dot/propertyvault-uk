"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("tenant");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const { signIn, signUp } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (mode === "login") {
      const { error } = await signIn(email, password);
      if (error) setError(error);
      else router.push("/hetta/dashboard");
    } else {
      if (password.length < 6) { setError("Password must be at least 6 characters"); setLoading(false); return; }
      const { error } = await signUp(email, password, name, role);
      if (error) setError(error);
      else setSuccess("Check your email to confirm your account, then log in.");
    }
    setLoading(false);
  };

  return (
    <div className="py-16" style={{ background: "var(--h-bg)" }}>
      <div className="h-container max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center" style={{ background: "var(--h-accent)" }}>
            <svg className="w-6 h-6 text-white" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2L2 8.5V17a1 1 0 001 1h4.5v-5a1.5 1.5 0 011.5-1.5h2a1.5 1.5 0 011.5 1.5v5H17a1 1 0 001-1V8.5L10 2z"/></svg>
          </div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--h-text)" }}>{mode === "login" ? "Welcome back" : "Create your account"}</h1>
          <p className="text-sm mt-1" style={{ color: "var(--h-muted)" }}>{mode === "login" ? "Log in to manage your listings" : "Free forever. List properties, save favourites, message landlords."}</p>
        </div>

        {/* Toggle */}
        <div className="flex rounded-xl p-1 mb-6" style={{ background: "var(--h-warm)" }}>
          <button onClick={() => setMode("login")} className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all" style={{ background: mode === "login" ? "var(--h-surface)" : "transparent", color: mode === "login" ? "var(--h-text)" : "var(--h-muted)" }}>Log in</button>
          <button onClick={() => setMode("signup")} className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all" style={{ background: mode === "signup" ? "var(--h-surface)" : "transparent", color: mode === "signup" ? "var(--h-text)" : "var(--h-muted)" }}>Sign up</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <>
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--h-text)" }}>Full name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required className="h-input" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--h-text)" }}>I am a...</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: "tenant", label: "Tenant", desc: "Looking for a place" },
                    { value: "landlord", label: "Landlord", desc: "Listing a property" },
                  ].map(r => (
                    <button key={r.value} type="button" onClick={() => setRole(r.value)}
                      className="h-card !rounded-xl p-3 text-left transition-all"
                      style={{ borderColor: role === r.value ? "var(--h-accent)" : undefined, background: role === r.value ? "var(--h-accent-light)" : undefined }}>
                      <p className="text-sm font-semibold" style={{ color: "var(--h-text)" }}>{r.label}</p>
                      <p className="text-xs" style={{ color: "var(--h-muted)" }}>{r.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--h-text)" }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="h-input" placeholder="you@email.com" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: "var(--h-text)" }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="h-input" placeholder={mode === "signup" ? "At least 6 characters" : "Your password"} />
          </div>

          {error && <div className="p-3 rounded-lg text-sm font-medium" style={{ background: "#fef2f2", color: "#dc2626" }}>{error}</div>}
          {success && <div className="p-3 rounded-lg text-sm font-medium" style={{ background: "var(--h-green-light)", color: "var(--h-green)" }}>{success}</div>}

          <button type="submit" disabled={loading} className="h-btn h-btn-primary w-full !py-3.5">
            {loading ? "..." : mode === "login" ? "Log in" : "Create account"}
          </button>
        </form>

        <p className="text-xs text-center mt-6" style={{ color: "var(--h-subtle)" }}>
          By signing up you agree to our <Link href="/terms" className="underline">terms</Link> and <Link href="/privacy" className="underline">privacy policy</Link>.
        </p>
      </div>
    </div>
  );
}
