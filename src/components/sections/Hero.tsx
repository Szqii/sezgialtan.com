"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import type { MouseEvent } from "react";
import { profile } from "@/lib/data";

export function Hero() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), {
    stiffness: 150,
    damping: 15,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), {
    stiffness: 150,
    damping: 15,
  });

  function onMouseMove(e: MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function onMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <section
      id="top"
      className="relative mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center gap-10 px-6 pt-24 sm:flex-row sm:gap-12"
    >
      <motion.div
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{ perspective: 1000 }}
        initial={{ opacity: 0, scale: 0.85, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative order-1 h-64 w-64 shrink-0 sm:order-2 sm:h-80 sm:w-80 md:h-96 md:w-96"
      >
        <div
          className="absolute inset-0 -z-10 rounded-full opacity-40 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, var(--color-primary), var(--color-secondary), transparent 70%)",
          }}
        />

        <motion.div style={{ rotateX, rotateY }} className="relative h-full w-full">
          <Image
            src={profile.photoHref}
            alt={profile.name}
            fill
            priority
            sizes="(min-width: 768px) 24rem, (min-width: 640px) 20rem, 16rem"
            className="object-contain object-center drop-shadow-2xl"
          />
        </motion.div>

        <motion.div
          className="absolute inset-x-6 bottom-2 -z-10 h-8 rounded-full bg-black/30 blur-xl"
          animate={{ scaleX: [1, 0.9, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      <div className="order-2 max-w-xl text-center sm:order-1 sm:text-left">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.8 }}
          className="font-mono text-sm text-[var(--color-secondary)]"
        >
          Hi, I&apos;m
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.9 }}
          className="font-display mt-2 text-5xl font-semibold tracking-tight sm:text-6xl"
        >
          {profile.name}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 2.05 }}
          className="mt-5 text-lg text-[var(--color-text-muted)]"
        >
          {profile.tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 2.2 }}
          className="mt-8 flex flex-wrap justify-center gap-3 sm:justify-start"
        >
          <a
            href={profile.resumeHref}
            download
            data-cursor-hover
            className="rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm font-medium text-white transition-transform hover:scale-105"
          >
            Download résumé
          </a>
          <a
            href="#contact"
            data-cursor-hover
            className="rounded-full border border-[var(--color-border)] px-6 py-3 text-sm font-medium transition-colors hover:border-[var(--color-secondary)] hover:text-[var(--color-secondary)]"
          >
            Say hi
          </a>
        </motion.div>
      </div>

      <motion.a
        href="#about"
        data-cursor-hover
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 2.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[var(--color-text-muted)]"
        aria-label="Scroll to About"
      >
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="block text-xl"
        >
          ↓
        </motion.span>
      </motion.a>
    </section>
  );
}
