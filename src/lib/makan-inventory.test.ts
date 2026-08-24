import { describe, it, expect } from "vitest";
import {
  SPACE_STATUSES,
  STATUS_LABEL,
  groupOf,
  isOnMarket,
  daysSince,
  needsConfirmation,
  freshnessLabel,
  summarise,
  filterRows,
  sortRows,
  shouldOfferPublish,
  visibilityLabel,
  toRows,
  isMissingTable,
  STALE_AFTER_DAYS,
  type InventoryRow,
  type SpaceStatus,
  type SpaceQueryRow,
} from "./makan-inventory";

const NOW = new Date("2026-08-24T12:00:00Z");
const daysAgo = (n: number) => new Date(NOW.getTime() - n * 86_400_000).toISOString();
const hoursAgo = (n: number) => new Date(NOW.getTime() - n * 3_600_000).toISOString();

function row(over: Partial<InventoryRow> = {}): InventoryRow {
  return {
    spaceId: "s1",
    label: "Room 1",
    unitLabel: "Whole house",
    buildingId: "b1",
    buildingLabel: "12 Chapel St, B29 6AA",
    rentPcm: 650,
    billsIncluded: true,
    status: "available_now",
    availableFrom: null,
    statusConfirmedAt: hoursAgo(2),
    listedPublicly: false,
    listedPrivately: false,
    ...over,
  };
}

describe("status model", () => {
  it("groups every status", () => {
    for (const s of SPACE_STATUSES) {
      expect(groupOf(s), s).toBeTruthy();
      expect(STATUS_LABEL[s], s).toBeTruthy();
    }
  });

  // Nagging someone about a room that is occupied and staying occupied trains
  // them to ignore the amber marker, which is the one thing that must not
  // happen.
  it("only treats on-market statuses as needing confirmation", () => {
    const onMarket = SPACE_STATUSES.filter(isOnMarket);
    expect(onMarket).toEqual([
      "available_now",
      "available_from",
      "notice_given",
      "reserved",
      "assessment_pending",
    ]);
  });

  it("does not flag a long-standing occupied room as stale", () => {
    expect(needsConfirmation(row({ status: "occupied", statusConfirmedAt: daysAgo(400) }), NOW)).toBe(false);
  });

  it("flags an available room unconfirmed for a month", () => {
    expect(needsConfirmation(row({ statusConfirmedAt: daysAgo(STALE_AFTER_DAYS) }), NOW)).toBe(true);
    expect(needsConfirmation(row({ statusConfirmedAt: daysAgo(STALE_AFTER_DAYS - 1) }), NOW)).toBe(false);
  });

  it("counts whole days since a timestamp", () => {
    expect(daysSince(daysAgo(3), NOW)).toBe(3);
    expect(daysSince(hoursAgo(23), NOW)).toBe(0);
  });
});

describe("freshnessLabel", () => {
  it.each([
    [hoursAgo(0), "just now"],
    [new Date(NOW.getTime() - 5 * 60_000).toISOString(), "5 min ago"],
    [hoursAgo(1), "1 hour ago"],
    [hoursAgo(2), "2 hours ago"],
    [daysAgo(1), "1 day ago"],
    [daysAgo(9), "9 days ago"],
    [daysAgo(90), "3 months ago"],
  ])("renders %s as %s", (iso, expected) => {
    expect(freshnessLabel(iso, NOW)).toBe(expected);
  });
});

