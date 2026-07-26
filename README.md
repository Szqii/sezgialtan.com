# sezgialtan.com

Personal site of **Sezgi Altan** — software developer building web and mobile experiences.

It's a portfolio shaped like a conversation. Instead of scrolling through sections, you ask a
question — or tap a topic — and get an answer back.

**Live at [sezgialtan.com](https://sezgialtan.com)**

## How it works

There are two kinds of answers, and the distinction is the whole design:

**Preset chips** (Me, Projects, Skills, Fun, Contact, Resume) serve **pre-written content** from
`src/lib/presets.ts`, revealed with a typewriter effect. They cost nothing, can't hallucinate, and
don't count against a visitor's question limit. Each one is its own prerendered page —
`/chat/skills`, `/chat/projects`, and so on — so they're shareable and crawlable.

**Typed questions** go to Claude (`claude-haiku-4-5`) through `/api/chat`, streamed back token by
token. The model is scoped to only answer questions about Sezgi and declines everything else. Each
visitor gets **3** of these, tracked with a signed HttpOnly cookie.

## Stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack) · [React 19](https://react.dev) · TypeScript
- [Tailwind CSS v4](https://tailwindcss.com) — CSS-based config, no `tailwind.config`
- [Framer Motion](https://www.framer.com/motion/)
- [Anthropic TypeScript SDK](https://github.com/anthropics/anthropic-sdk-typescript)

## Development

```bash
npm install
cp .env.example .env.local   # then fill in both values
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Without `ANTHROPIC_API_KEY` the site still runs — every preset chip works, and typed questions show
a friendly "chat is offline" notice instead of erroring.

```bash
npm run build   # production build
npm run lint
```

## Editing the content

Everything personal lives in two files:

| File | What's in it |
|---|---|
| `src/lib/profile.ts` | Bio, experience, skills, projects, education, languages |
| `src/lib/presets.ts` | The six chips: label, the question each one asks, and the answer |

`src/lib/system-prompt.ts` builds Claude's instructions from `profile.ts`, so updating your
background in one place keeps the AI answers in sync with the written ones.

## Deploying

Set `ANTHROPIC_API_KEY` and `CHAT_SECRET` in the Vercel project, then deploy. No other
infrastructure — the rate limit is a signed cookie, so there's no database or Redis to run.

## Contact

- 📫 [hello@sezgialtan.com](mailto:hello@sezgialtan.com)
- 🐦 [x.com/sezgialtan](https://x.com/sezgialtan)
- 💼 [linkedin.com/in/sezgi-altan](https://linkedin.com/in/sezgi-altan/)
