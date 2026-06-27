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
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.07, rootMargin: "0px 0px -20px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const initialTransform: Record<FadeFrom, string> = {
    bottom: `translateY(${distance}px)`,
    top:    `translateY(-${distance}px)`,
    left:   `translateX(-${distance}px)`,
    right:  `translateX(${distance}px)`,
    scale:  `scale(${1 - distance / 400})`,
    fade:   "none",
  };

  const transition = [
    `opacity ${duration}ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
    from !== "fade" ? `transform ${duration}ms cubic-bezier(0.22,1,0.36,1) ${delay}ms` : null,
    blur ? `filter ${duration}ms ease ${delay}ms` : null,
  ].filter(Boolean).join(", ");

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : initialTransform[from],
        filter: blur ? (visible ? "blur(0px)" : "blur(6px)") : undefined,
        transition,
      }}
    >
      {children}
    </div>
  );
}
