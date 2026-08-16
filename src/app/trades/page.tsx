import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Find Tradespeople & Post Jobs — Coming Soon | PropertyVault UK",
  description: "Find vetted plumbers, electricians, builders, and gas engineers for your rental properties. Post jobs and get quotes. Coming soon to PropertyVault.",
  alternates: { canonical: "https://propertyvaultuk.co.uk/trades/" },
  openGraph: {
    title: "Find Tradespeople & Post Jobs — Coming Soon | PropertyVault UK",
    description: "Find vetted plumbers, electricians, builders, and gas engineers for your rental properties. Post jobs and get quotes. Coming soon to PropertyVault.",
    type: "website",
    url: "https://propertyvaultuk.co.uk/trades/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "PropertyVault UK Trades Directory" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Find Tradespeople & Post Jobs — Coming Soon | PropertyVault UK",
    description: "Find vetted plumbers, electricians, builders, and gas engineers for your rental properties. Post jobs and get quotes. Coming soon to PropertyVault.",
  },
};

export default function TradesPage() {
  return (
    <>
      <section className="gradient-navy py-16 md:py-24">
        <div className="container-max px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <span className="inline-block px-4 py-1.5 bg-gold-400/10 border border-gold-400/30 rounded-full text-gold-400 text-sm font-medium mb-6">Coming Soon</span>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Trades Marketplace</h1>
            <p className="text-navy-200 text-lg">Find trusted plumbers, electricians, builders, gas engineers, and cleaners — built specifically for landlords. Post jobs and get quotes from vetted tradespeople.</p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max max-w-3xl">
          <h2 className="text-xl font-bold text-navy-800 mb-6 text-center">What&apos;s Coming</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <div className="bg-navy-50 rounded-xl p-6">
              <h3 className="font-bold text-navy-800 mb-2">For Landlords</h3>
              <ul className="space-y-2 text-sm text-navy-600">
                <li>• Post jobs (plumbing, electrical, gas, building, cleaning)</li>
                <li>• Get quotes from verified local tradespeople</li>
                <li>• Read reviews from other landlords</li>
                <li>• Emergency callout matching</li>
                <li>• Track jobs and payments</li>
              </ul>
            </div>
            <div className="bg-navy-50 rounded-xl p-6">
              <h3 className="font-bold text-navy-800 mb-2">For Tradespeople</h3>
              <ul className="space-y-2 text-sm text-navy-600">
                <li>• Access steady stream of landlord jobs</li>
                <li>• Build your profile with reviews</li>
                <li>• Show accreditations (Gas Safe, NICEIC, etc.)</li>
                <li>• Free to join</li>
                <li>• Only pay when you win work</li>
              </ul>
            </div>
          </div>

          <h2 className="text-xl font-bold text-navy-800 mb-4 text-center">Find Tradespeople Now</h2>
          <p className="text-sm text-navy-500 text-center mb-6">While we build the marketplace, use these trusted platforms to find tradespeople:</p>
          <div className="grid md:grid-cols-3 gap-4">
            <a href="https://www.checkatrade.com/" target="_blank" rel="noopener noreferrer"
              className="block bg-white rounded-xl border border-navy-100 p-5 hover:shadow-md transition-all text-center">
              <h3 className="font-bold text-navy-800 mb-1">Checkatrade</h3>
              <p className="text-xs text-navy-500">Vetted tradespeople with verified reviews</p>
            </a>
            <a href="https://www.mybuilder.com/" target="_blank" rel="noopener noreferrer"
              className="block bg-white rounded-xl border border-navy-100 p-5 hover:shadow-md transition-all text-center">
              <h3 className="font-bold text-navy-800 mb-1">MyBuilder</h3>
              <p className="text-xs text-navy-500">Post a job and get quotes from local builders</p>
            </a>
            <a href="https://www.ratedpeople.com/" target="_blank" rel="noopener noreferrer"
              className="block bg-white rounded-xl border border-navy-100 p-5 hover:shadow-md transition-all text-center">
              <h3 className="font-bold text-navy-800 mb-1">Rated People</h3>
              <p className="text-xs text-navy-500">Compare quotes from rated tradespeople</p>
            </a>
            <a href="https://www.gassaferegister.co.uk/find-an-engineer/" target="_blank" rel="noopener noreferrer"
              className="block bg-white rounded-xl border border-navy-100 p-5 hover:shadow-md transition-all text-center">
              <h3 className="font-bold text-navy-800 mb-1">Gas Safe Register</h3>
              <p className="text-xs text-navy-500">Find registered gas engineers (official register)</p>
            </a>
            <a href="https://www.niceic.com/find-a-contractor" target="_blank" rel="noopener noreferrer"
              className="block bg-white rounded-xl border border-navy-100 p-5 hover:shadow-md transition-all text-center">
              <h3 className="font-bold text-navy-800 mb-1">NICEIC</h3>
              <p className="text-xs text-navy-500">Find approved electricians (official register)</p>
            </a>
            <a href="https://www.bark.com/" target="_blank" rel="noopener noreferrer"
              className="block bg-white rounded-xl border border-navy-100 p-5 hover:shadow-md transition-all text-center">
              <h3 className="font-bold text-navy-800 mb-1">Bark</h3>
              <p className="text-xs text-navy-500">Get quotes for any service</p>
            </a>
          </div>

          <div className="mt-10 bg-white rounded-2xl border-2 border-gold-400/30 p-8 text-center">
            <h3 className="text-xl font-bold text-navy-800 mb-2">Get Notified When We Launch</h3>
            <p className="text-sm text-navy-500 mb-4">Join the waiting list for the PropertyVault Trades Marketplace.</p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input type="email" placeholder="Your email" required
                className="flex-1 px-4 py-3 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400" />
              <button type="submit" className="btn-primary whitespace-nowrap">Join Waiting List</button>
            </form>
          </div>

          <p className="text-xs text-navy-400 text-center mt-6">PropertyVault is not affiliated with these platforms. Links open on external websites.</p>
        </div>
      </section>
    </>
  );
}
