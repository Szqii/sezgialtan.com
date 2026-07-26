"use client";

/**
 * The conversation.
 *
 * The central idea: preset answers and API answers are rendered by exactly the
 * same code. Both advance a progress pointer (`blockIndex` + `charCount`) over
 * a list of blocks. The only difference is what paces them —
 *
 *   preset → a local rAF loop, because we already have the whole answer
 *   API    → the network, because the tokens arrive when they arrive
 *
 * so there is one renderer and no forked "is this real AI" branch.
 */

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

import { Composer } from "@/components/Composer";
import { Message } from "@/components/Message";
import { PresetChips } from "@/components/PresetChips";
import type { AnswerBlock, Preset } from "@/lib/presets";
import { getPreset, presetAnswerText } from "@/lib/presets";

/** Characters revealed per animation frame for pre-written answers. */
const CHARS_PER_FRAME = 4;

export type ChatMessage =
  | { id: string; role: "user"; text: string }
  | {
      id: string;
      role: "assistant";
      blocks: AnswerBlock[];
      blockIndex: number;
      charCount: number;
      done: boolean;
      /** Paced locally (preset) rather than by the network (API). */
      paced: boolean;
      failed?: boolean;
      /** Plain text sent back as history; omitted for preset answers. */
      historyText?: string;
    };

/** Shape the API route expects for prior turns. */
type ApiMessage = { role: "user" | "assistant"; content: string };

export type ChatSeed =
  | { kind: "preset"; presetId: string }
  | { kind: "question"; question: string }
  | { kind: "empty" };

let counter = 0;
const nextId = () => `m${++counter}`;

