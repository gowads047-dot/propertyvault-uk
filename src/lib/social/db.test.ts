import { describe, it, expect } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import { supabaseStore } from "./db";

/**
 * The real store, against a recording stand-in for the Supabase client.
 *
 * These do not test Postgres — social-schema.test.ts does that with PGlite —
 * and they do not test the publisher, which runs against memory-store.ts.
 * They test the one thing in between: that each store method turns into the
 * query it should, with the filters it should, and turns an error into a
 * thrown exception rather than a silent empty result.
 */

type Call = [string, unknown[]];

/** A chainable recorder. Every method logs itself; awaiting yields the canned answer. */
function fakeClient(answer: { data?: unknown; error?: { message: string } | null } = { data: [], error: null }) {
  const calls: Call[] = [];
  const chain: Record<string, unknown> = {};
  const methods = ["select", "insert", "update", "upsert", "eq", "in", "lt", "lte", "gte", "order", "limit", "single", "maybeSingle"];
  for (const m of methods) {
    chain[m] = (...args: unknown[]) => { calls.push([m, args]); return chain; };
  }
  chain.then = (resolve: (v: unknown) => void) => resolve(answer);
  const client = { from: (table: string) => { calls.push(["from", [table]]); return chain; } };
  return { client: client as unknown as SupabaseClient, calls };
}

const has = (calls: Call[], name: string, ...args: unknown[]) =>
  calls.some(([n, a]) => n === name && JSON.stringify(a) === JSON.stringify(args));

describe("settings", () => {
  it("reads one key's value, or null when there is no row", async () => {
    const { client, calls } = fakeClient({ data: { value: true }, error: null });
    expect(await supabaseStore(client).getSetting("paused")).toBe(true);
    expect(has(calls, "from", "social_settings")).toBe(true);
    expect(has(calls, "eq", "key", "paused")).toBe(true);
    expect(has(calls, "maybeSingle")).toBe(true);

    const empty = fakeClient({ data: null, error: null });
    expect(await supabaseStore(empty.client).getSetting("paused")).toBeNull();
  });

  it("upserts on the key, so a first write and a later one are the same call", async () => {
    const { client, calls } = fakeClient({ error: null });
    await supabaseStore(client).setSetting("paused", true);
    const [, args] = calls.find(([n]) => n === "upsert")!;
    expect(args[0]).toMatchObject({ key: "paused", value: true });
    expect(args[1]).toEqual({ onConflict: "key" });
  });
});

describe("finding posts", () => {
  it("always scopes to the channel", async () => {
    const { client, calls } = fakeClient();
    await supabaseStore(client).findPosts({ channel: "instagram" });
    expect(has(calls, "from", "social_posts")).toBe(true);
    expect(has(calls, "eq", "channel", "instagram")).toBe(true);
    expect(calls.filter(([n]) => n !== "from" && n !== "select" && n !== "eq")).toEqual([]);
  });

  it("maps each filter onto the matching PostgREST operator", async () => {
    const { client, calls } = fakeClient();
    await supabaseStore(client).findPosts({
      channel: "instagram", status: ["queued", "failed"], slotDate: "2026-09-07", slotBefore: "2026-09-08",
      slotFrom: "2026-09-01", slotTo: "2026-09-30", evergreen: false, publishedSince: "2026-09-01T00:00:00Z",
      orderBy: "last_used_at", limit: 1,
    });
    expect(has(calls, "in", "status", ["queued", "failed"])).toBe(true);
    expect(has(calls, "eq", "slot_date", "2026-09-07")).toBe(true);
    expect(has(calls, "lt", "slot_date", "2026-09-08")).toBe(true);
    expect(has(calls, "gte", "slot_date", "2026-09-01")).toBe(true);
    expect(has(calls, "lte", "slot_date", "2026-09-30")).toBe(true);
    expect(has(calls, "eq", "evergreen", false)).toBe(true);
    expect(has(calls, "gte", "published_at", "2026-09-01T00:00:00Z")).toBe(true);
    // Nulls first: a pool row never used comes before any that has been.
    expect(has(calls, "order", "last_used_at", { ascending: true, nullsFirst: true })).toBe(true);
    expect(has(calls, "limit", 1)).toBe(true);
  });

  // evergreen: false is a filter. A truthiness check would drop it.
  it("does not confuse evergreen:false with no evergreen filter", async () => {
    const { client, calls } = fakeClient();
    await supabaseStore(client).findPosts({ channel: "instagram" });
    expect(calls.some(([n, a]) => n === "eq" && a[0] === "evergreen")).toBe(false);
  });

  it("throws on an error rather than returning an empty queue", async () => {
    const { client } = fakeClient({ data: null, error: { message: "relation does not exist" } });
    await expect(supabaseStore(client).findPosts({ channel: "instagram" })).rejects.toThrow(/relation does not exist/);
  });
});

describe("writing posts", () => {
  it("inserts and returns the stored row", async () => {
    const row = { id: "p1", asset_url: "u", caption: "c" };
    const { client, calls } = fakeClient({ data: row, error: null });
    const r = await supabaseStore(client).insertPost({ asset_url: "u", caption: "c" });
    expect(r).toEqual(row);
    expect(has(calls, "insert", { asset_url: "u", caption: "c" })).toBe(true);
    expect(has(calls, "single")).toBe(true);
  });

  it("updates by id and bumps updated_at", async () => {
    const { client, calls } = fakeClient({ data: { id: "p1" }, error: null });
    await supabaseStore(client).updatePost("p1", { status: "held" });
    const [, args] = calls.find(([n]) => n === "update")!;
    expect(args[0]).toMatchObject({ status: "held", updated_at: expect.any(String) });
    expect(has(calls, "eq", "id", "p1")).toBe(true);
  });

  it("names the post in an update error", async () => {
    const { client } = fakeClient({ data: null, error: { message: "boom" } });
    await expect(supabaseStore(client).updatePost("p1", {})).rejects.toThrow(/update post p1: boom/);
  });
});

describe("events, spend and digests", () => {
  it("writes an event with a null detail when none is given", async () => {
    const { client, calls } = fakeClient({ error: null });
    await supabaseStore(client).logEvent({ post_id: null, level: "info", event: "x" });
    expect(has(calls, "from", "social_events")).toBe(true);
    expect(has(calls, "insert", { post_id: null, level: "info", event: "x", detail: null })).toBe(true);
  });

  it("sums spend since an instant, coping with numeric coming back as a string", async () => {
    const { client, calls } = fakeClient({ data: [{ gbp: "12.50" }, { gbp: 7 }], error: null });
    expect(await supabaseStore(client).spendSince("2026-09-01T00:00:00Z")).toBe(19.5);
    expect(has(calls, "gte", "ts", "2026-09-01T00:00:00Z")).toBe(true);
  });

  it("only counts a digest as used when the row is published", async () => {
    const { client, calls } = fakeClient({ data: [{ id: "p" }], error: null });
    expect(await supabaseStore(client).publishedShaExists("instagram", "abc")).toBe(true);
    expect(has(calls, "eq", "asset_sha256", "abc")).toBe(true);
    expect(has(calls, "eq", "status", "published")).toBe(true);
  });
});
