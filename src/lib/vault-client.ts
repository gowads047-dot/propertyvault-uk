import type { Evidence, PropertyInput } from "./property";
import { authFetch } from "./auth-fetch";
import { supabase } from "./supabase";
import type { AnyStage } from "./lifecycle";
import { track, events } from "./analytics";

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

/**
 * Forget the anonymous credential.
 *
 * Called once the properties behind it belong to an account. Keeping a spent
 * bearer token in localStorage buys nothing and is a small liability: anyone
 * who later reads that storage holds a key to properties it no longer opens,
 * and a stale token would make every subsequent page load attempt a claim
 * that can only move zero rows.
 */
export function clearToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // Same reasoning as readToken: a storage exception must not take the page
    // down. A token that cannot be removed is harmless — the next claim moves
    // nothing.
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
  /** Set once this became a property you own. */
  rentura_property_id?: string | null;
  /**
   * Where it is in its life. The endpoint has always returned this; the type
   * did not carry it, so the list could not show it and every property looked
   * alike whether it was a passing thought or under offer.
   */
  stage: AnyStage;
  updated_at: string;
  pv_analysis?: { score: number | null; band: string | null; created_at: string }[];
}

export async function listVault(): Promise<SavedProperty[]> {
  // Whichever credential this browser has.
  //
  // This used to return an empty list the moment there was no token, which
  // was correct only while nothing could claim a property into an account.
  // Once claiming works the token is cleared, so a signed-in owner would have
  // been handed an empty vault at the exact moment their properties became
  // properly theirs. authFetch attaches the access token; the claim token
  // rides along only while one exists.
  const headers: Record<string, string> = {};
  const token = readToken();
  if (token) headers["X-Vault-Token"] = token;

  try {
    const res = await authFetch("/api/vault/property/", { headers });
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
  /** Set once this became a property you own, and links to the Rentura record. */
  rentura_property_id: string | null;
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

/**
 * Move a property to a different stage.
 *
 * Sends whichever credential this browser holds, the same way getVaultProperty
 * does: the bearer token for a signed-in user, the claim token otherwise. The
 * server decides which one counts.
 */
export async function setStage(
  id: string,
  stage: string,
): Promise<{ ok: true; stage: string } | { ok: false; error: string }> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const token = readToken();
  if (token) headers["X-Vault-Token"] = token;

  try {
    const res = await authFetch(`/api/vault/property/${encodeURIComponent(id)}/`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ stage }),
    });
    const j = await res.json().catch(() => null);
    if (!res.ok) {
      return { ok: false, error: j?.error ?? "Could not update that." };
    }
    return { ok: true, stage: j.stage };
  } catch {
    return { ok: false, error: "Could not reach the vault." };
  }
}

/**
 * Move anonymous properties into the account that just signed in.
 *
 * The schema went to real trouble to support working without an account:
 * user_id is nullable, a claim_token identifies an anonymous owner, and
 * pv_claim_properties exists to hand those rows over at signup. Nothing ever
 * called it. So five properties vaulted before signing up stayed anonymous
 * afterwards, invisible from the account — and pv_purge_unclaimed deletes
 * anonymous rows after ninety days, which made the loss eventual and silent.
 *
 * Runs as the signed-in user against a security-definer function, so the
 * database checks the identity rather than trusting anything sent from here.
 * The token is only forgotten once the move has actually succeeded: dropping
 * it on a failed call would strand the very rows this exists to rescue.
 */
export async function claimVault(): Promise<{ moved: number } | null> {
  const token = readToken();
  if (!token) return null;

  try {
    const { data, error } = await supabase.rpc("pv_claim_properties", { p_claim_token: token });
    if (error) {
      console.error("vault claim failed:", error.message);
      return null;
    }

    // Only now. The rows are the account's, so the bearer credential has done
    // its job and keeping it would make every later page load retry a claim
    // that can move nothing.
    clearToken();

    const moved = typeof data === "number" ? data : 0;
    if (moved > 0) track(events.vaultClaimed, { moved });
    return { moved };
  } catch (err) {
    console.error("vault claim failed:", err);
    return null;
  }
}

/**
 * Turn a researched property into one you own.
 *
 * Creates the Rentura property from what the vault already knows and links the
 * two, so the evidence and the workings built up while deciding stay attached
 * to the thing that was bought.
 *
 * Needs an account: the link constraint refuses an anonymous row, because a
 * claim that two records are the same house may only be made by somebody who
 * owns both sides of it. The server says so specifically rather than failing
 * with a constraint violation, and `needsAccount` carries that through.
 */
export async function ownProperty(
  id: string,
): Promise<
  | { ok: true; renturaPropertyId: string; created: boolean }
  | { ok: false; error: string; needsAccount: boolean }
> {
  try {
    const res = await authFetch(`/api/vault/property/${encodeURIComponent(id)}/own/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const j = await res.json().catch(() => null);
    if (!res.ok) {
      return {
        ok: false,
        error: j?.error ?? "Could not add that to your portfolio.",
        needsAccount: j?.reason === "needs-account",
      };
    }
    return { ok: true, renturaPropertyId: j.renturaPropertyId, created: j.created };
  } catch {
    return { ok: false, error: "Could not reach the vault.", needsAccount: false };
  }
}
