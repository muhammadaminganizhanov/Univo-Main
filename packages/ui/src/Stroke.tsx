import { strokeGeometry, type StrokeGeometry } from "@univo/brand";
import type { CSSProperties, ReactNode } from "react";
import styles from "./Stroke.module.css";

export interface StrokeItem {
  id: string;
  /** Dot colour (CSS value). */
  color: string;
  /** filled = live, ring = launching. */
  state?: "filled" | "ring";
  label?: ReactNode;
}

const pct = (n: number) => `${Math.round(n * 10000) / 100}%`;

function Open({ geo, weight }: { geo: ReturnType<typeof strokeGeometry>; weight: number }) {
  if (!geo.openD || !geo.openNode) return null;
  return (
    <g className={styles.open} data-route="next">
      <path d={geo.openD} strokeWidth={Math.max(2, weight / 3)} strokeDasharray={`${weight / 2} ${weight}`} />
      <circle cx={geo.openNode.cx} cy={geo.openNode.cy} r={10} strokeWidth={3} strokeDasharray="4 4" />
    </g>
  );
}

function Dots({ geo, source, nodes }: { geo: ReturnType<typeof strokeGeometry>; source: StrokeItem; nodes: StrokeItem[] }) {
  const all = [{ item: source, at: geo.source }, ...nodes.map((item, i) => ({ item, at: geo.nodes[i]! }))];
  return (
    <>
      {all.map(({ item, at }) =>
        item.state === "ring" ? (
          <circle
            key={item.id}
            data-node={item.id}
            data-state="ring"
            className={styles.ring}
            cx={at.cx}
            cy={at.cy}
            r={9.5}
            stroke={item.color}
            strokeWidth={5}
          />
        ) : (
          <circle key={item.id} data-node={item.id} data-state="filled" cx={at.cx} cy={at.cy} r={12} fill={item.color} />
        ),
      )}
    </>
  );
}

/**
 * The UNIVO stroke: source stem + one crest per member. Motion-ready: one `path[data-route]`
 * with pathLength=1 (draw), `circle[data-node]` per member (activate). Decorative SVG; meaning
 * lives in the label list, which stays in reading order for assistive technology.
 */
export interface StrokeGroup {
  id: string;
  label: ReactNode;
  /** Inclusive indexes into `nodes`. */
  from: number;
  to: number;
}

export function Stroke({
  source,
  nodes,
  geometry,
  stem = 0,
  weight = 16,
  responsive = true,
  labelSpan,
  open = false,
  openLabel,
  groups,
  className,
  style,
  id,
}: {
  source: StrokeItem;
  nodes: StrokeItem[];
  /** Precomputed geometry (e.g. skylineGeometry). Defaults to the even wordmark wave. */
  geometry?: StrokeGeometry;
  /** Show the dashed next crest: the system is open. */
  open?: boolean;
  openLabel?: ReactNode;
  /** Brackets above ranges of nodes (e.g. directions / products). Horizontal layout only. */
  groups?: StrokeGroup[];
  stem?: number;
  /** Stroke width in logo units (16 = wordmark weight). */
  weight?: number;
  /** Rotate into a vertical route below 768 px. */
  responsive?: boolean;
  /** Width of each label as a fraction of the stroke width (defaults to the crest spacing). */
  labelSpan?: number;
  className?: string;
  style?: CSSProperties;
  id?: string;
}) {
  const geo = geometry ?? strokeGeometry(nodes.length, stem, open);
  const ymax = geo.top + geo.height;
  const anchors = [geo.source, ...geo.nodes].map((n) => n.anchor);
  const minGap = Math.min(...anchors.slice(1).map((a, i) => a - anchors[i]!));
  const span = labelSpan ?? minGap / geo.width;
  const items = [{ item: source, at: geo.source }, ...nodes.map((item, i) => ({ item, at: geo.nodes[i]! }))];

  const path = (
    <path className={styles.path} d={geo.d} strokeWidth={weight} pathLength={1} data-route="group" />
  );

  return (
    <div id={id} className={[styles.root, className].filter(Boolean).join(" ")} style={style} data-responsive={responsive}>
      {groups?.length ? (
        <div className={styles.groups}>
          {groups.map((g) => {
            const a = geo.nodes[g.from]!;
            const b = geo.nodes[g.to]!;
            const left = (a.cx - 12) / geo.width;
            const right = (b.cx + 12) / geo.width;
            return (
              <div
                key={g.id}
                className={styles.group}
                data-group={g.id}
                style={{ "--x": pct(left), "--gw": pct(right - left) } as CSSProperties}
              >
                {g.label}
              </div>
            );
          })}
        </div>
      ) : null}
      <svg
        className={`${styles.svg} ${styles.horizontal}`}
        viewBox={`0 ${geo.top} ${geo.width} ${geo.height}`}
        width="100%"
        aria-hidden="true"
        focusable="false"
      >
        {path}
        <Open geo={geo} weight={weight} />
        <Dots geo={geo} source={source} nodes={nodes} />
      </svg>
      {responsive ? (
        <svg
          className={`${styles.svg} ${styles.vertical}`}
          viewBox={`0 0 ${geo.height} ${geo.width}`}
          aria-hidden="true"
          focusable="false"
        >
          <g transform={`matrix(0 1 -1 0 ${ymax} 0)`}>
            {path}
            <Open geo={geo} weight={weight} />
            <Dots geo={geo} source={source} nodes={nodes} />
          </g>
        </svg>
      ) : null}
      <ol role="list" className={styles.labels}>
        {items.map(({ item, at }, i) => {
          // Each label may use the room up to the next node; the last one ends at the drawing's edge.
          const next = items[i + 1]?.at.anchor;
          const own = labelSpan ?? (next !== undefined ? (next - at.anchor) / geo.width : span);
          const end = at.anchor / geo.width + own > 1;
          return (
          <li
            key={item.id}
            className={styles.label}
            data-node-label={item.id}
            data-align={end ? "end" : undefined}
            style={
              {
                "--x": pct(at.anchor / geo.width),
                "--y": pct(at.cx / geo.width),
                "--span": pct(own),
              } as CSSProperties
            }
          >
            {item.label}
          </li>
          );
        })}
        {geo.openNode && openLabel ? (
          <li
            className={`${styles.label} ${styles.openLabel}`}
            data-node-label="next"
            style={
              {
                "--x": pct(geo.openNode.anchor / geo.width),
                "--y": pct(geo.openNode.cx / geo.width),
                "--span": pct((geo.width - geo.openNode.anchor) / geo.width),
              } as CSSProperties
            }
          >
            {openLabel}
          </li>
        ) : null}
      </ol>
    </div>
  );
}
