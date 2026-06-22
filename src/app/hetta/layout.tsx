import type { Metadata } from "next";
import { HettaHeader } from "@/components/hetta/HettaHeader";
import { HettaFooter } from "@/components/hetta/HettaFooter";
import { AuthProvider } from "@/lib/auth-context";
import { LangProvider } from "@/lib/lang-context";

export const metadata: Metadata = {
  title: { template: "%s | Hetta", default: "Hetta — Find Your Place" },
  description: "Free property listing platform. List rooms, flats, houses, and villas across UK, Middle East, and North Africa. No fees, no agents.",
};

export default function HettaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="hetta" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <AuthProvider>
        <LangProvider>
          <HettaHeader />
          <main style={{ flex: 1 }}>{children}</main>
          <HettaFooter />
        </LangProvider>
      </AuthProvider>
    </div>
  );
}
