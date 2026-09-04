import { CONTACT_EMAIL } from "./site";

/**
 * Who is allowed into the admin pages. SERVER ONLY.
 *
 * Do not import this from a client component, and do not rename the variable
 * to NEXT_PUBLIC_ADMIN_EMAIL. Next inlines every NEXT_PUBLIC_ value into the
 * browser bundle, so that spelling publishes the owner's address to anyone who
 * opens devtools — which is what the previous arrangement did, via three
 * hardcoded constants sitting in client components.
 *
 * ── Why there is now a fallback ────────────────────────────────────────────
 *
 * This used to have none, on the reasoning that a gate defaulting to a
 * baked-in value is worse than one that refuses to open. That reasoning does
 * not survive contact with the facts here: the fallback is CONTACT_EMAIL,
 * which is already printed on the contact page and in the From line of every
 * email this application sends. Defaulting to it publishes nothing that was
 * not public, and the gate still opens only for somebody signed in as that
 * address — which needs the password and the mailbox.
 *
 * What the old arrangement did cost was real. ADMIN_EMAIL was unset, so the
 * admin pages denied everyone including the owner, silently, and the only
 * symptom was a feature that did not work.
 *
 * The variable still wins if it is set, so a different address can be used
 * without touching this file.
 */
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL?.trim() || CONTACT_EMAIL;

/** Is this signed-in address the admin? Denies everyone when unconfigured. */
export function isAdmin(email: string | null | undefined): boolean {
  if (!ADMIN_EMAIL) return false;
  return (email ?? "").trim().toLowerCase() === ADMIN_EMAIL.trim().toLowerCase();
}
