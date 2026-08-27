export type Country = {
  code: string;
  name: string;
  nameAr: string;
  nameFr: string;
  currency: string;
  symbol: string;
  flag: string;
  cities: string[];
  hero: string;
  story: string;
  avgRent: string;
  topAreas: string[];
  climate: string;
  language: string;
  foreignBuy: string;
  highlight: string;
  cityStories: Record<string, string>;
};

export const countries: Country[] = [
  {
    code: "gb", name: "United Kingdom", nameAr: "المملكة المتحدة", nameFr: "Royaume-Uni",
    currency: "GBP", symbol: "£", flag: "🇬🇧",
    cities: ["Birmingham", "Nottingham", "Derby", "London", "Manchester", "Leeds", "Leicester", "Coventry"],
    hero: "The UK remains one of the world's most transparent, well-regulated property markets — with strong demand in every major city.",
    story: "From Birmingham's booming regeneration zones to London's global investment appeal, the UK property market offers something for every type of buyer and renter. The Midlands in particular has seen explosive growth — cities like Nottingham, Derby, and Leicester offer yields that inner London simply can't match, with strong student and professional demand year-round. The UK's legal system is clear, English-speaking, and protects both landlord and tenant rights. For diaspora communities looking to invest back in the UK, or international buyers seeking a stable asset, few markets are as reliable.",
    avgRent: "£500–£2,500/mo",
    topAreas: ["Birmingham", "London", "Manchester", "Nottingham", "Leeds"],
    climate: "Temperate oceanic",
    language: "English",
    foreignBuy: "Open to all — no restrictions",
    highlight: "Stable legal system. Strong rental demand. Transparent ownership records.",
    cityStories: {
      "Birmingham": "The UK's second city is reinventing itself. HS2, the Bullring expansion, and a young, diverse population make Birmingham one of the best rental yield cities in England. Areas like Digbeth, Jewellery Quarter, and Edgbaston are particularly popular.",
      "London": "London needs no introduction. The capital commands premium prices but offers unmatched liquidity and long-term capital growth. Zone 2 and east London remain the hotspots for value-conscious investors.",
      "Nottingham": "A large student population from two universities keeps rental demand consistently high. Nottingham offers some of the best gross yields in the country — often 7-9% for well-positioned HMOs.",
      "Derby": "A solid industrial and manufacturing hub, Derby has a stable working population and relatively affordable property prices. Good yields on family homes.",
      "Manchester": "The Northern Powerhouse in action. Manchester's city centre has transformed dramatically with new towers, tech jobs, and cultural investment. Salford and Ancoats are the next frontiers.",
    },
  },
  {
    code: "ma", name: "Morocco", nameAr: "المغرب", nameFr: "Maroc",
    currency: "MAD", symbol: "MAD", flag: "🇲🇦",
    cities: ["Casablanca", "Marrakech", "Rabat", "Tangier", "Fes", "Agadir", "Meknes", "Oujda"],
    hero: "Morocco blends ancient medinas with modern developments — a rising star for property investment in North Africa.",
    story: "Morocco is one of Africa's most politically stable, economically open countries — and one of its most exciting property markets. Casablanca's business district rivals any in the region. Marrakech draws luxury buyers from Europe, the Gulf, and beyond. Tangier — just 14km from Spain — is undergoing a transformation that has not been seen since its international zone heyday. The government actively encourages foreign investment, the legal framework is clear, and repatriation of rental income is permitted. For Moroccan diaspora living in the UK or France, investing at home has never been more straightforward.",
    avgRent: "3,000–12,000 MAD/mo",
    topAreas: ["Casablanca", "Marrakech", "Tangier", "Rabat"],
    climate: "Mediterranean / Semi-arid",
    language: "Arabic, French, Darija",
    foreignBuy: "Open to foreigners — income repatriation permitted",
    highlight: "Affordable entry prices. Strong tourism rental yields. Open to foreign buyers.",
    cityStories: {
      "Casablanca": "Morocco's economic capital and largest city. The Corniche, Gauthier, and Racine districts are most sought after. Business demand keeps rental yields strong, and new developments in the Casablanca Finance City zone are attracting international tenants.",
      "Marrakech": "The jewel of Morocco's tourism industry. Airbnb and short-let yields in the medina and Palmeraie can exceed 10%. A favourite second-home destination for Europeans, with growing infrastructure and an international airport that never sleeps.",
      "Tangier": "Once the wild north, Tangier is now one of Morocco's fastest-growing cities. The Tanger-Med port is the largest in Africa and the Mediterranean, and a new financial free zone is attracting serious investment. Prices are still well below Casablanca.",
      "Rabat": "Morocco's administrative capital is quieter than Casablanca but growing steadily. A diplomatic and governmental city with a stable, professional rental market. Good for long-term lets.",
      "Agadir": "Sun, beach, and tourism make Agadir a holiday let hotspot. Purpose-built resort zones offer managed apartments with attractive returns for overseas investors.",
    },
  },
  {
    code: "eg", name: "Egypt", nameAr: "مصر", nameFr: "Égypte",
    currency: "EGP", symbol: "EGP", flag: "🇪🇬",
    cities: ["Cairo", "Alexandria", "Giza", "Sharm El Sheikh", "Hurghada", "Luxor", "Mansoura", "Tanta"],
    hero: "Egypt is building its future at scale — from the New Administrative Capital to a Red Sea coast that draws the world.",
    story: "Egypt is a country of enormous scale and ambition. The New Administrative Capital — a city being built from scratch east of Cairo — represents one of the largest urban development projects on the planet. Tourism hotspots like Sharm El Sheikh and Hurghada offer Red Sea holiday lets that generate dollar-denominated income in a pound-priced market. Cairo's established districts of Zamalek, New Cairo, and Maadi continue to draw professionals, diplomats, and returning diaspora. Property prices in EGP terms remain highly competitive for those earning in GBP, EUR, or USD — making Egypt one of the best-value markets in the region.",
    avgRent: "5,000–25,000 EGP/mo",
    topAreas: ["New Cairo", "Zamalek", "Maadi", "Alexandria", "New Capital"],
    climate: "Hot desert / Mediterranean coast",
    language: "Arabic (Egyptian dialect)",
    foreignBuy: "Open — foreigners can buy most property types",
    highlight: "Dollar-attractive pricing. Huge development pipeline. Tourism rental demand.",
    cityStories: {
      "Cairo": "Egypt's mega-capital of 20 million people. Zamalek (on Nile island) and Maadi (tree-lined suburb) are the most desirable for expats. New Cairo compounds offer gated luxury at a fraction of equivalent Gulf pricing.",
      "Alexandria": "Egypt's Mediterranean gem and second city. The corniche apartments with sea views are a classic choice. A cooler summer climate makes it popular for internal tourism from Cairo.",
      "Sharm El Sheikh": "A Red Sea resort city that operates almost entirely in USD and EUR tourism revenue. Holiday apartments and chalets in compounds like Nabq and Hadaba offer strong short-let returns.",
      "Hurghada": "Another Red Sea darling, Hurghada has evolved from a scuba-diving spot into a year-round resort destination with a growing permanent expat community. Russian and German buyers have historically been active here.",
      "Giza": "Home to the Pyramids and a city in its own right. The Sheikh Zayed and 6th October corridors have seen massive residential development, offering large apartments at highly competitive prices.",
    },
  },
  // ── countries below are not active in this phase ──
  /*
  {
    code: "ae", name: "UAE", nameAr: "الإمارات", nameFr: "EAU",
    currency: "AED", symbol: "AED", flag: "🇦🇪",
    cities: ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah", "Fujairah"],
    hero: "The UAE is the world's most dynamic property market — zero income tax, golden visas, and a skyline that never stops growing.",
    story: "The UAE — and Dubai in particular — has become the global benchmark for aspiration in real estate. No income tax. No capital gains tax. A Golden Visa tied to property investment. A world-class infrastructure, safety record, and quality of life that attracts millionaires and middle-class families alike. The off-plan market has matured significantly since 2008, with the RERA (Real Estate Regulatory Authority) providing strong buyer protections. Abu Dhabi offers a more measured market with high-quality developments on Saadiyat Island. Sharjah and Ajman offer the most affordable entry points in the federation for those who commute.",
    avgRent: "3,000–20,000 AED/mo",
    topAreas: ["Dubai Marina", "Downtown Dubai", "Business Bay", "Jumeirah", "Saadiyat Island"],
    climate: "Hot desert — warm winters, very hot summers",
    language: "Arabic (official), English (widely spoken)",
    foreignBuy: "Full freehold ownership in designated zones — no restrictions",
    highlight: "Zero tax. Golden Visa eligibility. World-class lifestyle. Strong capital appreciation.",
    cityStories: {
      "Dubai": "The world's most watched property market. Marina, Downtown, and Business Bay dominate foreign buyer interest. Palm Jumeirah for ultra-luxury. Emerging areas like Dubai South and Dubai Creek Harbour offer off-plan at better value.",
      "Abu Dhabi": "The capital is more corporate and measured than Dubai. Saadiyat Island, Yas Island, and Al Reem Island are the premium freehold zones. Strong rental demand from government and oil-sector employees.",
      "Sharjah": "The most affordable emirate, popular with UAE's large middle-income workforce. A bedroom community to Dubai with good school options and a strong family-oriented culture.",
      "Ajman": "The smallest emirate offers some of the UAE's cheapest property — popular with first-time buyers and those priced out of Dubai.",
      "Ras Al Khaimah": "RAK is on the rise. A new integrated resort (Wynn) is under development. Waterfront communities like Al Marjan Island offer sea-view apartments at a significant discount to Dubai.",
    },
  },
  {
    code: "sa", name: "Saudi Arabia", nameAr: "السعودية", nameFr: "Arabie Saoudite",
    currency: "SAR", symbol: "SAR", flag: "🇸🇦",
    cities: ["Riyadh", "Jeddah", "Mecca", "Medina", "Dammam", "Khobar"],
    hero: "Saudi Arabia's Vision 2030 is the most ambitious urban transformation in the world — and its property market is just getting started.",
    story: "Saudi Arabia is undergoing a transformation without precedent. Vision 2030 is diversifying the economy away from oil, and real estate is central to that plan. NEOM, the Red Sea Project, Diriyah, and Qiddiya are mega-developments that are creating entirely new cities. Riyadh is being reimagined as a global capital — a metro system, a new airport, and over $1 trillion in planned infrastructure investment. For the first time in the Kingdom's history, foreign residents and investors have a clear path to property ownership in designated zones. The rental market has always been strong — a large expat workforce in Riyadh, Jeddah, and the Eastern Province drives consistent demand.",
    avgRent: "3,000–15,000 SAR/mo",
    topAreas: ["Riyadh", "Jeddah", "NEOM", "Red Sea Project"],
    climate: "Hot desert — mild winters in the north",
    language: "Arabic",
    foreignBuy: "Opening rapidly under Vision 2030 — designated zones for foreigners",
    highlight: "Mega-project pipeline. Vision 2030 tailwind. Rental demand from large expat population.",
    cityStories: {
      "Riyadh": "The Saudi capital is being transformed at speed. The King Abdullah Financial District, Diriyah Gate, and new metro lines are reshaping the city. Compound living for expats offers high-quality, secure communities with Western amenities.",
      "Jeddah": "The Red Sea port city is Saudi Arabia's most cosmopolitan. The corniche, Al-Balad (UNESCO heritage), and new beachfront developments are key areas. A more relaxed social atmosphere makes it popular with younger Saudis and expats.",
      "Dammam / Khobar": "The Eastern Province is Saudi Arabia's oil heartland and home to Saudi Aramco. A large expat engineer and corporate population drives strong demand for quality housing.",
    },
  },
  {
    code: "kw", name: "Kuwait", nameAr: "الكويت", nameFr: "Koweït",
    currency: "KWD", symbol: "KWD", flag: "🇰🇼",
    cities: ["Kuwait City", "Hawalli", "Salmiya", "Jahra"],
    hero: "Kuwait offers one of the Gulf's most stable, high-income rental markets — with strong demand and limited land.",
    story: "Kuwait is a compact, wealthy Gulf state with one of the world's highest per-capita incomes. Its small land area and high population density create consistent rental demand in all major districts. Kuwait City's financial district, Salmiya's retail hub, and the seafront communities along the Arabian Gulf are particularly sought-after. The majority of Kuwait's large expat workforce rents rather than buys, providing reliable long-term tenancy. For Kuwaiti nationals and GCC citizens, residential property investment is straightforward and well-regulated.",
    avgRent: "300–1,200 KWD/mo",
    topAreas: ["Kuwait City", "Salmiya", "Hawalli", "Fintas"],
    climate: "Hot desert — very hot summers, mild winters",
    language: "Arabic (official), English widely used",
    foreignBuy: "Restricted — primarily for GCC nationals; expats can lease",
    highlight: "High-income tenant base. Consistent demand. GCC stability.",
    cityStories: {
      "Kuwait City": "The capital and commercial heart. Sharq (financial district) and the Kuwait Towers waterfront are the most prestigious. Salwa and Rumaithiya are established residential communities popular with expat families.",
      "Salmiya": "The buzzing retail and dining hub of Kuwait. Highly walkable by Gulf standards, popular with younger renters and couples. Strong demand for apartments near the Marina Crescent.",
      "Hawalli": "A dense, more affordable district popular with the large South Asian and Egyptian communities. High occupancy rates and reliable rental income.",
    },
  },
  {
    code: "bh", name: "Bahrain", nameAr: "البحرين", nameFr: "Bahreïn",
    currency: "BHD", symbol: "BHD", flag: "🇧🇭",
    cities: ["Manama", "Muharraq", "Riffa", "Hamad Town"],
    hero: "Bahrain is the Gulf's most open property market — freehold ownership for all nationalities, zero property tax.",
    story: "Bahrain punches above its weight. As the smallest Gulf state, it compensates with openness — foreign nationals can own freehold property anywhere on the island, not just in designated zones. There is no property tax, no capital gains tax, and no inheritance tax on real estate. Bahrain has long been the Gulf's financial services hub, with a large banking, insurance, and professional services sector driving quality rental demand. Amwaj Islands, Seef District, and the new Bahrain Bay development are the premium addresses. Bahrain's causeway connection to Saudi Arabia makes it particularly attractive for Saudi nationals seeking a more liberal lifestyle — a dynamic that uniquely supports the island's property and hospitality market.",
    avgRent: "300–1,000 BHD/mo",
    topAreas: ["Manama", "Amwaj Islands", "Seef", "Diplomatic Area"],
    climate: "Hot desert — humid summers, warm winters",
    language: "Arabic (official), English widely spoken",
    foreignBuy: "Full freehold for all nationalities — no restrictions",
    highlight: "Full freehold for all. Zero property tax. Saudi Arabia causeway access.",
    cityStories: {
      "Manama": "The island's capital and financial centre. The Diplomatic Area and Seef District are the corporate heartland. Bahrain Bay is a stunning waterfront development attracting buyers from across the region.",
      "Amwaj Islands": "A man-made island development of reclaimed land with a marina, beach clubs, and residential towers. The most popular address for expat buyers seeking a resort lifestyle. Strong short-let potential.",
      "Muharraq": "Home to Bahrain International Airport and a historic old town being carefully restored. Affordable and growing.",
    },
  },
  {
    code: "qa", name: "Qatar", nameAr: "قطر", nameFr: "Qatar",
    currency: "QAR", symbol: "QAR", flag: "🇶🇦",
    cities: ["Doha", "Al Wakrah", "Al Khor", "Lusail"],
    hero: "Qatar is investing for a century — and its property market reflects a nation building the Gulf's most ambitious future.",
    story: "Qatar's wealth is staggering and its ambition even more so. The 2022 World Cup put the country on every map that wasn't already aware of it, and the infrastructure investment — stadiums, metro, hotels, roads — has permanently upgraded the country's appeal. Lusail City, a brand new urban development north of Doha, is one of the most impressive planned cities in the world. The Pearl Qatar — an artificial island of luxury residences — is the most recognized address in the country. Since 2020, Qatar has opened freehold ownership to all nationalities in designated zones, along with a residence permit tied to property purchase. Doha's West Bay corporate towers and The Pearl's marina apartments are the highest-demand rental addresses.",
    avgRent: "4,000–18,000 QAR/mo",
    topAreas: ["The Pearl", "West Bay", "Lusail", "Al Sadd"],
    climate: "Hot desert — very hot summers, pleasant winters",
    language: "Arabic (official), English widely spoken",
    foreignBuy: "Freehold in designated zones — residence permit linked to purchase",
    highlight: "World Cup legacy infrastructure. Pearl Qatar prestige. Growing expat community.",
    cityStories: {
      "Doha": "Qatar's only major city, but a world-class one. West Bay's towers house the country's corporate elite. Al Sadd and Al Rayyan are popular with families. The waterfront Corniche is the city's social spine.",
      "Lusail": "The future city. Lusail hosted the World Cup final and is now home to Qatar's most modern urban district — office towers, luxury apartments, parks, and a marina. One of the most exciting property destinations in the GCC.",
      "The Pearl Qatar": "An iconic artificial island connected to Doha by a causeway. Mediterranean-style architecture, yacht clubs, luxury retail, and a strong expat community. The most recognizable address in Qatar.",
    },
  },
  {
    code: "om", name: "Oman", nameAr: "عُمان", nameFr: "Oman",
    currency: "OMR", symbol: "OMR", flag: "🇴🇲",
    cities: ["Muscat", "Salalah", "Sohar", "Nizwa"],
    hero: "Oman is the Gulf's best-kept secret — authentic, stable, and opening its doors to the world.",
    story: "Oman is unlike any other Gulf state. Less flash, more substance. The late Sultan Qaboos built a nation on education, culture, and sustainability — and the property market reflects that measured approach. Muscat is one of the cleanest, safest, and most livable capitals in the Middle East. The Integrated Tourism Complexes (ITCs) introduced in the 2000s allow foreigners full freehold ownership with a resident visa — one of the most generous foreign ownership regimes in the region. Muscat Hills, The Wave, Saraya Bandar Jissah, and Almouj are the premium freehold communities. Tourism is growing — Salalah's monsoon season draws visitors from across the Gulf, and the government is investing heavily in sustainable tourism infrastructure.",
    avgRent: "300–1,500 OMR/mo",
    topAreas: ["Muscat Hills", "The Wave", "Al Mouj", "Qurum"],
    climate: "Hot desert — Salalah has unique monsoon season (khareef)",
    language: "Arabic (official), English widely spoken",
    foreignBuy: "Full freehold in designated ITCs — residence visa included",
    highlight: "Residence visa with purchase. Lowest crime rate in the Gulf. Authentic lifestyle.",
    cityStories: {
      "Muscat": "Oman's capital stretches along 40km of coastline between mountains and sea. Qurum, Shatti Al Qurum, and Al Khuwair are the established expat neighbourhoods. The Wave and Muscat Hills offer luxury sea-view living with full freehold rights.",
      "Salalah": "Oman's second city and the jewel of the south. The monsoon season (June–September) brings lush green landscapes unlike anything else in Arabia. A growing tourism infrastructure and new airport make it an emerging property destination.",
    },
  },
  {
    code: "jo", name: "Jordan", nameAr: "الأردن", nameFr: "Jordanie",
    currency: "JOD", symbol: "JOD", flag: "🇯🇴",
    cities: ["Amman", "Irbid", "Zarqa", "Aqaba"],
    hero: "Jordan is the Middle East's most stable, welcoming destination — where ancient history meets a modern, educated society.",
    story: "Jordan occupies a unique position in the Middle East — politically stable, internationally respected, and strategically located at the crossroads of the Levant. Amman is a sophisticated, educated capital with a thriving expat community, a strong NGO and diplomatic sector, and growing tech and startup ecosystem. Property prices remain highly attractive compared to the Gulf, and the Jordanian dinar's peg to the US dollar provides currency stability for foreign investors. Aqaba — Jordan's only port city on the Red Sea — is a free economic zone with tax advantages and a growing tourism and marine industry. The Jordanian government has an established programme to grant residency to property investors.",
    avgRent: "300–1,200 JOD/mo",
    topAreas: ["Amman (Abdoun, Sweifieh)", "Aqaba", "Irbid"],
    climate: "Semi-arid — warm summers, cold winters in Amman",
    language: "Arabic (official), English widely spoken",
    foreignBuy: "Open to foreigners — residency available for qualifying investments",
    highlight: "USD-pegged currency. Residency for investors. Most stable Levant market.",
    cityStories: {
      "Amman": "Jordan's sprawling, hilly capital is one of the most livable cities in the Arab world. Abdoun, Sweifieh, and Dabouq are the premium residential districts. A large international NGO and diplomatic community provides consistent rental demand for quality housing.",
      "Aqaba": "Jordan's Red Sea city and free economic zone. Lower taxes, a growing tourism sector, and proximity to Eilat make it attractive. Beachfront apartments and resort-style living at a fraction of Gulf prices.",
      "Irbid": "A major university city in northern Jordan, second in size only to Amman. Strong student rental demand and very affordable entry prices.",
    },
  },
  */
];

