import type { Metadata } from "next";
import { AskAgent } from "./AskAgent";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Disclaimer } from "@/components/legal/Disclaimer";
import { canonical, ogImages } from "@/lib/site";

const TITLE = "Ask PropertyVault — A Property Agent That Shows Its Working";
const DESCRIPTION =
  "Ask about a UK property in plain English. PropertyVault looks up sold prices and planning " +
  "constraints, runs the numbers through its own calculators, and shows where every figure came " +
  "from — including the checks it could not run.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: canonical("/ask/") },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: canonical("/ask/"),
    images: ogImages("Ask PropertyVault — a property agent that shows its working"),
  },
};

export default function AskPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <Breadcrumbs items={[{ label: "Ask PropertyVault" }]} />

      <h1 className="text-3xl md:text-4xl font-bold mt-4" style={{ color: "var(--ink)" }}>
        Ask PropertyVault
      </h1>
      <p className="mt-3 mb-8 text-lg" style={{ color: "var(--ink-muted)" }}>
        Describe a property and what you want to know. The agent decides what to look up — sold
        prices, planning constraints, the numbers — and answers with the workings attached.
      </p>

      <AskAgent />

      <div className="mt-10">
        <Disclaimer />
      </div>
    </main>
  );
}
