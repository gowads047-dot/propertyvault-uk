/**
 * What a caller is allowed to put in an email we send.
 *
 * Several routes took a recipient address and a fragment of subject line
 * straight from the request body and handed both to Resend, on a From of
 * info@propertyvaultuk.co.uk. Nothing checked that the recipient was one
 * address, and nothing checked what went in the subject.
 *
 * The exposure is not the send quota. It is that anyone could put a message
 * of their choosing into a stranger's inbox, from a domain that has spent time
 * earning the right to be delivered. A blocklisting is much harder to undo
 * than a bill.
 */

/**
 * One well-formed address, or null.
 *
 * Deliberately strict rather than RFC-complete: the addresses this app sends
 * to are ordinary ones people type into a form, and the exotic corners of the
 * spec are where injection lives. Anything with whitespace, a comma or a
 * semicolon is refused outright — those are how one recipient becomes several.
 */
export function validRecipient(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const address = v.trim().toLowerCase();

  if (address.length === 0 || address.length > 254) return null;
  // A newline in a header is the classic injection; a comma or semicolon turns
  // one recipient into a list.
  if (/[\s,;<>"\\]/.test(address)) return null;

  const at = address.indexOf("@");
  if (at < 1 || at !== address.lastIndexOf("@")) return null;

  const local = address.slice(0, at);
  const domain = address.slice(at + 1);
  if (local.length > 64 || domain.length < 3) return null;
  if (!/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+$/.test(local)) return null;
  if (local.startsWith(".") || local.endsWith(".") || local.includes("..")) return null;
  if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/.test(domain)) return null;

  return address;
}

/**
 * Caller-supplied text that ends up in a subject line.
 *
 * Control characters are removed rather than escaped, because there is no
 * legitimate reason for one to appear in a property address or a first name,
 * and a newline in a subject is how a header becomes two.
 */
export function safeHeaderText(v: unknown, maxLength = 80): string {
  if (typeof v !== "string") return "";
  return v
    .replace(/[\u0000-\u001F\u007F]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}
