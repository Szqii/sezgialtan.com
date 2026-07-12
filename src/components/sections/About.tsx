import { Reveal } from "@/components/Reveal";
import { profile } from "@/lib/data";

export function About() {
  return (
    <section id="about" className="mx-auto max-w-4xl px-6 py-28">
      <Reveal>
        <h2 className="font-display text-sm font-medium uppercase tracking-[0.2em] text-[var(--color-secondary)]">
          About
        </h2>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mt-8 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xl">
          <div className="flex items-center gap-2 border-b border-[var(--color-border)] px-5 py-3">
            <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
            <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
            <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
            <span className="ml-3 font-mono text-xs text-[var(--color-text-muted)]">
              about.ts
            </span>
          </div>

          <pre className="overflow-x-auto p-6 font-mono text-[13px] leading-relaxed sm:p-8 sm:text-sm">
            <code>
              <span className="text-[var(--color-primary)]">const</span> sezgi = {"{"}
              {"\n"}
              {"  "}role: <span className="text-[var(--color-secondary)]">&quot;{profile.title}&quot;</span>,
              {"\n"}
              {"  "}basedIn: <span className="text-[var(--color-secondary)]">&quot;{profile.location}&quot;</span>,
              {"\n"}
              {"  "}builds: [
              <span className="text-[var(--color-secondary)]">&quot;scalable web apps&quot;</span>,{" "}
              <span className="text-[var(--color-secondary)]">&quot;cross-platform mobile&quot;</span>
              ],
              {"\n"}
              {"  "}hasWorkedAt: [
              <span className="text-[var(--color-secondary)]">&quot;FactSet&quot;</span>,{" "}
              <span className="text-[var(--color-secondary)]">&quot;Jotform&quot;</span>,{" "}
              <span className="text-[var(--color-secondary)]">&quot;a couple agencies I founded&quot;</span>
              ],
              {"\n"}
              {"  "}cares: [
              <span className="text-[var(--color-secondary)]">&quot;clean UI/UX&quot;</span>,{" "}
              <span className="text-[var(--color-secondary)]">&quot;design systems&quot;</span>,{" "}
              <span className="text-[var(--color-secondary)]">&quot;bridging tech + business&quot;</span>
              ],
              {"\n"}
              {"  "}traits: [
              {profile.characteristics.map((trait, i) => (
                <span key={trait}>
                  <span className="text-[var(--color-secondary)]">&quot;{trait}&quot;</span>
                  {i < profile.characteristics.length - 1 ? ", " : ""}
                </span>
              ))}
              ],
              {"\n"}
              {"}"};
            </code>
          </pre>
        </div>
      </Reveal>
    </section>
  );
}
