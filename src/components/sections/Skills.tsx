import { Reveal } from "@/components/Reveal";
import { skills } from "@/lib/data";

export function Skills() {
  return (
    <section id="skills" className="mx-auto max-w-3xl px-6 py-28">
      <Reveal>
        <h2 className="font-display text-sm font-medium uppercase tracking-[0.2em] text-[var(--color-secondary)]">
          Skills
        </h2>
      </Reveal>

      <div className="mt-10 space-y-8">
        {skills.map((group, i) => (
          <Reveal key={group.group} delay={i * 0.05}>
            <h3 className="font-display text-sm font-medium text-[var(--color-text-muted)]">
              {group.group}
            </h3>
            <div className="mt-3 flex flex-wrap gap-2.5">
              {group.items.map((item) => (
                <span
                  key={item}
                  data-cursor-hover
                  className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3.5 py-1.5 text-sm transition-all hover:-translate-y-0.5 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                >
                  {item}
                </span>
              ))}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
