import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

/**
 * Who the caller actually is.
 *
 * ── Why not getSession ─────────────────────────────────────────────────────
 *
 * Several routes decided this with `supabase.auth.getSession()`, which on the
 * server reads the session out of the request cookie and returns it without
 * checking the token against the auth server. The library is candid about it —
 * the object it hands back is wrapped in something it names
 * `insecureUserWarningProxy`. A cookie is supplied by whoever made the
 * request, so an identity read out of one is a claim, not a fact.
 *
 * ── Why a bearer token, not only a cookie ──────────────────────────────────
 *
 * This app signs users in with `createClient` from supabase-js, which keeps
 * the session in localStorage. It never writes an auth cookie. So the routes
 * reading cookies found nothing — not only for an attacker, but for genuine
 * users, which is why "Manage billing" answered Unauthorized for every paying
 * customer.
 *
 * The fix that matches how this app actually works is to let the client send
 * its access token and to verify that token properly. getUser(jwt) asks the
 * auth server, which checks the signature and expiry, so the answer is a fact
 * either way. The cookie path stays for anything that does use cookies.
 */

export interface VerifiedUser {
  id: string;
  email: string | null;
}

const url = () => process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = () => process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function getVerifiedUser(request?: Request): Promise<VerifiedUser | null> {
  const bearer = bearerToken(request);
  if (bearer) {
    const supabase = createClient(url(), anon());
    const { data, error } = await supabase.auth.getUser(bearer);
    if (!error && data.user) return { id: data.user.id, email: data.user.email ?? null };
    // A token that was offered and rejected is an answer. Do not fall through
    // to the cookie and quietly accept a different identity.
    return null;
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(url(), anon(), {
    cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} },
  });

  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return { id: data.user.id, email: data.user.email ?? null };
}

/** The access token from an Authorization header, if there is one. */
export function bearerToken(request?: Request): string | null {
  const header = request?.headers.get("authorization");
  if (!header) return null;
  const match = /^Bearer\s+(.+)$/i.exec(header.trim());
  const token = match?.[1]?.trim();
  // A JWT, loosely: three dot-separated segments. Enough to avoid sending
  // obvious rubbish to the auth server.
  return token && /^[\w-]+\.[\w-]+\.[\w-]+$/.test(token) ? token : null;
}
