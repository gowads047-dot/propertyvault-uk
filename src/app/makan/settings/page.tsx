"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";

export default function SettingsPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [profileMsg, setProfileMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [emailMsg, setEmailMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [passwordMsg, setPasswordMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingEmail, setSavingEmail] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push("/makan/auth"); return; }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- seeds the editable form from the profile once it loads; the fields must stay locally editable afterwards
    setName(profile?.name || "");
    setWhatsapp(profile?.whatsapp || "");
    setNewEmail(user.email || "");
  }, [user, profile, authLoading]);

  async function saveProfile() {
    if (!user) return;
    setSavingProfile(true);
    setProfileMsg(null);
    const { error } = await supabase.from("profiles").update({ name, whatsapp }).eq("id", user.id);
    setSavingProfile(false);
    setProfileMsg(error ? { type: "err", text: error.message } : { type: "ok", text: "Profile updated." });
  }

  async function updateEmail() {
    if (!newEmail) return;
    setSavingEmail(true);
    setEmailMsg(null);
    const { error } = await supabase.auth.updateUser({ email: newEmail });
    setSavingEmail(false);
    setEmailMsg(error
      ? { type: "err", text: error.message }
      : { type: "ok", text: "Check your new email for a confirmation link." }
    );
  }

  async function updatePassword() {
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: "err", text: "Passwords do not match." });
      return;
    }
    if (newPassword.length < 8) {
      setPasswordMsg({ type: "err", text: "Password must be at least 8 characters." });
      return;
    }
    setSavingPassword(true);
    setPasswordMsg(null);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setSavingPassword(false);
    if (error) {
      setPasswordMsg({ type: "err", text: error.message });
    } else {
      setPasswordMsg({ type: "ok", text: "Password updated successfully." });
      setNewPassword("");
      setConfirmPassword("");
    }
  }

  if (authLoading) return <div className="py-20 text-center" style={{ color: "var(--h-muted)" }}>Loading...</div>;
  if (!user) return null;

  return (
    <div className="py-8" style={{ background: "var(--h-bg)" }}>
      <div className="h-container max-w-lg">

        {/* Back */}
        <Link href="/makan/dashboard" className="inline-flex items-center gap-1 text-sm mb-6" style={{ color: "var(--h-muted)" }}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
          Back to dashboard
        </Link>

        <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--h-text)" }}>Account settings</h1>
        <p className="text-sm mb-8" style={{ color: "var(--h-muted)" }}>Update your profile, email address, and password.</p>

        {/* ── Profile ───────────────────────────────── */}
        <section className="h-card !rounded-2xl p-6 mb-5">
          <h2 className="font-bold text-base mb-4" style={{ color: "var(--h-text)" }}>Profile</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1" style={{ color: "var(--h-muted)" }}>Display name</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name or company"
                className="h-input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1" style={{ color: "var(--h-muted)" }}>WhatsApp number</label>
              <input
                value={whatsapp}
                onChange={e => setWhatsapp(e.target.value)}
                placeholder="+20 100 000 0000"
                className="h-input w-full"
              />
              <p className="text-xs mt-1" style={{ color: "var(--h-subtle)" }}>Include country code. Used for direct contact on listings.</p>
            </div>
          </div>
          {profileMsg && (
            <p className="text-sm mt-3 font-medium" style={{ color: profileMsg.type === "ok" ? "var(--h-green)" : "#dc2626" }}>{profileMsg.text}</p>
          )}
          <button onClick={saveProfile} disabled={savingProfile} className="h-btn h-btn-primary mt-4 !py-2 !text-sm">
            {savingProfile ? "Saving…" : "Save profile"}
          </button>
        </section>

        {/* ── Email ─────────────────────────────────── */}
        <section className="h-card !rounded-2xl p-6 mb-5">
          <h2 className="font-bold text-base mb-1" style={{ color: "var(--h-text)" }}>Email address</h2>
          <p className="text-xs mb-4" style={{ color: "var(--h-subtle)" }}>Current: <strong style={{ color: "var(--h-muted)" }}>{user.email}</strong></p>
          <div>
            <label className="block text-sm font-semibold mb-1" style={{ color: "var(--h-muted)" }}>New email address</label>
            <input
              type="email"
              value={newEmail}
              onChange={e => setNewEmail(e.target.value)}
              placeholder="new@email.com"
              className="h-input w-full"
            />
          </div>
          {emailMsg && (
            <p className="text-sm mt-3 font-medium" style={{ color: emailMsg.type === "ok" ? "var(--h-green)" : "#dc2626" }}>{emailMsg.text}</p>
          )}
          <button onClick={updateEmail} disabled={savingEmail || newEmail === user.email} className="h-btn h-btn-primary mt-4 !py-2 !text-sm">
            {savingEmail ? "Updating…" : "Update email"}
          </button>
        </section>

        {/* ── Password ──────────────────────────────── */}
        <section className="h-card !rounded-2xl p-6">
          <h2 className="font-bold text-base mb-4" style={{ color: "var(--h-text)" }}>Password</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1" style={{ color: "var(--h-muted)" }}>New password</label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Min. 8 characters"
                className="h-input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1" style={{ color: "var(--h-muted)" }}>Confirm new password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
                className="h-input w-full"
              />
            </div>
          </div>
          {passwordMsg && (
            <p className="text-sm mt-3 font-medium" style={{ color: passwordMsg.type === "ok" ? "var(--h-green)" : "#dc2626" }}>{passwordMsg.text}</p>
          )}
          <button onClick={updatePassword} disabled={savingPassword || !newPassword} className="h-btn h-btn-primary mt-4 !py-2 !text-sm">
            {savingPassword ? "Updating…" : "Update password"}
          </button>
        </section>

      </div>
    </div>
  );
}
