"use client";

import { useState } from "react";
import Link from "next/link";

const WA = "https://wa.me/447415721628";

const SDLT_BANDS = [
  { from: 0, to: 125000, rate: 0 },
  { from: 125000, to: 250000, rate: 0.02 },
  { from: 250000, to: 925000, rate: 0.05 },
  { from: 925000, to: 1500000, rate: 0.1 },
  { from: 1500000, to: Infinity, rate: 0.12 },
];

type Breakdown = { label: string; en: string; ar: string; amount: number };

function calcSDLT(
  price: number,
  buyerType: "first" | "main" | "additional"
): { total: number; breakdown: Breakdown[] } {
  const breakdown: Breakdown[] = [];
  let baseTax = 0;

  if (buyerType === "first" && price <= 625000) {
    if (price > 425000) baseTax = (price - 425000) * 0.05;
    breakdown.push({
      label: "ftb",
      en: "Standard SDLT (first-time buyer relief)",
      ar: "ضريبة SDLT (إعفاء المشتري لأول مرة)",
      amount: Math.round(baseTax),
    });
  } else {
    for (const b of SDLT_BANDS) {
      if (price > b.from) {
        baseTax += (Math.min(price, b.to === Infinity ? price : b.to) - b.from) * b.rate;
      }
    }
    breakdown.push({
      label: "standard",
      en: "Standard SDLT",
      ar: "ضريبة SDLT الأساسية",
      amount: Math.round(baseTax),
    });
  }

  const nonRes = Math.round(price * 0.02);
  breakdown.push({
    label: "nonres",
    en: "Non-resident surcharge (+2%)",
    ar: "رسوم غير المقيمين (+٢٪)",
    amount: nonRes,
  });

  let additional = 0;
  if (buyerType === "additional") {
    additional = Math.round(price * 0.05);
    breakdown.push({
      label: "additional",
      en: "Additional property surcharge (+5%)",
      ar: "رسوم العقار الإضافي (+٥٪)",
      amount: additional,
    });
  }

  return { total: Math.round(baseTax) + nonRes + additional, breakdown };
}

function fmt(n: number) {
  return "£" + n.toLocaleString("en-GB");
}

const STEPS_EN = [
  {
    n: "01",
    title: "Get a mortgage in principle",
    body: "UK lenders offer BTL and residential mortgages to GCC nationals — but not all. Specialist brokers who deal with international buyers are your fastest route. Expect a 25–30% deposit and proof of income.",
  },
  {
    n: "02",
    title: "Appoint a UK solicitor",
    body: "You legally need a UK-based conveyancing solicitor. Many work remotely — you don't need to travel. They handle land registry, anti-money laundering checks, and the exchange/completion process.",
  },
  {
    n: "03",
    title: "Property search & offer",
    body: "Search through an agent or platform. Instruct your solicitor once your offer is accepted. Surveys are optional but strongly recommended — especially on older properties.",
  },
  {
    n: "04",
    title: "Exchange and complete",
    body: "Exchange contracts (typically 8–12 weeks after offer). Pay the deposit (usually 10%). Complete — typically 2–4 weeks after exchange. SDLT is due within 14 days of completion.",
  },
  {
    n: "05",
    title: "Manage the property",
    body: "You can self-manage or use a letting agent. If you're based overseas, guaranteed rent gives you a fixed monthly income with zero management. No tenants to deal with, no voids, no calls at 2am.",
  },
];

