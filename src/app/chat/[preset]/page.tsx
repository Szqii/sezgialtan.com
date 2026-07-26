import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ChatShell } from "@/components/ChatShell";
import { getPreset, presetFullText, presets } from "@/lib/presets";

/**
 * The six preset conversations: /chat/me, /chat/skills, /chat/projects…
 *
 * Because their answers are pre-written and enumerable, these prerender at
 * build time. That's the payoff for making them path segments rather than
 * query params — real shareable URLs, instant navigation via prefetched
 * links, and each topic individually indexable.
 */

export function generateStaticParams() {
  return presets.map((preset) => ({ preset: preset.id }));
}

export async function generateMetadata(
  props: PageProps<"/chat/[preset]">,
): Promise<Metadata> {
  // params is a Promise in Next 16.
  const { preset: id } = await props.params;
  const preset = getPreset(id);
  if (!preset) return {};

  return {
    title: preset.label,
    description: preset.blurb,
    openGraph: { title: preset.label, description: preset.blurb },
  };
}

export default async function PresetChatPage(
  props: PageProps<"/chat/[preset]">,
) {
  const { preset: id } = await props.params;
  const preset = getPreset(id);
  if (!preset) notFound();

  return (
    <>
      <ChatShell seed={{ kind: "preset", presetId: id }} />

      {/*
        The conversation is seeded on the client so it can animate, which means
        the answer isn't in the served HTML. This puts it there for crawlers
        and JS-less visitors. <noscript> rather than hidden text: it's real
        content for people who genuinely can't run the app, not a keyword
        stash for people who can.
      */}
      <noscript>
        <article className="mx-auto w-full max-w-2xl px-4 py-8">
          <h2 className="font-display text-xl font-semibold text-text">
            {preset.userPrompt}
          </h2>
          <p className="mt-3 whitespace-pre-wrap text-[15px] leading-relaxed text-text">
            {presetFullText(preset)}
          </p>
        </article>
      </noscript>
    </>
  );
}
