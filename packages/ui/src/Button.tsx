import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./Button.module.css";
import { Icon, type IconName } from "./Icon";

type Variant = "primary" | "secondary";
type Common = { children: ReactNode; icon?: IconName; size?: "md" | "sm"; block?: boolean; className?: string };

const cx = (...parts: (string | false | undefined)[]) => parts.filter(Boolean).join(" ");
const isExternal = (href: string) => /^https?:\/\//.test(href);

function Inner({ children, icon }: Pick<Common, "children" | "icon">) {
  return (
    <>
      <span>{children}</span>
      {icon ? <Icon name={icon} size={18} data-motion={icon === "arrowRight" ? "nudge" : undefined} /> : null}
    </>
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  block,
  icon,
  className,
  children,
  ...rest
}: Common & { href: string; variant?: Variant } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  const cls = cx(styles.button, styles[variant], size === "sm" && styles.small, block && styles.block, className);
  if (isExternal(href)) {
    return (
      <a href={href} className={cls} {...rest}>
        <Inner icon={icon}>{children}</Inner>
      </a>
    );
  }
  return (
    <Link href={href} className={cls} {...rest}>
      <Inner icon={icon}>{children}</Inner>
    </Link>
  );
}

export function Button({
  variant = "primary",
  size = "md",
  block,
  icon,
  className,
  children,
  type = "button",
  ...rest
}: Common & { variant?: Variant } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className={cx(styles.button, styles[variant], size === "sm" && styles.small, block && styles.block, className)}
      {...rest}
    >
      <Inner icon={icon}>{children}</Inner>
    </button>
  );
}

/** Quiet text link with an arrow — the secondary path. */
export function ArrowLink({
  href,
  children,
  className,
  icon = "arrowRight",
  ...rest
}: { href: string; children: ReactNode; className?: string; icon?: IconName } & Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "href"
>) {
  const glyph = <Icon name={icon} size={18} data-motion={icon === "arrowRight" ? "nudge" : undefined} />;
  const content =
    icon === "arrowLeft" ? (
      <>
        {glyph}
        <span>{children}</span>
      </>
    ) : (
      <>
        <span>{children}</span>
        {glyph}
      </>
    );
  const cls = cx(styles.link, icon === "arrowLeft" && styles.leading, className);
  return isExternal(href) ? (
    <a href={href} className={cls} {...rest}>
      {content}
    </a>
  ) : (
    <Link href={href} className={cls} {...rest}>
      {content}
    </Link>
  );
}