const STEPS_AR = [
  {
    n: "٠١",
    title: "احصل على موافقة مبدئية للرهن العقاري",
    body: "تقدم البنوك البريطانية قروضاً عقارية لمواطني دول الخليج، لكن ليس جميعها. وسطاء الرهن المتخصصون في المشترين الدوليين هم أسرع طريق. توقع دفعة أولى من ٢٥ إلى ٣٠٪ مع إثبات الدخل.",
  },
  {
    n: "٠٢",
    title: "عيّن محامياً بريطانياً",
    body: "تحتاج قانونياً إلى محامٍ بريطاني للتعامل مع نقل الملكية. يعمل كثيرون عن بُعد دون الحاجة للسفر. يتولون تسجيل الأراضي وفحوصات مكافحة غسل الأموال وعمليات التعاقد والإتمام.",
  },
  {
    n: "٠٣",
    title: "البحث عن عقار وتقديم عرض",
    body: "ابحث عبر وكيل أو منصة عقارية. كلّف محاميك فور قبول عرضك. تقارير الفحص الهندسي اختيارية لكن يُنصح بها بشدة، لا سيما للعقارات القديمة.",
  },
  {
    n: "٠٤",
    title: "تبادل العقود والإتمام",
    body: "يتم تبادل العقود عادةً خلال ٨ إلى ١٢ أسبوعاً من قبول العرض. ادفع العربون (عادةً ١٠٪). ثم يأتي الإتمام بعد ٢ إلى ٤ أسابيع. تُسدَّد ضريبة SDLT خلال ١٤ يوماً من تاريخ الإتمام.",
  },
  {
    n: "٠٥",
    title: "إدارة العقار",
    body: "يمكنك الإدارة الذاتية أو الاستعانة بوكالة تأجير. إن كنت مقيماً خارج بريطانيا، فإن نظام الإيجار المضمون يمنحك دخلاً شهرياً ثابتاً بدون أي إدارة. لا مستأجرين، لا فترات شغور، لا مكالمات في منتصف الليل.",
  },
];

