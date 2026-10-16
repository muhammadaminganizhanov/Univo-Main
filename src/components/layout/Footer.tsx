import { CONTACTS, LEGAL, LOCALE_META } from "@univo/config";
import { Logo } from "@univo/brand";
import { STATUS_SHORT, getMembers, pick } from "@univo/content";
import { Dot } from "@univo/ui";
import Link from "next/link";
import { format, type LocaleContext } from "@/i18n";
import { resolveEntityLink } from "@/lib/entities";
import { ROUTES, localeHref } from "@/lib/routes";
import styles from "./Footer.module.css";
import { LocaleSwitcher } from "./LocaleSwitcher";

/** Masterbrand footer: the end of the route. UNIVO's own contact only — directions keep theirs. */
export function Footer({ ctx }: { ctx: LocaleContext }) {
  const { t, locale } = ctx;
  const own = CONTACTS.univo;
  const year = new Date().getFullYear();

  return (
    <footer
      className={styles.footer}
      data-surface="ink"
      data-scene="end"
      lang={ctx.contentLang === LOCALE_META[locale].htmlLang ? undefined : ctx.contentLang}
    >
      <div className="container">
        <div className={`grid ${styles.map}`}>
          <nav className={styles.col} aria-labelledby="footer-nav">
            <p id="footer-nav" className={`t-meta ${styles.heading}`}>
              {t.common.footer.navTitle}
            </p>
            <ul role="list">
              {(
                [
                  ["home", ROUTES.home],
                  ["ecosystem", ROUTES.ecosystem],
                  ["about", ROUTES.about],
                  ["contact", ROUTES.contact],
                ] as const
              ).map(([key, path]) => (
                <li key={key}>
                  <Link className={styles.link} href={localeHref(locale, path)}>
                    {t.common.nav[key]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className={`${styles.col} ${styles.wide}`} aria-labelledby="footer-ecosystem">
            <p id="footer-ecosystem" className={`t-meta ${styles.heading}`}>
              {t.common.footer.ecosystemTitle}
            </p>
            <ul role="list">
              {getMembers().map((e) => {
                const link = resolveEntityLink(e, locale, t);
                const soon = STATUS_SHORT[e.status];
                return (
                  <li key={e.id} data-entity={e.id}>
                    <Link
                      className={styles.link}
                      href={link.available ? link.href : `${localeHref(locale, ROUTES.ecosystem)}#${e.slug}`}
                    >
                      <Dot size={8} color="var(--entity-accent)" state={e.status === "live" ? "filled" : "ring"} />
                      <span>{e.name}</span>
                      {soon ? <span className={styles.soonTag}>{pick(soon, locale)}</span> : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className={styles.col}>
            <p className={`t-meta ${styles.heading}`}>{t.common.footer.contactTitle}</p>
            <ul role="list">
              <li>
                <Link className={styles.link} href={localeHref(locale, ROUTES.contact)}>
                  {t.common.footer.contactForm}
                </Link>
              </li>
              {own.email ? (
                <li>
                  <a className={styles.link} href={`mailto:${own.email}`}>
                    {own.email}
                  </a>
                </li>
              ) : null}
              {own.phone ? (
                <li>
                  <a className={styles.link} href={`tel:${own.phone.replace(/[^\d+]/g, "")}`}>
                    {own.phone}
                  </a>
                </li>
              ) : null}
            </ul>
          </div>

          <div className={styles.col}>
            <p className={`t-meta ${styles.heading}`} aria-hidden="true">
              {t.common.footer.languagesTitle}
            </p>
            <LocaleSwitcher
              locale={locale}
              label={t.common.footer.languagesTitle}
              names="native"
              className={styles.list}
              linkClassName={styles.link}
            />
          </div>
        </div>

        {/* The logo closes the page quietly; on Home it shares one line with the copyright. */}
        <div className={styles.base}>
          <div className={styles.ending}>
            <Logo title="UNIVO" className={styles.wordmark} />
          </div>

          <div className={`t-meta ${styles.bottom}`}>
            <p>
              {format(t.common.footer.copyright, { year })}
              {LEGAL.legalName ? ` · ${LEGAL.legalName}` : null}
            </p>
            {LEGAL.privacyPolicyUrl || LEGAL.termsUrl ? (
              <ul role="list" className={styles.legal}>
                {LEGAL.privacyPolicyUrl ? (
                  <li>
                    <a href={LEGAL.privacyPolicyUrl}>{t.common.footer.privacy}</a>
                  </li>
                ) : null}
                {LEGAL.termsUrl ? (
                  <li>
                    <a href={LEGAL.termsUrl}>{t.common.footer.terms}</a>
                  </li>
                ) : null}
              </ul>
            ) : null}
          </div>
        </div>
      </div>
    </footer>
  );
}
