import { Box } from "@chakra-ui/react";
import Typewriter from "typewriter-effect";

interface DescriptionProps {
  description: string;
}

const Passphrase = ({ description }: DescriptionProps) => {
  return (
    <Box as="section" margin="1rem 0" fontSize={[".75rem", "1.5rem"]}>
      <code>
        <Typewriter
          options={{
            strings: description,
            autoStart: true,
            delay: 35,
            cursor: "",
          }}
        />
      </code>
    </Box>
  );
};

export default Passphrase;
