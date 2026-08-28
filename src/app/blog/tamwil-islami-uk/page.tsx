import { BlogArticleHero } from "@/components/blog/BlogArticleHero";
import Link from "next/link";
import type { Metadata } from "next";
import { Disclaimer } from "@/components/legal/Disclaimer";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { ArticleSchema } from "@/components/seo/ArticleSchema";
import { RelatedArticles } from "@/components/blog/RelatedArticles";

export const metadata: Metadata = {
  title: "Islamic Finance & Halal Mortgages UK — Arabic Guide",
  description:
    "Islamic finance and halal mortgage options in the UK. Murabaha, Diminishing Musharaka explained in Arabic with UK lender comparisons.",
  keywords:
    "Islamic mortgage UK, halal mortgage UK Arabic, Islamic finance property UK, رهن عقاري إسلامي بريطانيا, تمويل إسلامي",
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/blog/tamwil-islami-uk/" },
  openGraph: {
    title: "Islamic Finance & Halal Mortgages UK — Arabic Guide",
    description: "Islamic finance and halal mortgage options in the UK. Murabaha, Diminishing Musharaka explained in Arabic with UK lender comparisons.",
    type: "article",
    url: "https://www.propertyvaultuk.co.uk/blog/tamwil-islami-uk/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "Islamic Finance & Halal Mortgages UK" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Islamic Finance & Halal Mortgages UK — Arabic Guide",
    description: "Islamic finance and halal mortgage options in the UK. Murabaha, Diminishing Musharaka explained in Arabic with UK lender comparisons.",
  },
};

const faqs = [
  {
    q: "هل التمويل الإسلامي متاح للمقيمين وغير المقيمين في بريطانيا؟",
    a: "نعم، يتوفر التمويل الإسلامي لكلٍّ من المقيمين وغير المقيمين، غير أن الشروط تختلف. المقيمون في بريطانيا يتمتعون بخيارات أوسع وشروط أيسر، بينما يواجه غير المقيمين متطلبات إيداع أعلى تتراوح بين 35-40%، وقد يقتصر الاختيار على عدد محدود من البنوك كـ Al Rayan Bank وGatehouse Bank. يُنصح غير المقيمين بالتواصل مع وسيط متخصص في التمويل الإسلامي لفهم الخيارات المتاحة لوضعهم تحديداً.",
  },
  {
    q: "ما هي أبرز البنوك الإسلامية في المملكة المتحدة؟",
    a: "أبرز المؤسسات التي تقدم تمويلاً إسلامياً في بريطانيا هي: Al Rayan Bank وهو الأكبر والأوسع من حيث المنتجات، وGatehouse Bank المتخصص في التمويل العقاري بمعدلات تنافسية، وHSBC Amanah الذي يقدم منتجات إسلامية ضمن الخدمات المصرفية الكبرى، وAhli United Bank الذي يخدم شريحة واسعة من العملاء العرب. تخضع جميع هذه المؤسسات لرقابة هيئة السلوك المالي (FCA) وهيئة التنظيم الاحترازي (PRA).",
  },
  {
    q: "هل التمويل الإسلامي أغلى من الرهن العقاري التقليدي؟",
    a: "تاريخياً كان التمويل الإسلامي يكلّف أكثر بسبب محدودية المنافسة، إلا أن الفجوة ضاقت بشكل ملحوظ في السنوات الأخيرة. اليوم قد يكون الفرق في التكلفة الإجمالية طفيفاً أو معدوماً، ولا سيما في منتجات المشاركة المتناقصة ذات المدة الطويلة. العامل الأهم الذي كان يرفع التكلفة — الازدواج الضريبي في ضريبة الدمغة — قد عولج تشريعياً منذ عام 2003. ينبغي مقارنة التكلفة الإجمالية (APRC) لا المعدل السنوي فقط.",
  },
  {
    q: "كيف يعمل منتج المشاركة المتناقصة في بريطانيا؟",
    a: "في المشاركة المتناقصة (Diminishing Musharaka)، يشتري البنك والعميل العقار معاً بنسبة ملكية محددة. مثلاً، يدفع العميل إيداعاً بنسبة 25% ويمتلك البنك 75%. يسكن العميل العقار ويدفع للبنك أجر إيجار على حصته (75%) بالإضافة إلى دفعات شهرية لشراء جزء إضافي من حصة البنك تدريجياً. مع كل دفعة تتقلص حصة البنك وتتوسع حصة العميل حتى يصبح المالك الكامل في نهاية المدة. هذا الهيكل يتجنب الفائدة الربوية ويحقق ملكية تامة في نهاية العقد.",
  },
  {
    q: "هل يمكن تمويل عقار للإيجار (Buy-to-Let) بصيغة إسلامية في بريطانيا؟",
    a: "نعم، يتوفر تمويل Buy-to-Let بصيغة إسلامية من خلال عدد من المؤسسات كـ Al Rayan Bank وGatehouse Bank. يُستخدم في العادة هيكل الإجارة أو المشاركة المتناقصة، حيث يؤجَّر العقار لطرف ثالث ويعود الدخل الإيجاري جزئياً لتغطية أقساط التمويل. تشترط البنوك عادةً إيداعاً لا يقل عن 25-35%، وقد تُطبَّق معايير أكثر صرامة من التمويل السكني المعتاد.",
  },
];

