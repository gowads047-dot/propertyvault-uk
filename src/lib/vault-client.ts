import type { Evidence, PropertyInput } from "./property";
import { authFetch } from "./auth-fetch";

/**
 * The browser side of the vault.
 *
 * Shared by the Vault workspace and the agent, because both now produce the
 * same thing — an analysis with evidence attached — and both should be able to
 * keep it. The identity derivation is a pure function so it can be tested
 * without a DOM, which matters more than it sounds: getting it wrong means
 * either saving nothing, or saving a property nobody asked about.
 */

const TOKEN_KEY = "pv_vault_token";

/**
 * A bearer credential for properties saved without an account.
 *
 * Every access is wrapped. A private window can throw on the first read rather
 * than returning null, and a page that crashes on a storage exception is worse
 * than one that quietly has no vault.
 */
export function readToken(): string | null {
  try {
    const t = localStorage.getItem(TOKEN_KEY);
    return t && /^[0-9a-f]{64}$/.test(t) ? t : null;
  } catch {
    return null;
  }
}

export function writeToken(token: string): boolean {
  try {
    localStorage.setItem(TOKEN_KEY, token);
    return true;
  } catch {
    return false;
  }
}

export interface AgentStepView {
  tool: string;
  ok: boolean;
  data: Record<string, unknown> | null;
}

/**
 * Which property, if any, an agent run was about.
 *
 * A conversation is not always about a property — "what does Section 24 cost
 * me on £8,400 of interest" identifies nothing — so this returns null rather
 * than inventing something to save. Only tools that actually looked a place up
 * can supply the postcode; a price on its own is not an identity.
 */
export function derivePropertyFromSteps(steps: AgentStepView[]): PropertyInput | null {
  let postcode: string | null = null;
  let askingPrice: number | null = null;

  for (const s of steps) {
    if (!s.ok || !s.data) continue;
    const d = s.data;

    if ((s.tool === "lookup_area" || s.tool === "lookup_constraints") && typeof d.postcode === "string") {
      postcode = d.postcode;
    }
    // The deal tools carry the price the user actually gave.
    if (typeof d.purchasePrice === "number") askingPrice = d.purchasePrice;
    else if (typeof d.askingPrice === "number") askingPrice = d.askingPrice;
  }

  if (!postcode) return null;
  return { source: "postcode", postcode, askingPrice };
}

/** The score and band of a run, when one of the tools produced them. */
export function deriveScore(steps: AgentStepView[]): { score: number | null; band: string | null } {
  for (const s of steps) {
    if (!s.ok || !s.data) continue;
    const score = s.data.pvScore;
    if (typeof score === "number") {
      return { score, band: typeof s.data.band === "string" ? s.data.band : null };
    }
  }
  return { score: null, band: null };
}

/**
 * Evidence keyed by field.
 *
 * The API refuses the same field twice rather than letting send order decide
 * which value wins, and collisions are real here: several tools have something
 * to say about the median sold price. Later entries win, which means the more
 * specific tool result overwrites the earlier placeholder.
 */
export function dedupeEvidence(evidence: Evidence[]): Evidence[] {
  const byField = new Map<string, Evidence>();
  for (const e of evidence) {
    if (!e?.field) continue;
    byField.set(e.field, e);
  }
  return [...byField.values()];
}

export interface SaveOutcome {
  ok: boolean;
  /** False when the row was written but this browser cannot find it again. */
  persistable: boolean;
  error?: string;
}

export async function saveToVault(input: {
  property: PropertyInput;
  evidence: Evidence[];
  analysis?: { inputs: unknown; computed: unknown; score?: number | null; band?: string | null };
}): Promise<SaveOutcome> {
  try {
    // Trailing slash to match next.config trailingSlash:true — without it the
    // POST takes a 308 redirect hop before it lands.
    const res = await fetch("/api/vault/property/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...input, claimToken: readToken() }),
    });
    const j = await res.json().catch(() => null);
    if (!res.ok) {
      return { ok: false, persistable: false, error: j?.error ?? "Could not save that." };
    }
    const stored = j.claimTokenIsNew ? writeToken(j.claimToken) : true;
    return { ok: true, persistable: stored && readToken() === j.claimToken };
  } catch {
    return { ok: false, persistable: false, error: "Could not reach the vault." };
  }
}

export interface SavedProperty {
  id: string;
  postcode: string | null;
  address: string | null;
  asking_price: number | null;
  updated_at: string;
  pv_analysis?: { score: number | null; band: string | null; created_at: string }[];
}

export async function listVault(): Promise<SavedProperty[]> {
  const token = readToken();
  if (!token) return [];
  try {
    const res = await fetch("/api/vault/property/", { headers: { "X-Vault-Token": token } });
    if (!res.ok) return [];
    return (await res.json()).properties ?? [];
  } catch {
    return [];
  }
}

/** One property, with every figure and every analysis run it carries. */
export interface VaultProperty {
  id: string;
  address: string | null;
  postcode: string | null;
  property_type: string | null;
  bedrooms: number | null;
  asking_price: number | null;
  stage: string;
  source: string;
  source_ref: string | null;
  created_at: string;
  updated_at: string;
  pv_evidence?: {
    field: string;
    state: string;
    value_num: number | null;
    value_text: string | null;
    value_low: number | null;
    value_high: number | null;
    source: string | null;
    source_url: string | null;
    method: string | null;
    checked_at: string;
  }[];
  pv_analysis?: {
    score: number | null;
    band: string | null;
    components_scored: number | null;
    computed: unknown;
    created_at: string;
  }[];
}

/**
 * Read one property back.
 *
 * Uses authFetch so a signed-in owner is identified by their access token, and
 * falls back to the claim token for a property saved before anyone signed up.
 * The route accepts either and matches on the corresponding column; presenting
 * both is fine, and the account wins.
 *
 * Returns null for "no such property" and for "not yours", because the route
 * deliberately does not distinguish them — telling them apart would let anyone
 * holding an id learn whether it exists.
 */
export async function getVaultProperty(id: string): Promise<VaultProperty | null> {
  const token = readToken();
  try {
    const res = await authFetch(`/api/vault/property/${encodeURIComponent(id)}/`, {
      headers: token ? { "X-Vault-Token": token } : {},
    });
    if (!res.ok) return null;
    return (await res.json()).property ?? null;
  } catch {
    return null;
  }
}
