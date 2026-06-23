import type { Metadata } from "next";
import { MakanHeader } from "@/components/hetta/HettaHeader";
import { MakanFooter } from "@/components/hetta/HettaFooter";
import { AuthProvider } from "@/lib/auth-context";
import { LangProvider } from "@/lib/lang-context";

export const metadata: Metadata = {
  title: { template: "%s | Makan", default: "Makan — Find Your Place" },
  description: "Free property listing platform. List rooms, flats, houses, and villas across the UK, Egypt, and Morocco. No fees, no agents.",
};

export default function MakanLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="hetta" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <AuthProvider>
        <LangProvider>
          <MakanHeader />
          <main style={{ flex: 1 }}>{children}</main>
          <MakanFooter />
        </LangProvider>
      </AuthProvider>
    </div>
  );
}
