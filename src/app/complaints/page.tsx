import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Complaints Policy — PropertyVault UK",
  description: "PropertyVault UK complaints procedure. How to raise a complaint and our process for handling it.",
};

export default function ComplaintsPage() {
  return (
    <>
      <section className="gradient-navy py-12 md:py-16">
        <div className="container-max px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Complaints Policy</h1>
          <p className="text-navy-200 text-sm">Last updated: June 2026</p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max max-w-4xl prose-sm text-navy-600 leading-relaxed space-y-8">
          <div>
            <h2 className="text-xl font-bold text-navy-800 mb-3">Our Commitment</h2>
            <p>PropertyVault UK is committed to providing a high-quality service. If something goes wrong, we want to know about it so we can put it right and learn from it.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-navy-800 mb-3">How to Complain</h2>
            <p>If you are unhappy with any aspect of our service, please contact us:</p>
            <p className="mt-2"><strong>Email:</strong> complaints@propertyvault.uk<br />
            <strong>Subject line:</strong> Please include &ldquo;Complaint&rdquo; in the subject line</p>
            <p className="mt-2">Please include:</p>
            <ul className="list-disc pl-6 space-y-1 mt-1">
              <li>Your name and email address</li>
              <li>A clear description of your complaint</li>
              <li>What outcome you are seeking</li>
              <li>Any relevant dates, screenshots, or reference numbers</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-navy-800 mb-3">Our Process</h2>
            <ol className="list-decimal pl-6 space-y-2">
              <li><strong>Acknowledgement:</strong> We will acknowledge your complaint within 2 working days</li>
              <li><strong>Investigation:</strong> We will investigate your complaint thoroughly and fairly</li>
              <li><strong>Response:</strong> We aim to provide a full response within 10 working days. If we need more time, we will let you know and explain why</li>
              <li><strong>Resolution:</strong> If your complaint is upheld, we will explain what action we will take to put things right</li>
            </ol>
          </div>

          <div>
            <h2 className="text-xl font-bold text-navy-800 mb-3">If You Are Not Satisfied</h2>
            <p>If you are not satisfied with our response, you can escalate your complaint by writing to our senior management at escalations@propertyvault.uk. We will review the complaint again independently and respond within 10 working days.</p>
            <p className="mt-2">For complaints about data protection, you can contact the Information Commissioner&apos;s Office (ICO) at ico.org.uk.</p>
            <p className="mt-2">For complaints about content accuracy, you may also contact the Advertising Standards Authority (ASA) at asa.org.uk if you believe any content constitutes misleading advertising.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-navy-800 mb-3">Content Corrections</h2>
            <p>If you believe any information on our website is inaccurate, outdated, or misleading, please report it to editorial@propertyvault.uk. We take accuracy seriously and will review and correct any confirmed errors promptly.</p>
          </div>
        </div>
      </section>
    </>
  );
}

