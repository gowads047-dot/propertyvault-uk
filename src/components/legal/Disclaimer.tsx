import Link from "next/link";

type DisclaimerType = "general" | "financial" | "legal" | "tax" | "calculator";

const disclaimerText: Record<DisclaimerType, string> = {
  general:
    "The information on this page is for general educational purposes only and does not constitute financial, legal, or tax advice. Always seek independent professional advice before making property or investment decisions. Your property may be repossessed if you do not keep up repayments on a mortgage.",
  financial:
    "PropertyVault UK is not authorised or regulated by the Financial Conduct Authority (FCA). The content on this page does not constitute financial advice, investment advice, or mortgage advice. Always consult an FCA-regulated independent financial advisor or mortgage broker before making financial decisions. Your property may be repossessed if you do not keep up repayments on a mortgage.",
  legal:
    "This content is for educational purposes only and does not constitute legal advice. Property law is complex and varies by jurisdiction. Always consult an SRA-regulated solicitor or CLC-licensed conveyancer for advice specific to your circumstances.",
  tax:
    "This content is for educational purposes only and does not constitute tax advice. Tax rules are complex, change frequently, and depend on individual circumstances. Always consult a qualified accountant or tax advisor (ACCA, ICAEW, or CIOT qualified) before making tax-related decisions.",
  calculator:
    "This calculator provides estimates for illustrative purposes only. Results are based on simplified assumptions and should not be relied upon for financial decisions. Actual costs, returns, and outcomes will vary. Always consult a qualified professional before making property or financial decisions.",
};

export function Disclaimer({ type = "general" }: { type?: DisclaimerType }) {
  return (
    <div className="bg-navy-50 border border-navy-200 rounded-xl p-5 mt-8">
      <div className="flex gap-3">
        <svg
          className="w-5 h-5 text-navy-500 flex-shrink-0 mt-0.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div>
          <p className="text-xs text-navy-600 leading-relaxed">
            <strong>Disclaimer:</strong> {disclaimerText[type]}
          </p>
          <p className="text-xs text-navy-500 mt-2">
            Read our full{" "}
            <Link href="/disclaimer" className="text-gold-600 underline">
              Disclaimer
            </Link>
            ,{" "}
            <Link href="/terms" className="text-gold-600 underline">
              Terms of Use
            </Link>
            , and{" "}
            <Link href="/privacy" className="text-gold-600 underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
