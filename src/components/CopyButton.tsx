import { useEffect, useState } from "react";

import { CheckIcon, CopyIcon } from "./icons";
import ui from "../styles/ui.module.css";

const COPIED_MS = 2000;

interface CopyButtonProps {
  textToCopy: string;
  /** Accessible name, e.g. "Copy passphrase". Should contain "Copy". */
  ariaLabel: string;
  variant?: "outline" | "ghost";
  className?: string;
}

/** Copies text and shows "Copied" for a moment, announced to screen readers. */
const CopyButton = ({
  textToCopy,
  ariaLabel,
  variant = "outline",
  className,
}: CopyButtonProps) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timeout = setTimeout(() => {
      setCopied(false);
    }, COPIED_MS);
    return () => {
      clearTimeout(timeout);
    };
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <button
        type="button"
        className={[ui[variant], className].filter(Boolean).join(" ")}
        aria-label={ariaLabel}
        onClick={() => void copy()}
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
        {copied ? "Copied" : "Copy"}
      </button>
      <span role="status" className="visually-hidden">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </>
  );
};

export default CopyButton;
