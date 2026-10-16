import { getProducts, getServices } from "@univo/content";
import type { CSSProperties } from "react";
import type { LocaleContext } from "@/i18n";
import styles from "./Checks.module.css";

/**
 * Signature 2 — the standards as a structural rule. Choose one standard: it becomes an axis that
 * starts at the UNIVO point and passes through every part of the group, the next one included. Each
 * part is a node on that axis and confirms the rule by its state — no checklist, no panel. Above the
 * axis the rule, below it how the rule is checked. CSS only (radios + :has). Desktop: selector left,
 * a free composition right. Phones: an accordion — the same composition, the axis turned vertical.
 */
export function Checks({ ctx }: { ctx: LocaleContext }) {
  const { t } = ctx;
  const s = t.home.system;
  const parts = [...getServices(), ...getProducts()];
  const list = t.standards;
  const css = list
    .map(
      (_, i) =>
        `#checks:has(#std-${i}:checked){--sel:${i}}` +
        `#checks:has(#std-${i}:checked) [data-panel="${i}"]{display:grid}#checks:has(#std-${i}:checked) [data-opt="${i}"]{--on:1}`,
    )
    .join("");

  return (
    <section id="checks" className={styles.section} data-surface="white" data-scene="standards" aria-labelledby="home-standards">
      <style>{css}</style>
      <div className="container">
        <div className={styles.head}>
          <h2 id="home-standards" className={styles.title} data-reveal>
            {s.statement}
          </h2>
          <p className={styles.lead}>{s.caption}</p>
        </div>

        <fieldset className={styles.board}>
          <legend className="visually-hidden">{s.choose}</legend>
          {/* desktop: one UNIVO point that travels to the chosen standard */}
          <span className={styles.marker} aria-hidden="true" />
          {list.map((st, i) => (
            <div key={st.title} className={styles.slot} style={{ "--i": i } as CSSProperties}>
              <input type="radio" name="standard" id={`std-${i}`} className={styles.radio} defaultChecked={i === 0} />
              <label htmlFor={`std-${i}`} className={styles.option} data-opt={i}>
                <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
                <span className={styles.optName}>{st.title}</span>
                <span className={styles.point} aria-hidden="true" />
              </label>
              <div className={styles.panel} data-panel={i}>
                <div className={styles.rule}>
                  <p className={styles.label}>{t.standardsLabels.rule}</p>
                  <p className={styles.ruleText}>{st.text}</p>
                </div>

                <div className={styles.applies}>
                  <p className="visually-hidden">{s.applies}</p>
                  <ol role="list" className={styles.axis}>
                    <li className={styles.origin}>
                      <span className={styles.originPoint} aria-hidden="true" />
                      <span className={styles.originName}>{st.title}</span>
                    </li>
                    {parts.map((e, k) => (
                      <li key={e.id} className={styles.part} style={{ "--c": `var(${e.accent})`, "--k": k + 1 } as CSSProperties}>
                        <span className={styles.node} data-state={e.status === "live" ? "live" : "launching"} aria-hidden="true" />
                        <span className={styles.partName} translate="no">
                          <span className="visually-hidden">UNIVO </span>
                          {e.word}
                          <span className="visually-hidden"> — {s.passes}</span>
                        </span>
                      </li>
                    ))}
                    <li className={`${styles.part} ${styles.nextPart}`} style={{ "--k": parts.length + 1 } as CSSProperties}>
                      <span className={styles.node} data-state="next" aria-hidden="true" />
                      <span className={styles.partName}>
                        {s.next}
                        <span className="visually-hidden"> — {s.passes}</span>
                      </span>
                    </li>
                  </ol>
                </div>

                <div className={styles.check}>
                  <p className={styles.label}>{t.standardsLabels.check}</p>
                  <p className={styles.checkText}>{st.check}</p>
                </div>
              </div>
            </div>
          ))}
        </fieldset>
      </div>
    </section>
  );
}
