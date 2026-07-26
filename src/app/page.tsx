import { Hero } from "@/components/Hero";

/**
 * The landing page: heading, tagline, photo, input, chips.
 *
 * No conversation lives here. Asking anything — typed or via a chip — moves to
 * /chat, so the URL always reflects what's being discussed.
 */
export default function HomePage() {
  return <Hero />;
}
