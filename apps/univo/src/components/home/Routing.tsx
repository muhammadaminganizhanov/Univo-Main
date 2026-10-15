import { getProducts, getServices, type Entity } from "@univo/content";
import type { CSSProperties } from "react";
import type { LocaleContext } from "@/i18n";
import styles from "./Routing.module.css";

/**
 * Signature 3 — one point of entry. Choose a task: it enters once, the UNIVO point routes it to the
 * parts it needs (the others stay idle), one owner holds it, the result comes out. The route is the
 * brand stroke — round caps, turns by quarter circles. CSS only (radios + :has); the steps below
 * carry the meaning for every reader.
 *
 * Changing the task is one short sequence (≈1 s): the previous branches retract, the new ones draw
 * out of UNIVO, their parts light, the branches converge, the owner takes it, the result comes out.
 * Owner and result are re-lit per task (one layer per task, shown only for the chosen one), so the
 * sequence replays on every change. Without motion the final state is simply shown.
 */
const TASKS = [
  { id: "launch", to: ["tech", "production"] },
  { id: "retail", to: ["retail"] },
  { id: "booking", to: ["slot"] },
] as const;

type Pt = [number, number];
/** Orthogonal path with rounded quarter turns. */
function ortho(points: Pt[], radius = 22) {
  let d = `M${points[0]![0]} ${points[0]![1]}`;
  for (let i = 1; i < points.length - 1; i++) {
    const [px, py] = points[i - 1]!;
    const [x, y] = points[i]!;
    const [nx, ny] = points[i + 1]!;
    const lenIn = Math.abs(x - px) + Math.abs(y - py);
    const lenOut = Math.abs(nx - x) + Math.abs(ny - y);
    const r = Math.min(radius, lenIn / 2, lenOut / 2);
    if (r < 0.5) {
      d += ` L${x} ${y}`;
      continue;
    }
    d += ` L${x - Math.sign(x - px) * r} ${y - Math.sign(y - py) * r} Q${x} ${y} ${x + Math.sign(nx - x) * r} ${y + Math.sign(ny - y) * r}`;
  }
  const last = points[points.length - 1]!;
  return `${d} L${last[0]} ${last[1]}`;
}

interface Layout {
  w: number;
  h: number;
  map: (p: Pt) => Pt;
  task: Pt;
  univo: Pt;
  fan: number;
  partX: number;
  partYs: number[];
  merge: number;
  owner: Pt;
  result: Pt;
}

function layout(n: number, phone: boolean): Layout {
  // drawn left → right in "flow" coordinates (along, across); phones swap the axes (top → down)
  const across = phone ? [44, 128, 212, 296] : [52, 132, 212, 292];
  const ys = Array.from({ length: n }, (_, i) => across[i] ?? 52 + i * 80);
  const mid = (ys[0]! + ys[ys.length - 1]!) / 2;
  const along = phone
    ? { task: 20, univo: 150, fan: 230, part: 330, merge: 470, owner: 540, result: 660, end: 700 }
    : { task: 24, univo: 330, fan: 450, part: 620, merge: 900, owner: 990, result: 1150, end: 1200 };
  const map = (p: Pt): Pt => (phone ? [p[1], p[0]] : p);
  return {
    w: phone ? 340 : along.end,
    h: phone ? along.end : 344,
    map,
    task: [along.task, mid],
    univo: [along.univo, mid],
    fan: along.fan,
    partX: along.part,
    partYs: ys,
    merge: along.merge,
    owner: [along.owner, mid],
    result: [along.result, mid],
  };
}

