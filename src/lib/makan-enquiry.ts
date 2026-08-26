/**
 * Enquiry domain logic.
 *
 * The thing to guard here is what the renter is told before they send. "Usually
 * replies within 3 hours" is the single most useful sentence on a listing page
 * and also the easiest to fabricate: portals show it because it increases
 * enquiries, not because it is measured.
 *
 * So responsiveness is derived from replied threads only, requires a minimum
 * sample before it says anything at all, and has no fallback copy. When there
 * is no evidence the UI says nothing rather than something encouraging.
 */

export const ENQUIRY_STATUSES = ["new", "read", "replied", "closed"] as const;
export type EnquiryStatus = (typeof ENQUIRY_STATUSES)[number];

export const ENQUIRY_STATUS_LABEL: Record<EnquiryStatus, string> = {
  new: "New",
  read: "Read",
  replied: "Replied",
  closed: "Closed",
};

export interface Enquiry {
  id: string;
  spaceId: string;
  senderId: string;
  senderName: string | null;
  moveIn: string | null;
  phone: string | null;
  status: EnquiryStatus;
  readAt: string | null;
  repliedAt: string | null;
  createdAt: string;
  messages: EnquiryMessage[];
  /** Whether the listing this thread is about is open to a company let. */
  spaceAcceptsCompanies: boolean;
}

export interface EnquiryMessage {
  id: string;
  authorId: string;
  body: string;
  createdAt: string;
}

const MIN_BODY = 10;
const MAX_BODY = 2000;

export function validateEnquiry(input: { body: string; phone?: string | null }):
  | { ok: true }
  | { ok: false; field: string; message: string } {
  const body = input.body.trim();
  if (body.length < MIN_BODY) {
    return {
      ok: false,
      field: "body",
      message: `Say a little more — ${MIN_BODY} characters minimum. Landlords ignore one-word enquiries.`,
    };
  }
  if (body.length > MAX_BODY) {
    return { ok: false, field: "body", message: `Keep it under ${MAX_BODY} characters.` };
  }
  // Deliberately loose. A UK mobile, a landline, spaces, +44 — rejecting a real
  // number because it does not match a regex is worse than accepting a typo.
  if (input.phone && input.phone.trim() && !/^[\d\s+()-]{7,20}$/.test(input.phone.trim())) {
    return { ok: false, field: "phone", message: "That does not look like a phone number." };
  }
  return { ok: true };
}

/** What the renter sees about their own thread, after sending. */
export function threadStateLabel(e: Pick<Enquiry, "status" | "readAt" | "repliedAt">, now: Date): string {
  if (e.status === "closed") return "Closed";
  if (e.status === "replied" && e.repliedAt) return `Replied ${relative(e.repliedAt, now)}`;
  if (e.readAt) return `Read ${relative(e.readAt, now)}`;
  return "Sent — not read yet";
}

export function relative(iso: string, now: Date): string {
  const mins = Math.floor((now.getTime() - new Date(iso).getTime()) / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days < 31) return `${days} day${days === 1 ? "" : "s"} ago`;
  return `${Math.floor(days / 30)} month${Math.floor(days / 30) === 1 ? "" : "s"} ago`;
}

/**
 * How many replied threads before we are willing to describe a landlord's
 * responsiveness at all. Three is low, but the alternative on a young platform
 * is saying nothing forever; the wording below is hedged to match how little
 * this proves.
 */
export const MIN_SAMPLE_FOR_RESPONSIVENESS = 3;

export interface RepliedThread {
  createdAt: string;
  repliedAt: string;
}

/**
 * Median rather than mean: one landlord who took three weeks over a single
 * enquiry should not make the other nine look slow.
 */
export function medianReplyMinutes(threads: RepliedThread[]): number | null {
  const gaps = threads
    .map(t => (new Date(t.repliedAt).getTime() - new Date(t.createdAt).getTime()) / 60_000)
    .filter(m => Number.isFinite(m) && m >= 0)
    .sort((a, b) => a - b);
  if (gaps.length === 0) return null;
  const mid = Math.floor(gaps.length / 2);
  return gaps.length % 2 ? gaps[mid] : (gaps[mid - 1] + gaps[mid]) / 2;
}

/**
 * The sentence shown above the enquiry form — or null, which the caller must
 * render as nothing at all rather than as a placeholder.
 *
 * There is no "no data yet, but landlords here are responsive!" branch on
 * purpose. That is the lie this function exists to avoid.
 */
export function responsivenessLabel(threads: RepliedThread[]): string | null {
  if (threads.length < MIN_SAMPLE_FOR_RESPONSIVENESS) return null;
  const median = medianReplyMinutes(threads);
  if (median === null) return null;

  const n = threads.length;
  const sample = `across ${n} ${n === 1 ? "enquiry" : "enquiries"}`;
  if (median < 60) return `Usually replies within the hour, ${sample}`;
  const hours = Math.round(median / 60);
  if (hours < 24) return `Usually replies within ${hours} hour${hours === 1 ? "" : "s"}, ${sample}`;
  const days = Math.round(hours / 24);
  return `Usually replies within ${days} day${days === 1 ? "" : "s"}, ${sample}`;
}

/** Landlord inbox ordering: unanswered first, oldest of those first. */
export function sortInbox(list: Enquiry[]): Enquiry[] {
  const rank = (e: Enquiry) => (e.status === "new" ? 0 : e.status === "read" ? 1 : e.status === "replied" ? 2 : 3);
  return [...list].sort((a, b) => {
    if (rank(a) !== rank(b)) return rank(a) - rank(b);
    // Oldest unanswered first — the person waiting longest is served first.
    const dir = rank(a) <= 1 ? 1 : -1;
    return dir * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  });
}

export function unansweredCount(list: Enquiry[]): number {
  return list.filter(e => e.status === "new" || e.status === "read").length;
}

/** Row shapes returned by the enquiry queries. */
export interface EnquiryQueryRow {
  id: string;
  space_id: string;
  sender_id: string;
  move_in: string | null;
  phone: string | null;
  status: EnquiryStatus;
  read_at: string | null;
  replied_at: string | null;
  created_at: string;
  profiles?: { name: string } | null;
  makan_enquiry_message?: { id: string; author_id: string; body: string; created_at: string }[] | null;
  makan_space?: { let_types: string[] | null } | null;
}

export function toEnquiries(rows: EnquiryQueryRow[]): Enquiry[] {
  return rows.map(r => ({
    id: r.id,
    spaceId: r.space_id,
    senderId: r.sender_id,
    senderName: r.profiles?.name ?? null,
    moveIn: r.move_in,
    phone: r.phone,
    status: r.status,
    readAt: r.read_at,
    repliedAt: r.replied_at,
    createdAt: r.created_at,
    messages: (r.makan_enquiry_message ?? [])
      .map(m => ({ id: m.id, authorId: m.author_id, body: m.body, createdAt: m.created_at }))
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
    // Absent join or pre-migration row means tenant-only, matching the default.
    spaceAcceptsCompanies: (r.makan_space?.let_types ?? []).includes("company"),
  }));
}
