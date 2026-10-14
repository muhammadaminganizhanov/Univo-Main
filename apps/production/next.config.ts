import type { NextConfig } from "next";

/** Placeholder shell (Phase 1). Never indexed until the direction's real site is built. */
const config: NextConfig = {
  // Served under /production on the shared domain (vercel.json rewrites). Keep in sync with APP_BASE_PATH.
  basePath: "/production",
  reactStrictMode: true,
  devIndicators: false,
  poweredByHeader: false,
  transpilePackages: ["@univo/brand", "@univo/config", "@univo/content", "@univo/ui"],
  // The basePath root (/tech) does not reach the locale proxy: send it to the default locale.
  async redirects() {
    return [{ source: "/", destination: "/ru", permanent: false }];
  },
  async headers() {
    return [{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }];
  },
};

export default config;
