"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import { ShareButtons } from "@/components/hetta/ShareButtons";
import { countries, formatPrice } from "@/lib/hetta-config";

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
  listing_type?: string;
  country?: string;
}

interface Profile {
  name: string;
  whatsapp: string | null;
}

// Coordinates for OSM map — city + key area overrides
const COORDS: Record<string, [number, number]> = {
  // UK
  "Canary Wharf": [51.5054, -0.0235],
  "Jewellery Quarter": [52.4862, -1.9126],
  "Spinningfields": [53.4801, -2.2510],
  "West Bridgford": [52.9310, -1.1344],
  "Chapel Allerton": [53.8278, -1.5290],
  "London": [51.5074, -0.1278],
  "Birmingham": [52.4862, -1.8904],
  "Manchester": [53.4808, -2.2426],
  "Nottingham": [52.9548, -1.1581],
  "Leeds": [53.8008, -1.5491],
  // Morocco
  "Medina": [31.6283, -7.9868],
  "Gauthier": [33.5870, -7.6400],
  "La Montagne": [35.7688, -5.8076],
  "Agdal": [33.9900, -6.8540],
  "Secteur Touristique": [30.4150, -9.5950],
  "Marrakech": [31.6295, -7.9811],
  "Casablanca": [33.5731, -7.5898],
  "Tangier": [35.7595, -5.8340],
  "Rabat": [33.9716, -6.8498],
  "Agadir": [30.4278, -9.5981],
  // Egypt
  "New Cairo": [30.0131, 31.4715],
  "Zamalek": [30.0634, 31.2235],
  "Stanley": [31.2214, 29.9499],
  "Maadi": [29.9626, 31.2497],
  "New Administrative Capital": [30.0231, 31.7296],
  "Cairo": [30.0444, 31.2357],
  "Alexandria": [31.2001, 29.9187],
  // UAE
  "Dubai Marina": [25.0805, 55.1403],
  "Downtown Dubai": [25.1972, 55.2744],
  "Palm Jumeirah": [25.1124, 55.1390],
  "Saadiyat Island": [24.5394, 54.4337],
  "Al Majaz": [25.3554, 55.3868],
  "Dubai": [25.2048, 55.2708],
  "Abu Dhabi": [24.4539, 54.3773],
  "Sharjah": [25.3463, 55.4209],
  // Saudi
  "Al Olaya": [24.6908, 46.6860],
  "Al Rawdah": [21.5426, 39.1728],
  "Diplomatic Quarter": [24.7006, 46.6186],
  "Al Khobar": [26.2172, 50.1971],
  "Al Hamra": [21.4980, 39.1560],
  "Riyadh": [24.7136, 46.6753],
  "Jeddah": [21.4858, 39.1925],
  "Dammam": [26.4207, 50.0888],
  // Kuwait
  "Marina District": [29.3375, 48.0815],
  "Marina Crescent": [29.3378, 48.0820],
  "Hawalli": [29.3355, 48.0289],
  "Fintas": [29.2073, 48.0892],
  "Rumaithiya": [29.3472, 48.0650],
  "Salmiya": [29.3322, 48.0774],
  "Kuwait City": [29.3759, 47.9774],
  // Bahrain
  "Seef District": [26.2268, 50.5426],
  "Amwaj Islands": [26.2811, 50.6407],
  "Diplomatic Area": [26.2216, 50.5838],
  "Riffa": [26.1296, 50.5558],
  "Old Town": [26.2567, 50.6188],
  "Manama": [26.2285, 50.5860],
  "Muharraq": [26.2567, 50.6188],
  // Qatar
  "The Pearl": [25.3725, 51.5523],
  "West Bay": [25.3268, 51.5310],
  "Lusail": [25.4338, 51.4929],
  "Al Sadd": [25.2854, 51.5140],
  "Doha": [25.2854, 51.5310],
  // Oman
  "Muscat Hills": [23.5630, 58.4012],
  "The Wave Muscat": [23.6373, 58.2913],
  "Qurum": [23.6020, 58.5116],
  "Al Mouj Marina": [23.6373, 58.2913],
  "Al Hafah": [17.0350, 54.1036],
  "Muscat": [23.5880, 58.3829],
  "Salalah": [17.0151, 54.0924],
  // Jordan
  "Abdoun": [31.9428, 35.8881],
  "South Beach": [29.5098, 35.0010],
  "Sweifieh": [31.9622, 35.8707],
  "Dabouq": [31.9961, 35.8264],
  "University District": [32.5556, 35.8500],
  "Amman": [31.9539, 35.9106],
  "Aqaba": [29.5268, 35.0063],
  "Irbid": [32.5556, 35.8500],
};

