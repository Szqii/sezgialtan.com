import { Reveal } from "@/components/Reveal";
import { experience } from "@/lib/data";

export function Experience() {
  return (
    <section id="work" className="mx-auto max-w-3xl px-6 py-28">
      <Reveal>
        <h2 className="font-display text-sm font-medium uppercase tracking-[0.2em] text-[var(--color-secondary)]">
          Work Experience
        </h2>
      </Reveal>

      <div className="mt-10 space-y-14 border-l border-[var(--color-border)] pl-8">
        {experience.map((job, i) => (
          <Reveal key={job.company} delay={i * 0.06} className="relative">
            <span className="absolute -left-[calc(2rem+5px)] top-1.5 h-2.5 w-2.5 rounded-full bg-[var(--color-primary)]" />
            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
              <h3 className="font-display text-xl font-semibold">
                {job.role} ·{" "}
                {job.companyHref ? (
                  <a
                    href={job.companyHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor-hover
                    className="text-[var(--color-primary)] underline decoration-[var(--color-primary)]/40 underline-offset-4 transition-colors hover:text-[var(--color-secondary)] hover:decoration-[var(--color-secondary)]/40"
                  >
                    {job.company}
                  </a>
                ) : (
                  <span className="text-[var(--color-primary)]">{job.company}</span>
                )}
              </h3>
              <span className="whitespace-nowrap font-mono text-xs text-[var(--color-text-muted)]">
                {job.dates}
              </span>
            </div>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">{job.location}</p>
            <ul className="mt-4 space-y-2">
              {job.highlights.map((point) => (
                <li
                  key={point}
                  className="flex gap-2 text-[var(--color-text)]/90 before:mt-2.5 before:h-1 before:w-1 before:shrink-0 before:rounded-full before:bg-[var(--color-secondary)]"
                >
                  {point}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
