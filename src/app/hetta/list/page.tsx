"use client";

import { useState } from "react";

export default function ListPropertyPage() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="py-20">
        <div className="h-container max-w-lg text-center">
          <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ background: "var(--h-green-light)" }}>
            <svg className="w-8 h-8" style={{ color: "var(--h-green)" }} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
          </div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--h-text)" }}>Listing submitted!</h1>
          <p className="mb-6" style={{ color: "var(--h-muted)" }}>We&apos;ll review your listing and publish it within 24 hours. You&apos;ll receive a confirmation via WhatsApp or email.</p>
          <a href="/hetta" className="h-btn h-btn-primary">Browse listings</a>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="py-12" style={{ background: "var(--h-surface)" }}>
        <div className="h-container max-w-2xl">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 text-sm font-semibold" style={{ background: "var(--h-green-light)", color: "var(--h-green)" }}>
              <span className="w-2 h-2 rounded-full" style={{ background: "var(--h-green)" }} />
              100% free
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: "var(--h-text)" }}>List your property</h1>
            <p style={{ color: "var(--h-muted)" }}>Reach tenants directly. No fees, no commission, no agents. Fill in the form and we&apos;ll publish your listing within 24 hours.</p>
          </div>

          <form
            action="https://formsubmit.co/gowads047@gmail.com"
            method="POST"
            onSubmit={() => setSubmitted(true)}
            className="space-y-6"
          >
            <input type="hidden" name="_subject" value="New Hetta listing submission" />
            <input type="hidden" name="_captcha" value="false" />
            <input type="hidden" name="_template" value="table" />
            <input type="text" name="_honey" style={{ display: "none" }} />

            {/* Property type */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: "var(--h-text)" }}>What are you listing?</label>
              <div className="grid grid-cols-3 gap-3">
                {["Room", "Flat", "House"].map(type => (
                  <label key={type} className="h-card !rounded-xl p-4 text-center cursor-pointer has-[:checked]:border-[var(--h-accent)] has-[:checked]:bg-[var(--h-accent-light)]">
                    <input type="radio" name="property_type" value={type} required className="sr-only" />
                    <div className="mx-auto w-10 h-10 rounded-lg mb-2 flex items-center justify-center" style={{ background: "var(--h-warm)" }}>
                      {type === "Room" && <svg className="w-5 h-5" style={{ color: "var(--h-muted)" }} fill="currentColor" viewBox="0 0 24 24"><path d="M7 14c1.66 0 3-1.34 3-3S8.66 8 7 8s-3 1.34-3 3 1.34 3 3 3zm0-4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm12-3h-8v8H3V5H1v15h2v-3h18v3h2V10c0-2.21-1.79-4-4-4z"/></svg>}
                      {type === "Flat" && <svg className="w-5 h-5" style={{ color: "var(--h-muted)" }} fill="currentColor" viewBox="0 0 24 24"><path d="M17 11V3H7v4H3v14h8v-4h2v4h8V11h-4zM7 19H5v-2h2v2zm0-4H5v-2h2v2zm0-4H5V9h2v2zm4 4H9v-2h2v2zm0-4H9V9h2v2zm0-4H9V5h2v2zm4 8h-2v-2h2v2zm0-4h-2V9h2v2zm0-4h-2V5h2v2zm4 12h-2v-2h2v2zm0-4h-2v-2h2v2z"/></svg>}
                      {type === "House" && <svg className="w-5 h-5" style={{ color: "var(--h-muted)" }} fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>}
                    </div>
                    <p className="text-sm font-semibold" style={{ color: "var(--h-text)" }}>{type}</p>
                  </label>
                ))}
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: "var(--h-text)" }}>Address or area</label>
              <input type="text" name="address" required placeholder="e.g. Erdington, Birmingham or full address" className="h-input" />
              <p className="text-xs mt-1" style={{ color: "var(--h-subtle)" }}>We won&apos;t publish the exact address — just the area and city.</p>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: "var(--h-text)" }}>Bedrooms</label>
                <select name="bedrooms" required className="h-input">
                  <option value="">Select</option>
                  <option value="Studio">Studio</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5+">5+</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: "var(--h-text)" }}>Monthly rent (£)</label>
                <input type="number" name="rent" required placeholder="e.g. 850" className="h-input" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: "var(--h-text)" }}>Available from</label>
                <input type="date" name="available_from" required className="h-input" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: "var(--h-text)" }}>Furnished?</label>
                <select name="furnished" required className="h-input">
                  <option value="">Select</option>
                  <option value="Furnished">Furnished</option>
                  <option value="Part furnished">Part furnished</option>
                  <option value="Unfurnished">Unfurnished</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: "var(--h-text)" }}>Description</label>
              <textarea name="description" required rows={4} placeholder="Describe the property — what makes it great, nearby transport, local amenities..." className="h-input" />
            </div>

            {/* Features */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: "var(--h-text)" }}>Features (tick all that apply)</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {["Parking", "Garden", "Pets OK", "Bills included", "En-suite", "Washing machine", "Dishwasher", "EPC C+", "Near transport"].map(f => (
                  <label key={f} className="flex items-center gap-2 text-sm cursor-pointer py-1.5 px-3 rounded-lg" style={{ color: "var(--h-muted)" }}>
                    <input type="checkbox" name="features" value={f} className="accent-[var(--h-accent)]" />
                    {f}
                  </label>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className="border-t pt-6" style={{ borderColor: "var(--h-border)" }}>
              <h3 className="font-bold mb-4" style={{ color: "var(--h-text)" }}>Your contact details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: "var(--h-text)" }}>Name</label>
                  <input type="text" name="name" required className="h-input" placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: "var(--h-text)" }}>Email</label>
                  <input type="email" name="email" required className="h-input" placeholder="you@email.com" />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-semibold mb-2" style={{ color: "var(--h-text)" }}>WhatsApp number (optional)</label>
                <input type="tel" name="whatsapp" className="h-input" placeholder="e.g. 07415..." />
                <p className="text-xs mt-1" style={{ color: "var(--h-subtle)" }}>If provided, tenants can message you directly on WhatsApp.</p>
              </div>
            </div>

            {/* Who are you */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: "var(--h-text)" }}>I am a...</label>
              <div className="flex flex-wrap gap-2">
                {["Landlord", "Agent", "Tenant (looking for housemate)", "Property company"].map(role => (
                  <label key={role} className="flex items-center gap-2 text-sm cursor-pointer py-2 px-4 rounded-lg border" style={{ borderColor: "var(--h-border)", color: "var(--h-muted)" }}>
                    <input type="radio" name="role" value={role} required className="accent-[var(--h-accent)]" />
                    {role}
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" className="h-btn h-btn-primary w-full !py-4 text-lg">
              Submit listing — it&apos;s free
            </button>
            <p className="text-xs text-center" style={{ color: "var(--h-subtle)" }}>Your listing will be reviewed and published within 24 hours. We may contact you for additional details or photos.</p>
          </form>
        </div>
      </section>
    </>
  );
}