function getMapSrc(area: string, city: string): string {
  const coords = COORDS[area] ?? COORDS[city];
  if (coords) {
    const [lat, lon] = coords;
    const d = 0.018;
    return `https://www.openstreetmap.org/export/embed.html?bbox=${lon - d},${lat - d},${lon + d},${lat + d}&layer=mapnik&marker=${lat},${lon}`;
  }
  // fallback — generic search (still shows world but at least tries)
  return `https://www.openstreetmap.org/export/embed.html?bbox=-180,-85,180,85&layer=mapnik`;
}

function getMapLink(area: string, city: string): string {
  return `https://www.openstreetmap.org/search?query=${encodeURIComponent(`${area}, ${city}`)}`;
}

// Curated property photo sets by type
const FALLBACK_PHOTOS: Record<string, string[]> = {
  Flat: [
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80",
  ],
  Apartment: [
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=900&q=80",
  ],
  Studio: [
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1449844908441-8d4832deb3c8?auto=format&fit=crop&w=900&q=80",
  ],
  House: [
    "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80",
  ],
  Villa: [
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1591382696684-38c427c7547a?auto=format&fit=crop&w=900&q=80",
  ],
  Penthouse: [
    "https://images.unsplash.com/photo-1571055107559-3e67626fa8be?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?auto=format&fit=crop&w=900&q=80",
  ],
};

