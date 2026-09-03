import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Who the caller actually is.
 *
 * Three routes decided this with `supabase.auth.getSession()`, which on the
 * server reads the session out of the request cookie and hands it back without
 * verifying the token against the auth server. The library is candid about it —
 * the object it returns is wrapped in something it names
 * `insecureUserWarningProxy` — and Supabase's guidance is to use `getUser()`
 * on the server for exactly this reason.
 *
 * The cookie is supplied by the client. So an identity read out of it is a
 * claim, not a fact, and the three routes were:
 *
 *   /api/admin/check   gating the admin interface
 *   /api/admin/users   opening the service role key and listing every user
 *   /api/stripe/portal resolving a Stripe customer from session.user.id
 *
 * The last is the sharpest: a user id taken on trust selects whose billing
 * portal is opened.
 *
 * getUser() asks the auth server, which verifies the token's signature and
 * expiry. That is a network round trip per call, which is the correct price
 * for the only question that matters here.
 */
export async function getVerifiedUser(): Promise<{ id: string; email: string | null } | null> {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } },
  );

  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;

  return { id: data.user.id, email: data.user.email ?? null };
}
