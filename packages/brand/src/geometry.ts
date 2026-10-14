// Approved master geometry, copied verbatim from Brand Book v1.2.2 · master-assets.
// Never redraw: logo/univo-logo.svg, symbol/univo-symbol.svg.

/** Wordmark "univo" — viewBox 0 -32 282 97. Stroke w = 16. */
export const WORDMARK = {
  viewBox: { x: 0, y: -32, w: 282, h: 97 },
  d: "M0 8L0 32A32 32 0 0 0 48.708 59.292A8 8 0 0 0 64 56L64 32A16 16 0 0 1 96 32L96 56A8 8 0 0 0 112 56L112 32A32 32 0 0 0 63.292 4.708A8 8 0 0 0 48 8L48 32A16 16 0 0 1 16 32L16 8A8 8 0 0 0 0 8ZM126 8V56A8 8 0 0 0 142 56V8A8 8 0 0 0 126 8ZM152.661 10.578L175.161 60.578A7.5 7.5 0 0 0 188.839 60.578L211.339 10.578A7.5 7.5 0 0 0 197.661 4.422L182 39.224L166.339 4.422A7.5 7.5 0 0 0 152.661 10.578ZM218 32A32 32 0 1 0 282 32A32 32 0 1 0 218 32ZM234 32A16 16 0 1 1 266 32A16 16 0 1 1 234 32Z",
  dot: { cx: 134, cy: -20, r: 12 },
} as const;

/** Symbol "un + dot" — viewBox 0 -35 112 99. */
export const SYMBOL = {
  viewBox: { x: 0, y: -35, w: 112, h: 99 },
  d: "M0 8L0 32A32 32 0 0 0 48.708 59.292A8 8 0 0 0 64 56L64 32A16 16 0 0 1 96 32L96 56A8 8 0 0 0 112 56L112 32A32 32 0 0 0 63.292 4.708A8 8 0 0 0 48 8L48 32A16 16 0 0 1 16 32L16 8A8 8 0 0 0 0 8Z",
  dot: { cx: 56, cy: -22, r: 13 },
} as const;

/** Logo height including the dot, in logo units (6w). Clear space X = ⅓ of it. */
export const LOGO_UNITS = { stroke: 16, height: 96, separatorWidth: 2.5 } as const;
