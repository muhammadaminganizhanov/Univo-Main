/**
 * The group as a building, in isometric projection (30°). Pure geometry, no React.
 * Floors (top → bottom): masterbrand · directions · products · next (dashed, empty).
 * Members of one floor split it along x and SHARE an edge; the axis stands at (0,0) — through the
 * masterbrand's centre and exactly along the shared edges below (Brand Book: «общий край»).
 */

const COS = Math.cos(Math.PI / 6);
const SIN = 0.5;
const r = (n: number) => Math.round(n * 10) / 10;

export type Pt = [number, number];
export const project = (x: number, y: number, z: number): Pt => [r((x - y) * COS), r((x + y) * SIN - z)];
const pts = (list: Pt[]) => list.map((p) => p.join(",")).join(" ");

export interface ModelMember {
  id: string;
  state: "filled" | "ring";
  color: string;
}

export interface ModelLevel {
  id: string;
  members: ModelMember[];
  /** dashed outline, no members (the next floor). */
  ghost?: boolean;
}

export interface SlabShape {
  id: string;
  level: string;
  top: string;
  front: string;
  side: string;
  /** node position (top-face centre) */
  node: Pt;
  /** callout anchor: outer front corner of the slab */
  anchor: Pt;
  side_: "left" | "right";
  member?: ModelMember;
  ghost?: boolean;
}

export interface ModelGeometry {
  viewBox: [number, number, number, number];
  /** Back-to-front drawing order: slabs and axis segments interleaved. */
  layers: ({ kind: "slab"; slab: SlabShape; step: number } | { kind: "axis"; from: Pt; to: Pt; step: number })[];
  source: Pt;
  slabs: SlabShape[];
}

export function buildModel(
  levels: ModelLevel[],
  { width = 220, depth = 150, gap = 76, thickness = 14, sourceRise = 64 }: Partial<Record<"width" | "depth" | "gap" | "thickness" | "sourceRise", number>> = {},
): ModelGeometry {
  const x0 = -width / 2;
  const y0 = -depth / 2;
  const y1 = depth / 2;
  const n = levels.length;
  const zOf = (i: number) => (n - 1 - i) * gap; // top level highest
  const slabs: SlabShape[] = [];
  const layers: ModelGeometry["layers"] = [];

  // Bottom floor first (painter's algorithm), axis segment above each floor, then the next floor.
  for (let i = n - 1; i >= 0; i--) {
    const level = levels[i]!;
    const z = zOf(i);
    const parts = level.ghost ? [undefined] : level.members;
    const w = width / parts.length;
    parts.forEach((member, k) => {
      const a = x0 + k * w;
      const b = a + w;
      const slab: SlabShape = {
        id: member?.id ?? level.id,
        level: level.id,
        top: pts([project(a, y0, z), project(b, y0, z), project(b, y1, z), project(a, y1, z)]),
        front: pts([project(a, y1, z), project(b, y1, z), project(b, y1, z - thickness), project(a, y1, z - thickness)]),
        side: pts([project(b, y0, z), project(b, y1, z), project(b, y1, z - thickness), project(b, y0, z - thickness)]),
        node: project((a + b) / 2, 0, z),
        // outermost corner on screen: left members → (a, y1), everything else → (b, y0)
        anchor: parts.length > 1 && (a + b) / 2 < 0 ? project(a, y1, z - thickness / 2) : project(b, y0, z - thickness / 2),
        side_: parts.length > 1 && (a + b) / 2 < 0 ? "left" : "right",
        member,
        ghost: level.ghost,
      };
      slabs.push(slab);
      layers.push({ kind: "slab", slab, step: n - 1 - i });
    });
    const above = i > 0 ? zOf(i - 1) - thickness : zOf(0) + sourceRise;
    layers.push({ kind: "axis", from: project(0, 0, z), to: project(0, 0, above), step: n - 1 - i });
  }

  const source = project(0, 0, zOf(0) + sourceRise);
  const all = slabs.flatMap((s) => [s.top, s.front, s.side].flatMap((p) => p.split(" ").map((q) => q.split(",").map(Number) as Pt)));
  const xs = all.map((p) => p[0]);
  const ys = [...all.map((p) => p[1]), source[1] - 14];
  const pad = 8;
  const minX = Math.min(...xs) - pad;
  const minY = Math.min(...ys) - pad;
  return {
    viewBox: [r(minX), r(minY), r(Math.max(...xs) + pad - minX), r(Math.max(...ys) + pad - minY)],
    layers,
    source,
    slabs,
  };
}
