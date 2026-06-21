import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use — PropertyVault UK",
  description: "PropertyVault UK terms of use. Rules governing your use of our website, content, calculators, community features, and membership services.",
};

export default function TermsPage() {
  return (
    <>
      <section className="gradient-navy py-12 md:py-16">
        <div className="container-max px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Terms of Use</h1>
          <p className="text-navy-200 text-sm">Last updated: June 2026</p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max max-w-4xl prose-sm text-navy-600 leading-relaxed space-y-8">
          <div>
            <h2 className="text-xl font-bold text-navy-800 mb-3">1. Acceptance of Terms</h2>
            <p>By accessing or using the PropertyVault UK website at propertyvault.uk (the &ldquo;Site&rdquo;), you agree to be bound by these Terms of Use (&ldquo;Terms&rdquo;). If you do not agree to these Terms, you must not use the Site. These Terms constitute a legally binding agreement between you and PropertyVault UK.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-navy-800 mb-3">2. Educational Content Only — Not Professional Advice</h2>
            <p className="font-semibold text-navy-800">This is the most important clause in these Terms. Please read it carefully.</p>
            <p className="mt-2">All content on this Site — including but not limited to articles, guides, calculators, tools, videos, courses, forum posts, and market data — is provided for <strong>general educational and informational purposes only</strong>.</p>
            <p className="mt-2">The content on this Site does <strong>NOT</strong> constitute:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li><strong>Financial advice</strong> — we are not authorised or regulated by the Financial Conduct Authority (FCA). We do not provide personalised financial, investment, or mortgage advice.</li>
              <li><strong>Legal advice</strong> — we are not a law firm. Our legal guides are educational summaries and must not be relied upon as legal advice.</li>
              <li><strong>Tax advice</strong> — we are not HMRC and we are not your accountant. Tax rules are complex, change frequently, and depend on individual circumstances.</li>
              <li><strong>Surveying or valuation advice</strong> — we are not RICS-registered surveyors. Property valuations and structural assessments require professional inspection.</li>
              <li><strong>Planning advice</strong> — planning decisions depend on local authority policies and site-specific circumstances.</li>
            </ul>
            <p className="mt-3"><strong>You must always seek independent professional advice</strong> from appropriately qualified and regulated professionals before making any property, financial, legal, or tax decisions. This includes but is not limited to:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>An FCA-regulated mortgage broker or independent financial advisor (IFA)</li>
              <li>An SRA-regulated solicitor or CLC-licensed conveyancer</li>
              <li>An ACCA, ICAEW, or CIOT-qualified accountant or tax advisor</li>
              <li>A RICS-registered chartered surveyor</li>
              <li>A qualified planning consultant</li>
            </ul>
            <p className="mt-2">We accept no liability for any loss or damage arising from reliance on the content of this Site without obtaining appropriate professional advice.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-navy-800 mb-3">3. Calculator Disclaimer</h2>
            <p>Our property calculators (mortgage, stamp duty, rental yield, BRRR, and others) are provided as <strong>indicative tools for educational purposes only</strong>. They produce estimates based on the inputs you provide and simplified assumptions. Results should not be relied upon for making financial decisions.</p>
            <p className="mt-2">Specific limitations:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Mortgage calculations use standard amortisation formulas and do not account for specific lender criteria, fees, or product features</li>
              <li>Stamp duty calculations are based on published HMRC rates for England and Northern Ireland only — Scotland (LBTT) and Wales (LTT) have different rates</li>
              <li>Tax calculations do not account for your full personal tax position and circumstances</li>
              <li>Rental yield and cash flow calculations use simplified models and may not reflect actual real-world performance</li>
              <li>All calculators may not reflect the latest legislative changes</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-navy-800 mb-3">4. Affiliate Disclosure</h2>
            <p>This Site contains affiliate links and commercial partnerships. When you click on certain links and make a purchase or enquiry, we may receive a commission or referral fee at no additional cost to you. This includes but is not limited to:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Mortgage broker referrals</li>
              <li>Insurance product referrals</li>
              <li>Conveyancing service referrals</li>
              <li>Survey and valuation referrals</li>
              <li>Property courses and educational products</li>
              <li>Software and tool recommendations</li>
            </ul>
            <p className="mt-2">Our editorial content is independent of our commercial relationships. We only recommend products and services we believe provide genuine value. However, the existence of affiliate relationships means we have a financial incentive, and you should consider this when evaluating our recommendations.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-navy-800 mb-3">5. Intellectual Property</h2>
            <p>All content on this Site — including text, graphics, logos, icons, images, audio, video, software, and design — is the property of PropertyVault UK or its content suppliers and is protected by UK and international copyright, trademark, and intellectual property laws.</p>
            <p className="mt-2">You may not reproduce, distribute, modify, display, perform, or use our content for commercial purposes without our prior written consent. You may share links to our content and quote brief excerpts with attribution.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-navy-800 mb-3">6. User Accounts and Membership</h2>
            <p>When you create an account, you are responsible for maintaining the confidentiality of your login credentials and for all activities under your account. You must provide accurate and current information and notify us immediately of any unauthorised use.</p>
            <p className="mt-2"><strong>Paid memberships:</strong> Subscription payments are processed through Stripe. Subscriptions renew automatically unless cancelled before the renewal date. You may cancel at any time through your account settings. Refunds are provided on a case-by-case basis within 14 days of initial purchase, in accordance with the Consumer Contracts Regulations 2013.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-navy-800 mb-3">7. Community Guidelines</h2>
            <p>When using our forum and community features, you must not:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>Post content that is defamatory, abusive, threatening, harassing, or discriminatory</li>
              <li>Share illegal content or promote illegal activities</li>
              <li>Provide specific financial, legal, or tax advice to other users (you are not regulated to do so)</li>
              <li>Spam, advertise, or promote products or services without permission</li>
              <li>Share other users&apos; personal information without consent</li>
              <li>Impersonate other individuals or entities</li>
              <li>Post content that infringes intellectual property rights</li>
            </ul>
            <p className="mt-2">We reserve the right to remove content and suspend or terminate accounts that violate these guidelines without notice.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-navy-800 mb-3">8. Market Data and Statistics</h2>
            <p>Market data, statistics, house prices, rental figures, interest rates, and other numerical data presented on this Site are sourced from public sources including ONS, HM Land Registry, Bank of England, and industry reports. This data is provided for informational purposes only and may not be current, accurate, or applicable to specific properties or locations. Always verify data independently before making decisions.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-navy-800 mb-3">9. Case Studies and Examples</h2>
            <p>Case studies, worked examples, and hypothetical scenarios on this Site are for illustrative purposes only. They may be based on real deals (with details anonymised) or may be entirely hypothetical. Past performance of specific deals or strategies does not guarantee future results. Property investment involves risk, and you could lose some or all of your invested capital.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-navy-800 mb-3">10. Limitation of Liability</h2>
            <p>To the fullest extent permitted by law:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li>PropertyVault UK provides the Site and its content on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis without warranties of any kind, whether express or implied</li>
              <li>We do not warrant that the Site will be uninterrupted, error-free, or free of viruses or other harmful components</li>
              <li>We are not liable for any direct, indirect, incidental, special, consequential, or punitive damages arising from your use of or inability to use the Site or reliance on its content</li>
              <li>Our total liability to you for any claim arising from or related to these Terms or the Site shall not exceed the amount you paid to us in the 12 months preceding the claim, or £100, whichever is greater</li>
            </ul>
            <p className="mt-2">Nothing in these Terms excludes or limits our liability for death or personal injury caused by our negligence, fraud or fraudulent misrepresentation, or any other liability that cannot be excluded by English law.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-navy-800 mb-3">11. Indemnification</h2>
            <p>You agree to indemnify and hold harmless PropertyVault UK, its directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from your use of the Site, violation of these Terms, or infringement of any third-party rights.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-navy-800 mb-3">12. Third-Party Links</h2>
            <p>This Site may contain links to third-party websites. We are not responsible for the content, privacy practices, or accuracy of any third-party websites. Inclusion of a link does not imply endorsement. You access third-party sites at your own risk.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-navy-800 mb-3">13. Governing Law</h2>
            <p>These Terms are governed by and construed in accordance with the laws of England and Wales. Any disputes arising from or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts of England and Wales.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-navy-800 mb-3">14. Changes to Terms</h2>
            <p>We may revise these Terms at any time by updating this page. Continued use of the Site after changes are posted constitutes acceptance of the revised Terms. We will notify registered users of material changes by email.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-navy-800 mb-3">15. Contact</h2>
            <p>For questions about these Terms, contact us at legal@propertyvault.uk.</p>
          </div>
        </div>
      </section>
    </>
  );
}

