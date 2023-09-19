import Typewriter from "typewriter-effect";
import { PiCopySimpleDuotone as CopyIcon } from "react-icons/pi";
import { Flex, IconButton } from "@chakra-ui/react";

interface PassphraseProps {
  passphrase: string;
}

const copyTextToClipboard = (passphrase: string) => () => {
  void (async () => {
    try {
      await navigator.clipboard.writeText(passphrase);
    } catch (e) {
      console.error(e);
    }
  })();
};

const Passphrase = ({ passphrase }: PassphraseProps) => {
  return (
    <Flex
      id="Passphrase"
      direction="row"
      justify="space-between"
      align="center"
      width="100%"
      fontSize={"1.5rem"}
    >
      <Typewriter
        options={{
          autoStart: true,
          delay: 40,
          strings: passphrase,
          cursor: "",
        }}
      />
      <IconButton
        variant="ghost"
        colorScheme="blue"
        aria-label="Copy passphrase"
        icon={<CopyIcon />}
        onClick={copyTextToClipboard(passphrase)}
      />
    </Flex>
  );
};

export default Passphrase;
