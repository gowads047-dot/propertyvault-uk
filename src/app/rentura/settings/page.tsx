"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { RenturaSidebar } from "@/components/rentura/RenturaSidebar";

type Tab = "profile" | "notifications" | "billing" | "security";

export default function RenturaSettings() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("profile");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [sub, setSub] = useState<{ status: string; plan: string; period_end: string | null } | null>(null);

  useEffect(() => {
    if (!loading && !user) router.push("/rentura/auth");
  }, [user, loading, router]);

  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setPhone(profile.phone || "");
      setCity(profile.city || "");
      setWhatsapp(profile.whatsapp || "");
    }
  }, [profile]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("rentura_subscriptions")
      .select("status, plan, current_period_end")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setSub({ status: data.status, plan: data.plan, period_end: data.current_period_end });
      });
  }, [user]);

  async function saveProfile() {
    if (!user) return;
    setSaving(true);
    await supabase.from("profiles").update({ name, phone, city, whatsapp }).eq("id", user.id);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  async function openPortal() {
    const res = await fetch("/api/stripe/portal", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ platform: "rentura" }) });
    const { url, error } = await res.json();
    if (url) window.location.href = url;
    else alert(error || "No billing account found. Subscribe first.");
  }

  async function openCheckout() {
    if (!user) return;
    const res = await fetch("/api/rentura/subscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: user.email, userId: user.id }) });
    const { url, error } = await res.json();
    if (url) window.location.href = url;
    else alert(error || "Could not start checkout. Please try again.");
  }

  const C = {
    bg: "#0c0f1a", card: "rgba(255,255,255,0.03)", border: "rgba(255,255,255,0.07)",
    ink: "rgba(255,255,255,0.85)", ink2: "rgba(255,255,255,0.45)", ink3: "rgba(255,255,255,0.22)",
    gold: "#c9a84c", green: "#22c55e", red: "#ef4444",
  };

  if (loading) return <div style={{ background: C.bg, minHeight: "100vh", display: "flex" }}><RenturaSidebar /><div style={{ flex: 1 }} /></div>;

  return (
    <div style={{ background: C.bg, minHeight: "100vh", display: "flex", fontFamily: "var(--font-family-body)", color: C.ink }}>
      <style>{`body > header, body > footer { display: none !important; }`}</style>
      <RenturaSidebar />

        {/* Main */}
        <main style={{ flex: 1, padding: "36px 40px", maxWidth: 760, overflowY: "auto" }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 6 }}>Settings</h1>
          <p style={{ fontSize: 13, color: C.ink2, marginBottom: 32 }}>{user?.email}</p>

          {/* Tab bar */}
          <div style={{ display: "flex", gap: 4, marginBottom: 32, borderBottom: `1px solid ${C.border}`, paddingBottom: 0 }}>
            {(["profile", "notifications", "billing", "security"] as Tab[]).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                background: "none", border: "none", cursor: "pointer",
                padding: "8px 16px", fontSize: 13, fontWeight: tab === t ? 700 : 500,
                color: tab === t ? C.gold : C.ink2,
                borderBottom: tab === t ? `2px solid ${C.gold}` : "2px solid transparent",
                textTransform: "capitalize", fontFamily: "inherit",
              }}>{t}</button>
            ))}
          </div>

          {/* Profile Tab */}
          {tab === "profile" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {[
                  { label: "Full name", value: name, set: setName, placeholder: "Your name" },
                  { label: "Phone number", value: phone, set: setPhone, placeholder: "+44 7700 000000" },
                  { label: "City", value: city, set: setCity, placeholder: "Birmingham" },
                  { label: "WhatsApp number", value: whatsapp, set: setWhatsapp, placeholder: "+44 7700 000000" },
                ].map(f => (
                  <div key={f.label}>
                    <label style={{ fontSize: 11, fontWeight: 700, color: C.ink3, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>{f.label}</label>
                    <input
                      value={f.value}
                      onChange={e => f.set(e.target.value)}
                      placeholder={f.placeholder}
                      style={{ width: "100%", background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 12px", fontSize: 13, color: C.ink, outline: "none", boxSizing: "border-box" }}
                    />
                  </div>
                ))}
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: C.ink3, textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>Email address</label>
                <input
                  value={user?.email || ""}
                  disabled
                  style={{ width: "100%", background: "rgba(255,255,255,0.02)", border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 12px", fontSize: 13, color: C.ink3, boxSizing: "border-box", cursor: "not-allowed" }}
                />
                <p style={{ fontSize: 11, color: C.ink3, marginTop: 4 }}>Email cannot be changed. Contact support if needed.</p>
              </div>
              <button
                onClick={saveProfile}
                disabled={saving}
                style={{ alignSelf: "flex-start", background: C.gold, color: "#0f1b36", fontWeight: 800, fontSize: 13, padding: "10px 20px", borderRadius: 8, border: "none", cursor: "pointer", opacity: saving ? 0.6 : 1 }}
              >
                {saving ? "Saving…" : saved ? "Saved ✓" : "Save changes"}
              </button>
            </div>
          )}

          {/* Notifications Tab */}
          {tab === "notifications" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { title: "Compliance expiry alerts", desc: "Remind me 45, 14 and 3 days before a certificate expires", default: true },
                { title: "Mortgage rate alerts", desc: "Notify me when a fixed rate is within 90 days of expiry", default: true },
                { title: "Rent payment reminders", desc: "Alert me if rent hasn't been logged by the 5th of the month", default: true },
                { title: "Maintenance updates", desc: "Notify me when a maintenance job changes status", default: false },
                { title: "Portfolio digest", desc: "Weekly summary of your portfolio performance every Monday", default: false },
              ].map(n => (
                <div key={n.title} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "16px 20px" }}>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: C.ink, marginBottom: 3 }}>{n.title}</p>
                    <p style={{ fontSize: 12, color: C.ink2 }}>{n.desc}</p>
                  </div>
                  <Toggle defaultOn={n.default} />
                </div>
              ))}
              <p style={{ fontSize: 11, color: C.ink3 }}>Notifications are sent to {user?.email}. SMS alerts coming soon.</p>
            </div>
          )}

          {/* Billing Tab */}
          {tab === "billing" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "24px 28px" }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: C.ink3, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Current plan</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ fontSize: 20, fontWeight: 800, color: C.gold }}>
                      {sub ? "Rentura Early Access" : "Early Access (Waitlist)"}
                    </p>
                    <p style={{ fontSize: 13, color: C.ink2, marginTop: 4 }}>
                      {sub ? `£9.99/month · Status: ${sub.status}` : "£9.99/month — locked in when you subscribe"}
                    </p>
                    {sub?.period_end && (
                      <p style={{ fontSize: 11, color: C.ink3, marginTop: 4 }}>
                        Renews {new Date(sub.period_end).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                      </p>
                    )}
                  </div>
                  <span style={{ background: "rgba(34,197,94,0.12)", color: C.green, fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 20 }}>
                    {sub?.status || "Active"}
                  </span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {(!sub || sub.status !== "active") ? (
                  <button onClick={openCheckout} style={{ background: C.gold, color: "#0f1b36", fontWeight: 800, fontSize: 13, padding: "10px 22px", borderRadius: 8, border: "none", cursor: "pointer" }}>
                    Subscribe now — £9.99/mo →
                  </button>
                ) : (
                  <button onClick={openPortal} style={{ background: C.gold, color: "#0f1b36", fontWeight: 800, fontSize: 13, padding: "10px 20px", borderRadius: 8, border: "none", cursor: "pointer" }}>
                    Manage billing →
                  </button>
                )}
                <button onClick={openPortal} style={{ display: "inline-flex", alignItems: "center", background: "transparent", color: C.ink2, fontWeight: 600, fontSize: 13, padding: "10px 20px", borderRadius: 8, border: `1px solid ${C.border}`, cursor: "pointer", fontFamily: "inherit" }}>
                  View invoices
                </button>
              </div>
              <div style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 12, padding: "16px 20px" }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: C.red, marginBottom: 4 }}>Cancel subscription</p>
                <p style={{ fontSize: 12, color: C.ink2, marginBottom: 12 }}>You'll keep access until the end of your billing period. Your data will be retained for 30 days.</p>
                <button onClick={openPortal} style={{ background: "transparent", color: C.red, fontWeight: 700, fontSize: 12, padding: "7px 14px", borderRadius: 7, border: `1px solid rgba(239,68,68,0.3)`, cursor: "pointer" }}>
                  Cancel via billing portal
                </button>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {tab === "security" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "24px 28px" }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: C.ink, marginBottom: 4 }}>Password</p>
                <p style={{ fontSize: 12, color: C.ink2, marginBottom: 16 }}>Last changed: unknown · We recommend changing your password regularly.</p>
                <button
                  onClick={async () => {
                    await supabase.auth.resetPasswordForEmail(user?.email || "", { redirectTo: `${window.location.origin}/rentura/settings` });
                    alert("Password reset email sent.");
                  }}
                  style={{ background: "transparent", color: C.gold, fontWeight: 700, fontSize: 13, padding: "9px 16px", borderRadius: 8, border: `1px solid rgba(201,168,76,0.3)`, cursor: "pointer" }}
                >
                  Send password reset email
                </button>
              </div>
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "24px 28px" }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: C.ink, marginBottom: 4 }}>Active sessions</p>
                <p style={{ fontSize: 12, color: C.ink2, marginBottom: 12 }}>You are currently signed in on this device.</p>
                <button
                  onClick={async () => { await supabase.auth.signOut(); window.location.href = "/rentura"; }}
                  style={{ background: "transparent", color: C.red, fontWeight: 700, fontSize: 12, padding: "7px 14px", borderRadius: 7, border: `1px solid rgba(239,68,68,0.3)`, cursor: "pointer" }}
                >
                  Sign out of all devices
                </button>
              </div>
              <div style={{ background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 12, padding: "20px 24px" }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: C.red, marginBottom: 4 }}>Delete account</p>
                <p style={{ fontSize: 12, color: C.ink2, marginBottom: 12 }}>This will permanently delete your account and all your data. This cannot be undone.</p>
                <button style={{ background: "transparent", color: C.red, fontWeight: 700, fontSize: 12, padding: "7px 14px", borderRadius: 7, border: `1px solid rgba(239,68,68,0.3)`, cursor: "pointer" }}>
                  Request account deletion
                </button>
              </div>
            </div>
          )}
        </main>
    </div>
  );
}

function Toggle({ defaultOn }: { defaultOn: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      onClick={() => setOn(v => !v)}
      style={{
        width: 40, height: 22, borderRadius: 11,
        background: on ? "#22c55e" : "rgba(255,255,255,0.1)",
        border: "none", cursor: "pointer", position: "relative",
        flexShrink: 0, transition: "background 0.2s",
      }}
    >
      <span style={{
        position: "absolute", top: 3, left: on ? 21 : 3,
        width: 16, height: 16, borderRadius: "50%",
        background: "white", transition: "left 0.2s",
      }} />
    </button>
  );
}
