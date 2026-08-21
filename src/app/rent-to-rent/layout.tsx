import type { Metadata } from "next";

// The page itself is a client component, so it cannot export metadata. Without
// this it inherited the root layout's title and description, which made it a
// duplicate of the homepage in search results and left it with no canonical.
export const metadata: Metadata = {
  title: "Rent-to-Rent UK — How It Works, Step by Step | PropertyVault UK",
  description:
    "A practical rent-to-rent guide for the UK: choosing between HMO and serviced accommodation, setting up the business, finding and pitching landlords, contracts, compliance and the numbers to run before you commit.",
  keywords:
    "rent to rent UK, R2R property, rent to rent HMO, rent to serviced accommodation, rent to rent contracts, rent to rent guide",
  alternates: { canonical: "https://www.propertyvaultuk.co.uk/rent-to-rent/" },
  openGraph: {
    title: "Rent-to-Rent UK — How It Works, Step by Step",
    description:
      "Choosing a model, setting up, approaching landlords, contracts and compliance — the full rent-to-rent process with the numbers to check first.",
    type: "article",
    url: "https://www.propertyvaultuk.co.uk/rent-to-rent/",
    siteName: "PropertyVault UK",
    images: [
      {
        url: "https://www.propertyvaultuk.co.uk/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Rent-to-Rent UK guide — PropertyVault UK",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rent-to-Rent UK — How It Works, Step by Step",
    description:
      "Choosing a model, setting up, approaching landlords, contracts and compliance — the full rent-to-rent process.",
  },
};

export default function RentToRentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
