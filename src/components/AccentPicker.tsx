import { useState } from "react";

import {
  ACCENTS,
  ACCENT_LABELS,
  applyAccent,
  readStoredAccent,
  storeAccent,
  type Accent,
} from "../lib/accent";
import styles from "./AccentPicker.module.css";

/** Three accent swatches; the choice is applied and saved immediately. */
const AccentPicker = () => {
  const [accent, setAccent] = useState<Accent>(readStoredAccent);

  const choose = (next: Accent) => {
    setAccent(next);
    applyAccent(next);
    storeAccent(next);
  };

  return (
    <fieldset className={styles.picker}>
      <legend className="visually-hidden">Accent color</legend>
      {ACCENTS.map((value) => (
        <label
          key={value}
          className={styles.option}
          title={ACCENT_LABELS[value]}
        >
          <input
            type="radio"
            name="accent"
            value={value}
            checked={accent === value}
            onChange={() => {
              choose(value);
            }}
            className={styles.radio}
            aria-label={ACCENT_LABELS[value]}
          />
          <span className={`${styles.swatch} ${styles[value]}`} />
        </label>
      ))}
    </fieldset>
  );
};

export default AccentPicker;
