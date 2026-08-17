"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { countries } from "@/lib/hetta-config";

const allLocations: { label: string; type: string; country: string; flag: string }[] = [];
countries.forEach(c => {
  c.cities.forEach(city => {
    allLocations.push({ label: city, type: "City", country: c.name, flag: c.flag });
  });
});

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSelectCity?: (city: string, countryCode: string) => void;
  placeholder?: string;
}

export function SmartSearch({ value, onChange, onSelectCity, placeholder }: Props) {
  const [focused, setFocused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Purely derived from `value` against a static list, so it is computed during
  // render rather than mirrored into state by an effect. The effect version ran
  // a second render on every keystroke and could paint one frame of stale
  // suggestions before catching up.
  const suggestions = useMemo(() => {
    if (value.length < 2) return [];
    const q = value.toLowerCase();
    return allLocations
      .filter(l => l.label.toLowerCase().includes(q) || l.country.toLowerCase().includes(q))
      .slice(0, 8);
  }, [value]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setFocused(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSelect = (loc: typeof allLocations[0]) => {
    onChange(loc.label);
    // The dropdown renders on `focused && suggestions.length`, so blurring is
    // enough to close it — suggestions are now derived and cannot be cleared.
    setFocused(false);
    if (onSelectCity) {
      const country = countries.find(c => c.name === loc.country);
      if (country) onSelectCity(loc.label, country.code);
    }
  };

  return (
    <div ref={ref} className="relative flex-1">
      <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "var(--h-subtle)" }} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        placeholder={placeholder || "Search by city, area, or country..."}
        className="h-input !border-0 !pl-12 !shadow-none !ring-0"
        style={{ background: "transparent", color: "#1a1a1a" }}
      />

      {/* Dropdown */}
      {focused && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 rounded-xl overflow-hidden shadow-xl z-50" style={{ background: "var(--h-surface)", border: "1px solid var(--h-border)" }}>
          {suggestions.map((s, i) => (
            <button
              key={`${s.label}-${s.country}-${i}`}
              onClick={() => handleSelect(s)}
              className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors"
              style={{ borderBottom: i < suggestions.length - 1 ? "1px solid var(--h-border)" : undefined }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--h-warm)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg flex-shrink-0" style={{ background: "var(--h-warm)" }}>
                {s.flag}
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: "var(--h-text)" }}>{s.label}</p>
                <p className="text-xs" style={{ color: "var(--h-subtle)" }}>{s.type} · {s.country}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Quick suggestions when empty and focused */}
      {focused && value.length < 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 rounded-xl overflow-hidden shadow-xl z-50" style={{ background: "var(--h-surface)", border: "1px solid var(--h-border)" }}>
          <div className="px-4 py-2">
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--h-subtle)" }}>Popular cities</p>
          </div>
          {[
            { label: "Birmingham", country: "United Kingdom", flag: "🇬🇧", code: "gb" },
            { label: "Dubai", country: "UAE", flag: "🇦🇪", code: "ae" },
            { label: "Cairo", country: "Egypt", flag: "🇪🇬", code: "eg" },
            { label: "Casablanca", country: "Morocco", flag: "🇲🇦", code: "ma" },
            { label: "Riyadh", country: "Saudi Arabia", flag: "🇸🇦", code: "sa" },
            { label: "Nottingham", country: "United Kingdom", flag: "🇬🇧", code: "gb" },
          ].map((s, i) => (
            <button
              key={s.label}
              onClick={() => { onChange(s.label); setFocused(false); if (onSelectCity) onSelectCity(s.label, s.code); }}
              className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors"
              style={{ borderBottom: i < 5 ? "1px solid var(--h-border)" : undefined }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--h-warm)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <span className="text-lg">{s.flag}</span>
              <div>
                <p className="text-sm font-semibold" style={{ color: "var(--h-text)" }}>{s.label}</p>
                <p className="text-xs" style={{ color: "var(--h-subtle)" }}>{s.country}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
