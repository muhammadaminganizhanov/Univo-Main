import { Symbol } from "@univo/brand";
import { getMembers, pick } from "@univo/content";
import { Dot, Icon, Lines } from "@univo/ui";
import type { Metadata } from "next";
import styles from "@/components/about/About.module.css";
import { EndCta } from "@/components/shared/EndCta";
import { resolveLocale, type LocaleParams } from "@/lib/params";
import { ROUTES, localeHref } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { t, locale } = await resolveLocale(params);
  return pageMetadata({ locale, path: ROUTES.about, title: t.meta.about.title, description: t.meta.about.description });
}

/**
 * About as a narrative, not a document:
 * identity (Ink) → statement + notes → different/shared → the result (quiet, huge) →
 * standards as a spec → qualification path (Ink) → character → end.
 */
export default async function AboutPage({ params }: LocaleParams) {
  const { t, locale } = await resolveLocale(params);
  const a = t.about;
  const members = getMembers();

  return (
    <>
      <section className={styles.hero} data-surface="ink" data-scene="identity" aria-labelledby="page-title">
        <div className={`container ${styles.heroGrid}`}>
          <h1 id="page-title" className="t-display">
            <span className={styles.heroTitle}>
              <Lines text={a.hero.title} />
            </span>
          </h1>
          <p className={`t-lead ${styles.heroLead}`}>{a.hero.lead}</p>
        </div>
        <Symbol title={null} className={styles.symbol} />
      </section>

      <section className={styles.identity} data-surface="paper" aria-labelledby="about-identity">
        <div className="container">
          <h2 id="about-identity" className={`t-statement ${styles.statement}`}>
            {a.identity.statement}
          </h2>
          <ul role="list" className={styles.notes}>
            {a.identity.notes.map((n) => (
              <li key={n} className={styles.note}>
                {n}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={styles.why} data-surface="white" data-scene="merge" aria-labelledby="about-why">
        <div className="container">
          <h2 id="about-why" className={`t-statement ${styles.whyTitle}`}>
            {a.why.title}
          </h2>
          <div className={styles.merge} data-route="merge">
            <p className={`t-meta ${styles.mergeLabel}`}>{a.why.differs}</p>
            <ul role="list" className={styles.lanes}>
              {members.map((e) => (
                <li key={e.id} className={styles.lane} data-entity={e.id} data-segment={e.id}>
                  <span className={styles.laneName}>
                    <span translate="no">{e.name}</span>
                  </span>
                  <span className={styles.laneRole}>{pick(e.role, locale)}</span>
                  <span className={styles.laneLine} aria-hidden="true" data-draw="" />
                </li>
              ))}
            </ul>
            <span className={styles.joint} aria-hidden="true" data-node="joint" />
            <div className={styles.shared}>
              <p className="t-meta">{a.why.shared}</p>
              <p className={styles.sharedText}>{a.why.sharedText}</p>
              <span className={styles.sharedStroke} aria-hidden="true" data-route="shared" data-draw="" />
              <p className={`t-lead ${styles.whyNote}`}>{a.why.note}</p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.result} data-surface="paper" data-scene="result" aria-labelledby="about-result">
        <div className="container">
          <h2 id="about-result" className={`t-display ${styles.resultStatement}`}>
            {a.result.statement}
            <span className="brand-dot" aria-hidden="true">
              .
            </span>
          </h2>
          <ul role="list" className={`t-lead ${styles.examples}`}>
            {a.result.examples.map((ex) => (
              <li key={ex}>{ex}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className={styles.spec} data-surface="white" aria-labelledby="about-standards">
        <div className="container">
          <div className={styles.specHead}>
            <h2 id="about-standards" className="t-statement">
              {a.standards.title}
            </h2>
            <p className="t-lead">{a.standards.lead}</p>
          </div>
          <ol role="list" className={styles.ops}>
            {t.standards.map((st, i) => (
              <li key={st.title} className={styles.op} data-standard={i + 1}>
                <div className={styles.opName}>
                  <span className="t-meta">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className={styles.specWord}>{st.title}</h3>
                </div>
                <div className={styles.opStep} data-step="rule">
                  <span className="t-meta">{t.standardsLabels.rule}</span>
                  <p>{st.text}</p>
                </div>
                <div className={styles.opStep} data-step="check">
                  <span className={styles.opCheck} aria-hidden="true">
                    <Icon name="check" size={14} />
                  </span>
                  <span className="t-meta">{t.standardsLabels.check}</span>
                  <p className={styles.opCheckText}>{st.check}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={styles.join} data-surface="ink" data-scene="qualification" aria-labelledby="about-join">
        <div className="container">
          <div className={styles.joinHead}>
            <h2 id="about-join" className="t-statement">
              {a.join.title}
            </h2>
            <p className="t-lead">{a.join.lead}</p>
          </div>
          <ol role="list" className={styles.path} data-route="qualification">
            <li className={styles.pathStep}>
              <span className={styles.pathNode} aria-hidden="true">
                <Dot color="var(--color-fg)" state="ring" size={22} node="start" />
              </span>
              <span className={styles.endWord}>{a.join.start}</span>
            </li>
            {a.join.items.map((item, i) => (
              <li key={item.title} className={styles.pathStep} data-gate={i + 1}>
                <span className={styles.gate} aria-hidden="true" />
                <h3 className={styles.pathTitle}>{item.title}</h3>
                <p className={styles.pathText}>{item.text}</p>
              </li>
            ))}
            <li className={styles.pathStep}>
              <span className={styles.pathNode} aria-hidden="true">
                <Dot color="var(--accent-univo)" size={22} node="univo" />
              </span>
              <span className={styles.endWord}>{a.join.pass}</span>
            </li>
          </ol>
          <p className={styles.fail}>
            <span className={styles.failMark} aria-hidden="true" />
            <span>{a.join.fail}</span>
          </p>
        </div>
      </section>

      <section className={styles.character} data-surface="paper" aria-labelledby="about-character">
        <div className="container">
          <h2 id="about-character" className={`t-statement ${styles.characterTitle}`}>
            {a.character.title}
          </h2>
          <dl className={styles.traits}>
            {a.character.items.map(([is, isNot]) => (
              <div key={is} className={styles.trait}>
                <dt>{is}</dt>
                <dd>
                  <span className="visually-hidden">{a.character.not} </span>
                  <s>{isNot}</s>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <EndCta title={t.end.title} body={t.end.body} href={localeHref(locale, ROUTES.contact)} action={t.common.cta.discuss} />
    </>
  );
}
