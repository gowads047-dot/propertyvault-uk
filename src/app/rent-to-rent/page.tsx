"use client";
import { useState } from "react";
import Link from "next/link";

const STEPS = [
  {
    n: "01", title: "Choose Your R2R Model",
    body: "Before anything else, decide which model suits your area and lifestyle. HMO R2R (room-by-room) gives the highest margins but requires the most setup. Serviced Accommodation (SA) works best in tourist cities or near business hubs. Single-let R2R (one tenant, one rent) is the easiest entry point with slimmer margins.",
    checklist: ["Research room demand in your target area (SpareRoom, Rightmove)", "Check short-let demand (AirDNA, Airbnb occupancy data)", "Talk to local agents about void rates and tenant demand", "Choose one model to start — do not split focus"],
  },
  {
    n: "02", title: "Set Up Your Business",
    body: "You must operate as a business — not a private individual. A limited company is strongly recommended. It limits personal liability, looks professional to landlords, and makes it easier to scale. Register on Companies House (under SIC code 68209 – Other letting and operating of own or leased real estate).",
    checklist: ["Incorporate a Ltd company at Companies House (~£12 online)", "Open a dedicated business bank account", "Register for Self Assessment (even if Ltd)", "Design a simple logo and get business cards printed", "Create a one-page 'company overview' PDF for landlords/agents"],
  },
  {
    n: "03", title: "Get the Right Insurance",
    body: "Standard landlord insurance will NOT cover you. You need specialist Rent-to-Rent insurance that covers you as the operator/leaseholder, not the owner. This should include public liability (minimum £2m), contents cover for your furnishings, and loss of rent cover. Expect to pay £300–£600/year per property.",
    checklist: ["Get quotes from: CIA Landlords, Total Landlord Insurance, Endsleigh", "Ensure policy covers subletting / HMO use", "Public liability minimum £2m", "Get the certificate ready — landlords and agents will ask for it"],
  },
  {
    n: "04", title: "Build Your Credibility Pack",
    body: "Landlords are handing you their biggest asset. They need to trust you before they hand over the keys. A credibility pack turns a cold stranger into a credible operator. Even if you have no track record yet, professionalism wins deals.",
    checklist: ["Company overview (1 page: who you are, what you do, why it works)", "Copy of your R2R insurance certificate", "References from previous landlords/agents if you have them", "Example of a furnished room or property you've managed", "Testimonials from subtenants (once you have them)", "Your LinkedIn and business website URL"],
  },
  {
    n: "05", title: "Source Properties",
    body: "Finding the right property is the job. Cast a wide net across all channels simultaneously. The best deals come from landlords who are motivated — tired, void-ridden, or simply don't want the hassle of traditional letting.",
    checklist: [
      "Ring every letting agent in your target area (script in Step 7)",
      "Search Rightmove/Zoopla — contact landlords who list directly (no agent)",
      "Search Gumtree, Facebook Marketplace, SpareRoom for 'to let' listings",
      "Post in local Facebook groups: 'I offer guaranteed rent to landlords in [area]'",
      "Door-knock or letter-drop in streets where HMO demand is highest",
      "Network at local property investor meetups (PinMeetup.co.uk)",
    ],
  },
  {
    n: "06", title: "Make Contact — Use the Scripts",
    body: "Most people fail at R2R here. They script nothing, improvise badly, and give up after two calls. Use the phone scripts on this page word for word until you've done 20 calls. Then adapt them. Your goal on the first call is one thing only: get a viewing.",
    checklist: ["Call a minimum of 10 agents per day when sourcing", "Follow up every call with a WhatsApp/email same day", "Don't email first — always call. Email is easy to ignore.", "Track every call in a simple spreadsheet (agent name, date, response, follow-up date)"],
  },
  {
    n: "07", title: "Conduct Due Diligence at the Viewing",
    body: "Never sign anything before doing proper due diligence. The viewing is about more than liking the property — you need to verify it stacks financially and legally.",
    checklist: [
      "Check property condition (you'll be responsible for maintenance — price it in)",
      "Confirm the landlord has a buy-to-let or consent-to-let mortgage (not residential)",
      "Ask directly: 'Will you get subletting consent from your mortgage lender?'",
      "Check the local council's HMO licensing requirements before committing",
      "Verify EPC rating (must be E or above — note: EPC C required by 2030 for all rental properties; a D/E property today is a liability on a 3–5 year head lease)",
      "Research SpareRoom room rents in that specific postcode",
      "Run the numbers through the Deal Analyser (link at bottom)",
    ],
  },
  {
    n: "08", title: "Get Mortgage Lender Consent",
    body: "This is the step most R2R operators skip — and it's the one that can end everything. The landlord's mortgage lender must give written consent to subletting. Without it, the landlord is in breach of their mortgage terms and the lender can demand immediate repayment. This is not optional.",
    checklist: [
      "The landlord writes to their mortgage lender requesting 'consent to sublet'",
      "Most buy-to-let lenders will grant this (some charge a small admin fee)",
      "Residential mortgage lenders will likely refuse — the landlord must switch to BTL first",
      "Get the consent in writing BEFORE you sign the head lease",
      "If a landlord refuses to get consent, walk away — no exceptions",
    ],
  },
  {
    n: "09", title: "Negotiate the Deal",
    body: "Your job is to structure a deal where the landlord is happy AND your numbers work at 70% occupancy. If you can only profit at 100% occupancy, the deal is too tight. Typical R2R terms: guaranteed rent 10–20% below market rate, 3–5 year lease, you cover minor maintenance under a set threshold.",
    checklist: [
      "Offer guaranteed rent 10–20% below open market rent (landlord saves on voids + fees)",
      "Negotiate a rent-free setup period (2–4 weeks for furnishing and setup)",
      "Agree a maintenance threshold (e.g. you cover repairs under £150, landlord above)",
      "Include a break clause for both parties (typically at year 2)",
      "Agree on redecorating and property condition at end of lease",
      "Never pay above a figure that works at 70% occupancy",
    ],
  },
  {
    n: "10", title: "Sign the Head Lease",
    body: "You need a Head Lease Agreement — not a standard AST. Under a head lease, you (the operator) become the leaseholder and then issue separate ASTs to your subtenants. You become your subtenants' landlord in law. This is a crucial legal distinction. Use a solicitor who knows property law.",
    checklist: [
      "Instruct a solicitor to draft or review the Head Lease Agreement",
      "Ensure the head lease includes: agreed rent, term, permitted use (HMO/SA/single let), maintenance responsibilities, break clauses",
      "The head lease must NOT be a standard AST — this creates serious legal problems",
      "Keep a signed copy of the mortgage lender's consent with the head lease",
      "Do NOT take possession of the property without a signed agreement",
    ],
  },
  {
    n: "11", title: "Set Up and Furnish the Property",
    body: "First impressions fill rooms. A well-furnished, clean property lets faster and attracts better tenants. Budget for setup costs honestly — this is where most first-timers underestimate.",
    checklist: [
      "Deep clean throughout before photographing",
      "Furnish to a good standard: bed frame + mattress, wardrobe, desk, chest of drawers per room",
      "Install fast broadband (essential for professional tenants) — budget £25–35/month",
      "Arrange Gas Safety Certificate (annual, ~£60–80)",
      "Get an EICR done if not recent (every 5 years, ~£150–250)",
      "Professional photographs — this is your marketing, spend the £100–150",
      "List on SpareRoom, Rightmove, Zoopla (for HMO), or Airbnb/Booking.com (for SA)",
    ],
  },
  {
    n: "12", title: "Fill Rooms and Manage Ongoing",
    body: "Once tenants are in, your job is to protect the asset and your relationships — with the landlord, and with your tenants. Good management is what enables you to scale to multiple properties.",
    checklist: [
      "Carry out Right to Rent checks for every subtenant (mandatory by law)",
      "Register deposits with a government-approved scheme (DPS, TDS, or myDeposits)",
      "Issue a compliant tenancy agreement to each subtenant (you are their landlord in law — under the Renters' Rights Act 2025, all new subtenancies must be periodic from the outset; fixed-term ASTs are no longer permitted)",
      "Set up a WhatsApp group or property management system for maintenance requests",
      "Pay the landlord on the agreed date every month — without fail",
      "Inspect the property every 3 months and send a brief report to the landlord",
      "Renew the head lease before it expires — do not let it run into a periodic tenancy",
    ],
  },
];