export function Routing({ ctx }: { ctx: LocaleContext }) {
  const { t } = ctx;
  const h = t.home.how;
  const parts = [...getServices(), ...getProducts()];

  const css = TASKS.map((task) => {
    const on = `#routing:has(#task-${task.id}:checked)`;
    return (
      task.to.map((id) => `${on} [data-to="${id}"]{--live:1}`).join("") +
      `${on} [data-for="${task.id}"]{display:inline}` +
      `${on} [data-act="${task.id}"]{display:inline}`
    );
  }).join("");

  const draw = (phone: boolean) => {
    const L = layout(parts.length, phone);
    const m = (p: Pt) => L.map(p);
    const path = (pts: Pt[]) => ortho(pts.map(m));
    const partLabelOffset = phone ? [0, 34] : [24, 7];
    return (
      <svg className={phone ? styles.phone : styles.desktop} viewBox={`0 0 ${L.w} ${L.h}`} aria-hidden="true" focusable="false">
        {/* fixed: task → UNIVO, owner → result */}
        <path className={styles.live} d={path([L.task, L.univo])} />
        <path className={styles.idle} d={path([L.owner, L.result])} />
        {parts.map((e, i) => {
          const y = L.partYs[i]!;
          const into = path([L.univo, [L.fan, L.univo[1]], [L.fan, y], [L.partX, y]]);
          // leaves after the part's name (desktop) / below it (phones)
          const out = path([[L.partX + (phone ? 0 : 170), y], [L.merge, y], [L.merge, L.owner[1]], L.owner]);
          return (
            <g key={e.id} className={styles.branch} data-to={e.id} style={{ "--c": `var(${e.accent})` } as CSSProperties}>
              <path className={styles.idle} d={into} />
              <path className={styles.idle} d={out} />
              <path className={styles.on} d={into} pathLength={1} />
              <path className={`${styles.on} ${styles.onOut}`} d={out} pathLength={1} />
            </g>
          );
        })}
        {parts.map((e, i) => {
          const [x, y] = m([L.partX, L.partYs[i]!]);
          return (
            <g key={e.id} className={styles.partNode} data-to={e.id} style={{ "--c": `var(${e.accent})` } as CSSProperties}>
              <circle cx={x} cy={y} r={11} className={e.status === "live" ? styles.dotLive : styles.dotRing} />
              <text x={x + partLabelOffset[0]!} y={y + partLabelOffset[1]!} className={styles.partName} textAnchor={phone ? "middle" : "start"}>
                {e.word}
              </text>
            </g>
          );
        })}
        {(() => {
          const [tx, ty] = m(L.task);
          const [ux, uy] = m(L.univo);
          const [ox, oy] = m(L.owner);
          const [rx, ry] = m(L.result);
          return (
            <>
              <circle cx={tx} cy={ty} r={13} className={styles.taskNode} />
              <circle cx={ux} cy={uy} r={22} className={styles.univo} />
              <text x={ux} y={phone ? uy + 6 : uy - 38} dx={phone ? 36 : 0} className={styles.nodeLabel} textAnchor={phone ? "start" : "middle"}>
                {h.router}
              </text>
              <circle cx={ox} cy={oy} r={14} className={styles.ownerIdle} />
              <text x={ox} y={phone ? oy + 6 : oy + 48} dx={phone ? 30 : 0} className={styles.nodeLabel} textAnchor={phone ? "start" : "middle"}>
                {h.owner}
              </text>
              <circle cx={rx} cy={ry} r={20} className={styles.resultIdle} />
              {TASKS.map((task) => (
                <g key={task.id} className={styles.act} data-act={task.id}>
                  <path className={styles.actLine} d={path([L.owner, L.result])} pathLength={1} />
                  <circle cx={ox} cy={oy} r={15} className={`${styles.owner} ${styles.actOwner}`} />
                  <circle cx={rx} cy={ry} r={22} className={`${styles.result} ${styles.actResult}`} />
                </g>
              ))}
              <text x={rx} y={phone ? ry + 6 : ry - 38} dx={phone ? 36 : 0} className={styles.nodeLabel} textAnchor={phone ? "start" : "end"}>
                {h.result}
              </text>
            </>
          );
        })()}
      </svg>
    );
  };

  return (
    <section id="routing" className={styles.section} data-surface="paper" data-scene="routing" aria-labelledby="home-how">
      <style>{css}</style>
      <div className="container">
        <div className={styles.head}>
          <h2 id="home-how" className={styles.title} data-reveal>
            {h.title}
          </h2>
          <p className={styles.lead}>{h.lead}</p>
        </div>

        <fieldset className={styles.tasks}>
          <legend className={styles.choose}>{h.choose}</legend>
          {TASKS.map((task, i) => (
            <span key={task.id} className={styles.taskOpt}>
              <input type="radio" name="task" id={`task-${task.id}`} className={styles.radio} defaultChecked={i === 0} />
              <label htmlFor={`task-${task.id}`} className={styles.pill}>
                {h.tasks[task.id]}
              </label>
            </span>
          ))}
        </fieldset>

        <div className={styles.figure}>
          <p className={styles.taskNow} aria-hidden="true">
            <span className={styles.taskLabel}>{h.task}</span>
            {TASKS.map((task) => (
              <span key={task.id} data-for={task.id} className={styles.taskText}>
                «{h.tasks[task.id]}»
              </span>
            ))}
          </p>
          {draw(false)}
          {draw(true)}
        </div>

        <ol role="list" className={styles.steps}>
          {h.steps.map((s, i) => (
            <li key={s.title} className={styles.step}>
              <span className={styles.stepNum}>{String(i + 1).padStart(2, "0")}</span>
              <h3 className={styles.stepTitle}>{s.title}</h3>
              <p className={styles.stepText}>{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export type { Entity };
