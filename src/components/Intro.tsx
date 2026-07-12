"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const LINES: { text: string; check?: boolean }[] = [
  { text: "booting sezgialtan.com..." },
  { text: "loading experience.json", check: true },
  { text: "compiling skills...", check: true },
  { text: "ready." },
];

const LINE_GAP = 0.4;
const CHECK_DELAY = 0.25;
const LAST_LINE_DELAY = (LINES.length - 1) * LINE_GAP;
const EXIT_DELAY = LAST_LINE_DELAY + 0.75;

export function Intro() {
  const [visible, setVisible] = useState(true);
  const [skip, setSkip] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const seen = sessionStorage.getItem("intro-seen");
    if (reducedMotion || seen) {
      setSkip(true);
      setVisible(false);
      return;
    }
    sessionStorage.setItem("intro-seen", "1");
    document.body.style.overflow = "hidden";
    const timer = setTimeout(() => {
      setVisible(false);
      document.body.style.overflow = "";
    }, EXIT_DELAY * 1000 + 500);
    return () => clearTimeout(timer);
  }, []);

  if (skip) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-[var(--color-bg)]"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <div className="w-[20rem] font-mono text-sm sm:w-[26rem] sm:text-base">
            {LINES.map((line, i) => (
              <motion.p
                key={line.text}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: i * LINE_GAP }}
                className="flex items-center gap-2 py-0.5 text-[var(--color-text)]"
              >
                <span className="text-[var(--color-secondary)]">{">"}</span>
                <span>{line.text}</span>
                {line.check && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.25, delay: i * LINE_GAP + CHECK_DELAY }}
                    className="text-[var(--color-secondary)]"
                  >
                    ✓
                  </motion.span>
                )}
                {i === LINES.length - 1 && (
                  <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
                    className="text-[var(--color-secondary)]"
                  >
                    _
                  </motion.span>
                )}
              </motion.p>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
