/**
 * The landlord compliance checklist, with the one thing the old version was
 * missing: what kind of obligation each item actually is.
 *
 * /landlord-hub listed nine items in a flat list with a frequency badge, which
 * reads as "all nine are legally required for every property". They are not.
 * A legionella risk assessment is a duty under general health-and-safety law
 * discharged proportionately, an HMO licence applies only to an HMO, and
 * furniture fire safety bites only where the landlord supplies the furniture.
 * Presenting a conditional duty as a universal one is the same class of error
 * as presenting an estimate as a verified fact.
 *
 * SCOPE — READ THIS BEFORE ADDING ANYTHING
 *
 * Every item below is stated for ENGLAND only. Wales, Scotland and Northern
 * Ireland each have their own regime — Wales under the Renting Homes (Wales)
 * Act 2016, Scotland under the private residential tenancy with its own
 * repairing standard, Northern Ireland under separate legislation again. They
 * are not variations of the England position and must not be inferred from it.
 *
 * The site does not currently hold verified rules for those three, so it says
 * so rather than implying the England list travels. Adding them is Phase 4
 * work and needs a solicitor, not a developer with a search engine.
 */

export type Jurisdiction = "england" | "wales" | "scotland" | "northern-ireland";

/**
 * What kind of obligation this is. The distinction the brief asks for, and
 * the one a landlord most needs, because it decides what happens if they skip it.
 */
export type Obligation =
  /** Required by law for every let of this kind. Skipping it is an offence. */
  | "legal"
  /** Required by law, but only where a stated condition applies. */
  | "conditional"
  /** Not required. Sensible, and often what an insurer or court expects. */
  | "recommended";

export const OBLIGATION_LABEL: Record<Obligation, string> = {
  legal: "Legal requirement",
  conditional: "Required in some cases",
  recommended: "Good practice",
};

export const OBLIGATION_MEANING: Record<Obligation, string> = {
  legal: "Required by law for every let of this kind in England",
  conditional: "Required by law only where the condition described applies",
  recommended: "Not legally required, but expected by most insurers and courts",
};

export type ComplianceItem = {
  id: string;
  item: string;
  obligation: Obligation;
  /** For a conditional item, the condition that triggers it. Required. */
  appliesWhen?: string;
  frequency: string;
  detail: string;
  /** The instrument the duty comes from, named so a reader can check it. */
  source: string;
  /**
   * Set where the Renters' Rights Act unsettles this item and PropertyVault
   * has not had the current position confirmed.
   *
   * The brief's rule, and the right one: flag it for review rather than
   * rewriting the law from memory. A wrong confident answer here is worse
   * than an honest "check this" — a landlord can act on either.
   */
  reviewNote?: string;
};

