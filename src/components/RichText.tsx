/**
 * Sezgi's prose, with the names marked and the email made clickable.
 *
 * Shared by the answer bubbles and the composer's out-of-questions note, which
 * are the two places his voice appears as plain text. Both get the same
 * treatment because both can carry the same things — see `lib/highlight` for
 * what gets picked out and why.
 */

import { segmentText } from "@/lib/highlight";

/**
 * Names get colour and a small step in weight, and nothing else. A tint block
 * would compete with the pills inside the cards, and an underline would read as
 * a link. The weight bump is what keeps the mark legible in greyscale, so it
 * doesn't rest on colour alone.
 *
 * The email is underlined precisely because the names aren't — colour alone
 * can't say "clickable" when the word next to it is coloured and isn't, and on
 * a phone there's no hover to reveal it later. The line starts soft and firms up
 * on hover, so it announces itself without shouting.
 *
 * Matched text is rendered exactly as it arrived, never the canonical spelling
 * from the list — this shouldn't quietly rewrite what was written.
 */
export function RichText({ text }: { text: string }) {
  return (
    <>
      {segmentText(text).map((segment, i) => {
        if (segment.kind === "name") {
          return (
            <span key={i} className="font-medium text-accent">
              {segment.text}
            </span>
          );
        }

        if (segment.kind === "email") {
          return (
            <a
              key={i}
              href={`mailto:${segment.text}`}
              className="font-medium text-accent underline decoration-accent/40 underline-offset-2 transition-colors hover:decoration-accent"
            >
              {segment.text}
            </a>
          );
        }

        return segment.text;
      })}
    </>
  );
}
