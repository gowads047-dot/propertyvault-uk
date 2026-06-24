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
  size_sqm?: number;
  video_url?: string;
  floor_plan_url?: string;
  highlights?: string[];
  view_count?: number;
  company_name?: string;
  facebook_url?: string;
  instagram_url?: string;
}

interface Profile {
  name: string;
  whatsapp: string | null;
}

const COORDS: Record<string, [number, number]> = {
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
  "New Cairo": [30.0131, 31.4715],
  "Zamalek": [30.0634, 31.2235],
  "Stanley": [31.2214, 29.9499],
  "Maadi": [29.9626, 31.2497],
  "New Administrative Capital": [30.0231, 31.7296],
  "Cairo": [30.0444, 31.2357],
  "Alexandria": [31.2001, 29.9187],
  "Dubai Marina": [25.0805, 55.1403],
  "Downtown Dubai": [25.1972, 55.2744],
  "Palm Jumeirah": [25.1124, 55.1390],
  "Saadiyat Island": [24.5394, 54.4337],
  "Al Majaz": [25.3554, 55.3868],
  "Dubai": [25.2048, 55.2708],
  "Abu Dhabi": [24.4539, 54.3773],
  "Sharjah": [25.3463, 55.4209],
  "Al Olaya": [24.6908, 46.6860],
  "Al Rawdah": [21.5426, 39.1728],
  "Diplomatic Quarter": [24.7006, 46.6186],
  "Al Khobar": [26.2172, 50.1971],
  "Al Hamra": [21.4980, 39.1560],
  "Riyadh": [24.7136, 46.6753],
  "Jeddah": [21.4858, 39.1925],
  "Marina District": [29.3375, 48.0815],
  "Marina Crescent": [29.3378, 48.0820],
  "Hawalli": [29.3355, 48.0289],
  "Fintas": [29.2073, 48.0892],
  "Rumaithiya": [29.3472, 48.0650],
  "Salmiya": [29.3322, 48.0774],
  "Kuwait City": [29.3759, 47.9774],
  "Seef District": [26.2268, 50.5426],
  "Amwaj Islands": [26.2811, 50.6407],
  "Diplomatic Area": [26.2216, 50.5838],
  "Riffa": [26.1296, 50.5558],
  "Manama": [26.2285, 50.5860],
  "Muharraq": [26.2567, 50.6188],
  "The Pearl": [25.3725, 51.5523],
  "West Bay": [25.3268, 51.5310],
  "Lusail": [25.4338, 51.4929],
  "Al Sadd": [25.2854, 51.5140],
  "Doha": [25.2854, 51.5310],
  "Muscat Hills": [23.5630, 58.4012],
  "The Wave Muscat": [23.6373, 58.2913],
  "Qurum": [23.6020, 58.5116],
  "Al Mouj Marina": [23.6373, 58.2913],
  "Muscat": [23.5880, 58.3829],
  "Salalah": [17.0151, 54.0924],
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
  return `https://www.openstreetmap.org/export/embed.html?bbox=-180,-85,180,85&layer=mapnik`;
}

function getMapLink(area: string, city: string): string {
  return `https://www.openstreetmap.org/search?query=${encodeURIComponent(`${area}, ${city}`)}`;
}


// Photo labels for thumbnail strip
const PHOTO_LABELS = ["Living room", "Kitchen", "Master bedroom", "Bedroom 2", "Bathroom", "Balcony / terrace", "View", "Exterior", "Garden / pool", "Other"];