export function Chat({ seed }: { seed: ChatSeed }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  const scrollAnchor = useRef<HTMLDivElement>(null);
  const followScroll = useRef(true);
  const seeded = useRef(false);

  /* ---------------------------------------------------------------- scroll */

  // Follow the conversation only while the visitor is already at the bottom.
  // Yanking the viewport out from under someone who scrolled up to re-read is
  // the fastest way to make a chat feel broken.
  useEffect(() => {
    function onScroll() {
      const distanceFromBottom =
        document.documentElement.scrollHeight -
        window.scrollY -
        window.innerHeight;
      followScroll.current = distanceFromBottom < 120;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (followScroll.current) {
      scrollAnchor.current?.scrollIntoView({ block: "end" });
    }
  });

  /* --------------------------------------------------------------- presets */

  const runPreset = useCallback((presetId: string) => {
    const preset: Preset | undefined = getPreset(presetId);
    if (!preset) return;

    followScroll.current = true;
    setMessages((prev) => [
      ...prev,
      { id: nextId(), role: "user", text: preset.userPrompt },
      {
        id: nextId(),
        role: "assistant",
        blocks: preset.answer,
        blockIndex: 0,
        charCount: 0,
        done: false,
        paced: true,
        historyText: presetAnswerText(preset),
      },
    ]);
  }, []);

  // Drive the reveal for whichever pre-written answer is currently running.
  useEffect(() => {
    const last = messages[messages.length - 1];
    if (!last || last.role !== "assistant" || !last.paced || last.done) return;

    let frame = requestAnimationFrame(function step() {
      let finished = false;

      setMessages((prev) => {
        const idx = prev.length - 1;
        const msg = prev[idx];
        if (!msg || msg.role !== "assistant" || msg.done) return prev;

        let { blockIndex, charCount } = msg;
        let block = msg.blocks[blockIndex];

        // Cards have no characters to type — show them whole and move on.
        while (block && block.type === "card") {
          blockIndex += 1;
          charCount = 0;
          block = msg.blocks[blockIndex];
        }

        if (!block) {
          finished = true;
          return [
            ...prev.slice(0, idx),
            { ...msg, blockIndex: msg.blocks.length - 1, done: true },
          ];
        }

        charCount += CHARS_PER_FRAME;

        if (charCount >= block.text.length) {
          const isLast = blockIndex === msg.blocks.length - 1;
          if (isLast) finished = true;
          return [
            ...prev.slice(0, idx),
            {
              ...msg,
              charCount: block.text.length,
              blockIndex: isLast ? blockIndex : blockIndex + 1,
              done: isLast,
            },
          ];
        }

        return [
          ...prev.slice(0, idx),
          { ...msg, blockIndex, charCount },
        ];
      });

      if (!finished) frame = requestAnimationFrame(step);
    });

    return () => cancelAnimationFrame(frame);
  }, [messages]);

  /* ------------------------------------------------------------------- API */

  const ask = useCallback(
    async (question: string) => {
      if (busy) return;
      setBusy(true);
      followScroll.current = true;

      // History is text-only. Preset answers contribute their prose summary,
      // not their cards — six chip clicks would otherwise blow the input
      // budget on every subsequent question.
      const history = messages.flatMap<ApiMessage>((m) => {
        if (m.role === "user") return [{ role: "user", content: m.text }];
        const text = m.historyText ?? blocksToText(m.blocks);
        return text ? [{ role: "assistant", content: text }] : [];
      });

      const answerId = nextId();
      setMessages((prev) => [
        ...prev,
        { id: nextId(), role: "user", text: question },
        {
          id: answerId,
          role: "assistant",
          blocks: [],
          blockIndex: 0,
          charCount: 0,
          done: false,
          paced: false,
        },
      ]);

      const settle = (text: string, failed: boolean) =>
        setMessages((prev) =>
          prev.map((m) =>
            m.id === answerId && m.role === "assistant"
              ? {
                  ...m,
                  blocks: [{ type: "text", text }],
                  blockIndex: 0,
                  charCount: text.length,
                  done: true,
                  failed,
                }
              : m,
          ),
        );

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: question, history }),
        });

        const headerRemaining = res.headers.get("X-Questions-Remaining");
        if (headerRemaining !== null) setRemaining(Number(headerRemaining));

        if (!res.ok || !res.body) {
          const data = await res.json().catch(() => null);
          const text =
            data?.error ?? "Something went wrong on my end — try again?";
          if (typeof data?.remaining === "number") setRemaining(data.remaining);
          if (res.status === 429) setRemaining(0);
          settle(text, true);
          setAnnouncement(text);
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let text = "";

        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          text += decoder.decode(value, { stream: true });

          setMessages((prev) =>
            prev.map((m) =>
              m.id === answerId && m.role === "assistant"
                ? {
                    ...m,
                    blocks: [{ type: "text", text }],
                    blockIndex: 0,
                    charCount: text.length,
                  }
                : m,
            ),
          );
        }

        settle(text, false);
        setAnnouncement(text);
      } catch {
        const text = "I couldn't reach my own brain just then — try again?";
        settle(text, true);
        setAnnouncement(text);
      } finally {
        setBusy(false);
      }
    },
    [busy, messages],
  );

  /* ------------------------------------------------------------------ seed */

  useEffect(() => {
    if (seeded.current) return;
    seeded.current = true;

    if (seed.kind === "preset") runPreset(seed.presetId);
    else if (seed.kind === "question") void ask(seed.question);
    // `ask` closes over `messages`, but on the seeding pass it's empty anyway.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed]);

  /* ---------------------------------------------------------------- render */

  const outOfQuestions = remaining !== null && remaining <= 0;

  return (
    <>
      <div className="mx-auto w-full max-w-2xl space-y-5 px-4 pb-4">
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <Message key={message.id} message={message} />
          ))}
        </AnimatePresence>
        <div ref={scrollAnchor} />
      </div>

      {/* Announce finished answers only — announcing every streamed chunk
          would make a screen reader unusable. */}
      <p className="sr-only" role="status" aria-live="polite">
        {announcement}
      </p>

      <div className="sticky bottom-0 z-20 mt-auto bg-gradient-to-t from-bg via-bg to-transparent pb-4 pt-6">
        <div className="mx-auto w-full max-w-2xl space-y-3 px-4">
          <Composer
            mode="append"
            onSubmit={ask}
            disabled={outOfQuestions || busy}
            disabledNote={
              outOfQuestions
                ? "That's three! I'm keeping my token budget alive 😄 — the buttons below still work, or just email me at hello@sezgialtan.com."
                : undefined
            }
          />
          <PresetChips mode="append" onSelect={runPreset} />
          {remaining !== null && remaining > 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center font-mono text-[11px] text-muted"
            >
              {remaining} question{remaining === 1 ? "" : "s"} left · buttons are
              free
            </motion.p>
          )}
        </div>
      </div>
    </>
  );
}

function blocksToText(blocks: AnswerBlock[]): string {
  return blocks
    .map((b) => (b.type === "text" ? b.text : ""))
    .filter(Boolean)
    .join("\n\n");
}
