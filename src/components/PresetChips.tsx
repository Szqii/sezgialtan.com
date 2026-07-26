"use client";

/**
 * The six topic chips.
 *
 * Two behaviours, because context changes what the right one is:
 *
 * - "navigate" (on `/`)     — real links to /chat/<id>. Next prefetches them
 *                             on viewport entry, which is most of why they
 *                             open instantly.
 * - "append"   (on /chat/*) — buttons that add to the current thread. A link
 *                             here would throw away the conversation the
 *                             visitor is already having.
 *
 * Chips are never disabled by the question quota: preset answers are
 * pre-written and cost nothing.
 */

import { motion } from "framer-motion";
import Link from "next/link";

import { presets } from "@/lib/presets";

const chipClass =
  "group inline-flex items-center gap-2 rounded-chip border border-border bg-surface px-4 py-2 text-sm font-medium text-text shadow-[0_1px_2px_rgb(20_25_23/0.04)] transition-[color,border-color,box-shadow] hover:border-accent/40 hover:text-accent";

const emojiClass =
  "text-base transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:scale-110";

const hover = { y: -2, boxShadow: "var(--app-shadow-lift)" };
const tap = { y: 0, scale: 0.98 };
const spring = { type: "spring" as const, stiffness: 400, damping: 25 };

export function PresetChips({
  mode,
  onSelect,
  className = "",
}: {
  mode: "navigate" | "append";
  onSelect?: (presetId: string) => void;
  className?: string;
}) {
  return (
    <ul
      className={`flex flex-wrap justify-center gap-2 ${className}`}
      aria-label="Topics"
    >
      {presets.map((preset, i) => (
        <motion.li
          key={preset.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 + i * 0.045, duration: 0.3 }}
        >
          {mode === "navigate" ? (
            <motion.div whileHover={hover} whileTap={tap} transition={spring}>
              <Link href={`/chat/${preset.id}`} className={chipClass}>
                <span className={emojiClass} aria-hidden="true">
                  {preset.emoji}
                </span>
                {preset.label}
              </Link>
            </motion.div>
          ) : (
            <motion.button
              type="button"
              onClick={() => onSelect?.(preset.id)}
              className={chipClass}
              whileHover={hover}
              whileTap={tap}
              transition={spring}
            >
              <span className={emojiClass} aria-hidden="true">
                {preset.emoji}
              </span>
              {preset.label}
            </motion.button>
          )}
        </motion.li>
      ))}
    </ul>
  );
}
