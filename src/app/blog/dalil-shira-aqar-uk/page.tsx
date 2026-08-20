import { BlogArticleHero } from "@/components/blog/BlogArticleHero";
import Link from "next/link";
import type { Metadata } from "next";
import { Disclaimer } from "@/components/legal/Disclaimer";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { ArticleSchema } from "@/components/seo/ArticleSchema";
import { RelatedArticles } from "@/components/blog/RelatedArticles";

export const metadata: Metadata = {
  title: "Buying Property in the UK — Arabic Guide | PropertyVault UK",
  description:
    "A complete Arabic guide to buying property in the UK. Mortgages, stamp duty, solicitors, and the full process explained for Arab buyers and expats.",
  keywords:
    "buying property UK Arabic, شراء عقار في المملكة المتحدة, UK property guide Arabic, Arab expat property UK",
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/blog/dalil-shira-aqar-uk/" },
  openGraph: {
    title: "Buying Property in the UK — Arabic Guide | PropertyVault UK",
    description: "A complete Arabic guide to buying property in the UK. Mortgages, stamp duty, solicitors, and the full process explained for Arab buyers and expats.",
    type: "article",
    url: "https://www.propertyvaultuk.co.uk/blog/dalil-shira-aqar-uk/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "Buying Property in the UK — Arabic Guide" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Buying Property in the UK — Arabic Guide | PropertyVault UK",
    description: "A complete Arabic guide to buying property in the UK. Mortgages, stamp duty, solicitors, and the full process explained for Arab buyers and expats.",
  },
};

const faqs = [
  {
    q: "هل يمكن للأجانب شراء العقارات في المملكة المتحدة؟",
    a:
      "نعم، لا يوجد في المملكة المتحدة أي قيود قانونية تمنع الأجانب من شراء العقارات، سواء كانوا مقيمين أو غير مقيمين. يمكن لأي شخص من أي جنسية اقتناء عقار في بريطانيا، غير أن غير المقيمين قد يواجهون متطلبات إيداع أعلى من البنوك، وقد تكون خياراتهم في الرهن العقاري محدودة مقارنةً بالمقيمين. بالإضافة إلى ذلك، يُضاف رسم إضافي بنسبة 2% على ضريبة الدمغة للمشترين غير المقيمين في المملكة المتحدة منذ عام 2021.",
  },
  {
    q:"ما هي ضريبة الدمغة في المملكة المتحدة؟",
    a:
      "ضريبة الدمغة (Stamp Duty Land Tax — SDLT) هي ضريبة تُدفع عند شراء العقارات في إنجلترا وويلز. في عام 2026، تُحسب على النحو التالي: لا توجد ضريبة على أول 125,000 جنيه إسترليني، ثم 2% على الجزء من 125,001 إلى 250,000 جنيه، و5% على الجزء من 250,001 إلى 925,000 جنيه، و10% على الجزء من 925,001 إلى 1.5 مليون جنيه، و12% على ما يتجاوز ذلك. أما المشترون لأول مرة فيحصلون على إعفاء كامل حتى 300,000 جنيه. وتُضاف نسبة 5% إضافية على أي عقار ثانٍ أو عقار للاستثمار.",
  },
  {
    q:"ما الفرق بين Freehold و Leasehold؟",
    a:
      "Freehold يعني أنك تمتلك العقار والأرض التي بُني عليها ملكيةً كاملةً ودائمة، وهو الخيار المفضل والأكثر شيوعاً للمنازل المستقلة والمزدوجة. أما Leasehold فيعني أنك تمتلك العقار لفترة محددة (قد تكون 99 أو 125 أو 999 سنة) دون الأرض، وهو شائع في الشقق السكنية. في حالة Leasehold، قد تضطر لدفع رسوم خدمية سنوية (Service Charge) وإيجار أرض (Ground Rent)، كما أن العقار يصعب بيعه إذا كانت مدة العقد أقل من 70 سنة.",
  },
  {
    q:"كم يستغرق شراء عقار في بريطانيا؟",
    a:
      "تستغرق عملية شراء العقار في المملكة المتحدة عادةً بين 8 و16 أسبوعاً من قبول العرض حتى استلام المفاتيح، وإن كانت الحالات المعقدة قد تمتد إلى 6 أشهر. المرحلة الأطول هي مرحلة التدقيق القانوني (Conveyancing) التي يجريها المحامي، وتشمل الفحوصات والاستفسارات والاطلاع على سجلات الأرض. لهذا السبب، يُنصح دائماً بتعيين محامٍ متخصص في عقارات المملكة المتحدة فور قبول عرضك.",
  },
  {
    q:"هل أحتاج إلى محامٍ لشراء عقار في المملكة المتحدة؟",
    a:
      "نعم، يُعدّ تعيين محامٍ أو متخصص قانوني (Conveyancer) أمراً ضرورياً وإلزامياً فعلياً في أي عملية شراء عقار بالمملكة المتحدة. يتولى المحامي إجراء التدقيق القانوني الكامل، وفحص سجل ملكية الأرض، والتحقق من خلو العقار من الديون والنزاعات، وصياغة العقود وتبادلها، وتسوية ضريبة الدمغة مع هيئة الإيرادات. تتراوح رسوم المحامي عادةً بين 1,000 و2,500 جنيه إسترليني بحسب قيمة العقار وتعقيد الصفقة.",
  },
];

