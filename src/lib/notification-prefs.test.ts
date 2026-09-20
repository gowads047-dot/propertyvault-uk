import { describe, it, expect, vi } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import { DEFAULT_PREFS, usersWhoWant, wants } from "./notification-prefs";

function client(rows: { user_id: string; notification_preferences: Record<string, unknown> | null }[], error: { message: string } | null = null) {
  const inFn = vi.fn(async () => ({ data: rows, error }));
  const sb = { from: () => ({ select: () => ({ in: inFn }) }) } as unknown as SupabaseClient;
  return { sb, inFn };
}

describe("notification preferences", () => {
  it("defaults: the two cron-driven reminders are on, the rest off", () => {
    expect(DEFAULT_PREFS.compliance_expiry).toBe(true);
    expect(DEFAULT_PREFS.rent_reminders).toBe(true);
    expect(DEFAULT_PREFS.weekly_digest).toBe(false);
    expect(wants(null, "rent_reminders")).toBe(true);
    expect(wants({}, "rent_reminders")).toBe(true);
    expect(wants({ rent_reminders: false }, "rent_reminders")).toBe(false);
    expect(wants({ rent_reminders: "no" }, "rent_reminders")).toBe(true); // not a boolean: default
  });

  it("drops the landlord who turned the toggle off and keeps the ones who did not, in one query", async () => {
    const { sb, inFn } = client([
      { user_id: "off", notification_preferences: { rent_reminders: false, compliance_expiry: true } },
      { user_id: "on", notification_preferences: { rent_reminders: true } },
      { user_id: "never-saved", notification_preferences: null },
    ]);
    const want = await usersWhoWant(sb, ["off", "on", "never-saved", "no-row", "on"], "rent_reminders");
    expect([...want].sort()).toEqual(["never-saved", "no-row", "on"]);
    expect(inFn).toHaveBeenCalledTimes(1);
    expect(inFn).toHaveBeenCalledWith("user_id", ["off", "on", "never-saved", "no-row"]);
  });

  it("with nobody to ask, asks nothing", async () => {
    const { sb, inFn } = client([]);
    expect((await usersWhoWant(sb, [], "compliance_expiry")).size).toBe(0);
    expect(inFn).not.toHaveBeenCalled();
  });

  it("when the read fails, sends with the defaults rather than dropping every reminder", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const { sb } = client([], { message: "connection refused" });
    expect([...(await usersWhoWant(sb, ["a"], "compliance_expiry"))]).toEqual(["a"]);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
