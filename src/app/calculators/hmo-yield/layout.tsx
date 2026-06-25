import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HMO Yield Calculator UK — Room-by-Room Returns | PropertyVault",
  description: "Calculate HMO gross yield, net yield, and monthly cash flow room by room. Factor in bills, licensing, management, and mortgage payments. Free UK tool.",
  keywords: "HMO yield calculator, HMO calculator UK, house in multiple occupation yield, HMO return calculator, HMO investment calculator",
  openGraph: {
    title: "HMO Yield Calculator UK | PropertyVault",
    description: "Model your HMO investment room by room. Calculate gross and net yields with bills, licensing, and all operating costs included.",
    type: "website",
    url: "https://propertyvaultuk.co.uk/calculators/hmo-yield/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://propertyvaultuk.co.uk/og-image.png", width: 1200, height: 630, alt: "HMO Yield Calculator — PropertyVault UK" }],
  },
  twitter: { card: "summary_large_image", title: "HMO Yield Calculator UK | PropertyVault", description: "Free HMO investment calculator — gross yield, net yield, room-by-room cash flow." },
  alternates: { canonical: "https://propertyvaultuk.co.uk/calculators/hmo-yield/" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
