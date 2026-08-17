"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { DarkModeToggle } from "@/components/ui/DarkModeToggle";

const mainLinks = [
  { href: "/areas", label: "Areas", sub: "" },
  { href: "/calculators", label: "Calculators", sub: "" },
  { href: "/templates", label: "Templates", sub: "" },
  { href: "/blog", label: "Blog", sub: "" },
  { href: "/rentura", label: "Rentura", sub: "Early Access", highlight: true },
];

const mobileLinks = [
  { heading: "Property Search", links: [
    { href: "/search", label: "Search Properties" },
    { href: "/sold-prices", label: "Sold Prices" },
    { href: "/valuation", label: "Free Valuation" },
    { href: "/areas", label: "Area Guides" },
    { href: "/areas/postcodes", label: "Postcode Guides" },
  ]},
  { heading: "Tools & Calculators", links: [
    { href: "/calculators/deal-analyser", label: "Deal Analyser" },
    { href: "/calculators", label: "All Calculators (23)" },
    { href: "/tools", label: "Property Tools" },
    { href: "/templates", label: "Templates & Checklists" },
    { href: "/glossary", label: "Property Glossary" },
  ]},
  { heading: "Landlord Tools", links: [
    { href: "/guaranteed-rent", label: "Guaranteed Rent" },
    { href: "/list-property", label: "List Your Property" },
    { href: "/manage", label: "Manage Tenancies" },
    { href: "/find-agent", label: "Find a Professional" },
  ]},
  { heading: "Learn", links: [
    { href: "/rentura", label: "🏠 Rentura — Landlord OS" },
    { href: "/property-investing", label: "Property Investing" },
    { href: "/mortgages", label: "Mortgages" },
    { href: "/property-tax", label: "Property Tax" },
    { href: "/property-law", label: "Property Law" },
    { href: "/renting-strategies", label: "Renting Strategies" },
    { href: "/blog", label: "Blog" },
  ]},
  { heading: "Company", links: [
    { href: "/about", label: "About PropertyVault" },
    { href: "/contact", label: "Contact Us" },
    { href: "/makan", label: "Makan — Join the Waitlist" },
  ]},
];

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

      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
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
              {mainLinks.map((link) =>
                link.highlight ? (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="ml-1 px-3.5 py-2 text-[13px] font-bold rounded-lg transition-all flex flex-col items-center leading-none"
                    style={{ background: "#c9a84c", color: "#0f1b36" }}
                  >
                    <span>Rentura</span>
                    <span style={{ fontSize: 9, fontWeight: 600, marginTop: 2, color: "#0f1b36", opacity: 0.7 }}>Early Access</span>
                  </Link>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-3.5 py-2 text-[13px] font-semibold rounded-lg transition-all flex flex-col items-center leading-none relative hover:bg-navy-50 hover:text-navy-900"
                    style={{
                      color: isActive(link.href) ? "#0f1b36" : undefined,
                      background: isActive(link.href) ? "rgba(201,168,76,0.09)" : undefined,
                    }}
                  >
                    <span className={isActive(link.href) ? "text-navy-900 font-bold" : "text-navy-600"}>
                      {link.label}
                    </span>
                    {link.sub && (
                      <span
                        className="text-[9px] font-normal mt-0.5"
                        style={{ color: isActive(link.href) ? "#c9a84c" : "#97a5c5" }}
                      >
                        {link.sub}
                      </span>
                    )}
                    {/* Animated gold underline */}
                    <span
                      aria-hidden="true"
                      style={{
                        position: "absolute",
                        bottom: 2,
                        left: "50%",
                        transform: "translateX(-50%)",
                        height: 2,
                        borderRadius: 2,
                        background: "#c9a84c",
                        width: isActive(link.href) ? "60%" : "0%",
                        transition: "width 0.25s cubic-bezier(0.22,1,0.36,1)",
                      }}
                    />
                  </Link>
                )
              )}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2.5">
              <DarkModeToggle />
              <Link
                href="/guaranteed-rent"
                className="hidden md:inline-flex items-center gap-2 bg-navy-800 text-white font-semibold text-[13px] py-2.5 px-5 rounded-full hover:bg-navy-900 transition-colors"
              >
                Guaranteed Rent
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

              {mobileLinks.map((group) => (
                <div key={group.heading}>
                  <p className="text-[10px] font-bold text-navy-400 uppercase tracking-widest mb-2">
                    {group.heading}
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
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
