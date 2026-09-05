"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { DarkModeToggle } from "@/components/ui/DarkModeToggle";
import { navGroups, companyLinks } from "./nav";
import { NavDropdown } from "./NavDropdown";


export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // Close menu on route change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- closes the mobile menu on navigation; a route change is exactly the event this should react to
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      {/* Backdrop overlay */}
      <div
        aria-hidden="true"
        onClick={() => setMobileOpen(false)}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 40,
          background: "rgba(9,16,35,0.55)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          opacity: mobileOpen ? 1 : 0,
          pointerEvents: mobileOpen ? "auto" : "none",
          transition: "opacity 0.3s ease",
        }}
      />

      {/*
        Only the scroll polish animates.

        This was `transition-all`, which meant background-color and color were
        transitioned too — so when the theme script adds `dark` at load, the
        header animated from the light colour to the dark one instead of
        starting dark. That is a 300ms white bar across the top of every page
        in dark mode, and it is why the header photographs white: a screenshot
        catches the transition at its start, and in any context where frames do
        not run it never leaves it.

        Shadow, blur and border are what should ease as you scroll. The theme
        colours should simply be the theme's colours.
      */}
      <header
        className={`sticky top-0 z-50 transition-[box-shadow,border-color,backdrop-filter] duration-300 ${
          scrolled
            ? "bg-white/98 backdrop-blur-xl shadow-sm border-b border-navy-100/30"
            : "bg-white border-b border-navy-100/50"
        }`}
      >
        <div className="container-max px-4">
          <div className="flex items-center justify-between h-16 md:h-[4.5rem]">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 gradient-navy rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                <span className="text-gold-400 font-extrabold text-lg" style={{ fontFamily: "var(--font-family-heading)" }}>P</span>
              </div>
              <div className="leading-none">
                <span className="font-extrabold text-navy-800 text-[1.1rem] tracking-tight">Property</span>
                <span className="font-extrabold text-gold-500 text-[1.1rem]">Vault</span>
                <span className="text-navy-400 text-xs block -mt-0.5 font-medium">.co.uk</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-0.5">
              {navGroups.map((group) => (
                <NavDropdown key={group.label} group={group} isActive={isActive} />
              ))}
              <Link
                href="/rentura"
                className="ml-1 px-3.5 py-2 text-[13px] font-bold rounded-lg transition-all flex flex-col items-center leading-none"
                style={{ background: "#c9a84c", color: "#0f1b36" }}
              >
                <span>Rentura</span>
                <span style={{ fontSize: 9, fontWeight: 600, marginTop: 2, color: "#0f1b36", opacity: 0.7 }}>Early Access</span>
              </Link>
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2.5">
              <DarkModeToggle />
              {/* The one action worth putting on all 225 pages.
                  This used to be Guaranteed Rent, which is one service for one
                  kind of landlord in six cities. Vault is the front door to
                  everything else — it is what produces the property record the
                  rest of the platform hangs off, and it is free. Guaranteed
                  Rent leads the Services group, so it has not gone anywhere. */}
              <Link
                href="/vault"
                className="hidden md:inline-flex items-center gap-2 bg-navy-800 text-white font-semibold text-[13px] py-2.5 px-5 rounded-full hover:bg-navy-900 transition-colors"
              >
                Vault a property
              </Link>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2.5 text-navy-700 hover:bg-navy-50 rounded-lg transition-colors"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {mobileOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile drawer — always in DOM, slide-down animated */}
        <div
          className="lg:hidden"
          style={{
            maxHeight: mobileOpen ? "85vh" : "0px",
            overflow: "hidden",
            transition: "max-height 0.42s cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          <div
            style={{
              opacity: mobileOpen ? 1 : 0,
              transform: mobileOpen ? "translateY(0)" : "translateY(-8px)",
              transition: `opacity 0.25s ease ${mobileOpen ? "0.08s" : "0s"}, transform 0.3s ease`,
              background: "white",
              borderTop: "1px solid #e4e8f0",
              overflowY: "auto",
              maxHeight: "85vh",
            }}
          >
            <div className="px-5 py-5 space-y-5">
              <Link
                href="/guaranteed-rent"
                className="block btn-primary text-center text-sm"
                onClick={() => setMobileOpen(false)}
              >
                Guaranteed Rent →
              </Link>
              <Link
                href="/rentura"
                onClick={() => setMobileOpen(false)}
                className="block text-center text-sm font-bold py-2.5 px-4 rounded-full transition-colors"
                style={{ background: "#c9a84c", color: "#0f1b36" }}
              >
                Rentura — Early Access →
              </Link>

              {navGroups.map((group) => (
                <div key={group.label}>
                  <p className="text-[10px] font-bold text-navy-400 uppercase tracking-widest mb-2">
                    {group.label}
                  </p>
                  {group.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-between py-2 px-3 text-sm rounded-lg font-medium transition-colors"
                      style={{
                        color: isActive(link.href) ? "#0f1b36" : "#374151",
                        background: isActive(link.href) ? "rgba(201,168,76,0.09)" : undefined,
                        fontWeight: isActive(link.href) ? 700 : undefined,
                      }}
                    >
                      <span>{link.label}</span>
                      {isActive(link.href) && (
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#c9a84c", flexShrink: 0 }} />
                      )}
                    </Link>
                  ))}
                </div>
              ))}

              <div>
                <p className="text-[10px] font-bold text-navy-400 uppercase tracking-widest mb-2">
                  Company
                </p>
                {companyLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between py-2 px-3 text-sm rounded-lg font-medium transition-colors"
                    style={{
                      color: isActive(link.href) ? "#0f1b36" : "#374151",
                      background: isActive(link.href) ? "rgba(201,168,76,0.09)" : undefined,
                      fontWeight: isActive(link.href) ? 700 : undefined,
                    }}
                  >
                    <span>{link.label}</span>
                    {isActive(link.href) && (
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#c9a84c", flexShrink: 0 }} />
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
