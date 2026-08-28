import { BlogArticleHero } from "@/components/blog/BlogArticleHero";
import Link from "next/link";
import type { Metadata } from "next";
import { Disclaimer } from "@/components/legal/Disclaimer";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { ArticleSchema } from "@/components/seo/ArticleSchema";
import { RelatedArticles } from "@/components/blog/RelatedArticles";
import { HelpCTA } from "@/components/blog/HelpCTA";

export const metadata: Metadata = {
  title: "Investing in UK Property from Abroad — Arabic Guide",
  description:
    "How to invest in UK buy-to-let property from outside the UK. Mortgages, taxes, management, and the full process in Arabic for Arab investors.",
  keywords:
    "UK property investment from abroad Arabic, استثمار عقاري في بريطانيا من الخارج, Arab investor UK property, non-resident UK property",
  openGraph: {
    title: "Investing in UK Property from Abroad — Arabic Guide",
    description:
      "How to invest in UK buy-to-let property from outside the UK. Mortgages, taxes, management, and the full process in Arabic for Arab investors.",
    type: "article",
    url: "https://www.propertyvaultuk.co.uk/blog/istihtmar-aqari-uk-min-kharij/",
    siteName: "PropertyVault UK",
    images: [
      {
        url: "https://www.propertyvaultuk.co.uk/opengraph-image",
        width: 1200,
        height: 630,
        alt: "الاستثمار العقاري في المملكة المتحدة من خارج بريطانيا",
      },
    ],
  },
  alternates: {
    canonical: "https://www.propertyvaultuk.co.uk/blog/istihtmar-aqari-uk-min-kharij/",
  },
};

const faqs = [
  {
    q: "هل يمكن للمقيم خارج بريطانيا الحصول على رهن عقاري بريطاني؟",
    a: "نعم، يمكن للمقيم خارج بريطانيا الحصول على رهن عقاري بريطاني، لكن الخيارات أضيق مقارنةً بالمقيمين. معظم البنوك الكبرى لا تقدم رهوناً لغير المقيمين، لكن هناك مقرضين متخصصين مثل Skipton International وOsaka Capital وعدد من البنوك الخاصة. عادةً ما تطلب هذه البنوك دفعةً أولى تتراوح بين 25% و40%، وإثبات دخل من بلد الإقامة، وسجل ائتماني نظيف. يُنصح بالعمل مع وسيط رهن عقاري متخصص في رهون غير المقيمين.",
  },
  {
    q: "كيف أدفع الضرائب البريطانية على الإيجار وأنا في الخارج؟",
    a: "تخضع إيرادات الإيجار البريطانية لضريبة الدخل البريطانية بصرف النظر عن مكان إقامتك. يلتزم وكيل الإيجار (أو المستأجر في غياب الوكيل) بحجب 20% من الإيجار وإرساله إلى HMRC ما لم تكن مسجلاً في برنامج Non-Resident Landlord Scheme، الذي يتيح لك استلام الإيجار كاملاً والتصريح بضرائبك سنوياً عبر Self Assessment. التسجيل مجاني وإلكتروني عبر موقع HMRC.",
  },
  {
    q: "ما هي أفضل طريقة لإدارة العقار عن بُعد في بريطانيا؟",
    a: "الخيار الأمثل للمستثمر الخارجي هو التعاقد مع شركة إدارة عقارات محترفة أو الاستفادة من خدمة الإيجار المضمون (Guaranteed Rent). في نموذج الإيجار المضمون، تستلم إيجاراً شهرياً ثابتاً بصرف النظر عن الإشغال، وتتولى الشركة جميع التزامات الملاك والإصلاحات والعلاقة مع المستأجرين. هذا الخيار مثالي لمن يعيش خارج بريطانيا ولا يريد التدخل اليومي في إدارة العقار.",
  },
  {
    q: "هل هناك حد أدنى لقيمة العقار لاستثمار الأجانب في بريطانيا؟",
    a: "لا يوجد قانونياً حد أدنى لقيمة العقار للمستثمرين الأجانب. لكن من الناحية العملية، معظم المقرضين المتخصصين في رهون غير المقيمين لا يموّلون عقارات تقل قيمتها عن £75,000. كما أن العقارات ذات القيمة المنخفضة جداً قد تُصنَّف كـ Non-Standard Construction، مما يُعقّد التأمين والتمويل. للاستثمار المريح، يُستحسن الإطار السعري بين £100,000 و£250,000 في المدن الإقليمية.",
  },
  {
    q: "ما هي ضريبة الأرباح الرأسمالية للمستثمرين الأجانب في بريطانيا؟",
    a: "منذ أبريل 2015، يلتزم غير المقيمين بدفع ضريبة الأرباح الرأسمالية (CGT) عند بيع العقارات السكنية البريطانية. يجب إبلاغ HMRC وسداد الضريبة خلال 60 يوماً من إتمام البيع. معدلات الضريبة للأفراد هي 18% للشريحة الضريبية الأساسية و24% للشرائح الأعلى (اعتباراً من أبريل 2024). كل شخص يتمتع بإعفاء سنوي يبلغ £3,000 لعام 2025/26.",
  },
];

