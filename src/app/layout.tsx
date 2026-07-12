import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import { ThemeScript } from "@/components/ThemeScript";
import { CustomCursor } from "@/components/CustomCursor";
import { Intro } from "@/components/Intro";
import { MailBadge } from "@/components/MailBadge";
import { Nav } from "@/components/Nav";
import { OpenToWorkBadge } from "@/components/OpenToWorkBadge";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sezgi Altan — Software Developer",
  description:
    "Software engineer building robust web and mobile experiences that just work—and look good doing it.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${bricolage.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-full antialiased">
        <Intro />
        <CustomCursor />
        <Nav />
        {children}
        <MailBadge />
        <OpenToWorkBadge />
      </body>
    </html>
  );
}
