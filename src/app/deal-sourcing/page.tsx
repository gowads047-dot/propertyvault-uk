import type { Metadata } from "next";
import Link from "next/link";
import { Disclaimer } from "@/components/legal/Disclaimer";

export const metadata: Metadata = {
  title: "Deal Sourcing Marketplace — Coming Soon | PropertyVault UK",
  description: "The UK's property deal sourcing marketplace. Find below market value deals from verified sourcers, or list your sourced deals to reach investors. Coming soon.",
};

export default function DealSourcingPage() {
  return (
    <>
      <section className="gradient-navy py-16 md:py-24">
        <div className="container-max px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <span className="inline-block px-4 py-1.5 bg-gold-400/10 border border-gold-400/30 rounded-full text-gold-400 text-sm font-medium mb-6">Coming Soon</span>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Deal Sourcing Marketplace</h1>
            <p className="text-navy-200 text-lg">We&apos;re building the UK&apos;s largest marketplace for sourced property deals. Find below market value opportunities from verified sourcers, or list your deals to reach thousands of active investors.</p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max max-w-3xl">
          <h2 className="text-xl font-bold text-navy-800 mb-6 text-center">What&apos;s Coming</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-navy-50 rounded-xl p-6">
              <h3 className="font-bold text-navy-800 mb-2">For Investors</h3>
              <ul className="space-y-2 text-sm text-navy-600">
                <li>• Browse verified BMV deals across the UK</li>
                <li>• Filter by strategy (BRRR, BTL, HMO, SA, development)</li>
                <li>• See comparables and deal analysis</li>
                <li>• Request deal packs directly</li>
                <li>• Only pay sourcing fee on completion</li>
              </ul>
            </div>
            <div className="bg-navy-50 rounded-xl p-6">
              <h3 className="font-bold text-navy-800 mb-2">For Deal Sourcers</h3>
              <ul className="space-y-2 text-sm text-navy-600">
                <li>• List deals to our active investor base</li>
                <li>• Get verified sourcer badge</li>
                <li>• No upfront listing costs</li>
                <li>• Track investor interest and enquiries</li>
                <li>• Build your reputation with reviews</li>
              </ul>
            </div>
          </div>

          <div className="mt-10 bg-white rounded-2xl border-2 border-gold-400/30 p-8 text-center">
            <h3 className="text-xl font-bold text-navy-800 mb-2">Get Early Access</h3>
            <p className="text-sm text-navy-500 mb-4">Be the first to know when the Deal Sourcing Marketplace launches. Join the waiting list.</p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input type="email" placeholder="Your email" required
                className="flex-1 px-4 py-3 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400" />
              <button type="submit" className="btn-primary whitespace-nowrap">Join Waiting List</button>
            </form>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-navy-500 mb-3">In the meantime, use our tools to analyse any deal:</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/calculators/brrr" className="text-sm font-semibold text-gold-600 hover:text-gold-700">BRRR Calculator →</Link>
              <Link href="/calculators/rental-yield" className="text-sm font-semibold text-gold-600 hover:text-gold-700">Yield Calculator →</Link>
              <Link href="/sold-prices" className="text-sm font-semibold text-gold-600 hover:text-gold-700">Sold Prices →</Link>
            </div>
          </div>

          <Disclaimer type="financial" />
        </div>
      </section>
    </>
  );
}
