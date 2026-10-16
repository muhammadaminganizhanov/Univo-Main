import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const config = [
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      "no-console": ["error", { allow: ["warn", "error"] }],
    },
  },
  {
    ignores: ["**/.next/**", "**/node_modules/**", "**/next-env.d.ts", "qa-output/**"],
  },
];

export default config;
