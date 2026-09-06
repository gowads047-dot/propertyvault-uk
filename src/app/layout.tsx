import type { Metadata } from "next";
import { Inter, Playfair_Display, Plus_Jakarta_Sans, Noto_Sans_Arabic } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { SiteHeader, SiteFooter } from "@/components/layout/SiteChrome";
import { CookieConsent } from "@/components/legal/CookieConsent";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { NewsletterPopup } from "@/components/layout/NewsletterPopup";
import { Analytics } from "@vercel/analytics/next";
import { SITE_URL, siteMetrics } from "@/lib/site";

/**
 * Fonts are self-hosted through next/font rather than pulled from Google.
 *
 * globals.css used to @import all of these from fonts.googleapis.com, which put
 * them on a three-hop serial critical path: the browser had to fetch the app's
 * CSS chunk (~106ms), parse it to discover the @import, fetch Google's CSS
 * (~127ms), parse that to discover the files, then fetch the woff2 (~114ms) —
 * roughly 350ms before a heading could paint in the right face, with a fresh
 * DNS and TLS handshake to two Google hosts along the way and no preconnect.
 *
 * next/font emits the files from our own origin and injects a <link rel=preload>
 * at HTML parse time, so the chain collapses to a single parallel fetch.
 */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

/** Every heading on the site. Worth preloading. */
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

/** Makan only — declared but not preloaded, so the rest of the site pays nothing. */
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  preload: false,
});

/** Only rendered when Makan is switched to Arabic. Same reasoning. */
const notoArabic = Noto_Sans_Arabic({
  variable: "--font-noto-arabic",
  subsets: ["arabic"],
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "PropertyVault UK — Free Property Calculators, Templates & Guides",
  description:
    `The UK's most comprehensive free property platform. ${siteMetrics.calculators} free calculators, ${siteMetrics.templates} legal templates, guaranteed rent, and expert guides for UK investors, landlords, and buyers.`,
  keywords:
    "property investing UK, buy to let, BRRR calculator, stamp duty calculator, rental yield calculator, property templates, HMO yield, Section 24 calculator, UK mortgages, property law, guaranteed rent Birmingham, Renters Rights Act 2025",
  openGraph: {
    title: {
      template: "%s",
      default: "PropertyVault UK — Free Property Calculators, Templates & Guides",
    },
    description:
      `${siteMetrics.calculators} free calculators, ${siteMetrics.templates} free templates, and expert guides for UK property investors, landlords, and buyers. Completely free, no sign-up required.`,
    type: "website",
    locale: "en_GB",
    siteName: "PropertyVault UK",
    url: "https://www.propertyvaultuk.co.uk",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "PropertyVault UK — Free Property Tools, Calculators & Guides" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "PropertyVault UK",
    description: `${siteMetrics.calculators} free property calculators, ${siteMetrics.templates} legal templates, and expert UK property guides.`,
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
    email: "info@propertyvaultuk.co.uk",
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
  email: "info@propertyvaultuk.co.uk",
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
          description: `${siteMetrics.calculators} free property calculators including BTL mortgage stress test, rental yield, stamp duty, BRRR, and monthly cash flow.`,
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
    <html
      lang="en-GB"
      className={`${inter.variable} ${playfair.variable} ${jakarta.variable} ${notoArabic.variable} h-full antialiased`}
    >
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
      {/*
        Consent Mode v2 defaults, set before gtag loads.

        Analytics used to load unconditionally on every page for every
        visitor. The cookie banner wrote "all" or "essential" into
        localStorage and nothing read it, so "Essential Only" left Google
        Analytics running and /cookies promised analytics cookies were used
        "only with your consent" — which was true of nobody. Under PECR
        reg 6 a non-essential cookie needs consent before it is set, not a
        preference recorded after.

        So everything starts denied. A returning visitor who accepted is
        re-granted here from their stored choice; a new one is granted only
        when they press Accept All, via CookieConsent. wait_for_update gives
        that click a moment to land before gtag gives up on it.

        beforeInteractive so this runs ahead of the gtag script below —
        ordering is the whole point, and afterInteractive would race it.
      */}
      <Script id="consent-default" strategy="beforeInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});
try{if(localStorage.getItem('cookie_consent')==='all'){gtag('consent','update',{analytics_storage:'granted'});}}catch(e){}`}
      </Script>
      {/* Google Analytics through next/script so Next controls load order */}
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-MG7FKKCKWQ" strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-MG7FKKCKWQ');`}
      </Script>
      <body className="min-h-full flex flex-col">
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <SiteHeader />
        <main id="main-content" className="flex-1">{children}</main>
        <SiteFooter />
        <CookieConsent />
        <WhatsAppButton />
        <NewsletterPopup />
        <Analytics />
      </body>
    </html>
  );
}
