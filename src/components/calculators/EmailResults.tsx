"use client";

import { useState } from "react";

export interface DealMetrics {
  address?: string;
  purchasePrice: number;
  monthlyRent: number;
  grossYield: number;
  netYield: number;
  monthlyCF: number;
  cashOnCash: number;
  dealScore: number;
  totalCashIn: number;
  netIncome: number;
  strategy: string;
}

interface Props {
  deal?: DealMetrics;
}

export function EmailResults({ deal }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("sending");

    try {
      const res = await fetch("/api/send-deal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, deal }),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-center">
        <p className="text-green-700 font-semibold text-sm">Analysis sent! Check your inbox.</p>
        <p className="text-green-600 text-xs mt-1">Didn&apos;t receive it? Check spam or try again.</p>
      </div>
    );
  }

  return (
    <div className="bg-navy-50 rounded-2xl border border-navy-100 p-5">
      <p className="font-semibold text-navy-800 text-sm mb-1">Save this analysis</p>
      <p className="text-xs text-navy-400 mb-3">
        Get a full copy of this deal emailed to you — score, all 4 metrics, and a summary table.
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Your email address"
          // The placeholder is not an accessible name: support is inconsistent
          // and it disappears the moment anything is typed. This component is
          // rendered on around twenty calculators, so it was the single
          // unnamed field left on most of them.
          aria-label="Your email address"
          required
          className="flex-1 px-4 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="btn-primary text-sm px-5 py-2.5 whitespace-nowrap disabled:opacity-50"
        >
          {status === "sending" ? "Sending…" : "Email me"}
        </button>
      </form>
      {status === "error" && (
        <p className="text-red-500 text-xs mt-2">Something went wrong — please try again.</p>
      )}
    </div>
  );
}
