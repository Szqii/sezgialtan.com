/**
 * Everything about Sezgi lives here.
 *
 * This file feeds three things at once: the preset answers in `presets.ts`, the
 * cards rendered inside them, and the system prompt the AI chat runs on. Update
 * a fact here and all three stay in sync.
 */

export const profile = {
  name: "Sezgi Altan",
  firstName: "Sezgi",
  title: "Software Developer",
  location: "Antalya, Turkey",
  heading: "I'm Sezgi Altan",
  tagline: "Building things",
  pronouns: "he/him",
  bio: "Software engineer building robust web and mobile experiences that just work - and look good doing it.",
  bioLines: [
    "Hi, I'm Sezgi.",
    "What I do: Build scalable web and mobile applications (React, Vue, React Native, Flutter).",
    "Where I've been: Global companies like FactSet and Jotform, alongside co-founding creative agencies.",
    "What I care about: Clean UI/UX, design systems, and bridging tech with business goals.",
  ],
  characteristics: ["Product-minded", "Design-conscious", "Adaptable"],
  openToWork: true,
  email: "hello@sezgialtan.com",
  github: "https://github.com/Szqii",
  linkedin: "https://linkedin.com/in/sezgi-altan/",
  twitter: "https://x.com/sezgialtan",
  /**
   * The filename matters: the download link carries no explicit `download`
   * value, so the browser saves the file under whatever the URL's last segment
   * is. Someone who downloads this ends up with it in their Downloads folder
   * next to everyone else's — it should say whose it is.
   */
  resumeHref: "/assets/Sezgi-Altan_Resume.pdf",
  /**
   * A background-removed cutout (transparent PNG). The site displays it with
   * `object-contain` and no circle, border or shadow, so the head floats.
   *
   * If you ever swap this for a photo WITH a background, the treatment needs
   * to change with it: `object-contain` will letterbox it, so switch the two
   * usages (Avatar.tsx, cards/index.tsx) to `object-cover` and add back a
   * crop anchor like `object-position: center 60%` to keep the face centred.
   */
  photoHref: "/assets/photo.png",
} as const;

/**
 * The resume's filename, derived rather than written out again — the card
 * shows it as a caption, and a hardcoded copy would quietly go stale the next
 * time the file is renamed.
 */
export const resumeFileName =
  profile.resumeHref.split("/").pop() ?? "resume.pdf";

export type Experience = {
  company: string;
  companyHref?: string;
  role: string;
  location: string;
  dates: string;
  /** Rendered as bullets on the experience card. Written for a human reader. */
  highlights: string[];
  /**
   * The same facts, compressed, for the AI's system prompt.
   *
   * Two views exist because they have different readers and different costs.
   * `highlights` is CV prose a visitor reads once; `summary` is re-sent to the
   * model on every single question, where each word is billed again. Sending
   * the full bullets cost ~845 tokens per request — 39% of the whole prompt —
   * to say what these lines say in a third of the space.
   *
   * Keep them in sync: if you change a fact above, change it here too. Facts
   * only ever get *compressed* here, never added, so the AI can't contradict
   * what the page shows.
   */
  summary: string;
};

