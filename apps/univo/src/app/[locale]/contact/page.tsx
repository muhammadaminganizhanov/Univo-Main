import { CONTACTS, hasAnyChannel } from "@univo/config";
import { getMembers, getPrelaunchProducts } from "@univo/content";
import { INTERESTS } from "@univo/leads";
import { ArrowLink, Dot, Lines } from "@univo/ui";
import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/ContactForm";
import { entityState } from "@/components/system/GroupStroke";
import { showStagingNote } from "@/lib/delivery";
import { resolveEntityLink } from "@/lib/entities";
import { resolveLocale } from "@/lib/params";
import { ROUTES } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";
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
 * One point of entry. The form is the route in; the right column is the destination: UNIVO, then
 * the possible routes. Choosing a direction highlights it with CSS :has() — no JS required.
 */
export default async function ContactPage({ params, searchParams }: Props) {
  const ctx = await resolveLocale(params);
  const { t, locale } = ctx;
  const { direction } = await searchParams;
  const preselect = typeof direction === "string" && (INTERESTS as readonly string[]).includes(direction) ? direction : "unsure";
  const own = CONTACTS.univo;
  const c = t.contact;

  return (
    <div className={styles.page} data-surface="paper">
      <div className={`container ${styles.layout}`}>
        <header className={styles.head}>
          <h1 id="page-title" className="t-h1">
            <Lines
              text={c.hero.title}
              after={
                <span className="brand-dot" aria-hidden="true">
                  .
                </span>
              }
            />
          </h1>
          <p className={`t-lead ${styles.lead}`}>{c.hero.lead}</p>
        </header>

        <section className={styles.formCol} aria-labelledby="page-title">
          <ContactForm labels={t.forms} groups={c.groups} locale={locale} defaultInterest={preselect} staging={showStagingNote()} />
        </section>

        <aside className={styles.aside} aria-labelledby="contact-route">
          <section className={styles.destination}>
            <h2 id="contact-route" className="t-h3">
              {c.route.title}
            </h2>
            <ol role="list" className={styles.steps}>
              {c.route.steps.map((s, i) => (
                <li key={s}>
                  <span className="t-meta">{String(i + 1).padStart(2, "0")}</span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>

            <div className={styles.routes} data-route="preview">
              <p className={styles.hub}>
                <Dot color="var(--accent-univo)" size={16} node="univo" />
                <span>UNIVO</span>
              </p>
              <p className={`t-meta ${styles.routesLabel}`}>{c.route.routeLabel}</p>
              <ul role="list" className={styles.routeList}>
                {getMembers().map((e) => (
                  <li key={e.id} data-route-node={e.id} data-entity={e.id}>
                    <Dot color="var(--route-dot)" state={entityState(e)} size={12} />
                    {e.name}
                  </li>
                ))}
              </ul>
              <p className={`t-meta ${styles.decide}`}>{c.route.decide}</p>
            </div>
          </section>

          <section aria-labelledby="contact-products" className={styles.products}>
            <h2 id="contact-products" className="t-h3">
              {c.products.title}
            </h2>
            <p className="t-small">{c.products.text}</p>
            <ul role="list">
              {getPrelaunchProducts().map((e) => (
                <li key={e.id}>
                  <ArrowLink href={resolveEntityLink(e, locale).href}>{e.name}</ArrowLink>
                </li>
              ))}
            </ul>
          </section>

          {hasAnyChannel(own) ? (
            <section aria-labelledby="contact-direct">
              <h2 id="contact-direct" className="t-h3">
                {c.direct.title}
              </h2>
              <dl className={styles.direct}>
                {(["email", "phone", "telegram", "whatsapp", "city"] as const).map((k) =>
                  own[k] ? (
                    <div key={k}>
                      <dt>{c.direct[k]}</dt>
                      <dd>{own[k]}</dd>
                    </div>
                  ) : null,
                )}
              </dl>
            </section>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