export const propertyTypes = ["Room", "Studio", "Flat", "Apartment", "House", "Villa", "Penthouse", "Land", "Commercial"];

export const features = [
  "Parking", "Garden", "Pool", "Gym", "Balcony", "Terrace", "Sea view", "City view",
  "Pets OK", "Bills included", "En-suite", "Washing machine", "Dishwasher",
  "Air conditioning", "Central heating", "Elevator", "Security", "Doorman",
  "Furnished", "Part furnished", "Unfurnished", "EPC C+", "Near transport",
  "Near school", "Near mosque", "Near beach", "Maid's room", "Driver's room",
];

export type Lang = "en" | "ar" | "fr";

export const translations: Record<Lang, Record<string, string>> = {
  en: {
    "hero.title": "Find your place",
    "hero.subtitle": "Rooms, flats, houses, and villas across the UK, Egypt, and Morocco. List free. Browse free. No agents needed.",
    "hero.search": "Search by city, area, or keyword...",
    "hero.cta": "Search",
    "nav.browse": "Browse",
    "nav.rooms": "Rooms",
    "nav.list": "List free",
    "nav.wanted": "Wanted",
    "nav.about": "About",
    "nav.how": "How it works",
    "nav.login": "Log in",
    "nav.signup": "Sign up free",
    "nav.dashboard": "Dashboard",
    "listing.available": "Available now",
    "listing.perMonth": "/mo",
    "listing.beds": "beds",
    "listing.bed": "bed",
    "listing.studio": "Studio",
    "listing.interested": "Interested?",
    "listing.contact": "Contact the landlord directly — no agents, no fees.",
    "listing.whatsapp": "WhatsApp",
    "listing.sendEnquiry": "Send enquiry",
    "listing.save": "Save listing",
    "listing.saved": "Saved",
    "listing.share": "Share",
    "listing.loginToEnquire": "Log in to send an enquiry or save this listing",
    "listing.about": "About this property",
    "listing.features": "Features",
    "listing.listedBy": "Listed by",
    "list.title": "List your property",
    "list.subtitle": "Your listing goes live after review. Photos required.",
    "list.whatListing": "What are you listing?",
    "list.photos": "Photos (minimum 3 required)",
    "list.photosHint": "Upload at least 3 clear photos. Listings without quality photos won't be approved.",
    "list.video": "Video tour (optional)",
    "list.publish": "Submit for review",
    "list.signinRequired": "Sign in to list your property",
    "cta.listFree": "List for free",
    "cta.browse": "Browse listings",
    "filter.all": "All",
    "filter.allCities": "All cities",
    "filter.allCountries": "All countries",
    "filter.results": "results",
    "stats.listings": "listings live",
    "stats.countries": "countries",
    "stats.free": "Free forever",
    "stats.noFees": "Zero agent fees",
    "how.title": "How Makan works",
    "how.browse.title": "Browse or search",
    "how.browse.desc": "Filter by type, city, or budget. Every listing is free to view.",
    "how.message.title": "Message directly",
    "how.message.desc": "Contact the landlord via WhatsApp or enquiry. No middlemen.",
    "how.movein.title": "Move in",
    "how.movein.desc": "Agree terms, sign up, and move in. It's your place.",
    "footer.tagline": "Find your place. UK · Egypt · Morocco.",
    "footer.copyright": "Makan by PropertyVault UK. Free for everyone.",
  },
  ar: {
    "hero.title": "لاقي مكانك",
    "hero.subtitle": "غرف، شقق، بيوت، وفلل في بريطانيا، مصر، والمغرب. سجّل مجاناً. تصفّح مجاناً. بدون وسطاء.",
    "hero.search": "ابحث بالمدينة أو المنطقة...",
    "hero.cta": "بحث",
    "nav.browse": "تصفّح",
    "nav.rooms": "غرف",
    "nav.list": "أعلن مجاناً",
    "nav.wanted": "مطلوب",
    "nav.about": "عن مكان",
    "nav.how": "كيف يعمل",
    "nav.login": "تسجيل دخول",
    "nav.signup": "حساب جديد",
    "nav.dashboard": "لوحة التحكم",
    "listing.available": "متاح الآن",
    "listing.perMonth": "/شهر",
    "listing.beds": "غرف نوم",
    "listing.bed": "غرفة نوم",
    "listing.studio": "ستوديو",
    "listing.interested": "مهتم؟",
    "listing.contact": "تواصل مع المالك مباشرة — بدون وسطاء، بدون رسوم.",
    "listing.whatsapp": "واتساب",
    "listing.sendEnquiry": "إرسال استفسار",
    "listing.save": "حفظ",
    "listing.saved": "محفوظ",
    "listing.share": "مشاركة",
    "listing.loginToEnquire": "سجّل دخولك لإرسال استفسار أو حفظ الإعلان",
    "listing.about": "عن هذا العقار",
    "listing.features": "المميزات",
    "listing.listedBy": "بواسطة",
    "list.title": "أعلن عن عقارك",
    "list.subtitle": "إعلانك يظهر بعد المراجعة. الصور مطلوبة.",
    "list.whatListing": "ماذا تريد أن تعلن؟",
    "list.photos": "صور (٣ على الأقل)",
    "list.photosHint": "ارفع ٣ صور واضحة على الأقل. الإعلانات بدون صور جيدة لن تُقبل.",
    "list.video": "فيديو جولة (اختياري)",
    "list.publish": "إرسال للمراجعة",
    "list.signinRequired": "سجّل دخولك لإضافة عقارك",
    "cta.listFree": "أعلن مجاناً",
    "cta.browse": "تصفّح الإعلانات",
    "filter.all": "الكل",
    "filter.allCities": "كل المدن",
    "filter.allCountries": "كل الدول",
    "filter.results": "نتيجة",
    "stats.listings": "إعلان",
    "stats.countries": "دول",
    "stats.free": "مجاني للأبد",
    "stats.noFees": "بدون عمولة",
    "how.title": "كيف يعمل مكان",
    "how.browse.title": "تصفّح أو ابحث",
    "how.browse.desc": "فلتر حسب النوع أو المدينة أو الميزانية. كل الإعلانات مجانية.",
    "how.message.title": "تواصل مباشرة",
    "how.message.desc": "راسل المالك عبر واتساب أو النموذج. بدون وسطاء.",
    "how.movein.title": "انتقل",
    "how.movein.desc": "اتفق على الشروط واسكن. مكانك أنت.",
    "footer.tagline": "لاقي مكانك. بريطانيا · مصر · المغرب.",
    "footer.copyright": "مكان من PropertyVault UK. مجاني للجميع.",
  },
  fr: {
    "hero.title": "Trouvez votre place",
    "hero.subtitle": "Chambres, appartements, maisons et villas au Royaume-Uni, en Égypte et au Maroc. Annoncez gratuitement. Parcourez gratuitement. Sans agents.",
    "hero.search": "Rechercher par ville, quartier ou mot-clé...",
    "hero.cta": "Rechercher",
    "nav.browse": "Parcourir",
    "nav.rooms": "Chambres",
    "nav.list": "Publier gratuit",
    "nav.wanted": "Recherché",
    "nav.about": "À propos",
    "nav.how": "Comment ça marche",
    "nav.login": "Connexion",
    "nav.signup": "Inscription gratuite",
    "nav.dashboard": "Tableau de bord",
    "listing.available": "Disponible maintenant",
    "listing.perMonth": "/mois",
    "listing.beds": "chambres",
    "listing.bed": "chambre",
    "listing.studio": "Studio",
    "listing.interested": "Intéressé ?",
    "listing.contact": "Contactez le propriétaire directement — sans agents, sans frais.",
    "listing.whatsapp": "WhatsApp",
    "listing.sendEnquiry": "Envoyer une demande",
    "listing.save": "Sauvegarder",
    "listing.saved": "Sauvegardé",
    "listing.share": "Partager",
    "listing.loginToEnquire": "Connectez-vous pour envoyer une demande ou sauvegarder cette annonce",
    "listing.about": "À propos de ce bien",
    "listing.features": "Caractéristiques",
    "listing.listedBy": "Publié par",
    "list.title": "Publiez votre bien",
    "list.subtitle": "Votre annonce sera en ligne après vérification. Photos requises.",
    "list.whatListing": "Que souhaitez-vous publier ?",
    "list.photos": "Photos (minimum 3 requises)",
    "list.photosHint": "Téléchargez au moins 3 photos claires. Les annonces sans photos de qualité ne seront pas approuvées.",
    "list.video": "Visite vidéo (optionnel)",
    "list.publish": "Soumettre pour vérification",
    "list.signinRequired": "Connectez-vous pour publier votre bien",
    "cta.listFree": "Publier gratuitement",
    "cta.browse": "Parcourir les annonces",
    "filter.all": "Tout",
    "filter.allCities": "Toutes les villes",
    "filter.allCountries": "Tous les pays",
    "filter.results": "résultats",
    "stats.listings": "annonces en ligne",
    "stats.countries": "pays",
    "stats.free": "Gratuit pour toujours",
    "stats.noFees": "Zéro frais d'agence",
    "how.title": "Comment fonctionne Makan",
    "how.browse.title": "Parcourez ou recherchez",
    "how.browse.desc": "Filtrez par type, ville ou budget. Toutes les annonces sont gratuites.",
    "how.message.title": "Contactez directement",
    "how.message.desc": "Contactez le propriétaire par WhatsApp ou formulaire. Sans intermédiaires.",
    "how.movein.title": "Emménagez",
    "how.movein.desc": "Convenez des termes et emménagez. C'est votre place.",
    "footer.tagline": "Trouvez votre place. Royaume-Uni · Égypte · Maroc.",
    "footer.copyright": "Makan par PropertyVault UK. Gratuit pour tous.",
  },
};

export function getCountry(code: string) {
  return countries.find(c => c.code === code);
}

export function getCities(countryCode: string) {
  return getCountry(countryCode)?.cities || [];
}

/**
 * Format a listing price for display.
 *
 * Listing data comes from user submissions and the database, so `amount` can
 * legitimately arrive as null, undefined or NaN. The previous implementation
 * called .toLocaleString() on it unguarded, which threw on null/undefined, and
 * fell back to an unformatted bare number for unknown country codes. An
 * unknown currency symbol also rendered the literal string "undefined"
 * alongside the number.
 *
 * Returns "—" for a missing price so the UI shows an honest placeholder rather
 * than "£undefined" or a crash.
 */
export function formatPrice(amount: number | null | undefined, countryCode: string) {
  if (amount === null || amount === undefined || !Number.isFinite(Number(amount))) return "—";
  const n = Number(amount).toLocaleString("en-GB");

  const country = getCountry(countryCode);
  // Unknown country: show the number without inventing a currency.
  if (!country) return n;
  if (country.currency === "GBP") return `£${n}`;
  // Fall back to the ISO currency code if no display symbol is configured,
  // so a missing symbol can never render as "undefined".
  return `${n} ${country.symbol || country.currency}`.trim();
}
