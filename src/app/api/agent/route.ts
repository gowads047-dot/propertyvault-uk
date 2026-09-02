import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { runAgent, type ClientMessage } from "@/lib/agent/loop";
import { fetchArea } from "@/lib/agent/area";
import { callerKey, consumeAll, supabaseStore, type RateLimitRule } from "@/lib/rate-limit";

/**
 * The PropertyVault agent.
 *
 * Multi-step: the model chooses which tools to call and in what order, and the
 * loop feeds each result back until it stops asking. That is what separates
 * this from /api/deal-ai-verdict, where we pick the inputs and the model
 * comments once.
 *
 * The limits here are tighter than the verdict's for a simple reason: one
 * request can make several model calls, so the same number of requests costs
 * several times as much. The turn cap in the loop bounds a single
 * conversation; these bound how many conversations happen.
 */

export const maxDuration = 60;

const client = new Anthropic();

const PER_CALLER: RateLimitRule = { name: "agent", limit: 20, windowSeconds: 3600 };
const GLOBAL: RateLimitRule = { name: "agent-global", limit: 1_000, windowSeconds: 86_400 };

/** Enough for a real question, short enough that nobody pastes a novel. */
const MAX_CHARS = 4_000;
const MAX_MESSAGES = 20;

export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "The agent is not configured on this server." }, { status: 500 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  // No store means no limiter, and an agent loop with no limiter is the most
  // expensive endpoint in the app.
  if (!url || !serviceKey) {
    return NextResponse.json({ error: "The agent is temporarily unavailable." }, { status: 503 });
  }

  const caller = callerKey(request.headers);
  const { allowed, results } = await consumeAll(supabaseStore(url, serviceKey), [
    { rule: PER_CALLER, caller },
    { rule: GLOBAL, caller: "all" },
  ]);

  if (!allowed) {
    const degraded = results.some(r => r.degraded);
    return NextResponse.json(
      { error: degraded ? "The agent is temporarily unavailable." : "Too many requests. Try again later." },
      { status: degraded ? 503 : 429, headers: { "Retry-After": "3600" } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const messages = parseMessages(body);
  if (!messages) {
    return NextResponse.json({ error: "Expected a messages array of user and assistant turns." }, { status: 400 });
  }

  try {
    const outcome = await runAgent(
      { create: req => client.messages.create(req as never) as never },
      messages,
      { fetchArea },
    );

    return NextResponse.json({
      text: outcome.text,
      // The UI renders these as components rather than printing them as text.
      steps: outcome.steps.map(s => ({
        tool: s.tool, ok: s.ok, render: s.result?.render ?? null,
        data: s.result?.data ?? null, error: s.error ?? null,
      })),
      evidence: outcome.evidence,
      truncated: outcome.truncated,
      turns: outcome.turns,
    });
  } catch (err) {
    // Upstream messages can carry keys and request ids.
    console.error("agent failed:", err);
    return NextResponse.json({ error: "The agent could not complete that. Please try again." }, { status: 502 });
  }
}

/**
 * Accept only the shape the loop expects.
 *
 * Content stays a plain string on the way in: allowing arbitrary block arrays
 * from the client would let a caller forge tool_result blocks and put words in
 * a tool's mouth.
 */
function parseMessages(body: unknown): ClientMessage[] | null {
  if (typeof body !== "object" || body === null) return null;
  const raw = (body as { messages?: unknown }).messages;
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > MAX_MESSAGES) return null;

  const out: ClientMessage[] = [];
  for (const m of raw) {
    if (typeof m !== "object" || m === null) return null;
    const { role, content } = m as { role?: unknown; content?: unknown };
    if (role !== "user" && role !== "assistant") return null;
    if (typeof content !== "string" || content.length === 0 || content.length > MAX_CHARS) return null;
    out.push({ role, content });
  }
  // A conversation has to start with the user, or the API rejects it anyway.
  if (out[0].role !== "user") return null;
  return out;
}
