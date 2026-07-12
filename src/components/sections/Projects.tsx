import { Reveal } from "@/components/Reveal";
import { projects, type Project } from "@/lib/data";

const KIND_META: Record<Project["kind"], { icon: string; label: string }> = {
  web: { icon: "🖥️", label: "Web App" },
  mobile: { icon: "📱", label: "Mobile App" },
  npm: { icon: "📦", label: "NPM Package" },
};

export function Projects() {
  return (
    <section id="projects" className="mx-auto max-w-3xl px-6 py-28">
      <Reveal>
        <h2 className="font-display text-sm font-medium uppercase tracking-[0.2em] text-[var(--color-secondary)]">
          Projects
        </h2>
      </Reveal>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {projects.map((project, i) => {
          const meta = KIND_META[project.kind];
          return (
            <Reveal key={project.name} delay={i * 0.06}>
              <a
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor-hover
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] transition-all hover:-translate-y-1 hover:border-[var(--color-primary)]"
              >
                <div
                  className="relative flex h-36 items-center justify-center overflow-hidden"
                  style={{
                    background:
                      i % 2 === 0
                        ? "linear-gradient(135deg, var(--color-primary), var(--color-secondary))"
                        : "linear-gradient(135deg, var(--color-secondary), var(--color-primary))",
                  }}
                >
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)",
                      backgroundSize: "16px 16px",
                    }}
                  />
                  <div className="relative flex flex-col items-center gap-1 text-[var(--color-bg)]">
                    <span className="text-3xl">{meta.icon}</span>
                    <span className="font-mono text-[11px] font-semibold uppercase tracking-wide opacity-80">
                      {meta.label} · preview soon
                    </span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    <h3 className="font-display text-lg font-semibold transition-colors group-hover:text-[var(--color-primary)]">
                      {project.name}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)]">
                      {project.description}
                    </p>
                  </div>
                  <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-[var(--color-secondary)]">
                    View <span className="transition-transform group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </a>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
