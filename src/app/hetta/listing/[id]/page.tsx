"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

const allListings: Record<string, { title: string; type: string; beds: number; price: number; city: string; area: string; available: string; tags: string[]; desc: string }> = {
  "1": { title: "Modern 2-bed apartment, Jewellery Quarter", type: "Flat", beds: 2, price: 950, city: "Birmingham", area: "Jewellery Quarter", available: "Now", tags: ["Furnished", "Parking"], desc: "A beautifully presented 2-bedroom apartment in the heart of the Jewellery Quarter. Open-plan living with modern kitchen, two double bedrooms, bathroom with shower. Allocated parking space included. 5-minute walk to tram stop and city centre. EPC rating C." },
  "2": { title: "Spacious double room in shared house", type: "Room", beds: 1, price: 450, city: "Nottingham", area: "Lenton", available: "1 Jul", tags: ["Bills included", "Students"], desc: "Large double room in a well-maintained 4-bed shared house. All bills included (gas, electric, water, wifi). Shared kitchen, bathroom, and living room. 10-minute walk to University of Nottingham. Ideal for students or young professionals." },
  "3": { title: "Renovated 3-bed terraced house", type: "House", beds: 3, price: 850, city: "Derby", area: "Normanton", available: "Now", tags: ["Garden", "Pets OK"], desc: "Recently renovated 3-bedroom terraced house. New kitchen, new bathroom, new boiler. Rear garden. Pets considered. Close to city centre and Derby Royal Hospital. EPC rating D. Available immediately." },
  "4": { title: "Studio flat near city centre", type: "Flat", beds: 0, price: 595, city: "Birmingham", area: "Digbeth", available: "15 Jul", tags: ["Furnished", "Bills included"], desc: "Compact but well-designed studio flat in Digbeth's creative quarter. Fully furnished with kitchenette, modern shower room, and built-in storage. All bills included. 10-minute walk to Bullring and New Street station." },
  "5": { title: "Large double room, professional house share", type: "Room", beds: 1, price: 500, city: "Nottingham", area: "West Bridgford", available: "Now", tags: ["Professionals", "En-suite"], desc: "Generous en-suite double room in a professional house share. Shared kitchen and living areas kept to a high standard. Quiet residential street in West Bridgford. Off-street parking. Working professionals only." },
  "6": { title: "4-bed semi-detached, family home", type: "House", beds: 4, price: 1200, city: "Birmingham", area: "Edgbaston", available: "1 Aug", tags: ["Garden", "Garage", "Unfurnished"], desc: "Spacious 4-bedroom semi-detached family home in Edgbaston. Two reception rooms, large kitchen-diner, family bathroom and separate WC. Garage and rear garden. Near good schools and Edgbaston Reservoir. Unfurnished." },
  "7": { title: "Cosy single room near university", type: "Room", beds: 1, price: 380, city: "Derby", area: "Allestree", available: "Now", tags: ["Students", "Bills included"], desc: "Comfortable single room in a friendly shared house near University of Derby. All bills included. Shared kitchen and bathroom. Quiet residential area with good bus links to campus and city centre." },
  "8": { title: "Refurbished 1-bed flat, tram link", type: "Flat", beds: 1, price: 650, city: "Nottingham", area: "Hyson Green", available: "Now", tags: ["Furnished", "Transport"], desc: "Newly refurbished 1-bedroom flat. Modern kitchen, bright living room, double bedroom, and bathroom with shower. 2-minute walk to tram stop (direct to city centre in 8 minutes). Fully furnished. EPC rating C." },
};

