import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
        404
      </p>
      <h1 className="font-display text-2xl font-semibold text-text">
        Nothing to talk about here
      </h1>
      <p className="text-[15px] leading-relaxed text-muted">
        That page doesn&apos;t exist. Head back and ask me something instead.
      </p>
      <Link
        href="/"
        className="mt-2 rounded-chip bg-accent px-4 py-2 text-sm font-medium text-accent-fg"
      >
        Back to the start
      </Link>
    </main>
  );
}
