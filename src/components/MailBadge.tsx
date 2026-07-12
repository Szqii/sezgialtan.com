"use client";

import { motion } from "framer-motion";
import { MailIcon } from "@/components/Icons";
import { profile } from "@/lib/data";

export function MailBadge() {
  return (
    <motion.a
      href={`mailto:${profile.email}`}
      data-cursor-hover
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay: 2.6, ease: "backOut" }}
      className="fixed bottom-5 left-5 z-40 flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)]/90 px-4 py-2.5 shadow-lg backdrop-blur-md transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
    >
      <MailIcon className="h-3.5 w-3.5" />
      <span className="font-mono text-xs font-semibold">{profile.email}</span>
    </motion.a>
  );
}
