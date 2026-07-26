import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /**
     * Next 16 raised the optimised-image cache from 60 seconds to 4 hours.
     * That's the right default in production, but in development it means
     * replacing a file in place — swapping photo.png, say — keeps serving the
     * old optimised bytes for hours. Hard-refreshing doesn't help, because the
     * staleness is server-side, not in the browser.
     */
    minimumCacheTTL: process.env.NODE_ENV === "development" ? 60 : 14400,
  },
};

export default nextConfig;
