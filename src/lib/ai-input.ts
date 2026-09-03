/**
 * Bounding what reaches a paid model call.
 *
 * A rate limit bounds how many requests happen. It does not bound how large
 * one is — and these chat routes forwarded `history` and `userInput` straight
 * from the request body into the API, so a single allowed request could carry
 * an arbitrarily long conversation and be billed for all of it. Sixty requests
 * an hour of unbounded size is not a bound.
 *
 * It also caught something smaller: an empty message was being sent to the
 * API, which came back 400. A round trip, and a charge for the attempt, for a
 * request that could never have worked.
 */

export const CHAT_LIMITS = {
  /** One message. Long enough for a real question about a property. */
  userInput: 4_000,
  /** Turns of history. Enough for a full setup flow, not a transcript dump. */
  historyTurns: 40,
  /** Any single historical turn. */
  turnChars: 4_000,
};

export interface ConversationTurn {
  role: "user" | "assistant";
  content: string;
}

export type BoundResult =
  | { ok: true; userInput: string; history: ConversationTurn[] }
  | { ok: false; error: string };

export function boundConversation(raw: unknown): BoundResult {
  if (typeof raw !== "object" || raw === null) return { ok: false, error: "Invalid request." };
  const b = raw as { userInput?: unknown; history?: unknown };

  if (typeof b.userInput !== "string") return { ok: false, error: "Expected a message." };
  const userInput = b.userInput.trim().slice(0, CHAT_LIMITS.userInput);
  // An empty message cannot produce an answer, and the API rejects it — so
  // refuse it here rather than paying for the round trip that says so.
  if (userInput.length === 0) return { ok: false, error: "Expected a message." };

  const history: ConversationTurn[] = [];
  if (b.history !== undefined) {
    if (!Array.isArray(b.history)) return { ok: false, error: "Invalid conversation history." };

    // Keep the most recent turns: the end of a conversation is what the next
    // reply depends on, and dropping the start degrades the answer far less
    // than refusing the request.
    for (const item of b.history.slice(-CHAT_LIMITS.historyTurns)) {
      const t = (item ?? {}) as { role?: unknown; content?: unknown };
      if (t.role !== "user" && t.role !== "assistant") continue;
      if (typeof t.content !== "string") continue;
      const content = t.content.slice(0, CHAT_LIMITS.turnChars);
      if (content.length === 0) continue;
      history.push({ role: t.role, content });
    }
  }

  return { ok: true, userInput, history };
}
