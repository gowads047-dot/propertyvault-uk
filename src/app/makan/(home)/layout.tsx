import type { Metadata } from "next";

// The Makan homepage lives in a (home) route group so it can own its canonical
// without handing it to every page below /makan. The canonical used to sit on
// src/app/makan/layout.tsx, which meant /makan/rooms/, /makan/wanted/,
// /makan/list/ and every listing declared themselves duplicates of /makan/.
export const metadata: Metadata = {
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/makan/" },
};

export default function MakanHomeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
