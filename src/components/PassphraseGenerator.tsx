import { useState } from "react";

import CopyButton from "./CopyButton";
import MnemonicPanel from "./MnemonicPanel";
import SettingsPanel from "./SettingsPanel";
import WordList from "./WordList";
import { RefreshIcon } from "./icons";
import { DEFAULT_MNEMONIC_CHOICE, type MnemonicChoice } from "./mnemonicModes";
import { useMnemonic } from "../clients/mnemonic";
import { useDebouncedCallback } from "../hooks/useDebouncedCallback";
import { generatePassphrase } from "../lib/passphrase";
import { DEFAULT_WORDS } from "../../shared/passphrase";
import type { AiMode } from "../../shared/api";
import ui from "../styles/ui.module.css";
import styles from "./PassphraseGenerator.module.css";

/**
 * People often re-roll several times before settling on words they like, so
 * wait for a pause before paying for a mnemonic.
 */
export const MNEMONIC_DEBOUNCE_MS = 1000;

const PassphraseGenerator = () => {
  const [wordCount, setWordCount] = useState(DEFAULT_WORDS);
  const [passphrase, setPassphrase] = useState(() =>
    generatePassphrase(DEFAULT_WORDS),
  );
  const [choice, setChoice] = useState<MnemonicChoice>(DEFAULT_MNEMONIC_CHOICE);

  const { mnemonic, error, isLoading, generate, reset } = useMnemonic();
  const debounced = useDebouncedCallback((words: string, mode: AiMode) => {
    void generate(words, mode);
  }, MNEMONIC_DEBOUNCE_MS);

  const roll = (count: number) => {
    const next = generatePassphrase(count);
    setPassphrase(next);
    if (choice !== "off") {
      reset();
      debounced.run(next, choice);
    }
  };

  const changeWordCount = (count: number) => {
    setWordCount(count);
    roll(count);
  };

  const changeChoice = (next: MnemonicChoice) => {
    setChoice(next);
    debounced.cancel();
    if (next === "off") {
      reset();
    } else {
      void generate(passphrase, next);
    }
  };

  const newMnemonic = () => {
    if (choice === "off") return;
    debounced.cancel();
    void generate(passphrase, choice);
  };

  return (
    <div className={styles.layout}>
      <section className={styles.words} aria-labelledby="passphrase-title">
        <h2 id="passphrase-title" className={ui.label}>
          Your passphrase
        </h2>
        <WordList words={passphrase.split(" ")} labelledBy="passphrase-title" />
        <div className={styles.actions}>
          <button
            type="button"
            className={ui.primary}
            onClick={() => {
              roll(wordCount);
            }}
          >
            <RefreshIcon />
            New passphrase
          </button>
          <CopyButton textToCopy={passphrase} ariaLabel="Copy passphrase" />
        </div>
      </section>

      <aside className={styles.aside} aria-label="Settings and mnemonic">
        <SettingsPanel
          wordCount={wordCount}
          onWordCountChange={changeWordCount}
        />
        <MnemonicPanel
          choice={choice}
          onChoiceChange={changeChoice}
          mnemonic={mnemonic}
          error={error}
          isLoading={isLoading}
          isPending={debounced.isPending}
          onNewMnemonic={newMnemonic}
        />
      </aside>
    </div>
  );
};

export default PassphraseGenerator;
