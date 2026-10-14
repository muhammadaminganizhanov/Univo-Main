import type { NextConfig } from "next";

/** Placeholder shell (Phase 1). Never indexed until the direction's real site is built. */
const config: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  poweredByHeader: false,
  transpilePackages: ["@univo/brand", "@univo/config", "@univo/content", "@univo/ui"],
  async headers() {
    return [{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }];
  },
};

export default config;
