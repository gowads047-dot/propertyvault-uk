import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free AST Template UK 2025 — Assured Shorthold Tenancy Agreement | PropertyVault",
  description: "Download a free Assured Shorthold Tenancy (AST) agreement template for England. Updated for 2025 legislation including Renters Rights Act provisions. No sign-up required.",
  keywords: "free AST template UK, assured shorthold tenancy agreement template, AST template download, tenancy agreement template UK 2025",
  openGraph: {
    title: "Free AST Template UK 2025 | PropertyVault",
    description: "Free Assured Shorthold Tenancy agreement template — updated for 2025 legislation. Download instantly, no sign-up.",
    type: "website",
    url: "https://propertyvaultuk.co.uk/templates/ast/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://propertyvaultuk.co.uk/og-image.png", width: 1200, height: 630, alt: "Free AST Template — PropertyVault UK" }],
  },
  twitter: { card: "summary_large_image", title: "Free AST Template UK 2025 | PropertyVault", description: "Free AST template for England — updated for 2025 legislation." },
  alternates: { canonical: "https://propertyvaultuk.co.uk/templates/ast/" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