export default function DalilShiraAqarUK() {
  return (
    <>
      <ArticleSchema
        headline="دليل شراء العقارات في المملكة المتحدة"
        description="كل ما تحتاج معرفته قبل شراء عقار في بريطانيا — من الرهن العقاري والضرائب إلى المحامي والتفاوض على السعر. دليل شامل للمشترين العرب."
        slug="dalil-shira-aqar-uk"
        datePublished="2026-08-02"
        section="Arabic"
        inLanguage="ar"
      />
      <BlogArticleHero
        title="دليل شراء العقارات في المملكة المتحدة"
        excerpt="كل ما تحتاج معرفته قبل شراء عقار في بريطانيا — من الرهن العقاري والضرائب إلى المحامي والتفاوض على السعر."
        category="Buying"
        date="2 August 2026"
        readTime="12 min"
        image="https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1400&q=80"
      />

      <article className="section-padding bg-white">
        <div className="container-max max-w-3xl">
          <div
            dir="rtl"
            lang="ar"
            className="space-y-6 text-navy-600 leading-relaxed"
          >
            {/* 1. Introduction */}
            <h2
              className="text-xl font-bold text-navy-800 mt-8"
              style={{ fontFamily: "var(--font-family-heading)" }}
            >
              لماذا يشتري كثير من العرب عقارات في بريطانيا؟
            </h2>
            <p>
              تحتل المملكة المتحدة مكانةً مميزة في قائمة الوجهات العقارية
              للمستثمرين والمقيمين العرب على حدٍّ سواء. يجذب سوق العقارات
              البريطاني الثباتُ القانوني وصون حقوق الملكية، إضافةً إلى قوة
              الجنيه الإسترليني بوصفه عملةً احتياطية راسخة. ارتفع عدد
              المواطنين العرب المقيمين في لندن وسائر المدن البريطانية الكبرى
              ارتفاعاً ملحوظاً خلال العقدين الماضيين، ويسعى كثيرٌ منهم إلى
              الانتقال من الإيجار إلى التملك لأسباب تتراوح بين الاستقرار
              الأسري وبناء الثروة على المدى البعيد. بيد أن منظومة الشراء في
              بريطانيا تختلف جوهرياً عن نظيراتها في دول الخليج وشمال أفريقيا،
              مما يجعل هذا الدليل ضرورةً عملية لكل مشترٍ عربي يخطو خطواته
              الأولى في هذا السوق.
            </p>

            {/* 2. Freehold vs Leasehold */}
            <h2
              className="text-xl font-bold text-navy-800 mt-8"
              style={{ fontFamily: "var(--font-family-heading)" }}
            >
              أنواع العقارات: Freehold مقابل Leasehold
            </h2>
            <p>
              أول ما يحتاج المشتري العربي فهمه هو الفرق الجوهري بين نمطَي
              الملكية السائدَين في بريطانيا:
            </p>
            <ul className="list-disc pr-6 space-y-2">
              <li>
                <strong>Freehold (الملكية التامة):</strong> تمتلك العقار
                والأرض التي يقوم عليها ملكيةً أبديةً كاملة. هذا النوع هو
                السائد في المنازل المستقلة (Detached) والمنازل المزدوجة
                (Semi-detached) والمنازل المتراصة (Terraced). لا توجد رسوم
                خدمية دورية ولا قيود إيجارية على الأرض، وهو الخيار الأنسب
                لمن يبحث عن ملكية خالية من التعقيدات.
              </li>
              <li>
                <strong>Leasehold (حق الانتفاع المحدود):</strong> تمتلك
                العقار فقط لمدة محددة — قد تكون 99 أو 125 أو 999 سنة — في
                حين تظل الأرض ملكاً لطرف ثالث يُسمى Freeholder. هذا النوع
                شائع جداً في الشقق السكنية. يترتب عليه دفع Ground Rent سنوي
                و Service Charge لتغطية تكاليف صيانة المبنى المشترك. تجنّب
                أي عقار بمدة متبقية أقل من 85 سنة، إذ يصعب تمويله بالرهن
                العقاري ويهبط سعره في السوق بشكل ملحوظ.
              </li>
            </ul>

            {/* 3. Mortgage */}
            <h2
              className="text-xl font-bold text-navy-800 mt-8"
              style={{ fontFamily: "var(--font-family-heading)" }}
            >
              الرهن العقاري (Mortgage) في بريطانيا
            </h2>
            <p>
              يعتمد غالبية المشترين في المملكة المتحدة على الرهن العقاري
              لتمويل شرائهم. تشترط معظم البنوك البريطانية دفع دفعة أولى
              (Deposit) لا تقل عن 5-10% من قيمة العقار للمقيمين، و25% أو
              أكثر لغير المقيمين. كلما كانت نسبة الإيداع أعلى، حصلت على
              فائدة أفضل وشروط أكثر مرونة. تمنح معظم البنوك رهناً يعادل حتى
              4.5 ضعف دخلك السنوي كحد أقصى.
            </p>
            <p>
              قبل بدء البحث الجدي، احرص على الحصول على موافقة مبدئية
              (Agreement in Principle) من أحد البنوك أو عبر وسيط رهن عقاري
              (Mortgage Broker) مرخص. تعتمد البنوك في قرارها على: تاريخك
              الائتماني في المملكة المتحدة، دخلك ومصدره، ونسبة الرهن إلى
              قيمة العقار (Loan-to-Value Ratio).
            </p>
            <p>
              للمسلمين الراغبين في تجنب الفوائد، تتوفر منتجات تمويل إسلامي
              متوافقة مع الشريعة (Home Purchase Plans) من بنوك مثل Al Rayan
              Bank، وتعمل بصيغة المرابحة أو الإجارة المنتهية بالتمليك — وهي
              خيار متنامٍ ومقبول من هيئة الخدمات المالية البريطانية (FCA).
            </p>

            {/* 4. Stamp Duty */}
            <h2
              className="text-xl font-bold text-navy-800 mt-8"
              style={{ fontFamily: "var(--font-family-heading)" }}
            >
              ضريبة الدمغة (Stamp Duty Land Tax) — أسعار 2026
            </h2>
            <p>
              ضريبة الدمغة هي الضريبة الرئيسية التي تُدفع عند شراء أي عقار
              في إنجلترا وويلز. فيما يلي جدول الأسعار المعمول به في 2026:
            </p>

            <div className="overflow-x-auto my-4">
              <table className="w-full text-sm border-collapse border border-navy-200 text-right">
                <thead>
                  <tr className="bg-navy-100">
                    <th className="border border-navy-200 px-4 py-2">
                      شريحة القيمة
                    </th>
                    <th className="border border-navy-200 px-4 py-2">
                      المشتري العادي
                    </th>
                    <th className="border border-navy-200 px-4 py-2">
                      عقار ثانٍ / استثمار
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-navy-200 px-4 py-2">
                      حتى £125,000
                    </td>
                    <td className="border border-navy-200 px-4 py-2">0%</td>
                    <td className="border border-navy-200 px-4 py-2">5%</td>
                  </tr>
                  <tr className="bg-navy-50">
                    <td className="border border-navy-200 px-4 py-2">
                      £125,001 – £250,000
                    </td>
                    <td className="border border-navy-200 px-4 py-2">2%</td>
                    <td className="border border-navy-200 px-4 py-2">7%</td>
                  </tr>
                  <tr>
                    <td className="border border-navy-200 px-4 py-2">
                      £250,001 – £925,000
                    </td>
                    <td className="border border-navy-200 px-4 py-2">5%</td>
                    <td className="border border-navy-200 px-4 py-2">10%</td>
                  </tr>
                  <tr className="bg-navy-50">
                    <td className="border border-navy-200 px-4 py-2">
                      £925,001 – £1,500,000
                    </td>
                    <td className="border border-navy-200 px-4 py-2">10%</td>
                    <td className="border border-navy-200 px-4 py-2">15%</td>
                  </tr>
                  <tr>
                    <td className="border border-navy-200 px-4 py-2">
                      أكثر من £1,500,000
                    </td>
                    <td className="border border-navy-200 px-4 py-2">12%</td>
                    <td className="border border-navy-200 px-4 py-2">17%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>
              يحصل المشتري لأول مرة (First-Time Buyer) على إعفاء كامل من
              ضريبة الدمغة حتى £300,000، ونسبة 5% فقط على الجزء بين £300,001
              و£500,000. ويُضاف رسم إضافي بنسبة 2% للمشترين غير المقيمين في
              المملكة المتحدة فوق النسب المذكورة أعلاه.
            </p>
            <p>
              احسب ضريبة الدمغة الخاصة بك باستخدام{" "}
              <Link
                href="/calculators/stamp-duty"
                className="text-gold-600 underline hover:text-gold-700"
              >
                حاسبة ضريبة الدمغة المجانية من PropertyVault
              </Link>{" "}
              — تعطيك المبلغ الدقيق بناءً على وضعك كمشترٍ أول أو مستثمر أو
              مقيم خارجي.
            </p>

            {/* 5. Solicitor */}
            <h2
              className="text-xl font-bold text-navy-800 mt-8"
              style={{ fontFamily: "var(--font-family-heading)" }}
            >
              دور المحامي (Solicitor) في عملية الشراء
            </h2>
            <p>
              المحامي أو المتخصص القانوني (Conveyancer) هو الركيزة الأساسية
              في أي صفقة عقارية بريطانية، وتعيينه ليس اختيارياً عملياً بل
              ضرورة لا غنى عنها. مهامه الجوهرية تشمل:
            </p>
            <ul className="list-disc pr-6 space-y-2">
              <li>
                إجراء فحوصات قانونية شاملة (Searches) للكشف عن أي تصاريح
                بناء معلقة، أو أعمال طرق مخططة، أو مخاطر فيضانات أو تلوث
                في محيط العقار.
              </li>
              <li>
                مراجعة سجل ملكية الأرض (Land Registry) والتحقق من أحقية
                البائع في البيع وخلو العقار من الرهون والديون.
              </li>
              <li>
                تبادل العقود (Exchange of Contracts) مع محامي البائع، وهي
                المرحلة التي يصبح فيها الشراء ملزماً قانونياً لكلا الطرفين.
              </li>
              <li>
                إتمام عملية الإغلاق (Completion) وتحويل المبالغ وتسجيل
                الملكية الجديدة في سجل الأراضي البريطاني.
              </li>
              <li>
                تسوية ضريبة الدمغة مع هيئة الإيرادات والجمارك (HMRC)
                نيابةً عنك خلال 14 يوماً من الإتمام.
              </li>
            </ul>
            <p>
              تتراوح رسوم المحامي عادةً بين £1,000 و£2,500 شاملاً ضريبة
              القيمة المضافة (VAT). احرص على طلب عروض أسعار مكتوبة من ثلاثة
              محامين على الأقل، والتحقق من اعتمادهم لدى Law Society أو
              Council for Licensed Conveyancers (CLC).
            </p>

            {/* 6. Buying Stages */}
            <h2
              className="text-xl font-bold text-navy-800 mt-8"
              style={{ fontFamily: "var(--font-family-heading)" }}
            >
              مراحل شراء العقار: من العرض إلى استلام المفاتيح
            </h2>
            <ul className="list-disc pr-6 space-y-2">
              <li>
                <strong>الحصول على الموافقة المبدئية للرهن:</strong> قبل أي
                خطوة، احصل على Agreement in Principle من البنك لتعرف
                ميزانيتك الفعلية ويُطمئن البائع أنك مشترٍ جاد.
              </li>
              <li>
                <strong>البحث واختيار العقار:</strong> تفقّد العقار بنفسك
                أكثر من مرة، وفي أوقات مختلفة من اليوم، واسأل عن الجيران
                ومستوى الخدمات في المنطقة.
              </li>
              <li>
                <strong>تقديم العرض (Making an Offer):</strong> العروض في
                بريطانيا غير ملزمة قانونياً حتى تبادل العقود. قدّم عرضاً
                أقل من السعر المطلوب وانتظر الرد. الفجوة الشائعة بين
                السعر المطلوب والمبلغ المقبول تتراوح بين 2% و5%.
              </li>
              <li>
                <strong>تعيين المحامي وطلب المسح (Survey):</strong> بعد
                قبول عرضك، عيّن محامياً على الفور واطلب من البنك إجراء
                تقييم رسمي للعقار. فكّر في طلب مسح شامل (Full Structural
                Survey) للمنازل القديمة خاصةً.
              </li>
              <li>
                <strong>التدقيق القانوني (Conveyancing):</strong> يستغرق
                عادةً بين 6 و12 أسبوعاً. يجري المحامي الفحوصات ويراجع
                العقود ويتراسل مع محامي البائع.
              </li>
              <li>
                <strong>تبادل العقود (Exchange of Contracts):</strong> في
                هذه المرحلة تدفع الوديعة (عادةً 10% من الثمن) ويصبح
                العقد ملزماً لكلا الطرفين. الانسحاب بعد هذه النقطة يعني
                خسارة الوديعة كاملة.
              </li>
              <li>
                <strong>الإتمام (Completion):</strong> يحوّل المحامي المبلغ
                الكامل إلى محامي البائع، ويتسلم المشتري المفاتيح — عادةً
                بعد أسبوعين من تبادل العقود.
              </li>
            </ul>

            {/* 7. Additional Costs */}
            <h2
              className="text-xl font-bold text-navy-800 mt-8"
              style={{ fontFamily: "var(--font-family-heading)" }}
            >
              جدول التكاليف الإضافية التي يجب احتسابها
            </h2>

            <div className="overflow-x-auto my-4">
              <table className="w-full text-sm border-collapse border border-navy-200 text-right">
                <thead>
                  <tr className="bg-navy-100">
                    <th className="border border-navy-200 px-4 py-2">البند</th>
                    <th className="border border-navy-200 px-4 py-2">
                      التكلفة التقريبية
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-navy-200 px-4 py-2">
                      رسوم المحامي (Conveyancing Fees)
                    </td>
                    <td className="border border-navy-200 px-4 py-2">
                      £1,000 – £2,500
                    </td>
                  </tr>
                  <tr className="bg-navy-50">
                    <td className="border border-navy-200 px-4 py-2">
                      فحص وتقييم العقار (Survey)
                    </td>
                    <td className="border border-navy-200 px-4 py-2">
                      £400 – £1,500
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-navy-200 px-4 py-2">
                      رسوم تسجيل الأرض (Land Registry)
                    </td>
                    <td className="border border-navy-200 px-4 py-2">
                      £20 – £455
                    </td>
                  </tr>
                  <tr className="bg-navy-50">
                    <td className="border border-navy-200 px-4 py-2">
                      رسوم تنظيم الرهن العقاري (Arrangement Fee)
                    </td>
                    <td className="border border-navy-200 px-4 py-2">
                      £0 – £2,000
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-navy-200 px-4 py-2">
                      تأمين المبنى (Buildings Insurance)
                    </td>
                    <td className="border border-navy-200 px-4 py-2">
                      £150 – £500 سنوياً
                    </td>
                  </tr>
                  <tr className="bg-navy-50">
                    <td className="border border-navy-200 px-4 py-2">
                      رسوم الانتقال والنقل
                    </td>
                    <td className="border border-navy-200 px-4 py-2">
                      £300 – £1,500
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>
              بشكل عام، خطط لتغطية ما بين 3% و5% من قيمة العقار كتكاليف
              إضافية فوق الدفعة الأولى وضريبة الدمغة.
            </p>

            {/* 8. Common Mistakes */}
            <h2
              className="text-xl font-bold text-navy-800 mt-8"
              style={{ fontFamily: "var(--font-family-heading)" }}
            >
              الأخطاء الشائعة التي يجب تجنبها
            </h2>
            <ul className="list-disc pr-6 space-y-2">
              <li>
                <strong>البحث عن العقار قبل ترتيب التمويل:</strong> تقديم
                العرض دون Agreement in Principle قد يُضيّع الصفقة لصالح
                مشترٍ آخر جاهز.
              </li>
              <li>
                <strong>الاكتفاء بتقييم البنك دون Survey مستقل:</strong>{" "}
                تقييم البنك يحمي مصلحة البنك فقط، أما المسح الشامل
                (Homebuyer Report) فيكشف عيوب البناء والرطوبة والمشكلات
                الهيكلية التي قد تكلفك آلاف الجنيهات بعد الشراء.
              </li>
              <li>
                <strong>إغفال مدة عقد Leasehold:</strong> اشتراط مدة لا
                تقل عن 85-90 سنة متبقية عند الشراء يحمي قيمة استثمارك
                ويسهّل إعادة البيع مستقبلاً.
              </li>
              <li>
                <strong>التوقيع على أي وثيقة دون استشارة المحامي:</strong>{" "}
                حتى المعاملات التي تبدو بسيطة قد تخفي بنوداً تضر بمصالحك.
              </li>
              <li>
                <strong>تجاهل فحص رسوم الخدمة في عقارات Leasehold:</strong>{" "}
                بعض الشقق في لندن لها رسوم خدمية تتجاوز £5,000 سنوياً —
                اطلب كشف الرسوم للسنوات الثلاث الماضية قبل الشراء.
              </li>
            </ul>

            {/* 9. Tips for Arab Buyers */}
            <h2
              className="text-xl font-bold text-navy-800 mt-8"
              style={{ fontFamily: "var(--font-family-heading)" }}
            >
              نصائح خاصة للمشترين العرب
            </h2>
            <ul className="list-disc pr-6 space-y-2">
              <li>
                <strong>ابنِ تاريخاً ائتمانياً بريطانياً مبكراً:</strong>{" "}
                إذا كنت حديث الوصول، افتح حساباً مصرفياً بريطانياً واحصل
                على بطاقة ائتمان صغيرة وسدّدها شهرياً — هذا يُحسّن شروط
                الرهن العقاري بشكل ملموس خلال 6 إلى 12 شهراً.
              </li>
              <li>
                <strong>كن جاهزاً لوثائق مصدر الأموال:</strong> إذا كانت
                ثروتك مصدرها دول خليجية أو أفريقية، سيطلب منك المحامي
                والبنك تقديم وثائق Source of Funds تُثبت منشأ المبالغ —
                هذا متطلب قانوني معتاد لمكافحة غسيل الأموال وليس خاصاً
                بجنسيتك.
              </li>
              <li>
                <strong>استشر وسيطاً متخصصاً في المشترين الأجانب:</strong>{" "}
                يعرف هؤلاء الوسطاء البنوك الأكثر مرونة مع غير المقيمين
                والمستثمرين الدوليين، وقد يوفرون عليك آلاف الجنيهات في
                رسوم الرهن.
              </li>
              <li>
                <strong>قارن بين المناطق من حيث العائد الإيجاري:</strong>{" "}
                مدن كمانشستر وليدز وشيفيلد وبرمنغهام تقدم عوائد إيجارية
                تتراوح بين 5% و8% سنوياً مقارنةً بـ 3-4% في لندن، مع
                أسعار دخول أقل بكثير.
              </li>
              <li>
                <strong>لا تهمل تأمين الحياة مع الرهن:</strong> معظم البنوك
                توصي بتأمين يُغطي سداد الرهن في حالة الوفاة أو العجز —
                وهو منتج إسلامي متاح أيضاً (Takaful).
              </li>
            </ul>

            {/* FAQ Section */}
            <h2
              className="text-xl font-bold text-navy-800 mt-8"
              style={{ fontFamily: "var(--font-family-heading)" }}
            >
              أسئلة شائعة
            </h2>

            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="border-r-4 border-gold-500 pr-4">
                  <h3 className="text-lg font-bold text-navy-800 mt-6">
                    {faq.q}
                  </h3>
                  <p className="mt-2">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </article>

      <FAQSchema faqs={faqs} />
      <Disclaimer />
      <RelatedArticles
        slug="dalil-shira-aqar-uk"
        heading="اقرأ أيضًا"
        dir="rtl"
      />
    </>
  );
}
