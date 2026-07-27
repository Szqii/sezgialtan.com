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
  funPhoto,
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
      <motion.div variants={item} className="relative shrink-0">
        {/*
          The headshot, not the travelling avatar — this is the one place with
          room for a portrait rather than a 34px face.

          No frame: the file is a cutout, so it stands on the card with nothing
          drawn around it. What separates it from the surface is a blurred blob
          sitting behind the figure's mass.

          A blob rather than a `box-shadow`, because a shadow traces the box —
          which is square, and drawing a square halo is precisely the boundary
          we're trying not to have. `drop-shadow` would trace the silhouette
          correctly but reads as a shadow: directional, dark, and it would peg
          him to a surface instead of lifting him off one.

          Positioned to the figure rather than to the element: the top eighth of
          the PNG is empty above his head, so a blob filling the box would glow
          around nothing. The blur is wide enough that the blob's own rounded
          edge never resolves — if you can make out its shape, it's too tight.
        */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-7 bottom-2 top-10 rounded-full bg-accent-soft blur-xl"
        />

        {/*
          `contain`, not `cover`, even though a square in a square makes them
          identical today. If the file is ever replaced with one that isn't
          square, letterboxing is a far kinder failure than slicing the top off
          someone's head. Positioned so it paints over the glow.

          Left unmasked deliberately. His suit runs off the bottom edge of the
          PNG, so it ends on a straight horizontal line, and a bottom fade is
          the obvious way to soften that — it was tried and it looked worse,
          because the fade crosses solid fabric and reads as the image being
          half-loaded. If that edge ever needs dealing with, do it in the file
          rather than in CSS.
        */}
        <Image
          src={profile.headshotHref}
          alt={profile.name}
          width={352}
          height={352}
          className="relative h-44 w-44 object-contain"
        />
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

/**
 * A photo attached to the inside of a message bubble.
 *
 * No frame of its own, unlike the cards — it's already sitting on the bubble's
 * surface, and a border inside a border reads as a mistake. The rounding is
 * `rounded-inner`, the same radius the site uses for anything nested inside
 * something already rounded.
 *
 * It simply fills the bubble's text column, so its edges line up with the prose
 * above it — anything narrower leaves slack down one side that reads as a
 * mistake rather than a margin. The size is decided by the bubble, which caps
 * itself when it's carrying a photo; see Message.
 *
 * `sizes` is pinned to that cap. Without it Next hands the browser candidates
 * sized for the viewport, and a 300px slot downloads several times the pixels
 * it can use.
 */
export function AnswerPhoto() {
  return (
    <motion.figure
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="mt-3 w-full"
    >
      <Image
        src={funPhoto.href}
        alt={funPhoto.alt}
        width={funPhoto.width}
        height={funPhoto.height}
        sizes="300px"
        className="block h-auto w-full rounded-inner"
      />
      <figcaption className="mt-2 font-mono text-[11px] text-muted">
        {funPhoto.caption}
      </figcaption>
    </motion.figure>
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
