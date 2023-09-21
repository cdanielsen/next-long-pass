import { Route, Routes } from "react-router";
import { Flex } from "@chakra-ui/react";

import Nav from "./Nav";
import Root from "../routes/Root";
import About from "../routes/About";
import NotFound from "./NotFound";

function App() {
  return (
    <Flex direction="column" height="100vh">
      <Nav />
      <Routes>
        <Route path="/" element={<Root />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Flex>
  );
}

export default App;
