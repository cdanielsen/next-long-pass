import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Flex,
} from "@chakra-ui/react";

import { MnemonicError, NETWORK_ERROR_MESSAGE } from "../clients/mnemonic";

interface MnemonicErrorAlertProps {
  error: Error;
}

const MnemonicErrorAlert = ({ error }: MnemonicErrorAlertProps) => (
  <Alert status="error" margin="0.5rem 0">
    <AlertIcon />
    <Flex direction="column">
      <AlertTitle fontSize="0.75rem">Error generating mnemonic.</AlertTitle>
      <AlertDescription fontSize="0.75rem">
        {/* The server owns the full text, incl. whether retrying helps */}
        {error instanceof MnemonicError ? error.message : NETWORK_ERROR_MESSAGE}
      </AlertDescription>
    </Flex>
  </Alert>
);

export default MnemonicErrorAlert;
