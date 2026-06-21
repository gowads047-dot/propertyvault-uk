import type { Metadata } from "next";
import { Disclaimer } from "@/components/legal/Disclaimer";

export const metadata: Metadata = {
  title: "Guaranteed Rent for Landlords — Birmingham, Nottingham & Derby | PropertyVault UK",
  description: "Guaranteed rent for landlords in Birmingham, Nottingham, and Derby. No voids, no management, guaranteed income for 3-5 years. Get a free quote today.",
};

export default function GuaranteedRentPage() {
  return (
    <>
      {/* Hero */}
      <section className="gradient-navy relative overflow-hidden py-20 md:py-28">
        <div className="absolute inset-0">
          <div className="absolute top-10 right-[10%] w-[400px] h-[400px] bg-gold-400/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-10 left-[5%] w-[300px] h-[300px] bg-navy-400/10 rounded-full blur-[80px]" />
        </div>
        <div className="container-max px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-gold-400 text-sm font-semibold mb-8">
              <span className="w-2 h-2 bg-gold-400 rounded-full animate-pulse" />
              Birmingham · Nottingham · Derby
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-[1.1]" style={{ fontFamily: "var(--font-family-heading)" }}>
              Your Rent.
              <span className="block text-gradient-gold">Guaranteed.</span>
            </h1>
            <p className="text-xl text-navy-200 mb-4 max-w-2xl mx-auto">
              We lease your property and pay you every month for 3-5 years. No voids. No tenants to manage. No fees. Just income.
            </p>
            <p className="text-gold-400 font-bold text-lg mb-8">
              Even if the property sits empty — you still get paid.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="#enquiry" className="btn-primary text-center text-lg !py-4 !px-10">
                Book Your Free Valuation →
              </a>
              <a href="https://wa.me/4407415721628?text=Hi%2C%20I%27m%20a%20landlord%20interested%20in%20guaranteed%20rent.%20Can%20you%20tell%20me%20more%3F" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-all shadow-lg text-lg">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp Us Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Point Banner */}
      <section className="bg-red-50 border-y border-red-200">
        <div className="container-max px-4 py-5">
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-red-700 font-medium text-center">
            <span>😩 Chasing late rent?</span>
            <span>🏚️ Property sitting empty?</span>
            <span>📞 Midnight maintenance calls?</span>
            <span>💸 Paying agent fees?</span>
            <span>📋 Compliance headaches?</span>
          </div>
          <p className="text-center text-red-800 font-bold mt-2">All of this disappears with guaranteed rent.</p>
        </div>
      </section>

      {/* What You Get */}
      <section className="section-padding bg-white">
        <div className="container-max max-w-4xl">
          <div className="text-center mb-10">
            <p className="text-gold-600 font-bold text-xs uppercase tracking-widest mb-2">The Deal</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-navy-800" style={{ fontFamily: "var(--font-family-heading)" }}>Here&apos;s What You Get</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: "💷", title: "Guaranteed Monthly Rent", desc: "Same amount. Same date. Every single month. Whether the property is occupied or not." },
              { icon: "🚫", title: "Zero Void Periods", desc: "No gaps between tenants. No empty months. No lost income. Ever." },
              { icon: "🔧", title: "We Handle Everything", desc: "Tenant sourcing, management, maintenance, compliance, inspections — all us." },
              { icon: "📋", title: "No Agent Fees", desc: "No tenant-find fees. No management percentage. No renewal charges. No hidden costs." },
              { icon: "🔒", title: "3-5 Year Lease", desc: "Long-term security. One agreement. Guaranteed income for years, not months." },
              { icon: "🏠", title: "Property Protected", desc: "Regular inspections. Professional management. Returned in condition at end of lease." },
            ].map((b) => (
              <div key={b.title} className="bg-white rounded-2xl border border-navy-100/80 p-6 card-hover">
                <span className="text-3xl block mb-3">{b.icon}</span>
                <h3 className="font-bold text-navy-800 mb-1">{b.title}</h3>
                <p className="text-sm text-navy-500">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding gradient-navy">
        <div className="container-max">
          <div className="text-center mb-10">
            <p className="text-gold-400 font-bold text-xs uppercase tracking-widest mb-2">Landlord Experiences</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white" style={{ fontFamily: "var(--font-family-heading)" }}>What Landlords Say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { quote: "I had a property empty for 3 months, losing £900 each month. Now I get £780 guaranteed every month without lifting a finger. I wish I'd done this years ago.", who: "Landlord with 2-bed in Erdington, Birmingham", tag: "Was losing £2,700 in voids" },
              { quote: "Managing tenants was taking over my life — phone calls at midnight, chasing rent, arranging repairs. With guaranteed rent, I just check my bank balance. That's it.", who: "Portfolio landlord, 4 properties in Nottingham", tag: "Went from stressed to stress-free" },
              { quote: "My agent was charging 12% plus fees on top. The guaranteed rent is actually more than what I was netting after agent fees and void periods. And I do absolutely nothing.", who: "Landlord with 3-bed in Normanton, Derby", tag: "Now earns more, does less" },
            ].map((t) => (
              <div key={t.who} className="glass rounded-2xl p-6">
                <span className="inline-block px-3 py-1 bg-gold-400/20 text-gold-400 text-xs font-bold rounded-full mb-4">{t.tag}</span>
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-gold-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  ))}
                </div>
                <p className="text-white/90 text-sm leading-relaxed mb-4">&ldquo;{t.quote}&rdquo;</p>
                <p className="text-navy-300 text-xs">{t.who}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-navy-400 text-center mt-6">Testimonials are illustrative examples based on typical landlord experiences in these areas.</p>
        </div>
      </section>

      {/* The Numbers */}
      <section className="section-padding bg-white">
        <div className="container-max max-w-3xl">
          <div className="text-center mb-8">
            <p className="text-gold-600 font-bold text-xs uppercase tracking-widest mb-2">The Maths</p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-navy-800" style={{ fontFamily: "var(--font-family-heading)" }}>You Actually Earn More</h2>
            <p className="text-navy-500 mt-2">When you add up voids, agent fees, maintenance, and compliance — guaranteed rent usually puts more money in your pocket.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-navy-50"><th className="text-left p-3 font-semibold"></th><th className="text-left p-3 font-semibold">Self-Managing</th><th className="text-left p-3 font-semibold text-gold-700">Guaranteed Rent</th></tr></thead>
              <tbody>
                {[
                  ["Market rent (£1,000/month)", "£12,000", "—"],
                  ["Guaranteed rent (£850/month)", "—", "£10,200"],
                  ["Void periods (3 weeks)", "-£692", "£0"],
                  ["Letting agent fees (10%)", "-£1,200", "£0"],
                  ["Maintenance & repairs", "-£600", "£0"],
                  ["Compliance costs", "-£300", "£0"],
                  ["Tenant-find fee", "-£500", "£0"],
                ].map((row, i) => (
                  <tr key={i} className="border-b border-navy-100"><td className="p-3 font-medium text-navy-800">{row[0]}</td><td className="p-3 text-navy-600">{row[1]}</td><td className="p-3 text-gold-700 font-semibold">{row[2]}</td></tr>
                ))}
                <tr className="bg-navy-50"><td className="p-3 font-bold text-navy-800">Your actual annual income</td><td className="p-3 font-bold text-navy-800">£8,708</td><td className="p-3 font-bold text-gold-700 text-lg">£10,200</td></tr>
                <tr className="bg-green-50"><td className="p-3 font-bold text-green-800">You earn MORE with guaranteed rent</td><td className="p-3"></td><td className="p-3 font-bold text-green-700">+£1,492/year</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-navy-400 text-center mt-3">Illustrative example. Actual figures depend on property, location, and circumstances.</p>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding bg-navy-50/40">
        <div className="container-max max-w-3xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-extrabold text-navy-800" style={{ fontFamily: "var(--font-family-heading)" }}>How It Works</h2>
          </div>
          <div className="space-y-5">
            {[
              { step: "1", title: "Get in touch", desc: "Fill in the form below or WhatsApp us. Tell us about your property. We respond within 24 hours." },
              { step: "2", title: "Free property visit", desc: "We visit your property — no cost, no obligation. We assess the condition and rental potential." },
              { step: "3", title: "Receive your offer", desc: "Within 48 hours, you get a guaranteed rent offer. Take as long as you need to decide." },
              { step: "4", title: "Sign and start earning", desc: "Accept the offer, sign the lease, and your guaranteed rent starts immediately." },
            ].map((s) => (
              <div key={s.step} className="flex gap-5 items-start">
                <div className="flex-shrink-0 w-12 h-12 gradient-navy rounded-2xl flex items-center justify-center shadow-md">
                  <span className="text-gold-400 font-extrabold text-lg">{s.step}</span>
                </div>
                <div>
                  <h3 className="font-bold text-navy-800 text-lg">{s.title}</h3>
                  <p className="text-sm text-navy-500 mt-0.5">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Areas */}
      <section className="section-padding gradient-navy">
        <div className="container-max text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3" style={{ fontFamily: "var(--font-family-heading)" }}>Areas We Cover</h2>
          <p className="text-navy-200 text-sm mb-8">We are actively looking for properties in these areas right now.</p>
          <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {[
              { city: "Birmingham", areas: "All Birmingham postcodes — Edgbaston, Erdington, Handsworth, Small Heath, Sparkhill, Aston, Kings Heath, Moseley, and more", href: "/guaranteed-rent/birmingham" },
              { city: "Nottingham", areas: "All Nottingham postcodes — Hyson Green, Sneinton, Radford, Bulwell, Bestwood, Lenton, Beeston, Carlton, and more", href: "/guaranteed-rent/nottingham" },
              { city: "Derby", areas: "All Derby postcodes — Normanton, Pear Tree, Chaddesden, Spondon, Littleover, Alvaston, Chellaston, and more", href: "/guaranteed-rent/derby" },
            ].map((c) => (
              <a key={c.city} href={c.href} className="glass rounded-2xl p-6 text-left hover:bg-white/10 transition-all block">
                <h3 className="font-extrabold text-gold-400 text-xl mb-2" style={{ fontFamily: "var(--font-family-heading)" }}>{c.city}</h3>
                <p className="text-sm text-navy-200 mb-2">{c.areas}</p>
                <span className="text-xs font-semibold text-gold-400">View {c.city} details →</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="section-padding bg-white">
        <div className="container-max max-w-3xl">
          <h2 className="text-2xl font-extrabold text-navy-800 mb-6 text-center" style={{ fontFamily: "var(--font-family-heading)" }}>Common Questions</h2>
          <div className="space-y-3">
            {[
              { q: "How much rent will I receive?", a: "Typically 80-90% of market rent. But when you subtract voids, agent fees, maintenance, and compliance costs from self-managing, most landlords actually net more with guaranteed rent." },
              { q: "Do I still own my property?", a: "Yes — 100% ownership stays with you. We lease it from you. You can sell at any time (subject to lease terms)." },
              { q: "What types of property do you take?", a: "Houses, flats, bungalows, and HMOs from 1 bedroom upwards. The property must meet basic habitability standards." },
              { q: "Who are the tenants?", a: "We work with local councils and registered social housing providers to house families and individuals. All tenants are managed by our team." },
              { q: "What about repairs?", a: "We handle all day-to-day maintenance at our cost. Major structural issues remain the owner's responsibility, but we coordinate everything." },
              { q: "How quickly can we start?", a: "Once you accept our offer, we can complete within 7-14 days. Your first guaranteed rent payment follows shortly after." },
            ].map((faq) => (
              <div key={faq.q} className="bg-white rounded-2xl border border-navy-100/80 p-5">
                <h3 className="font-bold text-navy-800 mb-1">{faq.q}</h3>
                <p className="text-sm text-navy-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enquiry Form */}
      <section id="enquiry" className="section-padding bg-navy-50/40">
        <div className="container-max max-w-2xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-extrabold text-navy-800" style={{ fontFamily: "var(--font-family-heading)" }}>Book Your Free Valuation</h2>
            <p className="text-navy-500 text-sm mt-2">Fill in the form or WhatsApp us — we respond within 24 hours.</p>
          </div>

          {/* WhatsApp CTA */}
          <div className="text-center mb-6">
            <a href="https://wa.me/4407415721628?text=Hi%2C%20I%27m%20a%20landlord%20interested%20in%20guaranteed%20rent.%20Can%20you%20tell%20me%20more%3F" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-10 py-5 bg-green-500 text-white font-bold text-lg rounded-2xl hover:bg-green-600 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1">
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Message Us on WhatsApp
            </a>
            <p className="text-xs text-navy-400 mt-2">Instant reply during business hours</p>
          </div>

          <p className="text-navy-400 text-xs text-center mb-4">— or fill in the form —</p>

          <form className="bg-white rounded-2xl border border-navy-100 p-6 md:p-8 shadow-lg space-y-4" action="https://formsubmit.co/gowads047@gmail.com" method="POST">
            <input type="hidden" name="_subject" value="Guaranteed Rent Enquiry — PropertyVault" />
            <input type="hidden" name="_next" value="https://propertyvaultuk.co.uk/guaranteed-rent/?sent=true" />
            <input type="hidden" name="_captcha" value="false" />
            <input type="text" name="_honey" style={{ display: "none" }} />
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-navy-700 mb-1">Your Name *</label>
                <input type="text" name="name" required className="w-full px-4 py-3 border border-navy-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-400" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy-700 mb-1">Phone Number *</label>
                <input type="tel" name="phone" required className="w-full px-4 py-3 border border-navy-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-navy-700 mb-1">Email Address *</label>
              <input type="email" name="email" required className="w-full px-4 py-3 border border-navy-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-400" />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-navy-700 mb-1">Property Postcode</label>
                <input type="text" name="postcode" placeholder="e.g. B12 8QX" className="w-full px-4 py-3 border border-navy-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-400" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-navy-700 mb-1">Bedrooms</label>
                <select name="bedrooms" className="w-full px-4 py-3 border border-navy-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-gold-400">
                  <option>1</option><option>2</option><option>3</option><option>4</option><option>5</option><option>6+</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-navy-700 mb-1">Message (optional)</label>
              <textarea rows={3} name="message" placeholder="Tell us about your property or ask any questions..." className="w-full px-4 py-3 border border-navy-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-400 resize-none" />
            </div>
            <button type="submit" className="btn-primary w-full text-lg !py-4 !rounded-xl">
              Book My Free Valuation →
            </button>
            <a href="https://wa.me/4407415721628?text=Hi%2C%20I%27m%20a%20landlord%20interested%20in%20guaranteed%20rent." target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-4 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-all text-lg mt-3">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Or WhatsApp Us
            </a>
            <p className="text-xs text-navy-400 text-center mt-2">No obligation. We respond within 24 hours.</p>
          </form>
        </div>
      </section>

      {/* Final urgency CTA */}
      <section className="gradient-navy py-12">
        <div className="container-max max-w-2xl text-center px-4">
          <p className="text-gold-400 font-bold text-sm mb-2">Don&apos;t let another month of rent slip away</p>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4" style={{ fontFamily: "var(--font-family-heading)" }}>Every month without guaranteed rent is money you&apos;re losing.</h2>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="#enquiry" className="btn-primary !py-4 !px-8">Get a Free Quote →</a>
            <a href="https://wa.me/4407415721628?text=Hi%2C%20I%27m%20interested%20in%20guaranteed%20rent%20for%20my%20property." target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-all">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max max-w-4xl">
          <Disclaimer type="general" />
        </div>
      </section>
    </>
  );
}


