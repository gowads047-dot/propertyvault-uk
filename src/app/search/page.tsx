"use client";

import { useState } from "react";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState<"sale" | "rent">("sale");

  const portals = searchType === "sale"
    ? [
        { name: "Rightmove", desc: "UK's largest property portal", url: `https://www.rightmove.co.uk/property-for-sale/search.html?searchLocation=${encodeURIComponent(query)}`, color: "bg-green-600" },
        { name: "Zoopla", desc: "Property search & estimates", url: `https://www.zoopla.co.uk/for-sale/details/?q=${encodeURIComponent(query)}`, color: "bg-purple-600" },
        { name: "OnTheMarket", desc: "Agent-listed properties", url: `https://www.onthemarket.com/for-sale/property/${encodeURIComponent(query.replace(/\s/g, "-").toLowerCase())}/`, color: "bg-teal-600" },
      ]
    : [
        { name: "Rightmove", desc: "UK's largest property portal", url: `https://www.rightmove.co.uk/property-to-rent/search.html?searchLocation=${encodeURIComponent(query)}`, color: "bg-green-600" },
        { name: "Zoopla", desc: "Property search & estimates", url: `https://www.zoopla.co.uk/to-rent/details/?q=${encodeURIComponent(query)}`, color: "bg-purple-600" },
        { name: "OnTheMarket", desc: "Agent-listed properties", url: `https://www.onthemarket.com/to-rent/property/${encodeURIComponent(query.replace(/\s/g, "-").toLowerCase())}/`, color: "bg-teal-600" },
        { name: "OpenRent", desc: "Direct from landlords", url: `https://www.openrent.com/properties-to-rent/${encodeURIComponent(query.toLowerCase().replace(/\s/g, "-"))}`, color: "bg-blue-600" },
        { name: "SpareRoom", desc: "Rooms & flatshares", url: `https://www.spareroom.co.uk/flatshare/?search_id=&flatshare_type=offered&location_type=combined&search=${encodeURIComponent(query)}`, color: "bg-pink-600" },
      ];

  return (
    <>
      <section className="gradient-navy py-16 md:py-24">
        <div className="container-max px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Search UK Properties</h1>
            <p className="text-navy-200 mb-8">Search every major UK property portal from one place. Enter a location and we&apos;ll open results across Rightmove, Zoopla, OnTheMarket, and more.</p>

            {/* Tabs */}
            <div className="flex gap-1 justify-center mb-4">
              <button onClick={() => setSearchType("sale")}
                className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors ${searchType === "sale" ? "bg-white text-navy-800" : "bg-white/10 text-white hover:bg-white/20"}`}>
                For Sale
              </button>
              <button onClick={() => setSearchType("rent")}
                className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors ${searchType === "rent" ? "bg-white text-navy-800" : "bg-white/10 text-white hover:bg-white/20"}`}>
                To Rent
              </button>
            </div>

            {/* Search */}
            <div className="bg-white rounded-xl p-3 shadow-lg max-w-lg mx-auto">
              <input
                type="text" value={query} onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter city, town, or postcode..."
                className="w-full px-4 py-3 border border-navy-200 rounded-lg text-navy-800 focus:outline-none focus:ring-2 focus:ring-gold-400 mb-3"
              />
              {query.length > 1 && (
                <div className="space-y-2">
                  {portals.map((p) => (
                    <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 rounded-lg border border-navy-100 hover:shadow-md hover:border-gold-400/30 transition-all">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 ${p.color} rounded-lg flex items-center justify-center text-white font-bold text-sm`}>
                          {p.name[0]}
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-navy-800 text-sm">Search on {p.name}</p>
                          <p className="text-xs text-navy-500">{p.desc}</p>
                        </div>
                      </div>
                      <svg className="w-4 h-4 text-navy-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    </a>
                  ))}
                </div>
              )}
              {query.length <= 1 && (
                <p className="text-xs text-navy-400 text-center py-2">Type a location to see search links</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Why Use This */}
      <section className="section-padding bg-white">
        <div className="container-max max-w-3xl text-center">
          <h2 className="text-xl font-bold text-navy-800 mb-6">Search All Portals in One Place</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-navy-50 rounded-xl p-5">
              <h3 className="font-bold text-navy-800 text-sm mb-1">Don&apos;t Miss Listings</h3>
              <p className="text-xs text-navy-500">Not every property appears on every portal. Search all of them to see everything available.</p>
            </div>
            <div className="bg-navy-50 rounded-xl p-5">
              <h3 className="font-bold text-navy-800 text-sm mb-1">Compare Prices</h3>
              <p className="text-xs text-navy-500">See the same property across portals and check if details or pricing differ.</p>
            </div>
            <div className="bg-navy-50 rounded-xl p-5">
              <h3 className="font-bold text-navy-800 text-sm mb-1">Save Time</h3>
              <p className="text-xs text-navy-500">One search opens every portal — no need to visit each site separately.</p>
            </div>
          </div>
          <p className="text-xs text-navy-400 mt-6">PropertyVault is not affiliated with these portals. Links open on the respective websites.</p>
        </div>
      </section>
    </>
  );
}
