import { supabase } from "@/lib/supabase";

/**
 * Rentura documents live in the private `rentura-docs` bucket (tenancy
 * agreements, IDs, mortgage offers — nothing to be public). The upload code
 * stored getPublicUrl() as file_url, and a public URL into a private bucket
 * answers 400 for everyone, owner included: the View link never opened a
 * document. The stored URL still names the object, so it is kept as the
 * locator and a short-lived signed URL is minted when the owner clicks.
 */
export const BUCKET = "rentura-docs";
const SIGNED_URL_SECONDS = 10 * 60;

/** The object path inside the bucket, from the URL the row stores. */
export function docPath(fileUrl: string): string | null {
  const i = fileUrl.indexOf(`${BUCKET}/`);
  if (i < 0) return null;
  const path = fileUrl.slice(i + BUCKET.length + 1).replace(/[?#].*$/, "");
  return path ? decodeURIComponent(path) : null;
}

/** A URL the owner can open for the next ten minutes, or null with the reason logged. */
export async function signedDocUrl(fileUrl: string): Promise<string | null> {
  const path = docPath(fileUrl);
  if (!path) return null;
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(path, SIGNED_URL_SECONDS);
  if (error || !data?.signedUrl) {
    console.error("rentura-docs: could not sign", path, error?.message);
    return null;
  }
  return data.signedUrl;
}

/**
 * Opens the document in a new tab. The tab is opened before the await so
 * Safari does not count the later navigation as a pop-up; if the browser
 * refused the tab, the current one navigates instead.
 */
export async function openDocument(fileUrl: string): Promise<boolean> {
  // Not "noopener" in the features: window.open returns null with it, and
  // the handle is what the signed URL is assigned to. Severed by hand below.
  const tab = typeof window !== "undefined" ? window.open("", "_blank") : null;
  if (tab) tab.opener = null;
  const url = await signedDocUrl(fileUrl);
  if (!url) {
    tab?.close();
    return false;
  }
  if (tab) tab.location.href = url;
  else window.location.assign(url);
  return true;
}