export default function TamwilIslamiUKPage() {
  return (
    <>
      <ArticleSchema
        headline="التمويل الإسلامي والرهن العقاري الحلال في المملكة المتحدة"
        description="مقارنة كاملة بين منتجات التمويل الإسلامي (المرابحة، الإجارة، المشاركة المتناقصة) والرهن التقليدي — وأفضل بنوك الرهن الحلال في بريطانيا."
        slug="tamwil-islami-uk"
        datePublished="2026-08-02"
        section="Arabic"
        inLanguage="ar"
      />
      <BlogArticleHero
        title="التمويل الإسلامي والرهن العقاري الحلال في المملكة المتحدة"
        excerpt="دليل شامل لخيارات التمويل الإسلامي المتاحة في بريطانيا — المرابحة، الإجارة، المشاركة المتناقصة، وأبرز البنوك الإسلامية."
        category="Finance"
        date="2 August 2026"
        readTime="10 min"
        image="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1400&q=80"
      />

      <article className="section-padding bg-white">
        <div className="container-max max-w-3xl">
          <div dir="rtl" lang="ar" className="space-y-6 text-navy-600 leading-relaxed">

            {/* 1. Introduction */}
            <h2
              className="text-xl font-bold text-navy-800 mt-8"
              style={{ fontFamily: "var(--font-family-heading)" }}
            >
              لماذا التمويل الإسلامي في بريطانيا؟
            </h2>
            <p>
              تُعدّ المملكة المتحدة من أكثر الدول الغربية تقدماً في مجال التمويل الإسلامي؛ إذ أسهمت الحكومة البريطانية منذ عام 2003 في بناء إطار تشريعي مناسب يُتيح للمسلمين وغيرهم الوصول إلى منتجات مالية متوافقة مع أحكام الشريعة الإسلامية. يعيش في بريطانيا ما يزيد على ثلاثة ملايين مسلم، ويرغب كثيرون منهم في تملّك منازلهم دون الوقوع في شبكة الفائدة الربوية. والخبر الطيب أن السوق اليوم يوفر حلولاً عملية وتنافسية لا تختلف كثيراً في تكلفتها الإجمالية عن الرهن التقليدي.
            </p>

            {/* 2. Main Products */}
            <h2
              className="text-xl font-bold text-navy-800 mt-8"
              style={{ fontFamily: "var(--font-family-heading)" }}
            >
              المنتجات الرئيسية للتمويل الإسلامي
            </h2>

            <h3 className="text-lg font-bold text-navy-800 mt-6">المرابحة (Murabaha)</h3>
            <p>
              في المرابحة يشتري البنك العقار المطلوب بالكامل ثم يبيعه للعميل بسعر أعلى محدد مسبقاً يشمل هامش ربح متفق عليه، ويُسدِّد العميل الثمن على أقساط شهرية. الميزة الجوهرية أن التكلفة الإجمالية معلومة من البداية ولا تتغيّر، مما يمنح العميل يقيناً مالياً كاملاً. يُستخدم هذا النوع في الغالب للمبالغ الصغيرة أو المدد القصيرة.
            </p>

            <h3 className="text-lg font-bold text-navy-800 mt-6">الإجارة المنتهية بالتمليك (Ijara wa Iqtina)</h3>
            <p>
              يشتري البنك العقار ويؤجّره للعميل مقابل قسط إيجاري شهري مع التزام البنك ببيع العقار للعميل في نهاية مدة العقد بسعر رمزي أو بقيمة متفق عليها. هذا المنتج شائع لدى Al Rayan Bank ويلائم من يرغبون في دفعات شهرية ثابتة على مدى طويل يصل إلى 25 عاماً.
            </p>

            <h3 className="text-lg font-bold text-navy-800 mt-6">المشاركة المتناقصة (Diminishing Musharaka)</h3>
            <p>
              يُعدّ هذا النموذج الأكثر شيوعاً في بريطانيا حالياً. يتشارك البنك والعميل في ملكية العقار، ثم يشتري العميل حصة البنك تدريجياً عبر الدفعات الشهرية حتى تؤول الملكية كاملةً إليه. يدفع العميل في الوقت نفسه أجر إيجار على الحصة التي لا يزال البنك يمتلكها، وتتقلص هذه النسبة مع كل قسط مدفوع.
            </p>

            <h3 className="text-lg font-bold text-navy-800 mt-6">الاستصناع (Istisna'a)</h3>
            <p>
              يُطبَّق الاستصناع في تمويل العقارات قيد الإنشاء (Off-Plan)، حيث يتعاقد البنك مع المطوّر على البناء بمواصفات محددة ثم يبيع الوحدة المكتملة للعميل. هذا الخيار أقل شيوعاً في السوق البريطانية لكنه متاح عبر بعض المؤسسات المتخصصة.
            </p>

            {/* 3. Comparison Table */}
            <h2
              className="text-xl font-bold text-navy-800 mt-8"
              style={{ fontFamily: "var(--font-family-heading)" }}
            >
              الرهن التقليدي مقابل التمويل الإسلامي — جدول مقارنة
            </h2>
            <div className="not-prose overflow-x-auto bg-navy-50 rounded-xl p-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-navy-200">
                    <th className="text-right py-2 px-3 font-bold text-navy-800">المعيار</th>
                    <th className="text-right py-2 px-3 font-bold text-navy-800">الرهن التقليدي</th>
                    <th className="text-right py-2 px-3 font-bold text-navy-800">التمويل الإسلامي</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-navy-100">
                    <td className="py-2 px-3">الأساس القانوني</td>
                    <td className="py-2 px-3">قرض بفائدة</td>
                    <td className="py-2 px-3">شراكة أو بيع أو إجارة</td>
                  </tr>
                  <tr className="border-b border-navy-100">
                    <td className="py-2 px-3">الفائدة الربوية</td>
                    <td className="py-2 px-3">نعم</td>
                    <td className="py-2 px-3">لا</td>
                  </tr>
                  <tr className="border-b border-navy-100">
                    <td className="py-2 px-3">نسبة الإيداع</td>
                    <td className="py-2 px-3">5% – 20%</td>
                    <td className="py-2 px-3">20% – 25% (الحد الأدنى)</td>
                  </tr>
                  <tr className="border-b border-navy-100">
                    <td className="py-2 px-3">تقلّب الدفعات</td>
                    <td className="py-2 px-3">متغيّر أو ثابت</td>
                    <td className="py-2 px-3">ثابت أو متغيّر حسب المنتج</td>
                  </tr>
                  <tr className="border-b border-navy-100">
                    <td className="py-2 px-3">التكلفة الإجمالية</td>
                    <td className="py-2 px-3">تعتمد على سعر الفائدة</td>
                    <td className="py-2 px-3">هامش ربح محدد مسبقاً</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3">ضريبة الدمغة</td>
                    <td className="py-2 px-3">مرة واحدة</td>
                    <td className="py-2 px-3">مرة واحدة (بعد إصلاح 2003)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 4. Banks */}
            <h2
              className="text-xl font-bold text-navy-800 mt-8"
              style={{ fontFamily: "var(--font-family-heading)" }}
            >
              أبرز مؤسسات التمويل الإسلامي في بريطانيا
            </h2>
            <ul className="list-disc pr-6 space-y-2">
              <li>
                <strong>Al Rayan Bank:</strong> أكبر بنك إسلامي متكامل في بريطانيا، يقدم منتجات التمويل السكني والاستثماري (Buy-to-Let) والتجاري، ويتميز بتغطية واسعة عبر الفروع والخدمات الرقمية.
              </li>
              <li>
                <strong>Gatehouse Bank:</strong> متخصص في التمويل العقاري الإسلامي بمعدلات تنافسية، يوفر منتجات سكنية واستثمارية لكل من المقيمين وغير المقيمين.
              </li>
              <li>
                <strong>HSBC Amanah:</strong> الجناح الإسلامي لأحد أكبر البنوك العالمية، يُتيح خيارات تمويل إسلامي مدعومة بشبكة HSBC الواسعة، وإن كانت المنتجات أقل تنوعاً مقارنةً بالبنوك الإسلامية المتخصصة.
              </li>
              <li>
                <strong>Ahli United Bank:</strong> يُقدم تمويلاً إسلامياً بتركيز خاص على الجاليات العربية، ويتوفر منه فرع في لندن بخدمات عربية متكاملة.
              </li>
            </ul>

            {/* 5. Requirements */}
            <h2
              className="text-xl font-bold text-navy-800 mt-8"
              style={{ fontFamily: "var(--font-family-heading)" }}
            >
              الشروط والمتطلبات الأساسية
            </h2>
            <p>
              تشترط معظم البنوك الإسلامية في بريطانيا نسبة إيداع لا تقل عن <strong>20% إلى 25%</strong> من قيمة العقار، بينما قد تصل إلى 35% للعقارات الاستثمارية. إضافةً إلى ذلك:
            </p>
            <ul className="list-disc pr-6 space-y-2">
              <li>إثبات الدخل الثابت: كشوف الراتب لآخر ثلاثة أشهر، أو حسابات الأعمال لآخر عامين للعمل الحر.</li>
              <li>سجل ائتماني مقبول في بريطانيا (Credit Score)؛ يُنصح الجدد في البلاد ببناء سجلهم مبكراً.</li>
              <li>إثبات الإقامة والهوية وفق متطلبات KYC/AML.</li>
              <li>كشف حساب بنكي لآخر 3-6 أشهر لتوثيق المدفوعات المنتظمة.</li>
              <li>تقرير تقييم عقاري (Valuation Report) معتمد من المؤسسة الممولة.</li>
            </ul>
            <p>
              يمكنك الاستعانة بـ{" "}
              <Link href="/calculators/affordability" className="text-gold-600 underline hover:text-gold-700">
                حاسبة القدرة الشرائية
              </Link>{" "}
              لمعرفة الميزانية المناسبة قبل التقديم.
            </p>

            {/* 6. Cost Analysis */}
            <h2
              className="text-xl font-bold text-navy-800 mt-8"
              style={{ fontFamily: "var(--font-family-heading)" }}
            >
              هل التمويل الإسلامي أغلى من التقليدي؟ — تحليل صادق
            </h2>
            <p>
              كان هذا السؤال المُقلق يُعيق كثيرين في السابق، غير أن الواقع اليوم مختلف. نعم قد تكون هوامش ربح بعض المنتجات الإسلامية أعلى طفيفاً من معدلات الفائدة الاسمية للرهن التقليدي، لكن الفجوة انضاقت بشكل واضح. المقارنة الصحيحة ينبغي أن تعتمد على <strong>معدل النسبة السنوي الإجمالي (APRC)</strong> لا على المعدل السنوي الاسمي فقط.
            </p>
            <p>
              على سبيل المثال، عقار بقيمة £300,000 بإيداع 25% (£75,000) على مدى 25 عاماً: قد يُكلّف التمويل الإسلامي ما بين £50 و£100 شهرياً أكثر من الرهن التقليدي المكافئ، وهو فارق يراه كثيرون ثمناً معقولاً لراحة الضمير. في المقابل قد تختفي هذه الفجوة كلياً مع التفاوض أو اختيار فترة تثبيت مناسبة.
            </p>

            {/* 7. Stamp Duty */}
            <h2
              className="text-xl font-bold text-navy-800 mt-8"
              style={{ fontFamily: "var(--font-family-heading)" }}
            >
              ضريبة الدمغة والتمويل الإسلامي
            </h2>
            <p>
              كانت ضريبة الدمغة (Stamp Duty Land Tax) تُشكّل عبئاً مضاعفاً في السابق، إذ كانت تُفرض مرتين: مرة حين يشتري البنك العقار، ومرة عند بيعه للعميل. عالجت الحكومة البريطانية هذه الإشكالية في قانون المال لعام 2003 وعدّلته عام 2009، بحيث تُفرض ضريبة الدمغة <strong>مرة واحدة فقط</strong> على التمويل الإسلامي تماماً كالرهن التقليدي. هذا التعديل أزال أحد أكبر العوائق أمام انتشار التمويل الإسلامي في بريطانيا. للاستفسار عن الأرقام الدقيقة، استخدم{" "}
              <Link href="/calculators/stamp-duty" className="text-gold-600 underline hover:text-gold-700">
                حاسبة ضريبة الدمغة
              </Link>
              .
            </p>

            {/* 8. Application Steps */}
            <h2
              className="text-xl font-bold text-navy-800 mt-8"
              style={{ fontFamily: "var(--font-family-heading)" }}
            >
              خطوات التقديم على التمويل الإسلامي
            </h2>
            <ol className="list-decimal pr-6 space-y-2">
              <li>
                <strong>التقييم الأولي:</strong> استخدم حاسبة الميزانية لتحديد المبلغ الذي يمكنك تحمّله وفق دخلك ومدخراتك.
              </li>
              <li>
                <strong>اختيار المنتج:</strong> قارن بين المرابحة والإجارة والمشاركة المتناقصة بناءً على احتياجك ومدة الإقامة المخططة في العقار.
              </li>
              <li>
                <strong>التواصل مع وسيط متخصص:</strong> يُفضَّل التعامل مع وسيط مالي مرخص وعلى دراية بمنتجات التمويل الإسلامي، لأن ليس كل وسيط على إلمام كافٍ بهذا المجال.
              </li>
              <li>
                <strong>الحصول على موافقة مبدئية (AIP):</strong> تُصدرها البنوك مجاناً وتُتيح لك التفاوض على العقار بصفة جادة.
              </li>
              <li>
                <strong>الاتفاق على العقار وتقييمه:</strong> يطلب البنك تقرير تقييم مستقلاً قبل إصدار العرض الرسمي.
              </li>
              <li>
                <strong>التوقيع والإتمام:</strong> يتولى المحامون (Solicitors) إنهاء إجراءات نقل الملكية وسداد ضريبة الدمغة.
              </li>
            </ol>

            {/* 9. Practical Tips */}
            <h2
              className="text-xl font-bold text-navy-800 mt-8"
              style={{ fontFamily: "var(--font-family-heading)" }}
            >
              نصائح عملية للحصول على أفضل صفقة
            </h2>
            <ul className="list-disc pr-6 space-y-2">
              <li>
                <strong>قارن بين أكثر من مؤسسة:</strong> لا تقتصر على البنك الأول الذي تتواصل معه؛ الفجوة بين هوامش الربح قد تصل إلى 0.5% سنوياً وتُمثل آلاف الجنيهات على مدى سنوات.
              </li>
              <li>
                <strong>ابنِ سجلك الائتماني مبكراً:</strong> إن كنت حديث العهد ببريطانيا، افتح حساباً بنكياً وسدّد فواتيرك في موعدها وسجّل في قوائم الناخبين (Electoral Roll).
              </li>
              <li>
                <strong>وفّر إيداعاً أعلى كلما أمكن:</strong> كل 5% إضافية في الإيداع تُحسّن هامش الربح المعروض عليك بشكل ملموس.
              </li>
              <li>
                <strong>احتسب التكاليف الكاملة:</strong> رسوم التقديم وتكاليف التقييم وأتعاب المحامين تُضاف جميعها إلى التكلفة الفعلية للتمويل.
              </li>
              <li>
                <strong>اسأل عن إمكانية السداد المبكر:</strong> بعض المنتجات الإسلامية تُتيح السداد الجزئي أو الكلي دون غرامات، وهذا مكسب مالي حقيقي على المدى البعيد.
              </li>
              <li>
                <strong>استشر عالماً شرعياً:</strong> إذا كنت غير متأكد من توافق منتج بعينه مع الشريعة، لا تتردد في الرجوع إلى هيئة رقابة شرعية معتمدة — جميع المنتجات المدرجة هنا مُعتمدة من هيئات شرعية دولية مستقلة.
              </li>
            </ul>

            <p>
              للاستفسار عن العقارات المناسبة للتمويل الإسلامي في السوق البريطانية، تفضل بزيارة{" "}
              <Link href="/search" className="text-gold-600 underline hover:text-gold-700">
                قاعدة بيانات العقارات
              </Link>{" "}
              أو استخدم{" "}
              <Link href="/calculators/affordability" className="text-gold-600 underline hover:text-gold-700">
                حاسبة القدرة الشرائية
              </Link>{" "}
              للبدء بتخطيط ميزانيتك.
            </p>
          </div>

          <FAQSchema faqs={faqs} />
          <Disclaimer type="financial" />
        </div>
      </article>
      <RelatedArticles
        slug="tamwil-islami-uk"
        heading="اقرأ أيضًا"
        dir="rtl"
      />
    </>
  );
}