const SCRIPTS = [
  {
    id: "agent",
    label: "Calling an Estate Agent",
    context: "Call the lettings department. Ask for the lettings manager or branch manager — not the first person who picks up.",
    lines: [
      { speaker: "YOU", text: "Good morning — could I speak to whoever manages landlord instructions in the lettings team please?" },
      { speaker: "AGENT", text: "[Transfers you, or asks why you're calling]" },
      { speaker: "YOU", text: "Hi [Name], I'm [Your Name] from [Company Name]. We're a property management company that works with landlords on a guaranteed rent basis — we take properties on long-term leases and pay the landlord every single month, whether the place is occupied or not. No voids, no fees, no management calls." },
      { speaker: "YOU", text: "We're actively looking for properties in [area] right now. I was wondering — do you have any landlords on your books who are struggling with voids, or who've had difficult tenants, or who just want the whole thing off their hands?" },
      { speaker: "AGENT", text: "[Likely: 'Yes possibly' or 'What do you do with the property?']" },
      { speaker: "YOU", text: "Good question. We let properties to working professionals on a room-by-room basis — we handle everything, maintain the property to a high standard, and carry full specialist R2R insurance. The landlord just gets paid." },
      { speaker: "YOU", text: "I'd love to send you a one-pager on how we work and pop in for 10 minutes this week to introduce ourselves properly. Agents who work with us find it's a strong service to offer their landlords. Would [day] or [day] suit you?" },
      { speaker: "TIP", text: "If they say 'we don't do that here' — ask if they can pass your details to any landlord who enquires about guaranteed rent. Always leave your number and follow up by email the same day." },
    ],
  },
  {
    id: "landlord",
    label: "Calling a Landlord Directly",
    context: "Use when a landlord lists their property directly on Rightmove/Zoopla (no agent listed), or when you find their number through a TO LET board, Facebook, or Gumtree.",
    lines: [
      { speaker: "YOU", text: "Hi, is that [Name]? I hope I'm not catching you at a bad time — my name is [Your Name] from [Company Name]." },
      { speaker: "YOU", text: "I came across your property at [address/area] on Rightmove and I wanted to give you a quick call. We work with landlords on a guaranteed rent model — we take the property on a long-term lease, pay you every month whether it's occupied or not, and handle all the management. You don't deal with a single tenant." },
      { speaker: "LANDLORD", text: "[Likely: 'I already have an agent' or 'How does that work?']" },
      { speaker: "YOU (if they have agent)", text: "Totally understand — the difference with us is we're not charging you a fee, we're the ones paying you. No commission, no management charges, just a fixed monthly amount straight into your account." },
      { speaker: "YOU (if they ask how it works)", text: "We let the property to working professionals — usually on a room-by-room basis. The margin between what we charge and what we pay you covers our costs. From your end, you just get paid, every month, on the same date." },
      { speaker: "YOU", text: "What I'd love to do is arrange a quick viewing — 20-30 minutes — so I can show you the exact guaranteed rent figure and you can see exactly how it works. There's no commitment on your part whatsoever. Would [day] or [day] this week work for you?" },
      { speaker: "TIP", text: "If they hesitate: 'I completely understand — I'm not asking you to decide anything today. Just a 20-minute conversation so you can see if the numbers make sense for you. Worst case, you've had a chat. What have you got to lose?'" },
    ],
  },
  {
    id: "followup",
    label: "Follow-up WhatsApp / Text",
    context: "Send within 2 hours of your phone call while you're fresh in their mind. Keep it short — you're just confirming and making the next step easy.",
    lines: [
      { speaker: "YOU", text: "Hi [Name], it's [Your Name] from [Company] — we just spoke about [address / 'your property']. Great chatting with you." },
      { speaker: "YOU", text: "As promised, here's a quick summary of what we can offer:\n\n✅ Guaranteed rent: £[X] per month\n✅ Paid every month — whether occupied or not\n✅ We cover all day-to-day maintenance (under £[threshold])\n✅ Full management — you won't receive a single tenant call\n✅ [X]-year lease with optional renewal" },
      { speaker: "YOU", text: "I'll also send over our company profile and insurance certificate so you can see exactly who you'd be working with." },
      { speaker: "YOU", text: "I've got [Day] at [time] or [Day] at [time] free for a viewing — which works better for you? Or suggest a time that suits." },
      { speaker: "TIP", text: "If no reply after 48 hours, send one follow-up: 'Hi [Name] — just checking this didn't get buried! Happy to answer any questions before we meet. [Your Name]'" },
    ],
  },
];

