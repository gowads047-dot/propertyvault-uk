import { supabase } from "@/lib/supabase";

/**
 * Tenant issue attachments. The tenant is not a Supabase user (the portal
 * runs on an invite token), so the browser asks /api/tenant/upload/ for a
 * signed slot and puts the file straight into storage with it — the file
 * never passes through a function, so a video of a leak fits.
 */
export const BUCKET = "tenant-attachments";
export const MAX_BYTES = 50 * 1024 * 1024;
export const ALLOWED: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/heic": "heic",
  "video/mp4": "mp4",
  "video/quicktime": "mov",
  "video/webm": "webm",
  "application/pdf": "pdf",
};

export type Attachment = { url: string; name: string; type: string };

/** Uploads one file, or throws with a message fit to show the tenant. */
export async function uploadTenantAttachment(token: string, file: File): Promise<Attachment> {
  const res = await fetch("/api/tenant/upload/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, type: file.type, size: file.size }),
  });
  const json = (await res.json().catch(() => ({}))) as { path?: string; uploadToken?: string; url?: string; error?: string };
  if (!res.ok || !json.path || !json.uploadToken || !json.url) {
    throw new Error(json.error || `Could not upload ${file.name}.`);
  }
  const { error } = await supabase.storage
    .from(BUCKET)
    .uploadToSignedUrl(json.path, json.uploadToken, file, { contentType: file.type });
  if (error) throw new Error(`Could not upload ${file.name}. Please try again.`);
  return { url: json.url, name: file.name, type: file.type };
}
