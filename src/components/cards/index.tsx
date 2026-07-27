"use client";

/**
 * Rich blocks embedded inside preset answers.
 *
 * A convention runs through all of them: monospace is for machine facts —
 * dates, stacks, package names — and the sans face is for Sezgi's voice. That
 * split is the structural device on this site, so it has to mean something
 * rather than decorate.
 *
 * Children stagger in, which is most of what makes a pre-written answer feel
 * authored rather than dumped on the page.
 */

import { motion } from "framer-motion";
import Image from "next/image";

import { DownloadIcon, ExternalIcon, Icon, PinIcon } from "@/components/Icons";
import type { CardName } from "@/lib/presets";
import {
  experience,
  profile,
  projects,
  resumeFileName,
  skills,
} from "@/lib/profile";

const list = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const card =
  "rounded-card border border-border/70 bg-surface p-5 shadow-[var(--app-shadow)]";

/** Solid, high-contrast — reads as a fact rather than a link. */
const solidPill =
  "rounded-chip bg-text px-2.5 py-1 text-[12.5px] font-medium text-bg";

const accentPill =
  "rounded-chip bg-accent px-3 py-1 text-[12.5px] font-medium text-accent-fg";

const quietPill =
  "rounded-chip bg-surface-2 px-2.5 py-0.5 font-mono text-[11px] text-muted";

export function AnswerCard({ card: name }: { card: CardName }) {
  switch (name) {
    case "about":
      return <AboutCard />;
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

function SectionHeading({
  icon,
  children,
}: {
  icon: "skills";
  children: React.ReactNode;
}) {
  return (
    <p className="flex items-center gap-2 font-display text-[15px] font-semibold text-text">
      <span className="text-accent">
        <Icon name={icon} />
      </span>
      {children}
    </p>
  );
}

function AboutCard() {
  return (
    <motion.div
      variants={list}
      initial="hidden"
      animate="show"
      className={`${card} sm:flex sm:items-start sm:gap-5`}
    >
      <motion.div variants={item} className="shrink-0">
        {/*
          The headshot, not the travelling avatar — this is the one place with
          room for a portrait rather than a 34px face.

          A square panel for a square cutout, and both dimensions are load
          bearing: the width matches the height so `contain` has nothing to
          letterbox, and the height is the one the old portrait tile used, so
          swapping the photo didn't shift the card around it.

          Still `contain` rather than `cover`, even though a square in a square
          makes them identical today. If the file is ever replaced with one
          that isn't square, letterboxing is a far kinder failure than slicing
          the top off someone's head.
        */}
        <div className="grid h-44 w-44 place-items-center overflow-hidden rounded-inner bg-accent-soft">
          <Image
            src={profile.headshotHref}
            alt={profile.name}
            width={352}
            height={352}
            className="h-full w-full object-contain"
          />
        </div>
      </motion.div>

      <div className="mt-4 min-w-0 flex-1 sm:mt-0">
        <motion.h2
          variants={item}
          className="font-display text-2xl font-semibold leading-tight text-text"
        >
          {profile.name}
        </motion.h2>

        <motion.p
          variants={item}
          className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] text-muted"
        >
          <span>{profile.title}</span>
          <span aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1">
            <PinIcon />
            {profile.location}
          </span>
        </motion.p>

        <motion.p
          variants={item}
          className="mt-3 text-[14.5px] leading-relaxed text-muted"
        >
          {profile.bio}
        </motion.p>

        <motion.ul variants={item} className="mt-4 flex flex-wrap gap-1.5">
          {profile.characteristics.map((trait) => (
            <li key={trait} className={accentPill}>
              {trait}
            </li>
          ))}
        </motion.ul>
      </div>
    </motion.div>
  );
}

function SkillsCard() {
  return (
    <motion.div
      variants={list}
      initial="hidden"
      animate="show"
      className={`${card} space-y-5`}
    >
      {skills.map((group) => (
        <motion.div key={group.group} variants={item}>
          <SectionHeading icon="skills">{group.group}</SectionHeading>
          <ul className="mt-2.5 flex flex-wrap gap-1.5">
            {group.items.map((skill) => (
              <li key={skill} className={solidPill}>
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
      className="grid gap-2.5 sm:grid-cols-2"
    >
      {projects.map((project) => (
        <motion.li key={project.name} variants={item}>
          <a
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex h-full flex-col rounded-card border border-border/70 bg-surface p-4 shadow-[var(--app-shadow)] transition-[border-color,transform,box-shadow] hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-[var(--app-shadow-lift)]"
          >
            <span className="flex items-start justify-between gap-2">
              <span className="font-display text-[15px] font-semibold leading-snug text-text">
                {project.name}
              </span>
              <ExternalIcon className="mt-0.5 shrink-0 text-muted transition-[transform,color] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
            </span>
            <span className="mt-1.5 flex-1 text-[13px] leading-relaxed text-muted">
              {project.description}
            </span>
            <span className="mt-3 flex flex-wrap gap-1.5">
              {project.tech.map((t) => (
                <span key={t} className={quietPill}>
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
      className={`${card} space-y-1`}
    >
      {experience.map((job, i) => (
        <motion.li
          key={`${job.company}-${job.dates}`}
          variants={item}
          className="relative pb-4 pl-6 last:pb-0"
        >
          {/* A real timeline: the rule connects entries, the dot marks one. */}
          {i < experience.length - 1 && (
            <span
              aria-hidden="true"
              className="absolute left-[5px] top-3 h-full w-px bg-border"
            />
          )}
          <span
            aria-hidden="true"
            className="absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full border-2 border-accent bg-surface"
          />

          <p className="font-mono text-[11px] tracking-tight text-muted">
            {job.dates}
          </p>
          <p className="mt-0.5 font-display text-[15px] font-semibold leading-snug text-text">
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
    >
      <a
        href={profile.resumeHref}
        download
        className={`group flex items-center gap-4 ${card} transition-[border-color,transform,box-shadow] hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-[var(--app-shadow-lift)]`}
      >
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-inner bg-accent-soft text-accent">
          <DownloadIcon className="transition-transform group-hover:translate-y-0.5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-display text-[15px] font-semibold text-text group-hover:text-accent">
            Download resume
          </span>
          <span className="block truncate font-mono text-[11px] text-muted">
            {resumeFileName}
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
      className={`${card} divide-y divide-border/70 py-1`}
    >
      {links.map((link) => (
        <motion.li key={link.label} variants={item}>
          <a
            href={link.href}
            target={link.href.startsWith("mailto:") ? undefined : "_blank"}
            rel="noopener noreferrer"
            className="group flex items-center justify-between gap-3 py-3"
          >
            <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
              {link.label}
            </span>
            <span className="relative truncate text-[14px] text-text transition-colors group-hover:text-accent">
              {link.value}
              <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-accent transition-[width] duration-300 group-hover:w-full" />
            </span>
          </a>
        </motion.li>
      ))}
    </motion.ul>
  );
}
