/**
 * Who is allowed into the admin pages. SERVER ONLY.
 *
 * Do not import this from a client component, and do not rename the variable
 * to NEXT_PUBLIC_ADMIN_EMAIL. Next inlines every NEXT_PUBLIC_ value into the
 * browser bundle, so that spelling publishes the owner's personal address to
 * anyone who opens devtools — which is what the previous arrangement did, via
 * three hardcoded constants sitting in client components.
 *
 * Deliberately no fallback. A gate that defaults to a value baked into the
 * shipped code is worse than one that refuses to open, so an unset ADMIN_EMAIL
 * denies everyone.
 */
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "";

/** Is this signed-in address the admin? Denies everyone when unconfigured. */
export function isAdmin(email: string | null | undefined): boolean {
  if (!ADMIN_EMAIL) return false;
  return (email ?? "").trim().toLowerCase() === ADMIN_EMAIL.trim().toLowerCase();
}
