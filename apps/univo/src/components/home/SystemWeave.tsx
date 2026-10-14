import { getMembers } from "@univo/content";
import { ButtonLink, Dot, Lines } from "@univo/ui";
import type { CSSProperties } from "react";
import { entityDot, entityState } from "@/components/system/GroupStroke";
import type { LocaleContext } from "@/i18n";
import { ROUTES, localeHref } from "@/lib/routes";
import styles from "./SystemWeave.module.css";

/**
 * Five strict axes. Each standard is one straight line that passes through every member's node and
 * runs on (dashed) into the next one. At rest the nodes are neutral; hovering or focusing a standard
 * lights every member in its own colour — the standard is shared, the members stay themselves.
 */
export function SystemWeave({ ctx }: { ctx: LocaleContext }) {
  const { t, locale } = ctx;
  const s = t.home.system;
  const members = getMembers();
  const cols = { "--_n": members.length } as CSSProperties;

  return (
    <section className={styles.section} data-surface="white" data-scene="standard" aria-labelledby="home-system">
      <div className={`container ${styles.grid}`}>
        <div className={styles.intro}>
          <h2 id="home-system" className={`t-statement ${styles.statement}`}>
            <Lines text={s.statement} />
          </h2>
          <p className={`t-lead ${styles.caption}`}>{s.caption}</p>
        </div>

        <ul role="list" className={styles.legend} style={cols} aria-hidden="true">
          {members.map((e) => (
            <li key={e.id} data-entity={e.id}>
              <Dot color={entityDot(e)} state={entityState(e)} size={10} />
              <span translate="no">{e.word}</span>
            </li>
          ))}
        </ul>

        <div className={styles.threads} style={cols} aria-hidden="true">
          {members.map((e) => (
            <span key={e.id} data-entity={e.id} />
          ))}
        </div>

        <ol role="list" className={styles.list}>
          {t.standards.map((st, i) => (
            <li key={st.title} className={styles.row} data-standard={i + 1}>
              <span className={`t-meta ${styles.num}`}>{String(i + 1).padStart(2, "0")}</span>
              <h3 className={styles.title}>{st.title}</h3>
              <p className={styles.text}>{st.text}</p>
              <p className={styles.check}>
                <span className="visually-hidden">{t.standardsLabels.check}: </span>
                {st.check}
              </p>
              <span className={styles.axis} style={cols} aria-hidden="true" data-route="standard">
                {members.map((e) => (
                  <span key={e.id} className={styles.node} data-entity={e.id} data-node={e.id} />
                ))}
              </span>
            </li>
          ))}
        </ol>

        <div className={styles.more}>
          <ButtonLink href={localeHref(locale, ROUTES.about)} variant="secondary" icon="arrowRight">
            {s.more}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
