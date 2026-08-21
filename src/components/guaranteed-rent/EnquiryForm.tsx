"use client";

import { useState } from "react";


const WhatsAppIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm3.75 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm3.75 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
  </svg>
);

export function EnquiryForm() {
  const [fields, setFields] = useState({ name: "", phone: "", email: "", postcode: "", bedrooms: "3", message: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  function set(k: keyof typeof fields) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setFields(f => ({ ...f, [k]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    try {
      await fetch("https://formsubmit.co/ajax/gowads047@gmail.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          _subject: "Guaranteed Rent Enquiry — PropertyVault",
          _captcha: "false",
          ...fields,
        }),
      });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="bg-white rounded-2xl border border-green-200 p-8 shadow-lg text-center space-y-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-extrabold text-navy-800 mb-2">Enquiry received, {fields.name.split(" ")[0]}!</h3>
          <p className="text-navy-500 text-sm">We&apos;ve got your details and will reply within 2 hours. For a faster response, tap below to continue on WhatsApp — your details will be pre-filled.</p>
        </div>
        <a
          href="/contact"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 w-full py-4 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-all shadow-lg text-lg"
        >
          <WhatsAppIcon />
          Continue on WhatsApp →
        </a>
        <p className="text-xs text-navy-400">Tapping sends your details to our WhatsApp so we can reply instantly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-navy-100 p-6 md:p-8 shadow-lg space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-navy-700 mb-1">Your Name *</label>
          <input type="text" required value={fields.name} onChange={set("name")} className="w-full px-4 py-3 border border-navy-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-400" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-navy-700 mb-1">Phone Number *</label>
          <input type="tel" required value={fields.phone} onChange={set("phone")} className="w-full px-4 py-3 border border-navy-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-400" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold text-navy-700 mb-1">Email Address *</label>
        <input type="email" required value={fields.email} onChange={set("email")} className="w-full px-4 py-3 border border-navy-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-400" />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-navy-700 mb-1">Property Postcode</label>
          <input type="text" placeholder="e.g. B12 8QX" value={fields.postcode} onChange={set("postcode")} className="w-full px-4 py-3 border border-navy-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-400" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-navy-700 mb-1">Bedrooms</label>
          <select value={fields.bedrooms} onChange={set("bedrooms")} className="w-full px-4 py-3 border border-navy-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-gold-400">
            <option>1</option><option>2</option><option>3</option><option>4</option><option>5</option><option>6+</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold text-navy-700 mb-1">Message (optional)</label>
        <textarea rows={3} placeholder="Tell us about your property or ask any questions..." value={fields.message} onChange={set("message")} className="w-full px-4 py-3 border border-navy-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-400 resize-none" />
      </div>

      {status === "error" && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">Something went wrong — please try WhatsApp instead.</p>
      )}

      <button type="submit" disabled={status === "submitting"} className="btn-primary w-full text-lg !py-4 !rounded-xl disabled:opacity-60">
        {status === "submitting" ? "Sending…" : "Book My Free Valuation →"}
      </button>

      <div className="grid grid-cols-2 gap-3 mt-3">
        <a href="https://calendly.com/gowads047/30min" target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 py-4 bg-navy-800 text-white font-bold rounded-xl hover:bg-navy-700 transition-all text-sm">
          <svg className="w-5 h-5 text-gold-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
          Book a Call
        </a>
        <a href={`/contact`} target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 py-4 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-all text-sm">
          <WhatsAppIcon />
          Message us
        </a>
      </div>
      <p className="text-xs text-navy-400 text-center mt-2">No obligation. We respond within 2 hours.</p>
    </form>
  );
}
