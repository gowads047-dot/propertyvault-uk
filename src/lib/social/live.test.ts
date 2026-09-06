import { describe, it, expect, afterEach } from "vitest";
import { resendSender, alertSenderFromEnv } from "./live";

const saved = process.env.RESEND_API_KEY;
afterEach(() => {
  if (saved === undefined) delete process.env.RESEND_API_KEY;
  else process.env.RESEND_API_KEY = saved;
});

describe("the Resend sender", () => {
  it("posts from the one address, to the operator, with the key", async () => {
    let seen: { url: string; init: RequestInit } | null = null;
    const f = (async (url: string | URL | Request, init?: RequestInit) => {
      seen = { url: String(url), init: init! };
      return new Response("{}", { status: 200 });
    }) as typeof fetch;

    const send = resendSender({ apiKey: "re_x", to: "name@example.com", fetcher: f });
    expect(await send({ subject: "Held", text: "body" })).toEqual({ ok: true });

    expect(seen!.url).toBe("https://api.resend.com/emails");
    expect((seen!.init.headers as Record<string, string>).Authorization).toBe("Bearer re_x");
    const body = JSON.parse(seen!.init.body as string);
    expect(body.to).toBe("name@example.com");
    expect(body.from).toContain("info@propertyvaultuk.co.uk");
    expect(body.replyTo).toBe("info@propertyvaultuk.co.uk");
    expect(body.subject).toBe("Held");
    expect(body.text).toBe("body");
    expect(body.html).toBeUndefined();
  });

  it("returns Resend's status and message on failure rather than throwing", async () => {
    const f = (async () => new Response('{"message":"invalid to"}', { status: 422 })) as typeof fetch;
    const r = await resendSender({ apiKey: "k", to: "x", fetcher: f })({ subject: "s", text: "t" });
    expect(r.ok).toBe(false);
    expect(r.error).toContain("422");
    expect(r.error).toContain("invalid to");
  });

  it("reports a network failure the same way", async () => {
    const f = (async () => { throw new Error("ENOTFOUND"); }) as typeof fetch;
    const r = await resendSender({ apiKey: "k", to: "x", fetcher: f })({ subject: "s", text: "t" });
    expect(r.ok).toBe(false);
    expect(r.error).toContain("ENOTFOUND");
  });
});

describe("from the environment", () => {
  it("is null without a key, so the publisher can say the alert was not sent", () => {
    delete process.env.RESEND_API_KEY;
    expect(alertSenderFromEnv("x")).toBeNull();
    process.env.RESEND_API_KEY = "re_y";
    expect(typeof alertSenderFromEnv("x")).toBe("function");
  });
});
