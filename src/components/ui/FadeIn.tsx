"use client";

import { useEffect, useRef, useState } from "react";

type FadeFrom = "bottom" | "top" | "left" | "right" | "scale" | "fade";

interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  from?: FadeFrom;
  distance?: number;
  duration?: number;
  blur?: boolean;
}

/**
 * Reveal on scroll — for content that starts off-screen only.
 *
 * The previous version rendered every child at opacity 0 in the server HTML
 * and made it visible after hydration and an IntersectionObserver callback.
 * The homepage wraps nineteen blocks in this, hero included, so on a phone
 * nothing above the fold painted until all the JavaScript had loaded, parsed
 * and run: Lighthouse measured the largest paint at 4.7s with a render delay
 * of 4.6s on a paragraph that had been in the HTML since 67ms.
 *
 * Now: the server HTML is visible as written. When the observer first fires
 * (asynchronously, after mount), a block that is already on screen is left
 * exactly as it is — no animation, no flash — and a block that is off screen
 * is hidden and animates in when it arrives. Same effect for the reader who
 * scrolls; nothing withheld from the reader who does not, or from a device
 * that is slow to run scripts.
 *
 * Three phases rather than a boolean, because "visible because JS has not
 * decided yet" and "visible because it animated in" need different styles:
 * the first must carry no transition, or the flip to hidden would animate.
 */
type Phase = "static" | "hidden" | "revealed";

export function FadeIn({
  children,
  className = "",
  delay = 0,
  from = "bottom",
  distance = 28,
  duration = 680,
  blur = false,
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>("static");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") return;

    let decided = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!decided) {
          // The initial callback reports where the block is right now. On
          // screen: leave it alone and stop. Off screen: hide it and wait.
          decided = true;
          if (entry.isIntersecting) {
            observer.disconnect();
          } else {
            setPhase("hidden");
          }
          return;
        }
        if (entry.isIntersecting) {
          setPhase("revealed");
          observer.disconnect();
        }
      },
      { threshold: 0.07, rootMargin: "0px 0px -20px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const initialTransform: Record<FadeFrom, string> = {
    bottom: `translateY(${distance}px)`,
    top: `translateY(-${distance}px)`,
    left: `translateX(-${distance}px)`,
    right: `translateX(${distance}px)`,
    scale: `scale(${1 - distance / 400})`,
    fade: "none",
  };

  const transition = [
    `opacity ${duration}ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
    from !== "fade" ? `transform ${duration}ms cubic-bezier(0.22,1,0.36,1) ${delay}ms` : null,
    blur ? `filter ${duration}ms ease ${delay}ms` : null,
  ]
    .filter(Boolean)
    .join(", ");

  const style: React.CSSProperties =
    phase === "static"
      ? {}
      : phase === "hidden"
        ? {
            opacity: 0,
            transform: initialTransform[from],
            filter: blur ? "blur(6px)" : undefined,
          }
        : {
            opacity: 1,
            transform: "none",
            filter: blur ? "blur(0px)" : undefined,
            transition,
          };

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}
