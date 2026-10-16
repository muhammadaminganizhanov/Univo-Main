import { Lockup } from "@univo/brand";
import type { Entity } from "@univo/content";

/** "univo | NAME" with the entity's dot colour (who speaks). Masterbrand has no lockup. */
export function EntityLockup({ entity, className, decorative = false }: { entity: Entity; className?: string; decorative?: boolean }) {
  if (!entity.word) return null;
  const dot = `var(${entity.accent})`;
  return <Lockup name={entity.word} dot={dot} className={className} title={decorative ? null : entity.name} />;
}
