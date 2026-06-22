"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";

interface Listing {
  id: string;
  title: string;
  description: string;
  property_type: string;
  bedrooms: number;
  price: number;
  city: string;
  area: string;
  available_from: string;
  furnished: string;
  features: string[];
  images: string[];
  user_id: string;
  created_at: string;
}

interface Profile {
  name: string;
  whatsapp: string | null;
}

export default function ListingPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [listing, setListing] = useState<Listing | null>(null);
  const [owner, setOwner] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [enquirySent, setEnquirySent] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!id) return;
    loadListing();
  }, [id]);

  async function loadListing() {
    const { data } = await supabase.from("listings").select("*").eq("id", id).single();
    if (data) {
      setListing(data);
      const { data: profile } = await supabase.from("profiles").select("name, whatsapp").eq("id", data.user_id).single();
      setOwner(profile);
      if (user) {
        const { data: fav } = await supabase.from("favourites").select("id").eq("user_id", user.id).eq("listing_id", data.id).single();
        setSaved(!!fav);
      }
    }
    setLoading(false);
  }

  async function toggleSave() {
    if (!user || !listing) return;
    if (saved) {
      await supabase.from("favourites").delete().eq("user_id", user.id).eq("listing_id", listing.id);
      setSaved(false);
    } else {
      await supabase.from("favourites").insert({ user_id: user.id, listing_id: listing.id });
      setSaved(true);
    }
  }

  async function sendEnquiry(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !listing || !message.trim()) return;
    await supabase.from("enquiries").insert({
      listing_id: listing.id,
      sender_id: user.id,
      recipient_id: listing.user_id,
      message: message.trim(),
    });
    setEnquirySent(true);
  }

  if (loading) return <div className="py-20 text-center" style={{ color: "var(--h-muted)" }}>Loading...</div>;

  if (!listing) {
    return (
      <div className="py-20 text-center h-container">
        <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--h-text)" }}>Listing not found</h1>
        <p style={{ color: "var(--h-muted)" }}>This listing may have been removed or the URL is incorrect.</p>
        <Link href="/hetta" className="h-btn h-btn-primary mt-6 inline-flex">Browse all listings</Link>
      </div>
    );
  }

  const bgColor = listing.property_type === "Room" ? "#e8e0d6" : listing.property_type === "Flat" ? "#d6dfe8" : "#d6e8db";
  const isAvailable = !listing.available_from || new Date(listing.available_from) <= new Date();
  const whatsappNum = owner?.whatsapp || "4407415721628";

  return (
    <div className="py-8" style={{ background: "var(--h-bg)" }}>
      <div className="h-container max-w-4xl">
        <Link href="/hetta" className="inline-flex items-center gap-1 text-sm font-medium mb-6" style={{ color: "var(--h-muted)" }}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
          Back to listings
        </Link>

        {/* Images */}
        {listing.images && listing.images.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 rounded-2xl overflow-hidden mb-8">
            <div className="aspect-[4/3] md:aspect-auto md:row-span-2">
              <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" />
            </div>
            {listing.images.slice(1, 3).map((img, i) => (
              <div key={i} className="aspect-[4/3] hidden md:block">
                <img src={img} alt={`${listing.title} ${i + 2}`} className="w-full h-full object-cover" />
              </div>
            ))}
            {listing.images.length === 1 && (
              <div className="aspect-[4/3] hidden md:flex items-center justify-center" style={{ background: bgColor }}>
                <p className="text-sm opacity-30">More photos coming</p>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-2xl overflow-hidden mb-8 aspect-[16/7] flex items-center justify-center" style={{ background: bgColor }}>
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto opacity-20 mb-2" viewBox="0 0 24 24" fill="currentColor">
                {listing.property_type === "Room" && <path d="M7 14c1.66 0 3-1.34 3-3S8.66 8 7 8s-3 1.34-3 3 1.34 3 3 3zm12-7h-8v8H3V5H1v15h2v-3h18v3h2V10c0-2.21-1.79-4-4-4z"/>}
                {listing.property_type === "Flat" && <path d="M17 11V3H7v4H3v14h8v-4h2v4h8V11h-4zM7 19H5v-2h2v2zm0-4H5v-2h2v2zm0-4H5V9h2v2zm4 4H9v-2h2v2zm0-4H9V9h2v2zm0-4H9V5h2v2zm4 8h-2v-2h2v2zm0-4h-2V9h2v2zm0-4h-2V5h2v2zm4 12h-2v-2h2v2zm0-4h-2v-2h2v2z"/>}
                {listing.property_type === "House" && <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>}
              </svg>
              <p className="text-sm opacity-30">Photos coming soon</p>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="h-badge" style={{ background: "var(--h-warm)", color: "var(--h-muted)" }}>{listing.property_type}</span>
              <span className="h-badge" style={{ background: "var(--h-warm)", color: "var(--h-muted)" }}>{listing.furnished}</span>
              {isAvailable && <span className="h-badge" style={{ background: "var(--h-green-light)", color: "var(--h-green)" }}>Available now</span>}
              {!isAvailable && <span className="h-badge" style={{ background: "var(--h-warm)", color: "var(--h-muted)" }}>Available {new Date(listing.available_from).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span>}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: "var(--h-text)" }}>{listing.title}</h1>
            <p className="text-sm mb-6" style={{ color: "var(--h-muted)" }}>{listing.area}, {listing.city}</p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="h-card !rounded-xl p-4 text-center">
                <p className="text-2xl font-bold" style={{ color: "var(--h-text)" }}>£{listing.price}</p>
                <p className="text-xs" style={{ color: "var(--h-muted)" }}>per month</p>
              </div>
              <div className="h-card !rounded-xl p-4 text-center">
                <p className="text-2xl font-bold" style={{ color: "var(--h-text)" }}>{listing.bedrooms === 0 ? "Studio" : listing.bedrooms}</p>
                <p className="text-xs" style={{ color: "var(--h-muted)" }}>{listing.bedrooms === 0 ? "" : listing.bedrooms === 1 ? "bedroom" : "bedrooms"}</p>
              </div>
              <div className="h-card !rounded-xl p-4 text-center">
                <p className="text-2xl font-bold" style={{ color: "var(--h-text)" }}>{listing.property_type}</p>
                <p className="text-xs" style={{ color: "var(--h-muted)" }}>property type</p>
              </div>
            </div>

            {listing.description && (
              <>
                <h2 className="font-bold mb-3" style={{ color: "var(--h-text)" }}>About this property</h2>
                <p className="leading-relaxed mb-6 whitespace-pre-line" style={{ color: "var(--h-muted)" }}>{listing.description}</p>
              </>
            )}

            {listing.features && listing.features.length > 0 && (
              <>
                <h2 className="font-bold mb-3" style={{ color: "var(--h-text)" }}>Features</h2>
                <div className="flex flex-wrap gap-2 mb-8">
                  {listing.features.map(tag => (
                    <span key={tag} className="h-tag">{tag}</span>
                  ))}
                </div>
              </>
            )}

            {owner && (
              <div className="h-card !rounded-xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold" style={{ background: "var(--h-accent-light)", color: "var(--h-accent)" }}>
                  {owner.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-sm" style={{ color: "var(--h-text)" }}>Listed by {owner.name}</p>
                  <p className="text-xs" style={{ color: "var(--h-muted)" }}>Responds within 24 hours</p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            <div className="h-card !rounded-2xl p-6 sticky top-20">
              <p className="font-bold mb-1" style={{ color: "var(--h-text)" }}>Interested?</p>
              <p className="text-sm mb-5" style={{ color: "var(--h-muted)" }}>Contact the landlord directly — no agents, no fees.</p>

              {user && (
                <button onClick={toggleSave} className="h-btn h-btn-secondary w-full mb-3 justify-center">
                  {saved ? "♥ Saved" : "♡ Save listing"}
                </button>
              )}

              <a
                href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent(`Hi, I'm interested in: ${listing.title} (£${listing.price}/mo in ${listing.area}, ${listing.city})`)}`}
                target="_blank" rel="noopener noreferrer"
                className="h-btn w-full justify-center mb-3"
                style={{ background: "#25D366", color: "white" }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp
              </a>

              {user ? (
                enquirySent ? (
                  <div className="p-3 rounded-lg text-sm text-center" style={{ background: "var(--h-green-light)", color: "var(--h-green)" }}>Enquiry sent! The landlord will respond soon.</div>
                ) : (
                  <form onSubmit={sendEnquiry} className="space-y-3">
                    <textarea
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      rows={3}
                      className="h-input"
                      placeholder="Your message..."
                      defaultValue={`Hi, I'm interested in this ${listing.property_type.toLowerCase()}. Is it still available?`}
                    />
                    <button type="submit" className="h-btn h-btn-primary w-full">Send enquiry</button>
                  </form>
                )
              ) : (
                <div className="text-center">
                  <p className="text-xs mb-3" style={{ color: "var(--h-subtle)" }}>Log in to send an enquiry or save this listing</p>
                  <Link href="/hetta/auth" className="h-btn h-btn-secondary w-full justify-center text-sm">Log in / Sign up</Link>
                </div>
              )}

              <p className="text-xs text-center mt-4" style={{ color: "var(--h-subtle)" }}>Free to enquire. No sign-up needed for WhatsApp.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
