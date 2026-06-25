import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CookieConsent } from "@/components/legal/CookieConsent";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { NewsletterPopup } from "@/components/layout/NewsletterPopup";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PropertyVault UK — Free Property Calculators, Templates & Guides",
  description:
    "The UK's most comprehensive free property platform. 15 calculators, 40+ templates, property search, area research tools, and expert guides for investors, landlords, and buyers.",
  keywords:
    "property investing UK, buy to let, BRRR calculator, stamp duty calculator, rental yield calculator, property templates, HMO yield, Section 24 calculator, UK mortgages, property law, guaranteed rent Birmingham",
  openGraph: {
    title: "PropertyVault UK — Free Property Calculators, Templates & Guides",
    description:
      "17 free calculators, 40+ templates, and expert guides for UK property investors, landlords, and buyers. Completely free, no sign-up required.",
    type: "website",
    locale: "en_GB",
    siteName: "PropertyVault UK",
    url: "https://propertyvaultuk.co.uk",
    images: [{ url: "https://propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "PropertyVault UK — Free Property Tools, Calculators & Guides" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "PropertyVault UK",
    description: "15 free property calculators, 40+ templates, and expert UK property guides.",
    images: ["https://propertyvaultuk.co.uk/opengraph-image"],
  },
  robots: { index: true, follow: true },
  alternates: {
    canonical: "https://propertyvaultuk.co.uk",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "PropertyVault UK",
  url: "https://propertyvaultuk.co.uk",
  description: "The UK's most comprehensive free property investment platform. Calculators, templates, guides, and tools for investors, landlords, and buyers.",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://propertyvaultuk.co.uk/search/?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "PropertyVault UK",
  url: "https://propertyvaultuk.co.uk",
  logo: "https://propertyvaultuk.co.uk/favicon.ico",
  contactPoint: {
    "@type": "ContactPoint",
    email: "gowads047@gmail.com",
    contactType: "customer service",
    areaServed: "GB",
    availableLanguage: "English",
  },
  sameAs: [],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB" className={`${inter.variable} h-full antialiased`}>
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-8YZQZP5L4Q" />
        <script dangerouslySetInnerHTML={{ __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-8YZQZP5L4Q');` }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CookieConsent />
        <WhatsAppButton />
        <NewsletterPopup />
      </body>
    </html>
  );
}
