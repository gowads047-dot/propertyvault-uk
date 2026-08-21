import type { Metadata } from "next";
import { Disclaimer } from "@/components/legal/Disclaimer";

export const metadata: Metadata = {
  title: "List Your Property — Advertise to Tenants & Investors | PropertyVault UK",
  description: "List your property for rent or sale on PropertyVault. Reach thousands of tenants and investors. Free listings for landlords with premium upgrade options.",
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/list-property/" },
  openGraph: {
    title: "List Your Property — Advertise to Tenants & Investors | PropertyVault UK",
    description: "List your property for rent or sale on PropertyVault. Reach thousands of tenants and investors. Free listings for landlords with premium upgrade options.",
    type: "website",
    url: "https://www.propertyvaultuk.co.uk/list-property/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "List Your Property on PropertyVault UK" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "List Your Property — Advertise to Tenants & Investors | PropertyVault UK",
    description: "List your property for rent or sale on PropertyVault. Reach thousands of tenants and investors. Free listings for landlords with premium upgrade options.",
  },
};

export default function ListPropertyPage() {
  return (
    <>
      <section className="gradient-navy py-16 md:py-24">
        <div className="container-max px-4">
          <div className="max-w-3xl">
            <p className="text-gold-400 font-semibold text-sm uppercase tracking-wider mb-3">For Landlords</p>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">List Your Property</h1>
            <p className="text-navy-200 text-lg">Advertise your rental or investment property to thousands of active tenants and investors. Completely free — no fees, no commissions, no catch.</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding bg-white">
        <div className="container-max max-w-4xl">
          <h2 className="text-2xl font-bold text-navy-800 mb-8 text-center">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "1", title: "Create Your Listing", desc: "Add property details, photos, floor plans, EPC, rent amount, and availability date." },
              { step: "2", title: "Add Photos & Details", desc: "Upload photos, add a description, and include key features to make your listing stand out." },
              { step: "3", title: "Receive Enquiries", desc: "Tenants contact you directly. Review applications, references, and Right to Rent documents." },
              { step: "4", title: "Manage Your Tenancy", desc: "Use our built-in tools for contracts, deposit protection, rent collection, and compliance tracking." },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-12 h-12 gradient-navy rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-gold-400 font-bold text-xl">{s.step}</span>
                </div>
                <h3 className="font-bold text-navy-800 mb-1">{s.title}</h3>
                <p className="text-sm text-navy-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Listing Form */}
      <section className="section-padding bg-navy-50/50">
        <div className="container-max max-w-3xl">
          <h2 className="text-2xl font-bold text-navy-800 mb-6">Create Your Listing</h2>
          <form className="space-y-6 bg-white rounded-2xl p-6 md:p-8 shadow-md border border-navy-100" action="https://formsubmit.co/gowads047@gmail.com" method="POST">
            <input type="hidden" name="_subject" value="New Property Listing — PropertyVault" />
            <input type="hidden" name="_next" value="https://www.propertyvaultuk.co.uk/list-property/?sent=true" />
            <input type="hidden" name="_captcha" value="false" />
            <input type="text" name="_honey" style={{ display: "none" }} />
            <div>
              <h3 className="font-bold text-navy-800 text-lg mb-4 border-b border-navy-100 pb-2">Property Details</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-navy-700 mb-1">Listing Type</label>
                  <select className="w-full px-4 py-3 border border-navy-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gold-400">
                    <option>For Rent — Long-Term Let</option>
                    <option>For Rent — Short-Term / SA</option>
                    <option>For Rent — HMO (Rooms)</option>
                    <option>For Sale — Investment Property</option>
                    <option>For Sale — Development Opportunity</option>
                    <option>Deal Sourcing — BMV Deal</option>
                    <option>Social Housing — Available for Lease</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-navy-700 mb-1">Property Type</label>
                  <select className="w-full px-4 py-3 border border-navy-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gold-400">
                    <option>Detached House</option>
                    <option>Semi-Detached House</option>
                    <option>Terraced House</option>
                    <option>Flat / Apartment</option>
                    <option>Bungalow</option>
                    <option>Maisonette</option>
                    <option>Studio</option>
                    <option>HMO</option>
                    <option>Commercial</option>
                    <option>Land</option>
                    <option>Mixed-Use</option>
                  </select>
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-semibold text-navy-700 mb-1">Bedrooms</label>
                  <select className="w-full px-4 py-3 border border-navy-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gold-400">
                    <option>Studio</option>
                    <option>1</option><option>2</option><option>3</option><option>4</option><option>5</option><option>6+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-navy-700 mb-1">Bathrooms</label>
                  <select className="w-full px-4 py-3 border border-navy-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gold-400">
                    <option>1</option><option>2</option><option>3</option><option>4+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-navy-700 mb-1">Furnished</label>
                  <select className="w-full px-4 py-3 border border-navy-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gold-400">
                    <option>Unfurnished</option>
                    <option>Part-Furnished</option>
                    <option>Fully Furnished</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-navy-800 text-lg mb-4 border-b border-navy-100 pb-2">Location</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-navy-700 mb-1">Address Line 1</label>
                  <input type="text" className="w-full px-4 py-3 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400" placeholder="e.g. 14 Victoria Street" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-navy-700 mb-1">Town / City</label>
                  <input type="text" className="w-full px-4 py-3 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400" placeholder="e.g. Manchester" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-navy-700 mb-1">County</label>
                  <input type="text" className="w-full px-4 py-3 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-navy-700 mb-1">Postcode</label>
                  <input type="text" className="w-full px-4 py-3 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400" placeholder="e.g. M1 2AB" />
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-navy-800 text-lg mb-4 border-b border-navy-100 pb-2">Pricing & Availability</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-navy-700 mb-1">Rent / Price (£)</label>
                  <input type="number" className="w-full px-4 py-3 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400" placeholder="e.g. 950" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-navy-700 mb-1">Frequency</label>
                  <select className="w-full px-4 py-3 border border-navy-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gold-400">
                    <option>Per Calendar Month</option>
                    <option>Per Week</option>
                    <option>Per Night</option>
                    <option>Fixed Price (Sale)</option>
                    <option>Offers Over</option>
                    <option>Guide Price</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-navy-700 mb-1">Available From</label>
                  <input type="date" className="w-full px-4 py-3 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400" />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-semibold text-navy-700 mb-1">Deposit (£)</label>
                  <input type="number" className="w-full px-4 py-3 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400" placeholder="e.g. 950" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-navy-700 mb-1">Minimum Tenancy</label>
                  <select className="w-full px-4 py-3 border border-navy-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gold-400">
                    <option>6 months</option>
                    <option>12 months</option>
                    <option>24 months</option>
                    <option>Flexible</option>
                    <option>Short-term / Nightly</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-navy-800 text-lg mb-4 border-b border-navy-100 pb-2">Description & Features</h3>
              <div>
                <label className="block text-sm font-semibold text-navy-700 mb-1">Property Description</label>
                <textarea rows={6} className="w-full px-4 py-3 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400 resize-none" placeholder="Describe your property in detail. Include key features, nearby amenities, transport links, and anything that makes it stand out." />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-semibold text-navy-700 mb-2">Key Features (select all that apply)</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {["Garden", "Parking", "Garage", "Central Heating", "Double Glazing", "New Build", "Period Property", "Pet Friendly", "DSS / Housing Benefit Accepted", "Bills Included", "EV Charging", "Balcony / Terrace", "En-Suite", "Open Plan", "Recently Refurbished", "Near Station", "Near Schools", "Near Shops"].map((f) => (
                    <label key={f} className="flex items-center gap-2 text-sm text-navy-600 cursor-pointer">
                      <input type="checkbox" className="rounded border-navy-300 text-gold-500 focus:ring-gold-400" />
                      {f}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-navy-800 text-lg mb-4 border-b border-navy-100 pb-2">Tenant Preferences</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {["Professionals", "Families", "Students", "Couples", "Single Occupants", "Sharers", "Housing Benefit / UC", "Pets Considered", "Smokers Considered"].map((p) => (
                  <label key={p} className="flex items-center gap-2 text-sm text-navy-600 cursor-pointer">
                    <input type="checkbox" className="rounded border-navy-300 text-gold-500 focus:ring-gold-400" />
                    {p}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-navy-800 text-lg mb-4 border-b border-navy-100 pb-2">Compliance Documents</h3>
              <p className="text-sm text-navy-500 mb-4">Upload your compliance documents to display a verified badge and build trust with tenants.</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border-2 border-dashed border-navy-200 rounded-lg p-4 text-center cursor-pointer hover:border-gold-400 transition-colors">
                  <p className="text-sm font-semibold text-navy-700">EPC Certificate</p>
                  <p className="text-xs text-navy-400 mt-1">PDF or image, max 5MB</p>
                </div>
                <div className="border-2 border-dashed border-navy-200 rounded-lg p-4 text-center cursor-pointer hover:border-gold-400 transition-colors">
                  <p className="text-sm font-semibold text-navy-700">Gas Safety Certificate</p>
                  <p className="text-xs text-navy-400 mt-1">PDF or image, max 5MB</p>
                </div>
                <div className="border-2 border-dashed border-navy-200 rounded-lg p-4 text-center cursor-pointer hover:border-gold-400 transition-colors">
                  <p className="text-sm font-semibold text-navy-700">EICR</p>
                  <p className="text-xs text-navy-400 mt-1">PDF or image, max 5MB</p>
                </div>
                <div className="border-2 border-dashed border-navy-200 rounded-lg p-4 text-center cursor-pointer hover:border-gold-400 transition-colors">
                  <p className="text-sm font-semibold text-navy-700">HMO Licence (if applicable)</p>
                  <p className="text-xs text-navy-400 mt-1">PDF or image, max 5MB</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-navy-800 text-lg mb-4 border-b border-navy-100 pb-2">Photos</h3>
              <div className="border-2 border-dashed border-navy-200 rounded-lg p-8 text-center cursor-pointer hover:border-gold-400 transition-colors">
                <svg className="w-10 h-10 text-navy-300 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <p className="text-sm font-semibold text-navy-700">Drag photos here or click to upload</p>
                <p className="text-xs text-navy-400 mt-1">Up to 15 photos. JPEG or PNG, max 10MB each. First photo becomes the main image.</p>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-navy-800 text-lg mb-4 border-b border-navy-100 pb-2">Your Contact Details</h3>
              <p className="text-sm text-navy-500 mb-4">How should interested tenants or buyers contact you? Provide at least one method.</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-navy-700 mb-1">Your Name *</label>
                  <input type="text" name="landlord_name" required className="w-full px-4 py-3 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-navy-700 mb-1">Email Address *</label>
                  <input type="email" name="landlord_email" required className="w-full px-4 py-3 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-navy-700 mb-1">Phone Number</label>
                  <input type="tel" name="landlord_phone" className="w-full px-4 py-3 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-navy-700 mb-1">WhatsApp Number</label>
                  <input type="tel" name="landlord_whatsapp" placeholder="e.g. 07700 900123" className="w-full px-4 py-3 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-400" />
                </div>
              </div>
              <div className="mt-3">
                <label className="block text-sm font-semibold text-navy-700 mb-2">How should tenants contact you?</label>
                <div className="flex flex-wrap gap-3">
                  <label className="flex items-center gap-2 text-sm text-navy-600 cursor-pointer"><input type="checkbox" name="contact_email" defaultChecked className="rounded border-navy-300 text-gold-500" /> Email</label>
                  <label className="flex items-center gap-2 text-sm text-navy-600 cursor-pointer"><input type="checkbox" name="contact_whatsapp" className="rounded border-navy-300 text-gold-500" />Message us</label>
                  <label className="flex items-center gap-2 text-sm text-navy-600 cursor-pointer"><input type="checkbox" name="contact_phone" className="rounded border-navy-300 text-gold-500" /> Phone Call</label>
                </div>
              </div>
            </div>

            <button type="submit" className="btn-primary w-full text-lg !py-4">
              Publish Listing
            </button>
          </form>

          <Disclaimer type="general" />
        </div>
      </section>

      {/* Free Listing Banner */}
      <section className="section-padding gradient-navy">
        <div className="container-max max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-white mb-3">All Listings Are Free</h2>
          <p className="text-navy-200 text-sm">List your property at no cost. No hidden fees, no premium tiers — just fill in the form above and reach tenants and investors across the UK.</p>
        </div>
      </section>
    </>
  );
}
