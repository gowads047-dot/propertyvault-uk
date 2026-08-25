import { describe, it, expect } from "vitest";
import {
  ENQUIRY_STATUSES,
  ENQUIRY_STATUS_LABEL,
  MIN_SAMPLE_FOR_RESPONSIVENESS,
  medianReplyMinutes,
  relative,
  responsivenessLabel,
  sortInbox,
  threadStateLabel,
  toEnquiries,
  unansweredCount,
  validateEnquiry,
  type Enquiry,
  type EnquiryQueryRow,
  type RepliedThread,
} from "./makan-enquiry";

const NOW = new Date("2026-08-24T12:00:00Z");
const agoMin = (n: number) => new Date(NOW.getTime() - n * 60_000).toISOString();
const agoHrs = (n: number) => agoMin(n * 60);
const agoDays = (n: number) => agoMin(n * 1440);

function enq(over: Partial<Enquiry> = {}): Enquiry {
  return {
    id: "e1",
    spaceId: "s1",
    senderId: "u1",
    senderName: "Renter",
    moveIn: null,
    phone: null,
    status: "new",
    readAt: null,
    repliedAt: null,
    createdAt: agoHrs(2),
    messages: [],
    ...over,
  };
}

/** A thread that took `mins` minutes to get a reply. */
const replied = (mins: number, ageHrs = 24): RepliedThread => ({
  createdAt: agoHrs(ageHrs),
  repliedAt: agoMin(ageHrs * 60 - mins),
});

describe("statuses", () => {
  it("labels every status", () => {
    for (const s of ENQUIRY_STATUSES) expect(ENQUIRY_STATUS_LABEL[s], s).toBeTruthy();
  });
});

describe("validateEnquiry", () => {
  it("accepts a real enquiry", () => {
    expect(validateEnquiry({ body: "Hi, is this room still available for October?" })).toEqual({ ok: true });
  });

  // A one-word enquiry gets ignored, which wastes the renter's time more than
  // the friction of asking for a sentence.
  it("rejects a one-word enquiry", () => {
    expect(validateEnquiry({ body: "hi" })).toMatchObject({ ok: false, field: "body" });
    expect(validateEnquiry({ body: "    " })).toMatchObject({ ok: false, field: "body" });
  });

  it("rejects an essay", () => {
    expect(validateEnquiry({ body: "a".repeat(2001) })).toMatchObject({ ok: false, field: "body" });
  });

  it.each(["07700 900123", "+44 7700 900123", "0121 496 0000", "(0121) 496-0000"])(
    "accepts %s as a phone number", phone => {
      expect(validateEnquiry({ body: "Is this still available please?", phone })).toEqual({ ok: true });
    }
  );

  it("rejects obvious nonsense in the phone field", () => {
    expect(validateEnquiry({ body: "Is this still available please?", phone: "call me maybe" }))
      .toMatchObject({ ok: false, field: "phone" });
  });

  it("treats a blank phone as absent", () => {
    expect(validateEnquiry({ body: "Is this still available please?", phone: "  " })).toEqual({ ok: true });
    expect(validateEnquiry({ body: "Is this still available please?", phone: null })).toEqual({ ok: true });
  });
});

describe("threadStateLabel", () => {
  it("is honest that nothing has happened yet", () => {
    expect(threadStateLabel(enq(), NOW)).toBe("Sent — not read yet");
  });

  it("shows when it was read", () => {
    expect(threadStateLabel(enq({ status: "read", readAt: agoHrs(2) }), NOW)).toBe("Read 2 hours ago");
  });

  it("prefers the reply over the read", () => {
    expect(threadStateLabel(
      enq({ status: "replied", readAt: agoHrs(5), repliedAt: agoMin(30) }), NOW
    )).toBe("Replied 30 min ago");
  });

  it("handles closed", () => {
    expect(threadStateLabel(enq({ status: "closed" }), NOW)).toBe("Closed");
  });
});

describe("relative", () => {
  it.each([
    [agoMin(0), "just now"],
    [agoMin(45), "45 min ago"],
    [agoHrs(1), "1 hour ago"],
    [agoHrs(5), "5 hours ago"],
    [agoDays(1), "1 day ago"],
    [agoDays(20), "20 days ago"],
    [agoDays(70), "2 months ago"],
  ])("renders %s as %s", (iso, expected) => {
    expect(relative(iso, NOW)).toBe(expected);
  });
});

