import { describe, it, expect, vi } from "vitest";
import { findUserIdByEmail, periodEndIso, periodEndSeconds } from "./stripe-subscription";
import type { SupabaseClient } from "@supabase/supabase-js";

describe("periodEnd", () => {
  it("reads the item-level field Stripe has used since 2025-03-31", () => {
    const sub = { items: { data: [{ current_period_end: 1_800_000_000 }] } };
    expect(periodEndSeconds(sub)).toBe(1_800_000_000);
    expect(periodEndIso(sub)).toBe("2027-01-15T08:00:00.000Z");
  });

  it("falls back to the subscription-level field an older endpoint version sends", () => {
    expect(periodEndSeconds({ current_period_end: 1_700_000_000, items: { data: [{}] } })).toBe(1_700_000_000);
  });

  it("is null, not the epoch, when neither is there", () => {
    expect(periodEndSeconds({})).toBeNull();
    expect(periodEndIso({ items: { data: [] } })).toBeNull();
  });
});

describe("findUserIdByEmail", () => {
  function directory(users: { id: string; email: string }[]) {
    const listUsers = vi.fn(async ({ page, perPage }: { page: number; perPage: number }) => ({
      data: { users: users.slice((page - 1) * perPage, page * perPage) },
      error: null,
    }));
    return { client: { auth: { admin: { listUsers } } } as unknown as SupabaseClient, listUsers };
  }

  it("finds a user past the first page, and ignores case", async () => {
    // 1,004 strangers, then the one we want on page two.
    const many = Array.from({ length: 1004 }, (_, i) => ({ id: `u${i}`, email: `stranger${i}@example.com` }));
    many.push({ id: "wanted", email: "jane_doe@email.com" });
    const { client, listUsers } = directory(many);
    expect(await findUserIdByEmail(client, "jane_doe@email.com".toUpperCase())).toBe("wanted");
    expect(listUsers).toHaveBeenCalledTimes(2);
  });

  it("gives up cleanly when nobody matches", async () => {
    const { client } = directory([{ id: "u1", email: "landlord@email.com" }]);
    expect(await findUserIdByEmail(client, "tenant@email.com")).toBeNull();
  });
});
