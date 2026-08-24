/**
 * Room Manager domain logic.
 *
 * Kept out of the component so the rules an operator depends on -- which rooms
 * count as available, which have gone stale, what order they appear in -- are
 * testable without a database or a browser.
 *
 * The whole product rests on this data staying current. An operator maintains
 * their inventory here because it is faster than their spreadsheet, and Makan
 * gets a live supply graph as a side effect. Everything below is in service of
 * making that one-minute-a-morning job obvious.
 */

/** Mirrors the check constraint on makan_space.status. */
export const SPACE_STATUSES = [
  "available_now",
  "available_from",
  "notice_given",
  "reserved",
  "assessment_pending",
  "occupied",
  "maintenance",
  "offline",
] as const;

export type SpaceStatus = (typeof SPACE_STATUSES)[number];

export interface InventoryRow {
  spaceId: string;
  label: string;
  unitLabel: string;
  buildingId: string;
  buildingLabel: string;
  rentPcm: number | null;
  billsIncluded: boolean;
  status: SpaceStatus;
  availableFrom: string | null;
  /** ISO timestamp of the last confirmed status. The freshness signal. */
  statusConfirmedAt: string;
  listedPublicly: boolean;
  listedPrivately: boolean;
}

/**
 * The six buckets an operator actually scans for. Deliberately fewer than the
 * eight statuses: nobody opens this screen thinking "show me maintenance
 * versus offline", they think "what is off the market".
 */
export const GROUPS = ["all", "available", "coming", "reserved", "occupied", "off"] as const;
export type Group = (typeof GROUPS)[number];

const GROUP_OF: Record<SpaceStatus, Exclude<Group, "all">> = {
  available_now: "available",
  available_from: "coming",
  notice_given: "coming",
  reserved: "reserved",
  assessment_pending: "reserved",
  occupied: "occupied",
  maintenance: "off",
  offline: "off",
};

export const GROUP_LABEL: Record<Group, string> = {
  all: "All rooms",
  available: "Available",
  coming: "Coming up",
  reserved: "Reserved",
  occupied: "Occupied",
  off: "Off market",
};

export const STATUS_LABEL: Record<SpaceStatus, string> = {
  available_now: "Available now",
  available_from: "Available from",
  notice_given: "Notice given",
  reserved: "Reserved",
  assessment_pending: "Assessment pending",
  occupied: "Occupied",
  maintenance: "Maintenance",
  offline: "Off market",
};

export function groupOf(status: SpaceStatus): Exclude<Group, "all"> {
  return GROUP_OF[status];
}

/**
 * Statuses where a stale answer actively misleads somebody -- a renter
 * enquiring about a room that went weeks ago, or a commissioner planning a
 * placement into it. An occupied or off-market room can sit untouched without
 * costing anyone anything, so it is never nagged about.
 */
export function isOnMarket(status: SpaceStatus): boolean {
  return (
    status === "available_now" ||
    status === "available_from" ||
    status === "notice_given" ||
    status === "reserved" ||
    status === "assessment_pending"
  );
}

export const STALE_AFTER_DAYS = 30;

const DAY_MS = 86_400_000;

export function daysSince(iso: string, now: Date): number {
  return Math.floor((now.getTime() - new Date(iso).getTime()) / DAY_MS);
}

/** On the market and not confirmed for a month. These sort to the top. */
export function needsConfirmation(row: InventoryRow, now: Date): boolean {
  return isOnMarket(row.status) && daysSince(row.statusConfirmedAt, now) >= STALE_AFTER_DAYS;
}

/**
 * "Confirmed 2 hours ago". This string is the reason a renter should trust a
 * Makan listing over the same room on a portal, so it stays specific rather
 * than rounding everything to "recently".
 */
export function freshnessLabel(iso: string, now: Date): string {
  const mins = Math.floor((now.getTime() - new Date(iso).getTime()) / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days < 31) return `${days} day${days === 1 ? "" : "s"} ago`;
  const months = Math.floor(days / 30);
  return `${months} month${months === 1 ? "" : "s"} ago`;
}

export interface Summary {
  counts: Record<Group, number>;
  stale: number;
}

