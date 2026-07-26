"use client";

/**
 * One bubble.
 *
 * Assistant messages render a progress pointer over their blocks — everything
 * before `blockIndex` is complete, the block at `blockIndex` is partially
 * revealed, everything after is not yet shown. Preset answers and streamed API
 * answers both drive that same pointer, which is what keeps them
 * indistinguishable on screen.
 */

import { motion } from "framer-motion";

import { AnswerCard } from "@/components/cards";
import type { ChatMessage } from "@/components/Chat";

export function Message({ message }: { message: ChatMessage }) {
  if (message.role === "user") {
    return (
      <motion.div
        initial={{ opacity: 0, x: 16, scale: 0.96 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 320, damping: 26 }}
        className="flex justify-end"
      >
        <p className="max-w-[85%] whitespace-pre-wrap rounded-bubble rounded-br-md bg-accent px-4 py-2.5 text-[15px] leading-relaxed text-accent-fg">
          {message.text}
        </p>
      </motion.div>
    );
  }

  const { blocks, blockIndex, charCount, done, failed } = message;

  return (
    <motion.div
      initial={{ opacity: 0, x: -16, scale: 0.96 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 320, damping: 26 }}
      className="flex justify-start"
    >
      <div className="w-full max-w-[92%]">
        {blocks.map((block, i) => {
          if (i > blockIndex) return null;

          if (block.type === "card") {
            return <AnswerCard key={i} card={block.card} />;
          }

          const isCurrent = i === blockIndex;
          const text = isCurrent ? block.text.slice(0, charCount) : block.text;
          if (!text) return null;

          return (
            <p
              key={i}
              className={`whitespace-pre-wrap text-[15px] leading-relaxed ${
                failed ? "text-muted" : "text-text"
              } ${i > 0 ? "mt-3" : ""}`}
            >
              {text}
              {isCurrent && !done && <span className="streaming-caret" />}
            </p>
          );
        })}

        {/* Nothing revealed yet — show the thinking state instead of a gap. */}
        {blocks.length === 0 && !done && <TypingDots />}
      </div>
    </motion.div>
  );
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 py-2" aria-label="Thinking">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          animate={{ opacity: [0.25, 1, 0.25], scale: [0.85, 1, 0.85] }}
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
