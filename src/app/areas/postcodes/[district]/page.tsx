import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Disclaimer } from "@/components/legal/Disclaimer";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { AreaSoldPricesWidget } from "@/components/ui/AreaSoldPricesWidget";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

type District = {
  code: string;
  city: string;
  citySlug: string;
  region: string;
  label: string;
  centre: string;
  desc: string;
  avgPrice: string;
  yield: string;
  profile: string;
  gr: boolean;
};

export const DISTRICTS: District[] = [
  // Birmingham
  { code: "B1",  city: "Birmingham", citySlug: "birmingham", region: "West Midlands", label: "B1 — Birmingham City Centre", centre: "B1 1AA", avgPrice: "£140k-£220k", yield: "6-8%", desc: "City centre postcodes surrounding Broad Street, Brindleyplace, and Centenary Square.", profile: "Strong demand for apartments and city-centre flats. Close to major employers and the tram network.", gr: true },
  { code: "B2",  city: "Birmingham", citySlug: "birmingham", region: "West Midlands", label: "B2 — Birmingham City Centre South", centre: "B2 4QA", avgPrice: "£140k-£210k", yield: "6-8%", desc: "Digbeth and south of the city centre. Significant creative quarter regeneration underway.", profile: "Growing arts and tech district. Young professional and student rental demand. High regeneration upside.", gr: true },
  { code: "B3",  city: "Birmingham", citySlug: "birmingham", region: "West Midlands", label: "B3 — Jewellery Quarter", centre: "B3 1QT", avgPrice: "£150k-£250k", yield: "5-7%", desc: "Birmingham's Jewellery Quarter — a conservation area with converted workshops and period apartments.", profile: "Premium inner-city BTL. Boutique character, strong professional demand, low void rates.", gr: true },
  { code: "B4",  city: "Birmingham", citySlug: "birmingham", region: "West Midlands", label: "B4 — Aston & HS2 Zone", centre: "B4 7AP", avgPrice: "£120k-£180k", yield: "6-8%", desc: "Aston and the area around Birmingham's future HS2 Curzon Street station.", profile: "Significant HS2 regeneration uplift potential. Currently affordable with high yield, improving rapidly.", gr: true },
  { code: "B5",  city: "Birmingham", citySlug: "birmingham", region: "West Midlands", label: "B5 — Highgate & Bordesley", centre: "B5 6QG", avgPrice: "£115k-£175k", yield: "6-8%", desc: "Inner south Birmingham including Highgate and Bordesley Green.", profile: "Affordable entry point close to the city centre. Strong working community rental demand.", gr: true },
  { code: "B6",  city: "Birmingham", citySlug: "birmingham", region: "West Midlands", label: "B6 — Aston & Newtown", centre: "B6 4AP", avgPrice: "£110k-£165k", yield: "6-8%", desc: "North inner city including Aston, Newtown, and Lozells.", profile: "Very affordable. High yield potential from low entry prices. Active BRRR market.", gr: true },
  { code: "B11", city: "Birmingham", citySlug: "birmingham", region: "West Midlands", label: "B11 — Sparkhill", centre: "B11 1AQ", avgPrice: "£115k-£170k", yield: "6-8%", desc: "Sparkhill in south Birmingham. Diverse community with strong local rental market.", profile: "Consistent rental demand. Affordable terraced housing. Good transport to city centre.", gr: true },
  { code: "B12", city: "Birmingham", citySlug: "birmingham", region: "West Midlands", label: "B12 — Balsall Heath & Highgate", centre: "B12 9QH", avgPrice: "£115k-£180k", yield: "6-8%", desc: "Balsall Heath — an improving inner suburb south of the city centre.", profile: "Good yield with improving area profile. Strong demand from city centre workforce.", gr: true },
  { code: "B13", city: "Birmingham", citySlug: "birmingham", region: "West Midlands", label: "B13 — Moseley & Kings Heath", centre: "B13 8QH", avgPrice: "£180k-£270k", yield: "5-6%", desc: "Moseley and Kings Heath — two of Birmingham's most popular bohemian suburbs.", profile: "Strong professional and young family demand. Independent shops and café culture. Capital growth focus.", gr: true },
  { code: "B14", city: "Birmingham", citySlug: "birmingham", region: "West Midlands", label: "B14 — Kings Heath & Brandwood", centre: "B14 7AA", avgPrice: "£160k-£240k", yield: "5-6%", desc: "Kings Heath and the south Birmingham suburbs — popular with families and professionals.", profile: "Good quality housing stock. Reliable long-term family tenants. Consistent demand.", gr: true },
  { code: "B15", city: "Birmingham", citySlug: "birmingham", region: "West Midlands", label: "B15 — Edgbaston", centre: "B15 2TH", avgPrice: "£200k-£380k", yield: "4-5%", desc: "Edgbaston — Birmingham's most prestigious postcode, bordering the university.", profile: "Premium professional and academic rental market. Low yields but strong capital growth and low void rates.", gr: true },
  { code: "B17", city: "Birmingham", citySlug: "birmingham", region: "West Midlands", label: "B17 — Harborne", centre: "B17 0DH", avgPrice: "£250k-£380k", yield: "4-5%", desc: "Harborne — a leafy suburb popular with NHS consultants and professionals near QE Hospital.", profile: "High-quality professional tenants. Near Queen Elizabeth Hospital. Premium rents and long tenancies.", gr: true },
  { code: "B18", city: "Birmingham", citySlug: "birmingham", region: "West Midlands", label: "B18 — Winson Green & Ladywood", centre: "B18 4LR", avgPrice: "£110k-£165k", yield: "6-8%", desc: "Winson Green and Ladywood in west Birmingham — affordable inner suburbs.", profile: "Affordable entry prices. High yield potential. Good transport to city centre.", gr: true },
  { code: "B29", city: "Birmingham", citySlug: "birmingham", region: "West Midlands", label: "B29 — Selly Oak & Bournbrook", centre: "B29 6QA", avgPrice: "£150k-£220k", yield: "6-8%", desc: "Selly Oak and Bournbrook — the main student area for University of Birmingham.", profile: "Excellent HMO market. Consistent year-round student demand. Some of Birmingham's strongest yields.", gr: true },
  // Coventry
  { code: "CV1", city: "Coventry", citySlug: "coventry", region: "West Midlands", label: "CV1 — Coventry City Centre", centre: "CV1 1JB", avgPrice: "£130k-£200k", yield: "5-7%", desc: "Coventry city centre including the cathedral area, Coventry University campus and Hillfields.", profile: "Strong student and professional rental demand. Mix of modern apartments and Victorian terraces.", gr: true },
  { code: "CV2", city: "Coventry", citySlug: "coventry", region: "West Midlands", label: "CV2 — Stoke & Wyken", centre: "CV2 3FX", avgPrice: "£140k-£200k", yield: "5-6%", desc: "East Coventry including Stoke and Wyken — established residential suburbs.", profile: "Family and professional rental demand. Consistent market with good transport to the city centre.", gr: true },
  { code: "CV3", city: "Coventry", citySlug: "coventry", region: "West Midlands", label: "CV3 — Binley & Cheylesmore", centre: "CV3 1GE", avgPrice: "£175k-£260k", yield: "5-6%", desc: "South Coventry including Binley, Cheylesmore, and Whitley — near JLR Whitley HQ.", profile: "Professional and JLR employee rental demand. Good quality housing. Reliable income.", gr: true },
  { code: "CV4", city: "Coventry", citySlug: "coventry", region: "West Midlands", label: "CV4 — Canley & University", centre: "CV4 7AL", avgPrice: "£140k-£190k", yield: "6-8%", desc: "Canley — the primary student area adjacent to University of Warwick campus.", profile: "Excellent HMO market. Year-round Warwick University student demand. Strong consistent yields.", gr: true },
  { code: "CV6", city: "Coventry", citySlug: "coventry", region: "West Midlands", label: "CV6 — Radford & Foleshill", centre: "CV6 1GS", avgPrice: "£140k-£185k", yield: "6-7%", desc: "North Coventry including Radford and Foleshill — affordable inner suburbs.", profile: "Consistent rental demand. Affordable terraced housing. Good bus links to city centre.", gr: true },
  // Nottingham
  { code: "NG1", city: "Nottingham", citySlug: "nottingham", region: "East Midlands", label: "NG1 — Nottingham City Centre", centre: "NG1 1AA", avgPrice: "£120k-£200k", yield: "6-8%", desc: "Nottingham city centre including the Lace Market, Hockley, and the old market square.", profile: "Strong professional and student demand. Good for apartments. Consistent demand from Nottingham's major employers.", gr: true },
  { code: "NG2", city: "Nottingham", citySlug: "nottingham", region: "East Midlands", label: "NG2 — The Meadows & West Bridgford", centre: "NG2 3AE", avgPrice: "£150k-£260k", yield: "5-7%", desc: "West Bridgford and The Meadows — very different characters in the same postcode district.", profile: "West Bridgford: premium family market. Meadows: high yield and BRRR opportunities.", gr: true },
  { code: "NG3", city: "Nottingham", citySlug: "nottingham", region: "East Midlands", label: "NG3 — Mapperley & St Ann's", centre: "NG3 1AD", avgPrice: "£120k-£200k", yield: "6-8%", desc: "Mapperley, Sherwood, and St Ann's in north-east Nottingham.", profile: "Mix of yield-focused inner suburbs and improving Mapperley area. Good transport to city centre.", gr: true },
  { code: "NG7", city: "Nottingham", citySlug: "nottingham", region: "East Midlands", label: "NG7 — Forest Fields & Radford", centre: "NG7 1AE", avgPrice: "£110k-£175k", yield: "7-9%", desc: "Forest Fields, Radford, and Hyson Green — inner suburbs between the two universities.", profile: "Highest yields in Nottingham. Very affordable. Strong student and professional demand. Active HMO market.", gr: true },
  { code: "NG8", city: "Nottingham", citySlug: "nottingham", region: "East Midlands", label: "NG8 — Wollaton & Bilborough", centre: "NG8 1AG", avgPrice: "£150k-£250k", yield: "5-6%", desc: "Wollaton and Bilborough in west Nottingham — near Wollaton Hall and park.", profile: "Professional and family tenants. Good quality housing. Consistent demand.", gr: true },
  // Derby
  { code: "DE1", city: "Derby", citySlug: "derby", region: "East Midlands", label: "DE1 — Derby City Centre", centre: "DE1 1AH", avgPrice: "£110k-£190k", yield: "5-7%", desc: "Derby city centre and inner suburbs. Close to Rolls-Royce HQ and Derby Train Station.", profile: "Professional rental demand from Rolls-Royce and Toyota employees. Good for apartments and terraces.", gr: true },
  { code: "DE22", city: "Derby", citySlug: "derby", region: "East Midlands", label: "DE22 — Allestree & Mickleover", centre: "DE22 1GD", avgPrice: "£170k-£260k", yield: "4-6%", desc: "North Derby suburbs including Allestree and Mickleover — popular with professionals and families.", profile: "Good schools, professional demand, longer tenancies. Capital growth focus.", gr: true },
  { code: "DE23", city: "Derby", citySlug: "derby", region: "East Midlands", label: "DE23 — Normanton & Pear Tree", centre: "DE23 1GQ", avgPrice: "£110k-£165k", yield: "6-7%", desc: "South Derby including Normanton and Pear Tree — diverse inner suburbs.", profile: "Affordable. Consistent rental demand. Good for yield-focused investment.", gr: true },
  { code: "DE24", city: "Derby", citySlug: "derby", region: "East Midlands", label: "DE24 — Alvaston & Spondon", centre: "DE24 0AH", avgPrice: "£130k-£200k", yield: "5-6%", desc: "South-east Derby including Alvaston and Spondon — suburban with easy access to Toyota Burnaston.", profile: "Family and worker demand. Stable market. Good for long-term investors.", gr: true },
  // Leicester
  { code: "LE1", city: "Leicester", citySlug: "leicester", region: "East Midlands", label: "LE1 — Leicester City Centre", centre: "LE1 1AA", avgPrice: "£120k-£200k", yield: "6-8%", desc: "Leicester city centre including the cultural quarter, university area, and New Walk.", profile: "Strong demand from university students and young professionals. Mix of flats and terraces.", gr: true },
  { code: "LE2", city: "Leicester", citySlug: "leicester", region: "East Midlands", label: "LE2 — Knighton & Stoneygate", centre: "LE2 1AH", avgPrice: "£180k-£320k", yield: "4-5%", desc: "Stoneygate and Knighton — Leicester's most desirable residential suburbs.", profile: "Premium professional tenants. Long tenancies. Strong capital growth potential.", gr: true },
  { code: "LE3", city: "Leicester", citySlug: "leicester", region: "East Midlands", label: "LE3 — Braunstone & Fosse", centre: "LE3 1AH", avgPrice: "£130k-£200k", yield: "5-7%", desc: "West Leicester including Braunstone Town and the Fosse Road corridor.", profile: "Consistent working and family rental demand. Affordable terraced housing stock.", gr: true },
  { code: "LE4", city: "Leicester", citySlug: "leicester", region: "East Midlands", label: "LE4 — Belgrave & Beaumont Leys", centre: "LE4 1AD", avgPrice: "£130k-£200k", yield: "6-7%", desc: "North Leicester including Belgrave, Thurmaston, and Beaumont Leys.", profile: "Diverse community with strong rental demand. Affordable stock. Good transport.", gr: true },
  { code: "LE5", city: "Leicester", citySlug: "leicester", region: "East Midlands", label: "LE5 — Evington & Humberstone", centre: "LE5 1AD", avgPrice: "£140k-£210k", yield: "5-7%", desc: "East Leicester including Evington and Humberstone — near the UHL NHS Trust.", profile: "NHS worker demand from nearby hospital. Professional tenants. Consistent market.", gr: true },
  // Sheffield
  { code: "S1",  city: "Sheffield", citySlug: "sheffield", region: "South Yorkshire", label: "S1 — Sheffield City Centre", centre: "S1 1AA", avgPrice: "£100k-£180k", yield: "7-9%", desc: "Sheffield city centre — close to both universities, the tram network, and major regeneration.", profile: "Strong student and professional demand. Good for apartments. High yields from low entry prices.", gr: true },
  { code: "S2",  city: "Sheffield", citySlug: "sheffield", region: "South Yorkshire", label: "S2 — Manor & Gleadless", centre: "S2 1AJ", avgPrice: "£90k-£150k", yield: "7-9%", desc: "South Sheffield inner suburbs including Manor and Gleadless — very affordable.", profile: "High yield from low entry prices. Working community rental demand. Cash-flow focused market.", gr: true },
  { code: "S3",  city: "Sheffield", citySlug: "sheffield", region: "South Yorkshire", label: "S3 — Burngreave & Neepsend", centre: "S3 7AJ", avgPrice: "£90k-£155k", yield: "7-9%", desc: "Inner north Sheffield including Burngreave — adjacent to Attercliffe regeneration zone.", profile: "Attercliffe regeneration upside nearby. Affordable entry. High yield potential.", gr: true },
  { code: "S5",  city: "Sheffield", citySlug: "sheffield", region: "South Yorkshire", label: "S5 — Southey & Parson Cross", centre: "S5 6AH", avgPrice: "£85k-£145k", yield: "7-9%", desc: "North Sheffield including Southey — among Sheffield's most affordable residential areas.", profile: "Very high yields. Low entry prices. Working community demand. For cash-flow investors.", gr: true },
  { code: "S6",  city: "Sheffield", citySlug: "sheffield", region: "South Yorkshire", label: "S6 — Hillsborough & Walkley", centre: "S6 1AH", avgPrice: "£100k-£175k", yield: "6-8%", desc: "West Sheffield including Walkley, Hillsborough, and Crookes — popular with students and professionals.", profile: "Popular student and young professional area. Close to Sheffield Hallam. Consistent demand.", gr: true },
  { code: "S7",  city: "Sheffield", citySlug: "sheffield", region: "South Yorkshire", label: "S7 — Nether Edge & Millhouses", centre: "S7 1AH", avgPrice: "£200k-£340k", yield: "4-5%", desc: "Nether Edge and Millhouses in south Sheffield — Victorian suburbs popular with professionals.", profile: "Premium professional tenants. Longer tenancies. Capital growth. Near Sheffield's best schools.", gr: true },
  { code: "S10", city: "Sheffield", citySlug: "sheffield", region: "South Yorkshire", label: "S10 — Broomhill & Fulwood", centre: "S10 1AH", avgPrice: "£150k-£280k", yield: "6-8%", desc: "Broomhill — Sheffield's main student area adjacent to University of Sheffield campus.", profile: "Excellent HMO market. Year-round University of Sheffield student demand. Strong consistent yields.", gr: true },
  { code: "S11", city: "Sheffield", citySlug: "sheffield", region: "South Yorkshire", label: "S11 — Sharrow & Greystones", centre: "S11 7AJ", avgPrice: "£160k-£280k", yield: "5-7%", desc: "Sharrow and Greystones — popular residential areas between the city centre and Nether Edge.", profile: "Mix of student and young professional demand. Good Victorian terraced housing stock.", gr: true },
];

