import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Disclaimer } from "@/components/legal/Disclaimer";
import { PropertyRecord } from "./PropertyRecord";

/**
 * The property record.
 *
 * Singular /property rather than /properties/[id], because /properties is an
 * existing marketing page about listing and browsing. Nesting a private record
 * under a public listings page would make the URL say the wrong thing.
 *
 * noindex, and not in the sitemap: every one of these is somebody's own
 * property, reachable only with their claim token or their account. There is
 * nothing here for a crawler and a page of private analysis is not something
 * to invite one into.
 */
export const metadata: Metadata = {
  title: "Property Record — PropertyVault",
  description: "Everything PropertyVault knows about one property, with the source of every figure.",
  robots: { index: false, follow: false },
};

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="container-max px-4" style={{ maxWidth: 860, padding: "28px 16px 64px" }}>
      <Breadcrumbs items={[{ label: "Vault", href: "/vault" }, { label: "Property" }]} />
      <div style={{ marginTop: 20 }}>
        <PropertyRecord id={id} />
      </div>
      <div style={{ marginTop: 40 }}>
        <Disclaimer />
      </div>
    </main>
  );
}
