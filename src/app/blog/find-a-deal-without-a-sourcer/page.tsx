import { BlogArticleHero } from "@/components/blog/BlogArticleHero";
import Link from "next/link";
import type { Metadata } from "next";
import { Disclaimer } from "@/components/legal/Disclaimer";
import { FAQSchema } from "@/components/seo/FAQSchema";
import { HelpCTA } from "@/components/blog/HelpCTA";

const TITLE = "How to Find a Property Deal Without Paying a Sourcer";
const DESCRIPTION =
  "Sourcing fees are commonly quoted at £3,000–£5,000 a deal. Here is what that fee buys, " +
  "which parts of it you can do yourself with free public data, and the part that is genuinely " +
  "worth paying for.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: "find a deal without a sourcer, property sourcing fees UK, BMV property UK, sourcing a buy to let, deal sourcing UK",
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/blog/find-a-deal-without-a-sourcer/" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "article",
    url: "https://www.propertyvaultuk.co.uk/blog/find-a-deal-without-a-sourcer/",
    siteName: "PropertyVault UK",
    images: [{ url: "https://www.propertyvaultuk.co.uk/opengraph-image", width: 1200, height: 630, alt: "Finding a UK property deal without a sourcer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

const faqs = [
  {
    q: "How much does a property sourcer charge in the UK?",
    a: "Fees are commonly quoted between £3,000 and £5,000 for a single deal, though they vary widely and some sourcers charge a percentage of the purchase price instead. The fee is normally paid on exchange, and is separate from your deposit, stamp duty, legal fees and survey.",
  },
  {
    q: "Can I find below market value property myself?",
    a: "Most of the research a sourcer does uses public data anyone can reach. HM Land Registry publishes what every property in England and Wales actually sold for, the planning registers show constraints, and the portals show what is currently available. What you are usually buying with a fee is time and local relationships, not access.",
  },
  {
    q: "What should I check before paying a sourcing fee?",
    a: "Ask what the fee covers and at what point it becomes payable, whether the sourcer has viewed the property themselves, and how the figures in their pack were arrived at. Ask which comparable sales they used and check those against the Land Registry record yourself. Ask about their professional registrations and redress arrangements, and verify anything you are told independently rather than taking it on trust.",
  },
  {
    q: "Is a sourced deal ever worth the fee?",
    a: "It can be. A sourcer with genuine off-market access, or one operating in an area you cannot get to, is selling something you cannot easily replicate. The fee is harder to justify when the property is openly listed on a portal and the pack is built from public data you could have pulled yourself in an afternoon.",
  },
  {
    q: "How do I check what a property is really worth?",
    a: "Compare it against what similar properties nearby have actually sold for, rather than against what other properties are currently asking. Asking prices are opinions; sold prices are a record. HM Land Registry publishes sold prices free, and they are the single most useful check available before making an offer.",
  },
];

export default function FindADealArticle() {
  return (
    <>
      <BlogArticleHero
        title={TITLE}
        excerpt="What a sourcing fee actually buys, which parts of it are free public data, and the part that is genuinely worth paying for."
        category="Investing"
        date="6 September 2026"
        readTime="9 min"
        image="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1400&q=80"
      />

      <article className="section-padding bg-white">
        <div className="container-max max-w-3xl prose-sm text-navy-600 leading-relaxed space-y-6">
          <p className="text-lg">
            A property sourcer finds a deal, packages it, and charges you a fee — commonly quoted
            somewhere between £3,000 and £5,000, though it varies and some charge a percentage
            instead. On a £150,000 property that is two to three percent of the purchase price,
            paid on top of your deposit, stamp duty, legal fees and survey.
          </p>
          <p>
            Sometimes that is money well spent. Often it is paid for research you could have done
            yourself, because most of what goes into a sourcing pack comes from public registers
            that are free to anyone who knows where to look. This is what the fee buys, broken into
            the parts you can do and the part you probably cannot.
          </p>

          <h2 className="text-xl font-bold text-navy-800 mt-8" style={{ fontFamily: "var(--font-family-heading)" }}>
            What is actually in a sourcing pack
          </h2>
          <p>
            Strip the branding off and most packs contain the same five things: the property and
            its asking price, an estimate of what it is worth, an estimate of what it would rent
            for, a refurbishment budget, and the resulting yield and cash flow figures. Some add
            photographs and a floor plan.
          </p>
          <p>
            Four of those five are derived from data anyone can reach. The fifth — the refurbishment
            budget — is the one that needs somebody to have stood in the building.
          </p>

          <h2 className="text-xl font-bold text-navy-800 mt-8" style={{ fontFamily: "var(--font-family-heading)" }}>
            The parts you can do yourself
          </h2>

          <h3 className="text-lg font-bold text-navy-800 mt-6">1. Finding the stock</h3>
          <p>
            The majority of &ldquo;sourced&rdquo; properties are openly listed. Before paying for
            access to something, check whether it is already on a portal — searching the address or
            the postcode usually settles it in under a minute. A property you can find yourself is
            not one you need introducing to.
          </p>
          <p>
            The genuinely off-market end of the business — probate, repossessions, landlords selling
            quietly — is real, and it is the part of a sourcer&rsquo;s job that is hard to replicate.
            But you should know which of the two you are being sold.
          </p>

          <h3 className="text-lg font-bold text-navy-800 mt-6">2. Working out what it is worth</h3>
          <p>
            This is the check that matters most and the one most often skipped. An asking price is
            an opinion held by somebody with an interest in it being high. A sold price is a record
            of what a real buyer paid.
          </p>
          <p>
            HM Land Registry publishes the sold price of every property in England and Wales, free.
            Look up the street and the surrounding roads, filter to the last eighteen months or so,
            and compare like with like — a three-bed terrace against other three-bed terraces, not
            against the semi with the extension. Our{" "}
            <Link href="/sold-prices" className="text-gold-600 font-semibold">sold prices tool</Link>{" "}
            queries the same register directly.
          </p>
          <p>
            If a pack tells you a property is worth £20,000 more than the asking price, ask which
            sales that is based on, then look those sales up yourself. A valuation nobody will show
            you the workings for is not a valuation.
          </p>

          <h3 className="text-lg font-bold text-navy-800 mt-6">3. Running the numbers</h3>
          <p>
            Yield, cash flow, stamp duty and the effect of a rate rise are all arithmetic. They take
            minutes with a calculator and they are the figures a pack is most likely to present
            flatteringly — gross yield rather than net, for instance, which ignores every cost of
            actually running the property.
          </p>
          <p>
            Run them yourself:{" "}
            <Link href="/calculators/rental-yield" className="text-gold-600 font-semibold">rental yield</Link>,{" "}
            <Link href="/calculators/stamp-duty" className="text-gold-600 font-semibold">stamp duty</Link>,{" "}
            <Link href="/calculators/monthly-cashflow" className="text-gold-600 font-semibold">monthly cash flow</Link>, and{" "}
            <Link href="/calculators/deal-analyser" className="text-gold-600 font-semibold">the deal analyser</Link>{" "}
            for the whole picture at once. If your figures and the pack&rsquo;s figures disagree, the
            difference is worth understanding before you go further.
          </p>

          <h3 className="text-lg font-bold text-navy-800 mt-6">4. Checking what the property carries</h3>
          <p>
            Conservation areas, listed status and other planning constraints change what you can do
            to a building and what it costs to do anything at all. These sit on public registers.
            The local authority&rsquo;s planning portal will also show what has previously been applied
            for at the address, which occasionally tells you something the listing does not.
          </p>

          <h2 className="text-xl font-bold text-navy-800 mt-8" style={{ fontFamily: "var(--font-family-heading)" }}>
            A method you can follow in an afternoon
          </h2>
          <div className="bg-navy-50 rounded-xl p-6 space-y-3 text-sm not-prose">
            <p className="font-bold text-navy-800">For each property you are considering:</p>
            <ol className="list-decimal pl-5 space-y-2 text-navy-600">
              <li><strong>Pull the sold comparables.</strong> Same street first, then adjacent roads. Same property type and size. Last eighteen months.</li>
              <li><strong>Find the median, not the best one.</strong> The highest nearby sale is the number a pack will quote at you. The middle of the range is the number to plan against.</li>
              <li><strong>Get a realistic rent.</strong> Look at what comparable properties are actually let at, not asking rents, and assume some void weeks.</li>
              <li><strong>Run the numbers on your own figures.</strong> Net yield and monthly cash flow, with management, maintenance, insurance and voids included.</li>
              <li><strong>Stress it.</strong> Work out what happens if the rate rises by two points or the rent comes in ten percent under. A deal that only works at today&rsquo;s numbers is a bet, not an investment.</li>
              <li><strong>Decide your walk-away price before you speak to anyone.</strong> Write it down. The number you decide under pressure is never the number you decided calmly.</li>
            </ol>
          </div>
          <p>
            <Link href="/vault" className="text-gold-600 font-semibold">Vault a property</Link>{" "}
            does most of that in one pass — it pulls the sold evidence, runs the calculations, and
            shows the source of every figure alongside it, including the checks it could not
            complete. It is free and needs no account.
          </p>

          <h2 className="text-xl font-bold text-navy-800 mt-8" style={{ fontFamily: "var(--font-family-heading)" }}>
            Where a sourcer genuinely earns the fee
          </h2>
          <p>
            Three things are hard to replicate from a laptop.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Being there.</strong> A refurbishment estimate made from photographs is a
              guess. Damp, structural movement, a roof at the end of its life and a rewire that
              cannot wait are all things somebody has to see.
            </li>
            <li>
              <strong>Relationships.</strong> An agent who calls one person before a property is
              listed is worth something real, and it takes years to become that person.
            </li>
            <li>
              <strong>Distance.</strong> If you are investing in a city you cannot easily get to,
              or from abroad, you are paying somebody to be present. That is a legitimate service.
            </li>
          </ul>
          <p>
            What is harder to justify is a fee for assembling public data on an openly listed
            property into a document. That is the version worth recognising.
          </p>

          <h2 className="text-xl font-bold text-navy-800 mt-8" style={{ fontFamily: "var(--font-family-heading)" }}>
            Questions worth asking before you pay
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Is this property listed publicly anywhere? If so, where?</li>
            <li>Which specific sold comparables is the valuation based on?</li>
            <li>Have you been inside, and when?</li>
            <li>What exactly does the fee cover, and at what point does it become payable?</li>
            <li>Is the fee refundable if the survey or the searches change the picture?</li>
            <li>What professional registrations and redress arrangements do you have?</li>
          </ul>
          <p>
            Verify the answers independently rather than taking them on trust. A sourcer worth
            paying will expect you to, and will have no difficulty with any of it.
          </p>

          <h2 className="text-xl font-bold text-navy-800 mt-8" style={{ fontFamily: "var(--font-family-heading)" }}>
            The point
          </h2>
          <p>
            None of this says never use a sourcer. It says know which half of the fee you are
            paying for. If the deal is on a portal and the pack is public data in a nice typeface,
            you have paid several thousand pounds for an afternoon of your own time. If somebody has
            stood in a building you cannot get to and told you honestly what it needs, that is a
            different transaction entirely.
          </p>
          <p>
            Either way, do the sold-price check yourself. It is free, it takes ten minutes, and it
            is the one number that decides whether everything else in the pack is worth reading.
          </p>

          <FAQSchema faqs={faqs} />
          <HelpCTA />
          <Disclaimer type="financial" />
        </div>
      </article>
    </>
  );
}
