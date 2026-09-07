import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * The store the publisher talks to.
 *
 * Everything in src/lib/social is written against this interface rather than
 * against Supabase, for the same reason lib/instagram.ts takes a fetcher: the
 * publishing sequence has to be testable without a network, and a fake
 * implementing ten methods is a great deal simpler than a fake of the
 * Supabase query builder. memory-store.ts is that fake; supabaseStore() below
 * is the real one, and its own test checks the query it builds for each
 * method rather than what the publisher does with the answer.
 */

export type PostStatus = "queued" | "publishing" | "published" | "failed" | "held" | "skipped";
export type EventLevel = "info" | "warn" | "error";

/** One row of social_posts, as the database returns it. */
export interface SocialPost {
  id: string;
  channel: string;
  /** YYYY-MM-DD, or null for a pool row. */
  slot_date: string | null;
  format: string | null;
  asset_url: string;
  asset_sha256: string | null;
  caption: string;
  status: PostStatus;
  /** Container attempts so far, across runs. */
  attempts: number;
  last_error: string | null;
  ig_container_id: string | null;
  ig_media_id: string | null;
  permalink: string | null;
  published_at: string | null;
  evergreen: boolean;
  last_used_at: string | null;
  /**
   * A day-of copy of a pool row. Keeps the pool row's digest so the
   * duplicate check can see it went out; the uniqueness indexes leave clones
   * alone so that the same pool row can stand in more than once.
   */
  is_clone: boolean;
  qc: unknown;
  source_refs: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

/** What a caller supplies to insert one. Everything else defaults. */
export type NewPost = Pick<SocialPost, "asset_url" | "caption"> &
  Partial<Omit<SocialPost, "id" | "created_at" | "updated_at" | "asset_url" | "caption">>;

export interface SocialEvent {
  id?: number;
  ts?: string;
  post_id: string | null;
  level: EventLevel;
  event: string;
  detail?: Record<string, unknown> | null;
}

/** Filters for findPosts. All optional except the channel; combined with AND. */
export interface PostQuery {
  channel: string;
  status?: PostStatus[];
  slotDate?: string;
  /** slot_date strictly before this day. */
  slotBefore?: string;
  slotFrom?: string;
  slotTo?: string;
  evergreen?: boolean;
  publishedSince?: string;
  orderBy?: "slot_date" | "last_used_at" | "published_at";
  /** Ascending unless said otherwise. Descending puts nulls last. */
  direction?: "asc" | "desc";
  limit?: number;
}

export interface SocialStore {
  /** The JSON value, or null when the key has no row. */
  getSetting(key: string): Promise<unknown>;
  setSetting(key: string, value: unknown): Promise<void>;
  findPosts(q: PostQuery): Promise<SocialPost[]>;
  insertPost(row: NewPost): Promise<SocialPost>;
  updatePost(id: string, patch: Partial<Omit<SocialPost, "id">>): Promise<SocialPost>;
  /**
   * Take the row for publishing, atomically. One statement: set status to
   * 'publishing' only if the row is still in one of the expected statuses
   * with exactly the expected attempt count. The row comes back when this
   * caller won it; null when another run got there first, or the row changed
   * underneath. Two runs in the same evening — which the hourly cron jitter
   * permits — both read the row as queued, and only one of them gets a row
   * back from this.
   */
  claimPost(id: string, expectedStatus: PostStatus[], expectedAttempts: number): Promise<SocialPost | null>;
  logEvent(e: SocialEvent): Promise<void>;
  /** The most recent event with this name, or null if it has never happened. */
  lastEvent(event: string): Promise<SocialEvent | null>;
  /** Total social_spend.gbp on or after the given instant. */
  spendSince(iso: string): Promise<number>;
  /**
   * Whether any published row on the channel carries this digest — clones
   * included, so a pool asset that went out as a stand-in counts as having
   * gone out. With `since`, only publishes on or after that instant.
   */
  publishedShaExists(channel: string, sha: string, since?: string): Promise<boolean>;
}

const POST_COLUMNS = "*";

/**
 * The real store, over the service-role client.
 *
 * Each method is one query. Nothing here decides anything; the decisions are
 * in publisher.ts where they can be tested against the fake.
 */
export function supabaseStore(client: SupabaseClient): SocialStore {
  const fail = (what: string, error: { message: string } | null): never => {
    throw new Error(`social store: ${what}: ${error?.message ?? "unknown error"}`);
  };

  return {
    async getSetting(key) {
      const { data, error } = await client
        .from("social_settings").select("value").eq("key", key).maybeSingle();
      if (error) fail(`read setting ${key}`, error);
      return data ? (data as { value: unknown }).value : null;
    },

    async setSetting(key, value) {
      const { error } = await client
        .from("social_settings")
        .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });
      if (error) fail(`write setting ${key}`, error);
    },

