import { MnemonicError, NETWORK_ERROR_MESSAGE } from "../clients/mnemonic";
import styles from "./MnemonicErrorAlert.module.css";

interface MnemonicErrorAlertProps {
  error: Error;
}

const MnemonicErrorAlert = ({ error }: MnemonicErrorAlertProps) => (
  <div role="alert" className={styles.alert}>
    <p className={styles.title}>Couldn&apos;t write a mnemonic.</p>
    {/* The server owns the full text, incl. whether retrying helps */}
    <p>
      {error instanceof MnemonicError ? error.message : NETWORK_ERROR_MESSAGE}
    </p>
  </div>
);

export default MnemonicErrorAlert;
