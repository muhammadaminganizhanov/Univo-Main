import { Icon } from "@univo/ui";
import type { CSSProperties } from "react";
import type { LocaleContext } from "@/i18n";
import styles from "./Parts.module.css";

/** «Работа сделана, когда ею можно пользоваться» — the point lands on the ground line. */
export function Result({ ctx }: { ctx: LocaleContext }) {
  const r = ctx.t.about.result;
  return (
    <section className={styles.result} data-surface="white" data-scene="result" aria-labelledby="about-result">
      <div className="container">
        <h2 id="about-result" className={styles.statement}>
          {r.statement}
        </h2>
        <div className={styles.landing}>
          <span className={styles.drop} aria-hidden="true" />
          <ul role="list" className={styles.uses}>
            {r.examples.map((ex) => (
              <li key={ex}>{ex}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/**
 * Signature 4 — qualification in elevation. A business enters as a ring, passes four gates (the brand
 * arch) and becomes a floor of UNIVO. Where supported, the point travels with the scroll; otherwise it
 * simply stands at the end (the final state).
 */
export function Qualification({ ctx }: { ctx: LocaleContext }) {
  const { t } = ctx;
  const j = t.about.join;
  const q = t.v2.qualification;
  const gates = j.items.length;
  return (
    <section className={styles.qual} data-surface="ink" data-scene="qualification" aria-labelledby="about-join">
      <div className="container">
        <div className={styles.qualHead}>
          <h2 id="about-join" className="t-h1">
            {q.title}
          </h2>
          <p className={`t-lead ${styles.qualLead}`}>{q.lead}</p>
        </div>
        <div className={styles.path} style={{ "--gates": gates } as CSSProperties}>
          <span className={styles.track} aria-hidden="true" />
          <span className={styles.traveler} aria-hidden="true" />
          <ol role="list" className={styles.stops}>
            <li className={`${styles.stop} ${styles.start}`}>
              <span className={styles.mark} aria-hidden="true">
                <span className={styles.ring} />
              </span>
              <span className={styles.stopWord}>{j.start}</span>
            </li>
            {j.items.map((g, i) => (
              <li key={g.title} className={styles.stop} style={{ "--at": (1 + 2 * i) / (1 + 2 * gates) } as CSSProperties}>
                <span className={styles.mark} aria-hidden="true">
                  <span className={styles.gate} />
                </span>
                <span className={styles.gateNum}>
                  {t.v2.about.gate} {i + 1}
                </span>
                <h3 className={styles.stopWord}>{g.title}</h3>
                <p className={styles.stopText}>{g.text}</p>
              </li>
            ))}
            <li className={`${styles.stop} ${styles.end}`}>
              <span className={styles.mark} aria-hidden="true">
                <span className={styles.floor} />
                <span className={styles.pass} />
              </span>
              <span className={styles.stopWord}>{j.pass}</span>
            </li>
          </ol>
        </div>
        <p className={styles.exit}>
          <span className={styles.exitMark} aria-hidden="true" />
          <span>
            <span className={styles.exitLabel}>{t.v2.about.exit}</span>
            {j.fail}
          </span>
        </p>
      </div>
    </section>
  );
}

/** The five standards as a specification: standard · rule · how it is checked. */
export function Standards({ ctx }: { ctx: LocaleContext }) {
  const { t } = ctx;
  const s = t.about.standards;
  return (
    <section className={styles.standards} data-surface="white" aria-labelledby="about-standards">
      <div className="container">
        <div className={styles.stdHead}>
          <h2 id="about-standards" className="t-h1">
            {s.title}
          </h2>
          <p className={`t-lead ${styles.stdLead}`}>{s.lead}</p>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th scope="col">
                <span className="visually-hidden">{t.v2.ecosystem.specNo}</span>
              </th>
              <th scope="col">{t.v2.about.standard}</th>
              <th scope="col">{t.standardsLabels.rule}</th>
              <th scope="col">{t.standardsLabels.check}</th>
            </tr>
          </thead>
          <tbody>
            {t.standards.map((st, i) => (
              <tr key={st.title}>
                <td className={styles.no}>{String(i + 1).padStart(2, "0")}</td>
                <th scope="row" className={styles.std}>
                  {st.title}
                </th>
                <td data-label={t.standardsLabels.rule}>{st.text}</td>
                <td data-label={t.standardsLabels.check} className={styles.check}>
                  <span className={styles.tick} aria-hidden="true">
                    <Icon name="check" size={14} />
                  </span>
                  {st.check}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/** How UNIVO thinks and speaks: what it is, and the neighbouring word it is not. */
export function Character({ ctx }: { ctx: LocaleContext }) {
  const c = ctx.t.about.character;
  return (
    <section className={styles.character} data-surface="paper" aria-labelledby="about-character">
      <div className="container">
        <h2 id="about-character" className={`t-h1 ${styles.charTitle}`}>
          {c.title}
        </h2>
        <dl className={styles.traits}>
          {c.items.map(([is, isNot]) => (
            <div key={is} className={styles.trait}>
              <dt>{is}</dt>
              <dd>
                {c.not} {isNot}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