const MISTAKES = [
  { icon: "⚠️", title: "Not getting mortgage lender consent", detail: "The number one mistake. If the landlord's mortgage prohibits subletting and they breach it, the lender can demand full repayment of the mortgage. Your head lease could be void. This is non-negotiable — get it in writing every time." },
  { icon: "⚠️", title: "Using a standard AST instead of a Head Lease", detail: "An AST makes you a tenant. A Head Lease makes you a leaseholder with the right to sublet. The legal structure is completely different. Using the wrong document puts you and the landlord in a very difficult position." },
  { icon: "⚠️", title: "Running numbers at 100% occupancy", detail: "Your deal MUST work at 70% occupancy. If it only stacks up when all rooms are full, one empty room wipes out your profit. Always stress-test at 70% before signing." },
  { icon: "⚠️", title: "Not checking HMO licensing before signing", detail: "If you need a Mandatory HMO Licence (5+ people) or an Additional Licence (3–4 people in some areas), you must apply before tenants move in. Operating without a licence is a criminal offence with fines up to £30,000." },
  { icon: "⚠️", title: "Using standard landlord insurance", detail: "Standard landlord insurance won't pay out if you're a leaseholder subletting. You need specialist R2R insurance. If something goes wrong without it, you're personally liable." },
  { icon: "⚠️", title: "Taking on properties too far apart", detail: "Travel time is your hidden cost. A maintenance call 45 minutes away costs you 2 hours. Start in one tight geographic area — within 15–20 minutes of your base — before expanding." },
  { icon: "⚠️", title: "Underestimating setup costs", detail: "First-timers routinely spend 30–40% more than budgeted on furnishing. Get proper quotes before you sign. Budget £1,500–£2,500 per room for a good standard HMO." },
  { icon: "⚠️", title: "Verbal agreements with landlords", detail: "Handshake deals end badly. A landlord can sell the property, change their mind, or die — and without a signed head lease you have nothing. Every deal, no matter how friendly, gets a proper signed agreement." },
];

