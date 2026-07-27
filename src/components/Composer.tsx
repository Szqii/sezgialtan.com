"use client";

/**
 * The "Ask me anything" input — the hero of the whole site.
 *
 * On `/` it navigates to /chat?q=… so the question survives refresh, back, and
 * sharing. On /chat/* it submits in place. Same component either way, so the
 * input the visitor typed into is literally the one that follows them.
 *
 * The placeholder rotates through real questions. It's the single strongest
 * nudge toward actually using the chat, and it pauses on focus so it never
 * fights someone who's mid-thought.
 */

import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { MAX_QUESTION_CHARS } from "@/lib/limits";

const SUGGESTIONS = [
  "What did you build at FactSet?",
  "What's your stack?",
  "Are you open to work?",
  "Tell me about the Vue 3 migration",
  "What have you shipped to the App Store?",
];

export function Composer({
  mode,
  onSubmit,
  onFocusChange,
  disabled = false,
  disabledNote,
  autoFocus = false,
}: {
  mode: "navigate" | "append";
  onSubmit?: (question: string) => void;
  /** Drives whether the chip row is showing — see Chat. */
  onFocusChange?: (focused: boolean) => void;
  disabled?: boolean;
  disabledNote?: string;
  autoFocus?: boolean;
}) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const [pending, setPending] = useState(false);
  const [suggestion, setSuggestion] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Pause while the visitor is engaged with the field, and once they've typed.
  const rotating = !focused && value.length === 0 && !disabled;

  useEffect(() => {
    if (!rotating) return;
    const id = setInterval(
      () => setSuggestion((i) => (i + 1) % SUGGESTIONS.length),
      3200,
    );
    return () => clearInterval(id);
  }, [rotating]);

  useEffect(() => {
    if (autoFocus && !disabled) textareaRef.current?.focus();
  }, [autoFocus, disabled]);

  function grow(el: HTMLTextAreaElement) {
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }

  function submit() {
    const question = value.trim();
    if (!question || disabled || pending) return;

    if (mode === "navigate") {
      setPending(true);
      router.push(`/chat?q=${encodeURIComponent(question)}`);
      return;
    }

    setValue("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    onSubmit?.(question);
  }

  const remaining = MAX_QUESTION_CHARS - value.length;
  const nearLimit = remaining <= 60;

  if (disabled && disabledNote) {
    return (
      <motion.p
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-bubble border border-border/70 bg-surface-2 px-5 py-4 text-center text-sm leading-relaxed text-muted"
      >
        {disabledNote}
      </motion.p>
    );
  }

  return (
    <div className="w-full">
      <motion.div
        animate={{
          borderColor: focused
            ? "var(--app-accent)"
            : "var(--app-border)",
          boxShadow: focused ? "var(--app-shadow-lift)" : "var(--app-shadow)",
        }}
        transition={{ duration: 0.2 }}
        className="relative flex items-end gap-2 rounded-bubble border bg-surface p-2.5 pl-5"
      >
        <div className="relative flex-1 py-2">
          {/* Real placeholder stays empty so the animated one can cross-fade. */}
          <AnimatePresence mode="wait" initial={false}>
            {value.length === 0 && (
              <motion.span
                key={rotating ? SUGGESTIONS[suggestion] : "static"}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.25 }}
                aria-hidden="true"
                // Font size tracks the textarea's exactly — this sits on top of
                // it, so any mismatch shows up as the placeholder not lining up
                // with the text you type.
                className="pointer-events-none absolute inset-x-0 top-2 truncate text-base text-muted pointer-fine:text-[15px]"
              >
                {rotating ? SUGGESTIONS[suggestion] : "Ask me anything…"}
              </motion.span>
            )}
          </AnimatePresence>

          <textarea
            ref={textareaRef}
            rows={1}
            value={value}
            maxLength={MAX_QUESTION_CHARS}
            aria-label="Ask me anything"
            // The composer box itself lights up on focus — see the wrapper's
            // animated borderColor. This suppresses the duplicate inner ring.
            data-focus-ring="container"
            onChange={(e) => {
              setValue(e.target.value);
              grow(e.target);
            }}
            onFocus={() => {
              setFocused(true);
              onFocusChange?.(true);
            }}
            onBlur={() => {
              setFocused(false);
              onFocusChange?.(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            /*
             * 16px here is not a design choice — it's the threshold. Safari on
             * iOS zooms the page in when you focus a form control whose
             * font-size is under 16px, and it doesn't zoom back out on blur,
             * which is what made the layout look broken. 15px was one pixel
             * under the line.
             *
             * Keyed on `pointer-fine` (a mouse) rather than a width breakpoint
             * on purpose: what triggers the zoom is a touch keyboard, not a
             * narrow screen. A phone in landscape is wider than `sm`, so
             * `sm:text-[15px]` would hand the bug straight back the moment
             * someone rotated their phone.
             *
             * The other common fix — maximum-scale=1 / user-scalable=no on the
             * viewport meta — kills pinch-zoom for everyone, so it's out.
             */
            className="block w-full resize-none bg-transparent text-base leading-6 text-text outline-none placeholder:text-transparent pointer-fine:text-[15px]"
            placeholder="Ask me anything…"
          />
        </div>

        <motion.button
          type="button"
          onClick={submit}
          disabled={!value.trim() || pending}
          aria-label="Send question"
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.94 }}
          className="mb-1 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent text-accent-fg transition-opacity disabled:opacity-30"
        >
          {pending ? <Spinner /> : <ArrowUp />}
        </motion.button>
      </motion.div>

      {nearLimit && (
        <p className="mt-1.5 text-right text-xs text-muted">
          {remaining} characters left
        </p>
      )}
    </div>
  );
}

function ArrowUp() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  );
}

function Spinner() {
  return (
    <motion.span
      animate={{ rotate: 360 }}
      transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
      className="block h-4 w-4 rounded-full border-2 border-current border-t-transparent"
    />
  );
}
