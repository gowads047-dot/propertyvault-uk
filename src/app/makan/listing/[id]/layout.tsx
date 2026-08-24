import type { Metadata } from "next";

type Props = { params: Promise<{ id: string }>; children: React.ReactNode };

// Every listing used to inherit the /makan/ canonical from the Makan layout,
// which told Google each one was a duplicate of the homepage.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return {
    alternates: { canonical: `https://www.propertyvaultuk.co.uk/makan/listing/${id}/` },
  };
}

export default function ListingLayout({ children }: Props) {
  return <>{children}</>;
}
