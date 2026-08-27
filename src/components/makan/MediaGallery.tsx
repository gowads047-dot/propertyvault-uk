"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { positionLabel, stepIndex, swipeDelta, type MediaItem } from "@/lib/makan-media";

/**
 * The swipe gallery.
 *
 * The brief asked for photos that behave "like reels" — so this is full-bleed,
 * swipeable, and moves one photo per gesture, which is the interaction people
 * already have in their hands. It is not a reel: there is no generated video,
 * no music and no invented frames, and nothing here calls it one.
 *
 * Accessibility is not a second pass on this. A gallery that can only be
 * operated by dragging excludes anyone using a keyboard, so arrow keys move it,
 * the buttons are real buttons, and the position is announced rather than only
 * drawn as dots.
 */
export function MediaGallery({ items, alt }: { items: MediaItem[]; alt: string }) {
  const [i, setI] = useState(0);
  const startX = useRef<number | null>(null);
  const frame = useRef<HTMLDivElement | null>(null);

  const go = useCallback((delta: number) => {
    setI(prev => stepIndex(prev, delta, items.length));
  }, [items.length]);

  // Arrow keys, but only while the gallery has focus — hijacking them for the
  // whole page would break scrolling everywhere else on the listing.
  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
      if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
    };
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, [go]);

  if (items.length === 0) return null;

  const current = items[i];

  return (
    <div className="mb-6">
      <div
        ref={frame}
        tabIndex={0}
        role="group"
        aria-roledescription="carousel"
        aria-label={`Photos of ${alt}`}
        className="relative overflow-hidden rounded-2xl select-none focus:outline-none focus-visible:ring-2"
        style={{
          background: "var(--h-ink)",
          aspectRatio: "4 / 5",
          maxHeight: "70vh",
          // @ts-expect-error -- CSS custom property for the focus ring colour
          "--tw-ring-color": "var(--h-accent)",
        }}
        onTouchStart={e => { startX.current = e.touches[0].clientX; }}
        onTouchEnd={e => {
          if (startX.current === null) return;
          const d = swipeDelta(startX.current, e.changedTouches[0].clientX);
          startX.current = null;
          if (d !== 0) go(d);
        }}
        onPointerDown={e => { if (e.pointerType === "mouse") startX.current = e.clientX; }}
        onPointerUp={e => {
          if (e.pointerType !== "mouse" || startX.current === null) return;
          const d = swipeDelta(startX.current, e.clientX);
          startX.current = null;
          if (d !== 0) go(d);
        }}
      >
        {/* Only the current photo is rendered eagerly. A listing with twenty
            photos should not cost twenty downloads before the first is seen. */}
        {items.map((m, idx) => (
          <div
            key={m.id}
            aria-hidden={idx !== i}
            className="absolute inset-0 transition-opacity duration-200"
            style={{ opacity: idx === i ? 1 : 0, pointerEvents: idx === i ? "auto" : "none" }}
          >
            <Image
              src={m.url}
              alt={m.caption ?? `${alt} — photo ${idx + 1} of ${items.length}`}
              fill
              sizes="(max-width: 768px) 100vw, 640px"
              className="object-cover"
              priority={idx === 0}
              draggable={false}
            />
          </div>
        ))}

        {items.length > 1 && (
          <>
            <button
              type="button" onClick={() => go(-1)} aria-label="Previous photo"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full grid place-items-center text-xl"
              style={{ background: "rgba(0,0,0,0.55)", color: "#ffffff", border: "none" }}
            >‹</button>
            <button
              type="button" onClick={() => go(1)} aria-label="Next photo"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full grid place-items-center text-xl"
              style={{ background: "rgba(0,0,0,0.55)", color: "#ffffff", border: "none" }}
            >›</button>

            <div
              className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold"
              style={{ background: "rgba(0,0,0,0.55)", color: "#ffffff" }}
            >
              {positionLabel(i, items.length)}
            </div>
          </>
        )}

        {current.caption && (
          <p
            className="absolute left-0 right-0 bottom-0 px-4 py-3 text-sm"
            style={{ background: "linear-gradient(transparent, rgba(0,0,0,0.75))", color: "#ffffff" }}
          >
            {current.caption}
          </p>
        )}
      </div>

      {/* Announced for screen readers, drawn as dots for everyone else. */}
      <p className="sr-only" aria-live="polite">{positionLabel(i, items.length)}</p>

      {items.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-3">
          {items.map((m, idx) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setI(idx)}
              aria-label={`Go to photo ${idx + 1}`}
              aria-current={idx === i}
              className="rounded-full transition-all"
              style={{
                width: idx === i ? 20 : 7, height: 7, border: "none",
                background: idx === i ? "var(--h-accent)" : "var(--h-border)",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
