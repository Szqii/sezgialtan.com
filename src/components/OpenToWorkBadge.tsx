"use client";

import { motion } from "framer-motion";

export function OpenToWorkBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay: 2.6, ease: "backOut" }}
      className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)]/90 px-4 py-2.5 shadow-lg backdrop-blur-md"
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-secondary)] opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-secondary)]" />
      </span>
      <span className="font-mono text-xs font-semibold text-[var(--color-text)]">
        Open to work
      </span>
    </motion.div>
  );
}