export default function ListingPage() {
  const { id } = useParams();
  const listing = allListings[id as string];

  if (!listing) {
    return (
      <div className="py-20 text-center h-container">
        <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--h-text)" }}>Listing not found</h1>
        <p style={{ color: "var(--h-muted)" }}>This listing may have been removed or the URL is incorrect.</p>
        <Link href="/hetta" className="h-btn h-btn-primary mt-6 inline-flex">Browse all listings</Link>
      </div>
    );
  }

  const bgColor = listing.type === "Room" ? "#e8e0d6" : listing.type === "Flat" ? "#d6dfe8" : "#d6e8db";

  return (
    <div className="py-8">
      <div className="h-container max-w-4xl">
        <Link href="/hetta" className="inline-flex items-center gap-1 text-sm font-medium mb-6" style={{ color: "var(--h-muted)" }}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
          Back to listings
        </Link>

        {/* Image area */}
        <div className="rounded-2xl overflow-hidden mb-8 aspect-[16/7] flex items-center justify-center" style={{ background: bgColor }}>
          <div className="text-center">
            <svg className="w-16 h-16 mx-auto opacity-20 mb-2" viewBox="0 0 24 24" fill="currentColor">
              {listing.type === "Room" && <path d="M7 14c1.66 0 3-1.34 3-3S8.66 8 7 8s-3 1.34-3 3 1.34 3 3 3zm12-7h-8v8H3V5H1v15h2v-3h18v3h2V10c0-2.21-1.79-4-4-4z"/>}
              {listing.type === "Flat" && <path d="M17 11V3H7v4H3v14h8v-4h2v4h8V11h-4zM7 19H5v-2h2v2zm0-4H5v-2h2v2zm0-4H5V9h2v2zm4 4H9v-2h2v2zm0-4H9V9h2v2zm0-4H9V5h2v2zm4 8h-2v-2h2v2zm0-4h-2V9h2v2zm0-4h-2V5h2v2zm4 12h-2v-2h2v2zm0-4h-2v-2h2v2z"/>}
              {listing.type === "House" && <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>}
            </svg>
            <p className="text-sm opacity-30">Photos coming soon</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="h-badge" style={{ background: "var(--h-warm)", color: "var(--h-muted)" }}>{listing.type}</span>
              {listing.available === "Now" && <span className="h-badge" style={{ background: "var(--h-green-light)", color: "var(--h-green)" }}>Available now</span>}
              {listing.available !== "Now" && <span className="h-badge" style={{ background: "var(--h-warm)", color: "var(--h-muted)" }}>Available {listing.available}</span>}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: "var(--h-text)" }}>{listing.title}</h1>
            <p className="text-sm mb-6" style={{ color: "var(--h-muted)" }}>{listing.area}, {listing.city}</p>

            {/* Key details */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="h-card !rounded-xl p-4 text-center">
                <p className="text-2xl font-bold" style={{ color: "var(--h-text)" }}>£{listing.price}</p>
                <p className="text-xs" style={{ color: "var(--h-muted)" }}>per month</p>
              </div>
              <div className="h-card !rounded-xl p-4 text-center">
                <p className="text-2xl font-bold" style={{ color: "var(--h-text)" }}>{listing.beds === 0 ? "Studio" : listing.beds}</p>
                <p className="text-xs" style={{ color: "var(--h-muted)" }}>{listing.beds === 0 ? "" : listing.beds === 1 ? "bedroom" : "bedrooms"}</p>
              </div>
              <div className="h-card !rounded-xl p-4 text-center">
                <p className="text-2xl font-bold" style={{ color: "var(--h-text)" }}>{listing.type}</p>
                <p className="text-xs" style={{ color: "var(--h-muted)" }}>property type</p>
              </div>
            </div>

            <h2 className="font-bold mb-3" style={{ color: "var(--h-text)" }}>About this property</h2>
            <p className="leading-relaxed mb-6" style={{ color: "var(--h-muted)" }}>{listing.desc}</p>

            <h2 className="font-bold mb-3" style={{ color: "var(--h-text)" }}>Features</h2>
            <div className="flex flex-wrap gap-2 mb-8">
              {listing.tags.map(tag => (
                <span key={tag} className="h-tag">{tag}</span>
              ))}
            </div>
          </div>

          {/* Sidebar — Contact */}
          <div>
            <div className="h-card !rounded-2xl p-6 sticky top-20">
              <p className="font-bold mb-1" style={{ color: "var(--h-text)" }}>Interested?</p>
              <p className="text-sm mb-5" style={{ color: "var(--h-muted)" }}>Contact the landlord directly — no agents, no fees.</p>

              <a
                href={`https://wa.me/4407415721628?text=${encodeURIComponent(`Hi, I'm interested in the listing: ${listing.title} (£${listing.price}/mo in ${listing.area}, ${listing.city})`)}`}
                target="_blank" rel="noopener noreferrer"
                className="h-btn w-full justify-center mb-3"
                style={{ background: "#25D366", color: "white" }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp
              </a>

              <form action="https://formsubmit.co/gowads047@gmail.com" method="POST" className="space-y-3">
                <input type="hidden" name="_subject" value={`Hetta enquiry: ${listing.title}`} />
                <input type="hidden" name="_captcha" value="false" />
                <input type="hidden" name="listing" value={listing.title} />
                <input type="text" name="_honey" style={{ display: "none" }} />
                <input type="text" name="name" required placeholder="Your name" className="h-input" />
                <input type="email" name="email" required placeholder="Email address" className="h-input" />
                <input type="tel" name="phone" placeholder="Phone (optional)" className="h-input" />
                <textarea name="message" rows={3} placeholder="Your message..." className="h-input" defaultValue={`Hi, I'm interested in this ${listing.type.toLowerCase()}. Is it still available?`} />
                <button type="submit" className="h-btn h-btn-primary w-full">Send enquiry</button>
              </form>

              <p className="text-xs text-center mt-4" style={{ color: "var(--h-subtle)" }}>Free to enquire. No sign-up needed.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
