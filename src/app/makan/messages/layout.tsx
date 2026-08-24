import type { Metadata } from "next";

// Signed-in surface. It was being advertised in the sitemap and inherited the
// public Makan title, so Google was invited to index a page it can only ever
// see logged out.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function MessagesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
