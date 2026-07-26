"use client";

/**
 * The avatar that travels between routes.
 *
 * One <TravelingAvatar> lives in the root layout, so the same element survives
 * client-side navigation. Each page drops an <AvatarSlot> where it wants the
 * avatar to appear; the traveling avatar measures that slot and springs to it.
 * Going from `/` to `/chat/*` therefore reads as the photo physically flying up
 * and shrinking into the header, rather than one element swapping for another.
 *
 * Position is driven by motion values rather than React state so scrolling and
 * resizing don't trigger re-renders, and only `transform` is ever animated.
 */

import { animate, motion, useMotionValue } from "framer-motion";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { profile } from "@/lib/profile";

/** Rendered size of the underlying image; every slot scales down from this. */
const BASE = 128;

const SLOT_ATTR = "data-avatar-slot";

/**
 * Reserves space in page flow for the traveling avatar. Renders nothing
 * visible — the avatar itself is fixed-position and painted on top.
 */
export function AvatarSlot({
  size,
  className = "",
}: {
  size: number;
  className?: string;
}) {
  return (
    <div
      {...{ [SLOT_ATTR]: "" }}
      aria-hidden="true"
      style={{ width: size, height: size }}
      className={className}
    />
  );
}

export function TravelingAvatar() {
  const pathname = usePathname();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);
  const opacity = useMotionValue(0);

  // Skip the spring on the very first measurement, or the avatar visibly
  // slides in from the top-left corner on page load.
  const hasPositioned = useRef(false);

  useEffect(() => {
    let frame = 0;

    function measure(): DOMRect | null {
      const slot = document.querySelector(`[${SLOT_ATTR}]`);
      return slot ? slot.getBoundingClientRect() : null;
    }

    function apply(animated: boolean) {
      const rect = measure();
      if (!rect || rect.width === 0) {
        // No slot on this route — hide rather than stranding it mid-screen.
        opacity.set(0);
        return;
      }

      const target = {
        x: rect.left,
        y: rect.top,
        scale: rect.width / BASE,
      };

      if (animated && hasPositioned.current) {
        const spring = { type: "spring" as const, stiffness: 220, damping: 28 };
        animate(x, target.x, spring);
        animate(y, target.y, spring);
        animate(scale, target.scale, spring);
      } else {
        x.set(target.x);
        y.set(target.y);
        scale.set(target.scale);
      }

      hasPositioned.current = true;
      opacity.set(1);
    }

    // Let the new route paint before measuring its slot.
    frame = requestAnimationFrame(() => apply(true));

    // Scroll and resize reposition instantly — springing here would lag.
    let ticking = false;
    function onViewportChange() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        apply(false);
        ticking = false;
      });
    }

    window.addEventListener("scroll", onViewportChange, { passive: true });
    window.addEventListener("resize", onViewportChange);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onViewportChange);
      window.removeEventListener("resize", onViewportChange);
    };
  }, [pathname, x, y, scale, opacity]);

  return (
    <motion.div
      aria-hidden="true"
      data-traveling-avatar=""
      style={{
        x,
        y,
        scale,
        opacity,
        width: BASE,
        height: BASE,
        transformOrigin: "top left",
      }}
      className="pointer-events-none fixed left-0 top-0 z-30"
    >
      <div className="relative h-full w-full">
        <span className="absolute -inset-1 rounded-full bg-accent/15 blur-md" />
        <Image
          src={profile.photoHref}
          alt=""
          width={BASE * 2}
          height={BASE * 2}
          priority
          className="relative h-full w-full rounded-full border border-border object-cover"
        />
      </div>
    </motion.div>
  );
}
