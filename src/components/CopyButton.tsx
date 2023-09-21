import { IconButton } from "@chakra-ui/react";
import { PiCopySimpleDuotone as CopyIcon } from "react-icons/pi";

const copyTextToClipboard = (passphrase: string) => () => {
  void (async () => {
    try {
      await navigator.clipboard.writeText(passphrase);
    } catch (e) {
      console.error(e);
    }
  })();
};

interface CopyButtonProps {
  textToCopy: string;
  ariaLabel: string;
}

const CopyButton = ({ textToCopy, ariaLabel }: CopyButtonProps) => {
  return (
    <IconButton
      variant="ghost"
      colorScheme="blue"
      aria-label={ariaLabel}
      icon={<CopyIcon />}
      onClick={copyTextToClipboard(textToCopy)}
      marginLeft="1rem"
    />
  );
};

export default CopyButton;
