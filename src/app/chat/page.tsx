import type { Metadata } from "next";

import { ChatShell } from "@/components/ChatShell";
import { MAX_QUESTION_CHARS } from "@/components/Composer";
import { profile } from "@/lib/profile";

/**
 * Free-typed questions land here as /chat?q=…
 *
 * Keeping the question in the URL means it survives a refresh, works with the
 * back button, and can be shared. Bare /chat is a valid empty entry point.
 */

export const metadata: Metadata = {
  title: "Chat",
  description: `Ask ${profile.firstName} anything.`,
};

export default async function ChatPage(props: PageProps<"/chat">) {
  // searchParams is a Promise in Next 16 — sync access was removed.
  const { q } = await props.searchParams;

  const question = typeof q === "string" ? q.trim().slice(0, MAX_QUESTION_CHARS) : "";

  return (
    <ChatShell
      seed={question ? { kind: "question", question } : { kind: "empty" }}
    />
  );
}
