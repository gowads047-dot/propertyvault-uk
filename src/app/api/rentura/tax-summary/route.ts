import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getTaxYear(today: Date): { start: string; end: string; label: string } {
  const y = today.getFullYear();
  const m = today.getMonth(); // 0-indexed
  const d = today.getDate();
  const startYear = m > 3 || (m === 3 && d >= 6) ? y : y - 1;
  return {
    start: `${startYear}-04-06`,
    end: `${startYear + 1}-04-05`,
    label: `${startYear}/${String(startYear + 1).slice(2)}`,
  };
}

const INCOME_TYPES = new Set(["payment", "rent_payment", "bulk_payment"]);
const EXPENSE_TYPES = new Set(["maintenance_cost"]);

export async function GET(req: Request) {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });

  const { start, end, label } = getTaxYear(new Date());

  const [eventsRes, propsRes] = await Promise.all([
    supabase.from("rentura_events")
      .select("event_type, amount, property_id, title, event_date")
      .eq("user_id", userId)
      .gte("event_date", start)
      .lte("event_date", end),
    supabase.from("rentura_properties").select("id, address").eq("user_id", userId),
  ]);

  const propMap = Object.fromEntries((propsRes.data ?? []).map(p => [p.id, p.address as string]));
  const byProp: Record<string, { address: string; income: number; expenses: number; net: number }> = {};

  let totalIncome = 0;
  let totalExpenses = 0;

  for (const e of eventsRes.data ?? []) {
    if (!e.amount || !e.property_id) continue;
    if (!byProp[e.property_id]) {
      byProp[e.property_id] = { address: propMap[e.property_id] ?? "Unknown", income: 0, expenses: 0, net: 0 };
    }
    if (INCOME_TYPES.has(e.event_type)) {
      totalIncome += e.amount;
      byProp[e.property_id].income += e.amount;
    } else if (EXPENSE_TYPES.has(e.event_type)) {
      totalExpenses += e.amount;
      byProp[e.property_id].expenses += e.amount;
    }
  }

  for (const v of Object.values(byProp)) v.net = v.income - v.expenses;

  return NextResponse.json({
    taxYear: label,
    start,
    end,
    income: totalIncome,
    expenses: totalExpenses,
    net: totalIncome - totalExpenses,
    byProperty: Object.values(byProp).sort((a, b) => b.income - a.income),
  });
}
