import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { formatPrice } from "@/lib/makan-config";

type Props = { params: Promise<{ id: string }>; children: React.ReactNode };

/**
 * What the server can know about a listing, and what it does with it.
 *
 * The page itself is a client component: it fetches the listing with the
 * visitor's own session, so an owner can open their unpublished draft. That
 * also meant the server could say nothing about the URL — every
 * /makan/listing/<anything>/ answered 200 with the site's default title,
 * including /makan/listing/sample-3/, which Google duly indexed.
 *
 * Now, with the anon key (what a crawler and a stranger get):
 *   - an id that is not a UUID cannot exist and is a real 404;
 *   - a UUID the public cannot see is left to the page — it may be an
 *     owner's draft — but marked noindex so it is not a soft 404 to Google;
 *   - a public listing gets its own title, description and canonical.
 *
 * cache() so generateMetadata and the layout share one query per request.
 */
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type PublicListing = {
  title: string | null;
  city: string | null;
  area: string | null;
  price: number | null;
  property_type: string | null;
  bedrooms: number | null;
  listing_type: string | null;
  country: string | null;
  description: string | null;
};

const publicListing = cache(async (id: string): Promise<PublicListing | null | "invalid"> => {
  if (!UUID.test(id)) return "invalid";
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  const { data } = await createClient(url, key)
    .from("listings")
    .select("title, city, area, price, property_type, bedrooms, listing_type, country, description")
    .eq("id", id)
    .eq("status", "active")
    .maybeSingle();
  return (data as PublicListing | null) ?? null;
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const listing = await publicListing(id);
  const canonical = `https://www.propertyvaultuk.co.uk/makan/listing/${id}/`;

  if (listing === "invalid") return { title: "Listing not found" };
  if (!listing) {
    return { title: "Listing", robots: { index: false, follow: false }, alternates: { canonical } };
  }

  const where = [listing.area, listing.city].filter(Boolean).join(", ");
  const price = listing.price != null ? formatPrice(listing.price, listing.country ?? "gb") : null;
  const priceText = price ? (listing.listing_type === "sale" ? price : `${price}/month`) : null;
  const what = [listing.bedrooms != null ? `${listing.bedrooms}-bed` : null, listing.property_type?.toLowerCase()]
    .filter(Boolean)
    .join(" ");
  const title = [listing.title, where].filter(Boolean).join(" — ") || "Listing";
  const description = [what, where ? `in ${where}` : null, priceText ? `· ${priceText}` : null]
    .filter(Boolean)
    .join(" ")
    .concat(listing.description ? ` — ${listing.description.slice(0, 120).trim()}` : "");

  return {
    title,
    description: description || undefined,
    alternates: { canonical },
    openGraph: { title, description: description || undefined, url: canonical, type: "website" },
  };
}

export default async function ListingLayout({ params, children }: Props) {
  const { id } = await params;
  if ((await publicListing(id)) === "invalid") notFound();
  return <>{children}</>;
}
