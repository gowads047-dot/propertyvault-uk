"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useLang } from "@/lib/lang-context";
import { LangSwitcher } from "./LangSwitcher";

export function MakanHeader() {
  const [open, setOpen] = useState(false);
  const { user, profile } = useAuth();
  const { t } = useLang();

  const nav = [
    { href: "/makan", label: t("nav.browse") },
    { href: "/makan/rooms", label: t("nav.rooms") },
    { href: "/makan/list", label: t("nav.list") },
    { href: "/makan/wanted", label: t("nav.wanted") || "Wanted" },
    { href: "/makan/about", label: t("nav.about") || "About" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-[var(--h-border)]">
      <div className="h-container">
        <div className="flex items-center justify-between h-16">
          <Link href="/makan" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-[var(--h-accent)] flex items-center justify-center group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5 text-white" viewBox="0 0 20 20" fill="none">
                <path d="M10 2L2 8.5V17a1 1 0 001 1h4.5v-5a1.5 1.5 0 011.5-1.5h2a1.5 1.5 0 011.5 1.5v5H17a1 1 0 001-1V8.5L10 2z" fill="currentColor"/>
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight" style={{ color: "var(--h-text)" }}>makan</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {nav.map(link => (
              <Link key={link.href} href={link.href}
                className="px-3.5 py-2 text-sm font-medium rounded-lg transition-colors"
                style={{ color: "var(--h-muted)" }}
                onMouseEnter={e => { e.currentTarget.style.color = "var(--h-text)"; e.currentTarget.style.background = "var(--h-warm)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "var(--h-muted)"; e.currentTarget.style.background = "transparent"; }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <LangSwitcher />
            <Link href="/makan/list"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-xl transition-all hover:opacity-90"
              style={{ background: "var(--h-accent)", color: "white" }}>
              + List free
            </Link>
            {user ? (
              <Link href="/makan/dashboard" className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors" style={{ background: "var(--h-warm)" }}>
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "var(--h-accent)", color: "white" }}>
                  {(profile?.name || "U").charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium hidden sm:inline" style={{ color: "var(--h-text)" }}>{profile?.name?.split(" ")[0] || t("nav.dashboard")}</span>
              </Link>
            ) : (
              <Link href="/makan/auth" className="text-sm font-medium px-3 py-1.5 rounded-lg hidden sm:inline" style={{ color: "var(--h-muted)" }}>{t("nav.login")}</Link>
            )}
            <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-lg" style={{ color: "var(--h-muted)" }}>
              {open ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t" style={{ borderColor: "var(--h-border)" }}>
          <div className="p-4 space-y-1">
            {nav.map(link => (
              <Link key={link.href} href={link.href} className="block py-2.5 px-3 rounded-lg text-sm font-medium" style={{ color: "var(--h-text)" }} onClick={() => setOpen(false)}>{link.label}</Link>
            ))}
            {user ? (
              <Link href="/makan/dashboard" className="block h-btn h-btn-primary text-center mt-3 text-sm" onClick={() => setOpen(false)}>{t("nav.dashboard")}</Link>
            ) : (
              <Link href="/makan/auth" className="block h-btn h-btn-primary text-center mt-3 text-sm" onClick={() => setOpen(false)}>{t("nav.signup")}</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
