import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Flex,
} from "@chakra-ui/react";

import { MnemonicError } from "../clients/mnemonic";

interface MnemonicErrorAlertProps {
  error: Error;
}

const MnemonicErrorAlert = ({ error }: MnemonicErrorAlertProps) => (
  <Alert status="error" margin="0.5rem 0">
    <AlertIcon />
    <Flex direction="column">
      <AlertTitle fontSize={["0.5rem", "0.75rem"]}>
        Error generating mnemonic.
      </AlertTitle>
      <AlertDescription fontSize={["0.5rem", "0.75rem"]}>
        {error instanceof MnemonicError
          ? `${error.message}. Please try again.`
          : "Please try again later"}
      </AlertDescription>
    </Flex>
  </Alert>
);

export default MnemonicErrorAlert;
