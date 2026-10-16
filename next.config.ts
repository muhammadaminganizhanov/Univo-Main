import type { NextConfig } from "next";
import { isIndexable } from "./src/shared/config/env";

const indexable = isIndexable();

const config: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  poweredByHeader: false,
  async headers() {
    const security = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-Frame-Options", value: "DENY" },
    ];
    // Staging is never indexed: header + meta robots + robots.txt.
    const robots = indexable ? [] : [{ key: "X-Robots-Tag", value: "noindex, nofollow" }];
    return [{ source: "/:path*", headers: [...security, ...robots] }];
  },
};

export default config;
