/**
 * Picks out the parts of an answer worth treating as more than prose: the names
 * a visitor is scanning for, and the email address.
 *
 * Answers are a wall of text in a bubble, and what someone is actually looking
 * for are the proper nouns — where he worked, what he built. Marking those gives
 * the eye somewhere to land without turning the bubble into a formatted
 * document. The email gets picked out for a different reason: several answers
 * end by pointing at it, and an address you have to select and copy is a dead
 * end on a phone.
 *
 * This runs on the rendered text rather than being written into it, which is
 * the whole point: the AI's answers get the same treatment as the pre-written
 * ones, from the same list, with no markup in the prose, no formatting rules in
 * the system prompt, and no chance of the model emitting stray asterisks or
 * deciding for itself what deserves emphasis. It matters most for the email —
 * the prompt tells the model to hand it out whenever it doesn't know something,
 * so the address turns up in answers nobody wrote.
 *
 * Name scope is deliberately narrow — employers, projects, communities,
 * schools. Technologies are excluded even though they're tempting: "TypeScript
 * — React and Vue on the web, React Native and Flutter on mobile" would light up
 * five times in one sentence, and a highlight that lands on every other word has
 * stopped being a highlight. The skills card already renders the stack as pills,
 * which is the right place for it.
 */

import { experience, organisations, profile, projects } from "./profile";

/**
 * Names the data doesn't hand over cleanly.
 *
 * The schools are here rather than derived because `education[].school` carries
 * a parenthetical translation, and matching that literal string would drag the
 * bracket into the highlight. The rest are short forms — the data says "Viseon
 * Studio" and "Simpliers Giveaway App", but nobody says that in conversation,
 * and the AI writes the way people talk. Stach is FactSet's open-source project;
 * it reaches the model through the FactSet summary, so it can come back out.
 */
const ALSO = [
  "Pamukkale University",
  "Politechnika Śląska",
  "Silesian University of Technology",
  "Erasmus",
  "Viseon",
  "Simpliers",
  "Stach",
];

const NAMES = Array.from(
  new Set([
    ...experience.map((job) => job.company),
    ...projects.map((project) => project.name),
    ...organisations.map((org) => org.name),
    ...ALSO,
  ]),
);

// Longest first, so "Simpliers Giveaway App" wins over the bare "Simpliers"
// sitting inside it — JS alternation takes the first branch that matches at a
// position, not the longest one.
const TERMS = [...NAMES, profile.email].sort((a, b) => b.length - a.length);

const PATTERN = new RegExp(TERMS.map(escapeRegExp).join("|"), "giu");

/**
 * Whole-word test, applied to the characters either side of a match.
 *
 * Done by hand rather than with `\b` in the pattern: `\b` is ASCII-only, so it
 * would refuse to match "Śląska" — the Ś isn't a word character as far as it's
 * concerned. Lookbehind would fix that and is the obvious alternative, but it
 * throws a SyntaxError at module load on older Safari, which would take the
 * whole page down rather than just the highlighting.
 */
const WORD_CHAR = /[\p{L}\p{N}_]/u;

export type Segment = {
  text: string;
  /** "plain" is ordinary prose; the other two get picked out on screen. */
  kind: "plain" | "name" | "email";
};

/**
 * Splits text into runs, tagging the ones that deserve their own treatment.
 *
 * Returns data rather than markup so the styling decision stays in the
 * component, and so this is callable from anywhere without dragging React in.
 *
 * Safe to call on a partially-streamed string: nothing is a match until its
 * last character arrives, so a name or an address lands already marked rather
 * than flickering as it's typed.
 */
export function segmentText(text: string): Segment[] {
  const segments: Segment[] = [];
  let cursor = 0;

  for (const match of text.matchAll(PATTERN)) {
    const start = match.index;
    const end = start + match[0].length;

    // Reject matches buried inside a longer word.
    if (WORD_CHAR.test(text[start - 1] ?? "")) continue;
    if (WORD_CHAR.test(text[end] ?? "")) continue;

    if (start > cursor) {
      segments.push({ text: text.slice(cursor, start), kind: "plain" });
    }
    segments.push({
      text: match[0],
      kind: isEmail(match[0]) ? "email" : "name",
    });
    cursor = end;
  }

  if (cursor < text.length) {
    segments.push({ text: text.slice(cursor), kind: "plain" });
  }

  return segments;
}

function isEmail(match: string): boolean {
  return match.toLowerCase() === profile.email.toLowerCase();
}

/** Every character here is legal to escape under the `u` flag. Escaping `-`, as
 *  some versions of this helper do, is a SyntaxError in unicode mode. */
function escapeRegExp(literal: string): string {
  return literal.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
