"use client";

/**
 * The landing hero.
 *
 * Order is heading → tagline → photo → input. The name reads first, and the
 * photo sits directly above the input so it anchors the thing being asked:
 * you're not typing into a search box, you're asking a person.
 *
 * Everything cascades in on load. It's one orchestrated sequence rather than
 * five separate effects, which is the difference between "designed" and
 * "animated".
 */

import { motion } from "framer-motion";

import { AvatarSlot } from "@/components/Avatar";
import { Composer } from "@/components/Composer";
import { PresetChips } from "@/components/PresetChips";
import { profile } from "@/lib/profile";

const rise = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col items-center justify-center gap-6 px-4 py-16">
      <motion.h1
        variants={rise}
        initial="hidden"
        animate="show"
        transition={{ duration: 0.5, ease }}
        className="text-balance text-center font-display text-4xl font-semibold tracking-tight text-text sm:text-5xl"
      >
        {profile.heading}
      </motion.h1>

      <motion.p
        variants={rise}
        initial="hidden"
        animate="show"
        transition={{ duration: 0.5, ease, delay: 0.06 }}
        className="-mt-4 text-center text-base text-muted"
      >
        {profile.tagline}
      </motion.p>

      <motion.div
        variants={rise}
        initial="hidden"
        animate="show"
        transition={{ duration: 0.5, ease, delay: 0.12 }}
        // Ambient float — small enough to read as alive rather than animated.
        className="my-1"
      >
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <AvatarSlot size={112} />
        </motion.div>
      </motion.div>

      <motion.div
        variants={rise}
        initial="hidden"
        animate="show"
        transition={{ duration: 0.5, ease, delay: 0.18 }}
        className="w-full"
      >
        <Composer mode="navigate" />
      </motion.div>

      <PresetChips mode="navigate" className="max-w-lg" />

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="mt-2 text-center font-mono text-[11px] text-muted"
      >
        {profile.location}
        {profile.openToWork && (
          <>
            <span aria-hidden="true"> · </span>
            <span className="text-accent">open to work</span>
          </>
        )}
      </motion.p>
    </main>
  );
}
