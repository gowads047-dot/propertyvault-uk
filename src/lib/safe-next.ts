/**
 * Where to send someone after they sign in, from a `?next=` parameter.
 *
 * The auth page took the parameter as given and handed it to
 * router.replace(), which follows an absolute URL to another site. So
 * /rentura/auth?next=https://evil.example was a sign-in page that, once the
 * password was accepted, delivered the person to whoever wrote the link —
 * an open redirect, the last step of a phishing flow. Only a path on this
 * site is followed now; anything else falls back to the default.
 */
export function safeNext(candidate: string | null | undefined, fallback: string): string {
  if (typeof candidate !== "string") return fallback;
  const v = candidate.trim();
  // One leading slash, then not another slash or backslash: "//evil.example"
  // and "/\evil.example" are both read by browsers as a different host.
  if (!/^\/(?![/\\])/.test(v)) return fallback;
  // Nothing a browser could take for a scheme or a host, and no control
  // characters (a newline is how a header becomes two).
  if (/[\x00-\x1f\x7f]/.test(v)) return fallback;
  if (/^\/[^/?#]*:/.test(v)) return fallback;
  return v;
}
