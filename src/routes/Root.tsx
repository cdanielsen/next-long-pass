import { Flex } from "@chakra-ui/react";
import Header from "../components/Header";
import Content from "../components/Content";
import { ErrorBoundary } from "react-error-boundary";
import Error from "../components/Error";

const Root = () => {
  return (
    <ErrorBoundary fallback={<Error />}>
      <Flex height="100%">
        <Header />
        <Content />
      </Flex>
    </ErrorBoundary>
  );
};

export default Root;
