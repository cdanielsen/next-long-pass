import CopyButton from "./CopyButton";
import MnemonicErrorAlert from "./MnemonicErrorAlert";
import TypedPhrase from "./TypedPhrase";
import { RefreshIcon } from "./icons";
import {
  MNEMONIC_CHOICES,
  MNEMONIC_CHOICE_LABELS,
  type MnemonicChoice,
} from "./mnemonicModes";
import ui from "../styles/ui.module.css";
import styles from "./MnemonicPanel.module.css";

interface MnemonicPanelProps {
  choice: MnemonicChoice;
  onChoiceChange: (choice: MnemonicChoice) => void;
  mnemonic: string | null;
  error: Error | null;
  isLoading: boolean;
  /** Waiting for the user to stop re-rolling before requesting. */
  isPending: boolean;
  onNewMnemonic: () => void;
}

const MnemonicPanel = ({
  choice,
  onChoiceChange,
  mnemonic,
  error,
  isLoading,
  isPending,
  onNewMnemonic,
}: MnemonicPanelProps) => {
  const isOn = choice !== "off";

  const status = isPending
    ? "Mnemonic coming once you stop rolling…"
    : isLoading
      ? "Writing a mnemonic…"
      : null;

  return (
    <section className={styles.panel} aria-labelledby="mnemonic-title">
      <h2 id="mnemonic-title" className={ui.label}>
        AI mnemonic
      </h2>

      <fieldset className={styles.modes}>
        <legend className="visually-hidden">Mnemonic style</legend>
        {MNEMONIC_CHOICES.map((value) => (
          <label key={value} className={styles.option}>
            <input
              type="radio"
              name="mnemonic-choice"
              value={value}
              checked={choice === value}
              onChange={() => {
                onChoiceChange(value);
              }}
              className={styles.radio}
            />
            <span className={styles.optionText}>
              {MNEMONIC_CHOICE_LABELS[value]}
            </span>
          </label>
        ))}
      </fieldset>

      {isOn && (
        <div className={styles.body}>
          <div aria-live="polite">
            {status && <p className={styles.status}>{status}</p>}
          </div>
          {error && <MnemonicErrorAlert error={error} />}
          {mnemonic && (
            <TypedPhrase
              as="blockquote"
              className={styles.mnemonic}
              phrase={mnemonic}
            />
          )}
          {!isPending && (
            <div className={styles.actions}>
              <button
                type="button"
                className={ui.ghost}
                onClick={onNewMnemonic}
                disabled={isLoading}
              >
                <RefreshIcon />
                New mnemonic
              </button>
              {mnemonic && (
                <CopyButton
                  variant="ghost"
                  textToCopy={mnemonic}
                  ariaLabel="Copy mnemonic"
                />
              )}
            </div>
          )}
        </div>
      )}

      <p className={styles.note}>
        {isOn
          ? "To write this, your words are sent to an AI provider. Choose Off to keep them on this device."
          : "Pick a style to get a memorable sentence for your words. This sends your words to an AI provider."}
      </p>
    </section>
  );
};

export default MnemonicPanel;