describe("summarise", () => {
  it("counts each group and the stale total", () => {
    const rows = [
      row({ spaceId: "1", status: "available_now" }),
      row({ spaceId: "2", status: "available_from" }),
      row({ spaceId: "3", status: "notice_given" }),
      row({ spaceId: "4", status: "reserved" }),
      row({ spaceId: "5", status: "assessment_pending" }),
      row({ spaceId: "6", status: "occupied" }),
      row({ spaceId: "7", status: "maintenance" }),
      row({ spaceId: "8", status: "offline" }),
      row({ spaceId: "9", status: "available_now", statusConfirmedAt: daysAgo(60) }),
    ];
    const { counts, stale } = summarise(rows, NOW);
    expect(counts).toEqual({ all: 9, available: 2, coming: 2, reserved: 2, occupied: 1, off: 2 });
    expect(stale).toBe(1);
  });

  it("handles an empty portfolio", () => {
    expect(summarise([], NOW)).toEqual({
      counts: { all: 0, available: 0, coming: 0, reserved: 0, occupied: 0, off: 0 },
      stale: 0,
    });
  });
});

describe("filterRows", () => {
  const rows = [
    row({ spaceId: "1", status: "available_now" }),
    row({ spaceId: "2", status: "occupied" }),
    row({ spaceId: "3", status: "maintenance" }),
    row({ spaceId: "4", status: "offline" }),
  ];

  it("returns everything for 'all'", () => {
    expect(filterRows(rows, "all")).toHaveLength(4);
  });

  it("folds maintenance and offline into one off-market group", () => {
    expect(filterRows(rows, "off").map(r => r.spaceId)).toEqual(["3", "4"]);
  });
});

describe("sortRows", () => {
  it("puts rooms needing confirmation first, whatever their status", () => {
    const rows = [
      row({ spaceId: "fresh", status: "available_now" }),
      row({ spaceId: "stale", status: "reserved", statusConfirmedAt: daysAgo(45) }),
    ];
    expect(sortRows(rows, NOW).map(r => r.spaceId)).toEqual(["stale", "fresh"]);
  });

  it("then orders by how close to lettable", () => {
    const mk = (status: SpaceStatus) => row({ spaceId: status, status });
    const sorted = sortRows(
      [mk("offline"), mk("occupied"), mk("available_now"), mk("notice_given")],
      NOW
    );
    expect(sorted.map(r => r.spaceId)).toEqual([
      "available_now",
      "notice_given",
      "occupied",
      "offline",
    ]);
  });

  it("numbers rooms naturally rather than as strings", () => {
    const sorted = sortRows(
      [row({ spaceId: "a10", label: "Room 10" }), row({ spaceId: "a2", label: "Room 2" })],
      NOW
    );
    expect(sorted.map(r => r.spaceId)).toEqual(["a2", "a10"]);
  });

  it("keeps each building's rooms contiguous", () => {
    const sorted = sortRows(
      [
        row({ spaceId: "chapel-2", label: "Room 2" }),
        row({ spaceId: "alton-1", label: "Room 1", buildingLabel: "8 Alton Rd, B29 7DX" }),
        row({ spaceId: "chapel-1", label: "Room 1" }),
        row({ spaceId: "alton-2", label: "Room 2", buildingLabel: "8 Alton Rd, B29 7DX" }),
      ],
      NOW
    );
    const buildings = sorted.map(r => r.buildingLabel);
    expect(new Set(buildings).size).toBe(2);
    // No building appears, disappears, then comes back.
    expect(buildings.filter((b, i) => b !== buildings[i - 1])).toHaveLength(2);
  });

  // A house number is a number: 8 Alton Rd comes before 12 Chapel St, which a
  // plain string sort gets backwards.
  it("orders addresses by house number, not by digit", () => {
    const sorted = sortRows(
      [
        row({ spaceId: "chapel", buildingLabel: "12 Chapel St, B29 6AA" }),
        row({ spaceId: "alton", buildingLabel: "8 Alton Rd, B29 7DX" }),
      ],
      NOW
    );
    expect(sorted.map(r => r.spaceId)).toEqual(["alton", "chapel"]);
  });

  it("does not mutate the input", () => {
    const rows = [row({ spaceId: "1", status: "offline" }), row({ spaceId: "2", status: "available_now" })];
    sortRows(rows, NOW);
    expect(rows.map(r => r.spaceId)).toEqual(["1", "2"]);
  });
});

