"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/makan-config";

interface Listing {
  id: string;
  title: string;
  property_type: string;
  price: number;
  city: string;
  area: string;
  status: string;
  created_at: string;
  /** Optional: rows predate the multi-market columns, so may be absent. */
  country?: string | null;
}

// favourites is selected as "*, listing:listings(*)"
interface Favourite {
  id: string;
  listing: Listing | null;
}

interface Enquiry {
  id: string;
  message: string;
  read: boolean;
  created_at: string;
  listing_id: string;
  sender: { name: string; } | null;
  listing: { title: string; } | null;
}

export default function DashboardPage() {
  const { user, profile, loading: authLoading, signOut } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [favourites, setFavourites] = useState<Favourite[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchData = useCallback(async () => {
    if (!user) return;

    const [listingsRes, enquiriesRes, favsRes] = await Promise.all([
      supabase.from("listings").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      supabase.from("enquiries").select("*, sender:profiles!enquiries_sender_id_fkey(name), listing:listings!enquiries_listing_id_fkey(title)").eq("recipient_id", user.id).order("created_at", { ascending: false }).limit(20),
      supabase.from("favourites").select("*, listing:listings(*)").eq("user_id", user.id),
    ]);

    setListings(listingsRes.data || []);
    setEnquiries(enquiriesRes.data || []);
    setFavourites(favsRes.data || []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push("/makan/auth"); return; }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetchData is an async fetch; its setState calls run after the await, not during render
    fetchData();
  }, [user, authLoading, router, fetchData]);

  async function deleteListing(id: string) {
    await supabase.from("listings").delete().eq("id", id);
    setListings(prev => prev.filter(l => l.id !== id));
  }

  async function toggleStatus(id: string, current: string) {
    const newStatus = current === "active" ? "inactive" : "active";
    await supabase.from("listings").update({ status: newStatus }).eq("id", id);
    setListings(prev => prev.map(l => l.id === id ? { ...l, status: newStatus } : l));
  }

  if (authLoading || loading) {
    return <div className="py-20 text-center" style={{ color: "var(--h-muted)" }}>Loading...</div>;
  }

  if (!user) return null;

  return (
    <div className="py-8" style={{ background: "var(--h-bg)" }}>
      <div className="h-container max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "var(--h-text)" }}>Dashboard</h1>
            <p className="text-sm" style={{ color: "var(--h-muted)" }}>Welcome back, {profile?.name}</p>
          </div>
          <div className="flex gap-3">
            <Link href="/makan/messages" className="h-btn h-btn-secondary text-sm !py-2 relative">
              Messages
              {enquiries.filter(e => !e.read).length > 0 && (
                <span style={{ position: "absolute", top: -6, right: -6, fontSize: 9, fontWeight: 800, background: "var(--h-accent)", color: "white", borderRadius: 20, padding: "1px 5px", minWidth: 16, textAlign: "center" }}>
                  {enquiries.filter(e => !e.read).length}
                </span>
              )}
            </Link>
            <Link href="/makan/list" className="h-btn h-btn-primary text-sm !py-2">New listing</Link>
            <Link href="/makan/settings" className="h-btn h-btn-secondary text-sm !py-2">Settings</Link>
            <button onClick={signOut} className="h-btn h-btn-secondary text-sm !py-2">Sign out</button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="h-card !rounded-xl p-5 text-center">
            <p className="text-2xl font-bold" style={{ color: "var(--h-text)" }}>{listings.length}</p>
            <p className="text-xs" style={{ color: "var(--h-muted)" }}>Listings</p>
          </div>
          <div className="h-card !rounded-xl p-5 text-center">
            <p className="text-2xl font-bold" style={{ color: "var(--h-accent)" }}>{enquiries.filter(e => !e.read).length}</p>
            <p className="text-xs" style={{ color: "var(--h-muted)" }}>New enquiries</p>
          </div>
          <div className="h-card !rounded-xl p-5 text-center">
            <p className="text-2xl font-bold" style={{ color: "var(--h-text)" }}>{favourites.length}</p>
            <p className="text-xs" style={{ color: "var(--h-muted)" }}>Saved</p>
          </div>
        </div>

        {/* My Listings */}
        <div className="mb-10">
          <h2 className="font-bold mb-4" style={{ color: "var(--h-text)" }}>My listings</h2>
          {listings.length === 0 ? (
            <div className="h-card !rounded-xl p-8 text-center">
              <p className="mb-3" style={{ color: "var(--h-muted)" }}>You haven&apos;t listed any properties yet.</p>
              <Link href="/makan/list" className="h-btn h-btn-primary inline-flex text-sm">Create your first listing</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {listings.map(l => (
                <div key={l.id} className="h-card !rounded-xl p-4 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="h-badge text-xs" style={{ background: l.status === "active" ? "var(--h-green-light)" : "var(--h-warm)", color: l.status === "active" ? "var(--h-green)" : "var(--h-muted)" }}>{l.status}</span>
                      <span className="text-xs" style={{ color: "var(--h-subtle)" }}>{l.property_type}</span>
                    </div>
                    <p className="font-semibold text-sm truncate" style={{ color: "var(--h-text)" }}>{l.title}</p>
                    <p className="text-xs" style={{ color: "var(--h-muted)" }}>{l.area}, {l.city} · {formatPrice(l.price, l.country || "gb")}/mo</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => toggleStatus(l.id, l.status)} className="text-xs font-medium px-3 py-1.5 rounded-lg" style={{ background: "var(--h-warm)", color: "var(--h-muted)" }}>
                      {l.status === "active" ? "Pause" : "Activate"}
                    </button>
                    <button onClick={() => deleteListing(l.id)} className="text-xs font-medium px-3 py-1.5 rounded-lg" style={{ background: "#fef2f2", color: "#dc2626" }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Enquiries */}
        <div className="mb-10">
          <h2 className="font-bold mb-4" style={{ color: "var(--h-text)" }}>Recent enquiries</h2>
          {enquiries.length === 0 ? (
            <div className="h-card !rounded-xl p-8 text-center">
              <p style={{ color: "var(--h-muted)" }}>No enquiries yet. They&apos;ll appear here when tenants message you.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {enquiries.map(e => (
                <div key={e.id} className="h-card !rounded-xl p-4" style={{ borderLeftWidth: "3px", borderLeftColor: e.read ? "var(--h-border)" : "var(--h-accent)" }}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm" style={{ color: "var(--h-text)" }}>{e.sender?.name || "Someone"}</span>
                    <span className="text-xs" style={{ color: "var(--h-subtle)" }}>about {e.listing?.title || "a listing"}</span>
                    {!e.read && <span className="h-badge text-xs" style={{ background: "var(--h-accent-light)", color: "var(--h-accent)" }}>New</span>}
                  </div>
                  <p className="text-sm" style={{ color: "var(--h-muted)" }}>{e.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Saved */}
        {favourites.length > 0 && (
          <div>
            <h2 className="font-bold mb-4" style={{ color: "var(--h-text)" }}>Saved listings</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {favourites.map(f => (
                <Link key={f.id} href={`/makan/listing/${f.listing?.id}`} className="h-card !rounded-xl p-4">
                  <p className="font-semibold text-sm" style={{ color: "var(--h-text)" }}>{f.listing?.title}</p>
                  <p className="text-xs" style={{ color: "var(--h-muted)" }}>{f.listing?.area}, {f.listing?.city} · £{f.listing?.price}/mo</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
