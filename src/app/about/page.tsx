import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About PropertyVault UK — Our Mission & Team",
  description: "PropertyVault is the UK's most comprehensive property investment education platform. Learn about our mission, values, and the experts behind our content.",
};

export default function AboutPage() {
  return (
    <>
      <section className="gradient-navy py-16 md:py-24">
        <div className="container-max px-4">
          <div className="max-w-3xl">
            <p className="text-gold-400 font-semibold text-sm uppercase tracking-wider mb-3">About Us</p>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">About PropertyVault</h1>
            <p className="text-navy-200 text-lg">We are building the UK&apos;s most trusted property investment education platform — empowering investors at every stage of their journey.</p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-max max-w-4xl space-y-10">
          <div>
            <h2 className="text-2xl font-bold text-navy-800 mb-4">Our Mission</h2>
            <p className="text-navy-600 text-lg leading-relaxed">To democratise property investment knowledge and give every person in the UK access to the expert-level education, tools, and community they need to build wealth through property — regardless of their starting point.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-navy-800 mb-4">Our Vision</h2>
            <p className="text-navy-600 text-lg leading-relaxed">To become the UK&apos;s most trusted and comprehensive property investment platform — the first place anyone turns when they have a property question, the Investopedia of UK property.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-navy-800 mb-4">Our Story</h2>
            <p className="text-navy-600 leading-relaxed">PropertyVault was born from frustration. When our founders started investing in property, they found the information landscape fragmented, unreliable, and often behind expensive paywalls. Mortgage guides were written by banks trying to sell products. Legal guides were impenetrably written by lawyers. Tax advice was generic or outdated.</p>
            <p className="text-navy-600 leading-relaxed mt-3">We set out to create the resource we wished had existed — a single, comprehensive, trustworthy platform covering every aspect of UK property investment, written in plain English by qualified professionals, and available to everyone for free.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-navy-800 mb-4">Our Values</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { title: "Accuracy First", desc: "Every guide is fact-checked, referenced, and reviewed by qualified professionals. We never publish content we are not confident in." },
                { title: "Plain English", desc: "Property law and finance are complex enough without jargon. We explain everything clearly, without dumbing it down." },
                { title: "No Hidden Agendas", desc: "We are transparent about how we earn revenue. Affiliate partnerships are clearly disclosed. Our content is never influenced by commercial relationships." },
                { title: "Always Current", desc: "Property law and tax change frequently. We review and update our content continuously to ensure accuracy." },
              ].map((v) => (
                <div key={v.title} className="bg-navy-50 rounded-xl p-5">
                  <h3 className="font-bold text-navy-800 mb-2">{v.title}</h3>
                  <p className="text-sm text-navy-600">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-navy-800 mb-4">Our Expert Contributors</h2>
            <p className="text-navy-600 leading-relaxed mb-4">Our content is created and reviewed by qualified professionals with real-world experience:</p>
            <ul className="list-disc pl-6 space-y-2 text-navy-600">
              <li>FCA-regulated mortgage advisors with whole-of-market access</li>
              <li>SRA-regulated property solicitors specialising in conveyancing and landlord law</li>
              <li>RICS-registered chartered surveyors</li>
              <li>ACCA/ICAEW-qualified accountants specialising in property tax</li>
              <li>Experienced property investors with combined portfolios exceeding 200 units</li>
              <li>ARLA-qualified letting agents and property managers</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
