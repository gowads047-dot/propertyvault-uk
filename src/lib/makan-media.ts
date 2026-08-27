/**
 * Photos for a listing.
 *
 * The brief was "when a landlord uploads photos they get turned into reels or
 * swipe photos". This builds the swipe half honestly: a full-bleed, swipeable
 * gallery that behaves like the media people already use, from photos the
 * landlord actually uploaded. It does not generate video, add music, or invent
 * frames, and nothing in the UI calls it a reel — a listing that promises a
 * video tour and delivers a slideshow is the same broken promise as a room
 * that went last month and still says available.
 *
 * The makan_media table and its RLS already existed and are unchanged. What
 * was missing was somewhere to put the file and the rules around it.
 */

/** What the browser will accept. HEIC is deliberately absent: Safari uploads it
 *  happily and every other browser then refuses to render it. */
export const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export const ACCEPT_ATTR = ACCEPTED_TYPES.join(",");

/** Per space. Enough for a whole property, few enough to stay swipeable. */
export const MAX_PHOTOS = 20;

/** 10 MB. A modern phone photo is 2–5 MB; anything past this is a mistake. */
export const MAX_BYTES = 10 * 1024 * 1024;

export const BUCKET = "makan-media";

export interface MediaItem {
  id: string;
  url: string;
  caption: string | null;
  sortOrder: number;
}

export interface MediaQueryRow {
  id: string;
  url: string;
  caption: string | null;
  sort_order: number;
}

export function toMedia(rows: MediaQueryRow[]): MediaItem[] {
  return rows
    .map(r => ({ id: r.id, url: r.url, caption: r.caption, sortOrder: r.sort_order }))
    .sort((a, b) => a.sortOrder - b.sortOrder || a.id.localeCompare(b.id));
}

export type FileCheck = { ok: true } | { ok: false; message: string };

/**
 * Checked before upload, not after. A landlord who picks eleven photos and is
 * told about the limit once the eleventh has finished uploading has been made
 * to wait for a refusal.
 */
export function checkFile(file: { name: string; type: string; size: number }): FileCheck {
  if (!(ACCEPTED_TYPES as readonly string[]).includes(file.type)) {
    return {
      ok: false,
      message: `${file.name} is not a JPEG, PNG or WebP. If it came from an iPhone, set Camera → Formats to Most Compatible.`,
    };
  }
  if (file.size > MAX_BYTES) {
    const mb = (file.size / 1024 / 1024).toFixed(1);
    return { ok: false, message: `${file.name} is ${mb} MB. The limit is ${MAX_BYTES / 1024 / 1024} MB.` };
  }
  if (file.size === 0) {
    return { ok: false, message: `${file.name} is empty.` };
  }
  return { ok: true };
}

/** How many more this space can take. Never negative. */
export function remainingSlots(current: number): number {
  return Math.max(0, MAX_PHOTOS - current);
}

export type Selection = { accepted: File[]; rejected: string[] };

/**
 * Split a picked batch into what can be uploaded and what cannot, with a
 * reason for each refusal. Partial success on purpose: eight good photos and
 * one HEIC should upload eight photos, not fail the batch.
 */
export function triage(files: File[], currentCount: number): Selection {
  const accepted: File[] = [];
  const rejected: string[] = [];
  let room = remainingSlots(currentCount);

  for (const f of files) {
    const check = checkFile(f);
    if (!check.ok) { rejected.push(check.message); continue; }
    if (room === 0) {
      rejected.push(`${f.name} was not added — a listing can hold ${MAX_PHOTOS} photos.`);
      continue;
    }
    accepted.push(f);
    room--;
  }
  return { accepted, rejected };
}

const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

/**
 * Where the file lives in the bucket.
 *
 * Keyed by space so the storage policy can check ownership from the path
 * alone, and suffixed with a random token so two photos named IMG_0001.jpg
 * from two different phones cannot overwrite each other. The original
 * filename is deliberately not used: it is attacker-controlled, and it often
 * carries the landlord's own name.
 */
export function storagePath(spaceId: string, mime: string, token: string): string {
  const ext = EXT[mime] ?? "bin";
  return `${spaceId}/${token}.${ext}`;
}

/** A URL-safe token. Passed in rather than generated so callers can seed it. */
export function mediaToken(random: () => number = Math.random): string {
  return Array.from({ length: 16 }, () =>
    "abcdefghijklmnopqrstuvwxyz0123456789"[Math.floor(random() * 36)]
  ).join("");
}

/**
 * Next sort_order. Appends rather than inserting, because a landlord adding
 * three more photos expects them after the ones already there.
 */
export function nextSortOrder(items: Pick<MediaItem, "sortOrder">[]): number {
  return items.length === 0 ? 0 : Math.max(...items.map(i => i.sortOrder)) + 1;
}

/**
 * Move one photo to a new position and renumber from zero.
 *
 * Renumbering matters: sort_order values drift apart as photos are added and
 * removed, and two photos sharing an order makes the gallery order depend on
 * whatever Postgres returns first.
 */
export function reorder(items: MediaItem[], from: number, to: number): MediaItem[] {
  if (from === to || from < 0 || to < 0 || from >= items.length || to >= items.length) {
    return items.map((it, i) => ({ ...it, sortOrder: i }));
  }
  const next = [...items];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next.map((it, i) => ({ ...it, sortOrder: i }));
}

/** The photo a search result shows. */
export function coverOf(items: MediaItem[]): MediaItem | null {
  return items.length > 0 ? items[0] : null;
}

/**
 * Wrap-around index for the swipe gallery.
 *
 * Wrapping rather than stopping at the ends: a gallery that silently refuses
 * to advance reads as broken, and with three photos the loop is short enough
 * that nobody loses their place.
 */
export function stepIndex(current: number, delta: number, total: number): number {
  if (total <= 0) return 0;
  return ((current + delta) % total + total) % total;
}

/** "3 of 12" — stated plainly so the gallery says how much is left. */
export function positionLabel(index: number, total: number): string {
  return total === 0 ? "" : `${index + 1} of ${total}`;
}

/**
 * A swipe only counts past a threshold, so a tap that drifts a few pixels does
 * not change the photo. 48px is about a thumb's width of deliberate movement.
 */
export const SWIPE_THRESHOLD = 48;

export function swipeDelta(startX: number, endX: number, threshold = SWIPE_THRESHOLD): -1 | 0 | 1 {
  const dx = endX - startX;
  if (Math.abs(dx) < threshold) return 0;
  return dx < 0 ? 1 : -1;
}
