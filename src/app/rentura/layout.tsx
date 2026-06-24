import type { Metadata } from "next";
import { AuthProvider } from "@/lib/auth-context";

export const metadata: Metadata = {
  title: "Rentura — The Conversational Property OS for UK Landlords",
  description:
    "No forms. No menus. Just tell Rentura what happened — it handles payments, maintenance, compliance, tax and mortgages automatically. The landlord OS that listens.",
  keywords:
    "property management software UK, landlord app, property OS, AI property management, UK landlord tools, rent management, maintenance tracking, compliance certificates, mortgage tracker",
  openGraph: {
    title: "Rentura — The Conversational Property OS",
    description:
      "Tell Rentura what happened. It handles the rest. Natural language property management for UK landlords.",
    type: "website",
    locale: "en_GB",
    siteName: "PropertyVault UK",
    url: "https://propertyvaultuk.co.uk/rentura",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rentura — The Conversational Property OS",
    description:
      "No forms. No dashboards. Just say what happened — Rentura handles everything else.",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://propertyvaultuk.co.uk/rentura" },
};

export default function RenturaLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