export const experience: Experience[] = [
  {
    company: "Viseon Studio",
    companyHref: undefined,
    role: "Lead Software Engineer & Founder",
    location: "Antalya, Turkey",
    dates: "2025 – 12/2025",
    highlights: [
      "Established and led technical strategy for a creative media agency, overseeing end-to-end development of digital solutions for diverse clients",
      "Architected and built the agency's core web infrastructure from scratch — frontend performance (UX/UI) through backend deployment",
      "Translated complex client requirements into technical roadmaps, ensuring delivery of high-quality digital products aligned with business goals",
    ],
    summary:
      "Founded it. Set technical strategy, built the core web infrastructure from scratch (frontend UX/UI through backend deployment), turned client briefs into technical roadmaps.",
  },
  {
    company: "FactSet",
    companyHref: "https://www.factset.com/",
    role: "Software Engineer",
    location: "Norwalk, USA | Remote",
    dates: "11/2023 – 07/2025",
    highlights: [
      "Developed and maintained interactive dashboards using Vue.js; participated in core migration from Vue 2 to Vue 3, using Composition API and modern data-viz techniques",
      "Contributed to pixel-perfect UI improvements, playing a key role in visual redesign and usability enhancement of the dashboard",
      "Collaborated on FactSet's open-source project Stach — contributing code and integrating it into production-level applications",
      "Ensured high-quality, maintainable code in an agile, cross-functional team focused on performance, scalability, and user satisfaction",
    ],
    summary:
      "Interactive financial dashboards in Vue.js. Worked on the core Vue 2 to Vue 3 migration using the Composition API. Pixel-perfect UI work in the dashboard redesign. Contributed to FactSet's open-source Stach project and integrated it into production apps. Agile, cross-functional team.",
  },
  {
    company: "simpliers",
    companyHref: "https://simpliers.com/",
    role: "Frontend & Mobile Developer",
    location: "Denizli, Turkey",
    dates: "01/2023 – 11/2023",
    highlights: [
      "Led end-to-end frontend development and visual overhauls for the Simpliers website (Vue.js), enhancing UX for global giveaway creators",
      "Designed and engineered two mobile apps from scratch: Simpliers Giveaway App (React Native) and Anonym Stories for Instagram (Flutter)",
      "Enabled seamless cross-platform giveaway creation across web and mobile, contributing to increased user engagement and retention",
      "Collaborated with high-profile influencers on CEO-focused technical blog content; prepared weekly analytical reports for strategic management meetings",
    ],
    summary:
      "Led frontend development and the visual overhaul of the Simpliers site (Vue.js), used by giveaway creators worldwide. Built two mobile apps from scratch: Simpliers Giveaway (React Native) and Anonym Stories for Instagram (Flutter). Technical blog content with influencers; weekly analytics reports for management.",
  },
  {
    company: "artrodite",
    companyHref: undefined,
    role: "Lead Software Engineer & Co-Founder",
    location: "Denizli, Turkey",
    dates: "2023 – 12/2023",
    highlights: [
      "Co-founded a 360° digital branding agency providing end-to-end software and design services to startups and SMEs",
      "Responsible for full SDLC of all internal and client projects, ensuring high performance and SEO optimization",
      "Managed cross-functional responsibilities from technical implementation to project management, delivering tailored digital identities for brands",
    ],
    summary:
      "Co-founded a 360° digital branding agency for startups and SMEs. Full SDLC on internal and client projects; performance and SEO optimisation; project management.",
  },
  {
    company: "Jotform",
    companyHref: "https://www.jotform.com/",
    role: "UI Developer",
    location: "Turkey | Remote",
    dates: "03/2022 – 09/2022",
    highlights: [
      "Developed and maintained reusable UI components with a focus on performance, accessibility, and responsiveness",
      "Collaborated with UX designers and frontend teams to enhance UX across Jotform's form builder and admin interfaces",
      "Contributed to design system consistency; implemented UI improvements based on user feedback and A/B testing",
    ],
    summary:
      "Reusable UI components focused on performance, accessibility and responsiveness, across the form builder and admin interfaces. Design-system consistency; UI improvements driven by user feedback and A/B testing.",
  },
];

export type SkillGroup = { group: string; items: string[] };

export const skills: SkillGroup[] = [
  { group: "Languages", items: ["JavaScript (ES6+)", "TypeScript"] },
  {
    group: "Frontend",
    items: ["React.js", "Vue.js", "HTML5", "CSS3/SASS", "Tailwind"],
  },
  { group: "Mobile", items: ["React Native", "Flutter"] },
  {
    group: "Testing & Tools",
    items: [
      "Jest",
      "React Testing Library",
      "Git",
      "Webpack/Vite",
      "CI/CD Principles",
    ],
  },
  {
    group: "Design & Architecture",
    items: ["Design Systems", "Responsive Design", "UI/UX Collaboration"],
  },
];

/** Non-technical strengths — the AI gets asked about these constantly. */
export const softSkills = [
  "Product thinking — I ask what a feature is for before I ask how to build it",
  "Design collaboration — years of working shoulder-to-shoulder with designers",
  "Ownership — I've founded two agencies, so shipping is a habit, not a phase",
  "Communication — remote work across US and Turkish teams",
];

export type Project = {
  name: string;
  /** Shown on the projects card. */
  description: string;
  /** Compressed for the system prompt — same reasoning as Experience.summary. */
  summary: string;
  href: string;
  kind: "web" | "mobile" | "npm";
  tech: string[];
};