export default function IstihtmarAqariUKPage() {
  return (
    <>
      <ArticleSchema
        headline="الاستثمار العقاري في بريطانيا من خارج المملكة المتحدة"
        description="دليل المستثمر العربي غير المقيم — الضرائب، فتح حساب بنكي، أفضل المدن للعائد، والإدارة عن بُعد عبر الإيجار المضمون."
        slug="istihtmar-aqari-uk-min-kharij"
        datePublished="2026-08-02"
        section="Arabic"
        inLanguage="ar"
      />
      <BlogArticleHero
        title="الاستثمار العقاري في المملكة المتحدة من خارج بريطانيا"
        excerpt="دليل عملي للمستثمر العربي الذي يريد الاستثمار في سوق العقارات البريطانية عن بُعد — التمويل، الضرائب، الإدارة، والفخاخ التي يجب تجنبها."
        category="Investing"
        date="2 August 2026"
        readTime="11 min"
        image="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1400&q=80"
      />

      <article className="section-padding bg-white">
        <div className="container-max max-w-3xl">
          <div dir="rtl" lang="ar" className="space-y-6 text-navy-600 leading-relaxed">

            {/* INTRO */}
            <p className="text-xl text-navy-700 leading-relaxed font-medium">
              يستثمر آلاف العرب في العقارات البريطانية كل عام — من الخليج، والمغرب العربي، ومصر، وبلاد الشام. السوق البريطاني لا يُغلق أبواب الأجانب؛ بل يرحّب بهم، ويوفر إطاراً قانونياً واضحاً يحمي المستثمر.
            </p>
            <p>
              لكن الاستثمار من الخارج له خصوصيته: قيود على التمويل، التزامات ضريبية تختلف عن المقيم، وضرورة إدارة العقار عن بُعد بشكل احترافي. هذا الدليل يشرح كل ذلك بوضوح ودون مبالغات.
            </p>

            {/* SECTION 1 */}
            <h2
              className="text-xl font-bold text-navy-800 mt-8"
              style={{ fontFamily: "var(--font-family-heading)" }}
            >
              ١. لماذا يستثمر العرب في العقارات البريطانية؟
            </h2>
            <p>
              ثلاثة أسباب رئيسية تجعل السوق البريطاني جذاباً للمستثمر العربي:
            </p>
            <ul className="list-disc pr-6 space-y-2">
              <li>
                <strong>الاستقرار القانوني:</strong> حقوق الملكية محمية بموجب قانون راسخ منذ قرون. لا مصادرة، ولا عشوائية في القرارات التشريعية.
              </li>
              <li>
                <strong>عائد الإيجار:</strong> في المدن الإقليمية كليستر وبيرمنغهام ونوتنغهام، يتراوح العائد الإجمالي بين 6% و9%، وهو أعلى بكثير مما تقدمه أسواق لندن أو دبي لنفس رأس المال المستثمر.
              </li>
              <li>
                <strong>عملة الجنيه الإسترليني:</strong> يُعدّ الجنيه ملاذاً نسبياً. المستثمر الخليجي أو المصري يتحوّط ضد تدهور عملته المحلية من خلال امتلاك أصل مُقيَّم بالجنيه.
              </li>
            </ul>
            <p>
              علاوةً على ذلك، الديموغرافيا تعمل لصالح المستثمر: الطلب على الإيجار في بريطانيا عند أعلى مستوياته التاريخية، وبناء المنازل الجديدة لا يلحق بالطلب، مما يُبقي الإيجارات في اتجاه تصاعدي هيكلي يصب في مصلحة الملاك على المدى البعيد.
            </p>

            {/* SECTION 2 */}
            <h2
              className="text-xl font-bold text-navy-800 mt-8"
              style={{ fontFamily: "var(--font-family-heading)" }}
            >
              ٢. هل يمكنني الشراء وأنا خارج بريطانيا؟
            </h2>
            <p>
              نعم، بشكل مطلق. القانون البريطاني لا يشترط الإقامة في المملكة المتحدة لتملّك العقارات. يمكن إتمام عملية الشراء كاملاً عن بُعد من خلال الخطوات التالية:
            </p>
            <ul className="list-disc pr-6 space-y-2">
              <li>توكيل محامي تحويل ملكية (Conveyancer) بريطاني مُرخَّص يعمل نيابةً عنك.</li>
              <li>توقيع المستندات إلكترونياً أو عبر كاتب عدل محلي (Notary Public) في بلد إقامتك مع ختم أبوستيل إن اقتُضي.</li>
              <li>إرسال الدفعة الأولى ورسوم الإتمام عبر تحويل بنكي دولي SWIFT مباشرةً إلى حساب الضمان لدى المحامي.</li>
              <li>استلام مفاتيح العقار عبر شركة الإدارة أو وكيل محلي موثوق يُسلّم المفاتيح للمستأجر أو يُودعها في صندوق المفاتيح.</li>
            </ul>
            <p>
              يستغرق الإجراء من 8 إلى 16 أسبوعاً من قبول العرض حتى التسجيل الرسمي للملكية في Land Registry. الشراء النقدي يقصّر هذه المدة أحياناً إلى ستة أسابيع.
            </p>

            {/* SECTION 3 */}
            <h2
              className="text-xl font-bold text-navy-800 mt-8"
              style={{ fontFamily: "var(--font-family-heading)" }}
            >
              ٣. الرهن العقاري لغير المقيمين في بريطانيا
            </h2>
            <p>
              هذا هو أكثر جانب يُربك المستثمر الخارجي. البنوك الكبرى كـ HSBC وBarclays لا تموّل العقارات الاستثمارية لغير المقيمين في الغالب. لكن خياراتك ليست صفراً:
            </p>
            <ul className="list-disc pr-6 space-y-2">
              <li>
                <strong>مقرضون متخصصون:</strong> Skipton International وOsaka Capital وعدد من البنوك الخاصة (Private Banks) تقدم رهوناً خصيصاً للمستثمرين خارج بريطانيا.
              </li>
              <li>
                <strong>نسبة الإيداع:</strong> توقّع 25% حداً أدنى، وكثيراً ما يطلب المقرضون 35–40% لغير المقيمين تحوطاً إضافياً.
              </li>
              <li>
                <strong>إثبات الدخل:</strong> يجب تقديم دخل منتظم من بلد الإقامة، عادةً ما يعادل £25,000 سنوياً كحد أدنى، مترجَماً ومعتمداً.
              </li>
              <li>
                <strong>الشراء نقداً:</strong> من يملك السيولة الكاملة يتجاوز كل هذه القيود ويُتمّ الصفقة بسرعة أكبر وبتكلفة أقل.
              </li>
            </ul>
            <p>
              العمل مع وسيط رهن عقاري (Mortgage Broker) متخصص في حالات غير المقيمين ليس اختيارياً — إنه ضروري. الوسيط يعرف المقرضين الذين يقبلون ملفك ويوفّر عليك أسابيع من المراسلات الضائعة مع بنوك لن تُقرضك أصلاً.
            </p>

            {/* SECTION 4 */}
            <h2
              className="text-xl font-bold text-navy-800 mt-8"
              style={{ fontFamily: "var(--font-family-heading)" }}
            >
              ٤. الضرائب: ما يجب أن تعرفه قبل الشراء
            </h2>

            <h3 className="text-lg font-bold text-navy-800 mt-6">ضريبة الدمغة (Stamp Duty Land Tax)</h3>
            <p>
              تُدفع مرة واحدة عند الشراء. المستثمرون — سواء مقيمون أو غير مقيمين — يدفعون رسوماً إضافية فوق المعدلات الأساسية:
            </p>
            <ul className="list-disc pr-6 space-y-2">
              <li>+5% على كل شريحة كرسوم "ملكية ثانية" (Second Home Surcharge).</li>
              <li>+2% إضافية لغير المقيمين في بريطانيا (Non-Resident Surcharge).</li>
              <li>مثال عملي: عقار بقيمة £150,000 سيُكلّف المستثمر غير المقيم ما يقارب £11,000 ضريبة دمغة (5% ملكية ثانية + 2% غير مقيم).</li>
            </ul>

            <h3 className="text-lg font-bold text-navy-800 mt-6">ضريبة الدخل على الإيجار</h3>
            <p>
              الإيجار دخل خاضع للضريبة البريطانية بصرف النظر عن جنسيتك أو مكان إقامتك. الحل العملي: التسجيل في برنامج Non-Resident Landlord Scheme من HMRC، ثم التصريح السنوي عبر Self Assessment. يمكن خصم مصاريف الإدارة والصيانة والتأمين وفوائد الرهن (عبر آلية محددة بعد Section 24) لتخفيض الوعاء الضريبي.
            </p>

            <h3 className="text-lg font-bold text-navy-800 mt-6">ضريبة الأرباح الرأسمالية (Capital Gains Tax)</h3>
            <p>
              عند بيع العقار، تدفع 18% (للشريحة الضريبية الأساسية) أو 24% (للشرائح الأعلى) على صافي الربح بعد طرح الإعفاء السنوي البالغ £3,000 لعام 2025/26. المهلة المتاحة للتصريح والسداد هي 60 يوماً فقط من إتمام البيع — التأخر يُفضي إلى غرامات.
            </p>

            <h3 className="text-lg font-bold text-navy-800 mt-6">ضريبة الميراث (Inheritance Tax)</h3>
            <p>
              العقارات البريطانية ضمن التركة خاضعة لضريبة الميراث بنسبة 40% على ما يتجاوز عتبة £325,000. التخطيط الضريبي المبكر — عبر هيكلة ملكية شركة (SPV) أو ترتيبات Trust — قد يُقلّص هذا العبء جزئياً. استشر متخصصاً في ضريبة الميراث البريطانية قبل اتخاذ قرار الشراء.
            </p>

            {/* SECTION 5 */}
            <h2
              className="text-xl font-bold text-navy-800 mt-8"
              style={{ fontFamily: "var(--font-family-heading)" }}
            >
              ٥. إدارة العقار عن بُعد
            </h2>
            <p>
              إدارة عقار من مدينة أخرى تحدٍّ حقيقي؛ من دولة أخرى تحوّل إلى ضرورة تنظيمية. أمامك خياران رئيسيان:
            </p>
            <ul className="list-disc pr-6 space-y-2">
              <li>
                <strong>شركة إدارة عقارات تقليدية (Letting Agent):</strong> تجد المستأجرين وتجمع الإيجار وتُنسّق الإصلاحات مقابل 10–15% من الإيجار الشهري. ستظل تُراسلك في القضايا الكبرى وتستأذنك في أي إنفاق يتجاوز حداً متفقاً عليه.
              </li>
              <li>
                <strong>خدمة الإيجار المضمون (Guaranteed Rent):</strong> تتعاقد مع شركة تستأجر منك العقار بالجملة وتدفع لك إيجاراً شهرياً ثابتاً — سواء كان العقار مشغولاً أم فارغاً. الشركة تتحمل البحث عن المستأجرين والإصلاحات والإشغال وكل متاعب الإدارة اليومية. مثالي للمستثمر البعيد الذي يريد تدفقاً نقدياً منتظماً بلا مفاجآت.
              </li>
            </ul>
            <p>
              تعرّف على المزيد حول{" "}
              <Link href="/guaranteed-rent" className="text-gold-600 font-semibold hover:underline">
                خدمة الإيجار المضمون من PropertyVault
              </Link>{" "}
              وكيف تحمي عائدك بصرف النظر عن الإشغال.
            </p>

            {/* SECTION 6 */}
            <h2
              className="text-xl font-bold text-navy-800 mt-8"
              style={{ fontFamily: "var(--font-family-heading)" }}
            >
              ٦. فتح حساب بنكي بريطاني من الخارج
            </h2>
            <p>
              لاستلام الإيجار وسداد الفواتير البريطانية وتسوية الضرائب مع HMRC، تحتاج حساباً بنكياً بالجنيه الإسترليني. الخيارات المتاحة لغير المقيمين:
            </p>
            <ul className="list-disc pr-6 space-y-2">
              <li>
                <strong>Wise (سابقاً TransferWise):</strong> يوفر حساباً بريطانياً بـ IBAN وSort Code، يفتح بالكامل إلكترونياً دون الحضور لبريطانيا. الأنسب والأسرع للمستثمر الخارجي.
              </li>
              <li>
                <strong>HSBC International / Expat:</strong> إذا كنت عميلاً لـ HSBC في بلدك، قد تستطيع فتح حساب بريطاني ضمن نفس المجموعة عبر فرعك المحلي.
              </li>
              <li>
                <strong>Revolut:</strong> خيار رقمي يوفر تحويلات رخيصة بين العملات وبطاقة مُرتبطة، مناسب للمصاريف اليومية المرتبطة بالعقار.
              </li>
            </ul>

            {/* SECTION 7 */}
            <h2
              className="text-xl font-bold text-navy-800 mt-8"
              style={{ fontFamily: "var(--font-family-heading)" }}
            >
              ٧. أفضل المدن للاستثمار: عوائد 6–9%
            </h2>
            <p>
              لندن تُقدّم عوائد إيجارية تتراوح بين 3% و5% — لا تكاد تُغطي تكلفة الرهن بعد احتساب المصاريف. المدن الإقليمية هي الفرصة الحقيقية للمستثمر الباحث عن عائد:
            </p>
            <ul className="list-disc pr-6 space-y-2">
              <li>
                <strong>ليستر (Leicester):</strong> عائد إجمالي 7–8.5%، أسعار متوسطة بين £130,000 و£180,000، طلب إيجاري قوي بفضل الجامعات والمستشفيات الكبرى.
              </li>
              <li>
                <strong>نوتنغهام (Nottingham):</strong> 7–9%، من أعلى المدن عائداً في بريطانيا. تحذير: تحقق من وجود نظام ترخيص المستأجرين الانتقائي (Selective Licensing) في الحي قبل الشراء.
              </li>
              <li>
                <strong>ديربي (Derby):</strong> 6.5–8%، أسعار منخفضة نسبياً، طلب إيجاري مستقر من موظفي Rolls-Royce والصناعات التحويلية.
              </li>
              <li>
                <strong>شيفيلد (Sheffield):</strong> 6–8%، مدينة جامعية كبيرة، طلب مرتفع من الطلاب والمهنيين الشباب.
              </li>
              <li>
                <strong>بيرمنغهام (Birmingham):</strong> أكبر اقتصاد إقليمي بعد لندن، طيف واسع من الفرص الاستثمارية، عوائد تتراوح بين 5.5% و7.5%.
              </li>
            </ul>
            <p>
              احسب العائد المتوقع لأي عقار تنظر فيه قبل أي خطوة عبر{" "}
              <Link href="/calculators/rental-yield" className="text-gold-600 font-semibold hover:underline">
                حاسبة العائد الإيجاري المجانية
              </Link>
              .
            </p>

            {/* SECTION 8 */}
            <h2
              className="text-xl font-bold text-navy-800 mt-8"
              style={{ fontFamily: "var(--font-family-heading)" }}
            >
              ٨. قانون Renters Rights Act 2025 وأثره على المستثمر الخارجي
            </h2>
            <p>
              دخل قانون حقوق المستأجرين (Renters Rights Act) حيز التنفيذ عام 2025 وغيّر ملامح سوق الإيجار البريطاني تغييراً جوهرياً:
            </p>
            <ul className="list-disc pr-6 space-y-2">
              <li>
                <strong>إلغاء Section 21 (الإخلاء بدون سبب):</strong> لم يعد بإمكان الملاك إخلاء المستأجرين دون سبب قانوني مُثبَت. هذا يرفع أهمية اختيار المستأجر المناسب بعناية منذ البداية عبر فحص شامل للمراجع والسجل المالي.
              </li>
              <li>
                <strong>إلغاء عقود الإيجار ذات المدة الثابتة:</strong> جميع عقود الإيجار الجديدة أصبحت دورية متجددة شهرياً. لا تجديد تلقائي بنفس الشروط — كل تغيير في الإيجار يستلزم إشعاراً رسمياً محدد الإجراءات.
              </li>
              <li>
                <strong>سجل الملاك الوطني:</strong> يُتوقع أن يصبح إلزامياً لجميع الملاك، بما فيهم غير المقيمين، مع فرض رسوم سنوية.
              </li>
            </ul>
            <p>
              للمستثمر الخارجي، هذه التغييرات تعني أن شركة الإدارة أو الإيجار المضمون ليست رفاهية — بل ضرورة حتى تضمن الامتثال القانوني دون الاضطرار لمتابعة تفاصيل القانون البريطاني المتغيرة من الخارج.
            </p>

            {/* SECTION 9 */}
            <h2
              className="text-xl font-bold text-navy-800 mt-8"
              style={{ fontFamily: "var(--font-family-heading)" }}
            >
              ٩. الخطوات العملية للبدء
            </h2>
            <ol className="list-decimal pr-6 space-y-3">
              <li>
                <strong>حدّد ميزانيتك وهدفك:</strong> هل تريد تدفقاً نقدياً شهرياً أم نمواً رأسمالياً طويل المدى؟ الإجابة ستحدد المدينة والاستراتيجية المناسبة.
              </li>
              <li>
                <strong>تحدث مع وسيط رهن عقاري متخصص في غير المقيمين:</strong> اعرف مسبقاً ما إذا كنت مؤهلاً للتمويل، وما نسبة الإيداع المطلوبة منك تحديداً.
              </li>
              <li>
                <strong>اختر مدينة واحدة وادرسها جيداً:</strong> راجع عشرين عقاراً على Rightmove وZoopla وشغّل أرقام كل واحد منها قبل أي عرض.
              </li>
              <li>
                <strong>وظّف محامي تحويل ملكية ذا خبرة في الصفقات الدولية:</strong> ليس أرخص محامٍ تجده — اختر من يعرف متطلبات الإثبات الخاصة بغير المقيمين.
              </li>
              <li>
                <strong>جهّز آلية إدارة العقار قبل إغلاق الصفقة:</strong> تعاقد مع شركة إدارة أو خدمة إيجار مضمون قبل الإتمام، ليس بعده.
              </li>
              <li>
                <strong>سجّل في Non-Resident Landlord Scheme:</strong> فور استلام مفاتيح العقار، أنشئ حساب HMRC وقدّم طلب الانضمام إلى البرنامج إلكترونياً.
              </li>
            </ol>

            {/* CTA BOX */}
            <div className="bg-navy-900 rounded-2xl p-8 text-center mt-8">
              <p className="text-gold-400 font-semibold text-sm uppercase tracking-wider mb-3">أدوات PropertyVault</p>
              <h3 className="text-white font-bold text-xl mb-3">احسب عائدك قبل أن تقرر</h3>
              <p className="text-navy-200 text-sm mb-6 max-w-md mx-auto">
                استخدم أدواتنا المجانية لتحليل أي صفقة عقارية قبل الاستثمار — العائد الإيجاري، التدفق النقدي، وضريبة الدمغة.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link
                  href="/calculators/rental-yield"
                  className="bg-gold-400 text-navy-900 font-bold text-sm px-5 py-3 rounded-xl hover:bg-gold-500 transition-colors"
                >
                  حاسبة العائد الإيجاري
                </Link>
                <Link
                  href="/guaranteed-rent"
                  className="bg-white/10 text-white font-semibold text-sm px-5 py-3 rounded-xl hover:bg-white/20 transition-colors border border-white/20"
                >
                  خدمة الإيجار المضمون
                </Link>
              </div>
            </div>

            <Disclaimer type="financial" />
          </div>
        </div>
        <HelpCTA dir="rtl" />
      </article>

      <section className="section-padding bg-navy-50">
        <div className="container-max max-w-3xl">
          <div dir="rtl" lang="ar">
            <FAQSchema faqs={faqs} />
          </div>
        </div>
      </section>
      <RelatedArticles
        slug="istihtmar-aqari-uk-min-kharij"
        heading="اقرأ أيضًا"
        dir="rtl"
      />
    </>
  );
}
