"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useLang } from "@/lib/lang-context";
import { countries } from "@/lib/hetta-config";

const sampleWanted = [
  { id: 1, name: "Sarah", budget: 600, city: "Birmingham", country: "gb", type: "Flat", beds: 1, moveIn: "Aug 2026", note: "Young professional, non-smoker, looking for a clean 1-bed flat near city centre. Happy with furnished or unfurnished. Can provide references.", flag: "🇬🇧" },
  { id: 2, name: "Ahmed", budget: 3500, city: "Cairo", country: "eg", type: "Apartment", beds: 2, moveIn: "Sep 2026", note: "Returning from UK, looking for a modern apartment in New Cairo or Zamalek. Need air conditioning and parking. Family of 3.", flag: "🇪🇬" },
  { id: 3, name: "Yasmine", budget: 450, city: "Nottingham", country: "gb", type: "Room", beds: 1, moveIn: "Jul 2026", note: "Final year student at NTU. Looking for a room with bills included, ideally near Lenton or city centre. Budget is firm.", flag: "🇬🇧" },
  { id: 4, name: "Omar", budget: 5000, city: "Casablanca", country: "ma", type: "Villa", beds: 3, moveIn: "Oct 2026", note: "Family relocating from Dubai. Need a villa with garden in Ain Diab or Anfa. Must have security and parking for 2 cars.", flag: "🇲🇦" },
  { id: 5, name: "Fatima", budget: 800, city: "Derby", country: "gb", type: "House", beds: 3, moveIn: "Now", note: "Family of 5. Need a 3-bed house near schools. Long-term tenant, currently renting in Normanton. Can move quickly.", flag: "🇬🇧" },
  { id: 6, name: "Khaled", budget: 8000, city: "Dubai", country: "ae", type: "Apartment", beds: 2, moveIn: "Sep 2026", note: "Professional couple, no children. Looking for a furnished 2-bed in Marina or JLT. Need gym and pool access.", flag: "🇦🇪" },
];

export default function WantedPage() {
  const { user } = useAuth();
  const { t } = useLang();
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
            <p className="text-sm font-medium" style={{ color: "var(--h-muted)" }}>{sampleWanted.length} people looking</p>
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
              action="https://formsubmit.co/gowads047@gmail.com"
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

          {/* Wanted listings */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sampleWanted.map(w => (
              <div key={w.id} className="h-card !rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm" style={{ background: "var(--h-accent-light)", color: "var(--h-accent)" }}>
                    {w.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: "var(--h-text)" }}>{w.name}</p>
                    <p className="text-xs" style={{ color: "var(--h-muted)" }}>{w.flag} {w.city}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="h-badge" style={{ background: "var(--h-warm)", color: "var(--h-muted)" }}>{w.type}</span>
                  <span className="h-badge" style={{ background: "var(--h-warm)", color: "var(--h-muted)" }}>{w.beds} bed</span>
                  <span className="h-badge" style={{ background: "var(--h-accent-light)", color: "var(--h-accent)" }}>{w.moveIn}</span>
                </div>
                <p className="text-sm mb-3 leading-relaxed" style={{ color: "var(--h-muted)" }}>{w.note}</p>
                <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid var(--h-border)" }}>
                  <span className="font-bold" style={{ color: "var(--h-text)" }}>Up to {countries.find(c => c.code === w.country)?.symbol === "£" ? "£" : ""}{w.budget}{countries.find(c => c.code === w.country)?.symbol !== "£" ? ` ${countries.find(c => c.code === w.country)?.symbol}` : ""}/mo</span>
                  {user ? (
                    <a href={`https://wa.me/4407415721628?text=${encodeURIComponent(`Hi, I have a property that matches what ${w.name} is looking for in ${w.city}`)}`} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold px-3 py-1.5 rounded-lg" style={{ background: "#25D366", color: "white" }}>Respond</a>
                  ) : (
                    <Link href="/makan/auth" className="text-xs font-semibold" style={{ color: "var(--h-accent)" }}>Log in to respond</Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
