import type { CSSProperties } from "react";

import AccentPicker from "./AccentPicker";
import { entropyBits, entropyStrength } from "../lib/passphrase";
import { MAX_WORDS, MIN_WORDS } from "../../shared/passphrase";
import ui from "../styles/ui.module.css";
import styles from "./SettingsPanel.module.css";

const HINTS = {
  weak: "Add a word or two to make it much harder to guess.",
  fair: "Good. One more word makes it strong.",
  strong: "Strong enough for most accounts.",
} as const;

interface SettingsPanelProps {
  wordCount: number;
  onWordCountChange: (wordCount: number) => void;
}

const SettingsPanel = ({
  wordCount,
  onWordCountChange,
}: SettingsPanelProps) => {
  const bits = entropyBits(wordCount);
  const strength = entropyStrength(bits);
  // One segment per allowed word count, filled up to the current count
  const segments = Array.from({ length: MAX_WORDS }, (_, i) => i + 1);

  return (
    <section className={styles.panel} aria-labelledby="settings-title">
      <h2 id="settings-title" className={ui.label}>
        Settings
      </h2>

      <div className={styles.row}>
        <span id="word-count-label" className={styles.rowLabel}>
          Words
        </span>
        <div
          role="group"
          aria-labelledby="word-count-label"
          className={styles.stepper}
        >
          <button
            type="button"
            className={styles.step}
            aria-label="Fewer words"
            disabled={wordCount <= MIN_WORDS}
            onClick={() => {
              onWordCountChange(wordCount - 1);
            }}
          >
            −
          </button>
          <output className={styles.count} aria-live="polite">
            {wordCount}
          </output>
          <button
            type="button"
            className={styles.step}
            aria-label="More words"
            disabled={wordCount >= MAX_WORDS}
            onClick={() => {
              onWordCountChange(wordCount + 1);
            }}
          >
            +
          </button>
        </div>
      </div>

      <div className={`${styles.strength} ${styles[strength]}`}>
        <div className={styles.row}>
          <span className={styles.rowLabel}>Strength</span>
          <span className={styles.bits}>
            {`${bits.toFixed(1)} bits · ${strength}`}
          </span>
        </div>
        <div
          className={styles.meter}
          style={{ "--segments": MAX_WORDS } as CSSProperties}
          aria-hidden="true"
        >
          {segments.map((count) => (
            <span
              key={count}
              className={`${styles.segment} ${count <= wordCount ? styles.filled : ""}`}
            />
          ))}
        </div>
        <p className={styles.hint}>{HINTS[strength]}</p>
      </div>

      <div className={styles.row}>
        {/* The picker's own legend names it for screen readers */}
        <span className={styles.rowLabel} aria-hidden="true">
          Theme
        </span>
        <AccentPicker />
      </div>
    </section>
  );
};

export default SettingsPanel;
