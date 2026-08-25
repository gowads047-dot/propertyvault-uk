/**
 * Wanted board domain logic.
 *
 * Wanted is the one surface that works at zero supply, so most of the rules
 * here are about being honest when there is nothing to show. It is very easy
 * to write "14 landlords will be notified" on a submit screen; it is only true
 * if something actually notifies them, and nothing does yet.
 */

export const WANTED_KINDS = ["room", "whole_property", "supported_placement"] as const;
export type WantedKind = (typeof WANTED_KINDS)[number];

export const KIND_LABEL: Record<WantedKind, string> = {
  room: "A room",
  whole_property: "A whole property",
  supported_placement: "A supported accommodation placement",
};

export type WantedChannel = "public" | "landlords_only";
export type WantedStatus = "open" | "fulfilled" | "closed";

export interface WantedPost {
  id: string;
  kind: WantedKind;
  areaText: string;
  budgetMaxPcm: number | null;
  neededFrom: string | null;
  detail: string | null;
  channel: WantedChannel;
  status: WantedStatus;
  expiresAt: string;
  createdAt: string;
  isMine: boolean;
}

/**
 * A provider saying they need to place someone is saying something about a
 * vulnerable person's circumstances, however obliquely. That is never a public
 * post, and it is not left to whoever fills the form to remember.
 */
export function defaultChannel(kind: WantedKind): WantedChannel {
  return kind === "supported_placement" ? "landlords_only" : "public";
}

/** Only an open, unexpired post is on the board. */
export function isLive(post: Pick<WantedPost, "status" | "expiresAt">, now: Date): boolean {
  return post.status === "open" && new Date(post.expiresAt).getTime() > now.getTime();
}

const DAY_MS = 86_400_000;

export function daysUntilExpiry(post: Pick<WantedPost, "expiresAt">, now: Date): number {
  return Math.ceil((new Date(post.expiresAt).getTime() - now.getTime()) / DAY_MS);
}

/**
 * Shown to the author only. A wanted post that outlives the need wastes the
 * reply of whoever answers it, so the countdown is visible rather than the
 * post quietly vanishing one day.
 */
export function expiryLabel(post: Pick<WantedPost, "status" | "expiresAt">, now: Date): string {
  if (post.status === "fulfilled") return "Fulfilled";
  if (post.status === "closed") return "Closed";
  const days = daysUntilExpiry(post, now);
  if (days <= 0) return "Expired";
  if (days === 1) return "Expires tomorrow";
  if (days <= 14) return `Expires in ${days} days`;
  return `Expires in ${Math.round(days / 7)} weeks`;
}

export function postedLabel(post: Pick<WantedPost, "createdAt">, now: Date): string {
  const mins = Math.floor((now.getTime() - new Date(post.createdAt).getTime()) / 60_000);
  if (mins < 60) return mins <= 1 ? "just now" : `${mins} minutes ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days < 31) return `${days} day${days === 1 ? "" : "s"} ago`;
  const months = Math.floor(days / 30);
  return `${months} month${months === 1 ? "" : "s"} ago`;
}

/** The fields a wanted post cannot be posted without. */
export function validate(input: {
  kind: string;
  areaText: string;
  budgetMaxPcm: string | number | null;
}): { ok: true } | { ok: false; field: string; message: string } {
  if (!WANTED_KINDS.includes(input.kind as WantedKind)) {
    return { ok: false, field: "kind", message: "Choose what you are looking for." };
  }
  if (!input.areaText || !input.areaText.trim()) {
    return { ok: false, field: "areaText", message: "Add an area, even roughly — “near the QE” is fine." };
  }
  if (input.budgetMaxPcm !== null && input.budgetMaxPcm !== "") {
    const n = Number(input.budgetMaxPcm);
    if (!Number.isFinite(n) || n < 0) {
      return { ok: false, field: "budgetMaxPcm", message: "Budget must be a number, or leave it blank." };
    }
  }
  return { ok: true };
}

/** A live room somebody could answer a wanted post with. */
export interface MatchableSpace {
  spaceId: string;
  label: string;
  rentPcm: number | null;
  city: string;
  postcode: string;
  areaLabel: string;
}

/**
 * Deliberately crude, and only ever used to show the poster what already
 * exists. Budget is a hard filter because being shown rooms you cannot afford
 * is worse than being shown none; place is a loose text overlap because
 * "Selly Oak" and "B29" and "near the QE" all describe the same square mile
 * and none of them match each other.
 *
 * Proper place matching arrives with the place tree and PostGIS. Until then it
 * is better to under-match and say so than to pad the list.
 */
export function matches(post: Pick<WantedPost, "areaText" | "budgetMaxPcm">, space: MatchableSpace): boolean {
  if (post.budgetMaxPcm !== null && space.rentPcm !== null && space.rentPcm > post.budgetMaxPcm) {
    return false;
  }
  const needle = post.areaText.toLowerCase();
  const words = needle.split(/[^a-z0-9]+/).filter(w => w.length >= 3);
  const hay = `${space.city} ${space.postcode} ${space.areaLabel}`.toLowerCase();
  return words.some(w => hay.includes(w)) || hay.split(/[^a-z0-9]+/).some(h => h.length >= 3 && needle.includes(h));
}

export function findMatches(post: Pick<WantedPost, "areaText" | "budgetMaxPcm">, spaces: MatchableSpace[]): MatchableSpace[] {
  return spaces.filter(s => matches(post, s));
}

/**
 * What to tell somebody who has just posted.
 *
 * The tempting copy here is "we'll alert landlords in your area". There is no
 * alerting yet, so this says only what is true: how many rooms exist right
 * now, and that the post is visible to landlords. When notifications are
 * built, this is the one place that has to change.
 */
export function matchSummary(count: number, channel: WantedChannel): string {
  const audience = channel === "landlords_only"
    ? "Landlords and providers on Makan can see it."
    : "It is on the public board now.";
  if (count === 0) {
    return `No rooms on Makan match this yet. ${audience}`;
  }
  if (count === 1) {
    return `1 room on Makan already matches. ${audience}`;
  }
  return `${count} rooms on Makan already match. ${audience}`;
}

/** Row shape returned by the board query. */
export interface WantedQueryRow {
  id: string;
  kind: WantedKind;
  area_text: string;
  budget_max_pcm: number | null;
  needed_from: string | null;
  detail: string | null;
  channel: WantedChannel;
  status: WantedStatus;
  expires_at: string;
  created_at: string;
  created_by: string;
}

export function toPosts(rows: WantedQueryRow[], currentUserId: string | null): WantedPost[] {
  return rows.map(r => ({
    id: r.id,
    kind: r.kind,
    areaText: r.area_text,
    budgetMaxPcm: r.budget_max_pcm,
    neededFrom: r.needed_from,
    detail: r.detail,
    channel: r.channel,
    status: r.status,
    expiresAt: r.expires_at,
    createdAt: r.created_at,
    isMine: currentUserId !== null && r.created_by === currentUserId,
  }));
}

/**
 * Live posts first, newest first within that. An author's own closed posts sort
 * last rather than disappearing, so "where did my post go" has an answer.
 */
export function sortPosts(posts: WantedPost[], now: Date): WantedPost[] {
  return [...posts].sort((a, b) => {
    const liveA = isLive(a, now) ? 0 : 1;
    const liveB = isLive(b, now) ? 0 : 1;
    if (liveA !== liveB) return liveA - liveB;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}
