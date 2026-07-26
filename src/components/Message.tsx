"use client";

/**
 * One turn in the conversation.
 *
 * Assistant messages render a progress pointer over their blocks — everything
 * before `blockIndex` is complete, the block at `blockIndex` is partially
 * revealed, everything after is not yet shown. Preset answers and streamed API
 * answers both drive that same pointer, which is what keeps them
 * indistinguishable on screen.
 *
 * Prose sits in a bubble so a turn reads as a message; cards break out of the
 * bubble full-width, because a skills grid squeezed into a speech balloon
 * looks like a mistake.
 */

import { motion } from "framer-motion";

import { AnswerCard } from "@/components/cards";
import type { ChatMessage } from "@/components/Chat";
import { profile } from "@/lib/profile";

const spring = { type: "spring" as const, stiffness: 320, damping: 26 };

export function Message({ message }: { message: ChatMessage }) {
  if (message.role === "user") {
    return (
      <motion.div
        layout="position"
        initial={{ opacity: 0, x: 16, scale: 0.96 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.94, y: -6 }}
        transition={spring}
        className="flex justify-end"
      >
        <p className="max-w-[85%] whitespace-pre-wrap rounded-bubble rounded-br-md bg-accent px-4 py-2.5 text-[15px] leading-relaxed text-accent-fg shadow-[var(--app-shadow)]">
          {message.text}
        </p>
      </motion.div>
    );
  }

  const { blocks, blockIndex, charCount, done, failed } = message;

  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={spring}
      className="flex flex-col items-start gap-2.5"
    >
      {blocks.map((block, i) => {
        if (i > blockIndex) return null;

        if (block.type === "card") {
          return (
            <div key={i} className="w-full">
              <AnswerCard card={block.card} />
            </div>
          );
        }

        const isCurrent = i === blockIndex;
        const text = isCurrent ? block.text.slice(0, charCount) : block.text;
        if (!text) return null;

        return (
          <p
            key={i}
            className={`max-w-[92%] whitespace-pre-wrap rounded-bubble rounded-bl-md px-4 py-2.5 text-[15px] leading-relaxed shadow-[var(--app-shadow)] ${
              failed
                ? "bg-surface-2 text-muted"
                : "bg-surface text-text"
            }`}
          >
            {text}
            {isCurrent && !done && <span className="streaming-caret" />}
          </p>
        );
      })}

      {/* Nothing revealed yet — show the thinking state instead of a gap. */}
      {blocks.length === 0 && !done && <TypingBubble />}
    </motion.div>
  );
}

function TypingBubble() {
  return (
    <div
      className="flex items-center gap-1.5 rounded-bubble rounded-bl-md bg-surface px-4 py-3.5 shadow-[var(--app-shadow)]"
      aria-label={`${profile.firstName} is thinking`}
    >
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          animate={{ opacity: [0.25, 1, 0.25], y: [0, -3, 0] }}
          transition={{
            duration: 1.1,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut",
          }}
          className="h-1.5 w-1.5 rounded-full bg-muted"
        />
      ))}
    </div>
  );
}