describe("shouldOfferPublish", () => {
  it("offers when a room first becomes lettable", () => {
    expect(shouldOfferPublish("occupied", "available_now", row())).toBe(true);
  });

  it("stays quiet when the room is already advertised", () => {
    expect(shouldOfferPublish("occupied", "available_now", row({ listedPublicly: true }))).toBe(false);
    expect(shouldOfferPublish("occupied", "available_now", row({ listedPrivately: true }))).toBe(false);
  });

  // Nudging on every edit between two live states is how a helpful prompt
  // turns into one people click past without reading.
  it("stays quiet moving between two lettable states", () => {
    expect(shouldOfferPublish("available_now", "available_from", row())).toBe(false);
  });

  it("stays quiet when a room comes off the market", () => {
    expect(shouldOfferPublish("available_now", "occupied", row())).toBe(false);
  });
});

describe("visibilityLabel", () => {
  it.each([
    [{ listedPublicly: true, listedPrivately: true }, "Public + private"],
    [{ listedPublicly: true, listedPrivately: false }, "Public"],
    [{ listedPublicly: false, listedPrivately: true }, "Private"],
    [{ listedPublicly: false, listedPrivately: false }, "Not listed"],
  ])("%o reads as %s", (over, expected) => {
    expect(visibilityLabel(row(over))).toBe(expected);
  });
});

describe("toRows", () => {
  const base: SpaceQueryRow = {
    id: "s1",
    label: "Room 1",
    status: "available_now",
    rent_pcm: 650,
    bills_included: true,
    available_from: null,
    status_confirmed_at: hoursAgo(2),
    makan_unit: {
      id: "u1",
      label: "Whole house",
      makan_building: { id: "b1", address_line1: "12 Chapel St", postcode: "B29 6AA" },
    },
    makan_listing: [],
  };

  it("flattens the join into a renderable row", () => {
    const [r] = toRows([base]);
    expect(r.buildingLabel).toBe("12 Chapel St, B29 6AA");
    expect(r.unitLabel).toBe("Whole house");
    expect(r.listedPublicly).toBe(false);
  });

  it("counts only published listings as live", () => {
    const [r] = toRows([
      { ...base, makan_listing: [{ channel: "public", published_at: null }] },
    ]);
    expect(r.listedPublicly).toBe(false);

    const [r2] = toRows([
      { ...base, makan_listing: [{ channel: "public", published_at: hoursAgo(1) }] },
    ]);
    expect(r2.listedPublicly).toBe(true);
  });

  it("treats a commissioner listing as private, not public", () => {
    const [r] = toRows([
      { ...base, makan_listing: [{ channel: "commissioners", published_at: hoursAgo(1) }] },
    ]);
    expect(r.listedPublicly).toBe(false);
    expect(r.listedPrivately).toBe(true);
  });

  // A parent hidden by RLS comes back null. Rendering a row with a blank
  // address would look like corrupt data rather than a permission boundary.
  it("drops rows whose building or unit did not come back", () => {
    expect(toRows([{ ...base, makan_unit: null }])).toHaveLength(0);
    expect(toRows([{ ...base, makan_unit: { id: "u1", label: "x", makan_building: null } }])).toHaveLength(0);
  });

  it("tolerates a null listing array", () => {
    expect(toRows([{ ...base, makan_listing: null }])).toHaveLength(1);
  });
});

describe("isMissingTable", () => {
  it("recognises the PostgREST schema-cache code the live project returns", () => {
    expect(isMissingTable("PGRST205")).toBe(true);
  });

  it("recognises Postgres's own undefined_table", () => {
    expect(isMissingTable("42P01")).toBe(true);
  });

  it("does not swallow other failures", () => {
    for (const code of ["42501", "PGRST116", "23505", undefined, null, ""]) {
      expect(isMissingTable(code), String(code)).toBe(false);
    }
  });
});
