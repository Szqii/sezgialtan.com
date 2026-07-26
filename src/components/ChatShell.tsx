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
      <header className="sticky top-0 z-20 flex items-center gap-3 bg-bg/85 px-4 py-3 backdrop-blur-md">
        <AvatarSlot size={40} />
        <div className="min-w-0 flex-1">
          <Link
            href="/"
            className="block truncate font-display text-[15px] font-semibold leading-tight text-text transition-colors hover:text-accent"
          >
            {profile.name}
          </Link>
          <p className="truncate font-mono text-[11px] text-muted">
            {profile.title}
          </p>
        </div>
        <Link
          href="/"
          className="rounded-chip border border-border px-3 py-1.5 text-xs text-muted transition-colors hover:border-accent/40 hover:text-accent"
        >
          Start over
        </Link>
      </header>

      <div className="flex flex-1 flex-col pt-4">
        <Chat seed={seed} />
      </div>
    </main>
  );
}
