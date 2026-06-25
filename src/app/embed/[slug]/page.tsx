import type { Metadata } from "next";
import { EmbedCalculator } from "@/components/calculators/EmbedCalculator";

const SUPPORTED = [
  "stamp-duty", "mortgage", "rental-yield", "btl-mortgage",
  "landlord-tax", "void-period", "brrr", "monthly-cashflow", "rent-increase",
];

export function generateStaticParams() {
  return SUPPORTED.map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  return {
    title: `PropertyVault UK — Calculator`,
    robots: { index: false, follow: false },
  };
}

export default function EmbedPage({ params }: { params: { slug: string } }) {
  return <EmbedCalculator slug={params.slug} />;
}
