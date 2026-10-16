import { CONTACTS, hasAnyChannel } from "@univo/config";
import { getMembers, getPrelaunchProducts, pick } from "@univo/content";
import { INTERESTS } from "@univo/leads";
import { ArrowLink, Lines } from "@univo/ui";
import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { ContactForm } from "@/components/forms/ContactForm";
import { showStagingNote } from "@/lib/delivery";
import { resolveEntityLink } from "@/lib/entities";
import { resolveLocale } from "@/lib/params";
import { ROUTES, localeHref } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";
import { pageGraph } from "@/lib/structured-data";
import { JsonLd } from "@/components/seo/JsonLd";
import styles from "./contact.module.css";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ direction?: string | string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { t, locale } = await resolveLocale(params);
  return pageMetadata({ locale, path: ROUTES.contact, title: t.meta.contact.title, description: t.meta.contact.description });
}

/**
 * The quick way into UNIVO: say what needs doing, leave a way to reply. Beside the form, one small
 * route preview — task → UNIVO → open, until a direction is chosen; then that part, and only it
 * (CSS :has(), no JS). Product early access sits below, secondary.
 */
export default async function ContactPage({ params, searchParams }: Props) {
  const ctx = await resolveLocale(params);
  const { t, locale } = ctx;
  const { direction } = await searchParams;
  const preselect = typeof direction === "string" && (INTERESTS as readonly string[]).includes(direction) ? direction : "unsure";
  const own = CONTACTS.univo;
  const c = t.contact;
  const members = getMembers();

  return (
    <div className={styles.page} data-surface="paper">
      <JsonLd graph={pageGraph({ locale, t, path: ROUTES.contact, title: t.meta.contact.title, description: t.meta.contact.description, crumb: t.common.nav.contact, type: "ContactPage" })} />
      <div className={`container ${styles.layout}`}>
        <header className={styles.head}>
          <h1 id="page-title" className={styles.title}>
            <Lines
              text={c.hero.title}
              after={
                <span className="brand-dot" aria-hidden="true">
                  .
                </span>
              }
            />
          </h1>
          <p className={styles.lead}>{c.hero.lead}</p>
        </header>

        <section className={styles.formCol} aria-labelledby="page-title">
          <ContactForm
            labels={t.forms}
            copy={c}
            locale={locale}
            defaultInterest={preselect}
            staging={showStagingNote()}
            homeHref={localeHref(locale, ROUTES.home)}
            parts={members.map((e) => ({ id: e.id, word: e.word ?? e.name, accent: e.accent }))}
          />
        </section>

        {/* what happens after sending: a mirror of the chosen direction, for sighted readers */}
        <div className={styles.preview} aria-hidden="true">
          <p className={styles.previewLabel}>{c.route.label}</p>
          <div className={styles.route}>
            <div className={styles.stop} data-stop="task">
              <span className={styles.taskNode} />
              <span className={styles.stopName}>{c.route.task}</span>
            </div>
            <div className={styles.stop} data-stop="univo">
              <span className={styles.univoNode} />
              <span className={styles.stopName} translate="no">
                UNIVO
              </span>
            </div>
            <div className={styles.to} data-to="unsure">
              <span className={styles.answer} />
              <span className={styles.openNode} />
              <span className={styles.toName} data-open="">
                {c.route.open}
              </span>
            </div>
            {members.map((e) => (
              <div key={e.id} className={styles.to} data-to={e.id} style={{ "--c": `var(${e.accent})` } as CSSProperties}>
                <span className={styles.answer} />
                <span className={styles.partNode} data-state={e.status === "live" ? "live" : "launching"} />
                <span className={styles.toName} translate="no">
                  {e.name}
                </span>
                <span className={styles.toRole}>{pick(e.role, locale)}</span>
              </div>
            ))}
          </div>
        </div>

        <section className={styles.more} aria-labelledby="contact-products">
          <h2 id="contact-products" className={styles.moreTitle}>
            {c.products.title}
          </h2>
          <ul role="list" className={styles.products}>
            {getPrelaunchProducts().map((e) => (
              <li key={e.id}>
                <ArrowLink href={resolveEntityLink(e, locale, t).href}>
                  <span translate="no">{e.name}</span> — {c.products.earlyAccess}
                </ArrowLink>
              </li>
            ))}
          </ul>
          {hasAnyChannel(own) ? (
            <div className={styles.direct}>
              <h2 className={styles.moreTitle}>{c.direct.title}</h2>
              <dl>
                {(["email", "phone", "telegram", "whatsapp", "city"] as const).map((k) =>
                  own[k] ? (
                    <div key={k}>
                      <dt>{c.direct[k]}</dt>
                      <dd>{own[k]}</dd>
                    </div>
                  ) : null,
                )}
              </dl>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
