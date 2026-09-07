import { describe, it, expect, afterEach, vi } from "vitest";
import { resendSender, alertSenderFromEnv, FETCH_TIMEOUT_MS } from "./live";
import { MAIL_FROM, REPLY_TO } from "../site";

const saved = process.env.RESEND_API_KEY;
afterEach(() => {
  if (saved === undefined) delete process.env.RESEND_API_KEY;
  else process.env.RESEND_API_KEY = saved;
  vi.useRealTimers();
});

describe("the Resend sender", () => {
  it("posts exactly the REST API's body: from, reply_to, to, subject, text", async () => {
    let seen: { url: string; init: RequestInit } | null = null;
    const f = (async (url: string | URL | Request, init?: RequestInit) => {
      seen = { url: String(url), init: init! };
      return new Response("{}", { status: 200 });
    }) as typeof fetch;

    const send = resendSender({ apiKey: "re_x", to: "name@example.com", fetcher: f });
    expect(await send({ subject: "Held", text: "body" })).toEqual({ ok: true });

    expect(seen!.url).toBe("https://api.resend.com/emails");
    expect(seen!.init.method).toBe("POST");
    expect(seen!.init.headers).toEqual({ "Content-Type": "application/json", Authorization: "Bearer re_x" });
    // The REST API is snake_case. replyTo — the SDK's spelling — is silently
    // ignored by Resend, and replies would go to the from address.
    expect(JSON.parse(seen!.init.body as string)).toEqual({
      from: MAIL_FROM,
      reply_to: REPLY_TO,
      to: "name@example.com",
      subject: "Held",
      text: "body",
    });
    expect(seen!.init.signal).toBeInstanceOf(AbortSignal);
  });

  it("adds html only when given one", async () => {
    let body = "";
    const f = (async (_u: string | URL | Request, init?: RequestInit) => { body = init!.body as string; return new Response("{}"); }) as typeof fetch;
    await resendSender({ apiKey: "k", to: "x", fetcher: f })({ subject: "s", text: "t", html: "<p>t</p>" });
    expect(JSON.parse(body)).toMatchObject({ html: "<p>t</p>" });
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

  // A fetch that never answers would otherwise hold the function to its
  // maxDuration with the row sitting in 'publishing'.
  it("gives up after the timeout when the request hangs", async () => {
    vi.useFakeTimers();
    const f = ((_u: string | URL | Request, init?: RequestInit) =>
      new Promise<Response>((_, reject) => {
        init!.signal!.addEventListener("abort", () => reject(init!.signal!.reason));
      })) as typeof fetch;
    const pending = resendSender({ apiKey: "k", to: "x", fetcher: f })({ subject: "s", text: "t" });
    await vi.advanceTimersByTimeAsync(FETCH_TIMEOUT_MS + 1);
    const r = await pending;
    expect(r.ok).toBe(false);
    expect(r.error).toContain("timed out");
    expect(r.error).toContain(String(FETCH_TIMEOUT_MS));
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
