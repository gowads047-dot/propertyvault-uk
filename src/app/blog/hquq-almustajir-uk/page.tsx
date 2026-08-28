import { BlogArticleHero } from "@/components/blog/BlogArticleHero";
import Link from "next/link";
import type { Metadata } from "next";
import { Disclaimer } from "@/components/legal/Disclaimer";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { ArticleSchema } from "@/components/seo/ArticleSchema";
import { RelatedArticles } from "@/components/blog/RelatedArticles";
import { HelpCTA } from "@/components/blog/HelpCTA";

export const metadata: Metadata = {
  title: "UK Tenant Rights 2025 — Arabic Guide | PropertyVault UK",
  description:
    "حقوق المستأجر الكاملة في المملكة المتحدة 2025 — إلغاء Section 21، قيود رفع الإيجار، الوديعة، وقانون حقوق المستأجرين الجديد.",
  keywords:
    "حقوق المستأجر في بريطانيا, tenant rights UK Arabic, UK renters rights act 2025 Arabic, حقوق المستأجر 2025",
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/blog/hquq-almustajir-uk/" },
  openGraph: {
    title: "UK Tenant Rights 2025 — Arabic Guide | PropertyVault UK",
    description: "حقوق المستأجر الكاملة في المملكة المتحدة 2025 — إلغاء Section 21، قيود رفع الإيجار، الوديعة، وقانون حقوق المستأجرين الجديد.",
    type: "article",
    url: "https://www.propertyvaultuk.co.uk/blog/hquq-almustajir-uk/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "UK Tenant Rights 2025 — Arabic Guide" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "UK Tenant Rights 2025 — Arabic Guide | PropertyVault UK",
    description: "حقوق المستأجر الكاملة في المملكة المتحدة 2025 — إلغاء Section 21، قيود رفع الإيجار، الوديعة، وقانون حقوق المستأجرين الجديد.",
  },
};

const faqs = [
  {
    q:"هل ألغيت إشعارات Section 21؟",
    a:
      "نعم، ألغى قانون حقوق المستأجرين (Renters Rights Act) إشعارات Section 21 رسمياً في 2025. لم يعد بإمكان الملاك إخلاء المستأجرين دون سبب قانوني. أي إخلاء الآن يتطلب من المالك تقديم أحد الأسباب المحددة في المادة 8 — كعدم سداد الإيجار أو رغبة المالك في السكن بالعقار — وإثباته أمام المحكمة.",
  },
  {
    q:"كم مرة يمكن للمالك رفع الإيجار؟",
    a:
      "بموجب القانون الجديد، لا يحق للمالك رفع الإيجار أكثر من مرة واحدة كل 12 شهراً، وذلك بإرسال إشعار Section 13 الرسمي قبل شهرين على الأقل. إذا كانت الزيادة المقترحة مفرطة، يمكنك الطعن فيها أمام محكمة First-tier Tribunal خلال فترة الإشعار — وإذا أحالت المحكمة القضية للنظر فيها، يظل إيجارك القديم سارياً حتى صدور الحكم.",
  },
  {
    q:"ما هو الحد الأقصى للوديعة؟",
    a:
      "يحق للمالك أخذ وديعة لا تتجاوز 5 أسابيع من الإيجار (أو 6 أسابيع إذا كان الإيجار السنوي يتجاوز £50,000). يجب إيداع الوديعة خلال 30 يوماً في أحد مخططات الحماية المعتمدة: DPS أو MyDeposits أو TDS. في حالة المخالفة، يحق لك المطالبة بتعويض بين 1 و3 أضعاف قيمة الوديعة.",
  },
  {
    q:"ماذا أفعل إذا كانت حالة العقار سيئة؟",
    a:
      "أرسل للمالك إشعاراً كتابياً يصف المشكلة ويطلب الإصلاح خلال 14 يوماً. إذا لم يستجب، تواصل مع مجلس المدينة المحلي (Local Council) الذي يملك صلاحية تفتيش العقار وإلزام المالك بالإصلاح. يمكنك أيضاً تقديم شكوى إلى PRS Ombudsman الذي يمكنه إصدار تعويض لصالحك. قانون Decent Homes Standard الجديد يُلزم جميع عقارات التأجير الخاص بتلبية معايير الجودة الحديثة.",
  },
  {
    q:"كيف أسترد وديعتي في نهاية العقد؟",
    a:
      "يجب على المالك إعادة وديعتك (أو الجزء غير المتنازع عليه) خلال 10 أيام من انتهاء العقد. إذا أراد الاستقطاع، يجب تقديم فواتير وأدلة. في حالة النزاع، تواصل مع مخطط الحماية الذي أُودعت فيه الوديعة — يوفر خدمة تحكيم مجانية ملزمة. وثّق حالة العقار بالصور المؤرخة عند الدخول والخروج.",
  },
];

