"use client";

import { useLang } from "@/lib/lang-context";
import type { Lang } from "@/lib/hetta-config";

const langs: { code: Lang; label: string; flag: string }[] = [
  { code: "en", label: "EN", flag: "🇬🇧" },
  { code: "ar", label: "عربي", flag: "🇸🇦" },
  { code: "fr", label: "FR", flag: "🇲🇦" },
];

export function LangSwitcher() {
  const { lang, setLang } = useLang();

  return (
    <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: "var(--h-border)" }}>
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
  );
}
