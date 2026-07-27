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

import { AnswerCard, AnswerPhoto } from "@/components/cards";
import type { ChatMessage } from "@/components/Chat";
import { RichText } from "@/components/RichText";
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

        // Hold the photo back until its paragraph has finished typing. It's
        // attached to the story, so it should land as the story lands — not
        // sit there waiting while the sentence catches up.
        const showPhoto = block.photo && (!isCurrent || done);

        return (
          <div
            key={i}
            // A div rather than a paragraph, because a paragraph can only hold
            // phrasing content and the photo is a figure. The prose keeps its
            // own <p> inside.
            //
            // A bubble carrying a photo is sized by the photo, the way a photo
            // message is in any chat app — 332px is a 300px picture plus the
            // px-4 either side. Left at the usual 92% the bubble would be as
            // wide as the text on a desktop and the picture would sit in the
            // corner of a large empty rectangle.
            //
            // Keyed on `block.photo` rather than `showPhoto` so the width is
            // settled before the photo arrives, and the text doesn't reflow
            // under it mid-reveal.
            className={`rounded-bubble rounded-bl-md px-4 py-2.5 shadow-[var(--app-shadow)] ${
              block.photo ? "max-w-[332px]" : "max-w-[92%]"
            } ${failed ? "bg-surface-2 text-muted" : "bg-surface text-text"}`}
          >
            <p className="whitespace-pre-wrap text-[15px] leading-relaxed">
              <RichText text={text} />
              {isCurrent && !done && <span className="streaming-caret" />}
            </p>
            {showPhoto && <AnswerPhoto />}
          </div>
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
