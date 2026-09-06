import { NextResponse } from "next/server";
import { RULES, rateGuard } from "@/lib/rate-limit";

/**
 * The Academy checkout, switched off.
 *
 * This route created a live Stripe subscription session against
 * STRIPE_PRICE_ID — a real, active, livemode price of £14.99/month on a
 * product called "Deal Sourcing Academy" — with payment_method_collection
 * "always" and a 30-day trial. So it would take a card and bill on day 31.
 *
 * The Academy has not launched. Its own landing page says "Be the First to
 * Know When We Launch" while /deal-sourcing advertised it as "NOW OPEN —
 * £14.99/MONTH", and the content those pages describe — twelve modules, forty
 * hours of video, weekly live deal reviews — does not exist yet.
 *
 * Nobody was charged: every enquiry table is empty and no subscription was
 * created. But the flow was armed, and the owner did not know it was.
 *
 * Deliberately a 503 rather than a deleted file. A deleted route returns
 * Next's own 404 HTML, which the two callers would try to parse as JSON and
 * report as "Something went wrong"; this gives them a message worth showing.
 * It is also the smallest possible thing to revert on launch day — restore
 * the previous implementation from git and nothing else needs to change.
 *
 * Rentura's checkout is untouched and still live at
 * /api/rentura/subscribe (RENTURA_STRIPE_PRICE_ID, £9.99/month).
 */
export async function POST(req: Request) {
  // Guarded even though it spends nothing: routes-metered.test.ts holds every
  // exported handler to this, and a rule with no exceptions is worth more than
  // the two lines it costs.
  const limited = await rateGuard(req, RULES.checkoutPerCaller, RULES.checkoutGlobal);
  if (limited) {
    return NextResponse.json({ error: limited.error }, { status: limited.status });
  }

  return NextResponse.json(
    {
      error:
        "The Academy is not open yet, so there is nothing to subscribe to. " +
        "Join the waiting list at /academy and we will tell you when it is.",
    },
    { status: 503 },
  );
}
