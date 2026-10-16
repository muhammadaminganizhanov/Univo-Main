import type { ElementType, ReactNode } from "react";

/**
 * Motion foundation for type reveals: an overflow mask + inner layer. Renders static today;
 * a later motion pass animates `.reveal__inner` (transform only). Reduced motion: untouched.
 */
export function Reveal({ as: Tag = "span", children, className }: { as?: ElementType; children: ReactNode; className?: string }) {
  return (
    <Tag className={["reveal", className].filter(Boolean).join(" ")} data-reveal="">
      <span className="reveal__inner">{children}</span>
    </Tag>
  );
}
