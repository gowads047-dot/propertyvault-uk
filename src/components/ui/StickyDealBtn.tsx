"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export function StickyDealBtn() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 500);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  if (!visible) return null;

  return (
    <Link
      href="/calculators/deal-analyser"
      aria-label="Analyse a deal free"
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 60,
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        background: "#c9a84c",
        color: "#0f1b36",
        fontWeight: 700,
        fontSize: 13,
        padding: "11px 20px",
        borderRadius: 999,
        boxShadow: "0 4px 24px rgba(201,168,76,0.45)",
        textDecoration: "none",
        whiteSpace: "nowrap",
      }}
    >
      <svg width="16" height="16" viewBox="0 0 28 28" fill="none">
        <rect x="2" y="6" width="24" height="18" rx="3" fill="#0f1b36"/>
        <path d="M6 20V14" stroke="#c9a84c" strokeWidth="3" strokeLinecap="round"/>
        <path d="M11 20V11" stroke="#c9a84c" strokeWidth="3" strokeLinecap="round"/>
        <path d="M16 20V8" stroke="#c9a84c" strokeWidth="3" strokeLinecap="round"/>
        <path d="M21 20V5" stroke="#c9a84c" strokeWidth="3" strokeLinecap="round"/>
      </svg>
      Analyse a deal free
    </Link>
  );
}
