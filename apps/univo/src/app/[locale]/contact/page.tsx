import { CONTACTS, hasAnyChannel } from "@univo/config";
import { getMembers, getPrelaunchProducts } from "@univo/content";
import { INTERESTS } from "@univo/leads";
import { ArrowLink } from "@univo/ui";
import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/ContactForm";
import { showStagingNote } from "@/lib/delivery";
import { resolveEntityLink } from "@/lib/entities";
import { resolveLocale } from "@/lib/params";
import { ROUTES } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";
import { groupLevels } from "@/v2/group";
import { Model } from "@/v2/Model";
import styles from "@/v2/contact/Contact.module.css";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ direction?: string | string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { t, locale } = await resolveLocale(params);
  return pageMetadata({ locale, path: ROUTES.contact, title: t.meta.contact.title, description: t.meta.contact.description });
}

/**
 * The entrance. The form stands inside the brand arch on the ground line — one way into the group.
 * Beside it, the building in miniature: choosing a direction lights its floor (CSS :has, no JS);
 * «Пусть UNIVO определит» keeps the route on the masterbrand floor.
 */
export default async function ContactPage({ params, searchParams }: Props) {
  const ctx = await resolveLocale(params);
  const { t, locale } = ctx;
  const { direction } = await searchParams;
  const preselect = typeof direction === "string" && (INTERESTS as readonly string[]).includes(direction) ? direction : "unsure";
  const own = CONTACTS.univo;
  const c = t.contact;
  const members = getMembers();

  // One rule per choice: the chosen floor takes its colour, the rest of the building steps back.
  const pick = (v: string) => `#contact:has(input[name="interest"][value="${v}"]:checked)`;
  const route = [
    ...members.map(
      (e) =>
        `${pick(e.id)} [data-slab="${e.id}"] polygon:nth-of-type(3){fill:color-mix(in srgb,var(${e.accent}) 22%,var(--univo-brand-white))}` +
        `${pick(e.id)} [data-node="${e.id}"]{transform:scale(1.5)}` +
        `${pick(e.id)} [data-slab]:not([data-slab="${e.id}"]):not([data-level="master"]){opacity:.4}` +
        `${pick(e.id)} [data-for="${e.id}"]{display:inline}`,
    ),
    `${pick("unsure")} [data-level="master"] polygon:nth-of-type(3){fill:color-mix(in srgb,var(--accent-univo) 16%,var(--univo-brand-white))}`,
    `${pick("unsure")} [data-for="unsure"]{display:inline}`,
  ].join("");

  return (
    <div id="contact" className={styles.page} data-surface="paper">
      <style>{route}</style>
      <div className={`container ${styles.layout}`}>
        <section className={styles.entrance} aria-labelledby="page-title">
          <div className={styles.arch}>
            <header className={styles.head}>
              <h1 id="page-title" className={styles.title}>
                {c.hero.title}
                <span className="brand-dot" aria-hidden="true">
                  .
                </span>
              </h1>
              <p className={`t-lead ${styles.lead}`}>{c.hero.lead}</p>
            </header>
            <ContactForm labels={t.forms} groups={c.groups} locale={locale} defaultInterest={preselect} staging={showStagingNote()} />
          </div>
          <span className={styles.ground} aria-hidden="true" />
        </section>

        <aside className={styles.aside} aria-labelledby="contact-route">
          <section className={styles.destination}>
            <h2 id="contact-route" className={styles.asideTitle}>
              {t.v2.contact.model}
            </h2>
            <div className={styles.mini}>
              <Model id="model-contact" variant="mini" levels={groupLevels()} callouts={[]} label={t.v2.contact.model} />
            </div>
            <p className={styles.now} aria-hidden="true">
              <span className={styles.nowLabel}>{t.v2.contact.now}</span>{" "}
              {members.map((e) => (
                <span key={e.id} data-for={e.id} className={styles.choice}>
                  {e.name}
                </span>
              ))}
              <span data-for="unsure" className={styles.choice}>
                {c.route.decide}
              </span>
            </p>
            <ol role="list" className={styles.steps}>
              {c.route.steps.map((s, i) => (
                <li key={s}>
                  <span className={styles.stepNum}>{String(i + 1).padStart(2, "0")}</span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
          </section>
        </aside>

        <div className={styles.more}>
          <section aria-labelledby="contact-products" className={styles.products}>
            <h2 id="contact-products" className={styles.asideTitle}>
              {c.products.title}
            </h2>
            <p className={styles.small}>{c.products.text}</p>
            <ul role="list">
              {getPrelaunchProducts().map((e) => (
                <li key={e.id}>
                  <ArrowLink href={resolveEntityLink(e, locale, t).href}>{e.name}</ArrowLink>
                </li>
              ))}
            </ul>
          </section>

          {hasAnyChannel(own) ? (
            <section aria-labelledby="contact-direct">
              <h2 id="contact-direct" className={styles.asideTitle}>
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
        </div>
      </div>
    </div>
  );
}
