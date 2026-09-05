/**
 * What each evidence field is called, and how to read it.
 *
 * pv_evidence rows carry a machine name — `area_median_sold`, `cash_on_cash` —
 * chosen so the database is greppable. Printing those on a page and hoping the
 * reader infers the meaning is how a trust display stops being trustworthy: a
 * figure nobody can name is a figure nobody can check.
 *
 * evidence-fields.test.ts asserts every field the codebase actually writes has
 * an entry here, walking the source for the calls that produce them. A new
 * field added without a label fails at commit rather than rendering as a raw
 * identifier on somebody's property page.
 */

export type FieldFormat = "gbp" | "gbp-per-month" | "percent" | "score" | "text";

export type FieldSpec = {
  /** What a person would call it. */
  label: string;
  format: FieldFormat;
  /** One line on what it means, for the reader who has not met the term. */
  hint?: string;
};

export const FIELDS: Record<string, FieldSpec> = {
  asking_price: {
    label: "Asking price",
    format: "gbp",
    hint: "What the seller is asking, as you entered it",
  },
  monthly_rent: {
    label: "Monthly rent",
    format: "gbp-per-month",
    hint: "The rent this would achieve, as you entered it",
  },
  area_median_sold: {
    label: "Median sold price nearby",
    format: "gbp",
    hint: "The middle price of recent sales in the same postcode area, from HM Land Registry",
  },
  price_vs_area: {
    label: "Asking price against the area",
    format: "percent",
    hint: "How far above or below the local median this one is priced",
  },
  maximum_offer: {
    label: "Most you should offer",
    format: "gbp",
    hint: "The highest price at which this still meets the return you asked for",
  },
  gross_yield: {
    label: "Gross yield",
    format: "percent",
    hint: "Annual rent as a percentage of price, before any costs",
  },
  net_yield: {
    label: "Net yield",
    format: "percent",
    hint: "The same figure after running costs, which is the one that matters",
  },
  monthly_cashflow: {
    label: "Monthly cash flow",
    format: "gbp-per-month",
    hint: "What is left each month once the mortgage and the costs are paid",
  },
  cash_required: {
    label: "Cash needed to buy",
    format: "gbp",
    hint: "Deposit, stamp duty and fees — the money that has to leave your account",
  },
  cash_on_cash: {
    label: "Return on the cash you put in",
    format: "percent",
    hint: "Annual cash flow against the cash required, not against the purchase price",
  },
  stamp_duty: {
    label: "Stamp duty",
    format: "gbp",
    hint: "Including the additional-property surcharge where it applies",
  },
  cgt: {
    label: "Capital gains tax",
    format: "gbp",
    hint: "Estimated on the assumptions shown, not advice on your own position",
  },
  running_costs: {
    label: "Running costs",
    format: "gbp",
    hint: "Management, insurance, maintenance and a void allowance",
  },
  stress_test: {
    label: "Cash flow if rates rise 2%",
    format: "gbp-per-month",
    hint: "What the monthly figure becomes on an interest-only rate two points higher",
  },
  pv_score: {
    label: "PropertyVault score",
    format: "score",
    hint: "Out of 100, with the components and the exclusions shown in full",
  },
  planning_constraints: {
    label: "Planning constraints",
    format: "text",
    hint: "Conservation area, listing, flood zone and similar designations",
  },
};

/**
 * Planning constraints are named after whatever the register called them.
 *
 * VaultWorkspace builds the field as `planning_${label}` from the constraint
 * it found, so the set is open — "planning_conservation_area",
 * "planning_flood_zone_2", and whatever the next dataset returns. They cannot
 * be listed, so they get a rule instead: the prefix names the family and the
 * suffix is the constraint, which is exactly what a reader needs.
 */
const PLANNING_PREFIX = "planning_";

export function specFor(field: string): FieldSpec {
  const known = FIELDS[field];
  if (known) return known;

  if (field.startsWith(PLANNING_PREFIX) && field.length > PLANNING_PREFIX.length) {
    const what = field.slice(PLANNING_PREFIX.length).replace(/_/g, " ").trim();
    return {
      label: `Planning: ${what}`,
      format: "text",
      hint: "A designation recorded against this location on the planning register",
    };
  }

  // Anything else is a bug the test catches, but the page still has to render
  // something rather than throwing on somebody's saved property.
  return { label: field.replace(/_/g, " "), format: "text" };
}

const gbp = (n: number) =>
  `${n < 0 ? "-" : ""}£${Math.abs(Math.round(n)).toLocaleString("en-GB")}`;

/**
 * A value with its units, or null when there is nothing to show.
 *
 * Null rather than a dash or a zero: "missing" is a state the caller renders
 * deliberately, and a formatter that invents 0 for absent data is exactly the
 * silent fill this whole system exists to prevent.
 */
export function formatValue(
  field: string,
  v: { value_num?: number | null; value_text?: string | null; value_low?: number | null; value_high?: number | null },
): string | null {
  const { format } = specFor(field);

  if (v.value_text != null && v.value_text !== "") return v.value_text;

  if (v.value_low != null && v.value_high != null) {
    return format === "percent"
      ? `${v.value_low.toFixed(1)}–${v.value_high.toFixed(1)}%`
      : `${gbp(v.value_low)}–${gbp(v.value_high)}`;
  }

  if (v.value_num == null) return null;

  switch (format) {
    case "gbp": return gbp(v.value_num);
    case "gbp-per-month": return `${gbp(v.value_num)}/month`;
    case "percent": return `${v.value_num.toFixed(1)}%`;
    case "score": return `${Math.round(v.value_num)} / 100`;
    default: return String(v.value_num);
  }
}
