import type { CSSProperties } from "react";

/**
 * A single brand dot used inside text layouts (index rows, chips, legends).
 * filled = live / identity · ring = launching. Decorative: meaning is always in adjacent text.
 */
export function Dot({
  color = "var(--color-accent)",
  state = "filled",
  size = 12,
  node,
  className,
}: {
  color?: string;
  state?: "filled" | "ring";
  size?: number;
  node?: string;
  className?: string;
}) {
  const style: CSSProperties = {
    display: "inline-block",
    flex: "none",
    width: size,
    height: size,
    borderRadius: "50%",
    ...(state === "ring"
      ? { boxShadow: `inset 0 0 0 ${Math.max(2, Math.round(size / 6))}px ${color}` }
      : { background: color }),
  };
  return <span aria-hidden="true" data-node={node} data-state={state} className={className} style={style} />;
}