type Props = { params: Promise<{ district: string }> };

export async function generateStaticParams() {
  return DISTRICTS.map((d) => ({ district: d.code.toLowerCase() }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { district } = await params;
  const d = DISTRICTS.find((x) => x.code.toLowerCase() === district.toLowerCase());
  if (!d) return { title: "Postcode not found" };
  return {
    title: `${d.code} Postcode — Sold Prices & Buy-to-Let Guide | PropertyVault UK`,
    description: `${d.code} sold prices, rental yields, and buy-to-let investment guide for ${d.city}. ${d.desc} Average price ${d.avgPrice}, typical yield ${d.yield}.`,
    keywords: `${d.code} sold prices, ${d.code} buy to let, ${d.code} property investment, ${d.city} ${d.code} yields, ${d.code} rental yield`,
  };
}

const districtFaqs = (d: District) => [
  {
    q: `What are typical rental yields in ${d.code} ${d.city}?`,
    a: `Gross rental yields in the ${d.code} postcode district of ${d.city} typically range from ${d.yield}. ${d.profile}`,
  },
  {
    q: `What are average house prices in ${d.code}?`,
    a: `Average house prices in the ${d.code} postcode district range from approximately ${d.avgPrice}. Prices vary by property type and condition — always check recent Land Registry data for the most current figures.`,
  },
  {
    q: `Is ${d.code} a good area to invest in ${d.city}?`,
    a: `${d.label.split("—")[1]?.trim() ?? d.city} offers ${d.yield} gross yields. ${d.profile} Use PropertyVault's free rental yield calculator to model any specific deal.`,
  },
  {
    q: `Where can I find sold prices for ${d.code} properties?`,
    a: `You can search sold prices for any ${d.code} postcode using the Land Registry data tool above. Enter any full postcode to see recent transactions, average prices, and local crime data.`,
  },
];

export default async function PostcodePage({ params }: Props) {
  const { district } = await params;
  const d = DISTRICTS.find((x) => x.code.toLowerCase() === district.toLowerCase());
  if (!d) notFound();

  const faqs = districtFaqs(d);

  return (
    <>
      {/* Hero */}
      <section className="bg-white py-16 md:py-24">
        <div className="container-max px-4 max-w-3xl">
          <Breadcrumbs
            items={[
              { label: "Areas", href: "/areas" },
              { label: d.city, href: `/areas/${d.citySlug}` },
              { label: d.code },
            ]}
          />
          <p className="text-xs font-semibold text-gold-500 uppercase tracking-widest mb-3 mt-6">
            {d.region}
          </p>
          <h1
            className="text-4xl md:text-5xl font-extrabold text-navy-900 mb-4"
            style={{ fontFamily: "var(--font-family-heading)" }}
          >
            {d.code} — {d.city}
          </h1>
          <p className="text-lg text-navy-600 leading-relaxed mb-2">{d.desc}</p>
          <p className="text-navy-500">{d.profile}</p>
        </div>
      </section>

      <hr className="border-navy-100" />

      {/* Key stats */}
      <section className="bg-navy-50 py-10">
        <div className="container-max px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-2xl mx-auto text-center">
            <div>
              <p className="text-2xl font-extrabold text-navy-900" style={{ fontFamily: "var(--font-family-heading)" }}>{d.avgPrice}</p>
              <p className="text-sm text-navy-500 mt-1">Average price</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-navy-900" style={{ fontFamily: "var(--font-family-heading)" }}>{d.yield}</p>
              <p className="text-sm text-navy-500 mt-1">Typical yield</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-navy-900" style={{ fontFamily: "var(--font-family-heading)" }}>{d.city}</p>
              <p className="text-sm text-navy-500 mt-1">City</p>
            </div>
          </div>
          <p className="text-xs text-navy-400 text-center mt-4">
            Figures are approximate. Always verify with current Land Registry data.
          </p>
        </div>
      </section>

      {/* Sold prices widget */}
      <section className="bg-white section-padding">
        <div className="container-max px-4 max-w-3xl">
          <h2
            className="text-2xl font-extrabold text-navy-900 mb-2"
            style={{ fontFamily: "var(--font-family-heading)" }}
          >
            {d.code} sold prices — search any postcode
          </h2>
          <p className="text-navy-500 mb-8">
            Live Land Registry data — see what properties have actually sold for in {d.code} and surrounding streets.
          </p>
          <AreaSoldPricesWidget defaultPostcode={d.centre} />
        </div>
      </section>

      {/* Tools */}
      <section className="bg-navy-50 section-padding">
        <div className="container-max px-4 max-w-3xl">
          <h2
            className="text-xl font-extrabold text-navy-900 mb-6"
            style={{ fontFamily: "var(--font-family-heading)" }}
          >
            Free tools for {d.code} investors
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <Link href="/calculators/rental-yield" className="bg-white rounded-xl p-5 border border-navy-100 hover:border-gold-400 transition-colors group">
              <p className="font-bold text-navy-900 group-hover:text-gold-600 transition-colors text-sm">Rental Yield</p>
              <p className="text-xs text-navy-500 mt-1">Model any {d.code} deal</p>
            </Link>
            <Link href="/calculators/stamp-duty" className="bg-white rounded-xl p-5 border border-navy-100 hover:border-gold-400 transition-colors group">
              <p className="font-bold text-navy-900 group-hover:text-gold-600 transition-colors text-sm">Stamp Duty</p>
              <p className="text-xs text-navy-500 mt-1">Including 5% surcharge</p>
            </Link>
            <Link href="/calculators/brrr" className="bg-white rounded-xl p-5 border border-navy-100 hover:border-gold-400 transition-colors group">
              <p className="font-bold text-navy-900 group-hover:text-gold-600 transition-colors text-sm">BRRR Calculator</p>
              <p className="text-xs text-navy-500 mt-1">Refurb &amp; refinance</p>
            </Link>
          </div>
        </div>
      </section>

      {/* GR CTA — only for covered cities */}
      {d.gr && (
        <section className="bg-white section-padding">
          <div className="container-max px-4 max-w-3xl">
            <div className="bg-navy-800 rounded-2xl p-8 text-center">
              <p className="text-xs font-semibold text-gold-400 uppercase tracking-widest mb-2">
                {d.city} landlords
              </p>
              <h2
                className="text-2xl font-extrabold text-white mb-3"
                style={{ fontFamily: "var(--font-family-heading)" }}
              >
                Guaranteed rent for {d.code} landlords
              </h2>
              <p className="text-white/60 text-sm mb-6">
                We lease your {d.code} property and pay you every month for 3–5 years. No voids, no management, no arrears.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link href="/guaranteed-rent" className="btn-gold">
                  Book free valuation
                </Link>
                <a
                  href={`https://wa.me/447415721628?text=Hi%2C%20I%20have%20a%20property%20in%20${encodeURIComponent(d.code)}%20${encodeURIComponent(d.city)}%20and%20I%27m%20interested%20in%20guaranteed%20rent.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline !border-white/20 !text-white hover:!bg-white/5"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FAQs */}
      <section className="bg-navy-50 section-padding">
        <div className="container-max px-4 max-w-3xl">
          <h2
            className="text-2xl font-extrabold text-navy-900 mb-8"
            style={{ fontFamily: "var(--font-family-heading)" }}
          >
            {d.code} property investment — FAQs
          </h2>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.q}>
                <h3 className="font-bold text-navy-900 mb-2">{faq.q}</h3>
                <p className="text-navy-600 leading-relaxed text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
          <FAQSchema faqs={faqs} />

          {/* Browse more postcodes */}
          <div className="mt-10 pt-8 border-t border-navy-100">
            <p className="text-sm font-bold text-navy-800 mb-4">Browse more {d.city} postcodes</p>
            <div className="flex flex-wrap gap-2">
              {DISTRICTS.filter(x => x.city === d.city && x.code !== d.code).map(x => (
                <Link
                  key={x.code}
                  href={`/areas/postcodes/${x.code.toLowerCase()}`}
                  className="text-xs font-semibold text-navy-700 bg-white border border-navy-200 px-3 py-1.5 rounded-full hover:border-gold-400 transition-colors"
                >
                  {x.code}
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <Disclaimer />
          </div>
        </div>
      </section>
    </>
  );
}