describe("medianReplyMinutes", () => {
  it("returns null with nothing to measure", () => {
    expect(medianReplyMinutes([])).toBeNull();
  });

  // One landlord who took three weeks over a single enquiry should not make
  // the rest look slow.
  it("uses the median, not the mean", () => {
    const threads = [replied(10), replied(20), replied(30), replied(40), replied(30_000)];
    expect(medianReplyMinutes(threads)).toBe(30);
  });

  it("averages the middle two when the count is even", () => {
    expect(medianReplyMinutes([replied(10), replied(20)])).toBe(15);
  });
});

describe("responsivenessLabel", () => {
  // The whole point of this module. Portals show "usually replies within
  // 3 hours" because it lifts enquiry rates, not because they measured it.
  it("says nothing at all below the minimum sample", () => {
    for (let n = 0; n < MIN_SAMPLE_FOR_RESPONSIVENESS; n++) {
      expect(responsivenessLabel(Array.from({ length: n }, () => replied(30))), `n=${n}`).toBeNull();
    }
  });

  it("has no encouraging fallback for a landlord with no history", () => {
    const label = responsivenessLabel([]);
    expect(label).toBeNull();
    // Guard against someone later "improving" this with optimistic copy.
    expect(String(label)).not.toMatch(/responsive|quick|fast|soon/i);
  });

  it("speaks once there is enough to go on, and says how much", () => {
    expect(responsivenessLabel([replied(20), replied(30), replied(40)]))
      .toBe("Usually replies within the hour, across 3 enquiries");
  });

  it("scales to hours and days", () => {
    expect(responsivenessLabel([replied(180), replied(180), replied(180)]))
      .toBe("Usually replies within 3 hours, across 3 enquiries");
    expect(responsivenessLabel([replied(2880), replied(2880), replied(2880)]))
      .toBe("Usually replies within 2 days, across 3 enquiries");
  });

  it("always discloses the sample size", () => {
    const label = responsivenessLabel([replied(30), replied(30), replied(30), replied(30)]);
    expect(label).toContain("across 4 enquiries");
  });
});

describe("sortInbox", () => {
  // The person waiting longest is served first.
  it("puts unanswered first, oldest of those first", () => {
    const sorted = sortInbox([
      enq({ id: "replied", status: "replied", createdAt: agoHrs(1) }),
      enq({ id: "new-recent", status: "new", createdAt: agoHrs(1) }),
      enq({ id: "new-old", status: "new", createdAt: agoDays(3) }),
      enq({ id: "read", status: "read", createdAt: agoHrs(2) }),
    ]);
    expect(sorted.map(e => e.id)).toEqual(["new-old", "new-recent", "read", "replied"]);
  });

  it("puts closed last", () => {
    const sorted = sortInbox([enq({ id: "c", status: "closed" }), enq({ id: "n", status: "new" })]);
    expect(sorted.map(e => e.id)).toEqual(["n", "c"]);
  });

  it("does not mutate the input", () => {
    const list = [enq({ id: "1", status: "replied" }), enq({ id: "2", status: "new" })];
    sortInbox(list);
    expect(list.map(e => e.id)).toEqual(["1", "2"]);
  });
});

describe("unansweredCount", () => {
  it("counts new and read, not replied or closed", () => {
    expect(unansweredCount([
      enq({ status: "new" }), enq({ status: "read" }),
      enq({ status: "replied" }), enq({ status: "closed" }),
    ])).toBe(2);
  });
});

describe("toEnquiries", () => {
  const row: EnquiryQueryRow = {
    id: "e1", space_id: "s1", sender_id: "u1",
    move_in: null, phone: null, status: "new",
    read_at: null, replied_at: null, created_at: agoHrs(1),
    profiles: { name: "Renter" },
    makan_enquiry_message: [
      { id: "m2", author_id: "u1", body: "second", created_at: agoMin(10) },
      { id: "m1", author_id: "u1", body: "first", created_at: agoMin(50) },
    ],
  };

  it("puts the thread in chronological order whatever the query returned", () => {
    expect(toEnquiries([row])[0].messages.map(m => m.body)).toEqual(["first", "second"]);
  });

  it("copes with a thread that has no messages yet", () => {
    expect(toEnquiries([{ ...row, makan_enquiry_message: null }])[0].messages).toEqual([]);
  });

  it("copes with a missing sender profile", () => {
    expect(toEnquiries([{ ...row, profiles: null }])[0].senderName).toBeNull();
  });
});
