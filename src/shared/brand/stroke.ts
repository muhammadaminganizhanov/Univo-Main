/**
 * The UNIVO stroke — the group drawn in the logo's own geometry.
 *
 * Wordmark units (Brand Book p. 10): stroke w = 16, arc axis radius 1.5w = 24, stem pitch 3w = 48,
 * dot Ø 1.5w = 24 with a 0.5w gap. A source stem (like the "i") carries the Tangerine dot; the stroke
 * then continues u, n, u, n … and every n-crest carries one member's dot. One member = one crest.
 * Turns are semicircles only (p. 29). The path is ONE continuous <path> so it can be drawn later.
 */

export const STROKE_UNITS = { w: 16, r: 24, p: 48 } as const;

export interface StrokeNode {
  /** Centre of the dot in stroke coordinates. */
  cx: number;
  cy: number;
  /** Left edge of the dot — label anchor. */
  anchor: number;
}

export interface StrokeGeometry {
  width: number;
  /** viewBox y origin (negative: room for dots). */
  top: number;
  height: number;
  d: string;
  /** Optional dashed continuation: where the next member's crest would be. */
  openD: string | null;
  /** Where the open crest's dot would sit. */
  openNode: StrokeNode | null;
  source: StrokeNode;
  nodes: StrokeNode[];
}

const f = (n: number) => Math.round(n * 100) / 100;

/**
 * @param count number of member crests after the source stem
 * @param stem  extra straight length of every stem (0 = wordmark proportions)
 * @param open  draw the next (empty) crest as a dashed continuation
 */
export function strokeGeometry(count: number, stem = 0, open = false): StrokeGeometry {
  const { w, r, p } = STROKE_UNITS;
  const stems = 2 * count + 1;
  const T = r + w / 2; // crest arc centre line
  const B = T + stem; // valley arc centre line
  const x = (k: number) => w / 2 + k * p;

  let d = `M${x(0)} ${T - r}V${B}`;
  for (let k = 1; k < stems; k++) {
    if (k % 2 === 1) d += `A${r} ${r} 0 0 0 ${x(k)} ${B}V${T}`; // u: valley
    else d += `A${r} ${r} 0 0 1 ${x(k)} ${T}V${B}`; // n: crest
  }

  const dotY = T - r - w / 2 - w / 2 - (1.5 * w) / 2; // crest top − gap − radius = −20
  const nodes = Array.from({ length: count }, (_, j) => {
    const a = x(2 * j + 1);
    const b = x(2 * j + 2);
    const cx = (a + b) / 2;
    return { cx: f(cx), cy: dotY, anchor: f(cx - 0.75 * w) };
  });

  const last = stems - 1;
  const openD = open ? `M${x(last)} ${B}A${r} ${r} 0 0 0 ${x(last + 1)} ${B}V${T}A${r} ${r} 0 0 1 ${x(last + 2)} ${T}V${B}` : null;
  const openCx = (x(last + 1) + x(last + 2)) / 2;

  return {
    width: f(x(open ? last + 2 : last) + w / 2),
    top: -32,
    height: f(B + r + w / 2 + 32),
    d,
    openD,
    openNode: open ? { cx: f(openCx), cy: dotY, anchor: f(openCx - 0.75 * w) } : null,
    source: { cx: x(0), cy: dotY, anchor: 0 },
    nodes,
  };
}

/**
 * Skyline: the same stroke grammar (vertical stems, semicircle turns, round caps, dot over the
 * stem/crest) with meaning in the proportions — each crest's height is set by the caller
 * (e.g. live members taller than launching ones) and a wider valley separates groups.
 * Used where the group is expressed as identity (Home hero).
 */
export interface SkylineCrest {
  height: number;
  /** Start a new group before this crest (wider valley). */
  groupStart?: boolean;
}

export function skylineGeometry(
  sourceHeight: number,
  crests: SkylineCrest[],
  {
    w = 8,
    r = 32,
    valley = r,
    groupGap = 2,
    sourceGap = 1,
    dotR = 12,
  }: {
    w?: number;
    r?: number;
    /** valley radius: smaller than r reads as an arcade */
    valley?: number;
    groupGap?: number;
    /** wider first valley: separates the source from its members */
    sourceGap?: number;
    dotR?: number;
  } = {},
): StrokeGeometry {
  const gap = w / 2 + 8 + dotR; // stem/crest outer edge → dot centre (cap + 0.5w-equivalent gap + radius)
  const base = 0; // valley arc centre line
  let x = w / 2;
  const sourceTop = base - sourceHeight;
  let d = `M${f(x)} ${f(sourceTop)}V${base}`;
  const source = { cx: f(x), cy: f(sourceTop - gap), anchor: f(Math.max(0, x - dotR)) };
  const nodes: StrokeNode[] = [];

  for (const [i, c] of crests.entries()) {
    const rv = valley * (c.groupStart ? groupGap : i === 0 ? sourceGap : 1); // valley radius
    x += 2 * rv;
    const top = base - c.height;
    d += `A${rv} ${rv} 0 0 0 ${f(x)} ${base}V${f(top)}`;
    const left = x;
    x += 2 * r;
    d += `A${r} ${r} 0 0 1 ${f(x)} ${f(top)}V${base}`;
    const cx = (left + x) / 2;
    nodes.push({ cx: f(cx), cy: f(top - r - gap), anchor: f(cx - dotR) });
  }

  const minY = Math.min(source.cy, ...nodes.map((n) => n.cy)) - dotR - 2;
  const maxY = base + valley * Math.max(1, sourceGap, ...crests.map((c) => (c.groupStart ? groupGap : 1))) + w / 2;
  return {
    width: f(x + w / 2),
    top: f(minY),
    height: f(maxY - minY),
    d,
    openD: null,
    openNode: null,
    source,
    nodes,
  };
}
