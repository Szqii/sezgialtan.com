/**
 * The preset chips.
 *
 * These answers are hand-written, not generated. That's deliberate: they cost
 * nothing, can't hallucinate, always render the right card, and don't burn the
 * visitor's question quota. Only free-typed questions go to the API.
 *
 * Each `id` is also a URL — `/chat/skills`, `/chat/projects`, etc. — and the
 * six of them are what `generateStaticParams` prerenders.
 */

import { experience, fun, profile, projects, skills } from "./profile";

/** A card is a rich component rendered inline, mid-answer. */
export type CardName =
  | "skills"
  | "projects"
  | "experience"
  | "resume"
  | "contact";

export type AnswerBlock =
  | { type: "text"; text: string }
  | { type: "card"; card: CardName };

export type Preset = {
  id: string;
  label: string;
  emoji: string;
  /** Rendered as the visitor's own message, so it reads as if they asked it. */
  userPrompt: string;
  answer: AnswerBlock[];
  /** Used for <title> and og:description on the prerendered page. */
  blurb: string;
};

export const presets: Preset[] = [
  {
    id: "me",
    label: "Me",
    emoji: "👋",
    userPrompt: "Who are you, and what do you do?",
    blurb: `Who ${profile.firstName} is and what he does.`,
    answer: [
      {
        type: "text",
        text: `I'm Sezgi — a software developer based in Antalya, Turkey.\n\nI build web and mobile applications, mostly in React, Vue, React Native and Flutter. I've done that at global companies like FactSet and Jotform, and at two agencies I co-founded, which is a very different kind of education.\n\nWhat I actually care about is the seam where engineering meets design: clean UI, design systems that hold up as a product grows, and building things that solve a real business problem rather than just compiling.\n\nHere's the path so far:`,
      },
      { type: "card", card: "experience" },
      {
        type: "text",
        text: `Right now I'm looking for my next full-time role — open to remote, anywhere.`,
      },
    ],
  },
  {
    id: "projects",
    label: "Projects",
    emoji: "🛠",
    userPrompt: "What have you built?",
    blurb: `Apps, packages and side projects ${profile.firstName} has shipped.`,
    answer: [
      {
        type: "text",
        text: `A mix of client work, apps on the App Store, and small tools I built because I needed them:`,
      },
      { type: "card", card: "projects" },
      {
        type: "text",
        text: `The mobile ones are all live on the App Store, and the tab bar package is on npm. Ask me about any of them and I'll go deeper.`,
      },
    ],
  },
  {
    id: "skills",
    label: "Skills",
    emoji: "⚡",
    userPrompt: "What are you coding with, and what are your soft skills?",
    blurb: `${profile.firstName}'s technical stack and how he works.`,
    answer: [
      {
        type: "text",
        text: `On the technical side, I live mostly in TypeScript — React and Vue on the web, React Native and Flutter on mobile:`,
      },
      { type: "card", card: "skills" },
      {
        type: "text",
        text: `The less listable half matters just as much. I think about products before I think about implementations. I've worked alongside designers long enough to speak their language rather than just receive handoffs. I've founded two agencies, so shipping is a habit rather than a phase. And I've worked remotely across US and Turkish teams, which is mostly a lesson in writing clearly.`,
      },
    ],
  },
  {
    id: "fun",
    label: "Fun",
    emoji: "🎲",
    userPrompt: "What are you like outside of work?",
    blurb: `The non-technical side of ${profile.firstName}.`,
    answer: [
      {
        type: "text",
        text: [fun.intro, ...fun.facts.map((f) => `• ${f}`)].join("\n\n"),
      },
      {
        type: "text",
        text: `Ask me something specific if you're curious — I'd rather have a conversation than list bullet points at you.`,
      },
    ],
  },
  {
    id: "contact",
    label: "Contact",
    emoji: "✉",
    userPrompt: "How can I reach you?",
    blurb: `Get in touch with ${profile.firstName}.`,
    answer: [
      {
        type: "text",
        text: `Easiest is email — I read everything and I reply. Otherwise I'm around in the usual places:`,
      },
      { type: "card", card: "contact" },
      {
        type: "text",
        text: `I'm currently open to full-time roles, remote or otherwise. If you're hiring, tell me a bit about the team and I'll get back to you quickly.`,
      },
    ],
  },
  {
    id: "resume",
    label: "Resume",
    emoji: "📄",
    userPrompt: "Can I see your resume?",
    blurb: `Download ${profile.firstName}'s resume.`,
    answer: [
      {
        type: "text",
        text: `Of course — here's the PDF, kept up to date:`,
      },
      { type: "card", card: "resume" },
      {
        type: "text",
        text: `If you'd rather not open a PDF, just ask me about any part of it and I'll summarise.`,
      },
    ],
  },
];

export const presetIds = presets.map((p) => p.id);

export function getPreset(id: string): Preset | undefined {
  return presets.find((p) => p.id === id);
}

/** Plain-text version of an answer, for the history we send to the API. */
export function presetAnswerText(preset: Preset): string {
  return preset.answer
    .map((block) =>
      block.type === "text" ? block.text : `[${block.card} details shown]`,
    )
    .join("\n\n");
}

/**
 * Fully expanded answer — cards rendered as readable prose rather than a
 * placeholder. Used for the <noscript> fallback, so the content of each preset
 * page exists in the served HTML for crawlers and JS-less visitors, without
 * having to give up the typewriter reveal for everyone else.
 */
export function presetFullText(preset: Preset): string {
  return preset.answer
    .map((block) =>
      block.type === "text" ? block.text : cardToText(block.card),
    )
    .join("\n\n");
}

function cardToText(card: CardName): string {
  switch (card) {
    case "skills":
      return skills
        .map((group) => `${group.group}: ${group.items.join(", ")}`)
        .join("\n");
    case "projects":
      return projects
        .map((p) => `${p.name} (${p.tech.join(", ")}) — ${p.description} ${p.href}`)
        .join("\n\n");
    case "experience":
      return experience
        .map(
          (job) =>
            `${job.dates} — ${job.role}, ${job.company} (${job.location})`,
        )
        .join("\n");
    case "resume":
      return `Resume: ${profile.resumeHref}`;
    case "contact":
      return [
        `Email: ${profile.email}`,
        `GitHub: ${profile.github}`,
        `LinkedIn: ${profile.linkedin}`,
        `X: ${profile.twitter}`,
      ].join("\n");
  }
}