// Feature icons — used in grouped feature grid
const FEATURE_ICONS: Record<string, string> = {
  "Parking": "🅿️", "Underground parking": "🅿️", "Garage": "🏗️",
  "Pool": "🏊", "Swimming pool": "🏊", "Shared pool": "🏊",
  "Gym": "🏋️", "Fitness centre": "🏋️",
  "Garden": "🌿", "Private garden": "🌿", "Rooftop": "🌅",
  "Balcony": "🌤️", "Terrace": "☀️", "Courtyard": "🏛️",
  "Sea view": "🌊", "Marina view": "⛵", "City view": "🌆", "Golf view": "⛳",
  "Mountain view": "⛰️", "Nile view": "🌊", "Garden view": "🌳", "Lake view": "💧",
  "Furnished": "🛋️", "Part furnished": "🪑", "Unfurnished": "📦",
  "Air conditioning": "❄️", "Central heating": "🔥", "District cooling": "❄️", "Chiller free": "❄️",
  "En-suite": "🚿", "Maid's room": "🏠", "Driver's room": "🚗", "Storage": "📦",
  "Security": "🔐", "24hr security": "🔐", "Doorman": "🎩", "Concierge": "🎩",
  "Elevator": "🛗", "Smart home": "📱",
  "Near transport": "🚇", "Near metro": "🚇", "Near tram": "🚃",
  "Near school": "🏫", "Near beach": "🏖️", "Near mosque": "🕌",
  "Washing machine": "🫧", "Dishwasher": "🫧",
  "Bills included": "💡", "Utilities included": "💡",
  "EPC C+": "🌱", "Solar panels": "☀️",
  "Pets OK": "🐾", "Pet friendly": "🐾",
  "Students welcome": "🎓", "Professionals only": "💼",
  "Gated community": "🔒", "Compound": "🏘️",
  "Private beach": "🏖️", "Beach access": "🏖️",
  "No agency fee": "✅", "Bill included": "💡",
};

// Feature group buckets
const FEATURE_GROUPS: Record<string, string[]> = {
  "Building": ["Gym", "Fitness centre", "Pool", "Swimming pool", "Shared pool", "Parking", "Underground parking", "Garage", "Security", "24hr security", "Doorman", "Concierge", "Elevator", "Storage", "Gated community", "Compound"],
  "Apartment": ["Furnished", "Part furnished", "Unfurnished", "Air conditioning", "District cooling", "Chiller free", "Central heating", "En-suite", "Balcony", "Terrace", "Courtyard", "Rooftop", "Maid's room", "Driver's room", "Washing machine", "Dishwasher", "Smart home"],
  "Views & Setting": ["Sea view", "Marina view", "City view", "Golf view", "Mountain view", "Nile view", "Garden view", "Lake view", "Private garden", "Garden", "Private beach", "Beach access", "Near transport", "Near metro", "Near tram", "Near school", "Near beach", "Near mosque"],
  "Bills & Extras": ["Bills included", "Utilities included", "Bill included", "EPC C+", "Solar panels", "Pets OK", "Pet friendly", "Students welcome", "Professionals only", "No agency fee"],
};

function groupFeatures(features: string[]): Record<string, string[]> {
  const grouped: Record<string, string[]> = {};
  const ungrouped: string[] = [];
  for (const f of features) {
    let placed = false;
    for (const [group, items] of Object.entries(FEATURE_GROUPS)) {
      if (items.some(i => i.toLowerCase() === f.toLowerCase())) {
        if (!grouped[group]) grouped[group] = [];
        grouped[group].push(f);
        placed = true;
        break;
      }
    }
    if (!placed) ungrouped.push(f);
  }
  if (ungrouped.length) grouped["Other"] = ungrouped;
  return grouped;
}

