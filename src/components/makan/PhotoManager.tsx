"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import {
  ACCEPT_ATTR,
  BUCKET,
  MAX_PHOTOS,
  mediaToken,
  nextSortOrder,
  remainingSlots,
  reorder,
  storagePath,
  toMedia,
  triage,
  type MediaItem,
  type MediaQueryRow,
} from "@/lib/makan-media";

/**
 * Adding photos to a listing you own.
 *
 * Reordering is buttons, not drag-and-drop. Drag is nicer with a mouse and
 * unusable with a keyboard, awkward on a phone, and needs a library; "move
 * left / move right" works everywhere and the first photo is the only position
 * most landlords actually care about.
 *
 * Uploads are one at a time on purpose. A landlord on a phone picking twelve
 * photos over a weak connection gets to watch them land one by one, and a
 * failure halfway through leaves the ones that succeeded in place instead of
 * rolling back work they have already waited for.
 */
export function PhotoManager({ spaceId }: { spaceId: string }) {
  const [items, setItems] = useState<MediaItem[] | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [problems, setProblems] = useState<string[]>([]);
  const input = useRef<HTMLInputElement | null>(null);

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from("makan_media")
      .select("id,url,caption,sort_order")
      .eq("space_id", spaceId)
      .eq("kind", "photo")
      .order("sort_order");
    if (error) { setProblems([error.message]); setItems([]); return; }
    setItems(toMedia((data ?? []) as MediaQueryRow[]));
  }, [spaceId]);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch on mount; every setState is behind an await
  useEffect(() => { void load(); }, [load]);

  async function onPick(files: FileList | null) {
    if (!files || !items) return;
    setProblems([]);
    const { accepted, rejected } = triage([...files], items.length);
    if (rejected.length) setProblems(rejected);
    if (input.current) input.current.value = "";

    let order = nextSortOrder(items);
    for (const file of accepted) {
      setBusy(`Uploading ${file.name}…`);
      const path = storagePath(spaceId, file.type, mediaToken());

      const up = await supabase.storage.from(BUCKET).upload(path, file, { contentType: file.type });
      if (up.error) { setProblems(p => [...p, `${file.name}: ${up.error.message}`]); continue; }

      const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
      const ins = await supabase
        .from("makan_media")
        .insert({ space_id: spaceId, url: pub.publicUrl, kind: "photo", sort_order: order++ });

      // The row is what makes the file a photo on the listing. Without it the
      // object is orphaned in the bucket, so take it back out.
      if (ins.error) {
        await supabase.storage.from(BUCKET).remove([path]);
        setProblems(p => [...p, `${file.name}: ${ins.error.message}`]);
      }
    }
    setBusy(null);
    await load();
  }

  async function move(from: number, to: number) {
    if (!items) return;
    const next = reorder(items, from, to);
    setItems(next);                       // optimistic: reordering should feel instant
    setBusy("Saving order…");
    for (const it of next) {
      await supabase.from("makan_media").update({ sort_order: it.sortOrder }).eq("id", it.id);
    }
    setBusy(null);
  }

  async function remove(it: MediaItem) {
    setBusy("Removing…");
    await supabase.from("makan_media").delete().eq("id", it.id);
    // Derive the object path back from the public URL so the file goes too.
    const marker = `/${BUCKET}/`;
    const at = it.url.indexOf(marker);
    if (at >= 0) await supabase.storage.from(BUCKET).remove([it.url.slice(at + marker.length)]);
    setBusy(null);
    await load();
  }

  if (items === null) {
    return <p className="text-sm" style={{ color: "var(--h-muted)" }}>Loading photos…</p>;
  }

  const left = remainingSlots(items.length);

  return (
    <section className="rounded-2xl p-5 mb-8"
             style={{ background: "var(--h-surface)", border: "1px solid var(--h-border)" }}>
      <div className="flex items-baseline justify-between gap-3 mb-1">
        <h2 className="text-lg font-bold" style={{ color: "var(--h-text)" }}>Photos</h2>
        <span className="text-xs" style={{ color: "var(--h-subtle)" }}>
          {items.length} of {MAX_PHOTOS}
        </span>
      </div>
      <p className="text-sm mb-4" style={{ color: "var(--h-muted)" }}>
        The first photo is the one people see in search. Everything else they swipe through.
      </p>

      {items.length > 0 && (
        <ul className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-4 list-none p-0">
          {items.map((it, idx) => (
            <li key={it.id} className="relative rounded-xl overflow-hidden"
                style={{ aspectRatio: "1 / 1", background: "var(--h-warm)" }}>
              <Image src={it.url} alt={it.caption ?? `Photo ${idx + 1}`} fill sizes="140px"
                     className="object-cover" />
              {idx === 0 && (
                <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[10px] font-bold"
                      style={{ background: "var(--h-accent)", color: "#ffffff" }}>Cover</span>
              )}
              <div className="absolute bottom-0 left-0 right-0 flex justify-between"
                   style={{ background: "rgba(0,0,0,0.55)" }}>
                <button type="button" onClick={() => move(idx, idx - 1)} disabled={idx === 0}
                        aria-label={`Move photo ${idx + 1} earlier`}
                        style={{ color: "#fff", background: "none", border: "none", padding: "4px 8px",
                                 opacity: idx === 0 ? 0.35 : 1 }}>←</button>
                <button type="button" onClick={() => remove(it)} aria-label={`Remove photo ${idx + 1}`}
                        style={{ color: "#fff", background: "none", border: "none", padding: "4px 8px" }}>✕</button>
                <button type="button" onClick={() => move(idx, idx + 1)} disabled={idx === items.length - 1}
                        aria-label={`Move photo ${idx + 1} later`}
                        style={{ color: "#fff", background: "none", border: "none", padding: "4px 8px",
                                 opacity: idx === items.length - 1 ? 0.35 : 1 }}>→</button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <input ref={input} type="file" accept={ACCEPT_ATTR} multiple className="sr-only"
             id="makan-photo-input" onChange={e => onPick(e.target.files)} disabled={left === 0} />
      <label htmlFor="makan-photo-input"
             className="h-btn h-btn-secondary !py-2 !text-sm inline-block cursor-pointer"
             style={{ opacity: left === 0 ? 0.5 : 1 }}>
        {items.length === 0 ? "Add photos" : `Add more (${left} left)`}
      </label>

      {busy && <p className="text-sm mt-3" style={{ color: "var(--h-muted)" }}>{busy}</p>}

      {problems.length > 0 && (
        <ul className="mt-3 text-sm list-none p-0" role="alert" style={{ color: "var(--h-accent-hover)" }}>
          {problems.map(p => <li key={p}>{p}</li>)}
        </ul>
      )}
    </section>
  );
}
