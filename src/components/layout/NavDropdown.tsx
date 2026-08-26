"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import type { NavGroup } from "./nav";

/**
 * A single desktop navigation dropdown.
 *
 * Opens on hover for pointer users and on click/Enter for keyboard users, so
 * the menu is not hover-only. Escape closes it and returns focus to the
 * trigger; moving focus outside the group closes it too. The panel is rendered
 * only when open, so its links stay out of the tab order while collapsed.
 */
export function NavDropdown({
  group,
  isActive,
}: {
  group: NavGroup;
  isActive: (href: string) => boolean;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // A short close delay stops the menu vanishing while the pointer crosses the
  // gap between the trigger and the panel.
  const openNow = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const closeSoon = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };

  const groupIsActive = group.links.some(l => isActive(l.href));

  return (
    <div
      ref={wrapRef}
      className="relative"
      onMouseEnter={openNow}
      onMouseLeave={closeSoon}
      onBlur={e => {
        // Close once focus leaves the trigger and the panel entirely.
        if (!wrapRef.current?.contains(e.relatedTarget as Node)) setOpen(false);
      }}
      onKeyDown={e => {
        if (e.key === "Escape" && open) {
          setOpen(false);
          triggerRef.current?.focus();
        }
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        // Opening only (never toggling): hovering the trigger has already set
        // open, so a toggle here would close the menu on the very click that
        // was meant to reach it. Escape, moving the pointer away, or moving
        // focus out all close it.
        onClick={() => setOpen(true)}
        onFocus={openNow}
        className="px-3.5 py-2 text-[13px] font-semibold rounded-lg transition-all flex items-center gap-1 leading-none relative hover:bg-navy-50"
        style={{
          color: groupIsActive ? "var(--nav-ink-active)" : undefined,
          background: groupIsActive ? "rgba(201,168,76,0.09)" : undefined,
        }}
      >
        {group.label}
        <svg
          width="10"
          height="10"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden="true"
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
          }}
        >
          <path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            zIndex: 60,
            minWidth: 310,
            background: "white",
            border: "1px solid #e4e8f0",
            borderRadius: 14,
            boxShadow: "0 12px 34px rgba(15,27,54,0.13)",
            padding: 8,
          }}
        >
          {group.links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block rounded-xl px-3 py-2.5 transition-colors hover:bg-navy-50"
              style={{
                background: isActive(link.href) ? "rgba(201,168,76,0.10)" : undefined,
              }}
            >
              <span
                className="block font-semibold text-navy-800"
                style={{ fontSize: link.feature ? 14 : 13.5 }}
              >
                {link.label}
              </span>
              {link.desc && (
                <span className="block text-navy-400 mt-0.5" style={{ fontSize: 11.5, lineHeight: 1.35 }}>
                  {link.desc}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
