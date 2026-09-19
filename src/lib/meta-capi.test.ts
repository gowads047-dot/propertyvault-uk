import { describe, it, expect, vi, afterEach } from "vitest";
import { buildLeadPayload, sendLeadToMeta, normalisePhone, fbcFrom, sha256 } from "./meta-capi";

afterEach(() => {
  vi.unstubAllGlobals();
  delete process.env.META_PIXEL_ID;
  delete process.env.META_CAPI_ACCESS_TOKEN;
});

const lead = {
  eventId: "row-1",
  email: " Jane@Example.com ",
  phone: "07415 721628",
  consent: "all",
  sourceUrl: "https://www.propertyvaultuk.co.uk/guaranteed-rent/",
  ip: "203.0.113.9",
  userAgent: "UA/1",
  fbclid: "IwAR123",
  attributedAt: "2026-09-19T10:00:00.000Z",
};

describe("buildLeadPayload", () => {
  it("hashes the email and phone as Meta specifies and never sends them plain", () => {
    const p = buildLeadPayload(lead) as { data: Array<Record<string, unknown>> };
    const ev = p.data[0];
    const ud = ev.user_data as Record<string, unknown>;
    expect(ev).toMatchObject({ event_name: "Lead", event_id: "row-1", action_source: "website", event_source_url: lead.sourceUrl });
    expect(ud.em).toEqual([sha256("jane@example.com")]);
    expect(ud.ph).toEqual([sha256("447415721628")]);
    expect(ud.fbc).toBe("fb.1.1789812000000.IwAR123");
    expect(ud.client_ip_address).toBe("203.0.113.9");
    expect(JSON.stringify(p)).not.toMatch(/jane@example|7415/);
  });

  it("leaves out what it was not given", () => {
    const ud = (buildLeadPayload({ ...lead, phone: null, fbclid: null, ip: null }) as { data: Array<{ user_data: Record<string, unknown> }> }).data[0].user_data;
    expect(ud).not.toHaveProperty("ph");
    expect(ud).not.toHaveProperty("fbc");
    expect(ud).not.toHaveProperty("client_ip_address");
  });
});

describe("normalisePhone and fbcFrom", () => {
  it("turns UK national numbers into E.164 digits and rejects fragments", () => {
    expect(normalisePhone("07415 721628")).toBe("447415721628");
    expect(normalisePhone("+44 7415 721628")).toBe("447415721628");
    expect(normalisePhone("0044 7415721628")).toBe("447415721628");
    expect(normalisePhone("12345")).toBeNull();
  });
  it("builds fbc from the click id and its time, falling back to now", () => {
    expect(fbcFrom("abc", "2026-09-19T10:00:00.000Z")).toBe("fb.1.1789812000000.abc");
    expect(fbcFrom("abc", "not a date")).toMatch(/^fb\.1\.\d{13}\.abc$/);
    expect(fbcFrom(null, null)).toBeNull();
  });
});

describe("sendLeadToMeta", () => {
  it("is skipped without keys, and skipped without consent even with them", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    expect(await sendLeadToMeta(lead)).toBe("skipped");
    process.env.META_PIXEL_ID = "123";
    process.env.META_CAPI_ACCESS_TOKEN = "tok";
    expect(await sendLeadToMeta({ ...lead, consent: "essential" })).toBe("skipped");
    expect(await sendLeadToMeta({ ...lead, consent: null })).toBe("skipped");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("posts to the pixel's events endpoint with consent and keys", async () => {
    process.env.META_PIXEL_ID = "123";
    process.env.META_CAPI_ACCESS_TOKEN = "tok";
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ events_received: 1 }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    expect(await sendLeadToMeta(lead)).toBe("sent");
    const [url] = fetchMock.mock.calls[0] as unknown as [string];
    expect(url).toBe("https://graph.facebook.com/v21.0/123/events?access_token=tok");
  });

  it("reports a refusal or an outage as failed, without throwing", async () => {
    process.env.META_PIXEL_ID = "123";
    process.env.META_CAPI_ACCESS_TOKEN = "tok";
    const err = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubGlobal("fetch", vi.fn(async () => new Response("bad", { status: 400 })));
    expect(await sendLeadToMeta(lead)).toBe("failed");
    vi.stubGlobal("fetch", vi.fn(async () => { throw new Error("down"); }));
    expect(await sendLeadToMeta(lead)).toBe("failed");
    err.mockRestore();
  });
});