export default function GCCBuyersPage() {
  const [lang, setLang] = useState<"en" | "ar">("en");
  const [price, setPrice] = useState(350000);
  const [buyerType, setBuyerType] = useState<"first" | "main" | "additional">("main");
  const ar = lang === "ar";

  const { total, breakdown } = calcSDLT(price, buyerType);
  const effectiveRate = ((total / price) * 100).toFixed(2);

  return (
    <main className="min-h-screen bg-[var(--h-ink-deep)] text-white">

      {/* HERO */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(232,139,98,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(232,139,98,0.05) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="absolute top-0 right-1/4 w-[700px] h-[700px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle,rgba(232,139,98,0.10) 0%,transparent 65%)" }} />

        <div className="relative max-w-4xl mx-auto">
          {/* Lang toggle */}
          <div className={`flex gap-2 mb-8 ${ar ? "justify-end" : ""}`}>
            <button onClick={() => setLang("en")} className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${!ar ? "bg-[var(--h-accent)] text-white" : "bg-white/10 text-white/75 hover:bg-white/15"}`}>English</button>
            <button onClick={() => setLang("ar")} className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${ar ? "bg-[var(--h-accent)] text-white" : "bg-white/10 text-white/75 hover:bg-white/15"}`}>العربية</button>
          </div>

          {/* Breadcrumb */}
          <div className={`flex items-center gap-2 text-xs text-white/55 mb-6 ${ar ? "flex-row-reverse" : ""}`}>
            <Link href="/makan" className="hover:text-white/70 transition-colors">Makan</Link>
            <span>/</span>
            <span className="text-white/75">{ar ? "مشترو الخليج" : "GCC Buyers"}</span>
          </div>

          {ar ? (
            <div dir="rtl" className="text-right">
              <div className="inline-flex items-center gap-2 bg-[var(--h-accent)]/15 border border-[var(--h-accent)]/30 rounded-full px-4 py-2 mb-6">
                <span className="w-2 h-2 rounded-full bg-[var(--h-accent)]" />
                <span className="text-[var(--h-accent-on-ink)] text-sm font-semibold tracking-wide">🇸🇦 🇦🇪 🇰🇼 🇶🇦 🇧🇭 🇴🇲 — دليل المشتري الخليجي</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black leading-tight mb-5" style={{ fontFamily: "serif" }}>
                شراء عقارات بريطانية<br />
                <span className="text-[var(--h-accent-on-ink)]">من دول الخليج</span>
              </h1>
              <p className="text-white/65 text-lg leading-relaxed mb-8 max-w-2xl">
                دليل شامل لمواطني دول مجلس التعاون الخليجي للاستثمار العقاري في المملكة المتحدة. نظرة صادقة على التكاليف والخطوات والفرص المتاحة، مع حاسبة ضريبة الدمغة (SDLT) للمقيمين خارج بريطانيا.
              </p>
              <div className="flex flex-wrap gap-4 justify-end">
                <a href={WA} target="_blank" rel="noopener noreferrer" className="bg-[var(--h-accent)] hover:bg-[#b8973b] text-white font-bold px-7 py-3.5 rounded-xl transition-colors">
                  تحدث مع خبير ←
                </a>
                <a href="#calculator" className="bg-white/10 hover:bg-white/15 text-white font-semibold px-7 py-3.5 rounded-xl transition-colors border border-white/20">
                  احسب الضريبة
                </a>
              </div>
            </div>
          ) : (
            <>
              <div className="inline-flex items-center gap-2 bg-[var(--h-accent)]/15 border border-[var(--h-accent)]/30 rounded-full px-4 py-2 mb-6">
                <span className="w-2 h-2 rounded-full bg-[var(--h-accent)]" />
                <span className="text-[var(--h-accent-on-ink)] text-sm font-semibold tracking-wide">🇸🇦 🇦🇪 🇰🇼 🇶🇦 🇧🇭 🇴🇲 — GCC BUYER GUIDE</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black leading-tight mb-5">
                Buying UK Property<br />
                <span className="text-[var(--h-accent-on-ink)]">from the Gulf</span>
              </h1>
              <p className="text-white/65 text-lg leading-relaxed mb-8 max-w-2xl">
                A complete guide for GCC nationals investing in UK property. An honest look at the real costs, the process, and the opportunities — including a free SDLT calculator built for non-UK residents.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href={WA} target="_blank" rel="noopener noreferrer" className="bg-[var(--h-accent)] hover:bg-[#b8973b] text-white font-bold px-7 py-3.5 rounded-xl transition-colors">
                  Speak to an Expert →
                </a>
                <a href="#calculator" className="bg-white/10 hover:bg-white/15 text-white font-semibold px-7 py-3.5 rounded-xl transition-colors border border-white/20">
                  Calculate SDLT
                </a>
              </div>
            </>
          )}

          {/* Stats strip */}
          <div className={`flex flex-wrap gap-8 mt-14 pt-10 border-t border-white/10 ${ar ? "flex-row-reverse" : ""}`}>
            {[
              { v: "£280bn", en: "GCC real estate investment in UK (2023)", ar: "استثمارات الخليج العقارية في بريطانيا" },
              { v: "2%", en: "Non-resident SDLT surcharge", ar: "رسوم SDLT لغير المقيمين" },
              { v: "No", en: "ownership restrictions for GCC nationals", ar: "لا قيود على تملك الخليجيين" },
              { v: "100%", en: "Freehold ownership possible", ar: "إمكانية التملك الحر الكامل" },
            ].map((s) => (
              <div key={s.v} className={ar ? "text-right" : ""}>
                <p className="text-2xl font-black text-[var(--h-accent-on-ink)]">{s.v}</p>
                <p className="text-white/55 text-xs max-w-[140px] leading-relaxed mt-1">{ar ? s.ar : s.en}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY UK PROPERTY */}
      <section className="bg-[var(--h-ink)] py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className={`text-center mb-12 ${ar ? "text-right" : ""}`} dir={ar ? "rtl" : "ltr"}>
            <p className="text-[var(--h-accent-on-ink)] text-xs font-bold uppercase tracking-widest mb-3">{ar ? "لماذا المملكة المتحدة؟" : "Why UK Property?"}</p>
            <h2 className="text-3xl font-black">{ar ? "ما يجذب المستثمرين الخليجيين إلى السوق البريطاني" : "What Draws Gulf Investors to the UK Market"}</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: "🏛️", en: ["Legal certainty", "English property law is one of the world's most stable. Your ownership is protected, recorded at HM Land Registry, and enforceable. There are no restrictions on GCC nationals buying UK property."], ar: ["اليقين القانوني", "القانون العقاري البريطاني من أكثر الأنظمة استقراراً في العالم. ملكيتك محمية ومسجلة في السجل العقاري الملكي وقابلة للتنفيذ. ولا توجد قيود على مواطني دول الخليج لشراء عقارات بريطانية."] },
              { icon: "💷", en: ["Strong pound, stable yields", "BTL yields in the Midlands and North typically run 5–8%. The pound is accepted globally and the UK rental market is chronically undersupplied — demand from tenants is structural, not cyclical."], ar: ["الجنيه الإسترليني القوي وعوائد ثابتة", "عوائد التأجير في منطقتَي ميدلاندز والشمال تتراوح عادةً بين ٥ و٨٪. الجنيه الإسترليني مقبول عالمياً، وسوق الإيجار البريطاني يعاني نقصاً هيكلياً مزمناً في المعروض — الطلب بنيوي لا دوري."] },
              { icon: "🏙️", en: ["World-class cities", "London is the global financial centre. Birmingham, Manchester, and Leeds are underpriced compared to European equivalents with strong university and employment demand driving rents."], ar: ["مدن عالمية المستوى", "لندن هي المركز المالي العالمي. أما برمنغهام ومانشستر وليدز فهي رخيصة نسبياً مقارنةً بنظيراتها الأوروبية، مع طلب قوي على الإيجار من الجامعات وسوق العمل."] },
              { icon: "🔒", en: ["Safe haven asset", "UK property has a 40-year track record of capital growth. Even through 2008, Brexit, and COVID — values recovered. For GCC investors with long time horizons, UK property is considered a tier-1 store of wealth."], ar: ["أصل ملاذ آمن", "حقق العقار البريطاني سجلاً من النمو الرأسمالي على مدى ٤٠ عاماً. وحتى خلال أزمة ٢٠٠٨ وبريكست وجائحة كوفيد — انتعشت القيم. للمستثمرين الخليجيين أصحاب الأفق الزمني الطويل، يُعدّ العقار البريطاني مخزناً للثروة من الدرجة الأولى."] },
              { icon: "✈️", en: ["No need to relocate", "You can buy, manage, and profit from UK property without living here. With a letting agent or a guaranteed rent scheme, the property earns while you live in the Gulf."], ar: ["لا حاجة للانتقال", "يمكنك شراء وإدارة والاستفادة من العقارات البريطانية دون الإقامة هنا. بوكالة تأجير أو نظام الإيجار المضمون، يدرّ عقارك دخلاً بينما تعيش في الخليج."] },
              { icon: "🕌", en: ["Halal finance available", "Sharia-compliant mortgages (home purchase plans) are available from several UK banks. Al Rayan Bank, Gatehouse Bank, and others offer HPPs with no interest — structured as co-ownership agreements."], ar: ["تمويل إسلامي متاح", "تتوفر الرهون العقارية المتوافقة مع الشريعة الإسلامية (خطط شراء المنازل) لدى عدة بنوك بريطانية. بنك الريان وبنك غيتهاوس وغيرهما يقدمون خطط HPP بدون فوائد، مهيكلةً كاتفاقيات مشاركة في الملكية."] },
            ].map((item) => (
              <div key={item.en[0]} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[var(--h-accent)]/30 transition-colors" dir={ar ? "rtl" : "ltr"}>
                <span className="text-3xl block mb-4">{item.icon}</span>
                <h3 className="font-bold text-white mb-2">{ar ? item.ar[0] : item.en[0]}</h3>
                <p className="text-white/55 text-sm leading-relaxed">{ar ? item.ar[1] : item.en[1]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SDLT CALCULATOR */}
      <section id="calculator" className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className={ar ? "text-right" : ""} dir={ar ? "rtl" : "ltr"}>
            <p className="text-[var(--h-accent-on-ink)] text-xs font-bold uppercase tracking-widest mb-3">{ar ? "حاسبة ضريبة الدمغة" : "SDLT Calculator"}</p>
            <h2 className="text-3xl font-black mb-2">{ar ? "ضريبة الدمغة للمقيمين خارج بريطانيا" : "Stamp Duty for Non-UK Residents"}</h2>
            <p className="text-white/55 text-sm mb-8 leading-relaxed">
              {ar
                ? "يدفع غير المقيمين في بريطانيا رسوم SDLT إضافية بنسبة ٢٪ فوق الأسعار المعتادة. احسب فاتورتك الضريبية الكاملة هنا."
                : "Non-UK residents pay an additional 2% SDLT surcharge on top of standard rates. Calculate your full tax bill here."}
            </p>
          </div>

          <div className="bg-[var(--h-ink)] border border-white/10 rounded-2xl p-8" dir={ar ? "rtl" : "ltr"}>
            {/* Price slider */}
            <div className="mb-6">
              <div className={`flex items-center justify-between mb-3 ${ar ? "flex-row-reverse" : ""}`}>
                <label className="text-sm font-semibold text-white/80">{ar ? "سعر العقار" : "Property Price"}</label>
                <span className="text-xl font-black text-[var(--h-accent-on-ink)]">{fmt(price)}</span>
              </div>
              <input type="range" min={50000} max={2000000} step={5000} value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full accent-[var(--h-accent-on-ink)]" />
              <div className={`flex justify-between text-xs text-white/55 mt-1 ${ar ? "flex-row-reverse" : ""}`}>
                <span>£50k</span><span>£2m</span>
              </div>
            </div>

            {/* Manual input */}
            <div className="mb-6">
              <label className="text-xs text-white/55 block mb-2">{ar ? "أو أدخل السعر يدوياً:" : "Or type a price:"}</label>
              <input type="number" value={price} onChange={(e) => setPrice(Math.max(0, Number(e.target.value)))}
                className="bg-white/5 border border-white/20 rounded-xl px-4 py-2.5 text-white text-sm w-full focus:outline-none focus:border-[var(--h-accent-on-ink)]/50"
                dir="ltr" />
            </div>

            {/* Buyer type */}
            <div className="mb-8">
              <p className="text-sm font-semibold text-white/80 mb-3">{ar ? "نوع المشتري" : "Buyer Type"}</p>
              <div className="grid grid-cols-3 gap-2">
                {([
                  { v: "first", en: "First-time buyer", ar: "مشترٍ لأول مرة" },
                  { v: "main", en: "Main residence", ar: "سكن رئيسي" },
                  { v: "additional", en: "Additional property", ar: "عقار إضافي" },
                ] as const).map((o) => (
                  <button key={o.v} onClick={() => setBuyerType(o.v)}
                    className={`px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-center ${buyerType === o.v ? "bg-[var(--h-accent)] text-white" : "bg-white/5 text-white/75 hover:bg-white/10 border border-white/10"}`}>
                    {ar ? o.ar : o.en}
                  </button>
                ))}
              </div>
            </div>

            {/* Result */}
            <div className="bg-white/5 border border-[var(--h-accent-on-ink)]/20 rounded-xl p-6">
              <div className={`flex items-start justify-between mb-5 ${ar ? "flex-row-reverse" : ""}`}>
                <div className={ar ? "text-right" : ""}>
                  <p className="text-white/55 text-xs mb-1">{ar ? "إجمالي ضريبة الدمغة" : "Total SDLT Due"}</p>
                  <p className="text-4xl font-black text-white">{fmt(total)}</p>
                  <p className="text-[var(--h-accent-on-ink)] text-sm mt-1">{effectiveRate}% {ar ? "معدل فعلي" : "effective rate"}</p>
                </div>
                <div className={`text-xs text-white/55 max-w-[160px] leading-relaxed ${ar ? "text-right" : "text-right"}`}>
                  {ar ? "تُسدَّد خلال ١٤ يوماً من إتمام الصفقة" : "Due within 14 days of completion"}
                </div>
              </div>
              <div className="space-y-2">
                {breakdown.map((b) => (
                  <div key={b.label} className={`flex items-center justify-between text-sm ${ar ? "flex-row-reverse" : ""}`}>
                    <span className="text-white/55">{ar ? b.ar : b.en}</span>
                    <span className={`font-semibold ${b.label === "nonres" || b.label === "additional" ? "text-amber-400" : "text-white"}`}>{fmt(b.amount)}</span>
                  </div>
                ))}
                <div className={`flex items-center justify-between text-sm pt-2 border-t border-white/10 ${ar ? "flex-row-reverse" : ""}`}>
                  <span className="font-bold text-white">{ar ? "الإجمالي" : "Total"}</span>
                  <span className="font-black text-white">{fmt(total)}</span>
                </div>
              </div>
            </div>

            <p className="text-white/55 text-xs mt-4 leading-relaxed" dir={ar ? "rtl" : "ltr"}>
              {ar
                ? "هذه الحاسبة للأغراض التوضيحية فقط. تسري رسوم المقيمين خارج بريطانيا منذ أبريل ٢٠٢١. يُرجى استشارة محامٍ مرخص للحصول على حساب دقيق."
                : "This calculator is for illustrative purposes. Non-resident surcharge applies from April 2021. Consult a licensed solicitor for a precise calculation."}
            </p>
          </div>
        </div>
      </section>

      {/* HOW TO BUY */}
      <section className="bg-[var(--h-ink)] py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className={`text-center mb-12 ${ar ? "text-right" : ""}`} dir={ar ? "rtl" : "ltr"}>
            <p className="text-[var(--h-accent-on-ink)] text-xs font-bold uppercase tracking-widest mb-3">{ar ? "خطوة بخطوة" : "Step by Step"}</p>
            <h2 className="text-3xl font-black">{ar ? "كيفية شراء عقار في بريطانيا من الخليج" : "How to Buy UK Property from the Gulf"}</h2>
          </div>
          <div className="space-y-5">
            {(ar ? STEPS_AR : STEPS_EN).map((s) => (
              <div key={s.n} className={`flex gap-6 bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[var(--h-accent-on-ink)]/20 transition-colors ${ar ? "flex-row-reverse" : ""}`} dir={ar ? "rtl" : "ltr"}>
                <div className="text-3xl font-black text-[var(--h-accent-on-ink)]/60 shrink-0 w-12 text-center">{s.n}</div>
                <div>
                  <h3 className="font-bold text-white mb-2">{s.title}</h3>
                  <p className="text-white/55 text-sm leading-relaxed">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COSTS SUMMARY */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className={`text-center mb-12 ${ar ? "text-right" : ""}`} dir={ar ? "rtl" : "ltr"}>
            <p className="text-[var(--h-accent-on-ink)] text-xs font-bold uppercase tracking-widest mb-3">{ar ? "التكاليف الكاملة" : "Full Cost Picture"}</p>
            <h2 className="text-3xl font-black">{ar ? "ما تحتاج لأن تعرفه قبل الشراء" : "What You Need to Budget Beyond the Price"}</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-5" dir={ar ? "rtl" : "ltr"}>
            {[
              { icon: "📋", en: ["SDLT (Stamp Duty)", "Calculated above. For a £350k non-resident purchase: approx. £17,000. Additional property: approx. £34,500."], ar: ["ضريبة الدمغة (SDLT)", "محسوبة أعلاه. لعقار بـ٣٥٠,٠٠٠ جنيه كغير مقيم: حوالي ١٧,٠٠٠ جنيه. عقار إضافي: حوالي ٣٤,٥٠٠ جنيه."] },
              { icon: "⚖️", en: ["Solicitor fees", "Typically £1,500–£3,000 for conveyancing. Non-resident buyers may pay slightly more due to additional AML checks."], ar: ["رسوم المحامي", "عادةً ١,٥٠٠ إلى ٣,٠٠٠ جنيه للتوثيق القانوني. قد يدفع غير المقيمين أكثر قليلاً بسبب فحوصات AML الإضافية."] },
              { icon: "🔍", en: ["Survey", "Basic valuation: free (from lender). RICS Homebuyer Survey: £400–£700. Full structural survey: £600–£1,500."], ar: ["تقرير الفحص الهندسي", "تقييم أساسي: مجاني (من المُقرض). استطلاع RICS: ٤٠٠–٧٠٠ جنيه. فحص هيكلي كامل: ٦٠٠–١,٥٠٠ جنيه."] },
              { icon: "🏦", en: ["Mortgage arrangement fee", "Typically £1,000–£2,000. Some lenders add this to the loan, but you pay interest on it."], ar: ["رسوم ترتيب القرض العقاري", "عادةً ١,٠٠٠ إلى ٢,٠٠٠ جنيه. قد يضيفها بعض المُقرضين إلى القرض، لكن ستدفع عليها فائدة (أو هامش ربح في حالة التمويل الإسلامي)."] },
              { icon: "📦", en: ["Letting agent / management", "High street agents charge 10–15% of rent. Fully managed: 15–20%. Or use guaranteed rent — we pay you a fixed monthly rate and manage everything."], ar: ["وكالة التأجير والإدارة", "تتقاضى وكالات الشوارع الرئيسية ١٠–١٥٪ من الإيجار. الإدارة الكاملة: ١٥–٢٠٪. أو استخدم نظام الإيجار المضمون — ندفع لك مبلغاً شهرياً ثابتاً ونتولى كل شيء."] },
              { icon: "🧾", en: ["UK income tax on rental income", "Non-residents must register for UK Self Assessment and pay income tax on rental profit (after allowable expenses). You get a personal allowance of £12,570/year."], ar: ["ضريبة الدخل البريطانية على الإيجار", "يجب على غير المقيمين التسجيل في نظام Self Assessment البريطاني ودفع ضريبة الدخل على الأرباح الإيجارية (بعد النفقات المسموح بها). يحق لك إعفاء شخصي بقيمة ١٢,٥٧٠ جنيهاً سنوياً."] },
            ].map((c) => (
              <div key={c.en[0]} className="flex gap-4 bg-white/5 border border-white/10 rounded-xl p-5 hover:border-[var(--h-accent-on-ink)]/20 transition-colors">
                <span className="text-2xl shrink-0">{c.icon}</span>
                <div>
                  <h3 className="font-semibold text-white text-sm mb-1">{ar ? c.ar[0] : c.en[0]}</h3>
                  <p className="text-white/55 text-sm leading-relaxed">{ar ? c.ar[1] : c.en[1]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GUARANTEED RENT CTA */}
      <section className="bg-[var(--h-ink)] py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 items-center" dir={ar ? "rtl" : "ltr"}>
            <div className={ar ? "text-right" : ""}>
              <div className="inline-flex items-center gap-2 bg-[var(--h-accent)]/15 border border-[var(--h-accent)]/30 rounded-full px-3 py-1.5 mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--h-accent)] animate-pulse" />
                <span className="text-[var(--h-accent-on-ink)] text-xs font-bold uppercase tracking-widest">{ar ? "مثالي للمستثمرين الخليجيين" : "Perfect for Gulf Investors"}</span>
              </div>
              <h2 className="text-3xl font-black mb-4">
                {ar ? (
                  <><span className="text-[var(--h-accent-on-ink)]">إيجار مضمون</span><br />دون إدارة من الخليج</>
                ) : (
                  <><span className="text-[var(--h-accent-on-ink)]">Guaranteed rent.</span><br />Managed from the Gulf.</>
                )}
              </h2>
              <div className="space-y-3 text-white/65 text-sm leading-relaxed mb-8">
                <p>{ar ? "إذا كنت مقيماً في الخليج، فإن إدارة العقار عن بُعد تُسبب الصداع. المستأجرون الذين لا يدفعون. فترات شغور. مكالمات في منتصف الليل." : "If you're based in the Gulf, managing a UK property remotely is a headache. Tenants who don't pay. Void periods. Calls in the middle of the night."}</p>
                <p>{ar ? "مع نظامنا للإيجار المضمون، نتولى إدارة كل شيء. نعقد معك اتفاقية إيجار تتراوح بين ٣ و٥ سنوات ونضمن دفع الإيجار في موعده كل شهر — سواء كان العقار مأهولاً أم لا." : "With our guaranteed rent scheme, we take care of everything. We enter a 3–5 year lease agreement with you and guarantee your rent every month — whether the property is occupied or not."}</p>
              </div>
              <div className="space-y-2 mb-8">
                {[
                  { en: "Fixed monthly income — we pay you, on time", ar: "دخل شهري ثابت — ندفع لك في الموعد" },
                  { en: "No voids, no arrears, no management fees", ar: "لا فترات شغور، لا متأخرات، لا رسوم إدارة" },
                  { en: "We handle all tenant selection and maintenance", ar: "نتولى اختيار المستأجرين وصيانة العقار" },
                  { en: "We cover Birmingham, Nottingham, Derby, Leicester, Sheffield", ar: "نغطي برمنغهام ونوتنغهام ودربي وليستر وشيفيلد" },
                ].map((b) => (
                  <div key={b.en} className={`flex items-center gap-3 text-sm ${ar ? "flex-row-reverse" : ""}`}>
                    <span className="text-green-400 shrink-0">✓</span>
                    <span className="text-white/75">{ar ? b.ar : b.en}</span>
                  </div>
                ))}
              </div>
              <a href={WA} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[var(--h-accent)] hover:bg-[#b8973b] text-white font-bold px-7 py-3.5 rounded-xl transition-colors">
                {ar ? "تحدث معنا عبر واتساب" : "WhatsApp Us"} →
              </a>
            </div>
            <div className="space-y-4">
              {[
                { label_en: "Monthly rent (market rate)", label_ar: "الإيجار الشهري (السوق)", value: "£900 / mo" },
                { label_en: "Guaranteed rent we pay you", label_ar: "الإيجار المضمون الذي ندفعه", value: "£810 / mo", highlight: true },
                { label_en: "Void months in 12", label_ar: "أشهر الشغور في السنة", value: "0" },
                { label_en: "Annual income (self-managed, 1 void)", label_ar: "الدخل السنوي (إدارة ذاتية، شغور شهر)", value: "£9,900" },
                { label_en: "Annual income (guaranteed rent)", label_ar: "الدخل السنوي (إيجار مضمون)", value: "£9,720", highlight: true },
                { label_en: "Management fee saved", label_ar: "رسوم الإدارة الموفّرة", value: "~£1,800 / yr" },
              ].map((r) => (
                <div key={r.label_en} className={`flex items-center justify-between bg-white/5 border ${r.highlight ? "border-[var(--h-accent)]/30 bg-[var(--h-accent)]/5" : "border-white/10"} rounded-xl px-5 py-3.5 ${ar ? "flex-row-reverse" : ""}`}>
                  <span className="text-white/75 text-sm">{ar ? r.label_ar : r.label_en}</span>
                  <span className={`font-bold text-sm ${r.highlight ? "text-[var(--h-accent-on-ink)]" : "text-white"}`}>{r.value}</span>
                </div>
              ))}
              <p className="text-white/55 text-xs" dir={ar ? "rtl" : "ltr"}>{ar ? "مثال على عقار بـ٩٠٠ جنيه/شهر. الأرقام للتوضيح." : "Example for a £900/mo property. Figures for illustration."}</p>
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-4xl mb-4" style={{ fontFamily: "serif" }}>مكان</div>
          <h2 className="text-3xl font-black mb-3">{ar ? "جاهز لبدء الاستثمار؟" : "Ready to Start?"}</h2>
          <p className="text-white/55 mb-8 text-sm leading-relaxed">
            {ar
              ? "تحدث مع فريقنا عبر واتساب. لا تزال الأسئلة الأساسية مجانية. إذا كنت جاهزاً، يمكننا مساعدتك في العثور على عقار مناسب ونظام الإيجار المضمون."
              : "Talk to our team on WhatsApp. Basic questions are always free. If you're ready, we can help you find a suitable property and pair it with a guaranteed rent arrangement."}
          </p>
          <div className={`flex flex-wrap gap-4 justify-center ${ar ? "flex-row-reverse" : ""}`}>
            <a href={WA} target="_blank" rel="noopener noreferrer"
              className="bg-[var(--h-accent)] hover:bg-[#b8973b] text-white font-bold px-8 py-4 rounded-xl transition-colors text-lg">
              {ar ? "واتساب الآن" : "WhatsApp Now"} →
            </a>
            <Link href="/guaranteed-rent"
              className="bg-white/10 hover:bg-white/15 text-white font-semibold px-8 py-4 rounded-xl transition-colors border border-white/20">
              {ar ? "الإيجار المضمون" : "Guaranteed Rent"}
            </Link>
          </div>
          <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap justify-center gap-6 text-sm text-white/55">
            <Link href="/makan" className="hover:text-white/75 transition-colors">← Makan</Link>
            <Link href="/calculators/stamp-duty" className="hover:text-white/75 transition-colors">{ar ? "حاسبة الدمغة الكاملة" : "Full Stamp Duty Calculator"}</Link>
            <Link href="/contact" className="hover:text-white/75 transition-colors">{ar ? "تواصل معنا" : "Contact"}</Link>
          </div>
        </div>
      </section>

    </main>
  );
}
