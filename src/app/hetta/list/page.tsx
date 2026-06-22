"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";

export default function ListPropertyPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    property_type: "",
    title: "",
    address: "",
    area: "",
    city: "Birmingham",
    bedrooms: 1,
    price: 0,
    available_from: "",
    furnished: "Furnished",
    description: "",
    features: [] as string[],
  });

  const [images, setImages] = useState<File[]>([]);

  const update = (key: string, value: any) => setForm(prev => ({ ...prev, [key]: value }));

  const toggleFeature = (f: string) => {
    setForm(prev => ({
      ...prev,
      features: prev.features.includes(f) ? prev.features.filter(x => x !== f) : [...prev.features, f],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { router.push("/hetta/auth"); return; }
    setSubmitting(true);
    setError("");

    let imageUrls: string[] = [];
    for (const file of images) {
      const ext = file.name.split(".").pop();
      const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadErr } = await supabase.storage.from("listing-images").upload(path, file);
      if (!uploadErr) {
        const { data } = supabase.storage.from("listing-images").getPublicUrl(path);
        imageUrls.push(data.publicUrl);
      }
    }

    const { error: insertErr } = await supabase.from("listings").insert({
      user_id: user.id,
      title: form.title,
      description: form.description,
      property_type: form.property_type,
      bedrooms: form.bedrooms,
      price: form.price,
      city: form.city,
      area: form.area,
      address: form.address,
      available_from: form.available_from || new Date().toISOString().split("T")[0],
      furnished: form.furnished,
      features: form.features,
      images: imageUrls,
      status: "active",
    });

    if (insertErr) {
      setError(insertErr.message);
      setSubmitting(false);
    } else {
      router.push("/hetta/dashboard");
    }
  };

  if (authLoading) return <div className="py-20 text-center" style={{ color: "var(--h-muted)" }}>Loading...</div>;

  if (!user) {
    return (
      <div className="py-20 text-center">
        <div className="h-container max-w-md">
          <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: "var(--h-accent-light)", color: "var(--h-accent)" }}>
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>
          </div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--h-text)" }}>Sign in to list</h1>
          <p className="mb-6" style={{ color: "var(--h-muted)" }}>Create a free account to list your property. Takes 30 seconds.</p>
          <Link href="/hetta/auth" className="h-btn h-btn-primary inline-flex">Sign up / Log in</Link>
        </div>
      </div>
    );
  }

  return (
    <section className="py-12" style={{ background: "var(--h-surface)" }}>
      <div className="h-container max-w-2xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 text-sm font-semibold" style={{ background: "var(--h-green-light)", color: "var(--h-green)" }}>
            <span className="w-2 h-2 rounded-full" style={{ background: "var(--h-green)" }} />
            100% free
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: "var(--h-text)" }}>List your property</h1>
          <p style={{ color: "var(--h-muted)" }}>Your listing goes live instantly. Edit or remove it anytime from your dashboard.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Property type */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: "var(--h-text)" }}>What are you listing?</label>
            <div className="grid grid-cols-3 gap-3">
              {["Room", "Flat", "House"].map(type => (
                <button key={type} type="button" onClick={() => update("property_type", type)}
                  className="h-card !rounded-xl p-4 text-center transition-all"
                  style={{ borderColor: form.property_type === type ? "var(--h-accent)" : undefined, background: form.property_type === type ? "var(--h-accent-light)" : undefined }}>
                  <p className="text-sm font-semibold" style={{ color: "var(--h-text)" }}>{type}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: "var(--h-text)" }}>Listing title</label>
            <input type="text" value={form.title} onChange={e => update("title", e.target.value)} required className="h-input" placeholder="e.g. Spacious 2-bed flat near city centre" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: "var(--h-text)" }}>Area</label>
              <input type="text" value={form.area} onChange={e => update("area", e.target.value)} required className="h-input" placeholder="e.g. Erdington" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: "var(--h-text)" }}>City</label>
              <select value={form.city} onChange={e => update("city", e.target.value)} className="h-input">
                <option>Birmingham</option>
                <option>Nottingham</option>
                <option>Derby</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: "var(--h-text)" }}>Full address (private — not shown publicly)</label>
            <input type="text" value={form.address} onChange={e => update("address", e.target.value)} className="h-input" placeholder="Full address for your records" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: "var(--h-text)" }}>Bedrooms</label>
              <select value={form.bedrooms} onChange={e => update("bedrooms", +e.target.value)} className="h-input">
                <option value={0}>Studio</option>
                {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: "var(--h-text)" }}>Monthly rent (£)</label>
              <input type="number" value={form.price || ""} onChange={e => update("price", +e.target.value)} required className="h-input" placeholder="e.g. 850" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: "var(--h-text)" }}>Available from</label>
              <input type="date" value={form.available_from} onChange={e => update("available_from", e.target.value)} className="h-input" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: "var(--h-text)" }}>Furnished?</label>
              <select value={form.furnished} onChange={e => update("furnished", e.target.value)} className="h-input">
                <option>Furnished</option>
                <option>Part furnished</option>
                <option>Unfurnished</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: "var(--h-text)" }}>Description</label>
            <textarea value={form.description} onChange={e => update("description", e.target.value)} required rows={4} className="h-input" placeholder="Describe the property — what makes it great?" />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: "var(--h-text)" }}>Features</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {["Parking", "Garden", "Pets OK", "Bills included", "En-suite", "Washing machine", "Dishwasher", "EPC C+", "Near transport"].map(f => (
                <button key={f} type="button" onClick={() => toggleFeature(f)}
                  className="flex items-center gap-2 text-sm py-2 px-3 rounded-lg border transition-all"
                  style={{
                    borderColor: form.features.includes(f) ? "var(--h-accent)" : "var(--h-border)",
                    background: form.features.includes(f) ? "var(--h-accent-light)" : "transparent",
                    color: form.features.includes(f) ? "var(--h-accent)" : "var(--h-muted)",
                  }}>
                  {form.features.includes(f) ? "✓" : "+"} {f}
                </button>
              ))}
            </div>
          </div>

          {/* Image upload */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: "var(--h-text)" }}>Photos (optional)</label>
            <input
              type="file" accept="image/*" multiple
              onChange={e => setImages(Array.from(e.target.files || []))}
              className="h-input"
            />
            {images.length > 0 && <p className="text-xs mt-1" style={{ color: "var(--h-green)" }}>{images.length} photo{images.length > 1 ? "s" : ""} selected</p>}
          </div>

          {error && <div className="p-3 rounded-lg text-sm" style={{ background: "#fef2f2", color: "#dc2626" }}>{error}</div>}

          <button type="submit" disabled={submitting || !form.property_type} className="h-btn h-btn-primary w-full !py-4 text-lg">
            {submitting ? "Publishing..." : "Publish listing — it's free"}
          </button>
        </form>
      </div>
    </section>
  );
}
