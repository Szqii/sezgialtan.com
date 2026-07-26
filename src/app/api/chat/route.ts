/**
 * POST /api/chat — streams an answer from Claude.
 *
 * Only free-typed questions reach this endpoint. Preset chips serve
 * pre-written content on the client and never call it.
 *
 * This is a public endpoint spending real money, so it fails closed: no API
 * key, no quota secret, bad origin, or an oversized body all stop before the
 * SDK is touched.
 */

import Anthropic from "@anthropic-ai/sdk";
import { cookies, headers } from "next/headers";

import {
  COOKIE_NAME,
  MAX_QUESTIONS,
  buildQuotaCookie,
  isQuotaConfigured,
  readUsedCount,
} from "@/lib/rate-limit";
import { buildSystemPrompt } from "@/lib/system-prompt";
import { profile } from "@/lib/profile";

const MODEL = "claude-haiku-4-5";
const MAX_TOKENS = 1024;
const MAX_MESSAGE_CHARS = 500;
const MAX_HISTORY_TURNS = 8;
const MAX_HISTORY_CHARS = 6000;

const OFFLINE_MESSAGE = `The chat is offline right now — the buttons below still work, or you can email me at ${profile.email}.`;
const QUOTA_MESSAGE = `That's ${MAX_QUESTIONS}! I'm keeping my token budget alive 😄 — the buttons below still work, or just email me at ${profile.email}.`;

type ClientMessage = { role: "user" | "assistant"; content: string };

/** JSON error the client renders as an assistant bubble rather than a crash. */
function assistantError(message: string, status: number, remaining = 0) {
  return Response.json(
    { error: message, remaining },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}

/**
 * Reject cross-site POSTs. Not a substitute for the quota, but it stops the
 * endpoint being trivially embedded in someone else's page.
 */
async function isAllowedOrigin(): Promise<boolean> {
  if (process.env.NODE_ENV !== "production") return true;

  const h = await headers();
  const origin = h.get("origin");
  if (!origin) return false;

  const host = h.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

/** Trim history from the end, so recent turns survive the cap. */
function sanitizeHistory(raw: unknown): ClientMessage[] {
  if (!Array.isArray(raw)) return [];

  const valid = raw.filter(
    (m): m is ClientMessage =>
      !!m &&
      typeof m === "object" &&
      (m.role === "user" || m.role === "assistant") &&
      typeof m.content === "string" &&
      m.content.trim().length > 0,
  );

  const recent = valid.slice(-MAX_HISTORY_TURNS);

  const kept: ClientMessage[] = [];
  let chars = 0;
  for (let i = recent.length - 1; i >= 0; i--) {
    const msg = recent[i];
    if (chars + msg.content.length > MAX_HISTORY_CHARS) break;
    chars += msg.content.length;
    kept.unshift(msg);
  }

  // The API requires the first message to be from the user.
  while (kept.length > 0 && kept[0].role !== "user") kept.shift();

  return kept;
}

export async function POST(request: Request) {
  if (!(await isAllowedOrigin())) {
    return assistantError("Request blocked.", 403);
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return assistantError(OFFLINE_MESSAGE, 503);
  }

  // No signing secret means we couldn't enforce the quota, and an unmetered
  // public endpoint onto a paid API is worse than no chat at all.
  if (!isQuotaConfigured()) {
    console.error("[chat] CHAT_SECRET is not set — refusing to serve the chat.");
    return assistantError(OFFLINE_MESSAGE, 503);
  }

  const jar = await cookies();
  const used = await readUsedCount(jar.get(COOKIE_NAME)?.value);
  if (used >= MAX_QUESTIONS) {
    return assistantError(QUOTA_MESSAGE, 429);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return assistantError("That didn't come through — mind trying again?", 400);
  }

  const payload = body as { message?: unknown; history?: unknown };
  const message =
    typeof payload.message === "string" ? payload.message.trim() : "";

  if (!message) {
    return assistantError("Ask me something and I'll answer.", 400);
  }
  if (message.length > MAX_MESSAGE_CHARS) {
    return assistantError(
      `That's a long one — could you keep it under ${MAX_MESSAGE_CHARS} characters?`,
      400,
    );
  }

  const history = sanitizeHistory(payload.history);
  const remaining = MAX_QUESTIONS - (used + 1);

  const client = new Anthropic({ apiKey });

  let anthropicStream;
  try {
    anthropicStream = client.messages.stream(
      {
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system: buildSystemPrompt(),
        messages: [...history, { role: "user", content: message }],
      },
      { signal: request.signal },
    );
  } catch (error) {
    return assistantError(describeError(error), 502, remaining);
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const event of anthropicStream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
      } catch (error) {
        // Headers are long gone by now, so a failure mid-answer can only be
        // communicated inside the stream itself.
        if (!request.signal.aborted) {
          console.error("[chat] stream failed:", error);
          controller.enqueue(encoder.encode(`\n\n${describeError(error)}`));
        }
      } finally {
        controller.close();
      }
    },
    cancel() {
      anthropicStream.abort();
    },
  });

  // Set-Cookie has to go on the constructor: once the first chunk is enqueued
  // the response headers have already been sent.
  const responseHeaders = new Headers({
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    "X-Questions-Remaining": String(remaining),
  });

  const cookie = await buildQuotaCookie(used + 1);
  if (cookie) responseHeaders.append("Set-Cookie", cookie);

  return new Response(stream, { headers: responseHeaders });
}

function describeError(error: unknown): string {
  if (error instanceof Anthropic.AuthenticationError) {
    console.error("[chat] bad ANTHROPIC_API_KEY");
    return OFFLINE_MESSAGE;
  }
  if (error instanceof Anthropic.RateLimitError) {
    return "I'm getting a lot of questions right now — try again in a moment?";
  }
  if (error instanceof Anthropic.APIConnectionError) {
    return "I couldn't reach my own brain just then. Mind trying again?";
  }
  if (error instanceof Anthropic.APIError) {
    console.error("[chat] API error:", error.status, error.message);
    return "Something went wrong on my end — try again in a second.";
  }
  console.error("[chat] unexpected error:", error);
  return "Something went wrong on my end — try again in a second.";
}
