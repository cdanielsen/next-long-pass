import { Flex } from "@chakra-ui/react";
import Header from "./Header";
import Content from "./Content";

function App() {
  return (
    <Flex height="100vh">
      <Header />
      <Content />
    </Flex>
  );
}

export default App;
