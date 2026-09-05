import { CalculatorFunnel } from "@/components/calculators/CalculatorFunnel";

/**
 * Wraps every calculator, so the funnel band and the tool_used event arrive on
 * all twenty-three without editing twenty-three files — and, more usefully,
 * without a twenty-fourth being added later that quietly misses both.
 *
 * This layout stays a server component and reads nothing from the request. An
 * earlier version took the tool slug from headers(), which opts the entire
 * subtree into dynamic rendering — it would have turned twenty-three
 * statically generated pages that carry the site's search traffic into
 * server-rendered ones, to label an analytics event. CalculatorFunnel reads
 * the pathname on the client instead, where it is free.
 */
export default function CalculatorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CalculatorFunnel>{children}</CalculatorFunnel>;
}
