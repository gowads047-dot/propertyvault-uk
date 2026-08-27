import type { Metadata } from "next";
import Link from "next/link";
import { siteMetrics } from "@/lib/site";

export const metadata: Metadata = {
  title: "About PropertyVault UK — Our Story, Mission & Ecosystem",
  description:
    "PropertyVault UK was built because good property information was locked behind expensive courses and biased advice. Free tools, guaranteed rent, deal sourcing education, and property management — all in one ecosystem.",
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/about/" },
  openGraph: {
    title: "About PropertyVault UK — Our Story, Mission & Ecosystem",
    description: "PropertyVault UK was built because good property information was locked behind expensive courses and biased advice. Free tools, guaranteed rent, deal sourcing education, and property management — all in one ecosystem.",
    type: "website",
    url: "https://www.propertyvaultuk.co.uk/about/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "About PropertyVault UK" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About PropertyVault UK — Our Story, Mission & Ecosystem",
    description: "PropertyVault UK was built because good property information was locked behind expensive courses and biased advice. Free tools, guaranteed rent, deal sourcing education, and property management — all in one ecosystem.",
  },
};

export default function AboutPage() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="gradient-navy py-20 md:py-28">
        <div className="container-max px-4">
          <div className="max-w-3xl">
            <p className="text-gold-400 font-semibold text-sm uppercase tracking-wider mb-4">Our Story</p>
            <h1
              className="text-4xl md:text-6xl font-black text-white leading-tight mb-6"
              style={{ letterSpacing: "-0.03em" }}
            >
              PropertyVault UK — free property investing tools & guides, built because the good stuff was locked behind a{" "}
              <span className="text-gold-400">£2,000 course.</span>
            </h1>
            <p className="text-navy-200 text-xl leading-relaxed">
              PropertyVault started as a free toolkit for people who were tired of finding property information that was either wrong, outdated, or written by someone trying to sell them something.
            </p>
          </div>
        </div>
      </section>

      {/* ── ORIGIN STORY ─────────────────────────────────── */}
      <section className="section-padding bg-white">
        <div className="container-max max-w-3xl px-4">
          <h2 className="text-3xl font-bold text-navy-800 mb-8">Where it started</h2>
          <div className="space-y-5 text-navy-600 text-lg leading-relaxed">
            <p>
              I&apos;m an ordinary guy with a passion for property. No fund behind me, no course to sell, no overnight
              story. I started out around 2013, and more than a decade later I am still at it.
            </p>
            <p>
              That is the whole of my credential, and I would rather say it plainly than dress it up. Everything on
              this site was built by someone still doing the thing, not someone who did it once and now teaches it.
            </p>
            <p>
              When I started looking seriously at property investment — BTL, BRRR, Section 24, HMOs — I quickly realised the information landscape was broken. Mortgage guides were written by banks whose goal was to get you to apply. Tax explanations were buried in HMRC jargon. The calculators that actually modelled real scenarios were all behind expensive course paywalls.
            </p>
            <p>
              The good information existed. It was just gatekept.
            </p>
            <p>
              PropertyVault was the resource I wished had existed. Free calculators that actually model a stress test the way a lender does. Templates that are legally current, not from 2019. Guides written in plain English by people who have been through the process — not by legal departments reviewing for liability.
            </p>
            <p>
              That was the beginning. A free toolkit for a community that deserved one.
            </p>
            <p>
              Then the gaps became obvious. Landlords needed operational infrastructure, not just one-off guides — so we built{" "}
              <strong className="text-navy-800">Rentura</strong>, a proper portfolio management platform. Aspiring deal sourcers were wasting thousands on theory-heavy courses and getting no results — so we built the{" "}
              <strong className="text-navy-800">Academy</strong>, with real tools and me answering personally on the Q&amp;A board. And diaspora communities — UK families wanting to invest back home in Egypt, Morocco, and across North Africa — had nowhere to find verified property without paying an agent 3% to open a door — so we built{" "}
              <strong className="text-navy-800">Makan</strong>.
            </p>
            <p>
              The ecosystem looks different from the outside. But it comes from one place: we build what should exist.
            </p>
          </div>
          <div className="mt-10 p-6 bg-navy-50 rounded-2xl border-l-4 border-gold-400">
            <p className="text-navy-700 text-base italic leading-relaxed">
              &ldquo;Every tool on this platform, every guide, every calculator — I built it because I needed it and it didn&apos;t exist. If you&apos;re using it, you&apos;re the person I built it for.&rdquo;
            </p>
            <p className="text-navy-800 font-bold mt-3">— Nass, Founder, PropertyVault UK</p>
          </div>
        </div>
      </section>

      {/* ── THE ECOSYSTEM ─────────────────────────────────── */}
      <section className="section-padding bg-navy-50">
        <div className="container-max px-4">
          <div className="max-w-2xl mb-12">
            <h2 className="text-3xl font-bold text-navy-800 mb-4">Four brands. One mission.</h2>
            <p className="text-navy-600 text-lg">
              Every part of the PropertyVault ecosystem was built to remove a specific kind of friction — from finding information, to managing a portfolio, to sourcing deals, to finding a home across borders.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* PropertyVault */}
            <div className="bg-white rounded-2xl p-8 border border-navy-100 flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-navy-800 flex items-center justify-center flex-shrink-0">
                  <span className="text-gold-400 font-black text-sm">PV</span>
                </div>
                <div>
                  <p className="font-black text-navy-800 text-lg leading-tight">PropertyVault UK</p>
                  <p className="text-xs text-navy-400">Free tools, guaranteed rent &amp; guides</p>
                </div>
              </div>
              <p className="text-navy-600 text-sm leading-relaxed mb-5 flex-1">
                The hub. Free calculators, legal templates, expert guides, and a guaranteed rent service for UK landlords. Everything a property investor, landlord, or buyer needs — without a paywall in sight.
              </p>
              <div className="flex flex-wrap gap-2 mb-5">
                {[`${siteMetrics.calculators} calculators`, `${siteMetrics.templates} templates`, "Guaranteed rent", "Expert guides"].map((t) => (
                  <span key={t} className="text-xs font-semibold px-3 py-1 rounded-full bg-navy-50 text-navy-600 border border-navy-100">
                    {t}
                  </span>
                ))}
              </div>
              <Link href="/" className="text-sm font-bold text-navy-800 hover:text-gold-600 transition-colors">
                Explore PropertyVault →
              </Link>
            </div>

            {/* Rentura */}
            <div className="bg-white rounded-2xl p-8 border border-navy-100 flex flex-col">
              <div
                className="flex items-center gap-3 mb-4"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "#0f1b2d" }}
                >
                  <span className="font-black text-sm" style={{ color: "var(--gold-ink)" }}>R</span>
                </div>
                <div>
                  <p className="font-black text-navy-800 text-lg leading-tight">Rentura</p>
                  <p className="text-xs text-navy-400">Portfolio management · £9.99/mo</p>
                </div>
              </div>
              <p className="text-navy-600 text-sm leading-relaxed mb-5 flex-1">
                The operating system for UK landlords. Property Passport, compliance calendar, tenant management, financial reports, and an AI assistant — all in one dashboard. Finally replaces the spreadsheet.
              </p>
              <div className="flex flex-wrap gap-2 mb-5">
                {["Property Passport", "Compliance alerts", "AI assistant", "P&L reports"].map((t) => (
                  <span key={t} className="text-xs font-semibold px-3 py-1 rounded-full bg-navy-50 text-navy-600 border border-navy-100">
                    {t}
                  </span>
                ))}
              </div>
              <Link href="/rentura" className="text-sm font-bold text-navy-800 hover:text-gold-600 transition-colors">
                Explore Rentura →
              </Link>
            </div>

            {/* Academy */}
            <div className="bg-white rounded-2xl p-8 border border-navy-100 flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "#080d1a" }}
                >
                  <span className="font-black text-sm" style={{ color: "#d4af37" }}>A</span>
                </div>
                <div>
                  <p className="font-black text-navy-800 text-lg leading-tight">Deal Sourcing Academy</p>
                  <p className="text-xs text-navy-400">Property education · £14.99/mo</p>
                </div>
              </div>
              <p className="text-navy-600 text-sm leading-relaxed mb-5 flex-1">
                12 modules, a 7-day challenge, and a full toolkit — email swipe file, investor CRM, deal calculator, compliance hub. Not the Instagram version of deal sourcing. The real business model, in plain English.
              </p>
              <div className="flex flex-wrap gap-2 mb-5">
                {["12 modules", "7-day challenge", "Email scripts", "Nass answers personally"].map((t) => (
                  <span key={t} className="text-xs font-semibold px-3 py-1 rounded-full bg-navy-50 text-navy-600 border border-navy-100">
                    {t}
                  </span>
                ))}
              </div>
              <Link href="/academy" className="text-sm font-bold text-navy-800 hover:text-gold-600 transition-colors">
                Explore the Academy →
              </Link>
            </div>

            {/* Makan */}
            <div className="bg-white rounded-2xl p-8 border border-navy-100 flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "#0b0f14" }}
                >
                  <span className="font-black text-sm" style={{ color: "#AD4429" }}>م</span>
                </div>
                <div>
                  <p className="font-black text-navy-800 text-lg leading-tight">Makan</p>
                  <p className="text-xs text-navy-400">Property listings · Free forever</p>
                </div>
              </div>
              <p className="text-navy-600 text-sm leading-relaxed mb-5 flex-1">
                مكان — Arabic for &ldquo;place&rdquo;. A listings platform built for the diaspora: UK, Egypt, Morocco, and beyond. Direct landlord contact via WhatsApp. Zero agent fees. Browse free, list free, forever.
              </p>
              <div className="flex flex-wrap gap-2 mb-5">
                {["UK · Egypt · Morocco", "Zero agent fees", "WhatsApp-direct", "Free to list"].map((t) => (
                  <span key={t} className="text-xs font-semibold px-3 py-1 rounded-full bg-navy-50 text-navy-600 border border-navy-100">
                    {t}
                  </span>
                ))}
              </div>
              <Link href="/makan" className="text-sm font-bold text-navy-800 hover:text-gold-600 transition-colors">
                Explore Makan →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT WE STAND FOR ────────────────────────────── */}
      <section className="section-padding bg-white">
        <div className="container-max max-w-4xl px-4">
          <h2 className="text-3xl font-bold text-navy-800 mb-10">What we stand for</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "Information without an agenda",
                desc: "We don&apos;t earn commission on mortgages. We&apos;re not selling a managed fund. Our guides have no commercial incentive to point you in a particular direction — that&apos;s rare in property, and we protect it.",
              },
              {
                title: "Plain English, always",
                desc: "Property law and finance are complex enough without jargon. We explain everything in the clearest possible language, without dumbing it down. If a guide is confusing, that is our problem to fix.",
              },
              {
                title: "Tools over theory",
                desc: "Reading about how to analyse a deal is not the same as running the numbers yourself. Everything we build is designed to replace passive reading with active doing.",
              },
              {
                title: "Free where it matters",
                desc: "Our calculators, guides, and templates are free. We earn from services and subscriptions that deliver clear value. We don&apos;t hide the useful stuff behind a paywall and call it education.",
              },
            ].map((v) => (
              <div key={v.title} className="bg-navy-50 rounded-2xl p-6 border border-navy-100">
                <h3 className="font-bold text-navy-800 text-base mb-3">{v.title}</h3>
                <p className="text-sm text-navy-600 leading-relaxed"
                   dangerouslySetInnerHTML={{ __html: v.desc }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GUARANTEED RENT CTA ──────────────────────────── */}
      <section className="section-padding bg-navy-900">
        <div className="container-max max-w-3xl px-4 text-center">
          <p className="text-gold-400 font-semibold text-sm uppercase tracking-wider mb-4">Guaranteed Rent</p>
          <h2 className="text-3xl font-bold text-white mb-5">
            We also pay landlords directly — every month, guaranteed.
          </h2>
          <p className="text-navy-200 text-lg leading-relaxed mb-8">
            Beyond the free tools, PropertyVault operates a guaranteed rent service across the Midlands. We take on your property under a 3–5 year lease and pay you a fixed monthly income — no voids, no arrears, no management calls. You get paid whether the property is occupied or not.
          </p>
          <Link
            href="/guaranteed-rent"
            className="inline-block bg-gold-400 text-navy-900 font-bold px-8 py-4 rounded-xl hover:bg-gold-500 transition-colors"
          >
            Find out if your property qualifies →
          </Link>
        </div>
      </section>

      {/* ── CONTACT ──────────────────────────────────────── */}
      <section className="section-padding bg-white border-t border-navy-100">
        <div className="container-max max-w-2xl px-4 text-center">
          <h2 className="text-2xl font-bold text-navy-800 mb-4">Got a question?</h2>
          <p className="text-navy-600 mb-8">
            The fastest way to reach Nass is via WhatsApp. Whether it&apos;s about the tools, the Academy, Rentura, or anything else — send a message.
          </p>
          <Link
            href="https://wa.me/447415721628"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-green-500 text-white font-bold px-8 py-4 rounded-xl hover:bg-green-600 transition-colors text-lg"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Message Nass on WhatsApp
          </Link>
        </div>
      </section>
    </>
  );
}
