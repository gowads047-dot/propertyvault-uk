"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { DarkModeToggle } from "@/components/ui/DarkModeToggle";

const mainLinks = [
  { href: "/makan", label: "Makan", sub: "Property listings" },
  { href: "/calculators", label: "Calculators", sub: "" },
  { href: "/templates", label: "Templates", sub: "" },
  { href: "/areas", label: "Areas", sub: "" },
  { href: "/blog", label: "Blog", sub: "" },
];

const mobileLinks = [
  { heading: "Makan — Find Your Place", links: [
    { href: "/makan", label: "Browse Listings" },
    { href: "/makan/rooms", label: "Rooms to Rent" },
    { href: "/makan/list", label: "List Free" },
    { href: "/makan/how-it-works", label: "How It Works" },
  ]},
  { heading: "Property Search", links: [
    { href: "/search", label: "Search Properties" },
    { href: "/sold-prices", label: "Sold Prices" },
    { href: "/valuation", label: "Free Valuation" },
    { href: "/areas", label: "Area Guides" },
  ]},
  { heading: "Tools & Calculators", links: [
    { href: "/calculators/deal-analyser", label: "Deal Analyser" },
    { href: "/calculators", label: "All Calculators (17)" },
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
  ]},
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/98 backdrop-blur-xl shadow-sm border-b border-navy-100/30" : "bg-white border-b border-navy-100/50"}`}>
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
            {mainLinks.map((link) => (
              <Link key={link.href} href={link.href}
                className="px-3.5 py-2 text-[13px] font-semibold text-navy-600 hover:text-navy-900 hover:bg-navy-50 rounded-lg transition-all flex flex-col items-center leading-none">
                <span>{link.label}</span>
                {link.sub && <span className="text-[9px] font-normal text-navy-400 mt-0.5">{link.sub}</span>}
              </Link>
            ))}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-2.5">
            <DarkModeToggle />
            <Link href="/guaranteed-rent" className="hidden md:inline-flex items-center gap-2 bg-navy-800 text-white font-semibold text-[13px] py-2.5 px-5 rounded-full hover:bg-navy-900 transition-colors">
              Guaranteed Rent
            </Link>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2.5 text-navy-700 hover:bg-navy-50 rounded-lg transition-colors" aria-label="Menu">
              {mobileOpen ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-navy-100 max-h-[80vh] overflow-y-auto shadow-xl">
          <div className="px-5 py-5 space-y-5">
            <Link href="/guaranteed-rent" className="block btn-primary text-center text-sm" onClick={() => setMobileOpen(false)}>
              Guaranteed Rent →
            </Link>
            {mobileLinks.map((group) => (
              <div key={group.heading}>
                <p className="text-[10px] font-bold text-navy-400 uppercase tracking-widest mb-2">{group.heading}</p>
                {group.links.map((link) => (
                  <Link key={link.href} href={link.href}
                    className="block py-2 px-3 text-sm text-navy-700 hover:bg-navy-50 rounded-lg font-medium"
                    onClick={() => setMobileOpen(false)}>
                    {link.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
