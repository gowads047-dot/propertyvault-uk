"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";

/**
 * A form that posts itself to /api/contact as JSON.
 *
 * Four forms on this site used to post directly to formsubmit.co. None of them
 * worked: FormSubmit requires a one-time activation per destination address,
 * that activation was never completed, and so every enquiry was accepted with a
 * success page and thrown away. The plain-HTML ones could not even detect it,
 * because a native form POST navigates away and never sees a result.
 *
 * This keeps the fields exactly as they are — a server component can pass them
 * straight through as children — and only takes over submission, so an enquiry
 * is recorded before anything is emailed and the visitor is told the truth
 * either way.
 */
export default function ApiForm({
  source,
  children,
  className = "",
  submitLabel = "Submit",
  successTitle = "Thanks — we have your details.",
  successBody = "We aim to reply within one working day.",
  sentEvent,
  sentParams,
}: {
  source: string;
  children: React.ReactNode;
  className?: string;
  submitLabel?: string;
  successTitle?: string;
  successBody?: string;
  /**
   * Fired once the server has accepted the submission — never on the click.
   * A click measures intent; only the accepted response measures an enquiry
   * that actually reached us, which is the number that matters.
   */
  sentEvent?: string;
  sentParams?: Record<string, string | number | boolean | undefined>;
}) {
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
        body: JSON.stringify({ ...data, source }),
      });
      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(json.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      setStatus("sent");
      if (sentEvent) track(sentEvent, sentParams);
    } catch {
      setError("We could not reach the server. Please check your connection and try again.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div role="status" className="bg-navy-50 border border-navy-200 rounded-2xl p-8 text-center">
        <h3 className="font-bold text-navy-800 mb-2">{successTitle}</h3>
        <p className="text-sm text-navy-600">
          {successBody} You can also reach us at{" "}
          <a href="mailto:info@propertyvaultuk.co.uk" className="underline">
            info@propertyvaultuk.co.uk
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form className={className} onSubmit={onSubmit}>
      {/* Honeypot: off-screen rather than display:none, so it stays invisible
          to people while remaining a field a bot will happily fill. */}
      <input
        type="text"
        name="_honey"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1 }}
      />

      {children}

      {status === "error" && (
        <p role="alert" className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      <button type="submit" disabled={status === "sending"} className="btn-primary w-full disabled:opacity-60">
        {status === "sending" ? "Sending…" : submitLabel}
      </button>
    </form>
  );
}
