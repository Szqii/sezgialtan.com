import type { Metadata } from "next";
import { Bricolage_Grotesque, JetBrains_Mono, Manrope } from "next/font/google";

import { TravelingAvatar } from "@/components/Avatar";
import { MotionProvider } from "@/components/MotionProvider";
import { ThemeScript } from "@/components/ThemeScript";
import { ThemeToggle } from "@/components/ThemeToggle";
import { profile } from "@/lib/profile";

import "./globals.css";

/**
 * Three faces, three jobs:
 *   display — Bricolage Grotesque, used with restraint on headings only
 *   body    — Manrope, deliberately not Inter
 *   mono    — JetBrains Mono for machine facts (dates, stacks, package names)
 *
 * That last split is the structural device on this site: monospace means the
 * machine is talking, the sans face means Sezgi is.
 */

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sezgialtan.com"),
  title: {
    default: `${profile.name} — ${profile.title}`,
    template: `%s · ${profile.name}`,
  },
  description: profile.bio,
  openGraph: {
    title: `${profile.name} — ${profile.title}`,
    description: profile.bio,
    url: "https://sezgialtan.com",
    siteName: profile.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — ${profile.title}`,
    description: profile.bio,
    creator: "@sezgialtan",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      // Next 16 no longer overrides scroll-behavior during navigation unless
      // this attribute is present, and globals.css sets `scroll-behavior:
      // smooth`. With two routes and real client-side nav, this matters.
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${bricolage.variable} ${manrope.variable} ${jetbrains.variable}`}
    >
      <head>
        <ThemeScript />
        {/*
          Framer server-renders its `initial` state, so every animated element
          ships as opacity:0 and is revealed on hydration. Without JS that
          leaves a blank page. This reveals them and hides the traveling avatar,
          which has nothing to measure and would otherwise land in the corner.
        */}
        <noscript>
          <style>{`[style*="opacity:0"]{opacity:1!important;transform:none!important}[data-traveling-avatar]{display:none!important}`}</style>
        </noscript>
      </head>
      <body className="min-h-dvh">
        <MotionProvider>
          {/* Both live in the root layout so they survive navigation — that's
              what lets the avatar physically fly between routes. */}
          <TravelingAvatar />
          <ThemeToggle />
          {children}
        </MotionProvider>
      </body>
    </html>
  );
}