const FAQS = [
  { q: "Is Rent-to-Rent legal in the UK?", a: "Yes — completely legal, as long as it's done with full transparency. The landlord must know you intend to sublet, must have their mortgage lender's written consent, and the arrangement must be documented in a proper Head Lease Agreement. Done correctly, R2R is a well-established UK property strategy used by thousands of operators." },
  { q: "Do I need a mortgage to do R2R?", a: "No. That's the core appeal of the strategy. You never buy the property — you lease it from the owner. Your costs are the monthly lease payment, setup/furnishing, and ongoing management. No deposit, no mortgage, no stamp duty." },
  { q: "How much money do I need to start?", a: "Typically £3,000–£8,000 for your first property. This covers a security deposit (usually 1–2 months' lease rent), furnishing and setup (£1,500–£2,500 per room for HMO), insurance, solicitor fees for the head lease review, and a small cash buffer. SA setups can cost more depending on the property size." },
  { q: "Do I need a limited company?", a: "Not legally required, but strongly recommended. A Ltd company limits your personal liability, looks more professional to landlords and agents, and gives you cleaner bookkeeping. If something goes seriously wrong with a property, a Ltd company protects your personal assets." },
  { q: "How much can I realistically earn?", a: "HMO R2R: £400–£1,000/month profit per property (4–6 rooms). Serviced accommodation: £300–£800/month at reasonable occupancy. Single-let R2R: £100–£250/month. With 5 HMO properties, you're looking at £2,000–£5,000/month in profit. Most operators aim to replace their salary within 12–18 months of starting." },
  { q: "What if the landlord's mortgage lender refuses consent?", a: "Walk away. Some residential mortgage lenders won't grant subletting consent. Some BTL lenders charge a fee but usually grant it. If a landlord refuses to even ask, or if the lender declines, move to the next deal — do not proceed without written consent. It's not worth the risk." },
  { q: "Can I do R2R on a flat?", a: "Yes, but check two things: (1) the freeholder/head lease for the building — many flat leases prohibit subletting, particularly as an HMO; (2) the landlord's mortgage. SA (Airbnb) in a flat also requires the landlord's permission and often the freeholder's. Single-let R2R on a flat is usually the cleanest option." },
  { q: "Who handles repairs and maintenance?", a: "As the operator, you handle day-to-day maintenance. Typically you agree a threshold in the head lease — e.g. you cover anything under £150–£250, the landlord is responsible for structural/major works above that. Gas boiler, roof, structural issues remain the landlord's responsibility." },
];

const MODELS = [
  {
    id: "hmo", icon: "🏘️", label: "HMO R2R",
    tagline: "Highest margins — most setup",
    desc: "You lease a house, furnish it room by room, and sublet each room individually to separate working professionals. This is the most profitable R2R model.",
    example: { rent: 900, rooms: 5, roomRent: 575, costs: 400 },
    bestFor: "3–6 bed houses near universities, city centres, or transport links",
    risk: "HMO licence required (3+ unrelated tenants in most areas). Higher setup cost.",
  },
  {
    id: "sa", icon: "🏨", label: "Serviced Accommodation",
    tagline: "High nightly rates — needs the right location",
    desc: "You lease a property, furnish it to hotel standard, and list it on Airbnb, Booking.com and direct booking channels. Revenue is per night, not per month.",
    example: { rent: 1100, nightly: 95, occupancy: 70, cleaningPerStay: 25, avgStay: 3, platformFee: 15 },
    bestFor: "City centres, tourist towns, near hospitals, business parks or conference venues",
    risk: "Seasonal demand, Airbnb restrictions in some councils (Article 4), higher cleaning costs.",
  },
  {
    id: "single", icon: "🏠", label: "Single-Let R2R",
    tagline: "Easiest start — slimmest margin",
    desc: "You lease a property and sublet to one household or a corporate tenant at a higher rent. Lower profit than HMO but far less management and perfect for building credibility.",
    example: { rent: 950, sublet: 1150, costs: 75 },
    bestFor: "Corporate lets, young professionals, families — anywhere near business parks or city offices",
    risk: "Thin margins mean one void wipes the month. Best as a stepping stone to HMO.",
  },
];