    async findPosts(q) {
      let query = client.from("social_posts").select(POST_COLUMNS).eq("channel", q.channel);
      if (q.status) query = query.in("status", q.status);
      if (q.slotDate) query = query.eq("slot_date", q.slotDate);
      if (q.slotBefore) query = query.lt("slot_date", q.slotBefore);
      if (q.slotFrom) query = query.gte("slot_date", q.slotFrom);
      if (q.slotTo) query = query.lte("slot_date", q.slotTo);
      if (q.evergreen !== undefined) query = query.eq("evergreen", q.evergreen);
      if (q.publishedSince) query = query.gte("published_at", q.publishedSince);
      // Ascending, nulls first, so a pool row never used is picked before any
      // that has been. Descending flips both: newest first, unknowns last.
      if (q.orderBy) {
        const ascending = q.direction !== "desc";
        query = query.order(q.orderBy, { ascending, nullsFirst: ascending });
      }
      if (q.limit) query = query.limit(q.limit);
      const { data, error } = await query;
      if (error) fail("find posts", error);
      return (data ?? []) as SocialPost[];
    },

    async insertPost(row) {
      const { data, error } = await client
        .from("social_posts").insert(row).select(POST_COLUMNS).single();
      if (error) fail("insert post", error);
      return data as SocialPost;
    },

    async updatePost(id, patch) {
      const { data, error } = await client
        .from("social_posts")
        .update({ ...patch, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select(POST_COLUMNS)
        .single();
      if (error) fail(`update post ${id}`, error);
      return data as SocialPost;
    },

    async claimPost(id, expectedStatus, expectedAttempts) {
      // The WHERE is the lock: Postgres evaluates it against the current
      // row under the update's own row lock, so of two concurrent claims
      // exactly one sees the expected status and attempts.
      const { data, error } = await client
        .from("social_posts")
        .update({ status: "publishing", updated_at: new Date().toISOString() })
        .eq("id", id)
        .in("status", expectedStatus)
        .eq("attempts", expectedAttempts)
        .select(POST_COLUMNS);
      if (error) fail(`claim post ${id}`, error);
      const rows = (data ?? []) as SocialPost[];
      return rows.length ? rows[0] : null;
    },

    async logEvent(e) {
      const { error } = await client.from("social_events").insert({
        post_id: e.post_id, level: e.level, event: e.event, detail: e.detail ?? null,
      });
      // A log line that cannot be written must not stop the publish it was
      // describing; but it must not vanish either.
      if (error) console.error(`social store: could not log ${e.event}: ${error.message}`);
    },

    async lastEvent(event) {
      const { data, error } = await client
        .from("social_events").select("*")
        .eq("event", event).order("ts", { ascending: false }).limit(1).maybeSingle();
      if (error) fail(`read last ${event}`, error);
      return (data as SocialEvent | null) ?? null;
    },

    async spendSince(iso) {
      const { data, error } = await client.from("social_spend").select("gbp").gte("ts", iso);
      if (error) fail("read spend", error);
      return ((data ?? []) as { gbp: number | string }[]).reduce((s, r) => s + Number(r.gbp), 0);
    },

    async publishedShaExists(channel, sha, since) {
      let query = client
        .from("social_posts").select("id")
        .eq("channel", channel).eq("asset_sha256", sha).eq("status", "published");
      if (since) query = query.gte("published_at", since);
      const { data, error } = await query.limit(1);
      if (error) fail("check digest", error);
      return (data ?? []).length > 0;
    },
  };
}

/**
 * The store the routes use, or null with a reason when the environment lacks
 * what it needs. Callers turn null into a 500 rather than running without a
 * database — the crons on this site have reported success while doing
 * nothing before, and this layer exists partly so that cannot happen again.
 */
export function storeFromEnv(): { store: SocialStore } | { error: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/^\uFEFF/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.replace(/^\uFEFF/, "");
  if (!url || !key) {
    return { error: "NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not configured — the social queue cannot be read." };
  }
  return { store: supabaseStore(createClient(url, key, { auth: { persistSession: false } })) };
}
