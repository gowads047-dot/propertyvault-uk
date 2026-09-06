"use client";

import { useState } from "react";

const WA_NUMBER = "447415721628";

const WhatsAppIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export function EnquiryForm() {
  const [fields, setFields] = useState({ name: "", phone: "", email: "", postcode: "", bedrooms: "3", message: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  function set(k: keyof typeof fields) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setFields(f => ({ ...f, [k]: e.target.value }));
  }

  function buildWhatsAppUrl() {
    const text = [
      `Hi PropertyVault! I just submitted an enquiry and wanted to follow up on WhatsApp.`,
      ``,
      `Name: ${fields.name}`,
      `Phone: ${fields.phone}`,
      `Email: ${fields.email}`,
      fields.postcode ? `Postcode: ${fields.postcode}` : null,
      `Bedrooms: ${fields.bedrooms}`,
      fields.message ? `Message: ${fields.message}` : null,
    ].filter(Boolean).join("\n");
    return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    // This used to post to formsubmit.co and call itself a success regardless
    // of the outcome — the response was never checked, and FormSubmit was
    // silently discarding every enquiry because the destination address had
    // never been activated there. The page promises a reply within 2 hours, so
    // a false success here is the most expensive bug on the site.
    try {
      const res = await fetch("/api/contact/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: "guaranteed-rent", ...fields }),
      });
      setStatus(res.ok ? "success" : "error");
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
          href={buildWhatsAppUrl()}
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
          <label htmlFor="guaranteedre-your-name" className="block text-sm font-semibold text-navy-700 mb-1">Your Name *</label>
          <input id="guaranteedre-your-name" type="text" required value={fields.name} onChange={set("name")} className="w-full px-4 py-3 border border-navy-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-400" />
        </div>
        <div>
          <label htmlFor="guaranteedre-phone-number" className="block text-sm font-semibold text-navy-700 mb-1">Phone Number *</label>
          <input id="guaranteedre-phone-number" type="tel" required value={fields.phone} onChange={set("phone")} className="w-full px-4 py-3 border border-navy-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-400" />
        </div>
      </div>
      <div>
        <label htmlFor="guaranteedre-email-address" className="block text-sm font-semibold text-navy-700 mb-1">Email Address *</label>
        <input id="guaranteedre-email-address" type="email" required value={fields.email} onChange={set("email")} className="w-full px-4 py-3 border border-navy-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-400" />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="guaranteedre-property-postcode" className="block text-sm font-semibold text-navy-700 mb-1">Property Postcode</label>
          <input id="guaranteedre-property-postcode" type="text" placeholder="e.g. B12 8QX" value={fields.postcode} onChange={set("postcode")} className="w-full px-4 py-3 border border-navy-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-400" />
        </div>
        <div>
          <label htmlFor="guaranteedre-bedrooms" className="block text-sm font-semibold text-navy-700 mb-1">Bedrooms</label>
          <select id="guaranteedre-bedrooms" value={fields.bedrooms} onChange={set("bedrooms")} className="w-full px-4 py-3 border border-navy-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-gold-400">
            <option>1</option><option>2</option><option>3</option><option>4</option><option>5</option><option>6+</option>
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="guaranteedre-message-optional" className="block text-sm font-semibold text-navy-700 mb-1">Message (optional)</label>
        <textarea id="guaranteedre-message-optional" rows={3} placeholder="Tell us about your property or ask any questions..." value={fields.message} onChange={set("message")} className="w-full px-4 py-3 border border-navy-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-400 resize-none" />
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
        <a href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hi, I'm a landlord interested in guaranteed rent. Can you tell me more?")}`} target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 py-4 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-all text-sm">
          <WhatsAppIcon />
          WhatsApp
        </a>
      </div>
      <p className="text-xs text-navy-400 text-center mt-2">No obligation. We respond within 2 hours.</p>
    </form>
  );
}
