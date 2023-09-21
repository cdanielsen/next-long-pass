import Typewriter from "typewriter-effect";

import "./Passphrase.css";
import { Box } from "@chakra-ui/react";

interface PassphraseProps {
  passphrase: string;
}

const Passphrase = ({ passphrase }: PassphraseProps) => {
  return (
    <Box
      as="section"
      margin="1rem 0"
      fontSize={[".75rem", "1.5rem"]}
      maxWidth="30rem"
    >
      <Typewriter
        options={{
          wrapperClassName: "Passphrase__text-container",
          autoStart: true,
          delay: 40,
          strings: passphrase,
          cursor: "",
        }}
      />
    </Box>
  );
};

export default Passphrase;
