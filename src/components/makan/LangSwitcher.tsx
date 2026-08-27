"use client";

import { useState } from "react";
import { useLang } from "@/lib/lang-context";
import type { Lang } from "@/lib/makan-config";

const langs: { code: Lang; label: string; flag: string }[] = [
  { code: "en", label: "EN", flag: "🇬🇧" },
  { code: "ar", label: "عربي", flag: "🇸🇦" },
  { code: "fr", label: "FR", flag: "🇲🇦" },
];

export function LangSwitcher() {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const active = langs.find(l => l.code === lang) ?? langs[0];

  return (
    <>
      {/* Mobile: compact single button + dropdown */}
      <div className="relative md:hidden">
        <button
          onClick={() => setOpen(o => !o)}
          className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold border"
          style={{ borderColor: "var(--h-border)", background: "var(--h-surface)", color: "var(--h-muted)" }}
        >
          <span>{active.flag}</span>
          <span>{active.label}</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" style={{ opacity: 0.5 }}>
            <path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          </svg>
        </button>
        {open && (
          <div
            className="absolute right-0 top-full mt-1 rounded-xl overflow-hidden shadow-lg border z-50"
            style={{ background: "var(--h-surface)", borderColor: "var(--h-border)", minWidth: 110 }}
          >
            {langs.map(l => (
              <button
                key={l.code}
                onClick={() => { setLang(l.code); setOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors"
                style={{
                  background: lang === l.code ? "var(--h-accent-light)" : "transparent",
                  color: lang === l.code ? "var(--h-accent)" : "var(--h-text)",
                  fontWeight: lang === l.code ? 600 : 400,
                }}
              >
                {l.flag} {l.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Desktop: inline pill buttons */}
      <div className="hidden md:flex rounded-lg overflow-hidden border" style={{ borderColor: "var(--h-border)" }}>
        {langs.map(l => (
          <button
            key={l.code}
            onClick={() => setLang(l.code)}
            className="px-2.5 py-1.5 text-xs font-semibold transition-colors"
            style={{
              background: lang === l.code ? "var(--h-accent)" : "var(--h-surface)",
              color: lang === l.code ? "white" : "var(--h-muted)",
            }}
          >
            {l.flag} {l.label}
          </button>
        ))}
      </div>
    </>
  );
}
