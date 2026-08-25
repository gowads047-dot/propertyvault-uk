import type { Metadata } from "next";

type Props = { params: Promise<{ id: string }>; children: React.ReactNode };

// Its own canonical per room. The Makan layout deliberately sets none, because
// a canonical up there made every page below it a duplicate of /makan/.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return {
    alternates: { canonical: `https://www.propertyvaultuk.co.uk/makan/space/${id}/` },
    title: "Room to rent — Makan by PropertyVault UK",
    description:
      "A room to rent on Makan, with the date its availability was last confirmed by the landlord.",
  };
}

export default function SpaceLayout({ children }: Props) {
  return <>{children}</>;
}
