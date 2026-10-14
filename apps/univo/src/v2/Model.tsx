import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { buildModel, type ModelLevel, type Pt } from "./geometry";
import styles from "./Model.module.css";

export interface Callout {
  id: string;
  name: ReactNode;
  meta?: ReactNode;
  href?: string;
}

const pct = (v: number, from: number, size: number) => `${Math.round(((v - from) / size) * 10000) / 100}%`;

/**
 * The group as a building (isometric). Decorative SVG + real HTML callouts (links) in reading order.
 * Hover / focus on a callout highlights its floor, node and leader — pure CSS (:has), no client JS.
 * Motion: point → axis → floors, top-down, once ([data-scene] entering view; see base.css/motion).
 */
export function Model({
  id,
  levels,
  callouts,
  variant = "hero",
  label,
}: {
  id: string;
  levels: ModelLevel[];
  callouts: Callout[];
  variant?: "hero" | "exploded" | "mini";
  label: string;
}) {
  const geo = buildModel(
    levels,
    variant === "exploded" ? { gap: 124, thickness: 12, split: 36, sourceRise: 120 } : variant === "mini" ? { gap: 64, thickness: 12 } : {},
  );
  const margin = variant === "mini" ? 0 : 168;
  const [vx, vy, vw, vh] = geo.viewBox;
  const box = { x: vx - margin, y: vy, w: vw + margin * 2, h: vh };
  const minX = vx;
  const maxX = vx + vw;
  const n = levels.length;
  const delay = (step: number) => ({ "--d": `calc(var(--m-stagger) * ${(n - 1 - step) * 2 + 2})` }) as CSSProperties;
  const byId = new Map(callouts.map((c) => [c.id, c]));
  const order = geo.slabs
    .filter((s) => byId.has(s.id))
    .sort((a, b) => a.node[1] - b.node[1] || a.node[0] - b.node[0]);
  const number = new Map(order.map((s, i) => [s.id, i + 1]));

  // One rule per member: data-driven, so a new member needs no CSS.
  const css = geo.slabs
    .filter((s) => s.member)
    .map((s) => {
      const c = s.member!.color;
      const on = `#${id}:has([data-callout="${s.id}"]:hover, [data-callout="${s.id}"]:focus-visible)`;
      return `${on} [data-slab="${s.id}"] .${styles.top}{fill:color-mix(in srgb, ${c} 16%, var(--univo-brand-white))}${on} [data-leader="${s.id}"]{stroke:${c};stroke-width:2}${on} [data-node="${s.id}"]{transform:scale(1.35)}`;
    })
    .join("");

  return (
    <figure id={id} className={`${styles.model} ${styles[variant]}`} data-variant={variant}>
      <style>{css}</style>
      <div
        className={styles.drawing}
        style={
          {
            aspectRatio: `${box.w} / ${box.h}`,
            "--crop-w": `${(box.w / vw) * 100}%`,
            "--crop-ml": `${-(margin / vw) * 100}%`,
            "--crop-ratio": `${vw} / ${vh}`,
          } as CSSProperties
        }
      >
        <svg viewBox={`${box.x} ${box.y} ${box.w} ${box.h}`} aria-hidden="true" focusable="false" className={styles.svg}>
          {geo.layers.map(({ slab, step }) => (
            <g
              key={slab.id}
              className={`${styles.slab} ${slab.ghost ? styles.ghost : ""}`}
              data-slab={slab.id}
              data-level={slab.level}
              style={delay(step)}
            >
              <polygon className={styles.front} points={slab.front} />
              <polygon className={styles.side} points={slab.side} />
              <polygon className={styles.top} points={slab.top} />
              {slab.member && slab.level !== "master" ? (
                <circle
                  className={styles.node}
                  data-node={slab.id}
                  data-state={slab.member.state}
                  cx={slab.node[0]}
                  cy={slab.node[1]}
                  r={slab.member.state === "ring" ? 5.5 : 7}
                  style={{ "--c": slab.member.color } as CSSProperties}
                />
              ) : null}
              {byId.has(slab.id) && margin ? (
                <Leader slabAnchor={slab.anchor} side={slab.side_} minX={minX} maxX={maxX} id={slab.id} />
              ) : null}
              {number.has(slab.id) ? (
                <text className={styles.num} x={slab.node[0] - 11} y={slab.node[1] + 4} textAnchor="end">
                  {number.get(slab.id)}
                </text>
              ) : null}
            </g>
          ))}
          {/* The axis as drawn: dashed where hidden inside the floors, solid where visible. */}
          <line
            className={`${styles.axis} ${styles.hidden}`}
            x1={geo.axis.hidden[0][0]}
            y1={geo.axis.hidden[0][1]}
            x2={geo.axis.hidden[1][0]}
            y2={geo.axis.hidden[1][1]}
            data-route="axis-hidden"
          />
          {geo.axis.pierces.map((p) => (
            <circle key={p.level} className={styles.pierce} cx={p.at[0]} cy={p.at[1]} r={3.5} style={delay(p.step)} />
          ))}
          <line
            className={styles.axis}
            x1={geo.axis.visible[0][0]}
            y1={geo.axis.visible[0][1]}
            x2={geo.axis.visible[1][0]}
            y2={geo.axis.visible[1][1]}
            pathLength={1}
            data-route="axis"
          />
          <circle className={styles.source} cx={geo.source[0]} cy={geo.source[1]} r={10} data-node="source" />
        </svg>

        {margin ? (
          <ol role="list" className={styles.callouts} aria-label={label}>
            {order.map((s) => {
              const c = byId.get(s.id)!;
              const left = s.side_ === "left";
              const edge = left ? minX - 12 : maxX + 12;
              const style = {
                top: pct(s.anchor[1], box.y, box.h),
                ...(left ? { right: `calc(100% - ${pct(edge, box.x, box.w)})` } : { left: pct(edge, box.x, box.w) }),
              } as CSSProperties;
              const body = (
                <>
                  <span className={styles.lnum} aria-hidden="true">
                    {number.get(s.id)}
                  </span>
                  <span className={styles.cname}>{c.name}</span>
                  {c.meta ? <span className={styles.cmeta}>{c.meta}</span> : null}
                </>
              );
              return (
                <li key={s.id} className={`${styles.callout} ${left ? styles.left : ""}`} style={style} data-num={number.get(s.id)}>
                  {c.href ? (
                    <Link href={c.href} className={styles.clink} data-callout={s.id}>
                      {body}
                    </Link>
                  ) : (
                    <span className={styles.clink} data-callout={s.id}>
                      {body}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        ) : null}
      </div>

    </figure>
  );
}

function Leader({ slabAnchor, side, minX, maxX, id }: { slabAnchor: Pt; side: "left" | "right"; minX: number; maxX: number; id: string }) {
  const end = side === "left" ? minX - 12 : maxX + 12;
  return (
    <line
      className={styles.leader}
      data-leader={id}
      x1={slabAnchor[0]}
      y1={slabAnchor[1]}
      x2={end}
      y2={slabAnchor[1]}
    />
  );
}
