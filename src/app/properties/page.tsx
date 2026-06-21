import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Property Listings — List & Browse Properties | PropertyVault UK",
  description: "List your property for rent or sale on PropertyVault, or search UK property portals from one place.",
};

export default function PropertiesPage() {
  return (
    <>
      <section className="gradient-navy py-16 md:py-24">
        <div className="container-max px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Property Listings</h1>
          <p className="text-navy-200 text-lg max-w-2xl mx-auto">
            List your property to reach thousands of tenants and investors, or search all major UK portals from one place.
          </p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max max-w-3xl">
          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/list-property"
              className="block bg-white rounded-2xl border-2 border-navy-100 p-8 text-center hover:border-gold-400 hover:shadow-xl transition-all">
              <div className="text-4xl mb-4">📋</div>
              <h2 className="text-xl font-bold text-navy-800 mb-2">List Your Property</h2>
              <p className="text-sm text-navy-500 mb-4">Advertise your rental or investment property to tenants and investors. Free to list.</p>
              <span className="btn-primary inline-block text-sm">List Now — Free →</span>
            </Link>
            <Link href="/search"
              className="block bg-white rounded-2xl border-2 border-navy-100 p-8 text-center hover:border-gold-400 hover:shadow-xl transition-all">
              <div className="text-4xl mb-4">🔍</div>
              <h2 className="text-xl font-bold text-navy-800 mb-2">Search Properties</h2>
              <p className="text-sm text-navy-500 mb-4">Search Rightmove, Zoopla, OnTheMarket, OpenRent, and SpareRoom from one place.</p>
              <span className="btn-secondary inline-block text-sm">Search Now →</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="section-padding bg-navy-50/50">
        <div className="container-max max-w-3xl text-center">
          <h2 className="text-xl font-bold text-navy-800 mb-3">More Property Tools</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            <Link href="/sold-prices" className="block bg-white rounded-xl p-5 border border-navy-100 hover:shadow-md transition-all">
              <h3 className="font-bold text-navy-800 text-sm mb-1">Sold Prices</h3>
              <p className="text-xs text-navy-500">Check what any property sold for</p>
            </Link>
            <Link href="/valuation" className="block bg-white rounded-xl p-5 border border-navy-100 hover:shadow-md transition-all">
              <h3 className="font-bold text-navy-800 text-sm mb-1">Free Valuation</h3>
              <p className="text-xs text-navy-500">Get instant property estimates</p>
            </Link>
            <Link href="/area-guide" className="block bg-white rounded-xl p-5 border border-navy-100 hover:shadow-md transition-all">
              <h3 className="font-bold text-navy-800 text-sm mb-1">Area Research</h3>
              <p className="text-xs text-navy-500">Schools, crime, flood risk & more</p>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
