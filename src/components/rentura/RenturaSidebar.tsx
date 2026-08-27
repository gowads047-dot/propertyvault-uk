"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

const NAV_ITEMS = [
  { href: "/rentura/dashboard",   label: "Dashboard",    icon: "⊞" },
  { href: "/rentura/properties",  label: "Properties",   icon: "🏠" },
  { href: "/rentura/tenants",     label: "Tenants",      icon: "👤" },
  { href: "/rentura/maintenance", label: "Maintenance",  icon: "🔧" },
  { href: "/rentura/compliance",  label: "Compliance",   icon: "✓" },
  { href: "/rentura/events",      label: "Timeline",     icon: "◎" },
  { href: "/rentura/mortgages",   label: "Mortgages",    icon: "🏦" },
  { href: "/rentura/financials",  label: "Financials",   icon: "£" },
  { href: "/rentura/documents",   label: "Documents",    icon: "📄" },
  { href: "/rentura/tax",         label: "Tax",          icon: "%" },
  { href: "/rentura/arrears",     label: "Arrears",      icon: "!" },
  { href: "/rentura/contacts",    label: "Contacts",     icon: "📋" },
  { href: "/rentura/rrb",         label: "Renters' Rights", icon: "⚖" },
  { href: "/rentura/settings",    label: "Settings",     icon: "⚙" },
];

const C = {
  bg: "rgba(0,0,0,0.25)",
  border: "rgba(255,255,255,0.07)",
  gold: "#c9a84c",
  ink: "rgba(255,255,255,0.85)",
  ink2: "rgba(255,255,255,0.62)",
  ink3: "rgba(255,255,255,0.62)",
};

export function RenturaSidebar() {
  const pathname = usePathname();
  const { signOut, profile, user } = useAuth();

  return (
    <aside style={{
      width: 220, background: C.bg, borderRight: `1px solid ${C.border}`,
      padding: "24px 0", flexShrink: 0, display: "flex", flexDirection: "column",
      position: "sticky", top: 0, height: "100vh", overflowY: "auto",
    }}>
      {/* Brand */}
      <div style={{ padding: "0 20px 24px", borderBottom: `1px solid ${C.border}` }}>
        <Link href="/rentura" style={{ textDecoration: "none" }}>
          <p style={{ fontSize: 15, fontWeight: 800, color: C.gold, letterSpacing: "-0.01em" }}>Rentura™</p>
          <p style={{ fontSize: 10, color: C.ink3, marginTop: 1 }}>Property Operating System</p>
        </Link>
      </div>

      {/* Profile pill */}
      {profile && (
        <div style={{ padding: "14px 20px", borderBottom: `1px solid ${C.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: C.gold }}>
                {(profile.name || user?.email || "U").charAt(0).toUpperCase()}
              </span>
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: C.ink, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {profile.name || "Landlord"}
              </p>
              <p style={{ fontSize: 10, color: C.ink3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user?.email}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav style={{ padding: "12px 10px", flex: 1 }}>
        {NAV_ITEMS.map(n => {
          const active = pathname === n.href || (n.href !== "/rentura/dashboard" && pathname?.startsWith(n.href));
          return (
            <Link key={n.href} href={n.href} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "9px 12px", borderRadius: 8, marginBottom: 1,
              fontSize: 13, fontWeight: active ? 700 : 500,
              color: active ? C.gold : C.ink2,
              background: active ? "rgba(201,168,76,0.1)" : "transparent",
              textDecoration: "none", transition: "all 0.15s",
            }}>
              <span style={{ fontSize: 14, width: 18, textAlign: "center", opacity: active ? 1 : 0.6 }}>{n.icon}</span>
              {n.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div style={{ padding: "14px 10px", borderTop: `1px solid ${C.border}` }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 12px", borderRadius: 7, fontSize: 12, color: C.ink3, textDecoration: "none", marginBottom: 4 }}>
          ← PropertyVault
        </Link>
        <button onClick={signOut} style={{ width: "100%", padding: "7px 12px", borderRadius: 7, fontSize: 12, color: C.ink3, background: "transparent", border: `1px solid ${C.border}`, cursor: "pointer", textAlign: "left", fontFamily: "inherit" }}>
          Sign out
        </button>
      </div>
    </aside>
  );
}
