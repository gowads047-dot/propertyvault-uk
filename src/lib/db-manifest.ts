/**
 * Which schema files have actually been applied to the database.
 *
 * There are eighteen .sql files in supabase/ and nothing anywhere records
 * which of them have been run. Every one says "RUN THIS IN PRODUCTION" in a
 * comment and then relies on somebody remembering. That is fine right up until
 * a feature silently depends on a migration nobody ran — which is exactly what
 * happened with pv-lifecycle.sql: it was reported as run, the code assumed it,
 * and the constraint was still refusing every ownership stage.
 *
 * This gives each file a marker: a thing that exists only once the file has
 * been applied, and that can be checked with a read. `npm run check:db`
 * reports the lot in one go.
 *
 * ── What a marker can and cannot see ───────────────────────────────────────
 *
 * PostgREST can answer "does this table exist" and "does this column exist",
 * which covers most of them. It cannot see a check constraint, an index, a
 * policy, a grant or a seeded row — so a file whose only effect is one of
 * those is marked `unverifiable` and says so, rather than being guessed at.
 * A status of "cannot tell" is worth having; a wrong "applied" is not.
 *
 * pv-lifecycle.sql is verifiable only by luck: it adds a column as well as
 * widening a constraint. A future migration that only widens a constraint
 * should add a harmless marker column, or accept that nothing can check it.
 */

export type Marker =
  /** A table that exists once the file has run. */
  | { kind: "table"; table: string }
  /** A column on an existing table. */
  | { kind: "column"; table: string; column: string }
  /** Nothing readable distinguishes applied from not. */
  | { kind: "unverifiable"; because: string };

export type Migration = {
  /** Filename under supabase/. */
  file: string;
  /** One line on what it is for. */
  purpose: string;
  marker: Marker;
};

export const MIGRATIONS: Migration[] = [
  {
    file: "contact-messages.sql",
    purpose: "Where enquiries from every form on the site are recorded.",
    marker: { kind: "table", table: "contact_messages" },
  },
  {
    file: "subscribers.sql",
    purpose: "The newsletter and starter-pack list.",
    marker: { kind: "table", table: "subscribers" },
  },
  {
    file: "rate-limit.sql",
    purpose: "The Postgres-backed limiter every metered route depends on.",
    marker: { kind: "table", table: "rate_limit" },
  },
  {
    file: "pv-property-schema.sql",
    purpose: "The property, its evidence and its analyses. The Vault writes here.",
    marker: { kind: "table", table: "pv_property" },
  },
  {
    file: "pv-lifecycle.sql",
    purpose: "Widens the stage constraint to cover ownership, and links a researched property to the managed one it became.",
    marker: { kind: "column", table: "pv_property", column: "rentura_property_id" },
  },
  {
    file: "rentura-schema.sql",
    purpose: "The landlord dashboard: properties, tenancies, mortgages, compliance, events.",
    marker: { kind: "table", table: "rentura_properties" },
  },
  {
    file: "rentura-missing-tables.sql",
    purpose: "Expenses, income and documents, plus tenancy fields the first pass omitted.",
    marker: { kind: "table", table: "rentura_expenses" },
  },
  {
    file: "rentura-schema-patch.sql",
    purpose: "Address and tenancy fields added after the first release.",
    marker: { kind: "column", table: "rentura_properties", column: "postcode" },
  },
  {
    file: "rentura-maintenance.sql",
    purpose: "Maintenance requests — the closest thing to a service-request spine.",
    marker: { kind: "table", table: "rentura_maintenance" },
  },
  {
    file: "rentura-contacts.sql",
    purpose: "Contractors and other people attached to a property.",
    marker: { kind: "table", table: "rentura_contacts" },
  },
  {
    file: "rentura-arrears.sql",
    purpose: "Arrears tracking and its event log.",
    marker: { kind: "table", table: "rentura_arrears" },
  },
  {
    file: "rentura-right-to-rent.sql",
    purpose: "Right to Rent checks against a tenancy.",
    marker: { kind: "table", table: "rentura_right_to_rent" },
  },
  {
    file: "rentura-compliance-file-url.sql",
    purpose: "Attaches a certificate file and issuer to a compliance record.",
    marker: { kind: "column", table: "rentura_compliance", column: "file_url" },
  },
  {
    file: "makan-rooms-schema.sql",
    purpose: "Makan's org, place, building, unit and listing model.",
    marker: { kind: "table", table: "makan_listing" },
  },
  {
    file: "makan-enquiry-schema.sql",
    purpose: "Makan enquiries and their message threads.",
    marker: { kind: "table", table: "makan_enquiry" },
  },
  {
    file: "makan-wanted-schema.sql",
    purpose: "Makan wanted ads — what a searcher is looking for, rather than what is available.",
    marker: { kind: "table", table: "makan_wanted" },
  },
  {
    file: "makan-lettype-schema.sql",
    purpose: "Let types and lease terms across the Makan tables.",
    marker: { kind: "column", table: "makan_wanted", column: "let_type" },
  },
  {
    file: "makan-media-storage.sql",
    purpose: "The storage bucket and policies for Makan photographs.",
    marker: {
      kind: "unverifiable",
      because: "creates a storage bucket and policies, neither of which PostgREST exposes",
    },
  },
  {
    file: "makan-seed-org.sql",
    purpose: "Seeds the first Makan organisation.",
    marker: {
      kind: "unverifiable",
      because: "inserts a row rather than changing the schema, so absence is indistinguishable from deletion",
    },
  },
];

/** The PostgREST path that answers whether a marker is present. */
export function probePath(marker: Marker): string | null {
  switch (marker.kind) {
    case "table":
      return `${marker.table}?limit=0`;
    case "column":
      return `${marker.table}?select=${marker.column}&limit=0`;
    case "unverifiable":
      return null;
  }
}

/**
 * What a PostgREST response means for a marker.
 *
 * 42P01 is "relation does not exist" and 42703 is "column does not exist";
 * both mean the file has not run. A 200 means it has. Anything else is a
 * problem with the check itself — a bad key, an outage — and must not be
 * reported as "not applied", because acting on that would mean running a
 * migration a second time.
 */
export function interpret(status: number, body: string): "applied" | "missing" | "error" {
  if (status === 200) return "applied";
  if (body.includes("42P01") || body.includes("42703")) return "missing";
  return "error";
}
