import type { SVGProps } from "react";
import { LOCKUP_GEOMETRY } from "./lockups.generated";
import { LOGO_UNITS, SYMBOL, WORDMARK } from "./geometry";

type Tone = "default" | "inverse";
type BaseProps = Omit<SVGProps<SVGSVGElement>, "viewBox" | "children"> & {
  /** Accessible name. Pass `null` when the logo sits inside a link that already has a name. */
  title?: string | null;
  tone?: Tone;
};

const vb = (v: { x: number; y: number; w: number; h: number }) => `${v.x} ${v.y} ${v.w} ${v.h}`;
const a11y = (title: string | null | undefined) =>
  title === null ? ({ "aria-hidden": true, focusable: false } as const) : ({ role: "img", "aria-label": title } as const);

/**
 * Letters follow `currentColor`, so the same component serves light and dark surfaces.
 * The dot colour comes from `--logo-dot` (Tangerine for the masterbrand) — never a signal colour.
 */
export function Logo({ title = "UNIVO", tone = "default", className, ...rest }: BaseProps) {
  return (
    <svg viewBox={vb(WORDMARK.viewBox)} className={className} data-tone={tone} {...a11y(title)} {...rest}>
      <path d={WORDMARK.d} fill="currentColor" />
      <circle {...WORDMARK.dot} fill="var(--logo-dot, var(--univo-brand-tangerine))" />
    </svg>
  );
}

export function Symbol({ title = "UNIVO", className, ...rest }: BaseProps) {
  return (
    <svg viewBox={vb(SYMBOL.viewBox)} className={className} {...a11y(title)} {...rest}>
      <path d={SYMBOL.d} fill="currentColor" />
      <circle {...SYMBOL.dot} fill="var(--logo-dot, var(--univo-brand-tangerine))" />
    </svg>
  );
}

export type LockupName = keyof typeof LOCKUP_GEOMETRY;

/**
 * "univo | NAME" lockup for directions and products. The dot takes the entity accent
 * (`dot` prop, any CSS colour or var). Separator is 30 % of the letter colour.
 */
export function Lockup({ name, dot, title, className, ...rest }: BaseProps & { name: LockupName; dot: string }) {
  const g = LOCKUP_GEOMETRY[name];
  return (
    <svg
      viewBox={`${WORDMARK.viewBox.x} ${WORDMARK.viewBox.y} ${g.width} ${WORDMARK.viewBox.h}`}
      className={className}
      {...a11y(title === undefined ? `UNIVO ${name}` : title)}
      {...rest}
    >
      <path d={WORDMARK.d} fill="currentColor" />
      <circle {...WORDMARK.dot} fill={dot} />
      <rect
        x={g.ruleX}
        y={0}
        width={LOGO_UNITS.separatorWidth}
        height={64}
        rx={LOGO_UNITS.separatorWidth / 2}
        fill="currentColor"
        opacity={0.3}
      />
      <g transform={g.labelTransform}>
        {g.glyphs.map((gl) => (
          <path key={gl.x} transform={`translate(${gl.x} 0)`} d={gl.d} fill="currentColor" />
        ))}
      </g>
    </svg>
  );
}
