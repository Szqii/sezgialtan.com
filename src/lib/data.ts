export const profile = {
  name: "Sezgi Altan",
  title: "Software Developer",
  location: "Antalya, Turkey",
  tagline:
    "Software engineer building robust web and mobile experiences that just work - and look good doing it.",
  bioLines: [
    "Hi, I'm Sezgi.",
    "What I do: Build scalable web and mobile applications (React, Vue, React Native, Flutter).",
    "Where I've been: Global companies like FactSet and Jotform, alongside co-founding creative agencies.",
    "What I care about: Clean UI/UX, design systems, and bridging tech with business goals.",
  ],
  characteristics: ["Product-minded", "Design-conscious", "Adaptable"],
  email: "hello@sezgialtan.com",
  github: "https://github.com/Szqii",
  linkedin: "https://linkedin.com/in/sezgi-altan/",
  twitter: "https://x.com/sezgialtan",
  resumeHref: "/assets/resume.pdf",
  photoHref: "/assets/photo.png",
};

export type Experience = {
  company: string;
  companyHref?: string;
  role: string;
  location: string;
  dates: string;
  highlights: string[];
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
  },
];

export const skills: { group: string; items: string[] }[] = [
  { group: "Languages", items: ["JavaScript (ES6+)", "TypeScript"] },
  {
    group: "Frontend",
    items: ["React.js", "Vue.js", "HTML5", "CSS3/SASS", "Tailwind"],
  },
  { group: "Mobile", items: ["React Native", "Flutter"] },
  {
    group: "Testing & Tools",
    items: ["Jest", "React Testing Library", "Git", "Webpack/Vite", "CI/CD Principles"],
  },
  {
    group: "Design & Architecture",
    items: ["Design Systems", "Responsive Design", "UI/UX Collaboration"],
  },
];

export type Project = {
  name: string;
  description: string;
  href: string;
  kind: "web" | "mobile" | "npm";
};

export const projects: Project[] = [
  {
    name: "Real Estate Appointment System",
    description:
      "Modern Vue 3 application for managing real estate appointments with agents and clients. Features appointment scheduling, agent assignment, contact management, advanced filtering, and real-time search with a responsive mobile-first design.",
    href: "https://github.com/Szqii/real-estate-appointment-system",
    kind: "web",
  },
  {
    name: "Simpliers Giveaway App",
    description: "React Native app for Simpliers, a widely-used giveaway platform.",
    href: "https://apps.apple.com/us/app/simpliers-instagram-giveaway/id6451319166",
    kind: "mobile",
  },
  {
    name: "Anonym Stories for Instagram",
    description:
      "Flutter app to watch Instagram stories anonymously; published on the App Store.",
    href: "https://apps.apple.com/tr/app/anonym-stories-for-insta/id6448922644",
    kind: "mobile",
  },
  {
    name: "React Native Tab Bar",
    description: "NPM package for a custom iOS-style tab bar in React Native.",
    href: "https://www.npmjs.com/package/react-native-ios-tab-bar",
    kind: "npm",
  },
  {
    name: "Simple Roll Dice",
    description:
      "Flutter app for rolling dice, with 3D models and animation; published on the App Store.",
    href: "https://apps.apple.com/tr/app/simple-roll-dice/id6449543495",
    kind: "mobile",
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

export const navLinks = [
  { href: "#about", label: "About" },
  { href: "#work", label: "Work" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];
