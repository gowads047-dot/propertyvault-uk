import { AreaFunnel } from "@/components/property/AreaFunnel";

/**
 * Wraps the area guides, the postcode hub and every postcode district page, so
 * a twenty-second city added later inherits the next step rather than being
 * the one page that quietly leads nowhere.
 *
 * Stays a server component — AreaFunnel reads the pathname on the client, so
 * nothing here forces these pages out of static generation.
 */
export default function AreasLayout({ children }: { children: React.ReactNode }) {
  return <AreaFunnel>{children}</AreaFunnel>;
}
