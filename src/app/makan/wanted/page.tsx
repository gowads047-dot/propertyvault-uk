"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { countries } from "@/lib/hetta-config";

export default function WantedPage() {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  return (
    <>
      <section className="py-12" style={{ background: "var(--h-surface)" }}>
        <div className="h-container">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 text-sm font-semibold" style={{ background: "var(--h-accent-light)", color: "var(--h-accent)" }}>
              Flip the script
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: "var(--h-text)" }}>Property Wanted</h1>
            <p style={{ color: "var(--h-muted)" }}>Can&apos;t find what you&apos;re looking for? Post what you need and let landlords come to you. Free to post, free to respond.</p>
          </div>
        </div>
      </section>

      <section className="py-6" style={{ background: "var(--h-bg)", borderTop: "1px solid var(--h-border)" }}>
        <div className="h-container">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm font-medium" style={{ color: "var(--h-muted)" }}>Be the first to post</p>
            {user ? (
              <button onClick={() => setShowForm(!showForm)} className="h-btn h-btn-primary text-sm !py-2">
                {showForm ? "Cancel" : "Post what you need"}
              </button>
            ) : (
              <Link href="/makan/auth" className="h-btn h-btn-primary text-sm !py-2">Sign up to post</Link>
            )}
          </div>

          {/* Post form */}
          {showForm && !submitted && (
            <form
              action="https://formsubmit.co/info@propertyvaultuk.co.uk"
              method="POST"
              onSubmit={() => setSubmitted(true)}
              className="h-card !rounded-2xl p-6 mb-8"
            >
              <input type="hidden" name="_subject" value="New Makan 'Property Wanted' post" />
              <input type="hidden" name="_captcha" value="false" />
              <input type="text" name="_honey" style={{ display: "none" }} />
              <h3 className="font-bold mb-4" style={{ color: "var(--h-text)" }}>What are you looking for?</h3>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: "var(--h-text)" }}>Country</label>
                  <select name="country" required className="h-input">
                    {countries.map(c => <option key={c.code} value={c.name}>{c.flag} {c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: "var(--h-text)" }}>City</label>
                  <input type="text" name="city" required className="h-input" placeholder="Which city?" />
                </div>
              </div>
              <div className="grid sm:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: "var(--h-text)" }}>Property type</label>
                  <select name="type" required className="h-input">
                    {["Room", "Studio", "Flat", "Apartment", "House", "Villa"].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: "var(--h-text)" }}>Bedrooms</label>
                  <select name="bedrooms" required className="h-input">
                    {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: "var(--h-text)" }}>Max budget/mo</label>
                  <input type="number" name="budget" required className="h-input" placeholder="e.g. 800" />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-xs font-semibold mb-1" style={{ color: "var(--h-text)" }}>When do you need to move?</label>
                <input type="text" name="move_date" required className="h-input" placeholder="e.g. August 2026 or ASAP" />
              </div>
              <div className="mb-4">
                <label className="block text-xs font-semibold mb-1" style={{ color: "var(--h-text)" }}>Tell landlords about yourself</label>
                <textarea name="note" required rows={3} className="h-input" placeholder="Who you are, what you need, any preferences..." />
              </div>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: "var(--h-text)" }}>Your name</label>
                  <input type="text" name="name" required className="h-input" />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: "var(--h-text)" }}>Email</label>
                  <input type="email" name="email" required className="h-input" />
                </div>
              </div>
              <button type="submit" className="h-btn h-btn-primary w-full">Post — it&apos;s free</button>
            </form>
          )}

          {submitted && (
            <div className="h-card !rounded-2xl p-8 mb-8 text-center">
              <div className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: "var(--h-green-light)" }}>
                <svg className="w-7 h-7" style={{ color: "var(--h-green)" }} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
              </div>
              <h3 className="font-bold text-lg mb-1" style={{ color: "var(--h-text)" }}>Posted!</h3>
              <p style={{ color: "var(--h-muted)" }}>Landlords with matching properties will be able to contact you directly.</p>
            </div>
          )}

          {/* Empty state — no listings yet */}
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5" style={{ background: "var(--h-accent-light)" }}>
              <svg className="w-8 h-8" style={{ color: "var(--h-accent)" }} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2" style={{ color: "var(--h-text)" }}>No listings yet</h3>
            <p className="max-w-sm mb-6" style={{ color: "var(--h-muted)" }}>
              Be the first to post what you&apos;re looking for. Landlords with matching properties will reach out directly.
            </p>
            {user ? (
              <button onClick={() => setShowForm(true)} className="h-btn h-btn-primary">
                Post what you need — it&apos;s free
              </button>
            ) : (
              <Link href="/makan/auth" className="h-btn h-btn-primary">Sign up to post</Link>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
