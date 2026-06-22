"use client";

import { useState } from "react";

export function EmailResults() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    window.open(
      `https://formsubmit.co/gowads047@gmail.com?subject=${encodeURIComponent("Calculator results request")}&message=${encodeURIComponent(`User ${email} requested calculator results from ${window.location.pathname}`)}`,
      "_blank"
    );
    setSent(true);
  };

  if (sent) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-center">
        <p className="text-green-700 font-semibold text-sm">Thanks! Check your inbox.</p>
      </div>
    );
  }

  return (
    <div className="bg-navy-50 rounded-2xl border border-navy-100 p-5">
      <p className="font-semibold text-navy-800 text-sm mb-1">Save your results</p>
      <p className="text-xs text-navy-400 mb-3">Get a copy of this calculation emailed to you — plus weekly property insights.</p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Your email"
          required
          className="flex-1 px-4 py-2.5 border border-navy-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
        />
        <button type="submit" className="btn-primary text-sm px-5 py-2.5 whitespace-nowrap">Email me</button>
      </form>
    </div>
  );
}