export const projects: Project[] = [
  {
    name: "Real Estate Appointment System",
    description:
      "Vue 3 app for managing real estate appointments between agents and clients — scheduling, agent assignment, contact management, advanced filtering, and real-time search, mobile-first throughout.",
    summary:
      "Appointment scheduling between agents and clients: agent assignment, contacts, advanced filtering, real-time search, mobile-first.",
    href: "https://github.com/Szqii/real-estate-appointment-system",
    kind: "web",
    tech: ["Vue 3", "TypeScript"],
  },
  {
    name: "Simpliers Giveaway App",
    description:
      "React Native app for Simpliers, a widely-used Instagram giveaway platform. Built from scratch and shipped to the App Store.",
    summary:
      "Built from scratch and shipped to the App Store for Simpliers, a widely-used Instagram giveaway platform.",
    href: "https://apps.apple.com/us/app/simpliers-instagram-giveaway/id6451319166",
    kind: "mobile",
    tech: ["React Native"],
  },
  {
    name: "Anonym Stories for Instagram",
    description:
      "Flutter app for watching Instagram stories anonymously. Published on the App Store.",
    summary: "Watch Instagram stories anonymously. On the App Store.",
    href: "https://apps.apple.com/tr/app/anonym-stories-for-insta/id6448922644",
    kind: "mobile",
    tech: ["Flutter"],
  },
  {
    name: "React Native Tab Bar",
    description:
      "An npm package for a custom iOS-style tab bar in React Native — the kind of small tool you build once and keep reaching for.",
    // Package id spelled out: with the href gone from the prompt, this is how
    // the AI can still answer "where do I find it?" precisely.
    summary:
      "npm package for a custom iOS-style tab bar in React Native, published as react-native-ios-tab-bar.",
    href: "https://www.npmjs.com/package/react-native-ios-tab-bar",
    kind: "npm",
    tech: ["React Native", "npm"],
  },
  {
    name: "Simple Roll Dice",
    description:
      "Flutter dice roller with 3D models and physics-driven animation. On the App Store.",
    summary:
      "Dice roller with 3D models and physics-driven animation. On the App Store.",
    href: "https://apps.apple.com/tr/app/simple-roll-dice/id6449543495",
    kind: "mobile",
    tech: ["Flutter", "3D"],
  },
];

export const education = [
  {
    school: "Pamukkale University",
    detail: "B.S. Computer Engineering, GPA 3.4/4",
    location: "Denizli, Turkey",
    dates: "2018 – 2023",
  },
  {
    school: "Politechnika Śląska (Silesian University of Technology)",
    detail: "Erasmus exchange — Automatic Control, Electronics & Computer Science",
    location: "Gliwice, Poland",
    dates: "10/2021 – 03/2022",
  },
];

export const organisations = [
  {
    name: "PaüSiber",
    role: "Core-Team Member",
    location: "Denizli, Turkey",
    dates: "2019 – Present",
    detail:
      "Cybersecurity awareness community; participated in and conducted trainings, organized events.",
  },
];

export const languages = [
  { name: "Turkish", level: "Native/Bilingual" },
  { name: "English", level: "Fluent" },
  { name: "Spanish", level: "Basic" },
];

/**
 * TODO(sezgi): rewrite this in your own voice — I drafted it from what was
 * already in the repo (Erasmus, PaüSiber, the agencies, the languages). It's
 * accurate but it's my phrasing, not yours. This is the one block on the site
 * that should sound unmistakably like you.
 */
export const fun = {
  intro:
    "Outside the editor, the short version: I like building things with other people and I like being somewhere new.",
  facts: [
    "I spent a semester on Erasmus at Politechnika Śląska in Gliwice, Poland — my first real taste of working in a language I was still learning.",
    "I've been on the core team of PaüSiber, a cybersecurity awareness community, since 2019. Running trainings taught me more about explaining things clearly than any job has.",
    "I co-founded two agencies before I turned 25. Both taught me that shipping and selling are the same skill wearing different clothes.",
    "Turkish natively, English fluently, and enough Spanish to order confidently and understand about half the reply.",
    "Based in Antalya — which means the commute to the sea is about ten minutes.",
  ],
};
