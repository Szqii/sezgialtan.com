"use client";

import { MotionConfig } from "framer-motion";

/**
 * One switch for every Framer animation on the site.
 *
 * `reducedMotion="user"` means each component's motion respects the OS setting
 * without needing its own guard. Hand-rolled CSS animations still need theirs —
 * those live in globals.css under the prefers-reduced-motion block.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
