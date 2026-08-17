import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // Only forbid the characters that are genuinely ambiguous in JSX text.
      //
      // The default config also forbids ' and ", which accounted for 208 of the
      // repo's 344 lint errors — every one of them ordinary prose in marketing
      // copy, none of them a real defect. React escapes quotes in JSX text
      // correctly, so rewriting 208 sentences to &apos;/&quot; would risk a
      // visible typo in customer-facing copy to satisfy a cosmetic rule.
      //
      // > and } stay forbidden: those can silently swallow markup or break an
      // expression, which is the hazard this rule exists to catch.
      "react/no-unescaped-entities": [
        "error",
        { forbid: [">", "}"] },
      ],
    },
  },
]);

export default eslintConfig;