export function summarise(rows: InventoryRow[], now: Date): Summary {
  const counts = { all: rows.length, available: 0, coming: 0, reserved: 0, occupied: 0, off: 0 } as Record<Group, number>;
  let stale = 0;
  for (const row of rows) {
    counts[groupOf(row.status)] += 1;
    if (needsConfirmation(row, now)) stale += 1;
  }
  return { counts, stale };
}

export function filterRows(rows: InventoryRow[], group: Group): InventoryRow[] {
  return group === "all" ? rows : rows.filter(r => groupOf(r.status) === group);
}

/** Statuses in the order an operator cares about them. */
const STATUS_RANK: Record<SpaceStatus, number> = {
  available_now: 0,
  available_from: 1,
  notice_given: 2,
  reserved: 3,
  assessment_pending: 4,
  occupied: 5,
  maintenance: 6,
  offline: 7,
};

/**
 * Anything needing confirmation first, because that is the job. Then by how
 * close to lettable, then grouped by building so a person working through a
 * house is not bounced across their portfolio.
 */
export function sortRows(rows: InventoryRow[], now: Date): InventoryRow[] {
  return [...rows].sort((a, b) => {
    const staleA = needsConfirmation(a, now) ? 0 : 1;
    const staleB = needsConfirmation(b, now) ? 0 : 1;
    if (staleA !== staleB) return staleA - staleB;

    if (STATUS_RANK[a.status] !== STATUS_RANK[b.status]) {
      return STATUS_RANK[a.status] - STATUS_RANK[b.status];
    }
    // Numeric collation throughout, so 'Room 10' sorts after 'Room 2' and a
    // house number in an address does not order as a string.
    const byName = (x: string, y: string) => x.localeCompare(y, undefined, { numeric: true });
    return (
      byName(a.buildingLabel, b.buildingLabel) ||
      byName(a.unitLabel, b.unitLabel) ||
      byName(a.label, b.label)
    );
  });
}

/**
 * Which statuses should offer to publish when selected. Moving a room to
 * available is the moment to ask "advertise this?" -- once, with three
 * buttons, not a wizard.
 */
export function shouldOfferPublish(from: SpaceStatus, to: SpaceStatus, row: InventoryRow): boolean {
  if (row.listedPublicly || row.listedPrivately) return false;
  const wasLive = from === "available_now" || from === "available_from";
  const isLive = to === "available_now" || to === "available_from";
  return isLive && !wasLive;
}

/** How the row describes its own visibility. */
export function visibilityLabel(row: InventoryRow): string {
  if (row.listedPublicly && row.listedPrivately) return "Public + private";
  if (row.listedPublicly) return "Public";
  if (row.listedPrivately) return "Private";
  return "Not listed";
}

/** Shape returned by the inventory query, before flattening. */
export interface SpaceQueryRow {
  id: string;
  label: string;
  status: SpaceStatus;
  rent_pcm: number | null;
  bills_included: boolean;
  available_from: string | null;
  status_confirmed_at: string;
  makan_unit: {
    id: string;
    label: string;
    makan_building: { id: string; address_line1: string; postcode: string } | null;
  } | null;
  makan_listing: { channel: string; published_at: string | null }[] | null;
}

/**
 * Flattens the nested join into something the table can render. Rows whose
 * unit or building did not come back are dropped rather than rendered with
 * blanks -- that only happens when RLS hid a parent, and a half-populated row
 * would be worse than none.
 */
export function toRows(data: SpaceQueryRow[]): InventoryRow[] {
  const out: InventoryRow[] = [];
  for (const s of data) {
    const building = s.makan_unit?.makan_building;
    if (!s.makan_unit || !building) continue;

    const live = (s.makan_listing ?? []).filter(l => l.published_at !== null);
    out.push({
      spaceId: s.id,
      label: s.label,
      unitLabel: s.makan_unit.label,
      buildingId: building.id,
      buildingLabel: `${building.address_line1}, ${building.postcode}`,
      rentPcm: s.rent_pcm,
      billsIncluded: s.bills_included,
      status: s.status,
      availableFrom: s.available_from,
      statusConfirmedAt: s.status_confirmed_at,
      listedPublicly: live.some(l => l.channel === "public"),
      listedPrivately: live.some(l => l.channel === "commissioners" || l.channel === "link_only"),
    });
  }
  return out;
}
