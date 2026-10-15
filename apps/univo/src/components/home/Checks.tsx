import { getProducts, getServices } from "@univo/content";
import { Icon } from "@univo/ui";
import type { CSSProperties } from "react";
import type { LocaleContext } from "@/i18n";
import styles from "./Checks.module.css";

/**
 * Signature 2 — the standards as operating checks. Choose one standard; the panel shows its rule, how
 * it is checked, and the check applied to every part of the group at once — including the next one.
 * CSS only (radios + :has). Desktop: selector left, one panel right. Phones: an accordion — the panel
 * opens under the chosen standard.
 */
export function Checks({ ctx }: { ctx: LocaleContext }) {
  const { t } = ctx;
  const s = t.home.system;
  const parts = [...getServices(), ...getProducts()];
  const list = t.standards;
  const css = list
    .map((_, i) => `#checks:has(#std-${i}:checked) [data-panel="${i}"]{display:grid}#checks:has(#std-${i}:checked) [data-opt="${i}"]{--on:1}`)
    .join("");

  return (
    <section id="checks" className={styles.section} data-surface="white" data-scene="standards" aria-labelledby="home-standards">
      <style>{css}</style>
      <div className="container">
        <div className={styles.head}>
          <h2 id="home-standards" className={styles.title}>
            {s.statement}
          </h2>
          <p className={styles.lead}>{s.caption}</p>
        </div>

        <fieldset className={styles.board}>
          <legend className="visually-hidden">{s.choose}</legend>
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
                <div className={styles.check}>
                  <p className={styles.label}>{t.standardsLabels.check}</p>
                  <p className={styles.checkText}>
                    <span className={styles.tick} aria-hidden="true">
                      <Icon name="check" size={14} />
                    </span>
                    {st.check}
                  </p>
                </div>
                <div className={styles.applies}>
                  <p className={styles.label}>{s.applies}</p>
                  <ul role="list" className={styles.parts}>
                    {parts.map((e, k) => (
                      <li key={e.id} className={styles.part} style={{ "--c": `var(${e.accent})`, "--k": k } as CSSProperties}>
                        <span className={styles.node} data-state={e.status === "live" ? "live" : "launching"} aria-hidden="true" />
                        <span className={styles.partName} translate="no">
                          {e.name}
                        </span>
                        <span className={styles.mark}>
                          <Icon name="check" size={12} />
                          <span className="visually-hidden">{s.passes}</span>
                        </span>
                      </li>
                    ))}
                    <li className={`${styles.part} ${styles.nextPart}`} style={{ "--k": parts.length } as CSSProperties}>
                      <span className={styles.node} data-state="next" aria-hidden="true" />
                      <span className={styles.partName}>{s.next}</span>
                      <span className={styles.mark}>
                        <Icon name="check" size={12} />
                        <span className="visually-hidden">{s.passes}</span>
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </fieldset>
      </div>
    </section>
  );
}