export const COMPLIANCE_ITEMS: ComplianceItem[] = [
  {
    id: "gas-safety",
    item: "Gas Safety Certificate (CP12)",
    obligation: "conditional",
    appliesWhen: "the property has any gas appliance, fitting or flue",
    frequency: "Annual",
    detail:
      "Checked by a Gas Safe registered engineer. A copy goes to the tenant within 28 days, and to a new tenant before they move in. A property with no gas supply has nothing to certify.",
    source: "Gas Safety (Installation and Use) Regulations 1998",
  },
  {
    id: "eicr",
    item: "EICR — electrical safety",
    obligation: "legal",
    frequency: "Every 5 years",
    detail:
      "An Electrical Installation Condition Report from a qualified person. The report must be satisfactory; where it is not, the remedial work has to be done within 28 days or sooner if the report says so.",
    source: "Electrical Safety Standards in the Private Rented Sector (England) Regulations 2020",
  },
  {
    id: "epc",
    item: "EPC — energy performance",
    obligation: "legal",
    frequency: "Every 10 years",
    detail:
      "Must be available before the property is marketed, and given to the tenant. The current minimum for a new let in England is band E, with limited registered exemptions.",
    source: "Energy Efficiency (Private Rented Property) (England and Wales) Regulations 2015",
  },
  {
    id: "alarms",
    item: "Smoke and carbon monoxide alarms",
    obligation: "legal",
    frequency: "Checked at the start of each tenancy",
    detail:
      "A smoke alarm on every storey with living accommodation, and a carbon monoxide alarm in any room with a fixed combustion appliance other than a gas cooker. Both tested on the day the tenancy starts.",
    source: "Smoke and Carbon Monoxide Alarm (England) Regulations 2015, as amended 2022",
  },
  {
    id: "deposit",
    item: "Deposit protection",
    obligation: "conditional",
    appliesWhen: "you take a deposit",
    frequency: "Within 30 days of receipt",
    detail:
      "Protect it in one of the government-approved schemes and serve the prescribed information within 30 days. Failing to do so exposes you to a penalty of up to three times the deposit.",
    source: "Housing Act 2004, Part 6 Chapter 4",
  },
  {
    id: "right-to-rent",
    item: "Right to Rent check",
    obligation: "conditional",
    appliesWhen: "the property is in England",
    frequency: "Before the tenancy starts",
    detail:
      "Check and record the immigration status of every adult who will occupy the property as their only or main home. This duty has not been commenced in Wales, Scotland or Northern Ireland.",
    source: "Immigration Act 2014, Chapter 1 of Part 3",
  },
  {
    id: "how-to-rent",
    item: "How to Rent guide",
    obligation: "legal",
    frequency: "At the start of the tenancy",
    detail:
      "Give the tenant the current edition. It is reissued periodically, and serving a superseded version has previously been treated as not having served it at all.",
    source: "Assured Shorthold Tenancy Notices and Prescribed Requirements (England) Regulations 2015",
    reviewNote:
      "The regulations this duty sits in attach to assured shorthold tenancies, which the Renters' Rights Act removes for new tenancies. What replaces it, and from when, has not been confirmed for this site. Treat serving the current guide as the safe course and check the position before relying on it.",
  },
  {
    id: "hmo-licence",
    item: "HMO licence",
    obligation: "conditional",
    appliesWhen: "the property is a house in multiple occupation the council requires to be licensed",
    frequency: "Per the licence term, usually 5 years",
    detail:
      "Mandatory licensing applies to HMOs occupied by five or more people forming more than one household. Many councils also run additional or selective licensing schemes with their own thresholds — check with the local authority, because the rules genuinely differ between boroughs.",
    source: "Housing Act 2004, Parts 2 and 3",
  },
  {
    id: "legionella",
    item: "Legionella risk assessment",
    obligation: "recommended",
    frequency: "Reviewed periodically",
    detail:
      "There is a general duty to assess and control the risk from water systems. HSE guidance is explicit that for most domestic lets this is a simple proportionate assessment the landlord can carry out — a paid certificate is not required, and anyone insisting one is legally mandatory is selling something.",
    source: "Health and Safety at Work etc. Act 1974; HSE guidance for landlords",
  },
  {
    id: "furniture",
    item: "Furniture fire safety",
    obligation: "conditional",
    appliesWhen: "you supply upholstered furniture or soft furnishings",
    frequency: "Ongoing",
    detail:
      "Supplied upholstered items must meet the fire resistance requirements and carry the appropriate permanent label. An unfurnished let has nothing to comply with.",
    source: "Furniture and Furnishings (Fire) (Safety) Regulations 1988",
  },
];

/**
 * What this list does not cover, stated on the page rather than left implied.
 *
 * Silence about the other three UK jurisdictions is the failure mode here: a
 * Scottish landlord reading an England list with no scope note will reasonably
 * assume it applies to them.
 */
export const JURISDICTION_NOTE =
  "This list is for England. Wales, Scotland and Northern Ireland each have a separate regime — " +
  "different duties, different notice periods and different tenancy types — and PropertyVault does " +
  "not yet hold a verified checklist for them. Do not treat this list as covering a property " +
  "outside England.";

export function itemsByObligation(obligation: Obligation): ComplianceItem[] {
  return COMPLIANCE_ITEMS.filter(i => i.obligation === obligation);
}
