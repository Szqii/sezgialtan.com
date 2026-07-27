import Link from "next/link";

import { AvatarSlot } from "@/components/Avatar";
import { Chat, type ChatSeed } from "@/components/Chat";
import { profile } from "@/lib/profile";

/**
 * Chrome around the conversation: a compact header holding the avatar's
 * destination slot, and the thread itself.
 *
 * The header is sticky so the traveling avatar has a stable target — it
 * measures this slot, so if the slot scrolled away the avatar would chase it.
 */
export function ChatShell({ seed }: { seed: ChatSeed }) {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col">
      <header className="sticky top-0 z-20 flex items-center bg-bg/85 px-4 py-3 backdrop-blur-md">
        {/*
          Photo, name and title are one link home.

          The photo works without any wiring of its own: what you see is the
          fixed TravelingAvatar painted on top, and it's pointer-events-none,
          so clicks fall straight through onto the slot underneath — which
          lives inside this link. That's also what turns the cursor into a
          pointer over the photo. The avatar never receives the event, which
          is why hover feedback shows on the name instead.

          Deliberately not flex-1: stretching this across the header would
          make the empty space to the right navigate home on a stray click.
        */}
        <Link
          href="/"
          className="group flex min-w-0 items-center gap-3 rounded-inner"
        >
          <AvatarSlot width={34} />
          <span className="min-w-0">
            <span className="block truncate font-display text-[15px] font-semibold leading-tight text-text transition-colors group-hover:text-accent">
              {profile.name}
            </span>
            <span className="block truncate font-mono text-[11px] text-muted">
              {profile.title}
            </span>
          </span>
        </Link>
      </header>

      <div className="flex flex-1 flex-col pt-4">
        <Chat seed={seed} />
      </div>
    </main>
  );
}
