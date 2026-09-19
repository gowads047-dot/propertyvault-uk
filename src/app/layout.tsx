import type { Metadata } from "next";
import { Inter, Playfair_Display, Plus_Jakarta_Sans, Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { SiteHeader, SiteFooter } from "@/components/layout/SiteChrome";
import { CookieConsent } from "@/components/legal/CookieConsent";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { NewsletterPopup } from "@/components/layout/NewsletterPopup";
import { Analytics } from "@vercel/analytics/next";
import { AnalyticsLoader } from "@/components/layout/AnalyticsLoader";
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
/**
 * display: optional on the two fonts every page uses.
 *
 * With the default (swap) the text paints in the fallback and repaints
 * when the web font lands — and that repaint is what Lighthouse counts as
 * the largest contentful paint, a second after first paint on a throttled
 * phone. With optional, a font that is not in the cache within the first
 * ~100 ms stays out for that page view: the fallback (metric-matched, so
 * nothing shifts) is what the visitor reads, and the font is cached for
 * the next page. On a normal connection the preloaded file arrives in
 * time and nothing changes. The trade: a first-time visitor on a slow
 * connection sees system-ui and Georgia instead of Inter and Playfair.
 */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "optional",
});

/** Every heading on the site. Worth preloading. */
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "optional",
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
    `${siteMetrics.calculators} free property calculators, ${siteMetrics.templates} landlord templates and plain-English guides, plus guaranteed rent for landlords in the Midlands. No sign-up for any of it.`,
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
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image/", width: 1200, height: 630, alt: "PropertyVault UK — Free Property Tools, Calculators & Guides" }],
  },
  // Only the card type. Next fills a page's twitter title, description and
  // image from its openGraph block when they are not set — but a value set
  // here is inherited by every page that does not declare `twitter`, and
  // wins. With an image here, thirty pages that advertise their own card
  // in og:image (the guaranteed-rent cities, Makan, more) were showing the
  // site logo on X.
  twitter: {
    card: "summary_large_image",
  },
  robots: { index: true, follow: true },

  /**
   * Search Console ownership.
   *
   * The site had no verification of any kind — no meta tag, no HTML file, and
   * only an SPF record in DNS. So either Search Console was never connected or
   * its verification has lapsed, and either way there is no impressions,
   * position or query data being collected. That data does not backfill: it
   * starts the day ownership is proven, so every day without it is a day of
   * query history that cannot be recovered.
   *
   * Driven by an environment variable rather than committed, because the code
   * belongs to one Search Console property rather than to this codebase — a
   * preview deployment or a fork should not claim ownership of the live site.
   * Undefined omits the tag entirely; Next renders nothing for it.
   *
   * DNS TXT verification at the registrar is stronger, because it covers every
   * subdomain and both protocols at once and cannot be lost in a redeploy.
   * This is the two-minute version.
   */
  verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "PropertyVault UK",
  url: "https://www.propertyvaultuk.co.uk",
  description: "Free property calculators, templates, guides and tools for UK investors, landlords and buyers, and guaranteed rent for landlords in the Midlands.",
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
  logo: "https://www.propertyvaultuk.co.uk/opengraph-image/",
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
  "@type": "LocalBusiness",
  name: "PropertyVault UK",
  description: "Guaranteed rent for landlords in the Midlands: a fixed monthly rent for 3–5 years, paid whether or not the property is occupied, with the letting and day-to-day management handled. Birmingham, Nottingham, Derby, Leicester, Coventry and Sheffield.",
  url: "https://www.propertyvaultuk.co.uk",
  logo: "https://www.propertyvaultuk.co.uk/opengraph-image/",
  image: "https://www.propertyvaultuk.co.uk/opengraph-image/",
  email: "info@propertyvaultuk.co.uk",
  // The WhatsApp number every enquiry button on the site already opens.
  telephone: "+44 7415 721628",
  priceRange: "££",
  address: {
    "@type": "PostalAddress",
    addressRegion: "West Midlands",
    addressCountry: "GB",
  },
  areaServed: [
    { "@type": "City", "name": "Birmingham", "sameAs": "https://www.wikidata.org/wiki/Q2256" },
    { "@type": "City", "name": "Nottingham", "sameAs": "https://www.wikidata.org/wiki/Q41262" },
    { "@type": "City", "name": "Derby", "sameAs": "https://www.wikidata.org/wiki/Q43475" },
    { "@type": "City", "name": "Leicester", "sameAs": "https://www.wikidata.org/wiki/Q83065" },
    { "@type": "City", "name": "Coventry", "sameAs": "https://www.wikidata.org/wiki/Q6225" },
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
          description: `${siteMetrics.templates} free landlord document templates — tenancy applications, notices, inventories and checklists — filled in on screen and printed.`,
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
      suppressHydrationWarning
    >
      <head>
        {/*
          Theme before first paint. The dark class used to be added from a
          useEffect in the header's toggle — after hydration — so every
          dark-mode visitor saw the light page flash to dark on every load,
          with the colour transitions animating the switch. This runs before
          anything is painted. Same rule as the toggle: a stored choice wins,
          otherwise the system preference. suppressHydrationWarning on <html>
          because the class the client adds here is not in the server HTML.
        */}
        <script
          id="theme-init"
          dangerouslySetInnerHTML={{
            __html:
              "try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}",
          }}
        />
        {/*
          Same idea for the cookie banner. It is in the server HTML now (it
          was mounted from a useEffect, so on a throttled phone it appeared
          seconds after the page and Lighthouse took its paragraph as the
          largest paint). A visitor who has already answered must not see it
          flash in, so their stored choice hides it here, before paint —
          globals.css: html.consented .cookie-banner.
        */}
        <script
          id="consent-init"
          dangerouslySetInnerHTML={{
            __html:
              "try{if(localStorage.getItem('cookie_consent')){document.documentElement.classList.add('consented')}}catch(e){}",
          }}
        />
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
        <script
          id="consent-default"
          dangerouslySetInnerHTML={{
            __html:
              "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}" +
              "gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});" +
              "try{if(localStorage.getItem('cookie_consent')==='all'){gtag('consent','update',{analytics_storage:'granted'});}}catch(e){}",
          }}
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

        A plain inline <script> in <head>, not next/script with
        beforeInteractive. Head scripts run before anything in the body, and
        gtag.js is only ever appended later by loadGtag, so the ordering
        holds. The next/script version was hoisted by Next as a <script>
        directly under <html>, which React reported as a hydration error on
        every page.
      */}
      {/*
        gtag.js itself is not here any more. It loads only once there is
        analytics consent — at start-up for a returning visitor who accepted
        (AnalyticsLoader, below), or when a new visitor presses Accept
        (CookieConsent) — see loadGtag in lib/analytics.ts for why.
      */}
      <body className="min-h-full flex flex-col">
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <SiteHeader />
        <main id="main-content" className="flex-1">{children}</main>
        <SiteFooter />
        <CookieConsent />
        <WhatsAppButton />
        <NewsletterPopup />
        <Analytics />
        <AnalyticsLoader />
      </body>
    </html>
  );
}