// Seed a stable pseudo-random view count from listing id
function viewCount(id: string, base: number = 0): number {
  const hash = id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return base + (hash % 47) + 12;
}

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
  const [enquiryError, setEnquiryError] = useState("");
  const [activeImg, setActiveImg] = useState(0);
  const [floorPlanOpen, setFloorPlanOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    loadListing();
  }, [id]);

  async function loadListing() {
    const { data } = await supabase.from("listings").select("*").eq("id", id).single();
    if (data) {
      setListing(data);
      // increment view count
      supabase.from("listings").update({ view_count: (data.view_count ?? 0) + 1 }).eq("id", data.id);
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
    setEnquiryError("");
    if (!user) { setEnquiryError("Please sign in to send an enquiry."); return; }
    if (!listing) return;
    if (!message.trim()) { setEnquiryError("Please write a message first."); return; }
    const { error } = await supabase.from("enquiries").insert({
      listing_id: listing.id,
      sender_id: user.id,
      recipient_id: listing.user_id,
      message: message.trim(),
    });
    if (error) {
      setEnquiryError("Failed to send: " + error.message);
    } else {
      setEnquirySent(true);
    }
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
  const photos = listing.images?.length > 0 ? listing.images : [];
  const mapSrc = getMapSrc(listing.area, listing.city);
  const mapLink = getMapLink(listing.area, listing.city);
  const countryObj = countries.find(x => x.code === listing.country) ?? countries.find(x => x.cities.includes(listing.city));
  const featureGroups = groupFeatures(listing.features ?? []);
  const views = viewCount(listing.id, listing.view_count ?? 0);
  const pricePerSqm = listing.size_sqm && forSale ? Math.round(listing.price / listing.size_sqm) : null;

  // Detect Arabic/RTL content
  const isRTL = /[؀-ۿ]/.test(listing.description || listing.title);
  const arabicFont = "'Noto Sans Arabic', 'Plus Jakarta Sans', system-ui, sans-serif";

  // WhatsApp message — tailored per listing type
  const waMessage = forSale
    ? `Hi, I found your property on Makan and I'm interested in viewing it.\n\n📍 ${listing.title}\n💰 ${priceStr} · ${listing.area}, ${listing.city}\n\nIs it still available and can we arrange a viewing?`
    : `Hi, I'd like to arrange a viewing for your rental on Makan.\n\n📍 ${listing.title}\n💰 ${priceStr}/mo · ${listing.area}, ${listing.city}\n\nIs it still available? What's your earliest slot?`;

  return (
    <div style={{ background: "var(--h-bg)" }}>

      {/* ── Photo Gallery ────────────────────────────────── */}
      <div style={{ background: "#0a0a0a" }}>
        <div className="h-container py-0 px-0 md:px-6">

          {/* Back + view count row */}
          <div className="px-4 md:px-0 pt-4 pb-2 flex items-center justify-between">
            <Link href="/makan" className="inline-flex items-center gap-1.5 text-sm font-medium" style={{ color: "rgba(255,255,255,0.6)" }}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
              Back to listings
            </Link>
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
              👁 {views} people viewed this week
            </span>
          </div>

          {/* Main image */}
          <div className="relative overflow-hidden md:rounded-xl" style={{ height: "clamp(240px, 48vw, 520px)", maxHeight: 520 }}>
            {photos.length > 0 ? (
              <img
                src={photos[activeImg]}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
            ) : listing.video_url ? (
              <video src={listing.video_url} controls className="w-full h-full object-cover" style={{ background: "#0a0a0a" }} />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-4" style={{ background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)" }}>
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center" style={{ background: "rgba(232,85,61,0.15)", border: "1px solid rgba(232,85,61,0.3)" }}>
                  <svg className="w-10 h-10" style={{ color: "rgba(232,85,61,0.6)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold mb-1" style={{ color: "rgba(255,255,255,0.7)" }}>Photos coming soon</p>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>Contact the agent for a viewing</p>
                </div>
              </div>
            )}

            {/* Overlay badges */}
            <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
              {forSale
                ? <span className="text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: "var(--h-accent)", color: "white" }}>For Sale</span>
                : isAvailable
                  ? <span className="text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: "var(--h-green)", color: "white" }}>Available now</span>
                  : <span className="text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: "rgba(0,0,0,0.6)", color: "white" }}>Available {new Date(listing.available_from).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span>
              }
              <span className="text-xs font-semibold px-3 py-1.5 rounded-full" style={{ background: "rgba(0,0,0,0.55)", color: "white" }}>{listing.property_type}</span>
              {listing.video_url && (
                <span className="text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1" style={{ background: "rgba(232,85,61,0.85)", color: "white" }}>
                  🎬 Video tour
                </span>
              )}
              {(listing as any).verified && (
                <span className="text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1" style={{ background: "rgba(34,197,94,0.85)", color: "white" }}>
                  ✓ Verified
                </span>
              )}
            </div>

            {/* Photo label bottom left */}
            <div className="absolute bottom-4 left-4 text-xs px-2.5 py-1 rounded-full" style={{ background: "rgba(0,0,0,0.5)", color: "rgba(255,255,255,0.8)" }}>
              {PHOTO_LABELS[activeImg] ?? `Photo ${activeImg + 1}`}
            </div>

            {/* Photo counter bottom right */}
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

          {/* Thumbnail strip with labels */}
          {photos.length > 1 && photos.length > 0 && (
            <div className="flex gap-2 px-4 md:px-0 py-3 overflow-x-auto">
              {photos.map((ph, i) => (
                <button key={i} onClick={() => setActiveImg(i)}
                  className="flex-shrink-0 rounded-lg overflow-hidden transition-all flex flex-col gap-1 items-center"
                  style={{ width: 72 }}>
                  <div className="w-full rounded-lg overflow-hidden" style={{ height: 52, outline: i === activeImg ? "2px solid var(--h-accent)" : "2px solid transparent", outlineOffset: 2 }}>
                    <img src={ph} alt="" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[9px] leading-tight text-center truncate w-full" style={{ color: i === activeImg ? "var(--h-accent)" : "rgba(255,255,255,0.35)" }}>
                    {PHOTO_LABELS[i] ?? `Photo ${i + 1}`}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Highlights strip ─────────────────────────────── */}
      {listing.highlights && listing.highlights.length > 0 && (
        <div style={{ background: "var(--h-accent-light)", borderBottom: "1px solid var(--h-border)" }}>
          <div className="h-container py-4">
            <div className="flex flex-col sm:flex-row gap-3">
              {listing.highlights.slice(0, 3).map((h, i) => (
                <div key={i} className="flex items-start gap-2.5 flex-1">
                  <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "var(--h-accent)", color: "white" }}>
                    {i + 1}
                  </span>
                  <span className="text-sm font-medium leading-snug" style={{ color: "var(--h-text)" }}>{h}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Main content ─────────────────────────────────── */}
      <div className="h-container py-8 max-w-5xl">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">

          {/* LEFT — details */}
          <div className="lg:col-span-2">

            {/* Title + location */}
            <div className="mb-8">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 mb-3 text-xs font-medium" style={{ color: "var(--h-subtle)" }}>
                <span>{listing.property_type}</span>
                <span>·</span>
                <span style={{ color: forSale ? "var(--h-accent)" : "var(--h-green)", fontWeight: 700 }}>{forSale ? "For Sale" : "To Rent"}</span>
                <span>·</span>
                <span>{listing.area}, {listing.city}{countryObj ? `, ${countryObj.name}` : ""}</span>
              </div>

              <h1 style={{
                fontSize: "clamp(24px, 4vw, 42px)",
                fontWeight: 900,
                letterSpacing: "-0.03em",
                lineHeight: 1.08,
                color: "var(--h-text)",
                fontFamily: isRTL ? arabicFont : undefined,
                direction: isRTL ? "rtl" : undefined,
              }}>
                {listing.title}
              </h1>

              <div className="flex items-center gap-2 mt-3">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ color: "var(--h-accent)" }}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>
                <p className="text-sm font-medium" style={{ color: "var(--h-muted)" }}>{listing.area}, {listing.city}{countryObj ? `, ${countryObj.name}` : ""}</p>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "var(--h-warm)", color: "var(--h-muted)" }}>
                  👁 {views} views
                </span>
              </div>
            </div>

            {/* Premium price + stats strip */}
            <div className="mb-8 rounded-2xl overflow-hidden" style={{ border: "1px solid var(--h-border)" }}>
              {/* Price bar */}
              <div className="px-5 py-4 flex items-center justify-between gap-4" style={{ background: "var(--h-slate)" }}>
                <div>
                  <p style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 900, letterSpacing: "-0.03em", color: "white", lineHeight: 1 }}>{priceStr}</p>
                  <p className="text-xs mt-1 font-medium" style={{ color: "rgba(255,255,255,0.45)" }}>
                    {forSale ? "asking price" : "per calendar month"}
                    {pricePerSqm ? ` · ${formatPrice(pricePerSqm, listing.country || "gb")}/m²` : ""}
                  </p>
                </div>
                <div className="text-right">
                  {isAvailable
                    ? <span className="text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: "var(--h-green)", color: "white" }}>Available now</span>
                    : <span className="text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}>
                        {forSale ? "Handover " : "From "}
                        {new Date(listing.available_from).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
                      </span>
                  }
                </div>
              </div>

              {/* Stat row */}
              <div className="grid divide-x" style={{
                gridTemplateColumns: `repeat(${[listing.size_sqm, listing.bedrooms !== null, listing.furnished].filter(Boolean).length + 1}, 1fr)`,
                borderTop: "1px solid var(--h-border)",
              }}>
                {listing.size_sqm ? (
                  <div className="px-4 py-3 text-center" style={{ borderRight: "1px solid var(--h-border)" }}>
                    <p className="text-lg font-extrabold" style={{ color: "var(--h-text)", letterSpacing: "-0.02em" }}>{listing.size_sqm} m²</p>
                    <p className="text-xs font-medium mt-0.5" style={{ color: "var(--h-subtle)" }}>Floor area</p>
                  </div>
                ) : listing.bedrooms !== null && listing.bedrooms !== undefined && listing.property_type !== "Commercial" ? (
                  <div className="px-4 py-3 text-center" style={{ borderRight: "1px solid var(--h-border)" }}>
                    <p className="text-lg font-extrabold" style={{ color: "var(--h-text)", letterSpacing: "-0.02em" }}>
                      {listing.bedrooms === 0 ? "Studio" : listing.bedrooms}
                    </p>
                    <p className="text-xs font-medium mt-0.5" style={{ color: "var(--h-subtle)" }}>{listing.bedrooms === 0 ? "Open plan" : listing.bedrooms === 1 ? "Bedroom" : "Bedrooms"}</p>
                  </div>
                ) : null}

                <div className="px-4 py-3 text-center" style={{ borderRight: "1px solid var(--h-border)" }}>
                  <p className="text-lg font-extrabold" style={{ color: "var(--h-text)", letterSpacing: "-0.02em" }}>{listing.property_type}</p>
                  <p className="text-xs font-medium mt-0.5" style={{ color: "var(--h-subtle)" }}>Property type</p>
                </div>

                {listing.furnished && (
                  <div className="px-4 py-3 text-center" style={{ borderRight: "1px solid var(--h-border)" }}>
                    <p className="text-lg font-extrabold" style={{ color: "var(--h-text)", letterSpacing: "-0.02em" }}>{listing.furnished.split(" ")[0]}</p>
                    <p className="text-xs font-medium mt-0.5" style={{ color: "var(--h-subtle)" }}>Furnishing</p>
                  </div>
                )}

                <div className="px-4 py-3 text-center">
                  <p className="text-lg font-extrabold" style={{ color: "var(--h-text)", letterSpacing: "-0.02em" }}>
                    {new Date(listing.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                  </p>
                  <p className="text-xs font-medium mt-0.5" style={{ color: "var(--h-subtle)" }}>Listed</p>
                </div>
              </div>
            </div>

            {/* Description */}
            {listing.description && (
              <div className="mb-8">
                <h2 className="text-xl font-extrabold mb-4" style={{ color: "var(--h-text)", letterSpacing: "-0.02em" }}>About this property</h2>
                <div
                  className="leading-relaxed whitespace-pre-line"
                  style={{
                    color: "var(--h-muted)",
                    fontSize: isRTL ? "1.05rem" : "0.95rem",
                    lineHeight: isRTL ? 2 : 1.8,
                    fontFamily: isRTL ? arabicFont : undefined,
                    direction: isRTL ? "rtl" : "ltr",
                    textAlign: isRTL ? "right" : "left",
                    fontWeight: isRTL ? 500 : 400,
                  }}
                >
                  {listing.description}
                </div>
              </div>
            )}

            {/* Features — grouped with icons */}
            {listing.features && listing.features.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-extrabold mb-4" style={{ color: "var(--h-text)", letterSpacing: "-0.02em" }}>Features & amenities</h2>
                <div className="space-y-5">
                  {Object.entries(featureGroups).map(([group, items]) => (
                    <div key={group}>
                      <p className="text-xs font-bold uppercase tracking-wider mb-2.5" style={{ color: "var(--h-muted)" }}>{group}</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {items.map(tag => (
                          <div key={tag} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm" style={{ background: "var(--h-surface)", border: "1px solid var(--h-border)", color: "var(--h-text)" }}>
                            <span className="text-base leading-none flex-shrink-0">{FEATURE_ICONS[tag] ?? "·"}</span>
                            <span className="leading-snug">{tag}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Video tour — only show here if there are also photos (otherwise it's already in the gallery) */}
            {listing.video_url && photos.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-bold mb-3 flex items-center gap-2" style={{ color: "var(--h-text)" }}>
                  🎬 Video tour
                </h2>
                <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--h-border)", aspectRatio: "16/9" }}>
                  <video src={listing.video_url} controls className="w-full h-full object-cover" />
                </div>
              </div>
            )}

            {/* Floor plan */}
            {listing.floor_plan_url && (
              <div className="mb-8">
                <h2 className="text-lg font-bold mb-3 flex items-center gap-2" style={{ color: "var(--h-text)" }}>
                  📐 Floor plan
                </h2>
                <button
                  onClick={() => setFloorPlanOpen(true)}
                  className="w-full rounded-2xl overflow-hidden relative group"
                  style={{ border: "1px solid var(--h-border)", aspectRatio: "4/3" }}
                >
                  <img src={listing.floor_plan_url} alt="Floor plan" className="w-full h-full object-contain" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: "rgba(0,0,0,0.3)" }}>
                    <span className="text-white text-sm font-semibold px-4 py-2 rounded-xl" style={{ background: "rgba(0,0,0,0.6)" }}>View full size</span>
                  </div>
                </button>
              </div>
            )}

            {/* Floor plan lightbox */}
            {floorPlanOpen && listing.floor_plan_url && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.85)" }}
                onClick={() => setFloorPlanOpen(false)}>
                <img src={listing.floor_plan_url} alt="Floor plan" className="max-w-full max-h-full rounded-2xl" />
              </div>
            )}

            {/* Map */}
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

            {/* Listed by — with verified badge + company + socials */}
            {owner && (
              <div className="p-4 rounded-xl mb-6" style={{ background: "var(--h-surface)", border: "1px solid var(--h-border)" }}>
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center font-extrabold text-lg flex-shrink-0" style={{ background: "var(--h-accent-light)", color: "var(--h-accent)" }}>
                    {owner.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-semibold text-sm" style={{ color: "var(--h-text)" }}>
                        {listing.company_name ? listing.company_name : `Listed by ${owner.name}`}
                      </p>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(34,197,94,0.12)", color: "#16a34a" }}>
                        <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                        Verified
                      </span>
                    </div>
                    {listing.company_name && (
                      <p className="text-xs" style={{ color: "var(--h-muted)" }}>Agent: {owner.name}</p>
                    )}
                    <p className="text-xs" style={{ color: "var(--h-subtle)" }}>Responds within 24 hours</p>
                  </div>
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: "var(--h-green)" }} />
                </div>
                {/* Social links */}
                {(listing.facebook_url || listing.instagram_url || owner.whatsapp) && (
                  <div className="flex flex-wrap gap-2 pt-3" style={{ borderTop: "1px solid var(--h-border)" }}>
                    {owner.whatsapp && (
                      <a href={`https://wa.me/${owner.whatsapp.replace(/\D/g,"")}`} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg"
                        style={{ background: "#25D36620", color: "#25D366" }}>
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        WhatsApp
                      </a>
                    )}
                    {listing.facebook_url && (
                      <a href={listing.facebook_url} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg"
                        style={{ background: "#1877F220", color: "#1877F2" }}>
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                        Facebook
                      </a>
                    )}
                    {listing.instagram_url && (
                      <a href={listing.instagram_url} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg"
                        style={{ background: "#E114741A", color: "#E11474" }}>
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                        Instagram
                      </a>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Share */}
            <div>
              <h2 className="text-sm font-bold mb-2" style={{ color: "var(--h-text)" }}>Share this listing</h2>
              <ShareButtons title={`${listing.title} — ${priceStr}${priceSuffix} in ${listing.area}, ${listing.city}`} />
            </div>
          </div>

          {/* RIGHT — premium sidebar */}
          <div className="space-y-4">
            <div className="rounded-2xl overflow-hidden sticky top-20" style={{ border: "1px solid var(--h-border)", boxShadow: "0 4px 24px -8px rgba(0,0,0,0.08)" }}>

              {/* Price header */}
              <div className="px-6 py-5" style={{ background: "var(--h-slate)" }}>
                <p style={{ fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 900, letterSpacing: "-0.03em", color: "white", lineHeight: 1 }}>{priceStr}</p>
                <p className="text-xs mt-1 font-medium" style={{ color: "rgba(255,255,255,0.4)" }}>
                  {forSale ? "Asking price" : "Per calendar month"}
                </p>
                <div className="mt-3">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: isAvailable ? "rgba(22,163,74,0.25)" : "rgba(255,255,255,0.1)", color: isAvailable ? "#4ade80" : "rgba(255,255,255,0.6)" }}>
                    {isAvailable ? "✓ Available now" : forSale ? `Handover ${new Date(listing.available_from).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}` : `From ${new Date(listing.available_from).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`}
                  </span>
                </div>
              </div>

              <div className="p-5">
                {/* WhatsApp — always visible, no login required */}
                <a
                  href={`https://wa.me/${whatsappNum.replace(/\D/g, "")}?text=${encodeURIComponent(waMessage)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl font-bold text-sm mb-3 transition-all hover:opacity-90 active:scale-[0.98]"
                  style={{ background: "#25D366", color: "white", fontSize: "0.95rem", letterSpacing: "-0.01em" }}>
                  <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  WhatsApp agent now
                </a>

                {user ? (
                  <>
                    <button onClick={toggleSave}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold mb-4 transition-all"
                      style={{ background: saved ? "var(--h-accent-light)" : "var(--h-warm)", color: saved ? "var(--h-accent)" : "var(--h-muted)", border: "1px solid var(--h-border)" }}>
                      {saved ? "♥ Saved to favourites" : "♡ Save listing"}
                    </button>

                    <div style={{ borderTop: "1px solid var(--h-border)", paddingTop: "1rem" }}>
                      <p className="text-xs font-bold mb-2" style={{ color: "var(--h-text)" }}>Or send an in-app message</p>
                      {enquirySent ? (
                        <div className="p-3 rounded-xl text-sm text-center" style={{ background: "rgba(34,197,94,0.08)", color: "#16a34a", border: "1px solid rgba(34,197,94,0.2)" }}>
                          ✓ Sent — they'll respond via WhatsApp
                        </div>
                      ) : (
                        <form onSubmit={sendEnquiry} className="space-y-2">
                          <textarea
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            rows={3}
                            className="h-input text-sm"
                            placeholder={forSale ? "I'm interested in viewing. Is it still available?" : "I'd like to arrange a viewing. What's your earliest slot?"}
                            onFocus={e => { if (!message) setMessage(e.target.placeholder); }}
                          />
                          {enquiryError && (
                            <p className="text-xs font-medium" style={{ color: "#dc2626" }}>{enquiryError}</p>
                          )}
                          <button type="submit" className="h-btn h-btn-primary w-full justify-center !text-sm">Send enquiry</button>
                        </form>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="pt-3" style={{ borderTop: "1px solid var(--h-border)" }}>
                    <p className="text-xs text-center" style={{ color: "var(--h-muted)" }}>
                      <Link href="/makan/auth" className="font-bold" style={{ color: "var(--h-accent)" }}>Sign up free</Link> to save listings &amp; send in-app messages
                    </p>
                  </div>
                )}
                <p className="text-xs text-center mt-3" style={{ color: "var(--h-subtle)" }}>No fees. Direct contact. Always free.</p>
              </div>
            </div>

            {/* Safety card */}
            <div className="rounded-2xl p-5" style={{ background: "var(--h-surface)", border: "1px solid var(--h-border)" }}>
              <p className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: "var(--h-text)" }}>
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs" style={{ background: "var(--h-green-light)", color: "var(--h-green)" }}>🛡</span>
                Stay safe
              </p>
              <ul className="space-y-2.5">
                {[
                  "Never pay a deposit before viewing in person",
                  "Always get a signed written agreement",
                  "Verify the agent or landlord identity",
                  countryObj?.code === "gb" ? "UK: Ask for EPC, Gas Safety & deposit protection" : null,
                  countryObj?.code === "eg" ? "Egypt: Use a licensed real estate agent" : null,
                  countryObj?.code === "ma" ? "Morocco: Confirm title deed (titre foncier)" : null,
                ].filter(Boolean).map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs leading-relaxed" style={{ color: "var(--h-muted)" }}>
                    <span className="mt-0.5 flex-shrink-0 font-bold" style={{ color: "var(--h-accent)" }}>→</span>
                    {tip}
                  </li>
                ))}
              </ul>
              <Link href="/makan/compliance" className="text-xs font-bold mt-4 block" style={{ color: "var(--h-accent)" }}>
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
              {similar.map(s => {
                const sim = s as Listing;
                return (
                  <Link href={`/makan/listing/${s.id}`} key={s.id} className="h-card group">
                    <div className="aspect-[4/3] overflow-hidden relative" style={{ background: "#e8e5e1" }}>
                      {s.images?.[0] ? (
                        <img src={s.images[0]} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-10 h-10 opacity-20" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
                        </div>
                      )}
                      {sim.video_url && (
                        <span className="absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(232,85,61,0.85)", color: "white" }}>🎬</span>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-semibold truncate mb-0.5 group-hover:text-[var(--h-accent)] transition-colors" style={{ color: "var(--h-text)" }}>{s.title}</p>
                      <p className="text-xs mb-1" style={{ color: "var(--h-muted)" }}>{s.area}{sim.size_sqm ? ` · ${sim.size_sqm} m²` : ""}</p>
                      <p className="font-bold text-sm" style={{ color: "var(--h-accent)" }}>
                        {formatPrice(s.price, (s as Listing).country || "gb")}
                        {sim.listing_type !== "sale" && <span className="text-xs font-normal" style={{ color: "var(--h-subtle)" }}>/mo</span>}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
