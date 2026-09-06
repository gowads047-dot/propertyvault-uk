"use client";

import { useState } from "react";

const SUBJECTS = [
  "General Enquiry",
  "Guaranteed Rent Enquiry",
  "Property Listing",
  "Advertising & Partnerships",
  "Feedback",
];

const FIELD =
  "w-full px-4 py-3 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400";

/**
 * The contact form.
 *
 * Previously this posted straight to formsubmit.co, which showed a success page
 * and delivered nothing — the destination address had never been activated
 * there. It now posts to /api/contact, which records the enquiry before it
 * tries to email it, so a message can no longer be lost silently.
 */
export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError("");

    const data = Object.fromEntries(new FormData(e.currentTarget));

    try {
      const res = await fetch("/api/contact/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, source: "contact" }),
      });
      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(json.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      setStatus("sent");
    } catch {
      setError("We could not reach the server. Please check your connection and try again.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div role="status" className="bg-navy-50 border border-navy-200 rounded-xl p-6">
        <h3 className="font-bold text-navy-800 mb-2">Thanks — we have your message.</h3>
        <p className="text-sm text-navy-600">
          We aim to reply within one working day. If it is urgent, email us directly at{" "}
          <a href="mailto:info@propertyvaultuk.co.uk" className="underline">
            info@propertyvaultuk.co.uk
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit} noValidate={false}>
      {/* Honeypot: hidden from people, tempting to bots. Never filled by a real user. */}
      <input
        type="text"
        name="_honey"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1 }}
      />

      <div>
        <label htmlFor="contact-name" className="block text-sm font-semibold text-navy-700 mb-1">
          Your Name
        </label>
        <input id="contact-name" type="text" name="name" required maxLength={100} className={FIELD} />
      </div>

      <div>
        <label htmlFor="contact-email" className="block text-sm font-semibold text-navy-700 mb-1">
          Email Address
        </label>
        <input id="contact-email" type="email" name="email" required maxLength={200} className={FIELD} />
      </div>

      <div>
        <label htmlFor="contact-subject" className="block text-sm font-semibold text-navy-700 mb-1">
          Subject
        </label>
        <select id="contact-subject" name="subject" className={`${FIELD} bg-white`}>
          {SUBJECTS.map(s => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="contact-message" className="block text-sm font-semibold text-navy-700 mb-1">
          Message
        </label>
        <textarea
          id="contact-message"
          rows={5}
          name="message"
          required
          maxLength={5000}
          className={`${FIELD} resize-none`}
        />
      </div>

      {status === "error" && (
        <p role="alert" className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      <button type="submit" disabled={status === "sending"} className="btn-primary w-full disabled:opacity-60">
        {status === "sending" ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
