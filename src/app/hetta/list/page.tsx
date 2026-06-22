"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useLang } from "@/lib/lang-context";
import { supabase } from "@/lib/supabase";
import { countries, propertyTypes, features as allFeatures } from "@/lib/hetta-config";

export default function ListPropertyPage() {
  const { user, loading: authLoading } = useAuth();
  const { t } = useLang();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    property_type: "",
    title: "",
    address: "",
    area: "",
    country: "gb",
    city: "",
    bedrooms: 1,
    price: 0,
    available_from: "",
    furnished: "Furnished",
    description: "",
    features: [] as string[],
  });

  const [images, setImages] = useState<File[]>([]);
  const [video, setVideo] = useState<File | null>(null);

  const selectedCountry = countries.find(c => c.code === form.country);
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

    if (images.length < 3) { setError("Please upload at least 3 photos. Quality photos are required for your listing to be approved."); return; }
    if (!form.property_type) { setError("Please select a property type."); return; }
    if (!form.title.trim()) { setError("Please add a title."); return; }
    if (!form.city) { setError("Please select a city."); return; }
    if (!form.area.trim()) { setError("Please enter the area/neighbourhood."); return; }
    if (!form.price) { setError("Please enter the monthly rent."); return; }
    if (!form.description || form.description.length < 50) { setError("Please write a description (at least 50 characters)."); return; }

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

    if (video) {
      const ext = video.name.split(".").pop();
      const path = `${user.id}/video-${Date.now()}.${ext}`;
      const { error: uploadErr } = await supabase.storage.from("listing-images").upload(path, video);
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
      status: "pending",
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
          <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--h-text)" }}>{t("list.signinRequired")}</h1>
          <p className="mb-6" style={{ color: "var(--h-muted)" }}>Create a free account to list your property. Takes 30 seconds.</p>
          <Link href="/hetta/auth" className="h-btn h-btn-primary inline-flex">{t("nav.signup")}</Link>
        </div>
      </div>
    );
  }

  return (
    <section className="py-12" style={{ background: "var(--h-surface)" }}>
      <div className="h-container max-w-2xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: "var(--h-text)" }}>{t("list.title")}</h1>
          <p style={{ color: "var(--h-muted)" }}>{t("list.subtitle")}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Property type */}
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: "var(--h-text)" }}>{t("list.whatListing")}</label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {propertyTypes.map(type => (
                <button key={type} type="button" onClick={() => update("property_type", type)}
                  className="h-card !rounded-xl p-3 text-center transition-all text-sm"
                  style={{ borderColor: form.property_type === type ? "var(--h-accent)" : undefined, background: form.property_type === type ? "var(--h-accent-light)" : undefined, color: "var(--h-text)" }}>
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: "var(--h-text)" }}>Listing title *</label>
            <input type="text" value={form.title} onChange={e => update("title", e.target.value)} required className="h-input" placeholder="e.g. Spacious 2-bed flat near city centre" />
          </div>

          {/* Country + City */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: "var(--h-text)" }}>Country *</label>
              <select value={form.country} onChange={e => { update("country", e.target.value); update("city", ""); }} className="h-input">
                {countries.map(c => <option key={c.code} value={c.code}>{c.flag} {c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: "var(--h-text)" }}>City *</label>
              <select value={form.city} onChange={e => update("city", e.target.value)} required className="h-input">
                <option value="">Select city</option>
                {selectedCountry?.cities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: "var(--h-text)" }}>Area / Neighbourhood *</label>
              <input type="text" value={form.area} onChange={e => update("area", e.target.value)} required className="h-input" placeholder="e.g. Erdington" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: "var(--h-text)" }}>Full address (private)</label>
              <input type="text" value={form.address} onChange={e => update("address", e.target.value)} className="h-input" placeholder="Not shown publicly" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: "var(--h-text)" }}>Bedrooms *</label>
              <select value={form.bedrooms} onChange={e => update("bedrooms", +e.target.value)} className="h-input">
                <option value={0}>Studio</option>
                {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: "var(--h-text)" }}>Rent ({selectedCountry?.symbol}) *</label>
              <input type="number" value={form.price || ""} onChange={e => update("price", +e.target.value)} required className="h-input" placeholder="Monthly" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: "var(--h-text)" }}>Available from *</label>
              <input type="date" value={form.available_from} onChange={e => update("available_from", e.target.value)} required className="h-input" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: "var(--h-text)" }}>Furnished?</label>
            <div className="flex gap-2">
              {["Furnished", "Part furnished", "Unfurnished"].map(f => (
                <button key={f} type="button" onClick={() => update("furnished", f)}
                  className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all border"
                  style={{ borderColor: form.furnished === f ? "var(--h-accent)" : "var(--h-border)", background: form.furnished === f ? "var(--h-accent-light)" : "transparent", color: "var(--h-text)" }}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: "var(--h-text)" }}>Description * <span className="font-normal" style={{ color: "var(--h-subtle)" }}>(min 50 characters)</span></label>
            <textarea value={form.description} onChange={e => update("description", e.target.value)} required rows={5} className="h-input" placeholder="Describe the property in detail — rooms, condition, nearby amenities, transport links, what makes it special..." />
            <p className="text-xs mt-1" style={{ color: form.description.length >= 50 ? "var(--h-green)" : "var(--h-subtle)" }}>{form.description.length}/50 characters minimum</p>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: "var(--h-text)" }}>Features</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {allFeatures.map(f => (
                <button key={f} type="button" onClick={() => toggleFeature(f)}
                  className="flex items-center gap-2 text-sm py-2 px-3 rounded-lg border transition-all text-left"
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

          {/* Photos — REQUIRED */}
          <div className="border-t pt-6" style={{ borderColor: "var(--h-border)" }}>
            <label className="block text-sm font-semibold mb-1" style={{ color: "var(--h-text)" }}>{t("list.photos")} *</label>
            <p className="text-xs mb-3" style={{ color: "var(--h-subtle)" }}>{t("list.photosHint")}</p>
            <input
              type="file" accept="image/*" multiple
              onChange={e => setImages(Array.from(e.target.files || []))}
              className="h-input"
            />
            {images.length > 0 && (
              <div className="mt-3">
                <p className="text-xs mb-2" style={{ color: images.length >= 3 ? "var(--h-green)" : "var(--h-accent)" }}>
                  {images.length} photo{images.length > 1 ? "s" : ""} selected {images.length < 3 && `— need ${3 - images.length} more`}
                </p>
                <div className="flex gap-2 flex-wrap">
                  {images.map((img, i) => (
                    <div key={i} className="w-20 h-20 rounded-lg overflow-hidden border" style={{ borderColor: "var(--h-border)" }}>
                      <img src={URL.createObjectURL(img)} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Video — OPTIONAL */}
          <div>
            <label className="block text-sm font-semibold mb-1" style={{ color: "var(--h-text)" }}>{t("list.video")}</label>
            <input
              type="file" accept="video/*"
              onChange={e => setVideo(e.target.files?.[0] || null)}
              className="h-input"
            />
            {video && <p className="text-xs mt-1" style={{ color: "var(--h-green)" }}>Video selected: {video.name}</p>}
          </div>

          {error && <div className="p-4 rounded-xl text-sm font-medium" style={{ background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca" }}>{error}</div>}

          <button type="submit" disabled={submitting || !form.property_type || images.length < 3} className="h-btn h-btn-primary w-full !py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed">
            {submitting ? "Uploading & submitting..." : t("list.publish")}
          </button>
          <p className="text-xs text-center" style={{ color: "var(--h-subtle)" }}>Your listing will be reviewed within 24 hours. Listings without quality photos or complete details won&apos;t be approved.</p>
        </form>
      </div>
    </section>
  );
}
