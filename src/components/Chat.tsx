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
 *
 * Presets behave a little differently from typed questions on purpose: the
 * question flashes up as a sent message, then withdraws so the answer stands
 * on its own, and picking a new topic clears the thread rather than stacking
 * six unrelated answers into one scroll.
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

/** How long a preset's question stays on screen before it withdraws. */
const PRESET_QUESTION_MS = 2000;

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
  const [composerFocused, setComposerFocused] = useState(false);

  const scrollAnchor = useRef<HTMLDivElement>(null);
  const followScroll = useRef(true);
  const seeded = useRef(false);
  const presetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  useEffect(() => () => {
    if (presetTimer.current) clearTimeout(presetTimer.current);
  }, []);

  /* --------------------------------------------------------------- presets */

  const runPreset = useCallback((presetId: string) => {
    const preset: Preset | undefined = getPreset(presetId);
    if (!preset) return;

    if (presetTimer.current) clearTimeout(presetTimer.current);
    followScroll.current = true;

    // Picking a topic replaces the thread rather than appending to it.
    setMessages([
      { id: nextId(), role: "user", text: preset.userPrompt },
    ]);

    presetTimer.current = setTimeout(() => {
      // The question withdraws and the answer takes its place, so the topic
      // reads as a heading rather than a transcript of a question nobody typed.
      setMessages([
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
    }, PRESET_QUESTION_MS);
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

        return [...prev.slice(0, idx), { ...msg, blockIndex, charCount }];
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

      // A typed question is a real turn: it stays, and it builds on whatever
      // came before. History is text-only — preset answers contribute their
      // prose summary, not their cards, or six chip clicks would blow the
      // input budget on every subsequent question.
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

  // Chips get out of the way once there's an answer to read, and come back the
  // moment the visitor reaches for the input — which is exactly when they're
  // deciding what to ask next.
  //
  // The seed check matters: on a preset route `messages` is still empty for the
  // first frame, so keying off length alone would flash the chips in and then
  // collapse them the moment the answer seeds.
  const chipsVisible =
    composerFocused || (seed.kind === "empty" && messages.length === 0);

  return (
    <>
      <div className="mx-auto w-full max-w-2xl space-y-4 px-4 pb-4">
        <AnimatePresence initial={false} mode="popLayout">
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

      <div className="sticky bottom-0 z-20 mt-auto bg-gradient-to-t from-bg via-bg to-transparent pb-4 pt-8">
        <div className="mx-auto w-full max-w-2xl px-4">
          <AnimatePresence initial={false}>
            {chipsVisible && (
              <motion.div
                key="chips"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="overflow-hidden"
              >
                <PresetChips
                  mode="append"
                  onSelect={runPreset}
                  stagger={false}
                  className="pb-3"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <Composer
            mode="append"
            onSubmit={ask}
            onFocusChange={setComposerFocused}
            disabled={outOfQuestions || busy}
            disabledNote={
              outOfQuestions
                ? "That's three! I'm keeping my token budget alive 😄 — the buttons above still work, or just email me at hello@sezgialtan.com."
                : undefined
            }
          />

          {remaining !== null && remaining > 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-2 text-center font-mono text-[11px] text-muted"
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
