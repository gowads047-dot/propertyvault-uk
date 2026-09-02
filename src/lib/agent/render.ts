import { TOOL_DEFS } from "./tools";

/**
 * How a tool run is described and drawn in the conversation.
 *
 * Kept out of the components so the invariant that matters can be tested
 * without a DOM: every tool the model is offered has a human label, and every
 * component the tools ask for exists. Add a tool, forget the UI, and the user
 * watches the agent do something it cannot name — these tests catch that at
 * commit time rather than in production.
 */

/** The components a tool result may ask the page to draw. */
export const RENDER_KINDS = ["score", "sdlt", "area", "stress", "tax", "offer", "constraints"] as const;
export type RenderKind = (typeof RENDER_KINDS)[number];

export function isRenderKind(v: unknown): v is RenderKind {
  return typeof v === "string" && (RENDER_KINDS as readonly string[]).includes(v);
}

/**
 * What the agent is doing, in the user's words rather than the tool's.
 *
 * Present tense and specific: "Checking sold prices" tells someone what is
 * happening; "lookup_area" tells them the code is talking to itself.
 */
const TOOL_LABELS: Record<string, string> = {
  analyse_deal: "Running the numbers",
  calculate_stamp_duty: "Working out stamp duty",
  stress_test: "Stress testing the rate",
  lookup_area: "Checking sold prices",
  lookup_constraints: "Checking planning constraints",
  maximum_offer: "Solving the maximum offer",
  calculate_section_24: "Working out the Section 24 credit",
  calculate_capital_gains: "Working out capital gains tax",
};

export function stepLabel(tool: string): string {
  return TOOL_LABELS[tool] ?? tool.replace(/_/g, " ");
}

/** Every tool the model can be offered, so a new one cannot ship unlabelled. */
export function unlabelledTools(): string[] {
  return TOOL_DEFS.map(t => t.name).filter(n => !(n in TOOL_LABELS));
}

export const gbp = (n: number) => {
  const rounded = Math.round(n);
  // Minus belongs outside the symbol: -£160, never £-160.
  return `${rounded < 0 ? "-" : ""}£${Math.abs(rounded).toLocaleString("en-GB")}`;
};

export const pct = (n: number) => `${n.toFixed(1)}%`;

const SHORT_MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/**
 * An ISO sold date as a UK reader writes it.
 *
 * Formatted from the parts rather than through `toLocaleDateString`, which
 * would read the string as UTC midnight and render the previous day for anyone
 * west of Greenwich. A date the source could not give is an em dash, not a
 * plausible-looking substitute.
 */
export function soldDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return "—";
  const month = SHORT_MONTHS[Number(m[2]) - 1];
  if (!month) return "—";
  return `${Number(m[3])} ${month} ${m[1]}`;
}

// -- the model's prose --------------------------------------------------------

export type Span = { text: string; bold: boolean };
export type Block =
  | { kind: "heading"; spans: Span[] }
  | { kind: "paragraph"; spans: Span[] }
  | { kind: "list"; items: Span[][] };

/**
 * The small slice of Markdown the model is told to write.
 *
 * Deliberately not a Markdown library. The model's output is untrusted text —
 * a listing pasted into the conversation can carry anything — so this produces
 * plain data that React renders as elements. There is no HTML path, no link
 * and no image, which means nothing the model emits can become markup.
 *
 * Everything it does not understand survives as literal text rather than
 * disappearing, so a stray character is visible rather than silently eaten.
 */
export function parseProse(text: string): Block[] {
  const blocks: Block[] = [];
  let paragraph: string[] = [];
  let items: Span[][] = [];

  const flushParagraph = () => {
    if (paragraph.length) blocks.push({ kind: "paragraph", spans: parseSpans(paragraph.join(" ")) });
    paragraph = [];
  };
  const flushList = () => {
    if (items.length) blocks.push({ kind: "list", items });
    items = [];
  };

  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();

    if (line === "") {
      flushParagraph();
      flushList();
      continue;
    }

    const heading = /^#{1,6}\s+(.*)$/.exec(line);
    if (heading) {
      flushParagraph();
      flushList();
      blocks.push({ kind: "heading", spans: parseSpans(heading[1]) });
      continue;
    }

    const bullet = /^[-*]\s+(.*)$/.exec(line);
    if (bullet) {
      flushParagraph();
      items.push(parseSpans(bullet[1]));
      continue;
    }

    flushList();
    paragraph.push(line);
  }

  flushParagraph();
  flushList();
  return blocks;
}

/** Bold runs within a line. An unclosed ** stays as the characters it is. */
export function parseSpans(line: string): Span[] {
  const spans: Span[] = [];
  const re = /\*\*(.+?)\*\*/g;
  let last = 0;
  let m: RegExpExecArray | null;

  while ((m = re.exec(line)) !== null) {
    if (m.index > last) spans.push({ text: line.slice(last, m.index), bold: false });
    spans.push({ text: m[1], bold: true });
    last = m.index + m[0].length;
  }
  if (last < line.length) spans.push({ text: line.slice(last), bold: false });
  return spans.length ? spans : [{ text: line, bold: false }];
}

/**
 * Trim a conversation to what the route will accept.
 *
 * The route rejects a whole request that is too long, which would lose the
 * question the user just typed. Dropping the oldest turns instead keeps the
 * conversation usable, and the pair boundary is preserved so it still starts
 * with a user turn.
 */
export function trimForRequest<T extends { role: "user" | "assistant" }>(
  messages: T[],
  max = 20,
): T[] {
  if (messages.length <= max) return messages;
  let kept = messages.slice(messages.length - max);
  while (kept.length > 0 && kept[0].role !== "user") kept = kept.slice(1);
  return kept;
}