export default function RentToRentPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [activeScript, setActiveScript] = useState("agent");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeModel, setActiveModel] = useState("hmo");

  const script = SCRIPTS.find((s) => s.id === activeScript)!;
  const model = MODELS.find((m) => m.id === activeModel)!;

  const hmo = model.id === "hmo" ? (model.example as { rent: number; rooms: number; roomRent: number; costs: number }) : null;
  const sa = model.id === "sa" ? (model.example as { rent: number; nightly: number; occupancy: number; cleaningPerStay: number; avgStay: number; platformFee: number }) : null;
  const sl = model.id === "single" ? (model.example as { rent: number; sublet: number; costs: number }) : null;

  const hmoProfit = hmo ? hmo.rooms * hmo.roomRent - hmo.rent - hmo.costs : 0;
  const saMonthlyRevenue = sa ? (sa.nightly * (sa.occupancy / 100) * 30) - (sa.nightly * (sa.occupancy / 100) * 30 * sa.platformFee / 100) - (30 / sa.avgStay * sa.cleaningPerStay) : 0;
  const saProfit = sa ? saMonthlyRevenue - sa.rent : 0;
  const slProfit = sl ? sl.sublet - sl.rent - sl.costs : 0;

  return (
    <main className="min-h-screen bg-[#0a1628] text-white">

      {/* Hero */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 70% 50%, rgba(201,168,76,0.12) 0%, transparent 65%)" }} />
        <div className="relative max-w-5xl mx-auto">
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="bg-[#c9a84c]/20 text-[#c9a84c] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">Strategy Guide</span>
            <span className="bg-white/10 text-white/60 text-xs px-3 py-1 rounded-full">No mortgage needed</span>
            <span className="bg-white/10 text-white/60 text-xs px-3 py-1 rounded-full">UK 2026</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black leading-tight mb-5">
            Rent-to-Rent<br />
            <span className="text-[#c9a84c]">The Complete Guide</span>
          </h1>
          <p className="text-white/70 text-lg md:text-xl max-w-2xl mb-8 leading-relaxed">
            Control properties without a mortgage. Everything you need — the models, the legal framework, a 12-step launch guide, and the exact phone scripts to get your first deal.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl">
            {[
              { stat: "£0", label: "Mortgage needed" },
              { stat: "£3–8k", label: "Typical startup cost" },
              { stat: "£400–1k", label: "Monthly profit/property" },
              { stat: "12–18", label: "Months to salary-replace" },
            ].map((s) => (
              <div key={s.label} className="bg-white/5 rounded-xl p-4 text-center">
                <p className="text-2xl font-black text-[#c9a84c]">{s.stat}</p>
                <p className="text-white/50 text-xs mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What is R2R */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">What is Rent-to-Rent?</h2>
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div className="space-y-4 text-white/75 leading-relaxed">
              <p>Rent-to-Rent (R2R) is a property strategy where you <strong className="text-white">lease a property from a landlord</strong> and then <strong className="text-white">sublet it to tenants at a higher rent</strong>. You never buy the property. The landlord gets a guaranteed income with zero management headaches. You keep the difference.</p>
              <p>Done legally, R2R is a fully legitimate strategy used by thousands of operators across the UK. It requires the landlord&apos;s full knowledge and consent, their mortgage lender&apos;s written approval, and a proper Head Lease Agreement — not a standard tenancy.</p>
              <div className="bg-[#c9a84c]/10 border border-[#c9a84c]/20 rounded-xl p-4 mt-2">
                <p className="text-[#c9a84c] font-semibold mb-1">The R2R proposition to a landlord:</p>
                <p className="text-white/70 text-sm">&ldquo;I&apos;ll pay you a guaranteed rent every month — whether your property is occupied or not. You never deal with a tenant, a maintenance call, or a void again. I take on the management risk; you take the certainty.&rdquo;</p>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { who: "Traditional Letting Agent", rent: "£1,100/mo", cost: "£110–165 management fee", voids: "Landlord bears void risk", mgmt: "Agent manages (charges extra)" },
                { who: "R2R Operator (You)", rent: "£900–950/mo guaranteed", cost: "Zero fees to landlord", voids: "Operator bears void risk", mgmt: "Operator manages everything" },
              ].map((row) => (
                <div key={row.who} className={`rounded-xl p-4 border ${row.who.includes("R2R") ? "border-[#c9a84c]/40 bg-[#c9a84c]/5" : "border-white/10 bg-white/5"}`}>
                  <p className={`font-bold mb-2 ${row.who.includes("R2R") ? "text-[#c9a84c]" : "text-white/60"}`}>{row.who}</p>
                  <div className="grid grid-cols-2 gap-1 text-xs text-white/65">
                    <span>Landlord receives</span><span className="text-white">{row.rent}</span>
                    <span>Fees charged</span><span className="text-white">{row.cost}</span>
                    <span>Void risk</span><span className="text-white">{row.voids}</span>
                    <span>Management</span><span className="text-white">{row.mgmt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3 Models */}
      <section className="py-16 px-6 bg-white/[0.02] border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-2">The 3 R2R Models</h2>
          <p className="text-white/55 mb-8">Choose the model that fits your area, your capital, and your time.</p>
          <div className="flex gap-3 mb-8 flex-wrap">
            {MODELS.map((m) => (
              <button key={m.id} onClick={() => setActiveModel(m.id)}
                className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${activeModel === m.id ? "bg-[#c9a84c] text-[#0a1628]" : "bg-white/10 text-white/70 hover:bg-white/15"}`}>
                {m.icon} {m.label}
              </button>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-bold mb-1">{model.icon} {model.label}</h3>
              <p className="text-[#c9a84c] text-sm font-semibold mb-3">{model.tagline}</p>
              <p className="text-white/70 leading-relaxed mb-4">{model.desc}</p>
              <div className="space-y-2 text-sm">
                <div className="flex gap-2 items-start"><span className="text-green-400 shrink-0">✓</span><span className="text-white/65"><strong className="text-white">Best for:</strong> {model.bestFor}</span></div>
                <div className="flex gap-2 items-start"><span className="text-amber-400 shrink-0">⚠</span><span className="text-white/65"><strong className="text-white">Watch out:</strong> {model.risk}</span></div>
              </div>
            </div>
            <div className="bg-[#0f1b36] rounded-2xl p-6 border border-white/10">
              <p className="text-white/50 text-xs uppercase tracking-wider mb-4">Example Monthly P&amp;L</p>
              {hmo && (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-white/60">You pay landlord</span><span className="text-red-400">−£{hmo.rent.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-white/60">{hmo.rooms} rooms × £{hmo.roomRent}</span><span className="text-green-400">+£{(hmo.rooms * hmo.roomRent).toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-white/60">Bills + running costs</span><span className="text-red-400">−£{hmo.costs.toLocaleString()}</span></div>
                  <div className="border-t border-white/10 pt-2 flex justify-between font-bold text-base"><span>Monthly profit</span><span className="text-[#c9a84c]">£{hmoProfit.toLocaleString()}</span></div>
                </div>
              )}
              {sa && (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-white/60">You pay landlord</span><span className="text-red-400">−£{sa.rent.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-white/60">Revenue ({sa.occupancy}% occ, £{sa.nightly}/night)</span><span className="text-green-400">+£{Math.round(sa.nightly * (sa.occupancy / 100) * 30).toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-white/60">Platform fees + cleaning</span><span className="text-red-400">−£{Math.round(sa.nightly * (sa.occupancy / 100) * 30 * sa.platformFee / 100 + 30 / sa.avgStay * sa.cleaningPerStay).toLocaleString()}</span></div>
                  <div className="border-t border-white/10 pt-2 flex justify-between font-bold text-base"><span>Monthly profit</span><span className="text-[#c9a84c]">£{Math.round(saProfit).toLocaleString()}</span></div>
                </div>
              )}
              {sl && (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-white/60">You pay landlord</span><span className="text-red-400">−£{sl.rent.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-white/60">Corporate/professional tenant pays</span><span className="text-green-400">+£{sl.sublet.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-white/60">Running costs</span><span className="text-red-400">−£{sl.costs.toLocaleString()}</span></div>
                  <div className="border-t border-white/10 pt-2 flex justify-between font-bold text-base"><span>Monthly profit</span><span className="text-[#c9a84c]">£{slProfit.toLocaleString()}</span></div>
                </div>
              )}
              <p className="text-white/35 text-xs mt-4">Example figures only. Always model your specific market.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Legal Requirements */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-2">Legal Requirements</h2>
          <p className="text-white/55 mb-8">R2R is legal. But only if you follow these rules. Every single one.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { n: "1", title: "Landlord's Full Knowledge", icon: "👁️", detail: "The landlord must know you intend to sublet. R2R done without the landlord's knowledge is fraud. Full stop.", critical: true },
              { n: "2", title: "Mortgage Lender Consent", icon: "🏦", detail: "The landlord's mortgage lender must give written consent for subletting. Without this, the landlord is in breach of their mortgage terms and the lender can demand immediate repayment.", critical: true },
              { n: "3", title: "Head Lease Agreement", icon: "📄", detail: "You need a Head Lease — not a standard AST. Under a head lease you become the leaseholder, with the right to sublet. You then issue ASTs to your subtenants as their landlord in law.", critical: true },
              { n: "4", title: "HMO Licence (if required)", icon: "🏘️", detail: "Letting to 3+ unrelated tenants requires a Mandatory HMO Licence. Some councils have Additional Licensing for 3–4 person HMOs. Check before you sign. Operating without a licence = criminal offence.", critical: false },
              { n: "5", title: "Specialist R2R Insurance", icon: "🛡️", detail: "Standard landlord insurance won't pay out for an R2R operator. You need a specialist policy that covers subletting, HMO use, public liability, and your contents (your furniture).", critical: false },
              { n: "6", title: "Subtenant Compliance", icon: "✅", detail: "You are your subtenants' landlord. You must: carry out Right to Rent checks, register deposits, provide a valid EPC, Gas Safety Certificate, EICR, and a compliant written AST.", critical: false },
            ].map((r) => (
              <div key={r.n} className={`rounded-xl p-5 border ${r.critical ? "border-red-500/30 bg-red-500/5" : "border-white/10 bg-white/5"}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{r.icon}</span>
                  {r.critical && <span className="text-red-400 text-xs font-bold uppercase">Critical</span>}
                </div>
                <p className="font-semibold text-white mb-1">{r.title}</p>
                <p className="text-white/60 text-sm leading-relaxed">{r.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 12-Step Guide */}
      <section className="py-16 px-6 bg-white/[0.02] border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-2">The 12-Step Launch Guide</h2>
          <p className="text-white/55 mb-8">Follow these steps in order. Each one builds on the last.</p>
          <div className="grid md:grid-cols-3 gap-2 mb-8">
            {STEPS.map((s, i) => (
              <button key={i} onClick={() => setActiveStep(i)}
                className={`text-left px-4 py-3 rounded-xl border transition-all ${activeStep === i ? "border-[#c9a84c] bg-[#c9a84c]/10 text-[#c9a84c]" : "border-white/10 bg-white/5 text-white/60 hover:text-white hover:border-white/20"}`}>
                <span className="font-mono text-xs">{s.n}</span>
                <p className="font-semibold text-sm mt-0.5">{s.title}</p>
              </button>
            ))}
          </div>
          <div className="bg-[#0f1b36] rounded-2xl p-6 md:p-8 border border-[#c9a84c]/20">
            <div className="flex items-center gap-3 mb-4">
              <span className="font-mono text-[#c9a84c] text-2xl font-black">{STEPS[activeStep].n}</span>
              <h3 className="text-xl font-bold">{STEPS[activeStep].title}</h3>
            </div>
            <p className="text-white/75 leading-relaxed mb-6">{STEPS[activeStep].body}</p>
            <div>
              <p className="text-[#c9a84c] font-semibold text-sm mb-3 uppercase tracking-wider">Action Checklist</p>
              <div className="space-y-2">
                {STEPS[activeStep].checklist.map((item, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <span className="shrink-0 w-5 h-5 rounded border border-[#c9a84c]/40 flex items-center justify-center text-[#c9a84c] text-xs font-bold mt-0.5">✓</span>
                    <p className="text-white/75 text-sm">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setActiveStep(Math.max(0, activeStep - 1))} disabled={activeStep === 0}
                className="px-4 py-2 rounded-lg bg-white/10 text-white/60 hover:bg-white/15 disabled:opacity-30 transition-all text-sm">← Previous</button>
              <button onClick={() => setActiveStep(Math.min(STEPS.length - 1, activeStep + 1))} disabled={activeStep === STEPS.length - 1}
                className="px-4 py-2 rounded-lg bg-[#c9a84c] text-[#0a1628] font-semibold hover:bg-[#b8973b] disabled:opacity-30 transition-all text-sm">Next Step →</button>
            </div>
          </div>
        </div>
      </section>

      {/* Phone Scripts */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-2">Phone Scripts</h2>
          <p className="text-white/55 mb-8">Use these word for word until you&apos;ve done 20 calls. Then adapt them to your style.</p>
          <div className="flex gap-3 mb-6 flex-wrap">
            {SCRIPTS.map((s) => (
              <button key={s.id} onClick={() => setActiveScript(s.id)}
                className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${activeScript === s.id ? "bg-[#c9a84c] text-[#0a1628]" : "bg-white/10 text-white/70 hover:bg-white/15"}`}>
                {s.label}
              </button>
            ))}
          </div>
          <div className="bg-[#0f1b36] rounded-2xl border border-white/10 overflow-hidden">
            <div className="bg-white/5 px-6 py-4 border-b border-white/10">
              <p className="font-semibold text-white">{script.label}</p>
              <p className="text-white/55 text-sm mt-1">{script.context}</p>
            </div>
            <div className="p-6 space-y-4">
              {script.lines.map((line, i) => (
                <div key={i} className={`rounded-xl p-4 ${line.speaker === "YOU" ? "bg-[#c9a84c]/10 border border-[#c9a84c]/20 ml-0 mr-8" : line.speaker === "TIP" ? "bg-blue-500/10 border border-blue-500/20" : "bg-white/5 border border-white/10 ml-8 mr-0"}`}>
                  <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${line.speaker === "YOU" ? "text-[#c9a84c]" : line.speaker === "TIP" ? "text-blue-400" : "text-white/40"}`}>
                    {line.speaker === "TIP" ? "💡 Tip" : line.speaker === "AGENT" || line.speaker === "LANDLORD" ? `[${line.speaker} might say]` : "You say"}
                  </p>
                  <p className="text-white/85 text-sm leading-relaxed whitespace-pre-line">{line.text}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
            <p className="text-amber-400 font-semibold text-sm mb-1">📞 Before you call:</p>
            <p className="text-white/65 text-sm">Have your company name ready. Know the area you&apos;re targeting. Have a specific guaranteed rent figure in mind (use the Deal Analyser to model this before you call). The more specific you are, the more credible you sound.</p>
          </div>
        </div>
      </section>

      {/* Documents checklist */}
      <section className="py-16 px-6 bg-white/[0.02] border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-2">Documents Checklist</h2>
          <p className="text-white/55 mb-8">Everything you need before you take the keys.</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { doc: "Head Lease Agreement", who: "Solicitor-drafted", critical: true },
              { doc: "Mortgage lender subletting consent (written)", who: "Landlord obtains from lender", critical: true },
              { doc: "Specialist R2R insurance certificate", who: "You arrange before signing", critical: true },
              { doc: "HMO licence (if 3+ unrelated tenants)", who: "You apply to council", critical: true },
              { doc: "Gas Safety Certificate (CP12)", who: "You arrange — annual", critical: false },
              { doc: "Electrical Installation Condition Report (EICR)", who: "You arrange — every 5 years", critical: false },
              { doc: "EPC (minimum E — EPC C required by 2030)", who: "Existing or you arrange", critical: false },
              { doc: "PRS Ombudsman registration", who: "You register — mandatory under RRA 2025", critical: true },
              { doc: "Periodic tenancy agreement for each subtenant", who: "You issue as landlord (no fixed terms)", critical: false },
              { doc: "Deposit protection for each subtenant", who: "You register within 30 days", critical: false },
              { doc: "Right to Rent checks for each subtenant", who: "You carry out before move-in", critical: false },
              { doc: "How to Rent booklet", who: "You give to each subtenant", critical: false },
              { doc: "Company credibility pack", who: "You prepare for agents/landlords", critical: false },
            ].map((d) => (
              <div key={d.doc} className={`flex gap-3 items-start rounded-xl p-4 border ${d.critical ? "border-[#c9a84c]/30 bg-[#c9a84c]/5" : "border-white/10 bg-white/5"}`}>
                <span className={`shrink-0 text-sm mt-0.5 ${d.critical ? "text-[#c9a84c]" : "text-white/40"}`}>✓</span>
                <div>
                  <p className="font-semibold text-white text-sm">{d.doc}</p>
                  <p className="text-white/45 text-xs mt-0.5">{d.who}</p>
                </div>
                {d.critical && <span className="ml-auto shrink-0 text-xs text-[#c9a84c] font-bold bg-[#c9a84c]/10 px-2 py-0.5 rounded-full">Required</span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mistakes */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-2">8 Mistakes That Kill R2R Deals</h2>
          <p className="text-white/55 mb-8">Learn from others so you don&apos;t learn the hard way.</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {MISTAKES.map((m, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-5">
                <p className="font-bold text-white mb-1">{m.icon} {m.title}</p>
                <p className="text-white/65 text-sm leading-relaxed">{m.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-6 bg-white/[0.02] border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQS.map((f, i) => (
              <div key={i} className="border border-white/10 rounded-xl overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 hover:bg-white/5 transition-colors">
                  <span className="font-semibold text-white text-sm">{f.q}</span>
                  <span className={`shrink-0 text-[#c9a84c] transition-transform ${openFaq === i ? "rotate-45" : ""}`}>+</span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-white/70 text-sm leading-relaxed border-t border-white/5">{f.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-r from-[#0f1b36] to-[#0a1628] border border-[#c9a84c]/30 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Run Your R2R Numbers</h2>
            <p className="text-white/60 max-w-lg mx-auto mb-8">Before you call a single agent, model the deal. Use our Deal Analyser with the Rent-to-Rent strategy tab to see your projected monthly profit, stress-test occupancy, and know your maximum guaranteed rent offer.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/calculators/deal-analyser"
                className="bg-[#c9a84c] hover:bg-[#b8973b] text-[#0a1628] font-bold px-8 py-3 rounded-xl transition-colors">
                Open Deal Analyser →
              </Link>
              <Link href="/blog/rent-to-rent-explained"
                className="bg-white/10 hover:bg-white/15 text-white font-semibold px-8 py-3 rounded-xl transition-colors">
                Read the Blog Article
              </Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
