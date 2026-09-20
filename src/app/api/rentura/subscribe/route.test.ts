import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const create = vi.fn();
vi.mock("stripe", () => ({ default: class { checkout = { sessions: { create: (p: unknown) => create(p) } }; } }));

const verified = vi.fn();
vi.mock("@/lib/server-auth", () => ({ getVerifiedUser: (req: Request) => verified(req) }));

beforeEach(() => {
  vi.resetModules();
  create.mockReset().mockResolvedValue({ url: "https://checkout.stripe.com/c/pay/cs_test" });
  verified.mockReset().mockResolvedValue({ id: "user-1", email: "landlord@email.com" });
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://stub.supabase.co";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "stub-service-key";
  process.env.STRIPE_SECRET_KEY = "sk_test_stub";
  process.env.RENTURA_STRIPE_PRICE_ID = "price_stub";
  // The limiter reads its counter over PostgREST; one use of the allowance.
  vi.stubGlobal("fetch", vi.fn(async () => new Response("1", { status: 200 })));
});
afterEach(() => {
  vi.unstubAllGlobals();
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  delete process.env.STRIPE_SECRET_KEY;
  delete process.env.RENTURA_STRIPE_PRICE_ID;
});

const post = (body?: unknown) =>
  new Request("https://www.propertyvaultuk.co.uk/api/rentura/subscribe/", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "Bearer t" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

describe("/api/rentura/subscribe", () => {
  it("opens the checkout for the verified member, whatever the body says", async () => {
    const { POST } = await import("./route");
    const res = await POST(post({ userId: "victim-9", email: "new@email.com" }));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ url: "https://checkout.stripe.com/c/pay/cs_test" });
    const params = create.mock.calls[0][0] as { customer_email: string; metadata: { userId: string }; subscription_data: { metadata: { userId: string } } };
    expect(params.customer_email).toBe("landlord@email.com");
    expect(params.metadata.userId).toBe("user-1");
    expect(params.subscription_data.metadata.userId).toBe("user-1");
  });

  it("refuses without a session, before touching Stripe", async () => {
    verified.mockResolvedValue(null);
    const { POST } = await import("./route");
    expect((await POST(post())).status).toBe(401);
    expect(create).not.toHaveBeenCalled();
  });
});
