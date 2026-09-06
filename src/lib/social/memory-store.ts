import type { NewPost, PostQuery, SocialEvent, SocialPost, SocialStore } from "./db";

/**
 * The in-memory store the tests run the publisher against.
 *
 * Not a mock: it implements the same interface with the same semantics —
 * the filters in findPosts, the ordering, the upsert — so a test exercises the
 * publisher's decisions rather than a script of expected calls. It also
 * exposes its state, so a test can read the events the publisher logged.
 */
export interface MemoryStore extends SocialStore {
  posts: SocialPost[];
  events: SocialEvent[];
  settings: Map<string, unknown>;
  spend: { ts: string; gbp: number }[];
}

let seq = 0;

export function memoryStore(init: {
  posts?: Partial<SocialPost>[];
  settings?: Record<string, unknown>;
  spend?: { ts: string; gbp: number }[];
} = {}): MemoryStore {
  const posts: SocialPost[] = (init.posts ?? []).map(p => fill(p));
  const events: SocialEvent[] = [];
  const settings = new Map<string, unknown>(Object.entries(init.settings ?? {}));
  const spend = [...(init.spend ?? [])];

  return {
    posts, events, settings, spend,

    async getSetting(key) {
      return settings.has(key) ? settings.get(key) : null;
    },
    async setSetting(key, value) {
      settings.set(key, value);
    },

    async findPosts(q: PostQuery) {
      let rows = posts.filter(p => p.channel === q.channel);
      if (q.status) rows = rows.filter(p => q.status!.includes(p.status));
      if (q.slotDate) rows = rows.filter(p => p.slot_date === q.slotDate);
      if (q.slotBefore) rows = rows.filter(p => p.slot_date !== null && p.slot_date < q.slotBefore!);
      if (q.slotFrom) rows = rows.filter(p => p.slot_date !== null && p.slot_date >= q.slotFrom!);
      if (q.slotTo) rows = rows.filter(p => p.slot_date !== null && p.slot_date <= q.slotTo!);
      if (q.evergreen !== undefined) rows = rows.filter(p => p.evergreen === q.evergreen);
      if (q.publishedSince) rows = rows.filter(p => p.published_at !== null && p.published_at >= q.publishedSince!);
      if (q.orderBy) {
        const k = q.orderBy;
        rows = [...rows].sort((a, b) => {
          const x = a[k], y = b[k];
          if (x === y) return 0;
          if (x === null) return -1;
          if (y === null) return 1;
          return x < y ? -1 : 1;
        });
      }
      if (q.limit) rows = rows.slice(0, q.limit);
      return rows.map(r => ({ ...r }));
    },

    async insertPost(row: NewPost) {
      const full = fill(row);
      posts.push(full);
      return { ...full };
    },

    async updatePost(id, patch) {
      const p = posts.find(x => x.id === id);
      if (!p) throw new Error(`memory store: no post ${id}`);
      Object.assign(p, patch, { updated_at: new Date().toISOString() });
      return { ...p };
    },

    async logEvent(e) {
      events.push({ ...e, id: events.length + 1, ts: new Date().toISOString() });
    },

    async spendSince(iso) {
      return spend.filter(s => s.ts >= iso).reduce((t, s) => t + s.gbp, 0);
    },

    async publishedShaExists(channel, sha) {
      return posts.some(p => p.channel === channel && p.asset_sha256 === sha && p.status === "published");
    },
  };
}

function fill(p: Partial<SocialPost>): SocialPost {
  seq += 1;
  const now = new Date().toISOString();
  return {
    id: p.id ?? `00000000-0000-0000-0000-${String(seq).padStart(12, "0")}`,
    channel: p.channel ?? "instagram",
    slot_date: p.slot_date ?? null,
    format: p.format ?? null,
    asset_url: p.asset_url ?? "https://www.propertyvaultuk.co.uk/reels/day-01-autopsy-1.mp4",
    asset_sha256: p.asset_sha256 ?? null,
    caption: p.caption ?? "",
    status: p.status ?? "queued",
    attempts: p.attempts ?? 0,
    last_error: p.last_error ?? null,
    ig_container_id: p.ig_container_id ?? null,
    ig_media_id: p.ig_media_id ?? null,
    permalink: p.permalink ?? null,
    published_at: p.published_at ?? null,
    evergreen: p.evergreen ?? false,
    last_used_at: p.last_used_at ?? null,
    qc: p.qc ?? null,
    source_refs: p.source_refs ?? null,
    created_at: p.created_at ?? now,
    updated_at: p.updated_at ?? now,
  };
}
