"use client";

import { useState } from "react";

export function PostcodeEmailCapture() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("sending");

    try {
      const res = await fetch("/api/subscribe/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name: name || "Investor", user_type: "landlord" }),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div className="text-center py-4">
        <p className="text-lg font-bold text-navy-800 mb-1">Done! Check your inbox.</p>
        <p className="text-sm text-navy-500">
          We&apos;ve sent the postcode data + our free Property Starter Pack to your email.
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="font-bold text-navy-800 mb-1">Get this as a formatted guide</p>
      <p className="text-sm text-navy-500 mb-4">
        Enter your email and we&apos;ll send the full postcode list plus our free Property Starter Pack — calculators, guides, and the 2025 compliance checklist.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <input aria-label="First name (optional)"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="First name (optional)"
          className="px-4 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 sm:w-40"
        />
        <input aria-label="Your email address"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Your email address"
          required
          className="flex-1 px-4 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="btn-gold text-sm px-5 py-2.5 whitespace-nowrap disabled:opacity-50"
        >
          {status === "sending" ? "Sending…" : "Send me the guide"}
        </button>
      </form>
      {status === "error" && (
        <p className="text-red-500 text-xs mt-2">Something went wrong — please try again.</p>
      )}
      <p className="text-xs text-navy-400 mt-2">Free. No spam. Unsubscribe any time.</p>
    </div>
  );
}
