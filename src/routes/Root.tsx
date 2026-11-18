import { Flex } from "@chakra-ui/react";
import Header from "../components/Header";
import PassphraseGenerator from "../components/PassphraseGenerator";
import { ErrorBoundary } from "react-error-boundary";
import ServerError from "../components/ServerError";

const Root = () => {
  return (
    <ErrorBoundary fallback={<ServerError />}>
      <Flex id="Content__Container" flexGrow={1}>
        <Header />
        <PassphraseGenerator />
      </Flex>
    </ErrorBoundary>
  );
};

export default Root;
