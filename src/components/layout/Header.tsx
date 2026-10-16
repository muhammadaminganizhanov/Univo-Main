import type { Locale } from "@univo/config";
import { Logo } from "@univo/brand";
import { ButtonLink, type GroupSwitcherItem } from "@univo/ui";
import Link from "next/link";
import type { LocaleContext } from "@/i18n";
import { ROUTES, localeHref } from "@/lib/routes";
import styles from "./Header.module.css";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { MobileMenu } from "./MobileMenu";
import { NavLinks } from "./NavLinks";

export function Header({ ctx, groupItems }: { ctx: LocaleContext; groupItems: GroupSwitcherItem[] }) {
  const { t, locale } = ctx;
  const nav = [
    { href: localeHref(locale, ROUTES.ecosystem), label: t.common.nav.ecosystem },
    { href: localeHref(locale, ROUTES.about), label: t.common.nav.about },
    { href: localeHref(locale, ROUTES.contact), label: t.common.nav.contact },
  ];
  const contactHref = localeHref(locale, ROUTES.contact);

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link href={localeHref(locale)} className={styles.logoLink} aria-label={`UNIVO — ${t.common.nav.home}`}>
          <Logo title={null} className={styles.logo} />
        </Link>

        <nav className={styles.nav} aria-label={t.common.nav.label}>
          <NavLinks items={nav} listClassName={styles.navList} linkClassName={styles.navLink} />
        </nav>

        <div className={styles.tools}>
          <LocaleSwitcher locale={locale as Locale} label={t.common.locale.label} />
        </div>

        <ButtonLink href={contactHref} size="sm" className={styles.cta}>
          {t.common.cta.discuss}
        </ButtonLink>

        <div className={styles.menuSlot}>
          <MobileMenu
            locale={locale}
            nav={[{ href: localeHref(locale), label: t.common.nav.home }, ...nav]}
            labels={{
              open: t.common.menu.open,
              close: t.common.menu.close,
              title: t.common.menu.title,
              navLabel: t.common.nav.label,
              locale: t.common.locale.label,
              group: t.common.group.heading,
              groupCurrent: t.common.group.current,
              cta: t.common.cta.discuss,
            }}
            contactHref={contactHref}
            groupItems={groupItems}
          />
        </div>
      </div>
    </header>
  );
}