export default function HquqAlmustajirUK() {
  return (
    <>
      <ArticleSchema
        headline="حقوق المستأجر في المملكة المتحدة 2025"
        description="كل ما يحتاج معرفته المستأجر العربي — إلغاء Section 21، قواعد رفع الإيجار، الوديعة، ومتى وكيف تشتكي."
        slug="hquq-almustajir-uk"
        datePublished="2026-08-02"
        section="Arabic"
        inLanguage="ar"
      />
      <BlogArticleHero
        title="حقوق المستأجر في المملكة المتحدة 2025"
        excerpt="كل ما يحتاج معرفته المستأجر العربي في بريطانيا — من إلغاء Section 21 إلى قواعد الإيجار والوديعة والإخلاء في ظل القانون الجديد."
        category="Renting"
        date="2 August 2026"
        readTime="10 min"
        image="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1400&q=80"
      />

      <article className="section-padding bg-white">
        <div className="container-max max-w-3xl">
          <div
            dir="rtl"
            lang="ar"
            className="space-y-6 text-navy-600 leading-relaxed"
          >
            <h2
              className="text-xl font-bold text-navy-800 mt-8"
              style={{ fontFamily: "var(--font-family-heading)" }}
            >
              ماذا تغيّر في 2025؟
            </h2>
            <p>
              أحدث قانون حقوق المستأجرين (Renters Rights Act) تحولاً جذرياً في
              سوق الإيجار البريطاني. لأول مرة منذ ثلاثة عقود، بات المستأجرون
              يتمتعون بحماية قانونية فعلية تُقيّد قدرة الملاك على الإخلاء
              التعسفي ورفع الإيجارات بشكل عشوائي. إذا كنت مستأجراً في المملكة
              المتحدة — سواء في شقة بلندن أو منزل في برمنغهام أو غرفة في
              مانشستر — فهذه التغييرات تخصك مباشرةً. تعرّف على التفاصيل
              الكاملة في{" "}
              <Link
                href="/renters-rights-act"
                className="text-gold-600 underline hover:text-gold-700"
              >
                دليلنا الشامل لقانون حقوق المستأجرين
              </Link>
              .
            </p>

            <h2
              className="text-xl font-bold text-navy-800 mt-8"
              style={{ fontFamily: "var(--font-family-heading)" }}
            >
              إلغاء Section 21 — نهاية الإخلاء بلا سبب
            </h2>
            <p>
              الخبر الأهم: إشعارات Section 21 — التي كانت تُعرف بـ "No-Fault
              Evictions" — ألغيت رسمياً. قبل هذا القانون، كان بإمكان الملاك
              إنهاء عقد الإيجار بمجرد إشعار بسيط دون أي تبرير. أما الآن، فلكي
              يُخلي المالك المستأجر، يجب عليه إثبات أحد الأسباب المنصوص عليها
              في المادة 8 (Section 8)، وأبرزها:
            </p>
            <ul className="list-disc pr-6 space-y-2">
              <li>تأخر المستأجر عن سداد الإيجار بأكثر من شهرين</li>
              <li>
                رغبة المالك في السكن بالعقار أو منحه لأحد أفراد عائلته
                المباشرين
              </li>
              <li>نية بيع العقار (مع قيود ومدة حظر بعد البيع)</li>
              <li>الإخلال الجسيم بشروط العقد من قِبل المستأجر</li>
            </ul>
            <p>
              يجب إثبات كل هذه الأسباب أمام المحكمة، وللمستأجر الحق في
              الاعتراض.
            </p>

            <h2
              className="text-xl font-bold text-navy-800 mt-8"
              style={{ fontFamily: "var(--font-family-heading)" }}
            >
              عقود الإيجار الجديدة — الدورية بديلاً للثابتة
            </h2>
            <p>
              ألغى القانون عقود الإيجار ذات المدة الثابتة (Fixed-Term
              Tenancies) تدريجياً لصالح عقود دورية شهرية (Periodic Tenancies)
              تُجدَّد تلقائياً. ما يعنيه هذا عملياً:
            </p>
            <ul className="list-disc pr-6 space-y-2">
              <li>
                لا توجد عقوبة على مغادرة المستأجر بعد اكتمال 4 أشهر من بداية
                العقد
              </li>
              <li>
                تحتاج فقط إلى إشعار مدته شهران لإنهاء العقد والخروج
              </li>
              <li>
                لا يمكن للمالك اشتراط مدة أطول من 12 شهراً كحد أدنى للإقامة
              </li>
              <li>
                بعد السنة الأولى تكون لديك حرية الخروج في أي وقت بإشعار شهرين
              </li>
            </ul>

            <h2
              className="text-xl font-bold text-navy-800 mt-8"
              style={{ fontFamily: "var(--font-family-heading)" }}
            >
              رفع الإيجار — مرة واحدة في السنة فقط
            </h2>
            <p>
              بموجب القانون الجديد، لا يحق للمالك رفع الإيجار إلا مرة واحدة
              كل 12 شهراً كحد أقصى. يُرسل الإشعار الرسمي (Section 13 Notice)
              قبل شهرين على الأقل. عملياً هذا يعني:
            </p>
            <ul className="list-disc pr-6 space-y-2">
              <li>
                تحقق من آخر تاريخ رُفع فيه إيجارك — لا يحق للمالك رفعه قبل
                مرور 12 شهراً
              </li>
              <li>إذا وصلك إشعار Section 13، لديك شهران للقبول أو الطعن</li>
              <li>
                يمكنك تقديم اعتراض إلى محكمة First-tier Tribunal قبل انتهاء
                فترة الإشعار
              </li>
              <li>
                إذا أحالت المحكمة القضية، يظل إيجارك الحالي سارياً حتى صدور
                الحكم
              </li>
            </ul>

            <h2
              className="text-xl font-bold text-navy-800 mt-8"
              style={{ fontFamily: "var(--font-family-heading)" }}
            >
              الحيوانات الأليفة — حق قانوني الآن
            </h2>
            <p>
              لم يعد بإمكان الملاك رفض طلبات الحيوانات الأليفة بشكل عشوائي.
              إذا طلبت إدخال حيوان أليف:
            </p>
            <ul className="list-disc pr-6 space-y-2">
              <li>يجب على المالك الرد خلال 42 يوماً من استلام طلبك</li>
              <li>أي رفض يجب أن يستند إلى أسباب معقولة ومبررة</li>
              <li>يحق للمالك اشتراط تأمين إضافي لتغطية الأضرار المحتملة</li>
              <li>الرفض غير المبرر يمكن الطعن فيه أمام محكمة العقارات</li>
            </ul>

            <h2
              className="text-xl font-bold text-navy-800 mt-8"
              style={{ fontFamily: "var(--font-family-heading)" }}
            >
              معايير Decent Homes — حقك في مسكن لائق
            </h2>
            <p>
              مُدّدت معايير Decent Homes Standard لتشمل جميع عقارات الإيجار
              الخاص. يجب أن يستوفي أي عقار مؤجر:
            </p>
            <ul className="list-disc pr-6 space-y-2">
              <li>
                خلوه من الأخطار الصحية الخطيرة (HHSRS Category 1 hazards)
              </li>
              <li>
                كونه في حالة إصلاح جيدة — سقف سليم، جدران بدون رطوبة، نوافذ
                ومداخل آمنة
              </li>
              <li>توفر نظام تدفئة فعّال ومناسب</li>
              <li>مطابقته للمعايير الحديثة لمرافق المطبخ والحمام</li>
            </ul>
            <p>
              إذا لاحظت خللاً في أي من هذه النقاط، أرسل للمالك إشعاراً
              كتابياً مع وصف المشكلة وطلب الإصلاح خلال 14 يوماً. الإشعار
              الكتابي ضروري لتوثيق تاريخ إبلاغ المالك.
            </p>

            <h2
              className="text-xl font-bold text-navy-800 mt-8"
              style={{ fontFamily: "var(--font-family-heading)" }}
            >
              الوديعة — حمايتك المالية الأولى
            </h2>
            <p>القواعد التي تحمي وديعتك:</p>
            <ul className="list-disc pr-6 space-y-2">
              <li>
                <strong>الحد الأقصى:</strong> 5 أسابيع إيجار (6 أسابيع إذا
                تجاوز الإيجار السنوي £50,000)
              </li>
              <li>
                <strong>التوقيت:</strong> يجب إيداعها في مخطط حماية معتمد خلال
                30 يوماً من استلامها
              </li>
              <li>
                <strong>المخططات المعتمدة:</strong> DPS، MyDeposits، TDS
              </li>
              <li>
                <strong>الإخطار:</strong> يجب إرسال وثيقة حماية الوديعة
                (Prescribed Information) إليك خلال 30 يوماً
              </li>
              <li>
                <strong>عقوبة المخالفة:</strong> تعويض بين 1 و3 أضعاف قيمة
                الوديعة
              </li>
              <li>
                <strong>الاسترداد:</strong> الإعادة الكاملة أو المتنازع عليها
                خلال 10 أيام من نهاية العقد
              </li>
            </ul>

            <h2
              className="text-xl font-bold text-navy-800 mt-8"
              style={{ fontFamily: "var(--font-family-heading)" }}
            >
              إجراءات الإخلاء — حقوقك حين تواجه التهديد
            </h2>
            <p>إذا استلمت إشعار إخلاء، تحقق أولاً من صحته:</p>
            <ul className="list-disc pr-6 space-y-2">
              <li>
                لا يحق للمالك إخلاؤك في أول 12 شهراً من العقد إلا لأسباب
                محددة جداً (عدم السداد أساساً)
              </li>
              <li>
                أي إشعار إخلاء يجب أن يُحدد السبب القانوني الصريح من قائمة
                Section 8
              </li>
              <li>للمستأجر حق الرد والاعتراض على الإشعار أمام المحكمة</li>
              <li>
                يُعدّ باطلاً أي إشعار انتقامي صادر بسبب شكوى قدّمتها ضد
                المالك
              </li>
            </ul>

            <h2
              className="text-xl font-bold text-navy-800 mt-8"
              style={{ fontFamily: "var(--font-family-heading)" }}
            >
              الشكاوى — لمن تتوجه؟
            </h2>
            <p>في حالة أي نزاع مع المالك، اتبع هذا التسلسل:</p>
            <ul className="list-disc pr-6 space-y-2">
              <li>
                <strong>أولاً:</strong> راسل المالك كتابياً واحتفظ بنسخة من
                المراسلة
              </li>
              <li>
                <strong>ثانياً:</strong> تقدم بشكوى إلى PRS Ombudsman (مُفوّض
                قطاع الإيجار الخاص)
              </li>
              <li>
                <strong>ثالثاً:</strong> تواصل مع المجلس المحلي لمشاكل
                الصيانة والسلامة
              </li>
              <li>
                <strong>رابعاً:</strong> في النزاعات المالية الصغيرة، لجأ إلى
                محكمة Small Claims (حتى £10,000 بتكاليف منخفضة)
              </li>
            </ul>

            <h2
              className="text-xl font-bold text-navy-800 mt-8"
              style={{ fontFamily: "var(--font-family-heading)" }}
            >
              نصائح عملية للمستأجرين العرب
            </h2>
            <ul className="list-disc pr-6 space-y-2">
              <li>
                <strong>وثّق كل شيء بالصور:</strong> التقِط صوراً مؤرخة عند
                الدخول والخروج وقارنها باستمارة جرد المحتويات (Inventory
                Report)
              </li>
              <li>
                <strong>تحقق من وديعتك:</strong> اطلب شهادة حماية الوديعة
                وتحقق من وجودها في أحد المخططات المعتمدة
              </li>
              <li>
                <strong>اقرأ العقد بعناية:</strong> تأكد من فهم بنود الصيانة
                وما هو مسؤوليتك وما هو مسؤولية المالك
              </li>
              <li>
                <strong>قارن الإيجار بالسوق:</strong> استخدم Rightmove وZoopla
                قبل قبول أي رفع في الإيجار
              </li>
              <li>
                <strong>ادفع بتحويل بنكي:</strong> يُنشئ التحويل البنكي سجلاً
                محاسبياً موثوقاً لا يمكن إنكاره
              </li>
              <li>
                <strong>استشر مجاناً:</strong> Shelter وCitizens Advice يقدمان
                استشارات مجانية للمستأجرين في جميع أنحاء المملكة المتحدة
              </li>
            </ul>

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
        <HelpCTA dir="rtl" />
      </article>

      <FAQSchema faqs={faqs} />
      <Disclaimer />
      <RelatedArticles
        slug="hquq-almustajir-uk"
        heading="اقرأ أيضًا"
        dir="rtl"
      />
    </>
  );
}
