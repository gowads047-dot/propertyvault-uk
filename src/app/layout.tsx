import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CookieConsent } from "@/components/legal/CookieConsent";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { NewsletterPopup } from "@/components/layout/NewsletterPopup";
import { Analytics } from "@vercel/analytics/next";
import { SITE_URL } from "@/lib/site";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "PropertyVault UK — Free Property Calculators, Templates & Guides",
  description:
    "The UK's most comprehensive free property platform. 23 free calculators, 19 legal templates, guaranteed rent, and expert guides for UK investors, landlords, and buyers.",
  keywords:
    "property investing UK, buy to let, BRRR calculator, stamp duty calculator, rental yield calculator, property templates, HMO yield, Section 24 calculator, UK mortgages, property law, guaranteed rent Birmingham, Renters Rights Act 2025",
  openGraph: {
    title: {
      template: "%s",
      default: "PropertyVault UK — Free Property Calculators, Templates & Guides",
    },
    description:
      "23 free calculators, 19 free templates, and expert guides for UK property investors, landlords, and buyers. Completely free, no sign-up required.",
    type: "website",
    locale: "en_GB",
    siteName: "PropertyVault UK",
    url: "https://www.propertyvaultuk.co.uk",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "PropertyVault UK — Free Property Tools, Calculators & Guides" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "PropertyVault UK",
    description: "23 free property calculators, 19 legal templates, and expert UK property guides.",
    images: ["https://www.propertyvaultuk.co.uk/opengraph-image"],
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "PropertyVault UK",
  url: "https://www.propertyvaultuk.co.uk",
  description: "The UK's most comprehensive free property investment platform. Calculators, templates, guides, and tools for investors, landlords, and buyers.",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://www.propertyvaultuk.co.uk/search/?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "PropertyVault UK",
  url: "https://www.propertyvaultuk.co.uk",
  logo: "https://www.propertyvaultuk.co.uk/favicon.ico",
  contactPoint: {
    "@type": "ContactPoint",
    email: "gowads047@gmail.com",
    contactType: "customer service",
    areaServed: "GB",
    availableLanguage: "English",
  },
  sameAs: [],
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": ["RealEstateAgent", "LocalBusiness"],
  name: "PropertyVault UK",
  description: "Guaranteed rent scheme for landlords across the Midlands. We pay a fixed monthly income for 3–5 years — no voids, no management, no arrears. Serving Birmingham, Nottingham, Derby, Leicester, Coventry and Sheffield.",
  url: "https://www.propertyvaultuk.co.uk",
  logo: "https://www.propertyvaultuk.co.uk/favicon.ico",
  image: "https://www.propertyvaultuk.co.uk/opengraph-image",
  email: "gowads047@gmail.com",
  priceRange: "££",
  address: {
    "@type": "PostalAddress",
    addressRegion: "West Midlands",
    addressCountry: "GB",
  },
  areaServed: [
    { "@type": "City", "name": "Birmingham", "sameAs": "https://www.wikidata.org/wiki/Q2256" },
    { "@type": "City", "name": "Nottingham", "sameAs": "https://www.wikidata.org/wiki/Q41262" },
    { "@type": "City", "name": "Derby", "sameAs": "https://www.wikidata.org/wiki/Q43296" },
    { "@type": "City", "name": "Leicester", "sameAs": "https://www.wikidata.org/wiki/Q44306" },
    { "@type": "City", "name": "Coventry", "sameAs": "https://www.wikidata.org/wiki/Q43684" },
    { "@type": "City", "name": "Sheffield", "sameAs": "https://www.wikidata.org/wiki/Q42448" },
  ],
  knowsAbout: [
    "Guaranteed Rent",
    "Buy to Let",
    "Property Investment",
    "Landlord Management",
    "BRRR Strategy",
    "HMO Investment",
    "Section 24",
    "Renters Rights Act 2025",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "PropertyVault Services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Guaranteed Rent Scheme",
          description: "Fixed monthly rental income for landlords for 3–5 years. Paid whether or not the property is occupied, with day-to-day management, tenants and routine repairs handled for you.",
          url: "https://www.propertyvaultuk.co.uk/guaranteed-rent",
          areaServed: ["Birmingham", "Nottingham", "Derby", "Leicester", "Coventry", "Sheffield"],
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Free Property Calculators",
          description: "23 free property calculators including BTL mortgage stress test, rental yield, stamp duty, BRRR, and monthly cash flow.",
          url: "https://www.propertyvaultuk.co.uk/calculators",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Free Legal Templates",
          description: "19 free landlord legal document templates including AST, Section 8, Section 13 and more — compliant with 2026 legislation.",
          url: "https://www.propertyvaultuk.co.uk/templates",
        },
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB" className={`${inter.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
      </head>
      {/* Google Analytics through next/script so Next controls load order */}
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-MG7FKKCKWQ" strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-MG7FKKCKWQ');`}
      </Script>
      <body className="min-h-full flex flex-col">
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <Header />
        <main id="main-content" className="flex-1">{children}</main>
        <Footer />
        <CookieConsent />
        <WhatsAppButton />
        <NewsletterPopup />
        <Analytics />
      </body>
    </html>
  );
}
