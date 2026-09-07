"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { RenturaSidebar } from "@/components/rentura/RenturaSidebar";

export default function RenturaSubscribePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !user) router.push("/rentura/auth?next=/rentura/subscribe");
  }, [user, authLoading, router]);

  async function handleSubscribe() {
    if (!user) return;
    setLoading(true);
    setError("");
    const res = await fetch("/api/rentura/subscribe/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user.email, userId: user.id }),
    });
    const json = await res.json();
    if (json.url) {
      window.location.href = json.url;
    } else {
      setError(json.error || "Could not start checkout. Please try again.");
      setLoading(false);
    }
  }

  const BG = "#eceae2";
  const INK = "#111111";
  const INK2 = "rgba(17,17,17,0.72)";
  const BORDER = "rgba(17,17,17,0.1)";
  const CTA = "#0f1728";
  const GOLD = "#c9a84c";

  if (authLoading) return null;

  return (
    <div style={{ fontFamily: "var(--font-family-body)", background: BG, color: INK, minHeight: "100vh", display: "flex" }}>
      <style>{`body > header, body > footer { display: none !important; }`}</style>
      <RenturaSidebar />

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
        <div style={{ width: "100%", maxWidth: 480 }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: CTA, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
              <span style={{ color: GOLD, fontWeight: 900, fontSize: 22 }}>R</span>
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1.15, marginBottom: 10 }}>
              Reactivate Rentura
            </h1>
            <p style={{ fontSize: 15, color: INK2, lineHeight: 1.6 }}>
              Subscribe to get full access to your portfolio, compliance tracking, AI assistant, and all 14 modules — for £9.99/month.
            </p>
          </div>

          <div style={{ background: "white", borderRadius: 16, border: `1px solid ${BORDER}`, padding: 28, marginBottom: 20 }}>
            {[
              "Portfolio management across unlimited properties",
              "Property Passport & compliance calendar",
              "AI landlord assistant (text + document scan)",
              "Tax calculator with SA105 HMRC boxes",
              "Arrears pipeline & letter generation",
              "30-day free trial, then £9.99/month",
            ].map(f => (
              <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
                <span style={{ color: GOLD, fontWeight: 800, flexShrink: 0, marginTop: 1 }}>✓</span>
                <span style={{ fontSize: 14, color: INK, lineHeight: 1.4 }}>{f}</span>
              </div>
            ))}
          </div>

          {error && (
            <div style={{ background: "rgba(220,38,38,0.07)", border: "1px solid rgba(220,38,38,0.2)", borderRadius: 10, padding: "12px 16px", color: "#b91c1c", fontSize: 13, fontWeight: 600, marginBottom: 16 }}>
              {error}
            </div>
          )}

          <button
            onClick={handleSubscribe}
            disabled={loading || !user}
            style={{ width: "100%", background: CTA, color: "white", fontWeight: 800, fontSize: 16, padding: "16px 0", borderRadius: 12, border: "none", cursor: loading ? "wait" : "pointer", fontFamily: "inherit", letterSpacing: "-0.02em", opacity: loading ? 0.7 : 1, transition: "opacity 0.15s" }}
          >
            {loading ? "Opening checkout…" : "Subscribe — £9.99/month →"}
          </button>

          <p style={{ fontSize: 12, color: INK2, textAlign: "center", marginTop: 14 }}>
            Secure checkout via Stripe · Cancel any time from your settings
          </p>
        </div>
      </div>
    </div>
  );
}
