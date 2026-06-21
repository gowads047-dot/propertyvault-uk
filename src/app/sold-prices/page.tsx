import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "UK Sold House Prices — Free Land Registry Data | PropertyVault UK",
  description: "Search sold property prices across England and Wales using free HM Land Registry data. Check what any property sold for.",
};

export default function SoldPricesPage() {
  return (
    <>
      <section className="gradient-navy py-16 md:py-24">
        <div className="container-max px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">UK Sold House Prices</h1>
          <p className="text-navy-200 text-lg max-w-2xl mx-auto mb-8">
            Check what any property in England and Wales sold for using official HM Land Registry data — completely free.
          </p>
          <a href="https://landregistry.data.gov.uk/app/ppd" target="_blank" rel="noopener noreferrer"
            className="btn-primary text-lg !py-4 !px-8 inline-block">
            Search Sold Prices on Land Registry →
          </a>
          <p className="text-xs text-navy-300 mt-4">Opens the official HM Land Registry Price Paid search tool (free, no sign-up)</p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max max-w-4xl">
          <h2 className="text-2xl font-bold text-navy-800 mb-6 text-center">Other Sold Price Tools</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <a href="https://www.rightmove.co.uk/house-prices.html" target="_blank" rel="noopener noreferrer"
              className="block bg-white rounded-xl border border-navy-100 p-5 hover:shadow-md transition-all">
              <h3 className="font-bold text-navy-800 mb-1">Rightmove Sold Prices</h3>
              <p className="text-sm text-navy-500">Search by address or postcode. Shows price history and nearby sales with photos.</p>
            </a>
            <a href="https://www.zoopla.co.uk/house-prices/" target="_blank" rel="noopener noreferrer"
              className="block bg-white rounded-xl border border-navy-100 p-5 hover:shadow-md transition-all">
              <h3 className="font-bold text-navy-800 mb-1">Zoopla Sold Prices</h3>
              <p className="text-sm text-navy-500">Sold prices with Zoopla estimates, price changes, and area averages.</p>
            </a>
            <a href="https://www.nethouseprices.com/" target="_blank" rel="noopener noreferrer"
              className="block bg-white rounded-xl border border-navy-100 p-5 hover:shadow-md transition-all">
              <h3 className="font-bold text-navy-800 mb-1">Nethouseprices</h3>
              <p className="text-sm text-navy-500">Free sold prices from Land Registry. Clean interface, easy street-level search.</p>
            </a>
          </div>
        </div>
      </section>

      <section className="section-padding bg-navy-50/50">
        <div className="container-max max-w-3xl">
          <h2 className="text-xl font-bold text-navy-800 mb-4 text-center">Why Check Sold Prices?</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-5">
              <h3 className="font-bold text-navy-800 text-sm mb-1">Negotiate Better</h3>
              <p className="text-xs text-navy-500">Know what similar properties actually sold for — not just asking prices.</p>
            </div>
            <div className="bg-white rounded-xl p-5">
              <h3 className="font-bold text-navy-800 text-sm mb-1">Value Your Property</h3>
              <p className="text-xs text-navy-500">Compare your property against recent comparable sales in your area.</p>
            </div>
            <div className="bg-white rounded-xl p-5">
              <h3 className="font-bold text-navy-800 text-sm mb-1">Find BMV Deals</h3>
              <p className="text-xs text-navy-500">Spot properties listed below recent sold prices in the same street.</p>
            </div>
          </div>
          <p className="text-xs text-navy-400 text-center mt-6">Source: HM Land Registry Price Paid Data. Crown Copyright. Open Government Licence v3.0.</p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max text-center">
          <h2 className="text-xl font-bold text-navy-800 mb-3">Want to Analyse a Deal?</h2>
          <p className="text-sm text-navy-500 mb-4">Use our free calculators to crunch the numbers on any property.</p>
          <Link href="/calculators" className="btn-primary">Property Calculators →</Link>
        </div>
      </section>
    </>
  );
}
