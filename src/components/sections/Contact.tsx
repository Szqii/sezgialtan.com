import { GitHubIcon, LinkedInIcon, XIcon } from "@/components/Icons";
import { Reveal } from "@/components/Reveal";
import { profile } from "@/lib/data";

const iconLinks = [
  { label: "Twitter / X", href: profile.twitter, Icon: XIcon },
  { label: "GitHub", href: profile.github, Icon: GitHubIcon },
  { label: "LinkedIn", href: profile.linkedin, Icon: LinkedInIcon },
];

export function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-3xl px-6 py-28">
      <Reveal>
        <h2 className="font-display text-sm font-medium uppercase tracking-[0.2em] text-[var(--color-secondary)]">
          Contact
        </h2>
        <h3 className="font-display mt-4 text-3xl font-semibold sm:text-4xl">
          Let&apos;s build something.
        </h3>
        <p className="mt-3 max-w-md text-[var(--color-text-muted)]">
          On the hunt for my next full-time role — anywhere in the world. Let&apos;s make it
          happen.
        </p>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <a
            href={`mailto:${profile.email}`}
            data-cursor-hover
            className="flex items-center justify-between gap-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-3 text-sm transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] sm:w-auto"
          >
            <span className="text-[var(--color-text-muted)]">Email</span>
            <span>{profile.email}</span>
          </a>

          <div className="flex items-center gap-3">
            {iconLinks.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                data-cursor-hover
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
              >
                <Icon className="h-[18px] w-[18px]" />
              </a>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.15}>
        <p className="mt-16 text-xs text-[var(--color-text-muted)]">
          © {new Date().getFullYear()} sezgialtan.com
        </p>
      </Reveal>
    </section>
  );
}
