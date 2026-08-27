"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";

/**
 * PropertyVault's header and footer, minus Makan.
 *
 * Makan is its own product with its own palette, nav and logo, and it renders
 * its own chrome from src/app/makan/layout.tsx — inside the auth and language
 * providers, which is where it has to be. Without this the two would stack:
 * two headers, two footers, two colour schemes, and a "Guaranteed Rent" call
 * to action sitting directly above a page whose argument is that nobody should
 * be deciding on the landlord's behalf.
 *
 * Rendered rather than routed because the root layout wraps every page. A
 * route group would be the tidier fix, but it means moving every non-Makan
 * page on the site into it.
 */
function onMakan(pathname: string | null): boolean {
  // Exactly /makan, and anything beneath it — but not a sibling that merely
  // starts with the same letters, which is why this is not a bare startsWith.
  return pathname === "/makan" || (pathname?.startsWith("/makan/") ?? false);
}

export function SiteHeader() {
  return onMakan(usePathname()) ? null : <Header />;
}

export function SiteFooter() {
  return onMakan(usePathname()) ? null : <Footer />;
}
