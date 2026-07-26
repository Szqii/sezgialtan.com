"use client";

/**
 * Rich blocks embedded inside preset answers.
 *
 * A convention runs through all of them: monospace is for machine facts —
 * dates, stacks, package names, URLs — and the sans face is for Sezgi's voice.
 * That split is the structural device on this site, so it has to mean
 * something rather than decorate.
 *
 * Children stagger in, which is most of what makes a pre-written answer feel
 * authored rather than dumped on the page.
 */

import { motion } from "framer-motion";

import type { CardName } from "@/lib/presets";
import { experience, profile, projects, skills } from "@/lib/profile";

const list = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const shell =
  "mt-3 rounded-2xl border border-border bg-surface p-4 shadow-[var(--app-shadow)]";
const label =
  "font-mono text-[11px] uppercase tracking-[0.12em] text-muted";

export function AnswerCard({ card }: { card: CardName }) {
  switch (card) {
    case "skills":
      return <SkillsCard />;
    case "projects":
      return <ProjectsCard />;
    case "experience":
      return <ExperienceCard />;
    case "resume":
      return <ResumeCard />;
    case "contact":
      return <ContactCard />;
  }
}

function SkillsCard() {
  return (
    <motion.div
      variants={list}
      initial="hidden"
      animate="show"
      className={`${shell} space-y-4`}
    >
      {skills.map((group) => (
        <motion.div key={group.group} variants={item}>
          <p className={label}>{group.group}</p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {group.items.map((skill) => (
              <li
                key={skill}
                className="rounded-chip bg-surface-2 px-2.5 py-1 text-[13px] text-text"
              >
                {skill}
              </li>
            ))}
          </ul>
        </motion.div>
      ))}
    </motion.div>
  );
}

function ProjectsCard() {
  return (
    <motion.ul
      variants={list}
      initial="hidden"
      animate="show"
      className="mt-3 grid gap-2 sm:grid-cols-2"
    >
      {projects.map((project) => (
        <motion.li key={project.name} variants={item}>
          <a
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex h-full flex-col rounded-2xl border border-border bg-surface p-4 shadow-[var(--app-shadow)] transition-[border-color,transform] hover:-translate-y-0.5 hover:border-accent/40"
          >
            <span className="flex items-start justify-between gap-2">
              <span className="font-display text-[15px] font-semibold leading-snug text-text">
                {project.name}
              </span>
              <ExternalIcon />
            </span>
            <span className="mt-1.5 flex-1 text-[13px] leading-relaxed text-muted">
              {project.description}
            </span>
            <span className="mt-3 flex flex-wrap gap-1.5">
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="rounded-chip bg-surface-2 px-2 py-0.5 font-mono text-[11px] text-muted"
                >
                  {t}
                </span>
              ))}
            </span>
          </a>
        </motion.li>
      ))}
    </motion.ul>
  );
}

function ExperienceCard() {
  return (
    <motion.ol
      variants={list}
      initial="hidden"
      animate="show"
      className={`${shell} space-y-4`}
    >
      {experience.map((job) => (
        <motion.li
          key={`${job.company}-${job.dates}`}
          variants={item}
          className="border-l-2 border-border pl-3"
        >
          <p className={label}>{job.dates}</p>
          <p className="mt-0.5 font-display text-[15px] font-semibold text-text">
            {job.role}
          </p>
          <p className="text-[13px] text-muted">
            {job.companyHref ? (
              <a
                href={job.companyHref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline-offset-2 hover:underline"
              >
                {job.company}
              </a>
            ) : (
              job.company
            )}
            <span aria-hidden="true"> · </span>
            {job.location}
          </p>
        </motion.li>
      ))}
    </motion.ol>
  );
}

function ResumeCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={shell}
    >
      <a
        href={profile.resumeHref}
        download
        className="group flex items-center gap-3"
      >
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent">
          <DownloadIcon />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-display text-[15px] font-semibold text-text group-hover:text-accent">
            Download resume
          </span>
          <span className="block font-mono text-[11px] text-muted">
            resume.pdf
          </span>
        </span>
      </a>
    </motion.div>
  );
}

function ContactCard() {
  const links = [
    { label: "Email", value: profile.email, href: `mailto:${profile.email}` },
    { label: "GitHub", value: "Szqii", href: profile.github },
    { label: "LinkedIn", value: "sezgi-altan", href: profile.linkedin },
    { label: "X", value: "@sezgialtan", href: profile.twitter },
  ];

  return (
    <motion.ul
      variants={list}
      initial="hidden"
      animate="show"
      className={`${shell} divide-y divide-border`}
    >
      {links.map((link) => (
        <motion.li key={link.label} variants={item}>
          <a
            href={link.href}
            target={link.href.startsWith("mailto:") ? undefined : "_blank"}
            rel="noopener noreferrer"
            className="group flex items-center justify-between gap-3 py-2.5"
          >
            <span className={label}>{link.label}</span>
            <span className="relative truncate text-[14px] text-text group-hover:text-accent">
              {link.value}
              <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-accent transition-[width] duration-300 group-hover:w-full" />
            </span>
          </a>
        </motion.li>
      ))}
    </motion.ul>
  );
}

function ExternalIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="mt-0.5 shrink-0 text-muted transition-[transform,color] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
    >
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="transition-transform group-hover:translate-y-0.5"
    >
      <path d="M12 3v12M7 11l5 5 5-5M5 21h14" />
    </svg>
  );
}
