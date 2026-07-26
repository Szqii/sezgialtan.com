/**
 * Line icons for the preset chips and card headers.
 *
 * Hand-rolled rather than an icon package: there are eight of them, they all
 * share one stroke weight, and a dependency for eight paths isn't worth the
 * bundle.
 */

export type IconName =
  | "me"
  | "projects"
  | "skills"
  | "fun"
  | "contact"
  | "resume";

const base = {
  width: 15,
  height: 15,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function Icon({ name }: { name: IconName }) {
  switch (name) {
    case "me":
      return (
        <svg {...base}>
          <circle cx="12" cy="12" r="9" />
          <path d="M8.5 14.5a4.5 4.5 0 0 0 7 0M9 9.5h.01M15 9.5h.01" />
        </svg>
      );
    case "projects":
      return (
        <svg {...base}>
          <rect x="3" y="7" width="18" height="13" rx="2.5" />
          <path d="M8.5 7V5.5A1.5 1.5 0 0 1 10 4h4a1.5 1.5 0 0 1 1.5 1.5V7M3 12h18" />
        </svg>
      );
    case "skills":
      return (
        <svg {...base}>
          <path d="m12 3 9 4.5-9 4.5-9-4.5L12 3Z" />
          <path d="m3 12 9 4.5 9-4.5M3 16.5 12 21l9-4.5" />
        </svg>
      );
    case "fun":
      return (
        <svg {...base}>
          <path d="m4 20 5-13 8 8-13 5Z" />
          <path d="M14 5.5V4M18 8h1.5M16.5 3.5 18 2M19 12.5l1.5.5" />
        </svg>
      );
    case "contact":
      return (
        <svg {...base}>
          <rect x="3" y="5" width="18" height="14" rx="2.5" />
          <path d="m3.5 7 7.6 5.3a1.5 1.5 0 0 0 1.8 0L20.5 7" />
        </svg>
      );
    case "resume":
      return (
        <svg {...base}>
          <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
          <path d="M14 3v5h5M9 13h6M9 17h4" />
        </svg>
      );
  }
}

export function ExternalIcon({ className = "" }: { className?: string }) {
  return (
    <svg {...base} width={14} height={14} className={className}>
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  );
}

export function DownloadIcon({ className = "" }: { className?: string }) {
  return (
    <svg {...base} width={18} height={18} className={className}>
      <path d="M12 3v12M7 11l5 5 5-5M5 21h14" />
    </svg>
  );
}

export function PinIcon() {
  return (
    <svg {...base} width={13} height={13}>
      <path d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}