export default function ListingPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [listing, setListing] = useState<Listing | null>(null);
  const [owner, setOwner] = useState<Profile | null>(null);
  const [similar, setSimilar] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [enquirySent, setEnquirySent] = useState(false);
  const [message, setMessage] = useState("");
  const [activeImg, setActiveImg] = useState(0);

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
      const { data: sim } = await supabase.from("listings").select("*").eq("status", "active").eq("city", data.city).neq("id", data.id).limit(4);
      setSimilar(sim || []);
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

  if (loading) {
    return (
      <div className="py-32 text-center" style={{ color: "var(--h-muted)" }}>
        <div className="w-8 h-8 border-2 rounded-full animate-spin mx-auto mb-4" style={{ borderColor: "var(--h-border)", borderTopColor: "var(--h-accent)" }} />
        Loading listing...
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="py-20 text-center h-container">
        <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--h-text)" }}>Listing not found</h1>
        <p style={{ color: "var(--h-muted)" }}>This listing may have been removed or the URL is incorrect.</p>
        <Link href="/makan" className="h-btn h-btn-primary mt-6 inline-flex">Browse all listings</Link>
      </div>
    );
  }

  const isAvailable = !listing.available_from || new Date(listing.available_from) <= new Date();
  const forSale = listing.listing_type === "sale";
  const whatsappNum = owner?.whatsapp || "4407415721628";
  const priceStr = formatPrice(listing.price, listing.country || "gb");
  const priceSuffix = forSale ? "" : "/mo";

  // Use listing images if valid, otherwise fall back to type-matched curated set
  const photos = listing.images?.length > 0
    ? listing.images
    : (FALLBACK_PHOTOS[listing.property_type] ?? FALLBACK_PHOTOS.Flat);

  const mapSrc = getMapSrc(listing.area, listing.city);
  const mapLink = getMapLink(listing.area, listing.city);

  const countryObj = countries.find(x => x.code === listing.country) ?? countries.find(x => x.cities.includes(listing.city));

  return (
    <div style={{ background: "var(--h-bg)" }}>

      {/* ── Photo Gallery ────────────────────────────────── */}
      <div style={{ background: "#0a0a0a" }}>
        <div className="h-container py-0 px-0 md:px-6">
          {/* Back link */}
          <div className="px-4 md:px-0 pt-4 pb-2">
            <Link href="/makan" className="inline-flex items-center gap-1.5 text-sm font-medium" style={{ color: "rgba(255,255,255,0.6)" }}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
              Back to listings
            </Link>
          </div>

          {/* Main image */}
          <div className="relative overflow-hidden md:rounded-xl" style={{ height: "clamp(240px, 48vw, 520px)", maxHeight: 520 }}>
            <img
              src={photos[activeImg]}
              alt={listing.title}
              className="w-full h-full object-cover"
              onError={e => { (e.target as HTMLImageElement).src = (FALLBACK_PHOTOS[listing.property_type] ?? FALLBACK_PHOTOS.Flat)[0]; }}
            />
            {/* Overlay badges */}
            <div className="absolute top-4 left-4 flex gap-2">
              {forSale
                ? <span className="text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: "var(--h-accent)", color: "white" }}>For Sale</span>
                : isAvailable
                  ? <span className="text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: "var(--h-green)", color: "white" }}>Available now</span>
                  : <span className="text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: "rgba(0,0,0,0.6)", color: "white" }}>Available {new Date(listing.available_from).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span>
              }
              <span className="text-xs font-semibold px-3 py-1.5 rounded-full" style={{ background: "rgba(0,0,0,0.55)", color: "white" }}>{listing.property_type}</span>
            </div>
            {/* Photo counter */}
            <div className="absolute bottom-4 right-4 text-xs font-semibold px-2.5 py-1.5 rounded-full" style={{ background: "rgba(0,0,0,0.55)", color: "white" }}>
              {activeImg + 1} / {photos.length}
            </div>
            {/* Prev/Next arrows */}
            {photos.length > 1 && (
              <>
                <button onClick={() => setActiveImg(i => (i - 1 + photos.length) % photos.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(0,0,0,0.5)", color: "white" }}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
                </button>
                <button onClick={() => setActiveImg(i => (i + 1) % photos.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(0,0,0,0.5)", color: "white" }}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                </button>
              </>
            )}
          </div>

          {/* Thumbnail strip */}
          {photos.length > 1 && (
            <div className="flex gap-2 px-4 md:px-0 py-3 overflow-x-auto">
              {photos.map((ph, i) => (
                <button key={i} onClick={() => setActiveImg(i)}
                  className="flex-shrink-0 rounded-lg overflow-hidden transition-all"
                  style={{ width: 72, height: 52, outline: i === activeImg ? "2px solid var(--h-accent)" : "2px solid transparent", outlineOffset: 2 }}>
                  <img src={ph} alt="" className="w-full h-full object-cover"
                    onError={e => { (e.target as HTMLImageElement).src = (FALLBACK_PHOTOS[listing.property_type] ?? FALLBACK_PHOTOS.Flat)[0]; }} />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Main content ─────────────────────────────────── */}
      <div className="h-container py-8 max-w-5xl">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">

          {/* LEFT — details */}
          <div className="lg:col-span-2">

            {/* Title + location */}
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-extrabold leading-tight mb-1" style={{ color: "var(--h-text)" }}>{listing.title}</h1>
              <p className="flex items-center gap-1.5 text-sm" style={{ color: "var(--h-muted)" }}>
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>
                {listing.area}, {listing.city}{countryObj ? `, ${countryObj.name}` : ""}
              </p>
            </div>

            {/* Key stats bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              <div className="rounded-xl p-4" style={{ background: "var(--h-accent)", color: "white" }}>
                <p className="text-xl font-extrabold">{priceStr}</p>
                <p className="text-xs opacity-80">{forSale ? "asking price" : "per month"}</p>
              </div>
              <div className="rounded-xl p-4" style={{ background: "var(--h-surface)", border: "1px solid var(--h-border)" }}>
                <p className="text-xl font-bold" style={{ color: "var(--h-text)" }}>{listing.bedrooms === 0 ? "Studio" : listing.bedrooms}</p>
                <p className="text-xs" style={{ color: "var(--h-muted)" }}>{listing.bedrooms === 0 ? "open plan" : listing.bedrooms === 1 ? "bedroom" : "bedrooms"}</p>
              </div>
              <div className="rounded-xl p-4" style={{ background: "var(--h-surface)", border: "1px solid var(--h-border)" }}>
                <p className="text-xl font-bold" style={{ color: "var(--h-text)" }}>{listing.property_type}</p>
                <p className="text-xs" style={{ color: "var(--h-muted)" }}>property type</p>
              </div>
              <div className="rounded-xl p-4" style={{ background: "var(--h-surface)", border: "1px solid var(--h-border)" }}>
                <p className="text-xl font-bold" style={{ color: "var(--h-text)" }}>{listing.furnished?.split(" ")[0] ?? "—"}</p>
                <p className="text-xs" style={{ color: "var(--h-muted)" }}>furnished</p>
              </div>
            </div>

            {/* Description */}
            {listing.description && (
              <div className="mb-8">
                <h2 className="text-lg font-bold mb-3" style={{ color: "var(--h-text)" }}>About this property</h2>
                <div className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "var(--h-muted)" }}>{listing.description}</div>
              </div>
            )}

            {/* Features */}
            {listing.features?.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-bold mb-3" style={{ color: "var(--h-text)" }}>Features & amenities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {listing.features.map(tag => (
                    <div key={tag} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm" style={{ background: "var(--h-surface)", border: "1px solid var(--h-border)", color: "var(--h-text)" }}>
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "var(--h-accent)" }} />
                      {tag}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Map ── proper coordinates */}
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-3" style={{ color: "var(--h-text)" }}>Location</h2>
              <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--h-border)", height: 300 }}>
                <iframe
                  title="Property location"
                  width="100%"
                  height="300"
                  style={{ border: 0, display: "block" }}
                  src={mapSrc}
                  loading="lazy"
                />
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs" style={{ color: "var(--h-subtle)" }}>Approximate area shown — exact address after enquiry</p>
                <a href={mapLink} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold" style={{ color: "var(--h-accent)" }}>Open in map ↗</a>
              </div>
            </div>

            {/* Listed by */}
            {owner && (
              <div className="flex items-center gap-4 p-4 rounded-xl mb-6" style={{ background: "var(--h-surface)", border: "1px solid var(--h-border)" }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center font-extrabold text-lg flex-shrink-0" style={{ background: "var(--h-accent-light)", color: "var(--h-accent)" }}>
                  {owner.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm" style={{ color: "var(--h-text)" }}>Listed by {owner.name}</p>
                  <p className="text-xs" style={{ color: "var(--h-muted)" }}>Verified landlord · responds within 24 hours</p>
                </div>
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--h-green)" }} />
              </div>
            )}

            {/* Share */}
            <div>
              <h2 className="text-sm font-bold mb-2" style={{ color: "var(--h-text)" }}>Share this listing</h2>
              <ShareButtons title={`${listing.title} — ${priceStr}${priceSuffix} in ${listing.area}, ${listing.city}`} />
            </div>
          </div>

          {/* RIGHT — sidebar */}
          <div className="space-y-4">
            <div className="rounded-2xl p-6 sticky top-20" style={{ background: "var(--h-surface)", border: "1px solid var(--h-border)" }}>

              {/* Price callout */}
              <div className="mb-5 pb-5" style={{ borderBottom: "1px solid var(--h-border)" }}>
                <p className="text-3xl font-extrabold" style={{ color: "var(--h-text)" }}>{priceStr}</p>
                <p className="text-sm mt-0.5" style={{ color: "var(--h-muted)" }}>{forSale ? "Asking price · freehold" : "Per month · all enquiries welcome"}</p>
              </div>

              {user ? (
                <>
                  <button onClick={toggleSave}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold mb-3 transition-colors"
                    style={{ background: saved ? "var(--h-accent-light)" : "var(--h-warm)", color: saved ? "var(--h-accent)" : "var(--h-text)", border: "1px solid var(--h-border)" }}>
                    {saved ? "♥ Saved" : "♡ Save listing"}
                  </button>

                  <a
                    href={`https://wa.me/${whatsappNum.replace(/\D/g, "")}?text=${encodeURIComponent(`Hi, I found this on Makan and I'm interested:\n\n${listing.title}\n${priceStr}${priceSuffix} · ${listing.area}, ${listing.city}\n\nIs it still available?`)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm mb-3"
                    style={{ background: "#25D366", color: "white" }}>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    WhatsApp landlord
                  </a>

                  {enquirySent ? (
                    <div className="p-3 rounded-xl text-sm text-center" style={{ background: "var(--h-green-light)", color: "var(--h-green)" }}>
                      ✓ Enquiry sent — landlord will respond via WhatsApp
                    </div>
                  ) : (
                    <form onSubmit={sendEnquiry} className="space-y-3">
                      <textarea
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        rows={3}
                        className="h-input text-sm"
                        placeholder={`Hi, I'm interested in this ${listing.property_type.toLowerCase()}. Is it still available?`}
                      />
                      <button type="submit" className="h-btn h-btn-primary w-full justify-center">Send enquiry</button>
                    </form>
                  )}

                  <p className="text-xs text-center mt-4" style={{ color: "var(--h-subtle)" }}>Your contact details are shared with the landlord only.</p>
                </>
              ) : (
                <div className="text-center">
                  <div className="w-12 h-12 rounded-2xl mx-auto mb-3 flex items-center justify-center text-xl" style={{ background: "var(--h-accent-light)" }}>🔒</div>
                  <p className="font-bold mb-1" style={{ color: "var(--h-text)" }}>Sign up to contact</p>
                  <p className="text-sm mb-5" style={{ color: "var(--h-muted)" }}>Free account — message landlords, save listings, get WhatsApp details.</p>
                  <Link href="/makan/auth" className="h-btn h-btn-primary w-full justify-center">Sign up free</Link>
                  <p className="text-xs mt-3" style={{ color: "var(--h-subtle)" }}>Have an account? <Link href="/makan/auth" className="underline font-semibold" style={{ color: "var(--h-accent)" }}>Log in</Link></p>
                </div>
              )}
            </div>

            {/* Safety */}
            <div className="rounded-2xl p-4" style={{ background: "var(--h-surface)", border: "1px solid var(--h-border)" }}>
              <p className="text-xs font-bold mb-3" style={{ color: "var(--h-text)" }}>🛡️ Stay safe</p>
              <ul className="space-y-2 text-xs" style={{ color: "var(--h-muted)" }}>
                <li className="flex gap-2"><span style={{ color: "var(--h-accent)" }}>→</span> Never pay before viewing in person</li>
                <li className="flex gap-2"><span style={{ color: "var(--h-accent)" }}>→</span> Always sign a written tenancy agreement</li>
                <li className="flex gap-2"><span style={{ color: "var(--h-accent)" }}>→</span> Verify the landlord owns the property</li>
                {countryObj?.code === "gb" && <li className="flex gap-2"><span style={{ color: "var(--h-accent)" }}>→</span> <strong>UK:</strong> Ask for EPC, Gas Safety &amp; deposit protection</li>}
                {countryObj?.code === "ae" && <li className="flex gap-2"><span style={{ color: "var(--h-accent)" }}>→</span> <strong>UAE:</strong> Ejari registration is mandatory</li>}
                {countryObj?.code === "kw" && <li className="flex gap-2"><span style={{ color: "var(--h-accent)" }}>→</span> <strong>Kuwait:</strong> Rental only — foreign ownership restricted</li>}
                {countryObj?.code === "sa" && <li className="flex gap-2"><span style={{ color: "var(--h-accent)" }}>→</span> <strong>Saudi:</strong> Ejar registration legally required</li>}
              </ul>
              <Link href="/makan/compliance" className="text-xs font-semibold mt-3 block" style={{ color: "var(--h-accent)" }}>
                Full legal guide →
              </Link>
            </div>
          </div>
        </div>

        {/* Similar listings */}
        {similar.length > 0 && (
          <div className="mt-12 pt-10" style={{ borderTop: "1px solid var(--h-border)" }}>
            <h2 className="text-xl font-bold mb-5" style={{ color: "var(--h-text)" }}>More in {listing.city}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {similar.map(s => (
                <Link href={`/makan/listing/${s.id}`} key={s.id} className="h-card group">
                  <div className="aspect-[4/3] overflow-hidden" style={{ background: "#e8e5e1" }}>
                    {s.images?.[0] ? (
                      <img src={s.images[0]} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-10 h-10 opacity-20" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-semibold truncate mb-0.5 group-hover:text-[var(--h-accent)] transition-colors" style={{ color: "var(--h-text)" }}>{s.title}</p>
                    <p className="text-xs mb-2" style={{ color: "var(--h-muted)" }}>{s.area}</p>
                    <p className="font-bold text-sm" style={{ color: "var(--h-accent)" }}>
                      {formatPrice(s.price, s.country || "gb")}
                      {(s as Listing).listing_type !== "sale" && <span className="text-xs font-normal" style={{ color: "var(--h-subtle)" }}>/mo</span>}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
