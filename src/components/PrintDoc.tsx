"use client";

import React from "react";

interface PrintHeaderProps {
  category: string;   // e.g. "Legal Notice · Housing Act 1988"
  title: string;      // e.g. "Section 8 Possession Notice"
  reference?: string; // e.g. auto-generated ref
  date?: string;      // ISO date string
}

export function PrintHeader({ category, title, reference, date }: PrintHeaderProps) {
  const fmtDate = date
    ? new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    : "";

  return (
    <div style={{ marginBottom: 28 }}>
      {/* Top bar: branding left, ref/date right */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", paddingBottom: 14, borderBottom: "2.5px solid #0f1b36" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Logo mark */}
          <div style={{ width: 32, height: 32, background: "#0f1b36", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M10 2L2 8.5V17a1 1 0 001 1h4.5v-5a1.5 1.5 0 011.5-1.5h2a1.5 1.5 0 011.5 1.5v5H17a1 1 0 001-1V8.5L10 2z" fill="white"/>
            </svg>
          </div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 800, color: "#0f1b36", letterSpacing: "-0.02em", margin: 0, fontFamily: "Arial, Helvetica, sans-serif" }}>
              PropertyVault<span style={{ color: "var(--gold-ink)" }}>.co.uk</span>
            </p>
            <p style={{ fontSize: 8.5, color: "#9ca3af", margin: 0, fontFamily: "Arial, sans-serif" }}>Free Property Tools · UK Landlords & Tenants</p>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          {reference && <p style={{ fontSize: 9, color: "#6b7280", margin: "0 0 2px", fontFamily: "monospace" }}>Ref: {reference}</p>}
          <p style={{ fontSize: 9, color: "#6b7280", margin: 0, fontFamily: "Arial, sans-serif" }}>{fmtDate || "Date: _______________"}</p>
        </div>
      </div>

      {/* Gold rule */}
      <div style={{ height: 3, background: "#c9a84c", margin: "0 0 16px" }} />

      {/* Document type + title */}
      <div>
        <p style={{ fontSize: 9, fontWeight: 700, color: "var(--gold-ink)", textTransform: "uppercase", letterSpacing: "0.12em", margin: "0 0 5px", fontFamily: "Arial, sans-serif" }}>{category}</p>
        <h1 style={{ fontSize: 21, fontWeight: 800, color: "#0f1b36", margin: 0, letterSpacing: "-0.02em", fontFamily: "Arial, Helvetica, sans-serif", lineHeight: 1.15 }}>{title}</h1>
      </div>

      {/* Bottom rule */}
      <div style={{ height: 1, background: "#e5e7eb", marginTop: 16 }} />
    </div>
  );
}

interface PrintFooterProps {
  docTitle: string;
  note?: string;
}

export function PrintFooter({ docTitle, note }: PrintFooterProps) {
  return (
    <>
      <style>{`@media print { .pv-print-footer { display: none !important; } }`}</style>
      <div className="pv-print-footer" style={{ marginTop: 32, paddingTop: 12, borderTop: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ fontSize: 8.5, color: "#9ca3af", margin: 0, fontFamily: "Arial, sans-serif" }}>
          {docTitle} · Generated via PropertyVault.co.uk · For guidance purposes only — seek legal advice for complex matters
        </p>
        <p style={{ fontSize: 8.5, color: "#9ca3af", margin: 0, fontFamily: "Arial, sans-serif" }}>
          {note || "England &amp; Wales"}
        </p>
      </div>
    </>
  );
}

/** Shared section heading for print documents */
export function PrintSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20, breakInside: "avoid" }}>
      <div style={{ borderLeft: "3px solid #0f1b36", paddingLeft: 10, marginBottom: 10 }}>
        <p style={{ fontSize: 10, fontWeight: 700, color: "#0f1b36", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0, fontFamily: "Arial, sans-serif" }}>{title}</p>
      </div>
      {children}
    </div>
  );
}

/** A data row: label | value */
export function PrintRow({ label, value }: { label: string; value?: string }) {
  return (
    <div style={{ display: "flex", gap: 12, marginBottom: 5, fontSize: 11.5, lineHeight: 1.5 }}>
      <span style={{ color: "#6b7280", minWidth: 170, flexShrink: 0, fontFamily: "Arial, sans-serif" }}>{label}</span>
      <span style={{ fontWeight: 600, color: "#1a1a1a", flex: 1, borderBottom: "0.5px solid #f1f5f9", paddingBottom: 1, fontFamily: "Arial, sans-serif" }}>{value || "—"}</span>
    </div>
  );
}
