import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-05-27.dahlia" });

  // Auth: get session from cookie
  const cookieStore = await cookies();
  const supabaseAuth = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    }
  );
  const { data: { session } } = await supabaseAuth.auth.getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  // Service role client to look up customer ID
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Determine platform from request body
  const body = await req.json().catch(() => ({}));
  const platform: string = body.platform || "academy";

  let customerId: string | null = null;

  if (platform === "rentura") {
    const { data } = await supabase
      .from("rentura_subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", userId)
      .maybeSingle();
    customerId = data?.stripe_customer_id || null;
  } else {
    const { data } = await supabase
      .from("academy_members")
      .select("stripe_customer_id")
      .eq("user_id", userId)
      .maybeSingle();
    customerId = data?.stripe_customer_id || null;
  }

  if (!customerId) {
    return NextResponse.json({ error: "No billing account found" }, { status: 404 });
  }

  try {
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: platform === "rentura"
        ? `${process.env.NEXT_PUBLIC_SITE_URL}/rentura/settings`
        : `${process.env.NEXT_PUBLIC_SITE_URL}/academy/dashboard`,
    });
    return NextResponse.json({ url: portalSession.url });
  } catch (err) {
    console.error("Portal error:", err);
    return NextResponse.json({ error: "Failed to open billing portal" }, { status: 500 });
  }
}
