import { isValidClaimToken } from "./property";
import { getVerifiedUser } from "./server-auth";

/**
 * Who is allowed to see a vaulted property, expressed as a PostgREST filter.
 *
 * This filter *is* the authorisation. Every vault query runs with the service
 * role, which bypasses row-level security, so nothing downstream re-checks
 * ownership — fetch by id and compare owners in JavaScript afterwards and a
 * mistake reads as a working page while serving somebody else's property.
 *
 * It lives here rather than in a route because three handlers need it and the
 * recurring failure in this codebase is a correct rule applied in one place
 * and not the others. The collection endpoint is the case in point: it was
 * written token-only, so a signed-in owner whose properties had been claimed
 * into their account could not list them at all — the rows were theirs and the
 * only query that could find them filtered on a column now set to null.
 *
 * A pv_property row belongs either to a user or to a claim token, never both;
 * pv_property_has_one_owner enforces it. A signed-in user therefore takes
 * precedence rather than falling back: if someone presents both credentials
 * the account is the stronger claim, and quietly using the token instead would
 * let a stale one outrank a real identity.
 */
export function userFilter(userId: string): string {
  return `user_id=eq.${encodeURIComponent(userId)}`;
}

export async function ownerFilterFor(request: Request): Promise<string | null> {
  const user = await getVerifiedUser(request);
  if (user) return userFilter(user.id);

  const token = request.headers.get("x-vault-token");
  if (!isValidClaimToken(token)) return null;
  return `claim_token=eq.${encodeURIComponent(token!)}`;
}
