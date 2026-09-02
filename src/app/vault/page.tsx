import type { Metadata } from "next";
import { VaultWorkspace } from "./VaultWorkspace";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Disclaimer } from "@/components/legal/Disclaimer";
import { canonical } from "@/lib/site";

const TITLE = "Vault a Property — Score, Evidence and Maximum Offer";
const DESCRIPTION =
  "Paste a postcode, price and rent. PropertyVault checks HM Land Registry sold prices, " +
  "runs the numbers, scores the deal and tells you the most you should offer — showing " +
  "where every figure came from.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: canonical("/vault/") },
  openGraph: { title: TITLE, description: DESCRIPTION, url: canonical("/vault/") },
};

export default function VaultPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <Breadcrumbs items={[{ label: "Vault a property" }]} />

      <h1 className="text-3xl md:text-4xl font-bold mt-4" style={{ color: "var(--ink)" }}>
        Before you buy, Vault it
      </h1>
      <p className="mt-3 mb-8 text-lg" style={{ color: "var(--ink-muted)" }}>
        PropertyVault checks the numbers, the sold evidence and the risks behind a property —
        then tells you what matters, and where every figure came from.
      </p>

      <VaultWorkspace />

      <div className="mt-10">
        <Disclaimer />
      </div>
    </main>
  );
}
