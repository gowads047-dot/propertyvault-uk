import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

/**
 * Tests for the contact endpoint that replaced formsubmit.co.
 *
 * Four forms — contact, guaranteed rent, list property and Makan wanted — used
 * to post directly to FormSubmit. It returned a success page and delivered
 * nothing, because the destination address had never completed FormSubmit's
 * activation handshake. The guaranteed-rent form did not even check the
 * response, so it promised a reply within two hours on top of a dropped lead.
 *
 * The rule these tests hold: the enquiry reaches the database, or the caller is
 * told it did not. Never a false success.
 */

const insert = vi.fn();
const send = vi.fn();

vi.mock("@supabase/supabase-js", () => ({
  createClient: () => ({ from: () => ({ insert }) }),
}));

vi.mock("resend", () => ({
  Resend: class {
    emails = { send };
    constructor(key?: string) {
      if (!key && !process.env.RESEND_API_KEY) throw new Error("Missing API key.");
    }
  },
}));

const post = async (body: unknown) => {
  const { POST } = await import("./route");
  return POST(new Request("https://www.propertyvaultuk.co.uk/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }));
};

const enquiry = {
  name: "Jane Landlord",
  email: "Jane@Example.com",
  subject: "Guaranteed Rent Enquiry",
  message: "Do you cover CV1?",
};

beforeEach(() => {
  vi.resetModules();
  insert.mockReset().mockResolvedValue({ error: null });
  send.mockReset().mockResolvedValue({ error: null });
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://stub.supabase.co";
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "stub-anon-key";
  process.env.RESEND_API_KEY = "re_stub_key";
});

afterEach(() => {
  delete process.env.RESEND_API_KEY;
});

describe("the enquiry is recorded before it is emailed", () => {
  it("saves it and normalises the address", async () => {
    const res = await post(enquiry);

    expect(res.status).toBe(200);
    expect(insert).toHaveBeenCalledTimes(1);
    expect(insert.mock.calls[0][0]).toMatchObject({
      name: "Jane Landlord",
      email: "jane@example.com",
      message: "Do you cover CV1?",
      source: "contact",
    });
  });

  it("still returns ok when RESEND_API_KEY is unset", async () => {
    delete process.env.RESEND_API_KEY;

    const res = await post(enquiry);

    expect(res.status).toBe(200);
    expect(insert).toHaveBeenCalledTimes(1);
  });

  it("still returns ok when the send throws", async () => {
    send.mockRejectedValue(new Error("network down"));

    const res = await post(enquiry);

    expect(res.status).toBe(200);
    expect(insert).toHaveBeenCalledTimes(1);
  });

  it("reports failure rather than a false success when the database rejects it", async () => {
    insert.mockResolvedValue({ error: { code: "42501", message: "denied" } });

    const res = await post(enquiry);

    expect(res.status).toBe(500);
    await expect(res.json()).resolves.toHaveProperty("error");
    expect(send).not.toHaveBeenCalled();
  });
});

describe("validation", () => {
  it("requires a name and an email", async () => {
    expect((await post({ email: "a@b.com", message: "hi" })).status).toBe(400);
    expect((await post({ name: "A", message: "hi" })).status).toBe(400);
    expect(insert).not.toHaveBeenCalled();
  });

  it("rejects a malformed address", async () => {
    expect((await post({ ...enquiry, email: "not-an-email" })).status).toBe(400);
    expect(insert).not.toHaveBeenCalled();
  });

  it("rejects an unreadable body", async () => {
    const { POST } = await import("./route");
    const res = await POST(new Request("https://x/api/contact", { method: "POST", body: "{not json" }));
    expect(res.status).toBe(400);
  });

  it("caps an overlong message", async () => {
    const res = await post({ ...enquiry, message: "x".repeat(5001) });
    expect(res.status).toBe(400);
    expect(insert).not.toHaveBeenCalled();
  });
});

describe("the message field is only mandatory for the contact form", () => {
  it("requires it for a contact enquiry", async () => {
    const res = await post({ name: "A", email: "a@b.com", source: "contact" });
    expect(res.status).toBe(400);
  });

  it("accepts a guaranteed-rent enquiry carried entirely by its details", async () => {
    const res = await post({
      name: "Jane Landlord",
      email: "jane@example.com",
      source: "guaranteed-rent",
      phone: "07000 000000",
      postcode: "CV1 1AA",
      bedrooms: "3",
    });

    expect(res.status).toBe(200);
    expect(insert.mock.calls[0][0]).toMatchObject({
      source: "guaranteed-rent",
      details: { phone: "07000 000000", postcode: "CV1 1AA", bedrooms: "3" },
    });
  });
});

describe("source and details", () => {
  it("keeps form-specific fields structured rather than flattened into prose", async () => {
    await post({ ...enquiry, source: "list-property", address: "1 High St", price: "250000" });

    expect(insert.mock.calls[0][0].details).toEqual({ address: "1 High St", price: "250000" });
  });

  it("falls back to 'contact' for an unrecognised source", async () => {
    await post({ ...enquiry, source: "../../evil" });

    expect(insert.mock.calls[0][0].source).toBe("contact");
  });

  it("does not leak the honeypot into the stored details", async () => {
    await post({ ...enquiry, _honey: "" });

    expect(insert.mock.calls[0][0].details).toBeNull();
  });
});

describe("the honeypot", () => {
  it("silently accepts and discards a bot submission", async () => {
    const res = await post({ ...enquiry, _honey: "http://spam.example" });

    expect(res.status).toBe(200);
    // Answering 200 gives the bot nothing to tune against, but nothing is kept.
    expect(insert).not.toHaveBeenCalled();
    expect(send).not.toHaveBeenCalled();
  });
});

describe("the notification email", () => {
  it("is addressed to the business and replies to the sender", async () => {
    await post(enquiry);

    expect(send.mock.calls[0][0]).toMatchObject({
      to: "info@propertyvaultuk.co.uk",
      replyTo: "jane@example.com",
    });
  });

  it("flags a guaranteed-rent lead in the subject line", async () => {
    await post({ ...enquiry, source: "guaranteed-rent" });

    expect(send.mock.calls[0][0].subject).toContain("GUARANTEED RENT");
  });
});
