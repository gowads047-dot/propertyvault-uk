import type { Metadata } from "next";
import { HettaHeader } from "@/components/hetta/HettaHeader";
import { HettaFooter } from "@/components/hetta/HettaFooter";
import { AuthProvider } from "@/lib/auth-context";

export const metadata: Metadata = {
  title: { template: "%s | Hetta", default: "Hetta — Find Your Place" },
  description: "Free property listing platform. List rooms, flats, and houses. Message landlords directly. No fees, no agents, no hassle.",
};

export default function HettaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="hetta" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <AuthProvider>
        <HettaHeader />
        <main style={{ flex: 1 }}>{children}</main>
        <HettaFooter />
      </AuthProvider>
    </div>
  );
}
