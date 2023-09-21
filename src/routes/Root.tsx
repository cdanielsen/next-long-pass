import { Flex } from "@chakra-ui/react";
import Header from "../components/Header";
import Content from "../components/Content";

const Root = () => {
  return (
    <Flex height="100%">
      <Header />
      <Content />
    </Flex>
  );
};

export default Root;
