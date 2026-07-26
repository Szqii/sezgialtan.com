"use client";

/**
 * The six topic chips.
 *
 * Two behaviours, because context changes what the right one is:
 *
 * - "navigate" (on `/`)     — real links to /chat/<id>. Next prefetches them
 *                             on viewport entry, which is most of why they
 *                             open instantly.
 * - "append"   (on /chat/*) — buttons that replace the thread with a new
 *                             topic. A link here would remount the route for
 *                             no reason.
 *
 * Chips are never disabled by the question quota: preset answers are
 * pre-written and cost nothing.
 */

import { motion } from "framer-motion";
import Link from "next/link";

import { Icon } from "@/components/Icons";
import { presets } from "@/lib/presets";

const chipClass =
  "group inline-flex items-center gap-2 rounded-chip border border-border/70 bg-surface px-3.5 py-2 text-[13.5px] font-medium text-text shadow-[0_1px_2px_rgb(20_25_23/0.04)] transition-[color,border-color] hover:border-accent/40 hover:text-accent";

const iconClass =
  "text-muted transition-[transform,color] group-hover:-translate-y-0.5 group-hover:text-accent";

const hover = { y: -2, boxShadow: "var(--app-shadow-lift)" };
const tap = { y: 0, scale: 0.97 };
const spring = { type: "spring" as const, stiffness: 400, damping: 25 };

export function PresetChips({
  mode,
  onSelect,
  className = "",
  stagger = true,
}: {
  mode: "navigate" | "append";
  onSelect?: (presetId: string) => void;
  className?: string;
  stagger?: boolean;
}) {
  return (
    <ul
      className={`flex flex-wrap justify-center gap-2 ${className}`}
      aria-label="Topics"
    >
      {presets.map((preset, i) => (
        <motion.li
          key={preset.id}
          initial={stagger ? { opacity: 0, y: 8 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={
            stagger
              ? { delay: 0.28 + i * 0.045, duration: 0.3 }
              : { duration: 0.2 }
          }
        >
          {mode === "navigate" ? (
            <motion.div whileHover={hover} whileTap={tap} transition={spring}>
              <Link href={`/chat/${preset.id}`} className={chipClass}>
                <span className={iconClass}>
                  <Icon name={preset.icon} />
                </span>
                {preset.label}
              </Link>
            </motion.div>
          ) : (
            <motion.button
              type="button"
              // Keep focus in the composer while the click lands — otherwise
              // blur hides this row mid-click and the press never registers.
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => onSelect?.(preset.id)}
              className={chipClass}
              whileHover={hover}
              whileTap={tap}
              transition={spring}
            >
              <span className={iconClass}>
                <Icon name={preset.icon} />
              </span>
              {preset.label}
            </motion.button>
          )}
        </motion.li>
      ))}
    </ul>
  );
}
